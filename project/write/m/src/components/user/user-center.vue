<template>
  <div id="user-center">
    <userHeader title="个人中心" to="/home"></userHeader>

    <div class="user-info">
      <div class="img">
        <img class="pic" :src="userInfo.headimgurl ? userInfo.headimgurl : './static/public/images/user-icon.png'"/>
        <img class="vip-icon" src="./../../assets/images/user-icon_02.png" v-if="userInfo.memberType  == 1" />
      </div>

      <h3>{{userInfo.nickname}}</h3>
      <p>我们诚挚地邀请您加入vip用户体验更多的服务</p>

      <a href="javascript:;" v-if="userInfo.memberType  == 1" @tap="goToPayCenter()">续费VIP</a>
      <a class="add-vip" href="javascript:;"  v-if="userInfo.memberType  == 0" @tap="goToPayCenter()">
        <img class="vip-icon" src="./../../assets/images/user-icon_03.png"/>
        <span>加入VIP</span>
      </a>
    </div>


    <div class="user-menu">
      <router-link to="/my-article">我的稿件</router-link>
      <router-link to="/order">购买记录</router-link>
      <router-link to="/duplicate-list">查重结果</router-link>
      <router-link to="/reset-pwd" v-if="userInfo.phone">修改密码</router-link>
      <router-link to="/feedback">意见反馈</router-link>
    </div>


    <a class="layout" href="javascript:;" @tap="logout()">退出登录</a>



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
      }
    },
    computed: {
      userInfo () {
        return this.$store.state.userInfo
      },
    },
    methods: {

      goToPayCenter(){
        var self = this;
        _czc.push(['_trackEvent','个人中心','点击VIP充值或续费'])

        if(self.$isWeixin){
          var redirect_url = location.href.split('#')[0];
          redirect_url = redirect_url + '#/pay-center?t=1';
          self.$http({
            url: apiHost + "/auth/wx/oauth/uri.do",
            data:{
              redirect_uri:encodeURIComponent(redirect_url),
              scene:2,
            },
            success: function (data) {
              if (data.code == 0 && data.data && data.data.authUrl) {
                location.href=data.data.authUrl;
              } else {
                self.$store.commit('setToolTip', data.msg);
              }
            }
          })
        }else {
          self.$router.push('/pay-center')
        }
      },

      //退出
      logout() {
        var self = this;
        self.$http({
          url: apiHost + "/auth/logout.do",
          data: {},
          success: function (data) {
            if (data.code == 0) {
              location.href = location.href.split('#')[0];
            }
          }
        })
      },
    }
  }
</script>

<style lang="scss">
  @import "./../../assets/scss/app.scss";

  #user-center {
    height: 100%;
    box-sizing: border-box;
    position: relative;
    padding-top: rem(88);
    .user-info {
      height: rem(236);
      background: rgba(64, 141, 255, 1);
      position: relative;
      .img {
        padding: rem(42) 0 0 rem(34);
        position: absolute;
        left: 0;
        top: 0;
        .pic {
          display: block;
          width: rem(120);
          height: rem(120);
          border-radius: 50%;
        }
        .vip-icon {
          position: absolute;
          right: rem(-20);
          bottom: rem(10);
          width: rem(74);
        }
      }

      h3 {
        font-size: rem(32);
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: rem(45);
        padding: rem(58) 0 rem(9) rem(200);
      }
      p {
        font-size: rem(26);
        color: rgba(255, 255, 255, 1);
        line-height: rem(37);
        padding: 0 rem(45) rem(9) rem(200);
      }
      a {
        position: absolute;
        left: 50%;
        bottom: rem(-29);
        transform: translateX(-50%);
        width: rem(200);

        background: linear-gradient(180deg, rgba(239, 210, 127, 1) 0%, rgba(230, 172, 62, 1) 100%);
        border-radius: rem(30);
        text-align: center;
        font-size: rem(32);
        color: rgba(255, 255, 255, 1);
        line-height: rem(58);
        &.add-vip {
          background: linear-gradient(180deg, rgba(87, 105, 127, 1) 0%, rgba(59, 72, 98, 1) 100%);
          img {
            width: rem(28);
          }
        }
      }
    }

    .user-menu{
      padding:rem(80) rem(40);
      a{
        display: block;
        line-height: rem(90);
        font-size:rem(32);
        color:rgba(51,51,51,1);
        position: relative;
        &:after{
          content: '';
          position: absolute;
          right: rem(10);
          top:50%;
          width: rem(15);
          height: rem(15);
          border-right: 2px solid #D1D5DB;
          border-top: 2px solid #D1D5DB;
          transform: rotate(45deg) translateY(-50%);
        }
      }
    }

    .layout{
      position: absolute;
      bottom: rem(26);
      left: 50%;
      transform: translateX(-50%);
      font-size:rem(32);
      color:rgba(153,153,153,1);
      line-height:rem(45);
    }

  }

</style>
