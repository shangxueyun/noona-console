<template>
  <div v-loading="NBABetloading" class="NBABet">
    <div class="form_operation">
      <el-form :inline="true" style="display: flex;" label-width="80px">
        <el-form-item class="timeClass" style="float: left;" :label="this.$i18n.t('message.time')">
          <el-date-picker
            v-model="formData.time"
            style="width: 100%;"
            type="date"
            range-separator="-"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="float: right;margin-right: 0;">
          <!-- <el-button type="primary" @click="AddSaveShow">{{ $t('message.newOperation') }}</el-button> -->
          <el-button type="primary" @click="getDataList">{{ $t('message.search') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="NBABetData"
        class="NBABetDataTable"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          :label="$t('message.number')"
          width="100"
          align="center"
        />
        <el-table-column
          prop="localTime"
          :label="$t('message.time')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="teamInfo"
          :label="$t('message.teamInformation')"
          :class-name="`teamInformation`"
          width="400"
          align="center"
        >
          <template v-if="scope.row.teamInfo" slot-scope="scope">
            <div class="mainTeam" style="line-height: 8px;width: 42%;height: 62px;float: left;">
              <div style="width: 40px;height: 40px;margin: 0 auto;"><img style="width: 100%;height: 100%;" :src="scope.row.teamInfo.MayTeam.icon" alt="" /></div>
              <br>
              <span style="float: left;width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;height: 22px;line-height: 14px;">{{ scope.row.teamInfo.MayTeam.name }}</span>
            </div>
            VS
            <div class="keTeam" style="line-height: 8px;width: 42%;height: 62px;float: right;">
              <div style="width: 40px;height: 40px;margin: 0 auto;"><img style="width: 100%;height: 100%;" :src="scope.row.teamInfo.MainTeam.icon" alt="" /></div>
              <br>
              <span style="float: left;width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;height: 22px;line-height: 14px;">{{ scope.row.teamInfo.MainTeam.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="arenaName"
          :label="$t('message.gymnasium')"
          :show-overflow-tooltip="true"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="Bets"
          :label="$t('message.Bets')"
          header-align="center"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Bets"
              class="switchStyle"
              active-color="#dcdfe6"
              inactive-color="#409eff"
              :active-value="0"
              :inactive-value="1"
              active-text="已禁用"
              inactive-text="已启用"
              @change="handleSwitch(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  components: {

  },
  data() {
    return {
      NBABetData: [
        { id: 1, images: 'http://f.hiphotos.baidu.com/image/pic/item/0e2442a7d933c8956c0e8eeadb1373f08202002a.jpg', sizeRelated: 'sdadadad.jpg', jumpAddress: 'www.baidu.com' }
      ],
      NBABetloading: false,
      orderManagementDialogVisible: false,
      ViewHandleVisible:false,
      activateDataFlg: false,
      // 7卡券； 8话费； 9实物
      typeOptions: [
        {id:7, value:'卡券'},
        {id:8, value:'话费'},
        {id:9, value:'实物'}
      ],
      formData: {
        time: new Date().toLocaleDateString().replace(/\//g,'-')
      }
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
      this.NBABetloading = true
      this.$http({
        url: this.$http.activityUrl('/x/service/activity/scoresList'),
        method: 'post',
        data: this.$http.adornParams({
          'type': 3,
          'baseDate': this.formData.time,
        })
      }).then(data => {
        this.NBABetloading = false
        if (data.status === 200) {
          data = data.data
          data.list.forEach((v, i)=>{
            var obj = {
              localTime: v.localTime,
              gameId: v.gameId,
              arenaName: v.arenaName,
              teamInfo: {
                MainTeam: {
                  name: v.homeTeamInfo.fullName,
                  icon: v.homeTeamInfo.icon
                },
                MayTeam: {
                  name: v.visitorTeamInfo.fullName,
                  icon: v.visitorTeamInfo.icon
                }
              },
              Bets: Number(v.betStatus) ? Number(v.betStatus) : 0
            }
            data.list[i] = obj
          })
          this.NBABetData = []
          this.NBABetData = data.list
        } else {
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    handleSwitch(row) {
      this.$http({
        url: this.$http.activityUrl('/x/service/activity/nbaBetEnable'),
        method: 'post',
        data: this.$http.adornData({
          gameId: row.gameId,
          enable: row.Bets
        })
      }).then(data => {
        if (data.status === 200) {
          var data = data.data
          if (data.ret) {
            this.getDataList()
            this.$message({
              type: 'success',
              message: this.$i18n.t('message.successfulOperation')
            })
          } else {
            this.$message.error(this.$i18n.t(data.msg))
            this.getDataList()
          }
        } else {
          this.productListloading = false
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    }
  }
}
</script>

<style>
.NBABet .teamInformation .cell{
  line-height: 54px
}
</style>
