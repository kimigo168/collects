<template>
  <div id="users">
    <div class="tab" v-loading.lock="loading">
      <div class="top-banner">
        <div class="brief-wrap">
          <h2>数据概览</h2>
           <ul class="center">
             <li><div><p>昨日点击总数</p><h3>{{yesterdayClickNum}}</h3></div></li>
            <li><div><p>总用户数</p><h3>{{totalUsers}}</h3></div></li>
            <li><div><p>总文章数</p><h3>{{totalContext}}</h3></div></li>
          </ul>
        </div>
      </div>
      <!-- 点击排行榜 -->
      <div class="tab-banner">
        <h2>点击排行榜</h2>
        <div class="search clearfix">
          <el-radio-group class="time-query" @change="selectQueryTime" v-model="timeActiveIdx" style="margin-bottom: 30px;">
            <el-radio-button label="0">昨日</el-radio-button>
            <el-radio-button label="1">最近7天</el-radio-button>
            <el-radio-button label="2">最近30天</el-radio-button>
          </el-radio-group>
          <div class="time-pick">
            日期选择：<el-date-picker :clearable="false" v-model="timePickArr" @change="timeSelectChange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </div> 
        </div>
        <div class="table">
          <el-table :data="viewList" style="width:100%">
            <el-table-column align="center" type="index" label="排名" width="70"></el-table-column>
            <el-table-column align="center" prop="title" label="文章标题"></el-table-column>
            <el-table-column align="center" prop="type" label="类型">
              <template slot-scope="scope">
                {{scope.row.cType==1?'平台号文章': typeArrs[scope.row.type]}}  
              </template> 
            </el-table-column>
            <el-table-column align="center" prop="source" label="来源"></el-table-column>
            <el-table-column align="center" prop="viewCount" label="点击量"></el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 文章统计 -->
      <div class="tab-banner">
        <h2>文章统计</h2>
        <div class="search clearfix">
          <el-radio-group class="time-query" @change="selectQueryTime1" v-model="timeActiveIdx1" style="margin-bottom: 30px;">
            <el-radio-button label="0">昨日</el-radio-button>
            <el-radio-button label="1">最近7天</el-radio-button>
            <el-radio-button label="2">最近30天</el-radio-button>
          </el-radio-group>
          <div class="time-pick">
            日期选择：<el-date-picker :clearable="false" v-model="contextQTime" @change="timeSelectChange1" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </div> 
        </div>
        <div class="table">
          <el-table :data="contextList" style="width:100%">
            <el-table-column align="center" type="index" label="排名" width="70"></el-table-column>
            <el-table-column align="center" prop="positionName" label="岗位"></el-table-column>
            <el-table-column align="center" prop="staffName" label="姓名"></el-table-column>
            <el-table-column align="center" prop="totalCount" label="文章数"></el-table-column>
          </el-table>
        </div>
      </div>
      <!-- <a download="" :href="host+'/statistics/exportUser?startTime='+timePickArr[0]+'&endTime='+timePickArr[1]">
        <el-button plain class="download" @click="downLoadFun">下载表格</el-button>
      </a> -->
    </div>
  </div>
