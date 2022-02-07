<template>
  <div id="outline">
    <Header title="提纲写作"></Header>

    <h3 class="title">提纲写作</h3>

    <ul class="outline-list">
      <li v-for="item in templateList" @tap="clickTemplateCheck(item)">
        <img :src="item.img"/>
        <div class="text">
          <h3>{{item.name}}模板</h3>
          <p>{{item.desc}}</p>
        </div>
      </li>
      <li>
        <img :src="'./static/public/images/outline-img_101.png'"/>
      </li>
    </ul>

    <transition name="router-fade" mode="out-in">
      <div class="write-model" v-show="writeModelShow">
        <div class="model" @tap="writeModelShow=false"></div>
        <div class="content">
          <div class="search-box">
            <input type="text" v-model="keyword" :placeholder="templateCheckItem.inputType"/>
            <button type="button" @tap="clickWrite()">
              <img src="./../../assets/images/home-icon_write.png"/>
              <span>智能写作</span>
            </button>
          </div>
          <p class="tip">大纲描述：{{templateCheckItem.desc}}</p>
        </div>
      </div>
    </transition>

    <transition name="router-fade" mode="out-in">
      <div class="normal-model sensitive-tip" v-show="sensitiveTipShow">
        <div class="model" @tap="sensitiveTipShow=false"></div>
        <div class="content">
          <h3>检测到标题中包含敏感信息，确认继续以此主题写作？</h3>
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
        templateList: [
          {
            'name': '娱乐八卦',
            'desc': '适用于写娱乐八卦，包括某热门事件、恋情、个人作品、奖项和故事。',
            'inputType': '输入类型：人名，例如范冰冰，迪丽热巴，热巴',
            'img': './static/public/images/outline-img_002.png',
          },
          {
            'name': '科技新闻',
            'desc': '适用于写科技新闻，包括关于某应用领域、发展历程、特点特征、面临的挑战。',
            'inputType': '输入类型：技术名，例如区块链，人工智能',
            'img': './static/public/images/outline-img_003.png',
          },
          {
            'name': '热点事件介绍',
            'desc': '适用于写近期热点事件文章。',
            'inputType': '输入类型：事件主角，例如乔碧萝',
            'img': './static/public/images/outline-img_004.png',
          },
          {
            'name': '商业人物传记',
            'desc': '适用于商界人物的相关介绍。',
            'inputType': '输入类型：人名，例如马云',
            'img': './static/public/images/outline-img_005.png',
          },
          {
            'name': '电影影评',
            'desc': '适用于电影的相关介绍及评论。',
            'inputType': '输入类型：电影名，例如哪吒',
            'img': './static/public/images/outline-img_006.png',
          },
          {
            'name': '退役新闻',
            'desc': '适用于写体育类退役新闻，包括某正式退役，退役的原因。荣誉和对某退役的感慨。',
            'inputType': '输入类型：人名，例如科比，帕克',
            'img': './static/public/images/outline-img_001.png',
          },
        ],
        templateCheckItem: {},

        writeModelShow: false,
        keyword: '',

        sensitiveTipShow: false,

      }
    },
    created() {

    },
    methods: {

      clickTemplateCheck(item) {
        this.templateCheckItem = item;
        this.writeModelShow = true;
        this.keyword = '';

        _czc.push(['_trackEvent', '提纲写作', '点击模板',this.templateCheckItem.name])
      },

      clickWrite(){
        var self=this;
        _czc.push(['_trackEvent', '提纲写作', '点击智能写作',this.keyword])

        if(!self.keyword){
          self.$store.commit('setToolTip', '请输入主题搜索!');
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
          url: apiHost + "/writing/template_article.do",
          data: {
            keyword: self.keyword,
            templateName: self.templateCheckItem.name,
            platform:'h5',
          },
          success: function (data) {
            self.$store.commit('setLoading', false);
            if (data.code == '0') {
              if(data.data){
                var summray = data.data;
                var item={
                  contentHtml:'<p>' + summray.replace(/\n\n/g, '\n').replace(/\n/g, '</p><p>') + '</p>',
                  summray:summray,
                };
                window.localStorage.createArticleList = JSON.stringify([item]);
                window.localStorage.createTitle = self.keyword;
                self.$router.push({
                  path: '/create',
                  query:{
                    type:2
                  }
                })
              }else {
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

    }
  }
</script>

<style lang="scss">
  @import "../../assets/scss/app";

  #outline {
    padding: rem(88) rem(30) rem(30);
    position: relative;
    .title {
      text-align: center;
      font-size: rem(42);
      font-weight: bolder;
      color: rgba(51, 51, 51, 1);
      line-height: rem(60);
      padding: rem(45) 0 rem(40);
    }
    .outline-list {
      display: -webkit-flex;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      li {
        width: rem(330);
        height: rem(450);
        margin-bottom: rem(32);
        cursor: pointer;
        position: relative;
        img {
          display: block;
          width: 100%;
        }
        .text {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: rem(15) rem(20);
          background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
          h3 {
            font-size: rem(30);
            font-weight: bolder;
            color: rgba(255, 255, 255, 1);
            line-height: rem(42);
          }
          p {
            font-size: rem(26);
            color: rgba(255, 255, 255, 1);
            line-height: rem(37);
            margin-top: rem(10);
            max-height: rem(74);
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }

      }
    }

    .write-model {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;

      .model {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
      }
      .content {
        position: absolute;
        left: 50%;
        top: 40%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 1);
        border-radius: rem(10);
        width: rem(550);
        padding: rem(60) rem(70) rem(50);
        .search-box {
          text-align: center;
          input {
            display: block;
            width: 100%;
            height: rem(88);
            background: rgba(255, 255, 255, 1);
            border-radius: rem(48);
            border: 1px solid rgba(156, 194, 220, 1);
            margin-bottom: rem(30);
            box-sizing: border-box;
            padding: 0 rem(40);
            text-align: center;
            font-size: rem(26);
          }
          button {
            width: rem(270);
            height: rem(88);
            background: rgba(14, 93, 255, 1);
            border-radius: rem(48);
            border: none;
            img {
              width: rem(43);
              vertical-align: bottom;
            }
            span {
              font-size: rem(32);
              font-weight: 600;
              color: rgba(255, 255, 255, 1);
            }
          }
        }
        .tip {
          font-size: rem(26);
          color: rgba(153, 153, 153, 1);
          line-height: rem(37);
          margin-top: rem(30);
        }
      }
    }
  }
</style>
