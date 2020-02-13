<template>
  <div>
  <el-dialog
    :title="bouncedTitle"
    v-loading="dialogVisibleloading"
    class="dialog"
    :visible.sync="dialogVisible"
    width="55%"
    :before-close="handleClose">
      <div class="form_operation">
        <el-form ref="from" :model="from" label-width="80px" :rules="rules">
          <el-form-item :label="this.$i18n.t('message.mediaId')" prop="mediaId" :rules="rules.mediaId">
            <el-input style="width: 80%;" v-model="from.mediaId" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.mediaId')" />
            <el-button @click="getDataList">{{ $t('message.search') }}</el-button>
          </el-form-item>

          <el-form-item class="previewVisible" style="display: flex;" v-if="previewVisible" :label="this.$i18n.t('message.title2')">
            <div style="width: 87%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;float: left;">{{ mediaInfo.title }}</div>
            <el-button style="float:left"> <a target="_blank" :href="`${HrefUrl}${mediaInfo.mediaId}`" style="text-decoration: none;">{{ $t('message.preview') }}</a></el-button>
          </el-form-item>

          <el-form-item :label="this.$i18n.t('message.pushTitle')" prop="title" :rules="rules.title">
            <el-input v-model="from.title" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.pushTitle')" />
          </el-form-item>
          <el-form-item :label="this.$i18n.t('message.pushContent')" prop="centent" :rules="rules.centent">
            <el-input type="textarea" show-word-limit :maxlength='150' v-model="from.centent" :placeholder="this.$i18n.t('message.pushContentTips')" ></el-input>
          </el-form-item>
          <el-form-item :label="this.$i18n.t('message.pushUsers')" prop="user" :rules="rules.user">
            <el-select v-model="from.user" :placeholder="this.$i18n.t('message.select') + this.$i18n.t('message.pushUsers')">
              <el-option
                v-for="item in userOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="this.$i18n.t('message.startTime')" prop="time" :rules="rules.time">
            <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="from.time" type="datetime" :picker-options="expireTimeOption"></el-date-picker>
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
export default {
  components: {
  },
  data() {
    return {
      bouncedTitle: '',
      dialogVisibleloading: false,
      HrefUrl: '',
      imgUploadFld: false,
      dialogVisible: true,
      previewVisible: false,
      from: {
        mediaId: '',
        title: '',
        centent: '',
        user: '',
        time: ''
      },
      mediaInfo: {
        title: ''
      },
      // 全局test
      IsTest: true,
      // plat 0 all 1 Android 2 Ios
      userOptions: [
        {
          name: 'all',
          value: 0
        },
        {
          name: 'Android',
          value: 1
        },
        {
          name: 'Ios',
          value: 2
        }
      ],
      expireTimeOption: {
		    disabledDate(date) {
				  return (date.getTime()+24*3600*1000) <= Date.now();
		    }
		  },
      mediaInfoOptions: [],
      mediaInfo: {},
      rules: {
        mediaId: [{ required: true, message: this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.mediaId'), trigger: 'blur' }],
        title: [{ required: true, message: this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.pushTitle'), trigger: 'blur' }],
        centent: [{ required: true, message: this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.pushContent'), trigger: 'blur' }],
        user: [{ required: true, message: this.$i18n.t('message.select') + this.$i18n.t('message.pushUsers'), trigger: 'change' }],
        time: [{ required: true, message: this.$i18n.t('message.select') + this.$i18n.t('message.startTime'), trigger: 'change' }],
      }
    }
  },
  watch: {

  },
  created() {
    let Obj = this.Utils.isTest()
    this.IsTest = Obj.isTest
    this.HrefUrl = Obj.Url
  },
  mounted() {

  },
  methods: {
    initData (data) {
      this.bouncedTitle = this.$i18n.t('message.addNewPush')
    },
    // 获取媒资列表
    getDataList() {
      this.dialogVisibleloading = true
      if (this.from.mediaId == '' || typeof Number(this.from.mediaId) != 'number') {
        this.$message.warning(this.$i18n.t('message.tips2'))
        return false
      }
      this.$http({
        url: this.$http.LogUrl('/v1/media/get'),
        method: 'post',
        data: this.$http.adornParams({
          'Id': this.from.mediaId,
        })
      }).then(data => {
        this.dialogVisibleloading = false
        this.previewVisible = true
        if (data.status === 200) {
          data = data.data
          data.item.basic.mediaId = this.Utils.langNumber(data.item.basic.mediaId)
          this.mediaInfo = data.item.basic
        } else {
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    handleSwitch (row, o, p) {

    },
    handleClose (row) {
      this.dialogVisible = false
      this.from = {
        mediaId: '',
        title: '',
        centent: '',
        user: '',
        time: ''
      }
      this.$emit('handleClose')
    },
    addOrUpdateHandle (row) {

    },
    cancelingTime (row) {},
    productionSubmit(flg) {
      this.$refs['from'].validate((valid) => {
        if (valid) {
          this.ParameSubmit()
        }
      })
    },
    ParameSubmit () {
      // 接口提交
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
      let Params = {
        mi: this.from.mediaId,
        at: this.from.time,
        title: this.from.title,
        Content: this.from.centent,
        Plat: this.from.user,
        User: userInfo.userName,
        IsTest: this.IsTest
      }
      this.dialogVisibleloading = true
      this.$http({
        url: this.$http.LogUrl('/v1/push/add'),
        method: 'post',
        data: this.$http.adornParams(Params)
      }).then(data => {
        this.dialogVisibleloading = false
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
.previewVisible .el-form-item__content{
  display: flex;
  width: 100%;
  margin: 0 !important;
}
</style>
