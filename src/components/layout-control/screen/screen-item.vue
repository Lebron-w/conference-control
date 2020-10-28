<template>
<!-- 编辑状态的阴影： video-window-edit -->
<div class="video video-img-name-standard-video" :class="{'video-window-edit': isEditing}" @contextmenu.prevent="settingStatus($event)">
  <div :class="{'img': isIE, 'ie-img': !isIE, 'img-1': snapshot[$props.screenId].DataArea[1].UserData !== 6 && snapshot[$props.screenId].DataArea[1].UserData !== 12}">
    <img :src="layoutImgs.videoWindowClose" alt="" v-if="!windowItem.Data && windowItem.Type !== 7" :title="$t('m.layout_wnd_close')">
    <img :src="layoutImgs[imgStatus]" alt="" :title="$t('m.layout_wnd_' + imgStatus)" v-else>
  </div>
  <div>
    <span class="LoopVideoTip" v-if="imgStatus === 'localTour'" >
      <span :title="LoopUser.displayName">{{formatUserName(LoopUser.displayName, 12).name}}</span>
      等{{LoopUser.length}}人正在本地轮巡
    </span>
    <span class ="LoopVideoTip" v-if="imgStatus ==='broadcastTour'">
      <span :title="LoopUser.displayName">
        {{formatUserName(LoopUser.displayName, 12).name}}
      </span>
      等{{LoopUser.length}}人正在广播轮巡</span>
  </div>
  <!-- <div class="user-name" :class="'username-font-size-' + screenNum + '-' + splitNum" v-if="windowItem.Type !== 7">{{ formatUserName(`${displayname}${windowItem.Data > 0 ? '-' + (windowItem.UserData + 1) : ''}`, 20).name }}</div> -->
  <!-- <div class="user-name" :class="'username-font-size-' + screenNum + '-' + splitNum" v-if="windowItem.Type !== 7">{{ formatUserName(`${displayname}${windowItem.Data > 0 ? '-' + (windowItem.UserData + 1) : ''}`, 10).name }}</div> -->
  <!-- <div class="user-name" :class="userNameClasses" v-if="windowItem.Type !== 7">{{ formatUserName(`${displayname}${windowItem.Data > 0 ? '-' + (windowItem.UserData + 1) : ''}`, splitNum >= 36 ? 12 : 20).name }}</div> -->
  <div class="user-name" :class="`username-font-size-${screenNum}-${splitNum} ${isIE ? ' not-ie' : ''}`" v-if="windowItem.Type !== 7">{{ formatUserName(`${displayname}${windowItem.Data > 0 ? '-' + (windowItem.UserData + 1) : ''}`, splitNum >= 36 ? 12 : 20).name }}</div>
  <div class="full-screen" v-if="windowItem.Data && isFulled">
    <img :src="layoutImgs.fullScreen" alt="">
  </div>
  <!-- 浮动层 -->
  <div
    class="draggable-layout-attendee draggable-attendee"
    v-if="isEditing"
    @drop="drop($event)"
    @dragover="allowDrop($event)"
    :draggable="$store.state.ws.isEditing && windowItem.Data > 0"
    @dragstart="drag($event, windowItem.Data, windowItem.UserData, $props.screenId, $props.windowIndex)"
    :title="formatUserName(`${displayname}${windowItem.Data > 0 ? '-' + (windowItem.UserData + 1) : ''}`).isExtra ? `${displayname}${windowItem.Data > 0 ? '-' + (windowItem.UserData + 1) : ''}` : ''">
  </div>
  <!-- 右键弹窗组件 -->
  <hst-contextmenu
    v-if="showContextmenu"
    @close-contextmenu="showContextmenu = false"
    :event-info="contextmenuEvent"
  >
    <ul class="ctxmenu-list">
      <li  v-if="windowItem.Data !== 0" :class="{'is-selected': snapshot[$props.screenId].DataArea[1].Item[$props.windowIndex].broadcastAudio}" @click="boardAudio">
        <span class="menu-list-text">{{ $t('m.layout_boardAudio') }}</span>
      </li>
      <li v-if="windowItem.Data !== 0" :class="{'is-selected': snapshot[$props.screenId].DataArea[1].Item[$props.windowIndex].broadcastVideo}" @click="boardVideo">
        <span class="menu-list-text">{{ $t('m.layout_boardVideo') }}</span>
      </li>
      <li v-if="windowItem.Data !== 0 && userId" class="is-selected" @click="checkAttVideo">
        <span class="menu-list-text">{{ $t('m.layout_checkAttVideo') }}</span>
      </li>
      <li v-if="windowItem.Data !== 0" class="selective-segmenting-line">
        <hr>
      </li>
      <!--停止视频轮巡-->
      <!-- <li v-show="userId" > -->
      <li v-show="userId && imgStatus.indexOf('Tour') > -1">
        <!-- {{imgStatus.indexOf('Tour')}} -->
        <span class="menu-list-text" @click="stopVideoLoop">{{ $t('m.layout_stopLoopVideo') }}</span>
      </li>
      <!-- 设置视频轮巡 -->
       <!-- <li @click="setLoopVideo" v-show="userId&&usersMap.get(userId).Right !== 1&&this.usersMap.get(userId).Right === 3 && userLoopInfo.Status.VideoPolling.Status === 0"> -->
      <li
        @click="setLoopVideo"
        v-show="userId && usersMap.get(userId).Right !== 1 && this.usersMap.get(userId).Right === 3"
      >
        <span class="menu-list-text">{{ $t('m.layout_setLoopVideo') }}</span>
      </li>
      <li v-if="windowItem.Data !== 0" :class="{'is-selected': isFulled}" @click="setFullWindow(isFulled, windowItem.Data, windowItem.UserData)">
        <span class="menu-list-text">{{ $t('m.layout_setFullWindow') }}</span>
      </li>
    </ul>
  </hst-contextmenu>
