<template>
  <div id="channel-article">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index" @tab-click="handleClick">
        <el-tab-pane label="原创文章" name="0"></el-tab-pane>
        <el-tab-pane label="采集文章" name="1"></el-tab-pane>
        <!-- <el-tab-pane label="平台号文章" name="2"></el-tab-pane> -->
      </el-tabs>
      <div class="webContent">
        <!-- 搜索 -->
        <div class="operate">
          <div class="search" style="width:100%;height:auto;float:none;" @keyup.enter="queryList">
            <el-form :inline="true" :model="article_search_form_1">
              <el-form-item label="时间：">
                <el-date-picker v-model="article_search_form_1.time" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="父频道：">
                <el-select v-model="article_search_form_1.channel" @change="selectOption($event, 1)">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="(item, index) in parentChannelList" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="子频道：">
                <el-select v-model="article_search_form_1.childChannel" @change="selectOption($event, 2)" :disabled="article_search_form_1.channel ==''">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="(item, index) in childChannelList" :key="index" :label="item.name" :value="item.id"></el-option>
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
        <!-- 数据表单 -->
        <div class="table">
          <el-table :data="article_list_1" style="width:100%">
            <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
            <el-table-column align="center" prop="imageUrl" label="封面" width="">
              <template slot-scope="scope">
                <defaultImage :url="scope.row.cover&&scope.row.cover[0]?scope.row.cover[0].url:''"></defaultImage>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="title" label="标题">
              <template slot-scope="scope">
                <a href="javascript:;" @click="openPreviewArticle(scope.row.cid)">{{scope.row.title}}</a>
              </template>
            </el-table-column>
            <el-table-column v-if="tab_index!=2" align="center" prop="createName" label="信息员"></el-table-column>
            <el-table-column v-if="tab_index==2" align="center" prop="createName" label="信息员"></el-table-column>
            <el-table-column v-if="tab_index==2" align="center" prop="source" label="所属平台号"></el-table-column>
            <el-table-column align="center" prop="channelName" label="频道"></el-table-column>
            <el-table-column align="center" prop="subChannelName" label="子频道"></el-table-column>
            <el-table-column align="center" prop="author" label="发布者"></el-table-column>
            <el-table-column align="center" prop="publishTime" label="发布时间"></el-table-column>
            <el-table-column align="center" prop="source" label="来源"></el-table-column>
            <el-table-column align="center" prop="address" label="操作">
              <template slot-scope="scope">
                <p v-if="scope.row.blockChange==0">
                  <el-button  type="text" @click="stickFun(scope.row)">置顶</el-button>
                </p>
                <p v-if="scope.row.blockChange==0">
                  <el-button type="text" @click="insertCarousel(scope.row)">选入轮播</el-button>
                </p>
                <!-- <p>
                  <el-button type="text" @click="insertTopic(scope.row)">选入专题</el-button>
                </p> -->
                <p>
                  <el-button type="text" @click="removeChannel(scope.row)">移出频道</el-button>
                </p>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="page"  v-if="article_page_totle_1 > 0">
          <el-pagination @current-change="articlePageNumChange1" :current-page.sync="article_page_num_1" :page-size="article_page_size_1" layout="total, prev, pager, next, jumper" :total="article_page_totle_1">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 选入专题 -->
    <!-- <el-dialog v-loading.lock="loading" title="选入专题" :visible.sync="insertObj.isShow" top="20vh" width="600px" :close-on-click-modal="true" :close-on-press-escape="false">
      <el-form :modal="insertObj" ref="insertObj" label-width="80px" >
        <el-form-item label="专题名称">
          <el-select v-model="insertObj.id">
            <el-option v-for="item in insertObj.list" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-top:40px;">
          <el-button style="width:80px;" @click="insertObj.isShow=false">取消</el-button>
          <el-button style="width:80px;" type="primary" @click="confirmInsertTopic">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog> -->
    <previewPop v-if="previewArticleId" :articleId="previewArticleId" :apiUrl="'/context/published/detailByCid'" @closePreviewArticle="closePreviewArticle"></previewPop>
    <insert-carousel v-if="isShowInsertCarousel" :insertData="insertData" @fClosePop="isShowInsertCarousel=false" @fConfirmInsert="insertFun"></insert-carousel>
  </div>
