<template>
  <div v-loading="indianaRulesloading" class="indianaRules">
    <div class="form_indianaRules">
      <el-form :inline="true">
        <el-form-item style="float: right;margin-right: 0;">
          <el-button type="primary" @click="AddSaveShow">{{ $t('message.Add') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="indianaRulesData"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          :label="$t('message.number')"
          width="80"
          align="center"
        />
        <el-table-column
          prop="imgUrl"
          :label="$t('message.images')"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <img style="max-width: 100px;max-height: 200px;" :src="scope.row.imgUrl" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          :label="$t('message.goodsName')"
          :show-overflow-tooltip="true"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="personTime"
          :label="$t('message.needNumber')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="totalInventory"
          :label="$t('message.totalInventory')"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div style="color:#1890ff">{{ scope.row.totalInventory }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="dailyInventory"
          :label="$t('message.dailyInventory')"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div style="color:#1890ff" v-if="scope.row.state != 1">{{ scope.row.dailyInventory }}</div>
            <div v-else style="color:#1890ff;cursor: pointer;" @click="inventory(scope.row)">{{ scope.row.dailyInventory }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('message.state')"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              class="switchStyle"
              active-color="#dcdfe6"
              inactive-color="#409eff"
              :active-value="0"
              :inactive-value="1"
              active-text="已下线"
              inactive-text="已上线"
              @change="handleSwitch(scope.row)"
            />
            <el-button v-if="scope.row.state == 1" style="cursor: pointer;color:red;" type="text" size="small" @click="forcedOffline(scope.row)">{{ $t('message.forcedOffline') }}</el-button>
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
              <!-- // 7卡券； 8话费； 9实物 sourceType checkStatus-->
              <el-button style="cursor: pointer;" type="text" size="small" @click="indianaRulesEdit(scope.row)">{{ $t('message.edit') }}</el-button>
              <el-button v-if="Number(scope.row.sourceType) < 8" style="cursor: pointer;" type="text" size="small" @click="View(scope.row)">{{ $t('message.View') + $t('message.Code') }}</el-button>
              <el-button v-if="scope.row.state != 1" style="cursor: pointer;" type="text" size="small" @click="cancelingTime(scope.row)">{{ $t('message.cancelingTime') }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- <div style="padding-top: 14px;">
      <el-pagination
        :current-page="pageIndex"
        :page-sizes="[5, 10]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
      />
    </div> -->

    <create-indiana-rules v-if="indianaRulesloadFlg" ref="CreateIndianaRules" @indianaRulesloadFlgClose="indianaRulesloadFlgClose" />

    <coupon-list v-if="CouponListVisible" ref="CouponList" @addProductVisible="addProductVisible" />
  </div>
</template>

<script>

import CreateIndianaRules from './components/CreateIndianaRules'
import CouponList from './components/CouponList'
export default {
  components: {
    CreateIndianaRules,
    CouponList
  },
  data() {
    return {
      indianaRulesData: [

      ],
      indianaRulesloadFlg: false,
      indianaRulesloading: false,
      CouponListVisible: false,
      pageIndex: 1,
      pageSize: 5,
      totalPage: 0
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
      this.indianaRulesloading = true
      this.$http({
        url: this.$http.adornUrl('/service/media/v1/treasure/ruleList'),
        method: 'post'
      }).then(data => {
        if (data.status === 200) {
          this.indianaRulesData = []
          if({data} && data.data) {
            let rules = data.data.rules
            let mediaIdArr = []
            let ObjData = []
            if (rules.length > 0) {
              rules.forEach((v,i)=>{
                let Obj = JSON.parse(v.detail)[0]
                delete v.detail
                v.state = v.status
                v.status = Number(v.status)
                ObjData.push(Object.assign(Obj,v))
                mediaIdArr.push(Obj.mediaId)
              })
              this.$http({
                url: this.$http.adornUrl('/service/media/v1/getAll'),
                method: 'post',
                data: this.$http.adornData({
                    "ids": mediaIdArr
                })
              }).then(data => {
                if (data.status === 200) {
                  let medias = data.data.medias
                  ObjData.forEach((v,i)=>{
                    for(let o in medias){
                      if(medias[o].basic.mediaId == v.mediaId){
                        if (medias[o].basic.checkStatus == 10) {
                          ObjData[i].checkStatus = 1
                        } else {
                          ObjData[i].checkStatus = 0
                        }
                        ObjData[i].imgUrl = medias[o].cover[1].coverObj['1'].url
                        ObjData[i].name = medias[o].basic.summary
                        ObjData[i].sourceType = medias[o].basic.sourceType
                      }
                    }
                  })
                  this.indianaRulesData = ObjData
                  this.indianaRulesloading = false
                } else {
                  this.$message.error(this.$i18n.t('message.requestFailed'))
                }
              })
            } else {
              this.indianaRulesloading = false
            }
          }
        } else {
          this.indianaRulesloading = false
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    AddSaveShow(obj) {
      this.indianaRulesloadFlg = true
      this.$nextTick(() => {
        this.$refs.CreateIndianaRules.init(Object.assign({ bouncedTitle: this.$i18n.t('message.Add') }))
      })
    },
    indianaRulesEdit(row) {
      this.indianaRulesloadFlg = true
      this.$nextTick(() => {
        this.$refs.CreateIndianaRules.init(Object.assign({ bouncedTitle: this.$i18n.t('message.modify') }, { data: row }))
      })
    },
    cancelingTime(row) {
      this.$confirm(this.$i18n.t('message.deletePromptText') + '?', this.$i18n.t('message.deletePrompt'), {
        confirmButtonText: this.$i18n.t('message.confirm'),
        cancelButtonText: this.$i18n.t('message.cancel'),
        type: 'warning'
      }).then(() => {
        this.indianaRulesloading = true
        this.$http({
          url: this.$http.adornUrl('/service/media/v1/rule/set'),
          method: 'post',
          data: this.$http.adornData({
            'type':2,
            'deleteIds': [
              row.id
            ]
          })
        }).then(data => {
          this.indianaRulesloading = false
          if (data.status === 200) {
            this.$message({
              type: 'success',
              message: this.$i18n.t('message.successfulOperation')
            })
            this.getDataList()
          } else {
            this.$message.error(this.$i18n.t('message.requestFailed'))
          }
        })
      }).catch(() => {
      
      });
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
    View(row) {
      this.CouponListVisible = true
      this.$nextTick(() => {
        this.$refs.CouponList.init({ bouncedTitle: this.$i18n.t('message.couponCodelist'), mediaId: row.mediaId })
      })
    },
    // 后续添加数字查看
    inventory(row) {
      this.indianaRulesloading = true
      this.$http({
        url: this.$http.adornUrl('/service/media/v1/treasure/inventory'),
        method: 'post',
        data: this.$http.adornParams({
          'mediaId': row.mediaId,
        })
      }).then(({data}) => {
        if (data) {
          this.indianaRulesloading = false
          this.$message({
            iconClass: 'asdasda',
            message: this.$i18n.t('message.dailyInventory') + this.$i18n.t('message.remain') + " " + data.inventory,
            type: 'success'
        })
        } else {
          this.indianaRulesloading = false
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    // 强行下线
    forcedOffline(row) {
      // 
      debugger
      this.indianaRulesloading = true
      this.$http({
        url: this.$http.adornUrl('/service/media/v1/treasure/hotTopics'),
        method: 'post',
        data: this.$http.adornData({
          'type': 0,
          'mediaId': row.mediaId,
          'page': 1,
          'size': 10
        })
      }).then(data => {
        if (data.status === 200) {
          var data = data.data
          if (!data.topics.length) {
            this.$message.error(this.$i18n.t(data.msg))
            this.getDataList()
          } else {
            let phase_id = data.topics[0].phaseDetail.phaseStr
            let status = data.topics[0].phaseDetail.status
            this.$confirm(this.$i18n.t('message.participated') + '?', this.$i18n.t('message.operationPrompt'), {
              confirmButtonText: this.$i18n.t('message.confirm'),
              cancelButtonText: this.$i18n.t('message.cancel'),
              type: 'warning'
            }).then(() => {
              // 其他需要上下线，0正常调
              this.bottomLine(row, this.forcedOfflineAjax, phase_id, 2,status)
            }).catch(() => {
              this.productListloading = false
              this.getDataList()
            })
          }
        } else {
          this.indianaRulesloading = false
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    forcedOfflineAjax(phase_id) {
      this.indianaRulesloading = true
      this.$RequestHeader.ForcedOffline({
          'phase_id': phase_id
      }, '/v1/treasure/refund').then(data => {
        if (data.status === 200) {
          this.indianaRulesloading = false
          if (!data.data) {
            this.$message.error(this.$i18n.t(data.data.msg))
            this.getDataList()
          } else {
            this.getDataList()
            this.$message({
              type: 'success',
              message: this.$i18n.t('message.successfulOperation')
            })
          }
        } else {
          this.indianaRulesloading = false
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    // 上架下架 bottomLine
    handleSwitch(row) {
      let checkStatus
      debugger
      this.indianaRulesloading = true
      this.$confirm(this.$i18n.t('message.operationPromptText') + '?', this.$i18n.t('message.operationPrompt'), {
        confirmButtonText: this.$i18n.t('message.confirm'),
        cancelButtonText: this.$i18n.t('message.cancel'),
        type: 'warning'
      }).then(() => {
        this.bottomLine(row)
      }).catch(() => {
        this.productListloading = false
        this.getDataList()
      });
    },
    // 
    bottomLine(row, fonc, phase_id, type, status) {
      let checkStatus
      if (!type) {
        type = 1
        if (row.status === 0) { checkStatus = 0 } else { checkStatus = 1 }
      } else {
        if (row.status === 0) { checkStatus = 1 } else { checkStatus = 0 }
      }
      this.$http({
        url: this.$http.adornUrl('/service/media/v1/rule/upDownLine'),
        method: 'post',
        data: this.$http.adornData({
          'type': type,
          'id': row.id,
          'mediaId': row.mediaId,
          'status': checkStatus
        })
      }).then(data => {
        if (data.status === 200) {
          this.indianaRulesloading = false
          if (!data.data.ret || data.data.msg) {
            this.$message.error(this.$i18n.t(data.data.msg))
            this.getDataList()
          } else {
            if (fonc) {
              if (status == 0) {
                fonc(phase_id)
              } else {
                this.getDataList()
              }
            } else {
              this.getDataList()
              this.$message({
                type: 'success',
                message: this.$i18n.t('message.successfulOperation')
              })
            }
          }
        } else {
          this.indianaRulesloading = false
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    addProductVisible() {
      this.CouponListVisible = false
    },
    indianaRulesloadFlgClose(value) {
      if (value) {
        this.indianaRulesloadFlg = false
        this.$refs.singleTable.setCurrentRow('')
      } else {
        this.indianaRulesloadFlg = false
      }
      this.activateDataFlg = false
      this.getDataList()
    }
  }
}
</script>

<style lang="scss" scoped>
.indianaRules{
  .sizeRelatedList{
    li{
      list-style: none;
      width: 68%;
      margin: 0 auto;
      text-align: center;
      font-size: 16px;
      line-height: 34px;
    }
  }
}

</style>
