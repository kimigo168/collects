<template>
  <div id="pay-suc">
    <userHeader title="加入VIP" to="/user-center"></userHeader>

    <div class="user-info">
      <div class="img">
        <img class="pic" :src="userInfo.headimgurl ? userInfo.headimgurl : './static/public/images/user-icon.png'"/>
        <img class="vip-icon" src="../../../assets/images/user-icon_02.png" v-if="userInfo.memberType  == 1" />
      </div>
      <h3>{{userInfo.nickname}}</h3>
      <p>我们诚挚地邀请您加入vip用户体验更多的服务</p>
    </div>


    <div class="pay-success">
      <img class="icon" src="../../../assets/images/icon-success.png"/>
      <h3> 支付成功!</h3>
      <button class="submit-btn" type="button" @tap="goBack()">返回个人中心</button>
      <p>使用电脑访问www.gaiiso.com，体验更多功能</p>
    </div>

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

      }
    },
    computed: {
      userInfo () {
        return this.$store.state.userInfo
      },
    },
    methods: {


      goBack(){
        this.$router.push('/user-center')
      }

    }
  }
</script>

<style lang="scss">
  @import "../../../assets/scss/app";

  #pay-suc{
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

    .submit-btn{
      display: block;
      width:100%;
      height:rem(80);
      margin-top: rem(60);
      background:rgba(64,141,255,1);
      border-radius:rem(48);
      font-size:rem(36);
      font-weight:400;
      color:rgba(255,255,255,1);
      border: none;
      &:disabled{
        cursor: not-allowed;
        background-color: #cccccc;
      }
    }

    .pay-success{
      text-align: center;
      background-color: #ffffff;
      padding-top: rem(206);
      .icon{
        width: rem(132);
      }
      h3{
        margin-top: rem(36);
        font-size:rem(32);
        font-weight:bolder;
        color:rgba(51,51,51,1);
      }
      .submit-btn{
        width: rem(316);
        height: rem(74);
        font-size:rem(32);
        margin: rem(120) auto 0;
      }

      p{
        position: absolute;
        left: 0;
        right: 0;
        bottom: rem(36);
        font-size:rem(24);
        color:rgba(102,102,102,1);
      }
    }

  }

</style>