</template>
<script>
import previewPop from "./../../../components/previewPop.vue";
import insertCarousel from '../../../components/insertCarousel'; // 选入轮播
export default {
  name: 'channelArticle',
  data () {
    return {
      loading: false,
      tab_index: 0,
      // 搜索相关
      article_search_form_1: {
        time: '',
        channel: '',
        childChannel: '',
        keyword: '',
        title: '',
        author: ''
      },
      parentChannelList: [], // 父频道列表
      childChannelList: [], // 子频道列表
      // 表单数据
      article_list_1: [],
      // 分页相关
      article_page_num_1: 1,
      article_page_size_1: 10,
      article_page_totle_1: 10,
      previewArticleId: '',
      insertObj: {
        isShow: false,
        list: [],
        id: '', // 选中专题id
        articleCid: '' // 文章cid
      },
      isShowInsertCarousel: false,
      insertData: {
        title: '', // 标题
        cover: '' // 封面
      },
      insertDataRow: null, // 插入轮播的项
    }
  },
  methods: {
    //打开预览函数
    openPreviewArticle (id) {
      this.previewArticleId=id;
    },
    closePreviewArticle () {
      if(this.previewArticleId) this.previewArticleId='';
    },
    articlePageNumChange1(val) {
      this.article_page_num_1 = val;
      this.getList();
    },
    handleClick (tab, event) {
      this.article_page_num_1 = 1;
      this.article_page_totle_1 = 0;
      this.article_list_1 = [];
      this.article_search_form_1.author = '';
      this.article_search_form_1.title = '';
      this.queryList();
    },
    selectOption (event, type) {
      if (type == 1) { // 选择父频道
        this.article_search_form_1.channel = event;
        this.article_search_form_1.childChannel = '';
        this.childChannelList = [];
        this.getChannelList(1, 0, event); // 请求子频道数据
      } else { // 选择子频道
        this.article_search_form_1.childChannel = event;
      }
    },
    getChannelList (queryType, type, pid) {
      let data = {};
      if (pid && queryType == 1)  data = { pid: pid }
      this.$jqAjax({
        url: apiHost + `/user/${type==0?'getNewsChannel':'getVideoChannel'}`,
        data: data,
        success: (res) => {
          if (res.code == '0' && res.data) {
            if (pid) {
              this.childChannelList = res.data;
            } else {
              this.parentChannelList = res.data;
            }
          }
        },
        error: (err) => {
          this.$message({type: 'error', message: '请求失败', showClose: true});
        }
      });
    },
    getList () { // 获取列表数据
      this.article_list_1 = [];
      // if (this.tab_index == 0 || this.tab_index == 1 ) {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/channel/context/list',
          type: 'POST',
          data: {
            channelPid: this.article_search_form_1.channel, // 父频道id
            channelId: this.article_search_form_1.childChannel?this.article_search_form_1.childChannel:0, // 子频道id
            pageNum: this.article_page_num_1,
            pageSize: this.article_page_size_1,
            startTime: this.article_search_form_1.time?this.article_search_form_1.time[0] : '',
            endTime: this.article_search_form_1.time?this.article_search_form_1.time[1] : '',
            sourceType: this.tab_index == 0? 1: this.tab_index == 1?4:this.tab_index == 2?3:'', // 1: oms中创作的稿件 2:第三方（采集）普通稿件 3: 公众号采集数据 4:网站采集  
            title: this.article_search_form_1.title,
            author: this.article_search_form_1.author
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.article_list_1 = res.data.list;
              this.article_page_totle_1 = res.data.total;
              this.article_list_1.forEach((item, index) => {
                if (item.cover && item.cover.length) {
                  this.article_list_1[index].cover = JSON.parse(item.cover);
                }
              });
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({type: 'error', message: err.msg, showClose: true});
          }
        });
      // } else {

      // }
    },
    queryList () { // 查找
      this.article_page_num_1 = 1;
      this.article_page_totle_1 = 0;
      this.article_list_1 = [];
      this.getList();
    },
    removeChannel (row) {
      this.$confirm('确定移除频道？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/channel/context/remove',
          type: 'POST',
          data: {
            id: row.id
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({ type: 'success', message: '移除成功', showClose: true });
              this.queryList(); // 刷新
            } else {
              this.$message({ type: 'error', message: '操作失败', showClose: true});
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({ type: 'error', message: '请求失败', showClose: true});
          }
        });
      })
    },
    stickFun (row) {
      if (row.isStick == 1) {
        this.$message({type: 'warning', message: '该文章已置顶，请勿重复点击', showClose: true});
        return;
      }
      this.$confirm(`确定置顶该文章吗？`, '置顶', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/channel/context/addStick',
          type: 'POST',
          data: {
            cid: row.cid,
            channelPid: row.pid,
            channelId: row.channelId
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.queryList();
              this.$message({type: 'success', message: '置顶成功', showClose: true});
            } else {
              this.$message({type: 'error', message: res.msg, showClose: true});
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({type: 'error', message: '操作失败', showClose: true});
          }
        });
      });
    },
    insertCarousel (row) {
      this.insertData.title = row.title;
      this.insertDataRow = row;
      if (row.cover && row.cover[0]) {
        this.insertData.cover = row.cover[0].url?row.cover[0].url : '';
      } else {
        this.insertData.cover = '';
      }
      this.isShowInsertCarousel = true;
    },
    insertFun (data) {
      this.isShowInsertCarousel = false;
      this.loading = true;
      this.$jqAjax({
        url: apiHost + '/channel/context/selectContextToCarousel',
        type: 'POST',
        data: {
          cid: this.insertDataRow.cid,
          channelPid: this.insertDataRow.pid,
          channelId: this.insertDataRow.channelId,
          cover: data.cover,
          title: data.title
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            this.queryList();
            this.$message({type: 'success', message: '选入成功', showClose: true});
          } else {
            this.$message({type: 'error', message: res.msg, showClose: true});
          }
        },
        error: (err) => {
          this.loading = false;
          console.log('err',err);
          this.$message({type: 'error', message: err.msg, showClose: true});
        }
      });
    },

    // insertTopic (row) {
    //   console.log('row', row)
    //   this.insertObj.articleCid = row.cid;
    //   this.insertObj.list = [];
    //   this.insertObj.id = '';
    //   this.$ajax({
    //     url: '/topic/list',
    //     type: 'POST',
    //     data: {
    //       channelId: row.pid,
    //       sonChannelId: row.subChannelId,
    //       status: 0,
    //       pageNum: 1,
    //       pageSize: 50
    //     },
    //     success: (res) => {
    //       if (res.code == 0 && res.data) {
    //         this.insertObj.list = res.data.list;
    //       }
    //     },
    //     error: (err) => {
    //       this.$message({type: 'error', message: '请求失败', showClose: true});
    //     }
    //   });
    //   this.insertObj.isShow = true;
    // },
    // confirmInsertTopic () {
    //   if (!this.insertObj.id) {
    //     this.$message({type: 'warning', message: '请选择专题', showClose: true});
    //     return;
    //   }
    //   this.loading = true;
    //   this.$jqAjax({
    //     url: apiHost + '/channel/context/selectContextToTopic',
    //     type: 'POST',
    //     data: {
    //       cid: this.insertObj.articleCid, // 稿件id
    //       topicId: this.insertObj.id
    //     },
    //     success: (res) => {
    //       this.loading = false;
    //       if (res.code == 0) {
    //         this.insertObj.isShow = false;
    //         this.queryList(); // 刷新
    //         this.$message({type: 'success', message: '选入成功', showClose: true});
    //       } else {
    //         this.$message({type: 'error', message: '操作失败', showClose: true});
    //       }
    //     },
    //     error: (err) => {
    //       this.loading = false;
    //       this.$message({type: 'error', message: '操作失败', showClose: true});
    //     }
    //   });
    // }
  },
  created () {
    this.getChannelList(0, 0, ''); // 请求父频道数据
    this.getList();
  },
  components: {
    previewPop,
    insertCarousel
  }
}
</script>
<style lang="scss" scoped>

</style>
