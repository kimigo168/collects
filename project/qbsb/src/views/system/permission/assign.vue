<template>
  <div id="assign">
    <div class="tab" v-model="tab_index">
      <el-tabs>
        <el-tab-pane label="权限分配" name="0">
          <div class="content">
            <div class="tree">
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
            </div>
            <div class="btn">
              <el-button type="primary">提交</el-button>
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
        tab_index: '0',
        permission_list: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
      }
    },
    created() {
      this.permissionList(this.$route.query.id)
    },
    methods: {
      //获取权限列表
      permissionList(id) {
        var self = this;
        self.assign_id = id;
        self.permission_assign_visible = true;
        self.$jqAjax({
          url: apiHost + "/func/getRolefunc",
          type: "POST",
          data: {
            id: id
          },
          success: function (data) {
            if (data.code == 0) {
              self.permission_list = data.data;
              var list = data.data;
              var arr = [];
              for (var i = 0; i < list.length; i++) {
                if (list[i].children) {
                  var list_sub = list[i].children;
                  for (var k = 0; k < list_sub.length; k++) {
                    if (list_sub[k].children) {
                      var list_sub_sub = list_sub[k].children;
                      for (var j = 0; j < list_sub_sub.length; j++) {
                        if (list_sub_sub[j].perm == 0) {
                          arr.push(list_sub_sub[j].id)
                        }
                      }
                    }
                  }
                }
              }
              console.log(arr);
              self.$refs.tree.setCheckedKeys(arr)
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

      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
        console.log(1);
        if (checked || indeterminate) {
          data.perm = 0
        } else {
          data.perm = 1
        }
      },

      permissionAssignDo() {
        var self = this;
        self.$jqAjax({
          url: apiHost + "/func/setRolefunc",
          type: "POST",
          data: {
            funcList: JSON.stringify(self.permission_list),
            id: self.assign_id,
          },
          success: function (data) {
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
            self.$message({
              type: "error",
              message: "请求失败",
              showClose: 'true',
            })
          }
        });
      },
    }
  }
</script>

<style lang="scss">
  #assign {
    .tree {
      padding-left: 20px;
    }
  }
</style>