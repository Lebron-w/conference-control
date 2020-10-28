<template>
  <div class="warp" v-if="$props.show">
    <div class="tips">
      {{ $props.text }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.warp {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #223242;
  position: relative;
}
.tips {
  width: 374px;
  padding: 12px;
  font-size: 12px;
  color: #768FAB;
  line-height: 22px;
  letter-spacing: 0.3px;
  text-align: justify;
  background-color: #223242;
  position: absolute;
  top: 8px;
  left: -190px;
  z-index: 2010;
}
</style>
