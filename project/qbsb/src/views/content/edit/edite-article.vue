<template>
  <div id="create-create" v-loading.lock="loading">
    <div class="contents-top clearfix">
      <div class="write-box tab scroll" id="write-box">
        <p class="sensitive-word" v-if="sensitiveSet.length>0">文章中包含敏感词：{{sensitiveSet.join(',')}}</p>
        <el-tabs v-model="active_index">
          <el-tab-pane label="文章" name="1">
            <div class="write-title" id="write-title" style="display: none;">
              <input v-model="articleForm.title" maxlength="300" type="text" placeholder="请在这里输入标题（1～300个字）"/><span>{{articleForm.title.length}}/300</span>
            </div>
            <div class="editor" id="editor" style="height:500px;"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="publish-box scroll">
        <div class="publish-article" >
          <h3 class="title">发布设置</h3>
          <div class="item">
            <h3>频道</h3>
            <div>
              <a href="javascript:;" class="btn" v-for="item in parentChannelList" :key="item.id" :class="{'active':articleForm.channelPid == item.id}" @click="getChildrenChannelList(item.id)">{{item.name}}</a>
            </div>
          </div>
          <div class="item" v-if="childrenChannelList.length>0">
            <h3>子频道</h3>
            <div>
              <a href="javascript:;" class="btn" v-for="item in childrenChannelList" :key="item.id" :class="{'active':articleForm.channelId == item.id}" @click="articleForm.channelId = item.id">{{item.name}}</a>
            </div>
          </div>
          <div class="item assort-wrap">
            分类
            <div class="show-class" v-if="!editClassify">
              <span class="classify" @click="changeClassifyEdit">{{articleForm.classify?articleForm.classify:'无'}}</span><span class="tip" v-if="!editClassify">（点击修改或添加分类）</span>
            </div>
            <div class="classify-input" @keyup.enter="changeClassifyEdit" v-else>
              <input type="text" v-model="tempClassify" v-if="editClassify">
              <i class="editOk el-icon-check" @click="changeClassifyEdit"></i>
            </div> 
          </div>
          <div class="item label-wrap">
            <p>标签</p>
            <ul class="label-list clearfix">
              <li v-for="(item, index) in labelList" :key="index" @click="viewLabelSearch">{{item}}<i @click.stop="deleteLabel(index)" class=" delIcon el-icon-circle-close"></i></li>
            </ul>
            <div class="input-wrap" v-if="!(labelList.length==15)" @keyup.enter="addLabel">
              <input type="text" v-model="newLabel" class="add-label"><i class="addIcon el-icon-circle-plus-outline" @click="addLabel"></i>
            </div>
          </div>
          <!-- <div class="item">
            <h3>展示设置 (可选)</h3>
            <div class="row">
              <el-checkbox v-model="isStick">设为置顶</el-checkbox>
              <span v-show="isStick">置顶时长:</span>
              <el-select v-model="articleForm.stickTime" v-show="isStick">
                <el-option label="不限" :value="0"></el-option>
                <el-option label="5小时" :value="5"></el-option>
                <el-option label="10小时" :value="10"></el-option>
                <el-option label="1天" :value="24"></el-option>
                <el-option label="2天" :value="48"></el-option>
                <el-option label="3天" :value="72"></el-option>
              </el-select>
            </div>
            <div class="row">
              <el-checkbox v-model="isTopic" :disabled="topicList.length==0">选入专题</el-checkbox>
              <span v-show="isTopic && topicList.length>0">专题名称:</span>
              <el-select v-model="articleForm.topicId" v-show="isTopic && topicList.length>0">
                <el-option v-for="item in topicList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div>
            <div class="row">
              <el-checkbox v-model="isCarousel">选入轮播</el-checkbox>
            </div>
          </div> -->
          <div class="item">
            <el-radio v-model="articleForm.coverType" label="0">普通封面</el-radio>
            <el-radio v-model="articleForm.coverType" label="1">大图封面</el-radio>
          </div>
          <div class="item">
            <p class="tip">
              <el-button size="small" type="primary" @click="clickUseContentImage()">使用</el-button>
              <span>(可使用详情页图片作为封面)</span>
            </p>
            <!-- 大图封面 -->
            <img-upload v-if="articleForm.coverType==1" :size="[240,150]" :imgSrcName="'articleCoverBig'" :imgSrc="articleCoverBig" :uploadUrl="uploadUrl" @delImgSrc="articleCoverBig=''" @changeImgSrc="changeImgSrc"></img-upload>
            <!-- 普通封面 -->
            <img-upload v-if="articleForm.coverType!=1" :size="[112,90]" :imgSrcName="'articleCover1'" :imgSrc="articleCover1" :uploadUrl="uploadUrl" @delImgSrc="articleCover1=''" @changeImgSrc="changeImgSrc"></img-upload>
            <img-upload v-if="articleForm.coverType!=1" :size="[112,90]" :imgSrcName="'articleCover2'" :imgSrc="articleCover2" :uploadUrl="uploadUrl" @delImgSrc="articleCover2=''" @changeImgSrc="changeImgSrc"></img-upload>
            <img-upload v-if="articleForm.coverType!=1" :size="[112,90]" :imgSrcName="'articleCover3'" :imgSrc="articleCover3" :uploadUrl="uploadUrl" @delImgSrc="articleCover3=''" @changeImgSrc="changeImgSrc"></img-upload>
          </div>
          <div class="item">
            <h3>署名（选填）</h3>
            <div class="sm_input_area" @keyup.enter="inputPosStaff" >
              <el-select class="pos_list" v-model="selectPosition1" placeholder="请选择岗位" style="width:120px;">
                <el-option v-for="item in position_list" :key="item.id" :label="item.name" :value="item.id">
                </el-option> 
              </el-select>
              <el-input class="sm_input" :disabled="!selectPosition1" v-model="inputStaffName1" placeholder="请输入姓名并以空格隔开"></el-input>
              <i @click="inputPosStaff" class="addIcon el-icon-circle-plus-outline"></i>
            </div>
            <ul class="rolesList" v-if="storeArticleRole.length>0">
              <li v-for="(item,index) in storeArticleRole" :key="index">
                <i class="viewIcon" :class="{'closeView':!item.isShow}" @click="toggleView(index)"></i>
                {{item.posName}}：
                <span v-if="!item.isEdit">{{item.staffName}}</span>
                <input class="editInput" v-if="item.isEdit" type="text" v-model="item.staffName">
                <i v-if="item.isEdit" class="editOk el-icon-check" @click.stop="editRole(index)"></i>
                <i v-if="!item.isEdit" class="editIcon el-icon-edit-outline" @click.stop="editRole(index)"></i>
                <i class="delIcon el-icon-circle-close" @click.stop="deleteRole(index)"></i>
              </li>
            </ul>
          </div>
          <div class="item">
            <h3>来源（选填）</h3>
            <div class="input">
              <input v-model="articleForm.source" maxlength="100" type="text"/>
              <span>{{articleForm.source.length}}/100</span>
            </div>
          </div>
          <div class="item">
            <h3>其他设置</h3>
            <el-checkbox v-model="isComment">允许评论</el-checkbox>
          </div>
        </div>
      </div>
    </div>
    <div class="contents-bottom">
      <div class="btns">
        <p class="word-num">文章字数：{{articleWordsNum}} 个字</p>
        <a href="javascript:;" class="btn active" @click="clickSaveArticleDraft()" v-if="vfrom == '2'">保存并送审</a>
        <a href="javascript:;" class="btn active" @click="clickSaveArticleDraft()" v-if="vfrom == '3'">保存并发布</a>
        <a href="javascript:;" class="btn active" @click="clickSaveArticleDraft()" v-if="vfrom == '4'">保存并恢复上架</a>
        <a href="javascript:;" class="btn" @click="clickGoBack()">取消修改</a>
        <a href="javascript:;" class="btn" @click="openPreviewArticle($event)">预览</a>
      </div>
    </div>
    <!-- 插入图片弹窗 -->
    <el-dialog v-loading.lock="loading" class="insert-image-model" title="插入图片" :visible.sync="insertImageModelShow" width="820px" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-tabs v-model="insertImgTabIdx">
        <el-tab-pane label="手动上传">
          <div class="upload-box" v-if="localUploadImgArr.length==0">
            <el-upload class="avatar-uploader" :action="uploadUrl" :on-success="insertImageSuccessUpload" :before-upload="beforeUpload" accept="image/*" multiple :show-file-list="false">
              <div class="avatar" v-if="insertUploadImageUrl" :style="{backgroundImage:'url('+insertUploadImageUrl+')'}"></div>
              <i v-if="!insertUploadImageUrl" class="el-icon-plus avatar-uploader-icon"></i>
              <i v-if="insertUploadImageUrl" class="el-icon-circle-close close" @click.stop="insertUploadImageUrl=''"></i>
            </el-upload>
            <h3>点击上传图片</h3>
            <p>支持jpg、jpeg、png、gif格式，单张图片大小不超过5M</p>
          </div>
          <div class="upload-manul" v-else>
            <draggable class="img-list-wrap scroll" v-model="localUploadImgArr" handle=".img-item">
              <div class="img-item" v-for="(item, index) in localUploadImgArr" :key="index">
                <div class="avatar" :style="{backgroundImage: 'url('+item+')'}"></div>
                <i class="el-icon-circle-close close" @click="delLocalUploadImg(index)"></i>
              </div>
              <div class="uploadBtn-sm" >
                <el-upload class="avatar-uploader" :action="uploadUrl" :on-success="insertImageSuccessUpload" :before-upload="beforeUpload" accept="image/*" multiple :show-file-list="false">
                <i class="el-icon-plus avatar-uploader-icon"></i></el-upload>
              </div>
            </draggable>
            <p style="margin-top:20px;">注：拖拽图片可调整插入顺序</p> 
          </div>
          <div class="btns">
            <el-button type="primary" @click="editorInsertLocalImage">插入</el-button>
            <el-button @click="insertImageModelShow = false">取消</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 插入视频 -->
    <el-dialog v-loading.lock="loading" class="insert-image-model" title="插入视频" :visible.sync="insertVideoModelShow" width="820px" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-tabs v-if="insertVideoModelShow">
        <el-tab-pane label="视频链接" v-if="active_index == '1'">
          <div class="video-url">
            <span>视频URL</span>
            <el-input v-model="insertUploadVideoUrl" style="width: 480px;"></el-input>
            <el-button type="primary" onclick="document.getElementById('insert-video-view').play();">预览</el-button>
          </div>
          <div class="video-box">
            <video id="insert-video-view" :src="insertUploadVideoUrl" controls=""></video>
          </div>
          <div class="btns">
            <el-button type="primary" @click="editorInsertVideo(insertUploadVideoUrl)">插入</el-button>
            <el-button @click="insertVideoModelShow = false">取消</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="本地上传" v-if="active_index == '1'">
          <div v-if="!insertLocalUploadVideoUrl" class="video-upload-local">
            <h2>+ 添加视频</h2>
            <div class="add">
              <el-upload class="upload" ref="videoUploadRef1" :disabled="videoUploadLoading" :action="uploadUrl" :on-success="successUploadVideoLocal" :before-upload="beforeUploadVideo" accept="video/*" :show-file-list="true">
                <a href="javascript:;" class="btn3">本地上传</a>
              </el-upload>
            </div>
          </div>
          <!-- <ali-upload v-if="!insertLocalUploadVideoUrl" :addInLib="false" :acceptType="'video'" @fUploadSuccess="aliUploadVideoBack" style="height:370px;"></ali-upload>   -->
          <div class="video-box" style="min-height:370px;margin-top:10px;" v-if="insertLocalUploadVideoUrl">
            <video id="insert-video-view" :src="insertLocalUploadVideoUrl" controls=""></video>
            <el-button style="margin-top:20px;" size="small" type="primary" @click="clickResetCheckVideo1()">重新选择</el-button>
          </div>
          <div class="btns">
            <el-button type="primary" @click="editorInsertVideo(insertLocalUploadVideoUrl)">插入</el-button>
            <el-button @click="insertVideoModelShow = false">取消</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 插入音频 -->
    <el-dialog v-loading.lock="loading" class="insert-image-model" title="插入音频" :visible.sync="insertRadioModelShow" width="820px" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-tabs v-if="insertRadioModelShow">
        <el-tab-pane label="音频链接">
          <div class="upload-box">
            <div style="text-align: center;">
              <span>音频URL</span>
              <el-input v-model="insertUploadRadioUrl" style="width: 600px;"></el-input>
              <el-button type="primary" onclick="document.getElementById('insert-radio-view').play();">预览</el-button>
            </div>
            <div style="text-align: center;padding-top: 30px;">
              <audio id="insert-radio-view" controls :src="insertUploadRadioUrl">
                您的浏览器不支持 audio 标签。
              </audio>
            </div>
          </div>
          <div class="btns">
            <el-button type="primary" @click="editorInsertRadio(insertUploadRadioUrl)">插入</el-button>
            <el-button @click="insertRadioModelShow = false">取消</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="本地上传">
          <div class="audio-upload-box">
            <div class="audio-upload-local" v-if="!insertLocalUploadAudioUrl">
              <h2>+ 添加音频</h2>
              <div class="add">
                <el-upload class="upload" ref="audioUploadRef1" :disabled="audioUploadLoading" :action="uploadUrl" :on-success="successUploadAudioLocal" :before-upload="beforeUploadAudio" accept="audio/*" :show-file-list="true">
                  <a href="javascript:;" class="btn3">本地上传</a>
                </el-upload>
              </div>
            </div>
            <!-- <ali-upload v-if="!insertLocalUploadAudioUrl" style="height:258px;" :addInLib="false" :acceptType="'audio'" @fUploadSuccess="aliUploadAudioBack" ></ali-upload> -->
            <div class="audio-upload-local audio-uploaded" v-else>
              <div style="text-align: center;padding-top: 60px;">
                <audio id="insert-radio-view" controls :src="insertLocalUploadAudioUrl">您的浏览器不支持 audio 标签。</audio>
              </div>
              <div style="text-align: left;padding-top: 20px;">
                <el-button style="margin-top:20px;" size="small" type="primary" @click="clickResetCheckAudio1()">重新选择</el-button>
              </div>
            </div>
          </div>
          <div class="btns">
            <el-button type="primary" @click="editorInsertRadio(insertLocalUploadAudioUrl)">插入</el-button>
            <el-button @click="insertRadioModelShow = false">取消</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 挑选封面图 -->
    <el-dialog class="insert-image-model" title="使用图片" :visible.sync="useImgModelShow" width="820px" :close-on-click-modal="false" :close-on-press-escape="false">
      <ul class="useImgWrap scroll">
        <li v-for="(item, index) in articleImgColletArr" :key="index" @click="selectImgForCover(item)">
          <div class="img" :style="{backgroundImage:'url('+item.url+')'}"></div>
          <div class="select-cover" v-if="item.select">{{item.selectIdx}}</div>
        </li>
      </ul>
      <div class="btns">
        <el-button type="primary" @click="useImgFun">选用</el-button>
        <el-button @click="useImgModelShow = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 文章预览 -->
    <previewPop v-if="previewArticleForm" :articleForm="previewArticleForm" @closePreviewArticle="closePreviewArticle"></previewPop>
  </div>
