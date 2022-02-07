<template>
  <header class="header">
    <div class="logo-wrap">
      <span class="logo" @click="goToIndex"></span>
      <ul class="nav-list clearfix">
        <li v-for="(item, index) in navList" @click="tabClick(index)" :key="index" :class="{'active':index===activeIdx}">{{item}}</li>
      </ul>
      <navTopRight :navHeight="80"></navTopRight>
    </div>
  </header>
</template>
<script>
import navTopRight from './navTopRight'
export default {
  name: 'headTopNav',
  data () {
    return {
      navList: ['首页', '热点写作', '汽车写作', '思想学习', '股市快报', '天气预报', '体育赛事'],
      activeIdx: 0
    }
  },
  components: {
    navTopRight
  },
  methods: {
    goToIndex () {
      this.$router.replace({ path: '/' })
    },
    tabClick (index) {
      if (index === this.activeIdx) return
      if (index === 0) {
        this.goToIndex()
      } else if (index === 1) {
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '顶部菜单', '点击热点写作菜单', this.$getCurPageName()])
        this.$router.push({ path: '/hots' })
      } else if (index === 2) { // 汽车写作
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '顶部菜单', '点击汽车写作菜单', this.$getCurPageName()])
        this.$router.push({ path: '/car-index' })
      } else if (index === 3) { // 提纲写作
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '顶部菜单', '点击思想学习菜单', this.$getCurPageName()])
        this.$router.push({ path: '/outline' })
      } else {
        return
      }
      this.activeIdx = index
    }
  },
  created () {
    if (this.$route.name === 'home') {
      this.activeIdx = 0
    } else if (this.$route.name === 'hots') {
      this.activeIdx = 1
    } else if (this.$route.name === 'car-index') {
      this.activeIdx = 2
    } else if (this.$route.name === 'outline') {
      this.activeIdx = 3
    }
  }
}
</script>
<style lang="scss" scoped>
  .header {
    height: 80px;
    width: 100%;
    background-color: #fff;
    box-shadow:0px 10px 24px 0px rgba(0,0,0,0.15);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    .logo-wrap {
      width: 1410px;
      height: 80px;
      position: relative;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
      .logo {
        width: 215px;
        height: 34px;
        display: inline-block;
        background-image: url('../images/write_robbot.png');
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      .nav-list {
        height: 80px;
        // line-height: 80px;
        margin-left: 245px;
        li {
          height: 30px;
          line-height: 30px;
          float: left;
          font-size: 18px;
          color: #aaa;
          margin-top: 25px;
          margin-right: 60px;
          &:nth-child(1), &:nth-child(2), &:nth-child(3), &:nth-child(4) {
            color: #333;
            font-weight: bold;
            cursor: pointer;
          }
          &.active {
            color: #0E5DFF;
            border-bottom: 2px solid #0E5DFF;
          }
        }
      }
    }
  }
  @media screen and (min-width: 1200px)  and (max-width: 1500px) {
    .header {
      .logo-wrap {
        width: 1170px;
        .nav-list {
          li {
            margin-right: 34px;
          }
        }
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
