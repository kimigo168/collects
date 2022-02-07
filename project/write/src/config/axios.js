import Vue from 'vue'
import axios from 'axios'
import store from '../store'
import { TOGGLE_LIMITPOP, TOGGLE_LOGINPOP, CLEAR_USERINFO } from '../store/mutation-types'

axios.defaults.baseURL = ''
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.timeout = 60000
axios.defaults.withCredentials = true
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use((response) => {
  // let loading = Vue.prototype.$loading();
  // setTimeout(() => {
  //   loading.close();
  // }, 100)
  let data = response.data
  if (data.code === '1') {
    Vue.prototype.$message({ type: 'error', message: data.msg, showClose: true })
  } else if (data.code === '9001') {
    if (response.config.url.indexOf('/auth/user/info.do') === -1) {
      store.commit(CLEAR_USERINFO) // 清除登录过期的用户信息
      setTimeout(() => {
        store.commit(TOGGLE_LOGINPOP, true) // 弹出登录弹窗
      }, 300)
    }
  } else if (data.code === '7004') {
    store.commit(TOGGLE_LIMITPOP, true)
  } else if (data.code === '7003') { // 次数已达到
    store.commit(TOGGLE_LIMITPOP, true)
  }
  return response.data
}, (error) => {
  let loading = Vue.prototype.$loading()
  setTimeout(() => {
    loading.close()
  }, 100)
  if (error && error.response && error.response.status === 9001) {
    store.commit(CLEAR_USERINFO) // 清除登录过期的用户信息
    if (location.pathname !== '/index.html' && location.pathname !== '/' && location.pathname.indexOf('hots') === -1 && location.pathname.indexOf('outline') === -1) {
      setTimeout(() => {
        store.commit(TOGGLE_LOGINPOP, true) // 弹出登录弹窗
      }, 300)
    }
  } else {
    if (error && error.response && error.response.config.url !== '/user/info.do') {
      Vue.prototype.$message({ type: 'error', message: '请求失败，请稍后再试..', showClose: true })
    }
  }
  return Promise.reject(error)
})

export default axios
