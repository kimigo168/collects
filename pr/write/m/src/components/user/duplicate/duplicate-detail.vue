<template>
  <div id="duplicate-detail">
    <Header title="稿件查重"></Header>

    <div class="edit-box">
      <h3 id="title-html" class="title" v-html="title"></h3>
      <div id="article-html" class="article" v-html="articleHtml"></div>
    </div>



    <div class="ai-model">
      <div class="tabs" @tap.stop="aiModelShow = !aiModelShow">
        <a href="javascript:;">查重结果</a>

        <a href="javascript:;" class="to-edit" @tap.stop="clickEdit()">编辑稿件<img src="./../../../assets/images/edit-icon_07_01.png"/></a>
      </div>
      <div class="content-detail" :class="{'show': aiModelShow}">
        <p class="no-tip" v-show="!aiModelShow" @tap="aiModelShow=true">点击颜色标注的词句，查看查重结果</p>

        <div class="detail scroll"  v-show="aiModelShow">
          <h3>原文内容</h3>
          <p class="blue" v-html="duplicateItem.checktext"></p>
          <h3>相似内容来源</h3>
          <p v-html="duplicateItem.content"></p>

          <div class="bot">
            <h5><b>来源：</b>{{duplicateItem.site}}</h5>
            <h5><b>日期：</b>{{duplicateItem.time}}</h5>
            <h5><b>篇名：</b>{{duplicateItem.title}}</h5>
          </div>
        </div>

      </div>
    </div>


  </div>
</template>

<script>
  import Header from "../../Header.vue";

  export default {
    components: {
      Header
    },
    data: function () {
      return {
        editerId: "",

        title: "",
        articleHtml: "",
        articleHtmlNoBlue: "",

        duplicateList:[],
        duplicateItem:{},

        aiModelShow: false,

      };
    },
    created() {

    },
    mounted() {
      var self = this;
      this.init();
      $(document).scroll(function () {
        self.aiModelShow = false;
      });
    },
    methods: {
      init() {
        if (this.$route.query.id) {
          this.editerId = this.$route.query.id;
          this.getArticleDetail();
        }
      },

      getArticleDetail() {
        var self = this;
        self.$store.commit("setLoading", true);
        self.$http({
          url: apiHost + "/checking/detail.do",
          data: {
            id: self.editerId
          },
          success: function (data) {
            self.$store.commit("setLoading", false);
            if (data.code == 0 && data.data) {
              self.articleHtmlNoBlue = data.data.htmlContent;

              var arr = [];
              var text = data.data.htmlContent;
              var list=data.data.resultContent.datas;
              for (var i = 0; i < list.length; i++) {
                if (list[i].checktext && list[i].target && list[i].content) {
                  list[i].checktext = list[i].checktext.replace(/\n/g, '');
                  list[i].content = list[i].content.replace(list[i].target, '<span class="red">' + list[i].target + '</span>');
                  text = text.replace(list[i].checktext, '<span class="blue" index="' + i + '">' + list[i].checktext + '</span>');
                  arr.push(list[i]);
                }
              }
              self.duplicateList = arr;
              self.articleHtml = text;
              self.title = data.data.title;
             if(self.duplicateList.length>0) self.duplicateItem=self.duplicateList[0];

              self.$nextTick(function () {
                $('#article-html').find('.blue').on('click', function () {
                  var index = $(this).attr('index');
                  self.duplicateItem=self.duplicateList[index];
                  self.aiModelShow = true;
                })
              })
            } else {
              self.$store.commit("setLoading", data.msg);
            }
          }
        });
      },


      clickEdit(){
        window.localStorage.editerContent = this.articleHtmlNoBlue;
        window.localStorage.editerTitle = this.title;
        window.localStorage.removeItem('editerId');
        this.$router.push({
          path: '/edit',
          query: {write: 1}
        })
      },

    }
  };
</script>

<style lang="scss">
  @import "../../../assets/scss/app";

  #duplicate-detail {
    padding: rem(90) rem(40);
    .edit-box {
      padding: rem(56) 0 rem(90);
      .title {
        font-size: rem(40);
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        line-height: rem(56);
        margin-bottom: rem(20);
        border-bottom: 1px solid #dddddd;
        padding-bottom: rem(15);
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
      }
    }

    .ai-model {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 998;
      background: rgba(255, 255, 255, 1);
      border-radius: rem(30) rem(30) 0px 0px;
      box-shadow: 0px -3px 12px 0px rgba(0, 0, 0, 0.1);

      .tabs {
        margin: 0 rem(30);
        border-bottom: 1px solid #e5e5e5;
        overflow: hidden;
        a {
          display: inline-block;
          padding: rem(25) 0 rem(14);
          font-size: rem(28);
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: rem(40);
          &.to-edit{
            float: right;
            color: #246BFF;
            img{
              width: rem(32);
              margin-left: 5px;
              vertical-align: top;
            }
          }
        }
      }
      .content-detail {
        height: rem(80);
        position: relative;
        transition: all 0.3s;
        &.show {
          height: rem(690);
        }
        .no-tip {
          text-align: center;
          line-height: rem(80);
          font-size: rem(28);
          color: rgba(160, 162, 166, 1);
        }
        .detail{
          height: 100%;
          padding:rem(24) rem(30);
          box-sizing: border-box;
          h3{
            font-size:rem(28);
            font-weight:bolder;
            color:#333333;
            line-height:rem(40);
            border-left: 4px solid #246BFF;
            padding-left: rem(12);
            margin-bottom: rem(20);
          }
          p{
            font-size:rem(28);
            color:#333333;
            line-height:rem(40);
            margin-bottom: rem(30);
            &.blue{
              color: #246BFF;
            }
          }
          .bot{
            background:rgba(243,244,249,1);
            border-radius:4px;
            padding:rem(30) rem(30) rem(10);
            h5{
              font-size:rem(28);
              color:#333333;
              line-height:rem(40);
              margin-bottom: rem(20);
              position: relative;
              padding-left: rem(86);
              b{
                position: absolute;
                left: 0;
                top:0;
                color: #666666;
                font-weight: normal;
              }
            }
          }
        }
      }
    }


  }
</style>
