<template>
  <header class="header">
    <div class="logo-wrap">
      <span class="logo"></span>
      <ul class="nav-list clearfix">
        <li><span @click="goIndex">返回首页</span></li>
        <li><span @click="goSelectPage">{{$route.query.vType==1?'热点写作':$route.query.vType==2?'思想学习':'汽车写作'}}</span></li>
        <li v-if="$route.query.write!=2 && $route.query.vType!=2 "><span @click="goCreate">选择稿件</span></li>
        <li>稿件编辑</li>
      </ul>
      <navTopRight :navHeight="60"></navTopRight>
    </div>
  </header>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import navTopRight from './navTopRight'
export default {
  name: 'headEdit',
  data () {
    return {}
  },
  components: {
    navTopRight
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapMutations([
      'TOGGLE_ANIMATE'
    ]),
    goCreate () {
      console.log('$route', this.$route)
      this.TOGGLE_ANIMATE(false)
      // this.$router.go(-1)
      sessionStorage.setItem('keyword', JSON.stringify(localStorage.editerTitle))
      this.$router.push({
        path: '/layout/create',
        query: {
          // hots: localStorage.editerTitle,
          type: 1
        }
      })
    },
    goIndex () {
      this.$router.replace({
        path: '/'
      })
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
    height: 60px;
    width: 100%;
    background: #FFFFFF;
    z-index: 101;
    position: relative;
  .logo-wrap{
    height: 60px;
    // line-height: 60px;
    margin: 0 20px;
    position: relative;
    .back-btn {
      height: 24px;
      width: 24px;
      display: inline-block;
      background-image: url('../images/icons/icon_back.png');
      background-size: 24px 24px;
      background-repeat: no-repeat;
      background-position: left center;
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -12px;
    }
    .logo {
      width: 130px;
      height: 38px;
      display: inline-block;
      // background-image: url('../images/logo_small.png');
      // background-size: 90px 38px;
      background-image: url('../images/write_robbot.png');
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
      position: absolute;
      left: 10px;
      top: 50%;
      margin-top: -19px;
    }
    .nav-list {
      height: 20px;
      position: absolute;
      left: 160px;
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
  }
}
</style>
