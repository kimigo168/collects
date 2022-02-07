<template>
  <el-dialog id="rewrite" class="pop-reset" v-loading.lock="loading" :visible.sync="showModel" top="8vh" width="970px!important" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeClose" :show-close="false">
    <div class="wrap">
      <div class="article-wrap">
        <h2 class="title">改写前</h2>
        <div class="article scroll" style="white-space: pre-wrap;" v-html="rewriteData.origin">
        </div>
      </div>
      <div class="rewrite-wrap">
        <div class="similarity" v-if="rewriteData.rewriteSimilarity">
          <p class="label">相似度</p>
          <p class="value">{{parseFloat(rewriteData.rewriteSimilarity * 100).toFixed(1)}}%</p>
        </div>
        <h2 class="title">改写后</h2>
        <div class="article scroll" style="white-space: pre-wrap;" v-html="rewriteData.rewrite">
        </div>
      </div>
      <div class="bot-btns">
        <button class="apply-btn" @click="applyFun">确定</button>
        <button class="close-btn" @click="beforeClose">取消</button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { setTimeout } from 'timers'
export default {
  name: 'checkResult',
  props: ['rewriteData'],
  data () {
    return {
      showModel: false,
      loading: false,
      duplicateList: []
    }
  },
  methods: {
    beforeClose () {
      this.$emit('fClosePop')
    },
    applyFun () {
      this.$emit('fConfirmRewrite')
    }
  },
  created () {
    setTimeout(() => {
      this.showModel = true
    }, 100)
  }
}
</script>
<style lang="scss" scoped>
#rewrite {
  .wrap {
    width: 100%;
    height: 640px;
    position: relative;
    .article-wrap {
      width: 485px;
      height: 570px;
      padding-left: 30px;
      padding-top: 10px;
      padding-right: 10px;
      .title {
        font-weight: bold;
        font-size: 20px;
        color: #333333;
        margin-bottom: 20px;
        margin-top: 20px;
        text-align: left;
      }
      .article {
        height: 495px;
        font-size: 14px;
        color: #333;
        line-height: 22px;
        padding-right: 10px;
        p {
          margin-bottom: 12px
        }
      }
    }
    .rewrite-wrap {
      width: 485px;
      height: 570px;
      background-color: #F4F4F4;
      position: absolute;
      right: 0;
      top: 0;
      padding: 10px 15px 20px 15px;
      .title {
        font-weight: bold;
        font-size: 20px;
        color: #333333;
        margin-bottom: 20px;
        margin-top: 20px;
        text-align: left;
      }
      .article {
        height: 495px;
        font-size: 14px;
        color: #333;
        line-height: 22px;
        padding-right: 10px;
        p {
          margin-bottom: 12px
        }
      }
      .similarity {
        width: 64px;
        height: 60px;
        position: absolute;
        right: 20px;
        top: 0;
        background-color: #DDEAFF;
        border-radius: 0 0 17px 17px;
        text-align: center;
        .label {
          color: #0E5DFF;
          font-size: 12px;
          padding-top: 14px;
        }
        .value {
          color: #0E5DFF;
          font-size: 14px;
          font-family: Semibold;
          margin-top: 2px;
        }
      }
    }
    .bot-btns {
      height: 70px;
      width: 100%;
      line-height: 70px;
      text-align: center;
      margin: 0 auto;
      border-top: 1px solid #E5E5E5;
      button {
        width: 120px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        border-radius: 19.5px;
        &.apply-btn {
          color: #fff;
          background-color: #0E5DFF;
          margin-right: 40px;
        }
        &.close-btn {
          color: #999999;
          border: 1px solid #DEDEDE;
          background-color: #fff;
        }
      }
    }
  }
  .scroll{
    overflow-y: auto;
  }
  .scroll::-webkit-scrollbar {
    width: 6px;
  }
  .scroll::-webkit-scrollbar-thumb {
    background: #C3CBD0;
    border-radius: 5px;
  }
  .scroll-x{
    overflow-x: auto;
  }
  .scroll-x::-webkit-scrollbar {
    width: 6px;
    border-radius: 3px;
    padding-right: 4px;
  }
  .scroll-x::-webkit-scrollbar-thumb {
    background: #C3CBD0;
  }
}
</style>
