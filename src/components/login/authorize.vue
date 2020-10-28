<template>
  <div class="warp">
    <div class="login-and-authorize">
      <img src="../../../static/images/login/logining.gif" alt="">
      <div class="status">{{ $props.loginStatus }}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['loginStatus'],
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.warp {
  width: 100%;
  height: 100%;
}
.login-and-authorize {
  width: 334px;
  // height: 256px;
  margin: calc(25% - 128px) auto 0;
  img {
    vertical-align: middle;
  }
  .status {
    color: #fff;
    margin-top: 1em;
    font-size: 16px;
    text-align: center;
  }
}
</style>
