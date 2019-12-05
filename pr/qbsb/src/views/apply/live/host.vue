<template>
  <div id="collecting">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="主播列表" name="0">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="article_search_form_1">
                  <!-- <el-form-item label="创建时间：">
                    <el-select v-model="article_search_form_1.time" placeholder="时间">
                      <el-option label="最近7天" value="0"></el-option>
                      <el-option label="最近30天" value="1"></el-option>
                    </el-select>
                  </el-form-item> -->
                  <el-form-item label="主播状态：">
                    <el-select v-model="article_search_form_1.status" @change="selectOption($event)">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="启用" value="1"></el-option>
                      <el-option label="禁用" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="article_search_form_1.account" placeholder="主播账号"></el-input>
                  </el-form-item>
                  <!-- <el-form-item>
                    <el-input type="text" v-model="article_search_form_1.nickName" placeholder="主播昵称"></el-input>
                  </el-form-item> -->
                  <el-form-item>
                    <el-button type="primary" @click="queryHost">查询</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="addHost">新增主播</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="article_list_1" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="mobile" label="主播账号"></el-table-column>
                <el-table-column align="center" prop="nikeName" label="主播昵称"></el-table-column>
                <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="status" label="主播状态">
                  <template slot-scope="scope">
                    {{scope.row.status==2?'禁用':scope.row.status==1?'启用':''}}
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="address" label="操作">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.status == 1" type="text" @click="handleFun(scope.row.id, 0)">禁用</el-button>
                    <el-button v-if="scope.row.status == 2" type="text" @click="handleFun(scope.row.id, 1)">启用</el-button>
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
      <add-host-pop v-if="isShowAdd" :isShowAdd="isShowAdd" @fAddBack="addBack" @fCloseAdd="isShowAdd = false"></add-host-pop>
    </div>
  </div>
</template>
<script>
  import addHostPop from './addHostPop'
  export default {
    data() {
      return {
        loading: false,
        tab_index: 0,
        article_search_form_1: {
          time: '',
          account: '',
          status: '1',
          nickName: ''
        },
        article_list_1: [
          {
            account: '18312345678',
            nickName: '张三',
            createName: '张主任',
            createTime: '2019/02/04 08:31:58',
            status: 0
          },
          {
            account: '18312345678',
            nickName: '张三',
            createName: '张主任',
            createTime: '2019/02/04 08:31:58',
            status: 1
          },
          {
            account: '18312345678',
            nickName: '张三',
            createName: '张主任',
            createTime: '2019/02/04 08:31:58',
            status: 1
          }
        ],
        article_page_num_1: 1,
        article_page_size_1: 10,
        article_page_totle_1: 10,
        searchNickResult: '昵称示例', // 搜索的昵称结果
        isShowAdd: false
      }
    },
    methods: {
      articlePageNumChange1(val) {
        this.article_page_num_1 = val;
        this.getHostList();
      },
      handleFun (id, type) { // 启用/禁用 操作
        this.$confirm(`确定${type==1?'启用':'禁用'}该账号的直播权限？`, `${type==1?'启用':'禁用'}`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$jqAjax({
            url: apiHost + '/live/user/updateStatus',
            type: 'POST',
            data: {
              id: id,
              status: type == 1 ? 1: 2
            },
            success: (res) => {
              this.loading = false;
              if (res.code == 0) {
                this.$message({ type: 'success', message: `${type==1?'启用':'禁用'}成功`, showClose: true });
                this.queryHost(); 
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
      },
      selectOption (e) {
        console.log('eeee', e)
        this.queryHost();
      },
      getHostList () { // 请求主播列表
        this.loading = true;
        this.article_list_1 = [];
        this.$jqAjax({
          url: apiHost + '/live/user/list',
          type: 'POST',
          data: {
            status: this.article_search_form_1.status,
            mobile: this.article_search_form_1.account,
            pageNum: this.article_page_num_1,
            pageSize: this.article_page_size_1
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              console.log('res', res);
              this.article_list_1 = res.data.pageResult;
              this.article_page_totle_1 = res.data.totalCount;
            }
          },
          error: (err) => {
            this.loading = false;
          }
        });
      },
      queryHost () {
        this.article_page_num_1 = 1;
        this.getHostList();
      },
      addHost () {
        this.isShowAdd = true;
      },
      addBack () {
        this.isShowAdd = false;
        this.queryHost();
      },
      searchClick () {
        let inputAccount = this.$refs.inputAccount.value
        this.searchNickResult = '知名主播aaa'
      }
    },
    created () {
      this.getHostList();
    },
    components: {
      addHostPop
    }
  }
</script>

<style lang="scss">

</style>
