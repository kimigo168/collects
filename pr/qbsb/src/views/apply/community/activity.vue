<template>
  <div id="activity">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index" @tab-click="handleClick">
        <el-tab-pane label="待审核" name="0"></el-tab-pane>
        <el-tab-pane label="已通过" name="1"></el-tab-pane>
        <el-tab-pane label="未通过" name="2"></el-tab-pane>
        <div class="content">
          <div class="operate">
            <div class="search">
              <el-form :inline="true" :model="search_form">
                <el-form-item label="时间：">
                  <el-date-picker v-model="search_form.time" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="活动类型：">
                  <el-select v-model="search_form.type">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in activity_type_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input style="width:190px;" type="text" v-model="search_form.activityName" placeholder="请输入活动名称"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input style="width:190px;" type="text" v-model="search_form.activityCommunity" placeholder="请输入所属社群"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="queryList">搜索</el-button>
                </el-form-item>
                <el-form-item style="float:right;">
                  <el-button v-if="tab_index==0" type="primary" @click="mulitPass">批量通过</el-button>  
                  <el-button v-if="tab_index==2" type="primary" @click="mulitDelete">批量删除</el-button>  
                </el-form-item>  
              </el-form>
            </div>
          </div>
          <div class="table">
            <el-table :data="activity_list" style="width:100%"  @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
              <el-table-column align="center" prop="title" label="活动名称"></el-table-column>
              <el-table-column align="center" prop="activityType" label="活动类型"></el-table-column>
              <el-table-column align="center" prop="content" label="活动简介"></el-table-column>
              <el-table-column align="center" prop="chargeMode" label="活动费用"></el-table-column>
              <el-table-column align="center" prop="place" label="活动地点"></el-table-column>
              <el-table-column align="center" prop="name" label="所属社群"></el-table-column>
              <el-table-column align="center" prop="communityType" label="社群类型"></el-table-column>
              <el-table-column align="center" prop="nickName" label="群主"></el-table-column>
              <el-table-column align="center" prop="createTime" label="申请时间"></el-table-column>
              <el-table-column align="center" prop="address" label="操作">
                <template slot-scope="scope">
                  <p v-if="tab_index==0">
                    <el-button type="text" @click="approveFun(scope.row, 0)">通过</el-button>
                    <el-button type="text" @click="approveFun(scope.row, 1)">不通过</el-button>
                  </p>
                  <p v-if="tab_index==1||tab_index==2">
                    <el-button type="text" @click="viewStaffs(scope.row)">报名人员</el-button>
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
    <!-- 报名人员 -->
    <el-dialog :visible.sync="isShowStaff" :before-close="closeStaffs" title="报名人员" :close-on-click-modal="false" :show-close="true">
      <div class="scroll" style="max-height:500px;">
        <div class="table">
          <el-table :data="staffsList" style="width:100%">
            <el-table-column style="height:80px;" align="center" prop="portrait" label="头像">
              <template slot-scope="scope">
                <img style="height:60px;width:60px;border-radius:50%;overflow:hidden;" :src="scope.row.headimgUrl" alt="" :onerror="image_error">
              </template>
            </el-table-column>
            <el-table-column align="center" prop="username" label="昵称"></el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeStaffs">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'activity',
  data () {
    return {
      tab_index: '0',
      image_error:  require('../../../images/default_img.png') + '"',
      loading: false,
      activity_list: [],
      activity_type_list: [], // 活动类型列表
      search_form: {
        time: [],
        activityName: '',
        activityCommunity: ''
      },
      multipleSelection: [],
      page_num: 1,
      page_size: 10,
      page_total: 0,
      isShowStaff: false, // 显示报名人员弹窗
      staffsList: []
    }
  },
  methods: {
    closeStaffs () {
      this.isShowStaff = false;
    },
    pageNumChange (val) {
      this.page_num = val;
      this.getList();
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    queryList () {
      this.page_num = 1;
      this.getList();
    },
    getList () {
      this.activity_list = [];
      this.loading = true;
      this.$jqAjax({
        url: apiHost + '/activity/allList',
        type: 'POST',
        data: {
          pageNum: this.page_num,
          pageSize: this.page_size,
          status: this.tab_index,
          startTime: this.search_form.time && this.search_form.time[0] ? this.search_form.time[0] : '',
          endTime: this.search_form.time && this.search_form.time[1] ? this.search_form.time[1] : '',
          classId: this.search_form.type, // 活动类型
          activityName: this.search_form.activityName, // 活动名称
          communityName: this.search_form.activityCommunity // 社群名称
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            this.activity_list = res.data.result;
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
    getActivityTypeList () {
      this.$jqAjax({
        url: apiHost + '/activity/typeList',
        type: 'POST',
        data: {
          pageNum: 1,
          pageSize: 100
        },
        success: (res) => {
          if (res.code == 0) {
            this.activity_type_list = res.data.result;
          }
        },
        error: (err) => {
          this.$message({type: 'error', message: err.msg, showClose: true});
        }
      });
    },
    approveFun (row, type) {
      if (type == 0) {
        this.$confirm('通过后将不可下架活动，确定通过吗？','通过', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$jqAjax({
            url: apiHost + '/activity/pass',
            type: 'POST',
            data: {
              id: row.id
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
                url: apiHost + '/activity/notPass',
                type: 'POST',
                data: {
                  id: row.id,
                  reason: reason,
                  createId: row.createId
                },
                success: (res) => {
                  this.loading = false;
                  if (res.code == 0) {
                    this.$message({type: 'success', message: '操作成功', showClose: true});
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
            }
            done();
          }
        });
      }
    },
    mulitPass() {
      if (this.multipleSelection.length == 0) {
        this.$message({type: 'warning', message: '请先选择要通过的项', showClose: true});
        return;
      }
      let ids = '';
      for (let item of this.multipleSelection) {
        ids += (item.id + ',');
      }
      ids = ids.substring(0, ids.length - 1);
      this.$confirm('确定批量通过？', '通过', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/activity/passBatch',
          type: 'POST',
          data: {
            ids: ids
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
            this.$message({type: 'error', message: res.msg, showClose: true});
          }
        });
      });
    },
    mulitDelete () {
      this.$message({type: 'warning', message: '开发中...', showClose: true});
      return;
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
          url: apiHost + '/activity/del',
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
            this.$message({type: 'error', message: res.msg, showClose: true});
          }
        });
      });
    },
    delFun (row) {
      this.$confirm('确定删除该活动吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/activity/del',
          type: 'POST',
          data: {
            id: row.id
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
    viewStaffs (row) {
      console.log('row', row);
      this.loading = true
      this.$jqAjax({
        url: apiHost + '/activity/activityInfo',
        type: 'POST',
        data: {
          aid: row.id
        },
        success: (res) => {
          this.loading = false
          if (res.code == 0) {
            this.staffsList = res.data;
          } else {
            this.$message({type: 'error', message: res.msg, showClose: true});
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({type: 'error', message: err.msg, showClose: true});
        }
      });
      this.isShowStaff = true;
    },
    handleClick () {
      this.multipleSelection = [];
      this.search_form.time = '';
      this.search_form.type = '';
      this.search_form.activityCommunity = '';
      this.search_form.activityName = '';
      this.page_total = 0;
      this.queryList();
    }
  },
  created () {
    this.getList();
    this.getActivityTypeList();
  }
}
</script>
<style lang="scss" scoped>

</style>
