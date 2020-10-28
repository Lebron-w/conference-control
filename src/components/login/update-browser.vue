<template>
  <div class="warp">
    <div class="tips">
      <div class="title">{{ $t('m.abnormal_msg_BrowVersionLow') }}</div>
      <div class="ctx">
        {{ $t('m.abnormal_msg_updateBrow') }}
      </div>
      <ul class="browsers clearfix">
        <li class="chrome" @click="download('chrome')">
          <div class="browser"></div>
          <span class="name">Chrome</span>
        </li>
        <li class="firefox" @click="download('firefox')">
          <div class="browser"></div>
          <span class="name">Firefox</span>
        </li>
        <li class="edge" @click="download('edge')">
          <div class="browser"></div>
          <span class="name">Edge</span>
        </li>
        <li class="safari" @click="download('safari')">
          <div class="browser"></div>
          <span class="name">Safari</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  methods: {
    download (browser) {
      switch (browser) {
        case 'chrome':
          window.open('https://www.google.cn/intl/zh-CN/chrome/')
          break
        case 'firefox':
          window.open('http://www.firefox.com.cn/')
          break
        case 'edge':
          window.open('http://www.microsoft.com/zh-cn/windows/microsoft-edge/')
          break
        case 'safari':
          window.open('https://support.apple.com/zh_CN/downloads/safari')
          break
        default:
          return false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.warp {
  width: 100%;
  height: inherit;
  .tips {
    width: 664px;
    height: 404px;
    margin: calc(25% - 200px) auto 0;
    background: url('../../../static/images/login/old-browser-tip/bg.png');
    background-size: cover;
  }
  .title {
    font-size: 30px;
    font-weight: bold;
    color: #FF5B2F;
    line-height: 30px;
    padding-top: 50px;
    margin-left: 50px;
  }
  .ctx {
    width: calc(100% - 100px);
    font-size: 20px;
    color: #FFF;
    line-height: 40px;
    margin-left: 50px;
    margin-top: 14px;
  }
}
.browsers {
  margin-left: 36px;
  margin-top: 1em;
  &, & li {
    list-style: none;
  }
  li {
    float: left;
    cursor: pointer;
  }
  li .browser {
    width: 110px;
    height: 110px;
  }
  li .name {
    display: inline-block;
    width: 110px;
    color: #FFF;
    font-size: 20px;
    text-align: center;
  }
  .chrome {
    .browser {
      background: url('../../../static/images/login/old-browser-tip/google.png');
      background-size: cover;
      &:hover {
        background: url('../../../static/images/login/old-browser-tip/google_press.png');
      }
    }
  }
  .firefox {
    .browser {
      background: url('../../../static/images/login/old-browser-tip/firefox.png');
      background-size: cover;
      &:hover {
        background: url('../../../static/images/login/old-browser-tip/firefox_press.png');
      }
    }
  }
  .edge {
    .browser {
      background: url('../../../static/images/login/old-browser-tip/ie.png');
      background-size: cover;
      &:hover {
        background: url('../../../static/images/login/old-browser-tip/ie_press.png');
      }
    }
  }
  .safari {
    .browser {
      background: url('../../../static/images/login/old-browser-tip/safari.png');
      background-size: cover;
      &:hover {
        background: url('../../../static/images/login/old-browser-tip/safari_press.png');
      }
    }
  }
}
</style>
