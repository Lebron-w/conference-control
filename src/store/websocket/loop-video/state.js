/**
 * 轮巡数据存储
 *
 */
export default {
  // 储存 1509 消息
  userLoopInfo: {
    VideoPolling: []
  },
  // 设置轮巡弹窗状态
  settingStatus: false,
  // 轮巡按钮状态
  isdisabled: {start: false, stop: true},
  // 轮巡用户列表
  loopUserMap: new Map()
}
