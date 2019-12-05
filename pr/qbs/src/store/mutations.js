import {
  RECORD_USERINFO,
  CLEAR_USERINFO,
  GET_USERINFO,
  UPDATE_USERINFO,
  SELECT_PARENTCHANNEL,
  SET_PARENTCHANNELLIST
} from './mutation-types'

import { setStore, getStore, removeStore } from '../config/mUtils'

export default {
  [RECORD_USERINFO] (state, info) { // 存储登录用户信息
    state.userInfo = info
    setStore('userInfo', info)
  },
  [UPDATE_USERINFO] (state, info) { // 更新用户信息
    let uid = state.userInfo.uid
    info.uid = uid // uid不更新
    state.userInfo = info
    setStore('userInfo', info)
  },
  [CLEAR_USERINFO] (state) { // 清除登录信息
    state.userInfo = null
    // state.uid = ''
    removeStore('userInfo')
  },
  [GET_USERINFO] (state) { // 获取用户信息
    let userInfo = getStore('userInfo')
    state.userInfo = userInfo
    state.uid = userInfo && userInfo.uid ? userInfo.uid : ''
    let list = getStore('parentChannelList')
    state.parentChannelList = list
  },
  [SELECT_PARENTCHANNEL] (state, parentChannel) {
    state.selectedParentChannel = parentChannel
  },
  [SET_PARENTCHANNELLIST] (state, list) {
    state.parentChannelList = list
    setStore('parentChannelList', list)
    state.selectedParentChannel = list ? list[0] : ''
  }
}
