<template>
  <div id="article-count">
    <div class="tab">
      <el-tabs>
        <el-tab-pane label="文章统计">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true">
                  <el-form-item label="日期选择：">
                    <el-date-picker v-model="articleForm.timePickArr" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="岗位：">
                    <el-select v-model="articleForm.role">
                      <el-option label="全部" value=""></el-option>
                      <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="姓名：">
                    <el-input type="text" v-model="articleForm.name" placeholder="输入姓名查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                </el-form>
                <div class="date-select">
                  <el-radio-group v-model="timeActiveIdx" @change="selectQueryTime">
                    <el-radio-button label="0">昨日</el-radio-button>
                    <el-radio-button label="1">最近七天</el-radio-button>
                    <el-radio-button label="2">最近30天</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
            </div>
            <div class="table">
              <el-table :data="articleList" style="width:100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="rank" label="排名"></el-table-column>
                <el-table-column align="center" prop="name" label="姓名"></el-table-column>
                <el-table-column align="center" prop="viewNum" label="文章点击数"></el-table-column>
                <el-table-column align="center" prop="detail" label="详情"></el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="pageTotal>0">
              <el-pagination @current-change="pageNumChange" :current-page.sync="pageNum" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="pageTotal">
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
  name: 'articleCount',
  data () {
    return {
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
      articleList: [],
      roleList: [],
      articleForm: {
        time: [],
        role: '',
        name: ''
      },
      timePickArr: [],
      timeActiveIdx: '0',
      users_page_size: 1
    }
  },
  methods: {
    selectQueryTime () {
      this.timePickArr = [];
      if (this.timeActiveIdx == 0) { // 最近7天
        this.users_page_size = 1;
      } else if (this.timeActiveIdx == 1) { // 最近15天
        this.users_page_size = 7;
      } else { // 最近30天
        this.users_page_size = 30;
      }
      this.timePickArr.push(new Date(new Date().getTime() - 1000*60*60*24 * this.users_page_size).format('YYYY-MM-DD'))
      this.timePickArr.push(new Date().format('YYYY-MM-DD'));
    },
    pageNumChange (val) {
      this.pageNum = val;
      this.getList();
    },
    queryList () {
      this.pageNum = 1;
      this.getList()
    },
    getList () {

    }
  },
  created () {
    this.users_page_size = 1;
    this.timePickArr.push(new Date(new Date().getTime() - 1000*60*60*24 * this.users_page_size).format('YYYY-MM-DD'));
    this.timePickArr.push(new Date().format('YYYY-MM-DD'));
  }
}
</script>
<style lang="scss" scoped>
</style>