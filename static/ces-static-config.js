/**
 * 本项目全局配置静态文件
 * @export logo信息
 * @export 多语言配置信息
 * 
 */

// logo
var logo = {
  src: './static/imgs/header_logo.png'
}

var lang = {
  locale: 'zh-CN',
  localeLang: '简体中文',
  allowMultilingual: true
}

var DASHBOARD_CONFIG = [
  {
    "type":"roominfo",
    "name":"会议室信息"
  },{
    "type":"layoutinfo",
    "name":"布局切换"
  },{
    "type":"roomright",
    "name":"会议权限"
  }
];

var STATIC_CONFIG = {
  "logo": logo,
  "lang": lang,
  "DASHBOARD_CONFIG":DASHBOARD_CONFIG
}
