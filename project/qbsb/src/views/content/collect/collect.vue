<template>
  <div id="collect">
    <div class="tab">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="采集库" name="0">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="article_search_form_1" >
                  <el-form-item label="时间：">
                    <el-date-picker v-model="article_search_form_1.time" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="状态：">
                    <el-select v-model="article_search_form_1.status">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="草稿" value="0"></el-option>
                      <el-option label="待审核" value="1"></el-option>
                      <el-option label="待编辑" value="2"></el-option>
                      <el-option label="待发布" value="3"></el-option>
                      <el-option label="已发布" value="4"></el-option>
                      <el-option label="已下架" value="5"></el-option>
                      <el-option label="已打回" value="6"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input style="width:190px;" type="text" v-model="article_search_form_1.keyword" placeholder="输入文章标题查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table
                :data="article_list"
                style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="imageUrl" label="封面" width="">
                  <template slot-scope="scope">
                    <defaultImage :url="!scope.row.cover ? '' :JSON.parse(scope.row.cover)[0].url"></defaultImage>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="标题"></el-table-column>
                <el-table-column align="center" prop="source" label="来源"></el-table-column>
                <el-table-column align="center" prop="channelName" label="分类"></el-table-column>
                <el-table-column align="center" prop="time" label="采集时间"></el-table-column>
                <el-table-column align="center" prop="address" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="sendAudit(scope.row.id)">送审</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="article_page_totle > 0">
              <el-pagination
                @current-change="pageNumChange"
                :current-page.sync="article_page_num"
                :page-size="article_page_size"
                layout="prev, pager, next, jumper"
                :total="article_page_totle">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tab_index: 0,
        article_list: [],
        article_page_num: 1,
        article_page_size: 10,
        article_page_totle: 0,
        article_search_form_1: {
          time: [],
          status: '',
          keyword: ''
        }
      }
    },
    created() {
      this.getArticleList();
    },
    methods: {
      //获取文章列表
      getArticleList() {
        this.$jqAjax({
          url: apiHost + "/context/thirdPart/list",
          type: "POST",
          data: {
            channelPid: 0,
            channelId: 0,
            pageNum: this.article_page_num,
            pageSize: this.article_page_size,
            startTime: this.article_search_form_1.time&&this.article_search_form_1.time[0] ?this.article_search_form_1.time[0]:'',
            endTime: this.article_search_form_1.time&&this.article_search_form_1.time[1] ?this.article_search_form_1.time[1]:''
          },
          success: (res) => {
            if (res.code == 0) {
              try {
                this.article_list = res.data.list;
                this.article_page_totle = res.data.total;
              } catch (e) {
                console.log(e);
              }
            }
          },
          error: (err) => {
            console.log(err);
          }
        })
      },
      pageNumChange(val) {
        this.article_page_num = val;
        this.getArticleList();
      },

      sendAudit(id) { // 送审
        var self = this;
        self.$confirm('确定送审？', '送审提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$jqAjax({
            url: apiHost + "/context/thirdPart/updateStatus",
            type: "POST",
            data: {
              id: id,
              status: "7",//目前业务上直接送审到已发布列表
            },
            success: function (res) {
              if (res.code == 0) {
                self.$message({
                  type: "success",
                  message: "送审成功!",
                  showClose: "true"
                })
                self.getArticleList();
              }
            },
            error: function (err) {
              console.log(err);
            }
          })
        }).catch(() => {
          // console.log('点击了取消');
        });
      },
      queryList () {
        this.article_page_num = 1;
        this.getArticleList();
      }
    }
  }
</script>

<style lang="scss">
  #collect {
    .table {
      margin-top: 30px
    }
  }
</style>
