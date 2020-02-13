<template>
  <div v-loading="AdministratorListloading" class="AdministratorList">
    <div class="form_operation">
      <el-form>
        <el-form-item>
          <!-- <el-button type="primary" @click="AddSaveShow">{{ $t('message.newOperation') }}</el-button> -->
          <el-button icon="el-icon-plus" type="primary" @click="addOrUpdateHandle()">{{ $t('message.Add') }}{{ $t('message.administrator') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="AdministratorListData"
        class="AdministratorListDataTable"
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
          prop="cover"
          :label="$t('message.Portraits')"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              <img style="100%;height:100%" :src="scope.row.cover" alt="">
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          :label="$t('message.Account')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="nickName"
          :label="$t('message.nickName')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('message.Locking')"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.status == 1">正常</div>
            <div v-else>禁用</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          :label="$t('message.Registration')"
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
              <el-button icon="el-icon-delete" type="danger" style="cursor: pointer;" size="small" @click="cancelingTime(scope.row)">{{ $t('message.cancelingTime') }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="padding-top: 14px;">
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

    <div v-if="AddModificationDialogVisible">
      <administrator-add @handleClose="handleClose" ref="administratorAdd"></administrator-add>
    </div>
  </div>
</template>

<script>
import AdministratorAdd from './components/AdministratorAdd'
export default {
  components: {
    AdministratorAdd
  },
  data() {
    return {
      AdministratorListloading: false,
      AdministratorListData: [

      ],
      AddModificationDialogVisible: false,
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
    this.getDataList()
  },
  mounted() {

  },
  methods: {
    getDataList() {
      this.AdministratorListloading = true
      this.$http({
        url: this.$http.LogUrl('/v1/admin/list'),
        method: 'post',
        data: this.$http.adornParams({
          'Page': 1,
          'PageSize': 999
        })
      }).then(data => {
        this.AdministratorListloading = false
        if (data.status === 200) {
          data = data.data
          let list = data.items.list
          if (list) {
            this.AdministratorListData = []
            this.AdministratorListData = list
          }
        } else {
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
    handleSwitch (row) {

    },
    addOrUpdateHandle (row) {
      let obj = {}
      if (row) {
        obj = row
      }
      this.AddModificationDialogVisible = true
      this.$nextTick(() => {
        this.$refs.administratorAdd.initData(obj)
      })
    },
    cancelingTime (row) {
      this.$confirm(this.$i18n.t('message.deletePromptText') + '?', this.$i18n.t('message.deletePrompt'), {
        confirmButtonText: this.$i18n.t('message.confirm'),
        cancelButtonText: this.$i18n.t('message.cancel'),
        type: 'warning'
      }).then(() => {
        this.AdministratorListloading = true
        this.$http({
          url: this.$http.LogUrl('/v1/admin/del'),
          method: 'post',
          data: this.$http.adornParams({
            'Id': row.id
          })
        }).then(data => {
          this.AdministratorListloading = false
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

</style>
