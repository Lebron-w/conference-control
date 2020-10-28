<template>
  <hst-select class=""
    v-model="selectValue"
    :select-key="$props.screenIndex"
    :background-color="'#2F4256'"
    @change="changeLayout"
    :disabled="!$store.state.ws.isEditing"
    :options="layoutsArr"
    :option-label ="'layoutName'"
    :option-key="'layoutName'"
    :selected="$props.selected">
  </hst-select>
</template>
<script>
import hstSelect from '@/components/hst-components/select'
/* eslint-disable no-undef */
import allLayouts from './screen/layout'
import { mapState } from 'vuex'

export default {
  props: ['screenIndex', 'selected'],
  components: {
    hstSelect
  },
  data () {
    return {
      layoutsArr: [],
      selectValue: ''
    }
  },
  computed: {
    ...mapState({
      snapshot: state => state.ws.snapshot
    }),
    userId () {
      return this.$route.params.name ? parseInt(this.$route.params.name) : 0
    }
  },
  created () {
    this.layoutsArr = allLayouts.toArray()
    if (this.$props.screenIndex > 0) {
      this.layoutsArr = this.layoutsArr.slice(2)
    }
  },
  methods: {
    // 布局切换
    changeLayout (index, val) {
      this.$store.commit('ws/layoutReduction', [index, val])
    },
    exceedWarnTip () {
      if (this.$store.state.ws.isEditing) {
        let splitNum = 0
        for (let screenItem of this.snapshot) {
          splitNum += screenItem.DataArea[1].UserData
        }
        if (splitNum > 64) {
          this.$message({
            type: 'warning',
            message: this.$t('m.layout_msg_notRecommended')
          })
        }
      }
    }
  },
  watch: {
    userId: {
      handler (userId) {
        // 计算当前布局
        this.selectValue = this.getScreenLayout(this.snapshot[this.$props.screenIndex]).layoutName
      }
    },
    snapshot: {
      deep: true,
      handler (list) {
        this.selectValue = this.getScreenLayout(list[this.$props.screenIndex]).layoutName
      }
    },
    selectValue () {
      this.exceedWarnTip()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
