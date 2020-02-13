<template>
  <div>
    <h3 v-if="$i18n.locale === 'en'">
      Hi, , Todays mission: add {{ account_data.today_num }} self media accounts,
      {{ account_data.yesterday_num }} self media accounts were added yesterday,
      add {{ account_data.month_num }} self media accounts have been added this month.
    </h3>

    <h3 v-if="$i18n.locale === 'zh-CN'">
      你好, , 今天你添加了 {{ account_data.today_num }} 个媒体资源,
      昨天你添加了 {{ account_data.yesterday_num }} 个,
      本月你总共添加了 {{ account_data.month_num }} 个媒体资源.
    </h3>

    <div style="max-width: 1200px;margin:30px 0 15px 0">{{ $t('message.Yesterday') }} <span
      style="float: right;cursor: pointer"
      @click="toMore('daily')"
    >more ></span></div>
    <div style="width: 1300px">
      <Tab v-if="is_show" :data="this.yesterday_data" />
    </div>
    <el-select v-model="language" @change="languageF">
      <el-option
        v-for="item in languageOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <div style="max-width: 1200px;margin:30px 0 15px 0">{{ $t('message.monthNumber') }} <span
      style="float: right;cursor: pointer"
      @click="toMore('month')"
    >more ></span></div>
    <div style="width: 1300px">
      <Tab v-if="is_show" :data="this.month_data" />
    </div>
  </div>
</template>
<script>
import Tab from './tab'
import { mapGetters } from 'vuex'

export default {
  components: {
    Tab
  },
  data() {
    return {
      month_data: [],
      yesterday_data: [],
      is_show: true,
      account_data: {
        month_num: '',
        today_num: '',
        yesterday_num: ''
      },
      language: '',
      languageOptions: [
        { value: 1, label: '英文' },
        { value: 2, label: '中文' }
      ]
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    toMore(val) {
      console.log(val)
      this.$router.push({ path: '/stat', query: { type: val }})
    },
    getData(val, el) {
      Object.keys(val).forEach(v => {
        val[v].forEach(c => {
          el.push({
            date: v,
            facebook: [c],
            instagram: [c],
            tiktok: [c],
            youtube: [c],
            total: [c]
          })
        })
      })
    },
    languageF(val) {
      if (val == 1) {
        this.$i18n.locale = 'en'
      } else {
        this.$i18n.locale = 'zh'
      }
    }
  }
}
</script>
