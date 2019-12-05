<template>
  <div id="package">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="安装包管理" name="0">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="article_search_form_1">
                  <el-form-item>
                    <el-button type="primary" @click="addVersion">新增版本</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="pkgList" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="version" label="版本号"></el-table-column>
                <el-table-column align="center" prop="remark" label="更新内容" width="200"></el-table-column>
                <el-table-column align="center" prop="createName" label="操作人"></el-table-column>
                <el-table-column align="center" prop="publishTime" label="操作时间">
                  <template slot-scope="scope">
                    {{scope.row.publishTime? new Date(scope.row.publishTime).format('YYYY-MM-DD hh:mm'):''}}  
                  </template> 
                </el-table-column>
                <el-table-column align="center" prop="operate" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="editFun(scope.row)">编辑</el-button>
                    <el-button type="text" @click="removeFun(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="article_page_totle_1 > 0">
              <el-pagination @current-change="articlePageNumChange1" :current-page.sync="article_page_num_1" :page-size="article_page_size_1" layout="total, prev, pager, next, jumper" :total="article_page_totle_1"></el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <addEditPkg :isAdd="isAdd" :editItem="editItem"  v-if="isShowAddEdit" @fCloseAddEdit="isShowAddEdit=false" @fSuccess="refreshFun"></addEditPkg> 
  </div>
</template>
<script>
import addEditPkg from './addEditPkg';
export default {
  name: 'package',
  data () {
    return {
      tab_index: '0',
      loading: false,
      article_search_form_1: {
        time: '',
        account: '',
        status: '0',
        classify: '',
        nickName: ''
      },
      pkgList: [
        // {
        //   appCode: 102,
        //   appName: '',
        //   createName: '',
        //   filemd5: '',
        //   id: 54,
        //   os: 0,
        //   packageUrl: 'https://app.xmrb.com/app/app-release-xm.apk',
        //   publishTime: 1558074049000,
        //   remark: '重大改版升级',
        //   status: 0,
        //   type: 1,
        //   version: '1.0.2',
        //   versionCode: 103
        // }
      ],
      categoryList: [],
      article_page_num_1: 1,
      article_page_size_1: 50,
      article_page_totle_1: 0,
      isShowAdd: false,
      isShowAddEdit: false,
      isAdd: false,
      editItem: null, // 编辑的项
      apiHost1: 'http://172.16.36.112:8083/giiso-appkeeper-1.0.0'
    }
  },
  components: {
    addEditPkg
  },
  methods: {
    articlePageNumChange1 () {

    },
    refreshFun () {
      this.isShowAddEdit = false;
      this.getPackageList();
    },
    getPackageList () {
      // this.loading = true;
      this.$.ajax({
        url:'/c-appkeeper/packageList',
        type: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          os: 0
          // ,
          // pageNum: this.article_page_num_1,
          // pageSize: this.article_page_size_1
        }),
        success: (res) => {
          console.log(res)
          this.loading = false;
          if (res.code == 0) {
            this.pkgList = res.data.list;
            this.article_page_totle_1 = res.data.total;
          }
        },
        errror: (err) => {
          this.loading = false;
          console.log(err)
        }
      });
    },
    editFun (row) {
      this.isAdd = false;
      this.editItem = row;
      this.isShowAddEdit = true;
    },
    removeFun (id) {
      this.$confirm('确定删除该安装包吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.loading = true;
        this.$jqAjax({
          url: '/c-appkeeper/delete',
          type: 'POST',
          // headers: {
          //   'Content-Type': 'application/json',
          // },
          data: {
            id: id
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({type: 'success', message: '删除成功', showClose: true});
              this.refreshFun();
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
    addVersion () {
      this.isAdd = true;
      this.isShowAddEdit = true;
    }
  },
  created () {
    this.getPackageList();
  }
}
</script>
<style lang="scss" scoped>

</style>
