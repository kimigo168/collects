<template>
  <div id="data-staff">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="文章统计" name="0">
          <div class="content">
            <div class="operate">
              <div class="search" @keyup.enter="queryList">
                <el-form :inline="true" :model="search_form">
                  <el-form-item>
                    <el-radio-group v-model="search_form.search_type_1" @change="searchTypeChange">
                      <el-radio-button label="week">周</el-radio-button>
                      <el-radio-button label="month">月</el-radio-button>
                      <el-radio-button label="season">季</el-radio-button>
                      <el-radio-button label="year">年</el-radio-button>
                      <el-radio-button label="all">全部</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <!-- 按周 -->
                  <el-form-item v-if="search_form.search_type_1=='week'">
                    <el-radio-group v-model="search_form.search_type_2" @change="searchWeekChange">
                      <el-radio-button label="0">上周</el-radio-button>
                      <el-radio-button label="1">本周</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <!-- 按月 -->
                  <el-form-item v-if="search_form.search_type_1=='month'||search_form.search_type_1=='season'||search_form.search_type_1=='year'" label="年：">
                    <el-input type="number" v-model="search_form.search_year" @change="changeYear"></el-input>
                  </el-form-item>
                  <el-form-item v-if="search_form.search_type_1=='month'" label="月：">
                    <el-input type="number" min="1" max="12" v-model="search_form.search_month"  @change="changeMonth"></el-input>
                  </el-form-item>
                  <!-- 按季 -->
                  <el-form-item v-if="search_form.search_type_1=='season'">
                    <el-select v-model="search_form.search_season" @change="changeSeason">
                      <el-option v-for="item in season_list" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="岗位：">
                    <el-select v-model="search_form.positionId">
                      <el-option label="全部" value=""></el-option>
                      <el-option v-for="item in role_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="search_form.staffName" placeholder="请输入姓名查询"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                  <!-- <el-form-item style="float:right;">
                    <a download="" :href="host+'/statistics/exportStaff?startTime='+search_form.search_time[0]+'&endTime='+search_form.search_time[1]+'&staffName='+search_form.staffName">
                      <el-button type="primary">导出表格</el-button>
                    </a>
                  </el-form-item> -->
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="data_list" style="width:100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="positionName" label="岗位"></el-table-column>
                <el-table-column align="center" prop="staffName" label="姓名"></el-table-column>
                <!-- <el-table-column align="center" prop="statisticsDate" label="日期"></el-table-column> -->
                <el-table-column align="center" prop="totalCount" label="总稿件数"></el-table-column>
                <!-- <el-table-column align="center" prop="contextCount" label="资讯稿件"></el-table-column>
                <el-table-column align="center" prop="videoCount" label="视频稿件"></el-table-column>
                <el-table-column align="center" prop="collectCount" label="采集稿件"></el-table-column> -->
              </el-table>
            </div>
            <div class="page" v-if="page_total>0">
              <el-pagination @current-change="pageNumChange" :current-page.sync="page_num" :page-size="page_size" layout="total, prev, pager, next, jumper" :total="page_total"></el-pagination>
            </div>
          </div>
        </el-tab-pane>  
      </el-tabs> 
    </div>
  </div>
