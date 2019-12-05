import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 创建 store 实例
export default new Vuex.Store({
  state: {
    userInfo:{},
    toolTip:'',
    loading:false,

    loginModel:false,
    code7003Model:false,
  },
  getters: {

  },
  mutations: {
    setUserInfo (state, data) {
      state.userInfo = data
    },
    setToolTip (state, data) {
      state.toolTip = data
    },
    setLoading (state, data) {
      $('input').blur();
      if(data === true){
        state.loading = "加载中…"
      }else {
        state.loading = data
      }
    },
    setLoginModel (state, data) {
      state.loginModel = data
    },
    setCode7003Model (state, data) {
      state.code7003Model = data
    },
  },
  actions: {

  },


})
