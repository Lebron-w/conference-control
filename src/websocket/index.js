/**
 * @export websocket
 */
/* eslint-disable */

import store from '../store'
import router from '../router'
import errorCode from './error_code'
import messageHandler from './message-handler'
import lang from '../common/lang'

class CreateWebSocket {
  constructor (options) {
    this.options = options || {}
    this.url = ''
    this.roomId = 0
    this.token = ''
    this.username = ''
    this.$ws = null
    this.heartBeatTimer = 0
    this.missHeartBeatTimes = 0
  }

  connnect () {
    // 重连需要去sessionStorage中获取连接信息
    let connInfo = JSON.parse(sessionStorage.getItem('authorize'))
    let url = this.url = connInfo.url
    let roomId = this.roomId = connInfo.roomId
    let token = this.token = connInfo.token
    let username = this.username = connInfo.username
    let _ws = null
    this.$ws = null

    if (this.isSupport()) {
      // 重置websocket连接状态
      store.commit('ws/resetWsConn')
      // 重置参会人列表数据
      store.commit('ws/resetAttendeeData')
      // 重置心跳状态
      this.clearHeartBeat()
      // 建立 webSocket 连接
      _ws = new WebSocket(url)
      _ws.onopen = () => {
        if (store.state.ws.reconn.allowReconn) {
          this.send({
            "CmdID": 1000,
            "Data": {
              "UserName": username,
              "ToKen": token,
              "RoomID": parseInt(roomId)
            }
          })
          // 修改登录状态为：正在验证身份
          store.commit('recordLoginStatus', {flag: 0, msg: '正在验证身份...'})
        } else {
          console.error('websocket链接状态异常！')
        }
      }
      _ws.onclose = (e) => {
        // 清除心跳
        this.clearHeartBeat()
        // 心跳重连机制
        // if (store.state.ws.reconn.allowReconn) {
        if (this.allowReconn()) {
          // 重连
          this.reconnect()
        } else {
          // 退出websocket
          router.replace('/authorize')
        }
      }

      _ws.onerror = (e) => {
        _ws.close()
      }

      _ws.onmessage = (msg) => {
        // 记录当前收到消息的时间
        // store.commit('ws/lastHeartTime', new Date())
        msg = JSON.parse(msg.data)
        // messageHandler(this, msg)
        messageHandler.msgExecute(msg, this, store, errorCode)
      }
      this.$ws = _ws
    }
  }

  isSupport () {
    if (!!window.WebSocket) {
      return true
    } else {
      // Do some other treatment.
      console.error('Your browser is not support Websocket!')
      return false
    }
  }

  send (msg) {
    try {
      msg = typeof msg === 'String' ? msg : JSON.stringify(msg)
      this.$ws.send(msg)
    } catch (err) {
      // error handler 
      console.error('Message sending failure')
      this.$ws.close()
    }
  }

  reconnect() {
    if (store.state.ws.reconn.times >= 5) {
      store.commit('recordLoginStatus', {flag: 1, msg: lang.$t('m.errorCode_cannotConnectServer')})
      this.logout()
    } else {
      this.connnect()
      store.commit('ws/reconnAgain')
      console.error('重连次数： ', store.state.ws.reconn.times)
    }
  }

  // 备份心跳机制消息
  // heartBeat (timer) {
  //   let beat = () => {
  //     if (this.missHeartBeatTimes >= 2) {
  //       console.error('心跳连接超时次数过多，请重新尝试登录本系统！')
  //       this.missHeartBeatTimes = 0
  //       this.clearHeartBeat()
  //       this.logout()
  //     } else {
  //       if (new Date() - store.state.ws.heartBeat.lastHeartTime < 5000) {
  //         return
  //       } else {
  //         this.missHeartBeatTimes ++
  //         this.send({
  //           CmdID: 1005,
  //           Data: {}
  //         })
  //       }
  //     }
  //   }
  //   this.heartBeatTimer = setInterval(beat, timer)
  // }
  heartBeat (timer) {
    let beat = () => {
      if (this.missHeartBeatTimes >= 2) {
        console.error('心跳连接超时次数过多，请重新尝试登录本系统！')
        store.commit('recordLoginStatus', {flag: 1, msg: '网络连接失败啦！'})
        this.missHeartBeatTimes = 0
        this.clearHeartBeat()
        this.logout()
      } else {
        if (new Date() - store.state.ws.heartBeat.lastHeartTime > 5000) {
          this.missHeartBeatTimes ++
        }
        this.send({
          CmdID: 1005,
          Data: {}
        })
        // 发送心跳发送时间
        store.commit('ws/lastHeartTime', new Date())
      }
    }
    this.heartBeatTimer = setInterval(beat, timer)
  }

  clearHeartBeat () {
    clearInterval(this.heartBeatTimer)
    this.heartBeatTimer = 0
  }

  connected () {
    // 连接成功，将重连次数重置为0
    store.commit('ws/resetWsReconnTimes')
    // 建立心跳连接
    this.heartBeat(5000)
    // 路由跳转
    router.push('/home/wedget')
  }

  logout () {
    // 不在触发重连机制
    this.connnect()
    store.commit('ws/noLongerReconn')
    this.$ws.close()
  }

  allowReconn () {
    return store.state.ws.reconn.allowReconn
  }
}

export default CreateWebSocket
