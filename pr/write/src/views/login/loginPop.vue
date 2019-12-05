<template>
  <el-dialog id="loginPop" width="970px!important" :close-on-click-modal="true" :visible.sync="showModel" top="15vh" :close-on-press-escape="false" :before-close="beforeClose" :show-close="false">
    <div class="login-container">
      <i class="el-icon-close" @click="beforeClose"></i>
      <div class="left-part">
        <div class="our-target">
          <span class="giiso"></span><i class="dot"></i><span class="target">让写作更简单</span>
        </div>
      </div>
      <div class="right-part">
        <h2 class="title">{{viewIndex==0?'登录':viewIndex==1?'注册':viewIndex==2?'找回密码':viewIndex===3?'微信登录':viewIndex===4?'绑定微信方便快速登录':'绑定手机号'}}</h2>
        <!-- 0.登录 -->
        <div class="login-wrap wrap" v-if="viewIndex===0" @keyup.enter="loginFun">
          <ul class="item-list clearfix">
            <li>
              <h3>手机号</h3>
              <!-- <phone-input v-model="loginData.phoneNum"></phone-input> -->
              <div class="input-wrap">
                <input :class="{'error': !loginData.phoneVerify}" type="text" v-model="loginData.phoneNum" placeholder="请输入您的手机号">
                <p class="error-tip" v-if="!loginData.phoneVerify">请填写正确的手机号</p>
              </div>
            </li>
            <li>
              <h3>密码</h3>
              <div class="input-wrap">
                <input @input="inputPassword(0, $event)" :class="{'error': !loginData.passwordVerify}" type="password" v-model="loginData.password" placeholder="请输入您的密码">
                <p class="error-tip" v-if="!loginData.passwordVerify">{{loginData.password.length===0?'请输入密码':'密码错误'}}</p>
              </div>
            </li>
          </ul>
          <button class="login-btn" v-if="!isLogining" @click="loginFun">登录</button>
          <button class="login-btn" @click="loginFun" v-else ><i class="el-icon-loading"></i>登录中</button>
          <p class="tips no-account-tips clearfix">还没有账号？<span class="register" @click="changeView(1)">马上注册！</span><span class="forget"  @click="changeView(2)">忘记密码？</span></p>
          <div class="other-methods">
            <p></p>
            <span class="label">其他登录方式</span>
            <span class="by-wechat" @click="changeView(3)"></span>
            <span class="by-tip by-tip1">微信登录</span>
          </div>
        </div>
        <!-- 1.注册 -->
        <div class="register-wrap wrap" v-if="viewIndex===1">
          <ul class="item-list clearfix" @keyup.enter="registerFun">
            <li>
              <h3>手机号</h3>
              <div class="input-wrap">
                <input type="text" :class="{'error': !registerData.phoneVerify}"  v-model="registerData.phoneNum" placeholder="请输入您的手机号">
                <p class="error-tip" v-if="!registerData.phoneVerify">请填写正确的手机号</p>
              </div>
            </li>
            <li>
              <h3>密码</h3>
              <div class="input-wrap">
                <input @input="inputPassword(1, $event)" type="password" :class="{'error': !registerData.passwordVerify}"  v-model="registerData.password" placeholder="请输入您的密码">
                <p class="error-tip" v-if="!registerData.passwordVerify">{{registerData.password.length===0?'请输入密码':'密码错误'}}</p>
              </div>
            </li>
            <li>
              <h3>确认密码</h3>
              <div class="input-wrap">
                <input @input="confirmPassword(1, $event)" type="password" :class="{'error':!registerData.confirmPwdVerify}" v-model="registerData.confirmPwd" placeholder="请重新输入您的密码">
                <p class="error-tip" v-if="!registerData.confirmPwdVerify">{{registerData.confirmPwd.length==0?'请确认密码':'密码不一致，请重新输入'}}</p>
              </div>
            </li>
            <li>
              <h3>验证码</h3>
              <div class="input-wrap">
                <input @input="inputVerifyCode(1, $event)" type="text" :class="{'error':!registerData.verifyCodeResult}" v-model="registerData.verifyCode" placeholder="请输入验证码">
                <span class="getcode" :class="{'code-sended': registerData.hasSend}" @click="getTencentVerify(1)" v-loading="registerData.isSending">{{registerData.hasSend?(registerData.countSeconds+'s后重发'):'获取验证码'}}</span>
                <p class="error-tip" v-if="!registerData.verifyCodeResult">{{registerData.verifyCode.length==0?'请输入验证码':'验证码错误'}}</p>
              </div>
            </li>
          </ul>
          <button class="register-btn" @click="registerFun">注册</button>
          <div class="service-provision">
            <el-checkbox @change="checkChange" v-model="provisionObj.checked"></el-checkbox><span class="tip">我已阅读并接受<a @click="viewProvision" href="javascript:void(0)">《服务条款》</a></span>
            <p class="tips"><span class="has-account"  @click="changeView(0)">已有账号？点此登录</span></p>
          </div>
        </div>
        <!-- 2.找回密码 -->
        <div class="find-wrap wrap" v-if="viewIndex===2">
          <ul class="item-list clearfix"  @keyup.enter="saveFun">
            <li>
              <h3>手机号</h3>
              <div class="input-wrap">
                <input type="text" :class="{'error': !resetData.phoneVerify}" v-model="resetData.phoneNum" placeholder="请输入您的手机号">
                <p class="error-tip" v-if="!resetData.phoneVerify">请填写正确的手机号</p>
              </div>
            </li>
            <li>
              <h3>密码</h3>
              <div class="input-wrap">
                <input @input="inputPassword(2, $event)" type="password" :class="{'error': !resetData.passwordVerify}"  v-model="resetData.password" placeholder="请输入您的密码">
                <p class="error-tip" v-if="!resetData.passwordVerify">{{resetData.password.length===0?'请输入密码':'密码错误'}}</p>
              </div>
            </li>
            <li>
              <h3>确认密码</h3>
              <div class="input-wrap">
                <input @input="confirmPassword(2, $event)" type="password" :class="{'error':!resetData.confirmPwdVerify}" v-model="resetData.confirmPwd" placeholder="请重新输入您的密码">
                <p class="error-tip" v-if="!resetData.confirmPwdVerify">{{resetData.confirmPwd.length==0?'请确认密码':'密码不一致，请重新输入'}}</p>
              </div>
            </li>
            <li>
              <h3>验证码</h3>
              <div class="input-wrap">
                <input @input="inputVerifyCode(2, $event)"  type="text" :class="{'error':!resetData.verifyCodeResult}" v-model="resetData.verifyCode" placeholder="请输入验证码">
                <span class="getcode" v-loading="resetData.isSending" :class="{'code-sended': resetData.hasSend}" @click="getTencentVerify(2)">{{resetData.hasSend?(resetData.countSeconds+'s后重发'):'获取验证码'}}</span>
                <p class="error-tip" v-if="!resetData.verifyCodeResult">{{resetData.verifyCode.length==0?'请输入验证码':'验证码错误'}}</p>
              </div>
            </li>
          </ul>
          <button class="findback-btn" @click="saveFun">保存</button>
          <p class="tips">已有账号？<span class="has-account"  @click="changeView(0)">点此登录</span></p>
        </div>
        <!-- 3.微信登录 -->
        <div class="wechat-wrap wrap" v-if="viewIndex===3">
          <div class="qr-wrap" ref="qrCodeUrl"  v-loading="qrLoading">
            <!-- <img v-if="loginQrUrl" :src="loginQrUrl" alt=""> -->
          </div>
          <p class="scan-tip" style="margin-bottom:90px;">扫码关注公众号「Giiso写作机器人」即可登录</p>
          <div class="other-methods">
            <p></p>
            <span class="label">其他登录方式</span>
            <span class="by-phone" @click="changeView(0)"></span>
            <span class="by-tip">手机登录</span>
          </div>
        </div>
        <!-- 4.绑定微信 -->
        <div class="wechat-wrap wrap" v-if="viewIndex===4">
          <div class="qr-wrap" v-loading="qrLoading1" ref="qrCodeUrl1">
            <!-- <img v-if="bindQrUrl" :src="bindQrUrl" alt=""> -->
          </div>
          <p class="scan-tip">扫码关注公众号「Giiso写作机器人」即可绑定</p>
          <p class="service-provision" style="text-align:center;margin-bottom:20px;">
            <el-checkbox @change="checkChange" v-model="provisionObj.checked"></el-checkbox><span class="tip">我已阅读并接受<a @click="viewProvision" href="javascript:void(0)">《服务条款》</a></span>
          </p>
          <p class="not-bind" @click="unBindFun">暂不绑定</p>
        </div>
        <!-- 5.绑定手机号 -->
        <div class="login-wrap register-wrap wrap" v-if="viewIndex===5">
          <ul class="item-list clearfix">
            <li>
              <h3>手机号</h3>
              <div class="input-wrap">
                <input :class="{'error': !bindData.phoneVerify}" type="text" v-model="bindData.phoneNum" placeholder="请输入您的手机号">
                <p class="error-tip" v-if="!bindData.phoneVerify">{{bindData.phoneNum.length==0?'请输入手机号码':'请填写正确的手机号'}}</p>
              </div>
            </li>
            <li>
              <h3>设置密码</h3>
              <div class="input-wrap">
                <input @input="inputPassword(3, $event)"  :class="{'error': !bindData.passwordVerify}" type="password" v-model="bindData.password" placeholder="请输入您的密码">
                <p class="error-tip" v-if="!bindData.passwordVerify">请输入密码</p>
              </div>
            </li>
            <li>
              <h3>验证码</h3>
              <div class="input-wrap">
                <input @input="inputVerifyCode(3, $event)" type="text" :class="{'error':!bindData.verifyCodeResult}" v-model="bindData.verifyCode" placeholder="请输入验证码">
                <span class="getcode" v-loading="bindData.isSending" :class="{'code-sended': bindData.hasSend}" @click="getTencentVerify(3)">{{bindData.hasSend?(bindData.countSeconds+'s后重发'):'获取验证码'}}</span>
                <p class="error-tip" v-if="!bindData.verifyCodeResult">{{bindData.verifyCode.length==0?'请输入验证码':'验证码错误'}}</p>
              </div>
            </li>
          </ul>
          <button class="login-btn" v-if="!isLogining" @click="bindFun">绑定</button>
          <p style="text-align:center;color: #999;cursor:pointer;" @click="unBindFun">暂不绑定</p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { setInterval, clearInterval, setTimeout } from 'timers'
