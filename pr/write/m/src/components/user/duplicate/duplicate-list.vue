<template>
  <div id="duplicate-list">
    <userHeader title="查重结果"></userHeader>


    <ul class="article-list">
      <li v-for="item in articleList" @tap="clickEditArticle(item.id,item.status)">
        <img class="icon" src="../../../assets/images/user-icon_05.png"/>
        <h3>
          <span v-if="item.status == 0">查重中</span>
          <span class="success" v-if="item.status == 1">查重完成</span>
          {{item.title}}
        </h3>
        <p>{{item.summary}}</p>
        <span>{{item.checkTime}}</span>
      </li>
    </ul>


    <a class="load-more" @tap="getArticleList(pageNum+1)">{{loadMoreText}}</a>


  </div>
</template>

<script>
  import userHeader from '../userHeader.vue'

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
          url: apiHost + "/checking/list.do",
          data: {
            pageNum: pageNum || 1,
            pageSize: self.pageSize,
          },
          success: function (data) {
            self.loadMoreText = '点击加载更多';
            self.$store.commit('setLoading', false);
            if (data.code == 0 && data.data && data.data.data && data.data.data.length>0) {

              for(var i=0;i<data.data.data.length;i++){
                if(data.data.data[i].content) data.data.data[i].summary = data.data.data[i].content.replace(/<[^>]+>/g, "");
              }

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

      clickEditArticle(id,status){
        if(status == 0){
          this.$store.commit("setToolTip", "查重正在进行中，请稍后!");
          return
        }

        this.$router.push({
          path: '/duplicate-detail',
          query: {
            id:id,
          }
        })
      },

    }
  }
</script>

<style lang="scss">
  @import "../../../assets/scss/app";

  #duplicate-list {
    padding: rem(88) rem(30);
    .article-list{
      li{
        padding:rem(32) 0 rem(17);
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
          span{
            text-align: center;
            display: inline-block;
            width: rem(120);
            font-size:rem(24);
            color:rgba(64,141,255,1);
            line-height: rem(45);
            border-radius:rem(23);
            border:1px solid rgba(64,141,255,1);
            vertical-align: middle;
            &.success{
              color: #5AB81D;
              border-color: #5AB81D;
            }
          }
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
