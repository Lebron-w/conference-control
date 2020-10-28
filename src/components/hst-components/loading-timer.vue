<template>
  <div class="warp">
    <div class="loading">
      <i class="el-icon-loading"></i>
      <slot class="loading-text"></slot>
    </div>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
.warp {
  position: relative;
  width: 100%;
  height: 100%;
  color: #fff;
  text-align: center;
  line-height: 100%;
  // .loading {
  //   width: 100%;
  //   height: 100%;
  //   position: absolute;
  //   background-color: #FFF;
  //   left: 0;
  //   top: -100%;
  // }
}
</style>
