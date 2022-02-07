<template>
  <div id="info-query">
    <div class="container">
      <div class="content-path">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>搜索</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="search-wrap">
        <div class="block">
          <span class="demonstration">时间</span>
          <el-date-picker
            v-model="searchForm.time"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
        <label for="title" class="label-text">标题</label>
        <input type="text" id="title" v-model="searchForm.title" autocomplete="off">
        <label for="tag" class="label-text">标签</label>
        <input type="text" id="tag"  v-model="searchForm.tag" autocomplete="off"/>
        <button @click="searchFun">搜 索</button>
      </div>
      <div class="main" v-if="noData">
        <div class="img">
          <img src="../../images/Clipboard.png" alt />
          <p>暂无内容</p>
        </div>
      </div>
      <ul class="news-list">
        <li v-for="(item, index) in newsList" :key="index">
          <!-- contextType:1普通资讯,2:专题 -->
          <div class="item-wrap" @click="viewDetail(item, 1)" :class="{'no-cover-item':!item.imgCover}">
            <img v-if="item.imgCover" :src="item.imgCover" alt="" class="cover">
            <div class="content" >
              <h3 class="title" v-html="item.title"></h3>
              <p class="desc" v-html="item.summary"></p>
              <span v-if="item.contextType==2" class="zhuanti">专题</span>
              <div class="info">
                <span class="stick" v-if="item.isStick==1">置顶</span>
                <span class="source" v-if="item.source">{{item.source}}</span>
                <span class="publishTime">{{item.time?new Date(item.time).format('YYYY-MM-DD'):''}}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="loadingTip" v-if="loading"></div>
  </div>
</template>

<script>
export default {
  name: 'search',
  data () {
    return {
      loading: false,
      pageNum: 1,
      pageSize: 10,
      searchForm: {
        name: '',
        title: '',
        tag: '',
        desc: '',
        time: []
      },
      newsList: [],
      sw: true,
      noData: false
    }
  },
  methods: {
    searchFun () {
      this.pageNum = 1
      this.newsList = []
      this.searchList()
    },
    searchList () {
      if (!this.searchForm.title && !this.searchForm.tag && (!this.searchForm.time || this.searchForm.time.length === 0)) {
        this.$message({ type: 'warning', message: '请输入标题或标签，或选择时间范围进行搜索', showClose: true })
        return
      }
      this.loading = true
      this.noData = false
      this.sw = true
      this.$axios.post(this.$global.API.searchNews,
        {
          title: this.searchForm.title,
          keyword: this.searchForm.tag,
          timeStart: this.searchForm.time && this.searchForm.time[0] ? this.searchForm.time[0] + ' 00:00:00' : '',
          timeEnd: this.searchForm.time && this.searchForm.time[1] ? this.searchForm.time[1] + ' 23:59:59' : '',
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      ).then((res) => {
        this.loading = false
        if (res.code === '0' && res.data && res.data.list && res.data.list.length > 0) {
          let list = res.data.list
          list.map((item) => {
            if (item.cover) {
              try {
                item.imgCover = JSON.parse(item.cover)[0] ? JSON.parse(item.cover)[0].url : ''
              } catch (error) {
                item.imgCover = ''
              }
            }
          })
          if (this.pageNum === 1) {
            this.newsList = list
          } else {
            this.newsList = this.newsList.concat(list)
          }
          this.pageNum++
        } else {
          if (this.pageNum > 1) {
            this.$message({ type: 'warning', message: '没有更多数据', showClose: true })
          } else {
            this.noData = true
          }
        }
      })
    },
    scrollHandle () {
      if (document.documentElement.scrollTop > 0 && (document.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight)) {
        if (this.sw) {
          this.sw = false
          setTimeout(() => {
            this.searchList()
          }, 500)
        }
      }
    },
    viewDetail (item) {
      this.$router.push({
        path: '/detail',
        query: {
          cid: item._id
        }
      })
    }
  },
  mounted () {
    window.addEventListener('scroll', this.scrollHandle, false)
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollHandle, false)
  }
}
</script>

<style lang="scss" scoped>
#info-query {
  width: 100%;
  height: 100%;
  background: rgba(244, 244, 244, 1);
  padding-top: 119px;
  .container {
    width: 1200px;
    min-height: 680px;
    background: rgb(255, 255, 255);
    margin: 0 auto;
    padding-top: 40px;
    .content-path {
      margin-left: 85px;
    }
    .main {
      width: 100%;
      padding: 0 84px;
      .img {
        width: 120px;
        height: 160px;
        margin: 140px auto;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        p {
          height: 20px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          line-height: 20px;
        }
      }
    }
  }
  .search-wrap {
    width: 100%;
    padding: 20px 84px 30px;
    div.block {
      display: inline-block;
      .demonstration {
        margin: 10px 12px 10px 0px;
      }
    }
    input {
      width: 160px;
      height: 40px;
      background: rgba(244, 244, 244, 1);
      border-radius: 2px;
      border: 1px solid rgba(228, 228, 228, 1);
      padding-left: 5px;
    }
    button {
      width: 100px;
      height: 40px;
      background: rgba(10, 151, 237, 1);
      border-radius: 2px;
      color: #fff;
      margin-left: 40px;
    }
    label.label-text {
      width: 28px;
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 20px;
      padding: 10px 12px 10px 30px;
    }
  }
  .news-list {
    background-color: #fff;
    padding: 0 20px;
    margin-bottom: 40px;
    li {
      // height: 50px;
      padding: 19px 0;
      border-bottom: 1px solid #EDEDED;
      .item-wrap {
        height: 140px;
        position: relative;
        .cover {
          width:270px;
          height:140px;
          position: absolute;
          left: 0;
          top: 0;
        }
        .content {
          height: 100%;
          padding-left: 300px;
          position: relative;
          .title {
            height: 27px;
            overflow: hidden;/*超出部分隐藏*/
            text-overflow:ellipsis;/* 超出部分显示省略号 */
            white-space: nowrap;/*规定段落中的文本不进行换行 */
            font-size: 21px;
            font-weight: bold;
            color: #333333;
            margin-bottom: 10px;
          }
          .desc {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
          }
          .info {
            height: 24px;
            line-height: 24px;
            span {
              display: inline-block;
              font-size: 12px;
            }
            .stick {
              color: #0A97ED;
              margin-right: 30px;
            }
            .source {
              margin-right: 20px;
              color: #999999;
            }
            .publishTime {
              color: #999999;
            }
          }
          .zhuanti {
            width:70px;
            height:26px;
            text-align: center;
            line-height: 26px;
            border-radius:3px;
            color: #0A97ED;
            border:1px solid rgba(10,151,237,1);
            position: absolute;
            right: 0;
            top: 0;
          }
        }
      }
      .no-cover-item {
        height: 100px;
        .content {
          padding-left: 0;
          .desc {
            height: 48px;
            -webkit-line-clamp: 2;
          }
        }
      }

    }
  }
}
</style>
