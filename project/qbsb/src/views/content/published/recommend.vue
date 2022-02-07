<template>
  <div id="edit-publish" v-loading.lock="loading">
    <div class="tab">
      <div class="webContent">
        <el-tabs v-model="sub_tab_index_1" @tab-click="handleClick">
          <el-tab-pane label="文章" name="1">
            <div class="operate">
              <div class="search" style="width:100%;height:auto;float:none;" @keyup.enter="queryList">
                <el-form :inline="true" :model="article_search_form_1">
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
                  <el-form-item>
                    <el-input type="text" v-model="article_search_form_1.author" placeholder="输信息员查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="article_search_form_1.title" placeholder="输入标题查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryList()">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="dataList" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="cover" label="封面" width="">
                  <template slot-scope="scope">
                    <defaultImage :url="scope.row.cover"></defaultImage>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="data.title" label="标题">
                  <template slot-scope="scope">
                    <a  v-if="scope.row.data.contextType!=2" href="javascript:;" @click="openPreviewArticle(scope.row.data)">{{scope.row.data.title}}</a>
                    <span v-else>{{scope.row.data.title}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="data.title" label="类型">
                  <template slot-scope="scope">
                    {{scope.row.data.contextType==1?scope.row.data.type==3?'视频':'资讯':'专题'}}  
                  </template>  
                </el-table-column>
                <el-table-column align="center" prop="data.author" label="信息员"></el-table-column>
                <el-table-column align="center" prop="data.channelName" label="频道"></el-table-column>
                <el-table-column align="center" prop="data.sonChannelName" label="子频道"></el-table-column>
                <el-table-column align="center" prop="data.createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" label="操作" width="220px">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.preId && article_search_form_1.channelPid!=''" type="text" @click="moveFun(scope.row, 0)">上移</el-button>
                    <el-button v-if="scope.row.nextId && article_search_form_1.channelPid!=''" type="text" @click="moveFun(scope.row, 1)">下移</el-button>
                    <el-button type="text" class="danger-color" @click="stickFun(scope.row.data, 0)" v-if="scope.row.data.status==0">取消置顶</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="视频" name="3">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="video_search_form_1">
                  <el-form-item label="频道">
                    <el-select v-model="video_search_form_1.channelPid" placeholder="频道">
                      <el-option v-for="item in videoChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="video_search_form_1.author" placeholder="输入作者查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="video_search_form_1.title" placeholder="输入标题查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="dataList" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="cover" label="封面" width="">
                  <template slot-scope="scope">
                    <defaultImage :url="scope.row.cover"></defaultImage>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="标题">
                  <template slot-scope="scope">
                    <a href="javascript:;" @click="openPreviewArticle(scope.row.data)">{{scope.row.data.title}}</a>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="data.author" label="作者"></el-table-column>
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
                <el-table-column align="center" prop="data.createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" label="操作" width="220px">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.preId" type="text" @click="moveFun(scope.row, 0)">上移</el-button>
                    <el-button v-if="scope.row.nextId" type="text" @click="moveFun(scope.row, 1)">下移</el-button>
                    <el-button type="text" class="danger-color" @click="stickFun(scope.row.data, 0)" v-if="scope.row.data.status==0">取消置顶</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="article_page_total_1 > 0">
              <el-pagination @current-change="articlePageNumChange1" :current-page.sync="article_page_num_1" :page-size="article_page_size_1" layout="total, prev, pager, next, jumper" :total="article_page_total_1"></el-pagination>
            </div>
          </el-tab-pane> -->
        </el-tabs>
      </div>
    </div>
    <previewPop v-if="previewArticleId" :articleId="previewArticleId" :apiUrl="'/context/published/detailByCid'" @closePreviewArticle="closePreviewArticle"></previewPop>
  </div>
</template>

<script>
  import {mapState} from "vuex"
  import previewPop from "./../../../components/previewPop.vue";
  export default {
    components: {
      previewPop
    },
    data() {
      return {
        //文章
        sub_tab_index_1: '1',
        article_search_form_1: {
          channelPid: "",
          channelId: "",
          title: "",
          author: ""
        },
        article_list_1: [],
        dataList: [],
        article_page_num_1: 1,
        article_page_size_1: 10,
        article_page_total_1: 0,
        //视频
        video_search_form_1: {
          channelPid: "",
          title: "",
          author: ""
        },
        video_list_1: [],
        video_page_num_1: 1,
        video_page_size_1: 10,
        video_page_total_1: 0,
        previewArticleId:'',
        loading:false,
        newsParentChannelList: [],
        newsChildChannelList: []
      }
    },
    created() {
      if (this.$route.query.type) this.sub_tab_index_1 = this.$route.query.type;
      this.getChildChannel();
      this.getList();
    },
    methods: {
      articlePageNumChange1 (val) {
        this.article_page_num_1 = val;
        this.getList();
      },
      getList () {
        this.loading = true;
        this.dataList = [];
        this.$ajax({
          url:"/stick/list",
          type: 'POST',
          data: {
            type: this.sub_tab_index_1, // 1文章，3视频
            channelPid: this.sub_tab_index_1 == 1 ? this.article_search_form_1.channelPid:this.video_search_form_1.channelPid,
            channelId: this.sub_tab_index_1 == 1 ? this.article_search_form_1.channelId : '',
            pageNum: this.article_page_num_1,
            pageSize: this.article_page_size_1,
            status: 0, // 1上架，0下架
            title: this.sub_tab_index_1 == 1 ? this.article_search_form_1.title : this.video_search_form_1.title,
            author: this.sub_tab_index_1 == 1 ? this.article_search_form_1.author : this.video_search_form_1.author
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.dataList = res.data.list;
              this.article_page_total_1 = res.data.total;
              this.dataList.map((item, index) => {
                if (item.data.cover) {
                  try {
                    if (item.data.contextType!=2) {
                      this.$set(this.dataList[index], 'cover', JSON.parse(item.data.cover)[0].url)
                    } else {
                      this.$set(this.dataList[index], 'cover', item.data.cover)
                    }
                  } catch (e) {
                    this.$set(this.dataList[index], 'cover', '')
                  }
                }
              });
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({type: 'warning', message: '请求失败', showClose: true});
          }
        });
      },
      queryList () {
        this.article_page_num_1 = 1;
        this.getList();
      },
      moveFun (row, no) {
        this.$confirm(`确定${no==0?'上移':'下移'}吗？`, `${no==0?'上移':"下移"}`, {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.loading = true;
          this.$ajax({
            url: '/stick/move',
            type: 'POST',
            data: {
              moveFirstId: row.data.id,
              moveFirstSort: row.data.sortNum,
              moveTwoId: no == 0 ? (row.preId||'') : (row.nextId||''),
              moveTwoSort: no == 0 ? (row.preSort||'') : (row.nextSort||'')
            },
            success: (res) => {
              if (res.code == 0) {
                this.queryList();
                this.$message({type: 'success', message: '操作成功', showClose: true});
              } else {
                this.$message({type: 'error', message: '操作失败', showClose: true});
              }
            },
            error: (err) => {
              this.$message({type: 'error', message: '操作失败', showClose: true});
            }
          });
        });
      },
      stickFun (row, no) {
        this.$confirm(`确定${no==0?'取消':''}置顶吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$jqAjax({
            url: apiHost + '/stick/cancelStick',
            type: 'GET',
            data: {
              id: row.id
            },
            success: (res) => {
              this.loading = false;
              if (res.code == 0) {
                this.queryList();
                this.$message({type: 'success', message: `${no==0?'置顶已取消':'置顶成功'}`, showClose: true});
              } else {
                this.$message({type: 'error', message: '操作失败', showClose: true});
              }
            },
            error: (err) => {
              this.loading = false;
              this.$message({type: 'error', message: '操作失败', showClose: true});
            }
          });
        });
      },
      getVideoListData1:function () {
        var self=this;
        self.loading=true;
        self.$jqAjax({
          url: apiHost + "/context/published/list",
          data: {
            type  : "3",
            channelPid: self.video_search_form_1.channelPid,
            pageNum: 1,
            pageSize: 100,
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
              if(data.data.list) self.video_list_1=data.data.list;
            }
          }
        })
      },
      //打开预览函数
      openPreviewArticle (row) {
        if (row.contextType == 2) {
          this.$message({type: 'warning', message: '专题无法预览', showClose: true});
          return;
        }
        this.previewArticleId = row.cid;
        console.log('打开')
      },
      //关闭预览函数
      closePreviewArticle: function () {
        if (this.previewArticleId) this.previewArticleId = '';
      },
      handleClick () {
        this.article_search_form_1.channelPid = this.articleChannelListParent[0].id;
        this.article_search_form_1.channelId = '';
        this.article_search_form_1.title = '';
        this.article_search_form_1.author = '';
        this.video_search_form_1.title = '';
        this.video_search_form_1.author = '';
        this.video_search_form_1.channelPid = this.videoChannelList[0].id;
        this.queryList();
      },      
      getChildChannel () {
        this.newsChildChannelList = [];
        this.article_search_form_1.channelId = '';
        this.$getNewsChannel(this.article_search_form_1.channelPid);
        this.getList();
      }
    }
  }
</script>

<style lang="scss">

</style>
