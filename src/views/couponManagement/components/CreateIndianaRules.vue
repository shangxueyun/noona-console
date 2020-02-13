<template>
  <div>
    <el-dialog
      v-loading="CreateIndianaRulesloading"
      :title="bouncedTitle"
      :visible="true"
      class="CreateRule"
      width="60%"
      :modal-append-to-body="true"
      :append-to-body="true"
      :before-close="clearClose"
    >
      <!--  -->
      <el-form ref="from" :inline="true" :model="from" label-width="80px" :rules="rules">
        <el-form-item style="float: left;width:48%" prop="mediaId" :rules="rules.mediaId" :label="this.$i18n.t('message.selectGoods')">
          <el-select v-model="from.mediaId" style="width:100%" @change="mediaInfoFun" :disabled="ViewDetails" :placeholder="$t('message.pleaseSelect') + $t('message.goods')" @focus="setMinWidth">
            <el-option
              v-for="item in selectGoodsOptions"
              :key="item.id"
              :style="{'max-width': minWidth + 'px'}"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="float: right;width:48%" prop="personTime" :rules="rules.personTime" :label="this.$i18n.t('message.needMore')">
          <el-input :disabled="totalInventoryDis" v-model="from.personTime" style="width:100%" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.needMore')" />
        </el-form-item>
        <span style="display: block;clear: both;" />
        <el-form-item style="float: left;width:48%" prop="totalInventory" :rules="rules.totalInventory" :label="this.$i18n.t('message.repertory')">
          <el-input v-model="from.totalInventory" disabled="disabled" />
        </el-form-item>
        <el-form-item style="float: left;width:48%;padding-left: 14px;" prop="dailyInventory" :rules="rules.dailyInventory" :label="this.$i18n.t('message.dailyInventoryS')">
          <el-input v-model="from.dailyInventory" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.dailyInventoryS')" />
        </el-form-item>
        <span style="display: block;clear: both;" />
        <el-form-item style="width:35%" label=" ">
          <el-button :disabled="ImportCouponsDis" style="width:100%" type="primary" @click="ImportCouponsF">{{ $t('message.addInventory') }}</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearClose">{{ $t('message.cancel') }}</el-button>
        <el-button type="primary" @click="productionSubmit">{{ $t('message.confirm') }}</el-button>
      </span>
    </el-dialog>

    <import-coupons v-if="ImportCouponsVisible" ref="ImportCoupons" @addProductVisible="addProductVisible" />
  </div>

</template>

