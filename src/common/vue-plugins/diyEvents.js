
/**
 * 扩展新的js事件
 * @event setItemEvent 监听SPA应用中的localStorage值变化
 */
let orignalSetItem = localStorage.setItem
localStorage.setItem = function (key, newValue) {
  let setItemEvent = new Event('setItemEvent')
  setItemEvent.key = key
  setItemEvent.newValue = newValue
  window.dispatchEvent(setItemEvent)
  orignalSetItem.apply(this, arguments)
}

// 用法
// window.addEventListener("setItemEvent", function (e) {
//   alert(e.newValue)
// })
