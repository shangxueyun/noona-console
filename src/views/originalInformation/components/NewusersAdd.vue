<template>
  <div>
  <el-dialog
    :title="Title"
    v-loading="dialogVisibleloading"
    class="dialog"
    :visible.sync="dialogVisible"
    width="45%"
    :before-close="handleClose">
      <div class="form_operation">
        <el-form ref="from" :model="from" label-width="80px" :rules="rules">
          <el-form-item :label="this.$i18n.t('message.nickName')" prop="NickName" :rules="rules.NickName">
            <el-input v-model="from.NickName" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.nickName')" />
          </el-form-item>
          <el-form-item :label="this.$i18n.t('message.Summary')" prop="Summary" :rules="rules.Summary">
            <el-input v-model="from.Summary" type="textarea" :maxlength="100" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.Summary')" />
          </el-form-item>
          <el-form-item :label="this.$i18n.t('message.sex')" prop="Sex" :rules="rules.Sex">
            <el-radio-group v-model="from.Sex">
              <el-radio :label="1">{{ this.$i18n.t('message.Man') }}</el-radio>
              <el-radio :label="2">{{ this.$i18n.t('message.Woman') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="this.$i18n.t('message.status')" prop="status" :rules="rules.status">
            <el-select v-model="from.status" :placeholder="this.$i18n.t('message.select') + this.$i18n.t('message.status')">
              <el-option
                v-for="item in statusOptions"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="this.$i18n.t('message.userImage')" prop="UserIcon" :rules="rules.UserIcon">
            <img-upload v-if="imgUploadFld" @imgUploadInfo="imgUploadInfo" :config="updateImgConfig" :imgData="from.UserIcon"></img-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ this.$i18n.t('message.cancel') }}</el-button>
        <el-button type="primary" @click="productionSubmit">{{ this.$i18n.t('message.confirm') }}</el-button>
      </span>
  </el-dialog>
  </div>
</template>

<script>
import ImgUpload from '@/components/ImgUpload'
export default {
  components: {
    ImgUpload
  },
  data() {
    return {
      dialogVisibleloading: false,
      imgUploadFld: true,
      dialogVisible: true,
      from: {
        NickName: '',
        Summary: '',
        Sex: 1,
        Source: 1,
        status: '',
        UserIcon: ''
      },
      statusOptions: [
        {
          id: 1,
          value: this.$i18n.t('message.normal')
        },
        {
          id: 2,
          value: this.$i18n.t('message.Delete')
        },
        {
          id: 3,
          value: this.$i18n.t('message.Audit')
        },
        {
          id: 4,
          value: this.$i18n.t('message.Notverified')
        },
        {
          id: 5,
          value: this.$i18n.t('message.disabled')
        },
      ],
      updateImgConfig:{
        refs: 'updateImg',
        styleCss: {
          width: '27%',
          float: 'left'
        },
        styleCssIocn: {
          width: '100px',
          height: '100px',
          lineHeight: '100px'
        },
        spanStylecss: {
          width: '50%',
        },
        showFileList: false,
        autoUpload: true,
        imgSizeW: '100',
        imgSizeH: '100'
      },
      // 图片信息临时存储
      imgUploadInfoObj: {},
      rules: {
        Summary: [{ required: true, message: this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.Summary'), trigger: 'blur' }],
        NickName: [{ required: true, message: this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.nickName'), trigger: 'blur' }],
        status: [{ required: true, message: this.$i18n.t('message.select') + this.$i18n.t('message.status'), trigger: 'change' }],
        Sex: [{ required: true, message: this.$i18n.t('message.select') + this.$i18n.t('message.sex'), trigger: 'change' }],
        UserIcon: [{ required: true, message: this.$i18n.t('message.select') + this.$i18n.t('message.userImage'), trigger: 'blur' }],
      }
    }
  },
  watch: {

  },
  props: {
    Title: {
      type: String,
      default: ''
    },
    UserInfo:{
      type: Object,
      default: {}
    }
  },
  created() {
    if (this.UserInfo.userID) {
      this.from = {
        UserID: this.UserInfo.userID,
        NickName: this.UserInfo.nickName,
        Summary: this.UserInfo.summary,
        Sex: this.UserInfo.sex,
        status: this.UserInfo.status,
        UserIcon: this.UserInfo.userIcon,
        Source: 1,
      }
      this.imgUploadInfoObj.url = this.UserInfo.userIcon
    }
  },
  mounted() {

  },
  methods: {
    handleSwitch (row) {

    },
    handleClose (row) {
      this.dialogVisible = false
      this.from = {
        NickName: '',
        Summary: '',
        Sex: 1,
        Source: 1,
        status: '',
        UserIcon: ''
      }
      if (typeof row == 'Object') {
        this.$emit('handleClose')
      } else {
        this.$emit('handleClose', true)
      }
    },
    addOrUpdateHandle (row) {

    },
    cancelingTime (row) {},
    imgUploadInfo (row) {
      // 图片信息返回
      this.imgUploadInfoObj = row
      this.from.UserIcon = row.imageUrl
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
  @import '../../../assets/css/switch.css';
  .dialog .switchStyle .el-switch__label {
    margin-left: 16px;
  }
  .dialog .switchStyle .el-switch__label--right{
    margin-left: 20px;
  }
</style>
