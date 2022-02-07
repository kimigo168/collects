import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isShowAnimate: true, // 是否关闭生成稿件页的动效
    userInfo: null, // 个人信息
    loginState: false, // 登录状态：true登录，false未登录
    isShowLimitPop: false, // 是否显示次数受限弹窗
    isShowBuyVip: false, // 是否显示购买vip弹窗
    refreshBuyHistory: false, // 是否刷新购买历史记录
    isShowLoginPop: false, // 是否显示登陆注册弹窗
    isShowProvision: false, // 是否显示服务协议弹窗
    acceptProvision: true, // 是否接受服务条款
    source: 0, // 来源，0：默认官网进入
    writeStatus: 0, // 登录后是否继续调写作接口，0不写，1待写热点，2待写提纲，3现在写热点，4现在写提纲
    continueWrite: false, // 是否关闭登录弹窗后继续写作
    elementList: [],
    imageElementList: []
  },
  mutations,
  actions
})
