<template>
  <div id="edit-publish" v-loading.lock="loading">
    <div class="tab">
      <div class="webContent">
        <el-tabs v-model="sub_tab_index_2">
          <el-tab-pane label="原创文章" name="1">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="article_search_form_2">
                  <el-form-item label="时间">
                    <el-date-picker
                      v-model="article_search_form_2.timeScope"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="父频道">
                    <el-select v-model="article_search_form_2.channelPid" @change="getChildChannel" placeholder="父频道">
                      <el-option label="全部" value=""></el-option>
                      <el-option v-for="item in newsParentChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="子频道">
                    <el-select v-model="article_search_form_2.channelId" placeholder="子频道">
                      <el-option label="全部" value=""></el-option>
                      <el-option v-for="item in newsChildChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="状态">
                    <el-select v-model="article_search_form_2.status" placeholder="状态">
                      <el-option v-for="item in searchStatusList" :key="item.id" :label="item.name" :value="item.status"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="article_search_form_2.author" placeholder="输入信息员查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="article_search_form_2.title" placeholder="输入标题查找"></el-input>
                  </el-form-item>
                  <!-- <el-form-item>
                    <el-input type="text" v-model="article_search_form_2.author" placeholder="输入作者查找"></el-input>
                  </el-form-item> -->
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="article_list_2" style="width: 100%" class="articleTable">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="cover" label="封面" width="">
                  <template slot-scope="scope">
                    <defaultImage :url="scope.row.cover && scope.row.cover[0]?scope.row.cover[0].url:''"></defaultImage>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="标题">
                  <template slot-scope="scope">
                    <a href="javascript:;" @click="openPreviewArticle(scope.row.cid)">{{scope.row.title}}</a>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="createName" label="信息员"></el-table-column>
                <el-table-column align="center" prop="channelName" label="频道"></el-table-column>
                <el-table-column align="center" prop="subChannelName" label="子频道"></el-table-column>
                <el-table-column align="center" prop="tags" label="标签"></el-table-column>
                <el-table-column align="center" prop="publishTime" label="发布时间"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="status" label="状态">
                  <template slot-scope="scope">
                    <span v-for="(item,index) in statusList" :key="index" v-if="item.status == scope.row.status">{{item.name}}</span>
                    <p v-if="(scope.row.status == 2 || scope.row.status == 5 || scope.row.status == 6) && scope.row.rejectReason">
                      <el-tooltip :content="scope.row.rejectReason" placement="top">
                        <el-button type="text">打回原因</el-button>
                      </el-tooltip>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="viewNum" label="点击数"></el-table-column>
                <el-table-column align="center" label="操作" width="220">
                  <template slot-scope="scope">
                    <p>
                      <el-button v-if="scope.row.blockChange==0&&scope.row.status != 8" type="text" @click="setTop(scope.row)">置顶</el-button>
                      <!-- <el-button type="text" v-if="scope.row.status == 7" @click="pushFun(scope.row, 0)">推送</el-button> -->
                      <el-button type="text" @click="routerTo(scope.row)">修改</el-button>
                    </p>
                    <p>
                      <el-button type="text" v-if="scope.row.status == 7" @click="clickUpdateToAudit(scope.row.id,'8')">下架</el-button>
                      <el-button type="text" v-if="scope.row.status == 8" @click="clickUpdateToAudit(scope.row.id,'7')">恢复上架</el-button>
                      <!-- <el-button type="text" v-if="scope.row.status == 7" @click="makeExpres(scope.row)">生成快报</el-button> -->
                      <el-button v-if="scope.row.blockChange==0&&scope.row.status == 7" type="text" @click="insertToCarousel(scope.row)">选入轮播</el-button>
                    </p>
                    <p>
                      <!-- <el-button type="text" v-if="scope.row.status == 7"  @click="copyLink(scope.row)">复制链接</el-button>  -->
                      <el-button type="text" @click="openOperationLog(scope.row.cid)">操作记录</el-button>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="article_page_totle_2 > 0">
              <el-pagination
                @current-change="articlePageNumChange2"
                :current-page.sync="article_page_num_2"
                :page-size="article_page_size_2"
                layout="prev, pager, next, jumper"
                :total="article_page_totle_2">
              </el-pagination>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="第三方" name="5">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="article_search_form_3">
                  <el-form-item label="时间">
                    <el-date-picker
                      v-model="article_search_form_3.timeScope"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="父频道">
                    <el-select v-model="article_search_form_3.channelPid" placeholder="父频道" @change="getChildChannel">
                      <el-option label="全部" value=""></el-option>
                      <el-option v-for="item in newsParentChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="子频道">
                    <el-select v-model="article_search_form_3.channelId" placeholder="子频道">
                      <el-option label="全部" value=""></el-option>
                      <el-option v-for="item in newsChildChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="状态">
                    <el-select v-model="article_search_form_3.status" placeholder="状态">
                      <el-option v-for="(item,index) in searchStatusList" :label="item.name" :key="index" :value="item.status"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="article_search_form_3.author" placeholder="输入作者查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="article_search_form_3.title" placeholder="输入标题查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="article_list_3" style="width: 100%" class="articleTable">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="cover" label="封面" width="">
                  <template slot-scope="scope">
                    <defaultImage :url="scope.row.cover && scope.row.cover[0]?scope.row.cover[0].url:''"></defaultImage>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="标题">
                  <template slot-scope="scope">
                    <a href="javascript:;" @click="openPreviewArticle(scope.row.cid)">{{scope.row.title}}</a>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="createName" label="作者"></el-table-column>
                <el-table-column align="center" prop="channelName" label="频道"></el-table-column>
                <el-table-column align="center" prop="subChannelName" label="子频道"></el-table-column>
                <el-table-column align="center" prop="publishTime" label="发布时间"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="status" label="状态">
                  <template slot-scope="scope">
                    <span v-for="(item,index) in statusList" :key="index" v-if="item.status == scope.row.status ">{{item.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="viewNum" label="点击数"></el-table-column>
                <el-table-column align="center" label="操作" width="220" style="position:relative;">
                  <template slot-scope="scope">
                    <p>
                      <el-button v-if="scope.row.blockChange==0&&scope.row.status != 8" type="text" @click="setTop(scope.row)">置顶</el-button>
                      <el-button type="text" v-if="scope.row.status == 7"  @click="pushFun(scope.row, 1)">推送</el-button>
                      <el-button type="text" @click="routerTo(scope.row)">修改</el-button>
                    </p>
                    <p>
                      <el-button type="text" v-if="scope.row.status == 7" @click="clickUpdateToAudit(scope.row.id,'8')">下架</el-button>
                      <el-button type="text" v-if="scope.row.status == 8" @click="clickUpdateToAudit(scope.row.id,'7')">恢复上架</el-button>
                      <el-button type="text" v-if="scope.row.status == 7" @click="makeExpres(scope.row)">生成快报</el-button>
                      <el-button type="text" v-if="scope.row.blockChange==0&&scope.row.status == 7" @click="insertToCarousel(scope.row)">选入轮播</el-button>
                    </p>
                    <p>
                      <el-button type="text" v-if="scope.row.status == 7"  @click="copyLink(scope.row)">复制链接</el-button>
                      <el-button type="text" @click="openOperationLog(scope.row.cid)">操作记录</el-button>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="article_page_totle_3 > 0">
              <el-pagination
                @current-change="articlePageNumChange3"
                :current-page.sync="article_page_num_3"
                :page-size="article_page_size_3"
                layout="prev, pager, next, jumper"
                :total="article_page_totle_3">
              </el-pagination>
            </div>
          </el-tab-pane> -->
          <el-tab-pane label="采集文章" name="4">
            <div class="operate">
              <div class="search" style="width:100%;height:auto;float:none;">
                <el-form :inline="true" :model="article_search_form_5">
                  <el-form-item label="时间">
                    <el-date-picker
                      v-model="article_search_form_5.timeScope"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="父频道">
                    <el-select v-model="article_search_form_5.channelPid" @change="getChildChannel" placeholder="父频道">
                      <el-option label="全部" value=""></el-option>
                      <el-option v-for="item in newsParentChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="子频道">
                    <el-select v-model="article_search_form_5.channelId" placeholder="子频道">
                      <el-option label="全部" value=""></el-option>
                      <el-option v-for="item in newsChildChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="状态">
                    <el-select v-model="article_search_form_5.status" placeholder="状态">
                      <el-option v-for="(item,index) in searchStatusList" :label="item.name" :key="index" :value="item.status"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="article_search_form_5.author" placeholder="输入信息员查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="article_search_form_5.title" placeholder="输入标题查找"></el-input>
                  </el-form-item>
                  <!-- <el-form-item>
                    <el-input type="text" v-model="article_search_form_5.author" placeholder="输入作者查找"></el-input>
                  </el-form-item> -->
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="article_list_5" style="width: 100%" class="articleTable">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="cover" label="封面" width="">
                  <template slot-scope="scope">
                    <defaultImage :url="scope.row.cover && scope.row.cover[0]?scope.row.cover[0].url:''"></defaultImage>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="标题">
                  <template slot-scope="scope">
                    <a href="javascript:;" @click="openPreviewArticle(scope.row.cid)">{{scope.row.title}}</a>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="createName" label="信息员"></el-table-column>
                <el-table-column align="center" prop="channelName" label="频道"></el-table-column>
                <el-table-column align="center" prop="subChannelName" label="子频道"></el-table-column>
                <el-table-column align="center" prop="tags" label="标签"></el-table-column>
                <el-table-column align="center" prop="publishTime" label="发布时间"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="status" label="状态">
                  <template slot-scope="scope">
                    <span v-for="item in statusList" v-if="item.status == scope.row.status ">{{item.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="viewNum" label="点击数"></el-table-column>
                <el-table-column align="center" label="操作" width="220" style="position:relative;">
                  <template slot-scope="scope">
                    <p>
                      <el-button v-if="scope.row.blockChange==0&&scope.row.status != 8" type="text" @click="setTop(scope.row)">置顶</el-button>
                      <!-- <el-button type="text" v-if="scope.row.status == 7"  @click="pushFun(scope.row, 1)">推送</el-button> -->
                      <el-button type="text" @click="routerTo(scope.row)">修改</el-button>
                    </p>
                    <p>
                      <el-button type="text" v-if="scope.row.status == 7" @click="clickUpdateToAudit(scope.row.id,'8')">下架</el-button>
                      <el-button type="text" v-if="scope.row.status == 8" @click="clickUpdateToAudit(scope.row.id,'7')">恢复上架</el-button>
                      <!-- <el-button type="text" v-if="scope.row.status == 7" @click="makeExpres(scope.row)">生成快报</el-button> -->
                      <el-button type="text" v-if="scope.row.blockChange==0&&scope.row.status == 7" @click="insertToCarousel(scope.row)">选入轮播</el-button>
                    </p>
                    <p>
                      <!-- <el-button type="text" v-if="scope.row.status == 7"  @click="copyLink(scope.row)">复制链接</el-button> -->
                      <el-button type="text" @click="openOperationLog(scope.row.cid)">操作记录</el-button>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="article_page_totle_5 > 0">
              <el-pagination
                @current-change="articlePageNumChange5"
                :current-page.sync="article_page_num_5"
                :page-size="article_page_size_5"
                layout="prev, pager, next, jumper"
                :total="article_page_totle_5">
              </el-pagination>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="平台号文章" name="6">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="article_search_form_4">
                  <el-form-item label="时间">
                    <el-date-picker
                      v-model="article_search_form_4.timeScope"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="父频道">
                    <el-select v-model="article_search_form_4.channelPid" placeholder="父频道" @change="getChildChannel">
                      <el-option label="全部" value=""></el-option>
                      <el-option v-for="item in newsParentChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="子频道">
                    <el-select v-model="article_search_form_4.channelId" placeholder="子频道">
                      <el-option label="全部" value=""></el-option>
                      <el-option v-for="item in newsChildChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="状态">
                    <el-select v-model="article_search_form_4.status" placeholder="状态">
                      <el-option v-for="item in searchStatusList" :key="item.id" :label="item.name" :value="item.status"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="article_search_form_4.title" placeholder="输入标题查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="article_search_form_4.author" placeholder="输入作者查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="article_list_4" style="width: 100%" class="articleTable">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="cover" label="封面" width="">
                  <template slot-scope="scope">
                    <defaultImage :url="scope.row.cover && scope.row.cover[0]?scope.row.cover[0].url:''"></defaultImage>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="标题">
                  <template slot-scope="scope">
                    <a href="javascript:;" @click="openPreviewArticle(scope.row.cid)">{{scope.row.title}}</a>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="author" label="作者"></el-table-column>
                <el-table-column align="center" prop="channelName" label="频道"></el-table-column>
                <el-table-column align="center" prop="subChannelName" label="子频道"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="status" label="状态">
                  <template slot-scope="scope">
                    <span v-for="item in statusList" v-if="item.status == scope.row.status ">{{item.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="viewNum" label="点击数"></el-table-column>
                <el-table-column align="center" label="操作" width="220" style="position:relative;">
                  <template slot-scope="scope">
                    <p>
                      <el-button v-if="scope.row.blockChange==0&&scope.row.status != 8" type="text" @click="setTop(scope.row)">置顶</el-button>
                      <el-button type="text" v-if="scope.row.status == 7"  @click="pushFun(scope.row, 1)">推送</el-button>
                      <el-button type="text" @click="routerTo(scope.row)">修改</el-button>
                    </p>
                    <p>
                      <el-button type="text" v-if="scope.row.status == 7" @click="clickUpdateToAudit(scope.row.id,'8')">下架</el-button>
                      <el-button type="text" v-if="scope.row.status == 8" @click="clickUpdateToAudit(scope.row.id,'7')">恢复上架</el-button>
                      <el-button type="text" v-if="scope.row.status == 7" @click="makeExpres(scope.row)">生成快报</el-button>
                      <el-button type="text" v-if="scope.row.blockChange==0&&scope.row.status == 7" @click="insertToCarousel(scope.row)">选入轮播</el-button>
                    </p>
                    <p>
                      <el-button type="text" v-if="scope.row.status == 7"  @click="copyLink(scope.row)">复制链接</el-button>
                      <el-button type="text" @click="openOperationLog(scope.row.cid)">操作记录</el-button>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="article_page_totle_4 > 0">
              <el-pagination
                @current-change="articlePageNumChange4"
                :current-page.sync="article_page_num_4"
                :page-size="article_page_size_4"
                layout="prev, pager, next, jumper"
                :total="article_page_totle_4">
              </el-pagination>
            </div>
          </el-tab-pane> -->
          <!-- <el-tab-pane label="视频" name="3">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="video_search_form_2">
                  <el-form-item label="时间">
                    <el-date-picker
                      v-model="video_search_form_2.timeScope"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="频道">
                    <el-select v-model="video_search_form_2.channelPid" placeholder="频道">
                      <el-option label="全部" value=""></el-option>
                      <el-option v-for="item in videoParentChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="状态">
                    <el-select v-model="video_search_form_2.status" placeholder="状态">
                      <el-option v-for="item in searchStatusList" :key="item.id" :label="item.name" :value="item.status"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="video_search_form_2.author" placeholder="输入作者查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-input type="text" v-model="video_search_form_2.title" placeholder="输入标题查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table
                :data="video_list_2"
                style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="cover" label="封面" width="">
                  <template slot-scope="scope">
                    <defaultImage :url="scope.row.cover && scope.row.cover[0]?scope.row.cover[0].url:''"></defaultImage>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="标题">
                  <template slot-scope="scope">
                    <a href="javascript:;" @click="openPreviewArticle(scope.row.cid)">{{scope.row.title}}</a>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="createName" label="作者"></el-table-column>
                <el-table-column align="center" prop="channelName" label="频道"></el-table-column>
                <el-table-column align="center" prop="size" label="视频大小">
                  <template slot-scope="scope">
                    {{parseFloat(scope.row.size/1000).toFixed(2)}}M
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="duration" label="视频时长">
                  <template slot-scope="scope">
                    {{$durationDeal(scope.row.duration)}}
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="publishTime" label="发布时间"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="status" label="状态">
                  <template slot-scope="scope">
                    <span v-for="item in statusList" v-if="item.status == scope.row.status ">{{item.name}}</span>
                    <p v-if="(scope.row.status == 2 || scope.row.status == 5 || scope.row.status == 6) && scope.row.rejectReason">
                      <el-tooltip :content="scope.row.rejectReason" placement="top">
                        <el-button type="text">打回原因</el-button>
                      </el-tooltip>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="viewNum" label="点击数"></el-table-column>
                <el-table-column align="center" label="操作" width="220">
                  <template slot-scope="scope">
                    <p>
                      <el-button type="text" v-if="scope.row.status == 7" @click="clickUpdateToAudit(scope.row.id,'8')">下架</el-button>
                      <el-button type="text" v-if="scope.row.status == 8" @click="clickUpdateToAudit(scope.row.id,'7')">恢复上架</el-button>
                      <el-button type="text" @click="routerTo(scope.row)">修改</el-button>
                    </p>
                    <p>
                      <el-button type="text" v-if="scope.row.status == 7"  @click="copyLink(scope.row)">复制链接</el-button> 
                      <el-button type="text" @click="openOperationLog(scope.row.cid)">操作记录</el-button>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="video_page_totle_2 > 0">
              <el-pagination
                @current-change="videoPageNumChange2"
                :current-page.sync="video_page_num_2"
                :page-size="video_page_size_2"
                layout="prev, pager, next, jumper"
                :total="video_page_totle_2">
              </el-pagination>
            </div>
          </el-tab-pane> -->
        </el-tabs>
      </div>
    </div>
    <!-- 选入专题/选入轮播 -->
    <el-dialog v-loading.lock="loading1" :title="insertObj.isTopic?'选入专题':'选入轮播'" :visible.sync="insertObj.isShow" top="20vh" width="600px" :close-on-click-modal="true" :close-on-press-escape="false">
      <el-form :modal="insertObj" ref="insertObj" label-width="80px" >
        <el-form-item :label="insertObj.isTopic?'专题名称':'轮播名称'">
          <el-select v-model="insertObj.id">
            <el-option v-for="item in insertObj.list" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-top:40px;">
          <el-button style="width:80px;" @click="insertObj.isShow=false">取消</el-button>
          <el-button style="width:80px;" type="primary" @click="confirmInsertTopic">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <previewPop v-if="previewArticleId" :articleId="previewArticleId" :apiUrl="'/context/published/detailByCid'" @closePreviewArticle="closePreviewArticle"></previewPop>
    <OperationLog :articleId="operationLogId" @closeOperationLog="closeOperationLog"></OperationLog>
    <!-- 选入轮播 -->
    <insert-carousel v-if="isShowInsertCarousel" :insertData="insertData" @fClosePop="isShowInsertCarousel=false" @fConfirmInsert="insertFun"></insert-carousel>
  </div>
</template>

<script>
  import {mapState} from "vuex"
  import previewPop from "./../../../components/previewPop.vue";
  import OperationLog from "./../../../components/operation-log.vue";
  import insertCarousel from '../../../components/insertCarousel';
  export default {
    components: {
      OperationLog,
      previewPop,
      insertCarousel
    },
    data() {
      return {
        searchStatusList:[
          {
            name:'已发布',
            status:'7'
          },{
            name:'已下架',
            status:'8'
          },
        ],
        sub_tab_index_2: '1',
        //文章
        article_search_form_2: {
          status : "7",
          timeScope: [],
          channelPid: "",
          channelId: "",
          title: "",
          author: "",
        },
        article_list_2: [],
        article_page_num_2: 1,
        article_page_size_2: 10,
        article_page_totle_2: 0,
        //第三方文章
        article_search_form_3: {
          status : "7",
          timeScope: [],
          channelPid: "",
          channelId: "",
          title: "",
          author: "",
        },
        article_list_3: [],
        article_page_num_3: 1,
        article_page_size_3: 10,
        article_page_totle_3: 0,
        // 网站采集
        article_search_form_5: {
          status: "7",
          timeScope: [],
          channelPid: "",
          channleId: "",
          title: "",
          author: ""
        },
        article_list_5: [],
        article_page_num_5: 10,
        article_page_size_5: 10,
        article_page_totle_5: 0,
        //平台号文章文章
        article_search_form_4: {
          status : "7",
          timeScope: [],
          channelPid: "",
          channelId: "",
          title: "",
          author: "",
        },
        article_list_4: [],
        article_page_num_4: 1,
        article_page_size_4: 10,
        article_page_totle_4: 0,
        //视频
        video_search_form_2: {
          status : "7",
          timeScope: [],
          channelPid: "",
          title: "",
          author: "",
        },
        video_list_2: [],
        video_page_num_2: 1,
        video_page_size_2: 10,
        video_page_totle_2:0,
        previewArticleId:'',
        operationLogId:'',
        loading: false,
        loading1: false,
        // 选入专题，轮播弹窗
        insertObj: {
          id: '',
          articleId: '',
          list: [],
          isShow: false,
          isTopic: true // true专题，false轮播
        },
        isShowInsertCarousel: false, // 选入轮播弹窗
        insertData: {
          title: '', // 标题
          cover: '' // 封面
        },
        insertDataRow: null, // 插入轮播的项
        newsParentChannelList: [],
        newsChildChannelList: [],
        videoParentChannelList: [],
      }
    },
    computed: {
      ...mapState(
        ["statusList"]
      )
    },
    watch:{
      sub_tab_index_2:function () {
        if (this.sub_tab_index_2 == '3') {
          this.$getVideoChannel();
        } else {
          this.$getNewsChannel();
        }
        this.queryList();
      },
    },
    created() {
      if (this.$route.query.type) this.sub_tab_index_2 = this.$route.query.type;
      this.init();
    },
    methods: {
      queryList () {
        if(this.sub_tab_index_2 == '1'){
          this.article_page_num_2 = 1;
          this.getArticleListData2();
        }else if(this.sub_tab_index_2 == '5'){
          this.article_page_num_3 = 1;
          this.getArticleListData3();
        } else if (this.sub_tab_index_2 == '4') {
          this.article_page_num_5 = 1;
          this.getArticleListData5();
        } else if(this.sub_tab_index_2 == '6'){
          this.article_page_num_4 = 1;
          this.getArticleListData4();
        }else {
          this.video_page_num_2 = 1;
          this.getVideoListData2();
        }
      },
      init () {
        this.$getNewsChannel();
        this.getArticleListData2();
      },

      //点击下架、上架
      clickUpdateToAudit:function (id,status) {
        var self = this;
        self.$confirm(status=='8'?'确定下架吗？':'确定恢复上架吗？', status=='8'?'下架':'恢复上架', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: function (action) {
            if (action == 'confirm') {
              self.loading=true;
              self.$jqAjax({
                url:apiHost + '/context/published/updateStatus',
                data:{
                  id:id,
                  status:status
                },
                success:function (data) {
                  self.loading=false;
                  if(data.code === "0"){
                    self.$message({
                      showClose: true,
                      message: status=='8'?'已成功下架！':'已成功恢复上架！',
                      type: 'success'
                    });
                    self.queryList();
                  }else {
                    self.$message({
                      showClose: true,
                      message: data.msg + '',
                      type: 'error'
                    });
                  }
                }
              })

            }
          }
        })
      },

      getArticleListData2:function () {
        var self=this;

        var startTime='',endTime='';
        if(self.article_search_form_2.timeScope && self.article_search_form_2.timeScope.length>1){
          startTime=self.article_search_form_2.timeScope[0]+' 00:00:00';
          endTime=self.article_search_form_2.timeScope[1]+' 23:59:59';
        }
        self.loading=true;
        self.$jqAjax({
          url: apiHost + "/context/published/list",
          data: {
            type  : "1,6",
            status: self.article_search_form_2.status,
            startTime: startTime,
            endTime: endTime,
            channelPid: self.article_search_form_2.channelPid,
            channelId: self.article_search_form_2.channelId,
            title: self.article_search_form_2.title,
            author: self.article_search_form_2.author,
            pageNum: self.article_page_num_2,
            pageSize: self.article_page_size_2,
          },
          success: function (data) {
            self.loading=false;
            if (data.code == 0 && data.data) {
              for(var i=0;i<data.data.list.length;i++){
                try {
                  data.data.list[i].cover = JSON.parse(data.data.list[i].cover);
                }catch (e){

                }
              }
              if(data.data.list) self.article_list_2=data.data.list;
              self.article_page_totle_2=data.data.total;
            }
          }
        })
      },
      articlePageNumChange2(val) {
        this.article_page_num_2 = val;
        this.getArticleListData2();
      },

      getArticleListData3:function () {
        var self=this;
        var startTime='',endTime='';
        if(self.article_search_form_3.timeScope&&self.article_search_form_3.timeScope.length>1){
          startTime=self.article_search_form_3.timeScope[0]+' 00:00:00';
          endTime=self.article_search_form_3.timeScope[1]+' 23:59:59';
        }
        self.loading=true;
        self.$jqAjax({
          url: apiHost + "/context/published/list",
          data: {
            sourceType  : "2",
            status: self.article_search_form_3.status,
            startTime: startTime,
            endTime: endTime,
            channelPid: self.article_search_form_3.channelPid,
            channelId: self.article_search_form_3.channelId,
            title: self.article_search_form_3.title,
            pageNum: self.article_page_num_3,
            pageSize: self.article_page_size_3,
            author: self.article_search_form_3.author
          },
          success: function (data) {
            self.loading=false;
            if (data.code == 0 && data.data) {
              for(var i=0;i<data.data.list.length;i++){
                try {
                  data.data.list[i].cover = JSON.parse(data.data.list[i].cover);
                }catch (e){

                }
              }
              if(data.data.list) self.article_list_3=data.data.list;
               self.article_page_totle_3=data.data.total;
            }
          }
        })
      },
      articlePageNumChange3(val) {
        this.article_page_num_3 = val;
        this.getArticleListData3();
      },

      getArticleListData4:function () {
        var self=this;
        var startTime='',endTime='';
        if(self.article_search_form_4.timeScope&&self.article_search_form_4.timeScope.length>1){
          startTime=self.article_search_form_4.timeScope[0]+' 00:00:00';
          endTime=self.article_search_form_4.timeScope[1]+' 23:59:59';
        }
        self.loading=true;
        self.$jqAjax({
          url: apiHost + "/context/published/list",
          data: {
            sourceType  : "3",
            status: self.article_search_form_4.status,
            startTime: startTime,
            endTime: endTime,
            channelPid: self.article_search_form_4.channelPid,
            channelId: self.article_search_form_4.channelId,
            title: self.article_search_form_4.title,
            author: self.article_search_form_4.author,
            pageNum: self.article_page_num_4,
            pageSize: self.article_page_size_4,
          },
          success: function (data) {
            self.loading=false;
            if (data.code == 0 && data.data) {
              for(var i=0;i<data.data.list.length;i++){
                try {
                  data.data.list[i].cover = JSON.parse(data.data.list[i].cover);
                }catch (e){

                }
              }
              if(data.data.list) self.article_list_4=data.data.list;
              self.article_page_totle_4=data.data.total;
            }
          }
        })
      },
      getArticleListData5:function () {
        var self=this;
        var startTime='',endTime='';
        if(self.article_search_form_5.timeScope&&self.article_search_form_5.timeScope.length>0){
          startTime=self.article_search_form_5.timeScope[0]+' 00:00:00';
          endTime=self.article_search_form_5.timeScope[1]+' 23:59:59';
        }
        self.loading=true;
        self.$jqAjax({
          url: apiHost + "/context/published/list",
          data: {
            sourceType  : "4",
            status: self.article_search_form_5.status,
            startTime: startTime,
            endTime: endTime,
            channelPid: self.article_search_form_5.channelPid,
            channelId: self.article_search_form_5.channelId,
            title: self.article_search_form_5.title,
            author: self.article_search_form_5.author,
            pageNum: self.article_page_num_5,
            pageSize: self.article_page_size_5,
          },
          success: function (data) {
            self.loading=false;
            if (data.code == 0 && data.data) {
              for(var i=0;i<data.data.list.length;i++){
                try {
                  data.data.list[i].cover = JSON.parse(data.data.list[i].cover);
                }catch (e){

                }
              }
              if(data.data.list) self.article_list_5=data.data.list;
              self.article_page_totle_5=data.data.total;
            }
          }
        })
      },
      articlePageNumChange4(val) {
        this.article_page_num_4 = val;
        this.getArticleListData4();
      },
      articlePageNumChange5(val) {
        this.article_page_num_5 = val;
        this.getArticleListData5();
      },
      getVideoListData2:function () {
        var self=this;

        var startTime='',endTime='';
        if(self.video_search_form_2.timeScope&&self.video_search_form_2.timeScope.length>1){
          startTime=self.video_search_form_2.timeScope[0]+' 00:00:00';
          endTime=self.video_search_form_2.timeScope[1]+' 23:59:59';
        }
        self.loading=true;
        self.$jqAjax({
          url: apiHost + "/context/published/list",
          data: {
            type  : "3",
            status: self.video_search_form_2.status,
            startTime: startTime,
            endTime: endTime,
            channelPid: self.video_search_form_2.channelPid,
            title: self.video_search_form_2.title,
            author: self.video_search_form_2.author,
            pageNum: self.video_page_num_2,
            pageSize: self.video_page_size_2,
          },
          success: function (data) {
            self.loading=false;
            if (data.code == 0 && data.data) {
              for(var i=0;i<data.data.list.length;i++){
                try {
                  data.data.list[i].cover = JSON.parse(data.data.list[i].cover);
                }catch (e){

                }
              }
              if(data.data.list) self.video_list_2=data.data.list;
               self.video_page_totle_2=data.data.total;
            }
          }
        })
      },
      videoPageNumChange2(val) {
        this.video_page_num_2 = val;
        this.getVideoListData2();
      },


      //打开预览函数
      openPreviewArticle:function (cid) {
        this.previewArticleId=cid;
      },
      //关闭预览函数
      closePreviewArticle:function () {
        if(this.previewArticleId) this.previewArticleId='';
      },
      //打开操作记录
      openOperationLog:function (id) {
        this.operationLogId=id;
      },
      //关闭操作记录
      closeOperationLog:function () {
        if(this.operationLogId) this.operationLogId='';
      },
      //路由跳转函数
      routerTo (row) {
        console.log('row', row)
        let url = row.type == 1 ? '/layout/edit-edite-article?vfrom=4&id=':row.type == 6 ? '/layout/edit-edite-link?vfrom=4&id=':'/layout/edit-edite-video?vfrom=4&id=';
        this.$router.push(url+row.id+'&publishStatus='+row.status);
      },
      pushFun (row, no) {
        console.log('rowww', row)
        const h = this.$createElement;
        this.$msgbox({
          title: '推送',
          message: h('div',{style: 'margin:10px 10px;line-height:24px;'}, [
            h('p', {}, [h('span',{style: 'color: #000;'}, '标题：'),
              h('input', {style:'color: #000;width:280px;height:24px;text-indent:4px;line-height:24px;', attrs: {placeholder:'请输入标题',value:row.title}, ref:"inputTitle", key: `${new Date().getTime()}`},'')
            ]),
            h('p', {style:'margin:10px 0;'}, [h('span',{style: 'color: #000;vertical-align:top;'}, '摘要：'),
              h('textarea', {style:'color: #000;width:280px;height:64px;text-indent:4px;line-height:24px;', attrs: {placeholder:'请输入摘要'}, ref:"inputBrief", key: `${new Date().getTime()}`},'')
            ])
          ]),
          showConfrimButton: true,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              let inputTitle = this.$refs.inputTitle.value;
              let inputBrief = this.$refs.inputBrief.value;
              if (!inputTitle) {
                this.$message({type:'warning', message: '请输入标题', showClose: true});
                return;
              }
              if (!inputBrief) {
                this.$message({type:'warning', message: '请填写摘要', showClose: true});
                return;
              }
              this.loading = true;
              this.$ajax({
                url:'/push/push',
                type: 'POST',
                data: {
                  cid: row.cid,
                  title: inputTitle,
                  content: inputBrief,
                  contentType: 1
                },
                success: (res) => {
                  this.loading = false;
                  if (res.code == 0) {
                    this.$message({type: 'success', message: '推送成功', showClose: true});
                    this.queryList();
                  } else {
                    this.$message({type: 'error', message: `${res.msg}`, showClose: true});
                  }
                },
                error: (err) => {
                  this.loading = false;
                  this.$message({type: 'error', message: '操作失败', showClose: true});
                }
              });
            }
            done();
          }
        });
      },
      // 置顶
      setTop (row) {
        this.$confirm(`确定置顶该${this.sub_tab_index_2==3?'视频':'文章'}吗？`, '置顶', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$jqAjax({
            url: apiHost + '/context/published/updateStatus',
            type: 'POST',
            data: {
              id: row.id,
              isStick: 1,
              status: row.status
            },
            success: (res) => {
              this.loading = false;
              if (res.code == 0) {
                this.queryList();
                this.$message({type: 'success', message: '置顶成功', showClose: true});
              } else {
                this.$message({type: 'error', message: res.msg, showClose: true});
              }
            },
            error: (err) => {
              this.loading = false;
              this.$message({type: 'error', message: err.msg, showClose: true});
            }
          });
        });
      },
      // 选入专题
      insertTopic (row) {
        console.log('rowwww', row)
        this.insertObj.articleId = row.id;
        this.insertObj.isTopic = true;
        this.insertObj.list = [];
        this.insertObj.id = '';
        this.$ajax({
          url: '/topic/list',
          type: 'POST',
          data: {
            channelId: row.channelId,
            sonChannelId: row.subChannelId,
            status: 0,
            pageNum: 1,
            pageSize: 50
          },
          success: (res) => {
            if (res.code == 0 && res.data) {
              this.insertObj.list = res.data.list;
            }
          },
          error: (err) => {
            this.$message({type: 'error', message: '请求失败', showClose: true});
          }
        });
        this.insertObj.isShow = true;
      },
      confirmInsertTopic () {
        if (!this.insertObj.id && this.insertObj.isTopic) {
          this.$message({type: 'error', message: '请选择专题', showClose: true});
          return;
        }
        if (!this.insertObj.id && !this.insertObj.isTopic) {
          this.$message({type: 'error', message: '请选择轮播', showClose: true});
          return;
        }
        this.loading1 = true;
        this.$jqAjax({
          url: apiHost + '/context/published/selectContextToTopic',
          type: 'POST',
          data: {
            id: this.insertObj.articleId, // 稿件id
            topicId: this.insertObj.id
          },
          success: (res) => {
            this.loading1 = false;
            if (res.code == 0) {
              this.insertObj.isShow = false;
              this.queryList(); // 刷新
              this.$message({type: 'success', message: '选入成功', showClose: true});
            } else {
              this.$message({type: 'error', message: '操作失败', showClose: true});
            }
          },
          error: (err) => {
            this.loading1 = false;
            this.$message({type: 'error', message: '操作失败', showClose: true});
          }
        });
      },
      // 选入轮播
      insertToCarousel (row) {
        this.insertData.title = row.title;
        this.insertDataRow = row;
        if (row.cover && row.cover[0]) {
          this.insertData.cover = row.cover[0].url?row.cover[0].url : '';
        } else {
          this.insertData.cover = '';
        }
        this.isShowInsertCarousel = true;
      },
      insertFun (data) {
        this.isShowInsertCarousel = false;
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/context/published/selectContextToCarousel',
          type: 'POST',
          data: {
            id: this.insertDataRow.id,
            title: data.title,
            cover: data.cover
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.queryList();
              this.$message({type: 'success', message: '选入成功', showClose: true});
            } else {
              this.$message({type: 'error', message: res.msg, showClose: true});
            }
          },
          error: (err) => {
            this.loading = false;
            console.log('err',err);
            this.$message({type: 'error', message: err.msg, showClose: true});
          }
        });
      },
      // 生成快报
      makeExpres (row) {
        this.$confirm('确定生成快报？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$loading();
          this.$jqAjax({
            url: apiHost + '/newsflash/generateNewsFlash',
            type: 'POST',
            data: {
              cid: row.cid
            },
            success: (res) => {
              this.$loading().close();
              if (res.code == 0) {
                this.$message({type: 'success', message: '生成成功', showClose: true});
                this.queryList();
              } else {
                this.$message({type: 'error', message: res.msg, showClose: true});
              }
            },
            error: (err) => {
              this.$loading().close();
              this.$message({type: 'error', message: err.msg, showClose: true});
            }
          });
        });
      },
      // 复制链接
      copyLink (row) {
        let url = '';
        if (this.sub_tab_index_2 == '3') { // 视频
          url = '/context/published/getVideoUrl';
        } else { // 稿件
          url = '/context/published/getContextUrl'
        }
        this.$jqAjax({
          url: apiHost + url,
          type: 'POST',
          data: {
            cid: row.cid
          },
          success: (res) => {
            if (res.code == 0 && res.data) {
              this.$copyText(res.data).then(() => {
                this.$message({type: 'success', message: '复制成功', showClose: true});
              }, (e) => {
                this.$message({type: 'warning', message: '复制失败', showClose: true});
              });
            } else {
              this.$message({type: 'warning', message: '复制失败', showClose: true});
            }
          },
          error: (err) => {
            this.$message({type: 'warning', message: '复制失败', showClose: true});
          }
        });
        
      },
      getChildChannel () {
        this.newsChildChannelList = [];
        if (this.sub_tab_index_2 == '1') {
          this.article_search_form_2.channelId = '';
          this.$getNewsChannel(this.article_search_form_2.channelPid);
        } else if (this.sub_tab_index_2 == '5') {
          this.article_search_form_3.channelId = '';
          this.$getNewsChannel(this.article_search_form_3.channelPid);
        } else if (this.sub_tab_index_2 == '4') {
          this.article_search_form_5.channelId = '';
          this.$getNewsChannel(this.article_search_form_5.channelPid);
        } else if (this.sub_tab_index_2 == '6') {
          this.article_search_form_4.channelId = '';
          this.$getNewsChannel(this.article_search_form_4.channelPid);
        }
      }
    }
  }
</script>

<style lang="scss">
  
  .operate-wrap{
    width: 20px;
    margin: 0 auto;
    .hide-operate{
      width: 86px;
      padding: 5px 0;
      position: absolute;
      left: 50%;
      top: 0px;
      color: #fff;
      background-color: #808080;
      display: none;
      margin-left: -43px;
      z-index: 10;
      border-radius: 4px;
      li{
        line-height: 22px;
        cursor: pointer;
      }
    }
  }
  .operate-wrap:hover {
    .hide-operate{
      display: inline-block;
    }
  }
  .articleTable{
    .el-table > tbody > tr:last-child{
      .operate-wrap {
        .hide-operate {
          top: -30px;
        }
      }
    }
  }
</style>
