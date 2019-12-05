<template>
  <div id="service-category">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="服务分类" name="0">
          <div class="content">
            <div class="operate">
              <div class="search" @keyup.enter="queryList">
                <el-form :inline="true" :model="article_search_form_1">
                  <!-- <el-form-item label="创建时间：">
                    <el-select v-model="article_search_form_1.time" placeholder="时间">
                      <el-option label="最近7天" value="0"></el-option>
                      <el-option label="最近30天" value="1"></el-option>
                    </el-select>
                  </el-form-item> -->
                  <el-form-item label="状态：">
                    <el-select v-model="article_search_form_1.status">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="已上架" value="0"></el-option>
                      <el-option label="已屏蔽" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="article_search_form_1.account" placeholder="分类名称"></el-input>
                  </el-form-item>
                  <!-- <el-form-item>
                    <el-input type="text" v-model="article_search_form_1.nickName" placeholder="主播昵称"></el-input>
                  </el-form-item> -->
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="addClass">新增分类</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="article_list_1" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="data.name" label="分类名称"></el-table-column>
                <el-table-column align="center" prop="data.createName" label="创建人"></el-table-column>
                <el-table-column align="center" prop="data.createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="status" label="状态">
                  <template slot-scope="scope">
                    {{scope.row.data.isShow==0?'已上架':scope.row.data.isShow==1?'已屏蔽':''}}
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="address" label="操作">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.data.sort!=1" type="text" @click="handleFun(scope.row, 0)">上移</el-button>
                    <el-button type="text" @click="handleFun(scope.row, 1)">下移</el-button>
                    <el-button type="text" @click="editClass(scope.row, 2)">修改</el-button>
                    <el-button v-if="scope.row.data.isShow==0" type="text" @click="handleFun(scope.row, 3)">屏蔽</el-button>
                    <el-button v-if="scope.row.data.isShow==1" type="text" @click="handleFun(scope.row, 4)">取消屏蔽</el-button>
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
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: false,
        tab_index: 0,
        article_search_form_1: {
          time: '',
          account: '',
          status: '',
          nickName: ''
        },
        article_list_1: [
          {
            classify: '生活服务',
            nickName: '张三',
            createName: '张主任',
            createTime: '2019/02/04 08:31:58',
            status: 0
          },
          {
            classify: '综合服务',
            nickName: '张三',
            createName: '张主任',
            createTime: '2019/02/04 08:31:58',
            status: 1
          }
        ],
        article_page_num_1: 1,
        article_page_size_1: 30,
        article_page_totle_1: 10,
      }
    },
    methods: {
      articlePageNumChange1 (val) {
        this.article_page_num_1 = val;
        this.getList();
      },
      handleFun (row, type) { // 操作
        if (type == 0 || type == 1) { // 上移，下移分类
          this.$confirm(`确定${type==0?'上移':'下移'}该分类？`, `${type==0?'上移':'下移'}`, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.loading = true;
            this.$ajax({
              url: '/lifeServerCategory/move',
              type: 'POST',
              data: {
                moveFirstId: row.data.id, // 当前移动
                moveFirstSort: row.data.sort,
                moveTwoId: type == 0 ? (row.preId ? row.preId : '' ) : row.nextId ? row.nextId : '', // 交换的
                moveTwoSort: type == 0 ? (row.preSort ? row.preSort : '' ) : row.nextSort ? row.nextSort : '' 
              },
              success: (res) => {
                this.loading = false;
                if (res.code == 0) {
                  this.$message({ type: 'success', message: `${type==0?'上移':'下移'}成功`, showClose: true });
                  this.queryList(); 
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
        } else if (type == 3 || type == 4) { // 屏蔽/取消屏蔽
          this.$confirm(`确定${type == 3 ?'屏蔽':'取消屏蔽'}该分类？`, `${type == 3 ?'屏蔽':'取消屏蔽'}`, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.loading = true;
            this.$ajax({
              url: '/lifeServerCategory/updateLifeServerStatus',
              type: 'GET',
              data: {
                id: row.data.id,
                isShow: type == 3 ? 1: 0 // 0上架，1下架
              },
              success: (res) => {
                this.loading = false;
                if (res.code == 0) {
                  this.$message({ type: 'success', message: `${type==3?'屏蔽':'上架'}成功`, showClose: true });
                  this.queryList(); 
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
      getList () { // 请求分类列表
        this.loading = true;
        this.article_list_1 = [];
        this.$jqAjax({
          url: apiHost + '/lifeServerCategory/list',
          type: 'GET',
          data: {
            name: this.article_search_form_1.account,
            isShow: this.article_search_form_1.status,
            pageNum: this.article_page_num_1,
            pageSize: this.article_page_size_1
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.article_list_1 = res.data;
              this.article_page_totle_1 = res.data.length;
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({type: 'error', message: '请求失败', showClose: true});
          }
        });
      },
      queryList () {
        this.article_page_num_1 = 1;
        this.getList();
      },
      addClass () {
        const h = this.$createElement;
        this.$msgbox({
          title: '新增分类',
          message: h('p',{style: 'margin:10px 10px;line-height:24px;'}, [
            h('span',{style: 'color: #000;'}, '分类名称：'),
            h('input', {style:'color: #000;width:220px;height:24px;text-indent:4px;line-height:24px;', attrs: {placeholder:'必填'}, ref:"inputClass", key: `${new Date().getTime()}`},'')
          ]),
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          closeOnClickModal: false,
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              let inputClassText = this.$refs.inputClass.value;
              if (!inputClassText) {
                this.$message({type:'error', message: '请输入分类名称', showClose: true});
                return;
              }
              this.$ajax({
                url:'/lifeServerCategory/add',
                type: 'POST',
                data: {
                  name: inputClassText
                },
                success: (res) => {
                  this.loading = false;
                  if (res.code == 0) {
                    this.queryList();
                    this.$message({type: 'success', message: '新增成功', showClose: true});
                  } else {
                    this.$message({type: 'error', message: '操作失败', showClose: true});
                  }
                },
                error: (err) => {
                  this.loading = false;
                  this.$message({type: 'error', message: '操作失败', showClose: true});
                }
              })

            }
            done();
          }
        });
      },
      editClass (row) {
        const h = this.$createElement;
        this.$msgbox({
          title: '修改',
          message: h('p',{style: 'margin:10px 10px;line-height:24px;'}, [
            h('span',{style: 'color: #000;'}, '分类名称：'),
            h('input', {style:'color: #000;width:220px;height:24px;text-indent:4px;line-height:24px;', attrs: {placeholder:'必填',value:`${row.data.name}`}, ref:"inputClass", key: `${new Date().getTime()}`},'')
          ]),
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          closeOnClickModal: false,
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              let inputClassText = this.$refs.inputClass.value;
              if (!inputClassText) {
                this.$message({type:'error', message: '请输入分类名称', showClose: true});
                return;
              }
              this.loading = true;
              this.$ajax({
                url: '/lifeServerCategory/update',
                type: 'POST',
                data: {
                  id: row.data.id,
                  name: inputClassText
                },
                success: (res) => {
                  this.loading = false;
                  if (res.code == 0) {
                    this.$message({type:'success', message: '修改成功', showClose: true});
                    this.queryList();
                  } else {
                    this.$message({type:'error', message: '操作失败', showClose: true});
                  }
                },
                error: (err) => {
                  this.loading = false;
                  this.$message({type:'error', message: '操作失败', showClose: true});
                }
              });
            }
            done();
          }
        });
      }
    },
    created () {
      this.getList();
    }
  }
</script>
<style lang="scss">

</style>