</template>

<script>
  import previewPop from "./../../../components/previewPop.vue";
  import imgUpload from './../../../components/imgUpload.vue'
  import draggable from 'vuedraggable'
  import aliUpload from '../../../components/aliUpload'
  var Base64 = require('js-base64').Base64;
  export default {
    components: {
      previewPop,
      imgUpload,
      draggable,
      aliUpload
    },
    data() {
      return {
        uploadUrl:apiHost+'/common/upload',
        queryId:'',
        vfrom:'2',// 2:二审环节   3:三审环节  4:已下架
        active_index: '1',
        articleWordsNum:0,
        articleForm:{
          id:'',
          status:'3',
          type:'1',
          title:'',
          content :'',
          cover :'',
          channelPid :'',
          channelId :'',
          isStick:'0',
          stickTime:0,
          topicId :'0',
          isCarousel :'0',
          coverType :'0',
          contributorSign:'',
          source :'',
          isComment :'0',
          staffList: '',
          classify: '' // 分类
        },
        tempClassify: '',
        editClassify: false,
        articleCoverBig: '',
        articleCover1:'',
        articleCover2:'',
        articleCover3:'',
        parentChannelList:[],
        childrenChannelList:[],
        oldArticleForm:{},
        oldArticleCoverBig: '',
        oldArticleCover1:'',
        oldArticleCover2:'',
        oldArticleCover3:'',
        isStick:false,
        isTopic:false,
        topicList:[],
        isCarousel:false,
        isComment:true,
        previewArticleForm:'',
        insertImageModelShow: false,
        insertImageSearchForm:{
          type:'1',
          classify:'',
          title:'',
          desc: '',
          author:'',
          timeScope:[],
        },
        insertImageList:[],
        insertImagePageNum:1,
        insertImagePageSize:12,
        insertImageTotal:0,
        insertImageCheckedUrl:'',
        insertUploadImageUrl: '',
        insertVideoModelShow: false,
        insertVideoSearchForm:{
          type:'1',
          classify:'',
          title:'',
          desc: '',
          author:'',
          timeScope:[],
        },
        insertVideoList:[],
        insertVideoPageNum:1,
        insertVideoPageSize:12,
        insertVideoTotal:0,
        insertVideoCheckedUrl:'',
        insertVideoCheckedCover:'',
        insertUploadVideoUrl: '',
        insertLocalUploadVideoUrl: '', // 本地插入视频
        insertLocalUploadAudioUrl: '', // 本地插入音频
        insertRadioModelShow: false,
        insertRadioSearchForm:{
          type:'1',
          classify:'',
          title:'',
          author:'',
          timeScope:[],
        },
        insertRadioList:[],
        insertRadioPageNum:1,
        insertRadioPageSize:12,
        insertRadioTotal:0,
        insertRadioCheckedUrl:'',
        insertUploadRadioUrl: '',
        loading: false,
        storeArticleRole: [],
        // 署名相关
        position_list: [], // 岗位列表
        selectPosition1: '', // 文章当前选择的岗位
        inputStaffName1: '', // 对应岗位输入的姓名
        // 插入图片
        insertImgTabIdx: '0',
        selectImageItem: null, // 选择插入图片
        localUploadImgArr: [], // 存储本地上传多张图片
        useImgModelShow: false, // 使用图片弹窗
        articleImgColletArr: [], // 正文图片
        articleImgSelectForUse: [], // 使用的图片
        // 本地上传音/视频
        videoUploadLoading:false,
        audioUploadLoading: false,
        publishStatus: '', // 上线状态，7发布，8下架
        labelList: [], // 标签列表
        newLabel: '', // 新增的标签
        sensitiveSet: [] // 敏感词列表
      }
    },
    watch:{
      isStick:function (val) {
        this.articleForm.isStick = val ? '1' : '0';
        if(val) this.isTopic = this.isCarousel =false;
      },
      isTopic:function (val) {
        if(val && this.topicList.length>0){
          this.articleForm.topicId = this.articleForm.topicId?this.articleForm.topicId:this.topicList[0].id;
        }else {
          this.articleForm.topicId = this.articleForm.topicId || '0';
        }
        if(val) this.isStick = this.isCarousel =false;
      },
      isCarousel:function (val) {
        this.articleForm.isCarousel = val ? '1' : '0';
        if(val) this.isTopic = this.isStick =false;
      },
      isComment:function (val) {
        this.articleForm.isComment = val ? '0' : '1';
      },
      'articleForm.channelPid':function (val) {
        this.getTopicList(this.articleForm.channelPid,this.articleForm.channelId)
      },
      'articleForm.channelId':function (val) {
        this.getTopicList(this.articleForm.channelPid,this.articleForm.channelId)
      },
    },
    created() {
      if (this.$route.query.vfrom && this.$route.query.vfrom != 'undefined') {
        this.vfrom = this.$route.query.vfrom;
        this.publishStatus = this.$route.query.status;
      }
      this.getParentChannelList();
      this.getPositionList();
    },
    mounted() {
      this.editorInt();
    },
    beforeRouteLeave (to, from, next) {
      var hasChange=false;
      for(var key in this.oldArticleForm){
        if(this.articleForm[key] != this.oldArticleForm[key]){
          hasChange=true;
        }
      }
      if (this.articleForm.coverType == 0) {
        if(this.articleCover1!=this.oldArticleCover1
          || this.articleCover2!=this.oldArticleCover2
          || this.articleCover3!=this.oldArticleCover3
        ){
          hasChange=true;
        }
      } else {
        if (!this.articleCoverBig != this.oldArticleCoverBig) {
          hasChange = true;
        }
      }
      if(hasChange){
        this.$confirm('是否退出此次编辑', '提示', {
          confirmButtonText: '退出',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          next();
        });
      }else {
        next();
      }
    },
    destroyed: function () {
      if (this.editor) this.editor.destroy();
    },
    methods:{
      addAuditPerson () { //内容发布修改过来，默认添加审核员
        let systemUser = JSON.parse(sessionStorage.getItem("sysuser"))
        this.storeArticleRole.push({
          posId: 21,
          posName: '审核员',
          staffName: systemUser.name,
          isShow: true,
          isEdit:false
        })
      },
      hashChange: function () {
        var self = this;
        if (self.$route.query.id && self.$route.query.id != 'undefined') {
          self.queryId = self.$route.query.id;
          self.articleForm.id=self.queryId;
          self.getArticleDraftDetail();
        }
      },
      //变量值备份，以用来在离开路由时提醒用户保存
      articleFormBackup(){
        var self=this;
        self.oldArticleForm=JSON.parse(JSON.stringify(self.articleForm));
        self.oldArticleCoverBig = self.articleCoverBig;
        self.oldArticleCover1=self.articleCover1;
        self.oldArticleCover2=self.articleCover2;
        self.oldArticleCover3=self.articleCover3;
      },
      //获取父级频道列表
      getParentChannelList:function () {
        var self=this;
        self.parentChannelList=[];
        self.$jqAjax({
          url:apiHost + '/user/getNewsChannel',
          success:function (data) {
            if(data.code === "0" && data.data){
              self.parentChannelList=data.data;
              self.parentChannelList.map((item, index) => {
                if (item.name == '专题') {
                  self.parentChannelList.splice(index, 1);
                }
              })
              if(self.parentChannelList.length>0) {
                self.getChildrenChannelList(self.parentChannelList[0].id);
              }
            }
          }
        })

      },
      //获取子频道数据
      getChildrenChannelList:function (id,channelId) {
        var self=this;
        self.articleForm.channelPid = id;
        self.childrenChannelList=[];
        self.articleForm.channelId = channelId || '';
        self.$jqAjax({
          url:apiHost + '/user/getNewsChannel',
          data:{
            pid:id
          },
          success:function (data) {
            if(data.code === "0" && data.data && data.data.length > 0){
              self.childrenChannelList=data.data;
              self.articleForm.channelId = channelId ? channelId : data.data[0].id
            }
          }
        })
      },
      //获取专题列表
      getTopicList:function (channelId,sonChannelId) {
        var self=this;
        self.$ajax({
          url:'/topic/list',
          data:{
            channelId:channelId,
            sonChannelId:sonChannelId,
            pageNum:1,
            pageSize:1000,
            status: '0'
          },
          success:function (data) {
            if(data.code === "0" && data.data && data.data.list){
              self.topicList=data.data.list;
              if(self.isTopic && self.topicList.length>0){
                self.articleForm.topicId = self.articleForm.topicId?self.articleForm.topicId : self.topicList[0].id;
              }else {
                self.isTopic=false;
              }
            }else {
              self.isTopic=false;
              self.topicList=[];
            }
          }
        })
      },
      //获取文章草稿内容
      getArticleDraftDetail: function () {
        var self = this;
        if (self.queryId) {
          self.loading = true;
          self.$jqAjax({
            url:self.vfrom == '4'? apiHost + "/context/published/detail" : apiHost + "/context/approve/detail",
            data: {
              id: self.queryId
            },
            success: function (data) {
              self.loading = false;
              if (data.code == 0 && data.data) {
                self.articleForm = data.data;
                if(self.articleForm.content) self.editor.setContent(self.articleForm.content);
                if (data.data.tags) {
                  self.labelList = data.data.tags.split(',')
                }
                if(self.articleForm.cover){
                  try {
                    var coverArr=JSON.parse(self.articleForm.cover);
                    if (self.articleForm.coverType == 0 ) {
                      if(coverArr[0]) self.articleCover1 = coverArr[0].url;
                      if(coverArr[1]) self.articleCover2 = coverArr[1].url;
                      if(coverArr[2]) self.articleCover3 = coverArr[2].url;
                    } else {
                      if(coverArr[0]) self.articleCoverBig = coverArr[0].url;
                    }
                    
                  }catch (e){}
                }
                self.getChildrenChannelList(self.articleForm.channelPid, self.articleForm.channelId);

                if(self.articleForm.isStick) self.isStick = self.articleForm.isStick == '1';
                if(self.articleForm.isCarousel) self.isCarousel = self.articleForm.isCarousel == '1';
                if(self.articleForm.isComment) self.isComment = self.articleForm.isComment != '1';
                if(self.articleForm.topicId && self.articleForm.topicId!='0') self.isTopic=true;
                self.getSignInfo();
                self.articleFormBackup();
              }
            }
          })
        }
      },
      getSignInfo () {
        this.$jqAjax({
          url: apiHost + '/staff/getContextStaffList',
          type: 'POST',
          data: {
            cid: this.articleForm.cid
          },
          success: (res) => {
            if (res.code == 0) {
              let list = res.data;
              let store = [];
              list.map((item, index) => {
                if (item.id && item.positionName && item.staffName) {
                  store.push({
                    posName: item.positionName,
                    staffName: item.staffName,
                    posId: item.pid,
                    isShow: item.isShow==0?true:false,
                    isEdit: false
                  });
                }
              });
              this.storeArticleRole = store;
              if (this.storeArticleRole.length == 0) {
                this.addAuditPerson();
              } else {
                let hasAddAuditPersion = store.some((item) => {
                  return item.posId == 21
                })
                if (!hasAddAuditPersion) {
                  this.addAuditPerson();
                } 
              }
            }
          },
          error: (err) => {
            console.log(err);
          }
        });
      },
      //写文章保存并送审
      clickSaveArticleDraft:function () {
        var self = this;
        if (!self.articleForm.title) {
          this.$message({type: 'warning', message: '请输入标题', showClose: true});
          return;
        }else if (self.articleForm.title.length < 1) {
          this.$message({type: 'warning', message: '标题至少输入1个字', showClose: true});
          return;
        }
        if (!self.editor.hasContents()) {
          this.$message({type: 'warning', message: '请输入文章内容', showClose: true});
          return;
        }
        if (this.articleForm.isCarousel == 1) {
          let coverArr = [];
          coverArr = this.dealCover();
          if (coverArr.length == 0) {
            this.$message({type: 'warning', message: '选入了轮播但未上传封面图片，请上传封面图', showClose: true});
            return;
          }
        }
        var pTitle='送审提醒';
        var pContent='是否已完成修改, 确定送审? 请输入备注：';
        if(self.vfrom == '3'){
          pTitle='发布提醒';
          pContent='是否已完成修改, 确定发布? 请输入备注：';
        }else if(self.vfrom == '4'){
          pTitle='上架提醒';
          pContent='是否已完成修改, 确定恢复上架? 请输入备注：';
        }

        self.$prompt( pContent,pTitle, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '选填',
          closeOnClickModal: false
        }).then(({ value }) => {
          self.saveArticleData(value);
        }).catch(() => {

        });
      },
      dealCover () { // 处理封面图
        let coverArr = [];
        if (this.articleForm.coverType == 0) {
          if(this.articleCover1) coverArr.push({url:this.articleCover1});
          if(this.articleCover2) coverArr.push({url:this.articleCover2});
          if(this.articleCover3) coverArr.push({url:this.articleCover3});
        } else {
          if(this.articleCoverBig) coverArr.push({url:this.articleCoverBig});
        }
        return coverArr;
      },
      //写文章保存数据
      saveArticleData:function (remark) {
        this.loading = true;
        this.sensitiveSet = [];
        this.$jqAjax({
          url: apiHost + '/sensitive/check',
          type: 'POST',
          data: {
            content: this.editor.getContentTxt()
          },
          success: (res) => {
            this.loading = false;
            if (res.code == '0') {
              if (res.data.hasSensitive=='1') {
                this.sensitiveSet = res.data.sensitiveSet;
                this.$confirm('文章中包含敏感词，是否仍要送审？', '发布提醒', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.saveRequest(status, remark)
                });
              } else {
                this.saveRequest(status, remark)
              }
            } else {
              this.$message({type: 'error', message: res.message, showClose: true});
            }
          },
          error: (err) => {
            this.loading = false;
            this.$message({type: 'error', message: err.msg, showClose: true});
          }
        });
      },
      saveRequest (remark) {
        var self=this;
        var sucMsg='文章已保存并送审成功!';
        var url='/context/approve/editor/update';
        if(self.vfrom == '3'){
          sucMsg='文章已保存并发布成功!';
          url='/context/approve/checker/update';
        }else if(self.vfrom == '4'){
          sucMsg='文章已保存并恢复上架成功!';
          if (self.publishStatus == '7') {
            url='/context/published/updateOnline';
          } else {
            url='/context/published/update'; // 下架了
          }
        }
        if (this.storeArticleRole && this.storeArticleRole.length > 0) {
          let arr = [];
          for (let item of this.storeArticleRole) {
            arr.push({
              posId: item.posId,
              staffName: item.staffName,
              isShow: item.isShow?0:1
            })
          }
          this.articleForm.model = JSON.stringify(arr);
        } else {
          this.articleForm.model = '';
        }
        self.loading=true;
        var coverArr = this.dealCover();
        if (coverArr.length > 0) {
          self.articleForm.cover = JSON.stringify(coverArr);
        } else {
          self.articleForm.cover = '';
        }
        self.articleForm.remark = remark;
        self.articleForm.status = self.vfrom == '2' ? '4' : '7';
        if (self.labelList.length > 0) {
          self.articleForm.tags = self.labelList.join(',')
        }
        self.$ajax({
          url:url,
          data: {
            author: self.articleForm.author,
            carouselType: self.articleForm.carouselType,
            channelId: self.articleForm.channelId,
            channelPid: self.articleForm.channelPid,
            cid: self.articleForm.cid,
            classify: self.articleForm.classify,
            content: Base64.encode(self.articleForm.content),
            contributorSign: self.articleForm.contributorSign,
            cover: self.articleForm.cover,
            coverType: self.articleForm.coverType,
            createId: self.articleForm.createId,
            desc: self.articleForm.desc,
            id: self.articleForm.id,
            image: self.articleForm.image,
            isCarousel: self.articleForm.isCarousel,
            isComment: self.articleForm.isComment,
            isRec: self.articleForm.isRec,
            isRecRelated: self.articleForm.isRecRelated,
            isRelatedAd: self.articleForm.isRelatedAd,
            isStick: self.articleForm.isStick,
            orgId: self.articleForm.orgId,
            source: self.articleForm.source,
            sourceType: self.articleForm.sourceType,
            status: self.articleForm.status,
            stickTime: self.articleForm.stickTime,
            tags: self.articleForm.tags,
            title: self.articleForm.title,
            topicId: self.articleForm.topicId,
            type: self.articleForm.type,
            updateId: self.articleForm.updateId,
            vTypeId: self.articleForm.vTypeId,
            version: self.articleForm.version,
            model: self.articleForm.model,
            remark: self.articleForm.remark
          },
          success:function (data) {
            self.loading=false;
            if(data.code === "0"){
              self.$message({
                showClose: true,
                message:  sucMsg,
                type: 'success'
              });
              self.articleFormBackup();

              setTimeout(function () {
                if(self.vfrom == '2'){
                  self.$router.push('/layout/edit-edit?index=1&type=1');
                }else if(self.vfrom == '3'){
                  self.$router.push('/layout/edit-publish?index=1&type=1');
                }else if(self.vfrom == '4'){
                  self.$router.push('/layout/published-normal?index=0&type=1');
                }else {
                  self.$router.go(-1)
                }
              },500)
            }else {
              self.$message({
                showClose: true,
                message: data.msg + '',
                type: 'error'
              });
            }
          }
        })
      },
      clickGoBack:function () {
        var self=this;
        self.$confirm('是否放弃本次的修改内容， 确定取消修改?', '离开提醒', {
          confirmButtonText: '离开',
          cancelButtonText: '取消',
          type: 'warning',
          callback: function (action) {
            if (action == 'confirm') {
              if(self.vfrom == '2'){
                self.$router.push('/layout/edit-edit?index=1&type=1');
              }else if(self.vfrom == '3'){
                self.$router.push('/layout/edit-publish?index=1&type=1');
              }else if(self.vfrom == '4'){
                self.$router.push('/layout/published-normal?index=0&type=1');
              }else {
                self.$router.go(-1)
              }
            }
          }
        })

      },
      //点击使用正文图片
      clickUseContentImage: function () {
        var objE = document.createElement("div");
        objE.innerHTML = this.editor.getContent();
        let imgs = Array.prototype.slice.call(objE.getElementsByTagName('img'));
        imgs = this.$uniqueArr(imgs, 'src') // 去重
        this.articleImgColletArr = [];
        if (imgs && imgs.length > 0) {
          if (imgs.length == 1) { // 1张直接选，多张弹窗选择
            if (this.articleForm.coverType == 0) {
              this.articleCover1 = imgs[0].src;
            } else {
              this.articleCoverBig = imgs[0].src;
            }
          } else {
            for (let item of imgs) {
              this.articleImgColletArr.push({
                url: item.src,
                select: false,
                selectIdx: 0
              });
            }
            this.articleImgSelectForUse = [];
            this.useImgModelShow = true;
          }
        } else {
          this.$message({ type: 'warning', message: '对不起，正文中暂无图片！', showClose: true});
        }
      },
      // 使用图片，弹窗根据先后顺序选取
      selectImgForCover (img) {
        this.articleImgColletArr.map((item, index) => {
          if (item.url == img.url) {
            if (!item.select) {
              let limit = this.articleForm.coverType == 0? 3 : 1;
              if (this.articleImgSelectForUse.length == limit) return;
            }
            item.select = !item.select;
            if (item.select) { // 加入
              let len = this.articleImgSelectForUse.length;
              item.selectIdx = len+1;
              this.articleImgSelectForUse.push(item.url)
            } else { // 去除
              this.articleImgSelectForUse = this.articleImgSelectForUse.filter((item1) => 
                !(item1 == img.url)
              )
            }
          }
        });
        // 更新原有顺序
        this.articleImgSelectForUse.forEach((item2, index2) => {
          this.articleImgColletArr.map((item, index) => {
            if (item2 == item.url) {
              item.selectIdx = index2 + 1;
            }
          });
        });
      },
      useImgFun () {
        if (this.articleImgSelectForUse.length == 0) {
          this.$message({type: 'warning', message: '请先选择图片', showClose: true});
          return;
        }
        this.useImgModelShow = false;
        if (this.articleForm.coverType == 0) { // 3张小图
          for (let i = 0; i < this.articleImgSelectForUse.length; i++) {
            if (i == 0) {
              this.articleCover1 = this.articleImgSelectForUse[0];
            } else if (i == 1) {
              this.articleCover2 = this.articleImgSelectForUse[1];
            } else {
              this.articleCover3 = this.articleImgSelectForUse[2];
            }
          }
        } else { // 大图
          this.articleCoverBig = this.articleImgSelectForUse[0];
        }
      },
      //封面上传
      beforeUpload(file) {
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
      },
      successUpload1(data, file) {
        var self = this;
        if (data.code == "0" && data.data && data.data.url) {
          self.articleCover1=data.data.url;
        } else {
          self.$message({
            type: 'error',
            message: '上传失败',
            showClose: 'true'
          })
        }
      },
      successUploadBig (data, file) {
        var self = this;
        if (data.code == "0" && data.data && data.data.url) {
          self.articleCoverBig=data.data.url;
        } else {
          self.$message({
            type: 'error',
            message: '上传失败',
            showClose: 'true'
          })
        }
      },
      successUpload2(data, file) {
        var self = this;
        if (data.code == "0" && data.data && data.data.url) {
          self.articleCover2=data.data.url;
        } else {
          self.$message({
            type: 'error',
            message: '上传失败',
            showClose: 'true'
          })
        }
      },
      successUpload3(data, file) {
        var self = this;
        if (data.code == "0" && data.data && data.data.url) {
          self.articleCover3=data.data.url;
        } else {
          self.$message({
            type: 'error',
            message: '上传失败',
            showClose: 'true'
          })
        }
      },
      //打开预览函数
      openPreviewArticle:function (e) {
        e.preventDefault();
        this.previewArticleForm={
          title:this.articleForm.title,
          source:this.articleForm.source,
          content:this.articleForm.content.replace('target="_self"', 'target="_blank"'),
        };
      },
      //关闭预览函数
      closePreviewArticle:function () {
        if(this.previewArticleForm) this.previewArticleForm='';
      },
      //获取插入图片素材列表
      getInsertImageList(){
        var self=this;
        var startTime='',endTime='';
        if(self.insertImageSearchForm.timeScope && self.insertImageSearchForm.timeScope.length>1){
          startTime=self.insertImageSearchForm.timeScope[0]+' 00:00:00';
          endTime=self.insertImageSearchForm.timeScope[1]+' 23:59:59';
        }
        self.loading=true;
        self.$jqAjax({
          url:self.insertImageSearchForm.type=='1' ? apiHost + '/media/list' : apiHost + '/media/personal/list',
          data:{
            type:'1',
            status:'1',
            classify:self.insertImageSearchForm.classify,
            desc:self.insertImageSearchForm.desc,
            author:self.insertImageSearchForm.author,
            startTime:startTime,
            endTime:endTime,
            pageNum:self.insertImagePageNum,
            pageSize:self.insertImagePageSize,
          },
          success:function (data) {
            self.loading=false;
            if(data.code === "0" && data.data && data.data.list){
              self.insertImageList=data.data.list;
              self.insertImageTotal=data.data.total;
            }else {
              self.insertImageList=[];
              self.insertImageTotal= 0;
            }
          }
        })
      },
      insertImagePageNumChange(val){
        this.insertImagePageNum=val;
        this.getInsertImageList();
      },
      insertImageSuccessUpload(data, file) {
        if (data.code == "0" && data.data && data.data.url) {
          // this.insertUploadImageUrl = data.data.url;
          this.localUploadImgArr.push(data.data.url);
        } else {
          this.$message({ type: 'error', message: '上传失败', showClose: 'true'})
        }
      },
      //编辑器中插入图片
      editorInsertImage:function (url, imageItem) {
        if (!url) {
          this.$message({ type: 'error', message: '请选择图片', showClose: 'true'});
          return;
        }
        let content = '';
        content = `<div>
          <p style="text-align:center;"><img src="${url}" _src="${url}"></p>
          <p style="color:#999;text-align:center;font-size:0.8em;margin:0 0 20px;padding:0;min-height:1.5em;">
          ${imageItem&&imageItem.desc?('<span>'+imageItem.desc+'</span>'):''}
          </p>
        </div>`;
        this.editor.execCommand('inserthtml', content);
        this.insertImageModelShow = false;
      },
      // 删除上传的多张图片
      delLocalUploadImg (index) {
        this.localUploadImgArr.splice(index, 1);
      },
      // 编辑器插入多张图片
      editorInsertLocalImage () {
        if (this.localUploadImgArr.length == 0) {
          this.$message({type: 'warning', message: '请先上传图片', showClose: true});
          return;
        }
        let content = ``;
        for (let item of this.localUploadImgArr) {
          content += `<div>
            <p style="text-align:center;"><img src="${item}" _src="${item}"></p>
            <p style="color:#999;text-align:center;font-size:0.8em;margin:0 0 20px;padding:0;min-height:1.5em;">
            </p>
          </div>`;
        }
        this.editor.execCommand('inserthtml', content);
        this.insertImageModelShow=false;
      },
      //获取插入视频素材列表
      getInsertVideoList(){
        var self=this;
        var startTime='',endTime='';
        if(self.insertVideoSearchForm.timeScope && self.insertVideoSearchForm.timeScope.length>1){
          startTime=self.insertVideoSearchForm.timeScope[0]+' 00:00:00';
          endTime=self.insertVideoSearchForm.timeScope[1]+' 23:59:59';
        }
        self.loading=true;
        self.$jqAjax({
          url:self.insertVideoSearchForm.type=='1' ? apiHost + '/media/list' : apiHost + '/media/personal/list',
          data:{
            type:'2',
            status:'1',
            classify:self.insertVideoSearchForm.classify,
            desc:self.insertVideoSearchForm.desc,
            author:self.insertVideoSearchForm.author,
            startTime:startTime,
            endTime:endTime,
            pageNum:self.insertVideoPageNum,
            pageSize:self.insertVideoPageSize,
          },
          success:function (data) {
            self.loading=false;
            if(data.code === "0" && data.data && data.data.list){
              self.insertVideoList=data.data.list;
              self.insertVideoTotal=data.data.total;
            }else {
              self.insertVideoList=[];
              self.insertVideoTotal= 0;
            }
          }
        })
      },
      insertVideoPageNumChange(val){
        this.insertVideoPageNum=val;
        this.getInsertVideoList();
      },
      insertVideoCheck(item){
        this.insertVideoCheckedUrl=item.url;
        this.insertVideoCheckedCover=item.cover;
      },
      //编辑器中插入视频
      editorInsertVideo:function (url,cover) {
        if(!url){
          this.$message({
            type: 'error',
            message: '请选择视频',
            showClose: 'true'
          });
          return
        }
        if(this.active_index == '1'){
          var content='<p style="text-align: center;"><video src="'+url+'" controls=""></video></p>';
          if(cover){
            content='<p style="text-align: center;"><video src="'+url+'" poster="'+cover+'" controls=""></video></p>';
          }
          this.editor.execCommand('inserthtml', content);
        }else {
          this.videoCheckUrl =url;
          if(cover) this.videoCheckUrlCover = cover;
        }
        this.insertVideoModelShow=false;
      },
      //获取插入音频素材列表
      getInsertRadioList(){
        var self=this;
        var startTime='',endTime='';
        if(self.insertRadioSearchForm.timeScope && self.insertRadioSearchForm.timeScope.length>1){
          startTime=self.insertRadioSearchForm.timeScope[0]+' 00:00:00';
          endTime=self.insertRadioSearchForm.timeScope[1]+' 23:59:59';
        }
        self.loading=true;
        self.$jqAjax({
          url:self.insertRadioSearchForm.type=='1' ? apiHost + '/media/list' : apiHost + '/media/personal/list',
          data:{
            type:'3',
            status:'1',
            classify:self.insertRadioSearchForm.classify,
            title:self.insertRadioSearchForm.title,
            author:self.insertRadioSearchForm.author,
            startTime:startTime,
            endTime:endTime,
            pageNum:self.insertRadioPageNum,
            pageSize:self.insertRadioPageSize,
          },
          success:function (data) {
            self.loading=false;
            if(data.code === "0" && data.data && data.data.list){
              self.insertRadioList=data.data.list;
              self.insertRadioTotal=data.data.total;
            }else {
              self.insertRadioList=[];
              self.insertRadioTotal= 0;
            }
          }
        })
      },
      insertRadioPageNumChange(val){
        this.insertRadioPageNum=val;
        this.getInsertRadioList();
      },
      //编辑器中插入音频
      editorInsertRadio:function (url) {
        if(!url){
          this.$message({
            type: 'error',
            message: '请选择音频',
            showClose: 'true'
          });
          return
        }
        var content='<p style="text-align: center;"><audio controls="" src="'+url+'" ></audio></p>';
        this.editor.execCommand('inserthtml', content);
        this.insertRadioModelShow=false;
      },
      //富文本编辑器初始化程序
      editorInt: function () {
        var self = this;
        if(document.getElementById('editor')){
          UE.registerUI('myInsertImage', function(editor, uiName) {
            var btn = new UE.ui.Button({
              name: uiName,
              title: '插入图片',
              cssRules: 'background-position: -380px 0px;',
              onclick: function() {
                self.insertImageModelShow=true;
                self.insertUploadImageUrl = '';
                self.localUploadImgArr = [];
                self.insertImgTabIdx = '0';
                self.getInsertImageList();
              }
            });
            return btn;
          },[0]);
          UE.registerUI('myInsertVideo', function(editor, uiName) {
            var btn = new UE.ui.Button({
              name: uiName,
              title: '插入视频',
              cssRules: 'background-position: -320px -20px;',
              onclick: function() {
                self.insertVideoModelShow=true;
                self.getInsertVideoList();
              }
            });
            return btn;
          },[1]);
          UE.registerUI('myInsertRadio', function(editor, uiName) {
            var btn = new UE.ui.Button({
              name: uiName,
              title: '插入音频',
              cssRules: 'background-position: -18px -40px;',
              onclick: function() {
                self.insertRadioModelShow=true;
                self.insertLocalUploadAudioUrl = '';
                self.getInsertRadioList();
              }
            });
            return btn;
          },[2]);
          self.editor = UE.getEditor('editor', {
            toolbars: [[
              'link','blockquote', 'horizontal',
              'bold', 'italic', 'underline','strikethrough', 'fontsize', 'forecolor',
              'removeformat',
              'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify',
              'undo', 'redo',
              'fullscreen',
            ]],
            fontsize: [10, 12, 14, 16, 18, 20, 22, 26, 30],
            wordCount: false,
            wordCountMsg: '当前已输入 {#count} 个字',
            elementPathEnabled: false,
            enableAutoSave: false,
            autoHeightEnabled: true,

          });
          self.editor.ready(function (editor) {
            self.hashChange();
            self.$("#write-title").insertAfter(self.$(".edui-editor-toolbarbox")).show();
            self.$('#write-box').scroll(function () {
              self.toolbarboxPosition();
            })
            window.onresize=function () {
              self.toolbarboxPosition();
            }
          });
          self.editor.addListener('contentChange', function (editor) {
            self.articleForm.content = self.editor.getContent();
            self.articleWordsNum=self.editor.getContentTxt().length;
          });
        }else {
          self.hashChange();
        }


      },
      toolbarboxPosition(){
        var self=this;
        var top=self.$('#write-box').scrollTop();
        var tollbarbox=self.$('.edui-editor-toolbarbox');

        if(top>=47){
          tollbarbox.css({
            'position':'fixed',
            'top':'70px',
            'left':self.$('#write-box').offset().left,
            'width':tollbarbox.parent().width(),
            'z-index':'99'
          })
          self.$("#write-title").css({
            'margin-top': '47px'
          })
        }else {
          tollbarbox.css({
            'position':'static',
            'width':'auto',
          })
          self.$("#write-title").css({
            'margin-top': '0'
          })
        }
      },
      deleteRole (index) {
        this.storeArticleRole.splice(index, 1);
      },
      // 获取岗位数据
      getPositionList () {
        this.position_list = [];
        this.$jqAjax({
          url: apiHost + '/position/getPosList',
          type: 'POST',
          data: {
            pageSize: 50,
            pageNum: 1
          },
          success: (res) => {
            if (res.code == 0) {
              this.position_list = res.data;
            } else {
              this.$message({type: 'error', message: '请求失败', showClose: true});
            }
          },
          error: (err) => {
            this.$message({type: 'error', message: '请求失败', showClose: true});
          }
        });
      },
      // 输入岗位相关姓名并保存
      inputPosStaff () {
        let posName = '';
        let posId = '';
        let addStaffName = '';
        let hasAdded = false;
        let storeArr = [];
        let selectPosition = '';
        storeArr = this.storeArticleRole;
        selectPosition = this.selectPosition1;
        addStaffName = this.inputStaffName1;
        if (!selectPosition) {
          this.$message({type: 'warning', message: '请选择岗位', showClose: true});
          return;
        }
        hasAdded = storeArr.some((item) => {
          return selectPosition == item.posId;
        });
        if (hasAdded) {  // 判重
          this.$message({type: 'warning', message: '该岗位已添加，请点击修改', showClose: true});
          return;
        }
        if (!addStaffName) {
          this.$message({type: 'warning', message: '请输入姓名', showClose: true});
          return;
        }
        for (let item of this.position_list) {
          if (item.id == selectPosition) {
            posName = item.name;
            posId = item.id;
          }
        }
        storeArr.push({
          posName: posName,
          staffName: addStaffName,
          posId: posId,
          isShow: true, // 默认显示
          isEdit: false // 默认不编辑
        });
        this.inputStaffName1 = '';
      },
      toggleView (index) {
        this.$set(this.storeArticleRole[index], 'isShow', !this.storeArticleRole[index].isShow);
      },
      editRole (index) {
        this.$set(this.storeArticleRole[index], 'isEdit', !this.storeArticleRole[index].isEdit);
      },
      changeImgSrc (img, name) {
        switch (name) {
          case 'articleCoverBig':
            this.articleCoverBig = img;
            break;
          case 'articleCover1':
            this.articleCover1 = img;
            break;
          case 'articleCover2':
            this.articleCover2 = img;
            break;
          case 'articleCover3':
            this.articleCover3 = img;
            break;
        }
      },
      // 本地上传音/视频
      //视频上传之前
      beforeUploadVideo (file) {
        this.videoUploadLoading = true;
      },
      successUploadVideo (data, file) {
        var self = this;
        self.videoUploadLoading=false;
        if (data.code == "0" && data.data && data.data.url) {
          self.videoCheckUrl=data.data.url;
          self.videoCheckUrlDuration=data.data.timeSeconds || '';
          self.videoCheckUrlSize=data.data.size || '';
          if(data.data.cover){
            self.videoCheckUrlCoverList =data.data.cover;
            self.videoCheckUrlCover = self.videoCheckUrlCoverList[self.videoCheckUrlCoverList.length-1];
          }else {
            self.videoCheckUrlCoverList =[];
            self.videoCheckUrlCover =self.videoCheckUrl.indexOf('aliyuncs.com')>-1 ? self.videoCheckUrl + '?x-oss-process=video/snapshot,t_5000' : '';
          }
        } else {
          self.$message({ type: 'error', message: '上传失败', showClose: 'true'})
        }
        self.$refs.videoUploadRef.clearFiles();
      },
      successUploadVideoLocal (data, file) {
        this.videoUploadLoading = false;
        if (data.code == '0' && data.data && data.data.url) {
          this.insertLocalUploadVideoUrl = data.data.url;
        } else {
          this.$message({type: 'error', message: '上传失败', showClose: 'true'});
        }
        this.$refs.videoUploadRef1.clearFiles();
      },
       aliUploadVideoBack (data) {
        if (data.playUrl) {
          this.insertLocalUploadVideoUrl = data.playUrl;
        }
      },
      beforeUploadAudio (file) {
        this.audioUploadLoading = true;
      },
      successUploadAudioLocal (data, file) {
        this.audioUploadLoading = false;
        if (data.code == '0' && data.data && data.data.url) {
          this.insertLocalUploadAudioUrl = data.data.url;
        } else {
          this.$message({type: 'error', message: '上传失败', showClose: true});
        }
        this.$refs.audioUploadRef1.clearFiles()
      },
      aliUploadAudioBack (res) {
        this.insertLocalUploadAudioUrl = res.playUrl;
      },
      clickResetCheckVideo1: function () {
        var self = this;
        self.$confirm('确定重新选择视频吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: function (action) {
            if (action == 'confirm') {
              self.insertLocalUploadVideoUrl='';
            }
          }
        })
      },
      clickResetCheckAudio1 () {
        this.$confirm('确定重新选择音频吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: (action) => {
            if (action == 'confirm') {
              this.insertLocalUploadAudioUrl = '';
            }
          }
        });
      },
      changeClassifyEdit () {
        if (this.editClassify) {
          this.articleForm.classify = this.tempClassify;
        } else {
          this.tempClassify = this.articleForm.classify;
        }
        this.editClassify = !this.editClassify;
      },
      deleteLabel (index) {
        this.labelList.splice(index, 1);
      },
      addLabel () {
        if (this.newLabel) {
          // 判断是否重复
          if (this.labelList.includes(this.newLabel)) {
            this.$message({type: 'warning', message: '该标签已存在，请勿重复添加', showClose: true});
            return;
          }
          this.labelList.push(this.newLabel);
          this.newLabel = ''
        }
      },
      viewLabelSearch () { // 跳转到所有内容的标签搜索结果

      }
    }
  }
