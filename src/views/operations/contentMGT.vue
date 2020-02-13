<template>
  <div v-loading="contentMGTloading" class="contentMGT-container">
    <div class="form_operation">
      <el-form>
        <el-form-item class="search" style="float:left;width: 20%;" :label="$t('message.mediaId')">
          <el-input v-model="from.MediaId" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.mediaId')" />
        </el-form-item>
        <el-form-item class="search" style="float:left;width: 20%;" :label="$t('message.classification')">
          <el-select style="width: 91%;" v-model="from.cateId" :placeholder="this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.classification')">
            <el-option
              v-for="item in classificationOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="search" style="float:left;width: 20%;" :label="$t('message.type')">
          <el-select style="width: 91%;"  v-model="from.MediaType" :placeholder="this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.type')">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="search" style="float:left;width: 20%;" :label="$t('message.status')">
          <el-select style="width: 91%;"  v-model="from.CheckStatus" :placeholder="this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.status')">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="search" style="float:left;width: 25%;" :label="$t('message.startTime')">
          <!-- :picker-options="expireTimeOption" -->
          <el-date-picker
            v-model="from.StartTime"
            type="date"
            :placeholder="this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.startTime')">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="search" style="float:left;width: 39%;" :label="$t('message.endTime')">
          <!-- :picker-options="expireTimeOption" -->
          <el-date-picker
            v-model="from.EndTime"
            type="date"
            :placeholder="this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.endTime')">
          </el-date-picker>
          <el-button 
            icon="el-icon-search"
            style="margin-left: 28px;"
            :type="from.cateId || from.MediaType || from.CheckStatus || from.StartTime || from.EndTime ? 'primary' : 'info'"
            @click="getDataList">
            {{ $t('message.search') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="contentMGTData"
        class="contentMGTTable"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="ID"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="mediaId"
          :label="$t('message.mediaId')"
          width="160px"
          align="center"
        >
          <template slot-scope="scope">
            <a style="color:#1682e6" @click="PreviewInformationClick(scope.row)">{{ scope.row.mediaId }}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          :label="$t('message.title2')"
          width="160px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="mediaType"
          :label="$t('message.mediaType')"
          width="80px"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.mediaType == 1">
              {{ $t('message.video') }}
            </div>
            <div v-else>
              {{ $t('message.news') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="userId"
          :label="$t('message.userId')"
          width="100px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="source"
          :label="$t('message.source')"
          width="100px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="addTime"
          :label="$t('message.createTimes')"
          width="140px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="originAddTime"
          :label="$t('message.OriginalUploadTime')"
          width="140px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="auditorTime"
          :label="$t('message.auditorTime')"
          width="140px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="Auditor"
          :label="$t('message.Auditor')"
          width="100px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="NewsTag"
          :label="$t('message.newsTag')"
          fixed="right"
          width="140px"
          align="center"
        >
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.NewsTag" @change="StatusChange(scope.row, 'NewsTag')">
              <el-radio :label="1" style="width: 63px;margin: 0;margin-right: 38px;">N/A</el-radio>
              <el-radio :label="2" style="width: 55px;">noona hot</el-radio>
              <el-radio :label="3" style="width: 72px;margin-right: 20px;">nomall</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column
          prop="cateName"
          :label="$t('message.channel')"
          fixed="right"
          width="160px"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="cateChang" style="color:rgb(103, 194, 58)">
              {{ scope.row.cateName }}
              <el-button v-if="cateChang" type="text" style="cursor: pointer;" size="small" @click="cateChang = false">{{ $t('message.edit') }}</el-button>
            </div>
            <div v-else>
              <el-select style="width: 91%;" v-model="scope.row.cateId">
                <el-option
                  v-for="item in classificationOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button v-if="!cateChang" type="text" style="cursor: pointer;" size="small" @click="StatusChange(scope.row)">{{ $t('message.submit') }}</el-button>
            </div>
          </template>
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

    <preview-information ref="PreviewInformationDis" :mediaInfo="PreviewInformationMediaInfo" @handleClose="handleClose" v-if="PreviewInformationVisible"></preview-information>

  </div>
</template>

<script>
// 预览功能
import PreviewInformation from '@/components/PreviewInformation'
export default {
  name: 'informationList',
  components: { 
    PreviewInformation
  },
  data() {
    return {
      contentMGTloading: false,
      contentMGTData: [

      ],
      PreviewInformationVisible: false,
      PreviewInformationMediaInfo: {},
      from: {
        MediaId: '',
        cateId: '',
        MediaType: '',
        CheckStatus: '',
        StartTime: '',
        EndTime: '',
      },
      // 分类数据
      classificationOptions: [],
      // 类型数据 1视频5资讯
      typeOptions: [
        {
          name: this.$i18n.t('message.video'),
          value: 1
        },
        {
          name: this.$i18n.t('message.news'),
          value: 5
        }
      ],
      // 状态数据10:审核通过；5:待审核；1:禁用
      statusOptions: [
        {
          name: this.$i18n.t('message.passed'),
          value: 10
        },
        {
          name: this.$i18n.t('message.Checkpending'),
          value: 5
        },
        {
          name: this.$i18n.t('message.disabled'),
          value: 1
        }
      ],
      expireTimeOption: {
        disabledDate(date) {
          return (date.getTime()+24*3600*1000) <= Date.now();
        }
      },
      cateChang: true,
      UserInfo: {},
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
  methods: {
    getDataList() {
      this.contentMGTloading = true
      let obj = {}
      for (let i in this.from) {
        if (this.from[i] == null || this.from[i] == '') {
          this.from[i] = undefined
        } else {
          if (i == 'StartTime' || i == 'EndTime') {
            if (typeof this.from[i] != 'number') {
              this.from[i] = this.from[i].getTime() / 1000
            } else {
              this.from[i] = this.from[i] / 1000
            }
          }
        }
        obj[i] = this.from[i]
      }
      let Params = Object.assign({
        'AppID': 4,
        'Pn': this.pageIndex,
        'Ps': this.pageSize
      }, obj)
      this.$http({
        url: this.$http.LogUrl('/v1/media/list'),
        method: 'post',
        data: this.$http.adornParams(Params)
      }).then(data => {
        this.from.StartTime = this.from.StartTime * 1000
        this.from.EndTime = this.from.EndTime * 1000
        this.contentMGTloading = false
        // codeVerify [data] // 返回整体对象 [function] // 回调函数 [Params] // 回调函数携带参数
        var data = data
        let Obj = this.Utils.codeVerify(data, (Params) => {
          // 因app用户过多不能全部遍历
          window.ParamsObj = Params
          this.contentMGTloading = true
          this.$http({
            url: this.$http.LogUrl('/v1/media/list_category'),
            method: 'post',
            data: this.$http.adornParams({
              'Page': 1,
              'PageSize': 300,
            })
          }).then(data => {
            this.contentMGTloading = false
            // codeVerify [data] // 返回整体对象 [function] // 回调函数 [Params] // 回调函数携带参数
            let Obj = this.Utils.codeVerify(data, (Params) => {
              let vm = window.vue
              let MediaObj = window.ParamsObj.data.items.media
              let categoryObj = Params.data.items
              let newarr = []
              for (let i in MediaObj) {
                MediaObj[i] = Object.assign(MediaObj[i].basic, { cover: MediaObj[i].cover })
                if (MediaObj[i].mediaId.c) {
                  MediaObj[i].mediaId = this.Utils.langNumber(MediaObj[i].mediaId)
                }
                MediaObj[i].userName = window.ParamsObj.data.items.user[`${MediaObj[i].userId}`].basic.nickName
                for (let a = 0; a < categoryObj.length; a++) {
                  if (MediaObj[i].cateId == categoryObj[a].id) {
                    MediaObj[i].cateName = categoryObj[a].name
                  }
                }
                if (MediaObj[i].originAddTime) {
                  MediaObj[i].originAddTime = this.Utils.hoursResolution(MediaObj[i].originAddTime)
                }
                newarr.push(MediaObj[i])
              }
              newarr.forEach((v, i) => {
                v.NewsTag = v.NewsTag ? v.NewsTag : 1
                v.addTime = this.Utils.hoursResolution(v.addTime)
                v.auditorTime = v.addTime
                for (let c = 0; c < categoryObj.length; c++) {
                  if (v.cateId == categoryObj[c].id) {
                    v.cateName = categoryObj[c].name
                  }
                }
              })
              this.contentMGTData = []
              this.contentMGTData = newarr
              // 分类数据
              this.classificationOptions = []
              this.classificationOptions = categoryObj
            }, data)
            if (Obj.msg) {
              if (Obj.msg !== 'Failed') {
                this.$message.error(Obj.msg)
              } else {
                this.$message.error(this.$i18n.t('message.requestFailed'))
              }
            }
          })
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
    },
    handleSwitch (row) {

    },
    StatusChange (row, type) {
      if (type) {
        this.Changesubmit({ MediaId: row.mediaId, NewsTag: row.NewsTag })
      } else {
        this.Changesubmit({ MediaId: row.mediaId, CateId: row.cateId })
      }
    },
    Changesubmit (obj) {
      this.contentMGTloading = true
      this.$http({
        url: this.$http.LogUrl('/v1/media/media_update_fields'),
        method: 'post',
        data: this.$http.adornParams(obj)
      }).then(data => {
        this.contentMGTloading = false
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
    },
    // 预览展示
    PreviewInformationClick (row) {
      this.PreviewInformationMediaInfo = JSON.parse(JSON.stringify(row))
      this.PreviewInformationVisible = true
    },
    handleClose (row) {
      if (row) {
        this.getDataList()
      }
      this.InformationAdd = false
      this.PreviewInformationVisible = false
    }
  }
}
</script>

<style>
.addinformation .el-form-item__content {
  margin: 0 !important;
}
.search .el-form-item__content {
  display: flex;
}
</style>
