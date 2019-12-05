<template>
  <div id="service-manage">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="服务列表" name="0">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="article_search_form_1">
                  <el-form-item label="类别：">
                    <el-select v-model="article_search_form_1.classify">
                      <el-option v-for="(item, index) in categoryList" :key="index" :label="item.data.name" :value="item.data.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="状态：">
                    <el-select v-model="article_search_form_1.status">
                      <el-option label="已上架" value="0"></el-option>
                      <el-option label="已下架" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <!-- <el-form-item>
                    <el-input type="text" v-model="article_search_form_1.account" placeholder="主播账号"></el-input>
                  </el-form-item> -->
                  <el-form-item>
                    <el-button type="primary" @click="queryService">查询</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="addService">新增服务</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="article_list_1" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="imageUrl" label="服务图标" width="">
                  <template slot-scope="scope">
                    <img style="width:40px;height:40px;border-radius:50%;overflow:hidden;" :src="scope.row.data.icon">
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="data.name" label="服务名称"></el-table-column>
                <el-table-column align="center" prop="data.url" label="链接" width="200"></el-table-column>
                <el-table-column align="center" prop="data.cName" label="类别"></el-table-column>
                <el-table-column align="center" prop="data.createName" label="创建人"></el-table-column>
                <el-table-column align="center" prop="data.createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="data.status" label="状态">
                  <template slot-scope="scope">
                    {{scope.row.data.onSale==0?'已上架':scope.row.data.onSale==1?'已下架':''}}
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="address" label="操作">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.preId" type="text" @click="handleFun(scope.row, 0)">上移</el-button>
                    <el-button v-if="scope.row.nextId" type="text" @click="handleFun(scope.row, 1)">下移</el-button>
                    <el-button type="text" @click="handleFun(scope.row, 2)">修改</el-button>
                    <el-button v-if="scope.row.data.onSale==0" type="text" @click="handleFun(scope.row, 3)">下架</el-button>
                    <el-button v-if="scope.row.data.onSale==1" type="text" @click="handleFun(scope.row, 4)">上架</el-button>
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
    <add-edit-pop v-if="isShowAdd" :isAdd="isAddService" :categoryList="categoryList" :serviceData="editItem" @fCloseAdd="isShowAdd=false" @fAddEditSuccess="addEditSuccess"></add-edit-pop>
  </div>
</template>
<script>
  import addEditPop from './addEditPop'
  export default {
    data() {
      return {
        loading: false,
        tab_index: 0,
        article_search_form_1: {
          time: '',
          account: '',
          status: '0',
          classify: '',
          nickName: ''
        },
        article_list_1: [
          {
            account: '18312345678',
            nickName: '张三',
            createName: '张主任',
            createTime: '2019/02/04 08:31:58',
            status: 0,
            serviceName: '爱出行',
            classify: '生活服务',
            link: 'wwww.baidu.com',
            imageUrl: 'http://i2.hexun.com/2018-11-21/195263783.jpg'
          }
        ],
        categoryList: [],
        article_page_num_1: 1,
        article_page_size_1: 10,
        article_page_totle_1: 10,
        isShowAdd: false,
        isAddService: false, // true表示新建，false表示编辑
        editItem: null, // 用于编辑的项
      }
    },
    methods: {
      articlePageNumChange1(val) {
        this.article_page_num_1 = val;
        this.getServiceList();
      },
      handleFun (row, type) { //操作
        if (type == 0 || type == 1) { // 上移，下移分类
          this.$confirm(`确定${type==0?'上移':'下移'}该服务？`, `${type==0?'上移':'下移'}`, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.loading = true;
            this.$ajax({
              url: '/lifeServer/move',
              type: 'POST',
              data: {
                moveFirstId: row.data.id, // 当前被移动的
                moveFirstSort: row.data.sort,
                moveTwoId: type == 0 ? (row.preId ? row.preId : '' ) : row.nextId ? row.nextId : '', // 交换的
                moveTwoSort: type == 0 ? (row.preSort ? row.preSort : '' ) : row.nextSort ? row.nextSort : ''
              },
              success: (res) => {
                this.loading = false;
                if (res.code == 0) {
                  this.$message({ type: 'success', message: `${type==0?'上移':'下移'}成功`, showClose: true });
                  this.queryService(); 
                } else {
                  this.$message({ type: 'error', message: '操作失败', showClose: true});
                }
              },
              error: (err) => {
                this.loading = false;
                this.$message({ type: 'error', message: '操作失败', showClose: true});
              }
            });
          });
        } else if (type == 2) { // 编辑
          this.isAddService = false;
          this.editItem = row.data;
          this.isShowAdd = true;
        } else if (type == 3 || type == 4) { // 下架,上架
          this.$confirm(`确定${type == 3?'下架':'上架'}该服务？`, `${type == 3?'下架':'上架'}`, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.loading = true;
            this.$jqAjax({
              url: apiHost + '/lifeServer/updateLifeServerStatus',
              type: 'GET',
              data: {
                id: row.data.id,
                onSale: type == 3 ? 1 : 0
              },
              success: (res) => {
                this.loading = false;
                if (res.code == 0) {
                  this.$message({ type: 'success', message: `${type==3?'下架':'上架'}成功`, showClose: true });
                  this.queryService(); 
                } else {
                  this.$message({ type: 'error', message: '操作失败', showClose: true});
                }
              },
              error: (err) => {
                this.loading = false;
                this.$message({ type: 'error', message: '操作失败', showClose: true});
              }
            });
          });
        }
      },
      queryService () {
        this.article_page_num_1 = 1;
        this.getServiceList();
      },
      getServiceList () {
        this.article_list_1 = [];
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/lifeServer/list',
          type: 'GET',
          data: {
            onSale: this.article_search_form_1.status, // 是否上架0：已上架，1：未上架
            name: '', // 服务名称
            categoryId: this.article_search_form_1.classify, // 服务类型
            pageSize: this.article_page_size_1,
            pageNum: this.article_page_num_1
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.article_list_1 = res.data.pageResult.list;
              this.article_page_totle_1 = res.data.totalCount;
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({ type: 'error', message: '请求失败', showClose: true});
          }
        });
      },
      addService () {
        this.isShowAdd = true;
        this.editItem = null;
        this.isAddService = true;
      },
      getServiceClass () { // 获取服务类别
        this.$jqAjax({
          url: apiHost + '/lifeServerCategory/list',
          type: 'GET',
          data: {
            isShow: 0, // 0已上架，1未上架
            name: '' // 服务分类名称
          },
          success: (res) => {
            if (res.code == 0) {
              this.categoryList = res.data;
            }
          },
          error: (err) => {
            this.$message({type:'error', message: '请求失败',showClose: true});
          }
        });
      },
      addEditSuccess () {
        this.isShowAdd = false;
        this.queryService();
      }
    },
    created () {
      this.getServiceList();
      this.getServiceClass();
    },
    components: {
      addEditPop
    }
  }
</script>

<style lang="scss">

</style>
