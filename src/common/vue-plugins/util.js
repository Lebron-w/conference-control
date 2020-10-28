/**
 * 基于 vue 的公共方法封装
 *
 * @export util.strBytes
 *
 */
import allLayouts from '@/components/layout-control/screen/layout'

let myUtil = {}

myUtil.install = (Vue, Options) => {
  // 读取字符串的文本占位长度
  Vue.prototype.__strBytes = (str) => {
    let bytesCount = 0
    str = str.toString()
    for (let i = 0; i < str.length; i++) {
      let c = str.charAt(i)
      /* eslint-disable no-control-regex */
      if (/^[\u0000-\u00ff]$/.test(c)) {
        // 单字节文本
        bytesCount += 1
      } else {
        // 双字节或三字节文本
        bytesCount += 2
      }
    }
    return bytesCount
  }

  // 格式化用户名
  Vue.prototype.formatUserName = (userName, size = 18) => {
    if (Vue.prototype.__strBytes(userName) < size) {
      return {
        name: userName,
        isExtra: false
      }
    } else {
      let str = userName
      while (Vue.prototype.__strBytes(str) > (size - 2)) {
        str = str.split('')
        str.splice(Math.floor(str.length / 2), 1)
        str = str.join('')
      }
      str = str.split('')
      str[Math.floor(str.length / 2)] = '...'
      str = str.join('')
      return {
        name: str,
        isExtra: true
      }
    }
  }

  // 获取浏览器类型
  Vue.prototype.getBrowserType = () => {
    let userAgent = navigator.userAgent
    let isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1
    let isEdge = userAgent.indexOf('Edge') > -1 && !isIE
    let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
    if (isIE || isIE11 || isEdge) {
      // IE系列
      return 0
    } else {
      // 现代浏览器
      return 1
    }
  }

  Vue.prototype.getScreenLayout = (screen) => {
    let layouts = allLayouts.layouts
    if (screen.LayoutMode === 1) {
      // 标准模式
      return layouts.standard
    } else if (screen.LayoutMode === 2) {
      // 数据模式
      return layouts.training
    } else if (screen.LayoutMode === 3) {
      // 视频模式、画中画
      return layouts[`layout_square_${screen.DataArea[1].UserData}`] || layouts[`layout_square_6`]
    }
  }

  // 参会人UserId格式化
  Vue.prototype.getAttUserId = (str) => {
    let u = -1
    if (str.toString().indexOf('@') > -1) {
      str = str.substring(1)
    }
    u = str.toString().indexOf(':') > -1 ? parseInt(str.match(/(\S*):/)[1]) : parseInt(str)
    return u
  }
  // 参会人VedioId格式化
  Vue.prototype.getAttVideoId = (str) => {
    let u = -1
    if (str.toString().indexOf(':') > -1) {
      if (str.match(/:(\S*)/)[1].length > 0) {
        if (str.match(/:(\S*)/)[1].indexOf('/') > -1) {
          if (str.match(/:(\S*)/)[1].match(/(\S*)\//)[1].length > 0) {
            u = parseInt(str.match(/:(\S*)/)[1].match(/(\S*)\//)[1])
          }
        } else {
          u = parseInt(str.match(/:(\S*)/)[1])
        }
      }
    }
    return u
  }
  // 参会人UserId生成用户名
  Vue.prototype.getUsername = (id, store) => {
    return store.state.ws.attendeeUserMap.get(id) ? store.state.ws.attendeeUserMap.get(id).DisplayName : ''
  }

  /**
   * @interface setDragData
   * @param {String} key
   * @param {String} val
   * 针对H5原生拖拽传参的浏览器兼容性问题
   * @interface getDragData
   * @param {String} key
   * @return {String} data
   */
  Vue.prototype.setDragData = (evt, key, val) => {
    switch (key) {
      case 'dropEffect':
        try {
          evt.dataTransfer.setData('dropEffect', val)
        } catch (e) {}
        break
      case 'effectAllowed':
        try {
          evt.dataTransfer.setData('effectAllowed', val)
        } catch (e) {}
        break
      case 'data':
        try {
          evt.dataTransfer.setData('items', val)
        } catch (e) {
          evt.dataTransfer.setData('Text', val)
        }
        break
      default:
        console.warn('拖拽传递的参数不合法！')
    }
  }
  Vue.prototype.getDragData = (evt, key) => {
    let data = ''
    switch (key) {
      case 'dropEffect':
        try {
          data = evt.dataTransfer.getData('dropEffect')
        } catch (e) {}
        break
      case 'effectAllowed':
        try {
          data = evt.dataTransfer.getData('effectAllowed')
        } catch (e) {}
        break
      case 'data':
        try {
          data = evt.dataTransfer.getData('items')
        } catch (e) {
          data = evt.dataTransfer.getData('Text')
        }
        break
      default:
        console.warn('拖拽传递的参数不合法！')
    }
    return data
  }

  // storage存储方法封装
  Vue.prototype.setItem = (key, value) => {
    if (!window.localStorage) {
      console.error('您的浏览器不支持本地存储，将无法为您缓存修改的信息，请升级到更高版本浏览器使用！')
      return false
    } else {
      value = typeof value === 'object' ? JSON.stringify(value) : value.toString()
      try {
        localStorage.setItem(key, value)
      } catch (e) {
        window.localStorage[key] = value
      }
    }
  }
  Vue.prototype.getItem = (key) => {
    if (!window.localStorage) {
      console.error('您的浏览器不支持本地存储，将无法为您缓存修改的信息，请升级到更高版本浏览器使用！')
      return false
    } else {
      return localStorage.getItem(key) || ''
    }
  }

  // 根据用户名获取用户广播状态
  Vue.prototype.getAttVideoState = (usersMap, att) => {
    if (usersMap.get(att) && usersMap.get(att).hasOwnProperty('Video') && usersMap.get(att).Video.length > 0) {
      // 有摄像头
      let videoState = false
      for (let vid of usersMap.get(att).Video) {
        if (vid.State === 2) {
          videoState = true
          break
        }
      }
      if (videoState) {
        // 广播状态
        return 2
      } else {
        // 未广播
        return 0
      }
    } else {
      // 没摄像头
      return -1
    }
  }
  // 去除数组重叠方法
  // Vue.prototype.arrayDifference = function (arr1, arr2) {
  //   let clone = arr1.slice(0) // clone = a
  //   for (let i = 0; i < arr2.length; i++) {
  //     let temp = arr2[i]
  //     for (var j = 0; j < clone.length; j++) {
  //       if (temp === clone[j]) {
  //         clone.splice(j, 1)// remove clone[j]
  //       }
  //     }
  //   }
  //   return clone
  // }
}
export default myUtil
