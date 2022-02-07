<template>
  <el-dialog id="common-pop" class="pop-reset" :visible.sync="showModal" top="30vh" width="450px!important" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeClose" :show-close="popObj.showClose">
    <div class="wrap">
      <h3 class="pop-title" v-if="popObj.title">{{popObj.title}}</h3>
      <div class="content">
        <div v-html="popObj.vHtml"></div>
      </div>
      <div class="bot-btns clearfix" v-if="popObj.btnList&&popObj.btnList.length>0">
        <button v-for="(btn, index) in popObj.btnList" :class="{'cancel-btn':btn.type==='cancel', 'confirm-btn':btn.type==='confirm'}" :key="index" @click="callbackFun(btn.type)">{{btn.name}}</button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'commonPop',
  props: ['popObj'],
  data () {
    return {
      showModal: false
    }
  },
  methods: {
    beforeClose () {
      this.$emit('fClose')
    },
    callbackFun (type) {
      if (type === 'cancel') {
        this.$emit('fClose')
      } else {
        this.$emit('fConfirm')
      }
    }
  },
  created () {
    setTimeout(() => { this.showModal = true }, 100)
  }
}
</script>
<style lang="scss" scoped>
  #common-pop {
    .wrap {
      height: 240px;
      padding: 0 30px;
      .pop-title {
        height: 60px;
        line-height: 60px;
        border-bottom: 1px solid #E5E5E5;
        font-size: 18px;
        color: #333333;
      }
      .bot-btns {
        width: 280px;
        height: 32px;
        position: absolute;
        left: 50%;
        bottom: 30px;
        transform: translateX(-50%);
        button {
          width: 120px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          border-radius: 16px;
          font-size: 16px;
          &.cancel-btn {
            color: #999999;
            border: 1px solid #DEDEDE;
            font-family: PingFangSC-Regular,PingFang SC;
            float: left;
          }
          &.confirm-btn {
            color: #fff;
            background-color: #0E5DFF;
            font-family:PingFangSC-Semibold,PingFang SC;
            float: right;
          }
        }
      }
    }
  }
</style>
