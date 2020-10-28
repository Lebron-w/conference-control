import bus from '../../EventBus'
export default {
  // 代理服务器返回某个用户的轮巡信息
  msgHandler1509 (msg, ws, store) {
    if (msg.Data) {
      store.commit('ws/saveUserLoopInfo', msg.Data)
      bus.$emit('1509')
    }
  }
}
