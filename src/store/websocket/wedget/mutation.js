export default{
  saveRoomInfo (state, msg) {
    state.roomInfo = msg.Data.RoomInfo
    state.conferenceController = msg.Data.UserInfo
  },
  saveMsg1507 (state, data) {
    state.defaultRoomInfo = data.roomInfo
  },
  enableMarkWB (state, status) {
    state.whiteBoardMarkState = status
  }
}
