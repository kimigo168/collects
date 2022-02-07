<template>
  <div id="classify">
    <div class="tab">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="平台分类" name="1">
          <div class="content">
            <div class="operate clearfix">
              <div class="btn lt">
                <el-button type="primary" @click="classifyOperate(undefined)">新建分类</el-button>
              </div>
            </div>
            <div class="table">
              <el-table :data="classify_list">
                <el-table-column align="center" type="index" label="序号" width="105"></el-table-column>
                <el-table-column align="center" prop="name" label="分类名称"></el-table-column>
                <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="" label="操作" width="150">
                  <template slot-scope="scope">
                    <el-button type="text" @click="classifyOperate(scope.row)">修改</el-button>
                    <el-button type="text" v-if="scope.row.status == 0" @click="shieldOperate(scope.row)">屏蔽</el-button>
                    <el-button type="text" v-if="scope.row.status == 1" @click="shieldOperate(scope.row)">取消屏蔽
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!--新建/修改分类-->
    <el-dialog :title="!operate_row.id ? '新建分类' : '修改分类'" :visible.sync="operate_classify_visible">
      <el-form :model="operate_classify_form" ref="operate_classify_form" :rules="operate_classify_form_rules"
               label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input type="text" v-model="operate_classify_form.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="operate_classify_visible = false">取 消</el-button>
        <el-button type="primary" @click="classifyOperateDo()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tab_index: '1',
        classify_list: [],

        //新建/修改分类
        operate_classify_visible: false,
        operate_classify_form: {
          name: '',
        },
        operate_classify_form_rules: {
          name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
            {min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur'}
          ]
        },
        operate_row: {},
      }
    },
    created() {
      this.getClassifyList();
    },
    methods: {
      //获取平台号列表数据
      getClassifyList() {
        var self = this;
        self.$ajax({
          url: "/platform/typeList",
          type: "POST",
          data: {},
          success: function (data) {
            if (data.code == 0) {
              self.classify_list = data.data;
            }
          },
          error: function (error) {
          }
        })
      },

      // 新建修改分类
      classifyOperate(row) {
        this.operate_classify_visible = true;
        if (row) {
          this.operate_row = row;
          this.operate_classify_form.name = row.name;
        } else {
          this.operate_classify_form.name = '';
          this.operate_row = {};
        }
      },
      classifyOperateDo() {
        var self = this;
        self.$refs.operate_classify_form.validate(function (valid) {
          if (valid) {
            let url, data, type;
            if (!self.operate_row.id) {
              url = '/platform/addType';
              data = {
                name: self.operate_classify_form.name
              };
              type = 'GET'
            } else {
              url = '/platform/updateType';
              data = {
                name: self.operate_classify_form.name,
                id: self.operate_row.id
              };
              type = 'POST'
            }
            self.$ajax({
              url: url,
              type: type,
              data: data,
              success: function (data) {
                if (data.code == 0) {
                  self.operate_classify_visible = false;
                  self.getClassifyList();
                } else {
                  self.$message({
                    type: 'error',
                    message: data.msg,
                    showClose: 'true'
                  })
                }
              },
              error: function (error) {
                self.$message({
                  type: 'error',
                  message: data.msg,
                  showClose: 'true'
                })
              }
            })
          } else {
            console.log("submit error");
          }
        })
      },

      //屏蔽取消屏蔽
      shieldOperate(row) {
        let self = this;
        let txt;
        if (row.status == 0) {
          txt = '屏蔽'
        } else {
          txt = '取消屏蔽'
        }
        self.$confirm("确认" + txt + "该分类吗?", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$ajax({
            url: "/platform/updateType",
            type: "POST",
            data: {
              id: row.id,
              status: row.status == 0 ? 1 : 0,
            },
            success: function (data) {
              if (data.code == 0) {
                self.getClassifyList();
                self.$message({
                  type: 'success',
                  message: '操作成功!',
                  showClose: 'true'
                });
              } else {
                self.$message({
                  type: 'error',
                  message: '操作失败!',
                  showClose: 'true'
                });
              }
            },
            error: function (error) {
              self.$message({
                type: 'error',
                message: '操作失败!',
                showClose: 'true'
              });
            }
          })

        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>

<style scoped>

</style>