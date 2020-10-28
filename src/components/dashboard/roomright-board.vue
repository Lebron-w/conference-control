<template>
  <div>
    <div class="board-wrap">
      <div class="board-top">
        <span>{{ $t('m.board_roomRight') }}</span>
        <!-- <span class="board-span">{{ $t('m.board_btn_setting') }}</span> -->
      </div>
    </div>
    <div class="board-main">
    <el-scrollbar style="height: 100%;">
    <div class="board-main-content">
      <div class="board-caption">{{ $t('m.board_chat') }}</div>
      <div class="board-content-wrap">
        <div class="board-content">
          <input type="button" class="board-check" :class="{'tab_active': $store.state.ws.roomInfo.EnablePubChat === 1}"  @click="changeRoomRight('EnablePubChat',$store.state.ws.roomInfo.EnablePubChat === 1 ?0:1)">
          <span>{{ $t('m.board_pubChat') }}</span>
        </div>
        <div class="board-content">
          <input type="button" class="board-check" :class="{'tab_active': $store.state.ws.roomInfo.EnableP2PChat === 1}"  @click="changeRoomRight('EnableP2PChat',$store.state.ws.roomInfo.EnableP2PChat === 1 ?0:1)">
          <span>{{ $t('m.board_p2pChat') }}</span>
        </div>
      </div>
      <div class="board-caption">{{ $t('m.board_whiteBoard') }}</div>
      <div class="board-content-wrap">
        <div class="board-content">
          <input type="button" class="board-check"  :class="{'tab_active': ($store.getters['ws/enableMarkWhiteBoardUsers'].length === $store.getters['ws/allUsers'].length) && $store.getters['ws/enableMarkWhiteBoardUsers'].length > 0}" @click="enableMarkWhiteBoard()">
          <span>{{ $t('m.board_markWhiteBoard') }}</span>
        </div>
        <div class="board-content">
          <input type="button" class="board-check" :class="{'tab_active': $store.state.ws.roomInfo.EnableSaveWB === 1}"  @click="changeRoomRight('EnableSaveWB',$store.state.ws.roomInfo.EnableSaveWB === 1 ?0:1)">
          <span>{{ $t('m.board_savaWhiteBoard') }}</span>
        </div>
      </div>
      <div class="board-caption">{{ $t('m.board_record') }}</div>
      <div class="board-content-wrap">
        <div class="board-content">
         <input type="button" class="board-check" :class="{'tab_active': $store.state.ws.roomInfo.EnableRecord === 1}"  @click="changeRoomRight('EnableRecord',$store.state.ws.roomInfo.EnableRecord === 1 ?0:1)">
          <span>{{ $t('m.board_enableRecord') }}</span>
        </div>
      </div>
      <div class="board-caption">{{ $t('m.board_file') }}</div>
      <div class="board-content-wrap">
        <div class="board-content">
         <input type="button" class="board-check" :class="{'tab_active': $store.state.ws.roomInfo.EnableSendFile === 1}"  @click="changeRoomRight('EnableSendFile',$store.state.ws.roomInfo.EnableSendFile === 1 ?0:1)">
          <span>{{ $t('m.board_enableSendFile') }}</span>
        </div>
      </div>
      <div class="board-caption">{{ $t('m.board_view') }}</div>
      <div class="board-content-wrap">
        <div class="board-content">
         <input type="button" class="board-check" :class="{'tab_active': $store.state.ws.roomInfo.EnableKeepVideo === 1}"  @click="changeRoomRight('EnableKeepVideo',$store.state.ws.roomInfo.EnableKeepVideo === 1 ?0:1)">
          <span>{{ $t('m.board_enableKeepVideo') }}</span>
        </div>
      </div>
    </div>
    </el-scrollbar>
    <!--恢复默认设置按钮-->
    <!-- <div class="board-button-wrap">
        <div class="board-button">
          <span>{{ $t('m.board_btn_resetDefault') }}</span>
        </div>
    </div> -->
    <!-- <div class="board-button">
        <span>{{ $t('m.board_btn_saveAndUpdate') }}</span>
        <span class="board-refresh">{{ $t('m.board_btn_fresh') }}</span>
    </div> -->
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  mounted () {
    document.getElementsByClassName('is-horizontal')[0].style.display = 'none'
  },
  methods: {
    // 修改会议室权限信息
    changeRoomRight (attr, status) {
      let room = {
        'CmdID': 1002,
        'Data': {}
      }
      this.$set(room.Data, attr, status)
      this.$ws.send(room)
    },
    // 是否允许所有人标注白板
    enableMarkWhiteBoard () {
      let status = (this.$store.getters['ws/enableMarkWhiteBoardUsers'].length === this.$store.getters['ws/allUsers'].length) && this.$store.getters['ws/enableMarkWhiteBoardUsers'].length > 0 ? 0 : 2
      let userlist = this.$store.state.ws.attendeeUserId
      userlist.forEach(user => {
        let userInfo = {
          'CmdID': 1003,
          'Data': {}
        }
        // 被改变状态的用户ID
        this.$set(userInfo.Data, 'UserID', user)
        // 白板标注权限 0 不能标注 2 允许标注
        this.$set(userInfo.Data, 'WBMarkState', status)
        this.$ws.send(userInfo)
      })
      // 兼容PC V3.15及之前的客户端,向会控用户发送标注白板状态 --start
      let coferenceController = {
        'CmdID': 1003,
        'Data': {}
      }
      this.$set(coferenceController.Data, 'UserID', this.$store.state.ws.conferenceController.UserID)
      this.$set(coferenceController.Data, 'WBMarkState', status)
      this.$ws.send(coferenceController)
      // 兼容PC V3.15及之前的客户端,向会控用户发送标注白板状态 --end
      // 修改store允许标注白板状态
      this.$store.commit('ws/enableMarkWB', status)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../style/_scrollbar.scss';
.board-wrap{
  height: 40px;
  width: 100%;
  background-color:#2F4256;
}
.board-top{
  height: 100%;
  width: calc(100% - 14px);
  font: {
    size: 14px;
    weight: bold;
  };
  color: #FFF;
  line-height: 40px;
  /*span{
    display: inline-block;
  };
   text-align: justify;*/
  display: flex;
  flex-flow: row wrap;
  justify-content:space-between;
  span {
    display: inline-block;
    &:first-child{
      text-indent: 14px;
    }
    &.board-span {
      flex: 0 0 1;
      font: {
        size: 12px;
        weight:normal;
      };
      color: #278AF9;
    }
  }
};

.board-main{
  width: 100%;
  margin-top:  0px;
  height: calc(100% - 40px);
};

.board-caption{
  width: calc(100% - 30px);
  margin-left: 30px;
  font: {
    size: 12px;
    weight:bold;
  };
  color:#ACC1D8;
  padding-top: 5.5%;
  &:nth-of-type(1){
    padding-top: 6%;
  }
};

.board-content-wrap{
  width: calc(100% - 30px);
  margin-left: 30px;
  &:last-child {
    padding-bottom: 30px;
  }
}
.board-content{
  height: 16px;
  padding-top: 2.9%;
  font: {
    size: 12px;
  };
  color:#FFF;
  span{
    display: inline-block;
    padding-left: 1.2%;
  };
  input{
    width: 16px;
    height: inherit;
    border: 0px;
    outline:none;
    vertical-align:middle;
    background: url('../../assets/common-icon/checkbox.png');
    &.tab_active {
      background: url('../../assets/common-icon/checkbox_focus.png') no-repeat;
    }
    &:hover{
      box-shadow: 0px 0px 2px 2px rgb(74, 121, 175);
      cursor: pointer;
    }
  };
};

.board-button{
  width: 100%;
  height: 30px;
  span{
    width: 100px;
    height: inherit;
    display:inline-block;
    background-color: #4d647c;
    border-radius: 4px;
    text-align: center;
    line-height: 30px;
    font-size: 12px;
    color:#FFF;
    &:hover {
      background-color: #4289D9;
    }
  };
  padding-top: 6.5%;
  text-align: center;
  cursor: pointer;
};

.board-main-content{
  width: 100%;
  height: 100%;
};

.board-button-wrap{
  width: 100%;
  height: 23.2%;
}

</style>
