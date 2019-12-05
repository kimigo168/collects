<template>
  <div id="hot-paper">
    <div class="tab">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="全网热门快报" name="1">
          <div class="content">
            <div class="operate operate20">
              <div class="search">
                <el-form :inline="true" :model="paper_search_form">
                  <el-form-item label="时间">
                    <el-date-picker
                        v-model="paper_search_form.date"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="标题">
                    <el-input type="text" v-model="paper_search_form.title" placeholder="标题"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="paper_page_num=1;getPaperList()">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="paper_list" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="picture" label="图片" width="">
                  <template slot-scope="scope">
                    <img :src="scope.row.picture">
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="标题"></el-table-column>
                <el-table-column align="center" prop="source" label="摘要"></el-table-column>
                <el-table-column align="center" prop="createName" label="时间"></el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <!--<el-button type="text" @click="shelveOperate(scope.row,1)">发布</el-button>-->
                    <!--<el-button type="text" @click="paperOperate(scope.row)">修改</el-button>-->
                    <!--<el-button type="text" @click="removeAccount(scope.row.id)">删除</el-button>-->
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="paper_page_totle > 0">
              <el-pagination
                  @current-change="paperPageChange"
                  :current-page.sync="paper_page_num"
                  :page-size="paper_page_size"
                  layout="prev, pager, next, jumper"
                  :total="paper_page_totle">
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
        tab_index: '1',
        paper_search_form: {
          data: '',
          title: '',
        },
        paper_list: [],
        paper_page_totle: '',
        paper_page_num: '',
        paper_page_size: '',
      }
    },
    created() {
      this.getPaperList();
    },
    methods: {
      getPaperList() {
        var self = this;
        self.$ajax({
          url: '/newsflash/list',
          type: 'POST',
          data: {
            pageNum: self.paper_page_num,
            pageSize: self.paper_page_size,
            type: 1,
            status: 0,
            timeStart: !self.paper_search_form.date ? '' : self.paper_search_form.date[0],
            timeEnd: !self.paper_search_form.date ? '' : self.paper_search_form.date[1],
            title: self.paper_search_form.title,
          },
          success: function (res) {
            if (res.code == 0) {
              try {
                self.paper_list = res.data.list;
                self.paper_page_totle = res.data.size;
              } catch (e) {
                console.log(e);
              }
            } else {
              self.$message({
                type: 'error',
                message: '请求错误',
                showClose: 'true',
              })
            }
          },
          error: function (err) {
            self.$message({
              type: 'error',
              message: '请求失败',
              showClose: 'true',
            })
          }
        })
      },

      paperPageChange(val) {
        this.paper_page_num = val;
        this.getPaperList();
      }
      ,
    }
  }
</script>

<style lang="scss">

</style>