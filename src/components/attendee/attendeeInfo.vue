<template>
  <div class="modal-dialog">
    <div class="modal-header">
        <span class="modal-title">{{ $t('m.personal_info') }}</span>
        <span class="modal-close" @click="$emit('close-attendeeinfo')">&times;</span>
    </div>
    <div class="modal-body">
      <div class="profile_photo">
        <div><img src="../../../static/images/attendee/profile_photo.png" alt=""></div>
        <div class="name"><label v-text="usersMap.get(userId).Name"></label></div>
      </div>
      <div class="attendee-info">
        <div>
          <span class="form-left">{{ $t('m.personal_displayName') }}</span>
          <span><input type="text" v-model="usersMap.get(userId).DisplayName" class="input-displayname" maxlength="20"></span>
          <span>{{ $t('m.personal_sex') }}</span>
          <span>
            <select v-model="usersMap.get(userId).Sex" class="sex">
              <option value="0">{{ $t('m.personal_male') }}</option>
              <option value="1">{{ $t('m.personal_female') }}</option>
            </select>
          </span>
        </div>
        <div>
          <span class="form-left">{{ $t('m.personal_tel') }}</span>
          <span><input type="text" v-model="usersMap.get(userId).Tel" class="input-other" maxlength="20"></span>
        </div>
        <div>
          <span class="form-left">{{ $t('m.personal_mobile') }}</span>
          <span><input type="text" v-model="usersMap.get(userId).Mobile" class="input-other" maxlength="20"></span>
        </div>
        <div>
          <span class="form-left">{{ $t('m.personal_email') }}</span>
          <span colspan="3"><input type="text" v-model="usersMap.get(userId).EMail" class="input-other" maxlength="32"></span>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <span @click="setAttendeeInfo" class="confirm">{{ $t('m.common_btn_save') }}</span>
      <span @click="$emit('close-attendeeinfo')" class="close">{{ $t('m.common_btn_cancel') }}</span>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    userId: {
      type: Number
    }
  },
  computed: {
    ...mapState({usersMap: state => state.ws.attendeeUserMap})
  },
  methods: {
    setAttendeeInfo () {
      if (this.usersMap.get(this.userId).DisplayName === '') {
        this.$message({
          type: 'warning',
          message: this.$t('m.personal_msg_displayNameNull')
        })
        return
      }
      var reg = /^[\d-]{1,}$/
      if (this.usersMap.get(this.userId).Tel !== '' && !reg.test(this.usersMap.get(this.userId).Tel)) {
        this.$message({
          type: 'warning',
          message: this.$t('m.personal_msg_telError')
        })
        return
      }
      reg = /^[0-9]{1,}$/
      if (this.usersMap.get(this.userId).Mobile !== '' && !reg.test(this.usersMap.get(this.userId).Mobile)) {
        this.$message({
          type: 'warning',
          message: this.$t('m.personal_msg_mobileError')
        })
        return
      }
      reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
      if (this.usersMap.get(this.userId).EMail !== '' && !reg.test(this.usersMap.get(this.userId).EMail)) {
        this.$message({
          type: 'warning',
          message: this.$t('m.personal_msg_emailError')
        })
        return
      }

      let msg = {
        'CmdID': 1003,
        'Data': {
          'UserID': this.userId,
          'Info': {
            'DisplayName': this.usersMap.get(this.userId).DisplayName,
            'Tel': this.usersMap.get(this.userId).Tel,
            'Mobile': this.usersMap.get(this.userId).Mobile,
            'EMail': this.usersMap.get(this.userId).EMail,
            'Sex': parseInt(this.usersMap.get(this.userId).Sex)
          }
        }
      }
      this.$ws.send(msg)
      this.$emit('close-attendeeinfo')
    }
  }
}
</script>
<style lang="scss" scoped>
div.modal-dialog{
  width: 420px;
  height: 422px;
  position: fixed;
  top: calc(50% - 210px);
  left: calc(50% - 210px);
  z-index: 5000;
  background-color: #ffffff;
  border-radius: 5px;
  color: #323232;
  font-size: 12px;

  .modal-header {
    height: 48px;
    border-bottom: 1px solid #EAECEE;
    font-size: 16px;
    line-height: 48px;
    box-sizing: border-box;
    .modal-title {
      display: inline-block;
      width: calc(100% - 32px);
      text-indent: 20px;
    }
    .modal-close {
      width: 26px;
      font-size: 22px;
    }
  }

  .modal-body {
    .profile_photo{
      text-align: center;
      padding-top: 20px;
      padding-bottom: 18px;
      .name{
        font-size: 16px;
      }
    }
    .attendee-info{
      .sex {
        margin-left: 8px;
        width: 66px;
        height: 30px;
        border: 1px solid #DFE3E7;
        padding-left: 8px;
      }
      .form-left{
        display: inline-block;
        width: 23.2%;
        text-align: right;
      }
    }
  }

  .modal-footer {
    margin-top: 30px;
    font-size: 14px;
    text-align: center;
    .confirm {
      background-color: #2997DA;
      color: #ffffff;
      border-radius: 2px;
      padding: 5px 35px;
      margin-right: 20px;
    }
    .close {
      background-color: #ffffff;
      border: 1px solid #D4DBE3;
      border-radius: 2px;
      padding: 5px 35px;
    }
  }
}
.input-displayname {
  width: 140px;
  margin-right: 15px;
}
.input-other {
  width: 260px;
  margin-top: 10px;
}
input{
  height: 30px;
  border: 1px solid #DFE3E7;
  margin-left: 10px;
  padding-left: 8px;
  box-sizing: border-box;
}
</style>
