import attendee from './attendee/getters'
import layoutControl from './layout-control/getters'
import wedget from './wedget/getters'
import loopVideo from './loop-video/getters'

export default {
  status (state) {
    if (state.connStatus.cmd1500 && state.connStatus.cmd1501) {
      return true
    } else {
      return false
    }
  },
  heartBeatTimeout (state) {
    return new Date() - state.heartBeat.lastHeartTime
  },
  ...attendee,
  ...layoutControl,
  ...wedget,
  ...loopVideo
}
