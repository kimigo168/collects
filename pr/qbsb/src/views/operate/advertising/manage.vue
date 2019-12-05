<template>
  <div id="adManage" v-loading.lock="loading">
    <div class="tab">
      <el-tabs v-model="tab_index" @tab-click="handleClick">
        <el-tab-pane label="待发布" name="0"></el-tab-pane>
        <el-tab-pane label="已发布" name="1"></el-tab-pane>
        <el-tab-pane label="已下架" name="2"></el-tab-pane>
      </el-tabs>
      <div class="content">
        <div class="operate">
          <div class="search">
            <el-form :inline="true" :model="article_search_form_1">
              <!-- <el-form-item label="创建时间：">
                <el-select v-model="article_search_form_1.time" @change="selectOption($event, 0)">
                  <el-option label="最近7天" value="0"></el-option>
                  <el-option label="最近30天" value="1"></el-option>
                </el-select>
              </el-form-item> -->

              <el-form-item label="广告类型：">
                <el-select v-model="article_search_form_1.type" @change="selectOption($event, 1)">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="启动页广告" value="0"></el-option>
                  <el-option label="频道信息流广告" value="1"></el-option>
                  <el-option label="轮播广告" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="投放频道：">
                <el-select v-model="article_search_form_1.channel" @change="selectOption($event, 2)" :disabled="article_search_form_1.type == 0">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="(item, index) in parentChannelList" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="投放子频道：">
                <el-select v-model="article_search_form_1.childChannel" @change="selectOption($event, 3)" :disabled="article_search_form_1.type == 0||article_search_form_1.type === ''">
                  <el-option v-for="(item, index) in childChannelList" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item>
                <el-input type="text" v-model="article_search_form_1.keywords" placeholder="输入广告关键词查找"></el-input>
              </el-form-item> -->
              <!-- <el-form-item>
                <el-button type="primary" @click="queryAd">查询</el-button>
              </el-form-item> -->
              <el-form-item v-if="tab_index != 2">
                <el-button type="primary" @click="addAdFun">新建广告</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="table">
          <el-table :data="article_list_1" style="width: 100%">
            <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
            <el-table-column align="center" prop="imageUrl" label="广告封面">
              <template slot-scope="scope">
                <defaultImage :url="scope.row.image"></defaultImage>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="广告名称"></el-table-column>
            <el-table-column align="center" prop="url" label="广告链接" width="180"></el-table-column>
            <el-table-column align="center" prop="label" label="广告标签"></el-table-column>
            <el-table-column align="center" label="广告类型">
              <template slot-scope="scope">
                {{adTypes[scope.row.type]}}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="channelName" label="投放频道"></el-table-column>
            <el-table-column align="center" prop="sonChannelName" label="投放子频道"></el-table-column>
            <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
            <el-table-column align="center" width="180" prop="createTime" label="创建时间"></el-table-column>
            <el-table-column align="center" prop="clickNum" label="点击量" v-if="tab_index != 0"></el-table-column>
            <el-table-column align="center" prop="address" label="操作" width="170">
              <template slot-scope="scope">
                <el-button type="text" v-if="tab_index == 1" @click="soldOutFun(scope.row.id, 0)">下架</el-button>
                <el-button type="text" v-if="tab_index != 1 && tab_index != 2" @click="paperOperate(scope.row)">编辑</el-button>
                <el-button type="text" v-if="tab_index == 2" @click="soldOutFun(scope.row.id, 1)">重新发布</el-button>
                <el-button type="text" v-if="tab_index == 0" @click="publishAd(scope.row.id)">发布</el-button>
                <el-button type="text" v-if="tab_index == 0" class="danger-color" @click="removeAccount(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page" v-if="article_page_totle_1 > 0">
          <el-pagination
            @current-change="articlePageNumChange1"
            :current-page.sync="article_page_num_1"
            :page-size="article_page_size_1"
            layout="prev, pager, next, jumper"
            :total="article_page_totle_1">
          </el-pagination>
        </div>
      </div>
    </div>
    <add-edit-ad v-if="addModelShow" :tabIdx="tab_index" :editItem="editItem" :isAdd="isAdd" :articleForm="article_search_form_1" @fRefreshList="refreshList" @fCloseEdit="addModelShow = false"></add-edit-ad>
  </div>
</template>

