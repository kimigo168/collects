<template>
  <div id="login">
    <div class="container">
      <div class="our-target">
        <span class="giiso"></span><i class="dot"></i><span class="target">让写作更简单</span>
      </div>
      <!-- 登录 -->
      <div class="login-wrap" v-if="viewIndex===0">
        <div class="logo"></div>
        <ul class="item-list clearfix" @keyup.enter="loginFun">
          <li>
            <h3>手机号</h3>
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
        <p class="tips clearfix">还没有账号？<span class="register" @click="changeView(1)">马上注册！</span><span class="forget"  @click="changeView(2)">忘记密码？</span></p>
      </div>
      <!-- 注册 -->
      <div class="register-wrap" v-if="viewIndex===1">
        <div class="label-wrap">
          <span class="logo"></span><span class="label">注册</span>
        </div>
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
              <span class="getcode" :class="{'code-sended': registerData.hasSend}" @click="getVerifyCode(1)">{{registerData.hasSend?(registerData.countSeconds+'s后重发'):'获取验证码'}}</span>
              <p class="error-tip" v-if="!registerData.verifyCodeResult">{{registerData.verifyCode.length==0?'请输入验证码':'验证码错误'}}</p>
            </div>
          </li>
        </ul>
        <button class="register-btn" @click="registerFun">注册</button>
        <div class="service-provision">
          <el-checkbox v-model="provisionObj.checked"></el-checkbox><span class="tip">我已阅读并接受<a @click="viewProvision" href="javascript:void(0)">《服务条款》</a></span>
        </div>
        <p class="tips"><span class="has-account"  @click="changeView(0)">已有账号？点此登录</span></p>
      </div>
      <!-- 找回密码 -->
      <div class="find-wrap" v-if="viewIndex===2">
        <div class="label-wrap">
          <span class="logo"></span><span class="label">找回密码</span>
        </div>
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
              <span class="getcode" :class="{'code-sended': resetData.hasSend}" @click="getVerifyCode(2)">{{resetData.hasSend?(resetData.countSeconds+'s后重发'):'获取验证码'}}</span>
              <p class="error-tip" v-if="!resetData.verifyCodeResult">{{resetData.verifyCode.length==0?'请输入验证码':'验证码错误'}}</p>
            </div>
          </li>
        </ul>
        <button class="findback-btn" @click="saveFun">保存</button>
        <p class="tips"><span class="has-account"  @click="changeView(0)">已有账号？点此登录</span></p>
      </div>
    </div>
    <div class="contact-wrap">
      <ul>
        <li data-title="电话：0755-86720697"><i class="phone"></i></li>
        <li data-title="邮箱：contact@giiso.com"><i class="email"></i></li>
        <li data-title="qq：2020601975"><i class="qq"></i></li>
      </ul>
    </div>
    <provision-pop v-if="provisionObj.isShow" @fClose="provisionObj.isShow=false" @fAccept="acceptFun"></provision-pop>
  </div>
