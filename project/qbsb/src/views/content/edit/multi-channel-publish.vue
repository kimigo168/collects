<template>
  <div id="edit-channels">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index" @tab-click="handleClick">
        <el-tab-pane label="原创文章" name="0"></el-tab-pane>
        <el-tab-pane label="采集文章" name="1"></el-tab-pane>
        <!-- <el-tab-pane label="平台号文章" name="2"></el-tab-pane>
        <el-tab-pane label="视频" name="3"></el-tab-pane> -->
      </el-tabs>
      <div class="webContent">
        <div class="operate">
          <div class="search" style="width:100%;height:auto;float:none;">
            <el-form :inline="true" :model="article_search_form_1">
              <el-form-item label="时间：">
                <el-date-picker v-model="article_search_form_1.time" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="频道：">
                <el-select v-model="article_search_form_1.channel" @change="selectOption($event, 1)">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="(item, index) in parentChannelList" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="tab_index!=3" label="子频道：">
                <el-select v-model="article_search_form_1.childChannel" @change="selectOption($event, 2)" :disabled="article_search_form_1.channel ==''">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="(item, index) in childChannelList" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item @key.enter="queryList">
                <el-input type="text" v-model="article_search_form_1.author" placeholder="输入信息员查找"></el-input>
              </el-form-item>
              <el-form-item @key.enter="queryList">
                <el-input type="text" v-model="article_search_form_1.title" placeholder="输入标题查找"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="queryList">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="table">
          <el-table :data="article_list_1" style="width:100%">
            <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
            <el-table-column align="center" prop="imageUrl" label="封面" width="">
              <template slot-scope="scope">
                <defaultImage v-if="tab_index!=2" :url="scope.row.cover&&scope.row.cover[0]?scope.row.cover[0].url:''"></defaultImage>
                <defaultImage v-else :url="scope.row.imageUrl"></defaultImage>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="title" label="标题">
              <template slot-scope="scope">
                <a href="javascript:;" @click="openPreviewArticle(scope.row)">{{scope.row.title}}</a>
              </template>
            </el-table-column>
            <el-table-column v-if="tab_index!=2" align="center" prop="createName" label="信息员"></el-table-column>
            <el-table-column v-if="tab_index==2" align="center" prop="createName" label="信息员"></el-table-column>
            <el-table-column v-if="tab_index==2" align="center" prop="platformName" label="所属平台号"></el-table-column>
            <el-table-column align="center" prop="channelName" label="频道"></el-table-column>
            <el-table-column align="center" prop="subChannelName" label="子频道"></el-table-column>
            <el-table-column align="center" prop="author" label="发布者"></el-table-column>
            <el-table-column align="center" prop="createTime" label="发布时间"></el-table-column>
            <el-table-column align="center" prop="source" label="来源"></el-table-column>
            <el-table-column align="center" prop="address" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="insertChannel(scope.row)">选入频道</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page" v-if="article_page_totle_1 > 0">
          <el-pagination
            @current-change="articlePageNumChange1"
            :current-page.sync="article_page_num_1"
            :page-size="article_page_size_1"
            layout="total, prev, pager, next, jumper"
            :total="article_page_totle_1">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 预览资讯 -->
    <previewPop v-if="previewArticleId" :apiUrl="questUrl" :articleId="previewArticleId" @closePreviewArticle="previewArticleId=''"></previewPop>
    <!-- 选入频道 -->
    <el-dialog v-loading.lock="loading" title="选入频道" :before-close="closeInsertChannel" :visible.sync="isShowSelectChannel" :close-on-click-modal="false" width="30%">
      <el-form :model="insert_channel_form" ref="insert_channel_form" label-width="100px">
        <el-form-item prop="channel_parent">
          <el-col :span="12">
            <h3>文章</h3>
            <div class="allot" v-for="item in channel_list_news" :key="item.id">
              <div class="parent">
                <el-checkbox v-model="item.select" :disabled="item.disabled">{{item.name}}</el-checkbox>
              </div>
              <div class="children" v-if="item.select">
                <el-checkbox v-model="item1.select" v-for="item1 in item.subList" :key="item1.id" :disabled="item1.disabled">{{item1.name}}</el-checkbox>
              </div>
            </div>
          </el-col>
          <!-- <el-col :span="12" >
            <h3>视频</h3>
            <div class="allot" v-for="item in channel_list_video" :key="item.id">
              <div class="parent">
                <el-checkbox v-model="item.select" :disabled="item.disabled">{{item.name}}</el-checkbox>
              </div>
            </div>
          </el-col> -->
        </el-form-item>
      </el-form>
      <p style="font-size:12px;color:#f00;">温馨提示：勾选了父频道，其相应的子频道需至少勾选一条</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeInsertChannel">取 消</el-button>
        <el-button type="primary" @click="confirmInsertChannel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import selectChannel from './selectChannel';
  import previewPop from "./../../../components/previewPop";

  export default {
    name: 'editChannels',
    data () {
      return {
        loading: false,
        tab_index: 0,
        article_search_form_1: {
          broadcastTime: '',
          keyword: '',
          time: '',
          type: '',
          channel: '',
          childChannel: '',
          title: '',
          author: ''
        },
        parentChannelList: [],
        childChannelList: [],
        article_list_1: [
        ],
        article_page_num_1: 1,
        article_page_size_1: 10,
        article_page_totle_1: 10,
        isShowSelectChannel: false,
        selectItem: null, // 要插入频道的文章列表项
        previewArticleId: '', // 预览文章的id
        questUrl: '',
        insert_channel_form: {

        },
        channel_list_news: [],
        channel_list_video: [],
      }
    },
    methods: {
      articlePageNumChange1(val) {
        this.article_page_num_1 = val;
        this.getList();
      },
      handleClick (tab, event) {
        this.article_search_form_1.title = '';
        this.article_search_form_1.author = '';
        this.article_search_form_1.time = '';
        this.article_search_form_1.channel = '';
        this.article_search_form_1.childChannel = '';
        if (this.tab_index == '3') { // 视频频道
          this.getChannelList(0, 1, '');
        } else { // 文章频道
          this.parentChannelList = [];
          this.getChannelList(0, 0, '');
        }
        this.queryList();
      },
      /*
       *获取频道列表
       *@param type1(0:父频道;1:子频道)
       *@param type2(0:资讯;1:视频)
       */
      getChannelList (type1, type2, pid) {
        this.$ajax({
          url: '/channel/list',
          type: 'GET',
          data: {
            queryType: type1,
            type: type2,
            pid: pid,
            status: '0' // 启用，禁用
          },
          success: (res) => {
            if (res.code == '0' && res.data) {
              if (pid && type1 == 1) {
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
      getList () {
        this.article_list_1 = [];
        if (this.tab_index == '0' || this.tab_index == '1'||this.tab_index == '2' || this.tab_index == '3') {
          this.loading = true;
          this.$jqAjax({
            url: apiHost + '/context/published/list',
            type: 'POST',
            data: {
              channelPid: this.article_search_form_1.channel, // 父频道id
              channelId: this.article_search_form_1.childChannel? this.article_search_form_1.childChannel:0, // 子频道id
              pageNum: this.article_page_num_1,
              pageSize: this.article_page_size_1,
              startTime: this.article_search_form_1.time?(this.article_search_form_1.time[0]+' 00:00:00') : '',
              endTime: this.article_search_form_1.time?(this.article_search_form_1.time[1]+' 23:59:59') : '',
              sourceType: this.tab_index == 0? 1 : this.tab_index == 3?'1':this.tab_index == '1'?4:3,
              type: this.tab_index == 0 ? '1,6': this.tab_index == 3?'3':'',
              status: '7', // 已发布
              title: this.article_search_form_1.title,
              author: this.article_search_form_1.author,
            },
            success: (res) => {
              this.loading = false;
              if (res.code == 0) {
                this.article_list_1 = res.data.list;
                this.article_page_totle_1 = res.data.total;
                this.article_list_1.map((item, index) => {
                  if (item.cover && item.cover.length) {
                    this.article_list_1[index].cover = JSON.parse(item.cover);
                  }
                });
              }
            },
            error: (err) => {
              this.loading = false;
              this.$message({type: 'error', message: '操作失败', showClose: true});
            }
          });
        } else {
          this.getPlatformArticle();
        }
      },
      getPlatformArticle () { // 获取
        this.loading = true;
        this.$ajax({
          url: '/platform/articleList',
          type: 'POST',
          data: {
            status: '1',
            pageNum: this.article_page_num_1,
            pageSize: this.article_page_size_1,
            title: this.article_search_form_1.title,
            createName: this.article_search_form_1.author,
            timeStart: this.article_search_form_1.time?(this.article_search_form_1.time[0]+' 00:00:00') : '',
            timeEnd: this.article_search_form_1.time?(this.article_search_form_1.time[1]+' 23:59:59') : ''
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.article_list_1 = res.data.list;
              this.article_page_totle_1 = res.data.total;
            } else {
              this.$message({type: 'error', message: res.msg, showClose: true});
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({type: 'error', message: err.msg, showClose: true});
          }
        });
      },
      queryList () { // 查找
        this.article_page_num_1 = 1;
        this.article_page_totle_1 = 0;
        this.article_list_1 = [];
        this.getList();
      },
      insertChannel (item) { // 选入频道
        this.selectItem = item;
        this.isShowSelectChannel = true;
        this.getInsertChannelList();
      },
      setSuccessBack () { // 选入成功后刷新
        this.isShowSelectChannel = false;
        this.article_page_num_1 = 1;
        this.getList();
      },
      openPreviewArticle (row) { // 预览资讯
        // if (this.tab_index == 2) {
        //   this.questUrl = '/platform/selectById';
        // } else {
          this.questUrl = '/context/published/detailByCid';
        // }
        this.previewArticleId = row.cid;
      },
      getInsertChannelList () {
        this.loading = true;
        this.channel_list_news = [];
        this.$jqAjax({
          url: apiHost + '/channel/context/selectableChannelList',
          type: 'POST',
          data: {
            cid: this.selectItem.cid,
            type: 0 // 0:资讯，1：视频
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              let list = res.data;
              for (let item of list) {
                item.select = item.isSelected==1 ? true : false;
                item.disabled = item.isSelected==1 ? true : false;
                if (item.subList) {
                  for (let item1 of item.subList) {
                    item1.select = item1.isSelected==1 ? true : false;
                    item1.disabled = item1.isSelected==1 ? true : false;
                  }
                }
              }
              this.channel_list_news = list;
            }
          },
          error: (err) => {
            this.loading = false;
          }
        });
      },
      closeInsertChannel () {
        this.isShowSelectChannel = false;
      },
      confirmInsertChannel () {
        let newsList = this.channel_list_news;
        // 判断是否有选了父频道，子频道未选择
        let isNoOneSelect = false;
        let noArr = [];
        for (let item of newsList) {
          if (item.select && item.subList) {
            let isNoSelectAll = item.subList.every((item1) => {
              return !item1.select
            });
            if (isNoSelectAll) {
              isNoOneSelect = true;
              noArr.push(item);
            }
          }
        }
        if (isNoOneSelect) {
          let strs = ''
          for (let item of noArr) {
            strs += (item.name + '，')
          }
          strs = strs.substring(0, strs.length-1);
          this.$message({type: 'warning', message: `${strs}频道未选择子频道，请选择后再保存`, showClose: true});
          return;
        }
        // 筛选勾选的项
        let news = [];
        for (let item of newsList) {
          if (item.select) {
            item.isSelected = item.select ? 1 : 0;
            if (item.subList && item.subList.length > 0) {
              let arr1 = [];
              for (let item1 of item.subList) {
                if (item1.select) {
                  item1.isSelected = item1.select ? 1 : 0; 
                  news.push(item1);
                }
              }
            } else {
              news.push(item);
            }
          }
        }
        console.log('news', news)
        this.loading = true;
        this.$jqAjax({
          url: apiHost +'/channel/context/add',
          type: 'POST',
          data: {
            channelList: JSON.stringify({news}),
            cid: this.selectItem.cid
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({type: 'success', message: '选入成功', showClose: true})
              this.isShowSelectChannel = false;
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({type: 'warning', message: err.msg, showClose: true});
          }
        });
      }
    },
    created () {
      this.getChannelList(0, 0, '0'); // 请求父频道数据
      this.getList();
    },
    components: {
      selectChannel,
      previewPop
    }
  }
</script>
<style lang="scss" scoped>
  #edit-channels .el-dialog  {
    .el-checkbox {
      width: 140px;
      margin: 5px;
    }
    .parent {
      line-height: 20px;
    }
    .children {
      margin-left: 25px;
      line-height: 20px;
    }
  }
</style>