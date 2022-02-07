<template>
  <div id="staff">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="员工管理" name="0">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="staff_search_form">
                  <el-form-item label="状态：">
                    <el-select v-model="staff_search_form.status" @change="selectOption($event)">
                      <el-option label="全部" value="-1"></el-option>
                      <el-option label="正常" value="0"></el-option>
                      <el-option label="已禁用" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="staff_search_form.name" placeholder="输入姓名查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="searchStaff">查找</el-button>
                  </el-form-item>
                  <el-form-item style="float:right;">
                    <el-button type="primary" @click="addStaff">新增员工</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="staff_list" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="staffName" label="姓名"></el-table-column>
                <el-table-column align="center" prop="positionName" label="岗位"></el-table-column>
                <el-table-column align="center" prop="isBlock" label="状态">
                  <template slot-scope="scope">
                    {{scope.row.isBlock==0?'启用':'禁用'}}
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间">
                  <template slot-scope="scope">
                    {{scope.row.createTime?new Date(scope.row.createTime).format('YYYY-MM-DD hh:mm'):""}}
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="address" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="editFun(scope.row)">修改</el-button>
                    <el-button type="text" v-if="scope.row.isBlock==0" @click="disableFun(scope.row)">禁用</el-button>
                    <el-button type="text" v-if="scope.row.isBlock==1" @click="disableFun(scope.row)">启用</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page">
              <el-pagination @current-change="staffPageNumChange" :current-page.sync="staff_page_num" :page-size="staff_page_size" layout="total, prev, pager, next, jumper" :total="staff_page_total"></el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- 新增/修改员工弹窗 -->
      <el-dialog v-loading.lock="loading" :title="staff_operate_form.isAdd?'新增员工':'员工修改'" :visible.sync="staff_operate_form.isShow" top="15vh" width="30%">
        <div class="wrap">
          <el-form :model="staff_operate_form" ref="staff_operate_form" :validate-on-rule-change="false" :rules="staff_operate_form.rules" label-width="110px">
            <el-form-item label="员工姓名" prop="name">
              <el-input type="text" v-model="staff_operate_form.name"></el-input>
            </el-form-item>
            <el-form-item label="岗位分配" prop="position">
              <el-select v-model="staff_operate_form.position" multiple>
                <el-option v-for="item in staff_operate_form.posList" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="staff_operate_form.isAdd || (!staff_operate_form.isAdd && staffDetail && staffDetail.username=='-')" label="关联账号" prop="relativeAccount">
              <el-select v-model="staff_operate_form.relativeAccount" filterable :filter-method="searchByAccount">
                <el-option v-for="item in staff_operate_form.accountList" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="staff_operate_form.isShow = false">取 消</el-button>
            <el-button type="primary" @click="confirmAddEdit('staff_operate_form')">确 定</el-button>
          </div>
        </div>

      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  name: 'staff',
  data () {
    return {
      loading: false,
      tab_index: 0,
      staff_list: [
      ],
      staff_page_num: 1,
      staff_page_size: 10,
      staff_page_total: 0,
      staff_search_form: {
        status: '-1',
        name: ''
      },
      staff_operate_form: {
        isShow: false,
        name: '', // 请输入员工姓名（仅限4个汉字）
        relativeAccount: '', // 关联账号id
        position: [],
        account: '', // 关联账号
        posList: [
          {
            name: '编辑',
            id: 1
          },{
            name: '记者',
            id: 2
          }, {
            name: '设计',
            id: 3
          }
        ],
        accountList: [
          // {
          //   name: '笑',
          //   id: 2
          // }, {
          //   name: '李',
          //   id: 3
          // }
        ],
        rules: {
          name: [
            { required: true, message: '请输入员工姓名（仅限4个汉字）', trigger: 'blur' },
            {min: 1, max: 4, message: '长度在 1 到 4 个字符', trigger: 'blur'}
          ],
          position: [
            { required: true, message: '请选择岗位类型', trigger: 'blur' }
          ]
          // account: [
          //   { required: true, message: '请选择关联账号', trigger: 'blur' }
          // ]
        },
      },
      searchFlag: null,
      staffDetail: null
    }
  },
  methods: {
    staffPageNumChange (val) {
      this.staff_page_num = val;
      this.getStaffList();
    },
    selectOption () {
      this.searchStaff();
    },
    // 获取
    getPosList () {
      this.$jqAjax({
        url: apiHost + '/position/list',
        type: 'POST',
        data: {},
        success: (res) => {
          if (res.code == 0) {
            this.staff_operate_form.posList = res.data;
          }
        },
        error: (err) => {
          console.log(err)
        }
      });
    },
    getStaffList () {
      this.loading = true;
      this.staff_list = [];
      this.$jqAjax({
        url: apiHost + '/staff/list',
        type: 'POST',
        data: {
          pageSize: this.staff_page_size,
          pageNum: this.staff_page_num,
          isBlock: this.staff_search_form.status,
          name: this.staff_search_form.name
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            this.staff_list = res.data.data;
            this.staff_page_total = res.data.total;
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
    searchStaff () {
      this.staff_page_num = 1;
      this.getStaffList();
    },
    addStaff () {
      this.staff_operate_form.name = ''; // 清空
      this.staff_operate_form.relativeAccount = '';
      this.staff_operate_form.position = [];
      this.staff_operate_form.isShow = true;
      this.staff_operate_form.isAdd = true;
    },
    editFun (row) {
      this.staff_operate_form.name = row.staffName;
      this.staff_operate_form.position = [];
      this.staff_operate_form.isAdd = false;
      this.getStaff(row)
    },
    getStaff (row) {
      this.staffDetail = null;
      this.loading = true;
      this.$jqAjax({
        url: apiHost + '/staff/getById',
        type: 'POST',
        data: {
          id: row.id
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            this.staffDetail = res.data;
            let positionIds = res.data.positionIds.split(',');
            for(let item of positionIds) {
              this.staff_operate_form.position.push(Number(item));
            }
            this.staff_operate_form.isShow = true;
          }
        },
        error: (err) => {
          console.log(err)
          this.loading = false;
        }
      });
    },
    disableFun (row) {
      this.$confirm(`确定${row.isBlock==0?'禁用':'启用'}吗？`, `${row.isBlock==0?'禁用':'启用'}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/staff/updateStatus',
          type: 'POST',
          data: {
            id: row.id,
            isBlock: row.isBlock == 0 ? 1 : 0
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({ type: 'success', message: `${row.isBlock == 0?'已禁用':'已启用'}`});
              this.searchStaff(); // 刷新
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
    // 确定修改或新增
    confirmAddEdit () {
      this.$refs['staff_operate_form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.staff_operate_form.isAdd) { // 新增
            this.$jqAjax({
              url: apiHost + '/staff/add',
              type: 'POST',
              data: {
                name: this.staff_operate_form.name,
                positionList: this.staff_operate_form.position.join(','),
                uid: this.staff_operate_form.relativeAccount
              },
              success: (res) => {
                this.loading = false;
                if (res.code == 0) {
                  this.staff_operate_form.isShow = false;
                  this.$message({ type: 'success', message: '新增成功', showClose: true});
                  this.searchStaff(); // 刷新
                } else {
                  this.$message({type: 'error', message: '操作失败', showClose: true});
                }
              },
              error: (err) => {
                this.loading = false;
                this.$message({type: 'error', message: '操作失败', showClose: true});
                console.log(err)
              }
            });
          } else { // 修改
            this.$jqAjax({
              url: apiHost + '/staff/update',
              type: 'POST',
              data: {
                id: this.staffDetail.id,
                name: this.staff_operate_form.name,
                positionList: this.staff_operate_form.position.join(','),
                uid: this.searchStaff.username == '-' ? this.staff_operate_form.relativeAccount : ''
              },
              success: (res) => {
                this.loading = false;
                if (res.code == 0) {
                  this.$message({ type: 'success', message: '修改成功', showClose: true});
                  this.staff_operate_form.isShow = false;
                  this.searchStaff();
                } else {
                  this.$message({type: 'error', message: '操作失败', showClose: true});
                }
              },
              error: (err) => {
                this.loading = false;
                this.$message({type: 'error', message: '操作失败', showClose: true});
              }
            });
          }
        } else {
          return false;
        }
      });
      

    },
    searchByAccount(val) {
      clearTimeout(this.searchFlag);
      this.searchFlag = setTimeout(() => {
        // 查找出结果
        this.staff_operate_form.accountList = [];
        this.$jqAjax({
          url: apiHost + '/staff/getSysUserList',
          type: 'POST',
          data: {
            name: val
          },
          success: (res) => {
            if (res.code == 0) {
              this.staff_operate_form.accountList = res.data;
            }
          },
          error: (err) => {}
        });
      }, 200);
      
    }
  },
  created () {
    this.getPosList();
    this.getStaffList();
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer{
  text-align: center;
  margin-top: 60px;
  margin-bottom: 20px;
}
</style>
