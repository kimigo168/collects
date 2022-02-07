<template>
  <div id="create">
    <Header title="底稿选择"></Header>

    <div class="article-list" id="article-list-swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item,$index) in articleList" :data-index="$index">
          <div class="swiper-slide-inner">
            <div class="scroll write-scroll">
              <h3 class="title">{{articleTitle}}</h3>
              <div class="article" v-html="item.summray"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>


    <div class="tip-model" v-show="tipModelShow" @tap="closeTipModel()">

      <img class="img1" src="../../assets/images/create-icon_01.png"/>
      <img class="img2" src="../../assets/images/create-icon_02.png"/>
      <img class="img2 img3" src="../../assets/images/create-icon_02.png"/>

      <p class="text1">点击选择该篇底稿进入编辑模式</p>
      <p class="text2">左右滑动页面，查看同时生成的其他多篇底稿</p>

    </div>

  </div>
</template>

<script>
  import Header from '../Header.vue'

  export default {
    components: {
      Header,
    },
    data: function () {
      return {
        type: '1',

        articleTitle: '',
        articleList: [],

        tipModelShow: false,
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.userInfo
      },
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        var self = this;
        if (this.$route.query.type) {
          this.type = this.$route.query.type;
        }
        if (window.localStorage.createArticleList) {
          self.articleTitle = window.localStorage.createTitle;
          self.articleList = JSON.parse(window.localStorage.createArticleList);
          self.swiperInit();
        }
      },

      selectArticle(item,index) {
        if (this.userInfo.id) {
          if(this.type == '2'){
            _czc.push(['_trackEvent', '提纲底稿', '编辑底稿', '第'+index+'篇'])
          }else {
            _czc.push(['_trackEvent', '热点底稿', '编辑底稿', '第'+index+'篇'])
          }
          window.localStorage.editerContent = item.contentHtml;
          window.localStorage.editerTitle = this.articleTitle;
          window.localStorage.removeItem('editerId');
          this.$router.push({
            path: '/edit',
            query: {write: 1}
          })
        } else {
          this.$store.commit('setLoginModel', true);
        }
      },


      swiperInit() {
        var self = this;
        self.$nextTick(function () {
          self.articleSwiper = new Swiper('#article-list-swiper', {
//              autoplay: 4000,
            autoplayDisableOnInteraction: false,
            loop: self.articleList.length > 1,
            pagination: '.swiper-pagination',
            paginationClickable: true,
            onTap: function (swiper) {
              var index = $(swiper.clickedSlide).attr('data-index');
              console.log(index);
              self.selectArticle(self.articleList[index],index*1+1);
            }
          });


          var write = (obj, time, index) => {
            // 逐字写作过程
            var firstContent = obj.summray;
            obj.summray = '';
            var s = time;
            var m = 0;
            obj.timer = setInterval(() => {
              obj.summray += firstContent.slice(m, m + 1);
              self.$nextTick(() => {
                var writeScroll = document.getElementsByClassName('write-scroll')
                for (var i = 0; i < writeScroll.length; i++) {
                  writeScroll[i].scrollTop = 10000
                }
              });
              m++
              if (m >= firstContent.length) {
                if (obj.timer) clearInterval(obj.timer);
                self.$nextTick(() => {
                  var writeScroll = document.getElementsByClassName('write-scroll')
                  for (var i = 0; i < writeScroll.length; i++) {
                    writeScroll[i].scrollTop = 0
                  }
                });
              }
            }, s / firstContent.length)
          };
          for (let i = 0; i < self.articleList.length; i++) {
            write(self.articleList[i], 15000, i)
          }

          if (!window.localStorage.hasShowCreateTipModel) self.tipModelShow = true;
        })
      },

      closeTipModel() {
        this.tipModelShow = false;
        window.localStorage.hasShowCreateTipModel = 1;
      },
    }
  }
</script>

<style lang="scss">
  @import "../../assets/scss/app";

  #create {
    background: rgba(238, 239, 244, 1);
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
    .article-list {
      position: absolute;
      left: rem(40);
      right: rem(40);
      top: rem(115);
      bottom: rem(104);
      .swiper-slide-inner {
        height: 100%;
        margin: 0 rem(10);
        background: rgba(255, 255, 255, 1);
        border-radius: rem(10);
        box-sizing: border-box;
        position: relative;
        .scroll {
          position: absolute;
          top: rem(30);
          bottom: rem(30);
          left: 0;
          right: 0;
          box-sizing: border-box;
          padding: rem(34) rem(32) 0;
          .title {
            font-size: rem(40);
            font-weight: 600;
            color: rgba(51, 51, 51, 1);
            line-height: rem(56);
            margin-bottom: rem(56);
          }
          .article {
            font-size: rem(30);
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: rem(50);
            white-space: pre-wrap;
            p {
              margin-bottom: rem(50);
            }
          }
        }
      }
      .swiper-slide-active {
        height: 103%;
      }
      .swiper-pagination {
        bottom: rem(-80);
        .swiper-pagination-bullet-active {
          background-color: #246BFF;
        }
      }
    }

    .tip-model {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 99;
      background: rgba(0, 0, 0, 0.5);
      .img1 {
        position: absolute;
        left: 50%;
        top: rem(600);
        transform: translateX(-50%);
        width: rem(81);
      }
      .img2 {
        position: absolute;
        left: rem(32);
        bottom: rem(50);
        width: rem(95);
      }
      .img3 {
        left: auto;
        right: rem(32);
        transform: rotate(180deg);
      }

      p {
        position: absolute;
        left: 50%;
        top: rem(740);
        transform: translateX(-50%);
        width: rem(420);
        font-size: rem(28);
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: rem(42);
        text-align: center;
      }
      .text2 {
        top: auto;
        bottom: rem(32);
      }
    }
  }

</style>
