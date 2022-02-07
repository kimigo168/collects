<template>
  <div id="thirdCollect">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="第三方库" name="0">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="article_search_form">
                  <el-form-item label="时间：">
                    <el-date-picker v-model="article_search_form.time" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="状态：">
                    <el-select v-model="article_search_form.status">
                      <el-option label="全部" value=""></el-option>
                      <!-- <el-option label="草稿" value="0"></el-option>
                      <el-option label="待审核" value="1"></el-option>
                      <el-option label="待编辑" value="2"></el-option> -->
                      <el-option label="待发布" value="3"></el-option>
                      <el-option label="已下架" value="5"></el-option>
                      <el-option label="已打回" value="6"></el-option> -->
                    </el-select>
                  </el-form-item>
                  <el-form-item label="频道：">
                    <el-select v-model="article_search_form.channel">
                      <el-option label="要闻" value=""></el-option>
                      <el-option label="济南" value="3"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="子频道：">
                    <el-select v-model="article_search_form.childChannel">
                      <el-option label="要闻" value=""></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input style="width:190px;" type="text" v-model="article_search_form.keyword" placeholder="输入文章标题查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="article_list" style="width:100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="imageUrl" label="封面" width="">
                  <template slot-scope="scope">
                    <defaultImage :url="!scope.row.cover ? '' :JSON.parse(scope.row.cover)[0].url"></defaultImage>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="标题"></el-table-column>
                <el-table-column align="center" prop="source" label="来源"></el-table-column>
                <el-table-column align="center" prop="channelName" label="分类"></el-table-column>
                <el-table-column align="center" prop="status" label="状态"></el-table-column>
                <el-table-column align="center" prop="time" label="采集时间"></el-table-column>
              </el-table>
            </div>
            <div class="page">
              <el-pagination @current-change="pageNumChange" :current-page.sync="article_page_num" :page-size="article_page_size" layout="prev, pager, next, jumper" :total="article_page_total"></el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  name: 'thirdCollect',
  data () {
    return {
      loading: false,
      tab_index: 0,
      article_search_form: {
        time: [],
        status: '',
        channel: '',
        childChannel: '',
        keyword: ''
      },
      article_page_num: 1,
      article_page_size: 10,
      article_page_total: 0,
      article_list: [],
    }
  },
  methods: {
    queryList () {
      this.article_page_num = 1;
      this.getArticleList();
    },
    getArticleList () {

    },
    pageNumChange (val) {
      this.article_page_num = val;
      this.getArticleList();
    }
  },
  created () {

  }
}
</script>
