<template>
  <div class="article-detail" id="detail">
    <div class="content-box" v-loading.lock="loading">
      <div class="article-box">
        <div class="article-head">
          <!-- 文章路径显示 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>正文</el-breadcrumb-item>
          </el-breadcrumb>
          <!-- 文章标题 -->
          <div class="article-title">
            <p>{{newsData.title}}</p>
          </div>
          <!-- 文章来源及日期 -->
          <div class="article-from">
            <a href="#">{{newsData.source}}</a>
            <span>{{newsData&&newsData.publishTime? new Date(newsData.publishTime).format('YYYY-MM-DD'):""}}</span>
          </div>
        </div>
        <div class="article-body">
          <div class="wrap" v-if="newsData&&newsData.content" v-html="newsData.content"></div>
        </div>
        <div class="article-footer">
          <div v-html="staffName"></div>
        </div>
        <div class="collect" v-if="isCollect == 1" @click="cancelCollect">
          <img src="../../images/solid-star.png" alt />
          <span>已收藏</span>
        </div>
        <div class="collect" v-else @click="clickCollect">
          <img src="../../images/star.png" alt />
          <span>收藏</span>
        </div>
      </div>
      <div class="recommend" v-if="recommendData.length != 0">
        <div class="recommend-head">
          <span></span>
          <p>相关推荐</p>
        </div>
        <div class="recommend-article"  v-for="item in recommendData" :key="item.cid">
          <div class="left-img" v-if="item.cover && item.cover[0]">
            <img v-if="item.cover" :src="item.cover[0]" />
          </div>
          <div class="right-text" :class="[{'text-only': item.cover.length == 0}]">
            <p class="title" @click="viewDetail(item)">{{item.title}}</p>
            <div class="text-box">
              <p @click="viewDetail(item)">{{item.summary}}</p>
            </div>
            <div class="text-msg">
              <div class="article-from">
                <span>{{item.source}}</span>
                <span class="time">{{item.publishTime}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="comments">
        <div class="comments-head">
          <span></span>
          <p>精彩评论</p>
        </div>
        <div class="comment-inp-box">
          <img src="../../images/logo.png" alt="用户头像" />
          <textarea name="comments-inp" placeholder="写评论" v-model="myComment"></textarea>
          <button @click="addComment">发 表</button>
        </div>
        <div class="comments-show">
          <div class="comments-item" v-for="(item,index) in commentsList" :key="index">
            <img src="../../images/logo.png" alt="用户头像" />
            <div class="comment-person" v-if="item.parent">
              <span class="person-name" @click.stop="clickReply(index)">{{item.nickName}}</span>
              <span class="time">{{item.time}}</span>
              <p class="person-comment">{{item.comment}}</p>
              <div class="comment-reply-inp" v-if="isClickReply == index">
                <textarea id="reply-inp" v-model="replyContent" placeholder="回复评论"></textarea>
                <div class="btn">
                  <button @click="submitReply(item)">提交</button>
                  <button class="cancel" @click="cancelReply">取消</button>
                </div>
              </div>
              <div class="comment-reply">
                <a href="javascript:;" class="reply">回复</a>
                <span>{{item.parent.nickName}}</span>
                <span class="reply-colon">:</span>
                <p class="reply-text">{{item.parent.comment}}</p>
              </div>
              <div class="comment-reply" v-if="item.id==replyCommentList.pId&&replyCommentList.comment&&replyCommentList.parent.comment">
                <a href="javascript:;" class="reply">回复</a>
                <span>{{replyCommentList.nickName}}</span>
                <span class="reply-colon">:</span>
                <p class="reply-text">{{replyCommentList.comment}}</p>
              </div>
            </div>
            <div class="comment-person" v-else>
              <span class="person-name" @click.stop="clickReply(index)">{{item.nickName}}</span>
              <span class="time">{{item.time}}</span>
              <p class="person-comment">{{item.comment}}</p>
              <div class="comment-reply-inp" v-if="isClickReply == index">
                <textarea id="reply-inp" v-model="replyContent" placeholder="回复评论"></textarea>
                <div class="btn">
                  <button @click="submitReply(item)">提交</button>
                  <button class="cancel" @click="cancelReply">取消</button>
                </div>
              </div>
              <div class="comment-reply" v-if="item.id==replyCommentList.pId&&replyCommentList.comment&&replyCommentList.parent.comment">
                <a href="javascript:;" class="reply">回复</a>
                <span>{{replyCommentList.nickName}}</span>
                <span class="reply-colon">:</span>
                <p class="reply-text">{{replyCommentList.comment}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'detail',
  data () {
    return {
      loading: false,
      cid: '', // 稿件id
      newsData: {},
      newsAuthor: {},
      recommendData: [],
      isCollect: '',
      myComment: null,
      commentsList: [],
      isClickReply: null,
      replyContent: null,
      replyCommentList: {},
      staffName: '',
      sw: true,
      pageNum: 1,
      pageSize: 5
    }
  },
  methods: {
    getNewsDetail () {
      this.loading = true
      this.$axios
        .post(
          this.$global.API.detailForWeb,
          this.$qs.stringify({
            cid: this.cid
          })
        )
        .then(res => {
          this.loading = false
          if (res.code === '0') {
            this.newsData = res.data
            let staffName = res.data.staffName
            let str = ``
            for (let key in staffName) {
              str += `<p>${key}：${staffName[key]}</p>`
            }
            this.staffName = str
          }
        })
    },
    getOtherDetail () {
      this.$axios
        .post(this.$global.API.otherDetail, {
          newsId: this.cid,
          type: 0
        })
        .then(res => {
          // console.log('otherdetail', res)
          if (res.code === '0') {
            this.isCollect = res.data.isCollect
          }
        })
    },
    getrelateRecommend () {
      this.recommendData = []
      this.$axios
        .post(
          this.$global.API.relateRecommend,
          this.$qs.stringify({
            cid: this.cid,
            size: 20
          })
        )
        .then(res => {
          // console.log('详情ress', res)
          if (res.code === '0' && res.data) {
            let news = res.data.news
            // news.map(item => {
            //   if (item.image && item.image.length > 0) {
            //     try {
            //       item.cover = JSON.parse(item.image)[0].url
            //     } catch (error) {
            //       item.cover = ''
            //       console.log(error)
            //     }
            //   }
            // })
            this.recommendData = news
          }
        })
    },
    getCommmentsList () {
      this.sw = true
      this.$axios
        .post(
          this.$global.API.queryCommentsList,
          this.$qs.stringify({
            newsId: this.cid,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          })
        )
        .then(res => {
          // console.log('详情ress', res)
          if (res.code === '0') {
            let list = res.data.commentList
            if (this.pageNum === 1) {
              this.commentsList = list
            } else {
              this.commentsList = this.commentsList.concat(list)
            }
            if (list.length !== 0) {
              this.pageNum++
            }
          }
        })
    },
    viewDetail (item) {
      // 查看资讯详情
      this.$router.push({
        path: '/detail',
        query: {
          cid: item.cid
        }
      })
    },
    clickCollect () {
      this.$axios
        .post(
          this.$global.API.addCollect,
          this.$qs.stringify({
            newsId: this.newsData.cid,
            type: this.newsData.type
          })
        )
        .then(res => {
          if (res.code === '0') {
            this.isCollect = 1
            this.$message({ type: 'success', message: '收藏成功', showClose: true })
          }
        })
    },
    cancelCollect () {
      this.$axios
        .post(
          this.$global.API.delCollect,
          this.$qs.stringify({
            newsId: this.newsData.cid
          })
        )
        .then(res => {
          if (res.code === '0') {
            this.isCollect = 0
            this.$message({ type: 'success', message: '已取消', showClose: true })
          }
        })
    },
    clickReply (index) {
      this.isClickReply = index
    },
    submitReply (item) {
      this.replyContent = this.replyContent.trim()
      if (this.replyContent) {
        this.$axios
          .post(
            this.$global.API.addComments,
            this.$qs.stringify({
              pId: item.id,
              newsId: item.newsId,
              comment: this.replyContent
            })
          )
          .then(res => {
            this.replyCommentList = res.data
            this.isClickReply = null
          })
      } else {
        this.$message({ type: 'warning', message: '评论不能为空！', showClose: true })
      }
    },
    cancelReply () {
      this.isClickReply = null
    },
    addComment () {
      this.myComment = this.myComment.trim()
      if (!this.myComment) {
        this.$message({ type: 'warning', message: '评论不能为空！', showClose: true })
        return
      }
      let newsId = this.newsData.cid
      let comment = this.myComment
      if (newsId && comment && this.myComment) {
        this.$axios
          .post(
            this.$global.API.addComments,
            this.$qs.stringify({
              newsId,
              comment
            })
          )
          .then(res => {
            this.myComment = ''
            this.getCommmentsList()
          })
      }
    },
    scrollHandle () {
      var self = this
      if (document.documentElement.scrollTop > 0 && (document.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight)) {
        if (this.sw) {
          this.sw = false
          setTimeout(() => {
            self.getCommmentsList()
          }, 500)
        }
      }
    }
  },
  watch: {
    $route (to, from) {
      this.$router.go(0)
    }
  },
  created () {
    var self = this
    self.cid = self.$route.query.cid || ''
    if (self.cid) {
      self.getNewsDetail()
      self.getOtherDetail()
      self.getrelateRecommend()
      self.getCommmentsList()
      window.addEventListener('scroll', this.scrollHandle, false)
    }
  }
}
</script>

<style lang="scss" scoped>
.article-detail {
  width: 100%;
  height: 100%;
  background: rgba(244, 244, 244, 1);
  padding-top: 119px;
  .content-box {
    width: 1200px;
    background: rgb(255, 255, 255);
    margin: 0 auto;
    padding: 0 84px;

    .article-box {
      width: 1032px;
      padding-top: 40px;
      padding-right: 2px;
      border-bottom: 1px solid #ededed;
      //   position: relative;
      /deep/.article-head {
        .article-title {
          // height: 33px;
          margin: 20px 0 10px 0;
          p {
            height: 100%;
            font-size: 24px;
            font-weight: 600;
            color: #333;
            line-height: 33px;
          }
        }
        .article-from {
          font-size: 14px;
          font-weight: 400;
          color: #999;
          line-height: 20px;
          a {
            margin-right: 30px;
            cursor: pointer;
          }
        }
      }
      .article-body {
        width: 100%;
        margin: 35px 0 19px 0;
        .wrap {
          p {
            font-size: 16px;
            line-height: 30px;
          }
        }
      }
      // .article-body .wrap  {
      //   p {
      //     font-size: 16px;
      //     line-height: 30px;
      //     margin-bottom: 45px;
      //   }
      // }
      .article-footer {
        width: 100%;
        height: 60px;
        font-size: 14px;
        font-weight: 400;
        color: #999;
        p {
          line-height: 26px;
        }
      }
      .collect {
        height: 20px;
        float: right;
        margin: 21px 7px 0 0;
        cursor: pointer;
        img {
          width: 16px;
          height: 16px;
        }
        span {
          display: inline-block;
          font-size: 14px;
          font-weight: 400;
          height: 20px;
          color: rgba(153, 153, 153, 1);
          line-height: 20px;
          margin-left: 6px;
          cursor: pointer;
        }
        // span:hover {
        //   color: #0a97ed;
        // }
      }
    }

    .recommend {
      width: 1030px;
      margin: 60px 0 18px;
      .recommend-head {
        height: 22px;
        span {
          display: inline-block;
          width: 4px;
          height: 20px;
          background: rgba(10, 151, 237, 1);
          border-radius: 3px;
          vertical-align: middle;
          margin-right: 8px;
        }
        p {
          display: inline-block;
          height: 22px;
          font-size: 16px;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 22px;
        }
      }
      .recommend-article {
        width: 100%;
        height: 160px;
        margin-top: 18px;
        border-bottom: 1px solid #ededed;
        .left-img {
          float: left;
          width: 26.21%;
          height: 140px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .right-text {
          float: left;
          width: 73%;
          height: 140px;
          padding-left: 30px;
          .title {
            height: 29px;
            font-size: 21px;
            font-weight: 600;
            color: rgba(51, 51, 51, 1);
            line-height: 29px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            cursor: pointer;
          }
          .text-box {
            margin: 10px 0;
            height: 72px;
            overflow: hidden;
            p {
              height: 44px;
              // -webkit-box-orient: vertical;
              // -webkit-line-clamp: 2;
              // overflow: hidden;
              // overflow: hidden;/*超出部分隐藏*/
              // text-overflow:ellipsis;/* 超出部分显示省略号 */
              // white-space: nowrap;/*规定段落中的文本不进行换行 */
              line-height: 24px;
              font-size: 14px;
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
              cursor: pointer;
            }
          }
          .text-msg {
            height: 24px;
            p {
              float: left;
              height: 24px;
              margin-right: 30px;
              line-height: 24px;
              color: #0a97ed;
              cursor: pointer;
            }
            div.article-from {
              float: left;
              height: 24px;
              font-size: 12px;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);

              span {
                line-height: 24px;
              }
              span.time {
                margin-left: 20px;
              }
            }
          }
        }
        .text-only {
          width: 100% !important;
          padding-left: 0px !important;
        }
      }
    }

    .comments {
      width: 1030px;
      margin-top: 18px;
      margin-bottom: 40px;
      .comments-head {
        height: 22px;
        span {
          display: inline-block;
          width: 4px;
          height: 20px;
          background: rgba(10, 151, 237, 1);
          border-radius: 3px;
          vertical-align: middle;
          margin-right: 8px;
        }
        p {
          display: inline-block;
          height: 22px;
          font-size: 16px;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 22px;
        }
      }
      .comment-inp-box {
        width: 1030px;
        height: 147px;
        padding: 19px 0 20px;
        border-bottom: 1px solid #ededed;
        position: relative;
        img {
          width: 44px;
          height: 44px;
          margin: 0 24px 17px 0;
          vertical-align: top;
        }
        // input {
        //     width: 960px;
        //     height: 60px;
        //     background:#F4F4F4;
        //     border-radius:2px;
        //     border:1px solid #E4E4E4;
        // }
        textarea {
          width: 960px;
          height: 60px;
          background: #f4f4f4;
          border-radius: 2px;
          border: 1px solid #e4e4e4;
          resize: none;
          padding: 10px;
        }
        button {
          background: rgba(10, 151, 237, 1);
          border-radius: 2px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 20px;
          padding: 6px 33px 4px 34px;
          position: absolute;
          right: 0px;
          bottom: 16px;
        }
      }
      .comments-show {
        width: 1030px;
        .comments-item {
          width: 100%;
          margin-top: 19px;
          border-bottom: 1px solid #ededed;
          img {
            width: 44px;
            height: 44px;
            margin: 0 20px 25px 0;
            vertical-align: top;
          }
          .comment-person {
            display: inline-block;
            width: 966px;
            padding-top: 2px;
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;
          }
          span.person-name {
            color: rgba(10, 151, 237, 1);
            margin-right: 10px;
            cursor: pointer;
          }
          span.time {
            color: rgba(153, 153, 153, 1);
          }
          p.person-comment {
            margin-top: 10px;
            // height: 20px;
            font-size: 14px;
            color: rgba(51, 51, 51, 1);
            line-height: 20px;
          }
          .comment-reply-inp {
            width: 80%;
            #reply-inp {
              width: 960px;
              height: 60px;
              background: #f4f4f4;
              border-radius: 2px;
              border: 1px solid #e4e4e4;
              resize: none;
              padding: 10px;
              margin: 10px 0px;
            }
            .btn {
              width: 100%;
              height: 50px;
              button {
                background: rgba(10, 151, 237, 1);
                border-radius: 2px;
                font-size: 14px;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
                line-height: 20px;
                padding: 6px 33px 4px 34px;
                margin-right: 10px;
              }
              button.cancel {
                background: rgb(227, 227, 227);
                color: rgb(156, 153, 153);
              }
            }
          }
          .comment-reply {
            width: 966px;
            height: 60px;
            background: rgba(238, 238, 238, 0.6);
            border-radius: 2px;
            margin: 20px 0 20px;
            padding: 20px 0 20px 10px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(10, 151, 237, 1);
            line-height: 20px;
            p.reply-text {
              display: inline-block;
              height: 20px;
              color: #333;
            }
            a.reply {
              margin-right: 10px;
            }
            span.reply-colon {
              color: #333;
              margin-right: 5px;
              margin-left: 2px;
            }
          }
        }
      }
    }
  }
}

</style>
<style lang="scss">
#detail {
  .article-body {
    width: 100%;
    margin: 35px 0 19px 0;
    .wrap {
      p {
        font-size: 16px;
        line-height: 30px;
      }
    }
  }
}
</style>
