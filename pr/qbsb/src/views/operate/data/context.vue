<template>
  <div id="data-context">
    <div class="banner-top">
      <div class="wrap">
        <div class="title">
          <h2>稿件数据概览</h2>
        </div>
        <div class="count">
          <ul class="center">
            <li><h3>{{contextCount}}</h3><p>文章总数</p></li>
            <!-- <li><h3>{{videoCount}}</h3><p>视频总数</p></li> -->
          </ul>
        </div>
      </div>
    </div>
    <div class="trend-banner">
      <h2>趋势图</h2>
      <ul class="time-query">
        <li @click="selectQueryTime(index)" :class="{'active':index === timeActiveIdx}" v-for="(item, index) in timeQueryArr" :key="index">{{item}}</li>
      </ul>
      <div class="time-pick">
        <el-date-picker v-model="timePickArr" :clearable="false" @change="timeSelectChange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </div> 
    </div>
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="稿件发布情况" name="0">
          <div class="content">
            <div class="operate"></div>
            <div class="chartWrap">
              <!-- <div class="count">
                <div class="total">
                  <h3>{{totalCount}}</h3>
                  <p>稿件总数</p>
                  <ul class="ulWrap">
                    <li><p>{{contextCount}}</p><p>资讯</p></li>
                    <li><p>{{videoCount}}</p><p>视频</p></li>
                    <li><p>{{collectCount}}</p><p>采集</p></li>
                  </ul>
                </div>
              </div> -->
              <div class="chart">
                <div id="line-chart"></div>
                <!-- <p class="tips">111</p> -->
              </div>
            </div>
            <!-- <div class="switch-wrap">
              <span class="switch" :class="{'isClosed': !isShowTable }" @click="switchFun"><i></i>{{isShowTable?'收起':'展开'}}列表</span>
            </div> -->
            <div class="data-wrap">
              <div class="tab-title">
                <h2>数据表</h2>
                <!-- <a download="" :href="host+'/statistics/exportContext?startTime='+timePickArr[0]+'&endTime='+timePickArr[1]">
                  <el-button plain class="download">下载表格</el-button>
                </a> -->
              </div>
              <div class="table">
                <el-table :data="context_list" style="width:100%">
                  <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                  <el-table-column align="center" prop="statisticsDate" label="时间"></el-table-column>
                  <el-table-column align="center" prop="totalCount" label="总稿件数"></el-table-column>
                  <el-table-column align="center" prop="contextCount" label="资讯稿件"></el-table-column>
                  <el-table-column align="center" prop="videoCount" label="视频稿件"></el-table-column>
                  <el-table-column align="center" prop="collectCount" label="采集稿件"></el-table-column>
                </el-table>
              </div>
              <div class="page" v-if="context_page_total>0">
                <el-pagination @size-change="handleSizeChange" @current-change="contextPageNumChange" :current-page.sync="context_page_num" :page-sizes="[10, 20, 30]" :page-size="context_page_size" layout="total, sizes, prev, pager, next" :total="context_page_total"></el-pagination>
              </div>
            </div>
            <div class="detail-wrap">
              <div class="tab-title">
                <h2>稿件详细统计</h2>
              </div>
              <div class="search">
                时间：<el-date-picker :clearable="false" v-model="searchForm.time" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="searchTimeChange" :picker-options="pickerOptions"></el-date-picker>
                <ul class="rankType">
                  <li v-for="(item, index) in typeList"  :class="{'active':index === rankTypeIdx}" :key="index" @click="selectRankType(index)">{{item}}</li>
                </ul>
                <!-- <a download="" :href="host+'/statistics/exportContextOperation?startTime='+searchForm.time[0]+'&endTime='+searchForm.time[1]+'&orderType='+searchForm.type">
                  <el-button plain class="download">下载表格</el-button>
                </a> -->
              </div>
              <div class="table">
                <el-table :data="detail_list" style="width:100%">
                  <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                  <el-table-column align="center" prop="title" label="标题"></el-table-column>
                  <el-table-column align="center" prop="type" label="类型">
                    <template slot-scope="scope">
                      {{scope.row.cType==1?'平台号文章': typeArrs[scope.row.type]}}  
                    </template> 
                  </el-table-column>
                  <el-table-column align="center" prop="author" label="署名人员"></el-table-column>
                  <el-table-column align="center" prop="viewCount" label="点击量"></el-table-column>
                  <el-table-column align="center" prop="commentCount" label="评论数"></el-table-column>
                  <el-table-column align="center" prop="favoriteCount" label="收藏数"></el-table-column>
                </el-table>
              </div>
              <div class="page" v-if="detail_page_total>0">
                <el-pagination @size-change="detailSizeChange" @current-change="detailPageNumChange" :current-page.sync="detail_page_num" :page-sizes="[10, 20, 30]" :page-size="detail_page_size" layout="total, sizes, prev, pager, next" :total="detail_page_total"></el-pagination>
              </div>
            </div> 
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  const echarts = require('echarts/lib/echarts');
export default {
  name: 'dataContext',
  data () {
    return {
      loading: false,
      tab_index: '0',
      context_list: [],
      context_page_num: 1,
      context_page_size: 20,
      context_page_total: 0,
      totalCount: 0, // 稿件总计
      collectCount: 0,  // 采集稿件
      contextCount: 0, // 文章稿件
      videoCount: 0, // 视频稿件
      isShowTable: false,
      timeActiveIdx: 1,
      timeQueryArr: ['最近7天', '最近15天', '最近30天'],
      timePickArr: [],
      host: apiHost,
      searchForm: {
        time: [],
        type: 1
      },
      typeList: ['按点击量排序', '按收藏数排序', '按评论数排序'],
      rankTypeIdx: 0, // 默认点击量排序
      detail_list: [],
      detail_page_num: 1,
      detail_page_size: 10,
      detail_page_total: 0,
      typeArrs: {
        '1': '文章',
        '2': '图片',
        '3': '视频',
        '4': '音频',
        '5': '图片新闻',
        '6': '外链文章'
      },
      pickerOptions: {
        disabledDate(time) { // 今天和今天之后的不能选
          return time.getTime() >= Date.now() - 24*60*60*1000;
        }
      }
    }
  },
  methods: {
    timeSelectChange () {
      this.timeActiveIdx = '';
      this.context_page_num = 1;
      this.context_page_size = 10;
      this.getContextCountList();
    },
    selectQueryTime (index) {
      this.timeActiveIdx = index;
      // 设置时间
      this.context_page_num = 1;
      this.timePickArr = [];
      if (this.timeActiveIdx == 0) { // 最近7天
        this.context_page_size = 7;
      } else if (this.timeActiveIdx == 1) { // 最近15天
        this.context_page_size = 15;
      } else { // 最近30天
        this.context_page_size = 30;
      }
      this.timePickArr.push(new Date(new Date().getTime() - 1000*60*60*24 * this.context_page_size).format('YYYY-MM-DD'))
      this.timePickArr.push(new Date().format('YYYY-MM-DD'));
      this.getContextCountList();
    },
    handleSizeChange (val) {
      this.context_page_size = val;
      this.context_page_num = 1;
      this.getContextCountList();
    },
    contextPageNumChange (val) {
      this.context_page_num = val;
      this.getContextCountList();
    },
    getContextCountList () {
      this.loading = true;
      this.context_list = [];
      this.$ajax({
        url: '/statistics/context',
        type: 'POST',
        data: {
          pageNum: this.context_page_num,
          pageSize: this.context_page_size,
          startTime: this.timePickArr&&this.timePickArr[0] ? this.timePickArr[0] : '',
          endTime: this.timePickArr&&this.timePickArr[1] ? this.timePickArr[1] : ''
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0 && res.data.page) {
            this.context_list = res.data.page.list;
            this.context_page_total = res.data.page.total;
            this.totalCount = res.data.total.totalCount;
            this.contextCount = res.data.total.contextCount;
            this.collectCount = res.data.total.collectCount;
            this.videoCount = res.data.total.videoCount;
            this.renderChart();
          }
        },
        error: (err) => {
          console.log('err', err)
          this.loading = false;
          this.$message({type: 'error', message: '请求失败', showClose: true});
        }
      });
    },
    renderChart () {
      let dateArr = [];
      let data1 = [];
      let data2 = [];
      let data3 = [];
      // 处理 Data
      // 调整顺序，列表按时间倒序
      for (let i = this.context_list.length - 1; i >= 0; i--) {
        dateArr.push(new Date(this.context_list[i].statisticsDate).format('D') == 1?new Date(this.context_list[i].statisticsDate).format('M月D日'):new Date(this.context_list[i].statisticsDate).format('D日'));
        data1.push(this.context_list[i].contextCount)
        data2.push(this.context_list[i].videoCount)
        data3.push(this.context_list[i].collectCount)
      }
      let myLineChart = echarts.init(document.getElementById('line-chart'));
      let option = {
        legend: { data: ['资讯', '视频', '采集'] },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dateArr
        },
        yAxis: { type: 'value' },
        series: [
          { 
            name: '资讯',
            data: data1,
            type: 'line',
            itemStyle: {
              normal: { color: '#00CC33'}
            }
          }, {
            name: '视频',
            data: data2,
            type: 'line',
            itemStyle: {
              normal: { color: '#3399FF'}
            }
          }, {
            name: '采集',
            data: data3,
            type: 'line',
            itemStyle: {
              normal: { color: '#FF7676'}
            }
          }
        ]
      };
      myLineChart.setOption(option);
    },
    switchFun () {
      this.isShowTable = !this.isShowTable;
    },
    searchTimeChange () {
      if (this.searchForm.time) {
        this.detail_page_num = 1;
        this.detail_page_total = 0;
        this.getDetailList();
      }
    },
    selectRankType (index) {
      this.rankTypeIdx = index;
      this.searchForm.type = index == 0 ? 1 : index == 1? 2: 3;
      this.detail_page_num = 1;
      this.getDetailList();
    },
    detailSizeChange (val) {
      this.detail_page_size = val;
      this.detail_page_num = 1;
      this.getDetailList();
    },
    detailPageNumChange (val) {
      this.detail_page_num = val;
      this.getDetailList();
    },
    getDetailList () {
      this.loading = true;
      this.detail_list = [];
      this.$ajax({
        url: '/statistics/contextOperation',
        type: 'POST',
        data: {
          startTime: this.searchForm.time && this.searchForm.time[0] ? this.searchForm.time[0]+' 00:00:00' : '',
          endTime: this.searchForm.time && this.searchForm.time[1] ? this.searchForm.time[1]+' 23:59:59' : '',
          orderType: this.searchForm.type,
          pageNum: this.detail_page_num,
          pageSize: this.detail_page_size
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            if (res.data.page) {
              this.detail_list = res.data.page.list;
              this.detail_page_total = res.data.page.total;
            }
          } else {
            this.$message({type: 'error', message: '请求失败', showClose: true});
          }
        },
        error: (err) => {
          this.loading = false;
          this.$message({type: 'error', message: '请求失败', showClose: true});
        }
      })
    }
  },
  created () {
    this.context_page_size = 15; // 默认15天
    this.timePickArr.push(new Date(new Date().getTime() - 1000*60*60*24 * this.context_page_size).format('YYYY-MM-DD'))
    this.timePickArr.push(new Date().format('YYYY-MM-DD'));
    this.getContextCountList();
    // 默认查昨天的
    let yesterday = new Date(new Date().getTime() - 24*60*60*1000).format('YYYY-MM-DD')
    this.searchForm.time = [yesterday, yesterday];
    this.getDetailList();
  }
}
</script>
<style lang="scss" scoped>
.banner-top {
  height: 280px;
  background-color: #f5f5f5;
  .wrap {
    height: 240px;
    background-color: #fff;
    position: relative;
    .title {
      height: 70px;
      line-height: 70px;
      position: relative;
      h2{
        height: 70px;
        text-indent: 30px;
        border-bottom: 2px solid #f5f5f5;
      }
    }
    .count {
      height: 170px;
      width: 100%;
      .center{
        width: 600px;
        height: 170px;
        margin: 0 auto;
        display: flex;
        li {
          flex: 1;
          text-align: center;
          h3{
            margin-top: 36px;
            font-size: 28px;
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
.trend-banner {
  height: 76px;
  line-height: 76px;
  border-bottom: 2px solid #f5f5f5;
  position: relative;
  h2{
    text-indent: 30px;
  }
  .time-query{
    height: 40px;
    width: 334px;
    border: 1px solid rgba(204, 204, 204, 1);
    border-radius: 5px;
    line-height: 40px;
    position: absolute;
    right: 500px;
    top: 18px;
    display: flex;
    li {
      flex: 1;
      text-align: center;
      font-size: 18px;
      cursor: pointer;
    }
    .active{
      font-weight: bold;
    }
  }
  .time-pick{
    width: 370px;
    position: absolute;
    right: 80px;
    top: 0;
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
      margin-top: 20px;
      .ulWrap {
        display: flex;
        justify-content: space-around;
        margin-top: 20px;
        li {
          flex: 1;
        }
      }
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
    // padding-bottom: 20px;
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
.data-wrap {
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
    }
    .download {
      height: 40px;
      width: 126px;
      border-radius: 5px;
      position: absolute;
      right: 40px;
      top: 58px;
      font-size: 14px;
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
.hideTable{
  height: 0;
  overflow: hidden;
  transition: height 0.3s ease-in-out;
  -webkit-transition: height 0.3s ease-in-out;
  -moz-transition: height 0.3s ease-in-out;
  -o-transition: height 0.3s ease-in-out;
}
.detail-wrap {
  margin-bottom: 100px;
  .tab-title {
    height: 116px;
    position: relative;
    background-color: #f5f5f5;
    padding-top: 40px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    h2 {
      height: 76px;
      line-height: 76px;
      text-indent: 30px;
      background-color: #fff;
      border-bottom: 2px solid #f5f5f5;
      position: relative;
    }
  }
  .search {
    height: 80px;
    line-height: 80px;
    position: relative;
    .rankType {
      height: 40px;
      width: 420px;
      border: 1px solid #cccccc;
      border-radius: 5px;
      line-height: 40px;
      position: absolute;
      left: 440px;
      top: 18px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      li {
        flex: 1;
        text-align: center;
        font-size: 18px;
        cursor: pointer;
      }
      .active{
        font-weight: bold;
      }
    }
    .download {
      height: 40px;
      width: 126px;
      border-radius: 5px;
      position: absolute;
      right: 40px;
      top: 20px;
      font-size: 14px;
    }
  }
}
</style>
