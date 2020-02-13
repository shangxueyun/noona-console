<template>
  <el-dialog
    :title="Title"
    v-loading="dialogVisibleloading"
    class="dialog"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="handleClose">
      <div class="form_operation">
        <el-form ref="InformationAdd" :model="from" label-width="80px" :rules="rules">
          <el-form-item :disabled="true" style="float:left;width:50%" :label="this.$i18n.t('message.userId')" prop="userId" :rules="rules.userId">
            <el-input v-model="from.userId" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.userId')" />
          </el-form-item>
          <el-form-item style="float:left;width:50%" :label="this.$i18n.t('message.userName')">
            <el-input class="userName" v-model="from.userName" :disabled="true" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.userName')" />
          </el-form-item>
          <el-form-item style="clear: both;" :label="this.$i18n.t('message.title2')" prop="title" :rules="rules.title">
            <el-input type="textarea" v-model="from.title" :maxlength="255" show-word-limit :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.title2')" />
          </el-form-item>
          <el-form-item style="float:left;width:33.2%" :disabled="true" :label="this.$i18n.t('message.type')" prop="MediaType" :rules="rules.MediaType">
            <el-select v-model="from.MediaType" @change="MediaTypeChange(from.MediaType)" :placeholder="this.$i18n.t('message.select') + this.$i18n.t('message.type')">
              <el-option :label="this.$i18n.t('message.video')" :value="1"></el-option>
              <el-option :label="this.$i18n.t('message.news')" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="float:left;width:33.2%" :label="this.$i18n.t('message.LinkAddress')">
            <el-input v-model="from.originDisplayUrl" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.LinkAddress')" />
          </el-form-item>
          <el-form-item style="float:left;width:33.2%" :label="this.$i18n.t('message.classification')" prop="CateId" :rules="rules.CateId">
            <el-select v-model="from.CateId" filterable :placeholder="this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.classification')">
              <el-option
                v-for="item in classificationOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="float:left;width:33.2%" :label="this.$i18n.t('message.expireTime')" prop="expireTime" :rules="rules.expireTime">
            <el-date-picker
              v-model="from.expireTime"
              type="datetime"
              :picker-options="expireTimeOption"
              :placeholder="this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.expireTime')">
            </el-date-picker>
          </el-form-item>
          <el-form-item style="float:left;width:33.2%" :label="this.$i18n.t('message.Pubdate')" prop="originAddTime" :rules="rules.originAddTime">
            <el-date-picker
              v-model="from.originAddTime"
              type="datetime"
              :picker-options="expireTimeOption"
              :placeholder="this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.Pubdate')">
            </el-date-picker>
          </el-form-item>
          <span style="clear: both;display: block;margin-bottom: 14px;font-size: 18px;">{{ this.$i18n.t('message.informationContent') }}</span>
          <!-- 资讯富文本插件引入 -->
          <div class="TinymceInformation" v-if="IsImgflg">
            <tinymce ref="TinymceInformationimg" v-model="RichTextContent" :toolbar="toolbar" @imgCallback="imgAnalysis" :fileType="fileType" :width="`100%`" :option="option" :height="300" />
          </div>
          <div v-else>
            <tinymce ref="TinymceInformationvideo" v-model="RichTextContent" :toolbar="toolbar" @imgCallback="imgAnalysis" :fileType="fileType" :width="`100%`" :option="option" :height="300" />
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ this.$i18n.t('message.cancel') }}</el-button>
        <el-button type="primary" @click="productionSubmit">{{ this.$i18n.t('message.confirm') }}</el-button>
      </span>
  </el-dialog>
</template>

