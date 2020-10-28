import {
  Button,
  Select,
  DatePicker,
  Message,
  Radio,
  RadioGroup,
  RadioButton,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Collapse,
  CollapseItem,
  Icon,
  Input,
  Pagination,
  Notification,
  MessageBox,
  Slider,
  Scrollbar,
  Loading,
  Switch
} from 'element-ui'

export default {
  install (V) {
    V.use(Button)
    V.use(Select)
    V.use(DatePicker)
    V.use(Radio)
    V.use(RadioGroup)
    V.use(RadioButton)
    V.use(DropdownMenu)
    V.use(DropdownItem)
    V.use(Menu)
    V.use(Submenu)
    V.use(MenuItem)
    V.use(MenuItemGroup)
    V.use(Collapse)
    V.use(CollapseItem)
    V.use(Icon)
    V.use(Input)
    V.use(Pagination)
    V.use(Slider)
    V.use(Scrollbar)
    V.use(Loading)
    V.use(Switch)
    V.prototype.$message = Message
    V.prototype.$notify = Notification
    V.prototype.$confirm = MessageBox.confirm
  }
}
