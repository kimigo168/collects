<template>
  <div id="preview-article" v-if="articleId || articleForm" v-loading.fullscreen.lock="loading">


    <el-dialog v-if="type=='1'" class="preview-model" title="预览文章" :visible.sync="previewModelShow" width="700px" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scroll" style="height: 500px;">
        <h3 class="title">{{title}}</h3>
        <div class="info" v-if="source || time">
          <span class="source">{{source}}</span>
          <span class="time">{{time}}</span>
        </div>
        <div class="article" v-html="content"></div>
      </div>
      <div class="btns">
        <el-button type="primary" @click="previewModelShow=false">关闭</el-button>
      </div>
    </el-dialog>


    <el-dialog v-if="type=='3'" class="preview-model" title="预览视频" :visible.sync="previewModelShow" width="700px" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scroll" style="max-height: 500px;">

        <video :src="videoUrl" :poster="videoCover" controls="" width="100%"></video>
        <h3 class="title">{{title}}</h3>
        <div class="info" v-if="source || time">
          <span class="source">{{source}}</span>
          <span class="time">{{time}}</span>
        </div>
      </div>
      <div class="btns">
        <el-button type="primary" @click="previewModelShow=false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog v-if="type=='6'" class="preview-model" title="预览外链文章" :visible.sync="previewModelShow" width="700px" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scroll" style="max-height: 500px;">
        <h3 class="title">{{title}}</h3>
        <div class="info" v-if="source || time">
          <span class="source">{{source}}</span>
          <span class="time">{{time}}</span>
        </div>
        <iframe class="link-iframe" :src="content"></iframe>
      </div>
      <div class="btns">
        <el-button type="primary" @click="previewModelShow=false">关闭</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    props: ['articleId','articleForm','apiUrl'],
    data: function () {
      return {
        title:'',
        source:'',
        time:'',
        content:'',
        videoUrl:'',
        videoCover:'',
        previewModelShow:false,
        type:'1',

        loading:false,
      }
    },
    watch: {
      articleId: function (val) {
        if (val) {
          this.getDetail();
        }else {
          this.previewModelShow=false;
        }
      },
      articleForm: function (val) {
        if (val) {
          this.title=val.title;
          this.source=val.source;
          this.content=val.content;
          this.previewModelShow=true;
        }
      },
      previewModelShow:function (val) {
        if(!val){
          this.$emit('closePreviewArticle');
        }
      }
    },
    methods: {
      //获取文章详情
      getDetail: function () {
        var self = this;
        if (self.articleId) {
          self.loading = true;
          self.title='';
          self.source='';
          self.time='';
          self.content='';
          self.videoUrl='';
          self.videoCover='';

          self.$jqAjax({
            url: self.apiUrl ? apiHost + self.apiUrl : apiHost + "/context/org/detail",
            data: {
              id: self.articleId,
              flowId : self.articleId,
            },
            success: function (data) {
              self.loading = false;
              self.previewModelShow = true;
              if (data.code == 0 && data.data) {
                self.title=data.data.title;
                self.source=data.data.source;
                self.time=data.data.createTime;
                self.content=data.data.content;
                self.type=data.data.type;
                console.log(self.type)
                if(self.type == '3'){
                  if(data.data.cover){
                    try {
                      var coverArr=JSON.parse(data.data.cover);
                      if(coverArr[0]) self.videoCover = coverArr[0].url;
                    }catch (e){}
                  }
                  if(data.data.content) {
                    self.videoUrl = JSON.parse(data.data.content).url;
                  }
                }else {

                }
              }
            }
          })
        }
      },
    }
  }
</script>

<style lang="scss">
  #preview-article {
    .preview-model{
      .el-dialog__body{
        padding:10px 20px 30px;
      }
      .title{
        font-size: 20px;
        color: #333333;
        margin-bottom: 10px;
      }
      .info{
        font-size: 12px;
        color: #999999;
        margin-bottom: 10px;
        .time{
          margin-left: 20px;
        }
      }
      .article{
        font-size: 16px;
        color: #333333;
        padding-right: 5px;
        *{
          max-width: 100%;
        }
      }
      .btns{
        text-align: center;
        padding-top: 20px;
        border: none;
      }
      .link-iframe{
        width: 100%;
        height: 400px;
        box-sizing: border-box;
        background: #F5F5F5;
        border: 1px solid #DDDDDD;
        border-radius: 4px;
      }
    }
  }
</style>
