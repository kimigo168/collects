import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

import VueCropper from 'vue-cropper'

import config from './config/index'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(VueCropper)
Vue.use(VueAwesomeSwiper)

Vue.use(ElementUI)

Vue.use(config)

Vue.config.productionTip = false

/** mode:'history'模式 放开下面 */
// router.onError((error) => {
//   const pattern = /Loading chunk (\d)+ failed/g
//   const isChunkLoadFailed = error.message.match(pattern)
//   if (isChunkLoadFailed) {
//     window.location.reload()
//     // router.replace(router.history.pending.fullPath);
//   } else {
//     console.log(error)
//   }
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
