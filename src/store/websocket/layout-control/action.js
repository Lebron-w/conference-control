import layout from '@/components/layout-control/screen/layout'
import bus from '../../../EventBus'
let layouts = layout.layouts

export default {
  getScreenName (state, screen) {
    if (screen.LayoutMode === 1) {
      return layouts.standard
    } else if (screen.LayoutMode === 2) {
      return layouts.pip
    } else if (screen.LayoutMode === 3) {
      // 视频模式
      if (screen.DataArea[0].ID === 2) {
        return layouts[`layout_square_${screen.DataArea[0].UserData}`]
      } else {
        console.error('不正常的解析，screen.DataArea[0].ID: ', screen.DataArea[0].ID)
      }
    }
  },
  dragLayoutAttToWindow ({commit, dispatch, state}, dragInfo) {
    let fromWindow = state.snapshot[dragInfo.from.screenId].DataArea[1].Item[dragInfo.from.windowId]
    let toWindow = state.snapshot[dragInfo.to.screenId].DataArea[1].Item[dragInfo.to.windowId]
    let fromType = fromWindow.Type // 当拖拽的是轮巡窗口
    let toType = toWindow.Type // 拖拽放入的窗口
    // 拖拽对象为轮巡窗口
    if (fromType === 7) {
      let userList = state.userLoopInfo.VideoPolling.filter((item) => {
        return item.Screen === dragInfo.from.screenId && item.Window === dragInfo.from.windowId
      })
      let fromInterval = userList.length ? userList[0].Interval : 5000 // 轮巡时间间隔
      userList = userList.length ? userList[0].UserList : []
      if (toType === 7) {
        loopWindowDragToLoopWindow(userList, fromInterval, state, dragInfo, dispatch, fromWindow, toWindow, toType, fromType)
      } else {
        loopWindowDragtoOtherWindow(userList, fromInterval, state, dragInfo, dispatch, fromWindow, toWindow, toType, fromType)
      }
    } else {
      if (toType !== 7) {
        // 将to的参会人信息保存到from的窗口
        fromWindow.Data = dragInfo.to.userId
        fromWindow.UserData = dragInfo.to.mediaId
        if (dragInfo.to.userId > 0) {
          fromWindow.broadcastAudio = dragInfo.to.broadcastAudio
          fromWindow.broadcastVideo = dragInfo.to.broadcastVideo
        } else {
          // to 的窗口没有参会人时，给默认窗口
          fromWindow.broadcastAudio = dragInfo.from.screenId === 0
          fromWindow.broadcastVideo = dragInfo.from.screenId === 0
        }
        // 将from的参会人信息保存到to
        toWindow.Data = dragInfo.from.userId
        toWindow.UserData = dragInfo.from.mediaId
        toWindow.broadcastAudio = dragInfo.from.broadcastAudio
        toWindow.broadcastVideo = dragInfo.from.broadcastVideo
        // 判断拖拽过来的参会人是否离线
        if (state.attendeeUserId.indexOf(fromWindow.Data) === -1) {
          fromWindow.Data = 0
          fromWindow.UserData = 0
        }
        if (state.attendeeUserId.indexOf(toWindow.Data) === -1) {
          toWindow.Data = 0
          toWindow.UserData = 0
        }
      } else {
        otherWindowDragToLoopWindow(state, dragInfo, dispatch, fromWindow, toWindow, toType, fromType)
      }
    }
  },
  setLocalSnapshot ({state, commit}, params) {
    bus.$off('1509') // 每次解绑事件
    bus.$on('1509', () => {
      let { ScreenID, WindowIndex, type } = params
      // 设置轮巡失败 清空窗口数据
      let userLoopList = state.userLoopInfo.VideoPolling.filter((item) => {
        return item.Type === type
      })
      if (userLoopList.length === 0) return commit('clearLoopStatus', params)
      let curWindow = state.snapshot[ScreenID].DataArea[1].Item[WindowIndex]
      curWindow.Type = 7 // 设置窗口类型为轮巡
      curWindow.Data = 1 // 本地显示轮巡数据ID
      curWindow.UserData = type // 设置轮巡内容
      curWindow.broadcastAudio = false
      curWindow.broadcastVideo = false
    })
  },
  // 获取最新布局
  getNewLayout ({rootState}, user) {
    if (user > 0) {
    // 获取某个参会人的布局
      let msg = {
        'CmdID': 1008,
        'Data': {
          'UserID': user
        }
      }
      rootState.webSocket.send(msg)
    }
  },
  // 拖拽参会人到有人的窗口
  dragAttToHumanVideoWindow ({ state, commit, dispatch }, opt) {
    let [userIdStr, routeId, screenId, videoWindowId] = opt
    let curWindow = state.snapshot[screenId].DataArea[1].Item[videoWindowId]
    if (curWindow.Type === 7) { // 拖拽到轮巡窗口
      commit('computedEmptyWindowIdOnThisScreen', screenId)
      if (state.emptyWindow.length === 2) {
        console.warn(routeId, curWindow.UserData)
        let toUserlist = state.userLoopInfo.VideoPolling.filter((item) => {
          return item.Screen === screenId && item.Window === videoWindowId
        })
        let toInterval = toUserlist.length ? toUserlist[0].Interval : 5000 // 轮巡时间间隔
        toUserlist = toUserlist.length ? toUserlist[0].UserList : []
        dispatch('stopAndStartLoop', {
          screenId: screenId,
          windowIndex: videoWindowId,
          userId: routeId, // 需要设置布局窗口的用户ID
          UserData: curWindow.UserData,
          userList: toUserlist,
          status: 0
        }) // 当前窗口停止轮巡
        setTimeout(() => {
          dispatch('stopAndStartLoop', {
            screenId: state.emptyWindow[0],
            windowIndex: state.emptyWindow[1],
            userId: routeId,
            UserData: curWindow.UserData,
            userList: toUserlist,
            Interval: toInterval,
            status: 2
          })
          curWindow.Type = 6
          curWindow.Data = getUserId(userIdStr)
          curWindow.UserData = getVideoId(userIdStr)
          // 音视频状态修改
          curWindow.broadcastAudio = getMediaState(state, screenId, getUserId(userIdStr), getVideoId(userIdStr)).audioState
          curWindow.broadcastVideo = screenId === 0 ? true : getMediaState(state, screenId, getUserId(userIdStr), getVideoId(userIdStr)).videoState
        }, 1000)
      }
    } else {
      let oldMaster = {
        Data: curWindow.Data,
        UserData: curWindow.UserData,
        broadcastAudio: curWindow.broadcastAudio,
        broadcastVideo: curWindow.broadcastVideo
      }
      // 将当前需要填充的参会人填进来
      curWindow.Type = 6
      curWindow.Data = getUserId(userIdStr)
      curWindow.UserData = getVideoId(userIdStr)
      // 音视频状态修改
      curWindow.broadcastAudio = getMediaState(state, screenId, getUserId(userIdStr), getVideoId(userIdStr)).audioState
      curWindow.broadcastVideo = screenId === 0 ? true : getMediaState(state, screenId, getUserId(userIdStr), getVideoId(userIdStr)).videoState
      // 上个空窗口的位置state.emptyWindow,避免递归死循环
      this.commit('ws/computedEmptyWindowIdOnThisScreen', screenId)
      if (state.emptyWindow.length === 2) {
        let emptyWnd = state.snapshot[state.emptyWindow[0]].DataArea[1].Item[state.emptyWindow[1]]
        emptyWnd.Type = 6
        emptyWnd.Data = oldMaster.Data
        emptyWnd.UserData = oldMaster.UserData
        emptyWnd.broadcastAudio = oldMaster.broadcastAudio
        emptyWnd.broadcastVideo = oldMaster.broadcastVideo
      } else {
        console.warn('Mutation Warn：没有空窗口！')
      }
    }
    // let oldMaster = !(curWindow.UserData + '') ? curWindow.Data : `@${curWindow.Data}:${curWindow.UserData}`
  }
}

