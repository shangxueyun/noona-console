import Vue from 'vue'
import VueCookie from 'vue-cookie'

import ElementUI from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import '@/assets/css/switch.css' // global css

import App from '@/App'
import store from '@/store'
import router from '@/router'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios returnObject
import RequestHeader from '@/utils/aliRequest' // api: 动态配置header需求
import * as Utils from '@/utils' // 全局挂载方法

import VueI18n from 'vue-i18n'

import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import ElementLocale from 'element-ui/lib/locale'
import LangEn from '@/assets/lang/en'
import LangZhCHS from '@/assets/lang/zhCHS'

import './icons' // icon
import './permission' // permission control

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(ElementUI)
Vue.use(VueI18n)
Vue.use(VueCookie)

// 挂载全局
window.Vue = Vue // 要在vue-i18n实例化之前执行
// Vue.prototype.$Utils = Utils // 全局业务ajax请求方法
Vue.prototype.$http = httpRequest // 全局业务ajax请求方法 Utils
Vue.prototype.$RequestHeader = RequestHeader // 文件上传ajax请求方法
Vue.prototype.Utils = Utils // 全局挂载方法
// Vue.prototype.isAuth = isAuth     // 权限方法
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const i18n = new VueI18n({
  locale: 'zh', // 语言标识
  messages: {
    en: Object.assign(LangEn, enLocale),
    zh: Object.assign(LangZhCHS, zhLocale)
  }
})

ElementLocale.i18n((key, value) => i18n.t(key, value))
Vue.config.productionTip = false

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
})
