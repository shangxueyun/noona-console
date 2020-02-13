<template>
  <div class="List_added">
    <div class="form_operation">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item style="width:22%" :label="`${$t('message.nickName')}:`">
          <el-input v-model="dataForm.nickName" style="width:100%" type="text" :placeholder="`${$t('message.pleaseInput')}${$t('message.nickName')}`" autocomplete="off" />
        </el-form-item>
        <el-form-item style="width:24%" :label="`${$t('message.videoSource')}:`">
          <el-select v-model="dataForm.videoSource" :placeholder="`${$t('message.pleaseSelect')}${$t('message.videoSource')}`">
            <el-option
              v-for="item in videoSourceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="width:23%" :label="`${$t('message.channel')}:`">
          <el-select v-model="dataForm.channel" :placeholder="`${$t('message.pleaseSelect')}${$t('message.channel')}`">
            <el-option
              v-for="item in channelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="width:23%" :label="`${$t('message.state')}:`">
          <el-select v-model="dataForm.state" :placeholder="`${$t('message.pleaseSelect')}${$t('message.state')}`">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="width:40%">
          <el-button @click="getDataList()">{{ $t('message.search') }}</el-button>
          <el-button style="margin-left:10px" type="primary" @click="addOrUpdateHandle()">{{ $t('message.Add') }}</el-button>
          <el-button style="margin-left:10px" :disabled="operationDatalist.length == 0" type="info" @click="addPush()">{{ $t('message.changeClass') }}</el-button>
          <el-button style="margin-left:10px" :disabled="operationDatalist.length == 0" type="warning" @click="addPush()">{{ $t('message.changeStatus') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="ListData"
        border
        highlight-current-row
        style="width: 100%"
        @current-change="handleCurrentChange"
      >
        <el-table-column
          prop="id"
          label="ID"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="operation"
          :label="$t('message.operation')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="nickName"
          :label="$t('message.nickName')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="channel"
          :label="$t('message.channel')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="videoSource"
          :label="$t('message.videoSource')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="state"
          :label="$t('message.state')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="listId"
          :label="$t('message.listId')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="LastUpdateTime"
          :label="$t('message.LastUpdateTime')"
          header-align="center"
          align="center"
        />
      </el-table>
    </div>
    <div style="padding-top: 14px;">
      <el-pagination
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
      />
    </div>
    <!-- 添加、修改 -->
    <add-modification v-if="addModificationFlg" ref="addModificationS" @addModificationClose="addModificationClose" />
  </div>
</template>
<script>
import AddModification from './AddModification'
export default {
  components: {
    AddModification
  },
  data() {
    var ValueSize = (rule, value, callback) => {
      if (value === '') {
        callback(new Error())
      } else {
        if (Number(value) >= 100000000) {
          rule.message = '请输入产值不能大于100000000'
          callback(new Error())
        } else if (Number(value).toString() == 'NaN') {
          rule.message = '请输入产值格式不正确，请输入数字格式'
          callback(new Error())
        } else if (Number(value).toString() != 'NaN') {
          if (Number(value) <= 0) {
            rule.message = '请输入产值不能小于等于0'
            callback(new Error())
          } else {
            callback()
          }
        }
      }
    }
    return {
      dataForm: {
        nickName: '',
        videoSource: '',
        channel: '',
        state: ''
      },
      videoSourceOptions: [
        { value: 0, label: this.$i18n.t('message.all') },
        { value: 1, label: 'Youtube' },
        { value: 2, label: 'Facebook' }
      ],
      channelOptions: [
        { value: 0, label: this.$i18n.t('message.all') },
        { value: 1, label: this.$i18n.t('message.headline') },
        { value: 2, label: this.$i18n.t('message.sports') },
        { value: 3, label: this.$i18n.t('message.entertainment') },
        { value: 4, label: this.$i18n.t('message.lifestyle') },
        { value: 5, label: this.$i18n.t('message.vlog') }
      ],
      stateOptions: [
        { value: 0, label: this.$i18n.t('message.all') },
        { value: 1, label: this.$i18n.t('message.enabled') },
        { value: 2, label: this.$i18n.t('message.disabled') }
      ],
      bouncedTitle: this.$i18n.t('message.newCaptureSource'),
      dialogVisible: false,
      addData: {
        videoSource: '',
        Id: '',
        channel: ''
      },
      rules: {
        videoSource: [{ required: true, message: this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.videoSource'), trigger: 'blur' }],
        Id: [{ required: true, message: this.$i18n.t('message.pleaseInput') + 'Id', trigger: 'blur' }],
        channel: [{ required: true, message: this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.channel'), trigger: 'blur' }]
      },
      // 后续动态数据
      ListData: [
        { id: 1, nickName: 'nickName', channel: 'channel', videoSource: 'videoSource', state: 'state' },
        { id: 1, nickName: 'nickName', channel: 'channel', videoSource: 'videoSource', state: 'state' },
        { id: 1, nickName: 'nickName', channel: 'channel', videoSource: 'videoSource', state: 'state' },
        { id: 1, nickName: 'nickName', channel: 'channel', videoSource: 'videoSource', state: 'state' },
        { id: 1, nickName: 'nickName', channel: 'channel', videoSource: 'videoSource', state: 'state' },
        { id: 1, nickName: 'nickName', channel: 'channel', videoSource: 'videoSource', state: 'state' }
      ],
      // 操作数据
      addModificationFlg: false,
      operationDatalist: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  mounted() {
    console.log(this.operationDatalist.length)
  },
  methods: {
    // 获取数据
    getDataList() {
      this.$http({
        url: this.$http.adornUrl(),
        method: 'post',
        data: this.$http.adornData({
          'pageNo': this.pageIndex,
          'pageSize': this.pageSize,
          'param': {
            'choiceTime': this.dataForm.date
          }
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          const list = data.result.list
          this.dataList = list
          this.totalPage = data.result.totalCount
          this.pageIndex = data.result.currPage
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    deleteHandle() {

    },
    addPush() {},
    // 新增 / 修改
    addOrUpdateHandle(num) {
      this.addModificationFlg = true
      this.$nextTick(() => {
        this.$refs.addModificationS.init(Object.assign({ bouncedTitle: this.$i18n.t('message.newCaptureSource') }, this.operationDatalist))
      })
    },
    addModificationClose() {
      this.addModificationFlg = false
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 单选
    handleCurrentChange(val) {
      this.operationDatalist = [],
      this.operationDatalist.push(val)
    }
  }
}
</script>
<style lang="scss" scope>
.List_added{
    width: 100%;
    .form_operation{
        width: 100%
    }
}
.info{
    .el-form-item__content{
        line-height: 24px;
    }
}
</style>
