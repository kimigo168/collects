<template>
  <div id="edit-publish" v-loading.lock="loading">
    <div class="tab">
      <div class="webContent">
        <el-tabs v-model="sub_tab_index_2">
          <el-tab-pane label="文章" name="1">
            <div class="operate">
              <div class="search" style="width:100%;height:auto;float:none;">
                <el-form :inline="true" :model="article_search_form_2">
                  <el-form-item label="时间">
                    <el-date-picker
                      v-model="article_search_form_2.timeScope"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="父频道">
                    <el-select v-model="article_search_form_2.channelPid" @change="getChildChannel" placeholder="父频道">
                      <el-option label="全部" value=""></el-option>
                      <el-option v-for="item in newsParentChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="子频道">
                    <el-select v-model="article_search_form_2.channelId" placeholder="子频道">
                      <el-option label="全部" value=""></el-option>
                      <el-option v-for="item in newsChildChannelList" :key="item.id"  :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="状态">
                    <el-select v-model="article_search_form_2.status" placeholder="状态">
                      <el-option v-for="item in searchStatusList" :label="item.name" :value="item.status"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="article_search_form_2.author" placeholder="输入信息员查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="article_search_form_2.title" placeholder="输入标题查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="article_list_2" style="width: 100%">
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
                <el-table-column align="center" prop="author" label="信息员"></el-table-column>
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
                <el-table-column align="center" width="220px" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.status == 4" @click="clickUpdateToAudit(scope.row.id)">发布</el-button>
                    <el-button type="text" class="danger-color" v-if="scope.row.status == 4" @click="clickSendBack(scope.row.id)">打回</el-button>
                    <el-button type="text" class="wran-color" v-if="scope.row.status == 4 && scope.row.type == 1" @click="routerTo('/layout/edit-edite-article?vfrom=3&id='+ scope.row.id)">修改</el-button>
                    <el-button type="text" class="wran-color" v-if="scope.row.status == 4 && scope.row.type == 6" @click="routerTo('/layout/edit-edite-link?vfrom=3&id='+ scope.row.id)">修改</el-button>
                    <el-button type="text" @click="openOperationLog(scope.row.cid)">操作记录</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="article_page_totle_2 > 0">
              <el-pagination
                @current-change="articlePageNumChange2"
                :current-page.sync="article_page_num_2"
                :page-size="article_page_size_2"
                layout="prev, pager, next, jumper"
                :total="article_page_totle_2">
              </el-pagination>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="视频" name="3">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="video_search_form_2">
                  <el-form-item label="时间">
                    <el-date-picker
                      v-model="video_search_form_2.timeScope"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="频道">
                    <el-select v-model="video_search_form_2.channelPid" placeholder="频道">
                      <el-option label="全部" value=""></el-option>
                      <el-option v-for="item in videoParentChannelList" :key="item.id"  :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="状态">
                    <el-select v-model="video_search_form_2.status" placeholder="状态">
                      <el-option v-for="item in searchStatusList" :label="item.name" :value="item.status"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="video_search_form_2.author" placeholder="输入作者查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="video_search_form_2.title" placeholder="输入标题查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table
                :data="video_list_2"
                style="width: 100%">
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
                <el-table-column align="center" prop="author" label="作者"></el-table-column>
                <el-table-column align="center" prop="channelName" label="频道"></el-table-column>
                <el-table-column align="center" prop="size" label="视频大小">
                  <template slot-scope="scope">
                    {{parseFloat(scope.row.size/1000).toFixed(2)}}M
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="duration" label="视频时长">
                  <template slot-scope="scope">
                    {{$durationDeal(scope.row.duration)}}
                  </template>
                </el-table-column>
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
                <el-table-column align="center" width="220px" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.status == 4" @click="clickUpdateToAudit(scope.row.id)">发布</el-button>
                    <el-button type="text" class="danger-color" v-if="scope.row.status == 4" @click="clickSendBack(scope.row.id)">打回</el-button>
                    <el-button type="text" class="wran-color" v-if="scope.row.status == 4" @click="routerTo('/layout/edit-edite-video?vfrom=3&id='+ scope.row.id)">修改</el-button>
                    <el-button type="text" @click="openOperationLog(scope.row.cid)">操作记录</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="video_page_totle_2 > 0">
              <el-pagination
                @current-change="videoPageNumChange2"
                :current-page.sync="video_page_num_2"
                :page-size="video_page_size_2"
                layout="prev, pager, next, jumper"
                :total="video_page_totle_2">
              </el-pagination>
            </div>
          </el-tab-pane> -->
        </el-tabs>
      </div>
    </div>

    <previewPop v-if="previewArticleId" :articleId="previewArticleId" :apiUrl="'/context/approve/detail'" @closePreviewArticle="closePreviewArticle"></previewPop>
    <OperationLog :articleId="operationLogId" @closeOperationLog="closeOperationLog"></OperationLog>

  </div>
</template>

