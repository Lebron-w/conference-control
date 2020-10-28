<template>
  <div class="layout-ctx">
    <div class="layout-header">
      <span class="title-nav">
        <span class="layout-title">{{ $t('m.layout_control_panel') }}</span>
      </span>
      <span class="title-nav">
        <span class="layout-nav layout-checkbox">
          <hst-checkbox v-model="isExclusiveRight" @change="changeLayoutRight"></hst-checkbox>
        </span>
        <span class="layout-nav layout-checkbox-tips">{{ $t('m.layout_monopoly_right') }}
          <span class="tips-help-btn" @mouseover="showTips = true" @mouseleave="showTips = false">
            <hst-tips class="tips-position" :text="$t('m.layout_monopoly_right_tips')" :show="showTips"></hst-tips>
          </span>
        </span>
        <span class="layout-nav layout-plan-text">{{ $t('m.layout_scheme_list') }}:</span>
        <span class="layout-nav layout-plan">
          <hst-select :placeholder="$t('m.common_btn_edit')" v-model="choosenSnap" :disabled="!isEditing" :options="snapLists"></hst-select>
        </span>
        <span
          class="send-layout hst-btn enable-btn"
          v-if="!isEditing"
          :title="$t('m.layout_broadcast_tip')"
        >
        {{ $t('m.layout_broadcast_layout') }}
        </span>
        <span class="send-layout hst-btn" @click="boardLayout" v-else>{{ $t('m.layout_broadcast_layout') }}</span>
        <hst-button
          :class="{'hst-btn': 1, 'is-active': isEditing}"
          :disabled="isEditing"
          @click="editLayout"
          :title="isEditing ? '': $t('m.common_btn_edit_tip')"
        >
          {{ $t('m.common_btn_edit') }}
        </hst-button>
        <hst-button class="hst-btn" @click="refreshLayout">{{ $t('m.common_btn_refresh') }}</hst-button>
        <hst-button :class="{'hst-btn': 1, 'is-active': !isEditing}" :disabled="!isEditing" @click="checkLayout">{{ $t('m.common_btn_look') }}</hst-button>
      </span>
    </div>
    <hst-screen class="layout" :user-id="0" :snap-change="choosenSnap"></hst-screen>
    <!-- 保存布局方案 -->
    <hst-dialog v-if="saveTips">
      <div class="save-snap-warp">
        <strong class="close-btn" @click="saveTips = false; snapName = ''">&times;</strong>
        <div class="title">广播布局</div>
        <div class="layout-snapshot-name">
          <img src="../../../assets/layout-images/screen-img/cg.png" alt="">
          <span>广播布局成功</span>
        </div>
        <div class="snap-name">
          <span>布局方案名称</span>
          <input type="text" class="save-name" :class="{'err-tip': errSnapName}" v-model="snapName" maxlength="20" @focus="errSnapName = false">
        </div>
        <span class="save-btn" @click="saveCurSnapshot">确定</span>
      </div>
    </hst-dialog>
    <!-- 设置轮巡窗口 -->
    <hst-dialog v-if="settingStatus">
        <loop-video @close-setLoopVideo="closeSetLoop"></loop-video>
    </hst-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import hstSwitch from '@/components/hst-components/switch'
import hstScreen from '@/components/layout-control/layout-screen-area'
import hstSelect from '@/components/hst-components/select'
import hstButton from '@/components/hst-components/button'
import hstDialog from '@/components/hst-components/dialog'
import hstCheckbox from '@/components/hst-components/checkbox'
import hstTips from '@/components/hst-components/tips'
import loopVideo from '@/components/loop-video/setLoopVideo'

