<template>
    <div class="modal-dialog">
        <div class="modal-header"> <span class="modal-title">{{ $t('m.layout_setLoopVideo') }}</span>
            <span class="modal-close" @click="closeView">&times;</span>
        </div>
        <div class="modal-body">
            <div class="form-wrap">
             <div>
              <span class="form-left">{{ $t('m.loop_video_type') }}</span>
                <select v-model="loopType" ref='selectedVal' @change="changeLoopType($event)">
                  <option v-for='(option, index) in computedOption' :key="index" :value="option.value">{{option.name}}</option>
                </select> <span class="form-right">{{ $t('m.loop_video_time') }}</span>
                <input type="text" style="width: 100px" v-model="Interval" maxlength="5" @change = "checkVal"> <span class="second">{{ $t('m.seconds') }}</span>
             </div>
                <div class='checkbox-wrap'>
                  <span class="checkbox-outer">
                    <input type="checkbox" v-model="filterBoardcastLoopUserStatus">
                    <label>去除正在广播轮巡用户</label>
                  </span>
                  <span class="checkbox-outer">
                  <input type="checkbox" v-model="filterLocalLoopUserStatus">
                    <label>去除正在本地轮巡用户</label>
                  </span>
                </div>
                <!-- 渲染参会人列表 -->
                <div class="attendee-list-warp">
                  <el-scrollbar  style="height: 100%;"  wrap-class="list" :native="false">
                    <ul>
                      <li class="attend-item"><input type="checkbox" @click="checkedAll()"><span class="userName">{{ $t('m.userName') }}</span></li>
                      <li class="attend-item clearfix" v-for="(att, index) in attendeeList" :key="index" :title="formatUserName(usersMap.get(att).DisplayName).isExtra ? usersMap.get(att).DisplayName : ''">
                        <input type="checkbox" v-model="selectedUserlist" :value="att">
                        <span class="attend-name" :title="formatUserName(usersMap.get(att).DisplayName).isExtra ? usersMap.get(att).DisplayName : ''"></span>
                        <span class="userName">{{ formatUserName(usersMap.get(att).DisplayName, 15).name }}</span>
                      </li>
                    </ul>
                  </el-scrollbar>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button :class="disabled ? 'start-loop' : 'notAllowed stop-loop'" :disabled="!disabled" class="start-loop" @click='startLoopVideo'>{{ $t('m.start_loop_video') }}</button>
            <button :class="disabled ? 'stop-loop notAllowed' : 'stop-loop'" :disabled="disabled" @click="stopLoopVideo">{{ $t('m.stop_loop_video') }}</button>
            <!-- 当前轮巡信息{{userLoopInfo.VideoPolling[0]}} -->
        </div>
    </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import hstSelect from '@/components/hst-components/select'