<script>
  import {mapState} from "vuex"

  import previewPop from "./../../../components/previewPop.vue";
  import OperationLog from "./../../../components/operation-log.vue";
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
            status:'4,6,7,8'
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
            status:'6'
          },
        ],

        //文章
        sub_tab_index_2: '1',
        article_search_form_2: {
          status : "4",
          timeScope: [],
          channelPid: "",
          channelId: "",
          title: "",
          author: "",
        },
        article_list_2: [],
        article_page_num_2: 1,
        article_page_size_2: 10,
        article_page_totle_2: 0,
        newsParentChannelList: [],
        newsChildChannelList: [],
        //视频
        videoParentChannelList: [],
        video_search_form_2: {
          status : "4",
          timeScope: [],
          channelPid: "",
          title: "",
          author: "",
        },
        video_list_2: [],
        video_page_num_2: 1,
        video_page_size_2: 10,
        video_page_totle_2:0,

        previewArticleId:'',
        operationLogId:'',

        loading:false,
      }
    },
    computed: {
      ...mapState(
        ["statusList"]
      )
    },
    watch:{
      sub_tab_index_2:function () {
        if(this.sub_tab_index_2 == '1'){
          this.$getNewsChannel();
        }else {
          this.$getVideoChannel();
        }
        this.queryList();
      },
    },
    created() {
      if (this.$route.query.type) this.sub_tab_index_2 = this.$route.query.type;
      this.init();
    },
    methods: {
      queryList () {
        if(this.sub_tab_index_2 == '1'){
          this.article_page_num_2 = 1;
          this.article_page_totle_2 = 0;
          this.getArticleListData2();
        }else {
          this.video_page_num_2 = 1;
          this.getVideoListData2();
        }
      },
      init () {
        this.$getNewsChannel();
        this.getArticleListData2();
      },
      //点击发布
      clickUpdateToAudit:function (id) {
        var self = this;
        self.$confirm('建议发布前再检查一遍，确定发布？', '发布提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: function (action) {
            if (action == 'confirm') {
              self.loading=true;
              self.$ajax({
                url: '/context/approve/checker/updateStatus',
                data:{
                  id:id,
                  status:'7'
                },
                success:function (data) {
                  self.loading=false;
                  if(data.code === "0"){
                    self.$message({
                      showClose: true,
                      message: '已成功发布！',
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
      //点击打回
      clickSendBack:function (id) {
        var self = this;
        self.$prompt('是否确认将该稿件打回？打回原因：', '打回确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          inputValidator:function (value) {
            if(value === '' || value === null){
              return '请输入打回理由'
            }
          }
        }).then(({ value }) => {
          self.loading=true;
          self.$ajax({
            url:'/context/approve/checker/updateStatus',
            data:{
              id:id,
              status:'6',
              rejectReason:value
            },
            success:function (data) {
              self.loading=false;
              if(data.code === "0"){
                self.$message({
                  showClose: true,
                  message: '已成功打回！',
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
        }).catch(() => {

        });
      },

      getArticleListData2:function () {
        var self=this;

        var startTime='',endTime='';
        if(self.article_search_form_2.timeScope&&self.article_search_form_2.timeScope.length>0){
          startTime=self.article_search_form_2.timeScope[0]+' 00:00:00';
          endTime=self.article_search_form_2.timeScope[1]+' 23:59:59';
        }
        self.loading=true;
        self.$jqAjax({
          url: apiHost + "/context/approve/list",
          data: {
            type  : "1,6",
            status: self.article_search_form_2.status,
            startTime: startTime,
            endTime: endTime,
            channelPid: self.article_search_form_2.channelPid,
            channelId: self.article_search_form_2.channelId,
            title: self.article_search_form_2.title,
            author: self.article_search_form_2.author,
            pageNum: self.article_page_num_2,
            pageSize: self.article_page_size_2,
          },
          success: function (data) {
            self.loading=false;
            if (data.code == 0 && data.data) {
              for(var i=0;i<data.data.list.length;i++){
                try {
                  data.data.list[i].cover = JSON.parse(data.data.list[i].cover);
                }catch (e){

                }
              }
              if(data.data.list) self.article_list_2=data.data.list;
              if(data.data.total) self.article_page_totle_2=data.data.total;
            }
          }
        })
      },
      articlePageNumChange2(val) {
        this.article_page_num_2 = val;
        this.getArticleListData2();
      },

      getVideoListData2:function () {
        var self=this;

        var startTime='',endTime='';
        if(self.video_search_form_2.timeScope && self.video_search_form_2.timeScope.length>0){
          startTime=self.video_search_form_2.timeScope[0]+' 00:00:00';
          endTime=self.video_search_form_2.timeScope[1]+' 23:59:59';
        }
        self.loading=true;
        self.$jqAjax({
          url: apiHost + "/context/approve/list",
          data: {
            type  : "3",
            status: self.video_search_form_2.status,
            startTime: startTime,
            endTime: endTime,
            channelPid: self.video_search_form_2.channelPid,
            title: self.video_search_form_2.title,
            author: self.video_search_form_2.author,
            pageNum: self.video_page_num_2,
            pageSize: self.video_page_size_2,
          },
          success: function (data) {
            self.loading=false;
            if (data.code == 0 && data.data) {
              for(var i=0;i<data.data.list.length;i++){
                try {
                  data.data.list[i].cover = JSON.parse(data.data.list[i].cover);
                }catch (e){

                }
              }
              if(data.data.list) self.video_list_2=data.data.list;
              if(data.data.total) self.video_page_totle_2=data.data.total;
            }
          }
        })
      },
      videoPageNumChange2(val) {
        this.video_page_num_2 = val;
        this.getVideoListData2();
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
        if(this.operationLogId) this.operationLogId='';
      },
      //路由跳转函数
      routerTo:function (url) {
        this.$router.push(url);
      },
      getChildChannel (val) {
        this.newsChildChannelList = [];
        this.article_search_form_2.channelId = '';
        this.$getNewsChannel(this.article_search_form_2.channelPid);
      }
    }
  }
</script>

<style lang="scss">

</style>
