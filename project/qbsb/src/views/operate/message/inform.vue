<template>
  <div id="">
    <div class="tab">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="消息通知" name="0"></el-tab-pane>
      </el-tabs>
      <div class="content">
        <div class="operate operate20">
          <div class="search lt">
            <el-form :inline="true" :model="message_search_form">
              <el-form-item label="时间">
                <el-date-picker
                    v-model="message_search_form.date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-input type="text" v-model="message_search_form.content" placeholder="消息内容"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getMessageList()">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="btn rt">
            <el-button type="primary" @click="add_message_visible=true">新增通知</el-button>
          </div>
        </div>
        <div class="table">
          <el-table :data="message_list" style="width: 100%">
            <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
            <el-table-column align="center" prop="content" label="消息内容"></el-table-column>
            <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
            <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
            <el-table-column align="center" label="操作" width="170">
              <template slot-scope="scope">
                <el-button type="text" class="danger-color" @click="removeMessage(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <el-dialog title="新增通知" :visible.sync="add_message_visible" width="30%">
      <el-form :model="add_message_form" :rules="add_message_form_rule" ref="add_message_form" label-width="80px">
        <el-form-item label="消息内容" prop="content">
          <el-input v-model="add_message_form.content" type="textarea" :rows="8"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addMessageDo">保存</el-button>
          <el-button @click="add_message_visible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tab_index: '0',
        message_search_form: {
          time: "",
          content: "",
        },
        message_list: [],

        add_message_visible: false,
        add_message_form: {
          content: '',
        },
        add_message_form_rule: {
          content: [
            {required: true, message: '请输入消息内容', trigger: 'blur'},
          ],
        }

      }
    },
    created() {
      this.getMessageList();
    },
    methods: {
      //获取通知列表数据
      getMessageList() {
        var self = this;
        self.$ajax({
          type: 'POST',
          url: '/notice/list',
          data: {
            timeStart: !self.message_search_form.date ? '' : self.message_search_form.date[0],
            timeEnd: !self.message_search_form.date ? '' : self.message_search_form.date[1],
          },
          success: function (res) {
            if (res.code == 0) {
              self.message_list = res.data;
            } else {
              self.$message({
                type: 'error',
                message: '请求失败',
                showClose: 'true'
              })
            }
          },
          error: function (err) {
            console.log(err);
            self.$message({
              type: 'error',
              message: '请求失败',
              showClose: 'true'
            })
          }
        })
      },

      addMessageDo() {
        var self = this;
        self.$refs.add_message_form.validate((valid) => {
          if (valid) {
            self.$ajax({
              url: "/notice/add",
              type: "POST",
              data: {
                content: self.add_message_form.content
              },
              success: function (res) {
                self.add_message_visible = false;
                if (res.code == 0) {
                  self.$message({
                    type: 'success',
                    message: '新增成功',
                    showClose: 'true',
                  })
                  self.getMessageList();
                } else {
                  self.$message({
                    type: 'error',
                    message: '新增失败',
                    showClose: 'true',
                  })
                }
              },
              error: function (err) {
                self.$message({
                  type: 'error',
                  message: '请求失败',
                  showClose: 'true',
                })
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      //删除通知
      removeMessage(id) {
        var self = this;
        self.$confirm('确定删除该条记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$ajax({
            url: "/notice/delete",
            type: "GET",
            data: {
              id: id
            },
            success: function (res) {
              if (res.code == 0) {
                self.$message({
                  type: 'success',
                  message: '删除成功',
                  showClose: 'true',
                })
                self.getMessageList();
              } else {
                self.$message({
                  type: 'error',
                  message: '删除失败',
                  showClose: 'true',
                })
              }
            },
            error: function (err) {
              self.$message({
                type: 'error',
                message: '请求失败',
                showClose: 'true',
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>

<style lang="scss">

</style>
