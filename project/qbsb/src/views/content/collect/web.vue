<template>
  <div id="webCollect">
    <div class="tab" style="width:100%" v-loading.lock="loading">
      <el-tabs v-model="tab_index" @tab-click="handleClick">
        <el-tab-pane label="网站采集" name="0"></el-tab-pane>
        <el-tab-pane label="公众号采集" name="1"></el-tab-pane>
      </el-tabs>
      <div class="webContent">
        <div class="operate">
          <div class="search" style="width:100%;height:auto;float:none;">
            <el-form :inline="true" :model="article_search_form">
              <el-form-item label="时间：">
                <el-date-picker v-model="article_search_form.time" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
              <el-form-item >
                <el-select v-model="option1">
                  <el-option label="或者" value="0"></el-option>
                  <el-option label="并且" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="标题：" style="margin-right:30px;">
                <el-input style="width:190px;" type="text" v-model="article_search_form.title" placeholder="输入文章标题查找"></el-input>
              </el-form-item>
              <!-- <el-form-item >
                <el-select v-model="option2">
                  <el-option label="或者" value="0"></el-option>
                  <el-option label="并且" value="1"></el-option>
                </el-select>
              </el-form-item> -->
              <!-- <el-form-item label="标签：" style="margin-right:30px;">
                <el-input style="width:190px;" type="text" v-model="article_search_form.keyword" placeholder="输入标签内容查找"></el-input>
              </el-form-item> -->
              <el-form-item>
                <el-button type="primary" @click="queryList">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="table">
          <el-table :data="article_list" style="width:100%;">
            <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
            <el-table-column align="center" prop="imageUrl" label="封面" width="">
              <template slot-scope="scope">
                <defaultImage :url="scope.row.bgCover"></defaultImage>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="title" label="标题">
              <template slot-scope="scope">
                <span href="javascript:;" @click="viewDetail(scope.row)" v-html="scope.row.title"></span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="source" label="来源"></el-table-column>
            <!-- <el-table-column align="center" prop="keyword" label="标签">
                <template slot-scope="scope">{{scope.row.keywords.join(',')}}</template>
            </el-table-column> -->
            <el-table-column align="center" prop="tag" label="分类" v-if="tab_index=='0'">
              <template slot-scope="scope">{{scope.row.tags&&scope.row.tags[0]?scope.row.tags[0]:''}}</template>
            </el-table-column>
            <el-table-column align="center" prop="status" label="状态">
              <template slot-scope="scope">
                {{tab_index=='0'?statusObj[scope.row.status]:'待审核'}}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="time" label="发布时间">
              <template slot-scope="scope">
                {{tab_index=='0'?scope.row.time?new Date(scope.row.time).format('YYYY-MM-DD hh:mm'):'':scope.row.createTime?new Date(scope.row.createTime).format('YYYY-MM-DD hh:mm') :''}}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="address" label="操作">
              <template slot-scope="scope">
                <el-button v-if="scope.row.status==0||(scope.row.status==1&&tab_index=='1')" type="text" @click="sendAudit(scope.row)">送审</el-button>
                <el-button v-if="scope.row.status!=3" type="text" @click="editFun(scope.row)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page" style="float:none;width:auto;">
          <el-pagination @current-change="pageNumChange" :current-page.sync="article_page_num" :page-size="article_page_size" layout="total, prev, pager, next, jumper" :total="article_page_total"></el-pagination>
        </div>
      </div>
    </div>
    <web-audit-pop v-if="isShowAudit" :isPlatform="tab_index=='1'" :auditId="auditId" @fCloseAudit="isShowAudit=false" @fAuditSuccess="fAuditSuccess"></web-audit-pop>
    <!-- 预览弹窗 -->
    <previewPop v-if="isShowPreview" :articleId="articleId" :apiUrl="apiUrl" :isWebCollect="tab_index=='0'" :articleForm="viewItem" @closePreviewArticle="isShowPreview=false"></previewPop>  
  </div>
