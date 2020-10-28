/**
 * 会议布局编辑
 * 20180801
 */

export default {
  // meetingRoomWindowInfo: []
  meetingRoomLayoutInfo: [],
  userLayoutInfo: new Map(),
  // 对应的用户ID，会议室用户ID为0
  userIdOfLayoutInfo: [],
  roomLayoutName: '',
  meetRoomLayout: '',
  isEditing: false,
  // 最近编辑过布局的的参会人信息
  recentControlLayoutAtts: [],
  lastestLayoutControler: 0,
  // 快照编辑保存
  snapshot: [],
  snapList: new Map(),
  snapLists: [],
  emptyWindow: [],
  // 当前已填充到布局列表的参会人信息
  filledAtts: [],
  // 当前正在查看或编辑布局的参会人
  layoutUser: 0,
  // 在会议室布局取消广播的用户
  cancellingVideoAttendees: [],
  // 会控是否独占布局权限
  isExclusiveRight: false,
  // 当前布权限记录
  permission: {
    layout: 0,
    videoTour: 0,
    roolCall: 0
  }
}
