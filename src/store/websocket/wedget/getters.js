export default {
  // getDefaultRoomInfo (state) {
  //   return state.defaultRoomInfo.inviteList ? state.defaultRoomInfo :
  //     {
  //       "ifChairPwd": 0,
  //       "ifRoomPwd": 1,
  //       "inviteList": [{
  //         "expires": 1535100833000,
  //         "expiresDay": 7,
  //         "inviteCode": '',
  //         "roomId": 10000,
  //         "userRight": 2
  //       }],
  //       "maxUserCount": 30,
  //       "roomId": 10000,
  //       "roomName": "TESTA",
  //       "userId": 10002,
  //       "userRight": "3",
  //       "verifyMode": 2
  //     }
  // },
  getInviteCode (state) {
    return state.defaultRoomInfo.inviteList ? state.defaultRoomInfo.inviteList[0].inviteCode : ''
  }
}
