<template>
  <div>
    <el-dialog
      v-loading="CouponListloading"
      :title="bouncedTitle"
      :visible="true"
      class="CouponList"
      width="40%"
      :modal-append-to-body="true"
      :append-to-body="true"
      :before-close="clearClose"
    >
      <div>
        <el-table
          :data="couponListData"
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
            prop="couponCode"
            :label="$t('message.couponCode')"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="expireTime"
            :label="$t('message.validity')"
            header-align="center"
            align="center"
          />
        </el-table>
      </div>

      <div
        style="padding-top: 14px;width: 100%;
    overflow: auto;"
      >
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
      couponListData: [],
      CouponListloading: false,
      mediaId: '',
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

  },
  mounted() {

  },
  methods: {
    init(obj) {
      if (obj) {
        this.bouncedTitle = obj.bouncedTitle
        this.mediaId = obj.mediaId
      }
      this.CouponListloading = true
      this.$http({
        url: this.$http.adornUrl('/service/media/v1/coupon/list'),
        method: 'post',
        data: this.$http.adornParams({
          'groupId': this.mediaId,
          'type': 0,
          'pageToken': this.pageIndex.toString(),
          'pageSize': this.pageSize
        })
      }).then(data => {
        this.CouponListloading = false
        if (data.status === 200) {
          this.productListloading = false
          const datamedias = data.data.medias; const flg = 0
          this.couponListData = []
          datamedias.forEach((v, i) => {
            this.couponListData.push({
              couponCode: v.basic.content,
              expireTime: this.dateFormat(Number(v.basic.expireTime) * 1000, 'yyyy-MM-dd HH:mm:ss')
            })
          })
          // 页码 缺总数
          this.totalPage = Number(data.data.total)
        } else {
          this.productListloading = false
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    clearClose() {
      this.$emit('addProductVisible')
    },
    // 当前时间差八小时处理
    dateFormat(time, format) {
      var date = new Date(time)
      var o = {
        MM: date.getMonth() + 1, // month
        dd: date.getDate(), // day
        HH: date.getHours(), // hour+8小时
        mm: date.getMinutes(), // minute
        ss: date.getSeconds(), // second
        qq: Math.floor((date.getMonth() + 3) / 3), // quarter
        SS: date.getMilliseconds() // millisecond
      }
      if (o.HH == 24) {
        o.HH = '00'
      }
      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }

      for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
      }
      return format
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.init()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
