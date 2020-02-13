<template>
  <el-dialog
    :title="bouncedTitle"
    width="50%"
    :visible="true"
    class="AddModification"
    :modal-append-to-body="true"
    :append-to-body="true"
    :before-close="clearClose"
  >
    <!--  -->
    <el-form ref="addData" :model="addData" status-icon :rules="rules" label-width="120px" class="demo-ruleForm" @keyup.esc.native="clearClose()">
      <el-form-item :label="`${$t('message.videoSource')}:`" prop="videoSource" :rules="rules.videoSource">
        <el-select v-model="addData.videoSource" :placeholder="`${$t('message.pleaseSelect')}${$t('message.videoSource')}`">
          <el-option
            v-for="item in videoSourceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Id:" :rules="rules.Id" prop="Id">
        <el-input v-model="addData.Id" style="width:100%" type="text" :placeholder="`${$t('message.pleaseInput')}Id`" autocomplete="off" />
      </el-form-item>
      <el-form-item :label="`${$t('message.channel')}:`" prop="channel" :rules="rules.channel">
        <el-select v-model="addData.channel" :placeholder="`${$t('message.pleaseSelect')}${$t('message.channel')}`">
          <el-option
            v-for="item in channelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="info">
        网站Id查看方法说明：
        <br>youtube频道Id为：进入频道后，地址的url中红色部分为此频道Id
        https://www.youtube.com/channel/
        <span
          style="color:red"
        >UC9v3JGut2ZPxrXpGzgEAA</span>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ this.$i18n.t('message.cancel') }}</el-button>
      <el-button type="primary" @click="productionSubmit">{{ this.$i18n.t('message.confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>

export default {
  data() {
    return {
      videoSourceOptions: [
        { value: 0, label: this.$i18n.t('message.all') },
        { value: 1, label: 'Youtube' },
        { value: 2, label: 'Facebook' }
      ],
      channelOptions: [
        { value: 0, label: this.$i18n.t('message.all') },
        { value: 1, label: this.$i18n.t('message.headline') },
        { value: 2, label: this.$i18n.t('message.sports') },
        { value: 3, label: this.$i18n.t('message.entertainment') },
        { value: 4, label: this.$i18n.t('message.lifestyle') },
        { value: 5, label: this.$i18n.t('message.vlog') }
      ],
      bouncedTitle: this.$i18n.t('message.newCaptureSource'),
      addData: {
        videoSource: '',
        Id: '',
        channel: ''
      },
      rules: {
        videoSource: [{ required: true, message: this.$i18n.t('message.pleaseSelect') + this.$i18n.t('message.videoSource'), trigger: 'blur' }],
        Id: [{ required: true, message: this.$i18n.t('message.pleaseInput') + 'Id', trigger: 'blur' }],
        channel: [{ required: true, message: this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.channel'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取数据
    init(Obj) {
      if (Obj.id) {
        // 修改参数
      } else {

      }
    },
    clearClose() {
      this.addData = {
        videoSource: '',
        Id: '',
        channel: ''
      }
      this.$emit('addModificationClose')
    },
    // 提交
    productionSubmit() {
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          // 后续接口
        }
      })
    }
  }
}
</script>
