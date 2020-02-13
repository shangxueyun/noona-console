<template>
  <div>
    <el-dialog
      v-loading="ImportCouponsloading"
      :title="bouncedTitle"
      :visible="true"
      class="ImportCoupons"
      width="40%"
      :modal-append-to-body="true"
      :append-to-body="true"
      :before-close="clearClose"
    >
      <!--  -->
      <el-form ref="addData" :model="addData" status-icon :rules="rules" label-width="150px" class="demo-ruleForm" @keyup.esc.native="clearClose()">
        <!--  -->
        <el-form-item :label="this.$i18n.t('message.FileType')">
          <el-select v-model="FileTypeFlg" style="width:100%" @change="goodsNameF">
            <el-option
              v-for="item in selectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="!FileTypeFlgbelG" :label="this.$i18n.t('message.selectFile')">
          <input type="file" accept=".xls,.xlsx" @change="handlePreview">
        </el-form-item>
        <el-form-item v-if="FileTypeFlgbelG" :label="this.$i18n.t('message.fixedCoupon')" prop="fixedCoupon" :rules="rules.fixedCoupon">
          <el-input v-model="addData.fixedCoupon" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.fixedCoupon')" />
        </el-form-item>
        <el-form-item v-if="FileTypeFlgbelG" :label="this.$i18n.t('message.addRepertory')" prop="repertory" :rules="rules.repertory">
          <el-input v-model="addData.repertory" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.repertory')" />
        </el-form-item>
        <el-form-item v-if="FileTypeFlgbelG" :label="this.$i18n.t('message.validity')" prop="validity" :rules="rules.validity">
          <el-date-picker
            v-model="addData.validity"
            type="datetime"
            :picker-options="expireTimeOption"
            :placeholder="this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.validity')"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearClose">{{ this.$i18n.t('message.cancel') }}</el-button>
        <el-button type="primary" @click="productionSubmit">{{ this.$i18n.t('message.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {

  },
  data() {
    var validateRepertory = (rule, value, callback) => {
      if (value !== '') {
        if (isNaN(Number(value))) {
          callback(new Error(this.$i18n.t('message.PleaseNumber')))
        } else {
          if (Number(value) > 0) {
            if (value.toString().indexOf('.') >= 0) {
              callback(new Error(this.$i18n.t('message.enteredIncorrectly')))
            } else {
              if (value.length > 9) {
                callback(new Error(this.$i18n.t('message.Exceedinglimit')))
              } else {
                callback()
              }
            }
          } else {
            callback(new Error(this.$i18n.t('message.RepertoryQuantity') + this.$i18n.t('message.inventoryQuantity')))
          }
        }
      } else { callback(new Error(this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.RepertoryQuantity'))) }
    }
    return {
      bouncedTitle: '',
      FileTypeFlg: 1,
      FileTypeFlgbelG: false,
      ImportCouponsloading: false,
      selectOptions: [
        {
          id: 1,
          name: this.$i18n.t('message.uploadCoupons')
        },
        {
          id: 2,
          name: this.$i18n.t('message.FixedCouponCp')
        }
      ],
      addData: {
        fixedCoupon: '',
        repertory: '',
        validity: ''
      },
      mediaId: '',
      rules: {
        Files: [{ required: true, message: this.$i18n.t('message.selectFile'), trigger: 'blur' }],
        fixedCoupon: [{ required: true, message: this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.fixedCoupon'), trigger: 'blur' }],
        repertory: [{ required: true, validator: validateRepertory, trigger: 'blur' }],
        validity: [{ required: true, message: this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.validity'), trigger: 'blur' }]
      },
      Files: [],
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() <= Date.now() - 86400
        }
      },
      flgNumber: 0,
      FilesData: {}
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
      if (obj.mediaId) {
        this.mediaId = obj.mediaId
      }
    },
    goodsNameF(val) {
      if (val === 1) { this.FileTypeFlgbelG = false } else { this.FileTypeFlgbelG = true }
    },
    handleRemove(file, fileList) {
      this.orderDetailData.pop()
    },
    handlePreview(file) {
      const fileDoc = file.target.files[0]
      const type = fileDoc.name.substr(fileDoc.name.lastIndexOf('.') + 1, fileDoc.name.length)
      this.flgNumber++
      // 去除多余
      if (this.flgNumber <= 1) {
        if (!/xls/g.test(type)) {
          this.$message.error(this.$i18n.t('message.UploadXLSX'))
        } else if (fileDoc.size > 52428800) {
          this.$message.error(this.$i18n.t('message.UploadXLSXsize'))
        } else {
          this.FilesData = {
            type,
            size: fileDoc.size,
            file: fileDoc
          }
        }
        return true
      } else {
        return false
      }
    },
    clearClose(row) {
      for (const i in this.addData) {
        this.addData[i] = ''
      }
      this.Files = []
      this.orderDetailData = []
      this.$emit('addProductVisible',row)
    },
    productionSubmit(flg) {
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          if (!this.FileTypeFlgbelG) {
            if (!this.FilesData.type) {
              this.$message.error(this.$i18n.t('message.uploadCoupons'))
            } else {
              this.SubmitParams()
            }
          } else {
            if (this.addData.validity === '') {
              this.$message.error(this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.validity'))
            } else {
              const params = {
                'mediaId': this.mediaId,
                'basic': {
                  'mediaType': 8,
                  'userId': 10001,
                  'content': this.addData.fixedCoupon,
                  'region': 'US',
                  'language': 'en',
                  'sourceType': 6,
                  'expireTime': parseInt(this.addData.validity.getTime() / 1000),
                  'groupId': this.mediaId,
                  'storage': this.addData.repertory
                }
              }
              this.modifyParame(params)
            }
          }
        }
      })
    },
    SubmitParams(params) {
      const vm = this
      this.ImportCouponsloading = true
      this.$http.httpRequestImgConfig(this.FilesData.type, this.FilesData.size).then(response => {
        if (response.response.status === 200 || response.status === 200) {
          // 修改参数
          this.FilesData.url = response.data.data.addressUrl
          vm.$RequestHeader.AjaxPost(vm.$http.AliUrl(''), vm.formDataFor(response.data.data.body, this.FilesData.file), { headers: { 'Content-Type': '' }}).then(response => {
            if (response.response.status === 200 || response.status === 200) {
              this.modifyParame()
            } else {
              vm.ImportCouponsloading = false
              vm.$message.error(this.$i18n.t('message.requestFailed'))
            }
          })
        } else {
          vm.ImportCouponsloading = false
          vm.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    modifyParame(params) {
      let obj = params; const vm = this; let url
      if (!this.FileTypeFlgbelG) {
        obj = {
          mediaId: this.mediaId,
          url: this.FilesData.url
        }
        url = '/service/media/v1/coupon/import'
      } else {
        url = '/service/media/v1/coupon/add'
      }
      this.$RequestHeader.AjaxPost(vm.$http.adornUrl(url), obj).then(response => {
        if (response.response.status === 200 || response.status === 200) {
          vm.clearClose(this.mediaId)
          vm.ImportCouponsloading = false
        } else {
          if (response.response.status === 500 || response.status === 500) {
            vm.ImportCouponsloading = false
            vm.$message.error(this.$i18n.t(response.response.data.message))
          } else {
            vm.ImportCouponsloading = false
            vm.$message.error(this.$i18n.t('message.requestFailed'))
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
