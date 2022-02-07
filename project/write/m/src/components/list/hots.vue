<template>
  <div id="hots">
    <Header title="热点写作"></Header>

    <div class="search-box clearfix" v-show="!tipModelShow">
      <input type="text" placeholder="输入标题或选择下方写作类型" v-model="keyword" :class="{'shadow':keywordShadow}" @focus="keywordShadow=false"/>
      <button type="button" :disabled="!keyword" @tap="clickWrite()">写作</button>
    </div>


    <div class="hot-box">
      <h3 class="title">热度榜单</h3>
      <div class="tabs">
        <span v-for="item in hotsTypeList" :class="{'active':hotsTypeItem==item}"
              @tap="hotTypeChange(item)">{{item}}</span>
      </div>
      <ul class="news-list clearfix">
        <li v-for="item in hotsWordList" @tap="getHotKeyword(item)">
          <img class="img" :src="item.image ? item.image : normalImgUrl"
               onerror="this.src = './static/public/images/normal-img.png'"/>
          <h3>{{item.keyword}}</h3>
          <p>
            <img src="../../assets/images/hots-icon_01.png"/>
            <span>热度：{{item.si}}</span>
          </p>
        </li>
      </ul>

      <button type="button" class="reload-btn" @tap="reloadHotWordList()" v-show="hotsWordList.length>0">
        <img src="../../assets/images/reload-icon.png"/>
        <span>换一批</span>
      </button>
    </div>


    <div class="hot-box hot-box2">
      <h3 class="title">最新资讯</h3>
      <div class="scroll-x" v-show="channelList.length>0">
        <div class="tabs" id="channel-tabs">
          <span v-for="item in channelList" :class="{'active':channelCode==item.code}"
                @tap="channelTypeChange(item)">{{item.name}}</span>
        </div>
      </div>
      <ul class="news-list clearfix">
        <li v-for="item in channelNewsListShow" @tap="getKeyword(item.title,item.keywords)">
          <img class="img" :src="item.image ? item.image[0] : normalImgUrl"
               onerror="this.src = './static/public/images/normal-img.png'"/>
          <h3>{{item.title}}</h3>
        </li>
      </ul>
      <button type="button" class="reload-btn" @tap="reloadChannelNewsList()" v-show="channelNewsList.length>0">
        <img src="../../assets/images/reload-icon.png"/>
        <span>换一批</span>
      </button>
    </div>


    <div class="tip-model" v-show="tipModelShow" @tap="closeTipModel()">

      <div class="search-box clearfix">
        <input type="text" placeholder="输入标题或选择下方写作类型" v-model="keyword"/>
        <button type="button" disabled>写作</button>
      </div>

      <img src="../../assets/images/hots-icon_02.png"/>
      <p>输入文字，或选择下方热点、最新资讯，即可点击写作！</p>
    </div>


    <transition name="router-fade" mode="out-in">
      <div class="normal-model sensitive-tip" v-show="sensitiveTipShow">
        <div class="model" @tap="sensitiveTipShow=false"></div>
        <div class="content">
          <h3>检测到标题中包含敏感信息，确认继续以此标题写作？</h3>
          <div class="btns clearfix">
            <button type="button" class="btn3 left" @tap="sensitiveTipShow=false">取消</button>
            <button type="button" class="btn2 right" @tap="yesToWrite()">确定</button>
          </div>
        </div>
      </div>
    </transition>
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
        normalImgUrl: './static/public/images/normal-img.png',

        keyword: '',
        keywordShadow:false,

        hotsTypeList: ['实时热点', '民生热点', '娱乐热点', '体育热点'],
        hotsTypeItem: '',
        hotsWordList: [],
        hotsPage: 0,

        channelList: [],
        channelCode: '',
        channelName: '',
        channelNewsList: [],
        channelNewsListShow: [],
        channelPage: -1,

        tipModelShow: false,

        sensitiveTipShow: false,
      }
    },
    created() {
      this.hotTypeChange(this.hotsTypeList[0]);
      this.getChannelList();

    },
    methods: {

      clickWrite() {
        var self = this;
        _czc.push(['_trackEvent', '热点写作', '点击智能写作', this.keyword])
        if (!self.keyword) {
          self.$store.commit('setToolTip', '请输入关键词!');
          return
        }
        self.$checkSensitiveWord( self.keyword ,function (data,length) {
          if(length===0){
            self.yesToWrite()
          }else {
            self.sensitiveTipShow=true;
          }
        })
      },
      yesToWrite(){
        var self = this;
        self.sensitiveTipShow=false;
        self.$store.commit('setLoading', '底稿生成中…');
        self.$http({
          url: apiHost + "/writing/article.do",
          data: {
            keyword: self.keyword,
            platform: 'h5',
          },
          success: function (data) {
            self.$store.commit('setLoading', false);
            if (data.code == '0') {
              if (data.data && data.data.result && data.data.result.length > 0) {
                var list = data.data.result;
                for (var i = 0; i < list.length; i++) {
                  list[i].contentHtml = '<p>' + list[i].summray.replace(/\n\n/g, '\n').replace(/\n/g, '</p><p>') + '</p>'
                  list[i].summray = list[i].summray.replace(/\n/g, '\n\n')
                }

                window.localStorage.createArticleList = JSON.stringify(list);
                window.localStorage.createTitle = self.keyword;
                self.$router.push({
                  path: '/create',
                  query:{
                    type:1
                  }
                })
              } else {
                self.$store.commit('setToolTip', '未能写出有效文章，请更换关键词！');
              }
            } else if (data.code == "7003") {
              self.$store.commit('setCode7003Model', true);
            } else {
              self.$store.commit('setToolTip', data.msg);
            }
          }
        });
      },

      hotTypeChange(item) {
        this.hotsTypeItem = item;
        this.hotsPage = 0;
        this.getHotWordList();

        _czc.push(['_trackEvent', '热点写作', '点击热点榜单分类', this.hotsTypeItem])
      },
      reloadHotWordList() {
        _czc.push(['_trackEvent', '热点写作', '点击刷新热点榜单'])
        this.getHotWordList();
      },
      getHotWordList() {
        var self = this;
        self.$store.commit('setLoading', true);
        self.$http({
          url: apiHost + "/hotspot/list.do",
          data: {
            content: self.hotsTypeItem,
            page: self.hotsPage,
            size: 6
          },
          success: function (data) {
            self.$store.commit('setLoading', false);
            if (data.code == 0 && data.data && data.data.data) {
              self.hotsWordList = data.data.data.slice(0, 6);

              let max = Math.ceil(data.data.total / 6);
              if (self.hotsPage < max - 1) {
                self.hotsPage++
              } else {
                self.hotsPage = 0
              }
            }
          }
        })
      },
      getHotKeyword(item) {
        this.keyword = item.keyword;
        if (!window.localStorage.hasShowHotsTipModel) this.tipModelShow = true;

        this.keywordShadow=false;
        setTimeout(()=>{
          this.keywordShadow=true;
        },100);

        _czc.push(['_trackEvent', '热点写作', '点击热点标题', this.hotsTypeItem])
      },


      getChannelList() {
        var self = this;
        self.$http({
          url: apiHost + "/news/cat/list.do",
          success: function (data) {
            if (data.code == 0 && data.data) {
              let arr = []
              for (let item in data.data) {
                arr.push({
                  name: item,
                  code: data.data[item]
                })
              }
              self.channelList = arr;
              self.channelTypeChange(self.channelList[0]);

              self.$nextTick(function () {
                var channelTabs = $('#channel-tabs');
                var spans = channelTabs.find('span');
                var width = 0;
                for (var i = 0; i < spans.length; i++) {
                  width += spans[i].offsetWidth;
                }
                channelTabs.css('width', width + 10)
              })
            }
          }
        })
      },
      channelTypeChange(item) {
        this.channelCode = item.code;
        this.getChannelNewsList();

        this.channelName = item.name;
        _czc.push(['_trackEvent', '热点写作', '点击最新资讯分类', this.channelName])
      },
      getChannelNewsList() {
        var self = this;
        self.$store.commit('setLoading', true);
        self.$http({
          url: apiHost + "/news/list.do",
          data: {
            channelCode: this.channelCode,
            size: 200
          },
          success: function (data) {
            self.$store.commit('setLoading', false);
            if (data.code == 0 && data.data) {
              self.channelNewsList = data.data;
              self.channelPage = -1;
              self.channelPageChange()
            }
          }
        })
      },
      reloadChannelNewsList(){
        this.channelPageChange();
        _czc.push(['_trackEvent', '热点写作', '点击刷新最新资讯'])
      },
      channelPageChange() {
        if ((this.channelPage + 1) * 6 < this.channelNewsList.length) {
          this.channelPage++;
        } else {
          this.channelPage = 0;
        }
        this.channelNewsListShow = this.channelNewsList.slice(this.channelPage * 6, (this.channelPage + 1) * 6);
      },


      getKeyword(content,keywords) {
        var self = this;
        self.keyword =keywords || content;
        if (!window.localStorage.hasShowHotsTipModel) self.tipModelShow = true;

        self.keywordShadow=false;
        setTimeout(()=>{
          self.keywordShadow=true;
        },100);

        _czc.push(['_trackEvent', '热点写作', '点击最新资讯标题', this.channelName])

//        self.$store.commit('setLoading', true);
//        self.$http({
//          url: apiHost + "/material/getKeyWord.do",
//          data: {
//            content: content
//          },
//          success: function (data) {
//            self.$store.commit('setLoading', false);
//            if (data.code == 0 && data.data && data.data.keywords) {
//                self.keyword=data.data.keywords.join(' ');
//              if(!window.localStorage.hasShowHotsTipModel) self.tipModelShow=true;
//
//              self.keywordShadow=false;
//              setTimeout(()=>{
//                self.keywordShadow=true;
//              },100);
//            }else {
//              self.$store.commit('setToolTip', data.msg);
//            }
//          }
//        });
      },

      closeTipModel() {
        this.tipModelShow = false;
        window.localStorage.hasShowHotsTipModel = 1;
      },


    }
  }
