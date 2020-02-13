<template>
  <div v-loading="productListloading" class="productList">
    <div class="form_operation">
      <el-form>
        <el-form-item>
          <el-button icon="el-icon-plus" type="primary" @click="addOrUpdateHandle()">{{ $t('message.addProduct') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="productListData"
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
          prop="mediaId"
          label="mediaId"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="images"
          :label="$t('message.thumbnail')"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <img style="max-width: 100px;max-height: 200px;" :src="scope.row.images" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="summary"
          :label="$t('message.goodsName')"
          :show-overflow-tooltip="true"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="title"
          :label="$t('message.title2')"
          :show-overflow-tooltip="true"
          header-align="center"
          align="center"
        />
        <el-table-column
          v-if="snatchTreasureField"
          prop="content"
          :label="$t('message.details')"
          :show-overflow-tooltip="true"
          header-align="center"
          align="center"
        />
        <el-table-column
          v-if="snatchTreasureField"
          prop="price"
          :label="$t('message.Price')"
          header-align="center"
          align="center"
        />
        <el-table-column
          v-if="snatchTreasureField"
          prop="storage"
          :label="$t('message.repertory')"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div style="color:#1890ff">
              {{ scope.row.storage }}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
            prop="grantRules"
            :label="$t('message.grantRules')"
            header-align="center"
            align="center"
            >
              <template slot-scope="scope">
                <div style="display: flex;flex-direction: row;flex-wrap: wrap;justify-content: center;">
                  <el-button style="cursor: pointer;" type="text" size="small" @click="Rulescheck(scope.row)">{{ $t('message.View') }}</el-button>
                </div>
              </template>
            </el-table-column> -->
        <el-table-column
          prop="state"
          :label="$t('message.state')"
          width="100px"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              class="switchStyle"
              active-color="#dcdfe6"
              inactive-color="#409eff"
              :active-value="1"
              :inactive-value="0"
              active-text="已下架"
              inactive-text="已上架"
              @change="handleSwitch(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="snatchTreasureField"
          prop="couponCode"
          :label="$t('message.couponCode')"
          width="100px"
          align="center"
        >
          <template slot-scope="scope">
            <div style="display: flex;flex-direction: row;flex-wrap: wrap;justify-content: center;">
              <el-button style="cursor: pointer;" icon="el-icon-view" type="info" size="small" @click="ViewHandle(scope.row)">{{ $t('message.View') }}</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          :label="$t('message.operation')"
          width="216px"
          align="center"
        >
          <template slot-scope="scope">
            <div style="display: flex;flex-direction: row;flex-wrap: wrap;justify-content: center;">
              <el-button style="cursor: pointer;" icon="el-icon-edit" type="primary" size="small" @click="addOrUpdateHandle(scope.row)">{{ $t('message.edit') }}</el-button>
              <el-button icon="el-icon-download" type="primary" v-if="scope.row.sourceType == 7 || snatchTreasureField" style="cursor: pointer;" size="small" @click="ImportCouponsF(scope.row)">{{ $t('message.ImportCoupons') }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="padding-top: 14px;">
      <el-pagination
        :current-page="pageIndex"
        :page-sizes="[5, 10]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
      />
    </div>

    <add-product v-if="addOrUpdateVisible" ref="addOrUpdate" @addProductVisible="addProductVisible" />

    <import-coupons v-if="ImportCouponsVisible" ref="ImportCoupons" @addProductVisible="addProductVisible" />

    <coupon-list v-if="CouponListVisible" ref="CouponList" @addProductVisible="addProductVisible" />
  </div>
</template>

<script>

import AddProduct from './components/AddProduct'
import ImportCoupons from './components/ImportCoupons'
import CouponList from './components/CouponList'
export default {
  components: {
    AddProduct,
    ImportCoupons,
    CouponList
  },
  data() {
    return {
      productListData: [

      ],
      bouncedTitle: 'sss',
      addOrUpdateVisible: false,
      ImportCouponsVisible: false,
      productListloading: false,
      CouponListVisible: false,
      goodsType: '',
      addData: {},
      rules: {},
      // 一元夺宝参数
      snatchTreasureField: true,
      snatchTreasureFunc: true,
      pageIndex: 1,
      pageSize: 5,
      totalPage: 0
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    const href = window.location.href
    if (/\/oneDollar\//.test(href)) {
      this.snatchTreasureField = false
      this.snatchTreasureFunc = false
      this.goodsType = [7,8,9]
    } else {
      this.goodsType = []
    }
    this.getDataList()
  },
  mounted() {

  },
  methods: {
    getDataList() {
      this.productListloading = true
      this.$http({
        url: this.$http.adornUrl('/service/media/v1/coupon/list'),
        method: 'post',
        data: this.$http.adornParams({
          'groupId': 0,
          'goodsType': this.goodsType,
          'type': 0,
          'pageToken': this.pageIndex.toString(),
          'pageSize': this.pageSize
        })
      }).then(data => {
        if (data.status === 200) {
          this.productListloading = false
          const datamedias = data.data.medias; let flg = 0
          this.productListData = []
          for (const i in datamedias) {
            if (datamedias[i].basic.privateDetail) {
              datamedias[i].basic.price = Number(JSON.parse(datamedias[i].basic.privateDetail).price) / 100
              datamedias[i].basic.discountDescription = JSON.parse(datamedias[i].basic.privateDetail).discountDescription
            }
            // 1为缩略图
            datamedias[i].basic.images = datamedias[i].cover[1].coverObj['1'].url
            // 存图片
            datamedias[i].basic.cover = datamedias[i].cover
            if (datamedias[i].basic.checkStatus === '10') { datamedias[i].basic.state = 0 } else if (datamedias[i].basic.checkStatus === '1') { datamedias[i].basic.state = 1 }
            this.productListData.push(datamedias[i].basic)
            flg = flg + 1
          }
          // 页码 缺总数
          this.totalPage = Number(data.data.total)
        } else {
          this.productListloading = false
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    // 新增、修改
    addOrUpdateHandle(rowObj) {
      let obj
      if (rowObj) { obj = Object.assign({ bouncedTitle: this.$i18n.t('message.Merchandise') }, { data: rowObj }) } else { obj = Object.assign({ bouncedTitle: this.$i18n.t('message.addProduct') }) }
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(obj)
      })
    },
    // 优惠券导入
    ImportCouponsF(row) {
      this.ImportCouponsVisible = true
      const obj = {
        bouncedTitle: this.$i18n.t('message.ImportCoupons'),
        mediaId: row.mediaId
      }
      this.$nextTick(() => {
        this.$refs.ImportCoupons.init(obj)
      })
    },
    // 上架下架
    handleSwitch(row) {
      this.productListloading = true
      let checkStatus
      if (row.state === 0) { checkStatus = 10 } else { checkStatus = 1 }
      const href = window.location.href
      if (/\/oneDollar\//.test(href)) {
        this.confirmS(row, checkStatus)
      } else {
        this.shelfSorts(row, checkStatus)
      }
    },
    // 强行下线
    forcedOffline(row) {
      //
    },
    shelfSorts(row, checkStatus) {
      this.$http({
        url: this.$http.adornUrl('/service/media/v1/coupon/shelfSort'),
        method: 'post',
        data: this.$http.adornData({
          'type': 1,
          'shelfSorts': [
            {
              'mediaId': row.mediaId,
              'checkStatus': checkStatus,
              'sourceType': Number(row.sourceType)
            }
          ]
        })
      }).then(data => {
        if (data.status === 200) {
          this.productListloading = false
          if (!data.data.ret || data.data.msg) {
            this.$message.error(this.$i18n.t(data.data.msg))
            this.getDataList()
          } else {
            this.getDataList()
            this.$message({
              type: 'success',
              message: this.$i18n.t('message.successfulOperation')
            })
          }
        } else {
          this.productListloading = false
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    confirmS(row, checkStatus) {
      this.$confirm(this.$i18n.t('message.operationPromptText') + '?', this.$i18n.t('message.operationPrompt'), {
        confirmButtonText: this.$i18n.t('message.confirm'),
        cancelButtonText: this.$i18n.t('message.cancel'),
        type: 'warning'
      }).then(() => {
        this.shelfSorts(row, checkStatus);
      }).catch(() => {
        this.productListloading = false
        this.getDataList()
      });
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
    addProductVisible() {
      this.addOrUpdateVisible = false
      this.ImportCouponsVisible = false
      this.CouponListVisible = false
      this.productListData = []
      this.getDataList()
      this.$forceUpdate()
    },
    ViewHandle(row) {
      this.CouponListVisible = true
      this.$nextTick(() => {
        this.$refs.CouponList.init({ bouncedTitle: this.$i18n.t('message.couponCodelist'), mediaId: row.mediaId })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
