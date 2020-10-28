<template>
  <span>
    <ul class="attendee-dialog-list" v-if="ctxAttlen === 1">
      <li
        v-if="usersMap.get(att) && usersMap.get(att).Audio"
        :class="{'is-selected': usersMap.get(att).Audio.State === 2}"
        @click="setAudio(att)">
        <span class="menu-list-text">{{ $t('m.broadcastAudio') }}</span>
      </li>
      <li
        v-if="usersMap.get(att) && usersMap.get(att).Video && usersMap.get(att).Video.length > 0"
        :class="{'is-selected': isBoardVideo}"
        @click="changeAttendCamera(att)">
        <span class="menu-list-text">{{ $t('m.broadcastVideo') }}</span>
      </li>
      <li
        v-if="showBroadAudioAndVideo"
        :class="{'is-selected': isBroadAudioAndVideo}"
        @click="changeAttendCameraAndAudio(att)">
        <span class="menu-list-text">{{ $t('m.broadcastAudioVideo') }}</span>
      </li>
      <!-- 授权主讲 -->
      <li :class="{'is-selected': dataState === 2 }" @click="setDataState" v-if="terminalType % 10 !== 4">
        <span class="menu-list-text">{{ $t('m.allowPersent') }}</span>
      </li>
      <!-- 白板权限：H323、电话、D1、A2等没有标注白板权限 -->
      <li :class="{'is-selected': usersMap.get(att).WBMarkState === 2}" @click="setWbMarkState" v-if="terminalType % 10 !== 4 && terminalType !== 53 && terminalType !== 43">
        <span class="menu-list-text">{{ $t('m.allowMarkWhiteboard') }}</span>
      </li>
      <!-- 文字聊天: TV不能文字聊天 -->
      <li :class="{'is-selected': usersMap.get(att) && usersMap.get(att).EnableChat === 1}" @click="setEnableChat" v-if="($store.state.ws.roomInfo.EnablePubChat || $store.state.ws.roomInfo.EnableP2PChat) && terminalType % 10 !== 4 && terminalType !== 33">
        <span class="menu-list-text">{{ $t('m.allowTextChat') }}</span>
      </li>
      <!-- 远程调节布局 -->
      <li @click="remoteAdjustmentLayout(att)" v-if="terminalType % 10 !== 4">
        <span class="menu-list-text">{{ $t('m.remoteAdjustmentLayout') }}</span>
      </li>
      <!-- 远程调节音视频 -->
      <li @click="remoteAdj" v-if="terminalType % 10 !== 4">
        <span class="menu-list-text">{{ $t('m.remoteAdjustmentMedia') }}</span>
      </li>
      <!-- 关注参会人 -->
      <li v-if="usersMap.get(att).UserType !== 0" :class="{'is-selected': usersMap.get(att).CareSeat}" @click="setCareAtt(att)"><span class="menu-list-text">{{ $t('m.attentionAttendee') }}</span></li>
      <li @click="setAttendeeState">
        <span class="menu-list-text">{{ $t('m.personalInfo') }}</span>
      </li>
      <li class="selective-segmenting-line">
        <hr>
      </li>
      <li>
        <span class="menu-list-text" @click="expelMeetingRoom">{{ $t('m.moveOut') }}</span>
      </li>
    </ul>
    <ul class="attendee-dialog-list multi-select" v-if="ctxAttlen > 1">
      <li @click="broadAtts(true)">
        <span class="menu-list-text">{{ $t('m.broadAtts') }}</span>
      </li>
      <li @click="broadAtts(false)">
        <span class="menu-list-text">{{ $t('m.broadAtts_cancel') }}</span>
      </li>
      <li @click="careAtts(true)">
        <span class="menu-list-text">{{ $t('m.careAtts') }}</span>
      </li>
      <li @click="careAtts(false)">
        <span class="menu-list-text">{{ $t('m.careAtts_cancel') }}</span>
      </li>
    </ul>
  </span>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    attendee: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      usersMap: state => state.ws.attendeeUserMap,
      attendeeUserId: state => state.ws.attendeeUserId
    }),
    terminalType () {
      return this.usersMap.get(this.att).TerminalType
    },
    ctxAttlen () {
      return this.$props.attendee.length
    },
    att () {
      return this.ctxAttlen === 1 ? this.$props.attendee[0] : this.$props.attendee
    },
    // 是否广播视频
    isBoardVideo () {
      return this.att && ((this.usersMap.get(this.att).Video[0] && this.usersMap.get(this.att).Video[0].State === 2) ||
        (this.usersMap.get(this.att).Video[1] && this.usersMap.get(this.att).Video[1].State === 2) ||
        (this.usersMap.get(this.att).Video[2] && this.usersMap.get(this.att).Video[2].State === 2) ||
        (this.usersMap.get(this.att).Video[3] && this.usersMap.get(this.att).Video[3].State === 2))
    },
    showBroadAudioAndVideo () {
      return this.att && this.usersMap.get(this.att) &&
        this.usersMap.get(this.att).Audio &&
        this.usersMap.get(this.att).Video &&
        this.usersMap.get(this.att).Video.length > 0
    },
    isBroadAudioAndVideo () {
      return this.showBroadAudioAndVideo &&
        this.usersMap.get(this.att).Audio.State === 2 &&
        ((this.usersMap.get(this.att).Video[0] && this.usersMap.get(this.att).Video[0].State === 2) ||
        (this.usersMap.get(this.att).Video[1] && this.usersMap.get(this.att).Video[1].State === 2) ||
        (this.usersMap.get(this.att).Video[2] && this.usersMap.get(this.att).Video[2].State === 2) ||
        (this.usersMap.get(this.att).Video[3] && this.usersMap.get(this.att).Video[3].State === 2))
    },
    dataState () {
      return this.attendeeUserId.length > 0 ? this.usersMap.get(this.att).DataState : 0
    }
  },
  methods: {
    // 广播音频
    setAudio (user) {
      let msg = {
        'CmdID': 1003,
        'Data': {
          'UserID': user,
          'Audio':
          {
            'ID': 0,
            'State': this.usersMap.get(user).Audio.State === 2 ? 0 : 2
          }
        }
      }
      this.$ws.send(msg)
      this.closeCtxMenu()
    },
    // 切换摄像头状态
    changeAttendCamera (user) {
      let state = this.getAttVideoState(this.usersMap, user)
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
      this.closeCtxMenu()
    },
    // 广播音视频
    changeAttendCameraAndAudio (user) {
      if (this.usersMap.get(user).Audio.State === 2 && this.getAttVideoState(this.usersMap, user) === 2) {
        // 音视频都处于广播状态
        this.changeAttendCamera(user)
        this.setAudio(user)
      } else if (this.usersMap.get(user).Audio.State === 2 && this.getAttVideoState(this.usersMap, user) === 0) {
        // 视频为广播
        this.changeAttendCamera(user)
      } else if (this.usersMap.get(user).Audio.State !== 2 && this.getAttVideoState(this.usersMap, user) === 2) {
        // 音频为广播
        this.setAudio(user)
      } else {
        this.changeAttendCamera(user)
        this.setAudio(user)
      }
      this.closeCtxMenu()
    },
    // 授权成为主讲
    setDataState () {
      let msg = {
        'CmdID': 1003,
        'Data': {
          'UserID': this.att,
          'DataState': this.usersMap.get(this.att).DataState === 2 ? 0 : 2
        }
      }
      this.$ws.send(msg)
      this.closeCtxMenu()
    },
    // 允许标注白板
    setWbMarkState () {
      let msg = {
        'CmdID': 1003,
        'Data': {
          'UserID': this.att,
          'WBMarkState': !this.usersMap.get(this.att).WBMarkState ? 2 : 0
        }
      }
      this.$ws.send(msg)
      this.closeCtxMenu()
    },
    // 允许文字聊天
    setEnableChat () {
      let msg = {
        'CmdID': 1003,
        'Data': {
          'UserID': this.att,
          'EnableChat': !this.usersMap.get(this.att).EnableChat ? 1 : 0
        }
      }
      this.$ws.send(msg)
      this.closeCtxMenu()
    },
    // 点击远程调节布局
    remoteAdjustmentLayout (user) {
      // 判断调节的范围和权限
      if (this.usersMap.get(user).TerminalType % 10 === 1 || this.usersMap.get(user).TerminalType % 10 === 2) {
        if (this.usersMap.get(user).ProtocolVer >= 1.3) {
          // 新版的 x3、v5
          if (this.usersMap.get(user).Right < 3) {
            // 权限不够,提示客户自己升级权限为主席
            this.$message({
              type: 'warning',
              message: this.$t('m.attendee_msg_tip1')
            })
          } else {
            this.remoteAdjDo(user)
          }
        } else {
          // 提示升级客户软件版本
          this.$message({
            type: 'warning',
            message: this.$t('m.attendee_msg_tip2')
          })
        }
      } else {
        // 该参会人的终端不支持远程调节布局
        this.$message({
          type: 'warning',
          message: this.$t('m.attendee_msg_tip3')
        })
      }
      this.closeCtxMenu()
    },
    // 远程调节音视频
    remoteAdj () {
      this.$emit('oper-adj', this.att)
    },
    // 关注 | 取消关注
    setCareAtt (user) {
      if (this.usersMap.get(user).hasOwnProperty('CareSeat') && this.usersMap.get(user).CareSeat > 0) {
        // 点击取消关注
        this.$store.commit('ws/updateCareList', {
          flag: 0,
          userId: user
        })
      } else {
        // 点击关注
        this.$store.commit('ws/updateCareList', {
          flag: 1,
          userId: user
        })
      }
      this.closeCtxMenu()
    },
    // 查看参会人信息
    setAttendeeState () {
      this.$emit('oper-att', this.att)
    },
    // 请出会议室
    expelMeetingRoom () {
      let msg = {
        'CmdID': 1006,
        'Data': {
          'UserID': this.att
        }
      }
      this.$ws.send(msg)
      this.closeCtxMenu()
    },
    // 广播/取消广播所选参会人
    broadAtts (bool) {
      if (bool) {
        // 广播
        this.att.forEach(user => {
          if (this.usersMap.get(user).Audio && this.usersMap.get(user).Audio.State === 0) {
            // 非广播音频状态, 发送消息广播该用户的音频
            this.setAudio(user)
          }
        })
      } else {
        // 取消广播
        this.att.forEach(user => {
          if (this.usersMap.get(user).Audio && this.usersMap.get(user).Audio.State === 2) {
            // 非广播音频状态, 发送消息广播该用户的音频
            this.setAudio(user)
          }
        })
      }
      this.closeCtxMenu()
    },
    // 关注/取消关注所选参会人
    careAtts (bool) {
      if (bool) {
        // 关注
        let anonymous = ``
        let anonymousNo = 0
        this.att.forEach(user => {
          if (this.usersMap.get(user).UserType === 0) {
            // 匿名用户
            anonymous = !anonymousNo ? this.usersMap.get(user).DisplayName : `${anonymous}、${this.usersMap.get(user).DisplayName}`
            anonymousNo++
          } else {
            if (!this.usersMap.get(user).CareSeat || (this.usersMap.get(user).CareSeat && this.usersMap.get(user).CareSeat === 0)) {
              this.setCareAtt(user)
            }
          }
        })
        // 提示匿名用户无法被关注
        if (anonymousNo > 0) {
          this.$message({
            type: 'warning',
            message: this.$t('m.attendee_msg_tip4', [anonymous, anonymousNo])
          })
        }
      } else {
        // 取消关注
        this.att.forEach(user => {
          if (this.usersMap.get(user).CareSeat && this.usersMap.get(user).CareSeat > 0) {
            this.setCareAtt(user)
          }
        })
      }
      this.closeCtxMenu()
    },
    // ---------------------------- custom functions -----------------------------------
    // 请求个人布局信息、添加导航栏
    remoteAdjDo (user) {
      // 发送请求布局的信息
      let msg = {
        'CmdID': 1008,
        'Data': {
          'UserID': user
        }
      }
      this.$ws.send(msg)
      // 请求抡巡消息
      this.$ws.send({
        'CmdID': 1018,
        'Data': {
          'UserID': user
        }
      })
      // 调节布局时，重置编辑按钮，获取最新消息
      this.$store.commit('ws/changeEditStutau', false)
      this.$store.commit('addMenuNav', {
        path: '/home/layout/' + this.usersMap.get(user).UserID,
        name: this.usersMap.get(user).DisplayName,
        userID: this.usersMap.get(user).UserID
      })
      this.$router.push('/home/layout/' + this.usersMap.get(user).UserID)
    },
    // 关闭右键菜单
    closeCtxMenu () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.attendee-dialog-list {
  display: inline-block;
  width: 184px;
  height: 100%;
  margin-left: 56px;
  background-color: #fff;
  color: #1E1E1E;
  opacity: 0.92;
  border-radius: 5px;
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
      background: url('../../../static/images/attendee/selected.png') 18px 8px no-repeat;
    }
    &:first-child {
      padding-top: 5px;
    }
    &:first-child.is-selected {
      background: url('../../../static/images/attendee/selected.png') 18px 14px no-repeat;
    }
    &:last-child {
      line-height: 42px;
    }
    &.selective-segmenting-line {
      padding-top: 5px;
      hr {
        border-color: #D9DADB;
      }
    }
    &:hover {
      background-color: #D8E6F5;
    }
  }
  &.multi-select {
    li {
      span {
        margin-left: 20px;
      }
    }
  }
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
</style>
