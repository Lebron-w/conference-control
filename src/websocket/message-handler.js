import attendee from './attendee'
import layout from './layout'
import login from './login'
import wedget from './wedget'
import loopVideo from './loopVideo'

class MessageHandler {
  constructor (handler, errHandler) {
    this.msgHandler = handler || {}
  }
  // 错误收集
  errorCollector (msg) {
    if (msg.ErrorCode && [1500, 1501, 1502, 1900, 1902, 1509].indexOf(msg.CmdID) === -1) {
      return false
    } else {
      return true
    }
  }
  // 消息执行器
  msgExecute (msg, ws, store, errorCode) {
    if (this.errorCollector(msg)) { // 消息解析
      try {
        this.msgHandler[`msgHandler${msg.CmdID}`](msg, ws, store, errorCode)
      } catch (e) {
        console.error('未捕获的消息！', e)
      }
    }
  }
}

export default new MessageHandler({
  ...wedget,
  ...layout,
  ...login,
  ...attendee,
  ...loopVideo
})
