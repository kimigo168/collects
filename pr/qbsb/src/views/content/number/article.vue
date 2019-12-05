<template>
  <div id="number-article">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index" @tab-click="handleClick">
        <el-tab-pane label="已发布" name="2">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="article_search_form_2">

                  <el-form-item>
                    <el-input type="text" v-model="article_search_form_2.name" placeholder="输入平台号查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="article_page_num_2=1;getArticleList(1)">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="article_list_2">
                <el-table-column align="center" type="index" label="序号" width="105"></el-table-column>
                <el-table-column align="center" prop="" label="封面">
                  <template slot-scope="scope">
                    <defaultImage :url="scope.row.imageUrl"></defaultImage>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="标题" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="createName" label="作者"></el-table-column>
                <el-table-column align="center" prop="platformName" label="所属平台号"></el-table-column>
                <el-table-column align="center" prop="source" label="来源"></el-table-column>
                <el-table-column align="center" prop="publishName" label="发布者"></el-table-column>
                <!-- <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column> -->
                <el-table-column align="center" prop="publishTime" label="发布时间"></el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="removeArticle(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="article_page_total_2 > 0">
              <el-pagination @current-change="listPageChange" :current-page.sync="article_page_num_2" :page-size="article_page_size_2" layout="prev, pager, next, jumper" :total="article_page_total_2">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="草稿箱" name="1">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="article_search_form_1">
                  <el-form-item>
                    <el-input type="text" v-model="article_search_form_1.name" placeholder="输入平台号查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="article_page_num_1=1;getArticleList(0)">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="article_list_1">
                <el-table-column align="center" type="index" label="序号" width="105"></el-table-column>
                <el-table-column align="center" prop="subChannel" label="封面">
                  <template slot-scope="scope">
                    <defaultImage :url="scope.row.imageUrl"></defaultImage>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="标题"></el-table-column>
                <el-table-column align="center" prop="sign" label="作者"></el-table-column>
                <el-table-column align="center" prop="platformName" label="所属平台号"></el-table-column>
                <el-table-column align="center" prop="source" label="来源"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="" label="操作" width="150">
                  <template slot-scope="scope">
                    <el-button type="text" @click="$router.push({path:'/layout/number-create',query: {queryId: scope.row.id}})">修改</el-button>
                    <el-button type="text" @click="removeArticle(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="article_page_total_1 > 0">
              <el-pagination @current-change="listPageChange" :current-page.sync="article_page_num_1" :page-size="article_page_size_1" layout="prev, pager, next, jumper" :total="article_page_total_1">
              </el-pagination>
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
      tab_index: '2',
      loading: true,
      //草稿
      article_search_form_1: {
        name: '',
      },
      article_list_1: [],
      article_page_total_1: 0,
      article_page_num_1: 1,
      article_page_size_1: 10,

      //已发布
      article_search_form_2: {
        name: '',
      },
      article_list_2: [],
      article_page_total_2: 0,
      article_page_num_2: 1,
      article_page_size_2: 10,
    }
  },
  created() {
    // this.getArticleList(0);
    this.getArticleList(1);
  },
  methods: {
    //获取文章列表数据
    getArticleList(status) {
      let self = this;
      let data;
      if (status == 0) {
        data = {
          pageNum: self.article_page_num_1,
          pageSize: self.article_page_size_1,
          platformName: self.article_search_form_1.name
        }
      } else {
        data = {
          pageNum: self.article_page_num_2,
          pageSize: self.article_page_size_2,
          platformName: self.article_search_form_2.name
        }
      }
      data.status = status;
      self.loading = true;
      self.$ajax({
        url: "/platform/articleList",
        type: "POST",
        data: data,
        success: function (data) {
          self.loading = false;
          if (data.code == 0) {
            try {
              if (status == 0) {
                self.article_list_1 = data.data.list;
                self.article_page_total_1 = data.data.total;
              } else {
                self.article_list_2 = data.data.list;
                self.article_page_total_2 = data.data.total;
              }
            } catch (e) {
              console.log(e);
            }
          }
        },
        error: function (error) {
          self.loading = true;
        }
      })
    },
    listPageChange(val) {
      if (this.tab_index == 1) {
        this.article_page_num_1 = val;
        this.getArticleList(0);
      } else {
        this.article_page_num_2 = val;
        this.getArticleList(1);
      }
    },
    //删除
    removeArticle(id) {
      let self = this;
      self.$confirm("确认删除该文章吗?", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$ajax({
          url: "/platform/deleteArticle",
          type: "GET",
          data: {
            id: id,
          },
          success: function (data) {
            if (data.code == 0) {
              self.handleClick();
              self.$message({
                type: 'success',
                message: '操作成功!',
                showClose: 'true'
              });
            } else {
              self.$message({
                type: 'error',
                message: '操作失败!',
                showClose: 'true'
              });
            }
          },
          error: function (error) {
            self.$message({
              type: 'error',
              message: '操作失败!',
              showClose: 'true'
            });
          }
        })
      });
    },
    handleClick (tab, event) {
      if (this.tab_index == 1) {
        this.article_page_num_1 = 1;
        this.getArticleList(0);
      } else {
        this.article_page_num_2 = 1;
        this.getArticleList(1);
      }
    }
  }
}
</script>

<style>
#number-article .el-table tr.el-table__row {
  height: 70px;
}
</style>