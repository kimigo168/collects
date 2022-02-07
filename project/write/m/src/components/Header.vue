<template>
  <div id="header">
    <a href="javascript:;" class="header-menu" @tap="navShow=!navShow">
      <span><i></i><i></i><i></i></span>
    </a>

    <div class="header-title">
      <img src="./../assets/images/header-logo.png"/>
      <span>{{title}}</span>
    </div>

    <a class="user-icon" @tap="toUserCenter()">
      <img :src="userInfo.headimgurl ? userInfo.headimgurl : './static/public/images/user-icon.png'"/>
    </a>
    <transition name="router-fade" mode="out-in">
      <div class="nav" v-show="navShow" @tap="navShow=false">
        <div class="list">
          <a href="javascript:;" @tap="clickPubCzc('/home','点击返回首页')">返回首页</a>
          <a href="javascript:;" @tap="clickPubCzc('/hots','点击热点写作菜单')">热点写作</a>
          <a href="javascript:;" @tap="clickPubCzc('/outline','点击提纲写作菜单')">提纲写作</a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    props: ['title'],
    data: function () {
      return {
        navShow: false
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.userInfo
      },
    },
    methods: {
      toUserCenter() {
        if (this.userInfo.id) {
          this.$router.push('/user-center');
          this.clickPubCzc(null,'点击个人中心')
        } else {
          this.$store.commit('setLoginModel', true);
        }
      },

      clickPubCzc(to,action) {
        var str = "";
        if (this.$route.path.indexOf('/home') > -1) {
          str = '首页'
        } else if (this.$route.path.indexOf('/hots') > -1) {
          str = '热点写作'
        } else if (this.$route.path.indexOf('/outline') > -1) {
          str = '提纲写作'
        } else {
          str = this.$route.path;
        }
        _czc.push(['_trackEvent', '顶部菜单', action, str]);

        if(to) this.$router.push(to);
      },

    }
  }
</script>

<style lang="scss">
  @import "./../assets/scss/app.scss";

  #header {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 9999;
    height: rem(88);
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.06);
    .header-menu {
      display: block;
      float: left;
      width: rem(80);
      height: rem(88);
      position: relative;
      span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      i {
        display: block;
        background: rgba(36, 107, 255, 1);
        width: rem(30);
        height: 2px;
        margin: 0 auto;
        & + i {
          margin-top: 3px;
        }
      }
    }

    .header-title {
      float: left;
      margin-top: rem(24);
      img {
        width: rem(258);
        margin-right: rem(18);
        vertical-align: sub;
      }
      span {
        padding-left: rem(18);
        font-size: rem(30);
        color: rgba(51, 51, 51, 1);
        line-height: rem(42);
        border-left: 1px solid #cccccc;
        font-weight: bolder;
      }
    }

    .user-icon {
      float: right;
      padding: rem(14) rem(30) 0 0;
      img {
        display: block;
        width: rem(60);
        border-radius: 50%;
      }
    }

    .nav {
      position: fixed;
      left: 0;
      top: rem(88);
      right: 0;
      bottom: 0;
      z-index: 99999;
      background: rgba(0, 0, 0, 0.5);
      .list {
        background-color: #ffffff;
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.06);
        padding: 0 rem(30);
        a {
          display: block;
          line-height: rem(100);
          font-size: rem(32);
          color: rgba(51, 51, 51, 1);
          text-align: center;
        }
        a + a {
          border-top: 1px solid #E5E5E5;
        }
      }
    }

  }
</style>
