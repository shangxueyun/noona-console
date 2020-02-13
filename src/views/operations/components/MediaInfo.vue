<template>
  <div class="MediaInfo-container">
    <el-form ref="from" label-width="80px" :rules="rules">
      <el-form-item :label="this.$i18n.t('message.permission')" prop="mediaInfo" :rules="rules.mediaInfo">
        <el-input v-model="from.mediaId" :placeholder="this.$i18n.t('message.pleaseInput') + this.$i18n.t('message.mediaId')" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'MediaInfo',
  components: {  },
  data() {
    return {

    }
  },
  props: {
    mediaInfo: {
      type: Object,
      default: {}
    }
  },
  created() {

  },
  mounted() {

  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
