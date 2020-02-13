<template>
  <div v-loading="operationsloading" class="operations">
    <div class="form_operation">
      <el-form :inline="true">
        <el-form-item style="float: right;margin-right: 0;">
          <!-- <el-button type="primary" @click="AddSaveShow">{{ $t('message.newOperation') }}</el-button> -->
          <el-button :disabled="!activateDataFlg" type="primary" @click="SaveShow">{{ $t('message.edit') }}</el-button>
          <el-button :disabled="!activateDataFlg" type="primary" @click="cancelingTime">{{ $t('message.cancelingTime') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        ref="singleTable"
        :data="operationsData"
        border
        highlight-current-row
        style="width: 100%"
        @current-change="handleCurrentChange"
      >
        <el-table-column
          type="index"
          :label="$t('message.number')"
          width="80"
          align="center"
        />
        <el-table-column
          prop="url"
          :label="$t('message.images')"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <img style="max-width: 100px;max-height: 200px;" :src="scope.row.url" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="sizeRelated"
          :label="$t('message.sizeRelated')"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div class="sizeRelatedList">
              <nav>
                <li :data="scope.row">{{ $t('message.imagesSize') }}：375*163</li>
              </nav>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="jumpUrl"
          :label="$t('message.jumpAddress')"
          header-align="center"
          align="center"
        />
        <!-- <el-table-column
            prop="operation"
            :label="$t('message.operation')"
            width="180"
            align="center"
            >
              <template slot-scope="scope">
                <div style="display: flex;flex-direction: row;flex-wrap: wrap;justify-content: center;">
                  <el-button style="cursor: pointer;" type="text" size="small" @click="cancelingTime(scope.row)">{{ $t('message.cancelingTime') }}</el-button>
                </div>
              </template>
            </el-table-column> -->
      </el-table>
    </div>
    <child-upload v-if="ChildUploadFlg" ref="ChildUpload" @ChildUploadClose="ChildUploadClose" />
  </div>
</template>

<script>

import ChildUpload from './components/ChildUpload'
export default {
  components: {
    ChildUpload
  },
  data() {
    return {
      operationsData: [
        { id: 1, images: 'http://f.hiphotos.baidu.com/image/pic/item/0e2442a7d933c8956c0e8eeadb1373f08202002a.jpg', sizeRelated: 'sdadadad.jpg', jumpAddress: 'www.baidu.com' }
      ],
      ChildUploadFlg: false,
      operationsloading: false,
      activateDataFlg: false,
      type: null,
      activateData: {
        id: false
      }
    }
  },
  computed: {

  },
  watch: {
    activateDataFlg(value) {

    }
  },
  created() {
    const href = window.location.href
    if (/\/oneDollar\//.test(href)) {
      this.snatchTreasureField = false
      this.type = 2
    } else {
      this.type = 1
    }
    this.getDataList()
  },
  mounted() {

  },
  methods: {
    getDataList() {
      this.operationsloading = true
      this.$http({
        url: this.$http.adornUrl('/service/media/v1/banner/list'),
        method: 'post',
        data: this.$http.adornParams({
          'type': this.type,
        })
      }).then(data => {
        if (data.status === 200) {
          this.operationsloading = false
          this.operationsData = data.data.banners
        } else {
          this.operationsloading = false
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    AddSaveShow(obj) {
      this.ChildUploadFlg = true
      this.$nextTick(() => {
        this.$refs.ChildUpload.init(Object.assign({ bouncedTitle: this.$i18n.t('message.Add') }))
      })
    },
    SaveShow() {
      this.ChildUploadFlg = true
      this.$nextTick(() => {
        this.$refs.ChildUpload.init(Object.assign({ bouncedTitle: this.$i18n.t('message.modify') }, { data: this.activateData }))
      })
    },
    cancelingTime() {
      this.$confirm(this.$i18n.t('message.deletePromptText') + '?', this.$i18n.t('message.deletePrompt'), {
        confirmButtonText: this.$i18n.t('message.confirm'),
        cancelButtonText: this.$i18n.t('message.cancel'),
        type: 'warning'
      }).then(() => {
        this.grantRulesloading = true
        this.$http({
          url: this.$http.adornUrl('/service/media/v1/banner/set'),
          method: 'post',
          data: this.$http.adornData({
            'banners': [
              {
                'id': this.activateData.id,
                'url': '',
                'type': this.activateData.type,
                'height': 0,
                'width': 0,
                'jumpUrl': ''
              }
            ]
          })
        }).then(data => {
          if (data.status === 200) {
            this.$message({
              type: 'success',
              message: this.$i18n.t('message.successfulOperation')
            })
            this.ChildUploadClose()
            this.getDataList()
            this.grantRulesloading = false
          } else {
            this.grantRulesloading = false
            this.$message.error(this.$i18n.t('message.requestFailed'))
          }
        })
      })
    },
    handleCurrentChange(row) {
      if (row) {
        this.activateData = JSON.parse(JSON.stringify(row))
        this.activateDataFlg = true
      }
    },
    ChildUploadClose(value) {
      if (value) {
        this.ChildUploadFlg = false
        this.$refs.singleTable.setCurrentRow('')
      } else {
        this.ChildUploadFlg = false
      }
      this.activateDataFlg = false
      this.getDataList()
    }
  }
}
</script>

<style lang="scss" scoped>
.operations{
  .sizeRelatedList{
    li{
      list-style: none;
      width: 68%;
      margin: 0 auto;
      text-align: center;
      font-size: 16px;
      line-height: 34px;
    }
  }
}

</style>
