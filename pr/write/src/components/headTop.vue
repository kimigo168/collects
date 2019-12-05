<template>
  <header class="header" :style="{boxShadow:$route.name=='home'?'0 2px 8px 0 rgba(0,0,0,0.06)':'box-shadow:0px 10px 24px 0px rgba(0,0,0,0.15)'}">
    <div class="logo-wrap">
      <span class="logo"></span>
      <ul class="nav-list clearfix" v-if="$route.name!='home'">
        <li><span @click="goBackHomePage">返回首页</span></li>
        <li><span @click="goSelectPage">{{$route.query.vType==1?'热点写作':$route.query.vType==2?'思想学习':'汽车写作'}}</span></li>
        <li v-if="$route.name=='create'">选择稿件</li>
      </ul>
      <navTopRight :navHeight="80"></navTopRight>
    </div>
  </header>
</template>
<script>
import navTopRight from './navTopRight'
import { mapState } from 'vuex'
export default {
  name: 'headerTop',
  data () {
    return {
    }
  },
  components: {
    navTopRight
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    goBackHomePage () {
      this.$router.replace({ path: '/' })
    },
    goSelectPage () {
      if (this.$route.query.vType === '1') {
        this.$router.push({ path: '/hots' })
      } else if (this.$route.query.vType === '2') {
        this.$router.push({ path: '/outline' })
      } else {
        this.$router.push({ path: '/car-index' })
      }
    }
  },
  created () {}
}
</script>
<style lang="scss" scoped>
.header {
  height: 80px;
  width: 100%;
  background: #FFFFFF;
  // box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06);
  box-shadow:0px 10px 24px 0px rgba(0,0,0,0.15);
  // position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  .logo-wrap{
    width: 1410px;
    height: 80px;
    position: relative;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    .logo {
      // width: 130px;
      // height: 50px;
      width: 215px;
      height: 34px;
      display: inline-block;
      // background-image: url('../images/logo_big.png');
      background-image: url('../images/write_robbot.png');
      background-size: contain;
      // background-size: 130px 50px;
      background-position: center center;
      background-repeat: no-repeat;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    .nav-list {
      height: 20px;
      position: absolute;
      left: 240px;
      top: 50%;
      transform: translateY(-50%);
      li {
        height: 20px;
        padding: 0 50px 0 0;
        text-align: center;
        color: #999;
        float: left;
        &:nth-child(1),&:nth-child(2){
          background-size: 9px 14px;
          background-position: right 20px center;
          background-image: url('../images/icons/back.png');
          background-repeat: no-repeat;
          cursor: pointer;
        }
        &:nth-child(3) {
          color: #333;
        }
      }
    }
    .nav-right {
      height: 80px;
      line-height: 80px;
      position: absolute;
      right: 0;
      top: 0;
      .user {
        height: 80px;
        display: inline-block;
        margin-right: 34px;
        .avatar {
          width: 36px;
          height: 36px;
          margin-right: 10px;
        }
        .el-dropdown {
          height: 30px;
          line-height: 30px;
        }
      }
    }
  }
}
@media screen and (min-width: 1200px)  and (max-width: 1500px) {
  .header {
    .logo-wrap {
     width: 1170px;
    }
  }
}
@media screen and (max-width: 1200px) {
  .header {
    .logo-wrap {
     width: 850px;
    }
  }
}
</style>