import hstButton from '@/components/hst-components/button'
import hstCheckbox from '@/components/hst-components/checkbox'
import hstTips from '@/components/hst-components/tips'
export default {
  data () {
    return {
      // 参会人染列表：
      // attendeeList: [],
      // 选中的列表
      selectedUserlist: [],
      filterspeakingUsers: [],
      // 轮巡状态
      loopStatus: 1,
      // 轮巡类型
      loopType: '',
      // 轮巡时间
      Interval: 15,
      // 全选
      isCheckedAll: false,
      // 过滤本地轮巡用户
      filterLocalLoopUserStatus: true,
      // 过滤广播轮巡用户
      filterBoardcastLoopUserStatus: true,
      timer: null, // 获取轮询用户的定时器
      disabled: false
    }
  },
  components: {
    hstSelect,
    hstButton,
    hstCheckbox,
    hstTips
  },
  created () {
    let getLoopMessage = {
      CmdID: 1018,
      Data: {
        UserID: this.userId
      }
    }
    this.$ws.send(getLoopMessage)
    this.loopType = this.computedOption[0].value
    this.selectedUserlist = this.selectedMap
  },
  computed: {
    ...mapState({
      usersMap: state => state.ws.attendeeUserMap,
      settingStatus: state => state.ws.settingStatus,
      isdisabled: state => state.ws.isdisabled,
      userLoopInfo: state => state.ws.userLoopInfo,
      loopUserMap: state => state.ws.loopUserMap
    }),
    ...mapGetters({
      videoUsers: 'ws/hasVideoUsers',
      filterUsers: 'ws/filterUsers'
    }),
    selectedMap () {
      let loopList = []
      loopList = this.userLoopInfo.VideoPolling.filter((item) => {
        return item.Screen === this.settingStatus.screenId && item.Window === this.settingStatus.windowId
      })
      return loopList
    },
    userId () {
      return this.$route.params.name ? parseInt(this.$route.params.name) : 0
    },
    computedOption () {
      var optionlist = ''
      if (this.getUserRight() === 'presenter' && this.getWindowType() === 'mainScreen') {
        optionlist = [{name: this.$t('m.boardcast_loop_video'), value: 1}, {name: this.$t('m.local_loop_video'), value: 0}]
      } else if (this.getUserRight() === 'presenter' || this.getUserRight() === 'chairman') {
        optionlist = [{name: this.$t('m.local_loop_video'), value: 0}]
      } else {
        optionlist = []
      }
      return optionlist
    },
    boardcastUserList () {
      let userList = []
      this.userLoopInfo.VideoPolling.map((item) => {
        if (item.Type === 1) {
          userList.push(...item.UserList)
        }
      })
      return userList
    },
    localUserList () {
      let userList = []
      this.userLoopInfo.VideoPolling.map((item) => {
        if (item.Type === 0) {
          userList.push(...item.UserList)
        }
      })
      return userList
    },
    // 计算过滤轮巡用户
    attendeeList () {
      let userList = this.videoUsers.filter(user => {
        let boardcastStatus = this.boardcastUserList.some((item) => {
          return user === item
        })
        let localStatus = this.localUserList.some((item) => {
          return user === item
        })
        return !((boardcastStatus && this.filterBoardcastLoopUserStatus) || (localStatus && this.filterLocalLoopUserStatus))
      })
      return userList
    }
  },
  methods: {
    // 请求客户端布局信息
    requestLayout (user) {
      if (user > 0) {
        // 获取某个参会人的布局
        let msg = {
          'CmdID': 1008,
          'Data': {
            'UserID': user
          }
        }
        this.$ws.send(msg)
      }
    },
    changeLoopType (e) {
      // console.log(this.loopType)
      // console.log('切换loop', e)
    },
    startLoopVideo () {
      if (this.selectedUserlist.length === 0) return
      this.loopStatus = 2
      this.setLoopVideo()
      this.requestloopInfo()
      this.$store.commit('ws/loopBtnStatus', {start: true, stop: false})
    },
    stopLoopVideo () {
      this.loopStatus = 0
      this.setLoopVideo()
      this.requestloopInfo()
      this.$store.commit('ws/loopBtnStatus', {start: false, stop: true})
    },
    setLoopVideo () {
      if (this.loopType === '') {
        this.loopType = this.computedOption[0].value
      }
      // web端请求视频轮巡权限
      let rightMsg = {
        'CmdID': 1017,
        'Data': {
          'Operation': 1,
          'RightType': 2 // 视频轮巡权限
        }
      }
      // web端设置视频轮巡权限
      let loopMsg = {
        'CmdID': 1019,
        'Data': {
          'UserID': this.userId,
          'VideoPolling': [
            {
              'ID': 1,
              'Type': this.loopType, // 本地轮巡
              // 'Type': 0,
              'Operation': 1,
              'Name': '',
              'UserList': this.selectedUserlist,
              'Interval': this.Interval * 1000,
              'Screen': this.settingStatus.screenId,
              'Window': this.settingStatus.windowId,
              'Status': this.loopStatus
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
      this.$ws.send(releaseRightMsg)
      // 请求轮巡列表
      this.$store.dispatch('ws/getLoopList', this.userId)
      this.$bus.$off('1509')
      this.$bus.$on('1509', () => {
        // 判断是否设置成功
        if (this.userLoopInfo.VideoPolling.length === 0) return
        this.setLocalSnapshot()
        this.closeView()
      })
    },
    setLocalSnapshot () {
      if (this.loopStatus) {
        this.$store.commit('ws/setLocalSnapshot', {
          'ScreenID': this.settingStatus.screenId,
          'WindowIndex': this.settingStatus.windowId,
          'type': this.loopType
        })
      } else {
        this.$store.commit('ws/clearLoopStatus', {
          'ScreenID': this.settingStatus.screenId,
          'WindowIndex': this.settingStatus.windowId
        })
      }
    },
    // 请求某个用户的视频轮巡（测试）
    requestloopInfo () {
      let requestMsg = {
        'CmdID': 1018,
        'Data': {
          'UserID': this.userId
        }
      }
      this.$ws.send(requestMsg)
    },
    // 获取用户身份
    getUserRight () {
      var role = ''
      if (this.usersMap.get(this.userId).DataState === 2) { // 主讲
        role = 'presenter'
      } else if (this.usersMap.get(this.userId).ManagerState === 2) { // 管理员
        role = 'admin'
      } else if (this.usersMap.get(this.userId).Right === 3) { // 主席
        role = 'chairman'
      }
      return role
    },
    // 获取窗口类型
    getWindowType () {
      var windowType = ''
      if (this.settingStatus.screenId > 0) {
        windowType = 'extraScreen'
      } else {
        windowType = 'mainScreen'
      }
      return windowType
    },
    // 计算渲染待轮巡用户列表
    // computedAttendeeList () {
    //   this.total = this.videoUsers.length
    //   this.attendeeList = this.videoUsers
    //   console.log(this.videoUsers)
    // },
    getLoopType () {
      this.loopType = parseInt(this.$refs.selectedVal.value)
    },
    checkVal (e) {
      let num = e.target.value - 0
      if (num <= 5) {
        this.Interval = 5
      }
    },
    // 全选用户列表
    checkedAll () {
      this.isCheckedAll = !this.isCheckedAll
      if (this.isCheckedAll) {
        // 全选时
        this.selectedUserlist = []
        this.attendeeList.forEach(function (att) {
          this.selectedUserlist.push(att)
        }, this)
      } else {
        this.selectedUserlist = []
      }
    },
    closeView () {
      clearInterval(this.timer)
      this.$emit('close-setLoopVideo')
    }
  },
  watch: {
    selectedMap (newVal) {
      if (newVal.length <= 0) {
        this.disabled = true
      } else {
        this.selectedUserlist = newVal[0].UserList || []
      }
    }
  // 监听轮巡用户列表变化
    // videoUsers: {
    //   immediate: true,
    //   handler () {
    //     this.computedAttendeeList()
    //   }
    // },
    // 监控广播用户列表变化
    // boardcastUsers: {
    //   handler () {
    //     this.computedAttendeeList()
    //   }
    // }
  }
}
</script>
<style lang="scss" scoped>
div.modal-dialog{
  width: 720px;
  height: 594px;
  position: fixed;
  top:  175px;
  left: 390px;
  z-index: 5000;
  background-color: #ffffff;
  border-radius: 5px;
  color: #323232;
  font-size: 12px;
  .modal-header {
    height: 48px;
    border-bottom: 1px solid #EAECEE;
    font-size: 16px;
    line-height: 48px;
    box-sizing: border-box;
    .modal-title {
      display: inline-block;
      width: calc(100% - 32px);
      text-indent: 20px;
    }
    .modal-close {
      width: 26px;
      font-size: 22px;
    }
  }
  .modal-body {
    .form-wrap{
      margin-left: 40px;
    }
    .form-left {
      margin-left: 10px;
    }
    .form-right {
      margin-left: 30px;
    }
    .second {
      padding-left: 10px;
    }
    select {
      height: 30px;
      width: 110px;
      border: 1px solid #DFE3E7;
      box-sizing: border-box;
      margin-top: 30px;
      padding-left: 10px;
    }
    input[type=text] {
      height: 30px;
      width: 50px;
      border: 1px solid #DFE3E7;
      box-sizing: border-box;
      margin-top: 30px;
      padding-left: 10px;
    }
    .checkbox-wrap {
      margin-top: 26px;
      .checkbox-outer {
        margin-right: 26px;
        label {
          padding-left: 6px;
          font-size: 13px;
          color:#323232;
        }
      }
    }
    .attendee-list-warp {
      width: 640px;
      height: 328px;
      margin-top: 16px;
      border: 1px solid #DFE3E7;
      border-radius: 2px;
      .list {
        max-height: 328px;
      }
      .attend-item {
        margin-top: 0;
        width: 620px;
        height: 40px;
        .userName {
          padding-left: 12px;
          // overflow:hidden;
          // text-overflow:ellipsis;
        }
        border: 0.5px solid #DFE3E7;
         &:nth-child(odd) {
           background-color: #F7F9FB;
         }
         line-height: 40px;
      }
    }
    input[type=checkbox] {
      -webkit-appearance: none;  /*清除复选框默认样式*/
      width: 16px;
      height: 16px;
      vertical-align:middle;
      box-sizing: border-box;
      margin-left:px;
      background: url('../../assets/common-icon/checkbox_white.png');
      &:checked {
        background: url('../../assets/common-icon/checkbox_focus_green.png') no-repeat;
      }
      &:hover{
        box-shadow: 0px 0px 2px 2px rgb(63, 176, 114);
        cursor: pointer;
      }
    }
  li {
    margin-top: 5px;
    padding-left: 20px;
    list-style: none;
  }
  }
  .modal-footer {
    margin-top: 30px;
    font-size: 14px;
    text-align: center;
    .start-loop {
      background-color: #2997DA;
      border: 0;
       &:hover {
         background-color: #258CCB;
       }
      color: #ffffff;
      border-radius: 3px;
      padding: 5px 30px;
      margin-right: 20px;
    }
    .stop-loop {
      background-color: #3DC28E;
      border: 0;
      color: #ffffff;
       &:hover {
         background-color: #38B987;
       }
      border: 1px solid #D4DBE3;
      border-radius: 3px;
      padding: 5px 30px;
    }
    .notAllowed {
        background-color: #3D5269;
        color: #8B97A5;
        cursor: not-allowed;
    }
  }
}
</style>
