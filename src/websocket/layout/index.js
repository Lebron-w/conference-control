import lang from '../../common/lang'
import { Message } from 'element-ui'

export default {
  // 代理服务器返回某个用户的布局信息
  msgHandler1503 (msg, ws, store, errorCode) {
    if (!msg.ErrorCode) {
      store.commit('ws/saveUserLayoutInfo', msg.Data)
    }
  },
  // 代理服务器返回权限请求的结果
  msgHandler1508 (msg, ws, store, errorCode) {
    if (!msg.ErrorCode) {
      store.commit('ws/storagePermission', msg.Data)
    } else {
      if (msg.ErrorCode === 117) {
        Message({
          type: 'error',
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
  },
  // 会议室布局信息
  msgHandler1903 (msg, ws, store, errorCode) {
    if (!msg.ErrorCode) {
      // 容错处理 详见：svn 文档说明
      for (let screenItem of msg.Data.Screen) {
        if (screenItem.DataArea[0].ID === 2 && screenItem.DataArea[1].ID === 1) {
          screenItem.DataArea = [screenItem.DataArea[1], screenItem.DataArea[0]]
        }
      }
      if (msg.Data.Screen[0].LayoutMode === 3 && msg.Data.Screen[0].DataArea[1].UserData === 240) {
        // PC客户端的240分屏问题
        msg.Data.Screen[0].LayoutMode = 2
        msg.Data.Screen[0].FullArea.ID = [1]
        msg.Data.Screen[0].DataArea[1].UserData = 3
      }
      store.commit('ws/saveRoomLayoutInfo', msg.Data)
    }
  }
}
