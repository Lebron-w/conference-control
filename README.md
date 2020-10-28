# ces_web

> Web development of CES

## Build Setup

``` bash
# install dependencies
npm install # or yarn install

# serve with hot reload at localhost:8080
npm run dev # or yarn run dev

# build for production with minification
npm run build # or yarn run build

# build for production and view the bundle analyzer report
npm run build --report

# Use eslint to standardize your code
npm run lint # or yarn run lint

# Use eslint to format your code and repair some repairable problems automatically.
npm run fix # or yarn run fix
```

## packages

序号|package|版本号|说明
:-|:-|:-|:-
1|vue|v2.5.2|工具库
2|vue-router|v3.0.1|路由管理
3|vuex|v3.0.1|状态管理
4|element-ui|v2.4.3|UI插件
5|axios|v0.18.0|ajax封装库
6|vue-i18n|v6.1.0|国际化
7|sortablejs|v1.7.0|兼容火狐的拖拽插件
8|babel-polyfill|v6.20.6|ES6新语法编译插件


## 目录结构
```
├─build --webpack打包文件目录
│  ├─build.js
│  ├─check-versions.js
│  ├─logo.png
│  ├─utils.js
│  ├─vue-loader.conf.js
│  ├─webpack.base.conf.js
│  ├─webpack.dev.conf.js
│  └─webpack.prod.conf.js
│      
├─config --开发阶段配置文件目录
│  ├─dev.env.js
│  ├─index.js
│  └─prod.env.js
│      
├─node_modules --开发阶段依赖存放目录
│              
├─src --开发目录
│  ├─App.vue --app入口
│  ├─main.js --app依赖注入入口文件
│  │  
│  ├─assets --动态资源文件目录
│  │      
│  ├─common --公共模块目录
│  │      ├─lang --国际化语言包存放目录
│  │      ├─config.js --全局配置文件
│  │      
│  ├─components --组件存放目录
│  │      ├─HelloWorld.vue
│  │      
│  ├─router --路由管理目录
│  │      ├─index.js
│  │      
│  ├─store --状态管理目录
│  │  │   ├─index.js
│  │  │  
│  │  ├─navigation-menu --导航菜单数据管理
│  │  │   ├─index.js
│  │  │      
│  │  └─websocket --ws数据管理
│  │      ├─index.js
│  │
│  ├─views --视图目录
│  │      ├─layout --界面布局目录
│  │      ├─view --路由视图目录
│  ├─websocket
│  │      ├─index.js --websocket模块封装
│  │      ├─params.js
│  │
│  └─style --css样式存放目录
│         ├─layoutVars.scss --全局样式申明配置文件
│         ├─bash.scss --全局样式文件
│          
├─static --静态资源存放目录
│
├─.eslintignore --eslint配置文件
├─.eslintrc.js --eslint配置文件
├─.gitignore --git配置文件
├─.postcssrc.js --css预编译配置文件
├─index.html --app挂载文件，项目外部入口文件
├─package.json --项目依赖管理文件
├─README.md --README
└─yarn.lock --依赖包版本管理文件
```

## 更换UI组件

> 更换原因
> 1. iview组件只兼最新浏览器，考虑到客户可能在局域网（不接入公网）环境运行，存在兼容性问题的风险，影响用户体验，详细浏览器兼容列表如下：
  ```json
    "browserslist": [
        "last 3 Chrome versions",
        "last 3 Firefox versions",
        "Safari >= 10",
        "Explorer >= 11",
        "Edge >= 12",
        "iOS >= 10",
        "Android >= 6"
    ]
  ```
> 2. 修改iview组件：需要修改iview底层组件库，难度大，会影响正常开发进度，并且在代码仓库存储iview插件的包文件，不利于代码仓库存储
> 替代方案：element-ui
> 1. 浏览器支持，官方原话：`Modern browsers and Internet Explorer 10+.`
> 2. 功能模块，因其开源时间比iview更早，团队规模更大，具备iview的所有功能，例如：布局、国际化、常用UI组件等
> 切换成本
> 1. 项目刚开始，使用的组件不足2个，修改容易
> 2. 两款UI组件使用方法类似
> 3. 官方示例充足，学习和使用成本很低，不影响开发进度