<script>
import Tinymce from '@/components/Tinymce'
export default {
  name: 'TinymceDemo',
  components: { Tinymce },
  props: {
    Title: {
      type: String,
      default: ''
    },
    fileType: {
      type: String,
      default: 'image'
    },
    IEditObject: {
      type: Object,
      default: {}
    },
    Title: {
      type: String,
      default: ''
    },
    classificationOptions:{
      type: Array,
      default: []
    }
  },
  data() {
    return {
      dialogVisibleloading: false,
      imgUploadFld: true,
      dialogVisible: true,
      from: {
        userId: '',
        userName: '',
        title: '',
        MediaType: 5,
        originDisplayUrl: '',
        CateId: '',
        expireTime: '',
        originAddTime: ''
      },
      expireTimeOption: {
		    disabledDate(date) {
				  return (date.getTime()+24*3600*1000) <= Date.now();
		    }
      },
      // 图片/视频
      IsImgflg: true,
      // 图片对象存储器
      imgUploadInfo: [],
      videoUploadInfo: [],
      // 富文本内容返回RichText
      RichTextContent:'',
      // 装载toolbar配置项
      toolbar: [
        'bold italic underline strikethrough alignleft aligncenter alignright  blockquote undo redo removeformat subscript superscript code hr link image charmap preview insertdatetime emoticons forecolor backcolor'],
      // 装载option配置项
      option: ['advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools insertdatetime link lists nonbreaking paste preview print save searchreplace spellchecker tabfocus template textcolor textpattern visualblocks visualchars wordcount'],
      rules: {
        title: [{ required: true, message: this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.title2'), trigger: 'blur' }],
        userId: [{ required: true, validator: this.userIdGet, trigger: 'blur' }],
        MediaType: [{ required: true, message: this.$i18n.t('message.select') + this.$i18n.t('message.type'), trigger: 'change' }],
        expireTime: [{ required: true, message: this.$i18n.t('message.select') + this.$i18n.t('message.expireTime'), trigger: 'change' }],
        originAddTime: [{ required: true, message: this.$i18n.t('message.select') + this.$i18n.t('message.Pubdate'), trigger: 'blur' }],
        CateId: [{ required: true, message: this.$i18n.t('message.select') + this.$i18n.t('message.classification'), trigger: 'blur' }],
      }
    }
  },
  watch: {
    RichTextContent(New, worn) {
      debugger
      if (worn) {
        if (New == worn) {
          return false
        }
        if (New == '') {
          this.videoUploadInfo = []
          this.imgUploadInfo = []
          if (this.fileType == 'video') {
            this.$refs.TinymceInformationvideo.imgNumSize(0)     
          } else {
            this.$refs.TinymceInformationimg.imgNumSize(0)
          }
        }
        if (/video/g.test(New)) {
          // 检测视频
          let NewarrVideo = New.match(/<video.*?\><\/video>/g)
          let wornarrVideo = worn.match(/<video.*?\/><\/video>/g)

          if (NewarrVideo) {
            if (NewarrVideo.length > 1) {
              this.videoUploadInfo = this.videoUploadInfo.splice(1, this.videoUploadInfo.length - 1)
              this.$refs.TinymceInformationvideo.imgNumSize(this.videoUploadInfo.length - 1)
              this.$message.error(this.$i18n.t('message.completeadded'))
              this.setContent(worn)
            }
          }
          let str = New.substr(New.indexOf('>') + 1, New.lastIndexOf('</p>') - 3)
          // 检测文字
          let regVideo = str.replace(/<video.*?\><\/video>/g, '')
          if (New == '') {
            this.videoUploadInfo = []
            this.$refs.TinymceInformationvideo.imgNumSize(0)
          } else {
            if (regVideo.indexOf('img') == -1) {
              if (worn.indexOf('img') != -1) {
                // this.videoUploadInfo = this.videoUploadInfo.splice(1, this.videoUploadInfo.length - 1)
                this.setContent(New)
              } else {
                this.$message.error(this.$i18n.t('message.Distractor'))
                let pHtml = `${New.substr(0, 3)}${New.substr(New.indexOf('<video'), New.indexOf('</video>') + 4)}${New.substr(New.lastIndexOf('</p>'), New.length)}`
                this.setContent(pHtml)
              }
              this.$refs.TinymceInformationvideo.imgNumSize(1)
            } else {
              let imgs = regVideo.replace(/<img.*?\/>/,'')
              if (imgs != '') {
                this.videoUploadInfo = this.videoUploadInfo.splice(1, this.videoUploadInfo.length - 1)
                this.$refs.TinymceInformationvideo.imgNumSize(this.videoUploadInfo.length - 1)
                this.$message.error(this.$i18n.t('message.completeadded'))
                this.setContent(worn)
              }
            }
          }
        } else {
          // 检测图片
          if (/img/g.test(New)) {
            let NewarrImg = New.match(/<img.*?\/>/g)
            let wornarrImg = worn.match(/<img.*?\/>/g)
            let Isimg = New.replace(/<([a-zA-Z1-6]+)(\s*[^>]*)?>/g, "<$1>")
            if (wornarrImg) {
              if (!NewarrImg || NewarrImg.length < wornarrImg.length) {
                if (!NewarrImg) {
                  this.$refs.TinymceInformationimg.imgNumSize(0)
                  this.imgUploadInfo = this.imgUploadInfo.splice(this.imgUploadInfo.length, this.imgUploadInfo.length -1)
                } else {
                  this.$refs.TinymceInformationimg.imgNumSize(NewarrImg.length - 1)
                  this.imgUploadInfo = this.imgUploadInfo.splice(wornarrImg.length - NewarrImg.length, this.imgUploadInfo.length -1)
                }
              }
            }
            // if (Isimg.substr(Isimg.indexOf('<img') - 3, Isimg.indexOf('<img')) == '<p>' && Isimg.substr(Isimg.length - 4, Isimg.length) == '</p>') {} else {
            //   if (wornarrImg) {
            //     if (!NewarrImg) {
            //       this.$refs.TinymceInformationimg.imgNumSize(0)
            //       this.imgUploadInfo = this.imgUploadInfo.splice(this.imgUploadInfo.length, this.imgUploadInfo.length -1)
            //     } else {
            //       this.$refs.TinymceInformationimg.imgNumSize(NewarrImg.length - 1)
            //       this.imgUploadInfo = this.imgUploadInfo.splice(wornarrImg.length - NewarrImg.length, this.imgUploadInfo.length -1)
            //     }
            //   } else {
            //     this.$refs.TinymceInformationimg.imgNumSize(0)
            //     this.imgUploadInfo = this.imgUploadInfo.splice(1, this.imgUploadInfo.length -1)
            //   }
            //   this.$message.error(this.$i18n.t('message.newlinedimage'))
            //   this.setContent(worn)
            // }
          }
        }
      } else {
        let cententStr = New.substr(New.indexOf('>') + 1, New.lastIndexOf('</p>') - 3)
        if (this.fileType == 'video') {
          if (!/video/g.test(cententStr)) {
            if (/img/g.test(New)) {
              this.$message.error(this.$i18n.t('message.videoenvelope'))
              // 清空内容
              this.setContent()
            } else {
              this.$message.error(this.$i18n.t('message.Videotypes'))
              // 清空内容
              this.setContent()
            }
          }
        }
      }
    }
  },
  created() {
    debugger
    if (this.fileType == 'image') {
      this.toolbar = ['bold italic underline strikethrough alignleft aligncenter alignright  blockquote undo redo removeformat subscript superscript code hr link image charmap preview insertdatetime emoticons forecolor backcolor']
      this.option = ['advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools insertdatetime link lists nonbreaking paste preview print save searchreplace spellchecker tabfocus template textcolor textpattern visualblocks visualchars wordcount']
      this.IsImgflg = true
    } else {
      this.toolbar = ['image preview media']
      this.option = ['image preview media']
      this.IsImgflg = false
    }
  },
  mounted() {

  },
  methods: {
    // content内容解析
    RichTextContentValueAnalysis (obj) {
      // from
      debugger
      this.from = {
        userId: obj.userId,
        userName: obj.userName,
        title: obj.title,
        MediaType: obj.mediaType,
        originDisplayUrl: obj.originDisplayUrl,
        CateId: obj.cateId,
        expireTime: obj.expireTime ? obj.expireTime : '',
        originAddTime: obj.originAddTime
      }
      obj.cover.forEach((v, i) => {
        this.imgUploadInfo.push({
          height: v.coverObj['1'].height,
          mediaId: v.coverObj['1'].mediaId,
          size: v.coverObj['1'].size,
          sortId: v.coverObj['1'].sortId,
          url: v.coverObj['1'].url,
          width: v.coverObj['1'].width
        })
      })
      // content
      if (obj.mediaType == 5) {
        // 图文 <!--IMG_1--> <img src="" class="IMG_1">
      centent = centent.replace(/<!--IMG_*?-->/g, (v) => {
        let str = Number(v.substr(v.indexOf('_') + 1,v.indexOf('>') - 10))
      })
        this.imgUploadInfo
      } else {
        // 视频 <!--VIDEO_1--> <video src="" class="VIDEO_1"></video>
      }
    },
    // 清空内容
    setContent(value) {
      if (!value) {
        value = ''
      }
      if (this.fileType == 'image') {
        this.$nextTick(function () {
          // DOM 更新了
          this.$refs.TinymceInformationimg.setContent(value)
        })
      } else {
        this.$nextTick(function () {
          // DOM 更新了
          this.$refs.TinymceInformationvideo.setContent(value)
        })
      }
    },
    handleClose (row) {
      this.dialogVisible = false
      this.from = {
        userId: '',
        userName: '',
        title: '',
        MediaType: '',
        originDisplayUrl: '',
        CateId: '',
        expireTime: '',
        originAddTime: ''
      }
      if (typeof row == 'Object') {
        this.$emit('handleClose')
      } else {
        this.$emit('handleClose', true)
      }
    },
    // 失去焦点点击确认按钮触发
    tinymceFocus () {

    },
    imgAnalysis (row) {
      if (!this.IsImgflg) {
        // 视频信息返回
        this.videoUploadInfo.push(row)
      } else {
        // 图片信息返回
        this.imgUploadInfo.push(row)
      }
    },
    formDataFor(obj, file) {
      const formData = new FormData()
      for (const i in obj) {
        formData.append(i, obj[i])
      }
      formData.append('file', file)
      return formData
    },
    // 图片参数解析
    imgParameFunc () {
      debugger
      let centent = JSON.parse(JSON.stringify(this.RichTextContent))
      if (centent == '') {
        this.$message.error(this.$i18n.t('message.contentempty'))
        return false
      }
      centent = centent.replace(/<img.*?\/>/g, (v) => {
        return `<!--IMG_${Number(v.substr(v.indexOf('IMG_') + 4,v.indexOf('src') - 18))}-->`
      })
      centent.replace(/<([a-zA-Z1-6]+)(\s*[^>]*)?>/g, "<$1>")
      let RichTextContentArr = centent.split('\n')
      RichTextContentArr.forEach((v, i) => {
        if (v.indexOf('IMG') > -1) {
          RichTextContentArr[i] = v.substr(v.indexOf('<!'), v.length - 7)
        }
      })
      centent = RichTextContentArr.toString().replace(/,/g,'')
      this.ParameSubmit(centent,this.imgUploadInfo,this.from)
    },
    // 视频参数解析
    videoParameFunc () {
      debugger
      let centent = JSON.parse(JSON.stringify(this.RichTextContent))
      if (centent == '') {
        this.$message.error(this.$i18n.t('message.contentempty'))
        return false
      }
      if (centent.indexOf('img') == -1 || centent.indexOf('video') == -1) {
        this.$message.error(this.$i18n.t('message.Contentincomplete'))
        return false
      }
      this.ParameSubmit(centent,this.videoUploadInfo,this.from)
    },
    productionSubmit() {
      this.$refs['InformationAdd'].validate((valid) => {
        if (valid) {
          if (this.fileType == 'image') {
            this.imgParameFunc()
          } else {
            if (this.from.originDisplayUrl == '') {
              this.$message.error(this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.LinkAddress'))
              return false
            }
            this.videoParameFunc()
          }
        }
      })
    },
    ParameSubmit (Content,UploadInfo,from) {
      // 接口提交
      debugger
      let Params = {
        basic:{
          CateId: from.CateId,
          MediaType: from.MediaType,
          Title: from.title,
          UserId: from.userId,
          appWhiteList: '',
          content: Content,
          expireTime: from.expireTime.getTime() / 1000,
          originAddTime: from.originAddTime.getTime() / 1000,
          sourceType: from.originAddTime ? from.originAddTime : 201, // 后台说写死
          originAddTime: from.originAddTime.getTime() / 1000,
          summary: '',
        }
      }
      let arr = []
      if (from.MediaType == 1) {
        let video = []
        UploadInfo.forEach((v, i) => {
          if (v.file.type.indexOf('video') == -1) {
            arr.push({
              Height: v.height,
              Size: v.size,
              SortId: 1,
              Type: 1,
              Url: v.url,
              Width: v.width,
            })
          } else {
            video.push({
              Url: v.url,
            })
          }
        })
        Params.cover = arr
        Params.play = video
      } else {
        UploadInfo.forEach((v, i) => {
          arr.push({
            Height: v.height,
            Size: v.size,
            SortId: v.sortId,
            Type: 1,
            Url: v.url,
            Width: v.width,
          })
        })
        Params.cover = arr
      }
      this.dialogVisibleloading = true
      this.$http({
        url: this.$http.LogUrl('/v1/media/add'),
        method: 'post',
        data: this.$http.adornParams(Params)
      }).then(data => {
        this.dialogVisibleloading = false
        // codeVerify [data] // 返回整体对象 [function] // 回调函数 [Params] // 回调函数携带参数
        let Obj = this.Utils.codeVerify(data, this.handleClose, true)
        if (Obj.msg) {
          if (Obj.msg !== 'Failed') {
            this.$message.error(Obj.msg)
          } else {
            this.$message.error(this.$i18n.t('message.requestFailed'))
          }
        } else {
          this.$message({type: 'success',message: this.$i18n.t('message.successfulOperation')})
        }
      })
    }
  }
}
</script>

<style>
  .dialog .switchStyle .el-switch__label {
    margin-left: 16px;
  }
  .dialog .switchStyle .el-switch__label--right{
    margin-left: 20px;
  }
  .userName input{
    background: #fff !important;
    color: #333 !important;
  }
</style>
