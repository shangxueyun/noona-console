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
        <el-form ref="from" :model="from" label-width="80px" :rules="rules">
          <el-form-item style="float:left;width:50%" :label="this.$i18n.t('message.userId')" prop="userId" :rules="rules.userId">
            <el-input v-model="from.userId" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.userId')" />
          </el-form-item>
          <el-form-item style="float:left;width:50%" :label="this.$i18n.t('message.userName')">
            <el-input class="userName" v-model="from.userName" :disabled="true" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.userName')" />
          </el-form-item>
          <el-form-item style="clear: both;" :label="this.$i18n.t('message.title2')" prop="title" :rules="rules.title">
            <el-input type="textarea" v-model="from.title" :maxlength="255" show-word-limit :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.title2')" />
          </el-form-item>
          <el-form-item style="float:left;width:33.2%" :label="this.$i18n.t('message.type')" prop="MediaType" :rules="rules.MediaType">
            <el-select v-model="from.MediaType" @change="MediaTypeChange(from.MediaType)" :placeholder="this.$i18n.t('message.select') + this.$i18n.t('message.type')">
              <el-option :label="this.$i18n.t('message.video')" :value="1"></el-option>
              <el-option :label="this.$i18n.t('message.news')" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="float:left;width:33.2%" :label="this.$i18n.t('message.LinkAddress')" prop="originDisplayUrl" :rules="rules.originDisplayUrl">
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
          <tinymce ref="TinymceInformation" v-model="RichTextContent" :toolbar="toolbar" @imgCallback="imgAnalysis" :fileType="fileType" :width="`100%`" :option="option" :height="300" />
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
      // 分类数据
      classificationOptions: [],
      expireTimeOption: {
		    disabledDate(date) {
				  return (date.getTime()+24*3600*1000) <= Date.now();
		    }
      },
      fileType: 'image',
      // 图片/视频
      IsImgflg: true,
      // 图片对象存储器
      imgUploadInfo: [],
      videoUploadInfo: [],
      // 富文本内容返回RichText
      RichTextContent:'',
      // 装载toolbar配置项
      toolbar: [
        'bold italic underline strikethrough alignleft aligncenter alignright  blockquote undo redo removeformat subscript superscript code hr link image charmap preview insertdatetime media emoticons forecolor backcolor'],
      // 装载option配置项
      option: ['advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools insertdatetime link lists media nonbreaking paste preview print save searchreplace spellchecker tabfocus template textcolor textpattern visualblocks visualchars wordcount'],
      rules: {
        title: [{ required: true, message: this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.title2'), trigger: 'blur' }],
        originDisplayUrl: [{ required: true, message: this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.LinkAddress'), trigger: 'blur' }],
        userId: [{ required: true, validator: this.userIdGet, trigger: 'blur' }],
        MediaType: [{ required: true, message: this.$i18n.t('message.select') + this.$i18n.t('message.type'), trigger: 'change' }],
        expireTime: [{ required: true, message: this.$i18n.t('message.select') + this.$i18n.t('message.expireTime'), trigger: 'change' }],
        originAddTime: [{ required: true, message: this.$i18n.t('message.select') + this.$i18n.t('message.Pubdate'), trigger: 'blur' }],
        CateId: [{ required: true, message: this.$i18n.t('message.select') + this.$i18n.t('message.classification'), trigger: 'blur' }],
      }
    }
  },
  watch: {

  },
  props: {
    Title: {
      type: String,
      default: ''
    }
  },
  watch: {
    RichTextContent(New, worn) {
      debugger
      if (worn) {
        // 检测图片
        if (/img/g.test(New)) {
          let NewarrImg = New.match(/<img.*?\/>/g)
          let wornarrImg = worn.match(/<img.*?\/>/g)
          if (!NewarrImg || NewarrImg.length < wornarrImg.length) {
            if (!NewarrImg) {
              this.$refs.TinymceInformation.imgNumSize(0)
              this.imgUploadInfo = this.imgUploadInfo.splice(this.imgUploadInfo.length, this.imgUploadInfo.length -1)
            } else {
              this.$refs.TinymceInformation.imgNumSize(NewarrImg.length)
              this.imgUploadInfo = this.imgUploadInfo.splice(wornarrImg.length - NewarrImg.length, this.imgUploadInfo.length -1)
            }
          }
        }
      } else {
        if (!/img/g.test(New)) {
          // 检测视频
          let NewarrVideo = New.match(/<video.*?\/>/g)
          let wornarrVideo = worn.match(/<video.*?\/>/g)
        }
      }
    }
  },
  created() {
    this.getDataList()
  },
  mounted() {

  },
  methods: {
    // 获取分类列表
    getDataList() {
      this.dialogVisibleloading = true
      this.$http({
        url: this.$http.LogUrl('/v1/media/list_category'),
        method: 'post',
        data: this.$http.adornParams({
          'Page': 1,
          'PageSize': 300,
        })
      }).then(data => {
        this.dialogVisibleloading = false
        // codeVerify [data] // 返回整体对象 [function] // 回调函数 [Params] // 回调函数携带参数
        let Obj = this.Utils.codeVerify(data, (Params) => {
          let categoryObj = Params.data.items
          this.classificationOptions = []
          this.classificationOptions = categoryObj
        }, data)
        if (Obj.msg) {
          if (Obj.msg !== 'Failed') {
            this.$message.error(Obj.msg)
          } else {
            this.$message.error(this.$i18n.t('message.requestFailed'))
          }
        }
      })
    },
    userIdGet (rule, value, callback) {
      if (value != '') {
        this.$http({
          url: this.$http.LogUrl('/v1/users/list'),
          method: 'post',
          data: this.$http.adornParams({
            'AppID': 4,
            'Pn': 1,
            'UserID': value,
            'Ps': 2,
          })
        }).then(data => {
          // codeVerify [data] // 返回整体对象 [function] // 回调函数 [Params] // 回调函数携带参数
          let Obj = this.Utils.codeVerify(data, (Params) => {
            let userObj = Params.data.items
            for (let i in userObj) {
              userObj = userObj[i].basic
            }
            this.from.userName = userObj.nickName
          }, data)
          if (Obj.msg) {
            if (Obj.msg !== 'Failed') {
              this.$message.error(Obj.msg)
            } else {
              this.$message.error(this.$i18n.t('message.requestFailed'))
            }
          }
        })
      } else { 
        callback(new Error(this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.userId')))
      }
    },
    // 清空内容
    setContent() {
      this.$refs.Tinymce.setContent('')
    },
    MediaTypeChange (value) {
      if (value == 5) {
        this.IsImgflg = true
        this.fileType = 'image'
      } else {
        this.IsImgflg = false
        this.fileType = 'video'
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
      debugger
      if (row.type == 'mp4') {
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
    imgUploadFunc () {
      let vm = this
      if (!this.imgUploadInfoObj.url) {
        this.dialogVisibleloading = true
        this.$http.httpRequestImgConfig(this.imgUploadInfoObj.type).then(response => {
          if (response.response.status === 200 || response.status === 200) {
            // 修改参数
            this.imgUploadInfoObj.url = response.data.data.addressUrl
            this.imgUploadInfoObj.type = 0
            this.$RequestHeader.AjaxPost(this.$http.AliUrl(''), this.formDataFor(response.data.data.body, this.imgUploadInfoObj.file), { headers: { 'Content-Type': '' }}).then(response => {
              if (response.response.status === 200 || response.status === 200) {
                vm.ParameSubmit()
              } else {
                vm.dialogVisibleloading = false
                vm.$message.error(this.$i18n.t('message.requestFailed'))
              }
            })
          } else {
            vm.dialogVisibleloading = false
            vm.$message.error(this.$i18n.t('message.requestFailed'))
          }
        })
      } else {
        this.ParameSubmit()
      }
    },
    productionSubmit(flg) {
      this.$refs['from'].validate((valid) => {
        if (valid) {
          this.imgUploadFunc()
        }
      })
    },
    ParameSubmit () {
      // 接口提交
      let Params = {
        NickName: this.from.NickName,
        Summary: this.from.Summary,
        UserIcon: this.imgUploadInfoObj.url,
        Sex: this.from.Sex,
        Status: this.from.status,
        Source: 1 // 默认等于1
      }
      let url
      if (this.from.UserID) {
        Params.UserID = this.from.UserID
        url = '/v1/users/set'
      } else {
        url = '/v1/users/add'
      }
      this.$http({
        url: this.$http.LogUrl(url),
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
