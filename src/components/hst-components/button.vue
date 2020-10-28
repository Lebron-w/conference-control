<template>
  <span class="hst-btn btn-disabled" ref="hstButton" @click="notAllowed" v-if="$props.disabled">
    <slot></slot>
  </span>
  <span class="hst-btn"  ref="hstButton" @click="$emit('click')" v-else>
    <slot></slot>
  </span>
</template>
<script>
export default {
  props: ['disabled'],
  data () {
    return {
      notAllowedL: false
    }
  },
  methods: {
    notAllowed () {
      return false
    }
  }
}
</script>
<style lang="scss" scoped>
.hst-btn {
  display: inline-block;
  width: 64px;
  height: 30px;
  border-radius: 4px;
  text-align: center;
  line-height: 30px;
  background-color: #3D5269;
  color: #8B97A5;
  cursor: pointer;
  &:hover, &.is-active {
    background-color: #3C81CE;
    color: #fff;
  }
}
.btn-disabled {
  // cursor: not-allowed;
  &, &:hover {
    // color: #8B97A5;
    // background-color: #3D5269;
    // border: #3D5269 0px solid;
    cursor: default;
  }
}
</style>
