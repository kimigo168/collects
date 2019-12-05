<template>
  <div id="intelligence">
    <div class="tab">
      <div class="top-banner">
        <div class="brief-wrap">
          <h2>数据概览</h2>
          <div class="center">
            <div class="item left-item">
              <img src="../../../images/data-statistics-1.png" alt="">
              <div class="count">
                <p>昨日总点击次数</p>
                <h3>{{totalClickNum}}</h3>
              </div>
            </div>
            <div class="item center-item">
              <img src="../../../images/data-statistics-2.png" alt="">
              <div class="count">
                <p>总用户数</p>
                <h3>{{totalUserNum}}</h3>
              </div>
            </div>
            <div class="item right-item">
              <img src="../../../images/data-statistics-4.png" alt="">
              <div class="count">
                <p>总文章数</p>
                <h3>{{totalArticleNum}}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-banner">
        <h2>点击排行榜</h2>
        <div class="date-select">
          <ul class="time-query">
            <li @click="selectQueryTime(index, 0)" :class="{'active':index === timeActiveIdx}" v-for="(item, index) in timeQueryArr" :key="index">{{item}}</li>
          </ul>
          <div class="time-pick">
            日期选择：
            <el-date-picker :clearable="false" v-model="timePickArr" @change="timeSelectChange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </div> 
        </div>
        <div class="table">
          <el-table :data="clickList" style="width:100%">
            <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
            <el-table-column align="center" prop="rank" label="排名">
            </el-table-column>
            <el-table-column align="center" prop="title" label="文章标题"></el-table-column>
            <el-table-column align="center" prop="type" label="类型"></el-table-column>
            <el-table-column align="center" prop="source" label="来源"></el-table-column>
            <el-table-column align="center" prop="clickNum" label="点击量"></el-table-column>
          </el-table>
        </div>
        <div class="page" v-if="clickPageTotal > 0">
          <el-pagination @size-change="handleSizeChange" :page-sizes="[10, 20, 30]" :page-size="clickPageSize" @current-change="clickPageNumChange" :current-page.sync="clickPageNum" layout="total, sizes, prev, pager, next" :total="clickPageTotal"></el-pagination>
        </div>
      </div>
      <div class="table-wrap">
        <div class="tab-title">
          <h2>文章统计</h2>
        </div>
        <div class="date-select">
          <ul class="time-query">
            <li @click="selectQueryTime(index, 1)" :class="{'active':index === timeActiveIdx1}" v-for="(item, index) in timeQueryArr" :key="index">{{item}}</li>
          </ul>
          <div class="time-pick">
            日期选择：<el-date-picker :clearable="false" v-model="timePickArr" @change="timeSelectChange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </div> 
        </div>
        <div class="table">
          <el-table :data="countList" style="width:100%">
            <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
            <el-table-column align="center" prop="rank" label="排名">
            </el-table-column>
            <el-table-column align="center" prop="role" label="岗位"></el-table-column>
            <el-table-column align="center" prop="name" label="姓名"></el-table-column>
            <el-table-column align="center" prop="articleNum" label="文章数"></el-table-column>
          </el-table>
        </div>
        <div class="page" v-if="countPageTotal > 0">
          <el-pagination @size-change="handleSizeChange1" :page-sizes="[10, 20, 30]" :page-size="countPageSize" @current-change="countPageNumChange" :current-page.sync="users_page_num" layout="total, sizes, prev, pager, next" :total="countPageTotal"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'intelligence',
  data () {
    return {
      loading: false,
      totalClickNum: 0,
      totalUserNum: 0,
      totalArticleNum: 0,
      timeQueryArr: ['最近7天', '最近15天', '最近30天'],
      timeActiveIdx: 1, // 默认7天
      timeActiveIdx1: 1, // 默认7天
      timePickArr: [],
      timePickArr1: [],
      users_page_size: 7,
      clickList: [], // 点击量
      clickPageTotal: 0,
      clickPageSize: 10,
      clickPageNum: 1,
      // 文章统计
      countList: [],
      countPageNum: 1,
      countPageSize: 10,
      countPageTotal: 0
    }
  },
  methods: {
    selectQueryTime (index, no) {
      if (this.no == 0) {
        this.timeActiveIdx = index;
        // 设置时间
        this.timePickArr = [];
        if (this.timeActiveIdx == 0) { // 最近7天
          this.users_page_size = 7;
        } else if (this.timeActiveIdx == 1) { // 最近15天
          this.users_page_size = 15;
        } else { // 最近30天
          this.users_page_size = 30;
        }
        this.timePickArr.push(new Date(new Date().getTime() - 1000*60*60*24 * this.users_page_size).format('YYYY-MM-DD'))
        this.timePickArr.push(new Date().format('YYYY-MM-DD'));
      } else {
         this.timeActiveIdx1 = index;
      }
    },
    timeSelectChange () {
      this.timeActiveIdx = '';
      this.clickPageNum = 1;
      this.clickPageSize = 10;
    },
    handleSizeChange (val) {
      this.clickPageSize = val;
      this.clickPageNum = 1;
    },
    handleSizeChange1 (val) {
      this.countPageSize = val;
      this.countPageNum = 1;
    },
    clickPageNumChange (val) {
      this.clickPageNum = val;
      this.getClickRankList();
    },
    countPageNumChange (val) {
      this.countPageNum = val;
      this.getArticleCountList();
    },
    getClickRankList () {

    },
    getArticleCountList () {

    }
  },
  created () {

  }
}
</script>
<style lang="scss" scoped>
.top-banner {
  height: 280px;
  background-color: #f5f5f5;
  .brief-wrap {
    height: 240px;
    background-color: #fff;
    h2{
      height: 70px;
      line-height: 70px;
      text-indent: 30px;
      border-bottom: 2px solid #f5f5f5;
    }
    .center{
      // width: 600px;
      height: 170px;
      margin: 0 auto;
      position: relative;
      // display: flex;
      .item {
        // flex: 1;
        width: 280px;
        height: 104px;
        text-align: center;
        border: 2px solid #f5f5f5;
        position: absolute;
        top: 50%;
        padding-left: 100px;
        padding-top: 16px;
        img {
          width: 60px;
          height: 60px;
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
        }
        .count {
          height: 76px;
          border-left: 2px solid #f5f5f5;
          h3{
            font-size: 28px;
          }
          p{
            padding-top: 10px;
            font-size: 14px;
          }
        }
      }
      .left-item {
        left: 20px;
        transform: translateY(-50%);
        h3 {
          color: #51e3c3;
        }
      }
      .right-item {
        right: 20px;
        transform: translateY(-50%);
        h3 {
          color: #fec36d;
        }
      }
      .center-item {
        left: 50%;
        transform: translate(-50%, -50%);
        h3 {
          color: #b8e986;
        }
      }
    }
  }
}
.tab-banner {
  border-bottom: 2px solid #f5f5f5;
  position: relative;
  h2 {
    height: 76px;
    line-height: 76px;
    text-indent: 30px;
  }
}
.date-select {
  height: 76px;
  position: relative;
  .time-query{
    height: 40px;
    width: 334px;
    border: 1px solid rgba(204, 204, 204, 1);
    border-radius: 5px;
    line-height: 40px;
    position: absolute;
    left: 0;
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
    width: 435px;
    position: absolute;
    right: 80px;
    top: 18px;
  }
}
.table-wrap {
  .tab-title{
    height: 116px;
    // position: relative;
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
</style>