</script>

<style lang="scss">
  @import "../../assets/scss/app";

  #hots {
    padding: rem(230) rem(30) 0;
    position: relative;
    .search-box {
      position: fixed;
      top: rem(88);
      left: 0;
      right: 0;
      z-index: 9;
      padding: rem(33) rem(30) rem(10);
      background-color: #ffffff;
      input {
        float: left;
        width: rem(550);
        height: rem(68);
        background: rgba(250, 250, 251, 1);
        border-radius: rem(48);
        border: 1px solid rgba(156, 194, 220, 1);
        font-size: rem(30);
        padding: 0 rem(26);
        box-sizing: border-box;
        transition: all 0.2s;
        &:focus{
          border-color: #246BFF;
        }
        &.shadow{
          animation: shadow 0.8s ease;
          animation-fill-mode: forwards;
        }
        @keyframes shadow {
          0%{
            box-shadow:none;
          }
          16%{
            box-shadow:0px 0px 12px 3px rgba(31,111,212,0.3);
          }
          33%{
            box-shadow:none;
          }
          50%{
            box-shadow:0px 0px 12px 3px rgba(31,111,212,0.3);
          }
          66%{
            box-shadow:none;
          }
          100%{
            box-shadow:0px 0px 12px 3px rgba(31,111,212,0.3);
          }
        }
      }
      button {
        float: right;
        width: rem(120);
        height: rem(68);
        background: #246BFF;
        border-radius: rem(48);
        font-size: rem(30);
        color: #ffffff;
        border: none;
        &:disabled {
          background: rgba(127, 136, 154, 1);
          cursor: not-allowed;
        }
      }
    }

    .hot-box {
      padding-bottom: rem(108);
      .title {
        font-size: rem(42);
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        line-height: rem(60);
        text-align: center;
        padding-bottom: rem(36);
      }
      .tabs {
        padding: 0 rem(20);
        border-radius: rem(36);
        border: 1px solid rgba(228, 228, 228, 1);
        white-space: nowrap;
        text-align: center;
        min-width: 100%;
        box-sizing: border-box;
        span {
          line-height: rem(70);
          display: inline-block;
          padding: 0 rem(20);
          font-size: rem(28);
          color: rgba(51, 51, 51, 1);
          &.active {
            color: #0E5DFF;
          }
        }
      }
      .news-list {
        padding: rem(24) 0 0;
        li {
          width: rem(330);
          float: left;
          margin-bottom: rem(30);
          &:nth-child(2n) {
            float: right;
          }
          .img {
            display: block;
            width: 100%;
            height: rem(190);
            margin-bottom: rem(10);
            border-radius: rem(10);
            border: 1px solid rgba(228, 228, 228, 1);
            object-fit: cover;
          }
          h3 {
            font-size: rem(30);
            color: rgba(51, 51, 51, 1);
            line-height: rem(42);
            height: rem(42);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: rem(8);
          }
          p {
            text-align: right;
            font-size: rem(20);
            color: rgba(153, 153, 153, 1);
            line-height: rem(28);
            img {
              width: rem(24);
              vertical-align: bottom;
              margin-right: rem(10);
            }
          }
        }
      }

      .reload-btn {
        display: block;
        margin: 0 auto;
        border: none;
        width: rem(204);
        height: rem(60);
        background: rgba(36, 107, 255, 1);
        border-radius: rem(30);
        font-size: rem(30);
        color: #ffffff;
        img {
          width: rem(30);
          margin-right: rem(5);
        }
      }
    }

    .hot-box2 {
      .tabs {
        span {
          padding: 0 rem(30);
        }
      }
      .news-list li {
        position: relative;
        .img {
          height: rem(210);
          margin: 0;
        }
        h3 {
          position: absolute;
          left: 0;
          bottom: 0;
          right: 0;
          font-size: rem(30);
          color: rgba(255, 255, 255, 1);
          line-height: rem(42);
          padding: 0 rem(12) rem(12);
          background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
          margin: 0;
        }
      }
    }

    .tip-model {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      .search-box {
        position: absolute;
        top: rem(111);
        left: rem(20);
        right: rem(20);
        background-color: #ffffff;
        padding: rem(10);
        border-radius: rem(88);
      }
      & > img {
        position: absolute;
        right: rem(60);
        top: rem(210);
        width: rem(112);
      }
      p {
        position: absolute;
        left: 50%;
        top: rem(332);
        transform: translateX(-50%);
        width: rem(600);
        font-size: rem(30);
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: rem(44);
        text-align: center;
      }
    }

  }
</style>
