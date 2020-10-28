<template>
  <span class="hst-switch">
    <span class="weui-switch" :class="{'weui-switch-on .weui-switch-left' : me_checked, 'switch-hover': switchMouserOver}" :value="value"></span>
    <span class="text left-text" @click="toggleLeft" @mouseover="switchMouserOver = true" @mouseleave="switchMouserOver = false">实时预览</span>
    <span class="text right-text" @click="toggleRight" @mouseover="switchMouserOver = true" @mouseleave="switchMouserOver = false">编辑布局</span>
  </span>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      me_checked: this.value,
      switchMouserOver: false
    }
  },
  watch: {
    me_checked (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    toggle () {
      this.me_checked = !this.me_checked
    },
    toggleLeft () {
      this.me_checked = false
    },
    toggleRight () {
      this.me_checked = true
    }
  }
}
</script>

<style lang="scss" scoped>
.weui-switch {
  display: inline-block;
  position: relative;
  width: 100%;
  height: 30px;
  outline: 0;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: #3D5269;
  transition: background-color 0.2s, border 0.1s;
  cursor: pointer;
}
.weui-switch:before {
  content: " ";
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 30px;
  border-radius: 5px 0 0 5px;
  background-color: #3D5269;
  transition: transform 0.1s cubic-bezier(0.45, 1, 0.4, 1);
}
.weui-switch:after {
  content: " ";
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 30px;
  border-radius: 0 5px 5px 0;
  background-color: #3C81CE;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  transition: transform 0.1s cubic-bezier(0.4, 0.4, 0.25, 1.35);
}
.weui-switch:not(.weui-switch-on):after {
  content: " ";
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 30px;
  border-radius: 5px 0 0 5px;
  background-color: #3C81CE;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  transition: transform 0.1s cubic-bezier(0.4, 0.4, 0.25, 1.35);
}
.switch-hover:after, .switch-hover:not(.weui-switch-on):after {
  background-color: #4289D9;
}
.weui-switch-on:after {
  transform: translateX(100%);
}

.hst-switch {
  width: inherit;
  position: relative;
  .text {
    color: #fff;
    line-height: 30px;
    position: absolute;
    width: 50%;
    top: -15px;
    cursor: pointer;
  }
  .left-text {
    left: calc(25% - 28px);
  }
  .right-text {
    right: calc(-25% + 28px);
  }
}
</style>