function loopWindowDragToLoopWindow (userList, fromInterval, state, dragInfo, dispatch, fromWindow, toWindow, toType, fromType) {
  let toUserlist = state.userLoopInfo.VideoPolling.filter((item) => {
    return item.Screen === dragInfo.to.screenId && item.Window === dragInfo.to.windowId
  })
  let toInterval = toUserlist.length ? toUserlist[0].Interval : 5000 // 轮巡时间间隔
  toUserlist = toUserlist.length ? toUserlist[0].UserList : []
  dispatch('stopAndStartLoop', {
    screenId: dragInfo.from.screenId,
    windowIndex: dragInfo.from.windowId,
    userId: dragInfo.from.srcUserId,
    UserData: dragInfo.from.mediaId,
    userList: userList,
    status: 0
  }) // 当前窗口停止轮巡
  dispatch('stopAndStartLoop', {
    screenId: dragInfo.to.screenId,
    windowIndex: dragInfo.to.windowId,
    userId: dragInfo.to.srcUserId,
    UserData: dragInfo.to.mediaId,
    userList: toUserlist,
    status: 0
  }) // 当前窗口停止轮巡
  fromWindow.Data = dragInfo.to.userId
  fromWindow.Type = toType
  fromWindow.UserData = dragInfo.to.mediaId
  toWindow.Data = dragInfo.from.userId
  toWindow.UserData = dragInfo.from.mediaId
  toWindow.Type = fromType
  // 在新窗口开启轮巡
  setTimeout(() => {
    dispatch('stopAndStartLoop', {
      screenId: dragInfo.from.screenId,
      windowIndex: dragInfo.from.windowId,
      userId: dragInfo.to.srcUserId,
      UserData: dragInfo.to.mediaId,
      userList: toUserlist,
      Interval: toInterval,
      status: 2
      // broadcastVideo: draggedUserObj.broadcastVideo,
      // broadcastAudio: draggedUserObj.broadcastAudio
    })
    // 在旧窗口开启轮巡
    dispatch('stopAndStartLoop', {
      screenId: dragInfo.to.screenId,
      windowIndex: dragInfo.to.windowId,
      userId: dragInfo.from.srcUserId,
      UserData: dragInfo.from.mediaId,
      userList: userList,
      Interval: fromInterval,
      status: 2
      // broadcastVideo: draggedUserObj.broadcastVideo,
      // broadcastAudio: draggedUserObj.broadcastAudio
    })
  }, 800)
}

