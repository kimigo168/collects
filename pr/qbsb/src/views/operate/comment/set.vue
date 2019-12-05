<template>
    <div id="comment-set">
      <div class="tab" v-loading.lock="loading">
        <el-tabs>
          <el-tab-pane label="审核设置" name="0">
            <div class="content">
              <span>是否由系统自动审核：</span>
              <el-tooltip :content="value" placement="top">
                <el-switch
                  @change = "swithBack"
                  v-model="value"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value="是"
                  inactive-value="否">
                </el-switch>
              </el-tooltip>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
              value:'否',
              id: '',
              loading: false
            }
        },
        methods: {
          swithBack () {
            console.log('val', this.value)
            this.approveSwitch();
          },
          querySet () {
            this.loading = true;
            this.$ajax({
              url: '/comment/selectApproveSwitch',
              type: 'GET',
              data: {},
              success: (res) => {
                this.loading = false;
                if (res.code == 0) {
                  this.value = res.data.value == 1 ? '是': '否'
                  this.id = res.data.id;
                }
              },
              error: (err) => {
                this.loading = false;
              }
            });
          },
          approveSwitch () {
            this.$jqAjax({
              url: apiHost + '/comment/autoApproveSwitch',
              type: 'POST',
              data: {
                id: this.id,
                value: this.value == '是' ? 1 : 0
              },
              success: (res) => {
                if (res.code == 0) {
                  this.$message({type: 'success', message: this.value=='是'?'已开启':'已关闭', showClose: true});
                }
              },
              error: (err) => {
                this.$message({type: 'error', message: err.msg, showClose: true});
              }
            });
          }

        },
        created () {
          this.querySet();
        }
    }
</script>

<style>
#comment-set .content{
  padding:30px;
}
</style>
