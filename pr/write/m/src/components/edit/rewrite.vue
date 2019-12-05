<template>
  <div id="rewrite" v-show="rewriteModelShow">
    <Header title="文章改写"></Header>
    <div class="small-header">
      <a href="javascript:;" class="back left" @tap="closeModel()">
        <img src="./../../assets/images/user-icon_01.png"/>
        <span>取消</span>
      </a>
      <a href="javascript:;" class="back right" @tap="yesToRewrite()">
        <span>确认</span>
        <img src="./../../assets/images/icon-yes.png"/>
      </a>

      <div class="tabs clearfix">
        <a href="javascript:;" :class="{'active':tabActive==0}" @tap="tabActive=0">改写前</a>
        <a href="javascript:;" :class="{'active':tabActive==1}" @tap="tabActive=1">改写后</a>
      </div>

    </div>

    <div class="edit-box scroll" id="rewrite-box-scroll">
      <span class="rate" v-show="rewriteSimilarity>0">相似度：{{rewriteSimilarity}}%</span>
      <h3 class="title" v-html="rewriteObj.titleOld"></h3>
      <div class="article" v-html="articleHtml"></div>
    </div>


  </div>
</template>

<script>
  import Header from "../Header.vue";

  export default {
    props: ['rewriteObj'],
    components: {
      Header
    },
    data: function () {
      return {
        tabActive: 0,

        title: "",
        articleHtml: "",

        titleNew: "",
        articleHtmlNew: "",

        rewriteSimilarity:0,

        rewriteModelShow: false,
      };
    },
    watch: {
      rewriteObj(val) {
        if (val.articleHtmlOld) {
          this.tabActive = 1;
          this.title = this.rewriteObj.titleOld;
          this.getRewrite();
        }
      },
      tabActive(val) {
        if (val == 1) {
          this.articleHtml = this.articleHtmlNew;
        } else {
          this.articleHtml = this.rewriteObj.articleHtmlOld;
        }
        this.$nextTick(() => {
          $('#rewrite-box-scroll').scrollTop(0);
        })
      }
    },
    created() {

    },
    mounted() {

    },
    methods: {

      //获取改写内容
      getRewrite() {
        var self = this;
        var textcontent = self.rewriteObj.articleHtmlOld.replace(/<(table|tr|td|%)[\s\S]*?\/\1>/g, "");
        textcontent = textcontent.replace(/<[^>]+>/g, "\n");

        self.$store.commit("setLoading", '正在改写中…');
        self.$http({
          url: apiHost + "/article/rewrite.do",
          data: {
            title: self.rewriteObj.titleOld,
            content: self.rewriteObj.articleHtmlOld,
            textcontent: textcontent
          },
          success: function (data) {
            self.$store.commit("setLoading", false);
            if (data.code == 0 && data.data && data.data.content) {
              self.rewriteModelShow = true;
              self.articleHtmlNew = data.data.content;
              self.articleHtml = self.articleHtmlNew;

              if(data.data.rewriteSimilarity){
                self.rewriteSimilarity = (data.data.rewriteSimilarity * 100).toFixed(1);
              }
              console.log(self.rewriteSimilarity);
            } else {
              self.$store.commit("setToolTip", data.msg);
              self.closeModel();
            }
          }
        });
      },

      yesToRewrite() {
        this.$emit('propRewriteAll',this.articleHtmlNew);
        this.closeModel();
      },

      closeModel() {
        this.rewriteModelShow = false;
        this.$emit('update:rewriteObj', {});
      },
    }
  };
</script>

<style lang="scss">
  @import "../../assets/scss/app";

  #rewrite {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 99999;
    box-sizing: border-box;
    padding: rem(90) rem(40) rem(40);
    background-color: #ffffff;
    .small-header {
      position: absolute;
      top: rem(90);
      left: 0;
      right: 0;
      z-index: 9;
      background-color: #EEEFF4;
      height: rem(66);
      padding: rem(16) 0;
      .back {
        font-size: rem(32);
        color: rgba(51, 51, 51, 1);
        line-height: rem(66);
        padding: 0 rem(33);
        img {
          height: rem(34);
        }
        &.left img {
          height: rem(30);
        }
      }
      .tabs {
        width: rem(280);
        height: rem(66);
        background: rgba(255, 255, 255, 1);
        border-radius: rem(33);
        margin: 0 auto;
        padding: 0 rem(20);
        a {
          display: block;
          width: 50%;
          float: left;
          text-align: center;
          line-height: rem(66);
          font-size: rem(32);
          color: rgba(51, 51, 51, 1);
          position: relative;
          & + a:after {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: rem(37);
            background-color: #E5E5E5;
          }
          &.active {
            color: #246BFF;
          }
        }
      }
    }

    .edit-box {
      position: absolute;
      top: rem(188);
      left: 0;
      right: 0;
      bottom: 0;
      box-sizing: border-box;
      padding: rem(34) rem(40) rem(40);
      .rate{
        position: absolute;
        right: rem(40);
        top:rem(10);
        font-size: rem(24);
        color: #999999;
      }
      .title {
        font-size: rem(40);
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        line-height: rem(56);
        margin-bottom: rem(20);
        border-bottom: none;
        padding-bottom: 0;
        padding-top: rem(10);
      }
      .article {
        font-size: rem(30);
        color: rgba(51, 51, 51, 1);
        line-height: rem(50);
        text-align: justify;
        word-break: break-all;
        p {
          margin-bottom: rem(50);
        }
        .ecnet-keyword{
          color: inherit;
        }
      }
    }
  }
</style>
