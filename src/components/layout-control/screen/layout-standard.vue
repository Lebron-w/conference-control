<template>
  <div class="layout-standard">
    <div class="standard-doc video-img-name-standard-data" @contextmenu.prevent="settingFullArea($event)">
      <div class="img"
        v-if="isShowDoc">
        <div class="doc-img">
          <img :src="layoutImgs.dataDoc" alt="">
        </div>
        <div>{{ $store.state.ws.attendeeUserMap.get($store.state.ws.snapshot[this.$props.screenIndex].DataArea[0].Item[0].Data).DisplayName + $t('m.layout_of') + getDocType($store.state.ws.snapshot[this.$props.screenIndex].DataArea[0].Item[this.activeDoc])}}</div>
      </div>
      <div class="no-doc" v-else></div>
      <div class="full-screen" v-if="$store.state.ws.snapshot[this.$props.screenIndex].FullArea.ID.indexOf(1) > -1">
        <img :src="layoutImgs.fullScreen" alt="">
      </div>
    </div>
    <div class="standard-video">
      <hst-video-window
      v-for="(item, $index) in curWindowData"
      :key="$index"
      :screen-id="$props.screenIndex"
      :screen-item="item"
      :window-index="$index"
      v-if="$index < 4"
      ></hst-video-window>
    </div>
    <hst-contextmenu v-if="showContextmenu" @close-contextmenu="showContextmenu = false" :event-info="contextmenuEvent">
      <ul class="ctxmenu-list">
        <li :class="{'is-selected': $store.state.ws.snapshot[this.$props.screenIndex].FullArea.ID.indexOf(1) > -1}" @click="fullDocArea">
          <span class="menu-list-text">{{ $t('m.layout_fullScreen_data') }}</span>
        </li>
        <li :class="{'is-selected': $store.state.ws.snapshot[this.$props.screenIndex].FullArea.ID.indexOf(2) > -1}" @click="fullVideoArea">
          <span class="menu-list-text">{{ $t('m.layout_fullScreen_video') }}</span>
        </li>
        <li :class="{'is-selected': $store.state.ws.snapshot[this.$props.screenIndex].FullArea.ID.indexOf(1) > -1 && $store.state.ws.snapshot[this.$props.screenIndex].FullArea.ID.indexOf(2) > -1}" @click="fullAllArea">
          <span class="menu-list-text">{{ $t('m.layout_fullScreen_all') }}</span>
        </li>
      </ul>
    </hst-contextmenu>
  </div>
</template>
<script>
import layoutImgs from 'assets/layout-images'
import hstContextmenu from '@/components/hst-components/contextmenu'
import hstVideoWindow from './screen-item'
export default {
  props: ['screenIndex'],
  components: {
    hstVideoWindow,
    hstContextmenu
  },
  data () {
    return {
      layoutImgs,
      showContextmenu: false,
      contextmenuEvent: null
    }
  },
  computed: {
    curWindowData () {
      console.log(this.$store.state.ws.snapshot[this.$props.screenIndex].DataArea[1].Item)
      return this.$store.state.ws.snapshot[this.$props.screenIndex].DataArea[1].Item
    },
    isShowDoc () {
      return this.$store.state.ws.snapshot[this.$props.screenIndex].DataArea[0].Item[0] &&
        this.$store.state.ws.snapshot[this.$props.screenIndex].DataArea[0].Item[0].Data > 0 &&
        this.$store.state.ws.attendeeUserMap.get(this.$store.state.ws.snapshot[this.$props.screenIndex].DataArea[0].Item[0].Data)
    },
    activeDoc () {
      if (this.isShowDoc) {
        let userData = this.$store.state.ws.snapshot[this.$props.screenIndex].DataArea[0].UserData
        let item = this.$store.state.ws.snapshot[this.$props.screenIndex].DataArea[0].Item
        for (let i = 0; i < item.length; i++) {
          if (userData === item[i].Pos) {
            return i
          }
        }
      }
      return 0
    }
  },
  created () {
    // 初始化视频区域
    this.$store.commit('ws/saveScreenSnapshot', [this.$props.screenIndex, 4])
  },
  methods: {
    getDocType (item) {
      return item.Type === 0 ? this.$t('m.layout_roominfo') : ( // 会议室信息
        item.Type === 1 ? this.$t('m.layout_whiteboard') : ( // 白板
          item.Type === 2 ? this.$t('m.layout_screen_sharing') : ( // 屏幕共享
            item.Type === 3 ? this.$t('m.layout_web_browse') : ( // Web协同浏览'
              item.Type === 4 ? this.$t('m.layout_media_sharing') : ( // 媒体共享
                item.Type === 5 ? this.$t('m.layout_electronic_voting') : this.$t('m.layout_document') // 电子投票  文档
              )
            )
          )
        )
      )
    },
    settingFullArea (e) {
      if (this.$store.state.ws.isEditing) {
        this.contextmenuEvent = e
        this.showContextmenu = true
      }
    },
    fullDocArea () {
      if (this.$store.state.ws.snapshot[this.$props.screenIndex].FullArea.ID.indexOf(1) > -1) {
        this.$store.commit('ws/fullDocArea', [this.$props.screenIndex, false])
      } else {
        this.$store.commit('ws/fullDocArea', [this.$props.screenIndex, true])
      }
    },
    fullVideoArea () {
      this.$store.commit('ws/fullVideoArea', [this.$props.screenIndex, this.$store.state.ws.snapshot[this.$props.screenIndex].FullArea.ID.indexOf(2) === -1])
    },
    fullAllArea () {
      if (this.$store.state.ws.snapshot[this.$props.screenIndex].FullArea.ID.indexOf(1) > -1 && this.$store.state.ws.snapshot[this.$props.screenIndex].FullArea.ID.indexOf(2) > -1) {
        // 取消全屏
        this.$store.commit('ws/fullDocArea', [this.$props.screenIndex, false])
        this.$store.commit('ws/fullVideoArea', [this.$props.screenIndex, false])
      } else {
        // 全屏
        this.$store.commit('ws/fullDocArea', [this.$props.screenIndex, true])
        this.$store.commit('ws/fullVideoArea', [this.$props.screenIndex, true])
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.layout-standard {
  color: #AAC1D8;
  text-align: center;
  box-sizing: border-box;
  display: flex;
}

.standard-doc {
  box-sizing: border-box;
  width: 74.5%;
  height: 100%;
  background-color: #4D647C;
}
.video-img-name-standard-data {
  display: flex;
  // 左右居中
  justify-content: center;
  // 上下居中
  align-items:center;
  .img {
    width: 100%;
    .doc-img {
      width: 8%;
      margin-left: 46%;
    }
    div {
      line-height: 26px;
      font-size: 14px;
      color: #AAC1D8;
    }
  }
  .no-doc {
    width: 66.7%;
    height: 70%;
    background:linear-gradient(#4D647C 80%, #556C84 20%) 0 15%;
    background-size:100% 20%;
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

.standard-video {
  flex: 1;
  width: 25.5%;
  .video {
    box-sizing: border-box;
    height: 25%;
    background-color: #3D5269;
    border-top: 1px solid #4D647C;
    border-left: 1px solid #4D647C;
    &:first-child {
      border-top: none;
    }
  }
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
        border-color: #D9DADB;
      }
    }
  }
}
</style>
