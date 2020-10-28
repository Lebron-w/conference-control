<template>
  <div
    class="att-item-warp data-state"
    :user-id="att"
    :drag-attendee="att"
    :draggable="attendListType === 3 || isEditing"
    @dragstart="sortableCareAttendee($event, att)"
    @dragover="dragoverCareUser($event)"
    @drop="dragCareUser($event, att)"
    >
    <!-- 用户头像 -->
    <span class="attend-poster clearfix">
      <!-- 用户头像 -->
      <div class="vertical-img" :title="attendeeTerminal"><img :src="poster" alt="" draggable="false"></div>
      <!-- 是否关注 -->
      <img src="../../../static/images/attendee/attend_focus.png" alt="" class="attend_focus" v-if="usersMap.get(att).hasOwnProperty('CareSeat') && usersMap.get(att).CareSeat > 0">
    </span>
    <!-- 用户名称 + 摄像头ID+1 -->
    <span class="attend-name" :class="getUserRight()" :title="formatUserName(usersMap.get(att).DisplayName).isExtra ? usersMap.get(att).DisplayName : ''">{{ (getUserRight () === '' ? '' : '(' + $t('m.' + getUserRight()) + ')') + formatUserName(usersMap.get(att).DisplayName, 15).name }}</span>
    <!-- 折叠按钮 -->
    <span class="coll-btn" v-if="attVideoList !== 0 && attVideoList.length > 1" :class="{'coll-open': isColl}" @click="isColl = !isColl"></span>
    <span class="hide-coll-btn" v-else></span>
    <!-- 摄像头 -->
    <span class="attend-camera" v-if="videoState > -1" :class="{'camera-open':
        usersMap.get(att).Video
        && ((usersMap.get(att).Video[0] && usersMap.get(att).Video[0].State === 2)
        || (usersMap.get(att).Video[1] && usersMap.get(att).Video[1].State === 2)
        || (usersMap.get(att).Video[2] && usersMap.get(att).Video[2].State === 2)
        || (usersMap.get(att).Video[3] && usersMap.get(att).Video[3].State === 2))
      }" @click="changeAttendCamera(att)"></span>
    <span class="hide-camera" v-else></span>
    <!-- 麦克风 -->
    <span class="attend-microphone" v-if="audioState > -1" :class="{'microphone-open': usersMap.get(att).Audio && usersMap.get(att).Audio.State === 2, 'microphone-request-speak': usersMap.get(att).Audio && usersMap.get(att).Audio.State === 1}" @click="changeAttendMicrophone(att)"> </span>
    <span class="hide-microphone" v-else></span>
    <span class="speaker-apply" v-if="usersMap.get(att).DataState === 1"></span>

    <!-- 下拉列表 -->
    <ul v-if="isColl && attVideoList.length > 1" class="video-list">
      <li
        class="att-item-warp"
        v-for="vid in attVideoList" :key="vid.id"
        :user-id="att"
        :drag-attendee="att"
        :draggable="isEditing"
        @dragstart.stop="sortableCareAttendee($event, att, vid.id)"
        >
        <!-- 用户头像 -->
        <span class="hide-attend-poster"></span>
        <!-- 用户名 -->
        <span class="attend-name" :title="formatUserName(vid.videoName).isExtra ? usersMap.get(att).DisplayName : ''">{{ formatUserName(vid.videoName, usersMap.get(att).DataState === 1 ? 16 : 20).name }}</span>
        <span class="hide-coll-btn"></span>
        <!-- 摄像头 -->
        <span class="attend-camera" :class="{'camera-open': vid.state === 2}" @click="changeAttendCamera(att, vid.id)"></span>
        <!-- 麦克风 -->
        <span class="hide-microphone"></span>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import icons from 'assets/menu-icon'
