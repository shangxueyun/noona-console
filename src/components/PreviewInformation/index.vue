<template>
  <div class="PreviewInformation-container">
    <el-dialog
      :title="this.$i18n.t('message.preview')"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
        <h3 style="margin: 0;padding-bottom: 10px;">{{ mediaInfo.title }}</h3>
        <div v-if="mediaInfo.cover">
          <img style="max-width:100%" :src="mediaInfo.cover[0].coverObj['1'].url" alt="">
        </div>
        <a style="color:#1682e6" :href="hrefUrl" target="_blank">{{ hrefUrl }}</a>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PreviewInformation',
  components: {  },
  data() {
    return {
      dialogVisible: true,
      hrefUrl: ''
    }
  },
  watch: {

  },
  props: {
    mediaInfo: {
      type: Object,
      default: {}
    }
  },
  created() {
    let Obj = this.Utils.isTest()
    this.hrefUrl = `${Obj.Url}${this.mediaInfo.mediaId}`
  },
  mounted() {

  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    handleClose (row) {
      this.dialogVisible = false
      this.$emit('handleClose')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