## CES4.3web会控web开发文档评审
1. 会控布局界面，是否需要取消编辑按钮？（产品经理Rain回复：切回预览就可以。由预览切到编辑，会给用户提示，是否取消编辑）
2. 会控布局点击广播视频按钮后的更新机制：(刘飞：等待服务端处理消息，然后回复客户端后更新本地会控布局信息）
3. 双击窗口全屏查看是否有必要（产品经理Rain回复：不需要）
4. websocket客户端模块消息发送超时和错误机制意见，（刘飞：websocket是基于tcp连接传输的，串行消息不会丢失，因此send方法不需要做异常处理，通过心跳是否超时判断当前连接状态是否正常）
5. 定制化多语言：（常委：希望在增加新语言支持时，直接增加对应的语言文件，通过修改配置文件即可生效）


## 自己动手实现选择语言栏遇到的问题：
1. 下拉框的小三角使用css生成 √
2. 鼠标移出组件范围自动折叠组件 √
3. 点击选择某选项后自动折叠组件 √
4. 遇到的问题：
    + 点击选项后，主动折叠下拉框可以实现，怎么判断鼠标移出组件。因使用绝对定位，这里使用mouseout事件无效，查资料发现遗忘了mouseLeave事件
    + 设置了mouseLeave事件后，点击选项，下拉框不会自动折叠了。与mouseLeave的判断机制重复，去掉点击选项主动折叠的代码即可

## vue.rfes使用上的问题：
1. 使用ref绑定Dom节点后，在created内无法正确的获取到refs指针对象 √
2. 解决办法：ref是在创建Dom结构时才被绑定，因此不能再created中使用，修改为mounted使用即可

## vue父子组件传参
1. props修改为只读属性，在子组件中需要用心的变量去接收
2. 父组件自定义事件，@自定义事件名="methods方法"
3. 子组件调用触发父组件方法：this.$emit('事件名', [参数])
4. *疑问：*父子组件传参的监听机制是什么，为什么有的地方会出现 no setter ---> 不能给getters的变量赋值
5. 父子组件数据更新同步机制怎么优化 getters 和 mapGetters 实现

## 参会人列表开发遇到的问题：
1. hst参会人列表排序规则和对应1901消息字段键值对 √
2. 请求中参会人列表需不需要标注新的参会人
3. filter 过滤器 √
4. sort 排序时比较数值需要用parseInt，比较ASCII码的值需要同toString转 √
5. 排序优化：分段减掉已排序的部分再排序 ---> 产生监听失效的问题，带来新的页面数据不能试试更新~！
6. 同类型身份的角色排序规则 √
7. Video 和 Audio 一个和多个的表示方法：数组？对象？ ---> 音频只有一个，使用对象格式，video有多个，使用数组格式 √
8. PrivateTalk 私聊状态是什么 √
9. 用户信息中的Info字段关联的是 1501 消息 √
10. 参会人消息增量更新时，字段值为0的参会人消息不能使用!!data.WBMarkState来判断，需要使用 data.hasOwnProperty('WBMarkState') 或 "data.WBMarkState" in data 来判断，前者效率更高 √
11. 请出会议室的消息是什么 1006 √
12. 关注用户功能无法调试
13. 客户端显示有麦克风，但是1901消息中没有
14. 点击退出会控，发送ComId1001消息，没回复，直接切断了websocket，此处建议增加回复机制
15. 第二个汇控人登录会控返回错误码为1，应该做更详细的错误处理

## 测试问题
1. 新增摄像头的消息无法正确的更新列表上
> 1. 没有麦克风推送消息，但是客户端显示有麦克风，界面收到麦克风设置的消息，是否自动添加？详见 mutations.js 1905消息
> 2. 插入3.5mm通话耳机，代理服务器推送的是修改音频设备的消息，此时并没有麦克风？

2. 权限数据：Role 在代理服务器生成的是什么？权限代号还是权限名称
3. 客户端“我要发言”选项，点击后应该切换麦克风状态还是Datastate字段的值 ---> 切换Datastate字段的值，客户端服务器处后为Audio.State == 2 √

2. 请求中列表和数据未正常更新 √
3. 页面高度缩小会卡死的情况，可能与mounted中监听clientHeight计算pageSize有关，修改为页面高度缩小到一定程度，直接返回pageSize为0
4. `console.error('msg1905修改摄像头状态失败！不存在该设备')` 代理服务器推送修改本地不存在的摄像头ID消息时，如何处理

## 拖拽组件 sortablejs 使用
1. 实例化：
```JavaScript
  this.drag = new Sortable(this.$refs.sortAbleTab, {
    group: {
      name: 'drag',
      pull: true
    },
    disabled: true, // 禁止拖拽，修改为 false 可拖拽
    animation: 120,
    ghostClass: 'placeholder-style',
    onRemove (event) {
      vm.showList.splice(event.newIndex, 0, vm.showList[event.item.getAttribute('data-index')]);
    }
  });
```
2. 修改是否禁用状态：取消禁用 `this.drag.options.disabled = false`
3. [更多详见](https://segmentfault.com/a/1190000008209715)

## 20180728 web会控参会人列表开发代码评审
1. websocket模块业务拆分，将onmsessage内的方法抽离为各个业务模块调用，方便后续开发者查看代码和业务修改、扩展（意见提出者：Frank）。采纳意见：采纳
2. 代码规范，单个函数的函数体不宜过长，例如onmessage中的处理逻辑过多（意见提出者：Frank）。采纳意见：采纳
3. 关键点添加console开关，增加后台打印异常日志（意见提出者：Frank）。采纳意见：后期优化时添加
4. url路径使用别名代替过多的'../../'（意见提出者：Bill）。采纳意见：采纳
5. 命名规范：在store中保存原始websocket消息时，使用语义化命名去接收消息体（意见提出者：常伟）。采纳意见：采纳
6. 参会人列表排序后，使用有序的参会人userId数组替换之前的索引数组（意见提出者：Bill）。采纳意见：比较两种方法性能，采取性能更好的方法
7. 参会人列表确认多个摄像头时，多出来的摄像头前面是显示摄像头名称还是用户名（问题提出者：Luck）。采纳意见：待产品经理确认
8. 参会人列表采用用户下拉显示折叠的摄像头，同时本页多出的参会人可滚动查看，让参会人列表的功能单一化（意见提出者：Frank）。采纳意见：待产品经理确认
9. 前端安全防护，防止同源攻击和跨站脚本攻击（意见提出者：常伟）。采纳意见：向代理服务器发送消息前做消息的安全过滤，代理服务器端做消息安全验证@刘飞

## 截止0803日，需要尽快补充的UI图：
1. 从后台跳转至会控页的过程loading图，至少包括正在打开会控App，正在验证身份两个过程
2. 客户端浏览器兼容性友好提示界面
3. 布局控制界面右键菜单UI

## 参会人拖拽('clone')时出现的新bug
1. 将参会人拖到视频窗口，原参会人的点击事件没了！！！
2. 解决方案，详见vue-test

## index.html文件中的静态文件打包时，自动更新sid：

* 修改build目录下的build.js文件
```javascript
  // 在顶部引入fs模块
  const fs = require('fs')
  // ...
  // 在 webpack 方法执行的末尾，添加index.html的sid更新代码
  var dataOfIndexHtml = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');
  var reg = /\.js\?sid=[a-zA-Z0-9]+"><\/script>/ig
  if (reg.test(dataOfIndexHtml)) {
    dataOfIndexHtml = dataOfIndexHtml.replace(reg, '.js?sid=' + Date.parse(new Date()) + '"></script>')
  } else {
    dataOfIndexHtml = dataOfIndexHtml.replace(reg, '.js?sid=' + Date.parse(new Date()) + '></script>')
  }

  fs.writeFile(path.join(__dirname, '../dist/index.html'), dataOfIndexHtml.trim(), function(err){
    if(err) console.log('静态文件引用已更新失败')
    console.log('静态文件引用已更新成功')
  })
```
* 简要说明：
1. rm() 开始执行webpack文件移动和打包的命令
2. webpack() 执行webpack打包配置的方法，该方法为同步方法
3. 选择在webpack方法末尾执行index.html文件的sid更新，是因为我们只需要修改dist目录下的index.html，在webpack()方法末尾，其他打包和构建已经完成，所有文件都生成完毕(在这之前还没有index.html这个文件)

## 20181016 修改记录
1. 修改编辑状态用户离线后，窗口间拖拽会触发该用户丢失而只显示-1、-2 等。解决措施，用户丢失时，删除该用户，不再显示在布局快照上
2. 首次登陆无法正确跑出异常的原因：①已放行的版本中的提示信息国际化方法中未做错误捕获，会抛出‘split’方法的主体是undefined，②message-handler中未正确的做好错误捕获，现在修正。相关BUG：27825

## 2019430 修改记录
1.  CES V 4.6 计划bug分析：仪表盘中布局切换按钮判定区域不合理。原因：按钮多余区域设置手势光标，应在按钮区域设置光标类型，现在修正。相关BUG:30445
2.  CES V 4.6 计划bug分析：刷新和查看按钮点击时，会导致会控人和语言选择模块抖动。原因：浏览器滚动条占用空间，现修正。相关BUG： 27534

## 会控开发备忘
1. 问题点： web会控是否实时动态显示当前轮巡用户名 处理结论： 不用动态显示，仅按照需求，显示正在广播轮巡： 北京办等10人即可。处理原因： 目前无法让web会控接收轮巡到某一个人的信息
2. 问题点： web会控停止轮巡时发送的消息体 处理结论： 停止轮巡仅需要包含： 轮巡状态；窗口;即可，不需要组装用户列表等其他信息
3. 问题点: web会控对广播轮巡权限的控制： 对PC指定版本客户端情况下，仅当前被编辑的用户为主讲时，才能设置广播轮巡，否则只能设置本地轮巡 处理原因： 客户端仅有主讲能够广播轮巡

## 会控轮巡开发遇到的问题
1. 现有协议无法区分正在广播的用户和正在被查看的用户，可能需要增加协议

## 视频轮巡开发遇到的问题
1. Vue v-model中Select下拉菜单怎么绑定绑定动态初值
