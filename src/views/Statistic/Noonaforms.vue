<template>
  <div v-loading="Noonaformsloading" class="Noonaforms-container">
    <div class="form_operation">
      <el-form label-width="40px">
        <el-form-item class="search" style="float:left" :label="this.$i18n.t('message.platform')">
          <el-select v-model="typePlatform" @change="getDataList" :placeholder="this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.platform')">
            <el-option :label="this.$i18n.t('message.android')" value="ANDROID"></el-option>
            <el-option :label="this.$i18n.t('message.ios')" value="IOS"></el-option>
            <el-option :label="this.$i18n.t('message.all')" value=""></el-option>
          </el-select>
          <el-button icon="el-icon-search" style="margin-left: 28px;" :type="typePlatform ? 'primary' : 'info'" @click="getDataList">{{ $t('message.search') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="NoonaformsData"
        class="NewusersDataTable"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="dt"
          :label="$t('message.date')"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="plat"
          :label="$t('message.platform')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="pname"
          :label="$t('message.pname')"
          width="200"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="pcid"
          :label="$t('message.pcid')"
          width="120"
          align="center"
        >
        </el-table-column>  
        <el-table-column
          prop="new_user"
          :label="$t('message.newUser')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="sum_new_user"
          :label="$t('message.sumNewUser')"
          width="140"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="play_count"
          :label="$t('message.playCount')"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="play_count_per_person"
          :label="$t('message.playCountPer')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="it_show_times"
          :label="$t('message.itShowTimes')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="it_show_number"
          :label="$t('message.itShowUdid')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="it_show_udid"
          :label="$t('message.Numberdisplay')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="it_show_per_udid"
          :label="$t('message.itShowPerUdid')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="it_show_number_per_udid"
          :label="$t('message.graphicdisplay')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="it_click_times"
          :label="$t('message.itClickTimes')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="it_click_number"
          :label="$t('message.Numbergraphic')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="it_click_udid"
          :label="$t('message.itClickPer')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="it_click_number_per_udid"
          :label="$t('message.itClickPerUdidperson')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="it_click_per_udid"
          :label="$t('message.itClickPerUdidCount')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="play_user"
          :label="$t('message.playUser')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="play_user_ratio"
          :label="$t('message.playUserRatio')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="play_duration"
          :label="$t('message.playDuration')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="play_duration_per_person"
          :label="$t('message.playDurationPer')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="useDuration"
          :label="$t('message.use_duration')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="use_duration_per_person"
          :label="$t('message.useDurationPer')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="start_count"
          :label="$t('message.startCount')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="start_count_per_person"
          :label="$t('message.startCountPer')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="use_duration_per_person"
          :label="$t('message.useDurationPer')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="exit_count"
          :label="$t('message.exitCount')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="avg_used_time"
          :label="$t('message.avgUsedTime')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="push_show_dev_count"
          :label="$t('message.PushShowDevCount')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="push_arrive_dev_count"
          :label="$t('message.PushArriveDevCount')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="push_click_dev_count"
          :label="$t('message.PushClickDevCount')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="push_click_udid_ratio"
          :label="$t('message.PushClickUdidRatio')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="old_user_remained_1"
          :label="$t('message.oldUserRemained1')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="new_user_remained_1"
          :label="$t('message.newUserRemained1')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="new_user_remained_2"
          :label="$t('message.newUserRemained2')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="new_user_remained_3"
          :label="$t('message.newUserRemained3')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="new_user_remained_4"
          :label="$t('message.newUserRemained4')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="new_user_remained_5"
          :label="$t('message.newUserRemained5')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="new_user_remained_6"
          :label="$t('message.newUserRemained6')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="new_user_remained_7"
          :label="$t('message.newUserRemained7')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="new_user_remained_14"
          :label="$t('message.newUserRemained14')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="new_user_remained_30"
          :label="$t('message.newUserRemained30')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="new_user_avg_vv"
          :label="$t('message.newUserAvgVv')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="lazy_new_user_count"
          :label="$t('message.LazyNewUserCount')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="new_user_play_only_once"
          :label="$t('message.newUserPlayOnlyOnce')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="all_user_avg_play_video_number"
          :label="$t('message.allUserAvgPlayVideoNumber')"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="new_user_avg_play_video_number"
          :label="$t('message.newUserAvgPlayVideoNumber')"
          width="100"
          align="center"
        >
        </el-table-column>
      </el-table>
    </div>

    <div style="padding-top: 14px;">
      <el-pagination
        :current-page="pageIndex"
        hide-on-single-page
        :page-sizes="[10, 20, 50]"
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
  data() {
    return {
      Noonaformsloading: false,
      NoonaformsData: [

      ],
      AddModificationDialogVisible: false,
      typePlatform: '',
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
      this.Noonaformsloading = true
      if (this.typePlatform == '') {
        this.typePlatform = undefined
      }
      this.$http({
        url: this.$http.LogUrl('/v1/statistics/list_noona_daily'),
        method: 'post',
        data: this.$http.adornParams({
          'plat': this.typePlatform,
          'Page': this.pageIndex,
          'PageSize': this.pageSize
        })
      }).then(data => {
        this.Noonaformsloading = false
        // codeVerify [data] // 返回整体对象 [function] // 回调函数 [Params] // 回调函数携带参数
        var data = data
        let Obj = this.Utils.codeVerify(data, (Params) => {
          this.NoonaformsData = []
          let dataArr = Params.data.items
          let NewArr = []
          dataArr.forEach((v, i) => {
            v.row.dt = this.Utils.DTTime(v.row.dt)
            for (let o in v.row) {
              if (v.row[o] == '' || !v.row[o]) {
                v.row[o] = 0
              }
            }
            NewArr.push(v.row)
          })
          this.NoonaformsData = NewArr
          this.totalPage = Params.data.count
        }, data)
        if (Obj.msg) {
          if (Obj.msg !== 'Failed') {
            this.$message.error(Obj.msg)
          } else {
            this.$message.error(this.$i18n.t('message.requestFailed'))
          }
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
      // 查询条数不能大于10000
      let index = 10000 / this.pageSize
      if (val - this.pageIndex <= index) {
        this.pageIndex = val
        this.getDataList()
      } else {
        this.pageIndex = this.pageIndex
        this.$message.warning(this.$i18n.t('message.cannotThan'))
      }
    }
  }
}
</script>

<style>
.addUser .el-form-item__content {
  margin: 0 !important;
}
.search .el-form-item__content {
  display: flex;
}
</style>
