<template>
  <div id="collecting">
    <el-button v-if="isShowLiveRoom||isShowChatRoom" class="go-back" type="primary" @click="goBack">返回</el-button>
    <div class="tab" v-loading.lock="loading">
      <el-tabs v-model="tab_index" @tab-click="handleClick">
        <el-tab-pane v-if="!isShowLiveRoom && !isShowChatRoom" label="待审核" name="0">
          <div class="content">
            <div class="operate">
              <div class="search" @keyup.enter="queryList">
                <el-form :inline="true" :model="article_search_form_1" @keyup.enter="queryList">
                  <el-form-item label="创建时间：">
                    <el-date-picker v-model="article_search_form_1.applyTime" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                  </el-form-item>
                  <!-- <el-form-item label="开播时间：">
                    <el-date-picker v-model="article_search_form_1.broadcastTime" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                  </el-form-item> -->
                  <el-form-item>
                    <el-input style="width:190px;" type="text" v-model="article_search_form_1.keyword" placeholder="输入直播间名称/申请人查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="article_list_1" style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="imageUrl" label="直播封面" width="">
                  <template slot-scope="scope"><img :src="scope.row.imgUrl"></template>
                </el-table-column>
                <el-table-column align="center" prop="name" label="直播间名称"></el-table-column>
                <el-table-column align="center" prop="description" label="直播简介"></el-table-column>
                <el-table-column align="center" prop="hostName" label="申请人"></el-table-column>
                <!-- <el-table-column align="center" prop="startTime" label="申请开播时间"></el-table-column> -->
                <el-table-column align="center" prop="create_time" label="创建时间"></el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="approveFun(scope.row.id)">通过</el-button>
                    <el-button type="text" @click="refuseFun(scope.row.id)">打回</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="article_page_totle_1 > 0">
              <el-pagination @current-change="articlePageNumChange1" :current-page.sync="article_page_num_1" :page-size="article_page_size_1" layout="total, prev, pager, next, jumper" :total="article_page_totle_1"></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="!isShowLiveRoom && !isShowChatRoom" label="已审核" name="1">
          <div class="content">
            <div class="operate">
              <div class="search" @keyup.enter="queryList">
                <el-form :inline="true" :model="article_search_form_2">
                  <el-form-item label="审核时间：">
                    <el-date-picker v-model="article_search_form_2.checkTime" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="开播时间：">
                    <el-date-picker v-model="article_search_form_2.broadcastTime" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="状态：">
                    <el-select v-model="article_search_form_2.status" placeholder="状态">
                      <el-option label="全部" value=""></el-option>
                      <!-- <el-option label="待审核" value="0"></el-option> -->
                      <el-option label="已通过" value="1"></el-option>
                      <el-option label="已打回" value="2"></el-option>
                      <el-option label="直播中" value="3"></el-option>
                      <el-option label="暂停" value="4"></el-option>
                      <el-option label="已结束" value="5"></el-option>
                      <el-option label="已禁播" value="6"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input style="width:190px;" type="text" v-model="article_search_form_2.keyword" placeholder="输入直播间名称/申请人查找"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryList">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="table">
              <el-table :data="article_list_2"
                style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
                <el-table-column align="center" prop="imageUrl" label="封面" width="">
                  <template slot-scope="scope"><img :src="scope.row.imgUrl"></template>
                </el-table-column>
                <el-table-column align="center" prop="name" label="直播间名称"></el-table-column>
                <el-table-column align="center" prop="description" label="直播间简介"></el-table-column>
                <el-table-column align="center" prop="hostName" label="申请人"></el-table-column>
                <el-table-column align="center" prop="startTime" label="申请开播时间"></el-table-column>
                <el-table-column align="center" prop="auditName" label="审核人"></el-table-column>
                <el-table-column align="center" prop="update_time" label="审核时间"></el-table-column>
                <el-table-column align="center" prop="viewCount" label="观看人数"></el-table-column>
                <el-table-column align="center" prop="status" label="状态" width="70">
                  <template slot-scope="scope">
                    {{statusMatch[scope.row.status]}}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                      <el-button v-if="scope.row.status==6" type="text" @click="viewReason(scope.row, 0)">禁播原因</el-button>
                      <el-button v-if="scope.row.status==2" type="text" @click="viewReason(scope.row, 1)">打回原因</el-button>
                      <p>
                        <!-- <el-button v-if="scope.row.status==1||scope.row.status==3" type="text" @click="editLiveItem(scope.row.id)">修改</el-button> -->
                        <el-button v-if="scope.row.status != 3" type="text" @click="editLiveRoom(scope.row)">修改</el-button>
                      <el-button v-if="scope.row.status==1||scope.row.status==3" type="text" @click="forbidBroadcast(scope.row.id)">禁播</el-button>
                      </p>
                      <!-- <p>
                        <el-button v-if="scope.row.status==1||scope.row.status==3" type="text" @click="viewLiveStream(scope.row.id)">图文直播</el-button>
                        <el-button v-if="scope.row.status==1||scope.row.status==3" type="text" @click="viewChat(scope.row.id)">聊天记录</el-button>
                      </p>
                      <p v-if="scope.row.status==1||scope.row.status==3">
                        <el-button  type="text" @click="getStreamAddress(scope.row, 0)">获取拉流地址</el-button>
                        <el-button  type="text" @click="getStreamAddress(scope.row, 1)">获取推流地址</el-button>
                      </p> -->
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="page" v-if="article_page_totle_2 > 0">
              <el-pagination @current-change="articlePageNumChange2" :current-page.sync="article_page_num_2" :page-size="article_page_size_2" layout="total, prev, pager, next, jumper" :total="article_page_totle_2"></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="isShowLiveRoom" label="已发布" name="2"></el-tab-pane>
        <el-tab-pane v-if="isShowLiveRoom" label="已删除" name="3"></el-tab-pane>
        <el-tab-pane v-if="isShowChatRoom" label="未审核" name="4"></el-tab-pane>
        <el-tab-pane v-if="isShowChatRoom" label="已审核" name="5"></el-tab-pane>
        <el-tab-pane v-if="isShowChatRoom" label="已屏蔽" name="6"></el-tab-pane>
        <div class="content" v-if="isShowLiveRoom">
          <div class="input-area">
            <h3>添加图文直播：
            </h3>
            <textarea name="inputArea" v-model="sendContent" id="input" cols="30" rows="10"></textarea>
            <div class="upload-wrap">
              <div class="upload-menu">
                <span class="icon icon_img"><input type="file" @change="uploadPicChange" class="upload-btn" accept="image/*"></span>
                <span class="icon icon_video">
                  <input type="file" :disabled="isUploading" id="video" ref="video" @change="uploadVideoChange" class="upload-btn" accept="video/*">
                </span>
                <p class="tips">每次最多可添加9张图片或1个视频；视频和图片只能选择其中一个</p>
                <el-button class="send-btn" type="primary" @click="sendMsg">发送</el-button>
              </div>
              <div class="progress" v-if="isUploading" style="width: 500px;">
                <el-progress :percentage="uploadProgress"></el-progress>
              </div>
              <!-- 上传显示列表 -->
              <div class="upload-result">
                <ul class="pic-wrap" v-if="isSendPic">
                  <li class="pic-item" v-for="(item, index) in picList" :key="index">
                    <i class="del-icon" @click="removePic(index)"></i>
                    <img :src="item" alt="">
                  </li>
                  <li class="pic-item add-icon" v-if="picList.length >= 1 && picList.length < 9">
                    <input type="file" @change="uploadPicChange" accept="image/*">
                  </li>
                </ul>
                
                <ul class="video-wrap" v-else>
                  <li class="video-item" v-for="(item, index) in videoList" :key="index">
                    <i class="del-icon" @click="removeVideo(index)"></i>
                    <video :src="item.url"></video>
                    <img v-if="!item.cover" class="play-icon" src="../../../images/play_icon.png" alt="">
                  </li>
                </ul> 
              </div>
            </div>
          </div>
          <div class="content-area">
            <div class="content-list-wrap">
              <h3>图文直播内容</h3>
              <ul>
                <li class="msg-item" v-for="item in msgList" :key="item.id">
                  <!-- <p class="nickName"><i class="circle"></i>{{item.nickname}}&nbsp;&nbsp;{{item.createTime}}<span class="delete">删除</span></p> -->
                  <div class="detail">
                    <p class="context">{{item.broadcastContent}}</p>
                    <ul v-if="item.annexType=='pic'">
                      <li class="pic-item" v-for="(pic, pdx) in item.annexOut" :key="pdx">
                        <img :src="pic" alt="">
                      </li>
                    </ul>
                    <div v-if="item.annexType=='video'">
                      <video :src="item.broadcastAnnex" controls></video>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="content" v-if="isShowChatRoom">
          <div class="operate"></div>
          <div class="table">
            <el-table :data="chatList" style="width:100%;">
              <el-table-column align="center" type="index" label="序号" width="70"></el-table-column>
              <el-table-column align="center" prop="uname" label="用户名"></el-table-column>
              <el-table-column align="center" prop="lname" label="直播间名称"></el-table-column>
              <el-table-column align="center" prop="chatContent" label="聊天内容"></el-table-column>
              <el-table-column align="center" prop="createTime" label="时间"></el-table-column>
              <el-table-column align="center" prop="address" label="操作">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.status==0" type="text" @click="approveFun1(scope.row, 0)">通过</el-button>
                  <el-button v-if="scope.row.status==1" type="text" @click="approveFun1(scope.row, 1)">屏蔽</el-button>
                  <el-button v-if="scope.row.status==2" type="text" @click="approveFun1(scope.row, 2)">取消屏蔽</el-button>
                </template>
              </el-table-column>

            </el-table>
          </div>
          <div class="page" v-if="chat_page_total>0">
            <el-pagination @current-change="chatPageNumChange" :current-page.sync="chat_page_num" :page-size="chat_page_size" layout="total, prev, pager, next" :total="chat_page_total"></el-pagination>
          </div>
        </div>
      </el-tabs>
    </div>
    <el-dialog v-loading.lock="loading" title="直播间修改" :before-close="closeEdit" :visible.sync="liveRoomEdit.isShow" width="30%" :close-on-click-modal="false">
      <el-form :model="liveRoomEdit" ref="liveRoomEdit" label-width="100px" :rules="liveRoomEdit.rules">
        <el-form-item label="直播间名称:" prop="name">
          <el-input type="text" v-model="liveRoomEdit.name"></el-input>
        </el-form-item>
        <el-form-item label="直播间简介:" prop="description">
          <el-input type="text" v-model="liveRoomEdit.description"></el-input>
        </el-form-item>
        <el-form-item label="开播时间：" prop="time">
          <el-date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" v-model="liveRoomEdit.time" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEdit">取消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tab_index: 0, // 0:待核，1：已核
        article_search_form_1: {
          applyTime: '',
          broadcastTime: '',
          keyword: ''
        },
        statusMatch: {
          '0': '待审核',
          '1': '已通过',
          '2': '已打回',
          '3': '直播中',
          '4': '暂停',
          '5': '已结束',
          '6': '已禁播' // 原来是已取消
        },
        article_list_1: [],
        article_page_num_1: 1,
        article_page_size_1: 10,
        article_page_totle_1: 10,
        article_search_form_2: {
          checkTime: "",
          broadcastTime: "",
          channel: "",
          column: "",
          status: "",
          title: "",
          author: "",
          keyword: ""
        },
        article_list_2: [],
        article_page_num_2: 1,
        article_page_size_2: 10,
        article_page_totle_2: 100,
        loading: false,
        isShowLiveRoom: false, // 显示图文直播
        picList: [],
        videoList: [],
        msgList: [
          {
            nickname: '直播昵称',
            createTime: '2019-05-06 12:00',
            content: '本次加冰来自五湖四海！请大家热烈欢迎！!',
            id: 2,
            picList: [
              {
                src: 'http://i2.hexun.com/2018-11-21/195263783.jpg'
              }, {
                src: 'http://i2.hexun.com/2018-11-21/195263783.jpg'
              }
            ]
          }
        ],
        curViewRoomId: '', // 当前查看图文直播的id
        uploadUrl: apiHost+'/common/upload', // 公共上传路径
        isSendPic: true, // 默认发送图片
        video_file_list: [],
        sendContent: '',
        isShowChatRoom: false, // 显示聊天室
        curViewChatId: '',
        chat_page_num: 1,
        chat_page_size: 10,
        chat_page_total: 0,
        chatList: [],
        liveRoomEdit: {
          isShow: false,
          name: '',
          description: '',
          time: '', // 开播时间
          id: '',
          rules: {
            name: [{ required: true, message: '请输入直播间名称', trigger: 'blur'}],
            description: [{ required: true, message: '请输入直播间简介', trigger: 'blur'}],
            time: [{ required: true, message: '请选择直播时间', trigger: 'blur'}]
          }
        },
        // 改阿里视频上传
        uploadProgress: 0, // 上传进度
        statusText: '', // 上传状态
        status: '',
        isUploading: false, // 是否上传中
        fileTitle: '',
        fileSize: '',
        // 上传权限参数
        uploadAuth: '',
        uploadAddress: '',
        videoId: '',
        getInfoFlag: null, // 查询上传信息返回
        cancelWaitFlag: null
      }
    },
    methods: {
      chatPageNumChange (val) {
        this.chat_page_num = val;
        this.getChatList();
      },
      articlePageNumChange1(val) {
        this.article_page_num_1 = val;
        this.getPendingList();
      },
      articlePageNumChange2(val) {
        this.article_page_num_2 = val;
        this.getApprovedList();
      },
      handleClick (tab, event) {
        if (this.tab_index == 0) {
          this.article_page_num_1 = 1;
          this.article_search_form_1.keyword = '';
          this.getPendingList();
        } else if (this.tab_index == 1) {
          this.article_page_num_2 = 1;
          this.article_search_form_2.keyword = '';
          this.getApprovedList();
        } else if (this.tab_index == '4' || this.tab_index == '5' || this.tab_index == '6') {
          this.chat_page_num = 1;
          this.getChatList();
        }
      },
      getPendingList () { // 待审核
        this.loading = true;
        this.article_list_1 = [];
        this.$jqAjax({
          url: apiHost +'/live/pendingList',
          type: 'POST',
          data: {
            applyStartTime: this.article_search_form_1.applyTime&&this.article_search_form_1.applyTime[0]?this.article_search_form_1.applyTime[0]:'',
            applyEndTime: this.article_search_form_1.applyTime&&this.article_search_form_1.applyTime[1]?this.article_search_form_1.applyTime[1]:'',
            liveStartTime: this.article_search_form_1.broadcastTime&&this.article_search_form_1.broadcastTime[0]?this.article_search_form_1.broadcastTime[0]:'',
            liveEndTime: this.article_search_form_1.broadcastTime&&this.article_search_form_1.broadcastTime[1]?this.article_search_form_1.broadcastTime[1]:'',
            keyword: this.article_search_form_1.keyword||'',
            pageNum: this.article_page_num_1,
            pageSize: this.article_page_size_1
          },
          success: (res) => {
            this.loading = false;
            let data = res.data;
            if (res.code == 0) {
              this.article_list_1 = data.pageResult;
              this.article_page_totle_1  = data.totalCount;
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({type: 'error', message: `请求失败`, showClose: true});
          }
        })
      },
      getApprovedList () {
        this.article_page_totle_2 = [];
        this.loading = true;
        this.$jqAjax({
          url: apiHost + '/live/approvedList',
          type: 'POST',
          data: {
            auditStartTime: this.article_search_form_2.checkTime&&this.article_search_form_2.checkTime[0]?this.article_search_form_2.checkTime[0]:'',
            auditEndTime: this.article_search_form_2.checkTime&&this.article_search_form_2.checkTime[1]?this.article_search_form_2.checkTime[1]:'',
            liveStartTime: this.article_search_form_2.broadcastTime&&this.article_search_form_2.broadcastTime[0]?this.article_search_form_2.broadcastTime[0]:'',
            liveEndTime: this.article_search_form_2.broadcastTime&&this.article_search_form_2.broadcastTime[1]?this.article_search_form_2.broadcastTime[1]:'',
            keyword: this.article_search_form_2.keyword || '',
            status: this.article_search_form_2.status,
            pageNum: this.article_page_num_2,
            pageSize: this.article_page_size_2
          },
          success: (res) => {
            this.loading = false;
            let data = res.data;
            if (res.code == 0) {
              this.article_list_2 = data.pageResult;
              this.article_page_totle_2  = data.totalCount;
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({type: 'error', message: `请求失败`, showClose: true});
          }
        })
      },
      queryList () {
        if (this.tab_index == 0) {
          this.article_page_num_1 = 1;
          this.getPendingList();
        } else {
          this.article_page_num_2 = 1;
          this.getApprovedList();
        }
      },
      approveFun (id) {
        this.$confirm('确定通过审核？','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'waring'
        }).then(() => {
          this.loading = true;
          this.$jqAjax({
            url: apiHost + '/live/status_update',
            type: 'POST',
            data: {
              id: id,
              status: 1
            },
            success: (res) => {
              this.loading = false;
              if (res.code == 0) {
                this.$message({ type: 'success', message: '审核成功', showClose: true });
                this.getPendingList(); // 刷新
              } else {
                this.$message({ type: 'error', message: '操作失败', showClose: true});
              }
            },
            error: (err) => {
              this.loading = false;
              this.$message({ type: 'error', message: '请求失败', showClose: true});
            }
          });
        });
      },
      refuseFun (id) {
        let h = this.$createElement;
        this.$msgbox({
          title: '打回确认',
          message: h('div', {style: 'padding:10px 20px;'},[
            h('p', null, '是否确认将该直播间申请打回？'),
            h('div',{style:"line-height:16px;margin-top:10px;"}, [
              h('span', {style:"vertical-align:top;"}, '打回原因：'),
              h('textarea', {ref:'myReason', key: `${new Date().getTime()}`,attrs:{placeholder:'（必填）'},style:"width:260px;height:60px;text-indent:2px;"}, '')
            ])
          ]),
          showCancelButton: true,
          showConfirmButton: true,
          closeOnClickModal: false,
          // distinguishCancelAndClose: true, // 区分关闭和取消按钮
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              let text = this.$refs.myReason.value;
              if (!text) {
                this.$message({ type: 'error', message: '请填写禁播原因', showClose: true});
                return;
              }
              this.loading = true;
              this.$jqAjax({
                url: apiHost + '/live/status_update',
                type: 'POST',
                data: {
                  id: id,
                  status: 2,
                  auditDesc: text
                },
                success: (res) => {
                  this.loading = false;
                  if (res.code == 0) {
                    this.$message({ type: 'success', message: '已打回', showClose: true });
                    this.getPendingList(); // 刷新
                  } else {
                    this.$message({ type: 'error', message: '操作失败', showClose: true});
                  }
                },
                error: (err) => {
                  this.loading = false;
                  this.$message({ type: 'error', message: '请求失败', showClose: true});
                }
              });
            }
            done();
          }
        });
      },
      forbidBroadcast (id) { // 禁播
        this.$prompt('是否确认禁播该直播间？','确认禁播',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '禁播原因（必填）',
          inputErrorMessage: '请输入禁播原因',
          closeOnClickModal: false,
          // inputPattern: /(^s*)|(s*$)/g,
          inputValidator: (e) => {
            if (e) {
              return true;
            } else {
              return false;
            }
          }
        }).then(({ value }) => {
          if (value) {
            this.loading = true;
            this.$jqAjax({
              url: apiHost + '/live/allow_show',
              type: 'POST',
              data: {
                id: id,
                forbidDesc: value
              },
              success: (res) => {
                this.loading = false;
                if (res.code == 0) {
                  this.getApprovedList(); // 刷新
                  this.$message({type: 'success', message: `禁播成功！`, showClose: true});
                } else {
                  this.$message({type: 'error', message: `操作失败`, showClose: true});
                }
              },
              error: (err) => {
                this.loading = false;
                this.$message({type: 'error', message: `操作失败`, showClose: true});
              }
            });
          }
        });
      },
      viewReason (row, type) { // type:0禁播原因，1：打回原因
        const h = this.$createElement;
        this.$msgbox({
          title: `${type==0?'禁播':'打回'}原因`,
          message: h('div', {}, `${row.auditDesc}`),
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: '关闭',
          closeOnClickModal: false,
          beforeClose: (action, instance, done) => {
            done();
          }
        });
      },
      editLiveItem (id) { // 编辑
        const h = this.$createElement;
        this.$msgbox({
          title: '修改',
          message: h('div', {style:'padding:0 20px;'}, [
            h('p', {style:"height:30px;line-height:30px;"}, [h('span', null, '订阅基数：'),h('input', {attrs:{type:'text'},ref:'subscribeBase',key: `${new Date().getTime()}`,style:"width:100px;height:20px;line-height:20px;"},'')]),
            h('p', {style:"height:30px;line-height:30px;"}, [h('span', null, '观看基数：'),h('input', {attrs:{type:'text'},ref:'viewBase',key: `${new Date().getTime()}`,style:"width:100px;height:20px;"},'')])
          ]),
          showConfirmButton: true,
          showCancelButton: true,
          closeOnClickModal: false,
          beforeClose: (action, instance, done) => {
            let subNum = Number(this.$refs.subscribeBase.value);
            let viewNum = Number(this.$refs.viewBase.value);

            if (action === 'confirm') {
              if (!subNum || !viewNum) {
                this.$message({type: 'error', message: '填写基数必须大于零', showClose: true});
                return;
              }
              this.loading = true;
              this.$jqAjax({
                url: apiHost + '/live/updateBaseCount',
                type: 'POST',
                data: {
                  baseFollow : subNum, // 订阅基数
                  baseOnline: viewNum, // 观看基数
                  id: id
                },
                success: (res) => {
                  this.loading = false;
                  if (res.code == 0) {
                    this.$message({ type: 'success', message: '操作成功', showClose: true});
                  } else {
                    this.$message({ type: 'error', message: '操作失败', showClose: true});
                  }
                },
                error: (err) => {
                  this.loading = false;
                  this.$message({ type: 'error', message: '操作失败', showClose: true});
                }
              });
            }
            done();
          }
        })
      },
      viewLiveStream (id) { // 查看直播间
        this.isShowLiveRoom = true;
        this.storeTabIndex = this.tab_index;
        this.tab_index = '2';
        this.curViewRoomId = id;
        this.getBroadCastList();
      },
      viewChat (id) {
        this.isShowChatRoom = true;
        this.storeTabIndex = this.tab_index;
        this.curViewChatId = id;
        this.tab_index = '4';
        this.getChatList();
      },
      getStreamAddress (row, type) {
        this.$jqAjax({
          url: apiHost + `/live/${type == 0?'getPullUrl' : 'getPushUrl'}`,
          type: 'POST',
          data: {
            liveId: row.id
          },
          success: (res) => {
            if (res.code == 0 && res.data) {
              this.$copyText(`${res.data}`).then(() => {
                this.$message({type: 'success', message: '复制成功', showClose: true});
              }, (e) => {
                this.$message({type: 'warning', message: '复制失败', showClose: true});
              });
            } else {
              this.$message({type: 'error', message: '请求失败', showClose: true});
            }
          },
          error: (err) => {
            this.$message({type: 'error', message: '请求失败', showClose: true});
          }
        });
      },
      getChatList () {
        this.loading = true;
        this.chatList = [];
        this.$ajax({
          url: '/live/chat/list',
          type: 'POST',
          data: {
            lid: this.curViewChatId,
            pageNum: this.chat_page_num,
            pageSize: this.chat_page_size,
            status: this.tab_index == 4?0:this.tab_index==5?1:-1
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              console.log('resss', res)
              console.log('resss list', res.data.list)
              this.chatList = res.data.list;
              this.chat_page_total = res.data.total;
            }
          },
          error: (err) => {
            this.loading = false;
          }
        });
      },
      uploadPicChange (e) {
        let file = e.target.files[0];
        this.isSendPic = true;
        if(!file) return;
        this.uploadFun(file, 0);
      },
      uploadVideoChange (e) {
        let file = e.target.files[0]
        this.isSendPic = false;
        if (!file) return;
        let title = file.name;
        this.fileTitle = title.slice(0, title.indexOf('.'));
        this.fileSize = parseFloat(file.size / 1024 /1024).toFixed(2) + 'M';
        let userData = '{"Vod":{}}';
        if (this.uploader) {
          this.uploader.stopUpload();
          this.uploadProgress = 0;
          this.statusText = '';
        }
        this.uploader = this.createUploader();
        this.uploader.addFile(file, null, null, null, userData);
        // 直接触发上传
        this.isUploading = true;
        this.uploader.startUpload(); // 上传
        let obj = document.querySelectorAll('#video');
        obj[0].value = '' // 清空上传的选择
      },
      successUploadVideo (res, file) {
        this.isSendPic = false;
        this.videoList.push({
          url: res.data.url,
          cover: res.data.cover ? res.data.cover[0] : res.data.url + '?x-oss-process=video/snapshot,t_5000'
        });
      },
      uploadFun (file, type) {
        this.loading = true;
        let formData = new FormData();
        formData.append('file', file);
        let request = new XMLHttpRequest();
        request.open("POST", this.uploadUrl);
        request.send(formData);
        request.onreadystatechange = () => {
          if (request.readyState == 4) {
            this.loading = false;
            if (request.status == 200) {
              let res = JSON.parse(request.response);
              if (res.code == "0" && res.data && res.data.url) {
                let url = res.data.url;
                if (type == 0) {
                  this.picList.push(url);
                  this.videoList = [];
                  document.getElementById('video').value = '';
                } else {
                  this.videoList.push(url);
                  this.picList = []; // 清空picList
                }
              } else {
                this.$message({ showClose: true, message: '上传失败,请重试', type: 'error'});
              }
            } else {
              this.$message({ showClose: true, message: '上传失败,请重试', type: 'error'});
            }
          }
        };
      },
      sendMsg () {
        if (this.videoList.length == 0 && this.picList.length == 0 && !this.sendContent) {
          this.$message({type: 'warning', message: '请输入图文', showClose: true});
          return;
        }
        let strPath = '';
        if (this.picList.length > 0) {
          strPath = this.picList.join(',');
        } else {
          if (this.videoList.length > 0) {
            strPath = this.videoList[0].url?this.videoList[0].url:this.videoList[0]?this.videoList[0]:'';
          }
        }
        this.$jqAjax({
          url: apiHost + '/live/broadcast/add',
          type: 'POST',
          data: {
            lid: this.curViewRoomId,
            content: this.sendContent,
            annex: strPath
          },
          success: (res) => {
            if (res.code == 0) {
              this.picList = [];
              this.videoList = [];
              document.getElementById('video').value = '';
              this.sendContent = '';
              this.getBroadCastList();
            }
          },
          error: (err) => {
            this.$message({type: 'error', message: err.msg, showClose: true});
          }
        });
      },
      getBroadCastList () {
        this.loading = true;
        this.msgList = [];
        this.$jqAjax({
          url: apiHost + '/live/broadcast/list',
          type: 'POST',
          data: {
            lid: this.curViewRoomId
          },
          success: (res) => {
            this.loading = false;
            if (res.code == 0) {
              console.log('图文直播数据', res);
              this.msgList = res.data;
            }
          },
          error: (err) => {
            this.loading = false;

          }
        });
      },
      goBack () {
        this.isShowLiveRoom = false;
        this.isShowChatRoom = false;
        this.tab_index = this.storeTabIndex;
        this.handleClick();
      },
      removePic (index) {
        this.picList.splice(index, 1);
      },
      removeVideo (index) {
        this.videoList.splice(index, 1);
        document.getElementById('video').value = '';
      },
      approveFun1 (row, type) { // 聊天记录
        this.$confirm(`确定${type==0?'通过审核':type==1?'屏蔽':'取消屏蔽'}？`, `${type==0?'通过':type==1?'屏蔽':'取消屏蔽'}`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$jqAjax({
            url: apiHost + '/live/chat/changeStatus',
            type: 'POST',
            data: {
              id: row.id,
              status: type == 0 ? 1 : type == 1 ? -1:1
            },
            success: (res) => {
              this.loading = false;
              if (res.code == 0) {
                this.$message({type: 'success', message: `${type==0?'已通过':type==1?'已屏蔽':'已取消'}`});
                this.chat_page_num = 1; // 刷新
                this.getChatList();
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
      editLiveRoom (row) { // 修改直播间信息
        this.liveRoomEdit.id = row.id;
        this.liveRoomEdit.name = row.name;
        this.liveRoomEdit.description = row.description;
        this.liveRoomEdit.time = row.startTime;
        this.liveRoomEdit.isShow = true;
      },
      confirmEdit () {
        this.liveRoomEdit.time = new Date(this.liveRoomEdit.time).format('YYYY-MM-DD hh:mm:ss');
        this.$refs['liveRoomEdit'].validate(valid => {
          if (valid) {
            this.loading = true;
            this.$jqAjax({
              url: apiHost + '/live/update',
              type: 'POST',
              data: {
                id: this.liveRoomEdit.id,
                name: this.liveRoomEdit.name,
                description: this.liveRoomEdit.description,
                startTime: this.liveRoomEdit.time
              },
              success: (res) => {
                this.loading = false;
                if (res.code == 0) {
                  this.liveRoomEdit.isShow = false;
                  this.$message({type: 'success', message: '修改成功', showClose: true});
                  this.queryList();
                } else {
                  this.$message({type: 'error', message: '操作失败', showClose: true});
                }
              },
              error: (err) => {
                this.loading = false;
                this.$message({type: 'error', message: '操作失败', showClose: true});
              }
            });
           
          }
        })
        
      },
      closeEdit () {
        this.liveRoomEdit.isShow = false;
        this.$refs['liveRoomEdit'].resetFields();
      },
      createUploader () {
        let uploader = new AliyunUpload.Vod({
          timeout: 60000,
          partSize: 1048576, // 分片大小默认1M,不能小于100k
          parallel: 5, // 并行上传分片个数，默认5
          retryCount: 3, // 网络原因失败时，重新上传次数，默认为3
          retryDuration: 2, //网络原因失败时，重新上传间隔时间，默认为2秒
          // region: '',
          // userId: '', // 阿里云账号id
          addFileSuccess: (uploadInfo) => { // 添加文件成功
            this.statusText = '添加成功，等待上传...'
            this.getAuthAddress(uploadInfo);  
            console.log('添加成功')
          },
          onUploadStarted: (uploadInfo) => { // 开始上传
            console.log('开始上传')
            this.$message({type: 'success', message: '开始上传', showClose: true});
            this.getAuthAddress(uploadInfo);  
          },
          onUploadSucceed: (uploadInfo) => { // 上传成功
            this.$message({type: 'success', message: '上传已完成，获取视频数据中，请稍后..',showClose:true});
            // this.loading = true;
            this.getInfoFlag = setInterval(() => {
              this.getPlayInfo();
            }, 2000);
            // this.cancelWaitFlag = setTimeout(() => { // 10s后仍未请求到上传信息，则不再请求
            //   this.isUploading = false;
            //   this.loading = false;
            //   this.$message({type: 'warning', message:'获取上传信息超时', showClose: true});
            //   clearInterval(this.getInfoFlag)
            // }, 30000);
          },
          onUploadFailed: (uploadInfo, code, message) => { // 上传失败
            this.statusText = '上传失败！';
            this.$message({type: 'error', message: '上传失败', showClose: true});
            this.isUploading = false;
            this.status = 'exception';
          },
          onUploadCanceled: (uploadInfo, code, message) => { // 取消上传
            this.statusText = '文件已暂停上传！';
            this.isUploading = false;
          },
          onUploadProgress: (uploadInfo, totalSize, progress) => {
            let progressPercent = Math.ceil(progress * 100)
            console.log(`上传进度 ${progressPercent}%`);
            this.uploadProgress = Number(progressPercent);
            this.statusText = `上传中...${progressPercent}%`
            if (progress == 1) {
              this.status = 'success';
            }
          },
          onUploadTokenExpired: (uploadInfo) => {
            this.$message({type: 'warning', message: '上传超时，请重新上传', showClose: true});
            this.isUploading = false;
            this.status = 'warning';
          }
        })
        return uploader;
      },
      getAuthAddress (uploadInfo) { // 获取阿里云凭证及地址
        this.$ajax({
          url:'/common/getUploadToken',
          type: 'POST',
          data: {
            fileName: uploadInfo.file.name,
            title: this.fileTitle
          },
          success: (res) => {
            if (res.code == 0) {
              this.uploadAuth = res.data.UploadAuth;
              this.uploadAddress = res.data.UploadAddress;
              this.videoId = res.data.videoId;
              this.uploader.setUploadAuthAndAddress(uploadInfo, this.uploadAuth, this.uploadAddress);
            } else {
              this.$message({type: 'error', message: res.msg, showClose: true});
              this.isUploading = false;
            }
          },
          error: (err) => {
            this.$message({type: 'error', message: '请求失败', showClose: true});
            this.isUploading = false;
          }
        });
      },
      getPlayInfo () { // 从服务器获取上传音视频路径和信息
        this.$ajax({
          url: '/common/getPlayUrl',
          type: 'POST',
          data: {
            videoId: this.videoId,
            formats: 'mp4' // 默认
          },
          success: (res) => {
            if (res.code == 0) {
              if (res.data && res.data.playUrl) {
                clearInterval(this.getInfoFlag)
                // clearTimeout(this.cancelWaitFlag);
                this.loading = false;
                this.$message({type: 'success', message: '获取视频信息成功', showClose: true});
                console.log('上传的res.data', res.data)
                // this.$message().closeAll();
                this.videoList.push({
                  url: res.data.playUrl,
                  cover: res.data.cover
                });
                this.picList = []; // 清空picList
                this.isUploading = false;
              }
            } else {
              clearInterval(this.getInfoFlag)
            }
          },
          error: (err) => {
            this.$message({type: 'error', message: '获取上传信息失败', showClose: true});
            this.isUploading = false;
            this.loading = false;
            clearInterval(this.getInfoFlag)
          }
        });
      }
    },
    created () {
      this.getPendingList();
    }
  }
</script>

<style lang="scss" scoped>
#collecting {
  position: relative;
}
.content *{
  box-sizing: border-box;
}
.content{
  .input-area {
    padding: 0 20px;
    h3{
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      font-weight: normal;
      color: #333;
      position: relative;
      .back-btn{
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    #input {
      width: 100%;
      height: 100px;
      resize: none;
      background-color: #F4F4F4;
      border: 1px solid #E5E5E5;
      padding: 0 4px;
    }
    .upload-wrap {
      min-height: 50px;
      .upload-menu{
        height: 50px;
        line-height: 50px;
        position: relative;
        .icon{
          height: 20px;
          width: 20px;
          display: inline-block;
          margin-right: 20px;
          position: absolute;
          top: 15px;
          .upload-btn{
            width: 100%;
            height: 100%;
            opacity: 0;
            position: absolute;
            left: 0;
            top: 0;
          }
        }
        .icon_video{
          left: 40px;
          background-image: url('../../../images/insert_video.png');
        }
        .icon_img{
          left: 0;
          background-image: url('../../../images/insert_pic.png');
          
        }
        .tips{
          color: #999;
          font-size: 12px;
          padding-left: 100px;
        }
        .send-btn{
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .pic-wrap {
        padding: 0px 0 20px 0;
        .pic-item {
          height: 60px;
          width: 60px;
          display: inline-block;
          border: 1px solid #ddd;
          position: relative;
          margin-right: 20px;
          img {
            width: 100%;
            height: 100%;
          }
          .del-icon{
            width: 20px;
            height: 20px;
            position: absolute;
            right: -10px;
            top: -10px;
            background-image: url('../../../images/delete_icon.png');
            background-size: 20px 20px;
            display: none;
            cursor: pointer;
          }
          &:hover {
            .del-icon {
              display: inline-block;
            }
          }
        }
        .add-icon {
          background-color: #f8f8f8;
          background-image: url('../../../images/add_icon.png');
          background-size: 26px 26px;
          background-position: center center;
          background-repeat: no-repeat;
          cursor: pointer;
          input {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
            
          }
        }

      }
      .video-wrap{
        .video-item {
          height: 60px;
          width: 60px;
          display: inline-block;
          border: 1px solid #ddd;
          position: relative;
          margin-right: 20px;
          .del-icon{
            width: 20px;
            height: 20px;
            position: absolute;
            right: -10px;
            top: -10px;
            background-image: url('../../../images/delete_icon.png');
            background-size: 20px 20px;
            display: none;
            cursor: pointer;
          }
          &:hover {
            .del-icon {
              display: inline-block;
            }
          }
          video {
            width: 100%;
            height: 100%;
          }
          .play-icon{
            width: 40px;
            height: 32px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
  }
  .content-area{
    background-color: #f5f5f5;
    padding-top: 10px;
    .content-list-wrap{
      background-color: #fff;
      padding: 0 20px;
      h3{
        height: 50px;
        line-height: 50px;
        font-size: 12px;
        font-weight: normal;
        color: #333;
      }
      .msg-item{
        position: relative;
        .nickName {
          height: 18px;
          line-height: 18px;
          color: #999;
          font-size: 12px;
          padding: 0 16px;
          position: relative;
          .circle {
            width: 7px;
            height: 7px;
            display: inline-block;
            border: 1px solid #F55E55;
            border-radius: 50%;
            position: absolute;
            left: -2px;
            top: 50%;
            transform: translateY(-50%);
          }
          .delete {
            color:#F55E55;
            float: right;
            cursor: pointer;
          }
        }
        
        .detail {
          font-size: 14px;
          color: #333;
          line-height: 20px;
          margin: 8px 0;
          padding: 8px 16px;
          border-left: 1px solid #e5e5e5;
          .context {
            margin-bottom: 10px;
          }
          .pic-item{
            height: 180px;
            margin-bottom: 10px;
            img {
              height: 100%;
            }
          }
        }
      }
    }
  }
}
.go-back {
  z-index: 1000;
  position: absolute;
  right: 6px;
  top: 10px;
}
</style>
