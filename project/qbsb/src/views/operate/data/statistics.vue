<template>
  <div id="data-statistics">
    <div class="statistics-top">
      <div class="line1 clearfix">
        <div class="item">
          <div class="inner">
            <div class="icon">
              <img src="./../../../images/data-statistics-1.png"/>
            </div>
            <h3>昨日访问数</h3>
            <p>15000</p>
          </div>
        </div>
        <div class="item">
          <div class="inner">
            <div class="icon">
              <img src="./../../../images/data-statistics-2.png"/>
            </div>
            <h3>昨日访客数</h3>
            <p style="color: #B8E986;">15000</p>
          </div>
        </div>
        <div class="item">
          <div class="inner">
            <div class="icon">
              <img src="./../../../images/data-statistics-3.png"/>
            </div>
            <h3>昨日注册用户数</h3>
            <p style="color: #FF7676;">15000</p>
          </div>
        </div>
        <div class="item">
          <div class="inner">
            <div class="icon">
              <img src="./../../../images/data-statistics-4.png"/>
            </div>
            <h3>总用户数</h3>
            <p style="color: #FEC36D;">15000</p>
          </div>
        </div>
      </div>
      <div class="line2 clearfix">
        <div class="item">
          <div class="inner">
            <div class="icon">
              <img src="./../../../images/data-statistics-5.png"/>
            </div>
            <h3>昨日APP安装数</h3>
            <p style="color: #2CABE3;">15000</p>
          </div>
        </div>
        <div class="item">
          <div class="inner">
            <div class="icon">
              <img src="./../../../images/data-statistics-6.png"/>
            </div>
            <h3>总APP安装数</h3>
            <p style="color: #4D7CFE;">15000</p>
          </div>
        </div>
      </div>
    </div>


    <div class="echart-line">
      <div class="control">
        <span>趋势分析</span>
        <el-radio-group v-model="radio1" size="mini">
          <el-radio-button label="7">最近7天</el-radio-button>
          <el-radio-button label="30">最近30天</el-radio-button>
          <el-radio-button label="90">最近90天</el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini">
        </el-date-picker>
        <div style="display: inline-block;">
          <el-checkbox v-model="checked">对比时间段</el-checkbox>
          <el-date-picker
            v-if="checked"
            v-model="date2"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini">
          </el-date-picker>
        </div>
      </div>
      <div style="padding-left: 38px;">
        <el-radio-group v-model="radio2" size="mini">
          <el-radio-button label="1">访问数</el-radio-button>
          <el-radio-button label="2">访客数</el-radio-button>
          <el-radio-button label="3">用户注册数</el-radio-button>
          <el-radio-button label="4">APP安装数</el-radio-button>
        </el-radio-group>
      </div>
      <div id="echart-line" style="height: 300px;"></div>
    </div>


    <div class="echart-line">
      <div class="control">
        <span>各时段访问量</span>
        <el-radio-group v-model="radio3" size="mini">
          <el-radio-button label="1">昨日</el-radio-button>
          <el-radio-button label="7">最近7天</el-radio-button>
          <el-radio-button label="30">最近30天</el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-model="date3"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini">
        </el-date-picker>
      </div>
      <div id="echart-bar" style="height: 300px;"></div>
    </div>

    <div class="clearfix">
      <div class="echart-pie">
        <div class="echart-line ">
          <div class="control">
            <span>文章发表量(含地方号)</span>
          </div>
          <div id="echart-pie1" style="height: 300px;"></div>
        </div>
      </div>
      <div class="echart-pie">
        <div class="echart-line ">
          <div class="control">
            <span>视频发表量(含地方号)</span>
          </div>
          <div id="echart-pie2" style="height: 300px;"></div>
        </div>
      </div>
    </div>


    <div class="ranking-list clearfix">
      <div class="echart-pie">
        <div class="echart-line ">
          <div class="control">
            <span>频道排行</span>
            <el-radio-group v-model="radio3" size="mini">
              <el-radio-button label="1">昨日</el-radio-button>
              <el-radio-button label="7">最近7天</el-radio-button>
              <el-radio-button label="30">最近30天</el-radio-button>
            </el-radio-group>
          </div>
          <div class="clearfix">
            <div class="table">
              <p>资讯频道点击量排行</p>
              <el-table :data="listData1">
                <el-table-column align="center" type="index" label="排名"></el-table-column>
                <el-table-column align="center" prop="classify" label="频道"></el-table-column>
                <el-table-column align="center" prop="num" label="点击量"></el-table-column>
              </el-table>
            </div>
            <div class="table">
              <p>视频频道点击量排行</p>
              <el-table :data="listData1">
                <el-table-column align="center" type="index" label="排名"></el-table-column>
                <el-table-column align="center" prop="classify" label="频道"></el-table-column>
                <el-table-column align="center" prop="num" label="点击量"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="echart-pie">
        <div class="echart-line ">
          <div class="control">
            <span>点击排行</span>
            <el-radio-group v-model="radio3" size="mini">
              <el-radio-button label="1">昨日</el-radio-button>
              <el-radio-button label="7">最近7天</el-radio-button>
              <el-radio-button label="30">最近30天</el-radio-button>
            </el-radio-group>
          </div>

          <div class="clearfix">
            <div class="table">
              <p>资讯阅读量排行</p>
              <el-table :data="listData1">
                <el-table-column align="center" type="index" label="排名"></el-table-column>
                <el-table-column align="center" prop="classify" label="资讯"></el-table-column>
                <el-table-column align="center" prop="num" label="点击量"></el-table-column>
              </el-table>
            </div>
            <div class="table">
              <p>视频点击量排行</p>
              <el-table :data="listData1">
                <el-table-column align="center" type="index" label="排名"></el-table-column>
                <el-table-column align="center" prop="classify" label="视频"></el-table-column>
                <el-table-column align="center" prop="num" label="点击量"></el-table-column>
              </el-table>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
  var echarts = require('echarts/lib/echarts');
  export default {
    data: function () {
      return {
        radio1: '7',
        radio2: '1',
        date: [],
        checked: true,
        date2: [],

        radio3: '1',
        date3: [],

        listData1: [
          {
            classify: '科技',
            num: 18000
          }, {
            classify: '科技',
            num: 18000
          }, {
            classify: '科技',
            num: 18000
          }, {
            classify: '科技',
            num: 18000
          }, {
            classify: '科技',
            num: 18000
          }, {
            classify: '科技',
            num: 18000
          },
        ]
      }
    },
    mounted: function () {
      this.setEchartLine();
      this.setEchartBar();
      this.setEchartPie1();
      this.setEchartPie2();
    },
    methods: {
      setEchartLine: function (list) {
        var option = {
          title: {
            text: '折线图堆叠'
          },
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '8%',
            top: '15%',
            containLabel: true
          },
          legend: {
            data: ['第1时间段', '第2时间段']
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '第1时间段',
              type: 'line',
              itemStyle: {
                normal: {
                  color: '#FF7676'
                }
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#FF7676'
                  }, {
                    offset: 1,
                    color: 'rgb(255, 255, 255)'
                  }])
                }
              },
              data: [120, 580, 101, 134, 90, 230, 210]
            },
            {
              name: '第2时间段',
              type: 'line',
              itemStyle: {
                normal: {
                  color: '#4D7CFE'
                }
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#4D7CFE'
                  }, {
                    offset: 1,
                    color: 'rgb(255, 255, 255)'
                  }])
                }
              },
              data: [220, 182, 191, 234, 590, 330, 310]
            }
          ]
        };
        if (!this.echartLine) this.echartLine = echarts.init(document.getElementById('echart-line'));
        this.echartLine.setOption(option);
      },

      setEchartBar: function (list) {
        var option = {
          color: ['#4D7CFE'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '8%',
            top: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Fri', 'Sat', 'Sun', 'Fri', 'Sat', 'Sun'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '各时段访问量',
              type: 'bar',
              barWidth: '60%',
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#4D7CFE'},
                      {offset: 1, color: '#50E3C2'}
                    ]
                  )
                }
              },
              data: [10, 52, 200, 334, 390, 330, 220, 334, 390, 330, 220]
            }
          ]
        };
        if (!this.echartBar) this.echartBar = echarts.init(document.getElementById('echart-bar'));
        this.echartBar.setOption(option);
      },

      setEchartPie1: function (list) {
        var option = {
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          color: ['#4D7CFE', '#FF7676', '#50E3C2', '#F5A623', '#2CABE3', '#50E3C2'],
          legend: {
            orient: 'vertical',
            x: '75%',
            data: ['内部', '采编', '总数'],
          },
          series: [
            {
              name: '发表量',
              type: 'pie',
              radius: ['30%', '70%'],
              center: ['40%', '50%'],
              data: [
                {value: 335, name: '内部'},
                {value: 310, name: '采编'},
                {value: 234, name: '总数'}
              ],

            }
          ]
        };
        if (!this.echartPie1) this.echartPie1 = echarts.init(document.getElementById('echart-pie1'));
        this.echartPie1.setOption(option);
      },
      setEchartPie2: function (list) {
        var option = {
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          color: ['#4D7CFE', '#FF7676', '#50E3C2', '#F5A623', '#2CABE3', '#50E3C2'],
          legend: {
            orient: 'vertical',
            x: '75%',
            data: ['内部', '采编', '总数'],
          },
          series: [
            {
              name: '发表量',
              type: 'pie',
              radius: ['30%', '70%'],
              center: ['40%', '50%'],
              data: [
                {value: 335, name: '内部'},
                {value: 310, name: '采编'},
                {value: 234, name: '总数'}
              ],

            }
          ]
        };
        if (!this.echartPie2) this.echartPie2 = echarts.init(document.getElementById('echart-pie2'));
        this.echartPie2.setOption(option);
      },
    }
  }
