/* eslint-disable camelcase */
// 标准布局
import standard from './layout-standard'
// 培训布局
import training from './training'
// 修改画中画的布局名称为 layout_square_3, 命名来自新版V3协议中的画中画自动生成布局信息
import layout_square_3 from './picture-in-picture'
// 一分屏
import layout_square_1 from './split-screen-1'
import layout_square_2 from './split-screen-2'
import layout_square_4 from './split-screen-4'
import layout_square_6 from './split-screen-6'
import layout_square_9 from './split-screen-9'
import layout_square_12 from './split-screen-12'
import layout_square_16 from './split-screen-16'
import layout_square_25 from './split-screen-25'
import layout_square_36 from './split-screen-36'
import layout_square_49 from './split-screen-49'
import layout_square_64 from './split-screen-64'

let layouts = {
  standard: {
    component: standard,
    layoutName: 'standard',
    name: '标准布局'
  },
  training: {
    component: training,
    layoutName: 'training',
    name: '培训布局'
  },
  layout_square_3: {
    component: layout_square_3,
    layoutName: 'layout_square_3',
    name: '画中画'
  },
  layout_square_1: {
    component: layout_square_1,
    layoutName: 'layout_square_1',
    name: '一分屏'
  },
  layout_square_2: {
    component: layout_square_2,
    layoutName: 'layout_square_2',
    name: '二分屏'
  },
  layout_square_4: {
    component: layout_square_4,
    layoutName: 'layout_square_4',
    name: '四分屏'
  },
  layout_square_6: {
    component: layout_square_6,
    layoutName: 'layout_square_6',
    name: '六分屏'
  },
  layout_square_9: {
    component: layout_square_9,
    layoutName: 'layout_square_9',
    name: '九分屏'
  },
  layout_square_12: {
    component: layout_square_12,
    layoutName: 'layout_square_12',
    name: '十二分屏'
  },
  layout_square_16: {
    component: layout_square_16,
    layoutName: 'layout_square_16',
    name: '十六分屏'
  },
  layout_square_25: {
    component: layout_square_25,
    layoutName: 'layout_square_25',
    name: '二十五分屏'
  },
  layout_square_36: {
    component: layout_square_36,
    layoutName: 'layout_square_36',
    name: '三十六分屏'
  },
  layout_square_49: {
    component: layout_square_49,
    layoutName: 'layout_square_49',
    name: '四十九分屏'
  },
  layout_square_64: {
    component: layout_square_64,
    layoutName: 'layout_square_64',
    name: '六十四分屏'
  }
}

class Layout {
  constructor (opts) {
    this.layouts = layouts
  }
  toArray () {
    let arr = []
    for (let item of Object.keys(this.layouts)) {
      arr.push(this.layouts[item])
    }
    return arr
  }
}

export default new Layout()
