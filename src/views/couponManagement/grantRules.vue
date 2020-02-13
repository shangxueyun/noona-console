<template>
  <div v-loading="grantRulesloading" class="grantRules">
    <div class="form_operation">
      <el-form :inline="true">
        <el-form-item style="float: right;margin-right: 0;">
          <el-button type="primary" @click="addOrUpdate()">{{ $t('message.createRule') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="grantRulesData"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          :label="$t('message.number')"
          width="80"
          align="center"
        />
        <el-table-column
          prop="timeSlot"
          :label="$t('message.timeBucket')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="detail"
          :label="$t('message.containsGoods')"
          :show-overflow-tooltip="true"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              <span v-for="(item, index) in scope.row.detail" :key="index">{{ item.summaryName }} </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          :label="$t('message.operation')"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <div style="display: flex;flex-direction: row;flex-wrap: wrap;justify-content: center;">
              <el-button style="cursor: pointer;" type="text" size="small" @click="ViewDetails(scope.row)">{{ $t('message.View') }}{{ $t('message.details') }}</el-button>
              <el-button style="cursor: pointer;" type="text" size="small" @click="SaveEdit(scope.row)">{{ $t('message.edit') }}</el-button>
              <el-button style="cursor: pointer;" type="text" size="small" @click="Delete(scope.row)">{{ $t('message.cancelingTime') }}</el-button>
            </div>
          </template>
        </el-table-column>
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

    <create-rule v-if="addOrUpdateVisible" ref="CreateRule" @addProductVisible="addProductVisible" />
  </div>
</template>

<script>
import CreateRule from './components/CreateRule'
export default {
  components: {
    CreateRule
  },
  data() {
    return {
      grantRulesData: [
        { id: 1, timeSlot: '10:00', detail: '某某商品某某商品某某商品某某商品某某商品某某商品' }
      ],
      addOrUpdateVisible: false,
      grantRulesloading: false,
      productListData: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    this.getDataList()
  },
  mounted() {

  },
  methods: {
    getDataList() {
      this.grantRulesloading = true
      var vm = this
      this.$http({
        url: this.$http.adornUrl('/service/media/v1/coupon/list'),
        method: 'post',
        data: this.$http.adornParams({
          'groupId': 0,
          'type': 1,
          'pageToken': '1',
          'pageSize': 999
        })
      }).then(data => {
        if (data.status === 200) {
          const vm = this; const dataMedias = data.data.medias
          this.productListData = []
          for (const i in dataMedias) {
            this.productListData.push(dataMedias[i])
          }
          vm.$http({
            url: vm.$http.adornUrl('/service/media/v1/rule/list'),
            method: 'post',
            data: vm.$http.adornParams()
          }).then(data => {
            vm.grantRulesloading = false
            if (data.status === 200) {
              const rules = data.data.rules; let detailObj
              rules.forEach((v, i) => {
                if (v.detail) {
                  detailObj = JSON.parse(v.detail)
                  detailObj.forEach((v1, i1) => {
                    for (const o in vm.productListData) {
                      if (vm.productListData[o].basic.mediaId === v1.mediaId) {
                        v1.summaryName = vm.productListData[o].basic.summary
                      }
                    }
                  })
                }
                v.detail = detailObj
              })
              vm.grantRulesData = rules
            } else {
              vm.grantRulesloading = false
              vm.$message.error(this.$i18n.t('message.requestFailed'))
            }
          })
        } else {
          vm.grantRulesloading = false
          vm.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    addOrUpdate() {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.CreateRule.init({ bouncedTitle: this.$i18n.t('message.newRules') })
      })
    },
    addProductVisible() {
      this.addOrUpdateVisible = false
      this.getDataList()
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
    ViewDetails(row) {
      this.addOrUpdateVisible = true
      const obj = {
        bouncedTitle: this.$i18n.t('message.viewRules'),
        ViewDetails: true,
        data: row
      }
      this.$nextTick(() => {
        this.$refs.CreateRule.init(obj)
      })
    },
    SaveEdit(row) {
      this.addOrUpdateVisible = true
      const obj = {
        bouncedTitle: this.$i18n.t('message.modify') + this.$i18n.t('message.issuingRules'),
        data: row
      }
      this.$nextTick(() => {
        this.$refs.CreateRule.init(obj)
      })
    },
    Delete(row) {
      this.$confirm(this.$i18n.t('message.deletePromptText') + '?', this.$i18n.t('message.deletePrompt'), {
        confirmButtonText: this.$i18n.t('message.confirm'),
        cancelButtonText: this.$i18n.t('message.cancel'),
        type: 'warning'
      }).then(() => {
        this.grantRulesloading = true
        this.$http({
          url: this.$http.adornUrl('/service/media/v1/rule/set'),
          method: 'post',
          data: this.$http.adornData({
            'deleteIds': [
              row.id
            ]
          })
        }).then(data => {
          if (data.status === 200) {
            this.$message({
              type: 'success',
              message: this.$i18n.t('message.successfulOperation')
            })
            this.getDataList()
            this.grantRulesloading = false
          } else {
            this.grantRulesloading = false
            this.$message.error(this.$i18n.t('message.requestFailed'))
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
