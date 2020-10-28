export default {
  // Web代理服务返回从资源服务获取会议室信息
  msgHandler1507 (msg, ws, store, errorCode) {
    if (!msg.ErrorCode) {
      store.commit('ws/saveMsg1507', msg.Data)
    }
  },
  // Web代理服务通知会议状态信息变更
  msgHandler1906 (msg, ws, store, errorCode) {
    if (!msg.ErrorCode) {
      store.commit('ws/saveMsg1906', msg.Data)
    }
  }
}
