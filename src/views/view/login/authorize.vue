<template>
  <login-bkg>
    <hst-authorize :login-status="$store.state.loginStatus" v-if="tipsType === 0"></hst-authorize>
    <login-bnormal :error-reason="$store.state.errorReason" v-if="tipsType === 1"></login-bnormal>
    <update-browser v-if="tipsType === 2"></update-browser>
  </login-bkg>
</template>
<script>
// 登录过程背景组件
import loginBkg from '@/components/login/login-bkg'
// 登录鉴权过程组件
import hstAuthorize from '@/components/login/authorize'
// 登录出错提示组件
import loginBnormal from '@/components/login/abnormal'
// 提示浏览器升级组件
import updateBrowser from '@/components/login/update-browser'
export default {
  components: {
    loginBkg,
    hstAuthorize,
    loginBnormal,
    updateBrowser
  },
  data () {
    return {}
  },
  computed: {
    tipsType: {
      get () {
        return this.$store.state.tipsType
      },
      set (val) {
        this.$store.commit('alterTipsType', val)
      }
    }
  },
  created () {
    // 判断浏览器兼容性
    if ((this.IEVersion() > -1 && this.IEVersion() < 10) || !window.WebSocket || !(window.Storage && window.localStorage && window.localStorage instanceof Storage)) {
      this.tipsType = 2
    } else {
      this.$store.commit('setConferenceControlInfo')
      if (this.$store.state.ws.reconn.allowReconn) {
        // 允许登录时才可以登录
        this.$ws.connnect()
      }
    }
    // 存储当前浏览器版本
    this.$store.commit('saveBrowserInfo', this.IEVersion())
  },
  methods: {
    IEVersion () {
      let userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
      let isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // 判断是否IE<11浏览器
      let isEdge = userAgent.indexOf('Edge') > -1 && !isIE // 判断是否IE的Edge浏览器
      let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
      if (isIE) {
        let reIE = new RegExp('MSIE (\\d+\\.\\d+);')
        reIE.test(userAgent)
        let fIEVersion = parseFloat(RegExp['$1'])
        if (fIEVersion === 7) {
          return 7
        } else if (fIEVersion === 8) {
          return 8
        } else if (fIEVersion === 9) {
          return 9
        } else if (fIEVersion === 10) {
          return 10
        } else {
          return 6// IE版本<=7
        }
      } else if (isEdge) {
        return 15// edge
      } else if (isIE11) {
        return 11 // IE11
      } else {
        return -1// 不是ie浏览器
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
