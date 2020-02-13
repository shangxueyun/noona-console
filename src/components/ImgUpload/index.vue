<template>
  <div>
    <el-upload
      :ref="config.refs"
      class="avatar-uploader"
      date-value="listImg"
      :style="config.styleCss"
      action="#"
      :show-file-list="config.showFileList"
      :auto-upload="config.autoUpload"
      :before-upload="BeforeAvatarUpload"
      >
        <img :style="`width:${config.imgSizeW}px;height:${config.imgSizeH}px`" v-if="listImg.imageUrl && fileType == 'image'" :src="listImg.imageUrl" class="avatar">
        <video controls="controls" :style="`width:${config.imgSizeW}px;height:${config.imgSizeH}px`" v-if="listImg.imageUrl && fileType == 'video'" :src="listImg.imageUrl" class="avatar"></video>
        <a controls="controls" target="_baock" :style="`width:${config.imgSizeW}px;height:${config.imgSizeH}px;border:1px solid #ccc`" v-if="listImg.imageUrl && fileType != 'video' && fileType != 'image'" class="avatar">Some files cannot be displayed</a>
        <i v-if="!listImg.imageUrl" :style="config.styleCssIocn" class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
    <div class="listImgText">
      <nav>
        <li v-if="!listImgTextDis && listImg.imageUrl && fileType != 'video' && fileType != 'image'"><a style="color:#1682e6" :href="listImg.imageUrl" target="_baock" >click view</a></li>
        <li v-if="listImgTextDis">{{ this.$i18n.t('message.imagesSize') }}：{{ config.imgSizeW + '*' + config.imgSizeH }}</li>
        <li v-if="listImgTextDis">{{ this.$i18n.t('message.alreadyUpload') }}：<span :style="config.spanStylecss">{{ listImg.imageName }}</span></li>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listImg: {
        imageUrl: '',
        imageName: '',
      }
    }
  },
  props: {
    config: {
      type: Object,
      default: {}
    },
    imgData: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: true
    },
    // 
    listImgTextDis:{
      type: Boolean,
      default: true
    },
    fileType: {
      type: String,
      required: false,
      default: 'image'
    },
  },
  computed: {

  },
  watch: {
    fileType(New, worn) {
      this.fileType = New
    }
  },
  created() {
    if (this.imgData) {
      let url
      if (this.disabled) {
        url = this.imgData.substr(0,this.imgData.lastIndexOf('/'))
      } else {
        url = this.imgData
      }
      this.listImg = {
        imageName: this.imgData.substr(0, this.imgData.lastIndexOf('.')),
        imageUrl: url
      }
      this.fileType = 'image'
    }
  },
  methods: {
    BeforeAvatarUpload(file) {
      let type
      let size
      let fileTypes = file.type
      if (fileTypes.indexOf('video') >=0 ) {
        this.fileType = 'video'
        type = new RegExp('video', "g")
      } else if (fileTypes.indexOf('image') >=0 ) {
        this.fileType = 'image'
        type = new RegExp('image', "g")
      } else {
        this.$message.error(this.$i18n.t('message.PleaseFileType'))
        return false
      }
      if (fileTypes.indexOf('image') >=0) {
        size = 307200
      } else {
        size = 419430400
      }
      if (!type.test(fileTypes)) {
        this.$message.error(this.$i18n.t('message.Uploadformat'))
      } else if (file.size > size) {
        if (fileTypes.indexOf('image') >=0) {
          this.$message.error(this.$i18n.t('message.Uploadsize'))
        } else {
          this.$message.error(this.$i18n.t('message.UploadXLSXsize'))
        }
      } else {
        let uid = file.uid
        // 去除多余
        delete file.uid
        if (fileTypes.indexOf('image') >=0) {
          this.ImgDocument(file, file.size, uid)
        } else {
          this.ImgDocument(file, file.size, uid, fileTypes)
        }
      }
      return false
    },
    // 图片信息获取
    ImgDocument(file, size, uid, type) {
      const reader = new FileReader()
      window.FlgImgsFile = null
      window.$vue = this

      window.FlgImgsFile = {
        url: '',
        size: size,
        uid,
        type: file.name.substr(file.name.lastIndexOf('.') + 1, file.name.length),
        width: '',
        height: '',
        file: file,
        imageName: file.name,
        imageUrl: URL.createObjectURL(file)
      }
      reader.onload = function(evt) {
        if (type) {
          // 返回图片信息
          window.$vue.listImg = window.FlgImgsFile
          window.$vue.$emit('imgUploadInfo', window.FlgImgsFile)
        } else {
          const img = new Image()
          img.src = evt.target.result
          img.onload = function(e) {
            window.FlgImgsFile.width = e.target.width
            window.FlgImgsFile.height = e.target.height
            if (window.$vue.config.imgSizeH == '') {
              // 返回图片信息
              window.$vue.listImg = window.FlgImgsFile
              window.$vue.$emit('imgUploadInfo', window.FlgImgsFile)
            } else {
              if (e.target.height > window.$vue.config.imgSizeH || e.target.width > window.$vue.config.imgSizeW) {
                // 尺寸错误
                window.$vue.$message.error(window.$vue.$i18n.t('message.pictureSize'))
                return false
              }
              // 返回图片信息
              window.$vue.listImg = window.FlgImgsFile
              window.$vue.$emit('imgUploadInfo', window.FlgImgsFile)
            }
          }          
        }
      }
      reader.readAsDataURL(file)
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.listImgText li span{
  display: block;
  float: right;
  color:#46a6ff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
<style>
  .v-modal{
    z-index: 2000 !important;
  }
</style>
