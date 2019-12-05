import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    uid: '', // 用户uid
    token: '', // 登录token
    userInfo: null, // 个人登录信息
    selectedParentChannel: null, // 选中的父频道
    parentChannelList: [], // 父频道列表
    collectList: [] // 收藏列表
  },
  mutations,
  actions
})
