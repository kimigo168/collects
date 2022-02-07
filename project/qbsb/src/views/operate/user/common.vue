<template>
  <div id="users">
    <div class="tab">
      <el-tabs>
        <el-tab-pane label="用户账号">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="article_search_form_1">
                  <el-form-item label="所属企业：">
                    <el-select v-model="article_search_form_1.company">
                      <el-option label="全部" value=""></el-option>
                      <el-option v-for="(item, index) in companyList" :key="index" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input style="width:190px;" type="text" v-model="article_search_form_1.userName" placeholder="输入员工账号查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-input style="width:190px;" type="text" v-model="article_search_form_1.realName" placeholder="输入姓名查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryUser">查询</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="addUser">新增账号</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="tab-select">
                <el-radio-group v-model="article_search_form_1.status" @change="statusChange" style="margin-bottom: 30px;">
                  <el-radio-button label="">全部</el-radio-button>
                  <el-radio-button label="0">启用</el-radio-button>
                  <el-radio-button label="1">禁用</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="table" v-loading.lock="loading">
              <el-table :data="article_list_1" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <!-- <el-table-column align="center" prop="id" label="ID"></el-table-column> -->
                <el-table-column align="center" prop="imageUrl" label="头像" width="">
                  <template slot-scope="scope">
                    <img :src="scope.row.headimgUrl">
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="userName" label="账号"></el-table-column>
                <el-table-column align="center" prop="realName" label="姓名"></el-table-column>
                <el-table-column align="center" prop="status" label="状态">
                  <template slot-scope="scope">
                    {{scope.row.status==0?'启用':scope.row.status==1?'禁用':''}}
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="companyName" label="所属企业"></el-table-column>
                <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="address" label="操作">
                  <template slot-scope="scope">
                    <p>
                      <el-button type="text" @click="editFun(scope.row)">修改</el-button>
                      <!-- <el-button type="text" v-if="scope.row.status==1" @click="handleFun(scope.row.id, 0)">启用</el-button>
                      <el-button type="text" v-if="scope.row.status==0" @click="handleFun(scope.row.id, 2)">禁用</el-button> -->
                      <el-button type="text" @click="enableDisableFun(scope.row)">{{scope.row.status==0?'禁用':'启用'}}</el-button>
                    </p>
                    <p><el-button type="text" @click="pswReset(scope.row.id)">密码重置</el-button><el-button @click="deleteAccount(scope.row.id)" type="text">删除</el-button></p>
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
    <!-- 新增/编辑账号 弹窗-->
    <el-dialog v-loading.lock="loading1" :before-close="closeAddEditPop" :close-on-click-modal = 'false'  :title="accountOperate.isEdit ? '编辑账号' : '新增账号'" :visible.sync="accountOperate.isShow" width="30%">
      <div class="wrap">
        <el-form :model="accountOperate" ref="account_operate_form" :validate-on-rule-change="false" :rules="accountOperate.rules" label-width="110px">
          <el-form-item label="账号" prop="userName">
            <el-input type="text" v-model="accountOperate.userName"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="realName">
            <el-input type="text" v-model="accountOperate.realName"></el-input>
          </el-form-item>
          <el-form-item label="所属企业" prop="company">
            <el-select v-model="accountOperate.company">
              <el-option v-for="(item, index) in companyList" :key="index" :value="item.id" :label="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio v-model="accountOperate.status" label="0">启用</el-radio>
            <el-radio v-model="accountOperate.status" label="1">禁用</el-radio>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddEditPop">取 消</el-button>
        <el-button type="primary" @click="confirmFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import md5 from "md5";
