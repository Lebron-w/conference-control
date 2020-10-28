<template>
  <div>
    <div class="board-wrap">
      <div class="board-top">
        <span>{{ $t('m.board_switchLayout') }}</span>
        <span class="board-span" @click="redirectToLayout()">{{ $t('m.board_btn_setting') }}</span>
      </div>
    </div>
    <div class="board-main">
      <el-scrollbar style="height: 100%;">
      <div class="board-caption">{{ $t('m.board_roomLayout') }}</div>
      <div class="board-content">
        <span @click="redirectToMainScreenLayout()">{{ !$store.state.ws.roomLayoutName ? $t('m.board_adjust_dataload') : $t(`m.${$store.state.ws.roomLayoutName}`) }}</span>
      </div>
      <div class="board-caption">{{ $t('m.board_adjustLayout') }}</div>
      <div v-if="remoteAdjustmentNum <= 0" class="board-content">
        {{$t('m.board_adjust_noRecord')}}
      </div>
      <div v-if="remoteAdjustmentNum > 0" class="board-content-two">
        <layoutuser v-for="user in $store.state.ws.recentControlLayoutAtts" :user-id="user" :key="user.userID"></layoutuser>
      </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import common from '../../assets/common-icon'
import layoutuser from './layout-user'
export default {
  components: {
    common,
    layoutuser
  },
  data () {
    return {
      common,
      remoteAdjustmentNum: this.$store.state.ws.recentControlLayoutAtts.length
    }
  },
  methods: {
    redirectToLayout () {
      let roomId = this.$store.state.ws.lastestLayoutControler
      if (roomId === 0) {
        // 跳转主屏布局控制页面
        this.$router.push('/home/layout/')
      } else {
        // 跳转最近用户布局控制页面
        this.$router.push('/home/layout/' + roomId)
      }
    },
    redirectToMainScreenLayout () {
      // 跳转主屏布局控制页面
      this.$router.push('/home/layout/')
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
      cursor: pointer;
    }
  }
};

.board-main{
  width: 100%;
  margin-top:  0px;
  height: calc(100% - 40px);
};

.board-caption{
  width: calc(100% -30px);
  margin-left: 30px;
  font: {
    size: 12px;
    weight:bold;
  };
  color:#ACC1D8;
  padding-top: 4%;
  &:nth-of-type(1){
     padding-top: 6%;
  }
};

.board-content{
  width: calc(100% -30px);
  height: 22px;
  margin-left: 30px;
  font: {
    size: 12px;
  };
  color:#FFF;
  padding-top: 2.5%;
  span{
    height: 100%;
    padding-left: 14px;
    padding-right: 14px;
    line-height: 24px;
    background-color: #3c81ce;
    border-radius: 12px;
    display: inline-block;
    cursor: pointer;
  }
};
.board-content-two{
  width: calc(100% -30px);
  margin-left: 30px;
  .board-layout-user{
    padding-top: 3.5%;
  }
}
</style>
