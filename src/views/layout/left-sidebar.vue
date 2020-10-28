<template>
<div class="left-sidebar">
  <div class="collapse-sty" @click="changeCollapse">
    <span class="collapse-icon" :class="{'collapse-icon-open': isCollapse}">|||</span>
  </div>
  <hst-menu :menulist="menulist"></hst-menu>
</div>
</template>
<script>
import { mapState } from 'vuex'
import hstMenu from '../../components/hst-components/menu'
/* eslint-disable camelcase */
import menu_dashboard from '../../assets/menu-icon/menu_dashboard.png'
import menu_dashboard_pressed from '../../assets/menu-icon/menu_dashboard_pressed.png'
import menu_layout from '../../assets/menu-icon/menu_layout.png'
import menu_layout_pressed from '../../assets/menu-icon/menu_layout_pressed.png'
// import menu_permissions from '../../assets/menu-icon/menu_permissions.png'
// import menu_permissions_pressed from '../../assets/menu-icon/menu_permissions_pressed.png'
// import menu_text from '../../assets/menu-icon/menu_text.png'
// import menu_text_pressed from '../../assets/menu-icon/menu_text_pressed.png'
export default {
  components: {
    hstMenu
  },
  data () {
    return {
      // navList: [{
      menulist: [{
        img: menu_dashboard,
        imgPressed: menu_dashboard_pressed,
        path: '/home/wedget',
        name: this.$t('m.leftmenu_board')
      }, {
        img: menu_layout,
        imgPressed: menu_layout_pressed,
        path: '/home/layout',
        name: this.$t('m.leftmenu_layout'),
        showChildlist: false,
        subList: [{
          path: '/home/layout/',
          name: this.$t('m.leftmenu_layout_main'),
          userId: 0
        }]
      }
      // , {
      //   img: menu_permissions,
      //   imgPressed: menu_permissions_pressed,
      //   path: '',
      //   name: '更多权限'
      // }, {
      //   img: menu_text,
      //   imgPressed: menu_text_pressed,
      //   path: '',
      //   name: '字幕设置'
      // }
      ]
    }
  },
  computed: {
    isCollapse () {
      return this.$store.state.navMenu.isCollapse
    },
    ...mapState({
      layoutControlNav: state => state.layoutControlNav
    })
  },
  created () {
    this.readLocalNav()
  },
  methods: {
    readLocalNav () {
      let localeNav = this.getItem(`nav-${this.$store.state.ws.roomInfo.StartTime}`)
      localeNav = localeNav ? JSON.parse(localeNav) : []
      for (let i = 0; i < localeNav.length; i++) {
        this.$store.commit('addMenuNav', localeNav[i])
      }
      this.createSubmenuList(this.layoutControlNav)
    },
    changeCollapse () {
      this.$store.commit('navMenu/changeCollapse')
    },
    createSubmenuList (nav) {
      for (let item of nav) {
        let isExist = false
        this.menulist[1].subList.forEach(subListItem => {
          if (subListItem.path === item.path) {
            isExist = true
          }
        })
        if (!isExist) this.menulist[1].subList.push(item)
      }
    }
  },
  watch: {
    /* eslint-disable no-useless-computed-key */
    layoutControlNav (nav, oldNav) {
      for (let item of nav) {
        let isExist = false
        this.menulist[1].subList.forEach(subListItem => {
          if (subListItem.path === item.path) {
            isExist = true
          }
        })
        if (!isExist) this.menulist[1].subList.push(item)
      }
      // 菜单列表变化时，存储一次
      if (oldNav.length <= nav.length) {
        this.setItem(`nav-${this.$store.state.ws.roomInfo.StartTime}`, JSON.stringify(nav))
      }
    },
    ['$i18n.locale'] () {
      this.menulist[0].name = this.$t('m.leftmenu_board')
      this.menulist[1].name = this.$t('m.leftmenu_layout')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../config/ces.config.scss';
.left-sidebar {
  background-color: $sidebarBgcolor;
}

.collapse-sty {
  margin-bottom: 5px;
  text-align: center;
  color: #ACC1D8;
}

.collapse-icon {
  font-weight: bold;
  text-align: center;
  height: 20px;
  &.collapse-icon-open {
    display: inline-block;
    vertical-align: middle;
    transform:rotate(90deg);
    -moz-transform:rotate(90deg);
    -webkit-transform:rotate(90deg);
    -o-transform:rotate(90deg);
  }
}

</style>
