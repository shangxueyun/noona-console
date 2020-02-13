<template>
  <div class="Application-container">
    <div v-if="$i18n.locale === 'en'">Withdrawal application to be developed...</div>
    <div v-else>提现申请待开发...</div>
  </div>
</template>

<script>
export default {
  name: 'Application',
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
