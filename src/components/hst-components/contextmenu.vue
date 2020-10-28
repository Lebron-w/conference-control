<template>
  <div class="dialog" @mouseleave="$emit('close-contextmenu')" ref="conctxmenuDialog" :style="{'top': `${$props.eventInfo.clientY - 5}px`, 'left': `${$props.eventInfo.clientX - 10}px`}" @contextmenu.prevent.stop="preventCtxmenu">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: ['eventInfo'],
  data () {
    return {}
  },
  methods: {
    preventCtxmenu () {
      return false
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog {
  width: 184px;
  min-height: 42px;
  background-color: #fff;
  border-radius: 5px;
  position: fixed;
  // top: 200px;
  // left: 500px;
  z-index: 1009;
  opacity: 0.9;
}
</style>
