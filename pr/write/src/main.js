import Vue from 'vue'
import qs from 'qs'
import App from './App.vue'
import router from './router'
import store from './store'
import config from './config/index'
import axios from './config/axios'
import asyAxios from './config/asyAxios'
import './plugins/element.js'
import VueClipboard from 'vue-clipboard2'
import '@/assets/iconfont/font.css'
import './config/jquery.js'

import VueCropper from 'vue-cropper'
Vue.use(VueCropper)

// 引入 ECharts 主模块
// var echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
require('echarts-wordcloud')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')

Vue.use(VueClipboard)

Vue.prototype.$qs = qs

Vue.prototype.$axios = axios
Vue.prototype.$asyAxios = asyAxios
// Vue.config.productionTip = false

Vue.use(config)

/** mode:'history'模式放开这部分 */
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  if (isChunkLoadFailed) {
    window.location.reload()
    // router.replace(router.history.pending.fullPath);
  } else {
    console.log(error)
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
