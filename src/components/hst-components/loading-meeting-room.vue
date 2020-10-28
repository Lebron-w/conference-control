<template>
<div class="warp">
  <div class="login-and-authorize">
    <img src="../../../static/images/login/logining.gif" alt="">
    <div class="status">{{ $props.loadingText }} {{ load }}</div>
  </div>
</div>
</template>
<script>
export default {
  props: ['loadingText', 'isDynamic'],
  data () {
    return {
      load: '',
      loadTimer: 0
    }
  },
  created () {
    const that = this
    if (this.$props.isDynamic) {
      let i = 0
      this.loadTimer = setInterval(function () {
        i++
        that.load = '.'.repeat(i % 3 + 1)
      }, 1000)
    }
  },
  destroyed () {
    clearInterval(this.loadTimer)
  }
}
</script>
<style lang="scss" scoped>
.warp {
  width: 100%;
  height: 100%;
  background-color: #364A60;
}
.login-and-authorize {
  width: 223px;
  // height: 256px;
  margin: 0 auto 0;
  padding-top: calc(25% - 86px);
  img {
    width: 100%;
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
