<template>
  <div id="history">
    <div class="container">
      <div class="content-path">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>历史</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <picker-tool @pickerHistory="pickerHistoryList" />
      <article-list @updatehistoryList="getHistoryList" :collectList="historyList" />
      <div class="block" v-if="historyList&&historyList.length">
        <el-pagination
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="pageTotal"
          :pager-count="5">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import pickerTool from '@/components/pickerTool.vue'
import articleList from '@/components/articleListRender.vue'
export default {
  data () {
    return {
      loading: false,
      historyList: [],
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0
    }
  },
  components: {
    pickerTool,
    articleList
  },
  methods: {
    getHistoryList () {
      this.loading = true
      this.$axios.post(
        this.$global.API.historyList,
        this.$qs.stringify({
          pageNum: this.pageNum,
          pageSize: this.pageSize
        })
      )
        .then(res => {
          this.loading = false
          if (res.code === '0') {
            this.historyList = res.data.historyList
            this.pageTotal = res.data.count
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    pickerHistoryList (data) {
      this.historyList = data
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getHistoryList()
    }
  },
  created () {
    this.getHistoryList()
  }
}
</script>

<style lang="scss" scoped>
#history {
  width: 100%;
  height: 100%;
  background: rgba(244, 244, 244, 1);
  padding-top: 119px;
  .container {
    width: 1200px;
    min-height: 880px;
    background: rgb(255, 255, 255);
    margin: 0 auto;
    padding-top: 40px;
    /deep/.content-path {
      margin-left: 85px;
    }
    .block {
      margin-top: 20px;
      padding-bottom: 20px;
      text-align: center;
    }
  }
}
</style>
