export default {
  // Web代理服务返回获取某个用户音频参数
  msgHandler1504 (msg, ws, store, errorCode) {
    if (!msg.ErrorCode) {
      store.commit('ws/saveMsg1504', msg.Data)
    }
  },
  // Web代理服务返回获取某个用户视频参数
  msgHandler1505 (msg, ws, store, errorCode) {
    if (!msg.ErrorCode) {
      store.commit('ws/saveMsg1505', msg.Data)
    }
  },
  // Web代理服务返回获取某个用户云台参数
  msgHandler1506 (msg, ws, store, errorCode) {
    if (!msg.ErrorCode) {
      store.commit('ws/saveMsg1506', msg.Data)
    }
  },
  // 用户信息列表
  msgHandler1901 (msg, ws, store, errorCode) {
    if (!msg.ErrorCode) {
      store.commit('ws/saveMsg1901', msg)
    }
  },
  // 用户退出会议室
  msgHandler1902 (msg, ws, store, errorCode) {
    if (!msg.ErrorCode) {
      store.commit('ws/saveMsg1902', msg.Data.UserID)
    }
  },
  // 用户音视频信息变更
  msgHandler1904 (msg, ws, store, errorCode) {
    if (!msg.ErrorCode) {
      store.commit('ws/saveMsg1904', msg.Data)
    }
  },
  // 用户状态信息变更
  msgHandler1905 (msg, ws, store, errorCode) {
    if (!msg.ErrorCode) {
      store.commit('ws/saveMsg1905', msg.Data)
    }
  }
}