</template>
<script>
import webAuditPop from './webAuditPop';
import previewPop from '../../../components/previewPop';
export default {
  name: 'webCollect',
  data () {
    return {
      loading: false,
      tab_index: '0', // '0':网站采集，'1'：公众号采集
      article_search_form: {
        time: [],
        status: '',
        classify: '',
        keyword: '', // 标签
        title: '' // 标题
      },
      article_page_num: 1,
      article_page_size: 10,
      article_page_total: 0,
      article_list: [],
      statusObj: {
        '0': '待审核',
        '1': '待编辑',
        '2': '待发布',
        '3': '已发布',
        '4': '已下架',
        '5': '已打回'
      },
      isShowAudit: false,
      auditId: '', // 送审id
      viewItem: null,
      option1: '1',
      option2: '1',
      isShowPreview: false,
      apiUrl: '/platform/selectById',
      articleId: ''
    }
  },
  components: {
    webAuditPop,
    previewPop
  },
  methods: {
    viewDetail (item) {
      if (this.tab_index === '0') { // 网站采集
        this.viewItem = item;
        this.articleId = null
        this.isShowPreview = true; // 打开弹窗
      } else { // 公众号采集
        this.viewItem = null;
        this.articleId = item.id;
      }
    },
    fAuditSuccess () {
      this.isShowAudit = '';
      this.auditId = '';
      this.queryList();
    },
    queryList () {
      this.article_page_num = 1;
      this.article_page_total = 0;
      if (this.tab_index == '0') {
        this.getArticleList();
      } else {
        this.getGzhList();
      }
    },
    getArticleList () {
      this.loading = true;
      this.article_list = [];
      this.$ajax({
        url: '/netCollect/list',
        type: 'POST',
        data: {
          pageNum: this.article_page_num,
          pageSize: this.article_page_size,
          status: this.article_search_form.status,
          classify: this.article_search_form.classify,
          title: this.article_search_form.title, // 标题
          keyword: this.article_search_form.keyword, // 标签
          timeStart: this.article_search_form.time&&this.article_search_form.time[0]? this.article_search_form.time[0] + ' 00:00:00':'',
          timeEnd: this.article_search_form.time&&this.article_search_form.time[1]? this.article_search_form.time[1] + ' 23:59:59':'',
          titleFlag: this.option1,
          keywordFlag: this.option2
        },
        success: (res) => {
          this.loading = false;
          if (res.code == '0' && res.data.list) {
            let list = res.data.list;
            list.map((item, index) => {
              if (item.cover && item.cover.length > 0) {
                try {
                  let cover = JSON.parse(item.cover);
                  list[index].bgCover = cover[0].url;
                } catch (e) {
                  this.$set(list[index], 'bgCover', '')
                  list[index].bgCover = ''
                }
              }
            });
            this.article_list = list;
            this.article_page_total = res.data.total > 10000 ? 9999 : res.data.total ;
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({type: 'error', message: '请求失败', showClose: true});
        }
      });
    },
    getGzhList () {
      this.loading = true;
      this.article_list = [];
      this.$ajax({
        url: '/platform/articleList',
        type: 'POST',
        data: {
          timeStart: this.article_search_form.time&&this.article_search_form.time[0]? this.article_search_form.time[0] + ' 00:00:00':'',
          timeEnd: this.article_search_form.time&&this.article_search_form.time[1]? this.article_search_form.time[1] + ' 23:59:59':'',
          title: this.article_search_form.title,
          pageNum: this.article_page_num,
          pageSize: this.article_page_size,
          titleFlag: parseInt(this.option1) // 0:并且，1：或者
        },
        success: (res) => {
          this.loading = false;
          if (res.code === '0' && res.data) {
            let list = res.data.list;
            list.map((item) => {
              if (item.cover) {
                try {
                  let coverArr = JSON.parse(item.cover)
                  item.bgCover = coverArr && coverArr.length > 0 ? coverArr[0] && coverArr[0].url ? coverArr[0].url : coverArr[1] && coverArr[1].url ? coverArr[1].url : coverArr[2] && coverArr[2].url ? coverArr[2].url : '' :''
                } catch (error) {
                  console.log(error)
                  item.bgCover = ''
                }
              }
            })
            this.article_list = list;
            this.article_page_total = res.data.total;
          }
        },
        error: (err) => {
          this.loading = false;
          console.log(err)
        }
      })
    },
    pageNumChange (val) {
      this.article_page_num = val;
      if (this.tab_index === '0') {
        this.getArticleList();
      } else {
        this.getGzhList();
      }
    },
    sendAudit (row) {
      if (this.tab_index == '0') { // 网站采集
        this.auditId = row._id;
      } else {
        this.auditId = row.id
      }
      this.isShowAudit = true;
    },
    editFun (row) {
      let id = ''
      let type = ''
      if (this.tab_index === '0') {
        id = row._id
        type = 1 // 网站采集
      } else {
        id = row.id 
        type = 2 // 公众号采集
      }
      let url = '/layout/create-create?vfrom=2&type=1&id='+id+'&isCollectEdit='+ type
      this.$router.push({ path: url})
    },
    handleClick () {
      // console.log('tab_index', this.tab_index)
      this.queryList();
    }
  },
  created () {
    this.getArticleList();
  }
}
</script>
