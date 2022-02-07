<template>
  <div id="push">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index"  @tab-click="handleClick">
        <el-tab-pane label="推送历史" name="1"></el-tab-pane>
        <!-- <el-tab-pane label="视频" name="3"></el-tab-pane> -->
        <!-- <el-tab-pane label="专题" name="2"></el-tab-pane> -->
        <div class="content">
          <div class="operate clearfix">
            <div class="search lt">
              <el-form :inline="true" :model="article_search_form">
                <el-form-item label="时间">
                  <el-date-picker v-model="article_search_form.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-input style="width:190px;" type="text" v-model="article_search_form.content" placeholder="输入推送的内容查找"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="queryList">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="btn rt">
              <el-button type="primary" @click="$router.push({path: '/layout/push-add'})">新增推送</el-button>
            </div>
          </div>
          <div class="table">
            <el-table :data="article_list" style="width: 100%">
              <el-table-column align="center" type="index" label="序号" width="105"></el-table-column>
              <el-table-column align="center" prop="title" label="标题"></el-table-column>
              <el-table-column align="center" prop="type" label="类型">
                <template slot-scope="scope">
                  {{scope.row.type=='1'?'文章':scope.row.type=='2'?'专题':''}}
                </template>
              </el-table-column>
              <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
              <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
              <el-table-column align="center" prop="pushTime" label="推送时间"></el-table-column>
              <!-- <el-table-column align="center" prop="viewNum" label="查看人数"></el-table-column> -->
              <!-- <el-table-column align="center" label="操作" width="170">
                <template slot-scope="scope">
                  <el-button type="text" class="danger-color" @click="removePush(scope.row.id)">删除</el-button>
                </template>
              </el-table-column> -->
            </el-table>
          </div>
          <div class="page" v-if="pageTotal>0">
            <el-pagination @current-change="pageNumChange" :current-page.sync="pageNum" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal"></el-pagination>
          </div>
        </div>
        <!-- <el-tab-pane label="视频" name="1">
          <div class="content">
            <div class="operate clearfix">
              <div class="search lt">
                <el-form :inline="true" :model="video_search_form">
                  <el-form-item label="时间">
                    <el-date-picker v-model="video_search_form.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-input style="width:190px;" type="text" v-model="video_search_form.content" placeholder="输入推送的内容查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="getPushList(3)">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="btn rt">
                <el-button type="primary" @click="$router.push({path: '/layout/push-add'})">新增推送</el-button>
              </div>
            </div>
            <div class="table">
              <el-table :data="video_list" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="105"></el-table-column>
                <el-table-column align="center" prop="title" label="标题"></el-table-column>
                <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="pushTime" label="推送时间"></el-table-column>
                <el-table-column align="center" prop="viewNum" label="查看人数"></el-table-column>
                <el-table-column align="center" label="操作" width="170">
                  <template slot-scope="scope">
                    <el-button type="text" class="danger-color" @click="removePush(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab_index: '1',
      loading: false,
      article_search_form: {
        date: "",
        content: ""
      },
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
      article_list: [],
      video_search_form: {
        date: "",
        content: ""
      },
      video_list: []
    }
  },
  created() {
    this.getPushList();
  },
  methods: {
    handleClick () {
      this.article_search_form.date = [];
      this.getPushList();
    },
    pageNumChange(val) {
      this.pageNum = val;
      this.getPushList();
    },
    queryList () {
      this.pageNum = 1;
      this.getPushList();
    },
    //获取推送列表
    getPushList() {
      this.article_list = [];
      let data = {
        keyword: this.article_search_form.content,
        timeStart: this.article_search_form.date&&this.article_search_form.date[0] ? this.article_search_form.date[0] + ' 00:00:00' : '',
        timeEnd: this.article_search_form.date&&this.article_search_form.date[1] ? this.article_search_form.date[1] + ' 23:59:59' : '',
        pageNum: this.pageNum,
        pageSize: this.pageSize
        // type: this.tab_index
      }
      this.loading = true;
      this.$ajax({
        url: "/push/list",
        type: "POST",
        data: data,
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            this.article_list = res.data.list;
            this.pageTotal = res.data.count;
          } else {
            this.$message({type: 'error', message: res.msg, showClose: true});
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({  type: "error",  message: err.msg,  showClose: 'true',})
        }
      });
    },
    //删除
    removePush(id) {
      var self = this;
      var txt = self.tab_index == 0 ? '文章' : '视频';
      self.$confirm("确定删除该" + txt + "吗?", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$ajax({
          url: '/push/delete',
          type: 'GET',
          data: {
            id: id
          },
          success: function (res) {
            if (res.code == 0) {
              self.$message({
                type: 'success',
                message: '删除成功!',
                showClose: 'true'
              });
              if (self.tab_index == 0) {
                self.getPushList(1);
              } else {
                self.getPushList(3);
              }
            } else {
              self.$message({
                type: 'error',
                message: '删除失败!',
                showClose: 'true'
              });
            }
          },
          error: function (err) {
            self.$message({
              type: 'error',
              message: '请求失败!',
              showClose: 'true'
            });
          }
        })

      }).catch(() => {
        self.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style lang="scss">
</style>
