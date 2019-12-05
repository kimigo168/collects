import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './vuex/store'

import './js/prototype'

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
