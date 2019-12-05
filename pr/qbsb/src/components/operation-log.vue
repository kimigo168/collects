<template>
  <div id="log-article" v-if="articleId" v-loading.fullscreen.lock="loading">
    <el-dialog class="log-model" title="操作记录" :visible.sync="logModelShow" width="700px" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scroll" style="max-height: 500px;">
        <div class="table">
          <el-table :data="dataList" style="width: 100%">
            <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
            <el-table-column align="center" prop="createTime" label="时间"></el-table-column>
            <el-table-column align="center" prop="userName" label="操作人"></el-table-column>
            <el-table-column align="center" prop="operation" label="操作项"></el-table-column>
            <el-table-column align="center" prop="status" label="稿件状态">
              <template slot-scope="scope">
                <span v-for="item in statusList" v-if="item.status == scope.row.status ">{{item.name}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="remark" label="备注"></el-table-column>
            <el-table-column align="center" label="操作" width="120px">
              <template slot-scope="scope">
                <el-button type="text" v-if="scope.row.flowId != 0" @click="openPreviewArticle(scope.row.flowId)">查看文章</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
      <div class="btns">
        <el-button type="primary" @click="logModelShow=false">关闭</el-button>
      </div>
    </el-dialog>


    <!-- <PreviewArticle :articleId="previewArticleId" apiUrl="/context/flowLog/detail" @closePreviewArticle="closePreviewArticle"></PreviewArticle> -->
    <previewPop v-if="previewArticleId" :articleId="previewArticleId" apiUrl="/context/flowLog/detail" @closePreviewArticle="closePreviewArticle"></previewPop>

  </div>
</template>

<script>
  import {mapState} from "vuex"

  // import PreviewArticle from "./preview-article.vue";
  import previewPop from './previewPop';
  export default {
    components: {
      // PreviewArticle,
      previewPop
    },
    props: ['articleId','apiUrl'],
    data: function () {
      return {
        dataList:[],
        logModelShow:false,

        previewArticleId:'',

        loading:false,
      }
    },
    computed: {
      ...mapState(
        ["statusList"]
      )
    },
    watch: {
      articleId: function (val) {
        if (val) {
          this.getDetail();
        }else {
          this.logModelShow=false;
        }
      },
      logModelShow:function (val) {
        if(!val){
          this.$emit('closeOperationLog');
        }
      }
    },
    created:function () {
      this.getDetail();
    },
    methods: {
      //获取文章详情
      getDetail: function () {
        var self = this;
        if (self.articleId) {
          self.dataList=[];
          self.loading = true;
          self.$jqAjax({
            url: self.apiUrl ? apiHost + self.apiUrl : apiHost + "/context/operationLog/list",
            data: {
              cid: self.articleId
            },
            success: function (data) {
              self.loading = false;
              self.logModelShow = true;
              if (data.code == 0 && data.data) {
                self.dataList=data.data;
              }
            }
          })
        }
      },

      //打开预览函数
      openPreviewArticle:function (id) {
        this.previewArticleId=id;
      },
      //关闭预览函数
      closePreviewArticle:function () {
        if(this.previewArticleId) this.previewArticleId='';
      },
    }
  }
</script>

<style lang="scss">
#log-article .el-dialog{
  width: 700px !important;
}
</style>
