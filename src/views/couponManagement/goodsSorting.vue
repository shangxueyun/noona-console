<template>
  <div v-loading="goodsSortingloading" class="goodsSorting">
    <div class="form_operation">
      <el-form :inline="true">
        <el-form-item style="float: right;margin-right: 0;">
          <el-button v-if="!editValueflg" type="primary" @click="editValueflg = true">{{ $t('message.edit') }}</el-button>
          <el-button v-if="editValueflg" type="info" @click="cancel">{{ $t('message.cancel') }}</el-button>
          <el-button v-if="editValueflg" type="primary" @click="editSave()">{{ $t('message.Save') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="goodsSortingData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="images"
          :label="$t('message.images')"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <img style="max-width: 100px;max-height: 200px;" :src="scope.row.images" alt="">
          </template>
        </el-table-column>
        <el-table-column
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
          prop="sortId"
          :label="$t('message.sort')"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              <span v-if="!editValueflg" style="color:#1890ff">{{ scope.row.sortId }}</span>
              <input v-if="editValueflg" v-model="scope.row.sortId" class="swiInput" type="text" @blur="validateQuantity(scope.row)" @keyup="editValueSwi(scope.row)">
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
  </div>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {
      goodsSortingData: [

      ],
      editValueflg: false,
      goodsSortingloading: false,
      editListData: [],
      snatchTreasureField: true,
      goodsType:'',
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
      this.goodsSortingloading = true
      this.$http({
        url: this.$http.adornUrl('/service/media/v1/coupon/list'),
        method: 'post',
        data: this.$http.adornParams({
          'groupId': 0,
          'goodsType': this.goodsType,
          'type': 1,
          'pageToken': this.pageIndex.toString(),
          'pageSize': this.pageSize
        })
      }).then(data => {
        if (data.status === 200) {
          this.goodsSortingloading = false
          const datamedias = data.data.medias
          this.goodsSortingData = []
          for (const i in datamedias) {
            if (datamedias[i].basic.checkStatus === '10') {
              if (datamedias[i].basic.privateDetail) {
                datamedias[i].basic.price = Number(JSON.parse(datamedias[i].basic.privateDetail).price) / 100
                datamedias[i].basic.discountDescription = JSON.parse(datamedias[i].basic.privateDetail).discountDescription
                // 1为缩略图
                datamedias[i].basic.images = datamedias[i].cover[1].coverObj['1'].url
                this.goodsSortingData.push(datamedias[i].basic)
              } else {
                datamedias[i].basic.images = datamedias[i].cover[1].coverObj['1'].url
                this.goodsSortingData.push(datamedias[i].basic)
              }
            }
          }
          // 页码 缺总数
          this.totalPage = Number(data.data.total)
        } else {
          this.goodsSortingloading = false
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
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
    editSave() {
      this.goodsSortingloading = true
      if (this.editListData.length == 0) { return false }
      // 进行接口
      if (this.editListData.length !== 0) {
        const arr = JSON.parse(JSON.stringify(this.editListData))
        this.$http({
          url: this.$http.adornUrl('/service/media/v1/coupon/shelfSort'),
          method: 'post',
          data: this.$http.adornData({
            'type': 2,
            'shelfSorts': arr
          })
        }).then(data => {
          this.goodsSortingloading = false
          if (data.status === 200) {
            this.getDataList()
            this.$message({
              type: 'success',
              message: this.$i18n.t('message.successfulOperation')
            })
            this.editValueflg = false
          } else {
            this.getDataList()
            this.$message.error(this.$i18n.t('message.requestFailed'))
          }
        })
      }
    },
    cancel() {
      this.editValueflg = false
      this.getDataList()
    },
    validateQuantity(value) {
      const ValueS = value.sortId
      if (ValueS !== '') {
        if (isNaN(Number(ValueS))) {
          this.$message.error(this.$i18n.t('message.PleaseNumber'))
          value.sortId = ''
        } else {
          if (Number(ValueS) > 0 || Number(ValueS) == 0) {
            if (ValueS.toString().indexOf('.') >= 0) {
              this.$message.error(this.$i18n.t('message.enteredIncorrectly'))
              value.sortId = ''
            } else {
              if (ValueS.length > 9) {
                this.$message.error(this.$i18n.t('message.Exceedinglimit'))
                value.sortId = ''
              } else {
                this.editValueSwiblur(value)
              }
            }
          } else {
            this.$message.error(this.$i18n.t('message.enteredIncorrectly'))
            value.sortId = ''
          }
        }
      } else {
        this.$message.error(this.$i18n.t('message.enteredIncorrectly'))
        value.sortId = ''
      }
    },
    editValueSwi(row) {
      const arry = this.editListData; let flg
      arry.forEach((v, i) => {
        if (v.mediaId === row.mediaId) {
          v.sortId = row.sortId
          flg = i
        }
      })
      if (flg === undefined) {
        arry.push({ mediaId: row.mediaId, sortId: row.sortId })
      }
    },
    editValueSwiblur(row) {
      const arry = this.editListData; let flg
      arry.forEach((v, i) => {
        if (v.mediaId === row.mediaId) {
          flg = i
        }
      })
      if (flg !== undefined) {
        if (this.NumberJudge(this.editListData[flg].sortId) === '') {
          this.editListData[flg].sortId = '0'
          row.sortId = '0'
        }
      }
    },
    NumberJudge(num) {
      if (isNaN(Number(num))) {
        this.$message.error(this.$i18n.t('message.PleaseNumber'))
        return ''
      } else if (Number(num) < 0) {
        this.$message.error(this.$i18n.t('message.inventoryQuantity'))
        return ''
      } else if (Number(num).toString().indexOf('.') >= 0) {
        this.$message.error(this.$i18n.t('message.InputDecimal'))
        return ''
      } else {
        return num
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.goodsSorting{
  .swiInput{
    width: 50%;
    line-height: 30px;
    border-radius: 6px;
    border: 1px solid #ccc;
    text-indent: 4px;
    outline: 0;
  }
}

</style>
