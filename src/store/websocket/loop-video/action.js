export default {
  // 停止轮巡
  stopAndStartLoop ({state, dispatch, rootState}, data) {
    // web端请求视频轮巡权限
    let rightMsg = {
      'CmdID': 1017,
      'Data': {
        'Operation': 1,
        'RightType': 2 // 视频轮巡权限
      }
    }
    // web端请求停止轮巡
    let loopMsg = {
      'CmdID': 1019,
      'Data': {
        'UserID': data.userId,
        'VideoPolling': [
          {
            'ID': 1,
            'Type': data.UserData === 0 ? 0 : 1,
            'Operation': 1,
            'Interval': data.Interval || 5000,
            'UserList': data.userList,
            'Screen': data.screenId,
            'Window': data.windowIndex,
            'Status': data.status
          }
        ]
      }
    }
    // web端释放视频轮巡权限
    let releaseRightMsg = {
      'CmdID': 1017,
      'Data': {
        'Operation': 0,
        'RightType': 1
      }
    }
    rootState.webSocket.send(rightMsg)
    rootState.webSocket.send(loopMsg)
    rootState.webSocket.send(releaseRightMsg)
    // 当为开始轮巡时
    if (data.status) {
      dispatch('getLoopList', data.userId)
      dispatch('setLocalSnapshot', {
        ScreenID: data.screenId,
        WindowIndex: data.windowIndex,
        type: data.UserData
      })
    }
  },
  // 获取全量轮巡列表
  getLoopList ({rootState}, userId) {
    let getLoopMessage = {
      CmdID: 1018,
      Data: {
        UserID: userId
      }
    }
    rootState.webSocket.send(getLoopMessage)
  }
}
