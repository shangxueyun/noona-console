<template>
  <div>
    <el-dialog
      v-loading="CreateRuleloading"
      :title="bouncedTitle"
      :visible="true"
      class="CreateRule"
      width="60%"
      :modal-append-to-body="true"
      :append-to-body="true"
      :before-close="clearClose"
    >
      <!--  -->
      <div class="form_operation">
        <el-form ref="from" :inline="true" :model="from" :rules="rules">
          <el-form-item style="float: left;margin-right: 0;" prop="timeSlot" :rules="rules.timeSlot" :label="this.$i18n.t('message.selectionTime')">
            <el-time-select
              v-model="from.timeSlot"
              :disabled="ViewDetails||timeSlotFlg"
              :placeholder="this.$i18n.t('message.selectionTime')"
              :picker-options="{
                start: '00:00',
                step: '00:05',
                end: '23:00'
              }"
            />
          </el-form-item>
          <el-form-item style="float: right;margin-right: 0;">
            <el-button :disabled="ViewDetails" type="primary" @click="CreateRuleDataAdd()">{{ $t('message.ADD') }}</el-button>
            <el-button :disabled="ViewDetails" type="danger" @click="CreateRuleDataDelete()">{{ $t('message.cancelingTime') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table
          :data="CreateRuleData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="mediaId"
            :label="$t('message.goodsName')"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-select v-model="scope.row.mediaId" :disabled="ViewDetails" style="width:100%" :placeholder="$t('message.pleaseSelect') + $t('message.goods')" @focus="setMinWidth" @change="goodsNameF">
                <el-option
                  v-for="item in selectGoodsOptions"
                  :key="item.id"
                  :style="{'max-width': minWidth + 'px'}"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="quantity"
            :label="$t('message.numberSlots')"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <input
                v-model="scope.row.quantity"
                class="swiInput"
                type="number"
                :disabled="ViewDetails"
                :placeholder="$t('message.pleaseInput')+$t('message.quantity')"
                @blur="validateQuantity(scope.row)"
                @keyup="quantityF(scope.row)"
              >
            </template>
          </el-table-column>
          <el-table-column
            v-if="ViewDetails"
            prop="duration"
            :label="$t('message.residualInventory')"
            header-align="center"
            align="center"
          />
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearClose">{{ $t('message.cancel') }}</el-button>
        <el-button :disabled="ViewDetails" type="primary" @click="productionSubmit">{{ $t('message.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  components: {

  },
  data() {
    return {
      CreateRuleData: [
        { mediaId: '', quantity: '' }
      ],
      bouncedTitle: '',
      CreateRuleloading: false,
      timeSlotFlg: false,
      from: {
        timeSlot: ''
      },
      // 为false是新增
      reservedData: {},
      ViewDetails: false,
      selectGoodsOptions: [

      ],
      rules: {
        timeSlot: [{ required: true, message: this.$i18n.t('message.selectionTime'), trigger: 'blur' }]
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
    this.getGoodsName()
  },
  mounted() {

  },
  methods: {
    getGoodsName() {

    },
    init(obj) {
      this.bouncedTitle = obj.bouncedTitle
      const dataObj = obj
      this.CreateRuleloading = true
      this.$http({
        url: this.$http.adornUrl('/service/media/v1/coupon/list'),
        method: 'post',
        data: this.$http.adornParams({
          'groupId': 0,
          'type': 1,
          'pageToken': '1',
          'pageSize': 999
        })
      }).then(({ data }) => {
        this.CreateRuleloading = false
        const datamedias = data.medias
        this.selectGoodsOptions = []
        for (const i in datamedias) {
          if (datamedias[i].basic.checkStatus === '10') {
            this.selectGoodsOptions.push({ id: datamedias[i].basic.mediaId, name: datamedias[i].basic.summary })
          }
        }
        if (dataObj.ViewDetails) {
          this.ViewDetails = true
          if (dataObj.data) {
            this.from.id = dataObj.data.id
            this.from.timeSlot = dataObj.data.timeSlot
            const arr = dataObj.data.detail
            arr.forEach((v, i) => {
              for (const i in datamedias) {
                if (datamedias[i].basic.checkStatus === '10') {
                  if (v.mediaId == datamedias[i].basic.mediaId) { v.duration = datamedias[i].basic.duration }
                }
              }
            })
            this.CreateRuleData = dataObj.data.detail
          }
        } else {
          if (dataObj.data) {
            this.from.id = dataObj.data.id
            this.from.timeSlot = dataObj.data.timeSlot
            const arr = dataObj.data.detail
            arr.forEach((v, i) => {
              v.id = v.mediaId
              v.mediaId = v.summaryName
            })
            this.CreateRuleData = arr
            this.timeSlotFlg = true
          }
          this.ViewDetails = false
        }
      })
    },
    CreateRuleDataAdd() {
      this.CreateRuleData.push({ mediaId: '', quantity: '' })
    },
    CreateRuleDataDelete() {
      if (this.CreateRuleData.length !== 0) { this.CreateRuleData.pop() }
    },
    goodsNameF(row) {

    },
    quantityF(row) {

    },
    // 下拉框宽度问题解决
    setMinWidth(val) {
      this.minWidth = val.srcElement.clientWidth
    },
    validateQuantity(value) {
      const ValueS = value.quantity
      let reg = /^\+?[1-9][0-9]*$/
      if (!reg.test(ValueS)) {
        this.$message.error(this.$i18n.t('message.enteredIncorrectly'))
        value.quantity = ''
      }
    },
    clearClose() {
      this.from.times = ''
      this.CreateRuleData = [{ mediaId: '', Quantity: '' }]
      this.selectGoodsOptions = []
      this.$emit('addProductVisible')
    },
    productionSubmit() {
      this.$refs['from'].validate((valid) => {
        if (valid) {
          // 后续接口
          // 重置删除修改name
          for (const o in this.CreateRuleData) {
            if (o === 'summaryName') { delete this.CreateRuleData[o] }
            if (!this.ViewDetails) {
              const mediaId = this.CreateRuleData[o].mediaId
              if (isNaN(Number(mediaId))) {
                this.CreateRuleData[o].mediaId = this.CreateRuleData[o].id
              }
              if (this.CreateRuleData[o].id) {
                delete this.CreateRuleData[o].id
                delete this.CreateRuleData[o].summaryName
              }
            }
            if (this.CreateRuleData[o].mediaId == '') {
              this.$message.error(this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.goods'))
              return false
            } else if (this.CreateRuleData[o].quantity == '') {
              this.$message.error(this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.quantity'))
              return false
            } else {
              this.CreateRuleData[o].quantity = Number(this.CreateRuleData[o].quantity)
            }
          }
          const Obj = JSON.stringify(this.CreateRuleData); let url
          const dataFrom = { rule: {
            detail: Obj
          }}
          for (const i in this.from) {
            dataFrom.rule[i] = this.from[i]
          }
          this.CreateRuleloading = true
          if (dataFrom.rule.id) { url = '/service/media/v1/rule/set' } else { url = '/service/media/v1/rule/add' }
          this.$http({
            url: this.$http.adornUrl(url),
            method: 'post',
            data: this.$http.adornData(dataFrom)
          }).then(data => {
            this.CreateRuleloading = false
            if (data.status === 200) {
              this.$message({
                type: 'success',
                message: this.$i18n.t('message.successfulOperation')
              })
              this.clearClose()
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

<style lang="scss" scoped>
.CreateRule{
  .swiInput{
    width: 50%;
    line-height: 30px;
    border-radius: 6px;
    border: 1px solid #ccc;
    text-indent: 4px;
    outline: 0;
  }
}
</style>