</div>
</template>
<script>
import layoutImgs from 'assets/layout-images'
import { mapState } from 'vuex'
import hstContextmenu from '@/components/hst-components/contextmenu'

export default {
  props: ['screenId', 'windowIndex', 'screenItem', 'isFullScreen'],
  components: {
    hstContextmenu
  },
  data () {
    return {
      layoutImgs,
      reciveDragAttendee: null,
      showContextmenu: false,
      contextmenuEvent: null,
      imgStatus: 'broadcast',
      isIE: false,
      usernameClasses: ''
    }
  },
  computed: {
    ...mapState({
      isEditing: state => state.ws.isEditing,
      usersMap: state => state.ws.attendeeUserMap,
      snapshot: state => state.ws.snapshot,
      attendeeUserId: state => state.ws.attendeeUserId,
      userLayoutInfo: state => state.ws.userLayoutInfo,
      isdisabled: state => state.ws.isdisabled,
      userLoopInfo: state => state.ws.userLoopInfo
    }),
    hasLoopAccess () {
      let accessObj = this.usersMap.get(this.userId) || {}
      console.log(accessObj)
      return (accessObj.ProtocolVer >= 1.4)
    },
    isBoardVideo: {
      get () {
        return this.snapshot[this.$props.screenId].DataArea[1].Item[this.$props.windowIndex].broadcastVideo
      }
    },
    isBoardAudio: {
      get () {
        return this.snapshot[this.$props.screenId].DataArea[1].Item[this.$props.windowIndex].broadcastAudio
      }
    },
    attendeeInfo () {
      return this.$props.screenItem && this.$props.screenItem.hasOwnProperty('Data') ? (this.usersMap.get(this.$props.screenItem.Data) ? this.usersMap.get(this.$props.screenItem.Data) : {}) : {}
    },
    windowItem () {
      return this.snapshot[this.$props.screenId].DataArea[1].Item[this.$props.windowIndex]
    },
    windowPos () {
      return this.$props.screenItem.Pos ? this.$props.screenItem.Pos : this.$props.windowIndex
    },
    fullScreen () {
      return this.snapshot[this.screenId].FullDataType === 6 ? `@${this.snapshot[this.screenId].FullDataID}:${this.snapshot[this.screenId].FullUserData}` : false
    },
    isFulled () {
      return this.snapshot[this.screenId].FullDataType === 6 && `@${this.snapshot[this.screenId].FullDataID}:${this.snapshot[this.screenId].FullUserData}` === `@${this.windowItem.Data}:${this.windowItem.UserData}`
    },
    displayname () {
      return this.getUsername(this.windowItem.Data, this.$store)
    },
    userId () {
      return this.$route.params.name ? parseInt(this.$route.params.name) : 0
    },
    // 快照中的屏幕数
    screenNum () {
      return this.snapshot.length === 1 ? 1 : 2
    },
    // 当前分屏数
    splitNum () {
      return this.snapshot[this.$props.screenId].LayoutMode !== 3 ? 16 : this.snapshot[this.$props.screenId].DataArea[1].UserData
    },
    // 当前轮巡用户列表
    // loopUserList () {
    //   console.log(this.userLoopInfo)
    //   // return this.userLoopInfo.hasOwnProperty('UserList') ? this.userLoopInfo.VideoPolling[0].UserList : []
    // },
    LoopUser () {
      let loopList = this.userLoopInfo.VideoPolling.filter((item) => {
        return item.Screen === this.screenId && item.Window === this.windowIndex
      })
      if (loopList.length === 0) {
        return {
          length: 0,
          displayName: 0
        }
      } else {
        return {
          displayName: this.usersMap.get(loopList[0].UserList[0]).DisplayName,
          length: loopList[0].UserList.length
        }
      }
      // console.log('======>', this.loopUserList)
      // if (!this.loopUserList) {
      //   return this.usersMap.get(this.loopUserList[0]).DisplayName
      // }
    }
  },
  created () {
    this.getImgStatus()
    this.isIE = this.getBrowserType()
  },
  methods: {
    // // 请求客户端布局信息
    // requestLayout (user) {
    //   if (user > 0) {
    //     // 获取某个参会人的布局
    //     let msg = {
    //       'CmdID': 1008,
    //       'Data': {
    //         'UserID': user
    //       }
    //     }
    //     this.$ws.send(msg)
    //   }
    // },
    getImgStatus () {
      this.imgStatus = this.snapshot[this.screenId].DataArea[1].Item[this.$props.windowIndex].Type === 7 ? (
        // 轮询：UserData === 0 ? 本地轮询，1 广播轮询
        this.snapshot[this.screenId].DataArea[1].Item[this.$props.windowIndex].UserData === 0 ? 'localTour' : 'broadcastTour'
      ) : (
        this.snapshot[this.screenId].DataArea[1].Item[this.$props.windowIndex].broadcastVideo ? 'broadcast' : 'videoCheck'
      )
    },
    boardAudio () {
      // 广播音频 or not
      this.alterSnap(this.snapshot, this.$props.screenId, this.windowPos, {broadcastAudio: !this.windowItem.broadcastAudio})
      // 保存操作到store
      this.showContextmenu = false
    },
    boardVideo () {
      // 会议室布局上，相当于不查看
      if (this.$props.screenId === 0 && this.userId === 0) {
        // 记录关闭该参会人的视频
        this.$store.commit('ws/cancellVideo', {
          add: {
            userId: this.snapshot[this.$props.screenId].DataArea[1].Item[this.windowPos].Data,
            mediaId: this.snapshot[this.$props.screenId].DataArea[1].Item[this.windowPos].UserData
          }
        })
        this.alterSnap(this.snapshot, this.$props.screenId, this.windowPos, {deleteUser: true})
      } else {
        this.alterSnap(this.snapshot, this.$props.screenId, this.windowPos, {broadcastVideo: !this.windowItem.broadcastVideo})
      }
      // 保存操作到store
      this.showContextmenu = false
    },
    checkAttVideo () {
      // 查看视频，勾选时清除参会人
      this.alterSnap(this.snapshot, this.$props.screenId, this.windowPos, {deleteUser: true})
      // 保存操作到store
      this.showContextmenu = false
    },
    // 停止视频轮巡
    stopVideoLoop () {
      if (!this.hasLoopAccess) return this.$message({type: 'warning', message: this.$t('m.attendee_msg_tip2')})
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
          'UserID': this.userId,
          'VideoPolling': [
            {
              'ID': 1,
              'Type': this.getImgStatus === 'localTour' ? 0 : 1,
              'Operation': 1,
              'Screen': this.screenId,
              'Window': this.windowIndex,
              'Status': 0
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
      this.$ws.send(rightMsg)
      this.$ws.send(loopMsg)
      if (!this.isExclusiveRight) this.$ws.send(releaseRightMsg)
      this.showContextmenu = false
      // 去除当前窗口的轮巡状态
      this.clearLocalLoopSnap()
    },
    clearLocalLoopSnap () {
      let params = {
        ScreenID: this.screenId,
        WindowIndex: this.windowIndex
      }
      this.$store.commit('ws/clearLoopStatus', params)
    },
    // refreshSnapshot () {
    //   // 发送消息获取最新布局
    //   this.requestLayout(this.userId)
    //   this.$store.commit('ws/changeEditStutau', false)
    //   // this.$store.commit('ws/createSnap', JSON.parse(JSON.stringify(this.userLayoutInfo.get(this.userId))))
    //   this.$store.commit('ws/refreshSnap', this.userId)
    // },
    // 设置视频轮巡
    setLoopVideo () {
      if (!this.hasLoopAccess) return this.$message({type: 'warning', message: this.$t('m.attendee_msg_tip2')})
      let params = {
        open: true,
        screenId: this.$props.screenId,
        windowId: this.$props.windowIndex,
        loopStatus: this.imgStatus
      }
      this.$store.commit('ws/loopVideoSetting', params)
      this.showContextmenu = false
    },
    setFullWindow (isfull, userId, videoId) {
      this.$store.commit('ws/fullVideWindow', [!isfull, this.screenId, userId, videoId])
      this.showContextmenu = false
    },
    // 视频窗口拖拽
    drag (evt, userId, mediaId, screenId, windowIndex) {
      this.setDragData(evt, 'dropEffect', 'copy')
      this.setDragData(evt, 'effectAllowed', 'all')
      this.setDragData(evt, 'data', JSON.stringify({
        userId,
        mediaId,
        screenId,
        windowIndex,
        broadcastVideo: this.windowItem.broadcastVideo,
        broadcastAudio: this.windowItem.broadcastAudio
      }))
      console.log('mediaId====>', mediaId)
    },
    // 拖拽过来的数据：
    drop (evt) {
      window.evt = evt
      evt.preventDefault()
      let draggedUserObj = JSON.parse(this.getDragData(evt, 'data'))
      if (!draggedUserObj.hasOwnProperty('flag')) {
        // 拖拽过来的窗口
        this.$store.dispatch('ws/dragLayoutAttToWindow', {
          from: {
            screenId: draggedUserObj.screenId,
            windowId: draggedUserObj.windowIndex,
            userId: draggedUserObj.userId,
            mediaId: draggedUserObj.mediaId,
            broadcastVideo: draggedUserObj.broadcastVideo,
            broadcastAudio: draggedUserObj.broadcastAudio,
            srcUserId: this.userId // 当前设置布局用户id
          },
          to: {
            screenId: this.$props.screenId,
            windowId: this.$props.windowIndex,
            userId: this.windowItem.Data,
            mediaId: this.windowItem.UserData,
            broadcastVideo: this.windowItem.broadcastVideo,
            broadcastAudio: this.windowItem.broadcastAudio,
            srcUserId: this.userId // 当前设置布局用户id
          }
        })
      } else {
        // 拖拽过来的参会人
        if (!(draggedUserObj.mediaId + '')) {
          this.$message({
            type: 'warning',
            message: this.$t('m.layout_msg_unableDrag')
          })
        } else {
          this.$store.commit('ws/dragAttToLayout', [draggedUserObj.userId, draggedUserObj.mediaId, this.userId, this.$props.screenId, this.windowPos])
        }
      }
    },
    allowDrop (evt) {
      if (this.isEditing) {
        evt.preventDefault()
      }
    },
    settingStatus (e) {
      if (this.isEditing) {
        // 当前仅当 空窗口和 会议室布局时 不显示菜单 // 当且仅当 空窗口和当前会议室用户客户端协议为1.4以下 不显示菜单
        if (this.windowItem.Data === 0 && this.userId === 0) return
        this.contextmenuEvent = e
        this.showContextmenu = true
      }
    },
    // 修改快照的窗口对应属性
    /**
     * @param {snap} 修改的快照
     * @param {screenId} 屏幕ID
     * @param {pos} 屏幕位置
     * @param {userInfo} 用户信息
     */
    alterSnap (snap, screenId, pos, userInfo = {}, setFullScreen = {}) {
      if (userInfo.hasOwnProperty('broadcastAudio')) {
        // 修改快照中所有用户的broadcastAudio状态
        for (let screenSnap of snap) {
          for (let item of screenSnap.DataArea[1].Item) {
            if (item.Type !== 7 && item.Data > 0 && item.Data === this.windowItem.Data) {
              item.broadcastAudio = userInfo.broadcastAudio
            }
          }
        }
      } else if (userInfo.hasOwnProperty('broadcastVideo')) {
        snap[screenId].DataArea[1].Item[pos].broadcastVideo = userInfo.broadcastVideo
      } else if (userInfo.hasOwnProperty('deleteUser')) {
        snap[screenId].DataArea[1].Item[pos].Data = 0
      }
    }
  },
  watch: {
    attendeeUserId: {
      handler () {
        if (this.windowItem.Type !== 7 && !this.isEditing && this.windowItem.Data > 0 && this.windowItem.UserData >= 0) {
          if (this.usersMap.get(this.windowItem.Data) && this.usersMap.get(this.windowItem.Data).Video) {
            for (let vid of this.usersMap.get(this.windowItem.Data).Video) {
              if (vid.ID === this.windowItem.UserData) {
                // 主屏上的参会人视频被关了，移除
                if (this.userId === 0 && vid.State !== 2) {
                  this.windowItem.Data = 0
                  this.windowItem.UserData = 0
                }
              }
            }
          }
        }
        let userInfo = this.usersMap.get(this.windowItem.Data) || {}
        if (userInfo.Audio && userInfo.Audio.State) {
          this.windowItem.broadcastAudio = userInfo.Audio.State === 2
        } else {
          this.windowItem.broadcastAudio = false
        }
        // 检测当前编辑的布局页用户是否退出
        if (this.userId > 0 && this.attendeeUserId.indexOf(this.userId) === -1) {
          this.$message({
            type: 'error',
            message: this.$t('m.layout_msg_exitMeetingRoom')
          })
          if (this.isEditing) this.$store.commit('ws/changeEditStutau', false)
          this.$router.push('/home/layout/')
        }
      },
      immediate: true
    },
    snapshot: {
      deep: true,
      handler (list) {
        if (!this.isEditing && this.windowItem.Type !== 7 && this.$props.screenId === 0 && this.userId === 0 && !this.windowItem.broadcastVideo) {
          this.snapshot[0].DataArea[1].Item[this.$props.windowIndex].Data = 0
          this.snapshot[0].DataArea[1].Item[this.$props.windowIndex].UserData = 0
        }
      }
    },
    windowItem: {
      deep: true,
      handler (item) {
        this.getImgStatus()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.video-img-name-standard-video {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #3D5269;
  display: flex;
  flex-direction: column;
  // 左右居中
  justify-content: center;
  // 上下居中
  align-items:center;
  .img {
    width: 15%;
    img {
      width: 100%;
    }
  }
  .ie-img {
    width: 15%;
    height: 14%;
    &.img-1 {
      height: 18%;
    }
    img {
      width: 100%;
    }
  }
  .user-name {
    width: 100%;
    line-height: 110%;
    color: #AAC1D8;
    font-family: Consolas, Monaco, monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /* 用户名字号大小修改 */
  .username-font-size-1-1 {
    font-size: 18px;
    line-height: 28px;
  }
  .username-font-size-2-1, .username-font-size-1-2, .username-font-size-1-4, .username-font-size-1-6 {
    font-size: 16px;
    line-height: 28px;
  }
  .username-font-size-1-9, .username-font-size-1-12, .username-font-size-1-16, .username-font-size-1-25 {
    font-size: 14px;
    line-height: 28px;
  }
  .username-font-size-1-36, .username-font-size-1-49, .username-font-size-1-64, .username-font-size-2-2, .username-font-size-2-4, .username-font-size-2-6,
  .username-font-size-2-9, .username-font-size-2-12, .username-font-size-2-16 {
    font-size: 12px;
    line-height: 26px;
  }
  .username-font-size-2-25, .username-font-size-2-36 {
    font-size: 11px;
    -webkit-transform: scale((0.9));
    line-height: 30px;
    &.not-ie {
      line-height: 11px;
    }
  }
  .username-font-size-2-49, .username-font-size-2-64 {
    font-size: 10px;
    -webkit-transform: scale((0.8));
    line-height: 34px;
    &.not-ie {
      line-height: 10px;
    }
  }

  & {
    position: relative;
    .full-screen {
      width: 4%;
      height: 0;
      position: absolute;
      right: 10px;
      top: 10px;
      img {
        position: absolute;
        width: 100%;
        top: 0;
        right: 0;
      }
    }
  }
}
.video-window-edit {
  &:hover {
    position: relative;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 100;
      box-shadow: 0px 0px 20px 4px rgb(74, 121, 175);
    }
  }
}

.draggable-layout-attendee {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1001;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items:center;
}

.ctxmenu-list {
  display: inline-block;
  width: 100%;
  height: 100%;
  background-color: #fff;
  color: #1E1E1E;
  border-radius: 5px;
  padding-top: 8px;
  padding-bottom: 8px;
  &, & li {
    list-style: none;
  }
  li {
    text-align: left;
    font-size: 12px;
    line-height: 30px;
    span.menu-list-text {
      margin-left: 46px;;
    }
    &.is-selected {
      background: url('../../../assets/common-icon/selected.png') 18px 8px no-repeat;
    }
    &.segmenting-line {
      padding-top: 5px;
      hr {
        border-color: #DADCDD;
      }
    }
  }
}
</style>