export default {
  components: {
    hstSwitch,
    hstScreen,
    hstSelect,
    hstButton,
    hstDialog,
    hstCheckbox,
    hstTips,
    loopVideo
  },
  data () {
    return {
      editOrCheck: false,
      options: ['a', 'b', 'c'],
      selectValue: this.$t('m.layout_control'),
      choosenSnap: '',
      saveTips: false,
      snapName: '',
      errSnapName: false,
      showTips: false
    }
  },
  computed: {
    ...mapState({
      attendeeUserMap: state => state.ws.attendeeUserMap,
      userLayoutInfo: state => state.ws.userLayoutInfo,
      userIdOfLayoutInfo: state => state.ws.userIdOfLayoutInfo,
      snapshot: state => state.ws.snapshot,
      snapList: state => state.ws.snapList,
      isEditing: state => state.ws.isEditing,
      snapLists: state => state.ws.snapLists,
      cancellingVideoAttendees: state => state.ws.cancellingVideoAttendees,
      settingStatus: state => state.ws.settingStatus// 轮巡弹窗状态
    }),
    userId () {
      return this.$route.params.name ? parseInt(this.$route.params.name) : 0
    },
    isExclusiveRight: {
      get () {
        return this.$store.state.ws.isExclusiveRight
      },
      set (bool) {
        this.$store.commit('ws/saveExclusiveRight', bool)
      }
    }
  },
  created () {
    this.$store.commit('ws/readLocalSnaps')
  },
  methods: {
    changeLayoutRight (val) {
      if (!val) {
        this.$ws.send({
          'CmdID': 1017,
          'Data': {
            'Operation': 0,
            'RightType': 1
          }
        })
      } else {
        this.$ws.send({
          'CmdID': 1017,
          'Data': {
            'Operation': 1,
            'RightType': 1
          }
        })
      }
    },
    boardLayout () {
      this.broadcastLayout()
      // 保存快照的名称
      this.snapName = `${this.userId === 0 ? '会议室' : this.attendeeUserMap.get(this.userId).DisplayName} ${(new Date()).getHours()}:${(new Date()).getMinutes()} 布局`
      // 会议室没用户时，提示广播不生效
      if (this.$store.getters['ws/allUsers'].length === 0) {
        this.$message({
          type: 'info',
          message: '当前会议室没有参会人，广播布局不会生效！'
        })
      }
      this.saveTips = true
    },
    // 保存当前快照
    saveCurSnapshot () {
      this.errSnapName = false
      if (this.snapName.trim() === '') {
        this.$message({
          type: 'warning',
          message: '请输入布局方案名！'
        })
        this.errSnapName = true
      } else if (!/^.{1,20}$/.test(this.snapName.trim())) {
        this.$message({
          type: 'warning',
          message: '布局方案名不能超过20个字符！'
        })
        this.errSnapName = true
      } else {
        // 获取当前已存在的快照信息
        let existingSnap = this.readLocalSnap()
        // 添加进去
        for (let snap of existingSnap) {
          if (Object.keys(snap)[0] === this.snapName.trim()) {
            this.$message({
              type: 'warning',
              message: '已存在的布局方案名！'
            })
            this.errSnapName = true
            break
          }
        }
        if (!this.errSnapName) {
          existingSnap.push({
            [this.snapName.trim()]: this.$store.state.ws.snapshot
          })
          // 排序
          existingSnap.sort((snap1, snap2) => {
            if (Object.keys(snap1)[0] > Object.keys(snap2)[0]) {
              return 1
            } else {
              return -1
            }
          })
          // 重新存入localStorage
          this.setItem(`layout-${this.$store.state.ws.roomInfo.StartTime}`, JSON.stringify(existingSnap))
          this.saveTips = false
          this.snapName = ''
          // 重新获取布局
          this.$store.commit('ws/readLocalSnaps')
        }
      }
    },
    // 广播布局
    broadcastLayout () {
      // 发送参会人修改的消息
      this.alterAttState()
      // 会议室布局关闭参会人视频
      this.closeAttVideo()
      // 发送当前快照到服务端
      let newShot = JSON.parse(JSON.stringify(this.snapshot))
      this.formatLayoutList(newShot)
      let rightMsg = {
        'CmdID': 1017,
        'Data': {
          'Operation': 1,
          'RightType': 1
        }
      }
      let layoutMsg = {
        'CmdID': 1004,
        'Data': {
          'UserID': this.userId,
          'Screen': newShot
        }
      }
      let releaseRightMsg = {
        'CmdID': 1017,
        'Data': {
          'Operation': 0,
          'RightType': 1
        }
      }
      this.$ws.send(rightMsg)
      this.$ws.send(layoutMsg)
      if (!this.isExclusiveRight) this.$ws.send(releaseRightMsg)
      this.$store.commit('ws/changeEditStutau', false)
    },
    // 参会人状态修改
    alterAttState () {
      for (let snap of this.snapshot) {
        for (let videoWindow of snap.DataArea[1].Item) {
          if (videoWindow.Type === 7) continue
          // 修改数据Item中的type属性
          if (videoWindow.Type !== 7) {
            if (videoWindow.Data) {
              videoWindow.Type = 6
            } else {
              videoWindow.Type = 0
            }
          }
          // 发送修改后的参会人音视频状态
          let attInfo = this.attendeeUserMap.get(videoWindow.Data)
          if (!attInfo) continue
          if (attInfo.hasOwnProperty('Audio') && (Boolean(attInfo.Audio.State) !== videoWindow.broadcastAudio)) {
            // 音频状态发生了变化
            let audioMsg = {
              'CmdID': 1003,
              'Data': {
                'UserID': videoWindow.Data,
                'Audio': {
                  'ID': 0,
                  'State': videoWindow.broadcastAudio ? 2 : 0
                }
              }
            }
            this.$ws.send(audioMsg)
          }
          if (attInfo.hasOwnProperty('Video') && videoWindow.UserData >= 0) {
            let exsitMedia = false
            for (let vid of attInfo.Video) {
              if (vid.ID === videoWindow.UserData) {
                exsitMedia = true
                if ((vid.State === 2) !== videoWindow.broadcastVideo) {
                  // 对应的摄像头状态发生变化
                  let videoMsg = {
                    'CmdID': 1003,
                    'Data': {
                      'UserID': videoWindow.Data,
                      'Video': {
                        'ID': videoWindow.UserData,
                        'State': videoWindow.broadcastVideo ? 2 : 0
                      }
                    }
                  }
                  this.$ws.send(videoMsg)
                }
                break
              }
            }
            if (!exsitMedia) {
              // 該參會人已離綫
              videoWindow.Data = 0
              videoWindow.UserData = 0
              videoWindow.Type = 0
            }
          }
        }
      }
    },
    // 关闭用户视频
    closeAttVideo () {
      // 会议室布局关闭视频
      for (let item of this.snapshot[0].DataArea[1].Item) {
        for (let attInfo of this.cancellingVideoAttendees) {
          if (item.Data === attInfo.userId && item.UserData === attInfo.mediaId) {
            this.$store.commit('ws/cancellVideo', { delete: attInfo })
          }
        }
      }
      for (let attInfo of this.cancellingVideoAttendees) {
        this.$ws.send({
          'CmdID': 1003,
          'Data': {
            'UserID': attInfo.userId,
            'Video': {
              'ID': attInfo.mediaId,
              'State': 0
            }
          }
        })
      }
      // 清除已修改的列表
      this.$store.commit('ws/cancellVideo', { clear: true })
    },
    // 格式化布局快照
    formatLayoutList (shot) {
      for (let item of shot) {
        // 修改不同全屏状态的layoutMode
        if (item.FullArea.ID.indexOf(1) > -1 && item.FullArea.ID.indexOf(2) === -1) {
          // 全屏数据
          item.LayoutMode = 2
        } else if (item.FullArea.ID.indexOf(1) === -1 && item.FullArea.ID.indexOf(2) > -1) {
          // 全屏视频
          item.LayoutMode = 3
        }
        let items = []
        // 循环遍历去掉空窗口的数据，判断当前被全屏的用户是否在布局窗口上可见
        let splitNum = 0
        if (item.LayoutMode === 1) {
          splitNum = 4
        } else {
          splitNum = item.LayoutMode === 2 ? 1 : item.DataArea[1].UserData
        }
        for (let i in item.DataArea[1].Item) {
          if (item.DataArea[1].Item[i].Type === 7 || item.DataArea[1].Item[i].Data !== 0) {
            items.push(item.DataArea[1].Item[i])
          }
          if (i >= splitNum && item.FullDataID > 0 && item.FullDataID === item.DataArea[1].Item[i].Data) {
            // 全屏窗口在视频窗口外时，取消该用户全屏
            item.FullDataID = 0
          }
        }
        item.DataArea[1].Item = items
      }
    },
    // 编辑布局
    editLayout () {
      this.$store.commit('ws/changeEditStutau', true)
    },
    // 刷新布局
    refreshLayout () {
      if (this.isEditing) {
        this.$confirm(this.$t('m.layout_msg_confirm'), this.$t('m.common_msg_tip'), {
          confirmButtonText: this.$t('m.common_btn_save'),
          cancelButtonText: this.$t('m.common_btn_cancel'),
          type: 'warning'
        }).then(() => {
          // 发送消息获取最新布局
          this.$store.commit('ws/changeEditStutau', false)
          this.refreshSnapshot()
        }).catch(() => {})
      } else {
        this.refreshSnapshot()
      }
    },
    refreshSnapshot () {
      // 发送消息获取最新布局
      this.requestLayout(this.userId)
      // this.$store.commit('ws/createSnap', JSON.parse(JSON.stringify(this.userLayoutInfo.get(this.userId))))
      this.$store.commit('ws/refreshSnap', this.userId)
    },
    // 查看布局
    checkLayout () {
      if (this.isEditing) {
        this.$confirm(this.$t('m.layout_msg_confirm'), this.$t('m.common_msg_tip'), {
          confirmButtonText: this.$t('m.common_btn_save'),
          cancelButtonText: this.$t('m.common_btn_cancel'),
          type: 'warning',
          lockScroll: false
        }).then(() => {
          // 发送消息获取最新布局
          this.$store.commit('ws/changeEditStutau', false)
          this.refreshSnapshot()
        }).catch(() => {})
      }
    },
    // readLocalstorage snap
    readLocalSnap () {
      let existingSnap = this.getItem(`layout-${this.$store.state.ws.roomInfo.StartTime}`)
      if (!existingSnap || JSON.parse(existingSnap).length === 0 || !Object.keys(JSON.parse(existingSnap)[0]).length) {
        existingSnap = []
      } else {
        existingSnap = JSON.parse(existingSnap)
      }
      return existingSnap
    },
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
      // 获取轮巡列表
      this.$store.dispatch('ws/getLoopList', user)
    },
    // 关闭视频轮巡弹窗
    closeSetLoop () {
      this.$store.commit('ws/loopVideoSetting', false)
    }
  },
  watch: {
    editOrCheck (val) {
      this.$store.commit('ws/changeEditStutau', val)
    },
    isEditing (curStatus, oldStatus) {
      if (!curStatus && oldStatus) {
        this.choosenSnap = ''
      }
    }
  }
  // 同一组件 不同路由 触发有问题
  // beforeRouteLeave (to, from, next) {
  // console.log('===========>', to)
  // console.log('===========>', this.isEditing)
  // if (this.isEditing) {
  //   this.$confirm(this.$t('m.layout_msg_confirm'), this.$t('m.common_msg_tip'), {
  //     confirmButtonText: this.$t('m.common_btn_save'),
  //     cancelButtonText: this.$t('m.common_btn_cancel'),
  //     type: 'warning'
  //   }).then(() => {
  //     this.$store.commit('ws/changeEditStutau', false)
  //     next()
  //   }).catch(() => {})
  // } else {
  //   next()
  // }
  // }
}
</script>
<style lang="scss" scoped>
.layout-ctx {
  height: 100%;
}
.layout-header {
  height: 60px;
  text-align: justify;
  font-size: 12px;
  &:after {
    display: inline-block;
    width: 100%;
    content: '';
  }
  .title-nav {
    display: inline-block;
  }
  .layout-title {
    color: #fff;
    line-height: 60px;
  }
  .layout-nav {
    display: inline-block;
    vertical-align: middle;
  }
  .switch {
    width: 180px;
    margin-left: 10px;
  }
  .layout-checkbox {
    width: 16px;
    height: 30px;
    line-height: 28px;
    // margin-right: 5px;
  }
  .layout-checkbox-tips {
    margin-right: 49px;
    color: #FFF;
    position: relative;
    .tips-help-btn {
      display: inline-block;
      width: 18px;
      height: 18px;
      border-radius: 9px;
      background: url('../../../assets/common-icon/help.png') no-repeat;
      background-size: cover;
      position: absolute;
      top: 0;
      right: -22px;
      .tips-position {
        position: absolute;
        top: 24px;
        left: 0px;
      }
    }
  }
  .layout-plan {
    width: 144px;
    height: 30px;
    line-height: 30px;
    margin-left: 5px;
    .layout-plan-select {
      display: inline-block;
      width: 100%;
      height: 30px;
      box-sizing: border-box;
      border-radius: 4px;
      background-color: #223242;
      text-indent: 10px;
    }
    .layout-plan-select.placeholder {
      color: #677686;
    }
  }
  .layout-plan-text {
    color: #FFF;
  }
  .hst-btn {
    margin-right: 5px;
    &:last-child {
      margin-right: 0;
    }
  }
}
.layout {
  min-width: 500px;
  min-height: 300px;
  height: calc(100% - 60px);
  box-sizing: border-box;
}
.send-layout {
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
  color: #fff;
  border: #2BA77D 0px solid;
  background-color: #2BA77D;
  display: inline-block;
  width: 84px;
  line-height: 30px;
  margin-left: 5px;
  &:hover {
    background-color: #30B387;
  }
}
span.enable-btn, div.enable-btn {
  &, &:hover {
    color: #8B97A5;
    background-color: #3D5269;
    border: #3D5269 0px solid;
    cursor: not-allowed;
  }
}

