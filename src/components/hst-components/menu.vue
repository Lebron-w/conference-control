<template>
  <div class="--hst-menu" ref="hstMenu">
    <el-scrollbar :style="`height: ${scrollHeight}px;`">
      <ul class="clearfix">
        <li v-for="(route, $index) in list" :key="$index">
          <div class="menu sub-menu" @click.stop="parentMenuClick(route, $event)" :class="{'no-hover': route.hasOwnProperty('subList') && route.subList.length > 0 && route.showChildlist}" v-if="route.hasOwnProperty('showChildlist') && route.showChildlist && route.subList && route.subList.length > 0">
            <span class="--hst-menu-icon">
              <img :src="route.img" alt="">
            </span>
            <span class="--hst-menu-name" v-if="!onlyShowIcon">{{ route.name }}</span>
            <span class="--hst-triangle-btn" v-if="!onlyShowIcon && route.hasOwnProperty('subList') && route.subList.length > 0">
              <img src="../../../static/images/arrow_pressed.png" alt="" v-if="route.showChildlist">
              <img src="../../../static/images/arrow.png" alt="" v-else>
            </span>
            <ul v-if="route.hasOwnProperty('subList') && route.subList.length > 0 && route.showChildlist">
              <li v-for="(subRoute, $subindex) in route.subList" :key="$subindex" @click="subRouteLink(subRoute)" :class="{'--hst-menu-active': getRoute() === subRoute.path || getRoute() === subRoute.path.substring(0, subRoute.path.length - 1)}" v-show="parseInt(subRoute.path.match(/\/home\/layout\/(\S*)/)[1]) > 0 ? $store.state.ws.attendeeUserId.indexOf(parseInt(subRoute.path.match(/\/home\/layout\/(\S*)/)[1])) > -1 : true">
                <span class="--hst-sub-menu-icon">
                </span>
                <!-- <span class="--hst-menu-name" v-if="!onlyShowIcon">{{ subRoute.name }}</span> -->
                <!-- <span class="--hst-menu-name" v-if="!onlyShowIcon"
                   :title="formatUserName(($subindex === 0 && langChanges) ? $t('m.leftmenu_layout_main') : $store.state.ws.attendeeUserMap.get(subRoute.userID).DisplayName).isExtra ?
                  (($subindex === 0 && langChanges) ? $t('m.leftmenu_layout_main') : $store.state.ws.attendeeUserMap.get(subRoute.userID).DisplayName) : ''"
                >{{ formatUserName(($subindex === 0 && langChanges) ? $t('m.leftmenu_layout_main') : $store.state.ws.attendeeUserMap.get(subRoute.userID).DisplayName, 11).name }}</span> -->
                <span class="--hst-menu-name" v-if="!onlyShowIcon && ($subindex === 0 && langChanges)" :title="$t('m.leftmenu_layout_main')">
                  {{formatUserName($t('m.leftmenu_layout_main')).name}}
                </span>
                <span class="--hst-menu-name" v-if="!onlyShowIcon && !($subindex === 0 && langChanges) && $store.state.ws.attendeeUserMap.get(subRoute.userID)">
                  {{formatUserName($store.state.ws.attendeeUserMap.get(subRoute.userID).DisplayName, 11).name}}
                </span>
                <span class="--hst-triangle-btn" v-if="!onlyShowIcon && subRoute.hasOwnProperty('subList') && subRoute.subList.length > 0">
                  <img src="../../../static/images/arrow_pressed.png" alt="" v-if="subRoute.showChildlist">
                  <img src="../../../static/images/arrow.png" alt="" v-else>
                </span>
                <span class="--hst-triangle-btn" v-if="!onlyShowIcon && subRoute.hasOwnProperty('subList') && subRoute.subList.length > 0">
                  <img src="../../../static/images/arrow_pressed.png" alt="" v-if="subRoute.showChildlist">
                  <img src="../../../static/images/arrow.png" alt="" v-else>
                </span>
              </li>
            </ul>
          </div>
          <div class="menu" @click="routeLink(route)" :class="{'--hst-menu-active': getRoute() === route.path}" v-else>
            <span class="--hst-menu-icon">
              <img :src="route.img" alt="">
            </span>
            <span class="--hst-menu-name" v-if="!onlyShowIcon">{{ route.name }}</span>
            <span class="--hst-triangle-btn" v-if="!onlyShowIcon && route.hasOwnProperty('subList') && route.subList.length > 0">
              <img src="../../../static/images/arrow_pressed.png" alt="" v-if="route.showChildlist">
              <img src="../../../static/images/arrow.png" alt="" v-else>
            </span>
          </div>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    menulist: {
      default: []
    }
  },
  data () {
    return {
      list: this.$props.menulist,
      showChildlist: false,
      onlyShowIcon: false,
      langChanges: 1,
      scrollHeight: 100
    }
  },
  computed: {
    routePath () {
      return this.$route.path
    },
    ...mapState({
      windowResize: state => state.windowResize
    })
  },
  mounted () {
    /* eslint-disable no-undef */
    EleResize.on(this.$refs.hstMenu, () => {
      if (this.$refs.hstMenu.clientWidth < 190) {
        this.onlyShowIcon = true
      } else {
        this.onlyShowIcon = false
      }
    })
  },
  methods: {
    routeLink (r) {
      if (r.hasOwnProperty('showChildlist')) {
        r.showChildlist = !r.showChildlist
      }
      if (r.path) this.$router.push(r.path)
    },
    subRouteLink (r) {
      if (r.path) this.$router.push(r.path)
    },
    parentMenuClick (r, e) {
      let eventSource = ''
      window.e = e.target

      if (e.target.nodeName === 'IMG') {
        eventSource = e.target.parentNode.parentNode
      } else if (e.target.nodeName === 'SPAN') {
        eventSource = e.target.parentNode
      } else if (e.target.nodeName === 'DIV') {
        eventSource = e.target
      } else {
        return false
      }
      if (eventSource.classList.contains('sub-menu')) {
        r.showChildlist = false
      } else {
        return false
      }
    },
    // 获取URL中的路由信息
    getRoute () {
      return this.$route.path
    }
  },
  watch: {
    routePath (curRoute) {
      for (let route of this.list) {
        if (curRoute.indexOf(route.path) > -1) {
          // 当前子菜单中
          route.showChildlist = true
        }
      }
    },
    windowResize: {
      immediate: true,
      handler () {
        this.scrollHeight = document.body.clientHeight - 120
      }
    },
    /* eslint-disable no-useless-computed-key */
    ['$i18n.locale'] () {
      this.langChanges++
    }
  }
}
</script>
<style lang="scss" scoped>
.--hst-menu {
  transition: width 0.5s;
  -moz-transition: width 0.5s;
  -webkit-transition: width 0.5s;
  -o-transition: width 0.5s;
}

