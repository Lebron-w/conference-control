import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/'
    }, {
      path: '/login',
      name: 'login',
      component: r => require(['../views/view/login.vue'], r)
    }, {
      path: '/authorize',
      name: 'authorize',
      component: r => require(['../views/view/login/authorize.vue'], r)
    }, {
      path: '/home',
      redirect: '/home/wedget'
    }, {
      path: '/home',
      component: r => require(['../views/view/home.vue'], r),
      children: [
        {
          path: 'wedget',
          name: 'wedget',
          component: r => require(['../views/view/home/wedget.vue'], r)
        },
        {
          path: 'layout',
          name: 'layout',
          component: r => require(['../views/view/home/layout.vue'], r)
        },
        {
          path: 'layout',
          redirect: 'layout/'
        },
        {
          path: 'layout/:name',
          name: 'layout',
          component: r => require(['../views/view/home/layout.vue'], r)
        }
      ]
    }
  ]
})

// router.beforeResolve((to, from, next) => {
//   if (to.fullPath !== '/' && to.fullPath !== '/login' && to.fullPath !== '/authorize') {
//     if (!store.getters['ws/status']) {
//       store.commit('recordLoginStatus', {flag: 1, msg: '网络连接失败啦！'})
//       router.replace('/authorize')
//     }
//   }
//   next()
// })

let map = {
  // eslint-disable-next-line
  'zh-CN': zh_CN,
  // eslint-disable-next-line
  'zh-TW': zh_TW,
  // eslint-disable-next-line
  'en-US': en_US
}
// eslint-disable-next-line
router.beforeEach((to, from, next) => {
  if (from.fullPath.indexOf('layout') > -1) {
    if (store.state.ws.isEditing) {
      // eslint-disable-next-line
      let lang = localStorage.getItem('lang')
      lang = lang.split(':')[1] // 获取本地存储的语言信息
      let language = map[lang] // 获取全局语言对象
      Vue.prototype.$confirm(language.layout_msg_confirm, language.common_msg_tip, {
        confirmButtonText: language.common_btn_save,
        cancelButtonText: language.common_btn_cancel,
        type: 'warning'
      }).then(() => {
        store.commit('ws/changeEditStutau', false)
        next()
      }).catch(() => {})
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
