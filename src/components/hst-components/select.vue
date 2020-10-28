<template>
  <div class="select-warp clearfix" @mouseleave="isFold = true">
    <div class="select-value" :class="{'is-not-fold': isFold, 'disabled': $props.disabled}" :style="$props.backgroundColor ? {'background-color': $props.backgroundColor} : ''" @click="openOption">
      <span class="select-value-text"
        v-if="!$props.optionKey"
        :title="__strBytes($props.value) > 12 ? $props.value : ''"
        >{{ $props.value === '' ? $props.placeholder : $props.value }}</span>
      <span class="select-value-text"
        :title="__strBytes($t('m.' + $props.value)) > 12 ? $t('m.' + $props.value) : ''"
        v-else>{{ $t('m.' + $props.value) }}</span>
      <span class="select-icon">
        <img :src="menuIcon.arrow" alt="" v-if="isFold">
        <img :src="menuIcon.arrowPressed" alt="" v-else>
      </span>
    </div>
    <ul class="option-list" :class="{'is-not-fold': !isFold}" v-if="!isFold">
      <li class="select-option"
        :class="{'selected-option': $props.value === ($props.optionKey ? item[$props.optionKey] : item.value)}"
        v-for="(item, $index) in $props.options"
        :key="$index"
        @click="chooseOpt($props.optionKey ? item[$props.optionKey] : item.value)"
        :title="__strBytes($props.optionLabel ? $t('m.' + item[$props.optionLabel]) : item.label) > 14 ? ($props.optionLabel ? $t('m.' + item[$props.optionLabel]) : item.label) : ''"
        >{{ $props.optionLabel ? $t('m.' + item[$props.optionLabel]) : item.label }}</li>
    </ul>
  </div>
</template>
<script>
import menuIcon from '../../assets/menu-icon'
/**
 * select 组件
 * @param {value}
 * @param {placeholder}
 * @param {disabled}
 * @param {options} 数组
 * @param {backgroundColor} 定制参数
 * @param {optionKey} 指定的键作为key
 * @param {optionLabel} 指定的键作为label
 * @param {selected} 默认选中
 * @param {selectKey} 区分其它select的唯一标识
 */
export default {
  props: {
    value: {
      default: () => ''
    },
    placeholder: {
      default: () => ''
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    options: {
      type: Array,
      default: () => []
    },
    backgroundColor: {
      type: String,
      default: () => ''
    },
    optionKey: {
      type: String,
      defalut: () => ''
    },
    optionLabel: {
      type: String,
      defalut: () => ''
    },
    selected: {
      defalut: () => ''
    },
    selectKey: {
      defalut: () => ''
    }
  },
  data () {
    return {
      menuIcon,
      isFold: true
    }
  },
  created () {
    if ((this.$props.selected + '')) {
      this.$emit('input', this.$props.selected)
    }
  },
  methods: {
    openOption () {
      if (this.$props.disabled) {
        this.isFold = true
      } else {
        this.isFold = !this.isFold
      }
    },
    chooseOpt (option) {
      this.$emit('input', option)
      this.$emit('change', this.$props.selectKey, option)
      this.isFold = true
    }
  },
  watch: {
    /* eslint-disable no-useless-computed-key */
    ['$props.value'] (val) {
      this.$emit('change', this.$props.selectKey, val)
    }
  }
}
</script>
<style lang="scss" scoped>
.select-warp {
  width: 144px;
  color: #278AF9;
  position: relative;
  text-align: left;
}
.select-value, .select-option {
  height: 30px;
  text-align: left;
  line-height: 30px;
  background-color: #223242;
}
.select-value {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding-right: 20px;
}
.select-value-text {
  display: inline-block;
  width: 110px;
  text-indent: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  white-space: nowrap;
}
.select-icon {
  display: inline-block;
  position: absolute;
  width: 10px;
  height: 6px;
  top: 0;
  right: 20px;
}
.option-list {
  width: 100%;
  position: absolute;
  top: 30px;
  left: 0;
  z-index: 2010;
  text-indent: 10px;
}
.select-option {
  &, & li {
    list-style: none;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
    &:hover{
      background-color: #3C81CE;
      color: #fff;
      cursor: pointer;
    }
    &.selected-option {
      background-color: #3C81CE;
      color: #fff;
    }
  }
}
// 禁用：
.disabled {
  cursor: default;
}
// 圆角的位置
.is-not-fold, .is-not-fold li:last-child {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
</style>
