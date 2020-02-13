<template>
  <div class="ABtest-container">
    <div v-if="$i18n.locale === 'en'">AB Test to be developed...</div>
    <div v-else>AB测试待开发...</div>
  </div>
</template>

<script>
export default {
  name: 'ABtest',
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
