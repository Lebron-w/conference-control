import Vue from 'vue'
import Vuex from 'vuex'

import ws from './websocket'
import navMenu from './navigation-menu'
import Ws from '../websocket'
Vue.prototype.$ws = new Ws()
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    lang: 'zh-CN',
    browser: '',
    isCollapse: false,
    windowResize: 0,
    // 动态导航菜单
    layoutControlNav: [],
    // 登录状态提示类型：0 正常登录， 1 登录异常， 2 浏览器版本过低
    tipsType: 0,
    loginStatus: '正在打开会控App...',
    errorReason: '网络连接出错啦！',
    conferenceControlInfo: {'username': '', 'roomid': 0},
    webSocket: Vue.prototype.$ws
  },
  mutations: {
    saveLang (state, l) {
      state.lang = l
    },
    // browserInfo
    saveBrowserInfo (state, num) {
      state.browser = num
    },
    // 保存CES传过来的会控信息
    setConferenceControlInfo (state) {
      let authorize = sessionStorage.getItem('authorize')
      authorize = JSON.parse(authorize)
      state.conferenceControlInfo.username = authorize.username
      state.conferenceControlInfo.roomid = authorize.roomId
      // 项目公共标题名称
      document.title = state.conferenceControlInfo.username + '正在控制' + state.conferenceControlInfo.roomid + '会议室'
    },
    resizeWindow (state) {
      state.windowResize++
    },
    // 右键点击参会人远程调节布局，向menuNav中添加新的菜单页
    addMenuNav (state, nav) {
      if (state.layoutControlNav.indexOf(nav) === -1) state.layoutControlNav.push(nav)
    },
    alterTipsType (state, val) {
      state.tipsType = val
    },
    recordLoginStatus (state, status) {
      state.tipsType = status.flag
      if (status.flag === 0) {
        state.loginStatus = status.msg
      } else if (status.flag === 1) {
        state.errorReason = status.msg
      }
    }
  },
  actions: {
    //
  },
  modules: {
    ws,
    navMenu
  }
})
console.log(store)
export default store
