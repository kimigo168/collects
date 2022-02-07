<template>
  <div id="collecting">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="操作日志" name="0">
          <div class="content">
            <div class="operate operate20 clearfix">
              <div class="search">
                <el-form :inline="true" :model="log_operate_form">
                  <el-form-item label="时间">
                    <el-date-picker
                        v-model="log_operate_form.date"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="操作人">
                    <el-input type="text" v-model="log_operate_form.createUser" placeholder="操作人"></el-input>
                  </el-form-item>
                  <el-form-item label="IP地址">
                    <el-input type="text" v-model="log_operate_form.ip" placeholder="IP地址"></el-input>
                  </el-form-item>
                  <el-form-item label="操作记录">
                    <el-input type="text" v-model="log_operate_form.operate" placeholder="操作记录"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table
                  :data="log_list"
                  style="width: 100%">
                <el-table-column align="center" prop="createName" label="操作人"></el-table-column>
                <el-table-column align="center" prop="createTime" label="操作时间"></el-table-column>
                <el-table-column align="center" prop="ipCode" label="IP地址"></el-table-column>
                <el-table-column align="center" prop="code" label="操作编号"></el-table-column>
                <el-table-column align="center" prop="operate" label="操作记录"></el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="log_page_totle > 0">
              <el-pagination
                  @current-change="logPageNumChange"
                  :current-page.sync="log_page_num"
                  :page-size="log_page_size"
                  layout="prev, pager, next, jumper"
                  :total="log_page_totle">
              </el-pagination>
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
        loading: false,
        tab_index: 0,
        log_operate_form: {
          date: "",
          column: "",
          createUser: '',
          ip: '',
          operate: ''
        },
        log_list: [],
        log_page_num: 1,
        log_page_size: 10,
        log_page_totle: 0,
      }
    },
    created() {
      this.getLogList();
    },
    methods: {
      //获取操作记录列表
      getLogList() {
        var self = this;
        this.log_list = [];
        this.log_page_totle = 0;
        this.loading = true;
        self.$ajax({
          url: "/omsLog/logList",
          type: "POST",
          data: {
            createUser: self.log_operate_form.createUser,
            ip: self.log_operate_form.ip,
            operate: self.log_operate_form.operate,
            pageNum: self.log_page_num,
            pageSize: self.log_page_size,
            timeStart: !self.log_operate_form.date ? '' : self.log_operate_form.date[0],
            timeEnd: !self.log_operate_form.date ? '' : self.log_operate_form.date[1],
          },
          success: function (data) {
            self.loading =false;
            if (data.code == 0) {
              try {
                self.log_list = data.data.list;
                self.log_page_totle = data.data.total;
              } catch (e) {
                console.log(e);
              }
            }
          }
          ,
          error(error) {
            self.loading =false;
            self.sensitive_list = [];
            self.sensitive_page_total = 0;
            self.$message({
              type: "error",
              message: "请求失败",
              showClose: 'true',
            })
          }
        })
        ;
      },
      logPageNumChange(val) {
        this.log_page_num = val;
        this.getLogList();
      },
      queryList () {
        this.log_page_num = 1;
        this.getLogList();
      }
    }
  }
</script>

<style lang="scss">
  #collecting {

  }
</style>
