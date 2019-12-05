<template>
  <div id="order">
    <userHeader title="购买记录"></userHeader>


    <ul class="article-list">
      <li v-for="item in articleList">
        <h3 class="right">￥{{item.pay_price}}</h3>
        <h3>{{item.goods_name}}</h3>
        <p>{{item.create_time}}</p>
      </li>
    </ul>
    <a class="load-more" @tap="getArticleList(pageNum+1)">{{loadMoreText}}</a>


  </div>
</template>

<script>
  import userHeader from './userHeader.vue'

  export default {
    components: {
      userHeader,
    },
    data: function () {
      return {
        articleList:[],
        pageNum:1,
        pageSize:10,

        loadMoreText: '点击加载更多',
      }
    },
    created() {
     this.getArticleList(1);
    },
    methods: {

      getArticleList(pageNum) {
        var self = this;
        self.loadMoreText = '加载中…';
        self.$store.commit('setLoading', true);
        self.$http({
          url: apiHost + "/order/list.do",
          data: {
            pageNum: pageNum || 1,
            pageSize: self.pageSize,
          },
          success: function (data) {
            self.loadMoreText = '点击加载更多';
            self.$store.commit('setLoading', false);
            if (data.code == 0 && data.data && data.data.data && data.data.data.length>0) {
              if (pageNum && pageNum > 1) {
                self.articleList = self.articleList.concat(data.data.data);
              } else {
                self.articleList = data.data.data;
              }
              self.pageNum = pageNum || 1;
            }else {
              if (pageNum && pageNum > 1) {
                self.loadMoreText = '没有更多了';
              } else {
                self.articleList = [];
                self.loadMoreText = '暂无数据';
              }
            }
          }
        })
      },
    }
  }
</script>

<style lang="scss">
  @import "./../../assets/scss/app.scss";

  #order {
    padding: rem(88) rem(30);
    .article-list{
      li{
        padding:rem(33) 0 rem(17);
        border-bottom: 1px solid #E5E5E5;
        .icon{
          float: right;
          width: rem(16);
          margin-top: rem(7);
        }
        h3{
          font-size:rem(32);
          color:rgba(51,51,51,1);
          line-height:rem(45);
          margin-bottom: rem(18);
        }
        p{
          font-size:rem(28);
          color:rgba(141,141,141,1);
          line-height:rem(40);
          margin-bottom: rem(10);
          max-height: rem(80);
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        span{
          display: block;
          font-size:rem(24);
          color:rgba(178,178,178,1);
          line-height:rem(33);
          text-align: right;
        }
      }
    }

    .load-more{
      display: block;
      text-align: center;
      font-size: rem(28);
      line-height: rem(40);
      margin-top: rem(30);
      color: #666;
    }
  }

</style>
