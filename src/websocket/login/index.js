import lang from '../../common/lang'

export default {
  // token认证
  msgHandler1500 (msg, ws, store, errorCode) {
    if (!msg.ErrorCode) {
      store.commit('ws/connStatus', 'cmd1500')
    } else {
      store.commit('recordLoginStatus', {flag: 1, msg: lang.$t('m.errorCode_authFailed')})
      ws.logout()
    }
  },
  // 登录会议室回复
  msgHandler1501 (msg, ws, store, errorCode) {
    if (msg.ErrorCode === 0) {
      store.commit('ws/connStatus', 'cmd1501')
      store.commit('ws/saveRoomInfo', msg)
      if (store.getters['ws/status']) {
        ws.connected()
      }
    } else {
      errorMsgTip(msg, errorCode, store)
      ws.logout()
    }
  },
  // 心跳回复
  msgHandler1502 (msg, ws, store, errorCode) {
    // 心跳消息回复，重置心跳重连次数
    ws.missHeartBeatTimes = 0
    store.commit('ws/lastHeartTime', new Date())
  },
  // 用户异常退出
  msgHandler1900 (msg, ws, store, errorCode) {
    if (msg.ErrorCode) {
      if (msg.ErrorCode !== 108) {
        errorMsgTip(msg, errorCode, store)
        ws.logout()
      }
    }
  }
}

function errorMsgTip (msg, errorCode, store) {
  if (errorCode.has(msg.ErrorCode)) {
    store.commit('recordLoginStatus', {flag: 1, msg: `${lang.$t('m.' + errorCode.get(msg.ErrorCode))}！${lang.$t('m.errorCode')}：${msg.ErrorCode}`})
  } else {
    store.commit('recordLoginStatus', {flag: 1, msg: `${lang.$t('m.errorCode_loginFail')}！${lang.$t('m.errorCode')}：${msg.ErrorCode}`})
    console.error('未收集到的异常错误！错误码：', msg.ErrorCode)
  }
}
