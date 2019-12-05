<template>
  <div id="home-page">
    <!-- 右下角联系方式 -->
    <contact></contact>
    <div class="search-page">
      <head-top></head-top>
      <div class="center-wrap">
        <div class="our-purpose"></div>
        <div class="search-wrap">
          <div class="search-inner" @keyup.enter="beginWrite">
            <input type="text" v-model="keyword" placeholder="输入关键词或选择写作类型">
            <button class="search-btn" @click="beginWrite">智能写作</button>
          </div>
        </div>
      </div>
      <ul class="main-nav clearfix">
        <li v-for="(item, index) in mainNavList" @click="jumpItem(index)" :key="index">{{item}}</li>
      </ul>
      <footer-bot style="margin-top:230px;"></footer-bot>
    </div>
    <loading-tips v-if="writeLoading" :loadText="'底稿生成中......'"></loading-tips>
    <common-pop v-if="popObj.show" :popObj="popObj" @fClose="popObj.show=false" @fConfirm="continueWrite"></common-pop>
  </div>
</template>
<script>
import contact from '@/components/contact'
import loadingTips from '@/components/loadingTips'
import headTop from '@/components/headTop'
import footerBot from '@/components/footer'
import commonPop from '@/components/commonPop'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'homePage',
  components: {
    contact,
    loadingTips,
    headTop,
    footerBot,
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
      mainNavList: ['热点写作', '汽车写作', '思想学习', '股市快报', '天气报道', '体育赛事'],
      writeLoading: false,
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
    beginWrite () {
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '首页', '点击智能写作', this.keyword])
      if (!this.userInfo) { // 未登录，提示登录
        this.TOGGLE_LOGINPOP(true)
        this.SET_WRITE_STATUS(1) // 记录写热点
        return
      }
      if (!this.keyword) {
        this.$message({ type: 'warning', message: '请输入关键词', showClose: true })
      } else {
        this.sensitiveCheckFun()
      }
    },
    // 敏感词检测
    sensitiveCheckFun () {
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
          if (hasSensitive) { // 有敏感词,弹窗提示
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
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '首页', '点击热点写作'])
        this.$router.push({ path: '/hots' })
      } else if (index === 1) { // 跳转汽车写作
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '首页', '点击汽车写作'])
        this.$router.push({ path: '/car-index' })
      } else if (index === 2) { // 提纲写作
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '首页', '点击提纲写作'])
        this.$router.push({ path: '/outline' })
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
  created () {}
}
</script>
<style lang="scss" scoped>
#home-page {
  width: 100%;
  height: 100%;
  position: relative;
  .search-page {
    width: 100%;
    // height: 100%;
    background-color: #F0F4FA;
    background-image: url('../../images/index_bg_img_1.png');
    background-repeat: no-repeat;
    // background-repeat: repeat-y;
    background-size: cover;
    position: relative;
    z-index: 100;
    .our-purpose {
      width: 490px;
      height: 74px;
      margin: 130px auto 50px auto;
      background-image: url('../../images/purpose.png');
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;

    }
    .search-wrap {
      width: 1410px;
      height: 150px;
      border-radius: 10px;
      box-shadow: 0 20px 40px 0 rgba(0,0,0,0.10);
      background-color: #fff;
      z-index: 100;
      padding: 43px 90px;
      opacity:0.75;
      margin: 0 auto;
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
      height: 120px;
      width: 1410px;
      margin: 32px auto 0 auto;
      li {
        height: 120px;
        width: 208px;
        line-height: 120px;
        text-indent: 80px;
        font-weight: bold;
        float: left;
        color: #333333;
        font-size: 20px;
        margin-right: 30px;
        cursor: pointer;
        background-color: #fff;
        background-size: 44px 44px;
        background-repeat: no-repeat;
        background-position: left 24px center;
        box-shadow:0px 20px 40px 0px rgba(0,0,0,0.1);
        border-radius:10px;
        opacity: .75;
        transition: all .3s ease-in-out;
        &:hover {
          opacity: 1;
        }
        &:nth-child(1) {
          background-image: url('../../images/icons/nav_hot.png');
        }
        &:nth-child(2) {
          background-image: url('../../images/icons/nav_car.png');
        }
        &:nth-child(3) {
          background-image: url('../../images/icons/nav_outline.png');
        }
        &:nth-child(4) {
          font-weight: normal;
          background-image: url('../../images/icons/nav_stock.png');
        }
        &:nth-child(5) {
          font-weight: normal;
          background-image: url('../../images/icons/nav_weather.png');
        }
        &:nth-child(6) {
          font-weight: normal;
          background-image: url('../../images/icons/nav_sport.png');
        }
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
  .head-fixed {
    overflow: hidden;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #fff;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06);
    z-index: 100;
    transition: height .5s ease;
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
        left: 50%;
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
          font-family: PingFangSC-Semibold;
          float: left;
        }
        .search-btn {
          width: 150px;
          height: 52px;
          border-radius: 35px;
          background-color: #0182E8;
          color: #fff;
          float: right;
          background-image: url('../../images/icons/light_icon.png');
          background-size: 24px 24px;
          background-repeat: no-repeat;
          background-position: left 24px center;
          text-indent: 20px;
          font-family: PingFangSC-Semibold;
          float: right;
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
            width: 650px;
          }
          .search-btn {
            margin-right: 70px;
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
    .search-page {
      .search-wrap {
        width: 1170px;
        padding: 43px 64px;
        .search-inner {
          input {
            width: 862px;
          }
        }
      }
      .main-nav {
        width: 1170px;
        li {
          width: 170px;
        }
      }
    }
  }
}
@media screen and (max-width: 1200px) {
  #home-page {
    .search-page .search-wrap {
      width: 850px;
      padding: 46px 40px;
      .search-inner {
        input {
          width: 600px;
        }
      }
    }
  }
}
.footer {
  height: 36px;
  width: 100%;
  line-height: 36px;
  text-align: center;
  background-color: #3C4C6C;
  color: #7D889D;
  border-top: 1px solid #344463;
}
</style>
