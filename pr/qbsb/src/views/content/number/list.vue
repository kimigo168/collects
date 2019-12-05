<template>
  <div id="list">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index" @tab-click="handleClick">
        <el-tab-pane label="平台列表" name="1"></el-tab-pane>
        <!-- <el-tab-pane label="平台号推荐" name="2"></el-tab-pane> -->
        <div class="content">
          <div class="operate clearfix">
            <div class="search lt">
              <el-form :inline="true" :model="list_search_form">
                <!-- <el-form-item label="来源：">
                  <el-select v-model="list_search_form.source">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="微信公众号" value="0"></el-option>
                    <el-option label="其它" value="1"></el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="分类：" v-if="tab_index==1">
                  <el-select v-model="list_search_form.classify" @change="selectChange">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="list in classify_list" :key="list.id" :value="list.id" :label="list.name">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="是否推荐：">
                  <el-select v-model="list_search_form.recommend">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item>
                  <el-input type="text" style="width:190px;" v-model="list_search_form.name" placeholder="输入平台号名称查找"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="list_page_num=1;getPlatformList(true)">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="btn rt">
              <el-button type="primary" @click="operateList(undefined)">新建平台号</el-button>
            </div>
          </div>
          <div class="table">
            <el-table :data="platform_list">
              <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
              <el-table-column align="center" prop="name" label="平台号名称"></el-table-column>
              <el-table-column align="center" prop="icon" label="图标">
                <template slot-scope="scope">
                  <defaultImage :url="scope.row.icon"></defaultImage>
                </template>
              </el-table-column>
              <!-- <el-table-column align="center" prop="source" label="来源"></el-table-column> -->
              <el-table-column align="center" prop="typeName" label="分类"></el-table-column>
              <el-table-column align="center" prop="brief" label="简介" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="articleNum" label="文章数"></el-table-column>
              <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
              <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
              <el-table-column align="center" prop="" label="操作" width="150">
                <template slot-scope="scope">
                  <p>
                    <!-- <el-button type="text" v-if="scope.row.recomm==1" @click="recommendHandle(scope.row, 0)">取消推荐</el-button>
                    <el-button type="text" v-if="scope.row.recomm==0" @click="recommendHandle(scope.row, 1)">推荐</el-button> -->
                    <!-- <el-button type="text" @click="$router.push({path:'/layout/number-create',query: {platformId: scope.row.id}})">新建内容</el-button> -->
                  </p>
                  <p>
                    <el-button type="text" v-if="tab_index==2||(tab_index==1&&list_search_form.classify!='')" @click="sortRowFun(scope.row, 0)">上移</el-button>
                    <el-button type="text" v-if="tab_index==2||(tab_index==1&&list_search_form.classify!='')" @click="sortRowFun(scope.row, 1)">下移</el-button>
                  </p>
                  <p>
                    <el-button type="text" @click="operateList(scope.row)">修改</el-button>
                    <el-button type="text" @click="removePlatform(scope.row.id)">删除</el-button>
                  </p>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="page" v-if="list_page_total > 0">
            <el-pagination
                @current-change="listPageChange"
                :current-page.sync="list_page_num"
                :page-size="list_page_size"
                layout="total, prev, pager, next, jumper"
                :total="list_page_total">
            </el-pagination>
          </div>
        </div>
      </el-tabs>
    </div>
    <!--新建/修改平台号-->
    <el-dialog :title="!operate_row.id ? '新建分类' : '修改分类'" :visible.sync="operate_list_visible">
      <el-form :model="operate_list_form" ref="operate_list_form" :rules="operate_list_form_rules"
               label-width="120px">
        <el-form-item label="来源" v-if="!operate_row.id">
          <el-col :span="7">
            <el-select v-model="operate_list_form.source" width="50">
              <el-option label="微信公众号" value="0"></el-option>
              <el-option label="其它" value="1"></el-option>
            </el-select>
          </el-col>
          <!-- <el-col :span="16" :offset="2" v-if="operate_list_form.source == 0">
            <el-input type="text" v-model="platform_name" placeholder="请输入平台号名称">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col> -->
        </el-form-item>
        <el-form-item label="所属分类" prop="classify">
          <el-col :span="7">
            <el-select v-model="operate_list_form.classify">
              <el-option v-for="list in classify_list" :key="list.id" :value="list.id" :label="list.name">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input type="text" v-model="operate_list_form.name" placeholder="请输入平台号名称"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="desc">
          <el-input type="textarea" :rows="5" v-model="operate_list_form.desc" placeholder="请输入平台号简介"></el-input>
        </el-form-item>
        <el-form-item label="平台号头像" prop="header_url">
          <div class="upload">
            <el-upload
                class="avatar-uploader"
                :action="host + '/common/upload'"
                ref="upload"
                :show-file-list="false"
                :on-success="successUpload"
                :before-upload="beforeUpload">
              <img v-if="operate_list_form.header_url" :src="operate_list_form.header_url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="operate_list_visible = false">取 消</el-button>
        <el-button type="primary" @click="operateListDo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        host: '',
        tab_index: '1',
        list_search_form: {
          source: '',
          name: '',
          recommend: '0',
          classify: ''
        },
        platform_list: [],
        list_page_total: 0,
        list_page_num: 1,
        list_page_size: 10,

        // 新建&修改平台号
        operate_list_visible: false,
        classify_list: [],
        operate_list_form: {
          source: '1',
          classify: '',
          name: '',
          desc: '',
          header_url: '',
        },
        platform_name: '',
        operate_list_form_rules: {
          classify: [
            {required: true, message: '平台号所属分类不能为空', trigger: 'blur'},
          ],
          name: [
            {required: true, message: '平台号名称不能为空', trigger: 'blur'},
            {max: 15, message: '长度最多为15个字符', trigger: 'blur'}
          ],
          desc: [
            {required: true, message: '平台号简介不能为空', trigger: 'blur'},
            {max: 200, message: '长度最多为200个字符', trigger: 'blur'}
          ],
          header_url: [
            {required: true, message: '平台号头像不能为空', trigger: 'blur'},
          ]
        },
        operate_row: {},
        loading: false
      }
    },
    created() {
      this.getClassifyList();
      this.host = apiHost;
    },
    methods: {
      selectChange () {
        this.list_page_num = 1;
        this.getPlatformList();
      },
      handleClick (tab, event) {
        this.list_search_form.recommend = this.tab_index == 1 ? 0 : 1;
        this.list_page_num = 1;
        this.list_search_form.classify = ''; // 分类平台号推荐默认显示全部
        this.getPlatformList();
      },
      //获取平台号列表数据
      getPlatformList () { // isBySearch表示点击查询
        this.loading = true;
        this.platform_list = [];
        this.list_page_total = 0;
        this.$ajax({
          url: "/platform/platformList",
          type: "POST",
          data: {
            pageNum: this.list_page_num,
            pageSize: this.list_page_size,
            source: this.list_search_form.source,
            name: this.list_search_form.name,
            recomm: this.list_search_form.recommend,
            typeId: this.list_search_form.classify
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.platform_list = res.data.list;
              this.list_page_total = res.data.total
            }
          },
          error: (error) => {
            this.loading = false;
            this.$message({type: 'error', message: '请求失败', showClose: true});
          }
        });
      },
      listPageChange(val) {
        this.list_page_num = val;
        this.getPlatformList();
      },

      //获取平台号列表数据
      getClassifyList() {
        var self = this;
        this.classify_list = [];
        self.$ajax({
          url: "/platform/typeList",
          type: "POST",
          data: {},
          success: function (data) {
            if (data.code == 0 && data.data) {
              let list = data.data;
              console.log('list', list)
              for (let item of list) {
                if (item.status != 1) {
                  self.classify_list.push(item);
                }
              }
              self.list_search_form.classify = '';
              self.getPlatformList();
            }
          },
          error: function (error) {
          }
        })
      },

      //删除
      removePlatform(id) {
        let self = this;
        self.$confirm("确认删除该平台号吗?", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$ajax({
            url: "/platform/deletePlatform",
            type: "GET",
            data: {
              id: id,
            },
            success: function (data) {
              if (data.code == 0) {
                self.getPlatformList();
                self.$message({
                  type: 'success',
                  message: '操作成功!',
                  showClose: 'true'
                });
              } else {
                self.$message({
                  type: 'error',
                  message: '操作失败!',
                  showClose: 'true'
                });
              }
            },
            error: function (error) {
              self.$message({
                type: 'error',
                message: '操作失败!',
                showClose: 'true'
              });
            }
          })

        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      beforeUpload(file) {
      },

      successUpload(res, file) {
        try {
          this.operate_list_form.header_url = res.data.url;
        } catch (e) {
          console.log(e);
        }
      },

      //新建&修改平台号
      operateList(row) {
        this.operate_list_visible = true;
        if (row) {
          this.operate_row = row;
          this.operate_list_form.classify = row.typeId;
          this.operate_list_form.name = row.name;
          this.operate_list_form.desc = row.brief;
          this.operate_list_form.header_url = row.icon;
        } else {
          this.operate_row = {};
          this.operate_list_form.classify = "";
          this.operate_list_form.name = "";
          this.operate_list_form.desc = "";
          this.operate_list_form.header_url = "";
        }
      },
      operateListDo() {
        var self = this;
        self.$refs.operate_list_form.validate(valid => {
          if (valid) {
            let url, data, type;
            if (self.operate_row.id) {
              url = "/platform/updatePlatform";
              data = {
                typeId: self.operate_list_form.classify,
                name: self.operate_list_form.name,
                brief: self.operate_list_form.desc,
                icon: self.operate_list_form.header_url,
                id: self.operate_row.id,
                // source: '',
              };
              type = "POST";
            } else {
              url = "/platform/addPlatform";
              data = {
                typeId: self.operate_list_form.classify,
                name: self.operate_list_form.name,
                brief: self.operate_list_form.desc,
                icon: self.operate_list_form.header_url,
                // id: '',
                // source: '',
              };
              type = "POST";
            }
            self.$loading();
            self.$ajax({
              url: url,
              type: type,
              data: data,
              success: function (data) {
                self.$loading().close();
                if (data.code == 0) {
                  self.operate_list_visible = false;
                  self.getPlatformList();
                } else {
                  self.$message({
                    type: 'error',
                    message: data.msg,
                    showClose: 'true'
                  })
                }
              },
              error: function (error) {
                self.$loading().close();
                self.$message({
                  type: 'error',
                  message: data.msg,
                  showClose: 'true'
                })
              }
            })
          } else {
            console.log("error submit");
          }
        })
      },
      recommendHandle (row, type) { // 0：取消推荐，1：推荐
        this.$confirm(`确定${type==0?'取消推荐该平台号推荐？':'推荐该平台号？'}`, `${type==0?'取消推荐':'推荐'}`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$ajax({
            url: '/platform/updatePlatform',
            type: 'POST',
            data: {
              id: row.id,
              recomm: type
            },
            success: (res) => {
              this.loading = false;
              if (res.code == 0) {
                this.$message({ type: 'success', message: `${type==0?'推荐已取消':'推荐成功'}`, showClose: true });
                this.list_page_num = 1;
                this.platform_list = [];
                this.list_page_total = 0;
                this.getPlatformList(); 
              } else {
                this.$message({ type: 'error', message: '操作失败', showClose: true});
              }
            },
            error: (err) => {
              this.loading = false;
              this.$message({ type: 'error', message: '操作失败', showClose: true});
            }
          });
        });
      },
      sortRowFun (row, no) { // 排序
        this.$confirm(`确定${no==0?'上':'下'}移吗？`, `${no==0?'上':'下'}移`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$jqAjax({
            url: apiHost + '/platform/move',
            type: 'POST',
            data: {
              platformId: row.id,
              moveType: no // 0:上移，1：下移
            },
            success: (res) => {
              this.loading = false;
              if (res.code == 0) {
                this.$message({type: 'success', message: '操作成功', showClose: true});
                this.list_page_num = 1;
                this.getPlatformList();
              } else {
                this.$message({type: 'error', message: '操作失败', showClose: true});
              }
            },
            error: (err) => {
              this.loading = false;
              this.$message({type: 'error', message: '操作失败', showClose: true});
            }
          });
        });
      }
    }
  }
</script>

<style scoped>

</style>
