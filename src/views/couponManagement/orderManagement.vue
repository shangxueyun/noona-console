<template>
  <div v-loading="orderManagementloading" class="orderManagement">
    <div class="form_operation">
      <el-form :inline="true" style="display: flex;" label-width="80px" ref="formData" :model="formData" status-icon :rules="rules">
        <el-form-item class="typeClass" style="float: left;width: 27%;display: flex;" :label="this.$i18n.t('message.Order') + this.$i18n.t('message.type')" prop="type" :rules="rules.type">
            <el-select v-model="formData.type" :placeholder="this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.Order') + this.$i18n.t('message.type')">
              <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item class="statusClass" style="float: left;width: 27%;display: flex;" :label="this.$i18n.t('message.Order') + this.$i18n.t('message.status')" prop="status" :rules="rules.status">
            <el-select v-model="formData.status" :placeholder="this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.Order') + this.$i18n.t('message.status')">
              <el-option
                v-for="item in statusOptions"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item class="timeClass" style="float: left;width:38%" :label="this.$i18n.t('message.time')">
          <el-date-picker
            v-model="formData.time"
            style="width: 100%;"
            type="datetimerange"
            range-separator="-"
            value-format="yyyy-MM-dd HH:mm:ss"
            :start-placeholder="this.$i18n.t('message.startTime')"
            :end-placeholder="this.$i18n.t('message.endTime')">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="float: right;margin-right: 0;">
          <!-- <el-button type="primary" @click="AddSaveShow">{{ $t('message.newOperation') }}</el-button> -->
          <el-button type="primary" @click="SearchList">{{ $t('message.search') }}</el-button>
        </el-form-item>
        <el-form-item style="float: right;margin-right: 0;">
          <!-- <el-button type="primary" @click="AddSaveShow">{{ $t('message.newOperation') }}</el-button> -->
          <el-button  @click="exportExcel" type="primary" style="margin-left: 4px;">{{ $t('message.exportExcel') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="orderManagementData"
        class="orderManagementDataTable"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          :label="$t('message.number')"
          width="50"
          align="center"
        />
        <el-table-column
          prop="typeName"
          :label="$t('message.type')"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="goodsName"
          :show-overflow-tooltip="true"
          :label="$t('message.goodsName')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="userId"
          :label="$t('message.userId')"
          :show-overflow-tooltip="true"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="nickName"
          :label="$t('message.user')+$t('message.name')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="details"
          :label="$t('message.details')"
          header-align="center"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.type == 7 && scope.row.details.couponCode" style="text-align: left;">
              <p>{{ $t('message.Code') }}: {{ scope.row.details.couponCode }}</p>
              <p>{{ $t('message.valid') + $t('message.time') }}: {{ scope.row.details.expireTime }}</p>
            </div>
            <div v-if="scope.row.type == 8 && scope.row.details.operator" style="text-align: left;">
              <p>{{ $t('message.callCarrier') }}: {{ scope.row.details.operator }}</p>
              <p>{{ $t('message.prepaidNumber') }}: {{ scope.row.details.phone }}</p>
            </div>
            <div v-if="scope.row.type == 9 && scope.row.details.name" style="text-align: left;">
              <p>{{ $t('message.Name') }}: {{ scope.row.details.name }} </p>
              <p>{{ $t('message.phone') }}: {{ scope.row.details.phone }} </p>
              <p>{{ $t('message.address') }}: {{ scope.row.details.address }} </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="placeOrderTime"
          width="160"
          :label="$t('message.orderTime')"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('message.user')+$t('message.status')"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">未处理</div>
            <div v-else style="color:#369A68">已处理</div>
          </template>
        </el-table-column>
        <el-table-column
            prop="operation"
            :label="$t('message.operation')"
            width="150"
            align="center"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.type == 8 && scope.row.details.operator" style="display: flex;flex-direction: row;flex-wrap: wrap;justify-content: center;">
                  <el-button v-if="scope.row.status == 0" style="cursor: pointer;" type="text" size="small" @click="MarkedRelease(scope.row)">{{ $t('message.MarkedRelease') }}</el-button>
                </div>
                <div v-if="scope.row.type == 9 && scope.row.details.name" style="display: flex;flex-direction: row;flex-wrap: wrap;justify-content: center;">
                  <el-button v-if="scope.row.status == 0" style="cursor: pointer;" type="text" size="small" @click="editHandle(scope.row)">{{ $t('message.edit') }}</el-button>
                  <el-button style="cursor: pointer;" type="text" size="small" @click="ViewHandle(scope.row)">{{ $t('message.View') }}</el-button>
                </div>
              </template>
            </el-table-column>
      </el-table>
    </div>

    <div style="padding-top: 14px;">
      <el-pagination
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
      />
    </div>

    <div>
      <el-dialog
        :title="$t('message.mailingInformation')"
        :visible.sync="orderManagementDialogVisible"
        width="30%"
        :before-close="handleClose">
          <el-form ref="mailingInformation" :model="mailingInformation" :rules="mailingInformationRules">
            <el-form-item :label="this.$i18n.t('message.mailCompany')" prop="logistics" :rules="rules.logistics">
              <el-input :disabled="ViewHandleVisible" v-model="mailingInformation.logistics" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.mailCompany')"></el-input>
            </el-form-item>
            <el-form-item :label="this.$i18n.t('message.courierNumber')" prop="logisticsNum" :rules="rules.logisticsNum">
              <el-input :disabled="ViewHandleVisible" v-model="mailingInformation.logisticsNum" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.courierNumber')"></el-input>
            </el-form-item>
          </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">{{ this.$i18n.t('message.cancel') }}</el-button>
          <el-button :disabled="ViewHandleVisible" type="primary" @click="productionSubmit">{{ this.$i18n.t('message.confirm') }}</el-button>
        </span>
      </el-dialog>
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
      orderManagementData: [
        { id: 1, images: 'http://f.hiphotos.baidu.com/image/pic/item/0e2442a7d933c8956c0e8eeadb1373f08202002a.jpg', sizeRelated: 'sdadadad.jpg', jumpAddress: 'www.baidu.com' }
      ],
      orderManagementloading: false,
      orderManagementDialogVisible: false,
      ViewHandleVisible:false,
      activateDataFlg: false,
      // 7卡券； 8话费； 9实物
      typeOptions: [
        {id:7, value:'卡券'},
        {id:8, value:'话费'},
        {id:9, value:'实物'}
      ],
      // 状态 0未处理 1已处理
      statusOptions: [
        {id:0, value:'未处理'},
        {id:1, value:'已处理'}
      ],
      formData: {
        type: 8,
        status: 0,
        time: ''
      },
      mailingInformation: {
        logistics: '',
        logisticsNum: ''
      },
      rules: {
        type: [{ required: true, message: this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.Order') + this.$i18n.t('message.type'), trigger: 'blur' }],
        status: [{ required: true, message: this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.Order') + this.$i18n.t('message.status'), trigger: 'blur' }]
      },
      mailingInformationRules: {
        logistics: [{ required: true, message: this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.mailCompany'), trigger: 'blur' }],
        logisticsNum: [{ required: true, message: this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.courierNumber'), trigger: 'blur' }]
      },
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      activateData: {
        id: false
      }
    }
  },
  computed: {

  },
  watch: {
    activateDataFlg(value) {

    }
  },
  created() {
    this.getDataList()
  },
  mounted() {

  },
  methods: {
    getDataList() {
      this.orderManagementloading = true
      let arr
      if (this.formData.time){
        arr = JSON.parse(JSON.stringify(this.formData.time))
      } else {
        arr = []
      }
      this.$http({
        url: this.$http.adornUrl('/service/media/v1/treasure/orderManageList'),
        method: 'post',
        data: this.$http.adornParams({
          'orderType': this.formData.type,
          'orderStatus': this.formData.status,
          'startTime': arr[0],
          'endTime': arr[1],
          'page': this.pageIndex.toString(),
          'size': this.pageSize
        })
      }).then(data => {
        this.orderManagementloading = false
        if (data.status === 200) {
          var data = data.data
          data.orders.forEach((v, i)=>{
            if (v.type == '7') {
              v.typeName = '卡券'
            } else if(v.type == '8') {
              v.typeName = '话费'
            } else if(v.type == '9'){
              v.typeName = '实物'
            }
            if (v.details != '') {
              v.details = JSON.parse(v.details)
            }
          })
          this.orderManagementData = []
          this.orderManagementData = data.orders
          // 页码 缺总数
          this.totalPage = Number(data.total)
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
    MarkedRelease(row) {
      let info = row.details
      this.$http({
        url: this.$http.adornUrl('/service/media/v1/treasure/submitReward'),
        method: 'post',
        data: this.$http.adornData({
          phase: row.phase,
          info: JSON.stringify(info),
          status: 1
        })
      }).then(data => {
        if (data.status === 200) {
          var data = data.data
          if (data.ret == '1' || data.msg) {
            this.getDataList()
            this.$message({
              type: 'success',
              message: this.$i18n.t('message.successfulOperation')
            })
          } else {
            this.$message.error(this.$i18n.t(data.data.msg))
            this.getDataList()
          }
        } else {
          this.productListloading = false
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    ViewHandle(row) {
      let details = row.details
      if (details.logistics){
        this.mailingInformation = {}
        this.mailingInformation = {
          logistics: details.logistics,
          logisticsNum: details.logisticsNum
        }
        this.ViewHandleVisible = true
        this.orderManagementDialogVisible = true
      }
    },
    editHandle(row) {
      this.orderManagementDialogVisible = true
      let details = row.details
      if (details.logistics) {
        this.mailingInformation = {}
        this.mailingInformation = {
          logistics: details.logistics,
          logisticsNum: details.logisticsNum,
          phase: row.phase,
          details: details,
        }
      } else {
        this.mailingInformation = {
          logistics: '',
          logisticsNum: '',
          phase: row.phase,
          details: row.details,
        }
      }
    },
    productionSubmit() {
      this.$refs['mailingInformation'].validate((valid) => {
        if (valid) {
          //接口
          let details = this.mailingInformation.details
          details.logistics = this.mailingInformation.logistics
          details.logisticsNum = this.mailingInformation.logisticsNum
          const params = {
            phase: this.mailingInformation.phase,
            info: JSON.stringify(details),
            status: 1
          }
          this.orderManagementloading = true
          this.$http({
            url: this.$http.adornUrl('/service/media/v1/treasure/submitReward'),
            method: 'post',
            data: this.$http.adornData(params)
          }).then(data => {
            if (data.status === 200) {
              var data = data.data
              this.orderManagementloading = false
              if (data.ret == '1' || data.msg) {
                this.orderManagementDialogVisible = false
                this.getDataList()
                this.$message({
                  type: 'success',
                  message: this.$i18n.t('message.successfulOperation')
                })
              } else {
                this.$message.error(this.$i18n.t(data.data.msg))
                this.getDataList()
              }
            } else {
              this.productListloading = false
              this.$message.error(this.$i18n.t('message.requestFailed'))
            }
          })
        }
      })
    },
    exportExcel() { 
      // 设置当前日期
      let time = new Date();
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      let Hour = time.getHours();
      let Min = time.getMinutes();
      let Second = time.getSeconds();
      let name = `${year}${month}${day}${Hour}${Min}${Second}`;
      // console.log(name)
      /* generate workbook object from table */
      //  .table要导出的是哪一个表格 (table,{raw:true})
      var wb = XLSX.utils.table_to_book(document.querySelector(".orderManagementDataTable"), {raw:true});
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        //  name+'.xlsx'表示导出的excel表格名字
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          name + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    SearchList() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.pageIndex = 1
          this.getDataList()
        }
      })
    },
    handleClose () {
      this.orderManagementDialogVisible = false
    },
    ChildUploadClose(value) {
      if (value) {
        this.ChildUploadFlg = false
        this.$refs.singleTable.setCurrentRow('')
      } else {
        this.ChildUploadFlg = false
      }
      this.activateDataFlg = false
      this.getDataList()
    }
  }
}
</script>

<style>
.orderManagement .typeClass .el-form-item__content{
  width: 67% !important;
}
.orderManagement .statusClass .el-form-item__content{
  width: 67% !important;
}
.orderManagement .timeClass .el-form-item__content{
  width: 70% !important;
}
</style>