</template>
<script>
var echarts = require('echarts/lib/echarts')
export default {
  name: 'users',
  data () {
    return {
      loading: false,
      tab_index: '0',
      contextList: [],
      contextPageNum: 1,
      contextPageSize: 10,
      yesterdayClickNum: 0, // 昨日点击数
      totalUsers: 0, // 总用户数
      totalContext: 0, // 总文章数
      isShowTable: false,
      timeQueryArr: ['昨日', '最近7天', '最近30天'],
      timeActiveIdx: '1', // 默认7天
      timePickArr: [], // 点击排行查询时间
      host: '',
      querDays: 15, // 默认查询天数
      // 点击排行榜
      viewList: [], // 列表
      viewPageNum: 1,
      viewPageSize: 10,
      viewListTotal: 0, // 总数
      typeArrs: {
        '1': '文章',
        '2': '图片',
        '3': '视频',
        '4': '音频',
        '5': '图片新闻',
        '6': '外链文章'
      },
      contextQTime: [], // 文章统计查询时间
      timeActiveIdx1: '1'
    }
  },
  methods: {
    downLoadFun () {
      if (!this.timePickArr[0]) {
        this.$message({type: 'warning', message: '请先选择导出时间', showClose: true});
        return;
      }
    },
    selectQueryTime () {
      this.viewPageNum = 1;
      this.timePickArr = [];
      let querDays = 0;
      if (this.timeActiveIdx == 0) { // 昨日
        querDays = 1;
      } else if (this.timeActiveIdx == 1) { // 最近7天
        querDays = 7;
      } else { // 最近30天
        querDays = 30;
      }
      this.timePickArr.push(new Date(new Date().getTime() - 1000*60*60*24 * querDays).format('YYYY-MM-DD'))
      if (querDays == 1) {
        this.timePickArr.push(new Date(new Date().getTime() - 1000*60*60*24 * querDays).format('YYYY-MM-DD'))
      } else {
        this.timePickArr.push(new Date().format('YYYY-MM-DD'));
      }
      this.getViewList();
    },
    timeSelectChange () {
      this.timeActiveIdx = '';
      this.contextPageNum = 1;
      this.contextPageSize = 10;
      this.getViewList();
    },
    // 改变文章统计查询时间
    timeSelectChange1 () {
      this.timeActiveIdx1 = '';
      this.contextPageNum = 1;
      this.contextPageSize = 10;
      this.getContextList();
    },
    selectQueryTime1 () {
      this.contextPageNum = 1;
      this.contextQTime = [];
      let querDays = 0;
      if (this.timeActiveIdx1 == 0) { // 昨日
        querDays = 1;
      } else if (this.timeActiveIdx1 == 1) { // 最近7天
        querDays = 7;
      } else { // 最近30天
        querDays = 30;
      }
      this.contextQTime.push(new Date(new Date().getTime() - 1000*60*60*24 * querDays).format('YYYY-MM-DD'))
      if (querDays == 1) {
        this.contextQTime.push(new Date(new Date().getTime() - 1000*60*60*24 * querDays).format('YYYY-MM-DD'))
      } else {
        this.contextQTime.push(new Date().format('YYYY-MM-DD'));
      }
      this.getContextList();
    },
    switchFun () {
      this.isShowTable = !this.isShowTable;
    },
    getContextList () {
      this.contextList = [];
      this.loading = true;
      if (!this.timePickArr) return;
      this.$ajax({
        url: '/statistics/staff',
        type: 'POST',
        data: {
          pageNum: this.contextPageNum,
          pageSize: this.contextPageSize,
          startTime: this.contextQTime&&this.contextQTime[0] ? this.contextQTime[0] + ' 00:00:00' : '',
          endTime: this.contextQTime&&this.contextQTime[1] ? this.contextQTime[1] + ' 23:59:59': '',
          positionId: '',
          staffName: ''
        },
        success: (res) => {
          this.loading = false;
          if (res.code == '0' && res.data.page) {
            this.contextList = res.data.page.list;
            // this.renderUserChart();
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({type: 'error', message: '请求失败', showClose: true});
        }
      });
    },
    renderUserChart () { // 渲染用户列表
      let dateArr = [];
      let data1 = [];
      let data2 = [];
      for (let len = this.contextList.length, i = len-1; i >= 0; i--) {
        dateArr.push(new Date(this.contextList[i].statisticsDate).format('D') == 1?new Date(this.contextList[i].statisticsDate).format('M月D日'):new Date(this.contextList[i].statisticsDate).format('D日'));
        data1.push(this.contextList[i].registerCount)
        data2.push(this.contextList[i].visitorCount)
      }
      let myLineChart = echarts.init(document.getElementById('line-chart'));
      let option = {
        legend: { data: ['新增注册用户', '新增匿名用户'] },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dateArr
        },
        yAxis: { type: 'value' },
        series: [
          { 
            name: '新增注册用户',
            data: data1,
            type: 'line',
            itemStyle: {
              normal: { color: '#00CC33'}
            }
          }, {
            name: '新增匿名用户',
            data: data2,
            type: 'line',
            itemStyle: {
              normal: { color: '#3399FF'}
            }
          }
        ]
      };
      myLineChart.setOption(option);
    },
    getViewList () {
      this.$ajax({
        url: '/statistics/contextOperation',
        type: 'POST',
        data: {
          orderType: 1, // 1:按点击量排序
          pageNum: this.viewPageNum,
          pageSize: this.viewPageSize,
          startTime: this.timePickArr && this.timePickArr[0] ? this.timePickArr[0]+' 00:00:00' : '',
          endTime: this.timePickArr && this.timePickArr[1] ? this.timePickArr[1] + ' 23:59:59' : ''
        },
        success: (res) => {
          if (res.code == '0' && res.data.page) {
            this.viewList = res.data.page.list
            this.viewListTotal = res.data.page.total;
          } else {
            this.viewList = [];
          }
        },
        error: (err) => {
          this.$message({type: 'error', message: err.msg, showClose: true});
        }
      });
    },
    getCountInfo () {
      this.$ajax({
        url: '/statistics/total',
        type: 'POST',
        data: {},
        success: (res) => {
          if (res.code == '0' && res.data) {
            this.yesterdayClickNum = res.data.yesterdayView; // 昨日点击数
            this.totalUsers = res.data.userTotal; // 总用户数
            this.totalContext = res.data.contextTotal; // 总文章数
          }
        },
        error: (err) => {
          this.$message({type: 'error', message: err.msg, showClose: true})
        }
      })
    }
  },
  created () {
    this.host = apiHost;
    let querDays = 7; // 默认7天
    this.timePickArr.push(new Date(new Date().getTime() - 1000*60*60*24 * querDays).format('YYYY-MM-DD'))
    this.timePickArr.push(new Date().format('YYYY-MM-DD'));
    this.contextQTime.push(new Date(new Date().getTime() - 1000*60*60*24 * querDays).format('YYYY-MM-DD'))
    this.contextQTime.push(new Date().format('YYYY-MM-DD'));
    this.getCountInfo();
    setTimeout(() => {
      this.getViewList();
    }, 2000)
    setTimeout(() => {
      this.getContextList();
    }, 4000)
  }
}
</script>
<style lang="scss" scoped>
.top-banner {
  height: 280px;
  background-color: #f5f5f5;
  .brief-wrap{
    height: 240px;
    background-color: #fff;
     h2{
      height: 70px;
      line-height: 70px;
      text-indent: 30px;
      border-bottom: 2px solid #f5f5f5;
    }
    .center{
      width: 100%;
      height: 170px;
      // margin: 0 auto;
      display: flex;
      // align-content: space-between;
      justify-content: space-around;
      li {
        width: 300px;
        height: 170px;
        text-align: center;
        padding: 20px 0 20px 120px;
        box-sizing: border-box;
        background-size: 50px 50px;
        background-repeat: no-repeat;
        background-position: left 20px center;
        &:nth-child(1) {
          background-image: url('../../../images/data-statistics-2.png');
          // h3 {
          //   color: #B8E986;
          // }
        }
        &:nth-child(2) {
          background-image: url('../../../images/data-statistics-4.png');
          // h3 {
          //   color: #FEC36D;
          // }
        }
        &:nth-child(3) {
          background-image: url('../../../images/data-statistics-3.png');
          // h3 {
          //   color: #B8E986;
          // }
        }
        div {
          border-left: 2px solid #F5F5F5;
          h3{
            font-size: 28px;
            margin-top: 10px;
          }
          p{
            margin-top: 20px;
            font-size: 18px;
          }
        }
        
      }
    }
  }
}
.tab-banner {
  h2 {
    text-indent: 30px;
    height: 76px;
    line-height: 76px;
    border-bottom: 2px solid #f5f5f5;
  }
  .search {
    height: 90px;
    position: relative;
    .time-query{
      position: absolute;
      left: 0;
      top: 30px;
    }
    .time-pick{
      width: 480px;
      position: absolute;
      right: 0;
      top: 30px;
    }
  }

}
.chartWrap {
  height: 540px;
  width: 100%;
  padding-left: 400px;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
  position: relative;
  .count {
    width: 400px;
    height: 100%;
    text-align: center;
    position: absolute;
    left: 0;
    top: 0;
    .total{
      margin-top: 80px;
    }
    .vistor-count {
      margin-top: 60px;
    }
    h3{
      font-size: 48px;
      font-weight: normal;
    }
    p{
      font-size: 20px;
      margin-top: 10px;
    }
  }
  .chart {
    width: 100%;
    height: 540px;
    padding-bottom: 20px;
    box-sizing: border-box;
    #line-chart{
      width: 100%;
      height: 100%;
    }
    .tips{
      height: 40px;;
    }
  }
}
.table-wrap {
  min-height: 567px;
  .tab-title{
    height: 116px;
    position: relative;
    background-color: #f5f5f5;
    padding-top: 40px;
    box-sizing: border-box;
    h2 {
      height: 76px;
      line-height: 76px;
      text-indent: 30px;
      background-color: #fff;
      border-bottom: 2px solid #f5f5f5;
      position: relative;
      .download-btn{
        width: 126px;
        height: 40px;
        position: absolute;
        right: 0;
      }
    }
    .download {
      height: 40px;
      width: 126px;
      // line-height: 40px;
      // text-align: center;
      border-radius: 5px;
      position: absolute;
      right: 40px;
      top: 58px;
      font-size: 14px;
      // border: 1px solid rgba(204, 204, 204, 1);
      // color:#000;
    }
  }
}
.switch-wrap {
  width: 100%;
  height: 40px;
  position: relative;
  .switch {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    color: #666;
    font-size: 14px;
    width: 100px;
    position: absolute;
    left: 50%;
    margin-left: -50px;
    padding-left: 40px;
    cursor: pointer;
    i{
      width: 25px;
      height: 22px;
      display: inline-block;
      background-image: url('../../../images/arrow.png');
      background-repeat: repeat-y;
      position: absolute;
      left: 0;
      top: 9px;
      transition: all 0.4s ease-in-out;
      -webkit-transition: all 0.4s ease-in-out;
      -moz-transition: all 0.4s ease-in-out;
      -o-transition: all 0.4s ease-in-out;
    }
  }
  .isClosed{
    i {
      transform-origin: center center;
      transform: rotate(180deg);
    }
  }
}

</style>

