<template>
  <div class="layout-box">
    <ces-header class="ces-header"></ces-header>
    <div class="ces-layout clearfix">
      <ceslift-sidebar class="lift-sidebar fl" :style="isCollapse ? {'width': 50 + 'px'} : ''"></ceslift-sidebar>
      <ces-content class="ces-content fl" :style="{'width': `${isCollapse ? clientWidth - 354 : clientWidth - 504}px`}">
      </ces-content>
      <cesright-sidebar class="right-sidebar fl"></cesright-sidebar>
    </div>
    <ces-footer class="ces-footer"></ces-footer>
  </div>
</template>
<script>
import cesHeader from '../layout/header'
import cesFooter from '../layout/footer'
import cesliftSidebar from '../layout/left-sidebar'
import cesrightSidebar from '../layout/right-sidebar'
import cesContent from '../layout/content'
import { mapState } from 'vuex'
export default {
  components: {
    cesHeader,
    cesFooter,
    cesliftSidebar,
    cesrightSidebar,
    cesContent
  },
  data () {
    return {
      leftLittleMenuWidth: 50,
      clientWidth: 1920
    }
  },
  computed: {
    ...mapState({
      windowResize: state => state.windowResize
    }),
    isCollapse () {
      return this.$store.state.navMenu.isCollapse
    }
  },
  mounted () {
    const that = this
    // 屏幕分辨率变化重新计算宽度
    that.clientWidth = document.body.clientWidth
  },
  watch: {
    windowResize: {
      immediate: true,
      handler () {
        this.clientWidth = document.body.clientWidth
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../config/ces.config.scss';
.fl {
  float: left;
}
.layout-box {
  width: 100%;
  height: 100%;
}
.ces-header, .ces-footer {
  width: 100%;
  box-sizing: border-box;
}
.ces-header {
  height: $headerHeight;
}
.ces-footer {
  height: $footerHeight;
}
.ces-layout {
  .lift-sidebar {
    width: $leftSidebarWidth;
    height: $ctxHeight;
    float: left;
    box-sizing: border-box;
    transition: width 0.5s ease;
    -moz-transition: width 0.5s ease;
    -webkit-transition: width 0.5s ease;
    -o-transition: width 0.5s ease;
  }
  .right-sidebar {
    width: $rightSidebarWidth;
    height: $ctxHeight;
    float: left;
    box-sizing: border-box;
  }
  .ces-content {
    width: calc(100% - #{$leftSidebarWidth} - #{$rightSidebarWidth});
    float: left;
    transition: width 0.5s ease;
    -moz-transition: width 0.5s ease;
    -webkit-transition: width 0.5s ease;
    -o-transition: width 0.5s ease;
  }
}
</style>
