<template>
  <div id="community">
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
                <el-form-item label="社群类型：">
                  <el-select v-model="search_form.type">
                    <el-option label="全部" value = ""></el-option>
                    <el-option v-for="item in community_type_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input style="width:190px;" type="text" v-model="search_form.name" placeholder="请输入社群名称"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="queryList">搜索</el-button>
                </el-form-item>
                <el-form-item style="float:right;">
                  <el-button v-if="tab_index==0" type="primary" @click="mulitPass">批量通过</el-button>  
                  <el-button v-if="tab_index==3" type="primary" @click="multiDelete">批量删除</el-button>  
                </el-form-item>  
              </el-form>
            </div>
          </div>
          <div class="table">
            <el-table :data="community_list" style="width:100%"  @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
              <el-table-column align="center" prop="name" label="社群名称"></el-table-column>
              <el-table-column align="center" prop="type" label="社群类型"></el-table-column>
              <el-table-column align="center" prop="description" label="社群简介"></el-table-column>
              <el-table-column align="center" prop="area" label="社群区域"></el-table-column>
              <el-table-column align="center" prop="nickName" label="群主"></el-table-column>
              <el-table-column v-if="tab_index==3" align="center" prop="reason" label="原因"></el-table-column>
              <el-table-column v-if="tab_index==0||tab_index==3" align="center" prop="createTime" label="申请时间"></el-table-column>
              <el-table-column v-if="tab_index==1||tab_index==2" align="center" prop="fansNum" label="社群人数"></el-table-column>
              <el-table-column v-if="tab_index==1||tab_index==2" align="center" prop="activityNum" label="活动数"></el-table-column>
              <el-table-column v-if="tab_index==1||tab_index==2" align="center" prop="dynamicNum" label="动态数"></el-table-column>
              <el-table-column v-if="tab_index==1||tab_index==2" align="center" prop="auditTime" label="通过时间"></el-table-column>
              <el-table-column v-if="tab_index==1||tab_index==2" align="center" prop="updateName" label="操作人"></el-table-column>
              <el-table-column align="center" prop="address" label="操作">
                <template slot-scope="scope">
                  <p v-if="tab_index==0">
                    <el-button type="text" @click="editFun(scope.row)">编辑</el-button>
                    <el-button type="text" @click="approveFun(scope.row, 0)">通过</el-button>
                    <el-button type="text" @click="approveFun(scope.row, 1)">不通过</el-button> 
                  </p>
                  <p v-if="tab_index==1">
                    <el-button type="text" @click="setTopFun(scope.row)">{{scope.row.isTop==1?'取消置顶':'置顶'}}</el-button>
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
          <div class="page" v-if="community_page_total>0">
            <el-pagination @current-change="pageNumChange" :current-page.sync="community_page_num" :page-size="community_page_size" layout="total, prev, pager, next" :total="community_page_total"></el-pagination>
          </div>
        </div>
      </el-tabs>
    </div>
    <!-- 编辑弹窗 -->
    <editCommunity v-if="isShowEdit" :editItem="editItem" :typeList="community_type_list" @fEditSuccess="editSuccess" @fCloseEdit="isShowEdit=false"></editCommunity> 
  </div>
