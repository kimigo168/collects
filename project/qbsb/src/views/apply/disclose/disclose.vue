<template>
  <div id="disclose">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="用户爆料" name="0">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="disclose_search_form">
                  <el-form-item label="状态：">
                    <el-select v-model="disclose_search_form.status" @change="selectChange">
                      <el-option label="待回复" value="0"></el-option>
                      <el-option label="已回复" value="1"></el-option>
                      <el-option label="已删除" value="-1"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="时间：">
                    <el-date-picker v-model="disclose_search_form.time" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-input style="width:190px;" type="text" v-model="disclose_search_form.title" placeholder="请输入爆料标题搜索"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                  <el-form-item style="float:right;">
                    <el-button type="primary" @click="batchDelFun">批量删除</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="disclose_list" style="width:100%"  @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="brokeTitle" label="爆料标题"></el-table-column>
                <el-table-column align="center" prop="createTime" label="爆料时间"></el-table-column>
                <el-table-column align="center" prop="userName" label="爆料人"></el-table-column>
                <el-table-column align="center" prop="createTime" label="状态">
                  <template slot-scope="scope">
                    {{scope.row.status==0?'正常':scope.row.status==1?'禁用':''}}
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="contact" label="手机号"></el-table-column>
                <el-table-column align="center" prop="address" label="操作" >
                  <template slot-scope="scope" v-if="scope.row.status!=-1">
                    <el-button type="text" @click="viewDetail(scope.row)">详情</el-button>
                    <el-button v-if="scope.row.status==0" type="text" @click="reply(scope.row)">回复</el-button>
                    <el-button type="text" @click="delFun(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="disclose_page_total>0">
              <el-pagination @current-change="pageNumChange" :current-page.sync="disclose_page_num" :page-size="disclose_page_size" layout="total, prev, pager, next, jumper" :total="disclose_page_total"></el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <disclose-detail v-if="isShowDetail" :discloseId="discloseId" @fCloseDisclose="isShowDetail=false"></disclose-detail>
  </div>
</template>
<script>
import discloseDetail from './discloseDetail';
export default {
  name: 'disclose',
  data () {
    return {
      loading: false,
      tab_index: 0,
      disclose_search_form: {
        status: '0', // 0未回复，1已回复，-1已屏蔽
        time: [],
        title: ''
      },
      disclose_list: [],
      disclose_page_num: 1,
      disclose_page_size: 10,
      disclose_page_total: 0,
      multipleSelection: [],
      discloseId: '',
      isShowDetail: false
    }
  },
  components: {
    discloseDetail
  },
  methods: {
    selectChange () {
      console.log('disclose_search_form.status', this.disclose_search_form.status)
      this.queryList();
    },
    pageNumChange (val) {
      this.disclose_page_num = val;
      this.getList();
    },
    getList () {
      this.disclose_list = [];
      this.multipleSelection = [];
      this.loading = true;
      this.$jqAjax({
        url: apiHost + '/broke/list',
        type: 'POST',
        data: {
          pageNum: this.disclose_page_num,
          pageSize: this.disclose_page_size,
          status: this.disclose_search_form.status,
          brokeTitle: this.disclose_search_form.title,
          startTime: this.disclose_search_form.time&&this.disclose_search_form.time[0]?(this.disclose_search_form.time[0]+' 00:00:00'):'',
          endTime: this.disclose_search_form.time&&this.disclose_search_form.time[1]?(this.disclose_search_form.time[1]+ ' 23:59:50'):''
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            this.disclose_list = res.data.list;
            this.disclose_page_total = res.data.count;
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({type: 'error', message: '请求失败', showClose: true});
        }
      });
    },
    queryList () {
      this.disclose_page_num = 1;
      this.getList();
    },
    viewDetail (row) {
      this.discloseId = row.id;
      this.isShowDetail = true;
    },
    reply (row) {
      const h = this.$createElement;
      this.$msgbox({
        title: '管理员回复',
        message: h('div', {style: 'margin:10px 10px 20px 10px;'}, [
          h('textarea', {style: 'width:100%;height:80px;line-height:20px;padding:0 4px;',attrs: {placeholder: '请输入回复内容（限200个汉字）',maxlength:200}, ref: 'replayContent', key:`${new Date().getTime()}`})
        ]),
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            let replayContent = this.$refs.replayContent.value;
            if (!replayContent) {
              this.$message({type:'error', message: '请输入回复内容', showClose: true});
              return;
            }
            this.$loading();
            this.$jqAjax({
              url: apiHost + '/broke/reply',
              type: 'POST',
              data: {
                comment: replayContent,
                id: row.id
              },
              success: (res) => {
                this.$loading().close();
                if (res.code == 0) {
                  this.$message({type: 'success', message: '回复成功', showClose: true});
                  this.queryList();
                }
              },
              error: (err) => {
                this.$loading().close();
                this.$message({type: 'error', message: '操作失败', showClose: true});
              }
            });
          }
          done();
        }
      });

    },
    batchDelFun () {
      if (this.multipleSelection.length == 0) {
        this.$message({type: 'warning', message: '请选择要删除的项', showClose: true});
        return;
      }
      let ids = '';
      for (let item of this.multipleSelection) {
        ids += (item.id + ',');
      }
      ids = ids.substring(0, ids.length - 1);
      this.$confirm('确定批量删除吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/broke/deleteBatch',
          type: 'POST',
          data: {
            ids: ids
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({type: 'success', message: '删除成功', showClose: true});
              this.queryList();
            } else {
              this.$message({type: 'error', message: res.msg, showClose: true});
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({type: 'error', message: err.msg, showClose: true});
          }
        });
      });
    },
    delFun (id) {
      this.$confirm('确定删除该爆料吗？','删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/broke/delete',
          type: 'POST',
          data: {
            id: id
          },
          success: (res) => {
            if (res.code == 0) {
              this.$message({type: 'success', message: '删除成功', showClose: true});
              this.queryList();
            } else {
              this.loading = false;
              this.$message({type: 'error', message: err.msg, showClose: true});
            }
          }
        });
      });
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
  },
  created () {
    this.getList();
  }
}
</script>
<style lang="scss" scoped>

</style>
