<template>
  <div v-loading="regularRobotloading" class="regularRobot">
    <div class="form_operation">
      <el-form>
        <el-form-item>
          <!-- <el-button type="primary" @click="AddSaveShow">{{ $t('message.newOperation') }}</el-button> -->
          <el-button icon="el-icon-plus" type="primary" @click="addOrUpdateHandle()">{{ $t('message.Add') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="regularRobotData"
        class="regularRobotDataTable"
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
          prop="activityName"
          :label="$t('message.activity')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="rules"
          :label="$t('message.Rules')"
          header-align="center"
          align="center"
        >
          <template v-if="scope.row.rules" slot-scope="scope">
            <div class="rules-content">
              <ul>
                <li>{{ $t('message.robotsNumber') }}： {{ scope.row.amount }}</li>
                <li>{{ $t('message.Participateinterval') }}： 【{{ scope.row.rules.leftJoinInterval  }},{{ scope.row.rules.rightJoinInterval }}】</li>
                <li>{{ $t('message.Participateamount') }}： 【{{ scope.row.rules.leftGold }},{{ scope.row.rules.rightGold }}】</li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="goods"
          :label="$t('message.goods')"
          :show-overflow-tooltip="true"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div style="color:#0D0DFF;cursor: pointer;" v-if="scope.row.goods.length > 3" @click="goodsView(scope.row.goods)">
              <div v-for="(items,key) in scope.row.goods" :key="key">
                <div v-if="key <= 1">{{ items.goodsName }}</div>
                <div v-else-if="key == 2">{{ items.goodsName }}...</div>
              </div>
            </div>
            <div style="color:#0D0DFF" v-else>
              <div v-for="items in scope.row.goods" :key="items.mediaId">{{ items.goodsName }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          :label="$t('message.operation')"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <div style="display: flex;flex-direction: row;flex-wrap: wrap;justify-content: center;">
              <el-switch
                v-model="scope.row.status"
                class="switchStyle"
                active-color="#dcdfe6"
                inactive-color="#409eff"
                :active-value="1"
                :inactive-value="2"
                active-text="Off"
                inactive-text="On"
                @change="cancelingTime(scope.row)"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="RobotAddVisible">
      <robot-add :Title="$t('message.robotRules')" :RobotList="regularRobotData" @handleClose="handleClose" ref="RobotAdd"></robot-add>
    </div>

    <div v-if="goodsListVisible">
      <robot-list :Title="$t('message.Rulegoods')" :goodsList="goodsList" @handleClose="handleClose" ref="goodsList"></robot-list>
    </div>
  </div>
</template>

<script>RobotList
import RobotAdd from './components/RobotAdd'
import RobotList from './components/RobotList'
export default {
  components: {
    RobotAdd,
    RobotList
  },
  data() {
    return {
      regularRobotloading: false,
      regularRobotData: [
      ],
      goodsList: [],
      RobotAddVisible: false,
      goodsListVisible: false
    }
  },
  created() {
    this.getDataList()
  },
  mounted() {

  },
  methods: {
    getDataList() {
      this.regularRobotloading = true
      this.$http({
        url: this.$http.activityUrl('/x/service/activity/robotRuleList'),
        method: 'post',
        data: this.$http.adornParams({
          'page': 1,
          'size': 20
        })
      }).then(data => {
        this.regularRobotloading = false
        if (data.status === 200) {
          data = data.data
          let list = data.list
          if (list) {
            list.forEach((v, i) => {
              if (v.type == '1') {
               list[i].activityName = 'Lucky coin game'
              }
              let rules = {
                leftJoinInterval: list[i].leftJoinInterval,
                rightJoinInterval: list[i].rightJoinInterval,
                leftGold: list[i].leftGold,
                rightGold: list[i].rightGold
              }
              list[i].rules = rules
              list[i].goods  = JSON.parse(list[i].detail)
              list[i].status = Number(list[i].status)
            })
            this.regularRobotData = []
            this.regularRobotData = list
          }
        } else {
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    handleSwitch (row) {
      // 功能
    },
    addOrUpdateHandle (row) {
      this.RobotAddVisible = true
    },
    cancelingTime (row) {
      this.$confirm(this.$i18n.t('message.operationPromptText') + '?', this.$i18n.t('message.operationPrompt'), {
        confirmButtonText: this.$i18n.t('message.confirm'),
        cancelButtonText: this.$i18n.t('message.cancel'),
        type: 'warning'
      }).then(() => {
        this.regularRobotloading = true
        this.$http({
          url: this.$http.activityUrl('/x/service/activity/robotRuleOnOff'),
          method: 'post',
          data: this.$http.adornParams({
            'id': row.id,
            'ot': row.status
          })
        }).then(data => {
          this.regularRobotloading = false
          var data = data.data
          if (data.ret) {
            this.$message({type: 'success',message: this.$i18n.t('message.successfulOperation')})
          } else {
            this.$message.error(this.$i18n.t(data.msg))
          }
          this.getDataList()
        })
      }).catch(() => {
        this.getDataList()
      });
    },
    goodsView (row) {
      this.goodsList = JSON.parse(JSON.stringify(row))
      this.goodsListVisible = true
    },
    handleClose (row) {
      this.getDataList()
      this.RobotAddVisible = false
      this.goodsListVisible = false
    }
  }
}
</script>
<style>
  .rules-content li{
    list-style: none;
  }
</style>
