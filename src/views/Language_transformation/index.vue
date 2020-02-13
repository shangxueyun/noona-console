<template>
  <div class="List_added">
    <div class="form_operation">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item :label="`${$t('message.language')}:`">
          <el-select v-model="dataForm.videoSource" :placeholder="`${$t('message.pleaseSelect')}${$t('message.language')}`">
            <el-option
              v-for="item in languageOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="width:40%">
          <el-button @click="getDataList('1')">{{ $t('message.modify') }}</el-button>
          <el-button type="primary" plain @click="addPush()">{{ $t('message.BatchSubmit') }}</el-button>
          <el-button style="margin-left:10px" type="primary" @click="addPush()">{{ $t('message.SubmitOriginalLanguage') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="ListData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="ID"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="platform"
          :label="$t('message.platform')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="userId"
          :label="$t('message.userId')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="title"
          :label="$t('message.title2')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="region"
          :label="$t('message.region')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="language"
          :label="$t('message.language')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="newLanguage"
          :label="$t('message.newLanguage')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="newRegion"
          :label="$t('message.newRegion')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="createTime"
          :label="$t('message.createTimes')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="status"
          :label="$t('message.state')"
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
        layout="total, sizes, prev, pager, next"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
      />
    </div>
    <!-- 添加、修改 -->
    <div class="pop-up">
      <el-dialog
        :title="bouncedTitle"
        :visible.sync="dialogVisible"
        width="50%"
        :modal-append-to-body="true"
        :append-to-body="true"
        :before-close="clearClose"
      >
        <!--  -->
        <el-form ref="addData" :model="addData" status-icon :rules="rules" label-width="120px" class="demo-ruleForm" @keyup.esc.native="clearClose()">
          <el-form-item :label="`${$t('message.videoSource')}:`" prop="videoSource" :rules="rules.videoSource">
            <el-select v-model="addData.videoSource" :placeholder="`${$t('message.pleaseSelect')}${$t('message.videoSource')}`">
              <el-option
                v-for="item in languageOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Id:" :rules="rules.Id" prop="Id">
            <el-input v-model="addData.Id" style="width:100%" type="text" :placeholder="`${$t('message.pleaseInput')}Id`" autocomplete="off" />
          </el-form-item>
          <el-form-item :label="`${$t('message.channel')}:`" prop="channel" :rules="rules.channel">
            <el-select v-model="addData.channel" :placeholder="`${$t('message.pleaseSelect')}${$t('message.channel')}`">
              <el-option
                v-for="item in channelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="info">
            网站Id查看方法说明：
            <br>youtube频道Id为：进入频道后，地址的url中红色部分为此频道Id
            https://www.youtube.com/channel/
            <span
              style="color:red"
            >UC9v3JGut2ZPxrXpGzgEAA</span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">{{ this.$i18n.t('message.cancel') }}</el-button>
          <el-button type="primary" @click="productionSubmit">{{ this.$i18n.t('message.confirm') }}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>

export default {
  components: {
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
      languageOptions: [
        { lan: 'zh', reg: 'CN' },
        { lan: 'th', reg: 'TH' },
        { lan: 'pt', reg: 'PT' },
        { lan: 'ms', reg: 'MY' },
        { lan: 'ko', reg: 'KR' },
        { lan: 'ja', reg: 'JP' },
        { lan: 'id', reg: 'ID' },
        { lan: 'fr', reg: 'FR' },
        { lan: 'es', reg: 'ES' },
        { lan: 'en', reg: 'US' },
        { lan: 'tl', reg: 'PH' },
        { lan: 'other', reg: 'OTHER' }
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
        { id: 1, platform: 'platform', userId: '1', title: 'videoSource', state: 'state' },
        { id: 1, platform: 'nickName', userId: '2', title: 'videoSource', state: 'state' },
        { id: 1, platform: 'nickName', userId: '3', title: 'videoSource', state: 'state' },
        { id: 1, platform: 'nickName', userId: '4', title: 'videoSource', state: 'state' },
        { id: 1, platform: 'nickName', userId: '5', title: 'videoSource', state: 'state' },
        { id: 1, platform: 'nickName', userId: '6', title: 'videoSource', state: 'state' }
      ],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  computed: {
  },
  mounted() {
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
    clearClose() {
      this.dialogVisible = false
      this.addData = {
        videoSource: '',
        Id: '',
        channel: ''
      }
    },
    // 添加/修改参数
    addPush() {
      for (const i in this.addData) {
        this.addData[i] = ''
      }
      this.dialogVisible = true
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
    productionSubmit() {

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
