<template>
  <div id="collecting">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="账号管理" name="0">
          <div class="content">
            <div class="operate operate20 clearfix">
              <div class="search lt">
                <el-form :inline="true" :model="account_search_form">
                  <el-form-item label="账号名称：">
                    <el-input type="text" style="width: 170px;" v-model="account_search_form.userName" placeholder="输入账户名称查找"></el-input>
                  </el-form-item>
                  <el-form-item label="姓名：">
                    <el-input type="text" v-model="account_search_form.name" placeholder="输入姓名查找"></el-input>
                  </el-form-item>
                  <el-form-item label="角色类型：">
                    <el-select v-model="account_search_form.role">
                      <el-option v-for="item in role_list" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryAccountList">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="btn rt">
                <el-button type="primary" @click="accountOperate(undefined)">新增账号</el-button>
              </div>
            </div>
            <div class="tab-select" style="padding-left:20px;">
              <el-radio-group v-model="account_search_form.status" @change="statusChange" style="margin-bottom: 30px;">
                <el-radio-button label="">全部</el-radio-button>
                <el-radio-button label="0">启用</el-radio-button>
                <el-radio-button label="1">禁用</el-radio-button>
              </el-radio-group>
            </div>
            <div class="table">
              <el-table :data="account_list" style="width: 100%">
                <el-table-column align="center" prop="username" label="账号(手机号)"></el-table-column>
                <el-table-column align="center" prop="name" label="姓名"></el-table-column>
                <el-table-column align="center" prop="rolesName" label="角色类型"></el-table-column>
                <el-table-column align="center" prop="status" label="状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">启用</span>
                    <span v-if="scope.row.status == 1">禁用</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
                <el-table-column align="center" prop="create_time" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="address" label="操作">
                  <template slot-scope="scope">
                    <p>
                      <el-button type="text" class="wran-color" @click="getChannelList(scope.row.id)">频道分配</el-button>
                      <el-button type="text" class="wran-color" @click="accountOperate(scope.row)">修改</el-button>
                      <el-button type="text" class="wran-color" @click="enableDisableFun(scope.row)">{{scope.row.status==0?'禁用':'启用'}}</el-button>
                    </p>
                    <p>
                      <el-button type="text" class="wran-color" @click="changePsw(scope.row.id)">密码重置</el-button>
                      <el-button type="text" class="danger-color" @click="removeAccount(scope.row.id)">删除</el-button>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="account_page_totle > 0">
              <el-pagination @current-change="accountPageNumChange" :current-page.sync="account_page_num" :page-size="account_page_size" layout="prev, pager, next, jumper" :total="account_page_totle">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog :before-close="closeAddEditPop" :close-on-click-modal = 'false'  :title="!!account_edit_row.id ? '编辑账号' : '新增账号'" :visible.sync="account_operate_visible" width="30%">
      <div class="wrap">
        <el-form :model="account_operate_form" ref="account_operate_form" :validate-on-rule-change="false" :rules="account_operate_rules" label-width="110px">
          <el-form-item label="账号：" prop="username">
            <el-input type="text" v-model="account_operate_form.username"></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="name">
            <el-input type="text" v-model="account_operate_form.name"></el-input>
          </el-form-item>
          <el-form-item label="角色类型：" prop="role">
            <el-select v-model="account_operate_form.role" multiple>
              <el-option v-for="list in role_list" :key="list.id" :value="list.id" :label="list.name">
              </el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="企业分配：" prop="company">
            <el-select v-model="account_operate_form.company" multiple>
              <el-option v-for="list in companyList" :key="list.id" :value="list.id" :label="list.name">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="状态：">
            <el-radio v-model="account_operate_form.status" label="0">启用</el-radio>
            <el-radio v-model="account_operate_form.status" label="1">禁用</el-radio>
          </el-form-item> -->
          <!-- <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="account_operate_form.password"></el-input>
          </el-form-item> -->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddEditPop">取 消</el-button>
        <el-button type="primary" @click="accountOperateDo('account_operate_form')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog v-loading.lock="loading"  title="频道分配" :visible.sync="channel_allot_visible" width="650px">
      <div class="wrap clearfix">
        <el-col :span="12">
          <!-- <h3>文章</h3> -->
          <el-checkbox @change="selectAllChange1" v-model="selectAllArticleChannel" style="margin-bottom:20px;">全选</el-checkbox>
          <div class="allot" v-for="list in channel_list_news" :key="list.id">
            <div class="parent">
              <el-checkbox @change="checkParentChange1" v-model="list.select">{{list.name}}</el-checkbox>
            </div>
            <div class="children" v-if="list.select">
              <el-checkbox @change="checkChildChange1" v-model="item.select" v-for="item in list.subList" :key="item.id">{{item.name}}</el-checkbox>
            </div>
          </div>
        </el-col>
        <!-- <el-col :span="12">
          <h3>视频</h3>
          <el-checkbox @change="selectAllChange2" v-model="selectAllVideoChannel" style="margin-bottom:20px;">全选</el-checkbox>
          <div class="allot" v-for="list in channel_list_video" :key="list.id">
            <div class="parent">
              <el-checkbox @change="checkParentChange2" v-model="list.select">{{list.name}}</el-checkbox>
            </div>
          </div>
        </el-col> -->
      </div>
      <p style="font-size:12px;color:#f00;margin-top:10px;">温馨提示：勾选了父频道，其相应的子频道需至少勾选一条</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="channel_allot_visible = false">取 消</el-button>
        <el-button type="primary" @click="channelAllotDo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MD5 from 'md5'

