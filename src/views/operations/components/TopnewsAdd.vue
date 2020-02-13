<template>
  <div>
    <el-dialog
      :title="Title"
      v-loading="dialogVisibleloading"
      class="dialog"
      :visible.sync="dialogVisible"
      width="55%"
      :before-close="handleClose">
        <div class="form_operation">
          <el-form ref="from" :model="from" label-width="80px" :rules="rules">
            <el-form-item class="previewVisible" style="display: flex;" :label="this.$i18n.t('message.mediaId')" prop="mediaId" :rules="rules.mediaId">
              <el-input v-model="from.mediaId" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.mediaId')" />
              <el-button @click="getDataList">{{ $t('message.search') }}</el-button>
            </el-form-item>

            <el-form-item class="previewVisible" style="display: flex;" v-if="previewVisible" :label="this.$i18n.t('message.title2')">
              <div style="width: 87%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;float: left;">{{ mediaInfo.title }}</div>
              <el-button style="float:left"> <a target="_blank" :href="`${HrefUrl}${mediaInfo.mediaId}`" style="text-decoration: none;">{{ $t('message.preview') }}</a></el-button>
            </el-form-item>

            <el-form-item :label="this.$i18n.t('message.topposition')" prop="sort" :rules="rules.sort">
              <el-input v-model="from.sort" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.topposition')" />
            </el-form-item>
            <div style="display: flex;">
              <el-form-item :label="this.$i18n.t('message.startTime')" prop="StartTime" :rules="rules.StartTime">
                <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="from.StartTime" type="datetime" :picker-options="expireTimeOption"></el-date-picker>
              </el-form-item>
              <el-form-item :label="this.$i18n.t('message.endTime')" prop="EndTime" :rules="rules.EndTime">
                <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="from.EndTime" type="datetime" :picker-options="expireTimeOption"></el-date-picker>
              </el-form-item>
            </div>
            <el-form-item :label="this.$i18n.t('message.CeilingType')" prop="type" :rules="rules.type">
              <el-select v-model="from.type" @change="recomTopCateTop" multiple :placeholder="this.$i18n.t('message.select') + this.$i18n.t('message.CeilingType')">
                <el-option :key="1" :label="$t('message.cateTop')" :value="1"></el-option>
                <el-option :key="2" :label="$t('message.recomTop')" :value="2"></el-option>
              </el-select>
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
    var validateRepertory = (rule, value, callback) => {
      if (value !== '') {
        if (isNaN(Number(value))) {
          callback(new Error(this.$i18n.t('message.PleaseNumber')))
        } else {
          if (Number(value) > 0) {
            if (value.toString().indexOf('.') >= 0) {
              callback(new Error(this.$i18n.t('message.InputDecimal')))
            } else {
              if (value.length > 9) {
                callback(new Error(this.$i18n.t('message.Exceedinglimit')))
              } else {
                callback()
              }
            }
          } else {
            callback(new Error(this.$i18n.t('message.inventoryQuantity')))
          }
        }
      } else { callback(new Error(this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.topposition'))) }
    }
    return {
      dialogVisibleloading: false,
      dialogVisible: true,
      previewVisible: false,
      from: {
        mediaId: '',
        sort: '',
        StartTime: '',
        EndTime: '',
        type: [],
        CateTop: '',
        RecomTop: '',
      },
      mediaInfo: {
        title: ''
      },
      // 全局test
      IsTest: true,
      HrefUrl: '',
      expireTimeOption: {
		    disabledDate(date) {
				  return (date.getTime()+24*3600*1000) <= Date.now();
		    }
      },
      mediaInfo: {},
      rules: {
        mediaId: [{ required: true, message: this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.mediaId'), trigger: 'blur' }],
        sort: [{ required: true, validator: validateRepertory, trigger: 'blur' }],
        StartTime: [{ required: true, message: this.$i18n.t('message.select') + this.$i18n.t('message.startTime'), trigger: 'change' }],
        EndTime: [{ required: true, message: this.$i18n.t('message.select') + this.$i18n.t('message.endTime'), trigger: 'change' }],
        type: [{ required: true, message: this.$i18n.t('message.select') + this.$i18n.t('message.CeilingType'), trigger: 'change' }],
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
        sort: '',
        StartTime: '',
        EndTime: '',
        type: [],
        CateTop: '',
        RecomTop: '',
      }
      this.$emit('handleClose')
    },
    recomTopCateTop (row) {
      if (row.toString().replace(/,/g,' ').indexOf('1') > -1) {
        this.from.CateTop = 2
      } else {
        this.from.CateTop = 3
      }
      if (row.toString().replace(/,/g,' ').indexOf('2') > -1) {
        this.from.RecomTop = 2
      } else {
        this.from.RecomTop = 3
      }
    },
    productionSubmit(flg) {
      this.$refs['from'].validate((valid) => {
        if (valid) {
          this.ParameSubmit()
        }
      })
    },
    ParameSubmit () {
      // 接口提交
      if (Number(this.from.sort).toString() == 'NaN') {
        this.from.sort = ''
        this.$message.error(this.$i18n.t('message.Pleaseposition'))
        return false
      }
      let Params = {
        VideoId: this.from.mediaId,
        Sort: Number(this.from.sort),
        StartTime: this.from.StartTime,
        CateTop: this.from.CateTop,
        RecomTop: this.from.RecomTop,
        EndTime: this.from.EndTime
      }
      this.dialogVisibleloading = true
      this.$http({
        url: this.$http.LogUrl('/v1/media/add_media_top'),
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
.previewVisible label{
  width: 88px !important;
}
</style>