</script>

<style lang="scss" scoped>
  .sensitive-word {
    height: 50px;
    line-height: 50px;
    color: #f00;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
  }
  /*已引入create-create.scss*/
  .rolesList{
    background-color: #f5f5f5;
    padding-top: 14px;
    padding-bottom: 14px;
    li{
      user-select:none;
      line-height: 26px;
      padding-left: 46px;
      margin-bottom: 4px;
      position: relative;
      .editInput {
        width: 240px;
        height: 20px;
        text-indent: 4px;
      }
      .delIcon{
        color:#606266;
        font-size: 20px;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
      }
      .editIcon {
        color:#606266;
        font-size: 20px;
        position: absolute;
        right: 46px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
      }
      .editOk {
        color:#606266;
        font-size: 20px;
        position: absolute;
        right: 46px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
      }
      .viewIcon {
        width: 20px;
        height: 20px;
        display: inline-block;
        position: absolute;
        cursor: pointer;
        top: 50%;
        left: 14px;
        transform: translateY(-50%);
        background-image: url('../../../images/view.png');
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
      }
      .closeView{
        background-image: url('../../../images/view_off.png');
      }
    }
  }
  .video-upload-local {
    max-width: 660px;
    height: 370px;
    margin: 0 auto;
    background: #d6d6d6;
    h2 {
      font-size: 24px;
      color: #4d7cfe;
      letter-spacing: 0;
      text-align: center;
      line-height: 24px;
      padding: 145px 0 28px;
    }
    .add {
      text-align: center;
    }
  }
  .audio-upload-box {
    padding: 0;
    .audio-upload-local {
      max-width: 660px;
      height: 258px;
      margin: 0 auto;
      background: #d6d6d6;
      h2 {
        font-size: 24px;
        color: #4d7cfe;
        letter-spacing: 0;
        text-align: center;
        line-height: 24px;
        padding: 86px 0 28px;
      }
      .add {
        text-align: center;
      }
    }
    .audio-uploaded {
      background: #fff;
    }
  }
  #create-create .insert-image-model .upload-manul {
    height: 380px;
    .img-list-wrap {
      display: flex;
      flex-wrap: wrap;
      padding: 7px;
      height: 300px;
      overflow-y: scroll;
      align-content: flex-start;
      .img-item{
        width: 112px;
        height: 90px;
        margin-right: 8px;
        margin-bottom: 10px;
        position: relative;
        .avatar{
          width: 100%;
          height: 100%;
          background-size: cover;
        }
        .close {
          display: block;
          font-size: 20px;
          color: #4D7CFE;
          background: #ffffff;
          border-radius: 50%;
          position: absolute;
          right: -7px;
          top: -7px;
          cursor: pointer;
        }
      }

    }
  .uploadBtn-sm{
    width: 112px;
    height: 90px;
    margin-right: 8px;
    margin-bottom: 10px;
    .avatar-uploader {
      width: 100%;
      height: 100%;
    }
  }
  }
  .useImgWrap {
    height: 400px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    li {
      width: 166px;
      height: 130px;
      background-color: #fff;
      border: 2px solid #fff;
      margin: 0 10px 10px 0;
      cursor: pointer;
      position: relative;
      .img {
        height: 100%;
        width: 100%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }
      .select-cover{
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 130px;
        font-size: 20px;
        color:#fff;
        background-color: rgba(0, 0, 0, .3);
        position: absolute;
        left: 0;
        top: 0;
      }
    }
    .selected {
      border: 2px solid #4D7CFE;
    }
  }
  .sm_input_area{
    margin-bottom: 10px;
    padding-left: 120px;
    padding-right: 30px;
    position: relative;
    .pos_list{
      position: absolute;
      left: 0;
      top: 0;
    }
    .sm_input {
      width: 100%;
    }
    .addIcon {
      font-size: 20px;
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      &:hover {
        color:#5cb6ff;
      }
    }
  }
