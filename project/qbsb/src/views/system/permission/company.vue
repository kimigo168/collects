<template>
  <div id="company">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tabIdx">
        <el-tab-pane label="企业管理" name="0">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="searchForm">
                  <el-form-item label="企业名称：" @keyup.enter="searchCompany">
                    <el-input type="text" style="width:190px;" v-model="searchForm.name" placeholder="请输入企业名称查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="searchCompany">查找</el-button>
                  </el-form-item>
                  <el-form-item style="float:right;">
                    <el-button type="primary" @click="addCompany">新增企业</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="tab-select">
                <el-radio-group @change="changeViewStatus" v-model="searchForm.status" style="margin-bottom: 30px;">
                  <el-radio-button label="">全部</el-radio-button>
                  <el-radio-button label="0">启用</el-radio-button>
                  <el-radio-button label="1">禁用</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="table">
              <el-table :data="companyList" style="width:100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="name" label="企业名称"></el-table-column>
                <el-table-column align="center" prop="desc" label="企业描述"></el-table-column>
                <el-table-column align="center" prop="isBlock" label="状态">
                  <template slot-scope="scope">
                    {{scope.row.isBlock==0?'启用': '禁用'}}
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" width="220px" label="操作">
                  <template slot-scope="scope">
                    <p>
                      <el-button type="text" @click="channelAllocate(scope.row.id)">频道分配</el-button>
                      <el-button type="text" @click="editFun(scope.row)">修改</el-button>
                    </p>
                    <p>
                      <!-- <el-button type="text" @click="viewStaffList">员工账号</el-button> -->
                      <el-button type="text" @click="enDisableFun(scope.row)">{{scope.row.isBlock==0?'禁用': '启用'}}</el-button>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="pageTotal>0">
              <el-pagination @current-change="pageNumChange" :current-page.sync="pageNum" :page-size="pageSize" layout="prev, pager, next, jumper" :total="pageTotal">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 新增企业 -->
    <el-dialog v-loading.lock="loading1" :visible.sync="addEditObj.isShow" width="30%" :title="addEditObj.isEdit?'修改':'新增企业'" :close-on-click-modal="false" :before-close="closeAddEdit">
      <div class="wrap">
        <el-form :model="addEditObj" ref="add_edit_form" :validate-on-rule-change="false" :rules="addEditObj.rules" label-width="110px">
          <el-form-item label="企业名称" prop="name">
            <el-input type="text" v-model="addEditObj.name" placeholder="请输入企业名称"></el-input>
          </el-form-item>
          <el-form-item label="企业描述" prop="description">
            <el-input type="textarea" rows="3" placeholder="请输入企业描述"  v-model="addEditObj.description" ></el-input>
          </el-form-item>
          <!-- <el-form-item label="状态">
            <el-radio v-model="addEditObj.status" label="0">启用</el-radio>
            <el-radio v-model="addEditObj.status" label="1">禁用</el-radio>
          </el-form-item> -->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddEdit">取 消</el-button>
        <el-button type="primary" @click="confirmFun">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 频道分配 -->
    <el-dialog v-loading.lock="loading"  title="频道分配" :visible.sync="isShowAllocate" width="650px">
      <div class="wrap clearfix">
        <el-col :span="12">
          <!-- <h3>文章</h3> -->
          <el-checkbox @change="selectAllChange" v-model="selectAllArticleChannel" style="margin-bottom:20px;">全选</el-checkbox>
          <div class="allot" v-for="list in channel_list_news" :key="list.id">
            <div class="parent">
              <el-checkbox @change="checkParentChange" v-model="list.select">{{list.name}}</el-checkbox>
            </div>
            <div class="children" v-if="list.select">
              <el-checkbox @change="checkChildChange" v-model="item.select" v-for="item in list.subList" :key="item.id">{{item.name}}</el-checkbox>
            </div>
          </div>
        </el-col>
        <!-- <el-col :span="12">
          <h3>视频</h3>
          <el-checkbox @change="selectAllChange2" v-model="selectAllVideoChannel" style="margin-bottom:20px;">全选</el-checkbox>
          <div class="allot" v-for="list in channel_list_video" :key="list.id">
            <div class="parent">
              <el-checkbox @change="checkParentChange2" v-model="list.select">{{list.name}}</el-checkbox>
            </div>
          </div>
        </el-col> -->
      </div>
      <p style="font-size:12px;color:#f00;margin-top:10px;">温馨提示：勾选了父频道，其相应的子频道需至少勾选一条</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowAllocate = false">取 消</el-button>
        <el-button type="primary" @click="channelAllotDo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'company',
  data () {
    return {
      loading: false,
      loading1: false,
      tabIdx: '0',
      searchForm: {
        name: '',
        status: ''
      },
      companyList: [],
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
      // 新增企业弹窗
      addEditObj: {
        isShow: false,
        isEdit: false,
        status: '0',
        name: '',
        description: '',
        rules: {
          name: [
            { required: true, message: '请输入企业名称', trigger: 'blur' },
            // { min: 1, max: 11, message: '长度在 1 到 11 个字符', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入企业描述', trigger: 'blur' },
            // { min: 1, max: 11, message: '长度在 1 到 11 个字符', trigger: 'blur'}
          ]
        }
      },
      isShowAllocate: false,
      allocateId: '', // 分配频道的企业id
      selectAllArticleChannel: false, // 选中所有频道
      channel_list_news: []
    }
  },
  methods: {
    selectAllChange () {
      this.channel_list_news.map((item, index) => {
        this.$set(this.channel_list_news[index], 'select', this.selectAllArticleChannel)
        if (item.subList && item.subList.length > 0) {
          let subList = item.subList;
          subList.map((item1, index1) => {
            this.$set(this.channel_list_news[index].subList[index1], 'select', this.selectAllArticleChannel)
          });
        }
      });
    },
    checkParentChange () {
      let isAllSelect = true;
      this.channel_list_news.map((item, index) => {
        if (!item.select) {
          isAllSelect = false;
          return;
        }
        if (item.subList && item.subList.length > 0) {
          let subList = item.subList;
          subList.map((item1, index1) => {
            if (!item1.select) isAllSelect = false;
          });
        }
      });
      this.selectAllArticleChannel = isAllSelect;
    },
    checkChildChange () {
      let isAllSelect = true;
      this.channel_list_news.map((item, index) => {
        if (!item.select) {
          isAllSelect = false;
          return;
        }
        if (item.subList && item.subList.length > 0) {
          let subList = item.subList;
          subList.map((item1, index1) => {
            if (!item1.select) isAllSelect = false;
          });
        }
      });
      this.selectAllArticleChannel = isAllSelect;
    },
    searchCompany () {
      this.pageNum = 1
      this.getCompanyList()
    },
    pageNumChange (val) {
      this.pageNum = val;
    },
    addCompany () {
      this.addEditObj.id = ''
      this.addEditObj.name = ''
      this.addEditObj.description = ''
      this.addEditObj.isEdit = false;
      this.addEditObj.isShow = true;
    },
    closeAddEdit () {
      this.$refs['add_edit_form'].resetFields();
      this.addEditObj.isShow = false;
    },
    confirmFun () {
      this.$refs['add_edit_form'].validate(valid => {
        if (valid) {
          if (!this.addEditObj.name) {
            this.$message({type: 'warning', message: '企业名不能为空', showClose: true});
            return
          }
          if (!this.addEditObj.description) {
            this.$message({type: 'warning', message: '企业描述不能为空', showClose: true});
            return
          }
          this.loading1 = true
          if (!this.addEditObj.isEdit) {
            this.$jqAjax({
              url:  apiHost + '/company/add',
              type: 'POST',
              data: {
                name: this.addEditObj.name,
                desc: this.addEditObj.description
              },
              success: (res) => {
                this.loading1 = false
                if (res.code === '0') {
                  this.$message({type: 'success', message: '新增成功', showClose: true})
                  this.addEditObj.isShow = false;
                  this.searchCompany()
                } else {
                  this.$message({type: 'error', message: res.msg, showClose: true})
                }
              }
            });
          } else {
            this.$jqAjax({
              url: apiHost + '/company/update',
              type: 'POST',
              data: {
                id: this.addEditObj.id,
                name: this.addEditObj.name,
                desc: this.addEditObj.description
              },
              success: (res) => {
                this.loading1 = false
                if (res.code == '0') {
                  this.$message({type: 'success', message: '修改成功', showClose: true})
                  this.addEditObj.isShow = false;
                  this.searchCompany()
                } else {
                  this.$message({type: 'error', message: res.msg, showClose: true})
                }
              }
            });
          }
          
        }
      })
    },
    editFun (row) { // 编辑
      this.addEditObj.isEdit = true
      this.addEditObj.isShow = true;
      this.addEditObj.name = row.name
      this.addEditObj.description = row.desc
      this.addEditObj.id = row.id
    },
    viewStaffList () { // 查看员工列表

    },
    enDisableFun (row) { // 启用，禁用
      this.$confirm(`确定${row.isBlock==1?'启':'禁'}用该企业账号吗？`, `${row.isBlock==1?'启':'禁'}用`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$jqAjax({
          url: apiHost + '/company/changeStatus',
          data: {
            id: row.id,
            isBlock: row.isBlock == 1 ? 0 : 1
          },
          success: (res) => {
            if (res.code === '0') {
              this.$message({type: 'success', message: `该企业账号已${row.isBlock==1?'启':'禁'}用`});
              this.searchCompany()
            }
          }
        })
      })
    },
    getCompanyList () {
      this.companyList = []
      this.loading = true
      this.$jqAjax({
        url: apiHost + '/company/companyList',
        type: 'POST',
        data: {
          name: this.searchForm.name,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          isBlock: this.searchForm.status // 0未屏蔽，1屏蔽
        },
        success: (res) => {
          console.log('ress', res)
          this.loading = false
          if (res.code === '0') {
            this.pageTotal = res.data.count
            this.companyList = res.data.list
          }
        }
      })
    },
    changeViewStatus () {
      console.log('gaib')
      this.searchCompany()
    },
    channelAllocate (id) {
      this.allocateId = id
      this.$jqAjax({
        url: apiHost + '/company/getCompanyChannel',
        type: 'POST',
        data: {
          id: id
        },
        success: (res) => {
          if (res.code == '0') {
            let list_news = res.data.news
            let hasArticleUnselect = false; // 有没选中的，即取消全选
            let hasVideoUnselect = false; // 有没选中的，即取消全选
            for (let i = 0; i < list_news.length; i++) {
              if (list_news[i].perm == 0) {
                list_news[i].select = true
              } else {
                list_news[i].select = false
                hasArticleUnselect = true
              }
              if (list_news[i].subList) {
                for (let k = 0; k < list_news[i].subList.length; k++) {
                  if (list_news[i].subList[k].perm == 0) {
                    list_news[i].subList[k].select = true
                  } else {
                    list_news[i].subList[k].select = false
                    hasArticleUnselect = true
                  }
                }
              }
            }
            this.channel_list_news = list_news;
            this.selectAllArticleChannel = !hasArticleUnselect;
            this.isShowAllocate = true // 打开弹窗
          }
        }
      });
    },
    channelAllotDo () {
      let list_news = this.channel_list_news;
      let isNoOneSelect = false;
      let noArr = [];
      for (let item of list_news) {
        if (item.select && item.subList) {
          let isNoSelectAll = item.subList.every((item1) => {
            return !item1.select;
          });
          if (isNoSelectAll) {
            isNoOneSelect = true;
            noArr.push(item);
          }
        }
      }
      if (isNoOneSelect) {
        let strs = ''
        for (let item of noArr) {
          strs += (item.name + '，')
        }
        strs = strs.substring(0, strs.length-1);
        this.$message({type: 'warning', message: `${strs}频道未选择子频道，请选择后再保存`, showClose: true});
        return;
      }
      // 处理
       for (var i = 0; i < list_news.length; i++) {
        if (list_news[i].select) {
          list_news[i].perm = 0
        } else {
          list_news[i].perm = 1
        }
        if (list_news[i].subList) {
          for (var k = 0; k < list_news[i].subList.length; k++) {
            if (list_news[i].subList[k].select) {
              list_news[i].subList[k].perm = 0
            } else {
              list_news[i].subList[k].perm = 1
            }
          }
        }
      }
      this.$loading()
      this.$jqAjax({
        url: apiHost + "/company/setChannel",
        type: "POST",
        data: {
          id: this.allocateId,
          channels: JSON.stringify(list_news)
        },
        success: (res) => {
          this.isShowAllocate = false
          this.$loading().close();
          if (res.code == '0') {
            this.$message({ type: "success", message: "操作成功", showClose: 'true'})
          }
        },
        error: (err) => {
          this.$loading().close();
        }
      })
    }

  },
  created () {
    this.getCompanyList()
  }
}
</script>
<style lang="scss">
#company {
  .el-dialog {
    .el-checkbox {
      width: 140px;
      margin: 5px;
      &:last-of-type {
        margin-right: 6px;
      }
    }

    .children {
      margin-left: 25px;
    }
    h3 {
      font-size: 16px;
      color: #999;
      margin-bottom: 10px;
    }
  }
}
</style>