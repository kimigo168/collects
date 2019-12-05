<template>
  <div class="book-mark-box">
    <div class="btn-delete-all">
      <button @click="emptyArticle">全部删除</button>
    </div>
    <div class="book-mark-list">
      <div class="img-text-box" v-for="item in collectList" :key="item.cid">
        <div class="img-text-item" v-if="item&&item.cover.length">
          <div class="img-text-item__inner" @click="viewDetail(item)">
            <div class="left-img">
              <img :src="item.cover[0]" alt />
            </div>
            <div class="right-text">
              <p class="title">{{item.title}}</p>
              <div class="text-box">
                <p>{{item.desc}}</p>
              </div>
              <div class="text-msg">
                <!-- <p>置顶</p> -->
                <div class="article-from">
                  <span>{{item.source}}</span>
                  <span class="time">{{item.publishTime}}</span>
                </div>
              </div>
            </div>
          </div>
          <span class="btn-delete" @click.stop="delArticle(item)"></span>
        </div>
        <div class="img-text-item text-only" v-else>
          <div class="img-text-item__inner" @click="viewDetail(item)">
            <p class="title">{{item.title}}</p>
            <div class="text-box">
              <p>{{item.desc}}</p>
            </div>
            <div class="text-msg">
              <!-- <p>置顶</p> -->
              <div class="article-from">
                <span>{{item.source}}</span>
                <span class="time">{{item.publishTime}}</span>
              </div>
            </div>
            <span class="btn-delete" @click.stop="delArticle(item)"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['collectList'],
  data () {
    return {
    }
  },
  methods: {
    viewDetail (item) {
      // 查看资讯详情
      this.$router.push({
        path: '/detail',
        query: {
          cid: item.cid
        }
      })
    },
    delArticle (item) {
      let nowPath = this.$route.path
      if (nowPath === '/collect') {
        this.$axios
          .post(
            this.$global.API.delCollect,
            this.$qs.stringify({
              newsId: item.cid
            })
          )
          .then(res => {
            if (res.code === '0') {
              this.$emit('updateCollectList')
              this.$message({ type: 'success', message: '删除成功', showClose: true, duration: '1000' })
            }
          })
      }
      if (nowPath === '/history') {
        this.$axios
          .post(this.$global.API.delHistory, {
            ids: item.id
          })
          .then(res => {
            if (res.code === '0') {
              this.$emit('updatehistoryList')
              this.$message({ type: 'success', message: '删除成功', showClose: true, duration: '1000' })
            }
          })
      }
    },
    emptyArticle () {
      this.$confirm('此操作将删除全部文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let nowPath = this.$route.path
        if (nowPath === '/collect') {
          this.$axios
            .post(
              this.$global.API.emptyCollect
            )
            .then(res => {
              if (res.code === '0') {
                this.$emit('updateCollectList')
              }
            })
        }
        if (nowPath === '/history') {
          this.$axios
            .post(this.$global.API.emptyHistory)
            .then(res => {
              if (res.code === '0') {
                this.$emit('updatehistoryList')
              }
            })
        }
        this.$message({
          type: 'success',
          message: '删除成功!',
          duration: '1000'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
          duration: '1000'
        })
      })
    }
  },
  watch: {
    $route (to, from) {
      this.$router.go(0)
    }
  }
}
</script>
<style lang="scss">
.book-mark-box {
  width: 100%;
  .img-text-box {
    width: 100%;
    .img-text-item {
      width: 100%;
      height: 180px;
      padding: 0px 85px;
      position: relative;
      cursor: pointer;
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
            overflow: hidden;
          }
          .text-box {
            margin: 10px 0;
            height: 72px;
            overflow: hidden;
            p {
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
        p.title {
          overflow: hidden;
        }
      }
      span.btn-delete {
        display: none;
        width: 20px;
        height: 20px;
        background-image: url("../images/delete-1.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: absolute;
        right: 36px;
        top: 72px;
      }
    }
    .img-text-item:hover {
      background: rgba(247, 251, 255, 1);
      span.btn-delete {
        display: inline-block;
      }
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
          overflow: hidden;
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
  .btn-delete-all {
    text-align: right;
    margin-left: 85px;
    margin-right: 85px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ededed;
    button {
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(10, 151, 237, 1);
      line-height: 20px;
    }
  }
}
</style>
