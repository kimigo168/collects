<template>
  <el-dialog id="bind-phone-pop" :visible.sync="showModel" top="15vh" width="402px!important" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeClose" :show-close="true">
    <div class="wrap">
      <h3 class="title">绑定手机</h3>
      <ul class="item-wrap">
        <li>
          <p class="label">手机号</p>
          <input type="text" v-model="phoneNum" :class="{'error': !phoneNumVerify}" placeholder="请输入您的手机号">
          <p class="error-tip" v-if="!phoneNumVerify">{{phoneNum.length==0?'请输入手机号码':'请输入正确的手机号'}}</p>
        </li>
        <li>
          <p class="label">密码</p>
          <input @input="inputPassword(1, $event)" type="password" v-model="password" :class="{'error': !passwordVerify}" placeholder="请输入您的密码">
          <p class="error-tip" v-if="!passwordVerify">{{password.length==0?'请输入密码':''}}</p>
        </li>
        <li>
          <p class="label">确认密码</p>
          <input @input="inputPassword(2, $event)" type="password" v-model="confirmPwd" :class="{'error': !confirmPwdVerify}" placeholder="请重新输入您的密码">
          <p class="error-tip" v-if="!confirmPwdVerify">{{confirmPwd.length==0?'请重新输入密码':password!==confirmPwd?'两次密码输入不一致':''}}</p>
        </li>
        <li>
          <p class="label">验证码</p>
          <input type="text" v-model="verifyCode" :class="{'error': !verifyCodeResult}" placeholder="请输入验证码">
          <span class="getcode" :class="{'code-sended': hasSend}" @click="getTencentVerify" v-loading="isSending" >{{hasSend?(countSeconds+'s后重发'):'获取验证码'}}</span>
          <p class="error-tip" v-if="!verifyCodeResult">{{verifyCode.length==0?'请输入验证码':'验证码错误'}}</p>
        </li>
      </ul>
      <button class="confirm-btn" @click="confirmFun">确定</button>
    </div>
  </el-dialog>