</template>
<script>
export default {
  name: 'dataStaff', // 员工稿件考核
  data () {
    return {
      loading: false,
      tab_index: '0',
      search_form: {
        name: '',
        role: '',
        search_type_1: 'week',
        search_type_2: '0', // 0:上周，1：本周
        search_year: 2019,
        search_month: 1,
        search_season: 1,
        search_time: [],
        staffName: '',
        positionId: ''
      },
      season_list: [
        {
          name: '第一季度',
          id: 1
        },{
          name: '第二季度',
          id: 2
        },{
          name: '第三季度',
          id: 3
        },{
          name: '第四季度',
          id: 4
        }
      ],
      data_list: [],
      role_list: [],
      page_num: 1,
      page_size: 15,
      page_total: 0,
      curYear: '', // 当前年份
      curMonth: '', // 当前月份
      host: apiHost
    }
  },
  methods: {
    searchTypeChange () {
      console.log('search_form', this.search_form.search_type_1)
      if (this.search_form.search_type_1 == 'week') {
        this.search_form.search_type_2 = '0'
        this.searchWeekChange(); // 切换周
      } else if (this.search_form.search_type_1 == 'month') {
        this.search_form.search_year = this.curYear; // 今年
        this.search_form.search_month = this.curMonth; // 今月
        this.changeMonth();
      } else if (this.search_form.search_type_1 == 'season') {
        this.search_form.search_year = this.curYear;
        this.search_form.search_season = 1;
        this.changeSeason();
      } else if (this.search_form.search_type_1 == 'year') {
        this.search_form.search_year = this.curYear;
        this.search_form.search_time = [];
        this.search_form.search_time.push(this.search_form.search_year+'-01-01');
        this.search_form.search_time.push(this.search_form.search_year+'-12-31');
      } else { // all
        this.search_form.search_time = ['1970-01-01',new Date().format('YYYY-MM-DD')];
      }
    },
    searchWeekChange () { // 周切换，本周还是上周
      let dayNow = new Date().getDay(); // 0-6,日--周六
      let begin = '';
      let end ='';
      this.search_form.search_time = [];
      // 计算一周，开始，结束日期
      if (this.search_form.search_type_2 == 1) { // 本周(周一到现在)
        end = new Date().format('YYYY-MM-DD');
        if (dayNow == 0) { // 日
          begin = new Date(new Date().getTime() - 6 *24*60*60*1000).format('YYYY-MM-DD');
        } else { 
          begin = new Date(new Date().getTime() - (dayNow-1) *24*60*60*1000).format('YYYY-MM-DD');
        } 
      } else { // 上周(周一~~~lastDate~~~周日)
        let lastDate = new Date(new Date().getTime() - 7*24*60*60*1000).format('YYYY-MM-DD');
        if (dayNow == 0) {
          begin = new Date(new Date(lastDate).getTime() - 6*24*60*60*1000).format('YYYY-MM-DD');
          end = lastDate;
        } else {
          begin = new Date(new Date(lastDate).getTime() - (dayNow-1)*24*60*60*1000).format('YYYY-MM-DD');
          end = new Date(new Date(lastDate).getTime() + (7-dayNow) *24*60*60*1000).format('YYYY-MM-DD');
        }
      }
      this.search_form.search_time.push(begin);
      this.search_form.search_time.push(end);
      console.log('this.search_form.search_time', this.search_form.search_time)
    },
    changeYear () { // 年切换
      console.log('search_form.search_year', this.search_form.search_year)
      // 区分按季，还是按月
      let begin = '';
      let end = '';
      let curYear = this.search_form.search_year;
      let curMonth = this.search_form.search_month;
      this.search_form.search_time = [];
      if (!curYear) return;
      if (this.search_form.search_type_1 == 'month') { // 月
        // 计算当前月份有几天
        begin = curYear + ('-') + (curMonth < 10 ? ('0'+ curMonth) : curMonth) + ('-01');
        let days = new Date(curYear, curMonth, 0);
        end = curYear + ('-') + (curMonth < 10 ? ('0'+curMonth) : curMonth)+(`-${days}`);
        this.search_form.search_time.push(begin);
        this.search_form.search_time.push(end);
      } else if (this.search_form.search_type_1 == 'season') { // 季
        this.changeSeason();
      } else { // 年
        begin = curYear + '-01-01';
        end = curYear + '-12-31';
        this.search_form.search_time.push(begin);
        this.search_form.search_time.push(end);
      }
      console.log('this.search_form.search_time', this.search_form.search_time)
    },
    changeMonth () {
      let curMonth = parseInt(this.search_form.search_month);
      let curYear = Number(this.search_form.search_year);
      if (!curMonth) return;
      this.search_form.search_time = [];
      let isRunYear = false;
      let begin = '';
      let end = '';
      // 判断是否闰年
      if (curYear%4 == 0 && curYear%100 !=0 || curYear%400 == 0) {
        isRunYear = true;
      }
      begin = curYear + '-' +(curMonth<10?'0'+curMonth:curMonth) + '-01';
      if (curMonth == 1 || curMonth == 3 || curMonth == 5 || curMonth == 7 || curMonth == 8 || curMonth == 10 || curMonth == 12) {
        end = curYear + '-' +(curMonth<10?('0'+curMonth):curMonth) + '-31';
      } else if (curMonth == 2) {
        end = curYear + '-'+(curMonth<10?'0'+curMonth:curMonth) + (isRunYear?'-29':'-28');
      } else {
        end = curYear + '-' +(curMonth<10?('0'+curMonth):curMonth) + '-30';
      }
      this.search_form.search_time.push(begin);
      this.search_form.search_time.push(end);
      console.log('this.search_form.search_time', this.search_form.search_time);
    },
    changeSeason () {
      let begin = '';
      let end = '';
      let curYear = this.search_form.search_year;
      let curMonth = this.search_form.search_month;
      this.search_form.search_time = [];
      if (this.search_form.search_season == 1) { // 一季度
        begin = curYear + '-01-01';
        end = curYear + '-03-31';
      } else if (this.search_form.search_season == 2) { // 二季度
        begin = curYear + '-04-01';
        end = curYear + '-06-30';
      } else if (this.search_form.search_season == 3) { // 三季度
        begin = curYear + '-07-01';
        end = curYear + '-09-30';
      } else { // 四季度
        begin = curYear + '-10-01';
        end = curYear + '-12-31';
      }
      this.search_form.search_time.push(begin);
      this.search_form.search_time.push(end);
      console.log('this.search_form.search_time', this.search_form.search_time);
    },
    pageNumChange (val) {
      this.page_num = val;
      this.getList();
    },
    queryList () {
      if (this.search_form.search_type_1 != 'week') {
        if (!this.search_form.search_year) {
          this.$message({type: 'warning', message: '请输入年份查询', showClose: true});
          return;
        }
        if (this.search_form.search_type_1=='month' && !this.search_form.search_month) {
          this.$message({type: 'warning', message: '请输入月份查询', showClose: true});
          return;
        }
      }
      this.page_num = 1;
      this.getList();
    },
    getList () {
      this.loading = true;
      this.data_list = [];
      this.$ajax({
        url:'/statistics/staff',
        type: 'POST',
        data: {
          pageNum: this.page_num,
          pageSize: this.page_size,
          startTime: this.search_form.search_time&&this.search_form.search_time[0]?this.search_form.search_time[0]:'',
          endTime: this.search_form.search_time&&this.search_form.search_time[1]?this.search_form.search_time[1]:'',
          positionId: this.search_form.positionId,
          staffName: this.search_form.staffName
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            if (res.data && res.data.page) {
              this.data_list = res.data.page.list || [];
              this.page_total = res.data.page.total;
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
    },
    getRoleList () {
      this.$jqAjax({
        url: apiHost + '/position/list',
        type: 'POST',
        data: {
          pageSize: 50,
          pageNum: 1
        },
        success: (res) => {
          if (res.code == 0) {
            this.role_list = res.data;
          }
        },
        error: (err) => {
          this.$message({type: 'error', message: '请求失败', showClose: true});
        }
      });
    }
  },
  created () {
    this.curYear = new Date().format('YYYY');
    this.curMonth = new Date().format('M');
    this.search_form.search_year = this.curYear;
    this.search_form.search_month = this.curMonth;
    this.searchWeekChange();
    this.getList();
    this.getRoleList();
  }
}
</script>
