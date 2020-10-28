/**
 * 参会人列表数据格式化
 *
 */

export default {
  // 参会人——关注
  careUsers (state, getters) {
    return state.attendeeUserId.filter(user => {
      return !!state.attendeeUserMap.get(user).CareSeat
    })
  },
  // 参会人——不是关注 并且是主席 并且不是主讲 并且不是管理员
  orderUsersChairman (state, getters) {
    return state.attendeeUserId.filter(user => {
      return getters.careUsers.indexOf(user) === -1 && state.attendeeUserMap.get(user).Right === 3 && state.attendeeUserMap.get(user).DataState !== 2 && state.attendeeUserMap.get(user).ManagerState !== 2
    })
  },
  // 参会人——管理员
  orderUsersManager (state, getters) {
    return state.attendeeUserId.filter(user => {
      return getters.careUsers.indexOf(user) === -1 && state.attendeeUserMap.get(user).ManagerState === 2 && state.attendeeUserMap.get(user).DataState !== 2
    })
  },
  // 参会人——主讲+主席+管理员
  orderUsers (state, getters) {
    return state.attendeeUserId.filter(user => {
      return getters.careUsers.indexOf(user) === -1 && state.attendeeUserMap.get(user).DataState === 2
    }).concat(getters.orderUsersChairman.sort((obj1, obj2) => {
      let displayName1 = state.attendeeUserMap.get(obj1).DisplayName.toString()
      let displayName2 = state.attendeeUserMap.get(obj2).DisplayName.toString()
      if (displayName1 > displayName2) {
        return 1
      } else {
        return -1
      }
    })).concat(getters.orderUsersManager.sort((obj1, obj2) => {
      let displayName1 = state.attendeeUserMap.get(obj1).DisplayName.toString()
      let displayName2 = state.attendeeUserMap.get(obj2).DisplayName.toString()
      if (displayName1 > displayName2) {
        return 1
      } else {
        return -1
      }
    }))
  },
  // 参会人——出席
  normalUsers (state, getters) {
    return state.attendeeUserId.filter(user => {
      return !state.attendeeUserMap.get(user).CareSeat && state.attendeeUserMap.get(user).Right === 2 && state.attendeeUserMap.get(user).DataState !== 2 && state.attendeeUserMap.get(user).ManagerState !== 2
    })
  },
  // 参会人——全部
  allUsers (state, getters) {
    return getters.careUsers.sort((obj1, obj2) => {
      if (!state.attendeeUserMap.get(obj1).hasOwnProperty('CareSeat')) return -1
      if (parseInt(state.attendeeUserMap.get(obj1).CareSeat) > parseInt(state.attendeeUserMap.get(obj2).CareSeat)) {
        return 1
      } else {
        return -1
      }
    }).concat(getters.orderUsers).concat(getters.normalUsers.sort((obj1, obj2) => {
      let displayName1 = state.attendeeUserMap.get(obj1).DisplayName.toString()
      let displayName2 = state.attendeeUserMap.get(obj2).DisplayName.toString()
      if (displayName1 > displayName2) {
        return 1
      } else {
        return -1
      }
    }))
  },
  // 参会人——发言中
  speakingUsers (state, getters) {
    return getters.allUsers.filter(user => {
      return state.attendeeUserMap.get(user).Audio && state.attendeeUserMap.get(user).Audio.State === 2
    })
  },
  // 参会人——请求中
  inRequestUsers (state, getters) {
    return getters.allUsers.filter(user => {
      return state.attendeeUserMap.get(user).DataState === 1 || (state.attendeeUserMap.get(user).Audio && state.attendeeUserMap.get(user).Audio.State === 1)
    })
  },
  // 参会人-允许标注白板
  enableMarkWhiteBoardUsers (state, getters) {
    return state.attendeeUserId.filter(user => {
      return state.attendeeUserMap.get(user).WBMarkState === 2
    })
  },
  // 参会人——有摄像头
  hasVideoUsers (state, getters) {
    return getters.allUsers.filter(user => {
      return state.attendeeUserMap.get(user) && state.attendeeUserMap.get(user).hasOwnProperty('Video') && state.attendeeUserMap.get(user).Video.length > 0
    })
  }
}