export default {
  data() {
    return {
      tab_index: 0,
      account_search_form: {
        status: "",
        userName: '',
        name: '',
        role: ''
      },
      account_list: [],
      account_page_num: 1,
      account_page_size: 10,
      account_page_totle: 0,
      //新增-编辑账号
      account_operate_visible: false,
      account_operate_form: {
        username: '',
        name: '',
        role: [],
        status: '',
        company: [],
        password: ''
      },
      role_list: [],
      companyList: [],
      account_edit_row: {},
      //频道分配
      channel_allot_visible: false,
      channel_list_news: [],
      channel_parent_select: [],
      allot_id: '',
      channel_list_video: [],
      loading: false,
      selectAllArticleChannel: false,
      selectAllVideoChannel: false
    }
  },
  computed: {
    account_operate_rules (){
      return {
        username: [
          { required: true, message: '请输入账号名称', trigger: 'blur' },
          { min: 1, max: 11, message: '长度在 1 到 11 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 1, max: 11, message: '长度在 1 到 11 个字符', trigger: 'blur'}
        ],
        role: [
          { required: true, message: '请选择角色类型', trigger: 'blur' }
        ]
        // ,
        // company: [
        //   { required: true, message: '请分配企业', trigger: 'blur' }
        // ]
      }
    }
  },
  created() {
    this.getAccountList();
    this.getRoleList();
  },
  methods: {
    statusChange () {
      this.getAccountList();
    },
    closeAddEditPop () {
      this.$refs['account_operate_form'].resetFields();
      this.account_operate_visible = false;
    },
    checkParentChange1 () {
      let isAllSelect = true;
      this.channel_list_news.map((item, index) => {
        if (!item.select) {
          isAllSelect = false;
          return;
        }
        if (item.subList && item.subList.length > 0) {
          let subList = item.subList;
          subList.map((item1, index1) => {
            if (!item1.select) isAllSelect = false;
          });
        }
      });
      this.selectAllArticleChannel = isAllSelect;
    },
    checkParentChange2 () {
      let isAllSelect = true;
      this.channel_list_video.forEach((item, index) => {
        if (!item.select) {
          isAllSelect = false;
        }
      });
      this.selectAllVideoChannel = isAllSelect;
    },
    checkChildChange1 () {
      let isAllSelect = true;
      this.channel_list_news.map((item, index) => {
        if (!item.select) {
          isAllSelect = false;
          return;
        }
        if (item.subList && item.subList.length > 0) {
          let subList = item.subList;
          subList.map((item1, index1) => {
            if (!item1.select) isAllSelect = false;
          });
        }
      });
      this.selectAllArticleChannel = isAllSelect;
    },
    selectAllChange1 () {
      this.channel_list_news.map((item, index) => {
        this.$set(this.channel_list_news[index], 'select', this.selectAllArticleChannel)
        if (item.subList && item.subList.length > 0) {
          let subList = item.subList;
          subList.map((item1, index1) => {
            this.$set(this.channel_list_news[index].subList[index1], 'select', this.selectAllArticleChannel)
          });
        }
      });
    },
    selectAllChange2 () {
      this.channel_list_video.map((item, index) => {
        this.$set(this.channel_list_video[index], 'select', this.selectAllVideoChannel);
      });
    },
    //获取账号数据列表
    getAccountList() {
      var self = this;
      this.loading = true;
      this.account_list = [];
      self.$jqAjax({
        url: apiHost + "/user/list",
        type: "POST",
        data: {
          pageNum: self.account_page_num,
          pageSize: self.account_page_size,
          status: self.account_search_form.status,
          name: self.account_search_form.name,
          userName: self.account_search_form.userName, // 账号名称
          role: self.account_search_form.role
        },
        success: function (data) {
          self.loading = false;
          if (data.code == 0) {
            try {
              self.account_list = data.data.list;
              self.account_page_totle = data.data.size;
            } catch (e) {
              console.log(e);
            }
          }
        },
        error(error) {
          self.loading = false;
          self.sensitive_list = [];
          self.sensitive_page_total = 0;
          self.$message({
            type: "error",
            message: "请求失败",
            showClose: 'true',
          })
        }
      });
    },

    //获取角色类型列表
    getRoleList() {
      var self = this;
      self.$jqAjax({
        url: apiHost + "/role/selectList",
        type: "POST",
        data: {},
        success: function (data) {
          if (data.code == 0) {
            try {
              self.role_list = data.data;
            } catch (e) {
              console.log(e);
            }
          }
        },
        error(error) {
          self.sensitive_list = [];
          self.sensitive_page_total = 0;
          self.$message({
            type: "error",
            message: "请求失败",
            showClose: 'true',
          })
        }
      });
    },

    //删除角色
    removeAccount(id) {
      var self = this;
      self.$confirm('确认删除此账号吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$jqAjax({
          url: apiHost + "/user/del",
          type: "POST",
          data: {
            id: id
          },
          success: function (data) {
            if (data.code == 0) {
              self.$message({
                type: "success",
                message: "删除成功",
                showClose: 'true',
              })
              self.getAccountList();
            } else {
              self.$message({
                type: "error",
                message: "删除失败",
                showClose: 'true',
              })
            }
          },
          error(error) {
            self.$message({
              type: "error",
              message: "请求失败",
              showClose: 'true',
            })
          }
        });
      });
    },

    accountPageNumChange(val) {
      this.account_page_num = val;
      this.getAccountList();
    },
    // 获取企业分配下拉数据
    getCompanyDropList () {
      this.$jqAjax({
        url: apiHost + '/user/miniCompanyList',
        type: 'POST',
        data: {},
        success: (res) => {
          if (res.code == '0') {
            this.companyList = res.data
          }
        }
      });
    },
    //账户新增和修改
    accountOperate(row) {
      this.account_operate_visible = true;
      this.account_operate_form.role = [];
      this.account_operate_form.company = [];
      this.getCompanyDropList();
      if (row) {
        this.account_edit_row = row;
        this.account_operate_form.username = row.username;
        this.account_operate_form.name = row.name;
        if (row.rolesId) {
          this.account_operate_form.role = row.rolesId.split(",").map(function (item) {
            return item - 0;
          });
        }
        if (row.companyId) {
          this.account_operate_form.company = row.companyId.split(",").map(function (item) {
            return item - 0;
          });
        }
        this.account_operate_form.status = row.status;
      } else {
        this.account_edit_row = {};
        this.account_operate_form.status = "0"
        this.account_operate_form.username = "";
        this.account_operate_form.name = "";
        this.account_operate_form.role = [];
        this.account_operate_form.company = [];
      }
    },

    //账户新增和修改提交
    accountOperateDo(formName) {
      var self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.$loading();
          self.$jqAjax({
            url: !self.account_edit_row.id ? apiHost + "/user/add" : apiHost + "/user/update",
            type: "POST",
            data: {
              username: self.account_operate_form.username,
              name: self.account_operate_form.name,
              pwd: !self.account_edit_row.id?MD5('123456'):'',
              roles: self.account_operate_form.role.join(","),
              companies: self.account_operate_form.company.join(","),
              id: self.account_edit_row.id || null
              // status: self.account_operate_form.status
            },
            success: function (data) {
              self.$loading().close();
              if (data.code == 0) {
                self.$message({
                  type: "success",
                  message: "操作成功",
                  showClose: 'true',
                })
                self.getAccountList();
                self.account_operate_visible = false;
              } else {
                self.$message({
                  type: "error",
                  message: data.msg,
                  showClose: 'true',
                })
              }
            },
            error(error) {
              self.$loading().close();
              self.$message({
                type: "error",
                message: "请求失败",
                showClose: 'true',
              })
            }
          });
        }
      })
    },
    //获取频道列表
    getChannelList(id) {
      var self = this;
      self.allot_id = id;
      self.channel_allot_visible = true;
      self.loading = true;
      self.$jqAjax({
        url: apiHost + "/func/getUserChannel",
        type: "POST",
        data: {
          id: id
        },
        success: function (data) {
          self.loading = false;
          if (data.code == 0) {
            try {
              var list_news = data.data.news;
              var hasArticleUnselect = false; // 有没选中的，即取消全选
              var hasVideoUnselect = false; // 有没选中的，即取消全选
              for (var i = 0; i < list_news.length; i++) {
                if (list_news[i].perm == 0) {
                  list_news[i].select = true
                } else {
                  list_news[i].select = false
                  hasArticleUnselect = true
                }
                if (list_news[i].subList) {
                  for (var k = 0; k < list_news[i].subList.length; k++) {
                    if (list_news[i].subList[k].perm == 0) {
                      list_news[i].subList[k].select = true
                    } else {
                      list_news[i].subList[k].select = false
                      hasArticleUnselect = true
                    }
                  }
                }
              }
              self.channel_list_news = list_news;
              self.selectAllArticleChannel = !hasArticleUnselect;
              var list_video = data.data.video;
              for (var i = 0; i < list_video.length; i++) {
                if (list_video[i].perm == 0) {
                  list_video[i].select = true
                } else {
                  list_video[i].select = false
                  hasVideoUnselect = true
                }
              }
              self.channel_list_video = list_video;
              self.selectAllVideoChannel = !hasVideoUnselect;
            } catch (e) {
              console.log(e);
            }
          }
        },
        error(error) {
          self.loading = false;
          self.$message({
            type: "error",
            message: "请求失败",
            showClose: 'true',
          })
        }
      });
    },

    channelAllotDo() {
      var self = this;
      // 判断是否选了父频道，子频道未选择
      var list_news = self.channel_list_news;
      let isNoOneSelect = false;
      let noArr = [];
      for (let item of list_news) {
        if (item.select && item.subList) {
          let isNoSelectAll = item.subList.every((item1) => {
            return !item1.select;
          });
          if (isNoSelectAll) {
            isNoOneSelect = true;
            noArr.push(item);
          }
        }
      }
      if (isNoOneSelect) {
        let strs = ''
        for (let item of noArr) {
          strs += (item.name + '，')
        }
        strs = strs.substring(0, strs.length-1);
        this.$message({type: 'warning', message: `${strs}频道未选择子频道，请选择后再保存`, showClose: true});
        return;
      }
      // 处理
      for (var i = 0; i < list_news.length; i++) {
        if (list_news[i].select) {
          list_news[i].perm = 0
        } else {
          list_news[i].perm = 1
        }
        if (list_news[i].subList) {
          for (var k = 0; k < list_news[i].subList.length; k++) {
            if (list_news[i].subList[k].select) {
              list_news[i].subList[k].perm = 0
            } else {
              list_news[i].subList[k].perm = 1
            }
          }
        }
      }

      var list_video = self.channel_list_video;
      for (var i = 0; i < list_video.length; i++) {
        if (list_video[i].select) {
          list_video[i].perm = 0
        } else {
          list_video[i].perm = 1
        }
      }
      self.$loading();
      self.$jqAjax({
        url: apiHost + "/func/setUserChannel",
        type: "POST",
        data: {
          id: self.allot_id,
          channelList: JSON.stringify({
            news: list_news,
            video: list_video
          }),
        },
        success: function (data) {
          self.$loading().close();
          if (data.code == 0) {
            self.$message({
              type: "success",
              message: "操作成功",
              showClose: 'true',
            })
            self.channel_allot_visible = false;
            self.getAccountList();
          } else {
            self.$message({
              type: "error",
              message: "操作失败",
              showClose: 'true',
            })
          }
        },
        error(error) {
          self.$loading().close();
          self.$message({
            type: "error",
            message: "请求失败",
            showClose: 'true',
          })
        }
      });
    },
    changePsw (id) {
      this.$prompt('请输入新密码：', '重置',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputPattern: /\s/,
        inputErrorMessage: '密码格式不正确',
        closeOnClickModal: false,
        inputValidator: (e) => {
          if (e) {
            return true;
          } else {
            return false;
          }
        }
      }).then(({value}) => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/user/updatePassword',
          type: 'POST',
          data: {
            id: id,
            pwd: MD5(value)
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({type: 'success', message: '修改成功', showClose:true});
              this.getAccountList();
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
    queryAccountList () {
      this.account_page_num = 1;
      this.getAccountList();
    },
    enableDisableFun (row) {
      this.$confirm(`确定${row.status==1?'启用':'禁用'}该账号？`, `${row.status==1?'启用':'禁用'}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$jqAjax({
          url: apiHost + '/user/updateStatus',
          type: 'POST',
          data: {
            id: row.id,
            status: row.status == 1? 0: 1 // 0:启用，1：禁用
          },
          success: (res) => {
            if (res.code == '0') {
              this.$message({type: 'success', message: `该账号已${row.status == 1?'启用':'禁用'}`,showClose: true})
              this.queryAccountList();
            }
          },
          error: (err) => {
            this.$message({type: 'error', message: '操作失败', showClose: true});
          }
        });
      });
    }
  }
}
</script>

<style lang="scss">
#collecting {
  .el-dialog {
    .el-checkbox {
      width: 140px;
      margin: 5px;
      &:last-of-type {
        margin-right: 6px;
      }
    }

    .children {
      margin-left: 25px;
    }
    h3 {
      font-size: 16px;
      color: #999;
      margin-bottom: 10px;
    }
  }
}
</style>
