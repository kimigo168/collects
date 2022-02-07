import Vue from 'vue'
import {
  Button,
  Message,
  Loading,
  Carousel,
  CarouselItem,
  Select,
  Option,
  Dialog,
  Tabs,
  TabPane,
  DatePicker,
  Table,
  TableColumn,
  Pagination,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  MessageBox,
  Checkbox,
  Cascader,
  Tag
} from 'element-ui'

Vue.use(Button)
Vue.use(Loading)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Select)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(DatePicker)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Checkbox)
Vue.use(Cascader)
Vue.use(Tag)

// Vue.use(MessageBox)
Vue.component(MessageBox.name, MessageBox)
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$alert = MessageBox.alert
// Vue.use(Message) // 此方法有问题，刷新会自动弹出一条，改用下面方法
Vue.component(Message.name, Message)
