<template>
  <div id="original">
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index" @tab-click="handleClick">
        <el-tab-pane label="专题内容" name="0" v-if="!isShowContentEdit">
          <div class="content">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="subject_content_form">
                  <el-form-item label="状态">
                    <el-select v-model="subject_content_form.status" @change="subject_content_page_num=1;getContentList()">
                      <el-option label="已发布" value="0"></el-option>
                      <el-option label="已移出" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="专题">
                    <el-select v-model="subject_content_form.subject" filterable :filter-method="filterByInput">
                      <el-option v-for="list in subject_drop_list" :key="list.topicId" :value="list.topicId" :label="list.name"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="subject_content_page_num=1;getContentList()">查询</el-button>
                  </el-form-item>
                  <el-form-item style="float:right;">
                    <el-button type="primary" @click="addEditContent">添加内容</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="subject_content_list" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="105"></el-table-column>
                <el-table-column align="center" prop="cover" label="封面" width="">
                  <template slot-scope="scope">
                    <defaultImage :url="scope.row.bgCover"></defaultImage>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="标题"></el-table-column>
                <el-table-column align="center" prop="type" label="类型">
                  <template slot-scope="scope">
                    <span>{{scope.row.type==0?'资讯':'视频'}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="channelName" label="频道"></el-table-column>
                <el-table-column align="center" prop="sonChannelName" label="子频道"></el-table-column>
                <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="address" label="操作" width="150" v-show="subject_content_form.status == 0">
                  <template slot-scope="scope">
                    <el-button type="text" v-if="subject_content_form.subject" @click="move(scope.row.id,0)">上移</el-button>
                    <el-button type="text" v-if="subject_content_form.subject" @click="move(scope.row.id,1)">下移</el-button>
                    <el-button type="text" @click="moveOut(scope.row.id)">移出</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="subject_content_page_total > 0">
              <el-pagination @current-change="subjectPageNumChange" :current-page.sync="subject_content_page_num" :page-size="subject_content_page_size" layout="prev, pager, next, jumper" :total="subject_content_page_total">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="专题设置" name="1" v-if="!isShowContentEdit">
          <div class="content">
            <div class="operate">
              <div class="search lt">
                <el-form :inline="true" :model="subject_set_form">
                  <el-form-item label="状态">
                    <el-select v-model="subject_set_form.status" @change="subject_set_page_num=1;getSetList()">
                      <el-option label="已创建" value="0"></el-option>
                      <el-option label="已下架" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="名称" >
                    <el-input type="text" v-model="subject_set_form.name" style="width: 170px;" placeholder="请输入专题名称查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="subject_set_page_num=1;getSetList()">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="btn rt">
                <el-button type="primary" @click="subjectOperate(undefined)">新建专题</el-button>
              </div>
            </div>
            <div class="table">
              <el-table :data="subject_set_list" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="105"></el-table-column>
                <el-table-column align="center" prop="cover" label="封面" width="">
                  <template slot-scope="scope">
                    <defaultImage :url="scope.row.cover"></defaultImage>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="name" label="标题"></el-table-column>
                <el-table-column align="center" prop="channelName" label="频道"></el-table-column>
                <el-table-column align="center" prop="sonChannelName" label="子频道"></el-table-column>
                <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <!-- <el-table-column align="center" prop="createTime" label="发布时间"></el-table-column> -->
                <el-table-column align="center" prop="address" label="操作" width="200" v-show="subject_content_form.status == 1">
                  <template slot-scope="scope">
                    <!-- <p v-if="scope.row.status == 0">
                      <el-button type="text" @click="rankFun(scope, 0)">上移</el-button>
                      <el-button type="text" @click="rankFun(scope, 1)">下移</el-button>
                    </p> -->
                    <p>
                      <el-button v-if="scope.row.status == 0" type="text" @click="showInsertChannel(scope.row)">选入频道</el-button>
                      <el-button type="text" v-if="subject_set_form.status!=1" @click="subjectOperate(scope.row)">修改</el-button>
                    </p>
                    <p>
                      <!-- <el-button type="text" @click="insertCarousel(scope.row)">选入轮播</el-button> -->
                      <!-- <el-button type="text" v-if="scope.row.status == 0" @click="pushSubject(scope.row)">推送</el-button> -->
                    </p>
                    <p>
                      <el-button v-if="subject_set_form.status!=1" type="text" @click="editContent(scope.row)">内容编辑</el-button>
                      <el-button type="text" v-show="scope.row.status == 0" @click="shelveOperate(scope.row)">下架</el-button>
                      <el-button type="text" v-show="scope.row.status == 1" @click="shelveOperate(scope.row)">恢复上架</el-button>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="subject_set_page_total > 0">
              <el-pagination @current-change="subjectPageNumChange" :current-page.sync="subject_set_page_num" :page-size="subject_set_page_size" layout="prev, pager, next, jumper" :total="subject_set_page_total">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="频道专题管理" name="2" v-if="!isShowContentEdit">
          <div class="content">
            <div class="operate">
              <div class="search lt">
                <el-form :inline="true" :model="subject_set_form">
                  <el-form-item label="父频道" v-if="subject_set_form.type=='1'">
                    <el-select v-model="subject_set_form.news_channel" @change="getChannelList" :clearable="true">
                      <el-option value="" label="全部"></el-option>
                      <el-option v-for="list in channel_list" :key="list.id" :value="list.id" :label="list.name"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="子频道" v-if="subject_set_form.type=='1'">
                    <el-select v-model="subject_set_form.news_channel_child" :clearable="true" placeholder="请选择子频道">
                      <el-option v-for="list in child_channel_list" :key="list.id" :value="list.id" :label="list.name"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="名称">
                    <el-input type="text" v-model="subject_set_form.name" style="width: 170px;" placeholder="请输入专题名称查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="subject_set_page_num=1;getSetList()">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="subject_set_list" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="105"></el-table-column>
                <el-table-column align="center" prop="cover" label="封面" width="">
                  <template slot-scope="scope">
                    <defaultImage :url="scope.row.cover"></defaultImage>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="name" label="标题"></el-table-column>
                <el-table-column align="center" prop="channelName" label="频道"></el-table-column>
                <el-table-column align="center" prop="sonChannelName" label="子频道"></el-table-column>
                <el-table-column align="center" prop="createName" label="创建人"></el-table-column>
                <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
                <el-table-column align="center" prop="createTime" label="发布时间"></el-table-column>
                <el-table-column align="center" prop="address" label="操作" width="150" v-show="subject_content_form.status == 1">
                  <template slot-scope="scope">
                    <el-button v-if="subject_set_form.type!=2" type="text" @click="setTop(scope.row)">置顶</el-button>
                    <el-button type="text" @click="removeChannel(scope.row)">移出频道</el-button>
                    <el-button v-if="subject_set_form.type!=2"  type="text" @click="insertCarousel(scope.row)">选入轮播</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="subject_set_page_total > 0">
              <el-pagination @current-change="subjectPageNumChange" :current-page.sync="subject_set_page_num" :page-size="subject_set_page_size" layout="prev, pager, next, jumper" :total="subject_set_page_total">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="curSubject" name="3" v-if="isShowContentEdit">
          <div class="content">
            <div class="operate clearfix">
              <div class="search lt">
                <el-form :inline="true" :model="edit_content_form">
                  <el-form-item label="父频道：" v-if="edit_content_form.type=='1'">
                    <el-select v-model="edit_content_form.news_channel" @change="getChannelList" :clearable="true">
                      <el-option v-for="list in channel_list" :key="list.id" :value="list.id" :label="list.name"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="子频道：" v-if="edit_content_form.type=='1'">
                    <el-select v-model="edit_content_form.news_channel_child" :clearable="true" placeholder="请选择子频道">
                      <el-option v-for="item in child_channel_list" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="标题：">
                    <el-input type="text" v-model="edit_content_form.title" style="width: 170px;" placeholder="请输入标题查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="searchContent">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <p class="wx-tips">温馨提示：“选入”、“移出”的内容将会在专题中实时更新！</p>
            <div class="table-wrap clearfix">
              <div class="table-part left-part">
                <p class="label">待选内容</p>
                <el-table :data="edit_content_form.list" style="width: 100%;border:1px solid #948c8c;">
                  <el-table-column align="left" prop="title" label="标题"></el-table-column>
                  <el-table-column align="center" prop="address" label="操作" width="100">
                    <template slot-scope="scope">
                      <el-button type="text" @click="insertContent(scope.row)">选入</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="page" v-if="edit_content_form.page_total > 0">
                  <el-pagination @size-change="handleSizeChange" @current-change="contentPageChange" :current-page.sync="edit_content_form.page_num" :page-sizes="[10, 15, 20, 30]" :page-size="edit_content_form.page_size" layout="sizes, prev, pager, next, jumper" :total="edit_content_form.page_total">
                  </el-pagination>
                </div>
              </div>
              <div class="table-part right-part">
                <p class="label">已选内容</p>
                <el-table :data="edit_content_form.selectList" style="width: 100%;min-height:465px;border:1px solid #0099FF;">
                  <el-table-column align="left" prop="title" label="标题"></el-table-column>
                  <el-table-column align="center" prop="type" label="类型" width="100">
                    <template slot-scope="scope">
                      <span>{{scope.row.type==0?'资讯':'视频'}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="address" label="操作" width="100">
                    <template slot-scope="scope">
                      <el-button type="text" @click="removeContent(scope.row)">移出</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="page" v-if="edit_content_form.page_collect_total > 0">
                  <el-pagination @current-change="contentPageChange1" :current-page.sync="edit_content_form.page_collect_num" :page-size="edit_content_form.page_collect_size" layout="prev, pager, next, jumper" :total="edit_content_form.page_collect_total">
                  </el-pagination>
                </div>
              </div>
            </div>
            <div class="close-bot">
              <el-button type="primary" @click="closeAddContent">关闭</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--新增编辑轮播-->
    <el-dialog :before-close="closeOperateSubject" :title="!subject_edit_row.id ? '新增专题' : '编辑专题'" :visible.sync="operate_subject_visible" width="30%" :close-on-click-modal="false">
      <el-form :model="operate_subject_form" ref="operate_subject_form" :rules="operate_subject_form_rules" label-width="100px">
        <el-form-item label="专题名称" prop="subject_name">
          <el-input type="text" v-model="operate_subject_form.subject_name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="所属频道" prop="channel_parent">
          <el-col :span="11">
            <el-select v-model="operate_subject_form.channel_parent" :disabled="subject_edit_row.id?true:false" @change="getChildChannelList">
              <el-option v-for="list in channel_list['news']" :key="list.id" :value="list.id" :label="list.name"></el-option>
            </el-select>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-select v-model="operate_subject_form.channel_child" :disabled="subject_edit_row.id?true:false">
              <el-option v-for="list in channel_child_list" :key="list.id" :value="list.id" :label="list.name"></el-option>
            </el-select>
          </el-col>
        </el-form-item> -->
        <!-- <el-form-item label="选入轮播">
          <el-switch v-model="operate_subject_form.select_to_carousel" active-color="#13ce66" inactive-color="#ff4949" :disabled="subject_edit_row.id&&operate_subject_form.select_to_carousel_lock">
          </el-switch>
        </el-form-item> -->
        <el-form-item label="专题封面" prop="cover_url">
          <div class="upload">
            <el-upload class="avatar-uploader" :action="host + '/common/upload'" ref="upload" :show-file-list="false" :on-success="successUpload" :before-upload="beforeUpload">
              <img v-if="operate_subject_form.cover_url" :src="operate_subject_form.cover_url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <!-- <p>封面图尺寸750X400</p> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOperateSubject">取 消</el-button>
        <el-button type="primary" @click="subjectOperateDo('operate_subject_form')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 选入频道 -->
    <el-dialog v-loading.lock="loading" title="选入频道" :before-close="closeInsertChannel" :visible.sync="insert_channel_visible" width="30%">
      <el-form :model="insert_channel_form" ref="insert_channel_form" :rules="insert_channel_form" label-width="100px">
        <el-form-item prop="channel_parent">
          <el-col :span="12">
            <h3>文章</h3>
            <div class="allot" v-for="item in channel_list_news" :key="item.id">
              <div class="parent">
                <el-checkbox v-model="item.select" :disabled="item.disabled">{{item.name}}</el-checkbox>
              </div>
              <div class="children" v-if="item.select">
                <el-checkbox v-model="item1.select" v-for="item1 in item.subList" :key="item1.id" :disabled="item1.disabled">{{item1.name}}</el-checkbox>
              </div>
            </div>
          </el-col>
          <!-- <el-col :span="12" >
            <h3>视频</h3>
            <div class="allot" v-for="item in channel_list_video" :key="item.id">
              <div class="parent">
                <el-checkbox v-model="item.select" :disabled="item.disabled">{{item.name}}</el-checkbox>
              </div>
            </div>
          </el-col> -->
        </el-form-item>
      </el-form>
      <p style="font-size:12px;color:#f00;" v-if="channel_list_news">温馨提示：勾选了父频道，其相应的子频道需至少勾选一条</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeInsertChannel">取 消</el-button>
        <el-button type="primary" @click="confirmInsertChannel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      host: "",
      tab_index: "0",
      store_tab_index: '',
      channel_list: [],
      child_channel_list: [],
      //专题内容
      subject_content_form: {
        status: "0",
        news_channel: "",
        news_channel_child: "",
        subject: "",
      },
      subject_content_list: [],
      subject_content_page_num: 1,
      subject_content_page_size: 10,
      subject_content_page_total: 0,
      //专题设置
      subject_set_form: {
        status: "0",
        news_channel: "",
        news_channel_child: "",
        video_channel: "",
        name: "",
        type: "1"
      },
      subject_set_list: [],
      subject_drop_list: [], // 作为下拉筛选条件
      subject_set_page_num: 1,
      subject_set_page_size: 10,
      subject_set_page_total: 0,
      //新增编辑专题
      operate_subject_visible: false,
      operate_subject_form: {
        subject_name: "",
        channel_parent: "",
        channel_child: "",
        select_to_carousel: true,
        cover_url: "http://www.baidu.com",
        select_to_carousel_lock: false
      },
      operate_subject_form_rules: {
        subject_name: [
          { required: true, message: '请输入专题名称', trigger: 'blur' }
        ],
        cover_url: [
          { required: true, message: '请上传专题封面', trigger: 'blur' }
        ]
      },
      // 选入频道
      insert_channel_form: {
        channel_parent: '',
        channel_child: ''
      },
      insert_channel_visible: false,
      channel_parent_list: [],
      channel_child_list: [],
      subject_edit_row: {},
      loading: false,
      selectItem: null, // 要选入频道的专题
      channel_list_news: [],
      channel_list_video: [],
      isShowContentEdit: false, // 是否显示内容编辑
      edit_content_form: {
        type: '1', // 1：资讯，2：视频
        news_channel: '', //  资讯父频道
        news_channel_child: '',
        news_child_channel_list: [],
        video_channel: '', // 视频频道
        title: '',
        page_num: 1,
        page_size: 10,
        page_total: 0,
        list: [],
        selectList: [],
        
        editItem: null,
        // 已选内容
        page_collect_num: 1,
        page_collect_size: 10,
        page_collect_total: 0,
      },
      curSubject: ''
    };
  },
  created() {
    this.getChannelList();
    this.getSetDropList();
    this.host = apiHost;
  },
  methods: {
    handleClick () {
      if (this.tab_index == 0) {
        this.subject_content_page_num = 1;
        this.subject_content_form.news_channel = (this.channel_list['news']&&[0]?this.channel_list['news'][0].id:'');
        this.getSetDropList();
      } else {
        this.subject_set_page_num = 1;
        // this.subject_set_form.news_channel = (this.channel_list['news']&&[0]?this.channel_list['news'][0].id:'');
        this.subject_set_form.news_channel = '';
        this.getChannelList(this.subject_set_form.news_channel)
        this.getSetList();
      }
    },
    getSetDropList () { // 专题内容专题下拉菜单
      this.subject_drop_list = [];
      this.subject_content_form.subject = '';
      this.$ajax({
        url: '/topic/list',
        type: 'POST',
        data: {
          status: 0, // 0已创建，1已下架
          channelId: 0,
          pageNum: 1,
          pageSize: 50,
          type: 1
        },
        success: (res) => {
          if (res.code == 0) {
            this.subject_drop_list = res.data.list;
            if (res.data.list && res.data.list.length > 0) {
              this.subject_content_form.subject = res.data.list[0].topicId||'';
              this.getContentList();
            }
          }
        },
        error: (err) => {
          console.log(err)
        }
      });
    },
    searchChange (val) {
      console.log('va,', val)
    },
    getChannelList(pid) {
      var self = this;
      self.$ajax({
        url: "/user/getNewsChannel",
        type: "GET",
        data: {
          pid: pid || 0
        },
        success: function (data) {
          if (data.code == 0) {
              // 请求子频道数据
              if (pid) {
                self.child_channel_list = data.data
                if (self.tab_index == '2') { // 频道专题管理
                  self.subject_set_form.news_channel_child = data.data&&data.data[0]?data.data[0].id:''
                } else if (self.tab_index == '3') { // 添加内容
                  self.edit_content_form.news_channel_child = data.data&&data.data[0]?data.data[0].id:''
                }
              } else {
                self.channel_list = data.data;
                self.subject_content_form.news_channel = data.data[0].id;
                self.getChannelList(self.subject_content_form.news_channel)
              }
              // self.getContentList();
              // self.getSetDropList();
            
          }
        }
      });
    },
    //获取专题内容列表数据
    getContentList() {
      this.loading = true;
      this.subject_content_list = [];
      this.$ajax({
        url: "/topic/contentList",
        type: "POST",
        data: {
          // timeStart: !self.subject_content_form.date
          //   ? ""
          //   : self.subject_content_form.date[0],
          // timeEnd: !self.subject_content_form.date
          //   ? ""
          //   : self.subject_content_form.date[1],
          status: this.subject_content_form.status,
          // channelId: this.subject_content_form.news_channel,
          // sonChannelId: this.subject_content_form.news_channel_child,
          topicId: this.subject_content_form.subject,
          pageNum: this.subject_content_page_num,
          pageSize: this.subject_content_page_size,
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            this.subject_content_list = res.data.list;
            this.subject_content_list.map((item,index) => {
              if (item.cover && item.cover.length > 0) {
                try {
                  let cover = JSON.parse(item.cover);
                  this.$set(this.subject_content_list[index], 'bgCover', cover[0].url)
                } catch(e) {
                  this.$set(this.subject_content_list[index], 'bgCover', '')
                }
              }
            });
            this.subject_content_page_total = res.data.total;
          }
        },
        error: (error) => {
          this.loading = false;
          this.$message({
            type: "error",
            message: "请求失败",
            showClose: "true"
          });
        }
      });
    },
    //获取专题设置列表数据
    getSetList() {
      this.loading = true;
      this.subject_set_list = [];
      this.$ajax({
        url: "/topic/list",
        type: "POST",
        data: {
          // timeStart: !self.subject_content_form.date
          //   ? ""
          //   : self.subject_content_form.date[0],
          // timeEnd: !self.subject_content_form.date
          //   ? ""
          //   : self.subject_content_form.date[1],
          status: this.subject_set_form.status,
          channelId: this.tab_index == '1'? 0 : this.tab_index == '2'&&this.subject_set_form.type=='2'?this.subject_set_form.video_channel :(this.subject_set_form.news_channel||0),
          sonChannelId: this.tab_index == '1'? 0 : this.tab_index == '2'?this.subject_set_form.news_channel_child:'',
          name: this.subject_set_form.name,
          pageNum: this.subject_set_page_num,
          pageSize: this.subject_set_page_size,
          type: this.tab_index == 1 ? 1: 2
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            this.subject_set_list = res.data.list;
            this.subject_set_page_total = res.data.total;
          }
        },
        error: (error) => {
          this.loading = false;
          this.$message({
            type: "error",
            message: "请求失败",
            showClose: "true"
          });
        }
      });
    },
    subjectPageNumChange(val) {
      this.subject_content_page_num = val;
      if (this.tab_index == 0) { // 专题内容
        this.getContentList();
      } else { // 专题设置
        this.getSetList();
      }
    },
    beforeUpload(file) {
      console.log('file', file)
      let self = this;
      if(file.type != 'image/jpeg' && file.type != 'image/png' && file.type != 'image/gif'){
          this.$message({
              type: 'error',
              message: '图片格式不正确，仅支持jpg、jpeg、png、gif格式!',
              showClose: 'true'
          });
          return false;
      }
      if(file.size/1024/1024 > 5){
        this.$message({
          type: 'error',
          message: '单张图片大小不超过5M!',
          showClose: 'true'
        });
        return false;
      }
      const isSize = new Promise(function(resolve, reject) {
        let width = 100;
        let height = 100;
        let _URL = window.URL || window.webkitURL;         
        let img = new Image();
        img.onload = function() {
          // let valid = img.width == 750 && img.height === 400;
          // valid ? resolve() : reject();
          resolve()
        }
        img.src = _URL.createObjectURL(file);
      }).then(() => {
          return file;
      }, () => {
          self.$message({type: 'warning', message: '图片尺寸不符，请重新选择',showClose: true});
          return Promise.reject();
      });
      return  isSize;
    },
    successUpload(res, file) {
      if (res && res.data && res.data.url) {
        this.operate_subject_form.cover_url = res.data.url;
      } else {
        this.operate_subject_form.cover_url = "";
      }
    },
    closeOperateSubject () {
      this.operate_subject_visible = false;
      this.$refs['operate_subject_form'].resetFields();
    },
    closeInsertChannel () {
      this.insert_channel_visible = false;
      this.$refs['insert_channel_form'].resetFields();
    },
    subjectOperate(row) {
      this.operate_subject_visible = true;
      if (row) {
        this.subject_edit_row = row;
        this.operate_subject_form.subject_name = row.name;
        this.operate_subject_form.channel_parent = row.channelId;
        this.getChildChannelList(row.channelId);
        this.operate_subject_form.channel_child = row.sonChannelId;
        this.operate_subject_form.select_to_carousel = row.selectedCarousel==0?false:true;
        this.operate_subject_form.select_to_carousel_lock = row.selectedCarousel == 1;
        this.operate_subject_form.cover_url = row.cover;
      } else {
        this.subject_edit_row = {};
        this.operate_subject_form.subject_name = "";
        this.operate_subject_form.channel_parent = "";
        this.operate_subject_form.channel_child = "";
        this.operate_subject_form.select_to_carousel = false;
        this.operate_subject_form.cover_url = "";
      }
    },
    subjectOperateDo(formName) {
      var self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          var data, url;
          data = {
            name: self.operate_subject_form.subject_name,
            channelId: self.operate_subject_form.channel_parent,
            sonChannelId: self.operate_subject_form.channel_child,
            selectedCarousel: Number(
              self.operate_subject_form.select_to_carousel
            ),
            cover: self.operate_subject_form.cover_url
          };
          url = "/topic/add";
          if (self.subject_edit_row.id) {
            data.id = self.subject_edit_row.topicId;
            url = "/topic/update";
          }
          self.$ajax({
            url: url,
            type: "POST",
            data: data,
            success: function (data) {
              if (data.code == 0) {
                self.$message({
                  type: "success",
                  message: "操作成功",
                  showClose: "true"
                });
                self.getSetList();
                self.closeOperateSubject();
              } else {
                self.$message({
                  type: "error",
                  message: data.msg,
                  showClose: "true"
                });
              }
            },
            error(error) {
              self.$message({
                type: "error",
                message: data.msg,
                showClose: "true"
              });
            }
          });
        }
      });
    },
    getChildChannelList(val) {
      this.subject_content_form.news_channel_child = "";
      this.subject_set_form.news_channel_child = "";
      var list = this.channel_list;
      for (var i = 0; i < list.length; i++) {
        if (list[i].id == val) {
          this.child_channel_list = list[i].sonList || [];
          this.channel_child_list = list[i].sonList || [];
          return;
        }
      }
    },
    getChildChannelList1(val) {
      this.subject_content_form.news_channel_child = "";
      this.subject_set_form.news_channel_child = "";
      var list = this.channel_list;
      for (var i = 0; i < list.length; i++) {
        if (list[i].id == val) {
          this.child_channel_list = list[i].sonList || [];
          this.channel_child_list = list[i].sonList || [];
          this.getSetDropList(); // 获取下拉菜单
          return;
        }
      }
    },
    getChildChannelList2 (val) {
      this.edit_content_form.news_channel_child = '';
      let list = this.channel_list;
      for (let item of list) {
        if (item.id == val) {
          this.edit_content_form.news_child_channel_list = item.sonList || [];
          this.edit_content_form.news_channel_child = item.sonList && item.sonList.length > 0 ? (item.sonList[0].id||'') : ''
        }
      }
    },
    shelveOperate(row) {
      var self = this;
      var txt = row.status == 0 ? "下架" : "重新上架";
      self
        .$confirm("确定" + txt + "该专题吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          self.$ajax({
            url: "/topic/update",
            type: "POST",
            data: {
              id: row.topicId,
              status: row.status == 0 ? 1 : 0
            },
            success: function (data) {
              if (data.code == 0) {
                self.$message({
                  type: "success",
                  message: "操作成功",
                  showClose: "true"
                });
                self.getSetList();
              } else {
                self.$message({
                  type: "error",
                  message: "操作失败",
                  showClose: "true"
                });
              }
            },
            error(error) {
              self.$message({
                type: "error",
                message: "请求失败",
                showClose: "true"
              });
            }
          });
        });
    },
    //移出
    moveOut(id) {
      var self = this;
      self.$confirm("确定从轮播中移出该内容吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self.$ajax({
            url: "/topic/removeContent",
            type: "GET",
            data: {
              id: id
            },
            success: function (data) {
              if (data.code == 0) {
                self.$message({
                  type: "success",
                  message: "移出成功",
                  showClose: "true"
                });
                self.getContentList();
              } else {
                self.$message({
                  type: "error",
                  message: "移出失败",
                  showClose: "true"
                });
              }
            },
            error(error) {
              self.$message({
                type: "error",
                message: "请求失败",
                showClose: "true"
              });
            }
          });
        });
    },
    //上移下移
    move(id, type) {
      var self = this;
      self.$confirm("确认执行此操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self.$ajax({
            url: "/topic/moveContent",
            type: "GET",
            data: {
              id: id,
              type: type
            },
            success: function (data) {
              if (data.code == 0) {
                self.$message({
                  type: "success",
                  message: "操作成功",
                  showClose: "true"
                });
                self.getContentList();
              }
            },
            error(error) {
              self.$message({
                type: "error",
                message: "请求失败",
                showClose: "true"
              });
            }
          });
        });
    },
    // 选入频道
    showInsertChannel (row) {
      this.selectItem = row;
      this.channel_list_news = [];
      this.channel_list_video = [];
      this.$jqAjax({
        url: apiHost + '/topic/getChannelSel',
        type: 'POST',
        data: {
          topicId: row.topicId
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            let news_list = res.data.news;
            let video_list = res.data.video;
            for (let item of news_list) {
              item.select = item.perm == 0 ? false : true;
              item.disabled = item.perm == 0 ? false : true;
              if (item.subList) {
                for (let item1 of item.subList) {
                  item1.select = item1.perm == 0 ? false : true;
                  item1.disabled = item1.perm == 0 ? false : true;
                }
              }
            }
            this.channel_list_news = news_list;
            for (let item of video_list) {
              item.select = item.perm == 0 ? false : true;
              item.disabled = item.perm == 0 ? false : true;
            }
            this.channel_list_video = video_list;
          } else {
            this.$message({type: 'error', message: '请求失败', showClose: true});
          }
        },
        error: (err) => {
          this.loading = false;
        }
      });
      this.insert_channel_visible = true;
    },
    insertChannel () {
      
    },
    // 确定选入
    confirmInsertChannel () {
      let news = this.channel_list_news;
      let videos = this.channel_list_video;
      // 判断是否有选了父频道，子频道未选择
      let isNoOneSelect = false;
      let noArr = [];
      for (let item of news) {
        if (item.select && item.subList) {
          let isNoSelectAll = item.subList.every((item1) => {
            return !item1.select
          });
          if (isNoSelectAll) {
            isNoOneSelect = true;
            noArr.push(item);
          }
        }
      }
      if (isNoOneSelect) {
        let strs = ''
        for (let item of noArr) {
          strs += (item.name + '，')
        }
        strs = strs.substring(0, strs.length-1);
        this.$message({type: 'warning', message: `${strs}频道未选择子频道，请选择后再保存`, showClose: true});
        return;
      }
      for (let item of news) {
        item.perm = item.select ? 1 : 0;
        if (item.subList) {
          for (let item1 of item.subList) {
            item1.perm = item1.select ? 1 : 0; 
          }
        }
      }
      for (let item of videos) {
        item.perm = item.select ? 1 : 0;
      }
      this.loading = true;
      this.$jqAjax({
        url: apiHost + '/topic/selectToChannel',
        type: 'POST',
        data: {
          topicId: this.selectItem.topicId,
          channelList: JSON.stringify({
            news: news,
            video: videos
          })
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            this.$message({type: 'success', message: '选入成功', showClose: true});
            this.subject_set_page_num = 1;
            this.closeInsertChannel();
            this.getSetList();
          } else {
            this.$message({type: 'error', message: res.msg, showClose: true});
          }
        },
        error: (err) => {
          this.loading = true;
          this.$message({type: 'error', message: '操作失败', showClose: true});
        }
      });
    },
    removeChannel (row) { 
      this.$confirm('确定移出频道？', '移出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$jqAjax({
          url: apiHost + '/topic/selectOutChannel',
          type: 'POST',
          data: {
            id: row.id
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({type: 'success', message: '移出成功',showClose: true});
              this.subject_set_page_num = 1;
              this.getSetList();
            } else {
              this.$message({type: 'error', message: '操作失败', showClose: true});
            }
          },
          error: (err) => {
            this.loading = false;
          }
        });
      });
    },
    insertCarousel (row) {
      console.log('row', row);
      this.$confirm('确定选入轮播吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$ajax({
          url: '/topic/update',
          type: 'POST',
          data: {
            selectedCarousel: 1,
            name: row.name,
            channelId: row.channelId,
            sonChannelId: row.sonChannelId,
            cover: row.cover,
            id: row.topicId
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({type: 'success', message: '选入成功', showClose: true});
              this.subject_set_page_num = 1;
              this.getSetList();
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
    rankFun (scope, no) {
      let exchangeItem = null;
      let curIdx = scope.$index;
      if (no == 0) { // 上移
        exchangeItem = this.subject_set_list[curIdx - 1];
      } else { // 下移
        exchangeItem = this.subject_set_list[curIdx + 1];
      }
      if (!exchangeItem) {
        this.$message({type: 'warning', message: `当前数据无法${no==0?'上移':'下移'}`, showClose: true});
        return;
      }
      this.$confirm(`确定${no==0?'上移':'下移'}吗？`, `${no==0?'上移':'下移'}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/sort/exchange',
          type: 'POST',
          data: {
            sourceId: scope.row.id,
            destId: exchangeItem.id
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              // this.$message({type: 'success', message: '操作成功', showClose: true});
              this.subject_set_page_num = 1;
              this.getSetList();
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
    setTop (row) {
      this.$confirm('确定置顶吗？', '置顶', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/topic/stickTopic',
          type: 'POST',
          data: {
            topicId: row.topicId,
            channelPid: row.channelId,
            channelId: row.sonChannelId
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              this.$message({type: 'success', message: '置顶成功', showClose: true});
              this.subject_set_page_num = 1;
              this.getSetList();
            } else {
              this.$message({type: 'error', message: res.msg, showClose: true});
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({type: 'error', message: '操作失败', showClose: true});
          }
        });
      });
    },
    editContent (row) { // 内容编辑
      this.curSubject = '当前专题：'+row.name;
      this.store_tab_index = '1';
      this.tab_index = '3';
      this.edit_content_form.editItem = row;
      this.isShowContentEdit = true;
      this.edit_content_form.selectList = [];
      // 父频道默认选中第一个
      // this.edit_content_form.news_channel = this.channel_list['news']&&this.channel_list['news'][0] ? (this.channel_list['news'][0].id||'') : ''
      this.edit_content_form.news_channel = this.channel_list&&this.channel_list[0]?this.channel_list[0].id:''
      this.searchContent();
      this.getInsertedData();
    },
    getInsertedData () { // 已选入数据
      this.edit_content_form.selectList = [];
      this.$ajax({
        url: '/topic/contentList',
        type: 'POST',
        data: {
          status: '0',
          channelId: this.edit_content_form.editItem.channelId,
          sonChannelId: this.edit_content_form.editItem.sonChannelId,
          topicId: this.edit_content_form.editItem.topicId,
          pageNum: this.edit_content_form.page_collect_num,
          pageSize: this.edit_content_form.page_collect_size
        },
        success: (res) => {
          if (res.code == 0) {
            this.edit_content_form.selectList = res.data.list;
            this.edit_content_form.page_collect_total = res.data.total;
          }
        },
        error: (err) => {
          this.$message({type: 'error', message: '请求失败', showClose: true});
        }
      });
    },
    searchContent () { // 查找资讯或视频
      this.edit_content_form.page_num = 1;
      this.edit_content_form.page_total = 0;
      this.getArticleVideoList();
    },
    getArticleVideoList () {
      this.edit_content_form.list = [];
      this.loading = true;
      this.$jqAjax({
        url: apiHost + '/topic/searchContext',
        type: 'POST',
        data: {
          topicId: this.edit_content_form.editItem.topicId,
          channelPid: this.edit_content_form.type == '1' ? this.edit_content_form.news_channel : this.edit_content_form.video_channel,
          channelId: this.edit_content_form.type == '1' ? this.edit_content_form.news_channel_child: '',
          title: this.edit_content_form.title,
          type: this.edit_content_form.type,
          pageNum: this.edit_content_form.page_num,
          pageSize: this.edit_content_form.page_size
        },
        success: (res) => {
          this.loading = false;
          if (res.code == 0) {
            this.edit_content_form.list = res.data.list;
            this.edit_content_form.page_total = res.data.total;
          }
          console.log('res', res)
        },
        error: (err) => {
          this.loading = false;
        }
      });
    },
    contentPageChange (val) {
      this.edit_content_form.page_num = val;
      this.getArticleVideoList();
    },
    contentPageChange1 (val) {
      this.edit_content_form.page_collect_num = val;
      this.getInsertedData();
    },
    handleSizeChange (val) {
      this.edit_content_form.page_size = val;
      this.searchContent();
    },
    insertContent (row) {
      this.$jqAjax({
        url: apiHost + '/context/published/selectContextToTopic',
        type: 'POST',
        data: {
          topicId: this.edit_content_form.editItem.topicId,
          cid: row.cid,
          channelPid: this.edit_content_form.editItem.channelId,
          channelId: this.edit_content_form.editItem.sonChannelId
        },
        success: (res) => {
          if (res.code == 0) {
            console.log('res', res)
            this.$message({type: 'success', message: '已选入', showClose: true});
            this.edit_content_form.page_collect_num = 1;
            this.getInsertedData(); // 刷新
          } else {
            this.$message({type: 'error', message: '操作失败', showClose: true});
          }
        },
        error: (err) => {
          this.$message({type: 'error', message: '操作失败', showClose: true});
        }
      });
    },
    removeContent (row) {
      this.$ajax({
        url: '/topic/removeContent',
        type: 'GET',
        data: {
          id: row.id
        },
        success: (res) => {
          if (res.code == 0) {
            this.$message({type: 'success', message: '已移出', showClose: true});
            this.edit_content_form.page_collect_num = 1;
            this.getInsertedData();
          } else {
            this.$message({type: 'error', message: '操作失败', showClose: true});
          }
        },
        error: (err) => {
          this.$message({type: 'error', message: '操作失败', showClose: true});
        }
      });
    },
    addEditContent () {
      if (!this.subject_content_form.subject) {
        this.$message({type: 'warning', message: '请先选择专题', showClose: true});
        return;
      }
      this.edit_content_form.editItem = {
        topicId: this.subject_content_form.subject,
        channelId: this.subject_content_form.news_channel,
        sonChannelId: this.subject_content_form.news_channel_child
      }
      this.subject_drop_list.forEach((item, index) => {
        if (this.subject_content_form.subject == item.topicId) {
          this.curSubject = '当前专题：' + item.name;
        }
      });
      // 父频道默认选中第一个
      // this.edit_content_form.news_channel = this.channel_list['news']&&this.channel_list['news'][0] ? (this.channel_list['news'][0].id||'') : ''
      this.edit_content_form.news_channel = this.channel_list && this.channel_list[0] ? this.channel_list[0].id : ''
      this.getChannelList(this.edit_content_form.news_channel);
      this.searchContent();
      this.edit_content_form.page_collect_num = 1;
      this.getInsertedData();
      this.store_tab_index = '0';
      this.tab_index = '3';
      this.isShowContentEdit = true;
    },
    closeAddContent () {
      this.tab_index = this.store_tab_index;
      this.isShowContentEdit = false;
      // 清除
      this.handleClick();
    },
    changeEditType () {
      if (this.edit_content_form.type == '1') { // 资讯

      } else { // 视频
        // this.edit_content_form.video_channel = this.channel_list['video']&&this.channel_list['video'][0]?this.channel_list['video'][0].id : '';
      }
    },
    pushSubject (row) {
      const h = this.$createElement;
      this.$msgbox({
        title: '推送',
        message: h('div',{style: 'margin:10px 10px;line-height:24px;'}, [
          h('p', {}, [h('span',{style: 'color: #000;'}, '标题：'),
            h('input', {style:'color: #000;width:280px;height:24px;text-indent:4px;line-height:24px;', attrs: {placeholder:'请输入标题',value:row.name}, ref:"inputTitle", key: `${new Date().getTime()}`},'')
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
                cid: row.topicId,
                title: inputTitle,
                content: inputBrief,
                contentType: 2
              },
              success: (res) => {
                this.loading = false;
                if (res.code == 0) {
                  this.$message({type: 'success', message: '推送成功', showClose: true});
                  
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
    filterByInput (val) {
      // if (!val) return;
      this.subject_drop_list = [];
      setTimeout(() => {
        this.$jqAjax({
          url: apiHost + '/topic/thinkList',
          type: 'POST',
          data: {
            keyword: val
          },
          success: (res) => {
            if (res.code == 0) {
              this.subject_drop_list = res.data;
            }
          },
          error: (err) => {
            console.log(err)
          }
        });
      }, 200);
    }
  }
}
</script>

<style lang="scss" scoped>
#original .el-dialog  {
  .el-checkbox {
    width: 140px;
    margin: 5px;
  }
  .parent {
    line-height: 20px;
  }
  .children {
    margin-left: 25px;
    line-height: 20px;
  }
}
.wx-tips {
  font-size: 12px;
  color:#f00;
  padding-left: 22px;
}
.table-wrap {
  width: 100%;
  padding-top: 20px;
  .table-part {
    width: 47.5%;
    .label {
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
  }
  .left-part {
    float: left;
    margin-right: 2.5%;
    .label {
      border:1px solid #948c8c;
      border-bottom: 0;
    }
  }
  .right-part {
    float: right;
    margin-left: 2.5%;
    .label {
      border:1px solid #0099FF;
      border-bottom: 0;
    }
  }
}
.close-bot {
  padding-top: 20px;
  text-align: center;
}
</style>
