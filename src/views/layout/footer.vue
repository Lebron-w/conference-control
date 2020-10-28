<template>
  <div>
    <div class="copyright">{{ $t('m.copyright') }}</div>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
@import '../../config/ces.config.scss';
.copyright {
  width: 100%;
  height: $footerHeight;
  background-color: $footerBgcolor;
  line-height: $footerHeight;
  text-align: center;
  font-size: 12px;
  color: #6D839A;
}
</style>
