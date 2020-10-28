/**
 * 参会人列表数据存储方法
 *
 */

/* eslint-disable no-extra-boolean-cast */
export default {
  // 重置参会人websocket消息
  resetAttendeeData (state) {
    state.attendeeUserMap.clear()
    state.attendeeUserId = []
  },
  // 保存websocket原始消息
  saveMsg1901 (state, msg) {
    let localCareSeat = state.careSeatList
    if (localCareSeat.length === 0) localCareSeat = JSON.parse(localStorage.getItem(`carelist`)) || []
    msg.Data.User.forEach(user => {
      let seat = localCareSeat.indexOf(user.UserID)
      if (seat > -1) {
        user.CareSeat = seat + 1
      } else {
        user.CareSeat = 0
      }
      // 过滤旁听用户
      if (user.Right !== 1) {
        state.attendeeUserMap.set(user.UserID, user)
        state.attendeeUserId.push(user.UserID)
      }
    })
  },
  saveMsg1902 (state, userId) {
    let index = state.attendeeUserId.indexOf(userId)
    if (index > -1) {
      state.attendeeUserId.splice(index, 1)
    }
    if (state.attendeeUserMap.has(userId)) {
      state.attendeeUserMap.delete(userId)
    }
  },
  saveMsg1904 (state, data) {
    if (state.attendeeUserId.indexOf(data.UserID) === -1) return
    // 修改音频
    if (data.hasOwnProperty('Audio')) {
      switch (data.Audio.Operation) {
        case 1:
          // 增加音频设备
          if (!state.attendeeUserMap.get(data.UserID).hasOwnProperty('Audio')) {
            state.attendeeUserMap.get(data.UserID).Audio = {}
          }
          state.attendeeUserMap.get(data.UserID).Audio.ID = 0
          state.attendeeUserMap.get(data.UserID).Audio.Name = data.Audio.Name || ''
          state.attendeeUserMap.get(data.UserID).Audio.State = data.Audio.State || 0
          break
        case 2:
          // 修改音频设备
          // state.attendeeUserMap.get(data.UserID).Audio.Name = data.Audio.Name
          if (!state.attendeeUserMap.get(data.UserID).hasOwnProperty('Audio')) {
            state.attendeeUserMap.get(data.UserID).Audio = {}
          }
          state.attendeeUserMap.get(data.UserID).Audio.ID = 0
          state.attendeeUserMap.get(data.UserID).Audio.Name = data.Audio.Name || state.attendeeUserMap.get(data.UserID).Audio.Name || ''
          state.attendeeUserMap.get(data.UserID).Audio.State = data.Audio.State || state.attendeeUserMap.get(data.UserID).Audio.State || 0
          break
        case 3:
          // 删除音频设备
          state.attendeeUserMap.get(data.UserID).Audio = {}
          break
        default:
          console.error('未找到该设备： ', data.UserID, '下的Audio: ', data.Audio.ID)
          break
      }
    }
    // 修改默认视频ID
    if (data.hasOwnProperty('DefVideoDevID')) {
      state.attendeeUserMap.get(data.UserID).DefVideoDevID = data.DefVideoDevID
    }
    // 修改视频信息
    if (data.hasOwnProperty('Video')) {
      // 容错处理
      if (!state.attendeeUserMap.get(data.UserID).hasOwnProperty('Video')) state.attendeeUserMap.get(data.UserID).Video = []
      data.Video.forEach(item => {
        switch (item.Operation) {
          case 1:
            // 新增摄像头
            let existence = false
            state.attendeeUserMap.get(data.UserID).Video.forEach(vid => {
              if (vid.ID === item.ID) existence = true
            })
            if (!existence) {
              state.attendeeUserMap.get(data.UserID).Video.push({
                ID: item.ID,
                Name: item.Name || '',
                State: item.State || 0
              })
            }
            break
          case 2:
            // 修改摄像头
            state.attendeeUserMap.get(data.UserID).Video.forEach(vid => {
              if (vid.ID === item.ID) {
                vid.Name = item.Name || vid.Name || ''
                vid.State = item.State || vid.State || 0
              }
            })
            break
          case 3:
            // 删除摄像头
            for (let i = 0; i < state.attendeeUserMap.get(data.UserID).Video.length; i++) {
              if (state.attendeeUserMap.get(data.UserID).Video[i].ID === item.ID) {
                state.attendeeUserMap.get(data.UserID).Video.splice(i, 1)
                // 从布局快照上删除该参会人的指定摄像头
                this.commit('ws/deleteVideoFromWindow', {
                  userId: data.UserID,
                  mediaId: item.ID
                })
              }
            }
            break
          default:
            console.error('未找到该设备： ', data.UserID, '下的Video: ', item.ID)
            break
        }
      })
    }
    // 调用触发器解决界面数据不刷新的问题
    this.commit('ws/attendeeDataTrigger')
  },
  saveMsg1905 (state, data) {
    let userId = data.UserID
    // 如果不存在当前用户ID，直接返回
    if (state.attendeeUserId.indexOf(userId) === -1) return
    // 关注用户座次改变
    if (data.hasOwnProperty('CareSeat')) state.attendeeUserMap.get(userId).CareSeat = data.CareSeat
    // 主讲状态
    if (data.hasOwnProperty('DataState')) {
      state.attendeeUserMap.get(userId).DataState = data.DataState
      if (data.DataState === 1) {
        // 添加到请求中
        this.commit('ws/saveRequestList', {
          userId,
          DataState: 1
        })
      }
    }
    // 管理员状态
    if (data.hasOwnProperty('ManagerState')) state.attendeeUserMap.get(userId).ManagerState = data.ManagerState
    // 屏幕共享状态
    if (data.hasOwnProperty('VNCState')) state.attendeeUserMap.get(userId).VNCState = data.VNCState
    // 屏幕共享声音媒体ID
    if (data.hasOwnProperty('VNCAudioID')) state.attendeeUserMap.get(userId).VNCAudioID = data.VNCAudioID
    // 音频共享ID
    if (data.hasOwnProperty('AudioShareID')) state.attendeeUserMap.get(userId).AudioShareID = data.AudioShareID
    // 视频共享ID
    if (data.hasOwnProperty('VideoShareID')) state.attendeeUserMap.get(userId).VideoShareID = data.VideoShareID
    // 音频输出静音状态
    if (data.hasOwnProperty('AudioOutMute')) state.attendeeUserMap.get(userId).AudioOutMute = data.AudioOutMute
    // 用户权限
    if (data.hasOwnProperty('Right')) state.attendeeUserMap.get(userId).Right = data.Right
    // 是否允许文字聊天
    if (data.hasOwnProperty('EnableChat')) state.attendeeUserMap.get(userId).EnableChat = data.EnableChat
    // 分组会议状态
    if (data.hasOwnProperty('GroupState')) state.attendeeUserMap.get(userId).GroupState = data.GroupState
    // 白板标注权限
    if (data.hasOwnProperty('WBMarkState')) state.attendeeUserMap.get(userId).WBMarkState = data.WBMarkState
    // 用户网络连接状态
    if (data.hasOwnProperty('OnlineState')) state.attendeeUserMap.get(userId).OnlineState = data.OnlineState
    // 修改音频状态
    if (data.hasOwnProperty('Audio')) {
      if (state.attendeeUserMap.get(userId).hasOwnProperty('Audio')) {
        state.attendeeUserMap.get(userId).Audio.State = data.Audio.State
        if (data.Audio.State === 1) {
          // 添加到请求中
          this.commit('ws/saveRequestList', {
            userId,
            AudioState: 1
          })
        }
      } else {
        state.attendeeUserMap.get(userId).Audio = {}
        state.attendeeUserMap.get(userId).Audio.ID = 0
        state.attendeeUserMap.get(userId).Audio.Name = ''
        state.attendeeUserMap.get(userId).Audio.State = data.Audio.State
      }
    }
    // 修改视频状态
    if (data.hasOwnProperty('Video')) {
      if (state.attendeeUserMap.get(userId).hasOwnProperty('Video')) {
        state.attendeeUserMap.get(userId).Video.forEach(vid => {
          if (vid.ID === data.Video.ID) vid.State = data.Video.State
          // 有视频打开时，向主屏插入视频数据
          if (data.Video.State === 2) {
            this.commit('ws/openVideoAndAppendLayout', {
              userId,
              videoId: data.Video.ID
            })
          }
        })
        // this.dispatch('ws/getNewLayout', state.layoutUser)
        // 当前正在调节某参会人的布局信息
        this.commit('ws/refreshSnap', state.layoutUser)
      }
    }
    // 私聊状态
    if (data.hasOwnProperty('PrivateTalk')) {
      state.attendeeUserMap.get(userId).PrivateTalk = data.PrivateTalk
    }
    // 用户信息
    if (data.hasOwnProperty('Info')) {
      // 昵称
      if (data.Info.hasOwnProperty('DisplayName')) {
        state.attendeeUserMap.get(userId).DisplayName = data.Info.DisplayName
      }
      // 固定电话
      if (data.Info.hasOwnProperty('Tel')) {
        state.attendeeUserMap.get(userId).Tel = data.Info.Tel
      }
      // 移动电话
      if (data.Info.hasOwnProperty('Mobile')) {
        state.attendeeUserMap.get(userId).Mobile = data.Info.Mobile
      }
      // 邮箱
      if (data.Info.hasOwnProperty('EMail')) {
        state.attendeeUserMap.get(userId).EMail = data.Info.EMail
      }
      // 性别
      if (data.Info.hasOwnProperty('Sex')) {
        state.attendeeUserMap.get(userId).Sex = data.Info.Sex
      }
    }
    // 调用触发器解决截面数据不刷新的问题
    this.commit('ws/attendeeDataTrigger')
  },
  saveMsg1906 (state, data) {
    if (data.hasOwnProperty('Mode')) state.roomInfo.Mode = data.Mode
    if (data.hasOwnProperty('Lock')) state.roomInfo.Lock = data.Lock
    if (data.hasOwnProperty('EnableRecord')) state.roomInfo.EnableRecord = data.EnableRecord
    if (data.hasOwnProperty('EnableChat')) state.roomInfo.EnableChat = data.EnableChat
    if (data.hasOwnProperty('EnableP2PChat')) state.roomInfo.EnableP2PChat = data.EnableP2PChat
    if (data.hasOwnProperty('EnablePubChat')) state.roomInfo.EnablePubChat = data.EnablePubChat
    if (data.hasOwnProperty('EnableSendFile')) state.roomInfo.EnableSendFile = data.EnableSendFile
    if (data.hasOwnProperty('EnableSaveWB')) state.roomInfo.EnableSaveWB = data.EnableSaveWB
    if (data.hasOwnProperty('EnableKeepVideo')) state.roomInfo.EnableKeepVideo = data.EnableKeepVideo
    if (data.hasOwnProperty('EnableChatMsgCheck')) state.roomInfo.EnableChatMsgCheck = data.EnableChatMsgCheck
    if (data.hasOwnProperty('EnableVoiceMotivation')) state.roomInfo.EnableVoiceMotivation = data.EnableVoiceMotivation
    if (data.hasOwnProperty('H323VideoMode')) state.roomInfo.H323VideoMode = data.H323VideoMode
  },
  // 保存完整的关注用户列表
  saveCareUsers (state, careUsers) {
    state.careSeatList = careUsers
  },
  /**
   * updateCareList
   * @param {*} careInfo
   * 标志位：careInfo.flag 0，删除 1，新增，2拖拽
   * 目标用户Id，careInfo.userId
   * 新位置的用户Id，careInfo.targetUserId
   */
  updateCareList (state, careInfo) {
    let index = state.careSeatList.indexOf(careInfo.userId)
    if (careInfo.flag === 0) {
      // 删除关注的用户
      if (index > -1) state.careSeatList.splice(index, 1)
    } else if (careInfo.flag === 1) {
      if (index === -1) state.careSeatList.push(careInfo.userId)
    } else if (careInfo.flag === 2) {
      // 拖拽换位置
      let seat = state.careSeatList.indexOf(careInfo.targetUserId)
      state.careSeatList.splice(index, 1)
      state.careSeatList.splice(seat, 0, careInfo.userId)
    }
  },
  // careSeatList 变化时，修改用户信息中的careseat
  setUserCareseat (state) {
    for (let user of state.attendeeUserId) {
      let index = state.careSeatList.indexOf(user)
      if (index > -1) {
        if (state.attendeeUserMap.get(user)) state.attendeeUserMap.get(user).CareSeat = index + 1
      } else {
        if (state.attendeeUserMap.get(user)) state.attendeeUserMap.get(user).CareSeat = 0
      }
    }
    for (let user of state.careSeatList) {
      let index = state.attendeeUserId.indexOf(user)
      if (index > -1) {
        state.attendeeUserId.splice(state.attendeeUserId.indexOf(user), 1)
        state.attendeeUserId.push(user)
      }
    }
    this.commit('ws/attendeeDataTrigger')
  },
  // 请求中的用户和请求状态
  saveRequestList (state, userState) {
    state.requestList.push(userState)
  },
  attendeeDataTrigger (state) {
    state.attendeeUserId.push(0)
    this.commit('ws/saveMsg1902', 0)
  },
  saveMsg1504 (state, data) {
    state.audioinfo = data
  },
  saveMsg1505 (state, data) {
    state.videoinfo = data
  },
  saveMsg1506 (state, data) {
    state.yuntaiinfo = data
  },
  // 轮巡过滤条件
  changeFilterBoardCast (state, bool) { // 正在广播的用户
    state.filterBoardCast = bool
  },
  changeFilterCheckout (state, bool) { // 正在查看的用户
    state.filterCheckout = bool
  }
}
