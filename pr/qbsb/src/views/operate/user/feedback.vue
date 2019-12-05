<template>
  <div id="feedback">
    <div class="tab" v-loading.lock="loading">
      <el-tabs>
        <el-tab-pane label="反馈列表">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="searchForm">
                  <el-form-item label="时间：">
                    <el-date-picker v-model="searchForm.time" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-input style="width:190px;" type="text" v-model="searchForm.title" placeholder="输入反馈内容/账号查找"></el-input>
                  </el-form-item>
                  <el-form-item @keyup.enter="queryList">
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                  <!-- <el-form-item style="float:right;">
                    <el-button type="primary" @click="batchDelFun">批量删除</el-button>
                  </el-form-item> -->
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="list" style="width:100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="content" label="反馈内容"></el-table-column>
                <el-table-column align="center" prop="userName" label="账号"></el-table-column>
                <el-table-column align="center" prop="companyName" label="所属公司"></el-table-column>
                <el-table-column align="center" prop="createTime" label="评论时间"></el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="pageTotal>0">
              <el-pagination @current-change="pageNumChange" :current-page.sync="pageNum" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="pageTotal"></el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  name: 'feedback',
  data () {
    return {
      loading: false,
      list: [],
      searchForm: {
        time: [],
        content: '',
        account: ''
      },
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0
    }
  },
  methods: {
    pageNumChange (val) {
      this.pageNum = val;
      this.getList();
    },
    queryList () {
      this.pageNum = 1;
      this.getList();
    },
    getList () {
      this.$jqAjax({
        url: apiHost + '/broke/list',
        type: 'POST',
        data: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          // status: '',
          brokeTitle: this.searchForm.title,
          startTime: this.searchForm.time && this.searchForm.time[0] ?this.searchForm.time[0] +' 00:00:00':'',
          endTime: this.searchForm.time && this.searchForm.time[1] ?this.searchForm.time[1] +' 23:59:59':'',
          daysBefore: 7
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            this.list = res.data.list;
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({type: 'error', message: err.msg, showClose: true});
        }
      })
    }
  },
  created () {
    this.getList();
  }
}
</script>
<style lang="scss" scoped>

</style>