<template>
  <el-dialog id="custom-temp" :visible.sync="showModel" top="10vh" width="830px!important" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeClose" :show-close="true">
    <div class="wrap">
      <h3 class="title">自定义“新思想”</h3>
      <div class="content">
        <div class="left-part">
          <p class="tip">提纲结构（可通过拖动调整提纲顺序）</p>
          <draggable class="drag-wrap scroll-noBorder" v-model="titleList">
            <div class="item"  v-for="(item, index) in titleList" :key="index" >
              <p v-html="item"></p>
              <span class="delete" @click="delFun(index)"></span>
            </div>
          </draggable>
        </div>
        <div class="right-part">
          <div class="search-wrap">
            <input type="text" v-model="keyword" placeholder="输入关键词检索提纲，例如：入党">
            <button class="search-btn" @click="searchSubTitle"></button>
          </div>
          <div class="search-result">
            <p class="title">搜索结果</p>
            <ul class="result-wrap scroll">
              <li v-for="(item, index) in resultList" :key="index">
                <p class="name">{{item.name}}</p>
                <p class="source">{{item.source}}</p>
                <span class="add-icon"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="botBtns">
        <p class="tips">“新思想”内容由AI智能学习并原创生成，仅供学习参考使用</p>
        <button class="cancel-btn" @click="beforeClose">取消</button>
        <button class="confirm-btn">智能生成底稿</button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  name: 'customTemp',
  data () {
    return {
      showModel: false,
      titleList: ['从思想上重视理论学习的重要性', '注重理论学习对实践的指导意义'],
      keyword: '',
      pageNo: 1,
      pageSize: 10,
      resultList: [
        {
          source: '《入党思想汇报》',
          name: '从思想上重视理论学习的重要性'
        }
      ]
    }
  },
  components: {
    draggable
  },
  methods: {
    beforeClose () {
      this.$emit('fClose')
    },
    delFun (index) {
      this.titleList.splice(index, 1)
    },
    searchSubTitle () {
      this.pageNo = 1
      this.titleList = []
      this.getSubTitle()
    },
    getSubTitle () { // 搜索子标题
      this.$axios.post(this.$global.API.subtitleSearch,
        this.$qs.stringify({
          keyword: this.keyword,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        })
      ).then((res) => {
        console.log('reeee', res)
        if (res.code === '0' && res.data) {
          if (this.pageNo === 1) {
            this.titleList = res.data.data || []
          } else {
            this.titleList = this.titleList.concat(res.data || [])
          }
        }
      })
    }
  },
  created () {
    setTimeout(() => { this.showModel = true }, 200)
  }
}
</script>
<style lang="scss" scoped>
  #custom-temp {
    .wrap {
      height: 506px;
      .title {
        font-size:20px;
        font-family: PingFangSC-Semibold,PingFang SC;
        color: #333;
        margin-bottom: 12px;
      }
      .content {
        height: 400px;
        width: 100%;
        position: relative;
        .left-part {
          width: 370px;
          height: 400px;
          background-color: #F1F7FF;
          border-radius: 10px;
          position: absolute;
          left: 0;
          bottom: 0;
          padding: 16px 20px;
          .tip {
            font-size: 14px;
            color: #333333;
            margin-bottom: 14px;
          }
          .drag-wrap {
            width: 100%;
            height: 334px;
            .item {
              padding: 14px 30px 14px 24px;
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
              // &::after {
              //   content: '';
              //   width: 16px;
              //   height: 16px;
              //   display: inline-block;
              //   background-image: url('../../images/icons/icon_delete1.png');
              //   background-size: 16px 16px;
              //   background-repeat: no-repeat;
              //   position: absolute;
              //   right: 10px;
              //   top: 50%;
              //   transform: translateY(-50%);
              //   cursor: pointer;
              // }
              .delete {
                width: 16px;
                height: 16px;
                display: inline-block;
                background-image: url('../../images/icons/icon_delete1.png');
                background-size: 16px 16px;
                background-repeat: no-repeat;
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
              }
            }
          }
        }
        .right-part {
          width: 370px;
          height: 400px;
          position: absolute;
          right: 0;
          top: 0;
          .search-wrap {
            margin-bottom: 20px;
            input {
              width: 316px;
              height: 44px;
              line-height: 44px;
              text-indent: 20px;
              border-radius: 22px;
              background-color: #F1F7FF;
            }
            .search-btn {
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background-color: #0E5DFF;
               background-image: url('../../images/icons/icon_search_1.png');
              background-repeat: no-repeat;
              position: absolute;
              right: 0;
              top: 0;
            }
          }
          .search-result {
            .title {
              font-size: 14px;
              font-family:PingFangSC-Semibold,PingFang SC;
              color: #333;
              padding-bottom: 10px;
              border-bottom: 1px solid #E5E5E5;
            }
            .result-wrap {
              height: 298px;
              li {
                position: relative;
                background-color: #fff;
                padding: 14px 30px 10px 24px;
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
                .add-icon {
                  width: 16px;
                  height: 16px;
                  display: inline-block;
                  background-image: url('../../images/icons/add_btn_2.png');
                  background-size: 16px 16px;
                  background-repeat: no-repeat;
                  position: absolute;
                  right: 10px;
                  top: 50%;
                  transform: translateY(-50%);
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
      .botBtns {
        margin: 0 auto;
        padding-top: 36px;
        text-align: center;
        position: relative;
        button {
          width: 140px;
          height: 34px;
          border-radius: 17px;
          font-size: 16px;
          &.cancel-btn {
            border: 1px solid #DEDEDE;
            color: #999999;
            margin-right: 30px;
          }
          &.confirm-btn {
            font-family:PingFangSC-Semibold,PingFang SC;
            background-color: #0E5DFF;
            color: #fff;
          }
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
#custom-temp {
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
