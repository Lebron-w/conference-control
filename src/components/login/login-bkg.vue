<template>
  <div class="bkg">
    <slot></slot>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
.bkg {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: url('../../assets/login/bg.png');
  background-size: contain;
}
</style>
