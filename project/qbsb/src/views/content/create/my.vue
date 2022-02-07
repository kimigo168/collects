<template>
  <div id="content-my" v-loading.lock="loading">
    <div class="tab">
      <el-tabs v-model="tab_index"  @tab-click="handleClick">
        <el-tab-pane label="采集文章" name="4"></el-tab-pane>
        <el-tab-pane label="原创文章" name="1"></el-tab-pane>
      </el-tabs>
      <div class="webContent">
        <div class="operate">
          <div class="search" style="width:100%;height:auto;float:none;">
            <el-form :inline="true" :model="article_search_form_1">
              <el-form-item label="时间">
                <el-date-picker v-model="article_search_form_1.timeScope" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="父频道">
                <el-select v-model="article_search_form_1.channelPid" @change="getChildChannel" placeholder="父频道">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="item in newsParentChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="子频道">
                <el-select v-model="article_search_form_1.channelId" placeholder="子频道">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="item in newsChildChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="article_search_form_1.status" placeholder="状态">
                  <el-option v-for="item in searchStatusList" :key="item.id" :label="item.name" :value="item.status"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input type="text" v-model="article_search_form_1.author" placeholder="输入信息员查找"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input type="text" v-model="article_search_form_1.title" placeholder="输入标题查找"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="queryList">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="table">
          <el-table :data="article_list_1" style="width: 100%">
            <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
            <el-table-column align="center" prop="cover" label="封面" width="">
              <template slot-scope="scope">
                <defaultImage :url="scope.row.cover && scope.row.cover[0]?scope.row.cover[0].url:''"></defaultImage>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="title" label="标题">
              <template slot-scope="scope">
                <a href="javascript:;" @click="openPreviewArticle(scope.row.id)">{{scope.row.title}}</a>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="createName" label="信息员"></el-table-column>
            <el-table-column align="center" prop="channelName" label="频道"></el-table-column>
            <el-table-column align="center" prop="subChannelName" label="子频道"></el-table-column>
            <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
            <el-table-column align="center" prop="status" label="状态">
              <template slot-scope="scope">
                <span v-for="item in statusList" v-if="item.status == scope.row.status ">{{item.name}}</span>
                <p v-if="(scope.row.status == 2 || scope.row.status == 5 || scope.row.status == 6) && scope.row.rejectReason">
                  <el-tooltip :content="scope.row.rejectReason" placement="top">
                    <el-button type="text">打回原因</el-button>
                  </el-tooltip>
                </p>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="180px">
              <template slot-scope="scope">
                <el-button type="text" v-if="scope.row.status == '0'" @click="clickUpdateToAudit(scope.row.id)">送审</el-button>
                <el-button type="text" v-if="scope.row.status == '0'"  class="wran-color" @click="routerTo('/layout/create-create?vfrom=-1&type='+scope.row.type+'&id='+ scope.row.id)">修改</el-button>
                <el-button type="text" v-if="scope.row.status == '0'" class="danger-color" @click="clickDelete(scope.row.id)">删除</el-button>
                <el-button type="text" v-if="scope.row.status=='2'||scope.row.status=='5'||scope.row.status=='6'" @click="routerTo('/layout/create-create?vfrom=-1&type='+scope.row.type+'&id='+ scope.row.id+'&isReEdit=1')">重新编辑</el-button> 
                <el-button type="text" v-if="scope.row.status != '0'" @click="openOperationLog(scope.row.cid)">操作记录</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page" v-if="article_page_totle_1 > 0">
          <el-pagination @current-change="articlePageNumChange1" :current-page.sync="article_page_num_1" :page-size="article_page_size_1" layout="prev, pager, next, jumper" :total="article_page_totle_1"></el-pagination>
        </div>
      </div>
    </div>
    <!-- 操作日志 -->
    <OperationLog :articleId="operationLogId" @closeOperationLog="closeOperationLog"></OperationLog>
    <!-- 预览弹窗 -->
    <previewPop v-if="previewArticleId" :articleId="previewArticleId" @closePreviewArticle="previewArticleId=''"></previewPop>  
  </div>
