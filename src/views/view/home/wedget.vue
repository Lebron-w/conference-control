<template>
  <div class="layout-box">
    <keep-alive v-for="board in dashboardList" :key="board.type">
      <component class="board-box" :is="board.type"></component>
    </keep-alive>
  </div>
</template>
<script>

import roominfo from '../../../components/dashboard/roominfo-board'
import layoutinfo from '../../../components/dashboard/layout-board'
import roomright from '../../../components/dashboard/roomright-board'
export default {
  components: {
    roominfo,
    layoutinfo,
    roomright
  },
  data () {
    return {
      dashboardList: []
    }
  },
  created () {
    this.dashboardList = this.$config.DASHBOARD_CONFIG
  }
}
</script>
<style lang="scss" scoped>
.layout-box{
   box-sizing: border-box;
   display: flex;
   flex-flow: row wrap;
   align-content: flex-start;
   height: inherit;
}
.board-box{
  box-sizing: border-box;
  width: calc((100% - 21px) / 3);
  height:calc((100% - 30px) / 2);
  margin-left: calc((19px) /2);
  margin-top: 10px;
  border: 1px solid;
  border-color:#3d5269;
  background-color: #3d5269;
  &:nth-of-type(3n+1){
     margin-left: 0px;
  }
}
</style>
