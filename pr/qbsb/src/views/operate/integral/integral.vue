<template>
  <div id="integral">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="积分管理" name="0">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="integral_search_form">
                  <el-form-item label="项目名称">
                    <el-input type="text" v-model="integral_search_form.name" placeholder="请输入项目名称"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryIntegral">搜索</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="integral_list" style="width:100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="name" label="项目"></el-table-column>
                <el-table-column align="center" prop="integral" label="积分数"></el-table-column>
                <el-table-column align="center" prop="code" label="积分code"></el-table-column>
                <el-table-column align="center" prop="createTime" label="状态">
                  <template slot-scope="scope">
                    {{scope.row.status==0?'正常':scope.row.status==1?'禁用':''}}
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="address" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="editIntegral(scope.row)">修改积分</el-button>
                    <el-button type="text" @click="disableFun(scope.row)">{{scope.row.status==1?'启用':scope.row.status==0?'禁用':''}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page">
              <el-pagination @current-change="articlePageNumChange1" :current-page.sync="integral_page_num" :page-size="integral_page_size" layout="total, prev, pager, next, jumper" :total="integral_page_total"></el-pagination>
            </div>
          </div>
        </el-tab-pane>  
      </el-tabs> 
    </div>
  </div>
</template>
<script>
export default {
  name: 'integral',
  data () {
    return {
      loading: false,
      tab_index: 0,
      integral_search_form: {
        name: ''
      },
      integral_list: [],
      integral_page_num: 1,
      integral_page_size: 10,
      integral_page_total: 0
    }
  },
  methods: {
    articlePageNumChange1 (val) {
      this.integral_page_num = val;
      this.getIntegralList();
    },
    queryIntegral () {
      this.integral_page_num = 1;
      this.getIntegralList();
    },
    getIntegralList () {
      this.loading = true;
      this.integral_list = [];
      this.$jqAjax({
        url: apiHost + '/integral_config/list',
        type: 'POST',
        data: {
          pageNum: this.integral_page_num,
          pageSize: this.integral_page_size,
          name: this.integral_search_form.name
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            this.integral_list = res.data.list;
            this.integral_page_total = res.data.total;
          } else {
            this.$message({type: 'error', message: '请求失败', showClose: true});
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({type: 'error', message: '请求失败', showClose: true});
        }
      });
    },
    editIntegral (row) {
      const h = this.$createElement;
      this.$msgbox({
        title: '修改积分项',
        message: h('div', {style: 'margin: 10px 10px;line-height:24px;'}, [
          h('p', {style:'margin-bottom:20px;'}, [
            h('span',{style: 'color: #333;display:inline-block;width:70px;text-align:right;margin-right:10px;'}, '项目'),
            h('input', {style:'color: #000;width:220px;height:24px;text-indent:4px;line-height:24px;', attrs: {placeholder:'必填',value:`${row.name}`}, ref:"proName", key: `${new Date().getTime()}`},'')
          ]),
          h('p', {}, [
            h('span',{style: 'color: #333;display:inline-block;width:70px;text-align:right;margin-right:10px;'}, '积分数量'),
            h('input', {style:'color: #000;width:220px;height:24px;text-indent:4px;line-height:24px;', attrs: {placeholder:'必填',value:`${row.integral}`}, ref:"integralNum", key: `${new Date().getTime()}`},'')
          ])
        ]),
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            let proName = this.$refs.proName.value;
            let integral = parseInt(this.$refs.integralNum.value);
            if (!proName) {
              this.$message({type:'error', message: '请输入积分项', showClose: true});
              return;
            }
            if (!integral && integral !== 0) {
              this.$message({type:'error', message: '请输入数量', showClose: true});
              return;
            }
            this.$loading();
            this.$jqAjax({
              url: apiHost + '/integral_config/update_integral',
              type: 'POST',
              data: {
                id: row.id,
                integral: integral,
                name: proName
              },
              success: (res) => {
                this.$loading().close();
                if (res.code == 0) {
                  this.$message({type: 'success', message: '修改成功', showClose: true});
                  this.queryIntegral();
                } else {
                  this.$message({type: 'error', message: res.msg, showClose: true});
                }
              },
              error: (err) => {
                this.$loading().close();
                this.$message({type: 'error', message: res.msg, showClose: true});
              }
            });
          }
          done();
        }
      });

    },
    disableFun (row) {
      this.$confirm(`确定${row.status==0?'禁用':'启用'}该积分项吗？`, `${row.status==0?'禁用':'启用'}`,{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/integral_config/update_status',
          type: 'POST',
          data: {
            id: row.id,
            status: row.status == 0 ? 1: 0
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({type: 'success', message: `${row.status==0?'已禁用':'已启用'}`, showClose: true});
              this.queryIntegral();
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({type: 'error', message: '操作失败', showClose: true});
          }
        });
      });
    }
  },
  created () {
    this.getIntegralList();
  }
}
</script>
