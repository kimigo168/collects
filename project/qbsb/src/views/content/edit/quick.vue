<template>
  <div id="quick">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index" @tab-click="handleClick">
        <el-tab-pane label="文章" name="0"></el-tab-pane>
        <el-tab-pane label="视频" name="1"></el-tab-pane>
      </el-tabs>
      <div class="content">
        <div class="operate">
          <div class="search">
            <el-form :inline="true" :model="searchForm">
              <el-form-item label="时间">
                <el-date-picker v-model="searchForm.time" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="父频道" v-if="tab_index=='0'">
                <el-select v-model="searchForm.channelPid" placeholder="父频道" @change="getChildChannel">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="item in newsParentChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="子频道" v-if="tab_index=='0'">
                <el-select v-model="searchForm.channelId" placeholder="子频道">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="item in newsChildChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="频道" v-if="tab_index=='1'">
                <el-select v-model="searchForm.channelPid" placeholder="父频道">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="item in videoParentChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="状态">
                <el-select v-model="searchForm.status" placeholder="状态">
                  <el-option v-for="item in status_list" :key="item.status" :value="item.status" :label="item.name"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item>
                <el-input type="text" v-model="searchForm.author" placeholder="输入作者查找"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input type="text" v-model="searchForm.title" placeholder="输入标题查找"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="queryList">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="table">
          <el-table :data="list" style="width:100%">
            <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
            <el-table-column align="center" prop="cover" label="封面">
              <template slot-scope="scope">
                <defaultImage :url="scope.row.cover && scope.row.cover[0]?scope.row.cover[0].url:''"></defaultImage>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="title" label="标题">
              <template slot-scope="scope">
                <a href="javascript:;" @click="openPreviewArticle(scope.row.id)">{{scope.row.title}}</a>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="createName" label="作者"></el-table-column>
            <el-table-column align="center" prop="channelName" label="频道"></el-table-column>
            <el-table-column v-if="tab_index=='0'" align="center" prop="subChannelName" label="子频道"></el-table-column>
            <el-table-column  v-if="tab_index=='1'" align="center" prop="size" label="视频大小">
              <template slot-scope="scope">
                {{parseFloat(scope.row.size/1000).toFixed(2)}}M
              </template>
            </el-table-column>
            <el-table-column  v-if="tab_index=='1'" align="center" prop="duration" label="视频时长">
              <template slot-scope="scope">
                {{$durationDeal(scope.row.duration)}}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
            <!-- <el-table-column align="center" prop="status" label="状态">
              <template slot-scope="scope">
                <span v-for="item in status_list" :key="item.status" v-if="item.status==scope.row.status">{{item.name}}</span>
              </template>
            </el-table-column> -->
            <el-table-column align="center" width="220px" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="publishFun(scope.row)">发布</el-button>
                <el-button type="text" @click="rejectFun(scope.row)">打回</el-button>
                <el-button type="text" @click="routerTo('/layout/create-create?vfrom=1&type='+scope.row.type+'&id='+ scope.row.id+'&quick=1')">修改</el-button>
                <el-button type="text" @click="viewModifyLog(scope.row)">修改记录</el-button>
              </template>  
            </el-table-column>
          </el-table>
        </div>
        <div class="page" v-if="page_total>0">
          <el-pagination @current-change="pageNumChange" :current-page.sync="page_num" :page-size="page_size" layout="prev, pager, next, jumper" :total="page_total"></el-pagination>
        </div>
      </div>
    </div>
    <OperationLog :articleId="operationLogId" @closeOperationLog="operationLogId=''"></OperationLog>
    <previewPop v-if="previewArticleId" :articleId="previewArticleId" @closePreviewArticle="previewArticleId=''"></previewPop>
  </div>
</template>
<script>
import {mapState} from "vuex"
import OperationLog from "./../../../components/operation-log.vue";
import previewPop from "./../../../components/previewPop.vue";

export default {
  name: 'editQuick',
  data () {
    return {
      loading: false,
      tab_index: '0',
      list: [],
      searchForm: {
        time: [],
        channelPid: '',
        channelId: '',
        status:'',
        title: '',
        author: ''
      },
      status_list: [],
      page_num: 1,
      page_size: 10,
      page_total: 0,
      operationLogId: '',
      previewArticleId: '',
      newsParentChannelList: [],
      newsChildChannelList: [],
      videoParentChannelList: [],
    }
  },
  components: {
    OperationLog,
    previewPop
  },
  methods: {
    handleClick () {
      this.searchForm.time = [];
      this.searchForm.title = '';
      this.searchForm.author = '';
      this.searchForm.channelPid = '';
      if (this.tab_index == '0') {
        this.$getNewsChannel();
      } else {
        this.$getVideoChannel();
      }
      this.queryList();
    },
    queryList () {
      this.page_num = 1;
      this.getList();
    },
    getList () {
      // 请求数据
      this.loading = true;
      this.list = [];
      this.$jqAjax({
        url: apiHost + '/context/org/list',
        data: {
          type: this.tab_index == '0' ? '1,6' : '3',
          status: '1', // 待审核
          startTime: this.searchForm.time && this.searchForm.time[0] ? this.searchForm.time[0] + ' 00:00:00': '',
          endTime: this.searchForm.time && this.searchForm.time[1] ? this.searchForm.time[1] + ' 23:59:59' : '',
          channelPid: this.searchForm.channelPid,
          channelId: this.searchForm.channelId,
          title: this.searchForm.title,
          author: this.searchForm.author,
          pageNum: this.page_num,
          pageSize: this.page_size
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0 && res.data) {
            let list = res.data.list;
            for (let i = 0; i < list.length; i++) {
              try {
                list[i].cover = JSON.parse(list[i].cover)
              } catch (e) {
                list[i].cover = '';
              }
            }
            this.list = list;
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({type: 'error', message: err.msg, showClose: true});
        }
      });
    },
    pageNumChange (val) {
      this.page_num = val;
      this.getList();
    },
    openPreviewArticle (id) { // 预览
      this.previewArticleId = id;
    },
    publishFun (row) {
      this.$confirm('确定发布吗？', '发布',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/context/published/easyPublish',
          type: 'POST',
          data: {
            cid: row.cid
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({type: 'success', message: '发布成功', showClose: true});
              this.queryList();
            } else {
              this.$message({type: 'error', message: res.msg, showClose: true});
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({type: 'error', message: err.msg, showClose: true});
          }
        });
      });
    },
    modifyFun () {

    },
    rejectFun (row) {
      this.$prompt('是否确认将该稿件打回？打回原因：', '打回确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputValidator:function (value) {
          if(value === '' || value === null){
            return '请输入打回理由'
          }
        }
      }).then(({ value }) => {
        this.loading = true;
        this.$ajax({
          url:'/context/org/updateStatus',
          data:{
            id: row.id,
            status:'2',
            rejectReason: value
          },
          success: (res) => {
            this.loading = false;
            if (res.code === "0"){
              this.$message({ type: 'success', message: '已成功打回！', showClose: true});
              this.queryList();
            }else {
              this.$message({ type: 'error', message: res.msg, showClose: true});
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({ type: 'error', message: err.msg, showClose: true});
          }
        });
      })
    },
    routerTo (url) {
      this.$router.push(url);
    },
    viewModifyLog (row) {
      this.operationLogId = row.cid;
    },
    getChildChannel (val) {
      this.newsChildChannelList = [];
      this.searchForm.channelId = '';
      this.$getNewsChannel(this.searchForm.channelPid);
    }
  },
  created () {
    this.getList();
    this.$getNewsChannel();
  }
}
</script>
<style lang="scss" scoped>

</style>
