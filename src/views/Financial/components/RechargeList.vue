<template>
  <div>
    <el-dialog
      v-loading="RechargeListloading"
      :title="Title"
      :visible="true"
      class="RechargeList"
      width="50%"
      :modal-append-to-body="true"
      :append-to-body="true"
      :before-close="clearClose"
    >
      <div>
        <el-table
          :data="RechargeListData"
          border
          height="500px"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            :label="$t('message.number')"
            width="80px"
            align="center"
          />
          <el-table-column
            prop="ident"
            :label="$t('message.ident')"
            header-align="center"
            align="center"
          >
            <template v-if="scope.row.ident" slot-scope="scope">
              <div :style="scope.row.legal ? '' : 'color:red;'">{{ scope.row.ident }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="userIdStr"
            :label="$t('message.userId')"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="cash"
            :label="$t('message.Userscash')"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="coins"
            :label="$t('message.Userscoins')"
            header-align="center"
            align="center"
          >
          </el-table-column>
        </el-table>
      </div>

      <!-- <div
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
      </div> -->

      <span slot="footer">
        <el-button @click="clearClose">{{ this.$i18n.t('message.cancel') }}</el-button>
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
      RechargeListloading: false,
      pageIndex: 1,
      pageSize: 5,
      totalPage: 0
    }
  },
  computed: {

  },
  watch: {

  },
  props: {
    Title: {
      type: String,
      default: ''
    },
    RechargeListData: {
      type: Array,
      default: []
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    clearClose() {
      this.$emit('RechargeListClose')
    },
    // // 每页数
    // sizeChangeHandle(val) {
    //   this.pageSize = val
    //   this.pageIndex = 1
    //   this.init()
    // },
    // // 当前页
    // currentChangeHandle(val) {
    //   this.pageIndex = val
    //   this.init()
    // },
    productionSubmit () {
      let flg
      this.RechargeListData.forEach((v, i) => {
        if (!v.legal) {
          flg = false
        }
      })
      if (flg == undefined) {
        this.RechargeListloading = true
        this.$http({
          url: this.$http.payUrl('/x/service/pay/submitArtificialRecharge'),
          method: 'post',
          data: this.$http.adornParams({
            list: this.RechargeListData
          })
        }).then(data => {
          this.RechargeListloading = false
          // codeVerify [data] // 返回整体对象 [function] // 回调函数 [Params] // 回调函数携带参数
          var data = data.data
          if (data.ret) {
            this.$message({
              type: 'success',
              message: this.$i18n.t('message.successfulOperation')
            })
            this.clearClose()
          }
        })
      } else {
        this.$message.error(this.$i18n.t('message.invalidcheck'))
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
