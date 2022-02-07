<template>
  <div id="collect">
    <div class="container">
      <div class="content-path">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>收藏</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <picker-tool @pickerCollect="pickerCollectList" />
      <article-list @updateCollectList="getCollectList" :collectList="collectList"/>
      <div class="block" v-if="collectList&&collectList.length">
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
      collectList: [],
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
    getCollectList () {
      this.loading = true
      this.$axios.post(
        this.$global.API.queryCollectList,
        this.$qs.stringify({
          pageNum: this.pageNum,
          pageSize: this.pageSize
        })
      )
        .then(res => {
          this.loading = false
          if (res.code === '0') {
            this.collectList = res.data.collectList
            this.pageTotal = res.data.total
          }
        })
    },
    pickerCollectList (data) {
      this.collectList = data
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getHistoryList()
    }
  },
  created () {
    this.getCollectList()
  }
}
</script>

<style lang="scss" scoped>
#collect {
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
