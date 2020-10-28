<template>
  <div class="right-sidebar clearfix">
    <div class="ces-attendee">{{ $t('m.attendee') }}</div>
    <ul class="attednee-tab clearfix">
      <li @click="attendListType = 0" :class="{'tab-active': attendListType === 0}">{{ $t('m.all') }}&nbsp;{{ allUsers.length }}</li>
      <li @click="attendListType = 1" :class="{'tab-active': attendListType === 1}">{{ $t('m.speaking') }}&nbsp;{{ speakingUsers.length }}</li>
      <li class="request clearfix" @click="attendListType = 2;newMsgTip = false" :class="{'tab-active': attendListType === 2}">
        <span>{{ $t('m.request') }}&nbsp;{{ inRequestUsers.length }}</span>
        <i :class="{'new-notice': newMsgTip}"></i>
      </li>
      <li @click="attendListType = 3" :class="{'tab-active': attendListType === 3}">{{ $t('m.attention') }}&nbsp;{{ careUsers.length }}</li>
    </ul>
    <div class="attend-sreach-input">
      <input type="text" class="hst-input" :class="{'left-sreach-btn': sreachAttendWord.length > 0, 'sreach-btn-position': $i18n.locale === 'en-US'}" :placeholder="$t('m.sreachAttendWord')" ref="sreachPressed" v-model="sreachAttendWord">
    </div>
    <!-- 渲染参会人列表 -->
    <div class="attendee-list-warp">
        <ul class="attend-list" :class="{'is-not-need-pagnation': !isNeedPagnation}" ref="attendList">
          <el-scrollbar style="height: 100%;">
            <li
              class="attend-item clearfix"
              v-for="att in attendeeList"
              :class="{'selected': multiSelectAttendee.indexOf(getUserId(att)) > -1}"
              :key="att.name"
              @contextmenu.prevent="attendCtxmenu(att, $event)"
              @click="chooseAttend(att, $event)"
              >
              <attendee-item :att-info="att" :attend-type="attendListType" :multi-select-att="multiSelectAttendee"></attendee-item>
            </li>
          </el-scrollbar>
          <!-- 参会人列表右键菜单 -->
          <div class="menumouse-dialog" v-if="showContextmenu"
            :style="{[contextmenuDialogTop ? 'top' : 'bottom']: contextmenuDialogTop + 'px'}" @mouseleave="showContextmenu = false">
            <ctx-menu :attendee="multiSelectAttendee" @close="showContextmenu = false" @oper-adj='operAdj' @oper-att='operAtt'></ctx-menu>
          </div>
        </ul>
    </div>
    <div class="attendee-pagintation" v-if="isNeedPagnation">
      <hst-pagination class="hst-pagination" :curent-page="currentPage" :page-size="pageSize" :total="total" @change-pagintation="changePagintation"></hst-pagination>
    </div>
    <div class="fast-fill-btn" :class="{clearQuickFillHover: !$store.state.ws.isEditing}" @click="quickFillAttToWindow" ref="quickFill">{{ $t('m.quickFill') }}</div>
    <!-- 远程调节音视频 -->
    <hst-dialog v-if="toRemoteAdjust">
      <adjust-audio-and-video class="remote-adjust"  @close-remote-adjust="toRemoteAdjust = false" :user-id="userId"></adjust-audio-and-video>
    </hst-dialog>
    <!-- 查看参会人信息 -->
    <hst-dialog v-if="showaAttendeeInfo">
      <attendee-info @close-attendeeinfo="showaAttendeeInfo = false" :user-id="userId"></attendee-info>
    </hst-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
