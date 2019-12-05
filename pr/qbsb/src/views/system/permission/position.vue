<template>
  <div id="position">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="岗位管理" name="0">
          <div class="content">
            <div class="operate clearfix">
              <el-button style="float:right;margin-right:10px;" type="primary" @click="addEditPosition()">新增岗位</el-button>
            </div>
            <div class="table">
              <el-table :data="position_list" style="width:100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="name" label="岗位名称"></el-table-column>
                <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间">
                  <template slot-scope="scope">
                    {{scope.row.createTime?new Date(scope.row.createTime).format('YYYY-MM-DD hh:mm'):''}}
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="address" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="addEditPosition(scope.row)">编辑</el-button>
                    <!-- <el-button type="text" @click="removeFun(scope.row)">删除</el-button> -->
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="position_page_total > 0">
              <el-pagination @current-change="positionPageNumChange" :current-page.sync="position_page_num" :page-size="position_page_size" layout="total, prev, pager, next, jumper" :total="position_page_total"></el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  name: 'position',
  data () {
    return {
      tab_index: 0,
      position_page_size: 50,
      position_page_num: 1,
      position_page_total: 0, // 暂无总数
      position_list: [
      ],
      loading: false,

    }
  },
  methods: {
    positionPageNumChange (val) {
      this.position_page_num = val;
      this.getPostionList();
    },
    getPostionList () {
      this.loading = true;
      this.position_list = [];
      this.$jqAjax({
        url: apiHost + '/position/list',
        type: 'POST',
        data: {
          pageSize: this.position_page_size,
          pageNum: this.position_page_num
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            this.position_list = res.data;
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
    addEditPosition (editItem) {
      const h = this.$createElement;
      this.$msgbox({
        title: `${editItem?'编辑':'新增'}岗位`,
        message: h('p',{style: 'margin:10px 10px;line-height:24px;'}, [
            h('span',{style: 'color: #000;'}, '岗位名称：'),
            h('input', {style:'color: #000;width:220px;height:24px;text-indent:4px;line-height:24px;', attrs: {placeholder:'请输入岗位名称（仅限8个汉字）', value: `${editItem?editItem.name:''}`}, ref:"inputClass", key: `${new Date().getTime()}`},``)
          ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            let inputClassText = this.$refs.inputClass.value;
            if (!inputClassText) {
              this.$message({type:'error', message: '请输入岗位名称', showClose: true});
              return;
            }
            this.loading = true;
            this.$jqAjax({
              url: `${apiHost}/position${editItem?'/update':'/add'}`,
              type: 'POST',
              data: {
                name: inputClassText,
                id: editItem ? editItem.id : ''
              },
              success: (res) => {
                this.loading = false;
                if (res.code == 0) {
                  this.$message({type: 'success', message: `${editItem?'编辑成功':'新增成功'}`, showClose: true});
                  this.getPostionList();
                } else {
                  this.$message({type: 'error', message: '操作失败', showClose: true});
                }
              },
              error: (err) => {
                this.loading = false;
                this.$message({type: 'error', message: '操作失败', showClose: true});
              }
            });
          }
          done();
        }
      });
    },
    removeFun (row) {
      this.$confirm('确定删除该岗位？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('确定')
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/position/delete',
          type: 'POST',
          data: {
            id: row.id
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({type: 'success', message: `删除成功`, showClose: true});
              this.getPostionList();
            } else {
              this.$message({type: 'error', message: '操作失败', showClose: true});
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({type: 'error', message: '操作失败', showClose: true});
          }
        });
      })
    }
  },
  created () {
    this.getPostionList();
  }
}
</script>
<style lang="scss" scoped>

</style>

