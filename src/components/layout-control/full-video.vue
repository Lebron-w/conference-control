<template>
  <span>
    <el-switch v-model="isFullVideoArea" active-text="" inactive-text="" :disabled="!$store.state.ws.isEditing"></el-switch>&nbsp;{{ $t('m.layout_fullScreen_video') }}
  </span>
</template>
<script>
export default {
  props: ['screenId'],
  data () {
    return {}
  },
  computed: {
    isFullVideoArea: {
      set (val) {
        this.$store.commit('ws/fullVideoArea', [this.$props.screenId, val])
      },
      get () {
        return this.$store.state.ws.snapshot[this.$props.screenId].FullArea.ID.indexOf(2) > -1
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
