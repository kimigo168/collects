import {
  TOGGLE_ANIMATE,
  RECORD_USERINFO,
  GET_USERINFO,
  CLEAR_USERINFO,
  TOGGLE_BUYVIP,
  CHANGE_REFRESHSTATUS,
  TOGGLE_LIMITPOP,
  TOGGLE_LOGINPOP,
  TOGGLE_PROVISION,
  ACCEPT_PROVISION,
  SET_SOURCE,
  SET_WRITE_STATUS,
  CONTINUE_WRITE
} from './mutation-types'

import { setStore, getStore, removeStore } from '../config/mUtils'

export default {
  [TOGGLE_ANIMATE] (state, isShowAnimate) { // 是否关闭或显示写作页面逐字出现动画
    state.isShowAnimate = isShowAnimate
  },
  [RECORD_USERINFO] (state, info) { // 存储登录用户信息
    state.userInfo = info
    state.loginState = true
    setStore('userInfo', info)
  },
  [GET_USERINFO] (state) { // 获取用户信息
    let userInfo = getStore('userInfo')
    state.userInfo = userInfo
  },
  [CLEAR_USERINFO] (state) { // 清除用户信息
    state.userInfo = null
    state.loginState = false
    removeStore('userInfo')
  },
  [TOGGLE_BUYVIP] (state, isShow) { // 是否显示购买VIP弹窗
    state.isShowBuyVip = isShow
  },
  [CHANGE_REFRESHSTATUS] (state, isRefresh) { // 改变刷新购买历史的状态
    state.refreshBuyHistory = isRefresh
  },
  [TOGGLE_LIMITPOP] (state, isShow) { // 打开或关闭使用次数限制弹窗
    state.isShowLimitPop = isShow
  },
  [TOGGLE_LOGINPOP] (state, isShow) { // 打开或关闭登录弹窗
    state.isShowLoginPop = isShow
  },
  [TOGGLE_PROVISION] (state, isShow) { // 打开或关闭服务协议弹窗
    state.isShowProvision = isShow
  },
  [ACCEPT_PROVISION] (state, accept) { // 接受服务协议条款
    state.isShowProvision = false
    state.acceptProvision = accept
  },
  [SET_SOURCE] (state, source) { // 设置访问来源
    state.source = source
  },
  [SET_WRITE_STATUS] (state, status) { // 设置写作状态
    state.writeStatus = status
  },
  [CONTINUE_WRITE] (state, isContinue) { // 是否继续写作
    state.continueWrite = isContinue
    if (state.continueWrite) { // 继续写
      if (state.writeStatus === 1) {
        state.writeStatus = 3 // 现在写热点
      } else if (state.writeStatus === 2) {
        state.writeStatus = 4 // 现在写提纲
      }
    }
    state.continueWrite = false // 随后置为false
  },
  changeElementList (state, list) {
    state.elementList = list
  },
  changeImageElementList (state, list) {
    state.imageElementList = list
  }
}
