<template>
  <el-dialog id="template-pop" :visible.sync="showModel" top="12vh" width="630px!important" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeClose" :show-close="true" :lock-scroll="false">
    <div class="wrap">
      <h3 class="title">思想汇报模板</h3>
      <div class="tigang-wrap">
        <p class="tip">提纲结构（可通过拖动调整提纲顺序）</p>
        <draggable class="drag-wrap scroll" v-model="subTitleList">
          <div class="item"  v-for="(item, index) in subTitleList" :key="index" v-html="item"></div>
        </draggable>
      </div>
      <div class="bot-btn">
        <p class="tips">“新思想”内容由AI智能学习并原创生成，仅供学习参考使用</p>
        <button @click="createFun">智能生成底稿</button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  name: 'templatePop',
  props: ['tempItem'],
  data () {
    return {
      showModel: false,
      subTitleList: []
    }
  },
  components: {
    draggable
  },
  methods: {
    beforeClose () {
      this.$emit('fClose')
    },
    createFun () {
      console.log('subTitleList', this.subTitleList)
      this.$axios.post(this.$global.API.outlineWrite,
        this.$qs.stringify({
          templateContent: JSON.stringify(this.subTitleList),
          keywords: '',
          reset: false // 是否需要刷新数据
        })
      ).then((res) => {
        console.log('ressss', res)
      })
    }
  },
  created () {
    this.subTitleList = this.tempItem.subTitleList
    setTimeout(() => { this.showModel = true }, 200)
  }
}
</script>
<style lang="scss" scoped>
#template-pop {
  .wrap {
    height: 480px;
    .title {
      font-size:20px;
      font-family: PingFangSC-Semibold,PingFang SC;
      color: #333;
      margin-bottom: 12px;
    }
    .tigang-wrap {
      height: 370px;
      width: 100%;
      background-color: #F1F7FF;
      padding: 16px 20px;
      .tip {
        font-size: 14px;
        color: #333333;
        margin-bottom: 14px;
      }
      .drag-wrap {
        width: 100%;
        height: 300px;
        .item {
          padding: 14px 10px 14px 24px;
          background-color: #fff;
          border-radius: 10px;
          position: relative;
          margin-bottom: 10px;
          &::before {
            content: '';
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #0E5DFF;
            position: absolute;
            left: 10px;
            top: 20px;
          }
        }
      }
    }
    .bot-btn {
        height: 60px;
        text-align: center;
        position: relative;
        padding-top: 20px;
        button {
          width: 140px;
          height: 34px;
          line-height: 34px;
          border-radius: 17px;
          color: #fff;
          background-color: #0E5DFF;
          text-align: center;
          font-size:16px;
          font-family:PingFangSC-Semibold,PingFang SC;
          margin-top: 20px;
        }
        .tips {
          font-size: 12px;
          color: #999999;
          position: absolute;
          left: 0;
          top: 10px;
        }
      }
  }
}
</style>
<style lang="scss">
#template-pop {
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog {
    border-radius: 10px;
  }
  .el-dialog__body {
    padding: 30px;
  }
}
</style>
