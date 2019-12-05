<template>
  <div id="platformCollect">
    <div class="tab" v-loading.lock="loading">
      <div class="content">
        <el-tabs v-model="tab_index">
          <el-tab-pane label="平台号文章" name="0">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="article_search_form">
                  <el-form-item label="时间">
                    <el-date-picker
                      v-model="article_search_form.timeScope"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                  <!-- <el-form-item label="状态">
                    <el-select v-model="article_search_form.status" placeholder="状态">
                      <el-option v-for="item in searchStatusList" :key="item.id" :label="item.name" :value="item.status"></el-option>
                    </el-select>
                  </el-form-item> -->
                  <el-form-item>
                    <el-input type="text" v-model="article_search_form.title" placeholder="输入标题查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="article_list" style="width: 100%;" class="articleTable">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="imageUrl" label="封面" width="">
                  <template slot-scope="scope">
                    <defaultImage :url="scope.row.imageUrl"></defaultImage>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="标题">
                  <template slot-scope="scope">
                    <a href="javascript:;" @click="openPreviewArticle(scope.row)">{{scope.row.title}}</a>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="createName" label="作者"></el-table-column>
                <el-table-column align="center" prop="platformName" label="所属平台号"></el-table-column>
                <el-table-column align="center" prop="source" label="来源"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" label="操作" width="220">
                  <template slot-scope="scope">
                    <p>
                      <el-button type="text" @click="sendAudit(scope.row.id)">发布</el-button>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="article_page_totle > 0">
              <el-pagination @current-change="articlePageNumChange" :current-page.sync="article_page_num" :page-size="article_page_size" layout="prev, pager, next, jumper" :total="article_page_totle"></el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <previewPop v-if="previewArticleId" :articleId="previewArticleId" :apiUrl="'/platform/selectById'" @closePreviewArticle="closePreviewArticle"></previewPop>
    <web-audit-pop v-if="isShowAudit" :isPlatform="true" :auditId="auditId" @fCloseAudit="isShowAudit=false" @fAuditSuccess="fAuditSuccess"></web-audit-pop>
  </div>
</template>
<script>
import previewPop from "./../../../components/previewPop.vue";
import webAuditPop from './webAuditPop'; // 送审弹窗

export default {
  name: 'collectArticle',
  data () {
    return {
      tab_index: 0,
      loading: false,
      article_search_form: {
        timeScope: '',
        channelPid: '',
        channelId: '',
        status: '',
        title: ''
      },
      article_list: [],
      searchStatusList: [
        {
          name: '待审核',
          status: ''
        },
        {
          name:'已发布',
          status:'7'
        },{
          name:'已下架',
          status:'8'
        }
      ],
      article_page_totle: 0,
      article_page_num: 1,
      article_page_size: 10,
      previewArticleId: '', // 预览id
      // 送审弹窗
      isShowAudit: false,
      auditId: '', // 送审id

    }
  },
  methods: {
    articlePageNumChange (val) {
      this.article_page_num = val;
      this.getArticleListData();
    },
    queryList () {
      this.article_page_num = 1;
      this.getArticleListData();
    },
    getArticleListData () {
      let startTime = '';
      let endTime = '';
      if (this.article_search_form.timeScope && this.article_search_form.timeScope[0]){
        startTime = this.article_search_form.timeScope[0]+' 00:00:00';
        endTime = this.article_search_form.timeScope[1]+' 23:59:59';
      }
      this.loading = true;
      this.$ajax({
        url: "/platform/articleList",
        data: {
          // sourceType  : "3",
          status: '1',
          timeStart: startTime,
          timeEnd: endTime,
          channelPid: this.article_search_form.channelPid,
          channelId: this.article_search_form.channelId,
          title: this.article_search_form.title,
          pageNum: this.article_page_num,
          pageSize: this.article_page_size,
          createName: this.article_search_form.author,
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0 && res.data) {
            this.article_list = res.data.list;
            this.article_page_totle = res.data.total;
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({type: 'error', message: err.msg, showClose: true});
        }
      });
    },
    sendAudit (id) {
      this.auditId = id;
      this.isShowAudit = true;
    },
    openPreviewArticle (row) {
      this.questUrl = '/platform/selectById';
      this.previewArticleId = row.id;
    },
    closePreviewArticle () {
      if (this.previewArticleId) this.previewArticleId = '';
    },
    fAuditSuccess () {
      this.isShowAudit = false;
      this.auditId = '';
      this.getArticleListData();
    },
  },
  created () {
    this.getArticleListData();
  },
  components: {
    previewPop,
    webAuditPop
  }
}
</script>
<style lang="scss" scoped>

</style>
