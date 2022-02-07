
const BASEURL = '/c-userportal'
// const BASEURL1 = '/c-oms'
// 打包注意：uploadUrl 是否切到线上

const API = {
  /**
   * 用户管理
   */
  login: BASEURL + '/loginV2/by_username_pwd', // 登录
  userInfo: BASEURL + '/loginV2/personal_data', // 用户信息
  updateUserInfo: BASEURL + '/loginV2/update_personal_data', // 用户信息修改
  saveUserAvatar: BASEURL + '/loginV2/upload_image', // 保存用户头像
  resetPwd: BASEURL + '/loginV2/reset_pwd', // 修改密码
  loginOut: BASEURL + '/loginV2/logout', // 退出登录
  /**
   * 频道管理
   */
  parentChannel: BASEURL + '/news/channel/get_list_data_parent', // 父频道
  childChannel: BASEURL + '/news/channel/get_list_node_parent', // 子频道
  /**
   * 资讯相关
   */
  newsList: BASEURL + '/news/newsListV2', // 资讯列表
  otherDetail: BASEURL + '/news/otherDetail', // 资讯额外详情
  relateRecommend: BASEURL + '/news/relate', // 相关推荐
  detailForWeb: BASEURL + '/news/detailForWeb', // web端资讯详情
  topicList: BASEURL + '/news/topicListForWeb', // 专题列表
  searchNews: BASEURL + '/news/searchForWeb', // 搜索资讯列表
  /**
   * 阅读历史
   */
  historyList: BASEURL + '/news/history_list', // 阅读历史查询
  emptyHistory: BASEURL + '/news/empty_history', // 清空阅读历史
  delHistory: BASEURL + '/news/del_history', // 删除阅读历史
  /**
   * 点赞接口
   */
  likeClick: BASEURL + '/news/like/click', // 添加点赞
  unlickClick: BASEURL + '/news/unlike/click', // 取消点赞
  /**
   * 热词接口
   */
  getHotWord: BASEURL + '/news/hotword/get_hotword', // 热词查询
  /**
   * 收藏接口
   */
  addCollect: BASEURL + '/news/add_collect', // 添加收藏
  delCollect: BASEURL + '/news/del_collect', // 取消收藏
  queryCollectList: BASEURL + '/news/collect_list', // 收藏历史查询
  emptyCollect: BASEURL + '/news/clearMy', // 清空收藏
  /**
   * 评论接口
   */
  addComments: BASEURL + '/news/comment/write', // 添加评论
  queryCommentsList: BASEURL + '/news/comment/list', // 资讯评论查询
  queryMySpeak: BASEURL + '/news/my_speak', // 我的发言查询
  delMySpeak: BASEURL + '/news/delete_my_views', // 删除我的发言
  emptyMySpeak: BASEURL + '/news/clearMySpeak', // 清空我的发言
  /**
   * 通用接口
   */
  uploadUrl: 'http://oms.bkboole.com:8000/c-oms/common/upload' // 线上文件上传
  // uploadUrl: 'http://172.16.36.114:9092/c-oms/common/upload' // 测试环境文件上传
}
const phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
const mailReg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/

export default {
  API,
  // BASEURL,
  phoneReg,
  mailReg
}
