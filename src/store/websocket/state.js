import attendeeState from './attendee/state'
import layoutState from './layout-control/state'
import wedgetState from './wedget/state'
import loopVideo from './loop-video/state'

export default {
  // webSocket: null,
  connStatus: {
    cmd1500: 0,
    cmd1501: 0
  },
  reconn: {
    allowReconn: true,
    times: 0
  },
  heartBeat: {
    timer: 0,
    lastHeartTime: 0
  },
  logoutWebsocket: false,
  ...attendeeState,
  ...layoutState,
  ...wedgetState,
  ...loopVideo
}
