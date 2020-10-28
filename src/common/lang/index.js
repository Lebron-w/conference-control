import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import twLocale from 'element-ui/lib/locale/lang/zh-TW'
import ElementLocale from 'element-ui/lib/locale'

// 国际化
Vue.use(VueI18n)

Vue.locale = () => {}
/* eslint-disable no-undef */
const i18n = new VueI18n({
  locale: STATIC_CONFIG.lang.locale,
  messages: {
    'zh-CN': Object.assign({m: zh_CN}, zhLocale),
    'zh-TW': Object.assign({m: zh_TW}, twLocale),
    'en-US': Object.assign({m: en_US}, enLocale)
  }
})
ElementLocale.i18n((key, value) => i18n.t(key, value))

i18n.$t = (variable, params = []) => {
  let storageLocale = localStorage.getItem('lang') || localStorage.lang
  try {
    storageLocale = storageLocale.split(':')[1]
  } catch (err) {
    storageLocale = false
  }
  let localLocale = storageLocale || i18n.locale
  let variableParam = variable.substr(2)
  let str = i18n.messages[localLocale].m[variableParam]
  let paramsArr = []
  if (!(Object.prototype.toString.call(params) === '[object Array]')) {
    paramsArr.push(params)
  } else {
    paramsArr = params
  }
  if (paramsArr.length > 0 && /{\d}/.test(str)) {
    let len = str.match(/{\d}/ig).length
    for (let i = 0; i < len; i++) {
      if ((paramsArr[i] + '')) str = str.replace(/{\d}*/, paramsArr[i])
    }
  }
  return str
}

export default i18n
