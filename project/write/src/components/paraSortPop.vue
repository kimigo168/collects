<template>
  <el-dialog id="parasort" title="对段落进行拖拽排序" :visible.sync="showModel" top="6vh" width="750px!important" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeClose" :show-close="false">
    <div class="sort-wrap">
      <h3 class="article-title">标题：{{title}}</h3>
      <draggable class="content-wrap scroll" v-model="paragraphArr">
        <div class="item" v-for="(item, index) in paragraphArr" :key="index" v-html="item">
        </div>
      </draggable>
      <div class="footer">
        <button class="cancel" @click="beforeClose">取消</button>
        <button class="confirm" @click="confirmFun">确定</button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import draggable from 'vuedraggable'
import { setTimeout } from 'timers'
export default {
  name: 'paraSortPop',
  props: ['content', 'title'],
  data () {
    return {
      showModel: false,
      editContent: '',
      paragraphArr: []
    }
  },
  components: {
    draggable
  },
  methods: {
    beforeClose () {
      this.$emit('fClose')
    },
    confirmFun () {
      let str = ''
      for (let item of this.paragraphArr) {
        str += `<p>${item.replace(/<p[^<]+>/g, '')}</p>`
      }
      this.$emit('fConfirmSort', str)
    }
  },
  created () {
    this.editContent = this.content
    this.paragraphArr = this.editContent.replace(/<p>|(<p\s(\w*)>)/gi, '').split(/<\/p>/gi)
    let len = this.paragraphArr.length
    this.paragraphArr.splice(len - 1, 1)
    setTimeout(() => {
      this.showModel = true
    }, 300)
  }
}
</script>
<style lang="scss">
#parasort{
  .el-dialog {
    height: 700px;
    border-radius: 20px;
    .el-dialog__header {
      padding:40px 0 0 0;
      text-align: center;
      .el-dialog__title {
        font-size: 26px;
        font-family: PingFangSC-Semibold;
        color: #222;
      }
    }
    .el-dialog__body {
      padding: 10px 40px;
    }
  }
  .sort-wrap {
    .article-title {
      text-align: center;
      font-family: PingFangSC-Semibold;
      color: #999;
      font-size: 18px;
      padding-bottom: 18px;
      border-bottom: 1px solid #EEE;
    }
    .content-wrap {
      height: 496px;
      margin-top: 10px;
      margin-bottom: 14px;
      border-bottom: 1px solid #EEE;
      padding-right: 20px;
      .item {
        padding: 14px 20px;
        border: 1px solid #85C9FF;
        border-radius: 4px;
        margin-bottom: 14px;
        &:hover {
          box-shadow: 0 4px 8px 0 rgba(0,0,0,0.20);
        }
      }
    }
    .footer {
      height: 34px;
      width: 100%;
      position: relative;
      button {
        width: 120px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        border-radius: 17px;
        font-size: 14px;
        position: absolute;
        top: 0;
      }
      .cancel {
        border: 1px solid #d9d9d9;
        color: #999;
        left: 160px;
      }
      .confirm {
        background-color: #0182E8;
        color: #fff;
        right: 160px;
      }
    }
  }
}
</style>
