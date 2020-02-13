<template>
  <div v-loading="informationListloading" class="informationList-container">
    <div class="form_operation">
      <el-form>
        <el-form-item class="addinformation" style="float:right">
          <!-- <el-button type="primary" @click="AddSaveShow">{{ $t('message.newOperation') }}</el-button> -->
          <el-button icon="el-icon-plus" type="primary" @click="addOrUpdateHandle">{{ $t('message.addInformation') }}</el-button>
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
        :data="informationListData"
        class="informationListTable"
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
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <a style="color:#1682e6" @click="PreviewInformationClick(scope.row)">{{ scope.row.mediaId }}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          :label="$t('message.title2')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="userName"
          :label="$t('message.userName')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="cateName"
          :label="$t('message.classification')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="mediaType"
          :label="$t('message.type')"
          header-align="center"
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
          prop="originAddTime"
          :label="$t('message.Pubdate')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="checkStatus"
          :label="$t('message.status')"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.checkStatus == 10" style="color:rgb(103, 194, 58)">
              {{ $t('message.passed') }}
            </div>
            <div v-else-if="scope.row.checkStatus == 5">
              {{ $t('message.Checkpending') }}
            </div>
            <div v-else style="color:rgb(204, 204, 204)">
              {{ $t('message.disabled') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          :label="$t('message.operation')"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <div style="display: flex;flex-direction: row;flex-wrap: wrap;justify-content: center;">
              <el-button icon="el-icon-edit" type="primary" style="cursor: pointer;" size="small" @click="editOrUpdateHandle(scope.row)">{{ $t('message.edit') }}</el-button>
              <el-button v-if="scope.row.checkStatus == 10" type="warning" icon="el-icon-warning" style="cursor: pointer;" size="small" @click="disabled(scope.row)">{{ $t('message.enabled') }}</el-button>
              <el-button v-if="scope.row.checkStatus == 1" type="warning" icon="el-icon-warning" style="cursor: pointer;" size="small" @click="disabled(scope.row)">{{ $t('message.disabled') }}</el-button>
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

    <div v-if="InformationAdd">
      <information-add :Title="this.$i18n.t('message.addInformation')" :classificationOptions="classificationOptions" @handleClose="handleClose"></information-add>
    </div>

    <information-edit
      v-if="InformationeditVisible"
      ref="InformationeditDom"
      :Title="`${this.$i18n.t('message.edit')}${this.$i18n.t('message.media')}`"
      :classificationOptions="classificationOptions"
      :fileType="fileType"
      :IEditObject="IEditObject"
      @handleClose="handleClose">
    </information-edit>
  </div>
</template>

<script>
import InformationAdd from './components/InformationAdd'
import InformationEdit from './components/InformationEdit'
// 预览功能
import PreviewInformation from '@/components/PreviewInformation'
export default {
  name: 'informationList',
  components: { 
    PreviewInformation,
    InformationAdd,
    InformationEdit
  },
  data() {
    return {
      informationListloading: false,
      informationListData: [

      ],
      InformationAdd: false,
      InformationeditVisible: false,
      PreviewInformationVisible: false,
      PreviewInformationMediaInfo: {},
      from: {
        cateId: '',
        MediaType: '',
        CheckStatus: '',
        StartTime: '',
        EndTime: '',
      },
      // 编辑数据
      fileType: '',
      IEditObject: '',
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
      this.informationListloading = true
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
        this.informationListloading = false
        // codeVerify [data] // 返回整体对象 [function] // 回调函数 [Params] // 回调函数携带参数
        var data = data
        let Obj = this.Utils.codeVerify(data, (Params) => {
          // 因app用户过多不能全部遍历
          window.ParamsObj = Params
          this.informationListloading = true
          this.$http({
            url: this.$http.LogUrl('/v1/media/list_category'),
            method: 'post',
            data: this.$http.adornParams({
              'Page': 1,
              'PageSize': 300,
            })
          }).then(data => {
            this.informationListloading = false
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
              this.informationListData = []
              this.informationListData = newarr
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
    addOrUpdateHandle (row) {
      this.InformationAdd = true
    },
    editOrUpdateHandle (row) {
      debugger
      this.InformationeditVisible = true
      this.IEditObject = JSON.parse(JSON.stringify(row))
      if (row.mediaType == 5) {
        this.fileType = 'image'
      } else {
        this.fileType = 'video'
      }
      this.$nextTick(function () {
        this.$refs.InformationeditDom.RichTextContentValueAnalysis(this.IEditObject)
      })
    },
    disabled (row) {
      this.$confirm(this.$i18n.t('message.operationPromptText'), this.$i18n.t('message.operationPrompt'), {
        confirmButtonText: this.$i18n.t('message.confirm'),
        cancelButtonText: this.$i18n.t('message.cancel'),
        type: 'warning'
      }).then(() => {
        this.Newusersloading = true
        let status
        if (row.status == 1) {
          status = 5
        } else if (row.status == 5) {
          status = 1
        }
        this.$http({
          url: this.$http.LogUrl('/v1/users/set_status'),
          method: 'post',
          data: this.$http.adornParams({
            'UserID': row.userID,
            'Status': status,
          })
        }).then(data => {
          this.Newusersloading = false
          // codeVerify [data] // 返回整体对象 [function] // 回调函数 [Params] // 回调函数携带参数
          let Obj = this.Utils.codeVerify(data, this.getDataList)
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
      
      });
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
