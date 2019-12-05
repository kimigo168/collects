<template>
  <div id="role">
    <div class="tab">
      <el-tabs  v-model="tab_index">
        <el-tab-pane label="角色管理" name="0">
          <div class="content">
            <div class="operate operate20 clearfix">
              <div class="btn rt">
                <el-button type="primary" @click="roleOperate(undefined)">新增角色</el-button>
              </div>
            </div>
            <div class="table">
              <el-table
                  :data="role_list"
                  style="width: 100%">
                <el-table-column align="center" prop="name" label="角色名称"></el-table-column>
                <el-table-column align="center" prop="description" label="角色描述"></el-table-column>
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
                      <el-button type="text" class="wran-color"
                                 @click="permissionAssign(scope.row.id)">权限分配
                      </el-button>
                      <el-button type="text" class="wran-color" @click="roleOperate(scope.row)">编辑
                      </el-button>
                    </p>
                    <p>
                      <el-button type="text" class="danger-color" @click="delRole(scope.row)">删除</el-button>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog v-loading.lock="loading" title="菜单权限" :visible.sync="permission_assign_visible" width="50%">
      <p style="margin-bottom:4px;">
        <el-checkbox v-model="roleCheckedAll" @change="roleSelectAllChange">全选</el-checkbox>
      </p>
      <el-tree
          :data="permission_list"
          @check-change="handleCheckChange"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permission_assign_visible = false">取 消</el-button>
        <el-button type="primary" @click="permissionAssignDo">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="!role_edit_row.id ? '新增角色' : '编辑角色'" :visible.sync="role_operate_visible" width="30%">
      <el-form :model="role_operate_form" ref="role_operate_form" :rules="role_operate_form_rules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input type="text" v-model="role_operate_form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述: ">
          <el-input type="textarea" :rows="2" v-model="role_operate_form.desc"
                    placeholder="请简要描述角色(选填)">
          </el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="role_operate_form.status" :disabled="!role_edit_row.id">
            <el-option label="启用" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="role_operate_visible = false">取 消</el-button>
        <el-button type="primary" @click="roleOperateDo('role_operate_form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tab_index: 0,
        role_list: [],

        //权限分配
        permission_assign_visible: false,
        permission_list: [],
        roleCheckedAll: false,
        //新增-编辑角色
        role_operate_visible: false,
        role_operate_form: {
          name: '',
          desc: '',
          status: '',
        },
        role_operate_form_rules: {
          name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 1, max: 11, message: '长度在 1 到 11 个字符', trigger: 'blur' }
          ]
        },
        role_edit_row: {},

        defaultProps: {
          children: 'children',
          label: 'name'
        },
        assign_id: '',
        loading: false
      }
    },
    created() {
      this.getRoleList();
    },
    methods: {
      // 权限全选
      roleSelectAllChange () {
        if (this.roleCheckedAll) { // 全选
          let arr = [];
          this.permission_list.map((item, index) => {
            if (item.children) {
              let list_sub = item.children;
              list_sub.map((item1, index1) => {
                if (item1.children) {
                  let list_sub_sub = item1.children;
                  list_sub_sub.map((item2, index2) => {
                    this.$set(this.permission_list[index].children[index1].children[index2], 'perm', 0);
                    arr.push(item2.id);
                  });
                }
              });
            }
          });
          this.$refs.tree.setCheckedKeys(arr)
        } else { // 取消全选
          this.permission_list.map((item, index) => {
            if (item.children) {
              let list_sub = item.children;
              list_sub.map((item1, index1) => {
                if (item1.children) {
                  let list_sub_sub = item1.children;
                  list_sub_sub.map((item2, index2) => {
                    this.$set(this.permission_list[index].children[index1].children[index2], 'perm', 1);
                  });
                }
              });
            }
          });
          this.$refs.tree.setCheckedKeys([])
        }
      },
      //获取角色数据列表
      getRoleList() {
        var self = this;
        self.$jqAjax({
          url: apiHost + "/role/list",
          type: "POST",
          data: {},
          success: function (data) {
            if (data.code == 0) {
              try {
                self.role_list = data.data;
              } catch (e) {
                console.log(e);
              }
            } else {
              self.$message({
                type: "error",
                message: "请求失败",
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
      },

      //角色新增和修改
      roleOperate(row) {
        this.role_operate_visible = true;
        if (row) {
          this.role_edit_row = row;
          this.role_operate_form.name = row.name;
          this.role_operate_form.desc = row.description;
          this.role_operate_form.status = row.status;
        } else {
          this.role_edit_row = {};
          this.role_operate_form.name = "";
          this.role_operate_form.desc = "";
          this.role_operate_form.status = "0";
        }
      },

      //角色新增和修改提交
      roleOperateDo(formName) {
        var self = this;
        self.$refs[formName].validate(valid => {
          if (valid) {
            self.$loading();
            self.$jqAjax({
              url: !self.role_edit_row.id ? apiHost + "/role/add" : apiHost + "/role/update",
              type: "POST",
              data: {
                name: self.role_operate_form.name,
                description: self.role_operate_form.desc,
                status: self.role_operate_form.status,
                id: self.role_edit_row.id || null,
              },
              success: function (data) {
                self.$loading().close();
                if (data.code == 0) {
                  self.$message({
                    type: "success",
                    message: "操作成功",
                    showClose: 'true',
                  })
                  self.getRoleList();
                  self.role_operate_visible = false;
                } else {
                  self.$message({
                    type: "error",
                    message: "请求失败",
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
      rolePageNumChange(val) {
        this.role_page_num = val;
      },
      addRole() {
        this.role_operate_visible = true;
      },
      editRole(row) {
        this.role_operate_visible = true;
      },

      //获取权限列表
      permissionAssign(id) {
        var self = this;
        self.assign_id = id;
        self.permission_assign_visible = true;
        self.roleCheckedAll = false;
        self.loading = true;
        self.$jqAjax({
          url: apiHost + "/func/getRolefunc",
          type: "POST",
          data: {
            id: id
          },
          success: function (data) {
            self.loading = false;
            if (data.code == 0) {
              self.permission_list = data.data;
              var list = data.data;
              var arr = [];
              var noSelectArr = []; // 未选中的
              for (var i = 0; i < list.length; i++) {
                if (list[i].children) {
                  var list_sub = list[i].children;
                  for (var k = 0; k < list_sub.length; k++) {
                    if (list_sub[k].children) {
                      var list_sub_sub = list_sub[k].children;
                      for (var j = 0; j < list_sub_sub.length; j++) {
                        if (list_sub_sub[j].perm == 0) {
                          arr.push(list_sub_sub[j].id)
                        } else {
                          noSelectArr.push(list_sub_sub[j].id)
                        }
                      }
                    }
                  }
                }
              }
              if (noSelectArr.length == 0) {
                self.roleCheckedAll = true; // 全选
              } else {
                self.roleCheckedAll = false;
              }
          
              self.$refs.tree.setCheckedKeys(arr)
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

      handleCheckChange(data, checked, indeterminate) {
        if (checked || indeterminate) {
          data.perm = 0
        } else {
          data.perm = 1
        }
        // 计算是否有全选
        var noSelectArr = []; // 未选中的
        let arr = [];
        let list = this.permission_list;
        for (var i = 0; i < list.length; i++) {
          if (list[i].children) {
            var list_sub = list[i].children;
            for (var k = 0; k < list_sub.length; k++) {
              if (list_sub[k].children) {
                var list_sub_sub = list_sub[k].children;
                for (var j = 0; j < list_sub_sub.length; j++) {
                  if (list_sub_sub[j].perm == 0) {
                    arr.push(list_sub_sub[j].id)
                  } else {
                    noSelectArr.push(list_sub_sub[j].id)
                  }
                }
              }
            }
          }
        }
        if (noSelectArr.length == 0) {
          this.roleCheckedAll = true; // 全选
        } else {
          this.roleCheckedAll = false;
        }
      },

      permissionAssignDo() {
        var self = this;
        this.$loading();
        self.$jqAjax({
          url: apiHost + "/func/setRolefunc",
          type: "POST",
          data: {
            funcList: JSON.stringify(self.permission_list),
            id: self.assign_id,
          },
          success: function (data) {
            self.$loading().close();
            if (data.code == 0) {
              self.$message({
                type: "success",
                message: "操作成功",
                showClose: 'true',
              })
              self.getRoleList();
              self.permission_assign_visible = false;
            } else {
              self.$message({
                type: "error",
                message: "请求失败",
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
      delRole (row) { // 删除角色
        this.$confirm('确定删除该角色吗？', '确定删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$jqAjax({
            url: apiHost + "/role/del",
            type: "POST",
            data: {
              id: row.id
            },
            success: (res) => {
              this.$message({ type: 'success', message: `删除成功`, showClose: true });
              this.getRoleList();
            },
            error: (err) => {
              this.$message({ type: 'error', message: '操作失败', showClose: true});
            }
          })
        });
      }
    }
  }
</script>

<style lang="scss">
  #role {
    .el-tree-node__label {
      padding-left: 10px;
    }
  }
</style>
