<template>
  <div id="home">
    <div class="container">
      <ul class="childchannel-list clearfix" v-if="childChannelList.length>0">
        <li v-for="(item, index) in childChannelList" @click="selectChildChannel(item, index)" :class="{'active': selectedChildIdx === index}" :key="index">
          {{item.channelName}}
        </li>
      </ul>
      <div class="carousel-wrap" v-show="carouselList.length > 0">
        <swiper :options="swiperOption" class="carousel">
          <swiper-slide v-for="(item, index) in carouselList" :key="index">
            <img :src="item.imageUrl"  class="bg-filter">
            <img :src="item.imageUrl" class="img-show" @click="viewDetail(item, 0)">
            <div class="title-wrap">
              <div class="cover"></div>
              <h3 class="title" @click="viewDetail(item, 0)">{{item.title}}</h3>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination">
          </div>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </div>
      <div class="news-list-wrap">
        <ul class="news-list">
          <li v-for="(item, index) in newsList" :key="index">
            <!-- contextType:1普通资讯,2:专题 -->
            <div class="item-wrap" :class="{'no-cover-item':item.cover.length==0}">
              <img v-if="item.cover && item.cover.length>0" :src="item.cover[0]" alt="" class="cover">
              <div class="content" >
                <h3 class="title" @click="viewDetail(item, 1)">{{item.title}}</h3>
                <p class="desc" @click="viewDetail(item, 1)" v-html="item.desc"></p>
                <span v-if="item.contextType==2" class="zhuanti">专题</span>
                <div class="info">
                  <span class="stick" v-if="item.isStick==1">置顶</span>
                  <span class="source" v-if="item.source">{{item.source}}</span>
                  <span class="publishTime">{{item.publishTime?new Date(item.publishTime).format('YYYY-MM-DD'):''}}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="loadingTip" v-if="loading"></div>
      <div class="noData" :class="{'isDown': childChannelList.length>0}" v-if="!loading && !newsList.length">
        <div class="img">
          <img src="../../images/Clipboard.png" alt />
          <p>暂无内容</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'home',
  data () {
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: 'fraction'
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        }
      },
      count: 0,
      loading: false,
      carouselList: [], // 轮播列表
      newsList: [], // 资讯列表
      stickList: [], // 置顶列表
      sw: true, // 请求开关
      lastNews: null, // 每次请求最后一条资讯
      childChannelList: [], // 子频道列表
      selectedChildChannel: null, // 选中的子频道
      selectedChildIdx: 0 // 选中子频道索引
    }
  },
  computed: {
    ...mapState(['selectedParentChannel'])
  },
  watch: {
    selectedParentChannel: { // 监听选中的父频道变化
      handler (newValue) {
        if (newValue && newValue.id) {
          let id = newValue.id
          this.lastNews = null
          this.newsList = [] // 清空资讯列表
          this.carouselList = []
          this.getChildChannelList(id)
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations(['SET_PARENTCHANNELLIST']),
    getParentChannelList () { // 获取父频道列表
      this.$axios.post(this.$global.API.parentChannel).then((res) => {
        if (res.code === '0' && res.data) {
          let arr = []
          arr = [...res.data.selectList, ...res.data.tjList]
          // arr去重
          arr = this.$uniqueArr(arr, 'id')
          this.SET_PARENTCHANNELLIST(arr)
        }
      })
    },
    getChildChannelList (id) { // 获取子频道列表
      this.childChannelList = []
      this.selectedChildChannel = null
      document.body.scrollTop = document.documentElement.scrollTop = 0
      this.$axios.post(this.$global.API.childChannel,
        this.$qs.stringify({
          channelId: id
        })
      ).then((res) => {
        if (res.code === '0' && res.data && res.data.nodeList) {
          this.childChannelList = res.data.nodeList
          this.selectedChildChannel = this.childChannelList[0]
          this.selectedChildIdx = 0
        }
        this.getNewsList()
      })
    },
    selectChildChannel (item, index) {
      this.selectedChildChannel = item
      this.selectedChildIdx = index
      this.lastNews = null
      this.newsList = [] // 清空资讯列表
      this.carouselList = []
      this.getNewsList()
    },
    getNewsList () { // 获取资讯列表
      this.loading = true
      this.$axios.post(this.$global.API.newsList, {
        channelPid: this.selectedParentChannel.id || '', // 父频道
        channelId: this.selectedChildChannel && this.selectedChildChannel.channelId ? this.selectedChildChannel.channelId : '', // 子频道
        adNum: 1, // 广告位置，默认1
        type: '', // 类型，多个类型
        publishTime: this.lastNews ? this.lastNews.publishTime : '',
        sort: this.lastNews ? this.lastNews.sort : '', // 排序号，最后那条数据的排序号
        version: ''
      }).then((res) => {
        this.loading = false
        this.sw = true
        if (res.code === '0' && res.data) {
          this.carouselList = res.data.carouselList
          let arr = res.data.newsList
          if (arr.length === 0 && this.lastNews) {
            this.$message({ type: 'warning', message: '没有更多了', showClose: true })
            return
          }
          let stickArr = res.data.stickChannelContext
          if (!this.lastNews) { // 第一次拼接置顶数据
            arr = [...stickArr, ...arr]
          }
          if (arr.length > 0) {
            this.lastNews = arr[arr.length - 1]
            this.newsList = this.newsList.concat(arr)
          }
        }
      })
    },
    viewDetail (item, index, event) { // 跳转查看资讯详情
      console.log(this.$refs)
      if (item.contextType === '2') { // 专题
        this.$router.push({
          path: '/topic',
          query: {
            id: item.cid
          }
        })
      } else { // 普通资讯
        if (index === 0) { // 轮播
          if (item.type === '1') { // 专题
            this.$router.push({
              path: '/topic',
              query: {
                id: item.contextId
              }
            })
          } else { // 普通资讯，广告
            this.$router.push({
              path: '/detail',
              query: {
                cid: index === 0 ? item.contextId : item.cid
              }
            })
          }
        } else { // 列表
          this.$router.push({
            path: '/detail',
            query: {
              cid: index === 0 ? item.contextId : item.cid
            }
          })
        }
      }
    },
    scrollHandle () {
      if (document.documentElement.scrollTop > 0 && (document.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight)) {
        if (this.sw) {
          this.sw = false
          setTimeout(() => {
            this.getNewsList()
          }, 500)
        }
      }
    }
  },
  created () {
    if (!this.selectedParentChannel) { // 没有选中父频道
      this.getParentChannelList()
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
#home {
  width: 100%;
  // height: 100%;
  // padding-top: 110px;
  position: absolute;
  left: 0;
  top: 110px;
  .container {
    position: relative;
  }
  .childchannel-list {
    min-height: 30px;
    line-height: 30px;
    background-color: #fff;
    margin-bottom: 10px;
    padding: 10px;
    li {
      height: 30px;
      float: left;
      padding: 0 14px;
      cursor: pointer;
      &.active {
        color: #fff;
        background-color: #0A97ED;
        border-radius: 4px;
      }
    }
  }
  /deep/.carousel-wrap {
    height: 360px;
    width: 100%;
    background-color: #252525;
    margin-bottom: 20px;
    position: relative;
    background:linear-gradient(270deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.4) 100%);
    .carousel {
      height: 360px;
      width: 100%;
      // overflow: visible;
      .swiper-slide {
        position: relative;
        img.img-show {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          margin: 0 auto;
          width: 750px;
          height: 100%;
        }
        img.bg-filter {
          width: 100%;
          height: 100%;
          opacity: 0.7;
          filter:blur(20px);
          z-index: -1;
        }
        .title-wrap {
          width:750px;
          height:80px;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          .cover {
            width:750px;
            height:80px;
            line-height: 50px;
            background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);
            position: absolute;
            bottom: 0;
            left: 0;
            opacity: .5;
          }
          .title {
            height: 55px;
            width: 750px;
            line-height: 50px;
            font-size: 24px;
            text-align: center;
            cursor: pointer;
            color: #fff;
            position: absolute;
            left: 0;
            bottom: 0;
            // transform: translateX(-50%);
          }
        }

      }
    }
    &:hover {
      .swiper-button-next, .swiper-button-prev {
        display: block;
      }
    }
    .swiper-button-next, .swiper-button-prev {
      display: none;
    }
    .swiper-button-next {
      background-image: url('../../images/arrow_right.png');
    }
    .swiper-button-prev {
      background-image: url('../../images/arrow_left.png');
    }
    .swiper-pagination {
      width:70px;
      height:30px;
      background:rgba(0,0,0,1);
      border-radius:15px;
      opacity:0.4;
      display: flex;
      justify-content: center;
      align-items: center;
      color:rgba(255,255,255,1);
      span {
        font-size:14px;
        font-weight:400;
        color:rgba(255,255,255,1);
        margin: 0 2px;
      }
    }
    .swiper-pagination-fraction {
      position: absolute;
      left: 1114px;
      top: 25px;
    }
    .swiper-pagination-bullets {
      z-index: 1000;
    }
    .swiper-pagination-bullet {
      background-color: #D8D8D8;
    }
    .swiper-pagination-bullet-active {
      background-color: #0A97ED;
    }
  }
  .news-list-wrap {
    overflow: auto;
    margin-bottom: 40px;
    .news-list {
      background-color: #fff;
      padding: 0 20px;
      // min-height: 540px;
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
              cursor: pointer;
              margin-bottom: 10px;
            }
            .desc {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
              cursor: pointer;
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
              height: 40px;
              -webkit-line-clamp: 2;
            }
          }
        }

      }
    }
  }
  .noData {
    width: 100%;
    min-width: 540px;
    padding: 0 84px;
    position: absolute;
    top: 30px;
    background: #fff;
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
  .isDown {
    top: 50px;
  }
}
</style>
