import lang from '../../common/lang'
import { Message } from 'element-ui'

export default {
  errorHandler1500 (msg, ws, store, errorCode) {
    store.commit('recordLoginStatus', {flag: 1, msg: lang.$t('m.errorCode_authFailed')})
    ws.logout()
  },
  errorHandler1501 (msg, ws, store, errorCode) {
    errorMsgTip(msg, errorCode, store)
    ws.logout()
  },
  errorHandler1508 (msg, ws, store, errorCode) {
    if (msg.ErrorCode === 117) {
      // 权限被占用
      // let occupiedUserName = ''
      // try {
      //   occupiedUserName = store.state.ws.attendeeUserMap.get(msg.Data.OccupiedUserID).DisplayName
      // } catch (err) {
      //   occupiedUserName = 'userId为' + msg.Data.OccupiedUserID + '的参会人'
      // }
      // console.error('权限被占用了： userId = ', msg.Data.OccupiedUserID)
      Message({
        type: 'error',
        // message: lang.$t('m.layout_error_msg_permissionOccupied', occupiedUserName)
        message: lang.$t('m.layout_error_msg_permissionOccupied')
      })
    } else if (msg.ErrorCode === 118) {
      // 没有权限
      Message({
        type: 'warning',
        message: lang.$t('m.layout_error_msg_noPermission')
      })
    } else {
      // 1 参数错误
      Message({
        type: 'error',
        message: lang.$t('m.layout_error_msg_requestError')
      })
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
