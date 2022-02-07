<template>
  <div id="home-page">
    <!-- 右下角联系方式 -->
    <contact></contact>
    <div class="head-fixed head-fixed-top" v-if="isShowHeadTop" :stlye="{height: topHeadHeight}">
      <div class="head-inner">
        <span class="logo" @click="goIndexFun"></span>
        <div class="search-wrap-top clearfix" @keyup.enter="beginWrite">
          <input type="text" id="searchBorderTop" :class="{'add-status':isShowShadow1}" autocomplete="off" v-model="keyword" placeholder="输入热点关键字" @focus="isShowShadow1=false">
          <button class="search-btn" @click="beginWrite">智能写作</button>
        </div>
        <navTopRight :navHeight="80"></navTopRight>
      </div>
    </div>
    <!-- 第二屏 热度，最新资讯-->
    <head-top-nav></head-top-nav>
    <div class="content-wrap">
      <div class="section-item">
        <div class="top-search clearfix" @keyup.enter="beginWrite">
          <input type="text" id="searchBorder" autocomplete="off" v-model="keyword" placeholder="输入热点关键字" :class="{'add-status':isShowShadow1}" @focus="isShowShadow1=false">
          <button class="search-btn" @click="beginWrite">智能写作</button>
        </div>
        <h2 class="section-hd">热度榜单</h2>
        <div class="sub-wrap">
          <ul class="sub-menu clearfix">
            <li v-for="(item, index) in hotsTypeList" :class="{'active': hotsTypeIdx===index}" :key="index" @click="hotsTypeSelect(index, item)">{{item}}</li>
          </ul>
          <button class="refresh-btn" @click="refreshFun(0)"></button>
        </div>
        <div class="list-wrap" v-loading.lock="hotslistLoading">
          <ul class="hots-list clearfix">
            <li v-for="(item, index) in hotsList" :key="index" @click="selectHot(item)" :class="{'disabled':item.canWrite==0}">
              <div class="cover" :style="{backgroundImage:'url('+(item.image?item.image:defaultNoBgImg)+')'}"></div>
              <div class="outline">
                <h3>{{item.keyword}}</h3>
                <span class="view">热度：{{item.si}}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="section-wrap" style="background-color:#fcfcfc;">
        <div class="section-item"  style="background-color:#fcfcfc;">
          <h2 class="section-hd">最新资讯</h2>
          <div class="sub-wrap"><button class="refresh-btn" @click="refreshFun(1)"></button></div>
          <div class="recommend-wrap">
            <ul class="recommend-type">
              <li v-for="(item, index) in newRecommentTypeList" :class="{'active':index===recommendTypeIdx}" :key="index" @click="recommendTypeSelect(index, item)">{{item.name}}<p class="line"></p></li>
            </ul>
            <div class="recommend-content" v-loading.lock="recommendLoading">
              <ul class="recommend-list clearfix">
                <li v-for="(item, index) in recommendListShow" :key="index" @click="selectRecommend(item, $event)">
                  <div class="img-cover" :style="{backgroundImage:'url('+(item.image&&item.image[0]?item.image[0]:'')+')'}" ></div>
                  <!-- <div class="mask"></div> -->
                  <div class="title-cover"></div>
                  <h3 class="title">{{item.title}}</h3>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer-bot></footer-bot>
    <loading-tips v-if="writeLoading" :loadText="'底稿生成中......'"></loading-tips>
    <common-pop v-if="popObj.show" :popObj="popObj" @fClose="popObj.show=false" @fConfirm="continueWrite"></common-pop>

  </div>
</template>
<script>
import contact from '@/components/contact'
import footerBot from '@/components/footer'
import navTopRight from '@/components/navTopRight'
import loadingTips from '@/components/loadingTips'
import headTopNav from '@/components/headTopNav'
import commonPop from '@/components/commonPop'

import { mapState, mapMutations } from 'vuex'

