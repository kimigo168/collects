<template>
  <el-dialog id="check-pop" title="稿件查重" :visible.sync="showModel" top="15vh" width="480px!important" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeClose" :show-close="true">
    <div class="wrap">
      <h3>确定进行稿件查重？</h3>
      <p class="tip">系统将基于大数据对稿件进行内容检测，请稍作等待，可在“<span style="color:#333;">个人中心-查重结果</span>”查看</p>
      <div class="bot-btns">
        <button class="close-btn" @click="beforeClose">关闭</button>
        <button class="confirm-btn" @click="confirmFun">确定</button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { setTimeout } from 'timers'
export default {
  name: 'checkPop',
  data () {
    return {
      showModel: false
    }
  },
  methods: {
    beforeClose () {
      this.$emit('fClose')
    },
    confirmFun () {
      this.$emit('fConfirm')
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
  height: 240px;
  border-top: 1px solid #E5E5E5;
  text-align: center;
  h3 {
    font-size: 18px;
    font-weight: bold;
    color: #333333;
    margin-top: 38px;
  }
  .tip {
    width: 320px;
    font-size: 14px;
    line-height: 20px;
    color: #999;
    margin:20px auto 0 auto;
  }
  .bot-btns {
    width: 280px;
    margin: 56px auto 0 auto;
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
#check-pop {
  .el-dialog {
    border-radius: 10px;
  }
  .el-dialog__body {
    padding: 0 20px;
  }
}
</style>
