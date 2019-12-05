// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex'
import ElementUi from 'element-ui'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)
import "./style/index.scss"

Vue.use(ElementUi, {"size": "small"})

import VueCropper from 'vue-cropper'
Vue.use(VueCropper)

// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/line');
require('echarts/lib/chart/bar');
require('echarts/lib/chart/pie');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend');

import $http from "./ajax/index"
Vue.prototype.$ajax = $http;

import $jqAjax from "./ajax/jquery-ajax"
Vue.prototype.$jqAjax = $jqAjax;

import $ from "jquery"
Vue.prototype.$ = $;

import defaultComponent from "./components/default"
Vue.use(defaultComponent)

import util from './util/util'
Vue.use(util)

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
