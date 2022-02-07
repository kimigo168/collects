<template>
  <el-dialog id="leave-confirm" title="离开提醒" :visible.sync="popObj.isShow" top="15vh" width="480px!important" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeClose" :show-close="true">
    <div class="wrap">
      <h3>离开将不保存编辑的内容，是否继续离开？</h3>
      <div class="bot-btns">
        <button class="close-btn" @click="beforeClose">取消</button>
        <button class="confirm-btn" @click="confirmFun">确定</button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'checkPop',
  props: ['popObj'],
  data () {
    return {
      showModel: false
    }
  },
  methods: {
    beforeClose () {
      this.popObj.cancelFun()
    },
    confirmFun () {
      this.popObj.confirmFun()
    }
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
    margin-top: 48px;
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
    margin: 98px auto 0 auto;
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
#leave-confirm {
  .el-dialog {
    border-radius: 10px;
  }
  .el-dialog__body {
    padding: 0 20px;
  }
}
</style>