</template>
<script>
import { setInterval, clearInterval, setTimeout } from 'timers'
import MD5 from 'md5'
import { mapMutations } from 'vuex'
import provisionPop from './provisionPop'
export default {
  name: 'login',
  data () {
    return {
      viewIndex: 0, // 0登录，1注册，2忘记密码
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
        countFlag: null // 计时器
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
        countFlag: null // 计时器
      },
      provisionObj: {
        checked: false,
        isShow: false
      }
    }
  },
  components: {
    provisionPop
  },
  methods: {
    ...mapMutations([
      'RECORD_USERINFO'
    ]),
    changeView (index) {
      if (index === 0) {
        this.loginData.phoneNum = ''
        this.loginData.password = ''
        this.loginData.verifyCode = ''
        this.loginData.phoneVerify = true
        this.loginData.passwordVerify = true
      } else if (index === 1) {
        this.registerData.phoneNum = ''
        this.registerData.password = ''
        this.registerData.confirmPwd = ''
        this.registerData.verifyCode = ''
        this.registerData.phoneVerify = true
        this.registerData.passwordVerify = true
        this.registerData.confirmPwdVerify = true
        this.registerData.verifyCodeResult = true
        this.registerData.hasSend = false
      } else {
        this.resetData.phoneNum = this.loginData.phoneNum
        this.resetData.password = ''
        this.resetData.confirmPwd = ''
        this.resetData.verifyCode = ''
        this.resetData.phoneVerify = true
        this.resetData.passwordVerify = true
        this.resetData.confirmPwdVerify = true
        this.resetData.verifyCodeResult = true
        this.resetData.hasSend = false
      }
      this.viewIndex = index
    },
    getVerifyCode (index) { // 获取验证码，区分注册和密码重置
      if (index === 1) {
        if (this.registerData.hasSend) return
        this.registerData.hasSend = true
        this.sendVerifyCode()
        this.registerData.countSeconds = 59
        // 倒计时60秒
        this.registerData.countFlag = setInterval(() => {
          this.registerData.countSeconds--
          if (this.registerData.countSeconds === 0) {
            this.registerData.hasSend = false
            clearInterval(this.registerData.countFlag)
          }
        }, 1000)
      } else {
        if (this.resetData.hasSend) return
        this.resetData.hasSend = true
        this.sendVerifyCode()
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
    },
    loginFun () {
      if (!this.$global.phoneReg.test(this.loginData.phoneNum)) {
        this.loginData.phoneVerify = false
        return
      }
      if (this.loginData.password.length === 0) {
        this.loginData.passwordVerify = false
        return
      }
      this.isLogining = true
      this.$axios.post(this.$global.API.login,
        this.$qs.stringify({
          phone: this.loginData.phoneNum,
          password: MD5(this.loginData.password)
        })
      ).then((res) => {
        this.isLogining = false
        if (res.code === '0') {
          this.RECORD_USERINFO(res.data)
          this.$router.push({
            path: '/'
          })
        } else {
          this.$message({ type: 'error', message: res.msg, showClose: true })
        }
      })
    },
    registerFun () {
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
      this.$axios.post(this.$global.API.register,
        this.$qs.stringify({
          mCode: this.registerData.verifyCode,
          password: MD5(this.registerData.password)
        })
      ).then((res) => {
        if (res.code === '0') {
          this.$message({ type: 'success', message: '注册成功，请重新登录', showClose: true })
          // 切到登录
          this.loginData.phoneNum = this.registerData.phoneNum
          this.loginData.password = ''
          setTimeout(() => {
            this.viewIndex = 0
          }, 1000)
        } else {
          this.$message({ type: 'error', message: res.msg, showClose: true })
        }
      })
    },
    checkPhone (type) {
      this.$axios.post(this.$global.API.checkPhone,
        this.$qs.stringify({
          'phone': type === 1 ? this.registerData.phoneNum : this.resetData.phoneNum,
          'type': type
        })
      ).then((res) => {
        if (res.code === '0') {

        } else {
          this.$message({ type: 'error', message: res.msg, showClose: true })
        }
      })
    },
    sendVerifyCode () {
      this.$axios.get(this.$global.API.sendSMS).then((res) => {
        console.log('res', res)
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
      this.$axios.post(this.$global.API.resetPwd,
        this.$qs.stringify({
          mCode: this.resetData.verifyCode,
          password: MD5(this.resetData.password)
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
    inputPassword (no, e) {
      let value = e.target.value
      if (no === 0) {
        this.loginData.passwordVerify = value.length > 0
      } else if (no === 1) {
        this.registerData.passwordVerify = value.length > 0
      } else {
        this.resetData.passwordVerify = value.length > 0
      }
    },
    inputVerifyCode (no, e) {
      let value = e.target.value
      if (no === 1) {
        this.registerData.verifyCodeResult = value.length > 0
      } else {
        this.resetData.verifyCodeResult = value.length > 0
      }
    },
    confirmPassword (no, e) {
      let value = e.target.value
      if (no === 1) {
        this.registerData.confirmPwdVerify = value === this.registerData.password
      } else {
        this.resetData.confirmPwdVerify = value === this.resetData.password
      }
    },
    viewProvision () {
      this.provisionObj.isShow = true
    },
    acceptFun () {
      this.provisionObj.isShow = false
      this.provisionObj.checked = true
    }
  },
  watch: {
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
          this.checkPhone(1)
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
    }
  },
  created () {

  }
}
</script>
<style lang="scss" scoped>
#login {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url('../../images/login_bgimg1.png');
  background-repeat: no-repeat;
  background-size: cover;
}
.container {
  width: 1120px;
  height: 658px;
  background: #FFFFFF;
  border-radius: 6px;
  overflow: hidden;
  background-image: url('../../images/login_blueimg_big.png');
  background-position: center center;
  background-size: 1120px 658px;
  background-repeat: no-repeat;
  box-shadow: 0 2px 54px 0 rgba(0,0,0,0.23);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.our-target {
  height: 68px;
  width:630px;
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
.login-wrap {
  width: 490px;
  height: 658px;
  padding: 45px 68px 0 68px;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: #fff;
  .logo {
    // width: 125px;
    // height: 46px;
    width: 215px;
    height: 32px;
    margin: 0 auto;
    // background-image: url('../../images/login_logo.png');
    // background-size: 125px 46px;
    background-image: url('../../images/write_robbot.png');
    background-size: 215px 32px;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .item-list {
    margin-bottom: 42px;
    li {
      height: 120px;
      padding-top: 42px;
      h3 {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 14px;
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
    margin-bottom: 52px;
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
}
.register-wrap, .find-wrap {
  width: 490px;
  height: 658px;
  padding: 38px 68px 0 68px;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: #fff;
  .label-wrap {
    height: 32px;
    display: inline-block;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    .logo {
      // width: 88px;
      height: 32px;
      width: 215px;
      display: inline-block;
      vertical-align: middle;
      // background-image: url('../../images/login_logo_1.png');
      background-image: url('../../images/write_robbot.png');
      background-size: contain;
      background-position: center center;
      // background-size: 88px 32px;
      background-repeat: no-repeat;
    }
    .label {
      width: 90px;
      height: 25px;
      display: inline-block;
      font-size: 18px;
      font-family: PingFangSC-Semibold;
      vertical-align: middle;
      font-weight: bold;
      border-left: 1px solid #e5e5e5;
      margin-left: 18px;
      padding-left: 18px;
    }
  }
  .item-list {
    margin-bottom: 30px;
    position: relative;
    li {
      height: 106px;
      padding-top: 22px;
      h3 {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 14px;
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
    height: 60px;
    line-height: 60px;
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
    text-align: center;
    font-size: 12px;
    .tip {
      margin-left: 6px;
      a {
        color: #0E5DFF;
      }
    }
  }
  .tips {
    font-size: 14px;
    color: #aaa;
    text-align: right;
    .has-account {
      color: #0E5DFF;
      cursor: pointer;
    }
  }
}
.contact-wrap {
  height: 214px;
  width: 58px;
  position: absolute;
  right: 40px;
  bottom: 40px;
  ul {
    li {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0 10px 20px 0 rgba(114,122,139,0.30);
      position: relative;
      margin-bottom: 20px;
      &:hover {
        background-image: linear-gradient(180deg, #4D87FF 0%, #0EA0FF 100%);
      }
      &:hover::after {
        content: attr(data-title);    //取到data-title属性的值
        width: 173px;
        height: 33px;
        text-align: center;
        line-height: 33px;
        display: inline-block;
        background-color: #606670;
        color: #fff;
        border-radius: 6px;
        border-radius: 6px;
        position: absolute;
        top: 12px;
        left: -180px;
      }
      &:first-child {
        &:hover::after {
          width: 173px;
          left: -178px;
        }
        &:hover {
          .phone {
            background-image: url('../../images/icons/contact_phone_1.png');
          }
        }
      }
      &:nth-child(2) {
        &:hover::after {
          width: 180px;
          left: -184px;
        }
        &:hover {
          .email {
            background-image: url('../../images/icons/contact_email_1.png');
          }
        }
      }
      &:last-child {
        margin-bottom: 0;
        &:hover::after {
          width: 140px;
          left: -144px;
        }
        &:hover {
          .qq {
            background-image: url('../../images/icons/contact_qq_1.png');
          }
        }
      }
      i {
        display: inline-block;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-repeat: no-repeat;
        background-position: center center;
        // transition: all .3s ease-in;
      }
      .phone {
        width: 23px;
        height: 23px;
        background-size: 23px 23px;
        background-image: url('../../images/icons/contact_phone.png');
      }
      .email {
        width: 24px;
        height: 18px;
        background-size: 24px 18px;
        background-image: url('../../images/icons/contact_email.png');
      }
      .qq {
        width: 20px;
        height: 24px;
        background-size: 20px 24px;
        background-image: url('../../images/icons/contact_qq.png');
      }
    }
  }
}
@media screen and (max-width: 1400px) {
  .container {
    width: 970px;
    height: 540px;
    background-image: url('../../images/login_blugimg_small.png');
    background-size: 970px 540px;
  }
  .our-target {
    width:570px;
  }
  .login-wrap {
    width: 400px;
    height: 540px;
    padding: 30px 30px 0 30px;
    .item-list {
      margin-bottom: 30px;
      li {
        height: 100px;
        padding-top: 24px;
      }
    }
    .login-btn {
      margin-bottom: 24px;
    }
    .tips {
      font-size: 14px;
      color: #aaa;
    }
  }
  .register-wrap, .find-wrap {
    width: 400px;
    height: 540px;
    padding: 30px 30px 0 30px;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: #fff;
    .label-wrap {
      height: 32px;
      display: inline-block;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      .logo {
        width: 88px;
        // width: 215px;
        height: 32px;
        display: inline-block;
        vertical-align: middle;
        // background-image: url('../../images/login_logo_1.png');
        background-image: url('../../images/write_robbot.png');
        background-size: contain;
        background-position: center center;
        // background-size: 88px 32px;
        background-repeat: no-repeat;
      }
      .label {
        width: 90px;
        height: 25px;
        display: inline-block;
        font-size: 18px;
        vertical-align: middle;
        font-weight: bold;
        border-left: 1px solid #e5e5e5;
        margin-left: 18px;
        padding-left: 18px;
      }
    }
    .item-list {
      margin-bottom: 30px;
      li {
        height: 90px;
        padding-top: 22px;
        h3 {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 13.8px;
        }
        .input-wrap {
          input {
            height: 36px;
            width: 100%;
            font-size: 14px;
            border-bottom: 1px solid #EEE;
            &:focus {
              border-color: #0E5DFF;
            }
          }
          .error-tip {
            color: #FF2323;
            position: absolute;
            right: 0;
            bottom: -22px;
          }
        }
      }
    }
    .register-btn {
      width: 100%;
      height: 46px;
      line-height: 46px;
      border-radius: 23px;
      background-color: #0E5DFF;
      font-size: 18px;
      color: #fff;
      text-align: center;
      cursor: pointer;
      margin-bottom: 7px;
    }
    .tips {
      font-size: 14px;
      color: #aaa;
      text-align: right;
      .has-account {
        color: #0E5DFF;
        cursor: pointer;
        font-size: 12px;
      }
    }
  }
  .register-wrap {
    .item-list {
      margin-bottom: 20px;
    }
    .service-provision {
      margin-bottom: 4px;
    }
  }
}

</style>
