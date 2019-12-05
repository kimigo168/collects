<template>
  <div id="channel-sort" v-loading.lock="loading">
    <div class="tab">
      <div class="content">
        <el-tabs v-model="tab_index">
          <el-tab-pane label="频道内容" name="0">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="search_form">
                  <el-form-item label="父频道">
                    <el-select v-model="search_form.channelPid" placeholder="父频道" @change="getChildChannel">
                      <el-option v-for="item in newsParentChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="子频道">
                    <el-select v-model="search_form.channelId" :disabled="newsParentChannelList.length==0">
                      <el-option v-for="item in newsChildChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <!-- <el-form-item>
                    <el-input type="text" v-model="search_form.author" placeholder="输入作者查找"></el-input>
                  </el-form-item> -->
                  <el-form-item>
                    <el-button type="primary" @click="queryFun">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="list" style="width: 100%" class="articleTable">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="cover" label="封面" width="">
                  <template slot-scope="scope">
                    <defaultImage :url="scope.row.contextType==2?scope.row.cover:scope.row.bgCover"></defaultImage>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="标题"></el-table-column>
                <el-table-column align="center" prop="title" label="类型">
                  <template slot-scope="scope">
                    {{scope.row.contextType==1?scope.row.type==3?'视频':'资讯':'专题'}}
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="author" label="作者"></el-table-column>
                <el-table-column align="center" prop="channelName" label="频道"></el-table-column>
                <el-table-column align="center" prop="subChannelName" label="子频道"></el-table-column>
                <el-table-column align="center" prop="publishTime" label="发布时间"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" label="操作" width="220" style="position:relative;">
                  <template slot-scope="scope">
                    <el-button type="text" v-if="scope.$index!=0" @click="rankFun(scope, 0)">上移</el-button>
                    <el-button type="text" v-if="scope.$index!=list.length-1" @click="rankFun(scope, 1)">下移</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- <div class="page" v-if="page_total>0">
              <el-pagination @current-change="pageNumChange" :current-page.sync="page_num" :page-size="page_size" layout="prev, pager, next, jumper" :total="page_total"></el-pagination>
            </div> -->
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex"
export default {
  name: 'channelSort',
  data () {
    return {
      tab_index: '0',
      loading: false,
      search_form: {
        channelId: '',
        channelName: '',
        channelPid: '',
        channelPName: '',
        author: ''
      },
      page_total: 0,
      page_size: 10,
      page_num: 1,
      list: [],
      newsParentChannelList: [],
      newsChildChannelList: []
    }
  },
  methods: {
    queryFun () {
      this.page_num = 1;
      this.getList();
    },
    getList () {
      // 匹配name
      for (let item of this.newsParentChannelList) { // 匹配
        if (item.id == this.search_form.channelPid) {
          this.search_form.channelPName = item.name;
        }
      }
      for (let item1 of this.newsChildChannelList) {
        if (item1.id == this.search_form.channelId) {
          this.search_form.channelName = item1.name;
        }
      }
      this.loading = true;
      this.$jqAjax({
        url: apiHost + '/sort/list',
        type: 'POST',
        data: {
          channelPId: this.search_form.channelPid,
          channelPName: this.search_form.channelPName,
          channelId: this.search_form.channelId?this.search_form.channelId:0,
          channelName: this.search_form.channelName,
          pageSize: this.page_size,
          pageNum: this.page_num
          // author: this.search_form.author
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0 && res.data) {
            let list = res.data;
            if (list && list.length > 0) {
              list.map((item) => {
                if (item.cover) {
                  try {
                    let cover = JSON.parse(item.cover)
                    item.bgCover = cover[0].url;
                  } catch (e) {
                    item.bgCover = '';
                  }
                }
              });
            }
            this.list = list;
            this.page_total = res.data.length;
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({type: 'error', message: err.msg, showClose: true});
        }

      })
    },
    pageNumChange (val) {
      this.page_num = val;
    },
    rankFun (scope, no) {
      let exchangeItem = null;
      let curIdx = scope.$index;
      if (no == 0) { // 上移
        exchangeItem = this.list[curIdx - 1];
      } else { // 下移
        exchangeItem = this.list[curIdx + 1];
      }
      this.$confirm(`确定${no == 0?'上移':'下移'}吗？`, `${no == 0?'上移':'下移'}`,{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/sort/exchange',
          type: 'POST',
          data: {
            sourceId: scope.row.id,
            destId: exchangeItem.id
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.getList();
              this.$message({type: 'success', message: `${no == 0?'上移':'下移'}成功！`, showClose: true});
            } else {
              this.$message({type: 'warning', message: '操作失败', showClose: true});
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({type: 'warning', message: '操作失败', showClose: true})
          }
        });
      });
    },
    selectChange () {
      this.search_form.channelId = '';
      this.search_form.channelName = '';
      if (this.newsChildChannelList[1]) {
        this.search_form.channelId = this.newsChildChannelList[1].id;
        this.search_form.channelName = this.newsChildChannelList[1].name;
      }
    },
    getChildChannel (val) {
      this.newsChildChannelList = [];
      this.search_form.channelId = '';
      this.getNewsChannel(this.search_form.channelPid);
    },
    getNewsChannel (id) {
      this.$jqAjax({
        url: apiHost + '/user/getNewsChannel',
        type: 'POST',
        data: {
          pid: id
        },
        success: (res) => {
          if (res.code == 0) {
            if (id) { // 请求子频道
              this.newsChildChannelList = res.data;
              this.search_form.channelId = this.newsChildChannelList && this.newsChildChannelList.length > 0?this.newsChildChannelList[0].id : '';
            } else { // 请求父频道
              this.newsParentChannelList = res.data;
              if (this.newsParentChannelList.length > 0) {
                this.search_form.channelPid = this.newsParentChannelList[0].id
                this.getNewsChannel(this.newsParentChannelList[0].id);
                this.getList();
              }
            }
          }
        },
        error: (err) => {
          this.$message({type: 'warning', message: err.msg, showClose: true});
        }
      });
    }
  },
  mounted () {
    this.getNewsChannel();
  }
}
</script>
