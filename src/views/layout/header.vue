<template>
  <div class="ces-header">
    <!-- logo -->
    <div class="ces-logo">
      <img :src="$config.logo.src">
    </div>
    <!-- 语言设置 -->
    <div :class="{'ces-lang': true, 'ces-funct-menu': true, 'ces-selected': !showLangList}" @click="openLangTab" v-if="$config.lang.allowMultilingual"  @mouseleave="showLangList = false">
      <span>{{localeLang}}</span>
      <span class="triangle">
        <span :class=" showLangList ? 'triangle-content-top' : 'triangle-content-bottom'"></span>
      </span>
      <ul v-if="showLangList" class="menu-list">
        <li v-for="item in langList" :key="item.value" @click="chooseLang(item)"><span>{{ item.label }}</span></li>
      </ul>
    </div>
    <!-- 当前用户信息 -->
    <div :class="{'ces-user': true, 'ces-funct-menu': true, 'ces-selected': !showUserMenu}" @click="showUserMenu = !showUserMenu"  @mouseleave="showUserMenu = false">
      {{ $t('m.username') }}:
      <span class="ces-username">
        {{ $store.state.conferenceControlInfo.username }}
      </span>
      <span class="triangle">
        <span :class=" showUserMenu ? 'triangle-content-top' : 'triangle-content-bottom'"></span>
      </span>
      <ul v-if="showUserMenu" class="menu-list">
        <li @click="exitControl">
          <img src="static/images/out_control.png" alt="" class="exit-icon">
          <span>{{ $t('m.exit') }}</span>
        </li>
        <li @click="endMeeting">
          <img src="static/images/end_meeting.png" alt="" class="exit-icon">
          <span>{{ $t('m.meetingDismiss') }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      localeLang: '简体中文',
      langList: [{
        value: 'zh-CN',
        label: '简体中文'
      }, {
        value: 'zh-TW',
        label: '繁體中文'
      }
      //  {
      //   value: 'en-US',
      //   label: 'English'
      // }
      ],
      showLangList: false,
      showUserMenu: false
    }
  },
  computed: {
    ...mapState({
      tipsType: state => state.tipsType
    })
  },
  created () {
    // 从url请求参数中读取语言参数，localStorage读取, 配置文件读取
    this.getLang()
  },
  methods: {
    getLang () {
      if (!!window.localStorage && localStorage.getItem('lang')) {
        this.localeLang = localStorage.getItem('lang').split(':')[0]
        this.$i18n.locale = localStorage.getItem('lang').split(':')[1]
      } else {
        // 读缓存
        if (!URL) {
          // 从url中读取当前tab页的语言配置<判断条件需要重新写>
          this.localeLang = ''
          this.$i18n.locale = ''
          this.saveLang(this.localeLang, this.$i18n.locale)
        } else {
          // 默认配置
          this.localeLang = this.$config.lang.localeLang
          this.$i18n.locale = this.$config.lang.locale
          this.saveLang(this.localeLang, this.$i18n.locale)
        }
      }
    },
    openLangTab () {
      if (!this.showLangList) {
        this.showLangList = true
      } else {
        this.showLangList = false
      }
    },
    chooseLang (lang) {
      this.$i18n.locale = lang.value
      this.localeLang = lang.label
      this.saveLang(this.localeLang, this.$i18n.locale)
    },
    saveLang (value, label) {
      this.$store.commit('saveLang', label)
      if (window.localStorage) {
        try {
          localStorage.setItem('lang', `${value}:${label}`)
        } catch (e) {
          localStorage.lang = `${value}:${label}`
        }
      } else {
        console.warn('您的浏览器不支持本地存储，将无法记录您的语言信息！')
      }
    },
    // 退出會控
    exitControl () {
      this.$confirm(this.$t('m.exit_msg_comfirm'), this.$t('m.common_msg_tip'), {
        confirmButtonText: this.$t('m.common_btn_save'),
        cancelButtonText: this.$t('m.common_btn_cancel'),
        type: 'warning'
      }).then(() => {
        // 防止布局控制编辑状态下弹框
        if (this.$store.state.ws.isEditing) {
          this.$store.commit('ws/changeEditStutau', false)
        }

        // @grant window.close
        this.$ws.send({
          'CmdID': 1001,
          'Data': {}
        })
        this.$ws.logout()
        // 修改退出会控的提示语
        this.$store.commit('recordLoginStatus', {
          flag: 0,
          msg: this.$t('m.exit_msg_being')
        })
        setTimeout(function () {
          window.close()
        }, 1500)
      }).catch(() => {})
    },
    // 结束会议
    endMeeting () {
      this.$confirm(this.$t('m.meetingDismiss_msg_comfirm'), this.$t('m.common_msg_tip'), {
        confirmButtonText: this.$t('m.common_btn_save'),
        cancelButtonText: this.$t('m.common_btn_cancel'),
        type: 'warning'
      }).then(() => {
        // 防止布局控制编辑状态下弹框
        if (this.$store.state.ws.isEditing) {
          this.$store.commit('ws/changeEditStutau', false)
        }

        this.$ws.send({
          'CmdID': 1007,
          'Data': {
            'Reason': 0,
            'Description': '会控关闭会议室！'
          }
        })
        this.$ws.logout()
        // 修改退出会控的提示语
        this.$store.commit('recordLoginStatus', {
          flag: 0,
          msg: this.$t('m.meetingDismiss_msg_being')
        })
        setTimeout(function () {
          window.close()
        }, 1500)
      }).catch(() => {})
      // 清空会议室内保存的信息
      let storageObj = localStorage
      for (let key in storageObj) {
        if (/^nav-/.test(key) || /^layout-/.test(key)) {
          try {
            localStorage.removeItem(key)
          } catch (e) {
            localStorage[key] = '[]'
          }
        }
      }
    }
  },
  watch: {
    locole (lang) {
      this.$i18n.locale = lang
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../config/ces.config.scss';
$cesLangWidth: 10%;
.ces-header {
  background-color: $headerBgcolor;
  position: relative;
}
.ces-logo {
  width: 200px;
  height: 100%;
  float: left;
}
.ces-funct-menu {
  padding: 0 22px;
  float: right;
  text-align: center;
  border-left: 1px solid #4F91DB;
  font-size: 14px;
  color: #eee;
  line-height: $headerHeight;
  cursor: pointer;
}
.exit-icon {
  vertical-align: middle;
  margin-left: 14px;
}
// 下拉框的三角形：
.triangle {
  display: inline-block;
  position: relative;
  margin-left: 10px;
  margin-right: 22px;
  .triangle-content-bottom, .triangle-content-top {
    position: absolute;
    display: inline-block;
    width: 0px;
    height: 10px;
    border: 7px solid;
  }
  .triangle-content-bottom {
    top: -9px;
    border-color:  #eee transparent transparent transparent;
  }
  .triangle-content-top {
    top: -26px;
    border-color:  transparent transparent #eee transparent;
    background-color: #356EAD;
  }
}
.ces-user{
  .ces-username {
    margin-left: 10px;
  }
}
.ces-lang, .ces-user {
  position: relative;
  &:not(.ces-selected) {
    background-color: #356EAD;
  }
}
.menu-list {
  width: 100%;
  position: absolute;
  z-index: 2;
  top: $headerHeight;
  right: 0;
  list-style: none;
  li {
    line-height: 42px;
    text-align: left;
    color: #333;
    background-color: #fff;
    &:hover {
      background-color: #D8E6F5;
    }
    &.selectLangMenu{
      background-color: #D8E6F5;
    }
    // &:nth-of-type(odd) {
    //   background-color: #fff;
    // }
    // &:nth-of-type(even) {
    //   background-color: #D8E6F5;
    // }
    span {
      margin-left: 20px;
    }
    &>i, &>span {
      margin-left: 20px;
    }
  }
}

</style>
