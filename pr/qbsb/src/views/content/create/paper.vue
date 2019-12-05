<template>
  <div id="paper">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index" @tab-click="handleClick">
        <el-tab-pane label="待发布" name="1">
          <div class="content">
            <div class="operate operate20 clearfix">
              <div class="search lt">
                <el-form :inline="true" :model="paper_search_form_1">
                  <el-form-item label="时间">
                    <el-date-picker v-model="paper_search_form_1.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="标题">
                    <el-input type="text" v-model="paper_search_form_1.title" placeholder="标题"></el-input>
                  </el-form-item>
                  <!--<el-form-item label="来源">-->
                  <!--<el-input type="text" v-model="paper_search_form_1.source" placeholder="来源"></el-input>-->
                  <!--</el-form-item>-->
                  <el-form-item label="创建人">
                    <el-input type="text" v-model="paper_search_form_1.create_name" placeholder="创建人"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="paper_page_num_1=1;getPaperList(0,1)">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="btn rt">
                <el-button type="primary" @click="paperOperate(undefined)">新增快报</el-button>
                <!--<el-button type="primary" @click="$router.push('/layout/hot-paper')">全网热门快报</el-button>-->
              </div>
            </div>
            <div class="table">
              <el-table :data="paper_list_1" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="picture" label="图片" width="">
                  <template slot-scope="scope">
                    <defaultImage :url="scope.row.picture"></defaultImage>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="标题"></el-table-column>
                <el-table-column align="center" prop="summary" width="200" show-overflow-tooltip label="摘要"></el-table-column>
                <el-table-column align="center" prop="source" label="来源"></el-table-column>
                <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" label="操作" width="180">
                  <template slot-scope="scope">
                    <el-button type="text" @click="shelveOperate(scope.row,1)">发布</el-button>
                    <el-button type="text" class="wran-color" @click="paperOperate(scope.row)">修改</el-button>
                    <el-button type="text" class="danger-color" @click="removeAccount(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="paper_page_totle_1 > 0">
              <el-pagination @current-change="paperPageChange" :current-page.sync="paper_page_num_1" :page-size="paper_page_size_1" layout="prev, pager, next, jumper" :total="paper_page_totle_1">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已发布" name="2">
          <div class="content">
            <div class="operate operate20 clearfix">
              <div class="search">
                <el-form :inline="true" :model="paper_search_form_2">
                  <el-form-item label="时间">
                    <el-date-picker v-model="paper_search_form_2.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="标题">
                    <el-input type="text" v-model="paper_search_form_2.title" placeholder="标题"></el-input>
                  </el-form-item>
                  <el-form-item label="来源">
                    <el-input type="text" v-model="paper_search_form_2.source" placeholder="来源"></el-input>
                  </el-form-item>
                  <el-form-item label="创建人">
                    <el-input type="text" v-model="paper_search_form_2.create_name" placeholder="创建人"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="paper_page_num_2=1;getPaperList(0,2)">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="paper_list_2" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="picture" label="图片" width="">
                  <template slot-scope="scope">
                    <defaultImage :url="scope.row.picture"></defaultImage>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="标题"></el-table-column>
                <el-table-column align="center" prop="summary"  width="200" show-overflow-tooltip label="摘要"></el-table-column>
                <el-table-column align="center" prop="source" label="来源"></el-table-column>
                <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="publishName" label="发布人"></el-table-column>
                <el-table-column align="center" prop="publishTime" label="发布时间"></el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" class="danger-color" @click="shelveOperate(scope.row,2)">下架</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="paper_page_totle_2 > 0">
              <el-pagination @current-change="paperPageChange" :current-page.sync="paper_page_num_2" :page-size="paper_page_size_2" layout="prev, pager, next, jumper" :total="paper_page_totle_2">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已下架" name="3">
          <div class="content">
            <div class="operate operate20 clearfix">
              <div class="search">
                <el-form :inline="true" :model="paper_search_form_3">
                  <el-form-item label="时间">
                    <el-date-picker v-model="paper_search_form_3.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="标题">
                    <el-input type="text" v-model="paper_search_form_3.title" placeholder="标题"></el-input>
                  </el-form-item>
                  <el-form-item label="来源">
                    <el-input type="text" v-model="paper_search_form_3.source" placeholder="来源"></el-input>
                  </el-form-item>
                  <el-form-item label="创建人">
                    <el-input type="text" v-model="paper_search_form_3.create_name" placeholder="创建人"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="paper_page_num_3=1;getPaperList(0,3)">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="paper_list_3" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="picture" label="图片" width="">
                  <template slot-scope="scope">
                    <defaultImage :url="scope.row.picture"></defaultImage>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="标题"></el-table-column>
                <el-table-column align="center" prop="summary" width="200" show-overflow-tooltip label="摘要"></el-table-column>
                <el-table-column align="center" prop="source" label="来源"></el-table-column>
                <el-table-column align="center" prop="publishName" label="发布人"></el-table-column>
                <el-table-column align="center" prop="publishTime" label="发布时间"></el-table-column>
                <el-table-column align="center" prop="banName" label="下架人"></el-table-column>
                <el-table-column align="center" prop="banTime" label="下架时间"></el-table-column>
                <el-table-column align="center" label="操作" width="180">
                  <template slot-scope="scope">
                    <el-button type="text" @click="shelveOperate(scope.row,3)">恢复上架</el-button>
                    <el-button type="text" class="wran-color" @click="paperOperate(scope.row)">修改</el-button>
                    <el-button type="text" class="danger-color" @click="removeAccount(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="paper_page_totle_3 > 0">
              <el-pagination @current-change="paperPageChange" :current-page.sync="paper_page_num_3" :page-size="paper_page_size_3" layout="prev, pager, next, jumper" :total="paper_page_totle_3">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog :title="paper_operate_row.id ? '修改快报' : '新增快报'" :close-on-click-modal="false" :visible.sync="paper_operate_visible" :before-close="closeAddEditPaper" width="30%">
      <el-form :model="paper_operate_form" ref="paper_operate_form" :rules="paper_operate_form_rules" label-width="80px">
        <el-form-item label="快报图片" prop="image_url">
          <div class="upload">
            <el-upload class="avatar-uploader" :action="host + '/common/upload'" ref="upload" :show-file-list="false" :on-success="successUpload" :before-upload="beforeUpload">
              <img v-if="paper_operate_form.image_url" :src="paper_operate_form.image_url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="快报标题" prop="title">
          <el-input type="text" v-model="paper_operate_form.title" placeholder="请输入快报标题（限30字）"></el-input>
        </el-form-item>
        <el-form-item label="快报摘要" prop="summary">
          <el-input type="textarea" :rows="3" v-model="paper_operate_form.summary" placeholder="请输入快报摘要（限100字）"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paper_operate_visible = false">取 消</el-button>
        <el-button type="primary" @click="paperOperateDo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      host: '',
      tab_index: '1',
      //待发布
      paper_search_form_1: {
        date: "",
        title: "",
        source: "",
        create_name: "",
      },
      paper_list_1: [],
      paper_page_num_1: 1,
      paper_page_size_1: 10,
      paper_page_totle_1: 0,

      //已发布
      paper_search_form_2: {
        date: "",
        title: "",
        source: "",
        create_name: "",
      },
      paper_list_2: [],
      paper_page_num_2: 1,
      paper_page_size_2: 10,
      paper_page_totle_2: 0,

      //已发布
      paper_search_form_3: {
        date: "",
        title: "",
        source: "",
        create_name: "",
      },
      paper_list_3: [],
      paper_page_num_3: 1,
      paper_page_size_3: 10,
      paper_page_totle_3: 0,

      //新增-修改快报
      paper_operate_visible: false,
      paper_operate_form: {
        image_url: '',
        title: '',
        summary: '',
      },
      paper_operate_row: {},
      paper_operate_form_rules: {
        image_url: [
          { required: true, message: '快报图片不能为空', trigger: 'blur' },
        ],
        title: [
          { required: true, message: '快报标题不能为空', trigger: 'blur' },
          { max: 30, message: '长度限30字以内', trigger: 'blur' }
        ],
        summary: [
          { required: true, message: '快报摘要不能为空', trigger: 'blur' },
          { max: 100, message: '长度限100字以内', trigger: 'blur' }
        ],
      },
      userId: '' // 当前登录用户id
    }
  },
  created() {
    //待发布
    console.log('sessionStorage', JSON.parse(sessionStorage.getItem('sysuser')));
    this.userId = JSON.parse(sessionStorage.getItem('sysuser'))?JSON.parse(sessionStorage.getItem('sysuser')).id:'';
    this.getPaperList(0, 1)
    this.host = apiHost;
  },
  methods: {
    handleClick () {
      this.getPaperList(0, this.tab_index);
    },
    //获取快报列表
    getPaperList(type, status) {
      var self = this;
      var data = {}
      this.loading = true;
      if (status == 1) {
        data = {
          pageNum: self.paper_page_num_1,
          pageSize: self.paper_page_size_1,
          type: type,
          status: status,
          timeStart: !self.paper_search_form_1.date ? '' : self.paper_search_form_1.date[0]+' 00:00:00',
          timeEnd: !self.paper_search_form_1.date ? '' : self.paper_search_form_1.date[1] + ' 23:59:59',
          title: self.paper_search_form_1.title,
          source: self.paper_search_form_1.source,
          createName: self.paper_search_form_1.create_name,
        }
      } else if (status == 2) {
        data = {
          pageNum: self.paper_page_num_2,
          pageSize: self.paper_page_size_2,
          type: type,
          status: status,
          timeStart: !self.paper_search_form_2.date ? '' : self.paper_search_form_2.date[0]+' 00:00:00',
          timeEnd: !self.paper_search_form_2.date ? '' : self.paper_search_form_2.date[1]+' 23:59:59',
          title: self.paper_search_form_2.title,
          source: self.paper_search_form_2.source,
          createName: self.paper_search_form_2.create_name,
        }
      } else if (status == 3) {
        data = {
          pageNum: self.paper_page_num_3,
          pageSize: self.paper_page_size_3,
          type: type,
          status: status,
          timeStart: !self.paper_search_form_3.date ? '' : self.paper_search_form_3.date[0]+' 00:00:00',
          timeEnd: !self.paper_search_form_3.date ? '' : self.paper_search_form_3.date[1] + ' 23:59:59',
          title: self.paper_search_form_3.title,
          source: self.paper_search_form_3.source,
          createName: self.paper_search_form_3.create_name,
        }
      }
      self.$ajax({
        url: '/newsflash/list',
        type: 'POST',
        data: data,
        success: function (res) {
          self.loading = false;
          if (res.code == 0) {
            try {
              if (status == 1) {
                self.paper_list_1 = res.data.list;
                self.paper_page_totle_1 = res.data.size;
              } else if (status == 2) {
                self.paper_list_2 = res.data.list;
                self.paper_page_totle_2 = res.data.size;
              } else if (status == 3) {
                self.paper_list_3 = res.data.list;
                self.paper_page_totle_3 = res.data.size;
              }
            } catch (e) {
              console.log(e);
            }
          } else {
            self.$message({
              type: 'error',
              message: '请求错误',
              showClose: 'true',
            })
          }
        },
        error: function (err) {
          self.loading = false;
          self.$message({
            type: 'error',
            message: '请求失败',
            showClose: 'true',
          })
        }
      })
    },
    paperPageChange(val) {
      if (this.tab_index == 1) {
        this.paper_page_num_1 = val;
        this.getPaperList(0, 1)
      } else if (this.tab_index == 2) {
        this.paper_page_num_2 = val;
        this.getPaperList(0, 2)
      } else if (this.tab_index == 3) {
        this.paper_page_num_3 = val;
        this.getPaperList(0, 3)
      }
    },

    beforeUpload(file) {
    },
    successUpload(res, file) {
      // this.paper_operate_form.image_url = URL.createObjectURL(file.raw);
      if (res && res.data && res.data.url) {
        this.paper_operate_form.image_url = res.data.url;
      } else {
        this.paper_operate_form.image_url = '';
      }
    },

    //新增修改快报
    paperOperate(row) {
      this.paper_operate_visible = true;
      if (row) {
        this.paper_operate_row = row;
        this.paper_operate_form.image_url = row.picture
        this.paper_operate_form.title = row.title
        this.paper_operate_form.summary = row.summary
      } else {
        this.paper_operate_row = {};
        this.paper_operate_form.image_url = "";
        this.paper_operate_form.title = "";
        this.paper_operate_form.summary = "";
      }
    },
    closeAddEditPaper () {
      this.paper_operate_visible = false;
      this.$refs.paper_operate_form.resetFields();
    },
    paperOperateDo() {
      var self = this;
      var type, status;
      if (self.tab_index == 1) {
        type = 0;
        status = 1;
      } else if (self.tab_index == 2) {
        type = 0;
        status = 2;
      } else if (self.tab_index == 3) {
        type = 0;
        status = 3;
      }
      self.$refs.paper_operate_form.validate((valid) => {
        if (valid) {
          var url = "";
          var data = {
            picture: self.paper_operate_form.image_url,
            title: self.paper_operate_form.title,
            summary: self.paper_operate_form.summary,
            type: type,
            status: status,
          }
          if (self.paper_operate_row.id) {
            url = '/newsflash/update'
            data.id = self.paper_operate_row.id;
          } else {
            url = '/newsflash/add'
          }
          self.$ajax({
            url: url,
            type: 'POST',
            data: data,
            success: function (res) {
              if (res.code == 0) {
                self.$message({
                  type: 'success',
                  message: '操作成功',
                  showClose: 'true',
                })
                self.paper_operate_visible = false;
                if (status == 1) {
                  self.getPaperList(0, 1);
                } else if (status == 2) {
                  self.getPaperList(0, 2);
                } else if (status == 3) {
                  self.getPaperList(0, 3);
                }
              } else {
                self.$message({
                  type: 'error',
                  message: '操作失败',
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
          console.log("error submit");
        }
      })
    },

    //删除快报
    removeAccount(id) {
      var self = this;
      self.$confirm('确定删除该快报吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$ajax({
          url: "/newsflash/delete",
          type: "GET",
          data: {
            id: id
          },
          success: function (data) {
            if (data.code == 0) {
              self.$message({
                type: "success",
                message: "删除成功",
                showClose: 'true',
              })
              if (self.tab_index == 1) {
                self.getPaperList(0, 1);
              } else if (self.tab_index == 3) {
                self.getPaperList(0, 3);
              }
            } else {
              self.$message({
                type: "error",
                message: "删除失败",
                showClose: 'true',
              })
            }
          },
          error(error) {
            self.$message({
              type: "error",
              message: "请求失败",
              showClose: 'true',
            })
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //发布下架恢复上架
    shelveOperate(row, n) {
      var txt = "", status = "";
      if (n == 1) {
        txt = '发布';
        status = '2';
      } else if (n == 2) {
        txt = '下架'
        status = '3';
      } else {
        txt = '恢复上架';
        status = '2';
      }
      var self = this;
      self.$confirm("确定" + txt + "该快报吗?", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$ajax({
          url: "/newsflash/update",
          type: "POST",
          data: {
            id: row.id,
            status: status,
            type: 0,
            publishId: status == '2' ? this.userId : '',
            banId: status == '3' ? this.userId : '',
            publishTime: status == '2' ?  new Date().format('YYYY-MM-DD hh:mm:ss') : '',
            banTime: status == '3' ? new Date().format('YYYY-MM-DD hh:mm:ss') : ''
          },
          success: function (data) {
            if (data.code == 0) {
              self.$message({
                type: "success",
                message: txt + "成功",
                showClose: 'true',
              })
              if (n == 1) {
                self.getPaperList(0, 1);
                self.getPaperList(0, 2);
              } else if (n == 2) {
                self.getPaperList(0, 2);
                self.getPaperList(0, 3);
              } else if (n == 3) {
                self.getPaperList(0, 2);
                self.getPaperList(0, 3);
              }
            } else {
              self.$message({
                type: "error",
                message: "删除失败",
                showClose: 'true',
              })
            }
          },
          error(error) {
            self.$message({
              type: "error",
              message: "请求失败",
              showClose: 'true',
            })
          }
        });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      });
    },
  }
}
</script>

<style lang="scss">
#paper {
}
</style>
