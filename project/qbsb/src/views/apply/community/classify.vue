<template>
  <div id="community-classify">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index" @tab-click="handleClick">
        <el-tab-pane label="社群类型" name="0"></el-tab-pane>
        <el-tab-pane label="活动类型" name="1"></el-tab-pane>
        <div class="content">
          <div class="operate">
            <div class="search" @keyup.enter="queryList">
              <el-form :inline="true" :model="search_form">
                <el-form-item label="时间：">
                  <el-date-picker v-model="search_form.time" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-input style="width:190px;" type="text" v-model="search_form.keyword" :placeholder="tab_index==0?'请输入社群类型':'请输入活动类型'"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="queryList">搜索</el-button>
                </el-form-item>
                <el-form-item style="float:right;">
                  <el-button type="primary" @click="addType">{{tab_index==0?'新增社群类型':'新增活动类型'}}</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="table">
            <el-table  v-if="tab_index==0" :data="community_type_list" style="width:100%">
              <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
              <el-table-column align="center" prop="name" label="社群类型"></el-table-column>
              <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
              <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
              <el-table-column align="center" prop="address" label="操作">
                <template slot-scope="scope">
                  <el-button @click="removeItem(scope.row, 0)" class="danger-color"  type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table v-else :data="activity_type_list" style="width:100%">
              <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
              <el-table-column align="center" prop="name" label="活动类型"></el-table-column>
              <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
              <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
              <el-table-column align="center" prop="address" label="操作">
                <template slot-scope="scope">
                  <el-button @click="removeItem(scope.row, 1)" class="danger-color"  type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="page" v-if="pageTotal > 0">
            <el-pagination @current-change="pageNumChange" :current-page.sync="pageNum" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal"></el-pagination>
          </div>
        </div>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  name: 'communityClassify',
  data () {
    return {
      loading: false,
      tab_index: '0',
      search_form: {
        time: [],
        keyword: ''
      },
      community_type_list: [],
      activity_type_list: [],
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
    }
  },
  methods: {
    pageNumChange () {
      this.pageNum = val;
      if (this.tab_index == 0) {
        this.getCommunityTypeList();
      } else {
        this.getActivityList();
      }
    },
    handleClick () {
      this.search_form.time = '';
      this.search_form.keyword = '';
      this.pageTotal = 0;
      this.queryList();
    },
    queryList () {
      this.pageNum = 1;
      if (this.tab_index == 0) {
        this.getCommunityTypeList();
      } else {
        this.getActivityList();
      }
    },
    getCommunityTypeList () {
      this.loading = true;
      this.community_type_list = [];
      this.$jqAjax({
        url: apiHost + '/community/typeList',
        type: 'POST',
        data: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          startTime: this.search_form.time ? this.search_form.time[0] : '',
          endTime: this.search_form.time ? this.search_form.time[1] : '',
          typeName: this.search_form.keyword
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0 && res.data) {
            this.community_type_list = res.data.result;
            this.pageTotal = res.data.size;
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({type: 'error', message: err.msg, showClose: true})
        }
      });
    },
    getActivityList () {
      this.activity_type_list = [];
      this.loading = true;
      this.$jqAjax({
        url: apiHost + '/activity/typeList',
        type: 'POST',
        data: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          typeName: this.search_form.keyword
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            this.activity_type_list = res.data.result;
            this.pageTotal = res.data.size;
          } else {
            this.$message({type: 'error', message: res.msg, showClose: true});
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({type: 'error', message: err.msg, showClose: true});
        }
      });
    },
    addType () {
      const h = this.$createElement;
        this.$msgbox({
          title: `新增`,
          message: h('p',{style: 'margin:10px 10px;line-height:24px;'}, [
            h('span',{style: 'color: #000;'}, `${this.tab_index==0?'社群':'活动'}类型名称：`),
            h('input', {style:'color: #000;width:220px;height:24px;text-indent:4px;line-height:24px;', attrs: {placeholder:'必填'}, ref:"inputClass", key: `${new Date().getTime()}`},'')
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
                this.$message({type:'error', message: `请输入${this.tab_index==0?'社群':'活动'}类型`, showClose: true});
                return;
              }
              let url = `${this.tab_index == 0? '/community/addType':'/activity/addType'}`
              this.loading = true;
              this.$jqAjax({
                url: apiHost + url,
                type: 'POST',
                data: {
                  type: inputClassText
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
                  this.$message({type: 'error', message: '操作失败', showClose: true});
                }
              })

            }
            done();
          }
        });
    },
    removeItem (row, type) {
      this.$confirm(`确定删除该${type==0?'社群':'活动'}类型？`,'提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: `${apiHost}/${type==0?'community':'activity'}/delClass`,
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
    }
  },
  created () {
    this.getCommunityTypeList();
  }
}
</script>
<style lang="scss" scoped>

</style>
