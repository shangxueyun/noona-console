<template>
  <div v-loading="pushNotificationloading" class="pushNotification-container">
    <div class="form_operation">
      <el-form :inline="true">
        <el-form-item style="">
          <!-- <el-button type="primary" @click="AddSaveShow">{{ $t('message.newOperation') }}</el-button> -->
          <el-button icon="el-icon-plus" type="primary" @click="addOrUpdateHandle()">{{ $t('message.addNewPush') }}</el-button>
        </el-form-item>
        <el-form-item :label="$t('message.status')" style="">
          <el-select v-model="pushNotificationStatus" @change="getDataList" :placeholder="this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.pushStatus')">
            <el-option
              v-for="item in pushNotificationStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="pushNotificationData"
        class="pushNotificationDataTable"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="80px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="media_id"
          :label="$t('message.mediaId')"
          header-align="center"
          align="center"
        >
          <!-- <template slot-scope="scope">
            <div>
              <img style="100%;height:100%" :src="scope.row.cover" alt="">
            </div>
          </template> -->
        </el-table-column>
        <el-table-column
          prop="title"
          :label="$t('message.title2')"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="content"
          :label="$t('message.content')"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="plat"
          :label="$t('message.pushUser')"
          width="80px"
          align="center"
        >
        <!-- // plat 0 all 1 Android 2 Ios -->
          <template slot-scope="scope">
            <div v-if="scope.row.plat == 0">All</div>
            <div v-if="scope.row.plat == 1">Android</div>
            <div v-if="scope.row.plat == 2">Ios</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="push_time"
          :label="$t('message.pushTime')"
          width="130px"
          align="center"
        >
          <!-- <template slot-scope="scope">
            <div v-if="scope.row.status == 1">正常</div>
            <div v-else>禁用</div>
          </template> -->
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('message.status')"
          width="100px"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">即将推送</div>
            <div v-else-if="scope.row.status == 1" style="color: #8CE26F">推送中</div>
            <div v-else-if="scope.row.status == 2">已推送</div>
            <div v-else-if="scope.row.status == 3" style="color: #E0E0E0">已取消</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="creator"
          :label="$t('message.creator')"
          width="100px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="operation"
          :label="$t('message.operation')"
          width="120px"
          align="center"
        >
          <template slot-scope="scope">
            <div style="display: flex;flex-direction: row;flex-wrap: wrap;justify-content: center;">
              <el-button v-if="scope.row.status == 0" type="warning" icon="el-icon-close" style="cursor: pointer;" size="small" @click="cancelPush(scope.row)">{{ $t('message.cancelPush') }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="padding-top: 14px;">
      <el-pagination
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
      />
    </div>

    <push-notification-add ref="PushNotificationAdd" @handleClose="handleClose" v-if="PushNotificationAddVisible"></push-notification-add>
  </div>
</template>

<script>
import PushNotificationAdd from './components/PushNotificationAdd'
export default {
  name: 'pushNotification',
  components: { 
    PushNotificationAdd
   },
  data() {
    return {
      pushNotificationloading: false,
      PushNotificationAddVisible: false,
      pushNotificationData: [

      ],
      // 全局test
      IsTest: true,
      // cancelled:'已取消',3
      // finished:'已推送',2
      // inProgress: '推送中',1
      // upcoming: '即将推送',0
      // plat 0 all 1 Android 2 Ios
      pushNotificationStatusOptions: [
        {
          name: this.$i18n.t('message.upcoming'),
          value: 0
        },
        {
          name: this.$i18n.t('message.inProgress'),
          value: 1
        },
        {
          name: this.$i18n.t('message.finished'),
          value: 2
        },
        {
          name: this.$i18n.t('message.cancelled'),
          value: 3
        }
      ],
      pushNotificationVisible: false,
      pushNotificationStatus: '',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  watch: {

  },
  created() {
    let Obj = this.Utils.isTest()
    this.isTest = Obj.isTest
    this.hrefUrl = Obj.Url
    this.getDataList()
  },
  mounted() {

  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    getDataList() {
      this.pushNotificationloading = true
      if (this.pushNotificationStatus === '') {
        this.pushNotificationStatus = undefined
      }
      this.$http({
        url: this.$http.LogUrl('/v1/push/list'),
        method: 'post',
        data: this.$http.adornParams({
          'Page': this.pageIndex,
          'PageSize': this.pageSize,
          'Status': this.pushNotificationStatus,
          'IsTest': this.IsTest
        })
      }).then(data => {
        this.pushNotificationloading = false
        if (data.status === 200) {
          data = data.data
          let list = data.items
          if (list) {
            list.forEach((v, i) => {
              list[i].push_time = `${this.Utils.DTTime(list[i].dt)} ${list[i].push_time}`
            })
            this.pushNotificationData = []
            this.pushNotificationData = list
          }
          this.totalPage = data.count
        } else {
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      // 查询条数不能大于10000
      let index = 10000 / this.pageSize
      if (val - this.pageIndex <= index) {
        this.pageIndex = val
        this.getDataList()
      } else {
        this.pageIndex = this.pageIndex
        this.$message.warning(this.$i18n.t('message.cannotThan'))
      }
    },
    // 当前页
    currentChangeHandle(val) {
      // 查询条数不能大于10000
      let index = 10000 / this.pageSize
      if (val - this.pageIndex <= index) {
        this.pageIndex = val
        this.getDataList()
      } else {
        this.pageIndex = this.pageIndex
        this.$message.warning(this.$i18n.t('message.cannotThan'))
      }
    },
    addOrUpdateHandle (row) {
      this.PushNotificationAddVisible = true
      this.$nextTick(() => {
        this.$refs.PushNotificationAdd.initData()
      })
    },
    cancelPush (row) {
      this.$confirm(this.$i18n.t('message.operationPromptText'), this.$i18n.t('message.operationPrompt'), {
        confirmButtonText: this.$i18n.t('message.confirm'),
        cancelButtonText: this.$i18n.t('message.cancel'),
        type: 'warning'
      }).then(() => {
        this.pushNotificationloading = true
        this.$http({
          url: this.$http.LogUrl('/v1/push/cancel'),
          method: 'post',
          data: this.$http.adornParams({
            'Id': row.id,
            'IsTest': this.IsTest
          })
        }).then(data => {
          this.pushNotificationloading = false
          let Obj = this.Utils.codeVerify(data, this.getDataList, true)
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
      }).catch(() => {
        this.productListloading = false
        this.getDataList()
      })
    },
    handleClose (row) {
      this.PushNotificationAddVisible = false
      this.getDataList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
