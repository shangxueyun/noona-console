<template>
  <div class="Release-container">
    <div v-if="$i18n.locale === 'en'">Release information to be developed...</div>
    <div v-else>发布资讯待开发...</div>
  </div>
</template>

<script>
export default {
  name: 'Release',
  components: {  },
  data() {
    return {

    }
  },
  watch: {

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
