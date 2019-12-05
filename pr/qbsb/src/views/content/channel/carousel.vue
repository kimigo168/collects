<template>
  <div id="original">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="轮播内容" name="0">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="content_search_form">
                  <el-form-item label="内容状态">
                    <el-select v-model="content_search_form.status" @change="getContentList(content_search_form.status, content_search_form.type)">
                      <el-option label="已发布" value="0"></el-option>
                      <el-option label="已移出" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <!-- <el-form-item label="频道类型">
                    <el-select v-model="content_search_form.type" @change="searchTypeChange">
                      <el-option label="文章" value="0"></el-option>
                      <el-option label="视频" value="1"></el-option>
                    </el-select>
                  </el-form-item> -->
                  <el-form-item label="频道" v-if="content_search_form.type == 0" prop="channel">
                    <el-select v-model="content_search_form.news_channel" @change="getChildChannel">
                      <el-option v-for="list in newsParentChannelList" :key="list.id" :value="list.id" :label="list.name"></el-option>
                    </el-select>
                    <!-- <el-col :span="11" :offset="2">
                      <el-select v-model="content_search_form.news_channel_child">
                        <el-option v-for="list in child_channel_list" :key="list.id" :value="list.id"
                                   :label="list.name"></el-option>
                      </el-select>
                    </el-col> -->
                  </el-form-item>
                  <el-form-item label="子频道" v-if="content_search_form.type == 0">
                    <el-select v-model="content_search_form.news_channel_child">
                      <el-option value="" label="全部"></el-option>
                      <el-option v-for="list in newsChildChannelList" :key="list.id" :value="list.id"
                                   :label="list.name"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="频道" v-if="content_search_form.type == 1" prop="video_channel">
                    <el-select v-model="content_search_form.video_channel">
                      <el-option v-for="list in videoParentChannelList" :key="list.id" :value="list.id"
                                 :label="list.name"></el-option>
                    </el-select>

                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary"
                               @click="getContentList(content_search_form.status,content_search_form.type)">查询
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="content_list" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
                <el-table-column align="center" prop="cover" label="封面" width="">
                  <template slot-scope="scope">
                     <defaultImage :url="scope.row.cover"></defaultImage>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="标题"></el-table-column>
                <el-table-column align="center" prop="channelName" label="频道"></el-table-column>
                <el-table-column align="center" prop="sonChannelName" label="子频道"
                                 v-if="content_search_form.type == 0"></el-table-column>
                <el-table-column align="center" prop="subChannel" label="内容类型">
                  <template slot-scope="scope">
                    <span>{{scope.row.contextType==0?'资讯':scope.row.contextType==1?'专题':scope.row.contextType==4?'视频':'广告'}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="publishTime" label="发布时间"></el-table-column>
                <el-table-column align="center" prop="" label="操作" width="150" v-if="content_search_form.status == 0">
                  <template slot-scope="scope">
                    <el-button type="text" @click="move(scope.row.id,0)" v-if="scope.$index !=0">上移</el-button>
                    <el-button type="text" @click="move(scope.row.id,1)" v-if="scope.$index !=content_list.length-1">下移</el-button>
                    <p>
                      <el-button v-if="scope.row.contextType==0" type="text" @click="editFun(scope.row)">修改</el-button>
                      <el-button type="text" @click="moveOut(scope.row.id)">移出</el-button>
                    </p>
                    <p v-if="scope.row.contextType==0">
                      <el-button type="text" @click="viewInit(scope.row)">原始标题封面</el-button>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="轮播设置" name="1">
          <div class="content">
            <div class="operate clearfix">
              <div class="search lt">
                <el-form :inline="true" :model="set_search_form">
                  <el-form-item label="轮播状态">
                    <el-select v-model="set_search_form.status"
                               @change="getSetList(set_search_form.status, set_search_form.type)">
                      <el-option label="已创建" value="0"></el-option>
                      <el-option label="已下架" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <!-- <el-form-item label="轮播类型">
                    <el-select v-model="set_search_form.type"
                               @change="getSetList(set_search_form.status, set_search_form.type)">
                      <el-option label="文章轮播" value="0"></el-option>
                      <el-option label="视频轮播" value="1"></el-option>
                    </el-select>
                  </el-form-item> -->
                  <el-form-item>
                    <el-button type="primary"
                               @click="getSetList(set_search_form.status,set_search_form.type)">查询
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="btn rt">
                <el-button type="primary"
                           @click="carsouselOperate(undefined)">新建轮播
                </el-button>
              </div>
            </div>
            <div class="table">
              <el-table :data="set_list" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
                <el-table-column align="center" prop="channelName" label="所属频道"></el-table-column>
                <el-table-column align="center" prop="sonChannelName" label="子频道"></el-table-column>
                <!-- <el-table-column align="center" prop="limitNum" label="内容限制条数"></el-table-column> -->
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="" label="操作" width="150">
                  <template slot-scope="scope">
                    <!-- <el-button type="text" @click="carsouselOperate(scope.row)">编辑</el-button> -->
                    <el-button type="text" @click="shelveOperate(scope.row)" v-show="scope.row.status == 0">下架
                    </el-button>
                    <el-button type="text" @click="shelveOperate(scope.row)" v-show="scope.row.status == 1">恢复上架
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <!--新增编辑轮播-->
      <el-dialog :title="!carousel_edit_row.id ? '新增轮播' : '编辑轮播'" :visible.sync="operate_carousel_visible" :before-close="closeAddCarousel" :close-on-click-modal="false">
        <el-form :model="operate_carousel_form" ref="operate_carousel_form" :rules="operate_carousel_form_rules"
                 label-width="120px">
          <!-- <el-form-item label="轮播类型" prop="type" v-if="!carousel_edit_row.id">
            <el-select v-model="operate_carousel_form.type" @change="typeChange">
              <el-option label="文章轮播" value="0"></el-option>
              <el-option label="视频轮播" value="1"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="频道" v-if="operate_carousel_form.type == 0" prop="channel">
            <el-col :span="11">
              <el-select v-model="operate_carousel_form.channel" @change="getChildChannel1" :disabled="carousel_edit_row.id?true:false">
                <el-option v-for="list in newsParentChannelList" :key="list.id" :value="list.id" :label="list.name"></el-option>
              </el-select>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-select v-model="operate_carousel_form.channel_child" :disabled="carousel_edit_row.id?true:false">
                <el-option v-for="list in newsChildChannelList" :key="list.id" :value="list.id"
                           :label="list.name"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="频道" v-else prop="channel">
            <el-select v-model="operate_carousel_form.channel" :disabled="carousel_edit_row.id?true:false">
              <el-option v-for="list in videoParentChannelList" :key="list.id" :value="list.id"
                         :label="list.name"></el-option>
            </el-select>

          </el-form-item>
          <!-- <el-form-item label="内容限制个数" prop="limit">
            <el-input v-model.number="operate_carousel_form.limit"></el-input>
          </el-form-item>
          <el-form-item v-if="carousel_edit_row.id" label="已选内容个数">
            <span>{{operate_carousel_form.hasAddedNum}}</span>  
          </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="operate_carousel_visible = false">取 消</el-button>
          <el-button type="primary" @click="carsouselOperateDo('operate_carousel_form')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改轮播弹窗 -->
      <insert-carousel v-if="isShowInsertCarousel" :insertData="insertData" @fClosePop="isShowInsertCarousel=false" @fConfirmInsert="editCarouselFun"></insert-carousel>
    </div>
  </div>
</template>

<script>
  import insertCarousel from '../../../components/insertCarousel';
  export default {
    data() {
      var check_limit = (rule, value, callback) => {
        if (!Number.isInteger(value)) {
          return callback(new Error("请输入数字值!"));
        } else {
          if (value < 1) {
            return callback(new Error("内容限制个数不能小于1!"));
          } else {
            callback();
          }
        }
      };
      return {
        tab_index: "0",
        channel_list: [],
        child_channel_list: [],
        loading: false,
        //轮播内容
        content_search_form: {
          status: "0",
          type: "0",
          news_channel: "",
          news_channel_child: "",
          video_channel: ""
        },
        content_list: [],
        //轮播设置
        set_search_form: {
          status: "0",
          type: "1",
        },
        set_list: [],
        //新增&编辑轮播
        operate_carousel_visible: false,
        operate_carousel_form: {
          type: "0",
          channel: "",
          channel_child: "",
          video_channel: "",
          limit: "",
          hasAddedNum: 0
        },
        operate_carousel_form_rules: {
          type: [
            {required: true, message: "轮播类型不能为空!", trigger: "blur"}
          ],
          channel: [
            {required: true, message: "轮播频道不能为空!", trigger: "change"}
          ]
          // ,
          // limit: [
          //   {required: true, message: "内容限制个数不能为空!", trigger: "blur"},
          //   {validator: check_limit, trigger: "blur"}
          // ]
        },
        carousel_edit_row: {},
        isShowInsertCarousel: false, // 选入轮播弹窗
        insertData: {
          title: '', // 标题
          cover: '', // 封面
          status: 'view' // 修改
        },
        insertDataRow: null, // 插入轮播的项
        newsParentChannelList: [],
        newsChildChannelList: [],
        videoParentChannelList: []
      };
    },
    components: {
      insertCarousel
    },
    created() {
      // this.$getNewsChannelList();
      this.getNewsChannel();
      // this.getChannelList();
      this.$getVideoChannel();
      this.getSetList(0, 0);

    },
    methods: {
      getNewsChannel (id) {
        this.$jqAjax({
          url: apiHost + '/user/getNewsChannel',
          type: 'POST',
          data: {
            pid: id
          },
          success: (res) => {
            if (res.code == 0) {
              if (id) { // 请求子频道
                this.newsChildChannelList = res.data;
                if (this.tab_index == '1') {
                  this.operate_carousel_form.channel_child = this.newsChildChannelList &&this.newsChildChannelList.length > 0 ? this.newsChildChannelList[0].id : '';
                }
              } else { // 请求父频道
                this.newsParentChannelList = res.data;
                if (this.newsParentChannelList.length > 0) {
                  this.content_search_form.news_channel = this.newsParentChannelList[0].id
                  this.getNewsChannel(this.newsParentChannelList[0].id);
                  this.getContentList(this.content_search_form.status, this.content_search_form.type);
                }
              }
            }
          },
          error: (err) => {
            this.$message({type: 'warning', message: err.msg, showClose: true});
          }
        });
      },
      getChildChannel(val) {
        this.newsChildChannelList = [];
        this.content_search_form.news_channel_child = '';
        this.getNewsChannel(this.content_search_form.news_channel);
      },
      /**
       * 获取轮播内容列表
       * @param status 轮播状态 0: 已发布, 1: 已移出
       * @param type 轮播类型 0: 文章轮播, 1: 视频轮播
       */
      getContentList(status, type) {
        var self = this;
        self.$ajax({
          url: "/carousel/contentList",
          type: "POST",
          data: {
            status: status,
            type: type,
            channelId: self.content_search_form.type == 0
              ? self.content_search_form.news_channel : self.content_search_form.video_channel,
            sonChannelId: self.content_search_form.type == 0
              ? self.content_search_form.news_channel_child : ""
          },
          success: function (res) {
            if (res.code == 0) {
              try {
                let data = res.data;
                self.content_list = data;
                // self.content_list.map((item, index) => {
                //   if (item.cover) {
                //     try {
                //       let cover = JSON.parse(item.cover)
                //       self.$set(item, 'coverUrl', cover[0].url||'')
                //     } catch (error) {
                //       self.$set(item, 'coverUrl', '')
                //     }
                //   }
                // })
              } catch (e) {
                console.log(e);
              }
            }
          },
          error: function (err) {
          }
        });
      },
      //搜索框轮播类型改变
      searchTypeChange(val) {
        if (val == 1) {
          this.content_search_form.video_channel = this.videoParentChannelList&&this.videoParentChannelList[0]?this.videoParentChannelList[0].id : '';
          this.content_search_form.news_channel = "";
          this.content_search_form.news_channel_child = "";
        } else {
          this.content_search_form.video_channel = "";
          this.content_search_form.news_channel = this.newsParentChannelList&&this.newsParentChannelList[0]?this.newsParentChannelList[0].id : '';
          this.getChildChannel(this.content_search_form.news_channel)
        }
        this.getContentList(this.content_search_form.status, this.content_search_form.type)
      },
      //移出
      moveOut(id) {
        var self = this;
        self.$confirm("确定从轮播中移出该内容吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          self.$ajax({
            url: "/carousel/removeContext",
            type: "GET",
            data: {
              id: id
            },
            success: function (data) {
              if (data.code == 0) {
                self.$message({
                  type: "success",
                  message: "移出成功",
                  showClose: "true"
                });
                self.getContentList(self.content_search_form.status, self.content_search_form.type);
              } else {
                self.$message({
                  type: "error",
                  message: "移出失败",
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
        });
      },
      editFun (row) {
        this.insertDataRow = row;
        this.insertData.status = 'edit';
        this.insertData.title = row.title;
        this.insertData.cover = row.cover;
        this.isShowInsertCarousel = true;
      },
      viewInit (row) {
        this.insertDataRow = row;
        this.insertData.status = 'view';
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/carousel/showBaseCoverTitle',
          type: 'POST',
          data: {
            id: row.id
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.insertData.title = res.data.title;
              this.insertData.cover = res.data.cover;
              this.insertDataRow.status = 'view';
              this.isShowInsertCarousel = true;
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
      //获取轮播设置列表
      /**
       *
       * @param status 轮播状态 0: 已创建, 1: 已下架
       * @param type 轮播类型 0: 文章轮播, 1: 视频轮播
       */
      getSetList(status, type) {
        var self = this;
        this.loading = true;
        self.$ajax({
          url: "/carousel/list",
          type: "GET",
          data: {
            status: self.set_search_form.status,
            type: self.set_search_form.type,
          },
          success: function (res) {
            self.loading = false;
            if (res.code == 0) {
              try {
                self.set_list = res.data;
              } catch (e) {
                console.log(e);
              }
            }
          },
          error: function (err) {
            self.loading = false;
          }
        });
      },
      //频道类型改变，重置表单填充的值
      typeChange(val) {
        this.operate_carousel_form.channel = "";
        if (val == 0) {
          this.operate_carousel_form.channel_child = "";
        } else {
          this.operate_carousel_form.channel = this.videoParentChannelList && this.videoParentChannelList[0]?this.operate_carousel_form.channel[0].id : '';
        }
      },
      //获取资讯频道子频道
      getChildChannelList(val) {
        var list = this.channel_list["news"];
        if (this.tab_index == '0') { // 轮播内容
          this.content_search_form.news_channel_child = '';
        } else { // 新建轮播
          this.operate_carousel_form.channel_child = '';
        }
        for (var i = 0; i < list.length; i++) {
          if (list[i].id == val) {
            this.child_channel_list = list[i].sonList || [];
            if (this.tab_index == '1' && this.child_channel_list.length > 0) {
              this.operate_carousel_form.channel_child = this.child_channel_list[0].id;
            }
            return;
          }
        }
      },
      getHasAdded (id) {
        this.$ajax({
          url: '/carousel/count',
          type:'POST',
          data: {
            id: id
          },
          success: (res) => {
            console.log('res', res);
            if (res.code == 0) {
              this.operate_carousel_form.hasAddedNum = res.data.count;
            } else {
              this.$message({type: 'error', message: res.msg, showClose: true});
            }
          },
          error: (err) => {
            this.$message({type: 'error', message: err.msg, showClose: true});
          }
        });
      },
      //新增&修改轮播
      carsouselOperate(row) {
        this.operate_carousel_visible = true;
        if (row) {
          this.carousel_edit_row = row;
          this.operate_carousel_form.type = row.type;
          this.getHasAdded(row.id);
          if (row.type == 0) {
            this.operate_carousel_form.channel = row.channelId;
            this.getChildChannelList(row.channelId);
            this.operate_carousel_form.channel_child = row.sonChannelId;
            this.operate_carousel_form.limit = row.limitNum;
          } else {
            this.operate_carousel_form.channel = row.channelId;
            this.operate_carousel_form.limit = row.limitNum;
          }
        } else {
          this.carousel_edit_row = {};
          this.operate_carousel_form.type = "0";
          this.operate_carousel_form.channel = "";
          this.operate_carousel_form.channel_child = "";
          this.operate_carousel_form.limit = "";
        }
      },
      carsouselOperateDo(formName) {
        var self = this;
        self.$refs[formName].validate(valid => {
          if (valid) {
            if (self.carousel_edit_row.id) {
              if (self.operate_carousel_form.limit < self.operate_carousel_form.hasAddedNum) {
                self.$confirm('设置的内容个数少于当前轮播内已选入的内容个数，请先移出轮播中的部分内容！', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                }).then(() => {});
                return
              }
              self.carouselOperateQuest();
            } else {
              if (self.newsChildChannelList && self.newsChildChannelList.length > 0) {
                self.carouselOperateQuest();
              } else {
                self.$jqAjax({
                  url: apiHost + '/channel/touchSonChannel',
                  type: 'POST',
                  data: {
                    channelPid: self.operate_carousel_form.channel
                  },
                  success: (res) => {
                    if (res.code == 0) {
                      if (res.data.status == 1) {
                        self.carouselOperateQuest();
                      } else {
                        self.$message({type: 'error', message: res.msg?res.msg: '当前频道下存在子频道，请通知管理员分配相应权限!', showClose: true});
                      }
                    } else {
                      self.$message({type: 'error', message: res.msg, showClose: true});
                    }
                  },
                  error: (err) => {
                    self.$message({type: 'error', message: err.msg, showClose: true});
                  }
                });
              }
              
            }
          } else {
            console.log("error submit");
          }
        });
      },
      carouselOperateQuest () {
        let self = this;
        var data = {
          type: self.operate_carousel_form.type,
          channelId: self.operate_carousel_form.channel,
          sonChannelId: self.operate_carousel_form.channel_child,
          limitNum: self.operate_carousel_form.limit
        };
        var url = "/carousel/add";
        if (self.carousel_edit_row.id) { 
          data.id = self.carousel_edit_row.id;
          url = "/carousel/update";
        }
        self.$ajax({
          url: url,
          type: "POST",
          data: data,
          success: function (data) {
            if (data.code == 0) {
              self.$message({ type: "success", message: "操作成功", showClose: "true"});
              self.getSetList(self.set_search_form.status, self.set_search_form.type);
              self.operate_carousel_visible = false;
            } else {
              self.$message({ type: "error", message: data.msg,  showClose: "true"});
            }
          },
          error(error) {
            self.$message({ type: "error", message: data.msg, showClose: "true"});
          }
        });
      },
      closeAddCarousel () {
        this.$refs['operate_carousel_form'].resetFields();
        this.operate_carousel_visible = false;
      },
      //下架&恢复上架
      shelveOperate(row) {
        var self = this;
        var txt = row.status == 0 ? "下架" : "恢复上架";
        self
          .$confirm("确定" + txt + "该轮播吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            self.$ajax({
              url: "/carousel/update",
              type: "POST",
              data: {
                id: row.id,
                status: row.status == 0 ? 1 : 0
              },
              success: function (data) {
                if (data.code == 0) {
                  self.$message({
                    type: "success",
                    message: "操作成功",
                    showClose: "true"
                  });
                  self.getSetList(self.set_search_form.status, self.set_search_form.type);
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
          })
      },
      //上移下移
      move(id, type) {
        var self = this;
        self.$confirm("确认执行此操作吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            self.$ajax({
              url: "/carousel/moveContext",
              type: "GET",
              data: {
                id: id,
                type: type
              },
              success: function (data) {
                if (data && data.code == 0) {
                  self.$message({
                    type: "success",
                    message: "操作成功",
                    showClose: "true"
                  });
                  self.getContentList(self.content_search_form.status, self.content_search_form.type);
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
          })
          
      },
      editCarouselFun (data) {
        this.$jqAjax({
          url: apiHost + '/carousel/updateCoverTitle',
          type: 'POST',
          data: {
            id: this.insertDataRow.id,
            cover: data.cover,
            title: data.title
          },
          success: (res) => {
            if (res.code == 0) {
              this.isShowInsertCarousel = false;
              this.$message({type: 'success', message: '修改成功', showClose: true});
              this.getContentList(this.content_search_form.status, this.content_search_form.type);
            } else {
              this.$message({type: 'error', message: '操作失败', showClose: true});
            }
          },
          error: (err) => {
            this.$message({type: 'warning', message: err.msg, showClose: true});
          }
        });
      },
      getChildChannel1 (val) {
        this.newsChildChannelList = [];
        this.operate_carousel_form.channel_child = '';
        this.getNewsChannel(this.operate_carousel_form.channel);
      }

    }
  };
</script>

<style lang="scss">

</style>

