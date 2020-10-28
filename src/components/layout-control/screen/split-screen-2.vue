<template>
  <div class="layout-split-video">
    <div class="split-video">
      <hst-video-window class="video-window"
      v-for="(item, $index) in curWindowData"
      :key="$index"
      :screen-item="item"
      :screen-id="$props.screenIndex"
      :window-index="$index"
      v-if="$index < 2"
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
    return {}
  },
  computed: {
    curWindowData () {
      return this.$store.state.ws.snapshot[this.$props.screenIndex].DataArea[1].Item
    }
  },
  created () {
    console.warn('----------------------screenIndex: ', this.$props.screenIndex)
    this.$store.commit('ws/saveScreenSnapshot', [this.$props.screenIndex, 2])
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
  display: flex;
  flex-flow: row wrap;
  align-content: center;
  align-items:center;
  .video-window {
    box-sizing: border-box;
    width: 50%;
    height: 50%;
    &:nth-of-type(2) {
      border-left: 1px solid #4D647C;
    }
  }
}
</style>