.collapse-sty {
  margin-bottom: 20px;
  text-align: center;
  color: #ACC1D8;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100%;
}

.--hst-menu {
  ul {
    width: 100%;
    color: #fff;
    font: {
      size: 14px;
      weight: bold;
    }
    li div.menu {
      line-height: 40px;
      color: #C5D4E5;
      .--hst-menu-icon, .--hst-menu-name {
        display: inline-block;
      }
      .--hst-menu-icon {
        height: 40px;
        margin-left: 16px;
        margin-right: 16px;
        img {
          vertical-align: middle;
        }
      }
      .--hst-triangle-btn {
        display: block;
        height: 40px;
        float: right;
        margin-right: 20px;
        font-size: 22px;
        color: #fff;
        img {
          vertical-align: middle;
        }
      }
      &:hover {
        background-color: #2BA77D;
        color: #fff;
      }
      &.no-hover:hover {
        background-color: #253647;
        color: #fff;
      }
    }
  }
}

.sub-menu {
  ul li {
    list-style: none;
    color: #C5D4E5;
    .--hst-menu-name {
        margin-left: 50px;
    }
  }
}

.--hst-menu-active, .sub-menu ul li:hover {
  background-color: #2BA77D;
}
.--hst-menu-active {
  span.--hst-menu-name {
    color: #fff;
  }
}

</style>