import userPortait from 'assets/attendee/user-portrait'
export default {
  props: ['attInfo', 'attendType', 'multiSelectAtt'],
  data () {
    return {
      icons,
      userPortait,
      videoState: -1,
      audioState: -1,
      attVideoList: [],
      // video是否折叠
      isColl: false,
      // 终端类型
      attendeeTerminal: '',
      poster: ''
    }
  },
  computed: {
    ...mapState({
      usersMap: state => state.ws.attendeeUserMap,
      attendeeUserId: state => state.ws.attendeeUserId,
      isEditing: state => state.ws.isEditing,
      careSeatList: state => state.ws.careSeatList,
      requestList: state => state.ws.requestList
    }),
    ...mapGetters({
      speakingUsers: 'ws/speakingUsers',
      inRequestUsers: 'ws/inRequestUsers',
      careUsers: 'ws/careUsers'
    }),
    att () {
      return this.$props.attInfo
    },
    attendee () {
      return this.usersMap.get(this.$props.attInfo)
    },
    attendListType () {
      return this.$props.attendType
    }
  },
  methods: {
    // 右键单击参会人事件
    attendCtxmenu (attendItem) {
      // dialog位置
      this.currentSelectAttendeeUserId = attendItem
      this.contextmenuDialogTop = 3 * 40
      // 选中的目标
      if (this.allMultiSelectAttendee.indexOf(attendItem) === -1) {
        this.allMultiSelectAttendee = []
        this.allMultiSelectAttendee.push(attendItem)
      }
      this.showContextmenu = true
    },
    // 全部参会人拖拽到布局中的事件
    sortableAttendeeToLayoutControl (evt, videoInfo) {
      if (this.attendListType === 0 && this.isEditing) {
        // 拖拽参会人到布局编辑区域功能实现
        this.setDragData(evt, 'dropEffect', 'copy')
        this.setDragData(evt, 'effectAllowed', 'all')
        this.setDragData(evt, 'data', videoInfo)
      }
    },
    // dragstart
    sortableCareAttendee (evt, att, media = '') {
      this.setDragData(evt, 'dropEffect', 'copy')
      this.setDragData(evt, 'effectAllowed', 'all')
      this.setDragData(evt, 'data', JSON.stringify({
        flag: 0,
        userId: att,
        mediaId: (media + '') ? media : (this.dragableCamera(att).hasOwnProperty('id') && (this.dragableCamera(att).id + '') ? this.dragableCamera(att).id : '')
      }))
    },
    // dragover
    dragoverCareUser (evt) {
      if (this.attendListType === 3) {
        evt.preventDefault()
      } else {
        return false
      }
    },
    // drop
    dragCareUser (evt, attendee) {
      if (this.attendListType === 3) {
        evt.preventDefault()
        this.$store.commit('ws/updateCareList', {
          flag: 2,
          userId: JSON.parse(this.getDragData(evt, 'data')).userId,
          targetUserId: attendee
        })
      } else {
        return false
      }
    },
    // 切换摄像头状态
    changeAttendCamera (user, id) {
      if (id === undefined) {
        // 修改视频状态
        let state = this.getAttVideoState(user)
        let devId = this.usersMap.get(user).DefVideoDevID || 0
        if (state === 0) {
          // 将默认摄像头修改为2
          let msg = {
            'CmdID': 1003,
            'Data': {
              'UserID': user,
              'Video': {
                'ID': devId,
                'State': 2
              }
            }
          }
          this.$ws.send(msg)
        } else if (state === 2) {
          // 将所有以广播的摄像头状态修改为0
          for (let vid of this.usersMap.get(user).Video) {
            if (vid.State === 2) {
              let msg = {
                'CmdID': 1003,
                'Data': {
                  'UserID': user,
                  'Video': {
                    'ID': vid.ID,
                    'State': 0
                  }
                }
              }
              this.$ws.send(msg)
            }
          }
        } else {
          console.error('没有可用的摄像头！')
        }
      } else {
        // 修改单个摄像头状态
        let msg = {
          'CmdID': 1003,
          'Data': {
            'UserID': user,
            'Video': {
              'ID': id,
              'State': this.usersMap.get(user).Video[id].State === 2 ? 0 : 2
            }
          }
        }
        this.$ws.send(msg)
      }
    },
    // 切换麦克风状态
    changeAttendMicrophone (user) {
      if (this.usersMap.get(user).Audio && this.usersMap.get(user).Audio.ID === 0) {
        let msg = {
          'CmdID': 1003,
          'Data': {
            'UserID': user,
            'Audio': {
              'ID': 0,
              'State': this.usersMap.get(user).Audio.State === 2 ? 0 : 2
            }
          }
        }
        this.$ws.send(msg)
      } else {
        console.error('音频设备已不存在！')
      }
    },
    // ------------------------------- 其他方法 分割线 ----------------------------------------
    // 用户广播状态
    getAttVideoState (att) {
      if (this.usersMap.get(att) && this.usersMap.get(att).hasOwnProperty('Video') && this.usersMap.get(att).Video.length > 0) {
        // 有摄像头
        let videoState = false
        for (let vid of this.usersMap.get(att).Video) {
          if (vid.State === 2) {
            videoState = true
            break
          }
        }
        if (videoState) {
          // 广播状态
          return 2
        } else {
          // 未广播
          return 0
        }
      } else {
        // 没摄像头
        return -1
      }
    },
    // 获取用户音频状态
    getAttAudioState (att) {
      if (this.usersMap.get(att).Audio && this.usersMap.get(att).Audio.ID === 0) {
        // 用户有麦克风
        return this.usersMap.get(att).Audio.State === 2 ? 2 : 0
      } else {
        // 用户没有麦克风
        return -1
      }
    },
    // 获取用户摄像头列表
    getAttVideoList (att) {
      let arr = []
      if (this.usersMap.get(att) && this.usersMap.get(att).hasOwnProperty('Video') && this.usersMap.get(att).Video.length > 0) {
        // if (this.usersMap.get(att).Video.length === 1) {
        //   // 用户摄像头只有一个
        //   return 1
        // } else {
        // 默认摄像头填充到首位位置
        for (let vid of this.usersMap.get(att).Video) {
          if (vid.ID === this.usersMap.get(att).DefVideoDevID) {
            arr.unshift({
              userId: att,
              userName: this.usersMap.get(att).DisplayName,
              id: vid.ID,
              state: vid.State,
              videoName: this.usersMap.get(att).DisplayName + '-' + (vid.ID + 1)
            })
          } else {
            arr.push({
              userId: att,
              userName: this.usersMap.get(att).DisplayName,
              id: vid.ID,
              state: vid.State,
              videoName: this.usersMap.get(att).DisplayName + '-' + (vid.ID + 1)
            })
          }
        }
        return arr
        // }
      } else {
        // 用户摄像头少于1个
        return 0
      }
    },
    // 计算用户的广播摄像头
    dragableCamera (att) {
      let cameras = this.getAttVideoList(att)
      if (!cameras) return {}
      for (let cam of cameras) {
        if (cam.State === 2) {
          // 第一个被广播的摄像头
          return cam
        }
      }
      return cameras[0]
    },
    // 获取用户身份
    getUserRight () {
      var role = ''
      if (this.usersMap.get(this.att).DataState === 2) { // 主讲
        role = 'presenter'
      } else if (this.usersMap.get(this.att).ManagerState === 2) { // 管理员
        role = 'admin'
      } else if (this.usersMap.get(this.att).Right === 3) { // 主席
        role = 'chairman'
      }
      return role
    },
    // 根据终端类型获取用户头像
    getPoster (terminalType) {
      let type = terminalType % 10
      // 默认为桌面终端
      this.poster = userPortait.user
      this.attendeeTerminal = this.$t('m.attendee_terminal_desktop')
      switch (type) {
        // 1-桌面终端 win:21 mac:31
        case 2:
          // 硬件终端 X3:12 V5:22 X5:32
          this.poster = userPortait.v5
          this.attendeeTerminal = this.$t('m.attendee_terminal_hardware')
          break
        case 3:// 移动终端
          if (terminalType === 13 || terminalType === 23) {
            // ios androidApp
            this.poster = userPortait.mobile
            this.attendeeTerminal = this.$t('m.attendee_terminal_mobile')
          } else if (terminalType === 33) {
            // android tv
            this.poster = userPortait.tv
            this.attendeeTerminal = this.$t('m.attendee_terminal_androidTv')
          } else if (terminalType === 43) {
            // android meetingbox // A2
            this.poster = userPortait.a2
            this.attendeeTerminal = 'MeetingBox'
          } else if (terminalType === 53) {
            // D1
            this.poster = userPortait.d1
            this.attendeeTerminal = this.$t('m.attendee_terminal_D1')
          } else {
            this.poster = userPortait.mobile
            this.attendeeTerminal = this.$t('m.attendee_terminal_mobile')
          }
          break
        case 4:
          if (terminalType === 4) {
            // 4-电话终端
            this.poster = userPortait.phone
            this.attendeeTerminal = this.$t('m.attendee_terminal_phone')
          } else if (terminalType === 14) {
            // 14-h323终端
            this.poster = userPortait.h323
            this.attendeeTerminal = this.$t('m.attendee_terminal_h323')
          }
          break
          // 5-预留 暂无客户端使用
          // 6-虚拟终端 投屏:16
        default:
          break
      }
    }
  },
  watch: {
    attendeeUserId: {
      handler () {
        this.videoState = this.getAttVideoState(this.att)
        this.audioState = this.getAttAudioState(this.att)
        this.attVideoList = this.getAttVideoList(this.att)
        this.getPoster(this.attendee.TerminalType)
      },
      immediate: true
    },
    attInfo (att) {
      this.isColl = false
    },
    // 参会人深度监听
    attendee: {
      deep: true,
      handler (att, oldAtt) {
        this.attVideoList = this.getAttVideoList(this.att)
        this.videoState = this.getAttVideoState(this.att)
        this.audioState = this.getAttAudioState(this.att)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.video-list {
  &, li {
    list-style: none;
  }
}
.att-item-warp, .video-list .att-item-warp {
  &.data-state {
    position: relative;
  }
  span {
    display: inline-block;
  }
  .attend-poster {
    position: relative;
    .attend_focus {
      position: absolute;
      top: 4px;
      left: -4px;
    }
  }
  .hide-attend-poster {
    width: 28px;
    height: 28px;
  }
  .attend-name {
    margin-left: 14px;
    font-family: Consolas, Monaco, monospace;
  }
  .chairman, .admin {
    color: #278af9;
  }
  .presenter {
    color: red;
  }
  .attend-microphone {
    width: 24px;
    height: 40px;
    float: right;
    margin-right: 8px;
    cursor: pointer;
    background: url('../../../static/images/attendee/icon_microphone.png') no-repeat 0 8px;
    &:hover {
      background: url('../../../static/images/attendee/icon_microphone_pressed.png') no-repeat 0 8px;
    }
    &.microphone-open {
      background: url('../../../static/images/attendee/icon_microphone_open.png') no-repeat 0 8px;
      &:hover {
        background: url('../../../static/images/attendee/icon_microphone_open_pressed.png') no-repeat 0 8px;
      }
    }
    &.microphone-request-speak {
      background: url('../../../static/images/attendee/icon_microphone_inrequest.png') no-repeat 0 8px;
    }
  }
  .hide-microphone {
    width: 24px;
    height: 40px;
    float: right;
    margin-right: 12px;
  }
  .attend-camera {
    width: 24px;
    height: 40px;
    float: right;
    margin-right: 8px;
    cursor: pointer;
    background: url('../../../static/images/attendee/icon_camera_open.png') no-repeat 0 8px;
    &:hover {
      background: url('../../../static/images/attendee/icon_camera_open_pressed.png') no-repeat 0 8px;
    }
    &:not(.camera-open) {
      background: url('../../../static/images/attendee/icon_camera.png') no-repeat 0 8px;
      &:hover {
        background: url('../../../static/images/attendee/icon_camera_pressed.png') no-repeat 0 8px;
      }
    }
  }
  .hide-camera {
    width: 24px;
    height: 40px;
    float: right;
    margin-right: 8px;
  }
  .speaker-apply {
    position: absolute;
    width: 24px;
    height: 40px;
    top: 0px;
    right: 84px;
    background: url('../../../static/images/attendee/speaker_apply.png') no-repeat 0 8px;
  }
  .coll-btn {
    float: right;
    width: 10px;
    height: 40px;
    margin-right: 8px;
    cursor: pointer;
    background: url('../../assets/menu-icon/arrow.png') no-repeat 0 18px;
    &.coll-open {
      background: url('../../assets/menu-icon/arrow_pressed.png') no-repeat 0 18px;
    }
  }
  .hide-coll-btn {
    float: right;
    width: 10px;
    height: 40px;
    margin-right: 8px;
  }
  &:hover {
    background-color: #202F3D;
  }
  &.selected {
    background-color: #202F3D;
  }
}
</style>
