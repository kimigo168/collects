<template>
  <el-dialog id="previewPop" :visible.sync="showModel"  width="274px !important" :close-on-click-modal="true" :close-on-press-escape="false" :before-close="beforeClosePannel" :show-close="false">
    <div class="preview-pop">
      <div class="wrapper" :style="{backgroundImage: 'url(' + mobileBg + ')'}" v-loading.lock="loading">
        <!-- <img class="wrap" src="../images/mobile1.png" alt=""> -->
        <div class="box scroll">
          <h1 class="title" v-if="type!=6" v-html="dataInfo&&dataInfo.title?dataInfo.title:title"></h1>
          <!-- <div class="info clearfix" v-if="type!=6">
            <span>{{source}}</span>
            <span>{{time}}</span>
            <span class="read">原文朗读</span>
          </div> -->
          <!-- 文章 -->
          <div class="articleWrap" v-if="type==1" v-html="content"></div>
          <!-- 视频 -->
          <div class="videoWrap" v-if="type==3">
            <video :src="videoUrl" :poster="videoCover" controls=""  width="100%"></video>
          </div>
          <!-- 外链 -->
          <div class="outer-link" v-if="type==6">
            <iframe class="link-iframe" :src="content"></iframe>
          </div>
          <div class="outer-link" v-if="type==7">
            <iframe class="link-iframe collect-iframe scroll" :srcdoc="content"></iframe>
          </div>
          <div v-if="model" v-html="model"></div>
          <!-- <div class="share-wrap">
            <p>分享到</p>
            <ul class="share">
              <li><img src="../images/friend.png" alt=""></li>
              <li><img src="../images/wechat.png" alt=""></li>
              <li><img src="../images/sinablog.png" alt=""></li>
              <li><img src="../images/qq.png" alt=""></li>
              <li><img src="../images/qzone.png" alt=""></li>
            </ul>
          </div> -->
        </div>
      </div>
      <div class="closeWrap">
        <el-button v-if="type==6" @click="viewInNewTab">新窗口打开</el-button>
        <el-button @click="beforeClosePannel">关闭预览</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'previewPop',
  props: ['articleId', 'articleForm', 'apiUrl', 'isWebCollect'],
  data () {
    return {
      showModel: false,
      loading: false,
      model: '',
      dataInfo: {},
      title: '',
      time: '05-11 10:32',
      source: '',
      content: '',
      type: '1',
      // 视频
      videoCover: '',
      videoUrl: '',
      mobileBg: require("../images/mobile2.png")
    }
  },
  methods: {
    beforeClosePannel () {
      this.$emit('closePreviewArticle')
    },
    getDetail () {
      this.loading = true;
      this.$jqAjax({
        url: `${apiHost}${this.apiUrl?this.apiUrl:'/context/org/detail'}`,
        data: {
          id: this.articleId,
          flowId: this.articleId
        },
        success: (res) => {
          this.loading = false;
          let data = res.data;
          if (res.code == 0) {
            if (data) {
              this.dataInfo = data;
              this.source = data.source;
              // this.time = data.createTime;
              this.title = data.title;
              this.content = data.content;
              this.model = data.model;
              if (this.apiUrl && this.apiUrl.indexOf('platform/selectById') > -1) {
                this.type = 1; // 平台号当做外链处理
              } else {
                this.type = data.type;
              }
              if (this.type == 3) {
                if (data.cover) {
                  try {
                    let coverArr = JSON.parse(data.cover);
                    if(coverArr[0]) this.videoCover = coverArr[0].url;
                  } catch(e) {}
                }
                if (data.content) {
                  this.videoUrl = JSON.parse(data.content).url;
                }
              }
            }
          } else {
            this.$message({type: 'error', message: '请求失败', showClose: true});
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({type: 'error', message: '请求失败', showClose: true});
        }
      });
    },
    viewInNewTab () {
      window.open(this.content);
    }
  },
  mounted () {
    this.showModel = true;
    if (this.articleId) {
      this.getDetail();
    }
    if (this.articleForm) {
      this.title = this.articleForm.title;
      this.source = this.articleForm.source;
      this.content = this.articleForm.content || this.articleForm.article;
      this.time = new Date().format('YYYY-MM-DD');//编辑预览，取当前时间
      // if (this.isWebCollect) { // 网站采集的按外链来渲染
      //   this.type = 7
      // }
    }
  }
}
</script>
<style lang="scss">
.preview-pop {
  width: 275px;
  height: 576px;
  position: relative;
  .wrapper{
    width: 275px;
    height: 576px;
    // background-image: url('../images/mobile1.png');
    box-sizing: border-box;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    // border-radius: 44px;
    overflow: hidden;
    position: relative;
    .box {
      width: 240px;
      height: 400px;
      // border: 1px solid #333;
      box-sizing: border-box;
      position: absolute;
      left: 17px;
      top: 80px;
      padding: 0 8px;
      font-size: 16px;
      overflow-y: scroll;
      overflow-x: hidden;
      .title{
        font-size: 18px;
      }
      .info {
        // height: 30px;
        line-height: 30px;
        color: #999;
        span {
          display: inline-block;
          margin-right: 6px;
        }
        .read {
          background:url('../images/pause2.png') no-repeat left center/20px;
          padding-left: 24px;
        }
        .focus {
          height: 18px;
          line-height: 18px;
          width: 46px;
          border-radius: 10px;
          background-color: #DA3924;
          color: #fff;
          padding: 0 4px;
          // float: right;
          // margin-top: 6px;
        }
      }
      .articleWrap, .videoWrap, .outer-link {
        margin-top: 10px;
        min-height: 270px;
      }
      .share-wrap{
        height: 52px;
        text-align: center;
        margin-bottom: 20px;
        p{
          height: 32px;
          line-height: 32px;
        }
        .share{
          height: 20px;
          justify-content: space-around;
          align-content: center;
          flex-wrap: wrap;
          display: flex;
          li {
            width: 20px;
            height: 20px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      
    }
    *{
      box-sizing: border-box;
      width: 100%;
    }
    .collect-iframe {
      min-height: 340px;
      border: 0;
    }
    img {
      max-width: 100%!important;
      height: auto!important;
    }
    // .wrap{
    //   height: 100%;
    //   width: 100%;
    //   border-radius: 44px;
    //   overflow: hidden;
    // }
  }
  .closeWrap{
    height: 30px;
    width: 210px;
    position: absolute;
    bottom: -50px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }
}
  
  body
    #previewPop 
      .el-dialog {
        border-radius: 44px;
        // overflow: hidden;
        background: none;
        .el-dialog__body {
          padding: 0;
        }
        .el-dialog__header {
          padding: 0;
          border: 0;
        }
      }
      
</style>


