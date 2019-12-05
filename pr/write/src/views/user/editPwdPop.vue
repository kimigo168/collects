<template>
  <el-dialog id="editPwdPop" :visible.sync="showModel" top="15vh" width="400px!important" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeClose" :show-close="true">
    <div class="wrap" v-loading="loading">
      <h3 class="title">修改密码</h3>
      <ul class="item-wrap">
        <li>
          <p class="label">原密码</p>
          <input type="password" @input="inputPassword(1, $event)" :class="{'error': !oldPwdVerify}" v-model="oldPwd" placeholder="请输入您的密码">
          <p class="error-tip" v-if="!oldPwdVerify">请输入原密码</p>
        </li>
        <li>
          <p class="label">新密码</p>
          <input type="password" :class="{'error': !newPwdVerify}"  @input="inputPassword(2, $event)" v-model="newPwd" placeholder="请输入您的新密码">
          <p class="error-tip" v-if="!newPwdVerify">{{newPwd===oldPwd?'新密码不能与原密码相同':newPwd.length===0?'请输入新密码':''}}</p>
        </li>
        <li>
          <p class="label">确认新密码</p>
          <input type="password" :class="{'error': !newPwdConfirmVerify}"   @input="inputPassword(3, $event)" v-model="newPwdConfirm" placeholder="请再一次输入您的新密码">
          <p class="error-tip" v-if="!newPwdConfirmVerify">{{newPwd!==newPwdConfirm?'确认密码错误':newPwdConfirm.length==0?'确认密码不能为空':''}}</p>
        </li>
      </ul>
      <button class="confirm-btn" @click="confirmFun">确定</button>
    </div>
  </el-dialog>
</template>
<script>
import MD5 from 'md5'
export default {
  name: 'editPwdPop',
  data () {
    return {
      showModel: true,
      oldPwd: '', // 原密码
      newPwd: '', // 新密码
      newPwdConfirm: '', // 确认新密码
      oldPwdVerify: true,
      newPwdVerify: true,
      newPwdConfirmVerify: true,
      loading: false
    }
  },
  methods: {
    inputPassword (no, e) {
      let value = e.target.value
      if (no === 1) {
        this.oldPwdVerify = value.length > 0
      } else if (no === 2) {
        this.newPwdVerify = value.length > 0
      } else {
        this.newPwdConfirmVerify = value.length > 0
      }
    },
    beforeClose () {
      this.$emit('fClose')
    },
    confirmFun () {
      if (!this.oldPwd) {
        this.oldPwdVerify = false
        return
      }
      if (!this.newPwd) {
        this.newPwdVerify = false
        return
      }
      if (this.oldPwd === this.newPwd) {
        this.newPwdVerify = false
        return
      }
      if (!this.newPwdConfirm) {
        this.newPwdConfirmVerify = false
        return
      }
      if (this.newPwd !== this.newPwdConfirm) {
        this.newPwdConfirmVerify = false
        return
      }

      this.loading = true
      this.$axios.post(this.$global.API.updatePwd,
        this.$qs.stringify({
          old_password: MD5(this.oldPwd),
          new_password: MD5(this.newPwd)
        })
      ).then((res) => {
        this.loading = false
        if (res.code === '0') {
          this.$message({ type: 'success', message: '修改成功', showClose: true })
          this.beforeClose()
        } else {
          this.$message({ type: 'error', message: res.msg, showModel: true })
        }
      })
    }
  },
  created () {

  }
}
</script>
<style lang="scss" scoped>
#editPwdPop {
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
        .error {
          border-color: #FF2C2C
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
#editPwdPop {
  .el-dialog {
    border-radius: 6px;
  }
  .el-dialog__body {
    padding: 0 30px;
    height: 420px;
  }
}
</style>
