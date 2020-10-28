<template>
  <div class="layout-picture-in-picture">
    <div class="standard-doc video-img-name-standard-data" @contextmenu.prevent="settingFullArea($event)">
      <div class="img"
        v-if="isShowDoc">
        <div class="doc-img">
          <img :src="layoutImgs.dataDoc" alt="">
        </div>
        <div>{{ $store.state.ws.snapshot[this.$props.screenIndex].DataArea[0].Item && $store.state.ws.attendeeUserMap.get($store.state.ws.snapshot[this.$props.screenIndex].DataArea[0].Item[0].Data)
          ? $store.state.ws.attendeeUserMap.get($store.state.ws.snapshot[this.$props.screenIndex].DataArea[0].Item[0].Data).DisplayName + $t('m.layout_of') + getDocType($store.state.ws.snapshot[this.$props.screenIndex].DataArea[0].Item[this.activeDoc]) : ''}}</div>
      </div>
      <div class="no-doc" v-else></div>
      <div class="full-screen" v-if="$store.state.ws.snapshot[this.$props.screenIndex].FullArea.ID.indexOf(1) > -1">
        <img :src="layoutImgs.fullScreen" alt="">
      </div>
    </div>
    <div class="picture-video" v-if="($store.state.ws.snapshot[$props.screenIndex].FullArea.ID.indexOf(1) > -1 && $store.state.ws.snapshot[$props.screenIndex].DataArea[1].Item.length > 0 && $store.state.ws.snapshot[$props.screenIndex].DataArea[1].Item[0].Data > 0) || $store.state.ws.snapshot[$props.screenIndex].FullArea.ID.indexOf(1) === -1">
      <hst-video-window class="video-window"
      :screen-item="curWindowData[0]"
      :screen-id="$props.screenIndex"
      :window-index="0"
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
import hstVideoWindow from './screen-item'
import hstContextmenu from '@/components/hst-components/contextmenu'
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
      return this.$store.state.ws.snapshot[this.$props.screenIndex].DataArea[1].Item
    },
    isShowDoc () {
      return this.$store.state.ws.snapshot[this.$props.screenIndex].DataArea[0].Item &&
        this.$store.state.ws.snapshot[this.$props.screenIndex].DataArea[0].Item[0] &&
        this.$store.state.ws.snapshot[this.$props.screenIndex].DataArea[0].Item[0].Data > 0
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
    this.$store.commit('ws/saveScreenSnapshot', [this.$props.screenIndex, 3])
  },
  methods: {
    getDocType (item) {
      return item.Type === 0 ? this.$t('m.layout_roominfo') : (
        item.Type === 1 ? this.$t('m.layout_whiteboard') : (
          item.Type === 2 ? this.$t('m.layout_screen_sharing') : (
            item.Type === 3 ? this.$t('m.layout_web_browse') : (
              item.Type === 4 ? this.$t('m.layout_media_sharing') : (
                item.Type === 5 ? this.$t('m.layout_electronic_voting') : this.$t('m.layout_document')
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
.layout-picture-in-picture {
  position: relative;
  color: #AAC1D8;
  text-align: center;
  box-sizing: border-box;
  display: flex;
}

.standard-doc {
  box-sizing: border-box;
  width: 100%;
  // width: 74.5%;
  // margin-left: 25.5%;
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

.picture-video {
  width: 25.5%;
  height: 25%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-flow: row wrap;
  align-content: center;
  align-items:center;
  .little-video{
    box-sizing: border-box;
    border-left: 1px solid #4D647C;
    border-top: 1px solid #4D647C;
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
