import Vue from 'vue'
import store from '../store'
import axios from 'axios'
import CryptoJS from 'crypto-js'

axios.defaults.baseURL = ''
axios.defaults.withCredentials = true
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.timeout = 15000

// 添加请求拦截器
axios.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  if (config.url.indexOf('common/upload') === -1) {
    if (store.state.userInfo) {
      config.headers.common['uid'] = store.state.userInfo.uid || ''
      config.headers.common['tcode'] = 'web'
      config.headers.common['tcontent'] = 'web'

      let timeStamp = Date.parse(new Date())
      config.headers.common['wdate'] = timeStamp
      config.headers.common['signature'] = CryptoJS.HmacSHA1('1568958377000', '84eafbabf97361c5ebe53fc2ca3853cb7ca42569')
    } else {
      config.headers.common['uid'] = ''
    }
  }
  return config
}, (error) => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use((response) => {
  let data = response.data
  // let loading = Vue.prototype.$loading()
  // setTimeout(() => {
  //   loading.close()
  // }, 100)
  if (data.code === '1' || data.code === 'WRONG_PWD') {
    Vue.prototype.$message({ type: 'error', message: data.msg, showClose: true })
  } else if (data.code === '9001') {
    location.href = location.pathname
    store.commit('CLEAR_USERINFO') // 清除登录过期的用户信息
    // setTimeout(() => {
    //   store.commit(TOGGLE_LOGINPOP, true) // 弹出登录弹窗
    // }, 300)
  }
  return response.data
}, (error) => {
  Vue.prototype.$message({ type: 'error', message: '请求超时', showClose: true })
  let loading = Vue.prototype.$loading()
  setTimeout(() => {
    loading.close()
  }, 100)
  return Promise.reject(error)
})

export default axios