function loopWindowDragtoOtherWindow (userList, fromInterval, state, dragInfo, dispatch, fromWindow, toWindow, toType, fromType) {
  dispatch('stopAndStartLoop', {
    screenId: dragInfo.from.screenId,
    windowIndex: dragInfo.from.windowId,
    userId: dragInfo.from.srcUserId,
    UserData: dragInfo.from.mediaId,
    userList: userList,
    status: 0
  }) // 当前窗口停止轮巡
  fromWindow.Data = dragInfo.to.userId
  fromWindow.Type = toType
  fromWindow.UserData = dragInfo.to.mediaId
  if (dragInfo.to.userId > 0) {
    fromWindow.broadcastAudio = dragInfo.to.broadcastAudio
    fromWindow.broadcastVideo = dragInfo.to.broadcastVideo
  } else {
    // to 的窗口没有参会人时，给默认窗口
    fromWindow.broadcastAudio = dragInfo.from.screenId === 0
    fromWindow.broadcastVideo = dragInfo.from.screenId === 0
  }
  // 延时函数 防止关闭轮巡和开启轮巡几乎同时发送 导致设置轮巡失败
  setTimeout(() => {
    dispatch('stopAndStartLoop', {
      screenId: dragInfo.to.screenId,
      windowIndex: dragInfo.to.windowId,
      userId: dragInfo.to.srcUserId,
      UserData: dragInfo.from.mediaId,
      userList: userList,
      Interval: fromInterval,
      status: 2
      // broadcastVideo: draggedUserObj.broadcastVideo,
      // broadcastAudio: draggedUserObj.broadcastAudio
    })
    // 将from的参会人信息保存到to
    toWindow.Data = dragInfo.from.userId
    toWindow.UserData = dragInfo.from.mediaId
    toWindow.Type = fromType
    toWindow.broadcastAudio = dragInfo.from.broadcastAudio
    toWindow.broadcastVideo = dragInfo.from.broadcastVideo
  }, 800)
}