import MD5 from 'md5'
import { mapState, mapMutations } from 'vuex'
import QRCode from 'qrcodejs2'
// import phoneInput from './phoneInput'
export default {
  name: 'loginPop',
  components: {
    // phoneInput
  },
  data () {
    return {
      showModel: false,
      viewIndex: 3, // 0登录，1注册，2忘记密码,3微信登录,4绑定微信，5绑定手机
      loginData: {
        phoneNum: '',
        password: '',
        verifyCode: '',
        phoneVerify: true, // 手机号验证
        passwordVerify: true
      },
      isLogining: false, // 是否登录中
      registerData: {
        phoneNum: '',
        password: '',
        confirmPwd: '',
        verifyCode: '',
        phoneVerify: true, // 手机号验证
        passwordVerify: true,
        confirmPwdVerify: true,
        verifyCodeResult: true, // 验证码验证结果
        hasSend: false, // 是否已发送验证码
        countSeconds: 59, // 几秒后重发
        countFlag: null, // 计时器
        isSending: false // 是否正在发送验证码
      },
      resetData: {
        phoneNum: '',
        verifyCode: '',
        password: '',
        confirmPwd: '',
        phoneVerify: true, // 手机号验证
        passwordVerify: true,
        confirmPwdVerify: true,
        verifyCodeResult: true, // 验证码验证结果
        hasSend: false, // 是否已发送验证码
        countSeconds: 59, // 几秒后重发
        countFlag: null, // 计时器
        isSending: false // 是否正在发送验证码
      },
      provisionObj: {
        checked: true,
        isShow: false
      },
      bindData: {
        phoneNum: '',
        verifyCode: '',
        password: '',
        phoneVerify: true,
        passwordVerify: true,
        verifyCodeResult: true, // 验证码验证结果
        hasSend: false, // 是否已发送验证码
        isSending: false,
        countSeconds: 59, // 几秒后重发
        countFlag: null // 计时器
      },
      captchaRegister: null, // 注册实例
      captchaResetPwd: null, // 重置密码实例
      captchBindPhone: null, // 绑定手机号码实例
      /** 二维码扫描 */
      loginQrUrl: '', // 登录扫码url
      loginTicket: '', // 用于轮询获取扫码结果的标志
      qrCodeFlag: null,
      qrCodeFlag1: null,
      qrLoading: false,
      qrLoading1: false,
      queryLoginScanFlag: null,
      bindQrUrl: '', // 绑定微信扫码url
      bindTicket: '', // 用于轮询获取扫码结果标志
      queryBindScanFlag: null
    }
  },
  computed: {
    ...mapState(['acceptProvision', 'source'])
  },
  methods: {
    ...mapMutations(['TOGGLE_LOGINPOP', 'RECORD_USERINFO', 'TOGGLE_PROVISION', 'ACCEPT_PROVISION', 'CONTINUE_WRITE']),
    beforeClose (num) {
      clearInterval(this.queryLoginScanFlag)
      clearInterval(this.queryBindScanFlag)
      clearInterval(this.bindData.countFlag)
      clearInterval(this.resetData.countFlag)
      clearInterval(this.registerData.countFlag)
      if (num === 1) { // 登录成功后关闭弹窗，如果先前是写作但未登录状态，则接着调用写作接口
        this.CONTINUE_WRITE(true)
      }
      this.TOGGLE_LOGINPOP(false)
    },
    changeView (index) { // 切换页面
      clearInterval(this.queryLoginScanFlag)
      clearInterval(this.queryBindScanFlag)
      if (index === 0) { // 账号密码登录
        this.loginData.phoneNum = ''
        this.loginData.password = ''
        this.loginData.verifyCode = ''
        this.loginData.phoneVerify = true
        this.loginData.passwordVerify = true
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '登录注册', '点击手机登录方式', this.$getCurPageName()])
      } else if (index === 1) { // 注册
        this.registerData.phoneNum = ''
        this.registerData.password = ''
        this.registerData.confirmPwd = ''
        this.registerData.verifyCode = ''
        this.registerData.phoneVerify = true
        this.registerData.passwordVerify = true
        this.registerData.confirmPwdVerify = true
        this.registerData.verifyCodeResult = true
        this.registerData.hasSend = false
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '登录注册', '点击注册入口', this.$getCurPageName()])
      } else if (index === 2) { // 找回密码
        this.resetData.phoneNum = this.loginData.phoneNum
        this.resetData.password = ''
        this.resetData.confirmPwd = ''
        this.resetData.verifyCode = ''
        this.resetData.phoneVerify = true
        this.resetData.passwordVerify = true
        this.resetData.confirmPwdVerify = true
        this.resetData.verifyCodeResult = true
        this.resetData.hasSend = false
      } else if (index === 3) { // 微信登录
        // this.loginQrUrl = ''
        // this.loginTicket = ''
        this.getLoginQrcode()
      } else if (index === 4) { // 绑定微信
        this.bindQrUrl = ''
        this.bindTicket = ''
        this.getBindQrcode()
      } else { // 绑定手机
        this.bindData.phoneNum = ''
        this.bindData.password = ''
        this.bindData.verifyCode = ''
        this.bindData.phoneVerify = true
        this.bindData.passwordVerify = true
        this.bindData.verifyCodeResult = true
        this.bindData.hasSend = false
      }
      this.viewIndex = index
    },
    getTencentVerify (index) { // 获取腾讯验证
      if (index === 1) { // 注册
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '登录注册', '点击获取注册验证码', this.$getCurPageName()])
        if (!this.registerData.phoneNum) {
          this.$message({ type: 'warning', message: '请先填写手机号码', showClose: true })
          return
        }
        if (!this.$global.phoneReg.test(this.registerData.phoneNum)) {
          this.$message({ type: 'warning', message: '请填写正确的手机号码', showClose: true })
          return
        }
        if (this.registerData.hasSend || this.registerData.isSending) return
        if (this.captchaRegister) this.captchaRegister.show()
      } else if (index === 2) { // 找回密码
        if (!this.resetData.phoneNum) {
          this.$message({ type: 'warning', message: '请先填写手机号码', showClose: true })
          return
        }
        if (!this.$global.phoneReg.test(this.resetData.phoneNum)) {
          this.$message({ type: 'warning', message: '请填写正确的手机号码', showClose: true })
          return
        }
        if (this.resetData.hasSend || this.resetData.isSending) return
        if (this.captchaResetPwd) this.captchaResetPwd.show()
      } else { // 绑定手机
        if (!this.bindData.phoneNum) {
          this.$message({ type: 'warning', message: '请先填写手机号码', showClose: true })
          return
        }
        if (!this.$global.phoneReg.test(this.bindData.phoneNum)) {
          this.$message({ type: 'warning', message: '请填写正确的手机号码', showClose: true })
          return
        }
        if (this.bindData.hasSend || this.bindData.isSending) return
        if (this.captchaRegister) this.captchaRegister.show() // 走注册这边短信验证
      }
    },
    loginFun () {
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '登录注册', '点击登录按钮', this.$getCurPageName()])
      if (!this.$global.phoneReg.test(this.loginData.phoneNum)) {
        this.loginData.phoneVerify = false
        return
      }
      if (this.loginData.password.length === 0) {
        this.loginData.passwordVerify = false
        return
      }
      this.isLogining = true
      this.$axios.post(this.$global.API.loginDo,
        this.$qs.stringify({
          username: this.loginData.phoneNum,
          pwd: MD5(this.loginData.password)
        })
      ).then((res) => {
        this.isLogining = false
        if (res.code === '0' && res.data) {
          if (res.data.isLogin) {
            this.getUserInfo(2)
          } else {
            this.$message({ type: 'error', message: '账号或密码错误', showClose: true })
          }
        } else {
          this.$message({ type: 'error', message: res.msg, showClose: true })
        }
      })
    },
    getUserInfo (index) { // 获取用户信息index,1:微信扫码登录，2：账号密码登录
      this.$axios.get(this.$global.API.userInfo).then((res) => {
        if (res.code === '0' && res.data) {
          if (index === 1) { // 微信扫码
            if (!res.data.user.phone && res.data.user.unbindingCount < 3) { // 提示绑定手机
              this.changeView(5)
            } else { // 绑定了手机，关闭弹窗
              this.beforeClose(1)
            }
          } else if (index === 2) { // 账号密码登录
            if (!res.data.user.wxOpenid && res.data.user.unbindingCount < 3) { // 没绑定微信
              this.changeView(4)
            } else { // 绑定了微信
              this.beforeClose(1)
            }
          }
          if (index) { // 表示是登录成功
            this.$updateStcLog({
              code: 3, // 登录
              uid: res.data.user.id,
              from: this.source || 0
            })
          }
          this.RECORD_USERINFO(res.data.user ? res.data.user : '')
        }
      })
    },
    registerFun () {
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '登录注册', '点击注册按钮', this.$getCurPageName()])
      if (!this.$global.phoneReg.test(this.registerData.phoneNum)) {
        this.registerData.phoneVerify = false
        return
      }
      if (this.registerData.password.length === 0) {
        this.registerData.passwordVerify = false
        return
      }
      if (this.registerData.confirmPwd.length === 0) {
        this.registerData.confirmPwdVerify = false
      } else {
        if (this.registerData.confirmPwd !== this.registerData.password) {
          this.registerData.confirmPwdVerify = false
        } else {
          this.registerData.confirmPwdVerify = true
        }
      }
      if (!this.registerData.confirmPwdVerify) return
      if (this.registerData.verifyCode.length === 0) {
        this.registerData.verifyCodeResult = false
        return
      } else {
        this.registerData.verifyCodeResult = true
      }
      if (!this.provisionObj.checked) {
        this.$message({ type: 'warning', message: '请先阅读并接受服务条款', showClose: true })
        return
      }
      this.$axios.post(this.$global.API.registerDo,
        this.$qs.stringify({
          mobile: this.registerData.phoneNum,
          code: this.registerData.verifyCode,
          pwd: MD5(this.registerData.password),
          platform: 1, // 1:PC,2：手机端h5
          source: this.source || 0 // 0:默认官网
        })
      ).then((res) => {
        if (res.code === '0') {
          if (res.data) { // 表示注册成功后已自动登录
            this.getUserInfo(3) // 3：注册登录
            this.beforeClose(1)
          } else { // 注册成功后未执行自动登录操作
            this.$message({ type: 'success', message: '注册成功，请重新登录', showClose: true })
            this.loginData.phoneNum = this.registerData.phoneNum
            this.loginData.password = ''
            setTimeout(() => { this.viewIndex = 0 }, 1000) // 切换到登录
          }
        } else {
          this.$message({ type: 'error', message: res.msg, showClose: true })
        }
      })
    },
    checkPhone (type) {
      this.$axios.post(this.$global.API.checkPhoneDo,
        this.$qs.stringify({
          'mobile': type === 1 ? this.registerData.phoneNum : this.resetData.phoneNum,
          'type': type // 1:注册，2：找回密码
        })
      ).then((res) => {
        if (res.code !== '0') {
          this.$message({ type: 'error', message: res.msg, showClose: true })
        }
      })
    },
    sendVerifyCode (mobile, type, captchaObj) { // 发送验证码
      this.$axios.post(this.$global.API.getCode,
        this.$qs.stringify({
          type: type, // 1:注册，2：找回密码
          mobile: mobile, // 手机号
          aid: captchaObj.appid, // 腾讯验证aid
          ticket: captchaObj.ticket, // 腾讯验证 ticket
          randstr: captchaObj.randstr // 腾讯验证随机串
        })
      ).then((res) => {
        this.registerData.isSending = false
        this.resetData.isSending = false
        this.bindData.isSending = false
        if (res.code === '0') { // 发送成功
          if (type === 1) { // 注册
            if (this.viewIndex === 1) { // 注册
              this.registerData.hasSend = true
              this.registerData.countSeconds = 59
              // 倒计时60秒
              this.registerData.countFlag = setInterval(() => {
                this.registerData.countSeconds--
                if (this.registerData.countSeconds === 0) {
                  this.registerData.hasSend = false
                  clearInterval(this.registerData.countFlag)
                }
              }, 1000)
            } else { // 绑定手机号
              this.bindData.hasSend = true
              this.bindData.countSeconds = 59
              // 倒计时60秒
              this.bindData.countFlag = setInterval(() => {
                this.bindData.countSeconds--
                if (this.bindData.countSeconds === 0) {
                  this.bindData.hasSend = false
                  clearInterval(this.bindData.countFlag)
                }
              }, 1000)
            }
          } else { // 找回密码
            this.resetData.hasSend = true
            this.resetData.countSeconds = 59
            // 倒计时60秒
            this.resetData.countFlag = setInterval(() => {
              this.resetData.countSeconds--
              if (this.resetData.countSeconds === 0) {
                this.resetData.hasSend = false
                clearInterval(this.resetData.countFlag)
              }
            }, 1000)
          }
        }
      })
    },
    saveFun () {
      if (!this.$global.phoneReg.test(this.resetData.phoneNum)) {
        this.resetData.phoneVerify = false
        return
      }
      if (this.resetData.password.length === 0) {
        this.resetData.passwordVerify = false
        return
      }
      if (this.resetData.confirmPwd.length === 0) {
        this.resetData.confirmPwdVerify = false
      } else {
        if (this.resetData.confirmPwd !== this.resetData.password) {
          this.resetData.confirmPwdVerify = false
        } else {
          this.resetData.confirmPwdVerify = true
        }
      }
      if (!this.resetData.confirmPwdVerify) return
      if (this.resetData.verifyCode.length === 0) {
        this.resetData.verifyCodeResult = false
        return
      } else {
        this.resetData.verifyCodeResult = true
      }
      this.$axios.post(this.$global.API.findPassword,
        this.$qs.stringify({
          mobile: this.resetData.phoneNum,
          code: this.resetData.verifyCode,
          pwd: MD5(this.resetData.password)
        })
      ).then((res) => {
        if (res.code === '0') {
          this.$message({ type: 'success', message: '保存成功', showClose: true })
          this.loginData.phoneNum = this.resetData.phoneNum
          this.loginData.password = ''
          setTimeout(() => {
            this.viewIndex = 0
          }, 3000)
        } else {
          this.$message({ type: 'error', message: res.msg, showClose: true })
        }
      })
    },
    bindFun () { // 手机号绑定成功
      if (!this.$global.phoneReg.test(this.bindData.phoneNum)) {
        this.bindData.phoneVerify = false
        return
      }
      if (!this.bindData.password || this.bindData.password.length === 0) {
        this.bindData.passwordVerify = false
        return
      }
      if (this.bindData.verifyCode.length === 0) {
        this.bindData.verifyCodeResult = false
        return
      }
      this.$axios.post(this.$global.API.bindingDo,
        this.$qs.stringify({
          pwd: MD5(this.bindData.password),
          mobile: this.bindData.phoneNum,
          code: this.bindData.verifyCode
        })
      ).then((res) => {
        if (res.code === '0') {
          setTimeout(() => {
            this.getUserInfo() // 重新用户信息
          }, 2000)
          this.$message({ type: 'success', message: '绑定成功', showClose: true })
          this.beforeClose(1)
        }
      })
    },
    unBindFun () { // 暂不绑定手机或微信
      this.beforeClose(1)
      this.$axios.get(this.$global.API.unBinding).then((res) => {
        if (res.code === '0') {}
      })
    },
    inputPassword (no, e) { // 密码输入校验
      let value = e.target.value
      if (no === 0) {
        this.loginData.passwordVerify = value.length > 0
      } else if (no === 1) {
        this.registerData.passwordVerify = value.length > 0
      } else if (no === 2) {
        this.resetData.passwordVerify = value.length > 0
      } else {
        this.bindData.passwordVerify = value.length > 0
      }
    },
    inputVerifyCode (no, e) { // 验证码输入校验
      let value = e.target.value
      if (no === 1) {
        this.registerData.verifyCodeResult = value.length > 0
      } else if (no === 2) {
        this.resetData.verifyCodeResult = value.length > 0
      } else {
        this.bindData.verifyCodeResult = value.length > 0
      }
    },
    confirmPassword (no, e) { // 确认密码输入校验
      let value = e.target.value
      if (no === 1) {
        this.registerData.confirmPwdVerify = value === this.registerData.password
      } else {
        this.resetData.confirmPwdVerify = value === this.resetData.password
      }
    },
    viewProvision () { // 查看协议
      this.TOGGLE_PROVISION(true)
    },
    checkChange () {
      this.ACCEPT_PROVISION(this.provisionObj.checked)
    },
    seTencentCaptchaRegister () { // 注册实例化
      // eslint-disable-next-line
      this.captchaRegister = new TencentCaptcha('2035369005', (res) => {
        if (res.ret === 0) {
          if (this.viewIndex === 1) { // 注册
            this.registerData.isSending = true
            this.sendVerifyCode(this.registerData.phoneNum, 1, res)
          } else { // 绑定手机号
            this.bindData.isSending = true
            this.sendVerifyCode(this.bindData.phoneNum, 1, res)
          }
        }
      }, { bizState: 'register' })
    },
    seTencentCaptchaResetPwd () { // 密码重置实例化
      // eslint-disable-next-line
      this.captchaResetPwd = new TencentCaptcha('2098934018', (res) => {
        if (res.ret === 0) {
          this.resetData.isSending = true
          this.sendVerifyCode(this.resetData.phoneNum, 2, res)
        }
      }, { bizState: 'register' })
    },
    getLoginQrcode (init) { // 获取微信登录二维码
      clearInterval(this.queryLoginScanFlag)
      this.qrLoading = true
      this.$axios.post(this.$global.API.qrcodeDo,
        this.$qs.stringify({
          source: this.source || 0 // 0:官网来源
        })
      ).then((res) => {
        this.qrLoading = false
        if (res.code === '0') {
          this.loginQrUrl = res.data.url
          this.createQrCode()
          this.loginTicket = res.data.ticket
          // 轮询扫码结果
          this.queryLoginScanFlag = setInterval(() => {
            this.queryScanResult()
          }, 3000)
        }
      })
    },
    getBindQrcode () { // 获取微信绑定二维码（需要登录才可访问）
      clearInterval(this.queryBindScanFlag)
      this.qrLoading1 = true
      this.$axios.get(this.$global.API.getBingQr).then((res) => {
        this.qrLoading1 = false
        if (res.code === '0' && res.data) {
          this.bindQrUrl = res.data.url
          this.bindTicket = res.data.ticket
          this.createQrCode()
          // 轮询扫码结果
          this.queryBindScanFlag = setInterval(() => {
            this.queryWxBindResult()
          }, 3000)
        }
      })
    },
    queryWxBindResult () {
      if (!this.bindTicket) return
      this.$axios.post(this.$global.API.bindWxVerify,
        this.$qs.stringify({
          ticket: this.bindTicket
        })
      ).then((res) => {
        if (res.code === '0' && res.data) {
          clearInterval(this.queryBindScanFlag)
          this.getUserInfo()
          this.beforeClose(1)
        }
      })
    },
    queryScanResult () { // 查询扫码登录结果
      if (!this.loginTicket) return
      this.$axios.post(this.$global.API.verifyDo,
        this.$qs.stringify({
          ticket: this.loginTicket
        })
      ).then((res) => {
        if (res.code === '0' && res.data.isLogin) {
          clearInterval(this.queryLoginScanFlag)
          // eslint-disable-next-line
          _czc.push(['_trackEvent', '登录注册', '扫码登录', this.$getCurPageName()])
          this.getUserInfo(1)
        }
      })
    },
    createQrCode () {
      if (this.viewIndex === 3) { // 微信登录
        this.qrCodeFlag = new QRCode(this.$refs.qrCodeUrl, {
          text: this.loginQrUrl,
          width: 210,
          height: 210,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        })
      } else { // 绑定微信
        this.qrCodeFlag1 = new QRCode(this.$refs.qrCodeUrl1, {
          text: this.bindQrUrl,
          width: 210,
          height: 210,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        })
      }
    },
    refreshCode () {
      this.qrCodeFlag.makeCode(this.loginQrUrl)
    }
  },
  watch: {
    'acceptProvision': function (val) {
      if (val) {
        this.provisionObj.checked = true
      }
    },
    'loginData.phoneNum': function (val) {
      val = val.replace(/\D/g, '').substring(0, 11)
      this.loginData.phoneNum = val
      if (val.length === 11) { // 校验
        if (this.$global.phoneReg.test(val)) {
          this.loginData.phoneVerify = true
        } else {
          this.loginData.phoneVerify = false
        }
      } else {
        this.loginData.phoneVerify = true
      }
    },
    'registerData.phoneNum': function (val) {
      val = val.replace(/\D/g, '').substring(0, 11)
      this.registerData.phoneNum = val
      if (val.length === 11) { // 校验
        if (this.$global.phoneReg.test(val)) {
          this.registerData.phoneVerify = true
          this.checkPhone(1) // 校验手机号
        } else {
          this.registerData.phoneVerify = false
        }
      } else {
        this.registerData.phoneVerify = true
      }
    },
    'resetData.phoneNum': function (val) {
      val = val.replace(/\D/g, '').substring(0, 11)
      this.resetData.phoneNum = val
      if (val.length === 11) { // 校验
        if (this.$global.phoneReg.test(val)) {
          this.resetData.phoneVerify = true
          this.checkPhone(2)
        } else {
          this.resetData.phoneVerify = false
        }
      } else {
        this.resetData.phoneVerify = true
      }
    },
    'bindData.phoneNum': function (val) {
      val = val.replace(/\D/g, '').substring(0, 11)
      this.bindData.phoneNum = val
      if (val.length === 11) { // 校验
        if (this.$global.phoneReg.test(val)) {
          this.bindData.phoneVerify = true
        } else {
          this.bindData.phoneVerify = false
        }
      } else {
        this.bindData.phoneVerify = true
      }
    }
  },
  created () {
    setTimeout(() => { this.showModel = true }, 100)
  },
  mounted () {
    this.seTencentCaptchaRegister()
    this.seTencentCaptchaResetPwd()
    this.getLoginQrcode(true)
  },
  beforeDestroy () {
    clearInterval(this.queryLoginScanFlag)
    clearInterval(this.queryBindScanFlag)
  }
}
</script>
<style lang="scss" scoped>
#loginPop {
  .login-container {
    height: 100%;
    width: 100%;
    position: relative;
    background-image: url('../../images/login_blugimg_small.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    .el-icon-close {
      position: absolute;
      right: 20px;
      top: 20px;
      font-size: 24px;
      color: #8F919D;
      z-index: 100;
    }
    .left-part {
      width: 570px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      .our-target {
        width:100%;
        line-height: 68px;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        padding: 0 42px;
        .giiso {
          width: 133px;
          height: 50px;
          display: inline-block;
          background-image: url('../../images/giiso.png');
          background-repeat: no-repeat;
          background-size: 133px 50px;
          background-position: center center;
          vertical-align: middle;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
          background-color: #fff;
          vertical-align: middle;
          margin-left: 27px;
          margin-right: 27px;
        }
        .target {
          font-size: 48px;
          color: #fff;
          vertical-align: middle;
        }
      }
    }
    .right-part {
      width: 400px;
      height: 540px;
      background-color: #fff;
      position: absolute;
      right: 0;
      top: 0;
      padding: 28px 30px 0 30px;
      .title {
        height: 33px;
        line-height: 33px;
        font-size:24px;
        color: #333333;
      }
      .login-wrap {
        width: 340px;
        .item-list {
          padding-top: 20px;
          li {
            height: 90px;
            margin-bottom: 20px;
            h3 {
              font-size: 18px;
              margin-bottom: 4px;
            }
            .input-wrap {
              position: relative;
              input {
                height: 36px;
                width: 100%;
                font-size: 14px;
                border-bottom: 1px solid #EEE;
                &:focus {
                  border-color: #0E5DFF;
                }
              }
              .error {
                border-color: #FF2C2C;
                &:focus {
                  border-color: #FF2C2C;
                }
              }
              .error-tip {
                color: #FF2323;
                position: absolute;
                right: 0;
                bottom: -20px;
              }
            }
          }
        }
        .login-btn {
          width: 100%;
          height: 60px;
          line-height: 60px;
          border-radius: 30px;
          background-color: #0E5DFF;
          font-size: 18px;
          color: #fff;
          text-align: center;
          cursor: pointer;
          margin-bottom: 32px;
        }
        .tips {
          font-size: 14px;
          color: #aaa;
          .register {
            color: #0E5DFF;
            cursor: pointer;
            margin-left: 8px;
          }
          .forget {
            color: #0E5DFF;
            cursor: pointer;
            float: right;
          }
        }
        .no-account-tips {
          margin-bottom: 32px;
        }
      }
      .other-methods {
        position: relative;
        p {
          height: 1px;
          width: 100%;
          background-color: #EEEEEE;
          margin-top: 7px;
        }
        .label {
          width: 96px;
          height: 18px;
          background-color: #fff;
          display: inline-block;
          font-size: 12px;
          text-align: center;
          color: #8D8D8D;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: -7px;
        }
        .by-wechat {
          width: 30px;
          height: 30px;
          display: inline-block;
          background-image: url('../../images/icons/wechat_icon_1.png');
          background-size: 27px 20px;
          background-position: center center;
          background-repeat: no-repeat;
          cursor: pointer;
          position: absolute;
          left: 50%;
          top: 30px;
          transform: translateX(-50%);
        }
        .by-tip {
          height: 18px;
          font-size: 12px;
          color: #666666;
          position: absolute;
          left: 50%;
          top: 70px;
          transform: translateX(-50%);
        }
        .by-tip1 {
          top: 60px;
        }
        .by-phone {
          width: 42px;
          height: 42px;
          display: inline-block;
          background-image: url('../../images/icons/phone_icon.png');
          background-size: 16px 23px;
          background-position: center center;
          background-repeat: no-repeat;
          cursor: pointer;
          position: absolute;
          left: 50%;
          top: 30px;
          transform: translateX(-50%);
        }
      }
      .register-wrap, .find-wrap, .wechat-wrap {
        width: 340px;
        .label-wrap {
          height: 32px;
          display: inline-block;
          position: relative;
          left: 50%;
          transform: translateX(-50%);
          .label {
            width: 90px;
            height: 25px;
            display: inline-block;
            font-size: 18px;
            // font-family: PingFangSC-Semibold;
            vertical-align: middle;
            font-weight: bold;
            border-left: 1px solid #e5e5e5;
            margin-left: 18px;
            padding-left: 18px;
          }
        }
        .item-list {
          padding-top: 20px;
          position: relative;
          li {
            height: 90px;
            h3 {
              font-size: 18px;
              margin-bottom: 4px;
            }
            .input-wrap {
              position: relative;
              input {
                height: 36px;
                width: 100%;
                font-size: 14px;
                border-bottom: 1px solid #EEE;
                &:focus {
                  border-color: #0E5DFF;
                }
              }
              .error {
                border-color: #FF2C2C;
                &:focus {
                  border-color: #FF2C2C;
                }
              }
              .error-tip {
                color: #FF2323;
                position: absolute;
                right: 0;
                bottom: -20px;
              }
              .getcode {
                height: 36px;
                line-height: 36px;
                display: inline-block;
                font-size: 16px;
                color: #0E5DFF;
                cursor: pointer;
                position: absolute;
                right: 0;
                top: 0;
              }
              .code-sended {
                color:#888;
                cursor: default;
              }
            }
          }
        }
        .register-btn, .findback-btn {
          width: 100%;
          height: 50px;
          line-height: 50px;
          border-radius: 30px;
          background-color: #0E5DFF;
          font-size: 18px;
          color: #fff;
          text-align: center;
          cursor: pointer;
          margin-bottom: 24px;
        }
        .register-btn {
          margin-bottom: 10px;
        }
        .service-provision {
          margin-bottom: 10px;
          font-size: 12px;
          position: relative;
          .tip {
            margin-left: 6px;
            a {
              color: #0E5DFF;
            }
          }
          .tips {
            font-size: 12px;
            color: #aaa;
            text-align: right;
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            .has-account {
              color: #0E5DFF;
              cursor: pointer;
            }
          }
        }
      }
      .find-wrap {
        .findback-btn {
          margin-bottom: 20px;
        }
        .tips {
          .has-account {
            color: #0E5DFF;
            cursor: pointer;
          }
        }
      }
      .wechat-wrap {
        padding-top: 25px;
        .qr-wrap {
          width: 210px;
          height: 210px;
          // border: 1px solid #333;
          margin: 0 auto 28px auto;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .scan-tip {
          color: #333333;
          text-align: center;
          margin-bottom: 12px;
        }
        .not-bind{
          color: #8D8D8D;
          text-align: center;
          cursor: pointer;
          margin-bottom: 25px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
#loginPop {
  .el-dialog__body {
    width: 100%;
    height: 100%;
    padding: 0;
    position: relative;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog {
    height: 540px;
    border-radius: 6px;
    overflow: hidden;
  }
}
</style>
