<template>
  <div class="warp">
    <div class="tips-bkg">
      <div>
        <div class="col-text warn-text">
          <img src="../../../static/images/login/icon-warn.png" alt="">
          <span>{{ $t('m.abnormal_msg_loginRoomFailure') }}</span>
        </div>
        <div class="col-text fail-reason">{{ $t('m.abnormal_msg_failureReason') }}{{ $props.errorReason }}</div>
        <div class="col-text fail-btns">{{ $t('m.abnormal_msg_try') }}<span class="btn" @click="reload">{{ $t('m.common_btn_refresh') }}</span>{{ $t('m.abnormal_msg_or') }}<span class="btn" @click="exit">{{ $t('m.abnormal_msg_exit') }}</span></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    errorReason: {
      default: ''
    }
  },
  data () {
    return {}
  },
  methods: {
    reload () {
      window.location.reload()
    },
    exit () {
      window.close()
    }
  }
}
</script>
<style lang="scss" scoped>
.warp {
  width: 100%;
  height: inherit;
  .tips-bkg {
    color: #fff;
    width: 556px;
    height: 230px;
    background: url('../../../static/images/login/abdanbg.png');
    background-size: cover;
    margin: calc(25% - 115px) auto;
    line-height: 0;
    div.col-text {
      margin-left: 110px;
    }
    .warn-text {
      font-size: 30px;
      font-weight: bold;
      color: #FF5B2F;
      padding-top: 48px;
    }
    .fail-reason {
      font-size: 20px;
      margin-top: 44px;
    }
    .fail-btns {
      font-size: 20px;
      margin-top: 40px;
      .btn {
        display: inline-block;
        line-height: 30px;
        width: 80px;
        height: 30px;
        text-align: center;
        border-radius: 4px;
        background-color: #3D5269;
        margin-left: 10px;
        margin-right: 10px;
        &:hover {
        background-color: #3C81CE;
        }
      }
    }
  }
}
</style>
