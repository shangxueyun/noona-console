<template>
  <div v-loading="Topnewsloading" class="Topnews-container">
    <div class="form_operation">
      <el-form :inline="true">
        <el-form-item style="">
          <!-- <el-button type="primary" @click="AddSaveShow">{{ $t('message.newOperation') }}</el-button> -->
          <el-button icon="el-icon-plus" type="primary" @click="addOrUpdateHandle()">{{ $t('message.NewRoof') }}</el-button>
        </el-form-item>
        <el-form-item :label="$t('message.CeilingState')" style="">
          <el-select v-model="TopnewsCeilingState" @change="getDataList" :placeholder="this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.CeilingState')">
            <el-option
              v-for="item in TopnewsCeilingStateOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('message.status')" style="">
          <el-select v-model="TopnewsStatus" @change="getDataList" :placeholder="this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.status')">
            <el-option
              v-for="item in TopnewsStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="TopnewsData"
        class="TopnewsTable"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="80px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="mediaId"
          :label="$t('message.mediaId')"
          width="180px"
          align="center"
        >
          <template slot-scope="scope">
            <a style="color:#1682e6" @click="PreviewInformationClick(scope.row)">{{ scope.row.mediaId }}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          :label="$t('message.title2')"
          width="240px"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="cover"
          :label="$t('message.thumbnail')"
          width="160px"
          align="center"
        >
          <template v-if="scope.row.cover" slot-scope="scope">
            <img style="max-width: 100px;max-height: 200px;" :src="scope.row.cover[0].coverObj['1'].url" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="AXNClass"
          :label="$t('message.CeilingType')"
          width="100px"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.cateTop === 2 && scope.row.recomTop === 2">{{$t('message.both')}}</span>
            <span v-else-if="scope.row.cateTop === 2">{{$t('message.cateTop')}}</span>
            <span v-else-if="scope.row.recomTop === 2">{{$t('message.recomTop')}}</span>
            <span v-if="scope.row.cateTop === 1 && scope.row.recomTop === 1">{{$t('message.undetermined')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="startTime"
          :label="$t('message.startTime')"
          width="160px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="endTime"
          :label="$t('message.endTime')"
          width="160px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="sort"
          :label="$t('message.topposition')"
          width="80px"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.sort">
              {{ scope.row.sort }}
            </div>
            <div v-else>0</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="TopStatus"
          :label="$t('message.CeilingState')"
          width="100px"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.TopStatus == '置顶中'" style="color:rgb(103, 194, 58)">
              {{ scope.row.TopStatus }}
            </div>
            <div v-else>{{ scope.row.TopStatus }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          :label="$t('message.userName')"
          width="80px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('message.auditStatus')"
          width="80px"
          align="center"
        >
          <template slot-scope="scope">
            <!-- 0 全部 1 待定 2 通过 3 不通过 -->
            <span v-if="scope.row.status === 1">
              <span v-if="getStatus(scope.row)">{{$t('message.undetermined')}}</span>
              <span style="color:#ccc " v-if="!getStatus(scope.row)">{{$t('message.Unavailable')}}</span>
            </span>
            <span style="color: #67c23a" v-if="scope.row.status === 2">{{$t('message.adopt')}}</span>
            <span style="color: red" v-if="scope.row.status === 3">{{$t('message.NotPass')}}</span>
            <span style="color: #ccc" v-if="scope.row.status === 4">{{$t('message.Cancelled')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('message.operation')"
          width="170px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button style="margin-left: 10px;cursor: pointer;" type="warning" icon="el-icon-close" v-if="scope.row.status === 2 && scope.row.decide == true" size="small" @click="CancelTheCeiling(scope.row)">{{ $t('message.CancelTheCeiling') }}</el-button>
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

    <div v-if="TopnewsAddVisible">
        <topnews-add :Title="$t('message.NewRoof')" @handleClose="handleClose"></topnews-add>
    </div>
    
    <preview-information ref="PreviewInformationDis" :mediaInfo="PreviewInformationMediaInfo" @handleClose="handleClose" v-if="PreviewInformationVisible"></preview-information>
  </div>
</template>

<script>
import TopnewsAdd from './components/TopnewsAdd'
// 预览功能
import PreviewInformation from '@/components/PreviewInformation'
export default {
  name: 'Topnews',
  components: { 
    TopnewsAdd,
    PreviewInformation
   },
  data() {
    return {
      Topnewsloading: false,
      TopnewsAddVisible: false,
      PreviewInformationVisible: false,
      TopnewsData: [

      ],
      TopnewsCeilingStateOptions: [
        {
          name: this.$i18n.t('message.all'),
          value: 0
        },
        {
          name: this.$i18n.t('message.Topping'),
          value: 1
        },
        {
          name: this.$i18n.t('message.Upcoming'),
          value: 2
        },
        {
          name: this.$i18n.t('message.Expired'),
          value: 3
        }
      ],
      TopnewsStatusOptions: [
        {
          name: this.$i18n.t('message.all'),
          value: 0
        },
        {
          name: this.$i18n.t('message.undetermined'),
          value: 1
        },
        {
          name: this.$i18n.t('message.adopt'),
          value: 2
        },
        {
          name: this.$i18n.t('message.NotPass'),
          value: 3
        },
        {
          name: this.$i18n.t('message.Cancelled'),
          value: 4
        }
      ],
      PreviewInformationMediaInfo: {},
      TopnewsVisible: false,
      TopnewsCeilingState: '',
      TopnewsStatus: '',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  watch: {

  },
  created() {
    let href = window.location.href
    if (href.indexOf('console.noonaapps') > -1) {
      this.IsTest = false
    } else {
      this.IsTest = true
    }
    this.getDataList()
  },
  mounted() {

  },
  methods: {
    getDataList() {
      this.Topnewsloading = true
      if (this.TopnewsCeilingState === '') {
        this.TopnewsCeilingState = null
      }
      if (this.TopnewsStatus === '') {
        this.TopnewsStatus = null
      }
      this.$http({
        url: this.$http.LogUrl('/v1/media/list_media_top'),
        method: 'post',
        data: this.$http.adornParams({
          'AppID': 4, // 后台说写死为4
          'Page': this.pageIndex,
          'PageSize': this.pageSize,
          'DateStatus': this.TopnewsCeilingState,
          'Status': this.TopnewsStatus
        })
      }).then(data => {
        this.Utils.langNumber
        this.Topnewsloading = false
        if (data.status === 200) {
          data = data.data
          let listGather = data.items
          if (listGather.list) {
            let basic = listGather.basic.medias
            let listArr = listGather.list
            let objArr = []
            listArr.forEach((v, i) => {
              listArr[i].videoId = this.Utils.langNumber(listArr[i].videoId)
              for(let o in basic){
                if (basic[o].basic.mediaId.c) {
                  basic[o].basic.mediaId = this.Utils.langNumber(basic[o].basic.mediaId)
                }
                if (listArr[i].videoId == basic[o].basic.mediaId) {
                  let startTime = listArr[i].startTime
                  let endTime = listArr[i].endTime
                  let TopStatus
                  if (new Date() - new Date(startTime) > 0) {
                    if (new Date() - new Date(endTime) > 0) {
                      TopStatus = this.$i18n.t('message.Expired')
                    } else {
                      TopStatus = this.$i18n.t('message.Topping')
                    }
                  } else {
                    TopStatus = this.$i18n.t('message.Upcoming')
                  }
                  let decide
                  if (TopStatus == '置顶中' || TopStatus == '即将推送') {
                    decide = true
                  } else {
                    decide = false
                  }
                  objArr.push(Object.assign(
                    listArr[i],
                    {
                      AXNClass: this.$i18n.t('message.undetermined'),
                      decide,
                      TopStatus
                    },
                    {
                      cover: basic[o].cover
                    },
                    basic[o].basic
                  ))
                }
              }
            })
            this.TopnewsData = []
            this.TopnewsData = objArr
          } else {
            this.TopnewsData = []
          }
          this.totalPage = data.count
        } else {
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    getStatus (val) {
      let nowTime = new Date()
      let oldTime = new Date(val.endTime)
      if (nowTime < oldTime) {
        return true
      } else {
        return false
      }
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
    },
    addOrUpdateHandle (row) {
      this.$nextTick(() => {
        this.TopnewsAddVisible = true
      })
    },
    cancelPush (row) {
      this.$confirm(this.$i18n.t('message.operationPromptText'), this.$i18n.t('message.operationPrompt'), {
        confirmButtonText: this.$i18n.t('message.confirm'),
        cancelButtonText: this.$i18n.t('message.cancel'),
        type: 'warning'
      }).then(() => {
        this.Topnewsloading = true
        this.$http({
          url: this.$http.LogUrl('/push/v1/cancel'),
          method: 'post',
          data: this.$http.adornParams({
            'Id': row.id,
            'IsTest': this.IsTest
          })
        }).then(data => {
          this.Topnewsloading = false
          // codeVerify [data] // 返回整体对象 [function] // 回调函数 [Params] // 回调函数携带参数
          let Obj = this.Utils.codeVerify(data, this.getDataList, true)
          if (Obj.msg) {
            if (Obj.msg !== 'Failed') {
              this.$message.error(Obj.msg)
            } else {
              this.$message.error(this.$i18n.t('message.requestFailed'))
            }
          } else {
            this.$message({type: 'success',message: this.$i18n.t('message.successfulOperation')})
          }
        })
      }).catch(() => {
        this.productListloading = false
        this.getDataList()
      })
    },
    // 取消置顶
    CancelTheCeiling (row) {
      this.$confirm(this.$i18n.t('message.operationPromptText'), this.$i18n.t('message.operationPrompt'), {
        confirmButtonText: this.$i18n.t('message.confirm'),
        cancelButtonText: this.$i18n.t('message.cancel'),
        type: 'warning'
      }).then(() => {
        this.pushNotificationloading = true
        this.$http({
          url: this.$http.LogUrl('/v1/media/cancel_media_top'),
          method: 'post',
          data: this.$http.adornParams({
            'Id': row.id,
            'Status': 4
          })
        }).then(data => {
          this.pushNotificationloading = false
          let Obj = this.Utils.codeVerify(data, this.getDataList, true)
          if (Obj.msg) {
            if (Obj.msg !== 'Failed') {
              this.$message.error(Obj.msg)
            } else {
              this.$message.error(this.$i18n.t('message.requestFailed'))
            }
          } else {
            this.$message({type: 'success',message: this.$i18n.t('message.successfulOperation')})
          }
        })
      }).catch(() => {
        this.productListloading = false
        this.getDataList()
      })
    },
    // 预览展示
    PreviewInformationClick (row) {
      this.PreviewInformationMediaInfo = JSON.parse(JSON.stringify(row))
      this.PreviewInformationVisible = true
    },
    handleClose (row) {
      this.TopnewsAddVisible = false
      this.PreviewInformationVisible = false
      this.getDataList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
