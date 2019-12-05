<template>
  <div id="special-topic">
    <div class="container">
      <div class="special-topic-item">
        <div class="topic-path">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>专题</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="img-text-box" v-loading="loading">
          <div class="img-text-item" v-for="(item, index) in topicList" :key="index" @click="viewDetail(item)">
            <div class="img-text-item__inner">
              <div class="left-img">
                <img :src="item.imgCover?item.imgCover:''" alt />
              </div>
              <div class="right-text">
                <p class="title">{{item.title}}</p>
                <div class="text-box">
                  <p class="desc">{{item.desc}}</p>
                </div>
                <div class="text-msg">
                  <!-- <p>置顶</p> -->
                  <div class="article-from">
                    <span>{{item.source}}</span>
                    <span class="time">{{item.publishTime?new Date(item.publishTime).format('YYYY-MM-DD'):''}}</span>
                  </div>
                </div>
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
  data () {
    return {
      loading: false,
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
      topicList: [],
      sw: true
    }
  },
  methods: {
    getTopicList () {
      this.loading = true
      this.$axios.post(this.$global.API.topicList,
        this.$qs.stringify({
          topicId: this.topicId,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        })
      ).then((res) => {
        this.loading = false
        if (res.code === '0') {
          let list = res.data.list
          list.map((item) => {
            if (item.cover && item.cover.length > 0) {
              try {
                item.imgCover = JSON.parse(item.cover)[0] ? JSON.parse(item.cover)[0].url : ''
              } catch (error) {
                console.log(error)
                item.imgCover = ''
              }
            }
          })
          if (this.pageNum === 1) {
            this.topicList = list
          } else {
            this.topicList.concat(list)
          }
          if (list.length === 0) {
            this.$message({ type: 'warning', message: `${this.pageNum === 1 ? '暂无数据' : '没有更多数据'}`, showClose: true })
          } else {
            this.pageNum++
          }
        }
      })
    },
    scrollHandle () {
      if (document.documentElement.scrollTop > 0 && (document.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight)) {
        if (this.sw) {
          this.sw = false
          setTimeout(() => {
            this.getTopicList()
          }, 500)
        }
      }
    },
    viewDetail (item) {
      this.$router.push({
        path: '/detail',
        query: {
          cid: item.cid
        }
      })
    }
  },
  created () {
    this.topicId = this.$route.query.id
    this.getTopicList()
    window.addEventListener('scroll', this.scrollHandle, false)
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollHandle, false)
  }
}
</script>

<style lang="scss" scoped>
#special-topic {
  width: 100%;
  height: 100%;
  background: rgba(244, 244, 244, 1);
  padding-top: 119px;
  .container {
    width: 1200px;
    background: rgb(255, 255, 255);
    margin: 0 auto;
    // height: 100%;
    .special-topic-item {
      width: 100%;
      padding-top: 40px;
      // border-bottom: 1px solid #ededed;
      .topic-path {
        margin-bottom: 19px;
        margin-left: 85px;
      }
      .img-text-box {
        width: 100%;
        .img-text-item {
          width: 100%;
          height: 180px;
          padding: 0px 85px;
          position: relative;
          .img-text-item__inner {
            height: 179px;
            margin: 0 auto;
            padding: 19px 0px;
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
              }
              .text-box {
                margin: 10px 0;
                height: 72px;

                p.desc {
                  line-height: 24px;
                  font-size: 14px;
                  font-weight: 400;
                  color: rgba(51, 51, 51, 1);
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 3;
                  overflow: hidden;
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
          }
          span.btn-delete {
            display: inline-block;
            width: 20px;
            height: 20px;
            background-image: url("../../images/delete.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
            position: absolute;
            right: 36px;
            top: 72px;
          }
        }
        .img-text-item.active {
          background: rgba(247, 251, 255, 1);
        }
        .img-text-item.text-only {
          height: 160px;
          .img-text-item__inner {
            height: 159px;
            padding: 19px 0;
            border-bottom: 1px solid #ededed;
            .title {
              height: 29px;
              font-size: 21px;
              font-weight: 600;
              color: rgba(51, 51, 51, 1);
              line-height: 29px;
            }
            .text-box {
              margin: 10px 0;
              height: 48px;

              p {
                line-height: 24px;
                font-size: 14px;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
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
        }
      }
    }
  }
}
</style>
