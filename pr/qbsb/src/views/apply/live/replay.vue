<template>
  <div id="collecting" v-loading.lock="loading">
    <div class="tab">
      <el-tabs v-model="tab_index" @tab-click="handleClick">
        <el-tab-pane label="待审核" name="0">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="article_search_form_1">
                  <el-form-item label="开播时间：">
                    <el-date-picker v-model="article_search_form_1.broadcastTime" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-input style="width:190px;" type="text" v-model="article_search_form_1.keyword" placeholder="输入直播间名称/申请人查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table
                :data="article_list_1"
                style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="imageUrl" label="直播封面" width="">
                  <template slot-scope="scope">
                    <img :src="scope.row.imgUrl">
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="name" label="直播间名称"></el-table-column>
                <el-table-column align="center" prop="description" label="直播简介"></el-table-column>
                <el-table-column align="center" prop="hostName" label="申请人"></el-table-column>
                <el-table-column align="center" prop="startTime" label="开播时间"></el-table-column>
                <el-table-column align="center" prop="duration" label="直播时长"></el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="approveFun(scope.row)">通过</el-button>
                    <el-button type="text" @click="refuseFun(scope.row)">打回</el-button>
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

        </el-tab-pane>
        <el-tab-pane label="已审核" name="1">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="article_search_form_2">
                  <el-form-item label="审核时间：">
                    <el-date-picker v-model="article_search_form_2.auditTime" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="开播时间：">
                    <el-date-picker v-model="article_search_form_2.broadcastTime" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="状态：">
                    <el-select v-model="article_search_form_2.status">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="已上架" value="0"></el-option>
                      <el-option label="已下架" value="1"></el-option>
                      <el-option label="已打回" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input style="width:190px;" type="text" v-model="article_search_form_2.keyword" placeholder="输入直播间名称/申请人查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table
                :data="article_list_2"
                style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="imageUrl" label="直播封面" width="">
                  <template slot-scope="scope">
                    <img :src="scope.row.imgUrl">
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="name" label="直播间名称"></el-table-column>
                <el-table-column align="center" prop="description" label="直播简介" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="hostName" label="申请人"></el-table-column>
                <el-table-column align="center" prop="startTime" label="开播时间"></el-table-column>
                <el-table-column align="center" prop="auditName" label="审核人"></el-table-column>
                <el-table-column align="center" prop="updateTime" label="审核时间"></el-table-column>
                <el-table-column align="center" prop="status" label="状态">
                  <template slot-scope="scope">
                    {{scope.row.status == 1 ? '已上架':scope.row.status == 2? '已打回': scope.row.status == 3 ? '已下架':''}}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.status == 1" type="text" @click="downFun(scope.row)">下架</el-button>
                    <el-button v-if="scope.row.status == 3" type="text" @click="recoverFun(scope.row)">恢复上架</el-button>
                    <el-button v-if="scope.row.status == 2" type="text" @click="viewReason(scope.row)">打回原因</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="article_page_totle_2 > 0">
              <el-pagination
                @current-change="articlePageNumChange2"
                :current-page.sync="article_page_num_2"
                :page-size="article_page_size_2"
                layout="total, prev, pager, next, jumper"
                :total="article_page_totle_2">
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
        loading: false,
        tab_index: 0, // 0:待核，1：已核
        sub_tab_index_1: 0,
        article_search_form_1: {
          time: "",
          channel: "",
          column: "",
          title: "",
          author: "",
          broadcastTime: "",
          keyword: ""
        },
        article_list_1: [
        ],
        article_page_num_1: 1,
        article_page_size_1: 10,
        article_page_totle_1: 10,
        article_search_form_2: {
          time: "",
          channel: "",
          column: "",
          status: "",
          title: "",
          author: "",
          keyword: "",
          auditTime: '',
          broadcastTime: ''
        },
        article_list_2: [
        ],
        article_page_num_2: 1,
        article_page_size_2: 10,
        article_page_totle_2: 10,
      }
    },
    methods: {
      articlePageNumChange1(val) {
        this.article_page_num_1 = val;
        this.getPendingList();
      },
      articlePageNumChange2(val) {
        this.article_page_num_2 = val;
        this.getApprovedList();
      },
      getApprovedList () { // 已审核
        this.article_list_2 = [];
        this.article_page_totle_2 = 0;
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/live/playback/approvedList',
          type: 'POST',
          data: {
            auditStartTime: this.article_search_form_2.auditTime&&this.article_search_form_2.auditTime[0]?this.article_search_form_2.auditTime[0]:'',
            auditEndTime: this.article_search_form_2.auditTime&&this.article_search_form_2.auditTime[1]?this.article_search_form_2.auditTime[1]:'',
            liveStartTime: this.article_search_form_2.broadcastTime&&this.article_search_form_2.broadcastTime[0]?this.article_search_form_2.broadcastTime[0]:'',
            liveEndTime: this.article_search_form_2.broadcastTime&&this.article_search_form_2.broadcastTime[1]?this.article_search_form_2.broadcastTime[1]:'',
            keyword: this.article_search_form_2.keyword,
            status: this.article_search_form_2.status,
            pageNum: this.article_page_num_2,
            pageSize: this.article_page_size_2
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.article_list_2 = res.data.pageResult;
              this.article_page_totle_2 = res.data.totalCount;
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({type: 'error', message: `请求失败`, showClose: true});
          }
        })
      },
      getPendingList () { // 待审核
        this.article_list_1 = [];
        this.article_page_totle_1 = 0;
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/live/playback/pendingList',
          type: 'POST',
          data: {
            liveStartTime: this.article_search_form_1.broadcastTime&&this.article_search_form_1.broadcastTime[0]?this.article_search_form_1.broadcastTime[0]:'',
            liveEndTime: this.article_search_form_1.broadcastTime&&this.article_search_form_1.broadcastTime[1]?this.article_search_form_1.broadcastTime[1]:'',
            keyword: this.article_search_form_1.keyword,
            pageNum: this.article_page_num_1,
            pageSize: this.article_page_size_1
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.article_list_1 = res.data.pageResult;
              this.article_page_totle_1 = res.data.totalCount;
            }
          },
          error: (error) => {
            this.loading = false;
            this.$message({type: 'error', message: `请求失败`, showClose: true});
          }
        })
      },
      queryList () {
        if (this.tab_index == 1) { // 已审核
          this.article_page_num_2 = 1;
          this.getApprovedList();
        } else { // 待审核
          this.article_page_num_1 = 1;
          this.getPendingList();
        }
      },
      handleClick () {
        if (this.tab_index == 1) { // 已审核
          this.article_page_num_2 = 1;
          this.getApprovedList();
        } else { // 待审核
          this.article_page_num_1 = 1;
          this.getPendingList();
        }
      },
      approveFun (row) {
        this.$confirm('确定通过审核吗？', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$jqAjax({
            url: apiHost + '/live/playback/publish',
            type: 'POST',
            data: {
              id: row.id,
              showId: row.showId
            },
            success: (res) => {
              this.loading = false;
              if (res.code == 0) {
                this.$message({type: 'success', message: '审核成功', showClose: true});
                this.article_page_num_1 = 1;
                this.getPendingList();
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
      refuseFun (row) {
        this.$prompt('确定打回吗？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '打回原因（必填）',
          inputErrorMessage: '请输入打回原因',
          closeOnClickModal: false,
          // inputPattern: /(^s*)|(s*$)/g,
          inputValidator: (e) => {
            if (e) {
              return true;
            } else {
              return false;
            }
          }
        }).then(({ value }) => {
          if (value) {
            this.loading = true;
            this.$jqAjax({
              url: apiHost + '/live/playback/reject',
              type: 'POST',
              data: {
                id: row.id,
                auditDesc: value
              },
              success: (res) => {
                this.loading = false;
                if (res.code == 0) {
                  this.$message({type: 'success', message: '打回成功', showClose: true});
                  this.article_page_num_1 = 1;
                  this.getPendingList();
                } else {
                  this.$message({type: 'error', message: '操作失败', showClose: true});
                }
              },
              error: (err) => {
                this.loading = false;
                this.$message({type: 'error', message: '操作失败', showClose: true});
              }
            });
          }
        });
      },
      viewReason (row) {
        const h = this.$createElement;
        this.$msgbox({
          title: `打回原因`,
          message: h('div', {}, `${row.auditDesc}`),
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: '关闭',
          closeOnClickModal: false,
          beforeClose: (action, instance, done) => {
            done();
          }
        });
      },
      downFun (row) {
        this.$confirm('确定下架吗？', '下架', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$jqAjax({
            url: apiHost + '/live/playback/down',
            type: 'POST',
            data: {
              id: row.id
            },
            success: (res) => {
              this.loading = false;
              if (res.code == 0) {
                this.$message({type: 'success', message: '已下架', showClose: true});
                this.queryList();
              } else{
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
      recoverFun (row) {
        this.$confirm('确定恢复上架吗？', '上架', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$jqAjax({
            url: apiHost + '/live/playback/backtoup',
            type: 'POST',
            data: {
              id: row.id
            },
            success: (res) => {
              this.loading = false;
              if (res.code == 0) {
                this.$message({type: 'success', message: '已恢复', showClose: true});
                this.queryList();
              } else{
                this.$message({type: 'error', message: res.msg, showClose: true});
              }
            },
            error: (err) => {
              this.loading = false;
              this.$message({type: 'error', message: err.msg, showClose: true});
            }
          });
        });
      }
    },
    created () {
      this.getPendingList();
    }
  }
</script>

<style lang="scss">

</style>
