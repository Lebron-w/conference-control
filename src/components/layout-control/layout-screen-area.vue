<template>
  <ul class="screen-ctx-box" v-if="userIdOfLayoutInfo.indexOf(userId) > -1">
    <li v-for="(screen, $index) in snapshot" :key="$index" :class="{'screen-item': 1, 'screen-item-edit': isEditing, 'screen-item-1': snapshot.length <2 , 'screen-item-2': snapshot.length >= 2, 'screen-item-width-1': snapshot.length === 1, 'screen-item-width-2': snapshot.length > 1 && isIE, 'screen-item-width-ie-2': snapshot.length > 1 && !isIE}">
      <div class="screen-header">
        <span class="screen-name">{{ $index === 0 ? $t('m.layout_main_screen') : $t('m.layout_extended_screen') + $index }}</span>
        <select-layout
          class="change-layout clearfix"
          :screen-index="$index"
          :selected="getScreenLayout(screen).layoutName"
          ></select-layout>
        <span class="full-dataarea" v-if="$index === 0">
          <full-video :screen-id="$index"></full-video>
        </span>
      </div>
      <div>{{ screen.layout }}</div>
      <component class="screen-ctx-warp" :is="getScreenLayout(screen).component" :screen-index="$index"></component>
    </li>
  </ul>
  <ul class="loading-box" v-else>
    <hst-room-loading :loading-text="loadingLayout" :is-dynamic="true"></hst-room-loading>
  </ul>
</template>
<script>
import { mapState } from 'vuex'
import layoutStandard from './screen/layout-standard'
import splitScreen64 from './screen/split-screen-64'
import splitScreen6 from './screen/split-screen-6'
import hstRoomLoading from '../hst-components/loading-meeting-room'
import fullVideo from './full-video'
import hstSelect from '@/components/hst-components/select'
// 布局切换组件，eventsBus注册失败
import selectLayout from './select-layout'

export default {
  props: ['snapChange'],
  components: {
    layoutStandard,
    splitScreen64,
    splitScreen6,
    hstRoomLoading,
    fullVideo,
    hstSelect,
    selectLayout
  },
  data () {
    return {
      isFullVideoArea: false,
      loadingLayout: '',
      isIE: false
    }
  },
  computed: {
    ...mapState({
      userLayoutInfo: state => state.ws.userLayoutInfo,
      userIdOfLayoutInfo: state => state.ws.userIdOfLayoutInfo,
      isEditing: state => state.ws.isEditing,
      temporarySnapshot: state => state.ws.temporarySnapshot,
      snapshot: state => state.ws.snapshot
      // userLoopInfo: state => state.ws.userLoopInfo
    }),
    userId: {
      get () {
        return this.$route.params.name ? parseInt(this.$route.params.name) : 0
      },
      set (id) {
        return id
      }
    },
    layouts () {
      // eslint-disable-next-line
      return allLayouts.layouts
    }
  },
  created () {
    // 获取布局快照信息
    const that = this
    this.getLayoutInfo()
    this.loadingLayout = this.$t('m.layout_msg_load')
    setTimeout(function () {
      that.loadingLayout = that.$t('m.layout_msg_networkFailure')
    }, 10000)
    this.isIE = this.getBrowserType()
  },
  methods: {
    // 切换路由或快照等，获取最新的快照信息
    getLayoutInfo () {
      if (!this.userLayoutInfo.get(this.userId)) {
        this.$store.commit('ws/createSnap', null)
      } else {
        this.$store.commit('ws/createSnap', JSON.parse(JSON.stringify(this.userLayoutInfo.get(this.userId))))
      }
      // 历史编辑的参会人
      if (this.userId > 0) this.$store.commit('ws/addRecentControlLayoutAtts', this.userId)
    }
  },
  watch: {
    userId: {
      handler (id) {
        // 切换查看参会人布局时，发送请求消息
        if (!this.userLayoutInfo.get(id)) {
          this.$ws.send({
            'CmdID': 1008,
            'Data': {
              'UserID': id
            }
          })
          // 请求抡巡消息
          this.$ws.send({
            'CmdID': 1018,
            'Data': {
              'UserID': id
            }
          })
        }
        // 最后一次修改布局的参会人：
        this.$store.commit('ws/saveLastestLayoutControler', this.userId)
        this.$store.commit('ws/saveCurrentLayoutUser', this.userId)
        this.getLayoutInfo()
      },
      immediate: true
    },
    snapChange (snap) {
      // 切换当前编辑的快照
      if (snap || snap === 0) this.$store.commit('ws/updateSnap', JSON.parse(JSON.stringify(this.$store.state.ws.snapList.get(snap))))
    },
    isFullVideoArea (isFullVideo) {
      if (isFullVideo) {
        // 全屏视频区域
        this.$store.commit('ws/fullVideoArea', isFullVideo)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.screen-ctx-box {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  &, & li {
    box-sizing: border-box;
    list-style: none;
  }
  & li {
    flex: 0 0 calc(50% - 5px);
  }
  & li:not(.screen-item-2) {
    flex: 1;
  }
}
.screen-item {
  border: 1px solid #4D647C;
  // odd 奇数 even 偶数
  &:nth-of-type(even) {
    margin-left: 10px;
  }
  &:nth-of-type(3), &:nth-of-type(4) {
    margin-top: 10px;
  }
  &.screen-item-edit {
    border: 1px solid #3C81CE;
  }
}
.screen-item-1 {
  height: 100%;
}
.screen-item-2 {
  height: calc(50% - 5px);
}
.screen-item-width-1 {
  width: 100%;
}
.screen-item-width-2 {
  width: 50%;
}
.screen-item-width-ie-2 {
  width: calc(50% - 5px);
  &:nth-of-type(n+2) {
    margin-right: -10px;
  }
}
.screen-header {
  width: 100%;
  height: 40px;
  line-height: 40px;
  position: relative;
  box-sizing: border-box;
  border-bottom: 1px solid #4D647C;
  .screen-name {
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    margin-left: 10px;
  }
  .full-dataarea {
    display: block;
    float: right;
    margin-right: 10px;
    text-align: right;
    line-height: 30px;
    color: #fff;
  }
  .change-layout {
    display: block;
    float: right;
    margin-right: 10px;
    color: #278AF9;
    text-align: right;
  }
}
.screen-ctx-warp {
  width: 100%;
  height: calc(100% - 40px);
  .screen-ctx {
    width: 100%;
    height: 100%;
    background-color: #4D647C;
  }
}
.loading-box {
  position: relative;
}
</style>
