let errorCode = new Map()

errorCode.set(0, 'errorCode_success') // 成功
errorCode.set(1, 'errorCode_failed') // 失败
errorCode.set(100, 'errorCode_cannotConnectServer') // 不能连接到服务器
errorCode.set(101, 'errorCode_authFailed') // 身份验证失败
errorCode.set(102, 'errorCode_serverOverloaded') // 服务器已过载
errorCode.set(103, 'errorCode_roomsFull') // 会议室人数已满
errorCode.set(104, 'errorCode_roomNotExist') // 会议室不存在
errorCode.set(105, 'errorCode_userExist') // 会议室用户已存在
errorCode.set(106, 'errorCode_networkDisconnected') // 会议室网络连接断开
errorCode.set(107, 'errorCode_loggedOffsite') // 用户已在异地登录 先前登录的用户收到该消息
errorCode.set(108, 'errorCode_roomClosed') // 会议室已关闭
errorCode.set(109, 'errorCode_roomNotOpen') // 会议室未开启
errorCode.set(110, 'errorCode_roomExpired') // 会议室已过期
errorCode.set(111, 'errorCode_authTimeout') // 身份认证超时
errorCode.set(112, 'errorCode_roomTimeout') // 进入会议室超时
errorCode.set(113, 'errorCode_networkTimeout') // 网络连接超时
errorCode.set(114, 'errorCode_roomDisabled') // 会议室已被禁用
errorCode.set(115, 'errorCode_unauthorizedUser') // 会议室未授权用户
errorCode.set(116, 'errorCode_notAdmin') // 用户非会议室管理员
errorCode.set(900, 'errorCode_serverExceptionError') // 服务器异常错误

export default errorCode
