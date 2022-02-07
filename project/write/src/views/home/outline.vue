<template>
  <div id="home-page">
    <!-- 右下角联系方式 -->
    <contact></contact>
    <head-top-nav></head-top-nav>
    <div class="content-wrap">
      <div class="section-item">
        <h2 class="section-hd">提纲写作</h2>
        <!-- <div class="sub-wrap">
          <ul class="sub-menu clearfix">
            <li v-for="(item, index) in tigangTypeList" :class="{'active': topicTypeIdx===index}" :key="index" @click="topicTypeSelect(index, item)">{{item.name}}</li>
          </ul>
        </div> -->
        <div class="list-wrap template-wrap clearfix" style="min-height:430px;">
          <div class="template-item" @click="selectTgang(item, index)" v-for="(item, index) in selectedTigangList" :key="index">
            <div class="img-cover" :style="{backgroundImage:'url('+item.img+')'}"></div>
            <div class="mask" v-if="index !=6"></div>
            <div class="info" v-if="index !=6">
              <h3 class="name">{{item.name}}模板</h3>
              <p class="desc">{{item.desc}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer-bot></footer-bot>
    <!-- 提纲写作主题输入框 -->
    <topic-input v-if="isShowTgWrite" :tgItem="tgItem" @fClose="isShowTgWrite=false"></topic-input>
  </div>
</template>
<script>
import contact from '@/components/contact'
import footerBot from '@/components/footer'
import topicInput from './topicInputPop'
import headTopNav from '@/components/headTopNav'

import Vue from 'vue'
import 'fullpage.js/vendors/scrolloverflow'
import VueFullPage from 'vue-fullpage.js'
import tigang from '../../mock/tigang.js'
Vue.use(VueFullPage)
export default {
  name: 'outline',
  components: {
    contact,
    footerBot,
    topicInput,
    headTopNav
  },
  data () {
    return {
      avatar: require('../../images/avatar1.png'),
      defaultTempImg: require('../../images/template_1.jpg'),
      userName: 'admin',
      keyword: '',
      topicTypeList: ['社会话题', '娱乐话题', '文化话题', '其他话题'],
      topicTypeIdx: 0, // 选中提纲写作的话题
      defaultNoBgImg: require('../../images/no_bgimg.png'),
      topHeadHeight: '0',
      hotsPageNum: 0,
      hotsTotal: 0,
      isRefresh1: false,
      isRefresh2: false,
      writeLoading: false, // 开始写作Loading
      isShowHeadTop: true,
      mainNavList: ['热点写作', '汽车写作', '提纲写作', '股市快报', '天气报道', '体育赛事'],
      // fullpage配置项
      options: {
        licenseKey: 'YOUR_KEY_HEERE',
        menu: '#menu',
        anchors: ['home', 'hots', 'outline'],
        sectionsColor: ['#fff', '#fff', '#fff']
      },
      tigangTypeList: [], // 提纲分类
      selectedTigangList: [],
      isShowTgWrite: false, // 显示提纲输入弹窗
      tgItem: null // 选择的提纲模板
    }
  },
  methods: {
    topicTypeSelect (index, item) {
      this.topicTypeIdx = index
      this.selectedTigangList = item.list
    },
    selectTgang (item, index) {
      if (index === 6) return
      this.tgItem = item
      this.isShowTgWrite = true
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '提纲写作', '点击模板', item.name])
    }
  },
  created () {
    this.tigangTypeList = tigang.templates
    this.selectedTigangList = this.tigangTypeList[0].list
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
    background-color: #fff;
    position: relative;
  }
  .head-fixed {
    overflow: hidden;
    width: 100%;
    height: 80px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #fff;
    // box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06);
    box-shadow:0px 10px 24px 0px rgba(0,0,0,0.15);
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
  .head-fixed-top {
    position: fixed;
  }
}

.section-item {
  width: 1410px;
  background-color: #fff;
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
      // width: 458px;
      width: 364px;
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
    // display: flex;
    // align-items: flex-start;
    // justify-content: space-around;
    // flex-wrap: wrap;
    .template-item {
      width: 258px;
      height: 329px;
      overflow: hidden;
      border-radius:4px;
      float: left;
      cursor: pointer;
      margin-right: 24px;
      margin-bottom: 20px;
      position: relative;
      box-shadow: 0 2px 30px 0 rgba(0,0,0,0.10);

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
