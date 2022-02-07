
// const BASEURL = '' // 线上打包
// const adminApiHost = '/statistics' // 后台管理域名 线上打包
const adminApiHost = 'https://backoffice.giiso.com' // 后台管理域名 线上打包

// const adminApiHost = 'http://aiwriter-uat.giiso.com/statistics' // 测试 uat后台管理域名
// const BASEURL = '/uat-api' // 测试打包
// const BASEURL = 'https://www.giiso.com'
// const BASEURL = 'http://172.16.1.145:9090' // 勇兵本机
const BASEURL = 'http://172.16.1.147:9090' // 付永乐服务器
// const BASEURL = 'https://pre-cworks.giiso.com'
// const BASEURL = 'http://aiwriter-uat.giiso.com'
const versionNo = 9 // 版本号，用于对比清缓存

const API = {
  'getHotWord': BASEURL + '/hotspot/list.do', // 推荐热点
  'getBaike': BASEURL + '/ai/baike.do', // 百科
  'write': BASEURL + '/writing/article.do', // 关键字搜写作底稿
  'topicExtraction': BASEURL + '/material/topic_extraction.do', // 主题推荐
  'materialRecommend': BASEURL + '/material/suggest.do', // 素材推荐
  'titleSearch': BASEURL + '/news/search.do', // 文章搜索
  'keywordSearch': BASEURL + '/material/keywrod_serach.do', // 关键字搜索,
  'topicSearch': BASEURL + '/material/topic_search.do', // 主题搜索,
  'sentenceSearch': BASEURL + '/material/sentence_search.do', // 句子搜索,
  'recommendNews': BASEURL + '/news/list.do', // 推荐新闻
  'getChannel': BASEURL + '/news/cat/list.do',
  'getKeyWord': BASEURL + '/material/getKeyWord.do', // 提取关键字
  'articleCheck': BASEURL + '/checking/add.do', // 文章查重
  'detection': BASEURL + '/article/grammar_detection.do', // 文章纠错
  'reWrite': BASEURL + '/article/rewrite.do', // 文章改写
  'saveContext': BASEURL + '/article/add.do', // 生成底稿
  'duplicateList': BASEURL + '/checking/list.do', // 查重列表
  'getCheck': BASEURL + '/ai/getCheck.do', // 查重结果
  'duplicateDetail': BASEURL + '/checking/detail.do', // 查重详情
  'downloadContext': BASEURL + '/article/download.do', // 下载文件
  'register': BASEURL + '/c/user/register.do', // 注册
  'login': BASEURL + '/c/user/login.do', // 登录
  'logout': BASEURL + '/c/user/logOut.do', // 退出登录
  'resetPwd': BASEURL + '/c/user/resetPwd.do', // 找回密码
  'checkPhone': BASEURL + '/c/user/checkPhone.do', // 验证手机号
  'sendSMS': BASEURL + '/c/user/sendSMS.do', // 发送短信验证码
  'getUserInfo': BASEURL + '/c/user/userInfo.do', // 获取用户信息
  'memberContextList': BASEURL + '/article/list.do', // 用户稿件
  'editMemberContext': BASEURL + '/article/detail.do', // 修改稿件
  'memberOrderList': BASEURL + '/c/member/memberOrderList.do', // 会员订单列表
  'resetPassword': BASEURL + '/c/member/resetPassword.do', // 重置密码
  'exportDoc': BASEURL + '/article/export.do', // 下载稿件
  'createOrder': BASEURL + '/order/createOrder.do', // 创建支付订单
  'wxPay': BASEURL + '/order/wxPay.do', // 微信下单
  'aliPay': BASEURL + '/order/createOrder.do', // 支付宝下单
  'queryOrder': BASEURL + '/order/queryOrder.do', // 查询订单
  'productList': BASEURL + '/order/productList.do', // 商品列表
  // 'jumpURI': BASEURL + '/c/user/jumpURI.do', // 跳转到辑书
  'jumpURI': BASEURL + '/auth/zhishu/login/uri.do',
  'zhishi': BASEURL + '/ai/zhishi.do', // 知识接口
  'goodSentences': BASEURL + '/knowledge/good_sentences.do', // 好词好句
  'zhihu': BASEURL + '/knowledge/zhihu.do', // 知乎接口
  'baike': BASEURL + '/knowledge/baike.do', // 百科接口
  'zhidao': BASEURL + '/knowledge/zhidao.do', // 知道
  'emotionTrend': BASEURL + '/analysis/emotion_trend.do', // 情感分析
  'templateWrite': BASEURL + '/writing/template_article.do', // 模板写作
  // v3.2新增接口
  // 'userInfo': BASEURL + '/user/info.do', // 获取登录用户信息
  'userInfo': BASEURL + '/auth/user/info.do', // 获取用户信息
  'checkPhoneDo': BASEURL + '/auth/checkPhone.do', // 验证手机号
  'getCode': BASEURL + '/auth/getCode.do', // 获取短信验证
  'registerDo': BASEURL + '/auth/register.do', // 用户注册（注册成功后自动登录）
  'loginDo': BASEURL + '/auth/login.do', // 用户登录
  'logoutDo': BASEURL + '/auth/logout.do', // 退出登录
  'findPassword': BASEURL + '/auth/findPassword.do', // 找回密码
  'updatePassword': BASEURL + '/user/update_password.do', // 个人中心更改密码
  'validateCode': BASEURL + '/auth/validateCode.do', // 校验短信验证码
  'qrcodeDo': BASEURL + '/auth/wx/login/qrcode.do', // 获取微信登录二维码
  'verifyDo': BASEURL + '/auth/wx/login/verify.do', // 验证用户是否已扫码关注公众号
  'bindingDo': BASEURL + '/user/mobile/binding.do', // 绑定手机号
  'getBingQr': BASEURL + '/user/wx/binding/qrcode.do', // 登录后，获取微信绑定二维码
  'bindWxVerify': BASEURL + '/user/wx/binding/verify.do', // 验证是否绑定成功
  'updatePwd': BASEURL + '/user/update_password.do', // 修改密码
  'goodsList': BASEURL + '/goods/list.do', // 商品列表接口
  'addOrder': BASEURL + '/order/add.do', // 生成订单
  'queryPay': BASEURL + '/order/detail.do', // 查询扫码支付结果
  'buyOrderList': BASEURL + '/order/list.do', // 购买订单记录
  'unBinding': BASEURL + '/user/mobile/unbinding.do', // 手机号暂不绑定
  'versionCheck': BASEURL + '/version/num.do', // 版本检测
  'logCollect': adminApiHost + '/stc/log/upload.do', // 日志收集接口
  'sensitiveCheck': BASEURL + '/sensitiveWord/check.do', // 敏感词检测
  'templateTypes': BASEURL + '/jishu/template/type/list.do', // 获取大纲分类
  'templateList': BASEURL + '/jishu/template/list.do', // 分类下大纲列表
  'templateChildTitle': BASEURL + '/jishu/template/info.do', // 大纲下的子标题列表
  'outlineWrite': BASEURL + '/jishu/template/write.do', // 大纲写作
  'outlineRecommend': BASEURL + '/jishu/template/recommend.do', // 大纲推荐素材
  'subtitleSearch': BASEURL + '/jishu/template/subtitleSearch.do' // 大纲子标题查询
}
const phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
const mailReg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/

export default {
  API,
  BASEURL,
  phoneReg,
  mailReg,
  versionNo
}
