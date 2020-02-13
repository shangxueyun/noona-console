<template>
  <div>
    <el-dialog
      v-loading="RobotAddloading"
      :title="Title"
      :visible="true"
      class="ImportCoupons"
      width="40%"
      :modal-append-to-body="true"
      :append-to-body="true"
      :before-close="clearClose"
    >
      <!--  -->
      <el-form ref="from" :model="from" :rules="rules" label-width="150px" @keyup.esc.native="clearClose()">
        <!--  -->
        <el-form-item :label="this.$i18n.t('message.choiceactivity')" prop="type" :rules="rules.type">
          <el-select v-model="from.type">
            <el-option
              v-for="item in activityOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('message.robotsNumber')" prop="amount" :rules="rules.amount">
          <el-input v-model="from.amount" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.robotsNumber')" />
        </el-form-item>
        <el-form-item :label="this.$i18n.t('message.Participateinterval')">
          <el-input
            style="width:50%;float:left"
            @blur="validateQuantity(from.leftJoinInterval, 'leftJoinInterval')"
            v-model="from.leftJoinInterval"
            type="number"
            :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.Participateinterval')"
          />
          <el-input
            style="width:50%;float:left"
            @blur="validateQuantity(from.rightJoinInterval, 'rightJoinInterval')"
            v-model="from.rightJoinInterval"
            type="number"
            :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.Participateinterval')"
          />
        </el-form-item>
        <el-form-item :label="this.$i18n.t('message.Participateamount')">
          <el-input
            style="width:50%;float:left"
            @blur="validateQuantity(from.leftGold, 'leftGold')"
            v-model="from.leftGold"
            type="number"
            :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.Participateamount')"
          />
          <el-input
            style="width:50%;float:left"
            @blur="validateQuantity(from.rightGold, 'rightGold')"
            v-model="from.rightGold"
            type="number"
            :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.Participateamount')"
          />
        </el-form-item>
        <el-form-item :label="this.$i18n.t('message.choicegoods')" prop="goods" :rules="rules.goods">
          <el-select style="width:100%" @focus="setMinWidth" v-model="from.goods" multiple>
            <el-option
              :style="{'max-width': minWidth + 'px'}"
              v-for="item in goodsOptions"
              :key="item.mediaId"
              :label="item.goodsName"
              :value="item.mediaId"
              :disabled="item.disabled ? true : false"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearClose">{{ this.$i18n.t('message.cancel') }}</el-button>
        <el-button type="primary" @click="productionSubmit">{{ this.$i18n.t('message.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {

  },
  data() {
    var validate = (rule, value, callback) => {
      let reg = /^\+?[1-9][0-9]*$/
      if (!reg.test(value)) {
        callback(new Error(this.$i18n.t('message.enteredIncorrectly')))
      } else {
        callback()
      }
    }
    return {
      RobotAddloading: false,
      activityOptions: [
        {
          id: 1,
          name: 'Lucky coin game'
        }
      ],
      // 商品列表
      goodsOptions: [],
      from: {
        type: '',
        amount: '',
        leftJoinInterval: '',
        rightJoinInterval: '',
        leftGold: '',
        rightGold: '',
        goods: ''
      },
      minWidth: '',
      rules: {
        type: [{ required: true, message: this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.choiceactivity'), trigger: 'blur' }],
        amount: [{ required: true, validator: validate, trigger: 'blur' }],
        goods: [{ required: true, message: this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.choicegoods'), trigger: 'blur' }]
      }
    }
  },
  props: {
    Title: {
      type: String,
      required: true,
      default: ''
    },
    RobotList: {
      type: Array,
      required: true,
      default: []
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
    // 商品列表上架中
    getDataList() {
      this.RobotAddloading = true
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
      }).then(data => {
        this.RobotAddloading = false
        if (data.status === 200) {
          var data = data.data
          let mediaslist = data.medias
          let arrOption = []
          if (mediaslist) {
            mediaslist.forEach((v, i) => {
              arrOption.push({
                mediaId: mediaslist[i].basic.mediaId,
                goodsName: mediaslist[i].basic.summary,
              })
            })
            let RobotList = this.RobotList
            RobotList.forEach((v, i) => {
              if (RobotList[i].status == 2) {
                let goods = RobotList[i].goods

                for (let g = 0; g < goods.length; g++) {
                  for (let o = 0; o < arrOption.length; o++) {

                    if (arrOption[o].mediaId == goods[g].mediaId) {
                      arrOption[o].mediaId = goods[g].mediaId
                      arrOption[o].disabled = true
                      arrOption[o].goodsName = `${arrOption[o].goodsName}: 【${this.$i18n.t('message.Rules')} ${v.id}】`
                    }
                  }
                }
              }
            })
            this.goodsOptions = []
            this.goodsOptions = arrOption
          }
        } else {
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    },
    // 下拉框宽度问题解决
    setMinWidth(val) {
      this.minWidth = val.srcElement.clientWidth
    },
    validateQuantity(value, type) {
      let reg = /^\+?[1-9][0-9]*$/
      if (!reg.test(value)) {
        this.$message.error(this.$i18n.t('message.enteredIncorrectly'))
        this.from[type] = ''
      }
    },
    clearClose(row) {
      for (const i in this.from) { 
        this.from[i] = ''
      }
      this.$emit('handleClose')
    },
    productionSubmit(flg) {
      this.$refs['from'].validate((valid) => {
        if (valid) {
          if (this.from.leftJoinInterval == '' || this.from.rightJoinInterval == '') {
            this.$message.error(this.$i18n.t('message.Participateinterval') + this.$i18n.t('message.Empty'))
            return false
          } else if (this.from.leftGold == '' || this.from.rightGold == '') {
            this.$message.error(this.$i18n.t('message.Participateamount') + this.$i18n.t('message.Empty'))
            return false
          } else {
            this.ParamsAjax(this.from)
          }
        }
      })
    },
    ParamsAjax(params) {
      let goodsList = this.goodsOptions
      let goods = JSON.parse(JSON.stringify(this.from.goods))
      goods.forEach((v, i) => {
        for (let o in goodsList) {
          if (v == goodsList[o].mediaId) {
            goods[i] = {
              mediaId: v,
              goodsName: goodsList[o].goodsName,
            }
          }
        }
      })
      let Params = {
        rule: {
          type: this.from.type,
          amount: Number(this.from.amount),
          leftJoinInterval: Number(this.from.leftJoinInterval),
          rightJoinInterval: Number(this.from.rightJoinInterval),
          leftGold: Number(this.from.leftGold),
          rightGold: Number(this.from.rightGold),
          detail: JSON.stringify(goods)
        }
      }
      this.RobotAddloading = true
      this.$http({
        url: this.$http.activityUrl('/x/service/activity/robotRuleAdd'),
        method: 'post',
        data: this.$http.adornParams(Params)
      }).then(data => {
        this.RobotAddloading = false
        if (data.status === 200) {
          var data = data.data
          if (data.ret) {
            this.$message({type: 'success',message: this.$i18n.t('message.successfulOperation')})
          } else {
            this.$message.error(this.$i18n.t(data.msg))
          }
          this.clearClose()
        } else {
          this.$message.error(this.$i18n.t('message.requestFailed'))
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