export default {
  data() {
    let checkUserName = (rule, value, callback) => {
      value = value.trim()
      if (!value) {
        return callback(new Error('账号名称不能为空'));
      }
      setTimeout(() => {
        if (value.length < 3 || value.length > 50) {
          callback(new Error('长度在 3 到 55 个字符'));
        } else {
          callback();
        }
      }, 200);
    }
    // let checkRealName = (rule, value, callback) => {
    //   value = value.trim()
    //   if (!value) {
    //     return callback(new Error('姓名不能为空'));
    //   }
    //   setTimeout(() => {
    //     if (value.length < 1 || value.length > 11) {
    //       callback(new Error('长度在 1 到 11 个字符'));
    //     }
    //   }, 200);
    // }
    return {
      loading: false,
      loading1: false,
      article_search_form_1: {
        time: [],
        registerMethod: '',
        status: "", // 0:启用，1：禁用
        keywords: "",
        userName: '',
        realName: '',
        mobile: '',
        company: ''
      },
      article_list_1: [],
      article_page_num_1: 1,
      article_page_size_1: 10,
      article_page_totle_1: 0,
      otherCodeObj: {
        wx: '微信',
        qq: 'qq',
        wb: 'wb'
      },
      // 新增编辑账号
      accountOperate: {
        isShow: false,
        isEdit: false,
        userName: '',
        realName: '',
        status: '0',
        company: '',
        rules: {
          userName: [
            { required: true, message: '请输入账号名称', trigger: 'blur' },
            // { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
            { validator: checkUserName, trigger: 'blur' }
          ],
          realName: [
            { required: false, message: '请输入姓名', trigger: 'blur' },
            // { validator: checkUserName, trigger: 'blur' }
            { min: 1, max: 11, message: '长度在 1 到 11 个字符', trigger: 'blur'}
          ],
          company: [
            { required: true, message: '请选择所属企业', trigger: 'blur' }
          ]
        }
      },
      companyList: []
    }
  },
  methods: {
    statusChange () {
      this.queryUser()
    },
    articlePageNumChange1(val) {
      this.article_page_num_1 = val;
      this.getUserList();
    },
    getUserList () {
      this.article_list_1 = [];
      this.loading = true;
      this.$jqAjax({
        url: apiHost + '/appuser/userlist',
        type: 'POST',
        data: {
          pageNum: this.article_page_num_1,
          pageSize: this.article_page_size_1,
          userName: this.article_search_form_1.userName || '',
          realName: this.article_search_form_1.realName,
          companyId: this.article_search_form_1.company,
          // mobile: this.article_search_form_1.mobile || '',
          status: this.article_search_form_1.status || '',
          otherCode: this.article_search_form_1.registerMethod || '',
          timeStart: this.article_search_form_1.time&&this.article_search_form_1.time[0]?(this.article_search_form_1.time[0]+' 00:00:00'):'',
          timeEnd: this.article_search_form_1.time&&this.article_search_form_1.time[1]?(this.article_search_form_1.time[1]+' 23:59:59'):''
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0 && res.data) {
            let data = res.data;
            this.article_list_1 = data.result;
            this.article_list_1.map((item, index) => {
              if (item.otherCode) {
                if (item.otherCode.indexOf(',') > -1) { // 多种方式，拼接
                  let codeArr = item.otherCode.split(',');
                  let str = '';
                  for(let item1 of codeArr) {
                    str += this.otherCodeObj[item1] + ',';
                  }
                  str = str.substring(0, str.length -1);
                  this.$set(this.article_list_1[index], 'registerMethod', str); // 
                } else {
                  this.$set(this.article_list_1[index], 'registerMethod', this.otherCodeObj[item.otherCode]); // 默认手机
                }
              } else {
                this.$set(this.article_list_1[index], 'registerMethod', '手机'); // 默认手机
              }
            });
            this.article_page_totle_1 = data.Size[0].Size;
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({type: 'error', message: `请求失败`, showClose: true});
        }
      })
    },
    queryUser () {
      this.article_page_num_1 = 1; // 置位
      this.getUserList();
    },
    handleFun (id, type) {
      let title = `${type==0?'取消禁用':type==1?'加入黑名单':type==2?'禁用':'移出黑名单'}`;
      let tips = `确定${type==0?'取消禁用该用户吗':type==1?'将该用户加入黑名单吗':type==2?'禁用该用户吗':'将该用户移出黑名单吗'}？`;
      this.$confirm(tips,title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'waring'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/appuser/updateUser',
          type: 'POST',
          data: {
            id: id,
            status: type == 0||type == 3 ? 0 : type == 1 ? 2: 1 // 0:启用，1：停止，2：黑名单
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.queryUser();// 刷新页面
              setTimeout(() => {
                this.$message({
                  type: 'success',
                  message: `${type==0?'已取消禁用':type==1?'已加入黑名单':type==2?'已禁用':'已移出黑名单'}`,
                  showClose: true
                });
              }, 2000);
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({type: 'error', message: `操作失败`, showClose: true});
          }
        });
      });
    },
    enableDisableFun (row) {
      this.$confirm(`确定${row.status==0?'禁':'启'}用该账号吗？`, `${row.status==0?'禁':'启'}用`, {
        confirmButtonText:'确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$jqAjax({
          url: apiHost + '/appuser/updateUser',
          type:'POST',
          data: {
            id: row.id,
            status: row.status == 0 ? 1: 0
          },
          success: (res) => {
            if (res.code == '0') {
              this.$message({type: 'success', message: `${row.status==0?'禁':'启'}用成功`, showClose: true});
              this.queryUser()
            }
          },
          error: (err) => {
            
          }
        });
      });
    },
    addUser () { // 新增账号
      this.accountOperate.isEdit = false;
      this.accountOperate.isShow = true;
    },
    editFun (row) {
      this.accountOperate.isEdit = true;
      this.accountOperate.isShow = true;
      this.accountOperate.editId = row.id
      this.accountOperate.userName = row.userName;
      this.accountOperate.realName = row.realName;
      this.accountOperate.company = row.companyId;
    },
    confirmFun () {
      this.$refs['account_operate_form'].validate(valid => {
        if (valid) {
          this.loading1 = true;
          this.$jqAjax({
            url: apiHost + (this.accountOperate.isEdit?'/appuser/updateUser':'/appuser/createAppUser'),
            type: 'POST',
            data: {
              userName: this.accountOperate.userName,
              realName: this.accountOperate.realName,
              companyId: this.accountOperate.company,
              id: this.accountOperate.editId
            },
            success: (res) => {
              this.loading1 = false;
              if (res.code == '0') {
                this.$message({type: 'success', message: `${this.accountOperate.isEdit?'编辑':'创建'}成功`, showClose: true});
                this.accountOperate.isShow = false;
                this.queryUser()
              } else {
                this.$message({type: 'warning', message: res.msg, showClose: true});
              }
              this.$refs['account_operate_form'].resetFields(); // 清空
            },
            error: (err) => {
              this.loading1 = false
            }
          });
        }
      })
    },
    closeAddEditPop () {
      this.$refs['account_operate_form'].resetFields();
      this.accountOperate.isShow = false;
    },
    pswReset (id) {
      this.$prompt('重置密码：', '密码重置', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputValidator:function (value) {
          if(value === '' || value === null){
            return '请输入重置密码'
          }
        }
      }).then(({ value }) => {
        this.$jqAjax({
          url: apiHost + '/appuser/updateUserPassword',
          type: 'POST',
          data: {
            id: id,
            password: md5(value)
            // password: value
          },
          success: (res) => {
            if (res.code == '0') {
              this.$message({type: 'success', message: '重置成功', showClose: true})
            }
          },
          error: (err) => {
            this.$message({type: 'warning', message: err.msg, showClose: true});
          }
        });
      });
    },
    deleteAccount (id) {
      this.$confirm('确定删除该用户？', '删除', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$jqAjax({
          url: apiHost + '/appuser/deleteUser',
          type: 'POST',
          data: {
            id: id
          },
          success: (res) => {
            if (res.code == '0') {
              this.$message({type: 'success', message: '删除成功', showClose: true});
              this.queryUser()
            }
          }
        });
      });
    },
    getCompanyDropList () {
      this.$jqAjax({
        url: apiHost + '/appuser/userCompanyList',
        type: 'POST',
        data: {},
        success: (res) => {
          if (res.code == '0') {
            this.companyList = res.data;
          }
        }
      });
    }
  },
  created () {
    this.getUserList();
    this.getCompanyDropList()
  }
}
</script>

<style lang="scss">

</style>
