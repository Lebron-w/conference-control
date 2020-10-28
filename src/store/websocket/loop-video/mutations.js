/**
 * 储存轮巡用户信息
 *
 */
export default {
  // 储存1509消息
  saveUserLoopInfo (state, data) {
    state.userLoopInfo = data
    // state.loopUserMap.set(data.Data.UserID, data.Date.VideoPolling)
    // console.log(data)
  },
  // 改变设置轮巡弹窗状态
  loopVideoSetting (state, data) {
    state.settingStatus = data
  },
  // 改变轮巡按钮状态
  loopBtnStatus (state, data) {
    state.isdisabled = data
  }
  // saveLoopUserMap (state, data) {
  //   state.loopUserMap.set(state.userLoopInfo.VideoPolling[0].UserID, .VideoPolling[0].UserList)
  // }
}
