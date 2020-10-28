<template>
  <div class="hst-pagination">
    <button @click="hstCurentPage --" :disabled="hstCurentPage <= 1">&lt;</button>
    <ul class="pages">
      <li class="text-ellips" v-if="totalPages > 3 && lastPage > 3">...</li>
      <li v-if="totalPages >= 3 && hstCurentPage === totalPages" @click="hstCurentPage = totalPages - 2">
        <button>{{ hstCurentPage - 2 }}</button>
      </li>
      <li ref="firstPage" v-if="hstCurentPage > 1" @click="hstCurentPage --">
        <button>{{ firstPage }}</button>
      </li>
      <li class="selected">
        <button>{{ hstCurentPage }}</button>
      </li>
      <li v-if="totalPages > hstCurentPage" @click="hstCurentPage += 1">
        <button>{{ lastPage }}</button>
      </li>
      <li v-if="totalPages >= 3 && hstCurentPage === 1" @click="hstCurentPage = 3">
        <button>{{ hstCurentPage + 2 }}</button>
      </li>
      <li class="text-ellips" v-if="(lastPage >= 3 && totalPages > lastPage) || (lastPage === 2 && totalPages > 3)">...</li>
    </ul>
    <button class="next-btn"  @click="hstCurentPage += 1" :disabled="hstCurentPage >= totalPages">&gt;</button>
    <span>
      <span class="text-goto">{{ $t('m.goTo') }}</span>
      <input type="number" :max="totalPages" min="1" class="pagination-num" v-model="hstCurentPage">
      <span>{{ $t('m.page') }}</span>
    </span>
  </div>
</template>
<script>
export default {
  // props是只读属性
  props: {
    curentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 16
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      hstCurentPage: this.$props.curentPage
    }
  },
  computed: {
    hstPageSize () {
      return this.$props.pageSize
    },
    hstTotal () {
      return this.$props.total
    },
    firstPage () {
      if (this.hstCurentPage <= 1) {
        return 1
      } else {
        return this.hstCurentPage - 1
      }
    },
    lastPage () {
      if (this.totalPages >= 3 && this.hstCurentPage === 1) {
        return 2
      } else if (this.totalPages >= 3 && this.hstCurentPage === 2) {
        return 3
      } else if (this.totalPages - this.hstCurentPage < 2) {
        // 总页数 - 当前页小于2
        return this.totalPages
      } else {
        return parseInt(this.hstCurentPage) + 1
      }
    },
    totalPages () {
      if (this.hstTotal === 0) {
        return 1
      } else {
        return Math.ceil(this.hstTotal / this.hstPageSize)
      }
    }
  },
  methods: {
    changeCurrentPage () {
      if (this.hstCurentPage > this.totalPages) {
        this.hstCurentPage = parseInt(this.totalPages)
      } else if (this.hstCurentPage > 0) {
        this.hstCurentPage = parseInt(this.hstCurentPage)
      } else {
        this.hstCurentPage = 1
      }
      this.$emit('change-pagintation', this.hstCurentPage)
    }
  },
  watch: {
    hstCurentPage (newval, oldval) {
      if (newval > this.totalPages) {
        this.hstCurentPage = parseInt(this.totalPages)
      } else if (newval > 0) {
        this.hstCurentPage = parseInt(newval)
      } else {
        this.hstCurentPage = 1
      }
      this.$emit('change-pagintation', this.hstCurentPage)
    },
    hstPageSize (c) {
      if (this.hstCurentPage > this.$props.total / this.$props.pageSize) {
        this.hstCurentPage = Math.ceil(this.$props.total / this.$props.pageSize)
      }
    },
    hstTotal (t) {
      if (Math.ceil(t / this.$props.pageSize) < this.hstCurentPage) {
        this.hstCurentPage = 1
      }
    }
  }
}
</script>
<style lang="scss" scoped>
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
.hst-pagination {
  width: 100%;
  button {
    width: 24px;
    text-align: center;
    line-height: 24px;
    font-size: 12px;
    font-style: normal;
    cursor: pointer;
    zoom:1;
    outline-width:medium;
    outline-color:inherit;
    border-radius:5px;
    color:#ACC1DB;
    border:#3D5269 0px solid;
    background-color:#3D5269;
    &:hover {
      color: #fff;
      background-color:#278AF9;
    }
    &[disabled] {
      cursor: not-allowed;
      background-color:#3D5269;
    }
  }
  .pages {
    display: inline-block;
    li {
      display: inline-block;
      margin-left: 5PX;
    }
    li.text-ellips {
      width: 5px;
      margin: 0;
    }
  }
  .next-btn {
    margin-left: 5px;
  }
  .pagination-num {
    -moz-appearance:textfield;
    &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
  li.selected button {
    background-color: #278AF9;
    color: #fff;
  }
  .text-goto {
    margin-left: 5px;
  }
}
// input样式美化
input {
  -web-kit-appearance: none;
  -moz-appearance: none;
  font-size: 12px;
  height: 24px;
  width: 19px;
  border-radius: 4px;
  border: 0px solid #c8cccf;
  color: #278af9;
  text-align: center;
  background-color: #253647;
  outline:0;
}
</style>
