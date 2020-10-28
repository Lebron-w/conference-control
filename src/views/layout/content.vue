<template>
<div class="ces-ctx">
  <router-view></router-view>
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
@import '../../config/ces.config.scss';
.ces-ctx {
  background-color: $ctxBgcolor;
  width: 100%;
  height: $ctxHeight;
  box-sizing: border-box;
  // padding: 10px;
  border: {
    left: 10px solid $ctxBgcolor;
    right: 10px solid $ctxBgcolor;
    bottom: 10px solid $ctxBgcolor;
  }
}
</style>
