<template>
  <div>
  <el-dialog
    :title="bouncedTitle"
    v-loading="dialogVisibleloading"
    class="dialog"
    :visible.sync="dialogVisible"
    width="38%"
    :before-close="handleClose">
      <div class="form_operation">
        <el-form ref="from" :model="from" label-width="80px" :rules="rules">
          <el-form-item :label="this.$i18n.t('message.Account')" prop="Account" :rules="rules.Account">
            <el-input v-model="from.Account" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.Account')" />
          </el-form-item>
          <el-form-item :label="this.$i18n.t('message.nickName')" prop="nickName" :rules="rules.nickName">
            <el-input v-model="from.nickName" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.nickName')" />
          </el-form-item>
          <el-form-item :label="this.$i18n.t('message.password')">
            <el-input type="password" v-model="from.password" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.password')" />
          </el-form-item>
          <el-form-item :label="this.$i18n.t('message.permission')" prop="permission" :rules="rules.permission">
            <el-select v-model="from.permission" :placeholder="this.$i18n.t('message.select') + this.$i18n.t('message.permission')">
              <el-option
                v-for="item in permissionOptions"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="this.$i18n.t('message.status')" prop="status" :rules="rules.status">
            <el-switch
              v-model="from.status"
              class="switchStyle"
              active-color="#dcdfe6"
              inactive-color="#409eff"
              :active-value="0"
              :inactive-value="1"
              active-text="已禁用"
              inactive-text="已启用"
            />
          </el-form-item>
          <el-form-item :label="this.$i18n.t('message.uploadPhoto')">
            <img-upload :disabled="false" v-if="imgUploadFld" @imgUploadInfo="imgUploadInfo" :config="updateImgConfig" :imgData="from.cover"></img-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
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
      bouncedTitle: '',
      dialogVisibleloading: false,
      imgUploadFld: false,
      dialogVisible: true,
      from: {
        Account: '',
        nickName: '',
        permission: '',
        status: '',
        cover: '',
        password: ''
      },
      permissionOptions: [
        {
          id: 1,
          value: '超级管理员'
        }
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
        Account: [{ required: true, message: this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.Account'), trigger: 'blur' }],
        nickName: [{ required: true, message: this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.nickName'), trigger: 'blur' }],
        permission: [{ required: true, message: this.$i18n.t('message.select') + this.$i18n.t('message.permission'), trigger: 'change' }],
      }
    }
  },
  watch: {

  },
  created() {

  },
  mounted() {

  },
  methods: {
    initData (data) {
      if (data.id) {
        this.bouncedTitle = this.$i18n.t('message.modify') + this.$i18n.t('message.administrator')
        if (!data.status) {
          data.status = 0
        }
        this.from = {
          id: data.id,
          Account: data.userName,
          nickName: data.nickName,
          permission: Number(data.role),
          status: data.status,
          cover: data.cover
        }
        this.imgUploadInfoObj.url = data.cover
      } else {
        this.bouncedTitle = this.$i18n.t('message.Add') + this.$i18n.t('message.administrator')
      }
      this.imgUploadFld = true
    },
    // 获取角色列表后续
    getDataList() {
      this.AdministratorListloading = true
      this.$http({
        url: this.$http.LogUrl('/v1/admin/list'),
        method: 'post',
        data: this.$http.adornParams({
          'Page': 1,
          'PageSize': 999
        })
      }).then(data => {
        this.AdministratorListloading = false
        if (data.status === 200) {
          data = data.data
          let list = data.items.list
          if (list) {
            this.AdministratorListData = []
            this.AdministratorListData = list
          }
        } else {
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    handleSwitch (row) {

    },
    handleClose (row) {
      this.dialogVisible = false
      this.from = {
        Account: '',
        nickName: '',
        permission: '',
        status: '',
        cover: '',
        password: ''
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
      this.from.cover = row.imageUrl
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
          if (!this.from.id) {
            if (this.from.password == '' || !this.from.password) {
              this.$message.error(this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.password'))
              return false
            }
          }
          this.imgUploadFunc()
        }
      })
    },
    ParameSubmit () {
      // 接口提交
      let Params = {
        UserName: this.from.Account,
        NickName: this.from.nickName,
        Cover: this.imgUploadInfoObj.url,
        Role: this.from.permission.toString(),
        Status: this.from.status,
        Password: this.from.password
      }
      let url
      if (this.from.id) {
        Params.id = this.from.id
        url = '/v1/admin/set'
      } else {
        Params.Password = this.from.password
        url = '/v1/admin/add'
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
