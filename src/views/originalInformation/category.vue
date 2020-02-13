<template>
  <div v-loading="categoryloading" class="category-container">
    <div class="form_operation">
      <el-form label-width="60px">
        <el-form-item class="addUser" style="float:left">
          <!-- <el-button type="primary" @click="AddSaveShow">{{ $t('message.newOperation') }}</el-button> -->
          <el-button icon="el-icon-plus" type="primary" @click="addOrUpdateHandle">{{ $t('message.newClassification') }}</el-button>
        </el-form-item>
        <el-form-item :label="$t('message.status')">
          <el-select v-model="disabledStatus" :placeholder="this.$i18n.t('message.pleaseSelect')">
            <el-option
              v-for="item in disabledOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button icon="el-icon-search" style="margin-left: 28px;" :disabled="disabledStatus ? false : true" :type="disabledStatus ? 'primary' : 'info'" @click="getDataList">{{ $t('message.search') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="categoryData"
        class="categoryDataTable"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="ID"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="sort"
          :label="$t('message.sort')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          :label="$t('message.name')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="englishName"
          :label="$t('message.englishName')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="isEnabled"
          :label="$t('message.isEnabled')"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.status == 1">{{ $t('message.enabled') }}</div>
            <div v-if="scope.row.status == 2">{{ $t('message.disabled') }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          :label="$t('message.remark')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="create_time"
          :label="$t('message.createTimes')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="operation"
          :label="$t('message.operation')"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <div style="display: flex;flex-direction: row;flex-wrap: wrap;justify-content: center;">
              <el-button icon="el-icon-edit" type="primary" style="cursor: pointer;" size="small" @click="addOrUpdateHandle(scope.row)">{{ $t('message.edit') }}</el-button>
              <el-button v-if="scope.row.status == 2" type="warning" icon="el-icon-warning" style="cursor: pointer;" size="small" @click="disabled(scope.row)">{{ $t('message.enabled') }}</el-button>
              <el-button v-if="scope.row.status == 1" type="warning" icon="el-icon-warning" style="cursor: pointer;" size="small" @click="disabled(scope.row)">{{ $t('message.disabled') }}</el-button>
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

    <!-- <div v-if="AddModificationDialogVisible">
      <newusers-add :Title="$t('message.addUser')" :UserInfo="UserInfo" @handleClose="handleClose" ref="administratorAdd"></newusers-add>
    </div> -->
  </div>
</template>

<script>
import NewusersAdd from './components/NewusersAdd'
export default {
  components: {
    NewusersAdd
  },
  data() {
    return {
      categoryloading: false,
      categoryData: [

      ],
      disabledOptions: [
        {
          name: this.$i18n.t('message.enabled'),
          value: 1
        },
        {
          name: this.$i18n.t('message.disabled'),
          value: 2
        }
      ],
      AddModificationDialogVisible: false,
      disabledStatus: '',
      UserInfo: {},
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
      this.categoryloading = true
      if (this.disabledStatus == '') {
        this.disabledStatus = undefined
      }
      this.$http({
        url: this.$http.LogUrl('/v1/media/list_category'),
        method: 'post',
        data: this.$http.adornParams({
          'status': this.disabledStatus,
          'Page': this.pageIndex,
          'PageSize': this.pageSize
        })
      }).then(data => {
        this.categoryloading = false
        // codeVerify [data] // 返回整体对象 [function] // 回调函数 [Params] // 回调函数携带参数
        var data = data
        let Obj = this.Utils.codeVerify(data, (Params) => {
          this.categoryData = []
          this.categoryData = Params.data.items
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
      this.UserInfo = {}
      this.AddModificationDialogVisible = true
      if (row) {
        this.UserInfo = JSON.parse(JSON.stringify(row))
      }
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
    handleClose (row) {
      if (row) {
        this.getDataList()
      }
      this.AddModificationDialogVisible = false
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