</template>
<script>
  import { mapState } from "vuex"
  import OperationLog from "./../../../components/operation-log.vue";
  import previewPop from './../../../components/previewPop';
  export default {
    components: {
      OperationLog,
      previewPop
    },
    data() {
      return {
        searchStatusList:[
          {
            name:'全部状态',
            status:'0,1,2,3,4,5,6,7,8'
          },{
            name:'草稿',
            status:'0'
          },{
            name:'待审核',
            status:'1'
          },{
            name:'待编辑',
            status:'3'
          },{
            name:'待发布',
            status:'4'
          },{
            name:'已发布',
            status:'7'
          },{
            name:'已下架',
            status:'8'
          },{
            name:'已打回',
            status:'2,5,6'
          },
        ],
        tab_index: '4', // 1: 原创，4：网络采集
        article_search_form_1: {
          status : "0,1,2,3,4,5,6,7,8",
          timeScope: [],
          channelPid: "",
          channelId: "",
          title: "",
          author: "",
        },
        newsParentChannelList: [],
        newsChildChannelList: [],
        article_list_1: [],
        article_page_num_1: 1,
        article_page_size_1: 10,
        article_page_totle_1: 0,
        previewArticleId:'',
        operationLogId:'',
        loading:false
      }
    },
    computed: {
      ...mapState(["statusList"])
    },
    created() {
      if (this.$route.query.type) this.tab_index = this.$route.query.type;
      this.init();
    },
    methods: {
      handleClick () {
        this.queryList();
      },
      queryList () {
        this.article_page_num_1 = 1;
        this.article_page_totle_1 = 0;
        this.getArticleListData1();
      },
      init () {
        this.$getNewsChannel();
        this.getArticleListData1();
      },
      //点击送审
      clickUpdateToAudit:function (id) {
        var self = this;
        self.$confirm('建议送审前再检查一遍，确定送审？', '送审提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: function (action) {
            if (action == 'confirm') {
              self.loading=true;
              self.$ajax({
                url: '/context/org/personal/updateStatus',
                data:{
                  id:id,
                  status: '4'
                },
                success:function (data) {
                  self.loading=false;
                  if(data.code === "0"){
                    self.$message({
                      showClose: true,
                      message: '送审成功！',
                      type: 'success'
                    });
                    self.queryList();
                  }else {
                    self.$message({
                      showClose: true,
                      message: data.msg + '',
                      type: 'error'
                    });
                  }
                }
              })

            }
          }
        })
      },
      //点击删除
      clickDelete:function (id) {
        var self = this;
        self.$confirm('确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: function (action) {
            if (action == 'confirm') {
              self.loading=true;
              self.$ajax({
                url: '/context/org/personal/updateStatus',
                data:{
                  id:id,
                  isDelete:'1'
                },
                success:function (data) {
                  self.loading=false;
                  if(data.code === "0"){
                    self.$message({
                      showClose: true,
                      message: '删除成功！',
                      type: 'success'
                    });
                    self.queryList();
                  }else {
                    self.$message({
                      showClose: true,
                      message: data.msg + '',
                      type: 'error'
                    });
                  }
                }
              })

            }
          }
        })
      },
      getArticleListData1:function () {
        var self=this;
        var startTime='',endTime='';
        if ( self.article_search_form_1.timeScope && self.article_search_form_1.timeScope[0] ){
          startTime = self.article_search_form_1.timeScope[0] + ' 00:00:00';
          endTime = self.article_search_form_1.timeScope[1] + ' 23:59:59';
        }
        self.article_list_1 = [];
        self.loading = true;
        self.$jqAjax({
          url: apiHost + "/context/org/personal/list",
          data: {
            type: "1,6",
            status : self.article_search_form_1.status,
            startTime: startTime,
            endTime: endTime,
            channelPid: self.article_search_form_1.channelPid,
            channelId: self.article_search_form_1.channelId,
            title: self.article_search_form_1.title,
            author: self.article_search_form_1.author,
            pageNum: self.article_page_num_1,
            pageSize: self.article_page_size_1,
            sourceType: this.tab_index // 1:原创，4：网站
          },
          success: function (data) {
            self.loading=false;
            if (data.code == 0) {
              if (data.data) {
                for(var i=0;i<data.data.list.length;i++){
                  try {
                    data.data.list[i].cover = JSON.parse(data.data.list[i].cover);
                  } catch (e){

                  }
                }
                if(data.data.list) self.article_list_1=data.data.list;
                if(data.data.total) self.article_page_totle_1=data.data.total;
              }
            } else {
              self.$message({type: 'error', message: data.msg, showClose: true});
            }
          }
        })
      },
      articlePageNumChange1(val) {
        this.article_page_num_1 = val;
        this.getArticleListData1();
      },
      //打开预览函数
      openPreviewArticle:function (id) {
        this.previewArticleId=id;
      },
      //关闭预览函数
      closePreviewArticle:function () {
        if(this.previewArticleId) this.previewArticleId='';
      },
      //打开操作记录
      openOperationLog:function (id) {
        this.operationLogId=id;
      },
      //关闭操作记录
      closeOperationLog:function () {
        this.operationLogId='';
      },
      //路由跳转函数
      routerTo:function (url) {
        this.$router.push(url);
      },
      getChildChannel (val) {
        this.newsChildChannelList = [];
        this.article_search_form_1.channelId = '';
        this.$getNewsChannel(this.article_search_form_1.channelPid);
      }
    }
  }
</script>

