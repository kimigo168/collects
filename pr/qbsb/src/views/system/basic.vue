<template>
  <div id="basic">
    <div class="tab">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="用户协议" name="1">
          <div class="content">
            <div class="clearfix top">
              <div class="btn">
                <el-button type="primary" v-show="btn_show" @click="btn_show = false; is_edit = false">修改</el-button>
                <el-button type="primary" v-show="!btn_show" @click="save" :disabled="protocol == ''">保存</el-button>
                <el-button type="primary" v-show="!btn_show" @click="btn_show = true; is_edit = true">取消</el-button>
              </div>
            </div>
            <div class="protocol-content">
              <el-input type="textarea" v-model="protocol" :rows="30" :disabled="is_edit"></el-input>
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
      tab_index: '1',
      id: '',
      protocol: '',
      btn_show: true,
      is_edit: true,
    }
  },
  created: function () {
    this.getProtocolList();
  },
  methods: {
    //获取协议内容
    getProtocolList() {
      this.$jqAjax({
        url: apiHost + '/omsUserProtocol/query',
        type: 'post',
        data: {
          id: 1 // 1:用户协议，2：隐私协议
        },
        success: (res) => {
          if (res.code == 0 && res.data) {
            this.id = res.data.id;
            this.protocol = res.data.content;
          }
        },
        error: (err) => {
          this.$message({type: 'error', message: err.msg, showClose: true})
        }
      })
    },

    //保存修改后的协议
    save() {
      var self = this;
      self.$confirm('是否确认修改的内容？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$ajax({
          url: '/omsUserProtocol/add',
          type: 'post',
          data: {
            id: self.id,
            content: self.protocol,
          },
          success: function (data) {
            if (data.code == 0) {
              self.$message({
                type: 'success',
                message: '修改成功!',
                showClose: 'true'
              });
              self.btn_show = true;
              self.is_edit = true;
            }
            if (data.code == 9001) {
              self.$message.error('登录失效，请重新登录')
              setTimeout(function () {
                self.$router.push('/')
              }, 3000)
            }
          },
          error: function (err) {
          }
        })
      });
    }
  }
}
</script>

<style lang="scss">
#basic {
  .top {
    padding: 10px 0;

    .btn {
      float: right;
    }
  }
  .protocol-content {
    padding-bottom: 30px;
    .el-textarea {
      line-height: 30px;
    }
  }
}
</style>
