<template>
  <el-dialog id="limit-pop" :visible.sync="showModel" top="15vh" width="480px!important" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeClose" :show-close="true">
    <div class="wrap">
      <h3>您今天的免费体验次数已用尽！</h3>
      <p class="tip">充值购买VIP立享任意使用</p>
      <div class="bot-btns">
        <button class="confirm-btn" @click="confirmFun">立即充值</button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { setTimeout } from 'timers'
import { mapMutations } from 'vuex'

export default {
  name: 'limitPop',
  data () {
    return {
      showModel: false
    }
  },
  methods: {
    ...mapMutations([
      'TOGGLE_LIMITPOP'
    ]),
    beforeClose () {
      this.TOGGLE_LIMITPOP(false)
    },
    confirmFun () {
      this.TOGGLE_LIMITPOP(false)
      this.$router.push({ path: '/user', query: { reCharge: 1 } })
    }
  },
  created () {
    setTimeout(() => {
      this.showModel = true
    })
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 220px;
  text-align: center;
  h3 {
    font-family: PingFangSC-Semibold;
    font-size: 18px;
    color: #333333;
    margin-top: 60px;
  }
  .tip {
    width: 320px;
    font-size: 14px;
    line-height: 20px;
    color: #999999;
    margin:20px auto 0 auto;
  }
  .bot-btns {
    width: 280px;
    margin: 56px auto 0 auto;
    text-align: center;
    button {
      width: 120px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      border-radius: 16px;
      font-size: 16px;
      background-color: #fff;
    }
    .close-btn {
      border: 1px solid #DEDEDE;
      color: #999999;
      margin-right: 40px;
    }
    .confirm-btn {
      color: #fff;
      background-color: #0E5DFF;
    }
  }
}
</style>
<style lang="scss">
#limit-pop {
  .el-dialog {
    border-radius: 10px;
  }
  .el-dialog__body {
    padding: 0 20px;
  }
}
</style>
