<template>
  <el-dialog id="preview-pop" :visible.sync="showModel" top="6vh" width="750px!important" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeClose" :show-close="false">
    <div class="preview-wrap">
      <h2 class="title">{{title}}</h2>
      <p class="author">{{author}}&nbsp;&nbsp;{{date}}</p>
      <div class="content-wrap scroll" v-html="content"></div>
      <div class="footer">
        <!-- <button class="cancel" @click="beforeClose">取消</button> -->
        <button class="confirm" @click="beforeClose">关闭</button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'previewPop',
  props: ['content', 'title', 'date', 'author'],
  data () {
    return {
      showModel: false
    }
  },
  methods: {
    beforeClose () {
      this.$emit('fClosePreview')
    }
  },
  created () {
    this.editContent = this.content
    setTimeout(() => {
      this.showModel = true
    }, 300)
  }
}
</script>
<style lang="scss">
#preview-pop{
  .el-dialog {
    height: 840px;
    border-radius: 20px;
    .el-dialog__header {
      padding:20 0 0 0;
      text-align: center;
      .el-dialog__title {
        font-size: 26px;
        font-family: PingFangSC-Semibold;
        color: #222;
      }
    }
    .el-dialog__body {
      padding: 10px 60px;
    }
  }
  .preview-wrap {
    .title {
      height: 32px;
      font-size: 24px;
      font-family: PingFangSC-Semibold;
      color: #000;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      white-space:nowrap;
    }
    .author {
      text-align: right;
      font-family: PingFangSC-Semibold;
      color: #999;
      font-size: 14px;
      padding-bottom: 10px;
      padding-right: 20px;
      border-bottom: 1px solid #EEE;
    }
    .content-wrap {
      height: 660px;
      margin-top: 10px;
      margin-bottom: 14px;
      border-bottom: 1px solid #EEE;
      padding-right: 20px;
      p {
        padding: 10px 20px;
        border-radius: 4px;
        line-height: 20px;
        // margin-bottom: 14px;
        // &:hover {
        //   box-shadow: 0 4px 8px 0 rgba(0,0,0,0.20);
        // }
      }
      table{
        border-collapse: collapse;
        td,th{
          padding: 5px 10px;
          border: 1px solid #DDD;
        }
      }
    }
    .footer {
      height: 34px;
      width: 100%;
      position: relative;
      text-align: center;
      button {
        width: 120px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        border-radius: 17px;
        font-size: 14px;
        // position: absolute;
        // top: 0;
      }
      // .cancel {
      //   border: 1px solid #d9d9d9;
      //   color: #999;
      //   left: 160px;
      // }
      .confirm {
        background-color: #0182E8;
        color: #fff;
        right: 160px;
      }
    }
  }
}
</style>
