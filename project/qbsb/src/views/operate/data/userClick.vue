<template>
  <div id="userClick">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tabIndex">
        <el-tab-pane label="点击量统计" name="0" v-if="tabIndex=='0'">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true">
                  <el-form-item label="日期选择：">
                    <el-date-picker v-model="timePickArr" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="姓名：">
                    <el-input type="text" v-model="viewForm.name" placeholder="输入姓名查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                </el-form>
                <div class="date-select">
                  <el-radio-group v-model="timeActiveIdx" @change="selectQueryTime">
                    <el-radio-button label="0">昨日</el-radio-button>
                    <el-radio-button label="1">最近七天</el-radio-button>
                    <el-radio-button label="2">最近30天</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
            </div>
            <div class="table">
              <el-table :data="viewList" style="width:100%">
                <el-table-column align="center" type="index" :index="indexMethod1" label="排名" width="70">
                  <!-- <template slot-scope="row">
                    {{row}}
                  <template> -->
                </el-table-column>
                <el-table-column align="center" prop="realName" label="姓名"></el-table-column>
                <el-table-column align="center" prop="viewCount" label="文章点击数"></el-table-column>
                <el-table-column align="center" prop="detail" label="详情">
                  <template slot-scope="scope">
                    <el-button type="text" @click="viewDetail(scope.row)">查看详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="pageTotal>0">
              <el-pagination @current-change="pageNumChange" :current-page.sync="pageNum" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="pageTotal">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="用户阅读详情" name="1" v-if="tabIndex=='1'">
          <div class="content">
            <div class="user-info">
              <span class="avatar-img">
                <img :src="userInfo.avatar?userInfo.avatar:defaultAvatar" alt="">
              </span>
              <span class="name">{{userInfo.name}}</span>
              <span class="sex">{{userInfo.sex}}</span>
              <span class="company">{{userInfo.company}}</span>
              <el-button class="back-btn" type="primary" @click="closeDetail">返回</el-button>
            </div>
            <div class="operate">
              <div class="search clearfix">
                <el-radio-group @change="daysTabSelect" v-model="timeActiveIdx" style="margin-bottom: 30px;">
                  <el-radio-button label="0">昨日</el-radio-button>
                  <el-radio-button label="1">最近7天</el-radio-button>
                  <el-radio-button label="2">最近30天</el-radio-button>
                </el-radio-group>
                <div class="date-select fRight" style="vertical-align:center;">
                  日期选择：
                  <el-date-picker @change="dateSelect" v-model="search_form.time" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </div>
              </div>
            </div>
            <div class="table">
              <el-table :data="readList" style="width: 100%;">
                <el-table-column align="center" type="index" :index="indexMethod2" label="排名" width="70"></el-table-column>
                <el-table-column align="center" prop="title" label="文章标题">
                  <template slot-scope="scope">
                    <a href="javascript:;" @click="openPreviewArticle(scope.row)">{{scope.row.title}}</a>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="viewCount" label="文章点击数"></el-table-column>
                <el-table-column align="center" prop="lastViewDate" label="最近阅读时间">
                  <template slot-scope="scope">
                    {{scope.row.lastViewDate?new Date(scope.row.lastViewDate).format('YYYY-MM-DD hh:mm:ss'):''}}
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page">
              <el-pagination @current-change="pageChange" :current-page.sync="pageNum1" :page-size="pageSize1" layout="prev, pager, next, jumper" :total="pageTotal1">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <previewPop v-if="isShowPreview" @closePreviewArticle="isShowPreview=false" :articleForm="previewItem"></previewPop>  
  </div>
</template>
<script>
  import previewPop from './../../../components/previewPop';
