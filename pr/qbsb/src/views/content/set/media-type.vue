<template>
  <div id="mediaType">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index" @tab-click="handleClick">
        <el-tab-pane label="图片" name="1"></el-tab-pane>  
        <el-tab-pane label="视频" name="2"></el-tab-pane>  
        <el-tab-pane label="音频" name="3"></el-tab-pane>  
      </el-tabs> 
      <div class="content">
        <div class="operate">
          <div class="search">
            <el-form :inline="true" :model="search_form">
              <el-form-item style="float:right;">
                <el-button type="primary" @click="addFun">新增分类</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="table">
          <el-table :data="type_list" style="width: 100%">
            <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
            <el-table-column align="center" prop="name" label="分类名称"></el-table-column>
            <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
            <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="editFun(scope.row)">编辑</el-button>
                <el-button type="text" @click="delFun(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page" v-if="page_total > 0">
          <el-pagination @current-change="pageNumChange" :current-page.sync="page_num" :page-size="page_size" layout="total, prev, pager, next, jumper" :total="page_total"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'mediaType',
  data () {
    return {
      tab_index: '1',
      loading: false,
      // 分页
      page_num: 1,
      page_size: 10,
      page_total: 0,
      search_form: {},
      type_list: []
    }
  },
  methods: {
    handleClick () {
      this.page_num = 1;
      this.getList();
    },
    pageNumChange (val) {
      this.page_num = val;
      this.getList();
    },
    editFun (row) {
      const h = this.$createElement;
      this.$msgbox({
        title: `${this.tab_index==1?'图片':this.tab_index==2?'视频':'音频'}分类`,
        message: h('p',{style: 'margin:10px 10px;line-height:24px;'}, [
          h('span',{style: 'color: #000;'}, '分类名称：'),
          h('input', {style:'color: #000;width:220px;height:24px;text-indent:4px;line-height:24px;', attrs: {placeholder:'请输入分类名称（仅限4个汉字）', value: row.name, maxLength: 4}, ref:"inputClass", key: `${new Date().getTime()}`},'')
        ]),
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            let inputClassText = this.$refs.inputClass.value;
            if (!inputClassText) {
              this.$message({type:'warning', message: '请输入分类名称', showClose: true});
              return;
            }
            this.loading = true;
            this.$jqAjax({
              url: apiHost + '/media/typeEdit',
              type: 'POST',
              data: {
                name: inputClassText,
                id: row.id
              },
              success: (res) => {
                this.loading = false;
                if (res.code == 0) {
                  this.queryList();
                  this.$message({type: 'success', message: '编辑成功', showClose: true});
                } else {
                  this.$message({type: 'error', message: res.msg, showClose: true});
                }
              },
              error: (err) => {
                this.loading = false;
                this.$message({type: 'error', message: err.msg, showClose: true});
              }
            })

          }
          done();
        }
      });
    },
    delFun (row) {
      this.$confirm('确定删除该分类吗？', '删除',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/media/typeDelete',
          type: 'POST',
          data: {
            id: row.id
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({type: 'success', message: '已删除', showClose: true});
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
    addFun () {
      const h = this.$createElement;
      this.$msgbox({
        title: `新增${this.tab_index==1?'图片':this.tab_index==2?'视频':'音频'}分类`,
        message: h('p',{style: 'margin:10px 10px;line-height:24px;'}, [
          h('span',{style: 'color: #000;'}, '分类名称：'),
          h('input', {style:'color: #000;width:220px;height:24px;text-indent:4px;line-height:24px;', attrs: {placeholder:'请输入分类名称（仅限4个汉字）',maxLength: 4}, ref:"inputClass", key: `${new Date().getTime()}`},'')
        ]),
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            let inputClassText = this.$refs.inputClass.value;
            if (!inputClassText) {
              this.$message({type:'error', message: '请输入分类名称', showClose: true});
              return;
            }
            this.loading = true;
            this.$jqAjax({
              url: apiHost + '/media/typeAdd',
              type: 'POST',
              data: {
                name: inputClassText,
                type: this.tab_index
              },
              success: (res) => {
                this.loading = false;
                if (res.code == 0) {
                  this.queryList();
                  this.$message({type: 'success', message: '新增成功', showClose: true});
                } else {
                  this.$message({type: 'error', message: res.msg, showClose: true});
                }
              },
              error: (err) => {
                this.loading = false;
                this.$message({type: 'error', message: err.msg, showClose: true});
              }
            })

          }
          done();
        }
      });
    },
    queryList () {
      this.page_num = 1;
      this.getList();
    },
    getList () {
      this.type_list = [];
      this.loading = true;
      this.$jqAjax({
        url: apiHost + '/media/typeList',
        type: 'POST',
        data: {
          pageNum: this.page_num,
          pageSize: this.page_size,
          type: this.tab_index
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            this.type_list = res.data.list;
            this.page_total = res.data.total;
          } else {
            this.$message({type: 'error', message: res.msg, showClose: true});
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({type: 'error', message: err.msg, showClose: true});
        }
      });
    }
  },
  created () {
    this.getList();
  }
}
</script>
<style lang="scss" scoped>

</style>
