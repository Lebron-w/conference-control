/**
 * @export url-params {ws/wssURL、roomId、token、username}
 */

let key = '5140c4f4-af41-4d2a-b0ca-533a18382ca9'

function getUrlParam (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

/* eslint-disable */
let loginParams = () => {
  let loginObj = getUrlParam('aa')
  try {
    loginObj = DES3.decrypt(key, loginObj)
    sessionStorage.setItem('authorize', loginObj)
  } catch (err) {}
}

export default loginParams
