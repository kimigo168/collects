<template>
  <div id="push-add">
    <div class="tab">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="新增推送" name="0">
          <div class="content">
            <ul class="sub-tab clearfix">
              <li>
                <a href="javascript:;" :class="{'active': sub_tab_index == '1-1'}" @click="subTabChange('1-1')">文章</a>
              </li>
              <!-- <li>
                <a href="javascript:;" :class="{'active': sub_tab_index == '1-2'}" @click="sub_tab_index = '1-2'">视频</a>
              </li> -->
              <li>
                <a href="javascript:;" :class="{'active': sub_tab_index == '1-3'}" @click="subTabChange('1-3')">专题</a>
              </li>
              <li style="float:right;line-height:50px;">
                <el-button type="primary" @click="goBackFun">返回</el-button>
              </li>
            </ul>
            <div v-show="sub_tab_index == '1-1'">
              <div class="operate">
                <div class="search">
                  <el-form :inline="true" :model="article_search_form">
                    <el-form-item><el-input type="text" v-model="article_search_form.title" placeholder="输入文章标题查找"></el-input></el-form-item>
                    <el-form-item><el-button type="primary" @click="getAddList(1)">查询</el-button></el-form-item>
                  </el-form>
                </div>
              </div>
              <p style="margin:10px 20px;">猜你想要推送的内容</p>
              <div class="table">
                <el-table :data="article_list" style="width: 100%">
                  <el-table-column align="center" type="index" label="序号" width="105"></el-table-column>
                  <el-table-column align="center" prop="title" label="标题"></el-table-column>
                  <el-table-column align="center" prop="author" label="作者"></el-table-column>
                  <el-table-column align="center" prop="publishName" label="发布者"></el-table-column>
                  <el-table-column align="center" prop="publishTime" label="发布时间"></el-table-column>
                  <el-table-column align="center" prop="source" label="来源"></el-table-column>
                  <el-table-column align="center" label="操作" width="170">
                    <template slot-scope="scope">
                      <el-button type="text" @click="push(scope.row)">推送</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="page" v-if="article_page_totle > 0">
                <el-pagination @current-change="articlePageChange" :current-page.sync="article_page_num" :page-size="article_page_size" layout="prev, pager, next, jumper" :total="article_page_totle"></el-pagination>
              </div>
            </div>
            <!-- <div v-show="sub_tab_index == '1-2'">
              <div class="operate">
                <div class="search">
                  <el-form :inline="true" :model="video_search_form">
                    <el-form-item>
                      <el-input type="text" v-model="video_search_form.title" placeholder="输入文章标题查找"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="getAddList(1)">查询</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div class="table">
                <el-table :data="video_list" style="width: 100%">
                  <el-table-column align="center" type="index" label="序号" width="105"></el-table-column>
                  <el-table-column align="center" prop="title" label="标题"></el-table-column>
                  <el-table-column align="center" prop="author" label="作者"></el-table-column>
                  <el-table-column align="center" prop="publishName" label="发布者"></el-table-column>
                  <el-table-column align="center" prop="publishTime" label="发布时间"></el-table-column>
                  <el-table-column align="center" prop="source" label="来源"></el-table-column>
                  <el-table-column align="center" label="操作" width="170">
                    <template slot-scope="scope">
                      <el-button type="text" @click="push(scope.row)">推送</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="page" v-if="article_page_totle > 0">
                <el-pagination
                    @current-change="videoPageChange"
                    :current-page.sync="video_page_num"
                    :page-size="video_page_size"
                    layout="prev, pager, next, jumper"
                    :total="video_page_totle">
                </el-pagination>
              </div>
            </div> -->
            <div v-if="sub_tab_index == '1-3'">
              <div class="operate">
                <div class="search">
                  <el-form :inline="true" :model="subject_search_form">
                    <el-form-item><el-input type="text" v-model="subject_search_form.name" placeholder="输入专题名称查找"></el-input></el-form-item>
                    <el-form-item><el-button type="primary" @click="subject_page_num=1;getSubList()">查询</el-button></el-form-item>
                  </el-form>
                </div>
              </div>
              <p style="margin:10px 20px;">猜你想要推送的内容</p>
              <div class="table">
                <el-table :data="subject_list" style="width: 100%">
                  <el-table-column align="center" type="index" label="序号" width="105"></el-table-column>
                  <el-table-column align="center" prop="name" label="名称"></el-table-column>
                  <el-table-column align="center" prop="channelName" label="频道"></el-table-column>
                  <!-- <el-table-column align="center" prop="sonChannelName" label="子频道"></el-table-column> -->
                  <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
                  <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                  <el-table-column align="center" label="操作" width="170">
                    <template slot-scope="scope">
                      <el-button type="text" @click="pushSubject(scope.row)">推送</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="page" v-if="subject_page_total > 0">
                <el-pagination @current-change="subjectPageChange" :current-page="subject_page_num" :page-size="subject_page_size" layout="prev, pager, next,jumper" :total="subject_page_total"></el-pagination>
              </div>
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
        tab_index: '0',
        sub_tab_index: '1-1',
        article_search_form: {
          title: '',
        },
        article_list: [],
        article_page_num: 1,
        article_page_size: 10,
        article_page_totle: 0,
        video_search_form: {
          title: '',
        },
        video_list: [],
        video_page_num: 1,
        video_page_size: 10,
        video_page_totle: 0,
        subject_list: [],
        subject_page_size: 10,
        subject_page_num: 1,
        subject_page_total: 0,
        subject_search_form: {
          name: ''
        }
      }
    },
    created() {
      this.getAddList(1);
    },
    methods: {
      //获取文章，视频推送列表
      getAddList(type) {
        var data = {};
        if (type == 1) {
          data = {
            pageNum: this.article_page_num,
            pageSize: this.article_page_size,
            title: this.article_search_form.title,
          }
          this.article_list = [];
        } else {
          data = {
            pageNum: this.video_page_num,
            pageSize: this.video_page_size,
            title: this.video_search_form.title,
          }
          this.video_list = [];
        }
        data.type = type;
        this.$ajax({
          url: "/push/addList",
          type: "POST",
          data: data,
          success: (data) => {
            if (data.code == 0) {
              if (type == 1) {
                this.article_list = data.data.list;
                this.article_page_totle = data.data.size;
              } else {
                this.video_list = data.data.list;
                this.video_page_totle = data.data.size;
              }
            }
          },
          error: (error) => {
            this.$message({  type: "error", message: "请求失败", showClose: 'true'})
          }
        });
      },
      // 获取专题推送列表
      getSubList () {
        this.loading = true;
        this.$ajax({
          url: '/topic/list',
          type: 'POST',
          data: {
            status: '0',
            channelId: '0',
            sonChannelId: '0',
            name: this.subject_search_form.name,
            pageNum: this.subject_page_num,
            pageSize: this.subject_page_size
          },
          success: (res) => {
            if (res.code == 0) {
              this.subject_list = res.data.list;
              this.subject_page_total = res.data.total;
            } else {
              this.$message({type: 'warning', message: res.msg, showClose: true});
            }
          },
          error: (err) => {
            this.$message({type: 'warning', message: err.msg, showClose: true});
          }
        });
      },
      articlePageChange(val) {
        this.article_page_num = val;
        this.getAddList(1);
      },
      videoPageChange(val) {
        this.article_page_num = val;
        this.getAddList(3);
      },
      subjectPageChange(val) {
        this.subject_page_num = val;
        this.getSubList();
      },
      //推送
      push(row) {
        const h = this.$createElement;
        this.$msgbox({
          title: '推送',
          message: h('div',{style: 'margin:10px 10px;line-height:24px;'}, [
            h('p', {}, [h('span',{style: 'color: #000;'}, '标题：'),
              h('input', {style:'color: #000;width:280px;height:24px;text-indent:4px;line-height:24px;', attrs: {placeholder:'请输入标题',value:row.title}, ref:"inputTitle", key: `${new Date().getTime()}`},'')
            ]),
            h('p', {style:'margin:10px 0;'}, [h('span',{style: 'color: #000;vertical-align:top;'}, '摘要：'),
              h('textarea', {style:'color: #000;width:280px;height:64px;text-indent:4px;line-height:24px;', attrs: {placeholder:'请输入摘要'}, ref:"inputBrief", key: `${new Date().getTime()}`},'')
            ])
          ]),
          showConfrimButton: true,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              let inputTitle = this.$refs.inputTitle.value;
              let inputBrief = this.$refs.inputBrief.value;
              if (!inputTitle) {
                this.$message({type:'warning', message: '请输入标题', showClose: true});
                return;
              }
              if (!inputBrief) {
                this.$message({type:'warning', message: '请填写摘要', showClose: true});
                return;
              }
              this.loading = true;
              this.$ajax({
                url:'/push/push',
                type: 'POST',
                data: {
                  cid: row.cid,
                  title: inputTitle,
                  content: inputBrief,
                  contentType: 1
                },
                success: (res) => {
                  this.loading = false;
                  if (res.code == 0) {
                    this.$message({type: 'success', message: '推送成功', showClose: true});
                  } else {
                    this.$message({type: 'error', message: `${res.msg}`, showClose: true});
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
      // 专题推送
      pushSubject (row) {
        const h = this.$createElement;
        this.$msgbox({
          title: '推送',
          message: h('div',{style: 'margin:10px 10px;line-height:24px;'}, [
            h('p', {}, [h('span',{style: 'color: #000;'}, '标题：'),
              h('input', {style:'color: #000;width:280px;height:24px;text-indent:4px;line-height:24px;', attrs: {placeholder:'请输入标题',value:row.name}, ref:"inputTitle", key: `${new Date().getTime()}`},'')
            ]),
            h('p', {style:'margin:10px 0;'}, [h('span',{style: 'color: #000;vertical-align:top;'}, '摘要：'),
              h('textarea', {style:'color: #000;width:280px;height:64px;text-indent:4px;line-height:24px;', attrs: {placeholder:'请输入摘要'}, ref:"inputBrief", key: `${new Date().getTime()}`},'')
            ])
          ]),
          showConfrimButton: true,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              let inputTitle = this.$refs.inputTitle.value;
              let inputBrief = this.$refs.inputBrief.value;
              if (!inputTitle) {
                this.$message({type:'warning', message: '请输入标题', showClose: true});
                return;
              }
              if (!inputBrief) {
                this.$message({type:'warning', message: '请填写摘要', showClose: true});
                return;
              }
              this.loading = true;
              this.$ajax({
                url:'/push/push',
                type: 'POST',
                data: {
                  cid: row.topicId,
                  title: inputTitle,
                  content: inputBrief,
                  contentType: 2
                },
                success: (res) => {
                  this.loading = false;
                  if (res.code == 0) {
                    this.$message({type: 'success', message: '推送成功', showClose: true});
                    
                  } else {
                    this.$message({type: 'error', message: `${res.msg}`, showClose: true});
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
      subTabChange (index) {
        this.sub_tab_index = index;
        if (this.sub_tab_index == '1-1') {
          this.article_page_num = 1;
          this.getAddList(1)
        } else if (this.sub_tab_index == '1-3') {
          this.subject_page_num = 1;
          this.getSubList();
        }
      },
      goBackFun () {
        this.$router.go(-1);
      }
    }
  }
</script>

<style lang="scss">
  #push-add {
    .operate {
      .el-input {
        width: 350px !important;
      }
    }
  }
</style>
