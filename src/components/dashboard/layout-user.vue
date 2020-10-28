<template>
  <div class="board-layout-user">
    <div class="board-content-wrap" @click="changeRouter(layoutuser)">
      <div class="board-content-img">
        <img :src="common.layoutIcon">
      </div>
      <span :title="$store.state.ws.attendeeUserMap.get(layoutuser).DisplayName">{{ formatUserName($store.state.ws.attendeeUserMap.get(layoutuser).DisplayName,32).name }}</span>
    </div>
  </div>
</template>
<script>
import common from '../../assets/common-icon'
export default {
  props: ['userId'],
  data () {
    return {
      common
    }
  },
  computed: {
    layoutuser () {
      return this.$props.userId
    }
  },
  methods: {
    changeRouter (user) {
      // 跳转布局控制对应模块
      this.$router.push('/home/layout/' + user)
    }
  }
}
</script>
<style lang="scss" scoped>
.board-layout-user {
  width: 100%;
  .board-content-wrap {
    width: auto;
    height: 100%;
    display: inline-block;
    background-color: #3c81ce;
    border-radius: 12px;
    &:hover{
      cursor: pointer;
    }
  }
  .board-content-img {
    width: 20px;
    height: 100%;
    padding-left: 2px;
    display: inline-block;
    img {
      vertical-align: middle;
    }
  }
  span {
    width: auto;
    height: 100%;
    padding-left: 8px;
    padding-right: 10px;
    display: inline-block;
    font: {
      size: 12px;
    }
    color: #fff;
    line-height: 24px;
  }
}
</style>