<script>
  import addEditAd from './addEditAd';
  export default {
    data() {
      return {
        loading: false,
        tab_index: '0',
        host: apiHost,
        article_search_form_1: {
          time: "",
          type: "",
          channel: "",
          childChannel: "",
          keywords: "",
        },
        adTypes: {
          '0': '启动页广告',
          '1': '频道信息流广告',
          '2': '轮播广告'
        },
        article_list_1: [
          {
            imageUrl: 'http://i2.hexun.com/2018-11-21/195263783.jpg',
            author: '王晶',
            phone: '13078993208',
            subChannel: '正常',
            createTime: "2019-02-21 08:31:58",
          }
        ],
        article_page_num_1: 1,
        article_page_size_1: 10,
        article_page_totle_1: 100,
        addModelShow:false,
        isAdd:true,
        addForm: {
          name: '',
          link: '',
          tag: '',
          classify: '',
          imgUrl: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入广告名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          link: [
            { required: true, message: '请输入广告链接', trigger: 'blur' },
          ],tag: [
            { required: false, message: '请输入广告标签', trigger: 'blur' },
          ],classify: [
            { required: true, message: '请选择广告类型', trigger: 'blur' },
          ],imgUrl: [
            { required: true, message: '请选择广告图片', trigger: 'blur' },
          ]
        },
        parentChannelList: [],
        childChannelList: [],
        editItem: null
      }
    },
    methods: {
      addAdFun () {
        this.editItem = null;
        this.addModelShow = true;
        this.isAdd = true;
      },
      refreshList () {
        this.getAdLists();
        this.addModelShow = false;
      },
      articlePageNumChange1(val) {
        this.article_page_num_1 = val;
        this.getAdLists();
      },
      handleAvatarSuccess(res, file) {
        // this.addForm.imgUrl = URL.createObjectURL(file.raw);
        this.addForm.imgUrl = res.data.url;
      },
      beforeAvatarUpload(file) {
        if (file.size / 1024 / 1024 > 2) {
          this.$message.error('上传图片大小不能超过 2MB!');
          return false;
        }
      },
      handleClick (tab, event) {
        if (tab.active) {
          this.getAdLists();
        }
      },
      getChannelList (queryType, type, pid) {
        let data = {};
        if (pid && queryType == 1) {
          data = { pid: pid }
        }
        this.$jqAjax({
          url: apiHost + `/user/${type==0?'getNewsChannel':'getVideoChannel'}`,
          data: data,
          success: (res) => {
            if (res.code == '0' && res.data) {
              if (pid && queryType == 1) {
                this.childChannelList = res.data;
              } else {
                this.parentChannelList = res.data;
              }
            }
          },
          error: (err) => {
            this.$message({type: 'error', message: '请求失败', showClose: true});
          }
        });
      },
      getAdLists () {
        let self = this;
        this.article_list_1 = [];
        this.article_page_totle_1 = 0;
        this.loading = true;
        this.$ajax({
          url: '/advertisement/list',
          type: 'POST',
          data: {
            pageNum: this.article_page_num_1,
            pageSize: this.article_page_size_1,
            status: this.tab_index,
            channelId: this.article_search_form_1.channel,
            sonChannelId: this.article_search_form_1.childChannel,
            keyword: this.article_search_form_1.keywords,
            type: this.article_search_form_1.type
          },
          success(res) {
            self.loading = false;
            if (res.code == 0) {
              let data = res.data;
              self.article_list_1 = data.list;
              self.article_page_totle_1 = data.total;
            }
          },
          error (err) {
            self.loading = false;
            self.$message({
              showClose: true,
              message: '请求失败',
              type: 'error'
            });
          }
        })
      },
      selectOption (event, idx) {
        if (idx == 1) {
          this.parentChannelList = [];
          this.childChannelList = [];
          this.article_search_form_1.channel = '';
          this.article_search_form_1.childChannel = '';
          if (event !== '0') {
            this.getChannelList(0, 0, event);
          }
        } else if (idx == 2) {
          // 选择父频道，请求子频道，并且请求列表数据
          this.article_search_form_1.channel = event;
          this.article_search_form_1.childChannel = '';
          this.childChannelList = [];
          this.getChannelList(1, 0, event);
        } else if (idx == 3) {
          this.article_search_form_1.childChannel = event;
        }
        this.getAdLists();
      },
      queryAd () {
        if (!this.article_search_form_1.keywords) {
          alert('输入关键词不能为空')
        }
      },
      paperOperate (row) {
        this.editItem = row;
        this.isAdd = false;
        this.addModelShow = true;
      },
      publishAd (id) {
        let self = this;
        this.$confirm('确定发布该广告吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$ajax({
            url: '/advertisement/publish',
            type: 'GET',
            data: {
              id: id
            },
            success (res) {
              if (res.code == 0) {
                self.$message({type: 'success', message: '发布成功', showClose: true});
                self.getAdLists();
              }
            }
          })
        });
      },
      removeAccount (id) {
        let self = this;
        this.$confirm('确定删除该广告吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$ajax({
            url: '/advertisement/delete',
            type: 'GET',
            data: {
              id: id
            },
            success (res) {
              if (res.code == 0) {
                self.$message({
                  type: 'success',
                  message: '删除成功',
                  showClose: true
                });
                self.article_page_num_1 = 1;
                self.getAdLists();
              } else {
                self.$message({
                  type: "error",
                  message: "删除失败",
                  showClose: 'true',
                })
              }
            }
          });
        });
      },
      soldOutFun(id, type) {
        let self = this;
        this.$confirm(`确定${type==0?'下架':'重新发布'}该广告吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$ajax({
            url: '/advertisement/update',
            type: 'POST',
            data: {
              id: id,
              status: type == 0 ? 2:1
            },
            success (res) {
              if (res.code == 0) {
                self.$message({type: 'success', message: `${type==0?'下架':'发布'}成功`, showClose: true});
                self.getAdLists();
              }
            }
          })
        });
      },
    },
    created () {
      this.getAdLists();
    },
    components: {
      addEditAd
    }
  }
</script>

<style lang="scss">
#adManage .el-table tr.el-table__row {
  height: 70px;
}
</style>