export default {
  name: 'homePage',
  components: {
    contact,
    footerBot,
    navTopRight,
    loadingTips,
    headTopNav,
    commonPop
  },
  data () {
    return {
      avatar: require('../../images/avatar1.png'),
      defaultTempImg: require('../../images/template_1.jpg'),
      userName: 'admin',
      keyword: '',
      menuList: ['热点写作', '股市快报', '天气预报', '体育赛事'],
      menuSelectIdx: 0,
      hotsTypeList: ['实时热点', '民生热点', '娱乐热点', '体育热点'],
      hotsTypeIdx: 0, // 选中热点索引
      hotsTypeItem: '实时热点', // 选中热点
      topicTypeList: ['社会话题', '娱乐话题', '文化话题', '其他话题'],
      topicTypeIdx: 0, // 选中提纲写作的话题
      defaultNoBgImg: require('../../images/no_bgimg.png'),
      hotsList: [], // 总数据
      newRecommentTypeList: [],
      recommendTypeIdx: 0,
      recommendTypeItem: null,
      recommendList: [], // 总推荐数据
      recommendListShow: [],
      recommendListTotal: 0,
      recommendPageNum: 0,
      recommendMaxPageNum: 0,
      hotslistLoading: false,
      recommendLoading: false,
      topHeadHeight: '0',
      hotsPageNum: 0,
      hotsTotal: 0,
      isRefresh1: false,
      isRefresh2: false,
      writeLoading: false, // 开始写作Loading
      isShowHeadTop: false,
      mainNavList: ['热点写作', '汽车写作', '提纲写作', '股市快报', '天气报道', '体育赛事'],
      tigangTypeList: [], // 提纲分类
      selectedTigangList: [],
      isShowTgWrite: false, // 显示提纲输入弹窗
      tgItem: null, // 选择的提纲模板
      isShowShadow1: false, // 是否显示输入框动效
      isShowShadow2: false, // 是否显示输入框动效
      // 公共弹窗
      popObj: {
        show: false,
        title: '',
        vHtml: '',
        btnList: []
      }
    }
  },
  computed: {
    ...mapState(['userInfo', 'writeStatus'])
  },
  methods: {
    ...mapMutations(['TOGGLE_LOGINPOP', 'SET_WRITE_STATUS']),
    goIndexFun () {
      this.$router.replace({ path: '/' })
    },
    hotsTypeSelect (index, item) { // 热点类型选择
      this.hotsTypeIdx = index
      this.hotsTypeItem = item
      this.hotsTotal = 0
      this.hotsPageNum = 0
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '热点写作', '点击热点榜单分类', index === 0 ? '实时热点' : index === 1 ? '民生热点' : index === 2 ? '娱乐热点' : '体育热点'])
      this.getHots()
    },
    recommendTypeSelect (index, item) { // 推荐类型选择
      this.recommendTypeIdx = index
      this.recommendTypeItem = item
      this.recommendPageNum = 0
      this.recommendMaxPageNum = 0
      this.getRecommend(item.value)
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '热点写作', '点击最新资讯分类', item.name])
    },
    refreshFun (num) {
      if (num === 0) { // 刷新热点
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '热点写作', '点击刷新热点榜单'])
        this.getHots()
      } else { // 刷新推荐
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '热点写作', '点击刷新最新资讯'])
        if (this.recommendPageNum <= this.recommendMaxPageNum - 1) {
          this.recommendListShow = this.recommendList.slice(this.recommendPageNum * 6, (this.recommendPageNum + 1) * 6)
          this.recommendLoading = true
          this.recommendPageNum++
          setTimeout(() => {
            this.recommendLoading = false
          }, 100)
        } else {
          this.recommendPageNum = 0
          this.getRecommend()
        }
      }
    },
    getRecommend () { // 获取推荐列表
      this.recommendLoading = true
      this.$axios.post(this.$global.API.recommendNews,
        this.$qs.stringify({
          channelCode: this.recommendTypeItem.id,
          size: 200
        })
      ).then((res) => {
        this.recommendLoading = false
        if (res.code === '0') {
          let data = res.data
          this.recommendListTotal = data.length
          this.recommendList = res.data
          this.recommendListShow = this.recommendList.slice(0, 6)
          this.recommendMaxPageNum = Math.ceil(this.recommendListTotal / 6)
          if (this.recommendPageNum <= this.recommendMaxPageNum - 1) {
            this.recommendPageNum++
          }
        }
      }).catch((err) => {
        this.recommendLoading = false
        console.log(err)
      })
    },
    selectHot (item) {
      this.isShowShadow1 = false
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '热点写作', '点击热点标题', this.hotsTypeIdx === 0 ? '实时热点' : this.hotsTypeIdx === 1 ? '民生热点' : this.hotsTypeIdx === 2 ? '娱乐热点' : '体育热点'])
      if (item.canWrite === '0') {
        this.$message({ type: 'warning', message: '编辑大人，很抱歉！我还是宝宝，正在努力学习成长中，请再试试其他热点~', showClose: true })
        return
      }
      this.keyword = item.keyword
      setTimeout(() => {
        this.isShowShadow1 = true
      }, 100)
      // window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    selectRecommend (item, event) {
      // this.keyword = item.title
      // 获取焦点
      // this.getKeyWord(item.title)
      // window.scrollTo({ top: 0, behavior: 'smooth' })
      this.isShowShadow1 = false
      this.keyword = item.keywords || item.title
      setTimeout(() => {
        this.isShowShadow1 = true
      }, 100)
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '热点写作', '点击最新资讯标题', this.recommendTypeItem.name])
    },
    getHots () { // 获取热点
      this.hotslistLoading = true
      this.$axios.post(this.$global.API.getHotWord,
        this.$qs.stringify({
          content: this.hotsTypeItem,
          page: this.hotsPageNum
        })
      ).then((res) => {
        this.hotslistLoading = false
        if (res.code === '0' && res.data) {
          this.hotsList = res.data && res.data.data ? res.data.data : []
          this.hotsTotal = res.data.total
          let max = Math.ceil(this.hotsTotal / 9)
          if (this.hotsPageNum < max - 1) {
            this.hotsPageNum++
          } else {
            this.hotsPageNum = 0
          }
        }
      }).catch((err) => {
        console.log(err)
        this.hotslistLoading = false
      })
    },
    getRecommendClass () {
      this.$axios.get(this.$global.API.getChannel).then((res) => {
        if (res.code === '0') {
          let data = res.data
          let arr = []
          for (let item in data) {
            arr.push({
              name: item,
              id: data[item]
            })
          }
          this.newRecommentTypeList = arr

          if (arr && arr[0]) {
            this.recommendTypeItem = arr[0]
            this.getRecommend()
          }
        }
      })
    },
    getKeyWord (title) { // 通过标题提取关键字
      this.$axios.post(this.$global.API.getKeyWord,
        this.$qs.stringify({
          content: title
        })
      ).then((res) => {
        if (res.code === 0 && res.data.keywords) {
          let keywords = res.data.keywords.join(' ')
          console.log('keywords', keywords)
          this.keyword = keywords
          this.isShowShadow1 = true
          setTimeout(() => {
            this.isShowShadow1 = false
          }, 3000)
        } else {
          this.$message({ type: 'error', message: '提取关键字词失败', showClose: true })
        }
      })
    },
    beginWrite () {
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '热点写作', '点击智能写作', this.keyword])
      if (!this.userInfo) {
        this.TOGGLE_LOGINPOP(true)
        this.SET_WRITE_STATUS(1)
        return
      }
      if (!this.keyword) {
        this.$message({ type: 'warning', message: '请输入热点关键词', showClose: true })
      } else {
        this.sensitiveCheckFun()
      }
    },
    sensitiveCheckFun () { // 敏感词检测
      this.$axios.post(this.$global.API.sensitiveCheck,
        this.$qs.stringify({
          content: this.keyword
        })
      ).then((res) => {
        if (res.code === '0') {
          let arr = res.data
          let hasSensitive = arr.some((item) => {
            return item.words && item.words.length > 0
          })
          if (hasSensitive) { // 有敏感词
            this.$set(this, 'popObj', {
              show: true,
              title: '提示',
              showClose: true,
              vHtml: `<p style="width:274px;margin:30px auto 0 auto;text-align:center;color:#333;font-size:18px;font-family:PingFangSC-Semibold,PingFang SC;">检测到标题中含敏感信息，确认继续以此标题写作？</p>`,
              btnList: [{ name: '取消', type: 'cancel' }, { name: '确定', type: 'confirm' }]
            })
          } else { // 检测ok
            this.writeFun()
          }
        }
      })
    },
    continueWrite () {
      this.popObj.show = false
      this.writeFun()
    },
    writeFun () {
      this.writeLoading = true
      this.$axios.post(this.$global.API.write,
        this.$qs.stringify({
          keyword: this.keyword
        })
      ).then((res) => {
        this.writeLoading = false
        if (res.code === '0') {
          let result = res.data.result
          sessionStorage.setItem('dataSource', result ? JSON.stringify(result) : '')
          sessionStorage.setItem('keyword', JSON.stringify(this.keyword))
          sessionStorage.setItem('writeType', 1) // 1表示热点写作，2：提纲写作
          this.$router.push({
            path: '/layout/create',
            query: {
              // hots: this.keyword,
              vType: 1 // 热点写作
            }
          })
        }
      }).catch((err) => {
        console.log(err)
        this.writeLoading = false
      })
    },
    jumpItem (index) {
      if (index === 0) { // 热点写作
        this.$refs.fullpage.api.moveTo('hots', 2)
      } else if (index === 1) { // 跳转汽车写作
        this.$axios.post(this.$global.API.jumpURI).then((res) => {
          if (res.code === '0' && res.data) {
            window.open(res.data, '_blank')
          }
        })
      } else if (index === 2) { // 提纲写作
        this.$refs.fullpage.api.moveTo('outline', 3)
      } else {

      }
    }
  },
  watch: {
    'writeStatus': function (val) {
      if (val && val === 3) {
        this.SET_WRITE_STATUS(0)
        this.beginWrite()
      }
    }
  },
  created () {
    this.getHots()
    this.getRecommendClass()
    // window.addEventListener('scroll', (e) => {
    //   console.log('eee', e)
    //   var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
    //   console.log('scrollTop', scrollTop)
    //   if (scrollTop >= 570) { // 显示
    //     this.topHeadHeight = '80px'
    //   } else { // 隐藏
    //     this.topHeadHeight = 0
    //   }
    // })
  },
  mounted () {
    window.addEventListener('scroll', () => {
      // console.log(scrollItem.scrollTop)
      let top = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
      if (top > 190) {
        this.isShowHeadTop = true
      } else {
        this.isShowHeadTop = false
      }
    })
  }
}
</script>
<style lang="scss" scoped>
#home-page {
  width: 100%;
  height: 100%;
  position: relative;
  .search-page {
    width: 100%;
    height: 100%;
    background-color: #F0F4FA;
    background-image: url('../../images/index_bg_img.png');
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    z-index: 100;
    .our-purpose {
      width: 490px;
      height: 74px;
      background-image: url('../../images/purpose.png');
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
      position: absolute;
      left: 50%;
      top: 296px;
      margin-left: -245px;
    }
    .search-wrap {
      width: 1410px;
      height: 150px;
      border-radius: 10px;
      box-shadow: 0 20px 40px 0 rgba(0,0,0,0.10);
      background-color: #fff;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top:418px;
      z-index: 100;
      padding: 43px 90px;
      opacity:0.75;
      .search-inner {
        width: 100%;
        height: 100%;
        position: relative;
        input {
          width: 1060px;
          height: 60px;
          border-radius: 30px;
          border: 1px solid #D2E2EA;
          text-indent: 30px;
          font-size: 18px;
          &:focus {
            border-color: #0E5DFF;
          }
          &::-webkit-input-placeholder{
            font-size: 18px;
            color: #999;
          }
          &::-moz-placeholder{   /* Mozilla Firefox 19+ */
            font-size: 18px;
            color: #999;
          }
          &:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
            font-size: 18px;
            color: #aaa;
          }
          &:-ms-input-placeholder{  /* Internet Explorer 10-11 */
            font-size: 18px;
            color: #999;
          }
        }
        .search-btn {
          width: 150px;
          height: 60px;
          line-height: 60px;
          text-indent: 30px;
          border-radius: 30px;
          background-color: #0E5DFF ;
          background-image: url('../../images/icons/light_icon.png');
          background-size: 24px 24px;
          background-repeat: no-repeat;
          background-position: left 20px center;
          color: #fff;
          font-size: 18px;
          font-family:PingFangSC;
          position: absolute;
          right: 0;
        }
      }
    }
    .main-nav {
      height: 80px;
      width: 100%;
      background-color: #3C4C6C;
      position: absolute;
      bottom: 0;
      left: 0;
      ul {
        width: 780px;
        height: 80px;
        line-height: 80px;
        margin: 0 auto;
        li {
          float: left;
          color: #FFFFFF;
          font-size: 20px;
          margin-right: 60px;
          cursor: pointer;
          &:last-child {
            margin-right: 0;
          }
          &:nth-child(4),&:nth-child(5),&:nth-child(6){
            color: #7D889D;
            cursor: default;
          }
        }
      }
    }
  }
  .content-wrap {
    // margin-top: 20px;
    position: relative;
    background-color: rgb(252, 252, 252);
  }
  .top-search {
    height: 54px;
    width: 1004px;
    margin: 0 auto 60px auto;
    input {
      width: 832px;
      height: 54px;
      border: 1px solid #D2E2EA;
      border-radius: 27px;
      text-indent: 30px;
      font-size: 18px;
      &:focus {
        border-color: #0E5DFF;
      }
      &.add-status {
        // border-color: #0E5DFF;
        // animation: borderColorShine 1s infinite;
        // -webkit-animation: borderColorShine 1s infinite;
        animation: borderShadow 0.8s ease;
        animation-fill-mode: forwards;
      }
      &::-webkit-input-placeholder{
        font-size: 18px;
        color: #999;
      }
      &::-moz-placeholder{   /* Mozilla Firefox 19+ */
        font-size: 18px;
        color: #999;
      }
      &:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
        font-size: 18px;
        color: #aaa;
      }
      &:-ms-input-placeholder{  /* Internet Explorer 10-11 */
        font-size: 18px;
        color: #999;
      }
    }
    .search-btn {
      width: 150px;
      height: 54px;
      line-height: 54px;
      text-indent: 30px;
      border-radius: 27px;
      background-color: #0E5DFF;
      background-image: url('../../images/icons/light_icon.png');
      background-size: 24px 24px;
      background-repeat: no-repeat;
      background-position: left 20px center;
      color: #fff;
      font-size: 18px;
      font-family:PingFangSC;
      float: right;
    }
  }
  .head-fixed {
    overflow: hidden;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #fff;
    // box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06);
    box-shadow:0px 10px 24px 0px rgba(0,0,0,0.15);
    z-index: 100;
    transition: height .6s ease;
    .head-inner {
      width: 1410px;
      height: 80px;
      margin: 0 auto;
      position: relative;
      .logo {
        width: 130px;
        height: 50px;
        // width: 215px;
        // height: 32px;
        display: inline-block;
        // background-image: url('../../images/logo_big.png');
        background-image: url('../../images/write_robbot.png');
        background-size: contain;
        // background-size: 130px 50px;
        background-position: center center;
        background-repeat: no-repeat;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      .search-wrap-top {
        width: 1003px;
        position: absolute;
        left: 51%;
        transform: translateX(-50%);
        padding-top: 14px;
        input {
          height: 52px;
          width: 770px;
          line-height: 50px;
          border-radius: 35px;
          border: 1px solid #D2E2EA;
          text-indent: 20px;
          font-size: 16px;
          color: #222222;
          font-family: PingFangSC;
          float: left;
          &:focus {
            border-color: #0E5DFF;
            // animation: borderColorShine 1s infinite;
            // -webkit-animation: borderColorShine 1s infinite;
          }
          &.add-status {
            animation: borderShadow 0.8s ease;
            animation-fill-mode: forwards;
          }
        }
        .search-btn {
          width: 150px;
          height: 52px;
          border-radius: 35px;
          background-color: #0E5DFF;
          color: #fff;
          float: right;
          background-image: url('../../images/icons/light_icon.png');
          background-size: 24px 24px;
          background-repeat: no-repeat;
          background-position: left 20px center;
          text-indent: 20px;
          font-size: 18px;
          font-family:PingFangSC;
          margin-right: 30px;
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
          // margin-right: 34px;
          .avatar {
            width: 36px;
            height: 36px;
            margin-right: 10px;
          }
          .userName {
            font-size: 14px;
          }
          .el-dropdown {
            height: 30px;
            line-height: 30px;
          }
        }

      }
    }
  }
  .head-fixed-top {
    position: fixed;
  }
}

