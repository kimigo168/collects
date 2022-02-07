<template>
  <el-dialog id="sensitive-check" class="pop-reset" :visible="showModal" top="15vh" width="720px!important" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeClose" :show-close="true">
    <div class="wrap">
      <p class="title">敏感词检测<span class="tip">（检测到本文存在以下风险）</span></p>
      <div class="inner-wrap">
        <div class="check-all">
          <el-checkbox  v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        </div>
        <ul class="list-wrap">
          <li v-for="(item, index) in labelsArr" :key="index" class="list-item">
            <el-checkbox @change="selectChange" v-model="item.select" :disabled="item.words.length==0"></el-checkbox><span class="label">内容包含的{{item.name}}信息</span>
            <div class="words-wrap" v-if="item.words&&item.words.length>0">
              <span class="word" v-for="(word, index1) in item.words" :key="index1">{{word}}</span>
            </div>
            <div class="words-wrap" v-else>-</div>
          </li>
        </ul>
      </div>
      <div class="botBtns">
        <button class="cancel-btn" @click="showInArticle">在文中显示</button>
        <button class="confirm-btn" @click="beforeClose">确定</button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'sensitiveCheck',
  props: ['checkData'],
  data () {
    return {
      showModal: false,
      checkAll: true,
      checkedItems: [],
      labelsArr: []
    }
  },
  methods: {
    handleCheckAllChange (val) {
      this.labelsArr.map((item, index) => {
        item.select = this.checkAll && item.words.length > 0
      })
    },
    selectChange () {
      let arr = []
      this.labelsArr.forEach((item) => {
        if (item.words && item.words.length > 0) {
          arr.push(item)
        }
      })
      let isAllSelect = arr.every((item1) => {
        return item1.select
      })
      this.checkAll = isAllSelect
    },
    beforeClose () {
      this.$emit('fClose')
    },
    showInArticle () {
      let selectArr = []
      this.labelsArr.forEach((item) => {
        if (item.select && item.words && item.words.length > 0) {
          selectArr.push(item)
        }
      })
      this.$emit('fConfirmShow', selectArr)
    }
  },
  created () {
    setTimeout(() => { this.showModal = true })
    let arr = []
    this.checkData.forEach((item, index) => {
      arr.push({
        name: item.type,
        select: item.words && item.words.length > 0,
        words: item.words
      })
    })
    this.labelsArr = arr
  }
}
</script>
<style lang="scss" scoped>
#sensitive-check {
  .wrap {
    min-height: 490px;
    padding: 30px 30px 0 30px;
    .title {
      font-size: 20px;
      color: #333333;
      font-family:PingFangSC-Semibold,PingFang SC;
      margin-bottom: 12px;
      .tip {
        font-size:14px;
        font-family:PingFangSC-Regular,PingFang SC;
      }
    }
    .inner-wrap {
      height: 350px;
      background-color: #F1F7FF;
      border-radius: 10px;
      padding: 20px;
      .check-all {
        margin-bottom: 14px;
        padding-left: 16px;
      }
      .list-wrap {
        height: 300px;
        width: 100%;
        overflow: scroll;
        .list-item {
          height: 48px;
          width: 100%;
          line-height: 48px;
          border-radius: 10px;
          background-color: #fff;
          font-size: 14px;
          position: relative;
          margin-bottom: 10px;
          padding: 0 16px;
          .label {
            margin-left: 10px;
          }
          .words-wrap {
            display: inline-block;
            height: 48px;
            line-height: 48px;
            position: absolute;
            right: 16px;
            top: 0;
            .word {
              color: #FF5353;
              margin-left: 20px;
            }
          }

        }
      }
    }
    ::-webkit-scrollbar  {
      display: none;
    }
    .botBtns {
      height: 84px;
      width: 280px;
      margin: 0 auto;
      padding-top: 26px;
      button{
        width: 120px;
        height: 32px;
        line-height:32px;
        text-align: center;
        border-radius: 16px;
        font-size: 16px;
        &.confirm-btn {
          background-color: #0E5DFF;
          color: #fff;
          font-family:PingFangSC-Semibold,PingFang SC;
        }
        &.cancel-btn {
          border: 1px solid #DEDEDE;
          color: #999999;
          margin-right: 40px;
        }
      }
    }
  }
}
</style>