</script>

<style lang="scss">
  #data-statistics {
    background-color: #f5f5f5;
    .statistics-top {
      .line1 .item {
        width: 25%;
      }
      .line2 .item {
        width: 50%;
      }
      .item {
        float: left;
        .inner {
          height: 119px;
          margin: 0 20px 20px 0;
          background: #FFFFFF;
          border-radius: 3px;
          .icon {
            text-align: center;
            line-height: 112px;
            width: 36%;
            float: left;
            position: relative;
            &:after {
              content: '';
              width: 3px;
              height: 88px;
              background-color: #f5f5f5;
              position: absolute;
              top: 16px;
              right: 0;
            }
            img {
              width: 51px;
              max-width: 90px;
              vertical-align: middle;
            }
          }
          h3 {
            font-size: 14px;
            color: #333333;
            letter-spacing: 0;
            line-height: 14px;
            padding: 34px 0 10px 49%;
            font-weight: normal;
          }
          p {
            font-size: 30px;
            color: #50E3C2;
            letter-spacing: 0;
            line-height: 30px;
            padding-left: 49%;
            font-weight: bolder;
          }
        }
      }
    }

    .echart-line {
      background-color: #ffffff;
      margin: 0 20px 20px 0;
      .control {
        padding: 20px 20px 10px;
        font-size: 14px;
        & > div {
          vertical-align: middle;
          margin-bottom: 10px;
          margin-left: 20px;
        }
        & > span {
          vertical-align: middle;
          display: inline-block;
          margin-bottom: 10px;
          font-weight: bolder;
        }

      }
    }
    .echart-pie {
      width: 50%;
      float: left;
    }

    .ranking-list {
      .table {
        width: 50%;
        float: left;
        padding: 0 10px 20px;
        box-sizing: border-box;
        & > p {
          font-size: 14px;
          padding-left: 10px;
        }
      }
    }
  }
</style>
