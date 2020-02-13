<template>
  <el-dialog
    v-loading="ChildUploadloading"
    :title="bouncedTitle"
    :visible="true"
    class="ChildUpload"
    width="60%"
    :modal-append-to-body="true"
    :append-to-body="true"
    :before-close="Parameclear"
  >
    <!--  -->
    <el-form ref="modify" :model="modify" status-icon :rules="rules" label-width="150px" class="demo-ruleForm" @keyup.esc.native="Parameclear()">
      <el-form-item :label="this.$i18n.t('message.operationPicture')">
        <el-upload
          class="avatar-uploader"
          style="    width: 54%;float: left;margin-right: 10px;"
          action="/update"
          :show-file-list="false"
          :auto-upload="true"
          :on-success="UploadSuccess"
          :before-upload="BeforeAvatarUpload"
        >
          <img v-if="ImgData.imageUrl" :src="ImgData.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <div class="listImgText">
          <nav>
            <li>{{ this.$i18n.t('message.imagesSize') }}：375*163</li>
            <li>{{ this.$i18n.t('message.alreadyUpload') }}：<span style="color:#46a6ff">{{ ImgData.imageName }}</span></li>
          </nav>
        </div>
      </el-form-item>
      <!--  -->
      <el-form-item :label="this.$i18n.t('message.jumpAddress')" prop="jumpAddress" :rules="rules.jumpAddress">
        <el-input v-model="modify.jumpAddress" :placeholder=" this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.jumpAddress')" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="Parameclear">{{ this.$i18n.t('message.cancel') }}</el-button>
      <el-button type="primary" @click="productionSubmit">{{ this.$i18n.t('message.confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {

  },
  data() {
    var validatenames = (rule, value, callback) => {
      if (this.ImgData.imageUrl) {
        callback()
      } else {
        callback(new Error(this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.operationPicture') + this.$i18n.t('message.images')))
      }
    }
    return {
      bouncedTitle: '',
      ChildUploadloading: false,
      modifyId: '',
      modifyFlg: true,
      ImgData: {
        imageUrl: '',
        imageName: ''
      },
      type: null,
      modify: {
        jumpAddress: ''
      },
      rules: {
        ImgData: [{ required: true, trigger: 'blur', validator: validatenames }]
      }
    }
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  mounted() {

  },
  methods: {
    init(obj) {
      this.bouncedTitle = obj.bouncedTitle
      if (obj.data) {
        this.modifyId = obj.data.id
        this.ImgData = obj.data
        this.type = obj.data.type
        this.ImgData.imageUrl = this.ImgData.url
        this.ImgData.imageName = this.ImgData.url.substr(this.ImgData.url.lastIndexOf('/') + 1, this.ImgData.url.length)
        this.modify.jumpAddress = obj.data.jumpUrl
      } else {
        this.modifyFlg = false
      }
    },
    UploadSuccess(response, file, fileList) {

    },
    BeforeAvatarUpload(file) {
      // 去除多余
      delete file.uid
      if (!/image/g.test(file.type)) {
        this.$message.error(this.$i18n.t('message.Uploadformat'))
      } else if (file.size > 307200) {
        this.$message.error(this.$i18n.t('message.Uploadsize'))
      } else {
        this.ImgDocument(file, 'ImgData', file.size)
      }
      return false
    },
    // 图片信息获取
    ImgDocument(file, str, size, uid) {
      const reader = new FileReader()
      //
      window.FlgImgs = null
      window.FlgImgsFile = null
      window.$vue = this
      window.FlgImgs = str

      window.FlgImgsFile = {
        url: '',
        uid,
        type: file.name.substr(file.name.lastIndexOf('.') + 1, file.name.length),
        width: '',
        height: '',
        file: file,
        imageName: file.name,
        imageUrl: URL.createObjectURL(file)
      }
      reader.onload = function(evt) {
        const img = new Image()
        img.src = evt.target.result
        img.onload = function(e) {
          window.FlgImgsFile.width = e.target.width
          window.FlgImgsFile.height = e.target.height
          window.$vue[window.FlgImgs] = window.FlgImgsFile
        }
      }
      reader.readAsDataURL(file)
    },
    Parameclear() {
      this.modify.jumpAddress = ''
      this.ImgData = {
        imageUrl: '',
        imageName: ''
      }
      this.modifyId = ''
      // 后续返回参数
      this.$emit('ChildUploadClose', this.modifyFlg)
    },
    SubmitParams() {
      const vm = this
      this.ChildUploadloading = true
      if (!vm.ImgData.url) {
        this.$http.httpRequestImgConfig(this.ImgData.type).then(response => {
          if (response.response.status === 200 || response.status === 200) {
            // 修改参数
            vm.ImgData.url = response.data.data.addressUrl
            vm.ImgData.type = vm.type
            vm.$RequestHeader.AjaxPost(vm.$http.AliUrl(''), vm.formDataFor(response.data.data.body, vm.ImgData.file), { headers: { 'Content-Type': '' }}).then(response => {
              if (response.response.status === 200 || response.status === 200) {
                this.modifyParame()
              } else {
                vm.ChildUploadloading = false
                vm.$message.error(this.$i18n.t('message.requestFailed'))
              }
            })
          } else {
            vm.ChildUploadloading = false
            vm.$message.error(this.$i18n.t('message.requestFailed'))
          }
        })
      } else {
        this.modifyParame()
      }
    },
    productionSubmit() {
      this.$refs['modify'].validate((valid) => {
        if (valid) {
          // 后续接口
          if (this.ImgData.imageUrl === '') {
            this.$message.error(this.$i18n.t('message.commoditylist') + this.$i18n.t('message.imagesEmpty'))
          } else {
            this.SubmitParams()
          }
        }
      })
    },
    formDataFor(obj, file) {
      const formData = new FormData()
      for (const i in obj) {
        formData.append(i, obj[i])
      }
      formData.append('file', file)
      return formData
    },
    modifyParame() {
      const vm = this; let url
      const params = {
        'banners': [
          {
            'id': this.modifyId,
            'type': this.ImgData.type,
            'url': this.ImgData.url,
            'height': this.ImgData.height,
            'width': this.ImgData.width,
            'jumpUrl': this.modify.jumpAddress
          }
        ]
      }
      if (!this.modifyFlg) {
        delete params.banners[0].id
        url = '/service/media/v1/banner/add'
      } else {
        url = '/service/media/v1/banner/set'
      }
      this.ChildUploadloading = true
      this.$http({
        url: this.$http.adornUrl(url),
        method: 'post',
        data: this.$http.adornData(params)
      }).then(data => {
        if (data.status === 200) {
          vm.Parameclear()
          vm.$message({
            type: 'success',
            message: this.$i18n.t('message.successfulOperation')
          })
          vm.ChildUploadloading = false
        } else {
          vm.ChildUploadloading = false
          vm.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ChildUpload{
  .listImgText{
    width: 44%;
    float: left;
    nav{
      li{
        list-style: none;
        line-height: 68px;
        font-size: 16px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
<style>
    .ChildUpload .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .ChildUpload .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .ChildUpload .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 163px;
    line-height: 163px;
    text-align: center;
  }
  .ChildUpload .avatar {
    width: 100%;
    height: 163px;
    display: block;
  }
</style>
