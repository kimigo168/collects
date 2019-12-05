<template>
  <div id="original">
    <div class="tab">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="专题内容" name="1">
          <div class="content">
            <ul class="sub-tab clearfix">
              <li>
                <a href="javascript:;" :class="{'active': sub_tab_index_1 == '1-1'}" @click="sub_tab_index_1 = '1-1'">已发布</a>
              </li>
              <li>
                <a href="javascript:;" :class="{'active': sub_tab_index_1 == '1-2'}" @click="sub_tab_index_1 = '1-2'">已移出</a>
              </li>
            </ul>
            <div v-show="sub_tab_index_1 == '1-1'">
              <div class="operate">
                <div class="search">
                  <el-form :inline="true" :model="subject_content_form_1">
                    <el-form-item label="时间">
                      <el-date-picker
                          v-model="subject_content_form_1.date"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="">查询</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div class="table">
                <el-table
                    :data="subject_content_list_1"
                    style="width: 100%">
                  <el-table-column align="center" type="index" label="序号" width="105"></el-table-column>
                  <el-table-column align="center" prop="imageUrl" label="封面" width="">
                    <template slot-scope="scope">
                      <img :src="scope.row.imageUrl">
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="title" label="标题"></el-table-column>
                  <el-table-column align="center" prop="author" label="作者"></el-table-column>
                  <el-table-column align="center" prop="channel" label="频道"></el-table-column>
                  <el-table-column align="center" prop="subChannel" label="子频道"></el-table-column>
                  <el-table-column align="center" prop="isRecommond" label="是否推荐">
                    <template slot-scope="scope">
                      <span v-if="scope.row.isRecommond == 0">否</span>
                      <span v-if="scope.row.isRecommond == 1">是</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                  <el-table-column align="center" prop="address" label="操作">
                    <template slot-scope="scope">
                      <p>
                        <el-button type="text">送审</el-button>
                        <el-button type="text" class="wran-color">修改</el-button>
                      </p>
                      <p>
                        <el-button type="text" class="danger-color">打回</el-button>
                        <el-button type="text">修改记录</el-button>
                      </p>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="page" v-if="subject_content_page_total_1 > 0">
                <el-pagination
                    @current-change="subjectPageNumChange"
                    :current-page.sync="subject_content_page_num_1"
                    :page-size="subject_content_page_size_1"
                    layout="prev, pager, next, jumper"
                    :total="subject_content_page_total_1">
                </el-pagination>
              </div>
            </div>
            <div v-show="sub_tab_index_1 == '1-2'">
              <div class="operate">
                <div class="search">
                  <el-form :inline="true" :model="subject_content_form_1">
                    <el-form-item label="时间">
                      <el-date-picker
                          v-model="subject_content_form_1.date"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="">查询</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div class="table">
                <el-table
                    :data="subject_content_list_1"
                    style="width: 100%">
                  <el-table-column align="center" type="index" label="序号" width="105"></el-table-column>
                  <el-table-column align="center" prop="imageUrl" label="封面" width="">
                    <template slot-scope="scope">
                      <img :src="scope.row.imageUrl">
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="title" label="标题"></el-table-column>
                  <el-table-column align="center" prop="author" label="作者"></el-table-column>
                  <el-table-column align="center" prop="channel" label="频道"></el-table-column>
                  <el-table-column align="center" prop="subChannel" label="子频道"></el-table-column>
                  <el-table-column align="center" prop="isRecommond" label="是否推荐">
                    <template slot-scope="scope">
                      <span v-if="scope.row.isRecommond == 0">否</span>
                      <span v-if="scope.row.isRecommond == 1">是</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                  <el-table-column align="center" prop="address" label="操作">
                    <template slot-scope="scope">
                      <p>
                        <el-button type="text">送审</el-button>
                        <el-button type="text" class="wran-color">修改</el-button>
                      </p>
                      <p>
                        <el-button type="text" class="danger-color">打回</el-button>
                        <el-button type="text">修改记录</el-button>
                      </p>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="page" v-if="subject_content_page_total_1 > 0">
                <el-pagination
                    @current-change="subjectPageNumChange"
                    :current-page.sync="subject_content_page_num_1"
                    :page-size="subject_content_page_size_1"
                    layout="prev, pager, next, jumper"
                    :total="subject_content_page_total_1">
                </el-pagination>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="专题设置" name="2">
          <div class="content">
            <ul class="sub-tab clearfix">
              <li>
                <a href="javascript:;" :class="{'active': sub_tab_index_2 == '2-1'}" @click="sub_tab_index_2 = '2-1'">已创建</a>
              </li>
              <li>
                <a href="javascript:;" :class="{'active': sub_tab_index_2 == '2-2'}" @click="sub_tab_index_2 = '2-2'">已下架</a>
              </li>
            </ul>
            <div v-show="sub_tab_index_2 == '2-1'">
              <div class="operate clearfix">
                <div class="search lt">
                  <el-form :inline="true" :model="subject_set_form_1">
                    <el-form-item label="时间">
                      <el-date-picker
                          v-model="subject_content_form_1.date"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="">查询</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="btn rt">
                  <el-button type="primary" @click="subjectOperate(undefined)">新建专题</el-button>
                </div>
              </div>
              <div class="table">
                <el-table
                    :data="subject_set_list_1"
                    style="width: 100%">
                  <el-table-column align="center" type="index" label="序号" width="105"></el-table-column>
                  <el-table-column align="center" prop="cover" label="封面" width="">
                    <template slot-scope="scope">
                      <img :src="scope.row.cover">
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="name" label="标题"></el-table-column>
                  <el-table-column align="center" prop="channelName" label="频道"></el-table-column>
                  <el-table-column align="center" prop="sonChannelName" label="子频道"></el-table-column>
                  <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
                  <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                  <!--<el-table-column align="center" prop="createTime" label="发布时间"></el-table-column>-->
                  <el-table-column align="center" prop="address" label="操作">
                    <template slot-scope="scope">
                      <el-button type="text" @click="subjectOperate(scope.row)">编辑</el-button>
                      <el-button type="text" @click="shelveOperate(scope.row)">下架</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="page" v-if="subject_set_page_total_1 > 0">
                <el-pagination
                    @current-change="subjectPageNumChange"
                    :current-page.sync="subject_set_page_num_1"
                    :page-size="subject_set_page_size_1"
                    layout="prev, pager, next, jumper"
                    :total="subject_set_page_total_1">
                </el-pagination>
              </div>
            </div>
            <div v-show="sub_tab_index_2 == '2-2'">
              <div class="operate">
                <div class="search">
                  <el-form :inline="true" :model="subject_set_form_2">
                    <el-form-item label="时间">
                      <el-date-picker
                          v-model="subject_set_form_2.date"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="">查询</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div class="table">
                <el-table
                    :data="subject_set_list_2"
                    style="width: 100%">
                  <el-table-column align="center" type="index" label="序号" width="105"></el-table-column>
                  <el-table-column align="center" prop="cover" label="封面" width="">
                    <template slot-scope="scope">
                      <img :src="scope.row.cover">
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="name" label="标题"></el-table-column>
                  <el-table-column align="center" prop="channelName" label="频道"></el-table-column>
                  <el-table-column align="center" prop="sonChannelName" label="子频道"></el-table-column>
                  <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
                  <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                  <!--<el-table-column align="center" prop="createTime" label="发布时间"></el-table-column>-->
                  <el-table-column align="center" prop="address" label="操作">
                    <template slot-scope="scope">
                      <el-button type="text" @click="subjectOperate(scope.row)">编辑</el-button>
                      <el-button type="text" @click="shelveOperate(scope.row)">恢复上架</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="page" v-if="subject_set_page_total_2 > 0">
                <el-pagination
                    @current-change="subjectPageNumChange"
                    :current-page.sync="subject_set_page_num_2"
                    :page-size="subject_set_page_size_2"
                    layout="prev, pager, next, jumper"
                    :total="subject_set_page_total_2">
                </el-pagination>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!--新增编辑专题-->
    <el-dialog :title="!subject_edit_row.id ? '新增专题' : '编辑专题'" :visible.sync="operate_subject_visible"
               width="30%">
      <el-form :model="operate_subject_form" ref="operate_subject_form"
               :rules="operate_subject_form_rules"
               label-width="100px">
        <el-form-item label="专题名称" prop="subject_name">
          <el-input type="text" v-model="operate_subject_form.subject_name"></el-input>
        </el-form-item>
        <el-form-item label="所属频道">
          <el-col :span="11">
            <el-select v-model="operate_subject_form.channel_parent" @change="getChildChannelList">
              <el-option v-for="list in $store.state.channel_list[0]" :key="list.id" :value="list.id"
                         :label="list.name"></el-option>
            </el-select>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-select v-model="operate_subject_form.channel_child">
              <el-option v-for="list in channel_child_list" :key="list.id" :value="list.id"
                         :label="list.name"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="选入轮播">
          <el-switch
              v-model="operate_subject_form.select_to_carousel"
              active-color="#13ce66"
              inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="专题封面">
          <div class="upload">
            <el-upload
                class="avatar-uploader"
                :action="host + '/common/upload'"
                ref="upload"
                :show-file-list="false"
                :on-success="successUpload"
                :before-upload="beforeUpload">
              <img v-if="operate_subject_form.cover_url" :src="operate_subject_form.cover_url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="operate_subject_visible = false">取 消</el-button>
        <el-button type="primary" @click="subjectOperateDo('operate_subject_form')">确 定</el-button>
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
        sub_tab_index_1: '1-1',
        sub_tab_index_2: '2-1',

        //专题内容-已发布
        subject_content_form_1: {
          date: "",
          channel: "",
          column: "",
          title: "",
          author: "",
        },
        subject_content_list_1: [],
        subject_content_page_num_1: 1,
        subject_content_page_size_1: 10,
        subject_content_page_total_1: 0,

        //专题设置-已创建
        subject_set_form_1: {
          date: "",
        },
        subject_set_list_1: [],
        subject_set_page_num_1: 1,
        subject_set_page_size_1: 10,
        subject_set_page_total_1: 0,

        //新增编辑专题
        operate_subject_visible: false,
        operate_subject_form: {
          subject_name: '',
          channel_parent: '',
          channel_child: '',
          select_to_carousel: true,
          cover_url: 'http://www.baidu.com',
        },
        operate_subject_form_rules: {},
        channel_parent_list: [],
        channel_child_list: [],
        subject_edit_row: {},

        //专题设置-已下架
        subject_set_form_2: {
          date: "",
        },
        subject_set_list_2: [],
        subject_set_page_num_2: 1,
        subject_set_page_size_2: 10,
        subject_set_page_total_2: 0,
      }
    },
    created() {
      this.getSubjectSetList(0)
      this.getSubjectSetList(1)
      this.host = apiHost;
    },
    methods: {
      //获取专题设置列表数据
      getSubjectSetList(status) {
        var self = this;
        var data;
        if (status == 0) {
          data = {
            timeStart: !self.subject_set_form_1.date ? '' : self.subject_set_form_1.date[0],
            timeEnd: !self.subject_set_form_1.date ? '' : self.subject_set_form_1.date[1],
            status: status
          }
        } else {
          data = {
            timeStart: !self.subject_set_form_2.date ? '' : self.subject_set_form_2.date[0],
            timeEnd: !self.subject_set_form_2.date ? '' : self.subject_set_form_2.date[1],
            status: status
          }
        }
        self.$ajax({
          url: "/topic/list",
          type: "POST",
          data: data,
          success: function (data) {
            if (data.code == 0) {
              if (status == 0) {
                try {
                  self.subject_set_list_1 = data.data.list;
                  self.subject_set_page_total_1 = data.data.total;
                } catch (e) {
                  console.log(e);
                }
              } else {
                try {
                  self.subject_set_list_2 = data.data.list;
                  self.subject_set_page_total_2 = data.data.total;
                } catch (e) {
                  console.log(e);
                }
              }
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
      },
      subjectPageNumChange(val) {
        this.subject_content_page_num_1 = val;
      },

      beforeUpload(file) {
      },

      successUpload(res, file) {
        if (res && res.data && res.data.url) {
          this.operate_subject_form.cover_url = res.data.url;
        } else {
          this.operate_subject_form.cover_url = '';
        }
      },

      subjectOperate(row) {
        this.operate_subject_visible = true;
        if (row) {
          this.subject_edit_row = row;
          this.operate_subject_form.subject_name = row.name
          this.operate_subject_form.channel_parent = row.channelId;
          this.getChildChannelList(row.channelId);
          this.operate_subject_form.channel_child = row.sonChannelId;
          this.operate_subject_form.select_to_carousel = !!row.status;
          this.operate_subject_form.cover_url = row.cover;
        } else {
          this.subject_edit_row = {};
          this.operate_subject_form.subject_name = "";
          this.operate_subject_form.channel_parent = "";
          this.operate_subject_form.channel_child = "";
          this.operate_subject_form.select_to_carousel = false;
          this.operate_subject_form.cover_url = "";
        }
      },

      subjectOperateDo(formName) {
        var self = this;
        self.$refs[formName].validate(valid => {
          if (valid) {
            var data, url;
            data = {
              name: self.operate_subject_form.subject_name,
              channelId: self.operate_subject_form.channel_parent,
              sonChannelId: self.operate_subject_form.channel_child,
              selectedCarousel: Number(self.operate_subject_form.select_to_carousel),
              cover: self.operate_subject_form.cover_url,
            }
            url = "/topic/add";
            if (self.subject_edit_row.id) {
              data.id = self.subject_edit_row.id;
              url = "/topic/update";
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
                    showClose: 'true',
                  })
                  self.getSubjectSetList(0);
                  self.operate_subject_visible = false;
                } else {
                  self.$message({
                    type: "error",
                    message: "操作失败",
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
          }
        })
      },

      getChildChannelList(val) {
        var list = this.$store.state.channel_list;
        for (var i = 0; i < list.length; i++) {
          if (list[i].id == val) {
            this.channel_child_list = list[i].sonList || [];
            return;
          }
        }
      },

      shelveOperate(row) {
        var self = this;
        var txt = row.status == 0 ? '下架' : '重新上架';
        self.$confirm('确定' + txt + '该专题吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$ajax({
            url: "/topic/update",
            type: "POST",
            data: {
              name: row.name,
              channelId: row.channelId,
              sonChannelId: self.sonChannelId,
              selectedCarousel: row.selectedCarousel,
              cover: row.cover,
              id: row.id,
              status: row.status == 0 ? 1 : 0
            },
            success: function (data) {
              if (data.code == 0) {
                self.$message({
                  type: "success",
                  message: "操作成功",
                  showClose: 'true',
                })
                self.getSubjectSetList(0);
                self.getSubjectSetList(1);
              } else {
                self.$message({
                  type: "error",
                  message: "操作失败",
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
            message: '已取消操作'
          });
        });
      }
    }
  }
</script>

<style lang="scss">
  #original {

  }
</style>
