<template>
  <div class="hst-dialog">
    <slot class="dialog-solt"></slot>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.hst-dialog {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 1003;
  top: 0;
  left: 0;
  background-color: rgba(27, 26, 26, 0.25);
}
</style>
