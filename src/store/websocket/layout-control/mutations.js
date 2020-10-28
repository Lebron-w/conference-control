// 布局配置信息
import allLayouts from '@/components/layout-control/screen/layout'
import snapLifeCycle from './snap-life-cycle'

export default {
  // 保存会议室快照信息：①保存快照到map ②保存快照UserID ③对比当前查看的快照，实时修改:1903
  saveRoomLayoutInfo (state, layoutInfo) {
    state.userLayoutInfo.set(0, layoutInfo.Screen)
    this.commit('ws/getRoomLayout', layoutInfo.Screen[0])
    if (state.userIdOfLayoutInfo.indexOf(0) === -1) state.userIdOfLayoutInfo.push(0)
    // 刷新当前会议室快照
    if (!state.isEditing && state.layoutUser === 0) {
      this.commit('ws/createSnap', JSON.parse(JSON.stringify(layoutInfo.Screen)))
      // 填充快照中的空item
      for (let i in layoutInfo.Screen) {
        this.commit('ws/saveItemSnapshot', [i, layoutInfo.Screen[i].DataArea[1].UserData])
      }
    }
  },
  // 刷新用户快照信息：1503
  saveUserLayoutInfo (state, layoutInfo) {
    state.userLayoutInfo.set(layoutInfo.UserID, layoutInfo.Screen)
    if (state.userIdOfLayoutInfo.indexOf(layoutInfo.UserID) === -1) state.userIdOfLayoutInfo.push(layoutInfo.UserID)
    // 刷新当前用户快照
    if (!state.isEditing && state.layoutUser === layoutInfo.UserID) {
      for (let i = 0; i < layoutInfo.Screen.length; i++) {
        if (layoutInfo.Screen[i].LayoutMode === 1) { // 判断当为标准模式下 分屏数为4
          layoutInfo.Screen[i].DataArea[1].UserData = 4
        }
      }
      this.commit('ws/createSnap', JSON.parse(JSON.stringify(layoutInfo.Screen)))
      // 填充快照中的空item
      // for (let i in layoutInfo.Screen) {
      //   this.commit('ws/saveItemSnapshot', [i, layoutInfo.Screen[i].DataArea[1].UserData])
      // }
    }
  },
  // 计算主屏布局类型
  getRoomLayout (state, screen) {
    state.roomLayoutName = getScreenLayout(screen).layoutName
  },
  changeEditStutau (state, bool) {
    state.isEditing = bool
  },
  // 保存最近编辑过的参会人
  addRecentControlLayoutAtts (state, userId) {
    if (!userId || userId < 0) return false
    let index = state.recentControlLayoutAtts.indexOf(userId)
    if (index > -1) {
      state.recentControlLayoutAtts.splice(index, 1)
    }
    state.recentControlLayoutAtts.unshift(userId)
  },
  // 最后一次编辑布局的参会人
  saveLastestLayoutControler (state, att) {
    state.lastestLayoutControler = att
  },
  // 编辑快照时，填充快照中缺失的数据Item
  saveScreenSnapshot (state, screenInfo) {
    // 屏幕ID，分屏数
    let [screenId, splitNum] = screenInfo
    let snapshotCopy = JSON.parse(JSON.stringify(state.snapshot))
    snapshotCopy[screenId].DataArea[1].UserData = splitNum
    let item = snapshotCopy[screenId]
    // 已有的视频区域数据添加音视频控制字段
    if (!item.DataArea[1].Item) item.DataArea[1].Item = []
    for (let videoItem of item.DataArea[1].Item) {
      if (videoItem.Type === 7) {
        // 是轮询窗口
        videoItem.broadcastVideo = false
        videoItem.broadcastAudio = false
      } else if (videoItem.Type !== 7 && state.attendeeUserId.indexOf(videoItem.Data) > -1) {
        // 判断当前用户在不在
        videoItem.Type = 6
        if (!videoItem.hasOwnProperty('broadcastVideo')) videoItem.broadcastVideo = getMediaState(state, screenId, videoItem.Data, videoItem.UserData).videoState
        if (!videoItem.hasOwnProperty('broadcastAudio')) videoItem.broadcastAudio = getMediaState(state, screenId, videoItem.Data, videoItem.UserData).audioState
      } else {
        // 该用户不在，从快照上删除该用户，快照状态恢复默认
        videoItem.Data = 0
        videoItem.broadcastVideo = false
        videoItem.broadcastAudio = false
      }
    }
    // 最后一个item的pos
    let lastPos = item.DataArea[1].Item.length > 0 ? item.DataArea[1].Item[item.DataArea[1].Item.length - 1].Pos : 0
    // 最小遍历的次数
    let ergodicTimes = splitNum > (lastPos + 1) ? splitNum : (lastPos + 1)
    let temporarySnap = []
    for (let i = 0; i < ergodicTimes; i++) {
      // 标记该窗口是否已存在
      let exsitFlag = false
      for (let wndItem of item.DataArea[1].Item) {
        if (i === wndItem.Pos) {
          // 已存在的用户信息直接添加到快照数组中
          temporarySnap.push(wndItem)
          exsitFlag = true
          break
        }
      }
      // 当前窗口不存在用户，则添加新用户
      if (!exsitFlag) {
        temporarySnap.push({
          Pos: i,
          Data: 0,
          Type: 6,
          UserData: 0,
          broadcastAudio: false,
          broadcastVideo: false
        })
      }
    }
    snapshotCopy[screenId].DataArea[1].Item = temporarySnap
    state.snapshot = snapshotCopy
  },
  // 更新数据时，填充快照中缺失的数据Item
  saveItemSnapshot (state, screenInfo) {
    // 屏幕ID，分屏数
    let [screenId, splitNum] = screenInfo
    let snapshotCopy = state.snapshot
    snapshotCopy[screenId].DataArea[1].UserData = splitNum
    this.commit('ws/createSnap', snapshotCopy)
  },
  // 屏幕布局切换
  layoutReduction (state, argus) {
    let [screenId, layoutName] = argus
    // 数据来源和修改目标：快照 snapshot
    if (layoutName === 'standard') {
      // 修改类型：标准模式
      state.snapshot[screenId].LayoutMode = 1
    } else if (layoutName === 'training') {
      // 修改类型：数据模式
      state.snapshot[screenId].LayoutMode = 2
    } else if (layoutName.indexOf('layout_square') > -1) {
      // 修改类型：分屏模式
      state.snapshot[screenId].LayoutMode = 3
      state.snapshot[screenId].DataArea[1].UserData = parseInt(layoutName.substring(14))
      // 去掉数据全屏
      if (state.snapshot[screenId].FullArea.ID.indexOf(1) > -1) state.snapshot[screenId].FullArea.ID.splice(state.snapshot[screenId].FullArea.ID.indexOf(1), 1)
    }
  },
  // 创建新的快照
  createNewSnap (state, snap) {
    state.snapList.set(snap[0], snap[1])
  },
  // 切换快照: ①判断这里面的参会人还在不在，②全量覆盖过去
  changeSnap (state, snap) {
    state.snapshot = snap
    for (let snapItem of snap) {
      if (snapItem.DataArea[1].Item) {
        for (let item of snapItem.DataArea[1].Item) {
          if (item.Data > 0 && state.attendeeUserId.indexOf(item.Data) === -1) {
            // 用户已离线 ，清除该窗口的用户数据信息
            item.Data = 0
          }
        }
      }
    }
  },
  // 全屏视频区域
  fullVideoArea (state, fullVideoOpt) {
    let [screenId, isFullVideo] = fullVideoOpt
    if (isFullVideo) {
      if (state.snapshot[screenId].FullArea.ID.indexOf(2) === -1) {
        state.snapshot[screenId].FullArea.ID.push(2)
        state.snapshot[screenId].ValidFullMode = 1
      }
      // 取消其他窗口的全屏
      state.snapshot[screenId].FullDataID = 0
      state.snapshot[screenId].FullUserData = 0
    } else {
      if (state.snapshot[screenId].FullArea.ID.indexOf(2) > -1) state.snapshot[screenId].FullArea.ID.splice(state.snapshot[screenId].FullArea.ID.indexOf(2), 1)
    }
  },
  // 全屏数据区域
  fullDocArea (state, fullAudioOpt) {
    let [screenId, isFullAudio] = fullAudioOpt
    if (isFullAudio) {
      if (state.snapshot[screenId].FullArea.ID.indexOf(1) === -1) {
        state.snapshot[screenId].FullArea.ID.unshift(1)
        state.snapshot[screenId].ValidFullMode = 1
      }
      // 取消其他窗口的全屏
      state.snapshot[screenId].FullDataID = 0
      state.snapshot[screenId].FullUserData = 0
    } else {
      if (state.snapshot[screenId].FullArea.ID.indexOf(1) > -1) state.snapshot[screenId].FullArea.ID.splice(state.snapshot[screenId].FullArea.ID.indexOf(1), 1)
    }
  },
  // 设置某个窗口全屏
  fullVideWindow (state, windowInfo) {
    let [isfull, screenId, data = 0, userData = 0] = windowInfo
    if (isfull) {
      state.snapshot[screenId].FullDataType = 6
      state.snapshot[screenId].FullDataID = data
      state.snapshot[screenId].FullUserData = userData
      state.snapshot[screenId].ValidFullMode = 1
      // 取消其他的区域全屏
      if (state.snapshot[screenId].FullArea.ID.length > 0) {
        state.snapshot[screenId].FullArea.ID = []
      }
    } else {
      state.snapshot[screenId].FullDataID = 0
      state.snapshot[screenId].FullUserData = 0
      // 设置扩展屏区域全屏
      if (screenId > 0) {
        state.snapshot[screenId].FullArea.ID = [1, 2]
      }
    }
  },
  // -------------------------------------------------------- 拖拽参会人的接口 ---------------------------------------------------------------
  // 拖拽参会人到空窗口
  dragAttToEmptyVideoWindow (state, opt) {
    let [userIdStr, screenId, videoWindowId] = opt
    let goalsWnd = state.snapshot[screenId].DataArea[1].Item[videoWindowId]
    goalsWnd.Type = 6
    goalsWnd.Data = getUserId(userIdStr)
    goalsWnd.UserData = getVideoId(userIdStr)
    // 音视频状态修改
    goalsWnd.broadcastAudio = getMediaState(state, screenId, getUserId(userIdStr), getVideoId(userIdStr)).audioState
    goalsWnd.broadcastVideo = screenId === 0 ? true : getMediaState(state, screenId, getUserId(userIdStr), getVideoId(userIdStr)).videoState
  },
  // 游离的参会人填充时自动找位置
  dragFillDissociativeAtt (state, user) {
    let [userIdStr, screenId = 0] = user
    // 上个空窗口的位置state.emptyWindow,避免递归死循环
    this.commit('ws/computedEmptyWindowIdOnThisScreen', screenId)
    if (state.emptyWindow.length === 2) {
      this.commit('ws/dragAttToEmptyVideoWindow', [userIdStr, ...state.emptyWindow])
    } else {
      console.warn('Mutation Warn：没有空窗口！')
    }
  },
  // 拖拽参会人到布局窗口
  dragAttToLayout (state, opt) {
    let [userId, meidaId, routeId, screenId, videoWindowId] = opt
    // 更新已存在布局中的的参会人列表：state.filledAtts
    this.commit('ws/computedFilledAtts')
    // 视频路数达上限，不在填充
    if (state.filledAtts.length >= 64) {
      console.error('可填充的视频路数已达上限！')
      return
    }
    // 将原来位置清空
    let isFilled = false
    state.filledAtts.forEach(att => {
      if (getUserId(att) === userId && getVideoId(att) === meidaId) {
        isFilled = true
      }
    })
    if (isFilled) {
      // 已在布局中，从原来的位置移除该参会人，计算该参会人的位置坐标
      let coordinate = []
      for (let i = 0; i < state.snapshot.length; i++) {
        if (coordinate.length > 0) break
        // 屏幕
        let itemLen = state.snapshot[i].DataArea[1].Item[state.snapshot[i].DataArea[1].Item.length - 1].Pos + 1
        let dataAreaUserData = state.snapshot[i].DataArea[1].UserData
        if (itemLen < dataAreaUserData) itemLen = dataAreaUserData
        for (let j = 0; j < itemLen; j++) {
          // 窗口
          if (state.snapshot[i].DataArea[1].Item[j].Data === userId && state.snapshot[i].DataArea[1].Item[j].UserData === meidaId) {
            // Data和UserData都对的上，即可进入下一步
            coordinate = [i, j]
            break
          }
        }
      }
      // 从该位置移除该参会人
      state.snapshot[coordinate[0]].DataArea[1].Item[coordinate[1]].Data = 0
      state.snapshot[coordinate[0]].DataArea[1].Item[coordinate[1]].UserData = 0
    }
    // 判断目标窗口是否有人
    if (!state.snapshot[screenId].DataArea[1].Item[videoWindowId].Data) {
      // 没人
      this.commit('ws/dragAttToEmptyVideoWindow', [`@${userId}:${meidaId}`, screenId, videoWindowId])
    } else {
      // 有人
      this.dispatch('ws/dragAttToHumanVideoWindow', [`@${userId}:${meidaId}`, routeId, screenId, videoWindowId])
    }
  },
  // 拖拽布局窗口到布局窗口
  // dragLayoutAttToWindow (state, dragInfo) {
  //   let fromWindow = state.snapshot[dragInfo.from.screenId].DataArea[1].Item[dragInfo.from.windowId]
  //   let toWindow = state.snapshot[dragInfo.to.screenId].DataArea[1].Item[dragInfo.to.windowId]
  //   if (fromWindow.Type === 7) { // 当拖拽的是轮巡窗口

  //   } else {
  //     // 将to的参会人信息保存到from的窗口
  //     fromWindow.Data = dragInfo.to.userId
  //     fromWindow.UserData = dragInfo.to.meidaId
  //     if (dragInfo.to.userId > 0) {
  //       fromWindow.broadcastAudio = dragInfo.to.broadcastAudio
  //       fromWindow.broadcastVideo = dragInfo.to.broadcastVideo
  //     } else {
  //       // to 的窗口没有参会人时，给默认窗口
  //       fromWindow.broadcastAudio = dragInfo.from.screenId === 0
  //       fromWindow.broadcastVideo = dragInfo.from.screenId === 0
  //     }
  //     // 将from的参会人信息保存到to
  //     toWindow.Data = dragInfo.from.userId
  //     toWindow.UserData = dragInfo.from.meidaId
  //     toWindow.broadcastAudio = dragInfo.from.broadcastAudio
  //     toWindow.broadcastVideo = dragInfo.from.broadcastVideo
  //     // 判断拖拽过来的参会人是否离线
  //     if (state.attendeeUserId.indexOf(fromWindow.Data) === -1) {
  //       fromWindow.Data = 0
  //       fromWindow.UserData = 0
  //     }
  //     if (state.attendeeUserId.indexOf(toWindow.Data) === -1) {
  //       toWindow.Data = 0
  //       toWindow.UserData = 0
  //     }
  //   }
  // },
  // 从指定窗口上删除指定的参会人
  deleteVideoFromWindow (state, userInfo) {
    for (let screenItem of state.snapshot) {
      for (let item of screenItem.DataArea[1].Item) {
        if (item.Data === userInfo.userId && item.UserData === userInfo.mediaId) {
          item.Type = 0
          item.Data = 0
          item.UserData = 0
          item.broadcastAudio = false
          item.broadcastVideo = false
        }
      }
    }
  },
  // 取消广播某人
  cancellVideo (state, operation) {
    if (operation.add) {
      let isExist = false
      for (let attInfo of state.cancellingVideoAttendees) {
        if (attInfo.userId === operation.add.userId && attInfo.mediaId === operation.add.mediaId) {
          isExist = true
        }
      }
      if (!isExist) state.cancellingVideoAttendees.push(operation.add)
    } else if (operation.delete) {
      for (let attInfo of state.cancellingVideoAttendees) {
        if (attInfo.userId === operation.delete.userId && attInfo.mediaId === operation.delete.mediaId) {
          state.cancellingVideoAttendees.splice(state.cancellingVideoAttendees.indexOf(attInfo), 1)
        }
      }
    } else if (operation.clear) {
      state.cancellingVideoAttendees = []
    }
  },
  // 找指定屏的第一个空窗口
  computedEmptyWindowIdOnThisScreen (state, screenId) {
    state.emptyWindow = []
    for (let j = 0; j < state.snapshot[screenId].DataArea[1].UserData; j++) {
      // 窗口
      if (!state.snapshot[screenId].DataArea[1].Item[j].Data) {
        // Data为空或者0,这是一个空窗口，存储screenId和videoWindowId
        state.emptyWindow = [screenId, j]
        break
      }
    }
    if (state.emptyWindow.length === 0) {
      this.commit('ws/computedEmptyWindowId')
    }
  },
  // 计算最靠前的一个空位置的screenId和windowId
  computedEmptyWindowId (state) {
    // 找所有屏的第一个空窗口
    state.emptyWindow = []
    for (let i = 0; i < state.snapshot.length; i++) {
      if (state.emptyWindow.length > 0) break
      // 屏幕
      for (let j = 0; j < state.snapshot[i].DataArea[1].UserData; j++) {
        // 窗口
        if (!state.snapshot[i].DataArea[1].Item[j].Data) {
          // Data为空或者0,这是一个空窗口，存储screenId和videoWindowId
          state.emptyWindow = [i, j]
          break
        }
      }
    }
  },
  // 计算当前已填充的参会人
  computedFilledAtts (state) {
    state.filledAtts = []
    for (let i = 0; i < state.snapshot.length; i++) {
      // 屏幕
      let itemLen = state.snapshot[i].DataArea[1].Item[state.snapshot[i].DataArea[1].Item.length - 1].Pos + 1
      let dataAreaUserData = state.snapshot[i].DataArea[1].UserData
      if (itemLen < dataAreaUserData) itemLen = dataAreaUserData
      for (let j = 0; j < itemLen; j++) {
        // 窗口
        if (state.snapshot[i].DataArea[1].Item[j].Data) {
          // 存储screenId和videoWindowId
          state.filledAtts.push(`@${state.snapshot[i].DataArea[1].Item[j].Data}:${state.snapshot[i].DataArea[1].Item[j].UserData}`)
        }
      }
    }
  },
  // 清除当前窗口的状态
  clearLoopStatus (state, params) {
    // 恢复为空窗口状态
    let { ScreenID, WindowIndex } = params
    let curWindow = state.snapshot[ScreenID].DataArea[1].Item[WindowIndex]
    curWindow.Data = 0
    curWindow.Type = 6
    curWindow.UserData = 0
    curWindow.broadcastAudio = false
    curWindow.broadcastVideo = false
  },
  setLocalSnapshot (state, params) {
    let { ScreenID, WindowIndex, type } = params
    try {
      let curWindow = state.snapshot[ScreenID].DataArea[1].Item[WindowIndex]
      curWindow.Type = 7 // 设置窗口类型为轮巡
      curWindow.Data = 1 // 本地显示轮巡数据ID
      curWindow.UserData = type // 设置轮巡内容
      curWindow.broadcastAudio = false
      curWindow.broadcastVideo = false
      console.log('curWindow=======>', curWindow)
    } catch (e) {
      console.log(e)
    }
  },
  /***
   * 布局权限 --------------- start -----------------------------
   */
  // 保存布局权限状态
  saveExclusiveRight (state, bool) {
    state.isExclusiveRight = bool
  },
  storagePermission (state, data) {
    switch (data.RightType) {
      case 1:
        state.permission.layout = data.Operation
        break
      case 2:
        state.permission.videoTour = data.Operation
        break
      case 3:
        state.permission.roolCall = data.Operation
        break
    }
  },
  // 布局权限 --------------- end -----------------------------
  // 快照的生命周期
  ...snapLifeCycle
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

function getScreenLayout (screen) {
  let layouts = allLayouts.layouts
  if (screen.LayoutMode === 1) {
    return layouts.standard
  } else if (screen.LayoutMode === 2) {
    // 数据模式
    return layouts.training
  } else if (screen.LayoutMode === 3) {
    // 视频模式
    return layouts[`layout_square_${screen.DataArea[1].UserData}`] || layouts[`layout_square_6`]
  }
}

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