#create-create {
  .assort-wrap  {
    height: 40px;
    line-height: 40px;
    position: relative;
    box-sizing: border-box;
    padding: 0 20px 0 20px;
    margin-bottom: 12px;
    .show-class {
      height: 30px;
      line-height: 30px;
      position: absolute;
      left: 60px;
      top: 50%;
      transform: translateY(-50%);
      .classify {
        height: 30px;
        line-height: 30px;
        min-width: 105px;
        border-radius: 4px;
        display: inline-block;
        border: 1px solid rgb(188, 188, 188);
        background-color: rgba(247, 247, 247, 1);
        vertical-align: top;
        text-align: center;
        margin-left: 14px;
        cursor: pointer;
      }
      .tip {
        font-size: 12px;
      }
    }
    .classify-input {
      height: 30px;
      width: 250px;
      position: absolute;
      left: 60px;
      top: 50%;
      margin-top: -15px;
      input {
        height: 30px;
        width: 240px;
        text-indent: 4px;
        position: absolute;
        left: 12px;
        top: 0;
      }
      .editOk {
        color: #606266;
        font-size: 20px;
        position: absolute;
        right: 4px;
        top: 50%;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        cursor: pointer;
      }
    }
  }
  .label-wrap {
    padding: 0 20px 0 20px;
    margin-bottom: 12px;
    box-sizing: border-box;
    .label-list {
      margin-top: 10px;
      li {
        height: 28px;
        min-width: 58px;
        line-height: 28px;
        text-align: center;
        border-radius: 10px;
        border: 1px solid #DDDDDD;
        background-color: rgba(247, 247, 247, 1);
        padding: 0 4px;
        float: left;
        position: relative;
        margin-right: 10px;
        margin-bottom: 10px;
        &:hover {
          .delIcon {
            display: inline-block;
          }
        }
        .delIcon {
          font-size: 20px;
          border-radius: 50%;
          background-color: #fff;
          cursor: pointer;
          position: absolute;
          right: -6px;
          top: -6px;
        }

      }
    }
    .input-wrap {
      height: 30px;
      width: 100%;
      margin-top:10px;
      position: relative;
      input {
        height: 100%;
        width: 340px;
        border: 1px solid #DDDDDD;
        border-radius: 4px;
        text-indent: 10px;
        background-color: #f5f5f5;
      }
      .addIcon {
        font-size: 20px;
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 50%;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
      }
    }
  }
}
</style>
