<template>
  <div id="read-detail">
    <div class="tab">
      <el-tabs>
        <el-tab-pane label="用户阅读详情">
          <div class="content">
            <div class="user-info">
              <span class="avatar-img">
                <img :src="userInfo.avatar?userInfo.avatar:defaultAvatar" alt="">
              </span>
              <span class="name">{{userInfo.name}}</span>
              <span class="sex">{{userInfo.sex}}</span>
              <span class="company">{{userInfo.company}}</span>
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
                <!-- <el-table-column align="center" type="index" label="序号" width="70"></el-table-column> -->
                <el-table-column align="center" prop="rank" label="排名"></el-table-column>
                <el-table-column align="center" prop="title" label="文章标题"></el-table-column>
                <el-table-column align="center" prop="clickNum" label="文章点击数"></el-table-column>
                <el-table-column align="center" prop="readtime" label="最近阅读时间"></el-table-column>
              </el-table>
            </div>
            <div class="page">
              <el-pagination @current-change="pageNumChange" :current-page.sync="pageNum" :page-size="pageSize" layout="prev, pager, next, jumper" :total="pageTotal">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  name: 'readDetail',
  data () {
    return {
      timeActiveIdx: '0',
      defaultAvatar: require('../../../images/qingbaosuologo.png'),
      userInfo: {
        avatar: '',
        name: '用户姓名',
        sex: '性别',
        company: '所属公司'
      },
      search_form: {
        time: []
      },
      readList: [
        {
          rank: '1',
          title: '台风来了',
          clickNum: 100,
          readtime: '2019-08-09 14:00'
        },
        {
          rank: '2',
          title: '台风来了',
          clickNum: 100,
          readtime: '2019-08-09 14:00'
        }
      ],
      pageNum: 1,
      pageSize: 20,
      pageTotal: 0
    }
  },
  methods: {
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
      this.search_form.time.push(new Date().format('YYYY-MM-DD'));
      this.getList()
    },
    pageNumChange (val) {
      this.pageNum = val;
      this.getList()
    },
    dateSelect () {
      console.log('日期选择变化', this.search_form.time)
      this.getList()
    },
    getList () {

    }
  },
  created () {

  }
}
</script>
<style lang="scss" scoped>
#read-detail {
  .user-info {
    height: 90px;
    padding: 0 20px;
    margin-bottom: 30px;
    margin-top: 20px;
    span {
      vertical-align: middle;
      margin-right: 30px;
    }
    .avatar-img {
      width: 90px;
      height: 90px;
      display: inline-block;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid #B2B2B2;
      img {
        width: 90px;
        height: 90px;
        border-radius: 50%;
      }
    }
    
  }
  .date-select {
    height: 70px;
    padding-top: 20px;
    box-sizing: border-box;
  }
}
</style>