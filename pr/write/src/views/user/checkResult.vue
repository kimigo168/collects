<template>
  <el-dialog id="check-result" v-loading.lock="loading" :visible.sync="showModel" top="15vh" width="970px!important" :close-on-click-modal="true" :close-on-press-escape="false" :before-close="beforeClose" :show-close="false">
    <div class="wrap">
      <div class="article-wrap scroll" id="duplicate-article-scroll">
        <h2 class="title">{{detailItem.title}}</h2>
        <p class="info" v-if="detailItem.author">作者：{{detailItem.author}}<span class="date">{{detailItem.updateTime}}</span></p>
        <div id="duplicate-article" class="article" style="white-space: pre-wrap;" v-html="detailItem.content">

        </div>
      </div>
      <ul id="duplicate-list" class="duplicate-wrap scroll">
        <li v-for="(item, index) in duplicateList" :key="index" :index="item.index">
          <p class="label">原文内容：</p>
          <p class="original">{{item.checktext}}</p>
          <p class="label">相似内容来源：</p>
          <div class="similar-source" v-html="item.content"></div>
          <p><span class="label">来源：</span><span class="source color1">{{item.site}}</span></p>
          <p><span class="label">日期：</span><span class="date color1">{{item.time}}</span></p>
          <p><span class="label">篇名：</span><span class="title-name color1">{{item.title}}</span></p>
        </li>
      </ul>
      <div class="bot-btns">
        <button class="edit-btn" @click="editFun">编辑</button>
        <el-checkbox v-model="markChecked">将相似内容标记到文中</el-checkbox>
        <button class="close-btn" @click="beforeClose">关闭</button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'checkResult',
  props: ['viewCheckId', 'contextId', 'contextType'],
  data () {
    return {
      showModel: false,
      author: '我',
      loading: false,
      duplicateList: [],
      detailItem: {
        title: '',
        author: '',
        updateTime: '',
        content: '' // html
      },
      originData: {
        content: '',
        title: '',
        author: ''
      },

      markChecked:false,
    }
  },
  methods: {
    beforeClose () {
      this.$emit('fClosePop')
    },
    queryResult () {
      this.loading = true
      this.duplicateList = []
      let self = this
      this.$axios.post(this.$global.API.duplicateDetail,
        this.$qs.stringify({
          id: this.viewCheckId
        })
      ).then((res) => {
        this.loading = false
        if (res.code === '0') {
          if (res.data) {
            let data = res.data
            this.originData.htmlContent = data.htmlContent
            this.originData.title = data.title
            this.originData.author = data.author
            this.detailItem = {
              title: data.title,
              author: data.author,
              updateTime: data.updateTime,
              content: data.htmlContent
            }
            let arr = []
            let text = data.htmlContent
            let datas = data.resultContent.datas // 重复内容list
            for (let item of datas) {
              if (item.target && item.content) {
                item.checktext = item.checktext.replace(/\n/g, '')
                item.content = item.content.replace(item.target, `<span class="red">${item.target}</span>`)
                text = text.replace(item.checktext, `<span class="blue" style="cursor:pointer;color: #0E5DFF;" index="${item.index}">${item.checktext}</span>`)
                arr.push(item)
              }
            }
            this.duplicateList = arr
            this.detailItem.content = text
            this.$nextTick(() => {
              let ul = this.$('#duplicate-list')
              ul.scrollTop(0)
              this.$('#duplicate-article-scroll').scrollTop(0)
              this.$('#duplicate-article').find('.blue').on('click', function () {
                let index = self.$(this).attr('index')
                let thisLi = ul.find('li[index="' + index + '"]')
                ul.animate({
                  scrollTop: thisLi.position().top + ul.scrollTop() - 10
                }, 500)
                ul.find('li').removeClass('active')
                thisLi.addClass('active')
              })
            })
          } else {
            this.$message({ type: 'warning', message: '暂无查询结果', showClose: true })
          }
        }
      })
    },
    editFun () { // 跳转到编辑页面
      localStorage.editerContent = this.markChecked ? this.detailItem.content : this.originData.htmlContent
      localStorage.editerTitle = this.originData.title
      localStorage.articleId = ''

      if(this.contextType === 2){ // 汽车写作
        this.$router.push({
          path: '/car-edit',
          query: {
            write: 2, // 2表示编辑
            vType:3
          }
        })
      }else { // 热点写作 || 提纲写作
        this.$router.push({
          path: '/edit',
          query: {
            write: 2, // 2表示编辑
            vType: this.contextType === 0 ? 1 : 2 // 1热点，2提纲
          }
        })
      }
    }
  },
  created () {
    this.showModel = true
  },
  mounted () {
    this.queryResult()
  }
}
</script>
<style lang="scss">
#check-result {
  .wrap {
    width: 100%;
    height: 640px;
    background-color: #F4F4F4;
    position: relative;
    .article-wrap {
      width: 532px;
      height: 570px;
      padding-left: 30px;
      padding-top: 30px;
      .title {
        font-family: PingFangSC-Semibold;
        font-size: 24px;
        color: #333333;
        margin-bottom: 9px;
      }
      .info {
        height: 28px;
        line-height: 28px;
        color: #666666;
        font-size: 12px;
        margin-bottom: 9px;
        .date {
          margin-left: 10px;
        }
      }
      .article {
        font-size: 14px;
        color: #333;
        line-height: 22px;
        p {
          margin-bottom: 12px
        }
      }
    }
    .duplicate-wrap {
      width: 428px;
      height: 570px;
      background-color: #F4F4F4;
      position: absolute;
      right: 10px;
      top: 0;
      padding: 20px 10px 20px 15px;
      li {
        width: 100%;
        min-height: 200px;
        background-color: #fff;
        padding: 20px;
        margin-top: 20px;
        .label {
          // font-family: PingFangSC-Semibold;
          font-size: 14px;
          font-weight: bold;
          color: #333333;
          margin-bottom: 10px;
        }
        .original {
          color: #0E5DFF;
          line-height: 20px;
          padding-left: 44px;
          margin-bottom: 10px;
        }
        .similar-source {
          // font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #666666;
          line-height: 20px;
          padding-left: 44px;
          margin-bottom: 18px;
        }
        .source, .date, .title-name {
          margin-left: 6px;
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
        &.edit-btn {
          color: #fff;
          background-color: #0E5DFF;
        }
        &.close-btn {
          color: #999999;
          border: 1px solid #DEDEDE;
          background-color: #fff;
          margin-left: 40px;
        }
      }
      .el-checkbox{
        margin-left: 20px;
      }
    }
  }
  .el-dialog {
    border-radius: 10px;
    overflow: hidden;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
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
