<template>
  <div id="dynamic">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index" @tab-click="handleClick">
        <el-tab-pane label="待审核" name="0"></el-tab-pane>
        <el-tab-pane label="已通过" name="1"></el-tab-pane>
        <el-tab-pane label="已屏蔽" name="2"></el-tab-pane>
        <el-tab-pane label="未通过" name="3"></el-tab-pane>
        <div class="content">
          <div class="operate">
            <div class="search" @keyup.enter="queryList">
              <el-form :inline="true" :model="search_form">
                <el-form-item label="时间：">
                  <el-date-picker v-model="search_form.time" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-input style="width:190px;" type="text" v-model="search_form.communityName" placeholder="请输入社群名称"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input style="width:190px;" type="text" v-model="search_form.content" placeholder="请输入动态内容"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="queryList">搜索</el-button>
                </el-form-item>  
                <el-form-item v-if="tab_index==2||tab_index==3" style="float:right;">
                  <el-button type="primary" @click="multiDelete">批量删除</el-button>
                </el-form-item>  
              </el-form> 
            </div>
          </div>
          <div class="table">
            <el-table :data="dynamic_list" style="width:100%;" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
              <el-table-column align="center" prop="name" label="社群名称"></el-table-column>
              <el-table-column align="center" prop="nickName" label="群主"></el-table-column>
              <el-table-column align="center" prop="content" label="动态内容"></el-table-column>
              <el-table-column align="center" prop="createTime" label="发布时间"></el-table-column>
              <el-table-column v-if="tab_index==2" align="center" prop="nickName" label="操作人"></el-table-column>
              <el-table-column align="center" prop="address" label="操作">
                <template slot-scope="scope">
                  <p v-if="tab_index==0">
                    <el-button type="text" @click="approveFun(scope.row, 0)">通过</el-button>
                    <el-button type="text" @click="approveFun(scope.row, 1)">不通过</el-button> 
                  </p>
                  <p v-if="tab_index==1">
                    <el-button type="text" @click="shieldFun(scope.row, 0)">屏蔽</el-button>
                  </p>
                  <p v-if="tab_index==2">
                    <el-button type="text" @click="shieldFun(scope.row, 1)">解除屏蔽</el-button>
                  </p>
                  <p v-if="tab_index==3">
                    <el-button type="text" class="danger-color" @click="delFun(scope.row)">删除</el-button>
                  </p>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="page" v-if="page_total>0">
            <el-pagination @current-change="pageNumChange" :current-page.sync="page_num" :page-size="page_size" layout="total, prev, pager, next" :total="page_total"></el-pagination>
          </div>
        </div>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dynamic',
  data () {
    return {
      loading: false,
      tab_index: 0,
      search_form: {
        time: '',
        communityName: '',
        content: ''
      },
      dynamic_list: [],
      page_num: 1,
      page_size: 10,
      page_total: 0,
      multipleSelection: [],

    }
  },
  methods: {
    queryList () {
      this.page_num = 1;
      this.getList();
    },
    getList () {
      this.loading = true;
      this.dynamic_list = [];
      this.$jqAjax({
        url: apiHost + '/dynamic/allList',
        type: 'POST',
        data: {
          pageNum: this.page_num,
          pageSize: this.page_size,
          status: this.tab_index == 0 ? 3 : this.tab_index == 1 ? 0 : this.tab_index == 2 ? 1 : 2,
          content: this.search_form.content,
          communityName: this.search_form.communityName,
          startTime: this.search_form.time && this.search_form.time[0] ? this.search_form.time[0] : '',
          endTime: this.search_form.time && this.search_form.time[1] ? this.search_form.time[1] : ''
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            this.dynamic_list = res.data.result;
            this.page_total = res.data.size;
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
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    pageNumChange (val) {
      this.page_num = val;
      this.getList();
    },
    handleClick () {
      this.search_form.time = '';
      this.search_form.communityName = '';
      this.search_form.content = '';
      this.queryList();
    },
    approveFun (row, type) {
      this.$confirm(`确定${type==0?'通过':'不通过'}审核？`,`${type==0?'通过':'不通过'}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/dynamic/changeStatus',
          type: 'POST',
          data: {
            id: row.id,
            status: type == 0? 0: 2
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({type: 'success', message: `操作成功`, showClose: true});
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
    shieldFun (row, type) {
      this.$confirm(`确定${type==0?'屏蔽':'解除屏蔽'}吗？`, `${type==0?'屏蔽':'解除屏蔽'}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/dynamic/changeStatus',
          type: 'POST',
          data: {
            id: row.id,
            status: type == 0? 1 : 0
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({type: 'success', message: `${type==0?'已屏蔽':'已解除屏蔽'}`, showClose: true});
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
    delFun (row) {
      this.$confirm('确定删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/dynamic/delBatch',
          type: 'POST',
          data: {
            ids: row.id
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({type: 'success', message: `已删除`, showClose: true});
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
    multiDelete () {
      if (this.multipleSelection.length == 0) {
        this.$message({type: 'warning', message: '请先选择要删除的项', showClose: true});
        return;
      }
      let ids = '';
      for (let item of this.multipleSelection) {
        ids += (item.id + ',');
      }
      ids = ids.substring(0, ids.length - 1);
      this.$confirm('确定批量删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/dynamic/delBatch',
          type: 'POST',
          data: {
            ids: ids
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({type: 'success', message: '已删除', showClose: true});
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
    }
  },
  created () {
    this.getList();
  }
}
</script>
