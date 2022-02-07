<template>
  <div id="comment-audit">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index" @tab-click="handleClick">
        <el-tab-pane label="待审核" name="0">
          <div class="content">
            <div class="operate operate20">
              <div class="search">
                <el-form :inline="true" :model="comment_search_form_1">
                  <el-form-item label="时间">
                    <el-date-picker
                        v-model="comment_search_form_1.date"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="类型：">
                    <el-select v-model="comment_search_form_1.type">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="文章" value="1"></el-option>
                      <!-- <el-option label="视频" value="2"></el-option>
                      <el-option label="平台号" value="3"></el-option> -->
                    </el-select>
                  </el-form-item>
                  <el-form-item label="内容">
                    <el-input type="text" placeholder="输入内容查找" v-model="comment_search_form_1.content"></el-input>
                  </el-form-item>
                  <el-form-item label="标题">
                    <el-input type="text"  placeholder="输入标题查找" v-model="comment_search_form_1.title"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="comment_page_num_1 = 1;getCommentList('0')">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="btn">
                <el-button type="primary" @click="passAndSheild(undefined,1)">批量通过</el-button>
                <el-button type="primary" @click="passAndSheild(undefined,2)">批量屏蔽</el-button>
              </div>
            </div>
            <div class="table">
              <el-table :data="comment_list_1" @selection-change="selectionChange" style="width: 100%">
                <el-table-column type="selection"></el-table-column>
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="content" label="评论内容" width="200" show-overflow-tooltip ></el-table-column>
                <el-table-column align="center" prop="commentUserNickName" label="评论人昵称"></el-table-column>
                <el-table-column align="center" prop="phone" label="内容类型">
                  <template slot-scope="scope">
                    {{contentTypeObj[scope.row.contentType]}}
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="所属内容标题"></el-table-column>
                <el-table-column align="center" prop="createTime" label="评论时间"></el-table-column>
                <el-table-column align="center" prop="auditorName" label="审核人" v-if="tab_index != '0'"></el-table-column>
                <el-table-column align="center" prop="address" label="操作" width="170">
                  <template slot-scope="scope">
                    <el-button type="text" @click="passAndSheild(scope.row.id,1)">通过</el-button>
                    <el-button type="text" @click="passAndSheild(scope.row.id,2)">屏蔽</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="comment_page_totle_1 > 0">
              <el-pagination
                  @current-change="commentPageNumChange1"
                  :current-page.sync="comment_page_num_1"
                  :page-size="comment_page_size_1"
                  layout="prev, pager, next, jumper"
                  :total="comment_page_totle_1">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已发布" name="1">
          <div class="content">
            <div class="operate operate20">
              <div class="search">
                <el-form :inline="true" :model="comment_search_form_2">
                  <el-form-item label="时间">
                    <el-date-picker
                        v-model="comment_search_form_2.date"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="类型：">
                    <el-select v-model="comment_search_form_2.type">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="文章" value="1"></el-option>
                      <el-option label="视频" value="2"></el-option>
                      <el-option label="平台号" value="3"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="内容">
                    <el-input type="text" placeholder="输入内容查找" v-model="comment_search_form_2.content"></el-input>
                  </el-form-item>
                  <el-form-item label="标题">
                    <el-input type="text"  placeholder="输入标题查找"   v-model="comment_search_form_2.title"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="comment_page_num_2 = 1;getCommentList('1')">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="btn">
                <el-button type="primary" @click="passAndSheild(undefined,2)">批量屏蔽</el-button>
              </div>
            </div>
            <div class="table">
              <el-table :data="comment_list_2" @selection-change="selectionChange" style="width: 100%">
                <el-table-column type="selection"></el-table-column>
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="content" label="评论内容" width="200" show-overflow-tooltip ></el-table-column>
                <el-table-column align="center" prop="commentUserNickName" label="评论人昵称"></el-table-column>
                <el-table-column align="center" prop="phone" label="内容类型">
                  <template slot-scope="scope">
                    {{contentTypeObj[scope.row.contentType]}}
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="所属内容标题"></el-table-column>
                <el-table-column align="center" prop="createTime" label="评论时间"></el-table-column>
                <el-table-column align="center" prop="auditorName" label="审核人" v-if="tab_index != '0'"></el-table-column>
                <el-table-column align="center" prop="address" label="操作" width="170">
                  <template slot-scope="scope">
                    <el-button type="text" @click="passAndSheild(scope.row.id,2)">屏蔽</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="comment_page_totle_2 > 0">
              <el-pagination
                  @current-change="commentPageNumChange2"
                  :current-page.sync="comment_page_num_2"
                  :page-size="comment_page_size_2"
                  layout="prev, pager, next, jumper"
                  :total="comment_page_totle_2">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已屏蔽" name="2">
          <div class="content">
            <div class="operate operate20">
              <div class="search">
                <el-form :inline="true" :model="comment_search_form_3">
                  <el-form-item label="时间">
                    <el-date-picker
                        v-model="comment_search_form_3.date"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="类型：">
                    <el-select v-model="comment_search_form_3.type">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="文章" value="1"></el-option>
                      <el-option label="视频" value="2"></el-option>
                      <el-option label="平台号" value="3"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="内容">
                    <el-input type="text" placeholder="输入内容查找" v-model="comment_search_form_3.content"></el-input>
                  </el-form-item>
                  <el-form-item label="标题">
                    <el-input type="text" placeholder="输入标题查找" v-model="comment_search_form_3.title"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="comment_page_num_3 = 1;getCommentList('2')">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="btn">
                <el-button type="primary" @click="deleteAndCancelSheild(undefined,1)">批量删除</el-button>
                <el-button type="primary" @click="deleteAndCancelSheild(undefined,2)">批量取消屏蔽</el-button>
              </div>
            </div>
            <div class="table">
              <el-table :data="comment_list_3" @selection-change="selectionChange" style="width: 100%">
                <el-table-column type="selection"></el-table-column>
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="content" label="评论内容" width="200" show-overflow-tooltip ></el-table-column>
                <el-table-column align="center" prop="commentUserNickName" label="评论人昵称"></el-table-column>
                <el-table-column align="center" prop="phone" label="内容类型">
                  <template slot-scope="scope">
                    {{contentTypeObj[scope.row.contentType]}}
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="所属内容标题"></el-table-column>
                <el-table-column align="center" prop="createTime" label="评论时间"></el-table-column>
                <el-table-column align="center" prop="auditorName" label="审核人" v-if="tab_index != '0'"></el-table-column>
                <el-table-column align="center" prop="address" label="操作" width="170">
                  <template slot-scope="scope">
                    <el-button type="text" @click="deleteAndCancelSheild(scope.row.id,1)">删除</el-button>
                    <el-button type="text" @click="deleteAndCancelSheild(scope.row.id,2)">取消屏蔽</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="comment_page_totle_3 > 0">
              <el-pagination
                  @current-change="commentPageNumChange3"
                  :current-page.sync="comment_page_num_3"
                  :page-size="comment_page_size_3"
                  layout="prev, pager, next, jumper"
                  :total="comment_page_totle_3">
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
        tab_index: '0',
        select_row_ids: [], //表格选中行
        //待审核
        comment_search_form_1: {
          date: "",
          type: "",
          content: "",
          title: "",
        },
        comment_list_1: [],
        comment_page_num_1: 1,
        comment_page_size_1: 10,
        comment_page_totle_1: 0,
        //已发布
        comment_search_form_2: {
          date: "",
          type: "",
          content: "",
          title: "",
        },
        comment_list_2: [],
        comment_page_num_2: 1,
        comment_page_size_2: 10,
        comment_page_totle_2: 0,
        //已发布
        comment_search_form_3: {
          date: "",
          type: "",
          content: "",
          title: "",
        },
        comment_list_3: [],
        comment_page_num_3: 1,
        comment_page_size_3: 10,
        comment_page_totle_3: 0,
        // contentTypeObj: {
        //   '1': '文本', //1,5,4,6文章
        //   '2': '图片',
        //   '3': '视频',
        //   '4': '音频',
        //   '5': '图片新闻',
        //   '6': '外链文章',
        //   '7': '平台号'
        // },
        contentTypeObj: {
          '1': '文章', //1,5,4,6文章
          // '2': '图片',
          '3': '视频',
          '4': '文章',
          '5': '文章',
          '6': '文章',
          '7': '平台号'
        },
        loading: false
      }
    },
    created() {
      this.getCommentList('0');
    },
    methods: {
      //获取评论列表数据
      getCommentList(status) {
        var self = this;
        var pageNum, pageSize, timeStart, timeEnd, contentType, content, title;
        if (status == 0) {
          self.comment_list_1 = [];
          pageNum = self.comment_page_num_1;
          pageSize = self.comment_page_size_1;
          timeStart = self.comment_search_form_1.date&& self.comment_search_form_1.date[0] ? (self.comment_search_form_1.date[0]+' 00:00:00'):'';
          timeEnd = self.comment_search_form_1.date&& self.comment_search_form_1.date[1] ? (self.comment_search_form_1.date[1]+' 23:59:59'):'';
          contentType = self.comment_search_form_1.type;
          content = self.comment_search_form_1.content;
          title = self.comment_search_form_1.title;
        } else if (status == 1) {
          self.comment_list_2 = [];
          pageNum = self.comment_page_num_2;
          pageSize = self.comment_page_size_2;
          timeStart = self.comment_search_form_2.date&&self.comment_search_form_2.date[0] ? (self.comment_search_form_2.date[0]+' 00:00:00'):'';
          timeEnd = self.comment_search_form_2.date&&self.comment_search_form_2.date[1] ?(self.comment_search_form_2.date[1]+' 23:59:59'):'';
          contentType = self.comment_search_form_2.type;
          content = self.comment_search_form_2.content;
          title = self.comment_search_form_2.title;
        } else {
          self.comment_list_3 = [];
          pageNum = self.comment_page_num_3;
          pageSize = self.comment_page_size_3;
          timeStart = self.comment_search_form_3.date&&self.comment_search_form_3.date[1] ? (self.comment_search_form_3.date[0]+' 00:00:00') : '';
          timeEnd = self.comment_search_form_3.date&&self.comment_search_form_3.date[1] ? (self.comment_search_form_3.date[1]+' 23:59:59') :'';
          contentType = self.comment_search_form_3.type;
          content = self.comment_search_form_3.content;
          title = self.comment_search_form_3.title;
        }
        self.loading = true;
        self.$ajax({
          url: "/comment/list",
          type: "POST",
          data: {
            status: status,
            timeStart: timeStart,
            timeEnd: timeEnd,
            contentType: contentType,
            content: content,
            title: title,
            pageNum: pageNum,
            pageSize: pageSize,
          },
          success: function (data) {
            self.loading = false;
            if (status == 0) {
              if (data && data.code == 0) {
                if (data.data && data.data.list) {
                  self.comment_list_1 = data.data.list;
                }
                if (data.data && data.data.total || data.data && data.data.total == 0) {
                  self.comment_page_totle_1 = data.data.total;
                }
              }
            } else if (status == 1) {
              if (data && data.code == 0) {
                if (data.data && data.data.list) {
                  self.comment_list_2 = data.data.list;
                }
                if (data.data && data.data.total || data.data && data.data.total == 0) {
                  self.comment_page_totle_2 = data.data.total;
                }
              }
            } else {
              if (data && data.code == 0) {
                if (data.data && data.data.list) {
                  self.comment_list_3 = data.data.list;
                }
                if (data.data && data.data.total || data.data && data.data.total == 0) {
                  self.comment_page_totle_3 = data.data.total;
                }
              }
            }
          },
          error(error) {
            self.loading = false;
            self.$message({
              type: "error",
              message: "请求失败",
              showClose: 'true',
            })
          }
        });
      },
      commentPageNumChange1(val) {
        this.comment_page_num_1 = val;
        this.getCommentList('0')
      },
      commentPageNumChange2(val) {
        this.comment_page_num_2 = val;
        this.getCommentList('1')
      },
      commentPageNumChange3(val) {
        this.comment_page_num_3 = val;
        this.getCommentList('2')
      },
      selectionChange(val) {
        this.select_row_ids = val.map(item => {
          return item.id
        })
      },

      //通过,屏蔽
      passAndSheild(id, index) {
        var self = this;
        self.$confirm('确认执行此操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var ids = [];
          if (id) {
            ids.push(id);
          } else {
            ids = self.select_row_ids;
          }
          if (ids.length == 0) {
            self.$message({
              type: 'warning',
              message: '请至少选中一条评论',
              showClose: 'true',
            })
            return;
          }
          var url = index == 1 ? "/comment/passBatch" : "/comment/shieldBatch"
          self.$ajax({
            url: url,
            type: "GET",
            data: {
              ids: ids.join(","),
              status: this.tab_index // 0, 1
            },
            success: function (data) {
              if (data && data.code == 0) {
                self.$message({
                  type: "success",
                  message: "操作成功",
                  showClose: 'true',
                })
                self.getCommentList('0');
                self.getCommentList('1');
                self.getCommentList('2');
              }
            },
            error(error) {
              self.$message({
                type: "error",
                message: "请求失败",
                showClose: 'true',
              })
            }
          });
        });
      },

      //删除，取消屏蔽
      deleteAndCancelSheild(id, index) {
        var self = this;
        self.$confirm('确认执行此操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var ids = [];
          if (id) {
            ids.push(id);
          } else {
            ids = self.select_row_ids;
          }
          if (ids.length == 0) {
            self.$message({
              type: 'warning',
              message: '请至少选中一条评论',
              showClose: 'true',
            })
            return;
          }
          var url = index == 1 ? "/comment/deleteBatch" : "/comment/cancelShieldBatch"
          self.$ajax({
            url: url,
            type: "GET",
            data: {
              ids: ids.join(",")
            },
            success: function (data) {
              if (data && data.code == 0) {
                self.$message({
                  type: "success",
                  message: "操作成功",
                  showClose: 'true',
                })
                self.getCommentList('0');
                self.getCommentList('1');
                self.getCommentList('2');
              }
            },
            error(error) {
              self.$message({
                type: "error",
                message: "请求失败",
                showClose: 'true',
              })
            }
          });
        });
      },
      handleClick () {
        this.select_row_ids = [];
        if (this.tab_index == '0') {
          this.comment_page_num_1 = 1;
          this.comment_search_form_1.content = '';
          this.comment_search_form_1.title = '';
          this.getCommentList('0');
        } else if (this.tab_index == '1') {
          this.comment_page_num_2 = 1;
          this.comment_search_form_2.content = '';
          this.comment_search_form_2.title = '';
          this.getCommentList('1');
        } else {
          this.comment_page_num_3 = 1;
          this.comment_search_form_3.content = '';
          this.comment_search_form_3.title = '';
          this.getCommentList('2');
        }
      }

    }
  }
</script>

<style lang="scss">
  #layout #comment-audit {
    .input-with-select {
      width: 300px;

      .el-select .el-icon-arrow-up:before {
        display: inline-block;
        transform: translateY(-3px);
      }

      .el-input-group__prepend {
        background-color: #fff;
      }
    }
  }

</style>