.section-item {
  width: 1410px;
  background-color: rgb(252, 252, 252);
  padding-top: 150px;
  margin: 0 auto;
  position: relative;
  .tab-menu {
    width: 564px;
    height: 40px;
    line-height: 40px;
    position: relative;
    margin: 0 auto 80px auto;
    li {
      height: 40px;
      width: 96px;
      font-size: 24px;
      font-family: PingFangSC-Semibold;
      cursor: pointer;
      color: #d8d8d8;
      float: left;
      margin-right:54px;
      &:last-child {
        margin-right: 0;
      }
      &.active {
        color: #0E5DFF;
      }
    }
  }
  .active-bar {
    width: 96px;
    height: 2px;
    background-color:#0E5DFF;
    transition: transform .3s cubic-bezier(.645,.045,.355,1);
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
  }
  .sub-wrap {
    height: 48px;
    position: relative;
    margin-bottom: 30px;
    .sub-menu {
      height: 48px;
      width: 458px;
      border-radius: 24px;
      border: 1px solid #F0F0F0;
      padding:  13px 40px 13px 40px;
      // margin-bottom: 30px;
      li {
        width: 64px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        font-size: 16px;
        cursor: pointer;
        opacity: .4;
        float: left;
        // transition: color .3s ease-in;
        margin-right: 40px;
        &:last-child {
          margin-right: 0;
        }
        &.active {
          opacity: 1;
          color: #0E5DFF;
        }
      }
    }
    .refresh-btn {
      width: 44px;
      height:44px;
      border-radius: 50%;
      background-color: #0E5DFF ;
      display: inline-block;
      background-size: 15px 15px;
      background-repeat: no-repeat;
      background-position: center center;
      background-image: url('../../images/icons/icon_refresh_2.png');
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 2px;
      // transition: transform 1s ease-in-out;
    }
    .refreshing {
      animation: rotateIcon 1s ease-out;
    }
  }
  .hots-list {
    margin-bottom: 4px;
    li {
      width: 346px;
      height: 268px;
      float: left;
      position: relative;
      cursor: pointer;
      margin-bottom: 30px;
      // &:nth-child(3n+3) {
      //   margin-right: 0;
      // }
      .cover {
        width: 300px;
        height: 160px;
        border-radius: 4px;
        border: 1px solid #C9DDED;
        background-repeat: no-repeat;
        background-position: center top;
        background-size: cover;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
      }
      .outline {
        width: 346px;
        height: 182px;
        border: 1px solid #C9DDED;
        border-radius: 4px;
        margin-top: 90px;
        padding: 96px 23px 0 23px;
        h3 {
          color: #333333;
          font-weight: bold;
        }
        .view {
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          color: #999;
          background-image: url('../../images/icons/icon_fire_4.png');
          background-size: 16px 19px;
          background-repeat: no-repeat;
          background-position: left center;
          display: inline-block;
          position: absolute;
          right: 20px;
          bottom: 20px;
          padding-left: 22px;
          // animation: bgImgShine .6s infinite;
        }
      }
      &:hover {
        // -webkit-transform: translate3d(0,-2px,0);
        // transform: translate3d(0,-2px,0);
        .outline {
          border: 0;
          box-shadow: 0 2px 30px 0 rgba(0,0,0,0.10);
          //  -webkit-box-shadow: 0 15px 30px rgba(0,0,0,.1);
          // box-shadow: 0 15px 30px rgba(0,0,0,.1);
        }
      }
    }
    .disabled {
      .cover {
        opacity: .2;
      }
    }
  }
  .recommend-wrap {
    width: 100%;
    min-height: 540px;
    position: relative;
  }
  .recommend-type {
    width: 120px;
    position: absolute;
    left: 0;
    top: 0;
    li {
      width: 100%;
      height: 60px;
      font-size: 18px;
      line-height: 40px;
      cursor: pointer;
      position: relative;
      transition: font .3s ease;
      padding-bottom: 16px;
      margin-bottom: 12px;
      .line {
        height: 5px;
        width: 0;
        background-color: #246BFF;
        position: absolute;
        left: 0;
        bottom: 0;
        transition: width .3s linear;
      }
      &.active {
        font-size: 32px;
        font-family: PingFangSC-Semibold;
        .line {
          width: 100%;
        }
      }

    }
  }
  .recommend-content {
    width: 1200px;
    position: absolute;
    // left: 210px;
    top: 0;
    right: 0;
    .recommend-list {
      li {
        width: 350px;
        height: 210px;
        float: left;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        background-size: cover;
        background-position: center top;
        background-repeat: no-repeat;
        border: 1px solid #C9DDED;
        cursor: pointer;
        margin-right: 75px;
        margin-bottom: 60px;
        // &:nth-child(3n+3) {
        //   margin-right: 0;
        // }
        .img-cover {
          width: 100%;
          height: 100%;
          // border: 1px solid #C9DDED;
          position: absolute;
          left: 0;
          top: 0;
          transition: transform .3s ease-in;
        }
        .mask {
          width: 100%;
          height: 100%;
          background-color: #000;
          opacity: 0;
          transition: opacity .3s;
          position: absolute;
          left: 0;
          top: 0;
          z-index: 20;
        }
        .title-cover {
          height: 130px;
          width: 100%;
          opacity: 0.4;
          background-image: linear-gradient(180deg, rgba(0,0,0,0.00) 0%, #000000 100%);
          border-radius: 4px;
          border-radius: 4px;
          position: absolute;
          left: 0;
          bottom: 0;
        }
        .title {
          width: 308px;
          min-height: 48px;
          color: #fff;
          line-height: 24px;
          position: absolute;
          left: 50%;
          bottom: 10px;
          transform: translateX(-50%);
          z-index: 30;
        }
        &:hover {
          border-color: #fff;
          box-shadow: 0 2px 30px 0 rgba(0,0,0,0.10);
          .img-cover {
            transform: scale(1.1);
          }
        }
      }
    }
  }
  .template-wrap {
    min-height: 510px;
    display: flex;
    align-items: flex-start;
    .template-item {
      width: 258px;
      height: 329px;
      overflow: hidden;
      border-radius:4px;
      // float: left;
      cursor: pointer;
      margin-right: 28px;
      margin-bottom: 20px;
      position: relative;
      // &:nth-child(5) {
      //   margin-right: 0;
      // }
      .img-cover {
        width: 258px;
        height: 329px;
        position: absolute;
        left: 0;
        top: 0;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
        transition: transform .3s ease-in;
      }
      .mask {
        width: 258px;
        height:135px;
        background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);
        border-radius:4px;
        opacity:0.4;
        position: absolute;
        bottom: 0;
        left: 0;
      }
      .info {
        width: 258px;
        height:135px;
        border-radius:4px;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 10;
        padding: 30px 10px;
        .name {
          font-size: 20px;
          color: #fff;
          margin-bottom: 10px;
        }
        .desc {
          font-size:14px;
          color: #fff;
          // overflow: hidden;
          // text-overflow: ellipsis;
          // display: -webkit-box;
          // -webkit-line-clamp: 2;  // 控制多行的行数
          // -webkit-box-orient: vertical;
        }
      }
      &:hover {
        border-color: #fff;
        box-shadow: 0 2px 30px 0 rgba(0,0,0,0.10);
        .img-cover {
          transform: scale(1.1);
        }
      }
    }
  }
}
.section-hd {
  height:60px;
  line-height: 60px;
  font-family: PingFangSC-Semibold;
  text-align: center;
  font-size: 42px;
  color: #333;
  margin-bottom: 45px;
}
@-webkit-keyframes rotateIcon {
  from{-webkit-transform: rotate(0deg);}
  to{-webkit-transform: rotate(360deg);}
}

