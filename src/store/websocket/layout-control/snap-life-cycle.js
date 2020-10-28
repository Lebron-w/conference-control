/**
 * 快照的生命周期
 * state.layoutUser 当前被调节对象
 * state.snapshot 当前快照
 * state.snapList 快照存储
 * state.snapLists 快照列表
 */
export default {
  // 读取本地快照
  readLocalSnaps (state) {
    let localSnap = JSON.parse(localStorage.getItem(`layout-${state.roomInfo.StartTime}`))
    state.snapList.clear()
    if (!localSnap) return
    state.snapLists = []
    for (let item of localSnap) {
      state.snapList.set(Object.keys(item)[0], Object.values(item)[0])
      state.snapLists.push({
        label: Object.keys(item)[0],
        value: Object.keys(item)[0]
      })
    }
    state.snapLists.sort((snap1, snap2) => {
      if (snap1.label > snap2.label) {
        return 1
      } else {
        return -1
      }
    })
  },
  /**
   * 创建快照
   * @param {*} snap 原始数据或者快照列表中的数据
   */
  createSnap (state, snap) {
    if (!snap) return
    // 1. 格式化数据区块
    this.commit('ws/formatItems', snap)
    // 保存到当前快照到store
    state.snapshot = snap
    // console.error('created snap: ', state.snapshot)
  },
  // 更新快照，切换快照
  updateSnap (state, snap) {
    // 当前快照：state.snapshot
    // 目标快照：snap
    let screens = state.snapshot.length || 0
    let snapLen = snap.length
    let newSnap = []
    if (screens > 0 && snapLen <= screens) {
      for (let i in state.snapshot) {
        if (i < snapLen) {
          newSnap.push(snap[i])
        } else {
          newSnap.push(state.snapshot[i])
        }
      }
    } else {
      for (let i in state.snapshot) {
        newSnap.push(snap[i])
      }
    }
    // this.commit('ws/createSnap', newSnap)
    this.commit('ws/checkUserinfoInSnap', newSnap)
    state.snapshot = newSnap
  },
  // 检查快照中的用户信息是否和当前用户信息保持一致
  checkUserinfoInSnap (state, snap) {
    for (let i in snap) {
      i = parseInt(i)
      // 检查数据区域用户是否存在
      if (i === 0 && snap[i].DataArea[0].Item.length > 0) {
        for (let item of snap[i].DataArea[0].Item) {
          if (state.attendeeUserId.indexOf(item.Data) === -1) {
            // 当前用户已不存在
            item.Data = 0
          }
        }
      }
      // 检查视频区域
      if (i === 0 && state.layoutUser === 0) {
        // 会议室布局？
        for (let item of snap[i].DataArea[1].Item) {
          if (item.Data > 0 && item.Type !== 7) {
            if (state.attendeeUserId.indexOf(item.Data) === -1) {
              // 当前用户已不存在
              item.Data = 0
              item.UserData = 0
            } else if (!isExistMedia(item.Data, item.UserData)) {
              // 当前摄像头已不存在
              item.Data = 0
              item.UserData = 0
            // } else if (!mediaState(item.Data, item.UserData)) {
            //   // 当前用户视频处于关闭状态
            //   item.Data = 0
            //   item.UserData = 0
            } else if (!item.broadcastVideo) {
              // 快照上顯示為查看的用戶，會議室佈局不顯示
              item.Data = 0
              item.UserData = 0
            }
          }
        }
      } else {
        // 非会议室布局
        for (let item of snap[i].DataArea[1].Item) {
          if (item.Type === 7) continue
          if (state.attendeeUserId.indexOf(item.Data) === -1) {
            // 当前用户已不存在
            item.Data = 0
            item.UserData = 0
          } else if (!isExistMedia(item.Data, item.UserData)) {
            // 当前摄像头已不存在
            item.Data = 0
            item.UserData = 0
          }
        }
      }
    }
    // 用户摄像头是否存在
    function isExistMedia (userId, mediaId) {
      let ext = false
      if (state.attendeeUserMap.get(userId).Video || state.attendeeUserMap.get(userId).Video.length > 0) {
        for (let vid of state.attendeeUserMap.get(userId).Video) {
          if (vid.ID === mediaId) {
            ext = true
            break
          }
        }
      }
      return ext
    }
    // 用户摄像头开关状态
    // function mediaState (userId, mediaId) {
    //   let sta = false
    //   if (state.attendeeUserMap.get(userId).Video || state.attendeeUserMap.get(userId).Video.length > 0) {
    //     for (let vid of state.attendeeUserMap.get(userId).Video) {
    //       if (vid.ID === mediaId && vid.State === 2) {
    //         sta = true
    //         break
    //       }
    //     }
    //   }
    //   return sta
    // }
  },
  refreshSnap (state, userId) {
    if (!state.isEditing && state.userIdOfLayoutInfo.indexOf(userId) > -1) {
      let snap = JSON.parse(JSON.stringify(state.userLayoutInfo.get(userId)))
      this.commit('ws/createSnap', snap)
    }
  },
  openVideoAndAppendLayout (state, userInfo) {
    /**
     * 1.编辑状态：只修改源数据
     * 2.查看状态：修改快照和源数据
     */
    // 更新已存在布局中的的参会人列表
    this.commit('ws/computedFilledAtts')
    // 是否存在布局列表中
    let isExist = state.filledAtts.indexOf(`@${userInfo.userId}:${userInfo.videoId}`) > -1
    if (!isExist && !state.isEditing && state.layoutUser === 0) {
      // 查看会议室布局时，修改快照
      let itemLen = state.snapshot[0].DataArea[1].UserData // 分屏数 标准布局为0
      for (let i = 0; i <= itemLen; i++) {
        state.snapshot[0].DataArea[1].Item.forEach(item => {
          if (item.Type === 7) {
            item.broadcastVideo = false
            item.broadcastAudio = false
          } else if (item.Data === 0 && item.Pos === i) {
            item.Data = userInfo.userId
            item.UserData = userInfo.videoId
            item.Type = 6
            item.broadcastVideo = true
            item.broadcastAudio = state.attendeeUserMap.get(userInfo) && state.attendeeUserMap.get(userInfo).Audio && state.attendeeUserMap.get(userInfo).Audio.State === 2
          }
        })
      }
    }
  },
  // --------------------- 分割线 -----------------------------
  // 当前正在被查看或编辑的用户
  saveCurrentLayoutUser (state, userId) {
    state.layoutUser = userId
  },
  // 传入一个快照或者源数据，格式化一系列Item窗口数据
  formatItems (state, snap) {
    if (!snap) return
    // 1. 格式化数据区块
    for (let screenId in snap) {
      let item = snap[screenId]
      // 已有的视频区域数据添加音视频控制字段
      if (!item.DataArea[1].Item) item.DataArea[1].Item = []
      for (let videoItem of item.DataArea[1].Item) {
        if (videoItem.Type === 7) continue
        if (videoItem.Data > 0 && state.attendeeUserId.indexOf(videoItem.Data) > -1) {
          // 该用户在参会人列表中
          let videoState = getMediaState(state, videoItem.Data, videoItem.UserData, state.layoutUser).videoState
          videoItem.Type = 6
          if (videoState === -1) {
            // 摄像头已不存在或会议室布局摄像头关闭
            videoItem.Data = 0
            videoItem.UserData = 0
            videoItem.broadcastVideo = false
            videoItem.broadcastAudio = false
          } else {
            videoItem.broadcastVideo = videoState
            videoItem.broadcastAudio = getMediaState(state, videoItem.Data, videoItem.UserData, state.layoutUser).audioState
          }
        } else {
          // 该用户不在，从快照上删除该用户，快照状态恢复默认
          videoItem.Data = 0
          videoItem.Type = 0
          videoItem.broadcastVideo = false
          videoItem.broadcastAudio = false
        }
      }
      // 最后一个item的pos
      let lastPos = item.DataArea[1].Item.length > 0 ? item.DataArea[1].Item[item.DataArea[1].Item.length - 1].Pos : 0
      // 分屏数：
      let splitNum = 0
      if (item.LayoutMode === 1) {
        splitNum = 4
      } else if (item.LayoutMode === 2) {
        splitNum = 3
      } else {
        splitNum = item.DataArea[1].UserData || 6
      }
      // 最小遍历的次数
      let ergodicTimes = splitNum > (lastPos + 1) ? splitNum : (lastPos + 1)
      let temporarySnap = []
      for (let i = 0; i < ergodicTimes; i++) {
        // 标记该窗口是否已存在
        let exsitFlag = false
        for (let wndItem of item.DataArea[1].Item) {
          // if (i === wndItem.Pos || wndItem.Type === 7) {
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
      item.DataArea[1].Item = temporarySnap
    }
  }
}

// 获取用户音视频状态
function getMediaState (state, userId, videoId, layoutUser) {
  let userInfo = state.attendeeUserMap.get(userId)
  let videoState = -1 //  1 广播，0 不广播， -1 移除
  if (userInfo && userInfo.Video && userInfo.Video.length > 0) {
    if (layoutUser === 0) {
      // 会议室布局
      for (let vid of userInfo.Video) {
        if (vid.ID === videoId) {
          videoState = vid.State === 2 ? 1 : -1
          break
        }
      }
    } else {
      // 个人布局
      for (let vid of userInfo.Video) {
        if (vid.ID === videoId) {
          videoState = vid.State === 2 ? 1 : 0
          break
        }
      }
    }
  }
  return {
    videoState,
    audioState: userInfo.Audio && userInfo.Audio.State === 2
  }
}