</template>
<script>
import MD5 from 'md5'
export default {
  name: 'bindPhone',
  data () {
    return {
      showModel: true,
      phoneNum: '',
      password: '',
      confirmPwd: '',
      verifyCode: '',
      phoneNumVerify: true, // 手机校验结果
      passwordVerify: true, // 密码校验结果
      confirmPwdVerify: true, // 确认密码校验结果
      verifyCodeResult: true, // 验证码校验结果
      hasSend: false, // 是否发送了验证码
      isSending: false, // 发送中
      countSeconds: 59,
      countFlag: null, // 计时器
      captchaRegister: null
    }
  },
  watch: {
    'phoneNum': function (val) {
      val = val.replace(/\D/g, '').substring(0, 11)
      this.phoneNum = val
      if (val.length === 11) { // 校验
        if (this.$global.phoneReg.test(val)) {
          this.phoneNumVerify = true
        } else {
          this.phoneNumVerify = false
        }
      } else {
        this.phoneNumVerify = true
      }
    }
  },
  methods: {
    checkPhone () { // 验证手机是否注册
      this.$axios.post(this.$global.API.checkPhoneDo,
        this.$qs.stringify({
          'mobile': this.phoneNum,
          'type': 1
        })
      ).then((res) => {
        if (res.code === '0') {

        } else {
          this.$message({ type: 'error', message: res.msg, showClose: true })
        }
      })
    },
    beforeClose () {
      clearInterval(this.countFlag)
      this.$emit('fClose')
    },
    inputPassword (index, e) {
      let value = e.target.value
      if (index === 1) {
        this.passwordVerify = value.length > 0
      } else {
        // this.confirmPwdVerify = value.length > 0
        if (this.confirmPwd !== this.password) {
          this.confirmPwdVerify = false
        } else {
          this.confirmPwdVerify = true
        }
      }
    },
    confirmFun () {
      if (!this.$global.phoneReg.test(this.phoneNum)) {
        this.phoneVerify = false
        return
      }
      if (this.password.length === 0) {
        this.passwordVerify = false
        return
      }
      if (this.confirmPwd.length === 0) {
        this.confirmPwdVerify = false
        return
      } else {
        if (this.confirmPwd !== this.password) {
          this.confirmPwdVerify = false
          return
        } else {
          this.confirmPwdVerify = true
        }
      }
      if (this.verifyCode.length === 0) {
        this.verifyCodeResult = false
        return
      } else {
        this.verifyCodeResult = true
      }
      this.$axios.post(this.$global.API.bindingDo,
        this.$qs.stringify({
          pwd: MD5(this.password),
          mobile: this.phoneNum,
          code: this.verifyCode
        })
      ).then((res) => {
        if (res.code === '0') {
          this.$emit('bindSuccess')
        }
      })
    },
    seTencentCaptchaRegister () {
      // eslint-disable-next-line
      this.captchaRegister = new TencentCaptcha('2035369005', (res) => {
        if (res.ret === 0) {
          this.isSending = true
          this.sendVerifyCode(this.phoneNum, 1, res)
        }
      }, { bizState: 'register' })
    },
    getTencentVerify () {
      if (!this.phoneNum) {
        this.phoneNumVerify = false
        return
      }
      if (!this.$global.phoneReg.test(this.phoneNum)) {
        this.phoneNumVerify = false
        return
      }
      if (this.hasSend || this.isSending) return
      if (this.captchaRegister) this.captchaRegister.show()
    },
    sendVerifyCode (mobile, type, captchaObj) { // 发送验证码
      this.$axios.post(this.$global.API.getCode,
        this.$qs.stringify({
          type: type, // 1：注册，2：找回密码
          mobile: mobile,
          aid: captchaObj.appid, // 腾讯验证aid
          ticket: captchaObj.ticket, // 腾讯验证 ticket
          randstr: captchaObj.randstr // 腾讯验证随机串
        })
      ).then((res) => {
        this.isSending = false
        if (res.code === '0') { // 发送成功
          this.hasSend = true
          this.countSeconds = 59
          // 倒计时60s
          this.countFlag = setInterval(() => {
            this.countSeconds--
            if (this.countSeconds === 0) {
              this.hasSend = false
              clearInterval(this.countFlag)
            }
          }, 1000)
        }
      })
    }
  },
  created () {
    this.seTencentCaptchaRegister()
  },
  beforeDestroy () {
    clearInterval(this.countFlag)
  }
}
</script>
<style lang="scss" scoped>
#bind-phone-pop {
  .wrap {
    .title {
      font-size: 20px;
      color: #333;
      font-weight: bold;
    }
    .item-wrap {
      padding-top: 4px;
      margin-bottom: 40px;
      li {
        height: 90px;
        position: relative;
        padding-top: 30px;
        .label {
          color: #333333;
          font-size: 18px;
          margin-bottom: 2px;
        }
        input {
          height: 30px;
          width: 100%;
          border-bottom: 1px solid #EEEEEE;
          &::-webkit-input-placeholder {
            color: #999;
            font-size: 14px;
          }
          &::-moz-placeholder {
            color: #999;
            font-size: 14px;
          }
          &:-moz-placeholder {
            color: #999;
            font-size: 14px;
          }
          &:-ms-input-placeholder{
            color: #999;
            font-size: 14px;
          }
          &:focus {
            border-color: #0E5DFF;
          }
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
          bottom: 4px;
        }
        .code-sended {
          color:#888;
          cursor: default;
        }
        .error {
          border-color: #FF2C2C;
          &:focus{
            border-color: #FF2C2C
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
    .confirm-btn {
      height: 50px;
      width: 100%;
      line-height: 50px;
      border-radius: 25px;
      background-color: #0E5DFF;
      color: #fff;
      text-align: center;
      font-size: 18px;
    }
  }
}
</style>
<style lang="scss">
#bind-phone-pop {
  .el-dialog {
    border-radius: 6px;
  }
  .el-dialog__body {
    height: 510px;
    padding: 0 30px;
  }
}
</style>