// 引入自定义组件：hst-pagination
import hstPagination from '@/components/hst-components/pagination'
// attendee-item
import attendeeItem from '@/components/attendee/attendee-item'
// 右键菜单组件
import ctxMenu from '../../components/attendee/ctx-menu'
// Dialog组件
import hstDialog from '@/components/hst-components/dialog'
import adjustAudioAndVideo from '@/components/attendee/adjustAudioAndVideo'
import attendeeInfo from '@/components/attendee/attendeeInfo'
export default {
  components: {
    hstPagination,
    attendeeItem,
    ctxMenu,
    hstDialog,
    adjustAudioAndVideo,
    attendeeInfo
  },
  data () {
    return {
      sreachAttendWord: '',
      currentPage: 1,
      pageSize: 50,
      total: 0,
      allMultiSelectAttendee: [],
      // 参会人tab列：0 全部， 1 发言者， 2 请求中， 3 关注
      attendListType: 0,
      showContextmenu: false,
      contextmenuDialogTop: 0,
      newMsgTip: false,
      // 渲染列表：
      attendeeList: [],
      toRemoteAdjust: false,
      showaAttendeeInfo: false,
      userId: 0
    }
  },
  computed: {
    ...mapState({
      windowResize: state => state.windowResize,
      usersMap: state => state.ws.attendeeUserMap,
      attendeeUserId: state => state.ws.attendeeUserId,
      // 关注的参会人
      careSeatList: state => state.ws.careSeatList,
      // 请求中的用户列表
      requestList: state => state.ws.requestList
    }),
    ...mapGetters({
      allUsers: 'ws/allUsers',
      speakingUsers: 'ws/speakingUsers',
      inRequestUsers: 'ws/inRequestUsers',
      careUsers: 'ws/careUsers'
    }),
    // 多选参会人去重
    multiSelectAttendee () {
      let noRepeatAttendee = []
      this.allMultiSelectAttendee.forEach(userId => {
        if (noRepeatAttendee.indexOf(this.getUserId(userId)) === -1) {
          noRepeatAttendee.push(this.getUserId(userId))
        }
      })
      return noRepeatAttendee
    },
    // 是否需要分页
    isNeedPagnation () {
      return this.total > 50
    },
    requestListLen () {
      return this.requestList.length
    }
  },
  created () {
    this.readCareLists()
  },
  mounted () {
    this.computedPagesize()
  },
  methods: {
    operAtt (att) {
      this.showaAttendeeInfo = true
      this.userId = att
    },
    operAdj (att) {
      this.toRemoteAdjust = true
      this.userId = att
    },
    changePagintation (c) {
      this.currentPage = c
    },
    // 单击选中参会人或ctrl+左键多选参会人事件
    chooseAttend (attendItem, event) {
      let e = event || window.event
      if (e.ctrlKey) {
        this.allMultiSelectAttendee.push(attendItem)
      } else {
        this.allMultiSelectAttendee = []
        this.allMultiSelectAttendee.push(attendItem)
      }
    },
    // 右键单击参会人事件
    attendCtxmenu (attendItem, evt) {
      // dialog位置
      let screenHeight = document.body.clientHeight
      this.contextmenuDialogTop = this.$refs.attendList.scrollTop + evt.clientY - 180
      if (this.$refs.attendList.scrollTop + evt.clientY < 480) {
        this.contextmenuDialogTop = 1
      }
      if (screenHeight > 600) {
        if (this.$refs.attendList.offsetHeight - evt.clientY < 50) {
          this.contextmenuDialogTop = 0
        }
      }
      // 选中的目标
      if (this.allMultiSelectAttendee.indexOf(attendItem) === -1) {
        this.allMultiSelectAttendee = []
        this.allMultiSelectAttendee.push(attendItem)
      }
      this.showContextmenu = true
    },
    // 快速填充参会人
    quickFillAttToWindow () {
      if (!this.$store.state.ws.isEditing) return
      // 快速填充的参会人默认都是游离的
      for (let item of this.allUsers) {
        // 计算当前已填充的参会人列表
        this.$store.commit('ws/computedFilledAtts')
        // 视频路数达上限，不在填充
        if (this.$store.state.ws.filledAtts.length >= 64) {
          this.$message({
            type: 'warning',
            message: this.$t('m.attendee_msg_tip5')
          })
          return
        }
        // 判断是否有摄像头
        if (this.$store.state.ws.attendeeUserMap.get(item).Video && this.$store.state.ws.attendeeUserMap.get(item).Video.length > 0) {
          // 从第0个窗口开始填充
          let isFilled = false
          this.$store.state.ws.filledAtts.forEach(att => {
            if (att.indexOf(item) > -1) {
              isFilled = true
            }
          })
          if (!isFilled) {
            // 获取默认填充的摄像头ID
            this.$store.commit('ws/dragFillDissociativeAtt', [`@${item}:${this.dragableCamera(item).id}`])
          }
        }
      }
    },
    // 显示参会人分页
    showAttendee (att, cp, ps) {
      let firstAttendee = (cp - 1) * ps
      let lastAttendee = cp * ps
      if (!att || att.length === 0) return []
      if (firstAttendee > att.length) {
        return []
      } else {
        return att.slice(firstAttendee, lastAttendee)
      }
    },
    // 参会人搜索 filter
    checkAttendSearch (att) {
      return this.usersMap.get(this.getUserId(att)).DisplayName.toString().indexOf(this.sreachAttendWord) > -1
    },
    // 参会人userId格式化
    getUserId (str) {
      let u = -1
      if (str.toString().indexOf('@') > -1) {
        str = str.substring(1)
      }
      u = str.toString().indexOf(':') > -1 ? parseInt(str.match(/(\S*):/)[1]) : parseInt(str)
      return u
    },
    isMainAtt (str) {
      if (str.toString().indexOf('@') === 0) {
        return true
      } else {
        return false
      }
    },
    // 计算pageSize
    computedPagesize () {
      if (this.total <= 50) {
        this.pageSize = 50
      } else {
        this.pageSize = parseInt((this.$refs.quickFill.offsetTop - this.$refs.sreachPressed.offsetTop - 55) / 42) < 5 ? 5 : parseInt((this.$refs.quickFill.offsetTop - this.$refs.sreachPressed.offsetTop - 55) / 42)
      }
    },
    // 计算渲染数组和用户信息
    computedAttendeeList () {
      if (this.attendeeUserId.length > 0) {
        switch (this.attendListType) {
          case 0:
            let _allUsers = this.allUsers.filter(this.checkAttendSearch)
            this.total = _allUsers.length
            this.attendeeList = this.isNeedPagnation ? this.showAttendee(_allUsers, this.currentPage, this.pageSize) : _allUsers
            break
          case 1:
            let _speakingUsers = this.speakingUsers.filter(this.checkAttendSearch)
            this.total = _speakingUsers.length
            this.attendeeList = this.isNeedPagnation ? this.showAttendee(_speakingUsers, this.currentPage, this.pageSize) : _speakingUsers
            break
          case 2:
            let _inRequestUsers = this.inRequestUsers.filter(this.checkAttendSearch)
            this.total = _inRequestUsers.length
            this.attendeeList = this.isNeedPagnation ? this.showAttendee(_inRequestUsers, this.currentPage, this.pageSize) : _inRequestUsers
            break
          case 3:
            let _careUsers = this.careUsers.filter(this.checkAttendSearch)
            this.total = _careUsers.length
            this.attendeeList = this.isNeedPagnation ? this.showAttendee(_careUsers, this.currentPage, this.pageSize) : _careUsers
            break
          default:
            break
        }
      } else {
        this.total = 0
        this.attendeeList = []
      }
    },
    // 从内存读取关注的参会人列表
    readCareLists () {
      let localCares = JSON.parse(localStorage.getItem(`carelist`)) || []
      this.$store.commit('ws/saveCareUsers', localCares)
      this.$store.commit('ws/setUserCareseat')
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
    }
  },
  watch: {
    // 监听关注的参会人是否变化
    careSeatList: {
      handler (list) {
        if (this.attendeeUserId.length > 0) {
          // careSeatList 变化时，修改用户信息中的careseat
          this.$store.commit('ws/setUserCareseat')
          // 保存到localStorage中
          this.setItem(`carelist`, JSON.stringify(list))
        }
      },
      deep: true
    },
    attendListType: {
      immediate: true,
      handler () {
        this.computedAttendeeList()
      }
    },
    attendeeUserId () {
      this.computedAttendeeList()
    },
    sreachAttendWord () {
      this.computedAttendeeList()
    },
    currentPage () {
      this.computedAttendeeList()
    },
    pageSize () {
      this.computedAttendeeList()
    },
    total (total, oldTotal) {
      if ((total > 50 && oldTotal <= 50) || (total <= 50 && oldTotal > 50)) {
        // 重新计算分页数据
        this.computedPagesize()
      }
    },
    requestList: {
      deep: true,
      handler (list, oldList) {
        if (this.attendListType !== 2 && list.length > 0 && oldList.length < list.length) {
          this.newMsgTip = true
        }
      }
    },
    requestListLen (len, oldLen) {
      if (this.attendListType !== 2 && len > 0 && oldLen < len) {
        this.newMsgTip = true
      }
    },
    inRequestUsers (list, oldList) {
      if (list.length === 0) {
        this.newMsgTip = false
      }
    },
    windowResize: {
      immediate: true,
      handler () {
        try {
          this.computedPagesize()
        } catch (e) {}
      }
    },
    allUsers (curAll, oldAll) {
      if (curAll.length === 0 && curAll.length < oldAll.length) {
        // 所有人参会人退出了会议室、清空会议室内保存的信息
        let storageObj = localStorage
        for (let key in storageObj) {
          if (/^nav-/.test(key) || /^layout-/.test(key)) {
            try {
              localStorage.removeItem(key)
            } catch (e) {
              localStorage[key] = '[]'
            }
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../config/ces.config.scss';
.right-sidebar {
  background-color: $sidebarBgcolor;
  color: #ACC1D8;
  position: relative;
  font-size: 12px;
  & div, & ul {
    width: 100%;
  }
  .ces-attendee {
    padding-left: 14px;
    color: #FFF;
    line-height: 40px;
    font: {
      size: 14px;
      weight: bold;
    }
  }
  .attednee-tab {
    padding: 10px 0 0;
    li {
      list-style: none;
      box-sizing: border-box;
      width: 25%;
      float: left;
      text-align: center;
      cursor: pointer;
      padding-bottom: 15px;
      &:hover, &.tab-active {
        padding-bottom: 13px;
        color: #278af9;
        border-bottom: 2px solid #278af9;
      }
    }
    li.request {
      position: relative;
      i.new-notice {
        display: inline-block;
        width: 0;
        height: 0;
        border: 3px solid #FF9C54;
        border-radius: 3px;
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
  .attend-sreach-input {
    height: 30px;
    padding-bottom: 8px;
    text-align: center;
  }
  .attendee-list-warp {
    width: 100%;
    .attend-list {
      position: relative;
      width: calc(100% + 18px);
      height: calc(100vh - 300px);
      overflow-x: hidden;
      overflow-y: scroll;
      &.is-not-need-pagnation {
        height: calc(100vh - 265px);
      }
      .attend-item {
        line-height: 40px;
        margin-top: 1px;
        margin-bottom: 1px;
        list-style: none;
        margin-left: 8px;
        &:hover {
          background-color: #202F3D;
        }
        &.selected {
          background-color: #202F3D;
        }
      }
      // dialog
      .menumouse-dialog {
        width: 100%;
        // height: 263px;
        position: absolute;
        z-index: 1001;
        left: 0;
      }
    }
  }
  .attendee-pagintation {
    position: absolute;
    left: 0;
    bottom: 40px;
    width: calc(100% -28px);
    margin-left: 14px;
    margin-bottom: 10px;
  }
  .fast-fill-btn {
    position: absolute;
    left: 0;
    bottom: 0;
    color: #ACC1D8;
    background-color: #4289D9;
    text-align: center;
    line-height: 40px;
    width: calc(100% - 28px);
    margin-left: 14px;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background-color: #4289D9;
      color: #fff;
    }
    &:active {
      background-color: #3C81CE;
      color: #fff;
    }
  }
  .clearQuickFillHover {
    cursor:default;
    background-color: #3D5269;
    &:hover{
      color: #ACC1D8;
      background-color: #3D5269;
    }
  }
}

// input搜索参会人
input {
  -web-kit-appearance: none;
  -moz-appearance: none;
  height: 100%;
  width: 19px;
  border-radius: 4px;
  border: 0px solid #c8cccf;
  color: #278af9;
  background-color: #202F3D;
  outline:0;
}
input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
  color: #6C7B8B;
  text-align: center;
  font-size: 12px;
}
input:-moz-placeholder, textarea:-moz-placeholder {
  color: #6C7B8B;
  text-align: center;
  font-size: 12px;
}
input::-moz-placeholder, textarea::-moz-placeholder {
  color: #6C7B8B;
  text-align: center;
  font-size: 12px;
}
input:-ms-input-placeholder, textarea:-ms-input-placeholder {
  color: #6C7B8B;
  text-align: center;
  font-size: 12px;
}
input::-ms-clear{
  display:none;
}

.hst-input {
  box-sizing: border-box;
  width: calc(100%);
  height: 30px;
  padding-left: 30px;
  background: #202F3D url('../../../static/images/attendee/search.png') no-repeat 90px 9px;
  &.left-sreach-btn, &:focus {
    background: #202F3D url('../../../static/images/attendee/search_pressed.png') no-repeat 8px 9px;
  }
  &.sreach-btn-position {
    background: #202F3D url('../../../static/images/attendee/search.png') no-repeat 75px 9px;
    &:focus {
      background: #202F3D url('../../../static/images/attendee/search.png') no-repeat 8px 9px;
    }
  }
}
/*
// safari浏览器兼容拖拽
*[draggable = true] {
  -khtml-user-drag: element;
}
*/
// 拖拽操作的class
.placeholder-style{
    display: block !important;
    color: transparent;
    border-style: dashed !important;
}

div.remote-adjust {
  width: 600px;
  height: 600px;
  background-color: #fff;
  position: absolute;
  top: calc(50% - 300px);
  left: calc(50% - 300px);
  border-radius: 5px;
}

.drag-sty {
  cursor: move;
}
</style>