.save-snap-warp {
  width: 420px;
  height: 270px;
  margin: calc(25% - 135px) auto 0;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  .close-btn {
    position: absolute;
    line-height: 0;
    right: 8px;
    top: 20px;
    font-size: 22px;
    cursor: pointer;
  }
  .title {
    font: {
      size: 16px;
      weight: bold;
    }
    color: #323232;
    text-indent: 20px;
    line-height: 40px;
    border-bottom: 1px solid #EAECEE;
  }
  .layout-snapshot-name {
    padding: 30px 0;
    text-align: center;
    line-height: 0;
    height: 36px;
    margin: 0 auto;
    display: table;
    img, span {
      vertical-align: middle;
    }
    span {
      font-size: 18px;
      color: #2BA77D;
      margin-left: 10px;
    }
  }
  .snap-name {
    span {
      display: inline-block;
      width: 130px;
      text-align: right;
      font-size: 12px;
      color: #323232;
    }
    .save-name {
      display: inline-block;
      box-sizing: border-box;
      width: 240px;
      height: 30px;
      margin-left: 10px;
      line-height: 30px;
      box-shadow: none;
      text-rendering: auto;
      color: initial;
      letter-spacing: normal;
      word-spacing: normal;
      text-transform: none;
      text-indent: 10px;
      text-shadow: none;
      display: inline-block;
      text-align: start;
      font: 400 12px Arial;
      &.err-tip {
        border: 1px red solid;
      }
    }
  }
  .save-btn {
    display: inline-block;
    border-radius: 4px;
    line-height: 30px;
    text-align: center;
    width: 158px;
    font-size: 14px;
    color: #fff;
    background-color: #2997DA;
    margin: 24px 0 0 144px;
    cursor: pointer;
  }
}
</style>
