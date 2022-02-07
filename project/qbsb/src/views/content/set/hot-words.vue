<template>
  <div id="hot-words">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index" @tab-click="handleClick">
        <el-tab-pane label="热词库" name="0"></el-tab-pane>
        <el-tab-pane label="当前热词" name="1"></el-tab-pane>
        <el-tab-pane label="历史热词" name="2"></el-tab-pane>
      </el-tabs>
      <div class="content">
        <div class="operate" v-if="tab_index==0">
          <div class="search" @keyup.enter="queryList">
            <el-form :inline="true" :model="article_search_form_1" >
              <el-form-item>
                <el-button type="primary" @click="addWord">新增</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="removeWords">批量删除</el-button>
              </el-form-item>
              <el-form-item label="时间：">
                <el-date-picker v-model="article_search_form_1.time" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-input type="text" v-model="article_search_form_1.keyword" placeholder="请输入关键字"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="queryList">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="table">
          <el-table ref="multipleTable" :data="article_list_1" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
            <el-table-column align="center" prop="hotWord" label="热词名称"></el-table-column>
            <el-table-column align="center" prop="source" label="来源"></el-table-column>
            <el-table-column v-if="tab_index==0" align="center" prop="createTime" label="创建时间"></el-table-column>
            <el-table-column v-if="tab_index==1||tab_index==2" align="center" prop="createTime" label="采集时间"></el-table-column>
            <el-table-column v-if="tab_index==1||tab_index==2" align="center" prop="showTime" label="展示时间"></el-table-column>
            <el-table-column align="center" label="操作" v-if="tab_index!=2">
              <template slot-scope="scope">
                <el-button v-if="tab_index==0&&scope.row.isShow==0" type="text" @click="showFun(scope.row)">展示</el-button>
                <el-button v-if="tab_index==0&&scope.row.isShow!=1" type="text" @click="editFun(scope.row)">编辑</el-button>
                <el-button v-if="tab_index==1&&scope.row.isShow==1" type="text" @click="noShowFun(scope.row)">下架</el-button>
                <el-button v-if="tab_index==1" type="text" @click="lockFun(scope.row)">{{scope.row.isLock==1?'解锁':'锁定'}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page" v-if="article_page_totle_1 > 0 && tab_index!= '1'">
          <el-pagination @current-change="articlePageNumChange1" :current-page.sync="article_page_num_1" :page-size="article_page_size_1" layout="total, prev, pager, next, jumper" :total="article_page_totle_1"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'hotWords',
  data () {
    return {
      loading: false,
      tab_index: 0,
      article_page_totle_1: 0,
      article_page_num_1: 1,
      article_page_size_1: 15,
      article_search_form_1: {
        time: [],
        account: '',
        status: '1',
        keyword: ''
      },
      article_list_1: [],
      multipleSelection: []
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    articlePageNumChange1 (val) {
      this.article_page_num_1 = val;
      this.getList();
    },
    handleClick (tab, event) {
      this.article_page_num_1 = 1;
      this.article_search_form_1.keyword = ''
      this.queryList();
    },
    queryList () {
      this.article_page_num_1 = 1;
      this.article_page_totle_1 = 0;
      this.getList();
    },
    getList () {
      this.loading = true;
      this.article_list_1 = [];
      this.multipleSelection = [];
      this.$ajax({
        url: this.tab_index == '2' ? '/hotWord/queryHistory' : '/hotWord/query',
        type: 'POST',
        data: {
          hotWord: this.article_search_form_1.keyword, // 搜索关键字
          isShow: this.tab_index == 0 ? '0' : 1, // 是否展示,1是，0否
          pageNum: this.article_page_num_1,
          pageSize: this.article_page_size_1,
          startDate: this.article_search_form_1.time&&this.article_search_form_1.time[0]?this.article_search_form_1.time[0]:'',
          endDate: this.article_search_form_1.time&&this.article_search_form_1.time[1]?this.article_search_form_1.time[1]:''
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            this.article_list_1 = res.data.list;
            this.article_page_totle_1 = res.data.total;
          } else {
            this.$message({type: 'error', message: '请求失败', showClose: true});
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({type: 'error', message: '请求失败', showClose: true});
        }
      });
    },
    addWord () { // 新增
      const h = this.$createElement;
      this.$msgbox({
        title: '新增热词',
        message: h('div', {style: 'margin:10px 0;'}, [h('input', {ref:'addHotWord', key: `${new Date().getTime()}`,attrs:{placeholder:'请输入热词名称（仅限8个字符）',maxlength:"8"},style:'height:30px;width:300px;color:#000;text-indent:8px;'},'')]),
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            let text = this.$refs.addHotWord.value;
            let sysuser = JSON.parse(sessionStorage.getItem('sysuser'));
            if (!text && text!==0) {
              this.$message({ type: 'error', message: '热词名称不能为空', showClose: true});
              return;
            }
            this.loading = true;
            this.$ajax({
              url: '/hotWord/add',
              type: 'POST',
              data: {
                hotWord: text
                // source: ''
                // userId: sysuser.id, // 创建人
              },
              success: (res) => {
                if (res.code == 0) {
                  this.queryList();
                  this.$message({type: 'success', message: '添加成功', showClose: true});
                } else {
                  this.$message({type: 'error', message: '操作失败', showClose: true});
                }
              },
              error: (err) => {
                this.$message({type: 'error', message: '操作失败', showClose: true});
              }
            })
          } 
          done();
        }
      });
    },
    removeWords () { // 批量移除
      if (this.multipleSelection.length == 0) {
        this.$message({type: 'error', message: '请选择热词', showClose: true});
        return;
      }
      let ids = '';
      for (let item of this.multipleSelection) {
        ids += (item.id + ',')
      }
      ids = ids.substring(0, ids.length - 1);
      this.$confirm('确定删除热词？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$ajax({
          url: '/hotWord/delete',
          type: 'GET',
          data: {
            ids: ids
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.queryList();
              this.$message({type: 'success', message: '删除成功', showClose: true});
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
    showFun (row) { // 展示
      this.$confirm('确定展示该热词？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$ajax({
          url: '/hotWord/show',
          type: 'GET',
          data: {
            id: row.id
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.queryList();
              this.$message({type: 'success', message: '展示成功', showClose: true});
            } else {
              this.$message({type: 'error', message: '操作失败', showClose: true});
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({type: 'error', message: '操作失败', showClose: true});
          }
        })
      });
    },
    noShowFun (row) { // 下架
      this.$confirm('确定下架该热词？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$ajax({
          url: '/hotWord/unShow',
          type: 'GET',
          data: {
            id: row.id
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.queryList();
              this.$message({type: 'success', message: '下架成功', showClose: true});
            } else {
              this.$message({type: 'error', message: '操作失败', showClose: true});
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({type: 'error', message: '操作失败', showClose: true});
          }
        })
      });
    },
    editFun (row) { // 编辑
      const h = this.$createElement;
      this.$msgbox({
        title: '编辑热词',
        message: h('div', {style: 'margin:10px 0;'}, [h('input', {ref:'addHotWord', key: `${new Date().getTime()}`,attrs:{placeholder:'请输入热词名称（仅限8个字符）',maxlength:"8",value:`${row.hotWord}`},style:'height:30px;width:300px;color:#000;text-indent:8px;'},``)]),
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            let text = this.$refs.addHotWord.value;
            let sysuser = JSON.parse(sessionStorage.getItem('sysuser'));
            if (!text && text!==0) {
              this.$message({ type: 'error', message: '热词名称不能为空', showClose: true});
              return;
            }
            this.loading = true;
            this.$ajax({
              url: '/hotWord/update',
              type: 'POST',
              data: {
                hotWord: text,
                source: row.source,
                id: row.id
              },
              success: (res) => {
                if (res.code == 0) {
                  this.queryList();
                  this.$message({type: 'success', message: '修改成功', showClose: true});
                } else {
                  this.$message({type: 'error', message: '操作失败', showClose: true});
                }
              },
              error: (err) => {
                this.$message({type: 'error', message: '操作失败', showClose: true});
              }
            })
          } 
          done();
        }
      });
    },
    lockFun (row) { // 锁定
      this.$confirm(`确定${row.isLock == 1?'解锁':'锁定'}该热词？`, `提示`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$ajax({
          url: `/hotWord/${row.isLock==1?'unLock':'lock'}`,
          type: 'GET',
          data: {
            id: row.id
          },
          success: (res) => {
            this.loading = true;
            if (res.code == 0) {
              this.queryList();
              this.$message({type: 'success', message: `${row.isLock == 1 ? '解锁':'锁定'}成功`, showClose: true});
            } else {
              this.$message({type: 'error', message: '操作失败', showClose: true});
            }
          },
          error: (err) => {
            this.loading = true;
            this.$message({type: 'error', message: '操作失败', showClose: true});
          }
        })
      });
    }
  },
  created () {
    this.getList();
  }
}
</script>
<style lang="scss" scoped>

</style>