function otherWindowDragToLoopWindow (state, dragInfo, dispatch, fromWindow, toWindow, toType, fromType) {
  let toUserlist = state.userLoopInfo.VideoPolling.filter((item) => {
    return item.Screen === dragInfo.to.screenId && item.Window === dragInfo.to.windowId
  })
  let toInterval = toUserlist.length ? toUserlist[0].Interval : 5000 // 轮巡时间间隔
  toUserlist = toUserlist.length ? toUserlist[0].UserList : []
  dispatch('stopAndStartLoop', {
    screenId: dragInfo.to.screenId,
    windowIndex: dragInfo.to.windowId,
    userId: dragInfo.to.srcUserId,
    UserData: dragInfo.to.mediaId,
    userList: toUserlist,
    status: 0
  }) // 当前窗口停止轮巡
  fromWindow.Data = dragInfo.to.userId
  fromWindow.Type = toType
  fromWindow.UserData = dragInfo.to.mediaId

  toWindow.Type = fromType
  toWindow.Data = dragInfo.from.userId
  toWindow.UserData = dragInfo.from.mediaId
  toWindow.broadcastAudio = dragInfo.from.broadcastAudio
  toWindow.broadcastVideo = dragInfo.from.broadcastVideo
  if (state.attendeeUserId.indexOf(toWindow.Data) === -1) {
    toWindow.Data = 0
    toWindow.UserData = 0
  }

  setTimeout(() => {
    dispatch('stopAndStartLoop', {
      screenId: dragInfo.from.screenId,
      windowIndex: dragInfo.from.windowId,
      userId: dragInfo.to.srcUserId,
      UserData: dragInfo.to.mediaId,
      userList: toUserlist,
      Interval: toInterval,
      status: 2
    })
  }, 800)
}

function getUserId (str) {
  let u = -1
  if (str.toString().indexOf('@') > -1) {
    str = str.substring(1)
  }
  u = str.toString().indexOf(':') > -1 ? parseInt(str.match(/(\S*):/)[1]) : parseInt(str)
  return u
}

function getVideoId (str) {
  let u = 0
  if (str.toString().indexOf(':') > -1) {
    if (str.match(/:(\S*)/)[1].length > 0) {
      if (str.match(/:(\S*)/)[1].indexOf('/') > -1) {
        if (str.match(/:(\S*)/)[1].match(/(\S*)\//)[1].length > 0) {
          u = parseInt(str.match(/:(\S*)/)[1].match(/(\S*)\//)[1])
        }
      } else {
        u = parseInt(str.match(/:(\S*)/)[1])
      }
    }
  }
  return u
}

// 计算拖拽过来的参会人的视频状态
// function computedAttVideoState (state, userId, videoId) {
//   let videoState = false
//   if (state.attendeeUserMap.get(userId).Video && state.attendeeUserMap.get(userId).Video.length > 0) {
//     for (let vid of state.attendeeUserMap.get(userId).Video) {
//       if (vid.ID === videoId) {
//         videoState = vid.State === 2
//       }
//     }
//   }
//   return videoState
// }

// function getScreenLayout (screen) {
//   let layouts = allLayouts.layouts
//   if (screen.LayoutMode === 1) {
//     return layouts.standard
//   } else if (screen.LayoutMode === 2) {
//     // 数据模式
//     return layouts.training
//   } else if (screen.LayoutMode === 3) {
//     // 视频模式
//     return layouts[`layout_square_${screen.DataArea[1].UserData}`]
//   }
// }

// 获取用户音视频状态
function getMediaState (state, screenId, userId, videoId) {
  // 主讲、主屏
  let userInfo = state.attendeeUserMap.get(userId)
  let videoState = false
  if (userInfo.Video && userInfo.Video.length > 0) {
    for (let vid of userInfo.Video) {
      if (vid.State === 2 && vid.ID === videoId) {
        videoState = true
        break
      }
    }
  }
  return {
    videoState,
    audioState: userInfo.Audio && userInfo.Audio.State === 2
  }
}