</template>
<script>
import editCommunity from './editCommunity'
export default {
  name: 'community',
  data () {
    return {
      tab_index: '0',
      loading: false,
      search_form: {
        time: [],
        type: '',
        name: '',
        // status: 0 // 0:待审核，1：通过，2未通过，3已屏蔽
      },
      community_page_num: 1,
      community_page_size: 10,
      community_page_total: 0,
      community_list: [
        // {
        //   name: '户外活动群',
        //   type: '运动',
        //   description: '户外活动群，专为户外运动爱好者而建的兴趣社群',
        //   id: 2
        // }
      ],
      community_type_list: [], // 社群类型
      multipleSelection: [], // 多选
      // 编辑弹窗
      isShowEdit: false,
      editItem: null
    }
  },
  methods: {
    pageNumChange (val) {
      this.community_page_num = val;
      this.getList();
    },
    queryList () {
      this.community_page_num = 1;
      this.getList();
    },
    getList () {
      this.community_list = [];
      this.loading = true;
      this.$jqAjax({
        url: apiHost + '/community/allList',
        type: 'POST',
        data: {
          pageNum: this.community_page_num,
          pageSize: this.community_page_size,
          startTime: this.search_form.time?this.search_form.time[0] : '',
          endTime: this.search_form.time?this.search_form.time[1]:'',
          status: this.tab_index==0?0:this.tab_index==1?1:this.tab_index==2?3:2,
          communityName: this.search_form.name,
          classId: this.search_form.type
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            this.community_list = res.data.result;
            this.community_page_total = res.data.size;
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({type: 'warning', message: err.msg, showClose: true});
        }
      });
    },
    getTypeList () {
      this.loading = true;
      this.$jqAjax({
        url: apiHost + '/community/typeList',
        type: 'POST',
        data: {
          pageNum: 1,
          pageSize: 50
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0 && res.data) {
            this.community_type_list = res.data.result;
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({type: 'error', message: '请求失败', showClose: true})
        }
      });
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    approveFun (row, type) {
      if (type == 0) {
        this.$confirm('确定通过审核？','通过', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$jqAjax({
            url: apiHost + '/community/pass',
            type: 'POST',
            data: {
              id: row.id,
              userId: row.createId
            },
            success: (res) => {
              this.loading = false;
              if (res.code == 0) {
                this.$message({type: 'success', message: '已通过', showClose: true});
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
        }).catch((err)=> {
          console.log(err)
        });
      } else {
        const h = this.$createElement;
        this.$msgbox({
          title: '不通过',
          message: h('div', {style: 'margin:10px;'},[
            h('textarea', {style: 'width:100%;height:60px;text-indent:2px;color:#000;', attrs: {placeholder:'不通过原因（仅限20字符）', maxLength: 20}, ref:"inputReason",key:`${new Date().getTime()}`}, '')
          ]),
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          closeOnClickModal: false,
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              let reason = this.$refs.inputReason.value;
              if (!reason) {
                this.$message({type: 'warning', message: '请填写原因', showClose: true});
                return;
              }
              this.loading = true;
              this.$jqAjax({
                url: apiHost + '/community/notPass',
                type: 'POST',
                data: {
                  id: row.id,
                  reason: reason
                },
                success: (res) => {
                  this.loading = false;
                  if (res.code == 0) {
                    this.$message({type: 'success', message: '操作成功', showClose: true});
                  } else {
                    this.$message({type: 'error', message: res.msg, showClose: true});
                  }
                },
                error: (err) => {
                  this.loading = false;
                  this.$message({type: 'error', message: err.msg, showClose: true});
                }
              });
            }
            done();
          }
        });
      }
    },
    setTopFun (row) {
      this.$confirm(`确定${row.isTop==1?'取消置顶':'置顶该社群'}？`, `${row.isTop==1?'取消置顶':'置顶'}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/community/goTop',
          type: 'POST',
          data: {
            id: row.id,
            isTop: row.isTop == 1 ? 0 : 1
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({type: 'success', message: `${row.isTop==1?'已取消':'已置顶'}`, showClose: true});
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
    editFun (row) {
      this.editItem = row;
      this.isShowEdit = true;
    },
    delFun (row) {
      this.$confirm('确定删除该社群吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/community/del',
          type: 'POST',
          data: {
            id: row.id
          },
          success: (res) => {
            this.loading = true;
            if (res.code == 0) {
              this.$message({type: 'success', message: '已删除', showClose: true});
              this.queryList();
            } else {
              this.$message({type: 'error', message: res.msg, showClose: true});
            }
          },
          error: (err) => {
            this.loading = true;
            this.$message({type: 'error', message: err.msg, showClose: true});
          }
        });
      });
    },
    shieldFun (row, type) {
      this.$confirm(`确定${type==0?'屏蔽该社群吗？屏蔽后，用户在app端将看不到该社群':'解除屏蔽？'}`, `${type==0?'屏蔽':'解除屏蔽'}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/community/shieldOrNot',
          type: 'POST',
          data: {
            id: row.id,
            status: type == 0 ? 3 : 1 // 0待审核 1通过 2未通过 3已屏蔽
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({type: 'success', message: `${type==0?'已屏蔽':'已解除'}`, showClose: true});
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
    handleClick () {
      this.search_form.type = '';
      this.search_form.time = '';
      this.community_page_total = 0;
      this.queryList();
    },
    mulitPass () {
      if (this.multipleSelection.length == 0) {
        this.$message({type: 'warning', message: '请先选择要通过的项', showClose: true});
        return;
      }
      let ids = '';
      let userIds = '';
      for (let item of this.multipleSelection) {
        ids += (item.id + ',');
        userIds += (item.createId + ',');
      }
      ids = ids.substring(0, ids.length - 1);
      userIds = userIds.substring(0, userIds.length - 1);
      this.$confirm('确定批量通过？', '通过', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/community/passBatch',
          type: 'POST',
          data: {
            ids: ids,
            userIds: userIds
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({type: 'success', message: '已通过', showClose: true});
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
          url: apiHost + '/community/delBatch',
          type: 'POST',
          data: {
            id: ids
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
    },
    editSuccess () {
      this.isShowEdit = false;
      this.queryList();
    }
  },
  created () {
    this.getTypeList();
    this.getList();
  },
  components: {
    editCommunity
  }
}
</script>
<style lang="scss" scoped>

</style>