<script>
import ImportCoupons from './ImportCoupons'
export default {
  components: {
    ImportCoupons
  },
  data() {
    var validateRepertory = (rule, value, callback) => {
      if (value !== '') {
        if (isNaN(Number(value))) {
          callback(new Error(this.$i18n.t('message.PleaseNumber')))
        } else {
          if (Number(value) > 0) {
            if (value.toString().indexOf('.') >= 0) {
              callback(new Error(this.$i18n.t('message.enteredIncorrectly')))
            } else {
              if (value.length > 9) {
                callback(new Error(this.$i18n.t('message.Exceedinglimit')))
              } else {
                callback()
              }
            }
          } else {
            callback(new Error(this.$i18n.t('message.PleaseNumber') + this.$i18n.t('message.inventoryQuantity')))
          }
        }
      } else { callback(new Error(this.$i18n.t('message.PleaseNumber'))) }
    }
    return {
      bouncedTitle: '',
      CreateIndianaRulesloading: false,
      ImportCouponsVisible: false,
      from: {
        mediaId: '',
        personTime: '',
        totalInventory: '',
        dailyInventory: ''
      },
      totalInventoryDis: false,
      ImportCouponsDis: false,
      mediaInfo: {},
      // 为false是新增
      reservedData: {},
      ViewDetails: false,
      selectGoodsOptions: [

      ],
      rules: {
        mediaId: [{ required: true, message: this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.goods'), trigger: 'blur' }],
        personTime: [{ required: true, validator: validateRepertory, trigger: 'blur' }],
        dailyInventory: [{ required: true, validator: validateRepertory, trigger: 'blur' }],
      },
      NewGoodsName: '',
      minWidth: ''
    }
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  mounted() {

  },
  methods: {
    init(obj) {
      this.bouncedTitle = obj.bouncedTitle
      const dataObj = obj
      this.CreateIndianaRulesloading = true
      this.$http({
        url: this.$http.adornUrl('/service/media/v1/coupon/list'),
        method: 'post',
        data: this.$http.adornParams({
          'groupId': 0,
          'goodsType': [7,8,9],
          'type': 1,
          'pageToken': '1',
          'pageSize': 999
        })
      }).then(({ data }) => {
        this.CreateIndianaRulesloading = false
        const datamedias = data.medias
        this.selectGoodsOptions = []
        for (const i in datamedias) {
          this.selectGoodsOptions.push({ 
            id: datamedias[i].basic.mediaId,
            name: datamedias[i].basic.summary,
            sourceType: datamedias[i].basic.sourceType,
          })
        }
        if (dataObj.data) {
          this.ViewDetails = true
          this.from = {
            mediaId: dataObj.data.mediaId,
            id: dataObj.data.id,
            type: dataObj.data.type,
            personTime: dataObj.data.personTime,
            totalInventory: dataObj.data.totalInventory,
            dailyInventory: dataObj.data.dailyInventory
          }
          this.mediaInfo = {
            mediaId:dataObj.data.mediaId,
            sourceType:dataObj.data.sourceType
          }
          if (dataObj.data.checkStatus == '1') {
            this.totalInventoryDis = false
          } else {
            this.totalInventoryDis = true
          }
          if (dataObj.data.sourceType == 7) {
            this.ImportCouponsDis = true
          }
        } else {
          this.ViewDetails = false
        }
      })
    },
    // 添加
    mediaInfoFun(row) {
      let arr = this.selectGoodsOptions
      arr.forEach((v,i)=>{
        if(v.id == row){
          this.mediaInfo = {
            mediaId:v.id,
            sourceType:v.sourceType
          }
        }
      })
      if (this.mediaInfo.sourceType == 7) {
        this.ImportCouponsDis = true
        this.addProductVisible(this.mediaInfo.mediaId)
      } else {
        this.ImportCouponsDis = false
      }
    },
    // 下拉框宽度问题解决
    setMinWidth(val) {
      this.minWidth = val.srcElement.clientWidth
    },
    // 数字类型校验
    validateQuantity(value) {
      const ValueS = value
      if (ValueS !== '') {
        if (isNaN(Number(ValueS))) {
          this.$message.error(this.$i18n.t('message.PleaseNumber'))
          return ''
        } else {
          if (Number(ValueS) > 0) {
            if (ValueS.toString().indexOf('.') >= 0) {
              this.$message.error(this.$i18n.t('message.enteredIncorrectly'))
              return ''
            } else {
              if (ValueS.length > 9) {
                this.$message.error(this.$i18n.t('message.Exceedinglimit'))
                return ''
              } else {
                return value
              }
            }
          } else {
            this.$message.error(this.$i18n.t('message.enteredIncorrectly'))
            return ''
          }
        }
      } else {
        this.$message.error(this.$i18n.t('message.enteredIncorrectly'))
        value.quantity = ''
      }
    },
    // 优惠券导入
    ImportCouponsF(row) {
      if(this.mediaInfo.sourceType) {
        // 7卡券； 8话费； 9实物
        if (this.mediaInfo.sourceType == 8 || this.mediaInfo.sourceType == 9) {
          this.$prompt('', this.$i18n.t('message.addInventory'), {
            confirmButtonText: this.$i18n.t('message.confirm'),
            cancelButtonText: this.$i18n.t('message.cancel')
          }).then(({ value }) => {
            let val = this.validateQuantity(value)
            if (this.ViewDetails) {
              if (val != '') {
                this.from.totalInventory = Number(this.from.totalInventory) + Number(val) 
              }
            } else {
              if (val != '') {
                this.from.totalInventory = val
              }
            }
          }).catch(() => {
          
          })
        } else {
          this.ImportCouponsVisible = true
          const obj = {
            bouncedTitle: this.$i18n.t('message.ImportCoupons'),
            mediaId: this.mediaInfo.mediaId
          }
          this.$nextTick(() => {
            this.$refs.ImportCoupons.init(obj)
          })
        }
      }
    },
    // 优惠券库存导入成功返回查询
    addProductVisible(row) {
      this.ImportCouponsVisible = false
      if(Number(row)){
        this.CreateIndianaRulesloading = true
        this.$http({
          url: this.$http.adornUrl('/service/media/v1/getAll'),
          method: 'post',
          data: this.$http.adornData({
              "ids":[
                  row
              ]
          })
        }).then(data => {
          this.CreateIndianaRulesloading = false
          if (data.status === 200) {
            let medias
            for(let i in data.data.medias){
              medias = data.data.medias[i]
            }
            this.from.totalInventory = medias.basic.storage
          } else {
            this.$message.error(this.$i18n.t('message.requestFailed'))
          }
        })
      }
    },
    clearClose() {
      this.selectGoodsOptions = []
      this.$emit('indianaRulesloadFlgClose')
    },
    productionSubmit() {
      this.$refs['from'].validate((valid) => {
        if (valid) {
          // 后续接口
          if (this.from.totalInventory == ''){
            this.$message.error(this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.repertory'))
            return false
          }
          let dataFrom, url
          // 为true修改
          if (this.ViewDetails) {
            let id = this.from.id
            let type = this.from.type
            delete this.from.id
            delete this.from.type
            dataFrom = {
              "type": 2,
              "rule":{
                  "id": id,
                  "type": type,
                  "timeSlot": "",
                  "detail": `[${JSON.stringify(this.from)}]`
              }
            }
            url = '/service/media/v1/rule/set'
          } else {
            dataFrom = {
                "rule":{
                    "type": 2,
                    "timeSlot": "",
                    "detail": `[${JSON.stringify(Object.assign({mediaId: this.mediaInfo.mediaId},this.from))}]`
                }
            }
            url = '/service/media/v1/rule/add'
          }
          this.CreateIndianaRulesloading = true
          this.$http({
            url: this.$http.adornUrl(url),
            method: 'post',
            data: this.$http.adornData(dataFrom)
          }).then(data => {
            this.CreateIndianaRulesloading = false
            if (data.status === 200) {
              if (data.data.ret) {
                this.$message({
                  type: 'success',
                  message: this.$i18n.t('message.successfulOperation')
                })
                this.clearClose()
              } else {
                this.$message.error(this.$i18n.t('message.raiderFailed'))
              }
            } else {
              this.$message.error(this.$i18n.t('message.requestFailed'))
            }
          })
        }
      })
    }
  }
}
</script>
