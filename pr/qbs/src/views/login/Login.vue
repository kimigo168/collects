<template>
  <div id="login">
    <div class="login-wrap" v-loading.lock="loading" @keyup.enter="loginFun">
      <div class="logo-wrap">
        <img class="logo" src="../../images/login_logo.png" alt="">
      </div>
      <div class="input-item account-item">
        <i class="icon"></i>
        <input v-model="loginForm.account" type="text" placeholder="请输入账号">
        <span v-if="loginForm.account" class="delete" @click="clearAccount"></span>
        <p class="error-tip" v-if="showErrorTip1">请输入账号</p>
      </div>
      <div class="input-item psw-item">
        <i class="icon"></i>
        <input type="password" v-model="loginForm.password" placeholder="请输入密码">
        <span v-if="loginForm.password" class="delete" @click="clearPsw"></span>
        <p class="error-tip" v-if="showErrorTip2">请输入密码</p>
      </div>
      <button @click="loginFun" class="login-btn" :class="{'login-active':loginForm.password&&loginForm.account}">登录</button>
      <!-- <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px">
        <el-form-item  prop="account" style="width:316px;">
          <el-input type="text" v-model="loginForm.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item  prop="password" style="width:316px;">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loginFun">登录</el-button>
        </el-form-item>
      </el-form> -->
    </div>
  </div>
</template>
<script>
import MD5 from 'md5'
import { mapMutations } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      loading: false,
      showErrorTip1: false,
      showErrorTip2: false,
      loginForm: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['RECORD_USERINFO']),
    clearAccount () {
      this.loginForm.account = ''
    },
    clearPsw () {
      this.loginForm.password = ''
    },
    loginFun () {
      if (!this.loginForm.account) {
        this.showErrorTip1 = true
        return
      }
      if (!this.loginForm.password) {
        this.showErrorTip2 = true
        return
      }
      this.loading = true
      this.$axios.post(this.$global.API.login,
        this.$qs.stringify({
          userName: this.loginForm.account,
          password: MD5(this.loginForm.password)
        })
      ).then((res) => {
        this.loading = false
        if (res.code === '0') {
          this.RECORD_USERINFO(res.data)
          this.$router.replace({ path: '/home' })
        }
      })
    }
  },
  watch: {
    'loginForm.account': function (val) {
      if (val.length > 0) {
        this.showErrorTip1 = false
      } else {
        this.showErrorTip1 = true
      }
    },
    'loginForm.password': function (val) {
      if (val.length > 0) {
        this.showErrorTip2 = false
      } else {
        this.showErrorTip2 = true
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
  background-color: #EEF2F6;
  .login-wrap {
    width: 370px;
    height: 480px;
    background-color: #fff;
    border: 1px solid #ccc;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .logo-wrap {
      width: 177px;
      height: 45px;
      margin: 50px auto 64px auto;
    }
    .input-item {
      height: 40px;
      width: 250px;
      margin-bottom: 50px;
      margin: 0 auto 50px auto;
      position: relative;
      input {
        height: 40px;
        width: 250px;
        border-radius: 20px;
        border: 1px solid #E4E4E4;
        text-indent: 40px;
        &:focus {
          border-color: #0E5DFF;
        }
      }
      .delete {
        display: inline-block;
        width: 16px;
        height: 16px;
        position: absolute;
        right: 17px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        background-image: url('../../images/icons/delete_icon.png');
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;
      }
      .icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        background-repeat: no-repeat;
        background-size: contain;
        position: absolute;
        left: 17px;
        top: 50%;
        transform: translateY(-50%);
      }
      .error-tip {
        font-size: 12px;
        position: absolute;
        left: 18px;
        bottom: -20px;
        color: #f00;
      }
    }
    .account-item {
      .icon {
        background-image: url('../../images/icons/account_icon.png');
      }
    }
    .psw-item {
      .icon {
        background-image: url('../../images/icons/lock_icon.png');
      }
    }
    .login-btn {
      width:250px;
      height:40px;
      background:#0A97ED;
      color: #fff;
      border-radius:30px;
      margin-top: 40px;
    }
  }
}

</style>
