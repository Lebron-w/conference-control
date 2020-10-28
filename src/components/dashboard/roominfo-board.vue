<template>
  <div v-loading="loadOptions.states" :element-loading-text="loadOptions.text" element-loading-background="rgba(0, 0, 0, 0.7)"  element-loading-spinner="el-icon-loading">
    <div class="board-wrap">
      <div class="board-top">
        <span>{{ $t('m.board_roominfo') }}</span>
        <!-- <span class="board-span">{{ $t('m.board_btn_setting') }}</span> -->
        <input type="button" class="board-refresh" @click="updateRoomInfo()">
      </div>
    </div>
    <div class="board-main">
      <el-scrollbar style="height: 100%;">
      <div class="board-caption">{{ $t('m.board_roomName') }}</div>
      <div class="board-content">{{ $store.state.ws.defaultRoomInfo.roomName}}&nbsp;</div>
      <div class="board-caption">{{ $t('m.board_roomId') }}</div>
      <div class="board-content">{{ $store.state.ws.defaultRoomInfo.roomId}}&nbsp;</div>
      <div class="board-caption">{{ $t('m.board_maxOnlineUsers') }}</div>
      <div class="board-content">{{ $store.state.ws.defaultRoomInfo.maxUserCount}}&nbsp;</div>
      <div class="board-caption">{{ $t('m.board_attendInviteCode') }}</div>
      <div class="board-content-three">
          <input type="text" v-model="$store.getters['ws/getInviteCode']" readonly="readonly">
          <span v-clipboard:copy="attendInviteCode" v-clipboard:success="onCopy">{{ $t('m.board_copyInviteCode') }}</span>
      </div>
      <!-- <div class="board-caption">{{ $t('m.board_room_visiturl') }}</div>
      <div class="board-content-two">
          <input type="text" value="https://live.haoshitong.com/...">
          <span>{{ $t('m.board_btn_copyurl') }}</span>
      </div> -->
      <!-- <div class="board-button">
          <span @click="updateRoomInfo()">{{ $t('m.board_btn_fresh') }}</span>
      </div> -->
      <div v-if="showMessageState" class="board-tips">
        <span>{{ $t('m.board_copyInviteCode_success') }}</span>
      </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
export default {
  created () {
    // 仪表盘加载时，默认请求会议室信息
    let req = {
      'CmdID': 1015,
      'Data': {}
    }
    this.$ws.send(req)
  },
  data () {
    return {
      // 加载样式配置
      loadOptions: {
        text: this.$t('m.board_load_getRoominfo'),
        states: false
      },
      // 显示复制邀请码提示
      showMessageState: false
    }
  },
  computed: {
    attendInviteCode () {
      let message = this.$t('m.board_attendInviteCode')
      let inviteCodeMsg = message + ': ' + this.$store.getters['ws/getInviteCode']
      return inviteCodeMsg
    }
  },
  methods: {
    // 更新会议室数据
    updateRoomInfo () {
      // 开启遮罩层,清空数据
      this.loadOptions.states = true
      this.$store.state.ws.defaultRoomInfo = {}
      // 请求会议室数据
      let req = {
        'CmdID': 1015,
        'Data': {}
      }
      this.$ws.send(req)
      // 1秒后关闭遮罩层
      setTimeout(() => {
        this.loadOptions.states = false
      }, 1000)
    },
    // 复制邀请码copy事件
    onCopy: function (e) {
      // 提示复制成功
      this.showMessageState = true
      // 0.5秒后关闭提示
      setTimeout(() => {
        this.showMessageState = false
      }, 500)
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
  width: calc(100% - 10px);
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
  align-items:center;
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
  .board-refresh{
    width: 24px;
    height: 20px;
    display: inline-block;
    border: 0px;
    outline:none;
    background: url('../../assets/common-icon/refresh.png');
    &:hover{
      background: url('../../assets/common-icon/refresh_focus.png') no-repeat;
      cursor: pointer;
    }
  }
};

.board-main{
  width: 100%;
  margin-top:  0px;
  height: calc(100% - 40px);
  position: relative;
};

.board-caption{
  width: calc(100% - 30px);
  margin-left: 30px;
  font: {
    size: 12px;
    weight:bold;
  };
  color:#ACC1D8;
  // line-height: 38px;
  // padding-top: 17px
  padding-top: 6.5%;
  &:nth-of-type(1){
     padding-top: 6%;
  }
};

.board-content{
  width: calc(100% - 30px);
  margin-left: 30px;
  font: {
    size: 12px;
  };
  color:#FFF;
  padding-top: 2.5%;
};

.board-content-two{
  width: 100%;
  height: 30px;
  margin-left: 30px;
  input{
    width:calc(100% - 130px);
    height: 100%;
    border: 0px;
    outline:none;
    font-size: 14px;
    color:#ACC1D8;
    background-color: #3d5269;
    border-radius: 5px;
  };
  span{
    width: 90px;
    height: inherit;
    display:inline-block;
    background-color: #3c81ce;
    border-radius: 5px;
    text-align: center;
    line-height: 30px;
    margin-left: 10px;
    font-size: 12px;
    color:#FFF;
  };
  padding-top: 3%;
}

.board-content-three{
  width: 100%;
  height: 30px;
  margin-left: 30px;
  input{
    width:94px;
    height: 100%;
    border: 0px;
    outline:none;
    font-size: 14px;
    color:#15c086;
    background-color: #2f4256;
    border-radius: 5px;
    padding-left: 10px;
  };
  span{
    width: 90px;
    height: inherit;
    display:inline-block;
    background-color: #3c81ce;
    border-radius: 5px;
    text-align: center;
    line-height: 30px;
    margin-left: 10px;
    font-size: 12px;
    color:#FFF;
    cursor: pointer;
    &:hover{
      background-color: #4289d9;
    }
    &:active{
      background-color: #3c81ce;
    }
  };
  padding-top: 2.5%;
}

.board-button{
  width: 100%;
  height: 30px;
  span{
    width: 90px;
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
  padding-top: 1%;
  text-align: center;
  cursor: pointer;
};

.board-tips{
  z-index: 1005;
  position: absolute;
  width: 150px;
  height: 50px;
  line-height: 50px;
  top: calc((100% - 50px)/2);
  left: calc((100% - 150px)/2);
  text-align: center;
  background-color: #314254;
  border-radius: 4px;
  color: #FFF;
  font-size: 12px;
}
</style>
