<template>
  <div class="layout-picture-in-picture">
    <!-- <div class="data-doc">
      <div class="img" v-if="doc.length > 0">
        <img :src="layoutImgs.dataDoc" alt="">
        <div class="">{{ doc }}</div>
      </div>
      <div class="no-doc" v-else></div>
    </div> -->
    <div class="data-doc">
      <hst-video-window class="video-window"
      :screen-item="curWindowData[0]"
      :screen-id="$props.screenIndex"
      :window-index="0"
      ></hst-video-window>
    </div>
    <div class="picture-video">
      <hst-video-window class="video-window little-video"
      :screen-item="curWindowData[1]"
      :screen-id="$props.screenIndex"
      :window-index="1"
      ></hst-video-window>
    </div>
  </div>
</template>
<script>
import layoutImgs from 'assets/layout-images'
import hstVideoWindow from './screen-item'
export default {
  props: ['screenIndex'],
  components: {
    hstVideoWindow
  },
  data () {
    return {
      layoutImgs,
      doc: ''
    }
  },
  computed: {
    curWindowData () {
      return this.$store.state.ws.snapshot[this.$props.screenIndex].DataArea[1].Item
    }
  },
  created () {
    this.$store.commit('ws/saveScreenSnapshot', [this.$props.screenIndex, 3])
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

.data-doc {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-color: #4D647C;
  display: flex;
  // 左右居中
  justify-content: center;
  // 上下居中
  align-items:center;
  .img {
    img {
      width: 75%;
      // height: 64px;
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
}

.picture-video {
  width: 25.5%;
  height: 25%;
  position: absolute;
  bottom: 0;
  right: 0;
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
</style>
