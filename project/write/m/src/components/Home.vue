<template>
  <div id="home" :style="{backgroundImage:'url(./static/public/images/home-bj.png)'}">

    <div class="login-btn" @tap="showLoginModel" v-if="!userInfo.id">登录</div>
    <router-link class="login-btn" v-if="userInfo.id" to="/user-center">
      <img :src="userInfo.headimgurl ? userInfo.headimgurl : './static/public/images/user-icon.png'"/>
    </router-link>


    <div class="logo">
      <img src="./../assets/images/home-logo.png"/>
    </div>
    <div class="search-box">
      <input type="text" v-model="keyword" placeholder="输入关键词或选择写作类型"/>
      <button type="button" @tap="clickWrite()">
        <img src="./../assets/images/home-icon_write.png"/>
        <span>智能写作</span>
      </button>
    </div>

    <div class="bot">
      <div>
        <router-link to="/hots" onclick="_czc.push(['_trackEvent','首页','点击热点写作'])">
          <img src="./../assets/images/home-icon_01.png"/>
          <span>热点写作</span>
        </router-link>
        <router-link to="/outline" onclick="_czc.push(['_trackEvent','首页','点击提纲写作'])">
          <img src="./../assets/images/home-icon_03.png"/>
          <span>提纲写作</span>
        </router-link>
        <a href="javascript:;" @tap="botToolTip=true" onclick="_czc.push(['_trackEvent','首页','点击汽车写作'])">
          <img src="./../assets/images/home-icon_02.png"/>
          <span>汽车写作</span>
        </a>
      </div>
      <div>
        <a href="javascript:;" @tap="botToolTip=true">
          <img src="./../assets/images/home-icon_04.png"/>
          <span>股市快报</span>
        </a>
        <a href="javascript:;" @tap="botToolTip=true">
          <img src="./../assets/images/home-icon_05.png"/>
          <span>天气报道</span>
        </a>
        <a href="javascript:;" @tap="botToolTip=true">
          <img src="./../assets/images/home-icon_06.png"/>
          <span>体育赛事</span>
        </a>
      </div>
    </div>

    <div class="contact-model" :class="{'show':contactModeShow}">
      <div class="contact" @tap="contactModeShow=!contactModeShow">
        <img class="img1" src="./../assets/images/contact-icon_01.png"/>
        <img class="img2" src="./../assets/images/close.png"/>
        <span>联系客服</span>
      </div>
      <div class="contact-btns">
        <a class="a1" @tap="openQQ()">
          <img src="./../assets/images/contact-icon_qq.png"/>
        </a>
        <a class="a2" href="tel:0755-86720697">
          <img src="./../assets/images/contact-icon_phone.png"/>
        </a>
      </div>
    </div>


    <transition name="router-fade" mode="out-in">
      <div class="tool-tip" style="bottom: 1rem;top:auto;" v-show="botToolTip">请使用电脑访问www.giiso.com，体验更多AI写作题材</div>
    </transition>


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

  export default {
    data() {
      return {
        keyword: '',
        botToolTip: false,

        contactModeShow: false,

        sensitiveTipShow: false,
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.userInfo
      },
    },
    watch: {
      botToolTip(val) {
        if (val) {
          setTimeout(() => {
            this.botToolTip = false
          }, 3000)
        }
      }
    },
    created() {

    },
    mounted: function () {

    },
    methods: {
      clickWrite() {
        var self = this;
        _czc.push(['_trackEvent','首页','点击智能写作',this.keyword]);
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


      showLoginModel() {
        this.$store.commit('setLoginModel', true);
      },

      openQQ() {
        var qq = '2020601975';
        if (this.$isWeixin) {
          location.href='http://wpa.qq.com/msgrd?v=3&uin='+qq+'&site=qq&menu=yes';
        } else {
          location.href='mqqwpa://im/chat?chat_type=wpa&uin='+qq+'&version=1&src_type=web&web_src=oicqzone.com';
        }
      },

    }
  }
</script>

<style lang="scss">
  @import "./../assets/scss/app.scss";

  #home {
    min-height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    position: relative;
    .login-btn {
      width: rem(108);
      height: rem(108);
      background: url("./../assets/images/login-btn-bj.png") no-repeat center/cover;
      text-align: center;
      line-height: rem(100);
      font-size: rem(24);
      font-weight: 400;
      color: rgba(14, 93, 255, 1);
      cursor: pointer;
      position: absolute;
      right: rem(27);
      top: rem(43);
      img {
        width: rem(80);
        border-radius: 50%;
      }
    }

    .logo {
      padding: rem(230) 0 rem(73);
      img {
        width: rem(489);
        display: block;
        margin: 0 auto;
      }
    }
    .search-box {
      padding: 0 rem(45) rem(70);
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
        font-size: rem(30);
        transition: all 0.2s;
        &:focus{
          border-color: #246BFF;
        }
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

    .bot {
      padding: 0 rem(83);
      & > div {
        display: -webkit-flex; /* Safari */
        display: flex;
        justify-content: space-between;
      }
      a {
        display: block;
        text-align: center;
        margin-bottom: rem(30);
        img {
          display: block;
          width: rem(66);
          margin: 0 auto rem(20);
        }
        span {
          font-size: rem(24);
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: rem(33);
        }
      }
    }

    .contact-model {
      position: absolute;
      right: rem(45);
      bottom: rem(70);
      .contact {
        width: rem(87);
        height: rem(87);
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 7px 15px 0px rgba(114, 122, 139, 0.3);
        border-radius: 50%;
        position: relative;
        z-index: 9;
        img {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.3s;
        }
        .img1 {
          width: rem(45);
        }
        .img2 {
          width: 0;
        }
        span {
          position: absolute;
          bottom: rem(-48);
          left: 50%;
          transform: translateX(-50%);
          font-size: rem(24);
          color: rgba(153, 153, 153, 1);
          line-height: rem(48);
          text-align: center;
          white-space: nowrap;
        }
      }
      .contact-btns {
        a {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          width: rem(87);
          height: rem(87);
          background: linear-gradient(180deg, rgba(77, 135, 255, 1) 0%, rgba(14, 160, 255, 1) 100%);
          box-shadow: 0px 7px 15px 0px rgba(114, 122, 139, 0.3);
          border-radius: 50%;
          line-height: rem(87);
          text-align: center;
          opacity: 0;
          img {
            width: rem(37);
          }
        }
      }
      &.show {
        .contact {
          .img1 {
            width: 0;
          }
          .img2 {
            width: rem(32);
          }
        }
        .contact-btns {
          a {
            opacity: 1;
            &.a1 {
              right: 0;
              top: rem(-117);
            }
            &.a2 {
              bottom: 0;
              left: rem(-117);
            }
          }
        }
      }
    }
  }
</style>
