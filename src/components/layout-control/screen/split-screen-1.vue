<template>
  <div class="layout-split-video">
    <div class="split-video">
      <hst-video-window class="video-window"
      :screen-item="curWindowData[0]"
      :screen-id="$props.screenIndex"
      :window-index="0"
      ></hst-video-window>
    </div>
  </div>
</template>
<script>
import hstVideoWindow from './screen-item'
export default {
  props: ['screenIndex'],
  components: {
    hstVideoWindow
  },
  data () {
    return {
      curWindowData: []
    }
  },
  created () {
    this.curWindowData = this.$store.state.ws.snapshot[this.$props.screenIndex].DataArea[1].Item
  }
}
</script>
<style lang="scss" scoped>
.layout-split-video {
  color: #AAC1D8;
  text-align: center;
  box-sizing: border-box;
  display: flex;
}

.split-video {
  flex: 1;
  width: 25.5%;
  .video {
    box-sizing: border-box;
    background-color: #3D5269;
    border-top: 1px solid #4D647C;
    border-left: 1px solid #4D647C;
    &:first-child {
      border-top: none;
    }
  }
}
</style>
