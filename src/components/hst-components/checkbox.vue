<template>
  <div class="board-content">
    <input type="button" :class="{'tab_active': $props.value}"  @click="$emit('input', !$props.value)">
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  watch: {
    '$props.value' (val) {
      this.$emit('change', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.board-content {
  width: 16px;
  height: 16px;
  display: inline-block;
}
input{
  width: 16px;
  height: inherit;
  border: 0px;
  outline:none;
  vertical-align:middle;
  border: 1px solid #3C81CE;
  border-radius: 3px;
  background: url('../../assets/common-icon/checkbox.png') no-repeat;
  background-size: cover;
  &.tab_active {
    background: url('../../assets/common-icon/checkbox_focus.png') no-repeat;
    background-size: cover;
  }
  &:hover{
    box-shadow: 0px 0px 2px 2px rgb(74, 121, 175);
    cursor: pointer;
  }
}
</style>
