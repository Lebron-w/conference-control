import Vue from 'vue'
import VueI18n from 'vue-i18n'
import 'babel-polyfill'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import twLocale from 'element-ui/lib/locale/lang/zh-TW'
import ElementLocale from 'element-ui/lib/locale'
// App
import App from './App'
import router from './router'
import store from './store'

// 导入全局css
import './style/_bash.scss'
import './style/_element.custom.scss'
import 'assets/element-ui/element-variables.scss'

import Config from './config/ces.config'
import ElementUI from 'assets/element-ui'

// 导入自定义工具类
import myUtil from './common/vue-plugins/util'
import './common/vue-plugins/diyEvents'

// 导入复制剪切板工具
import VueClipboard from 'vue-clipboard2'

// 导入websocket模块

import loginParams from './websocket/params'

import bus from './EventBus'

/* eslint-disable no-undef */
// 配置文件
Vue.use(ElementUI)
Vue.prototype.$config = STATIC_CONFIG ? {...Config, ...STATIC_CONFIG} : Config
Vue.prototype.$bus = bus

Vue.use(myUtil)
// 国际化
Vue.use(VueI18n)
// 复制到剪切板
Vue.use(VueClipboard)

Vue.locale = () => {}
const i18n = new VueI18n({
  locale: STATIC_CONFIG.lang.locale,
  messages: {
    // 'zh-CN': Object.assign(require('./common/lang/zh-cn'), zhLocale),
    // 'zh-TW': Object.assign(require('./common/lang/zh-tw'), twLocale),
    // 'en-US': Object.assign(require('./common/lang/en-us'), enLocale)
    'zh-CN': Object.assign({m: zh_CN}, zhLocale),
    'zh-TW': Object.assign({m: zh_TW}, twLocale),
    'en-US': Object.assign({m: en_US}, enLocale)
  }
})
ElementLocale.i18n((key, value) => i18n.t(key, value))

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App),
  created () {
    if (window.location.href.indexOf('?') > -1 && window.location.href.indexOf('aa') > -1) {
      // 解析参数，保存参数，连接跳转
      loginParams()
      window.location.href = window.location.href.split('?')[0] + '#/authorize'
    } else {
      if (sessionStorage.authorize === undefined || sessionStorage.authorize.length === 0) {
        // this.$router.replace('login')
        this.$router.replace('/authorize')
        this.$store.commit('recordLoginStatus', {
          flag: 1,
          msg: this.$t('m.abnormal_msg_identityFailed')
        })
      } else {
        this.$router.replace('/authorize')
      }
    }
  },
  mounted () {
    const that = this
    window.onbeforeunload = function () {
      // if (that.$route.path !== '/' || that.$route.path !== '/login' || that.$route.path !== '/authorize') {
      if (/\/home\//.test(that.$route.path)) {
        return that.$t('m.abnormal_msg_refreshComfirm')
      }
    }
    // 窗口变化全局监测
    window.onresize = () => {
      this.$store.commit('resizeWindow')
    }
  }
})
