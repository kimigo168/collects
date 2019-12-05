<template>
  <div id="original">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index" @tab-click="handleClick">
        <el-tab-pane label="频道管理" name="0">
          <div class="content">
            <div class="operate clearfix">
              <!-- <div class="search lt">
                <el-form :model="search_form_1" :inline="true">
                  <el-form-item label="频道类型">
                    <el-select v-model="search_form_1.channel_type"
                               @change="getChannelList(0,search_form_1.channel_type)">
                      <el-option value="0" label="资讯"></el-option>
                      <el-option value="1" label="视频"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div> -->
              <div class="btn rt">
                <el-button type="primary" @click="channelOperate()">新建频道</el-button>
              </div>
            </div>
            <div class="table">
              <el-table :data="channel_list" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
                <el-table-column align="center" prop="name" label="频道名称" width=""></el-table-column>
                <el-table-column align="center" prop="type" label="频道类型" width="">
                  <template slot-scope="scope">
                    <span v-if="scope.row.type == 0">资讯</span>
                    <span v-if="scope.row.type == 1">视频</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="author" label="状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 1">禁用</span>
                    <span v-if="scope.row.status == 0">启用</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间" width="150"></el-table-column>
                <el-table-column align="center" prop="address" label="操作" width="250">
                  <template slot-scope="scope">
                    <p>
                      <el-button type="text" v-if="scope.$index >=1" @click="move(scope.row,channel_list[scope.$index-1])">上移</el-button>
                      <el-button type="text" v-if="scope.$index != channel_list.length-1" @click="move(scope.row,channel_list[scope.$index+1])">下移</el-button>
                      <el-button type="text" @click="setAbleDisable(scope.row)" v-if="scope.row.status == 1">启用</el-button>
                      <el-button type="text" @click="setAbleDisable(scope.row)" v-if="scope.row.status == 0">禁用</el-button>
                      <el-button type="text" @click="channelOperate(scope.row)">编辑</el-button>
                      <el-button type="text" v-if="scope.row.isHidden==0" @click="hideShowFun(scope.row)">隐藏</el-button>
                      <el-button type="text" v-if="scope.row.isHidden==1" @click="hideShowFun(scope.row)">显示</el-button>
                    </p>
                    <!-- <el-button type="text" @click="removeChannel(scope.row.id)">删除</el-button> -->
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="子频道管理" name="1">
          <div class="content">
            <div class="operate clearfix">
              <!-- <div class="search lt">
                <el-form :model="search_form_2" :inline="true">
                  <el-form-item label="频道类型">
                    <el-select v-model="search_form_2.channel_type">
                      <el-option value="0" label="资讯"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div> -->
              <div class="btn rt">
                <el-button type="primary" @click="childChannelOperate()">新建子频道</el-button>
              </div>
            </div>
            <div class="table">
              <el-table :data="child_channel_list" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
                <el-table-column align="center" prop="name" label="子频道名称" width=""></el-table-column>
                <el-table-column align="center" prop="pName" label="所属频道"></el-table-column>
                <el-table-column align="center" prop="author" label="状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 1">禁用</span>
                    <span v-if="scope.row.status == 0">启用</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间" width="150"></el-table-column>
                <el-table-column align="center" prop="address" label="操作" width="250">
                  <template slot-scope="scope">
                    <p>
                      <el-button type="text" v-if="scope.$index != 0" @click="move(scope.row,child_channel_list[scope.$index-1])">上移</el-button>
                      <el-button type="text" v-if="scope.$index != child_channel_list.length-1" @click="move(scope.row,child_channel_list[scope.$index+1])">下移</el-button>
                      <el-button type="text" @click="setAbleDisable(scope.row)" v-if="scope.row.status == 1">启用</el-button>
                      <el-button type="text" @click="setAbleDisable(scope.row)" v-if="scope.row.status == 0">禁用</el-button>
                      <el-button type="text" @click="childChannelOperate(scope.row)">编辑</el-button>
                      <el-button type="text" @click="hideShowFun(scope.row)" v-if="scope.row.isHidden == 0">隐藏</el-button>
                      <el-button type="text" @click="hideShowFun(scope.row)" v-if="scope.row.isHidden == 1">显示</el-button>
                      <!-- <el-button type="text" @click="removeChannel(scope.row.id)">删除</el-button> -->
                    </p>
                    
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!--新建&编辑频道-->
    <el-dialog :title="!channel_edit_row.id ? '新建频道' : '编辑频道'" :visible.sync="operate_channel_visible" width="30%" :close-on-click-modal="false" :before-close="CloseAddEditChannel">
      <el-form :model="operate_channel_form" ref="operate_channel_form" :rules="operate_channel_form_rules"
               label-width="100px">
        <el-form-item label="频道名称" prop="channel_name">
          <el-input type="text" v-model="operate_channel_form.channel_name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="频道类型" prop="channel_type" v-if="!channel_edit_row.id">
          <el-select v-model="operate_channel_form.channel_type">
            <el-option value="0" label="资讯"></el-option>
            <el-option value="1" label="视频"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="频道状态" prop="channel_status">
          <el-radio v-model="operate_channel_form.channel_status" label="0">已启用</el-radio>
          <el-radio v-model="operate_channel_form.channel_status" label="1">已禁用</el-radio>
        </el-form-item>
        <!-- <el-form-item label="自定义位置" prop="channel_position">
          <el-radio v-model="operate_channel_form.channel_position" label="0">自定义</el-radio>
          <el-radio v-model="operate_channel_form.channel_position" label="1">不可自定义</el-radio>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="operate_channel_visible = false">取 消</el-button>
        <el-button type="primary" @click="channelOperateDo('operate_channel_form')">确 定</el-button>
      </span>
    </el-dialog>

    <!--新增&编辑子频道-->
    <el-dialog :title="!child_channel_edit_row.id ? '新增子频道' : '编辑子频道'" :visible.sync="operate_child_channel_visible" width="30%" :close-on-click-modal="false" :before-close="closeAddEditChild">
      <el-form :model="operate_child_channel_form" ref="operate_child_channel_form"
               :rules="operate_child_channel_form_rules" label-width="100px">
        <el-form-item label="子频道名称" prop="channel_name">
          <el-input type="text" v-model="operate_child_channel_form.channel_name"></el-input>
        </el-form-item>
        <el-form-item label="子频道状态" prop="channel_status">
          <el-radio v-model="operate_child_channel_form.channel_status" label="0">已启用</el-radio>
          <el-radio v-model="operate_child_channel_form.channel_status" label="1">已禁用</el-radio>
        </el-form-item>
        <el-form-item label="所属频道" prop="channel_parent">
          <el-select v-model="operate_child_channel_form.channel_parent" placeholder="请选择">
            <el-option v-for="item in newsParentChannelList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="operate_child_channel_visible = false">取 消</el-button>
        <el-button type="primary" @click="childChannelOperateDo('operate_child_channel_form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        tab_index: "0",
        //频道管理
        search_form_1: {
          channel_type: '0',
        },
        channel_list: [],
        channel_list1: [], // 同上，去掉推荐，专题，直播
        //新增编辑频道
        operate_channel_visible: false,
        operate_channel_form: {
          channel_name: "",
          channel_type: "0",
          channel_status: "0",
          channel_position: "0"
        },
        operate_channel_form_rules: {
          channel_name: [
            {required: true, message: "频道名称不能为空", trigger: "blur"},
            {min: 1, max: 20, message: "频道名称长度为1-20个字符或汉字", trigger: "blur      "}
          ],
          channel_type: [
            {required: true, message: "频道类型", trigger: "change"}
          ],
          channel_status: [
            {required: true, message: "频道状态", trigger: "blur"}
          ],
          // channel_position: [
          //   {required: true, message: "自定义位置", trigger: "blur"}
          // ],
        },
        channel_edit_row: {},
        //子频道管理
        search_form_2: {
          channel_type: '0',
        },
        child_channel_list: [],
        // 新增&编辑子频道
        operate_child_channel_visible: false,
        operate_child_channel_form: {
          channel_name: "",
          channel_status: "1",
          channel_parent: ""
        },
        channel_parent_list: [],
        operate_child_channel_form_rules: {
          channel_name: [
            {required: true, message: "子频道名称不能为空", trigger: "blur"},
            {min: 1, max: 20, message: "子频道称长度为1-20个字符或汉字", trigger: "blur      "}
          ],
          channel_status: [
            {required: true, message: "频道状态不能为空", trigger: "blur"}
          ],
          channel_parent: [
            {required: true, message: "所属频道不能为空", trigger: "change"}
          ],
        },
        child_channel_edit_row: {},
        newsParentChannelList: [], // 新建子频道当前账户有权限的父频道列表
      };
    },
    created() {
      this.getChannelList(0, 0)
      // this.getChannelList(1, 0)
    },
    methods: {
      /*
       *获取频道列表
       *@param type1(0:父频道;1:子频道)
       *@param type2(0:资讯;1:视频)
       */
      getChannelList(type1, type2) {
        var self = this;
        this.loading = true;
        self.$ajax({
          url: "/channel/list",
          type: "GET",
          data: {
            queryType: type1,
            type: type2,
          },
          success: function (res) {
            self.loading = false;
            if (res && res.code == 0) {
              if (res.data) {
                if (type1 == 0) {
                  self.channel_list = res.data;
                  let list = res.data;
                  self.channel_list1 = [];
                  for (let item of list) {
                    if (item.name != '推荐' && item.name != '专题' && item.name != '直播') {
                      self.channel_list1.push(item);
                    }
                  }
                } else {
                  self.child_channel_list = res.data;

                }
              }
            }
          },
          error(error) {
            self.loading = false;
            self.channel_list = [];
            self.$message({
              type: "error",
              message: "请求失败",
              showClose: "true"
            });
          }
        });
      },

      channelOperate(row) {
        this.operate_channel_visible = true;
        if (row) {
          this.channel_edit_row = row;
          this.operate_channel_form.channel_name = row.name;
          this.operate_channel_form.channel_type = row.type;
          this.operate_channel_form.channel_status = row.status;
          this.operate_channel_form.channel_position = row.userDefinePos;
        } else {
          this.channel_edit_row = {};
          this.operate_channel_form.channel_name = "";
          this.operate_channel_form.channel_type = "";
          this.operate_channel_form.channel_status = "0";
          this.operate_channel_form.channel_position = "0";
        }
      },
      channelOperateDo(formName) {
        var self = this;
        self.$refs[formName].validate(valid => {
          if (valid) {
            var data, url;
            data = {
              name: self.operate_channel_form.channel_name,
              type: self.operate_channel_form.channel_type,
              status: self.operate_channel_form.channel_status,
              userDefinePos: self.operate_channel_form.channel_position,
            };
            url = "/channel/addChannel";
            if (self.channel_edit_row.id) {
              data.id = self.channel_edit_row.id;
              url = "/channel/update";
            }
            self.$ajax({
              url: url,
              type: "POST",
              data: data,
              success: function (data) {
                if (data.code == 0) {
                  self.$message({
                    type: "success",
                    message: "操作成功",
                    showClose: "true"
                  });
                  self.search_form_1.channel_type = self.operate_channel_form.channel_type;
                  self.getChannelList(0, self.operate_channel_form.channel_type);
                  self.operate_channel_visible = false;
                } else {
                  self.$message({
                    type: "error",
                    message: "操作失败",
                    showClose: "true"
                  });
                }
              },
              error(error) {
                self.$message({
                  type: "error",
                  message: "请求失败",
                  showClose: "true"
                });
              }
            });
          }
        });
      },
      CloseAddEditChannel() {
        this.operate_channel_visible = false;
        this.$refs.operate_channel_form.resetFields();
      },
      //启用禁用
      setAbleDisable(row) {
        var self = this;
        self
          .$confirm("确认执行此操作吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            self.$ajax({
              url: "/channel/updateChannelStatus",
              type: "GET",
              data: {
                id: row.id,
                status: row.status == 0 ? "1" : "0"
              },
              success: function (data) {
                if (data && data.code == 0) {
                  self.$message({
                    type: "success",
                    message: "操作成功",
                    showClose: "true"
                  });
                  self.refreshChannelList();
                  if (self.tab_index == 0) {
                    self.getChannelList(0, self.search_form_1.channel_type);
                  } else {
                    self.getChannelList(1, self.search_form_2.channel_type);
                  }
                }
              },
              error(error) {
                self.$message({
                  type: "error",
                  message: "请求失败",
                  showClose: "true"
                });
              }
            });
          });
      },

      //上移下移
      move(current, next) {
        var self = this;
        self
          .$confirm("确认执行此操作吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            self.$ajax({
              url: "/channel/move",
              type: "POST",
              data: {
                moveFirstId: current.id,
                moveFirstSort: current.sort,
                moveTwoId: next.id,
                moveTwoSort: next.sort
              },
              success: function (data) {
                if (data && data.code == 0) {
                  self.$message({
                    type: "success",
                    message: "操作成功",
                    showClose: "true"
                  });
                  if (self.tab_index == 0) {
                    self.getChannelList(0, self.search_form_1.channel_type);
                  } else {
                    self.getChannelList(1, self.search_form_2.channel_type);
                  }
                }
              },
              error(error) {
                self.$message({
                  type: "error",
                  message: "请求失败",
                  showClose: "true"
                });
              }
            });
          });
      },

      //删除
      removeChannel(id) {
        var self = this;
        self
          .$confirm("确认执行此操作吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            self.$ajax({
              url: "/channel/delete",
              type: "GET",
              data: {
                id: id
              },
              success: function (data) {
                if (data && data.code == 0) {
                  self.$message({
                    type: "success",
                    message: "操作成功",
                    showClose: "true"
                  });
                  if (self.tab_index == 0) {
                    self.getChannelList(0, self.search_form_1.channel_type);
                  } else {
                    self.getChannelList(1, self.search_form_2.channel_type);
                  }
                }
              },
              error(error) {
                self.$message({
                  type: "error",
                  message: "请求失败",
                  showClose: "true"
                });
              }
            });
          });
      },

      childChannelOperate(row) {
        this.operate_child_channel_visible = true;
        this.$getNewsChannel();
        if (row) {
          this.child_channel_edit_row = row;
          this.operate_child_channel_form.channel_name = row.name;
          this.operate_child_channel_form.channel_status = row.status;
          this.operate_child_channel_form.channel_parent = row.pid;
        } else {
          this.child_channel_edit_row = {};
          this.operate_child_channel_form.channel_name = "";
          this.operate_child_channel_form.channel_status = "0";
          this.operate_child_channel_form.channel_parent = "";
        }
      },
      childChannelOperateDo(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            var data, url;
            data = {
              name: this.operate_child_channel_form.channel_name,
              status: this.operate_child_channel_form.channel_status,
              pid: this.operate_child_channel_form.channel_parent,
              type: 0,
            };
            // 先校验新增子频道前，父频道是否有子频道
            this.$ajax({
              url: '/channel/touch',
              type: 'POST',
              data: data,
              success: (res) => {
                if (res.code == 0) {
                  if (res.data.status == 1) {
                    this.$confirm('该频道下当前没有子频道，创建子频道之后，稿件的发布、轮播、专题等都将在各个子频道单独运营！原父频道的轮播和专题将被自动移出，父频道的存量稿件及后续各个子频道的稿件将汇总呈现在“全部”频道。是否确认创建子频道？', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消'
                    }).then(() => {
                      this.addEditQuest(data);
                    });
                  } else {
                    this.addEditQuest(data);
                  }
                } 
              },
              error: (err) => {
                this.$message({type: 'error', message: err.msg, showClose: true});
              }
            });
            
          }
        });
      },
      addEditQuest (data) {
        let url = "/channel/addChannel";
        if (this.child_channel_edit_row.id) {
          data.id = this.child_channel_edit_row.id;
          url = "/channel/update";
        }
        this.$ajax({
          url: url,
          type: "POST",
          data: data,
          success: (res) => {
            if (res.code == 0) {
              this.$message({  type: "success", message: "操作成功", showClose: "true" });
              this.getChannelList(1, 0);
              this.operate_child_channel_visible = false;
            } else {
              this.$message({ type: "error", message: res.msg, showClose: "true"});
            }
          },
          error: (error) => {
            this.$message({ type: "error", message: "请求失败", showClose: "true"});
          }
        });
      },
      closeAddEditChild () {
        // 清除
        this.$refs['operate_child_channel_form'].resetFields();
        this.operate_child_channel_visible = false;
      },
      hideShowFun (row) {
        this.$confirm(`确定${row.isHidden==0?'隐藏': '显示'}该频道？`, `${row.isHidden==0?'隐藏':'显示'}`,{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$jqAjax({
            url: apiHost + '/channel/updateChannelHidden',
            type: 'POST',
            data: {
              id: row.id,
              isHidden: row.isHidden == 0 ? 1 : 0
            },
            success: (res) => {
              this.loading = false;
              if (res.code == 0) {
                this.$message({type: 'success', message: `已${row.isHidden == 0?'隐藏':'显示'}`, showClose: true});
                if (this.tab_index == '0') {
                    this.getChannelList(0, this.search_form_1.channel_type);
                  } else {
                    this.getChannelList(1, this.search_form_2.channel_type);
                  }
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
      handleClick () {
        if (this.tab_index == '0') {
          this.channel_list = [];
          this.getChannelList(0, this.search_form_1.channel_type);
        } else {
          this.child_channel_list = [];
          this.getChannelList(1, this.search_form_2.channel_type);
        }
      },
      refreshChannelList () {
        this.$ajax({
          url: '/user/getNewsChannel',
          type: 'GET',
          data: {},
          success: (res) => {
            if (res.code == 0) {
              this.$store.commit('GETCHANNELLIST', res.data)
            }
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>
