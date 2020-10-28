import attendeeMuations from './attendee/mutations'
import layoutControlMutations from './layout-control/mutations'
import wedgetMutations from './wedget/mutation'
import loopVideo from './loop-video/mutations'

/* eslint-disable no-extra-boolean-cast */
export default {
  connStatus (state, cmdId) {
    if (cmdId === 'cmd1500') {
      state.connStatus.cmd1500 = true
    }
    if (cmdId === 'cmd1501') {
      state.connStatus.cmd1501 = true
    }
  },
  resetWsConn (state) {
    state.connStatus.cmd1500 = 0
    state.connStatus.cmd1501 = 0
    if (state.heartBeat.timer > 0) {
      clearInterval(state.heartBeat.timer)
      state.heartBeat.timer = 0
    }
    // if (!state.reconn.allowReconn) state.reconn.allowReconn = true
  },
  resetWsReconnTimes (state) {
    if (state.reconn.times > 0) state.reconn.times = 0
  },
  reconnAgain (state) {
    if (state.reconn.allowReconn) {
      state.reconn.times++
    }
  },
  noLongerReconn (state) {
    state.reconn.allowReconn = false
  },
  saveHeartBeat (state, heartBeatTimer) {
    state.heartBeat.timer = heartBeatTimer
  },
  lastHeartTime (state, time) {
    state.heartBeat.lastHeartTime = time
  },
  logoutWebsocket (state, isLogout) {
    state.logoutWebsocket = isLogout
  },
  // getLoopList (state, ws) {
  //   let getLoopMessage = {
  //     CmdID: 1018,
  //     Data: {
  //       UserID: this.userId
  //     }
  //   }
  //   this.$ws.send(getLoopMessage)
  // },
  ...attendeeMuations,
  ...layoutControlMutations,
  ...wedgetMutations,
  ...loopVideo
}
