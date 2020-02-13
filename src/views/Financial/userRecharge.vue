<template>
  <div  v-loading="userRechargeloading" class="userRecharge-container">
    <div class="form_operation">
      <el-form label-width="80px">
        <el-form-item class="addUser" style="float:left;position: relative;">
          <!-- <el-button type="primary" @click="AddSaveShow">{{ $t('message.newOperation') }}</el-button> -->
          <el-button icon="el-icon-download" type="primary" >{{ $t('message.Import') }}</el-button>
          <input type="file" @change="ImportFile" accept=".xlsx" id="Importdownload">
        </el-form-item>
        <el-form-item class="search" style="float:left" :label="this.$i18n.t('message.time')">
          <!-- :picker-options="expireTimeOption" -->
          <el-date-picker
            v-model="allTime"
            type="daterange"
            range-separator="-"
            format="yyyy-MM-dd"
            :start-placeholder="this.$i18n.t('message.startTime')"
            :end-placeholder="this.$i18n.t('message.endTime')"
            :placeholder="this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.time')">
          </el-date-picker>
          <el-button icon="el-icon-search" style="margin-left: 28px;" :type="allTime ? 'primary' : 'info'" @click="getDataList">{{ $t('message.search') }}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <el-table
        :data="userRechargeData"
        class="userRechargeTable"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          :label="$t('message.number')"
          width="80px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          :label="$t('message.time')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="payUserId"
          :label="$t('message.userId')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="subsidy"
          :label="$t('message.Userscash')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="gold"
          :label="$t('message.Userscoins')"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <!-- 0 全部 1 待定 2 通过 3 不通过 -->
            <span v-if="scope.row.gold">{{ scope.row.gold / 100 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="payStatus"
          :label="$t('message.status')"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <!-- 0 全部 1 待定 2 通过 3 不通过 -->
            <span style="color: #67c23a" v-if="scope.row.payStatus === '2'">{{$t('message.adopt')}}</span>
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

    <div v-if="RechargeListVisible">
      <recharge-list :Title="$t('message.RechargeList')" :RechargeListData="RechargeListData" @RechargeListClose="RechargeListClose"></recharge-list>
    </div>
  </div>
</template>

<script>
import RechargeList from './components/RechargeList'
export default {
  name: 'userRecharge',
  components: { RechargeList },
  data() {
    return {
      userRechargeloading: false,
      RechargeListVisible: false,
      RechargeListData: [],
      userRechargeData: [],
      allTime: '',
      expireTimeOption: {
		    disabledDate(date) {
				  return (date.getTime()+24*3600*1000) <= Date.now();
		    }
      },
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  watch: {

  },
  created() {
    this.getDataList()
  },
  mounted() {

  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    getDataList() {
      this.userRechargeloading = true
      if (this.allTime == '' || this.allTime == null || this.allTime[0] == undefined) {
        this.allTime = [undefined, undefined]
      } else {
        if (typeof this.allTime[0] != 'string') {
          this.allTime[0] = this.Utils.hoursResolution(this.allTime[0].getTime(), true)
          this.allTime[1] = this.Utils.hoursResolution(this.allTime[1].getTime(), true)
        }
      }
      this.$http({
        url: this.$http.payUrl('/x/service/pay/artificialRechargeList'),
        method: 'post',
        data: this.$http.adornParams({
          'start': this.allTime[0],
          'end': this.allTime[1],
          'page': this.pageIndex,
          'size': this.pageSize
        })
      }).then(data => {
        this.userRechargeloading = false
        var data = data.data
        if (data.list) {
          this.userRechargeData = []
          this.userRechargeData = data.list
          this.totalPage = Number(data.total)
        } else {
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    formDataFor(obj, file) {
      const formData = new FormData()
      for (const i in obj) {
        formData.append(i, obj[i])
      }
      formData.append('file', file)
      return formData
    },
    ImportFile (row, o) {
      let file = row.target.files[0]
      row.target.value = ''
      this.userRechargeloading = true
      this.$RequestHeader.ResetPicture(file.name.substr(file.name.lastIndexOf('.') + 1, file.name.length)).then(response => {
        if (response.response.status === 200 || response.status === 200) {
          // 修改参数
          window.RechargeUrl = response.data.data.addressUrl
          this.$RequestHeader.AjaxPost(this.$http.AliUrl(''), this.formDataFor(response.data.data.body, file), { headers: { 'Content-Type': '' }}).then(response => {
            if (response.response.status === 200 || response.status === 200) {
              this.$RequestHeader.RechargeSubmitted({ url: window.RechargeUrl, Page: 1,PageSize: 5 }, '/v1/pay/importArtificialRecharge').then(response => {
                if (response.response.status === 200 || response.status === 200) {
                  if (typeof response.data.data == 'object') {
                    let list = response.data.data.list
                    for (let i = 0; i < list.length; i++) {
                      if (list[i].userId) {
                        if (list[i].userId.c) {
                          list[i].userId = this.Utils.langNumber(list[i].userId)
                        }
                      } else {
                        list[i].userId = ''
                      }
                      if (!list[i].legal) {
                        list[i].legal = false
                      }
                    }
                    this.RechargeListData = response.data.data.list
                    this.RechargeListVisible = true
                    this.userRechargeloading = false
                  } else {
                    this.userRechargeloading = false
                    this.$message.error(response.data.msg)
                  }
                } else {
                  this.userRechargeloading = false
                  this.$message.error(this.$i18n.t('message.requestFailed'))
                }
              })
            } else {
              this.userRechargeloading = false
              this.$message.error(this.$i18n.t('message.requestFailed'))
            }
          })
        } else {
          this.userRechargeloading = false
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
    RechargeListClose (row) {
      this.RechargeListVisible = false
      this.getDataList()
    }
  }
}
</script>

<style >
.userRecharge-container .addUser .el-form-item__content {
  margin: 0 !important;
}
.userRecharge-container .search .el-form-item__content {
  display: flex;
}
.userRecharge-container #Importdownload{
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0px;
  width: 90px;
  height: 42px;
  cursor: pointer;
  z-index: 1;
}
</style>
