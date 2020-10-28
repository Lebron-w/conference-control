/**
 * 判断浏览器类型和IE版本，提示升级浏览器
 */

// 创建DOM内存块
function fragment (el) {
  var element = document.getElementById(el) || document.getElementsByTagName(el)[0]
  window.body = document.getElementsByTagName(el)
  var oFragment = document.createDocumentFragment()
  var div = document.createElement('div')
  var height = document.documentElement.clientHeight
  div.style.height = height
  div.id = "updater"
  div.innerHTML = '\
    <div class="warp">\
      <div id="tips" class="tips">\
        <div class="title">浏览器版本过低！</div>\
        <div class="ctx">\
          为了得到我们会议控制软件最好的体验效果，我们建议您选择现代浏览器或者升级到最新版的 Internet Explorer（至少IE10），以下列表展示了部分流行的现代浏览器：\
        </div>\
        <ul class="browsers clearfix">\
          <li class="chrome" onclick="download(\'chrome\')">\
            <div class="browser"></div>\
            <span class="name">Chrome</span>\
          </li>\
          <li class="firefox" onclick="download(\'firefox\')">\
            <div class="browser"></div>\
            <span class="name">Firefox</span>\
          </li>\
          <li class="edge" onclick="download(\'edge\')">\
            <div class="browser"></div>\
            <span class="name">Edge</span>\
          </li>\
          <li class="safari" onclick="download(\'safari\')">\
            <div class="browser"></div>\
            <span class="name">Safari</span>\
          </li>\
        </ul>\
      </div>\
    </div>\
    <style>\
      html, body {\
        margin: 0;\
        padding: 0;\
        font-family: "Microsoft YaHei";\
        overflow: hidden;\
      }\
      #updater {\
        width: 100%;\
        height: 100vh;\
        overflow: hidden;\
        background: url(\'./images/login/bg.png\');\
        background-size: contain;\
      }\
      .warp {\
        width: 100%;\
        height: inherit;\
      }\
      .warp .tips {\
        width: 664px;\
        height: 404px;\
        margin: 0 auto;\
        background: url("./images/login/old-browser-tip/bg.png");\
        background-size: cover;\
      }\
      .warp .title {\
        font-size: 30px;\
        font-weight: bold;\
        color: #ff5b2f;\
        line-height: 30px;\
        padding-top: 50px;\
        margin-left: 50px;\
      }\
      .warp .ctx {\
        width: 560px;\
        font-size: 20px;\
        color: #fff;\
        line-height: 40px;\
        margin-left: 50px;\
        margin-top: 14px;\
      }\
      \
      .browsers {\
        margin-left: 36px;\
        margin-top: 1em;\
      }\
      \
      .browsers,\
      .browsers li {\
        list-style: none;\
      }\
      .browsers li {\
        float: left;\
        cursor: pointer;\
      }\
      \
      .browsers li .browser {\
        width: 110px;\
        height: 110px;\
      }\
      .browsers li .name {\
        display: inline-block;\
        width: 110px;\
        color: #fff;\
        font-size: 20px;\
        text-align: center;\
      }\
      \
      .browsers .chrome .browser {\
        background: url("../../../static/images/login/old-browser-tip/google.png");\
        background-size: cover;\
      }\
      .browsers .chrome .browser:hover {\
        background: url("../../../static/images/login/old-browser-tip/google_press.png");\
      }\
      .browsers .firefox .browser {\
        background: url("../../../static/images/login/old-browser-tip/firefox.png");\
        background-size: cover;\
      }\
      .browsers .firefox .browser:hover {\
        background: url("../../../static/images/login/old-browser-tip/firefox_press.png");\
      }\
      .browsers .edge .browser {\
        background: url("../../../static/images/login/old-browser-tip/ie.png");\
        background-size: cover;\
      }\
      .browsers .edge .browser:hover {\
        background: url("../../../static/images/login/old-browser-tip/ie_press.png");\
      }\
      .browsers .safari .browser {\
        background: url("../../../static/images/login/old-browser-tip/safari.png");\
        background-size: cover;\
      }\
      .browsers .safari .browser:hover {\
        background: url("../../../static/images/login/old-browser-tip/safari_press.png");\
      }\
    </style>\
  '
  oFragment.appendChild(div)
  element.appendChild(oFragment)
  document.getElementById('tips').style.marginTop = (height - 404) / 2 + 'px'
  window.onresize = function () {
    document.getElementById('tips').style.marginTop = (document.documentElement.clientHeight - 404) / 2 + 'px'
  }
}

// 下载方法
function download (browser) {
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

// 判断浏览器版本
function IEVersion () {
  var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
  var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // 判断是否IE<11浏览器
  var isEdge = userAgent.indexOf('Edge') > -1 && !isIE // 判断是否IE的Edge浏览器
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
  if (isIE) {
    var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
    reIE.test(userAgent)
    var fIEVersion = parseFloat(RegExp['$1'])
    if (fIEVersion === 7) {
      return 7
    } else if (fIEVersion === 8) {
      return 8
    } else if (fIEVersion === 9) {
      return 9
    } else if (fIEVersion === 10) {
      return 10
    } else {
      return 6// IE版本<=7
    }
  } else if (isEdge) {
    return 15// edge
  } else if (isIE11) {
    return 11 // IE11
  } else {
    return -1// 不是ie浏览器
  }
}