export default {
  name: 'userClick',
  data () {
    return {
      tabIndex: '0',
      viewList: [],
      viewForm: {
        time: [],
        name: '',
      },
      timeActiveIdx: '0',
      timePickArr: [],
      users_page_size: 1,
      pageTotal: 0,
      pageNum: 1,
      pageSize: 10,
      loading: false,
      // 阅读详情
      readList: [],
      userInfo: {
        avatar: '',
        name: '',
        sex: '',
        company: ''
      },
      defaultAvatar: require('../../../images/qingbaosuologo.png'),
      pageSize1: 10,
      pageNum1: 1,
      pageTotal1: 0,
      search_form: {
        time: [],
        userId: '' // 用户id
      },
      previewArticleId: '',
      isShowPreview: false,
      previewItem: null // 预览详情
    }
  },
  components: {
    previewPop
  },
  methods: {
    indexMethod1 (index) {
      return (index+1) + this.pageSize* (this.pageNum - 1)
    },
    indexMethod2 (index) {
      return (index+1) + this.pageSize1 * (this.pageNum1 - 1)
    },
    selectQueryTime () {
      this.timePickArr = [];
      let days = 1;
      if (this.timeActiveIdx == 0) { // 最近7天
        days = 1;
      } else if (this.timeActiveIdx == 1) { // 最近15天
        days = 7;
      } else { // 最近30天
        days = 30;
      }
      this.timePickArr.push(new Date(new Date().getTime() - 1000*60*60*24 * days).format('YYYY-MM-DD'))
      if (days == 1) {
        this.timePickArr.push(new Date(new Date().getTime() - 1000*60*60*24 * days).format('YYYY-MM-DD'))
      } else {
        this.timePickArr.push(new Date().format('YYYY-MM-DD'));
      }
      this.pageNum = 1;
      this.getList();
    },
    pageNumChange (val) {
      this.pageNum = val;
      this.getList();
    },
    queryList () {
      this.pageNum = 1;
      this.timeActiveIdx = '';
      this.getList();
    },
    getList () {
      this.$ajax({
        url: '/statistics/userView',
        type: 'POST',
        data: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          startTime: this.timePickArr&&this.timePickArr[0]?this.timePickArr[0]+' 00:00:00': '',
          endTime: this.timePickArr&&this.timePickArr[1]?this.timePickArr[1] + ' 23:59:59': '',
          staffName: this.viewForm.name
        },
        success: (res) => {
          if (res.code == '0') {
            // console.log('ress', res)
            this.viewList = res.data.page.list
            this.pageTotal = res.data.page.total
          }
        }
      });
    },
    viewDetail (row) {
      console.log('row', row)
      this.tabIndex = '1'
      this.timeActiveIdx = '0';
      this.search_form.userId = row.uid
      this.search_form.time = [];
      this.search_form.time.push(new Date(new Date().getTime() - 1000*60*60*24).format('YYYY-MM-DD'))
      this.search_form.time.push(new Date().format('YYYY-MM-DD'));
      this.pageNum1 = 1
      this.getReadList();
    },
    closeDetail () {
      this.tabIndex = '0'
    },
    daysTabSelect () {
      let daySize = 1
      this.search_form.time = []
      if (this.timeActiveIdx == 0) { // 最近7天
        daySize = 1;
      } else if (this.timeActiveIdx == 1) { // 最近15天
        daySize = 7;
      } else { // 最近30天
        daySize = 30;
      }
      this.search_form.time.push(new Date(new Date().getTime() - 1000*60*60*24 * daySize).format('YYYY-MM-DD'))
      if (daySize == 1) {
        this.search_form.time.push(new Date(new Date().getTime() - 1000*60*60*24 * daySize).format('YYYY-MM-DD'))
      } else {
        this.search_form.time.push(new Date().format('YYYY-MM-DD'));
      }
      this.pageNum1 = 1;
      this.getReadList()
    },
    dateSelect () {
      this.pageNum1 = 1;
      this.getReadList();
    },
    getReadList () {
      this.readList = []
      this.$ajax({
        url: '/statistics/userViewDetail',
        type: 'POST',
        data: {
          pageNum: this.pageNum1,
          pageSize: this.pageSize1,
          startTime: this.search_form.time&&this.search_form.time[0]?this.search_form.time[0]+' 00:00:00':'',
          endTime: this.search_form.time&&this.search_form.time[1]?this.search_form.time[1]+' 23:59:59':'',
          userId: this.search_form.userId
        },
        success: (res) => {
          if (res.code == 0 && res.data) {
            this.readList = res.data.page.list || []
            this.pageTotal1 = res.data.page.total || 0;
            this.userInfo.sex = res.data.userDetail.sex == 0 ? '男': res.data.userDetail.sex == 1?'女':'保密'
            this.userInfo.company = res.data.userDetail.companyName || '';
            this.userInfo.name = res.data.userDetail.realName || '';
            this.userInfo.avatar = res.data.userDetail.headUrl || ''
          }
        },
        error: (err) => {
          this.$message({type: 'error', message: err.msg, showClose: true});
        }
      });
    },
    pageChange (val) {
      this.pageNum1= val;
      this.getReadList();
    },
    openPreviewArticle (row) {
      this.previewItem = row;
      this.isShowPreview = true;
    }
  },
  created () {
    this.users_page_size = 1;
    this.timePickArr.push(new Date(new Date().getTime() - 1000*60*60*24 * this.users_page_size).format('YYYY-MM-DD'));
    this.timePickArr.push(new Date().format('YYYY-MM-DD'));
    this.getList();
  }
}
</script>
<style lang="scss" scoped>
.user-info {
  height: 90px;
  padding: 0 20px;
  margin-bottom: 30px;
  margin-top: 20px;
  position: relative;
  span {
    vertical-align: middle;
    margin-right: 30px;
  }
  .avatar-img {
    width: 90px;
    height: 90px;
    display: inline-block;
    border-radius: 50%;
    // border: 1px solid #B2B2B2;
    img {
      width: 90px;
      height: 90px;
      display: inline-block;
      border-radius: 50%;
      overflow: hidden;
    }
  }
  .back-btn {
    position: absolute;
    right: 40px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.date-select {
  height: 70px;
  padding-top: 20px;
  box-sizing: border-box;
}
</style>