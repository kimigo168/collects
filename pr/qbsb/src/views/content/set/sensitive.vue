<template>
  <div id="sensitive">
    <div class="tab">
      <el-tabs  v-model="tab_index">
        <el-tab-pane label="敏感词库" name="0">
          <div class="content">
            <div class="operate operate20">
              <div class="search">
                <el-form :inline="true" :model="sensitive_search_form">
                  <el-form-item label="敏感词">
                    <el-input type="text" v-model="sensitive_search_form.sensitive" placeholder="输入敏感词查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="sensitive_page_num = 1;getSensitiveList()">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="btn">
                <el-button type="primary" @click="sensitiveOperate(undefined)">新增敏感词</el-button>
                <el-button type="primary" style="position:relative;">批量导入<input accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" @change="selectChange" type="file" class="uploadBtn"></el-button>
              </div>
            </div>
            <div class="table">
              <el-table
                  :data="sensitive_list"
                  style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="keyword" label="敏感词" width=""></el-table-column>
                <!--<el-table-column align="center" prop="title" label="分类"></el-table-column>-->
                <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="address" label="操作">
                  <template slot-scope="scope">
                    <!-- <el-button type="text" @click="sensitiveOperate(scope.row)">编辑</el-button> -->
                    <el-button type="text" class="danger-color" @click="sensitiveDelete(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="sensitive_page_total > 0">
              <el-pagination
                  @current-change="sensitivePageNumChange"
                  :current-page.sync="sensitive_page_num"
                  :page-size="sensitive_page_size"
                  layout="prev, pager, next, jumper"
                  :total="sensitive_page_total">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog :title="!edit_row.id ? '新增敏感词' : '编辑敏感词'" :before-close="closeAddEdit" :close-on-click-modal="false" :visible.sync="operate_sensitive_visible" width="30%">
      <el-form :model="operate_sensitive_form" ref="operate_sensitive_form" :rules="operate_sensitive_form_rules"
               label-width="80px">
        <el-form-item label="敏感词" prop="sensitive">
          <el-input type="text" v-model="operate_sensitive_form.sensitive"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="operate_sensitive_visible = false">取 消</el-button>
        <el-button type="primary" @click="sensitiveOperateDo('operate_sensitive_form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tab_index: 0,
        sub_tab_index_1: 0,
        sensitive_search_form: {
          sensitive: "",
        },
        sensitive_list: [],
        sensitive_page_num: 1,
        sensitive_page_size: 10,
        sensitive_page_total: 0,

        //敏感词新增和编辑
        operate_sensitive_visible: false,
        operate_sensitive_form: {
          sensitive: "",
        },
        operate_sensitive_form_rules: {
          sensitive: [
            {required: true, message: '请输入敏感词', trigger: 'blur'},
            {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
          ],
        },
        edit_row: {}
      }
    },
    created() {
      this.getSensitiveList();
    },
    methods: {
      //敏感词库列表数据
      getSensitiveList() {
        var self = this;
        self.$ajax({
          url: "/sensitive/list",
          type: "POST",
          data: {
            pageNum: self.sensitive_page_num,
            pageSize: self.sensitive_page_size,
            keyword: self.sensitive_search_form.sensitive
          },
          success: function (data) {
            self.sensitive_list = [];
            self.sensitive_page_total = 0;
            if (data && data.code == 0) {
              if (data.data && data.data.list) {
                self.sensitive_list = data.data.list;
              }
              if (data.data && data.data.total || data.data && data.data.total == 0) {
                self.sensitive_page_total = data.data.total;
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
      sensitivePageNumChange(val) {
        this.sensitive_page_num = val;
        this.getSensitiveList();
      },

      //敏感词新增和编辑
      sensitiveOperate(row) {
        this.operate_sensitive_visible = true;
        this.operate_sensitive_form.sensitive = "";
        if (row) {
          this.edit_row = row;
          this.operate_sensitive_form.sensitive = row.keyword;
        } else {
          this.edit_row = {}
        }
      },
      sensitiveOperateDo(formName) {
        var self = this;
        self.$refs[formName].validate(valid => {
          if (valid) {
            var data = {
              keyword: self.operate_sensitive_form.sensitive
            }
            var url = "/sensitive/add";
            if (self.edit_row.id) {
              data.id = self.edit_row.id;
              url = "/sensitive/update"
            }
            self.$loading();
            self.$ajax({
              url: url,
              type: "POST",
              data: data,
              success: function (data) {
              self.$loading().close();
                if (data.code == 0) {
                  self.$message({
                    type: "success",
                    message: "操作成功",
                    showClose: 'true',
                  })
                  self.getSensitiveList();
                  self.operate_sensitive_visible = false;
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
                  message: data.msg,
                  showClose: 'true',
                })
              }
            });
          }
        })
      },
      closeAddEdit () {
        this.operate_sensitive_visible = false;
        this.$refs.operate_sensitive_form.resetFields();
      },
      //删除敏感词
      sensitiveDelete(id) {
        var self = this;
        self.$confirm('确认删除敏感词吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$ajax({
            url: "/sensitive/delete",
            type: "GET",
            data: {
              id: id
            },
            success: function (data) {
              if (data && data.code == 0) {
                self.$message({
                  type: "success",
                  message: "操作成功",
                  showClose: 'true',
                })
                self.getSensitiveList();
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      selectChange (e) {
        // console.log('上传改变了eeee', e)
        let file = e.target.files[0]
        // console.log('file', file)
        let formData = new FormData();
        formData.append('excel', file);
        // this.$axios({
        //   method: 'post',
        //   url: '/sensitive/batchAdd',
        //   data: formData,
        //   // headers: {
        //   //   'Content-type': 'multipart/form-data'
        //   // }
        // }).then((res) => {
        //   console.log('res', res);
        // }).catch((err) => {
        //   console.log('err')
        // })
        let self = this;
          var request = new XMLHttpRequest();
          request.open("POST", apiHost + '/sensitive/batchAdd');
          request.send(formData);
          request.onreadystatechange = function () {
            if (request.readyState == 4) {
              if (request.status == 200) {
                var data = JSON.parse(request.response);
                if (data.code == "0") {
                  self.getSensitiveList();
                } else {
                  self.$message({
                    showClose: true,
                    message: '上传失败,请重试',
                    type: 'error'
                  });
                }
              } else {
                self.$message({
                  showClose: true,
                  message: '上传失败,请重试',
                  type: 'error'
                });
              }
            }
          };
      }
    }
  }
</script>

<style lang="scss">
  #sensitive {
    .btn {
      .uploadBtn {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
      }
    }
  }
</style>