@keyframes rotateIcon {
  from{-webkit-transform: rotate(0deg); transform: rotate(0deg)}
  to{-webkit-transform: rotate(360deg); transform: rotate(360deg)}
}
@-webkit-keyframes borderColorShine {
  0% {
    border-color: #0E5DFF;
  }
  50% {
    border-color: #D2E2EA;
  }
  100% {
    border-color: #0E5DFF;
  }
}
@keyframes borderColorShine {
  0% {
    border-color: #0E5DFF;
  }
  50% {
    border-color: #D2E2EA;
  }
  100% {
    border-color: #0E5DFF;
  }
}
@keyframes borderShadow {
  0%{
    box-shadow:none;
  }
  16%{
    box-shadow: 0 4px 14px 6px rgba(31,111,212,0.30);
    border-color: #0E5DFF;
  }
  33%{
    box-shadow:none;
  }
  50%{
    box-shadow: 0 4px 14px 6px rgba(31,111,212,0.30);
    border-color: #0E5DFF;
  }
  66%{
    box-shadow:none;
  }
  100%{
    box-shadow: 0 4px 14px 6px rgba(31,111,212,0.30);
    border-color: #0E5DFF;
  }
}
@media screen and (min-width: 1500px) {
  #home-page {
    .section-item {
      .hots-list {
        li {
          width:450px;
          margin-right: 30px;
          &:nth-child(3n+3) {
            margin:0;
          }
          .cover {
            width: 390px;
          }
          .outline {
            width: 450px;
          }
        }
      }
      .recommend-content {
        // width: 1200;
        .recommend-list {
          li {
            // width: 294px;
            // height: 177px;
            // margin-right: 52px;
            // margin-bottom: 48px;
            &:nth-child(3n+3) {
              margin-right: 0;
            }
            // .title {
            //   width: 262px;
            // }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1200px) and (max-width: 1500px) {
  #home-page {
    .head-fixed {
      height: 80px;
      .head-inner {
        width: 1200px;
        height: 80px;
        margin: 0 auto;
        position: relative;
        .logo {
          width: 130px;
          height: 50px;
        }
        .search-wrap-top {
          width: 905px;
          input {
            width: 720px;
          }
          .search-btn {
            margin-right: 0px;
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
            // margin-right: 34px;
            .avatar {
              width: 36px;
              height: 36px;
              margin-right: 10px;
            }
            .userName {
              font-size: 14px;
            }
          }

        }
      }
    }
    .search-wrap {
      width: 1170px;
      padding: 43px 64px;
      .search-inner {
        input {
          width: 862px;
        }
      }
    }
    .section-item {
      width: 1170px;
      .hots-list {
        li {
          margin-right: 64px;
          &:nth-child(3n+3) {
            margin-right: 0;
          }
        }
      }
      .recommend-type {
        width: 96px;
      }
      .recommend-content {
        width: 996px;
        .recommend-list {
          li {
            width: 294px;
            height: 177px;
            margin-right: 52px;
            margin-bottom: 48px;
            &:nth-child(3n+3) {
              margin-right: 0;
            }
            .title {
              width: 262px;
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1200px) {
  #home-page {
    .search-wrap {
      width: 850px;
      padding: 46px 40px;
      .search-inner {
        input {
          width: 600px;
        }
      }
    }
    .section-item {
      width: 850px;
      .hots-list {
        li {
          margin-right: 156px;
          &:nth-child(2n) {
            margin-right: 0;
          }
        }
      }
      .recommend-wrap {
        min-height: 640px;
      }
      .recommend-content {
        width: 670px;
        .recommend-list {
          li {
            width: 294px;
            height: 177px;
            margin-right: 52px;
            margin-bottom: 48px;
            &:nth-child(2n) {
              margin-right: 0;
            }
            .title {
              width: 262px;
            }
          }
        }
      }
    }
  }
}
</style>
