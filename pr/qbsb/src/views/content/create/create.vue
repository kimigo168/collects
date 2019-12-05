<template>
  <div id="create-create" v-loading.lock="loading">
    <div class="contents-top clearfix">
      <div class="write-box tab scroll" id="write-box">
        <p class="sensitive-word" v-if="sensitiveSet.length>0">文章中包含敏感词：{{sensitiveSet.join(',')}}</p>
        <el-tabs v-model="active_index">
          <el-tab-pane label="文章" name="1" v-if="!vfrom || queryIdType == '1'">
            <div class="write-title" id="write-title" style="display: none;">
              <input v-model="articleForm.title" maxlength="300" type="text" placeholder="请在这里输入标题（1～300个字）"/>
              <span>{{articleForm.title.length}}/300</span>
            </div>
            <div class="editor" id="editor"  style="height:500px;"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="publish-box scroll">
        <div class="publish-article">
          <h3 class="title">发布设置</h3>
          <div class="item">
            <h3>频道</h3>
            <div><a href="javascript:;" class="btn" :key="item.id" v-for="item in parentChannelList" :class="{'active':articleForm.channelPid == item.id}" @click="getChildrenChannelList(item.id)">{{item.name}}</a></div>
          </div>
          <div class="item" v-if="childrenChannelList.length>0">
            <h3>子频道</h3>
            <div>
              <a href="javascript:;" class="btn" :key="item.id" v-for="item in childrenChannelList" :class="{'active':articleForm.channelId == item.id}" @click="articleForm.channelId = item.id">{{item.name}}</a>
            </div>
          </div>
          <div class="item assort-wrap">
            分类
 
            <div class="show-class" v-if="!classifyEditStatus">
              <span class="classify" @click="changeClassifyEdit">{{articleForm.classify?articleForm.classify:'无'}}</span><span class="tip" v-if="!classifyEditStatus">（点击修改或添加分类）</span>
            </div>
            <div class="classify-input" @keyup.enter="changeClassifyEdit" v-else>
              <input type="text" v-model="tempClassify" v-if="classifyEditStatus">
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
          <div class="item">
            <el-radio v-model="articleForm.coverType" label="0">普通封面</el-radio>
            <el-radio v-model="articleForm.coverType" label="1">大图封面</el-radio>
          </div>
          <div class="item">
            <p class="tip">
              <el-button size="small" type="primary" @click="clickUseContentImage()">使用</el-button>
              <span>(可使用详情页图片作为封面)</span>
            </p>
            <!-- 大图上传 -->
            <img-upload v-if="articleForm.coverType==1" :size="[240,150]" :imgSrcName="'articleCoverBig'" :imgSrc="articleCoverBig" :uploadUrl="uploadUrl" @delImgSrc="articleCoverBig=''" @changeImgSrc="changeImgSrc"></img-upload>
            <!-- 三图上传 -->
            <img-upload v-if="articleForm.coverType!=1" :size="[112,90]" :imgSrcName="'articleCover1'" :imgSrc="articleCover1" :uploadUrl="uploadUrl" @delImgSrc="articleCover1=''" @changeImgSrc="changeImgSrc"></img-upload>
            <img-upload v-if="articleForm.coverType!=1" :size="[112,90]" :imgSrcName="'articleCover2'" :imgSrc="articleCover2" :uploadUrl="uploadUrl" @delImgSrc="articleCover2=''" @changeImgSrc="changeImgSrc"></img-upload>
            <img-upload v-if="articleForm.coverType!=1" :size="[112,90]" :imgSrcName="'articleCover3'" :imgSrc="articleCover3" :uploadUrl="uploadUrl" @delImgSrc="articleCover3=''" @changeImgSrc="changeImgSrc"></img-upload>
          </div>
          <div class="item">
            <h3>署名（选填）</h3>
            <div class="sm_input_area" @keyup.enter="inputPosStaff" >
              <el-select class="pos_list" v-model="selectPosition1" placeholder="请选择岗位" style="width:120px;">
                <el-option v-for="item in position_list" :key="item.id" :label="item.name" :value="item.id"></el-option> 
              </el-select>
              <el-input class="sm_input" :disabled="!selectPosition1" v-model="inputStaffName1" placeholder="请输入姓名并以空格隔开"></el-input><i @click="inputPosStaff" class="addIcon el-icon-circle-plus-outline"></i>
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
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div class="contents-bottom">
      <div class="btns">
        <p class="word-num">文章字数：{{articleWordsNum}} 个字</p>
        <a href="javascript:;" class="btn active" v-if="vfrom != '1' && vfrom !='2'" @click="clickSaveArticleDraft('4')">送审</a>
        <a href="javascript:;" class="btn" v-if="vfrom != '1' && vfrom !='2'" @click="clickSaveArticleDraft('0')">存草稿</a>
        <a href="javascript:;" class="btn active" v-if="vfrom == '1'||vfrom == '2'" @click="clickSaveArticleDraft('3')">保存并{{isQuick?'发布':'送审'}}</a>
        <a href="javascript:;" class="btn" v-if="vfrom == '1'||vfrom == '2'" @click="clickGoBack()">取消修改</a>
        <a href="javascript:;" class="btn" @click="openPreviewArticle()">预览</a>
      </div>
    </div>
    <!-- 插入图片弹窗 -->
    <el-dialog  v-loading.lock="loading" class="insert-image-model" title="插入图片" :visible.sync="insertImageModelShow" width="820px" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-tabs v-model="insertImgTabIdx">
        <el-tab-pane label="手动上传" name="1">
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
    <!-- 插入视频 弹窗 -->
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
                <a href="javascript:;" class="btn3" style="width:100px;height:30px;">
                  本地上传
                </a>
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
    <!-- 插入音频弹窗-->
    <el-dialog v-loading.lock="loading"  class="insert-image-model" title="插入音频" :visible.sync="insertRadioModelShow" width="820px" :close-on-click-modal="false" :close-on-press-escape="false">
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
    <!-- 设置封面图 -->
    <el-dialog class="insert-image-model" title="设置封面图" :visible.sync="setVideoCoverModelShow" width="820px" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-tabs>
        <el-tab-pane label="系统封面">
          <div class="content">
            <ul class="list scroll">
              <li style="height: auto;" v-for="(item,index) in setVideoSystemCoverList" :class="{active:item ==setVideoSystemCoverCheckUrl}" :key="index" @click="setVideoSystemCoverCheckUrl = item">
                <div class="img" :style="{backgroundImage:'url('+ item +')'}"></div>
              </li>
              <li class="has-no" v-if="setVideoSystemCoverList.length == 0">
                <img src="./../../../images/create-create-no-cover.png"/>
                <p>视频处理中, 暂无系统封面, 请使用上传封面</p>
              </li>
            </ul>
          </div>
          <div class="btns">
            <el-button type="primary" @click="checkVideoSystemCover()">确定</el-button>
            <el-button @click="setVideoCoverModelShow = false">取消</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="图片上传">
          <div class="video-cover-upload">
            <div class="top">
              <el-upload class="upload" :action="uploadUrl" :on-change="setVideoCoverChangeUpload" accept="image/*" :show-file-list="false" :auto-upload="false">
                <el-button type="primary" >上传图片</el-button>
              </el-upload>
              <span>封面图最大支持5M,支持jpg,jpeg及png.</span>
            </div>
            <div class="preview clearfix">
              <div class="cropper-box">
                <vueCropper ref="cropper" :img="setVideoCropperImg" autoCrop :canScale="false" :canMove="false" infoTrue centerBox full fixed :fixedNumber="[750,480]" :autoCropWidth="750" :autoCropHeight="480" @realTime="realTime" style="height: 100%;"></vueCropper>
              </div>
              <div class="preview-box">
                <h3>预览</h3>
                <div class="pic" v-if="!setVideoCropperImg">
                  <span>暂无图片</span>
                </div>
                <div :style="setVideoCropperPreviewStyle">
                  <div :style="setVideoCropperPreviews.div">
                    <img :src="setVideoCropperPreviews.url" :style="setVideoCropperPreviews.img">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="btns">
            <el-button type="primary" @click="checkVideoCropperCover()">确定</el-button>
            <el-button @click="setVideoCoverModelShow = false">取消</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 挑选封面图 -->
    <el-dialog class="insert-image-model" title="使用图片" :visible.sync="useImgModelShow" width="820px" :close-on-click-modal="false" :close-on-press-escape="false">
      <ul class="useImgWrap scroll">
        <li v-for="(item, index) in articleImgColletArr" :key="index" @click="selectImgForCover(item)">
          <div class="img" :style="{backgroundImage:'url('+item.url+')'}" ></div>
          <div class="select-cover" v-if="item.select">{{item.selectIdx}}</div>
        </li>
      </ul>
      <div class="btns">
        <el-button type="primary" @click="useImgFun">选用</el-button>
        <el-button @click="useImgModelShow = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 预览弹窗 -->
    <previewPop v-if="previewArticleForm" :articleForm="previewArticleForm" @closePreviewArticle="closePreviewArticle"></previewPop>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import previewPop from "./../../../components/previewPop.vue";
  import imgUpload from './../../../components/imgUpload.vue'
  import aliUpload from '../../../components/aliUpload'
  var Base64 = require('js-base64').Base64;
  export default {
    components: {
      previewPop,
      draggable,
      imgUpload,
      aliUpload
    },
    data() {
      return {
        uploadUrl: apiHost+'/common/upload',
        queryId:'',
        queryIdType:'',
        vfrom:'', // 2表示从网站采集过来
        active_index: '1',
        articleForm:{
          id:'',
          status:'',
          type:'1',
          title:'',
          content :'',
          cover :'',
          channelPid :'',
          channelId :'',
          coverType :'0',
          contributorSign:'',
          source :'原创',
          staffList: '',
          classify: '', // 分类
          tags: ''
        },
        tempClassify: '',
        classifyEditStatus: false, // 编辑状态
        positionList: [],
        articleCoverBig: '',
        articleCover1:'',
        articleCover2:'',
        articleCover3:'',
        parentChannelList:[],
        childrenChannelList:[],
        articleWordsNum:0,
        oldArticleForm:{},
        oldArticleCoverBig: '',
        oldArticleCover1:'',
        oldArticleCover2:'',
        oldArticleCover3:'',
        previewArticleForm:'',
        setVideoCoverModelShow:false,
        setVideoSystemCoverList:[],
        setVideoSystemCoverCheckUrl:'',
        setVideoCropperImg:'',
        setVideoCropperPreviews:{},
        setVideoCropperPreviewStyle:{},
        insertImageModelShow: false,
        insertImageSearchForm:{
          type:'1',
          classify:'0',
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
          classify:'0',
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
        insertVideoCheckedItem:'',
        insertUploadVideoUrl: '',
        insertLocalUploadVideoUrl: '', // 本地插入视频
        insertLocalUploadAudioUrl: '', // 本地插入音频
        insertRadioModelShow: false,
        insertRadioSearchForm:{
          type:'1',
          classify:'0',
          title:'',
          author:'',
          timeScope:[],
          title: ''
        },
        insertRadioList:[],
        insertRadioPageNum:1,
        insertRadioPageSize:12,
        insertRadioTotal:0,
        insertRadioCheckedUrl:'',
        insertUploadRadioUrl: '',
        loading: false,
        filterSearchflag: null,
        storeArticleRole: [],
        storeVideoRole: [],
        storeLinkRole: [],
        media_types: [],
        selectImageItem: null, // 选择插入的图片
        insertImgTabIdx: '1',
        localUploadImgArr: [], // 存储本地上传多张图片
        useImgModelShow: false, // 使用图片弹窗
        articleImgColletArr: [], // 正文图片
        articleImgSelectForUse: [], // 使用的图片
        // 署名相关
        position_list: [], // 岗位列表
        selectPosition1: '', // 文章当前选择的岗位
        selectPosition2: '', // 视频当前选择的岗位
        selectPosition3: '', // 外链当前选择的岗位
        inputStaffName1: '', // 对应岗位输入的姓名
        inputStaffName2: '',
        inputStaffName3: '',
        isReEdit: false, // 1表示从我的稿件，重新编辑过来
        reEditHasSaved: false, // true表示重新编辑过来，已经点了存草稿
        videoUploadData: null, // 存储上传短视频结果
        isQuick: false, // 表示从快速发布过来
        labelList: [], // 标签列表
        newLabel: '', // 新增的标签
        videoUploadLoading: false,
        audioUploadLoading: false,
        isCollectEdit: false, // 网站采集进来修改
        collectEditType: '', // 采集类型 1网站，2：公众号
        collectData: null,
        sensitiveSet: [] // 敏感词列表
      }
    },
    watch:{
      "$route": "hashChange"
    },
    created() {
      if (this.$route.query.vfrom && this.$route.query.vfrom != 'undefined') {
        this.vfrom = this.$route.query.vfrom;
        this.isReEdit = this.$route.query.isReEdit == 1 ? true : false;
        this.isQuick = this.$route.query.quick == 1 ? true : false;
      }
      if (this.$route.query.type && this.$route.query.type != 'undefined') {
        this.active_index = this.queryIdType = this.$route.query.type;
      }
      this.getParentChannelList();
      this.getPositionList();
    },
    mounted() {
      this.$nextTick(() => {
        this.editorInt();
        this.resetIframeHeight();
      });
    },
     beforeRouteLeave (to, from, next) {
      var hasChange = false;
      for(var key in this.oldArticleForm){
        if(this.articleForm[key] != this.oldArticleForm[key]){
          hasChange=true;
        }
      }
      if (this.articleForm.coverType == 0) { // 普通封面
        if (this.articleCover1 != this.oldArticleCover1 || this.articleCover2 != this.oldArticleCover2 ||  this.articleCover3 != this.oldArticleCover3) {
          hasChange=true;
        }
      } else { // 大封面
        if (this.articleCoverBig != this.oldArticleCoverBig) {
          hasChange = true;
        }
      }
      if (hasChange) {
        this.$confirm('是否退出此次编辑？', '提示', {
          confirmButtonText: '退出',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          next();
        })
      } else {
        next();
      }
     },
    beforeDestroy () {
      if (this.editor) this.editor.destroy();
     },
    destroyed () {
      // if (this.editor) this.editor.destroy();
    },
    methods:{
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
      selectImageToInsert (item) {
        this.insertImageCheckedUrl = item.url;
        this.selectImageItem = item;
      },
      addMsgPerson () { // 添加信息员
        let systemUser = JSON.parse(sessionStorage.getItem("sysuser"))
        this.storeArticleRole.push({
          posId: 20,
          posName: '信息员',
          staffName: systemUser.name,
          isShow: true,
          isEdit:false
        })
      },
      hashChange () {
        var self = this;
        if (self.$route.query.vfrom && self.$route.query.vfrom != 'undefined') {
          self.vfrom = self.$route.query.vfrom;
        }
        if (self.$route.query.type && self.$route.query.type != 'undefined') {
          self.active_index = self.queryIdType = self.$route.query.type;
        }
        if (self.$route.query.isCollectEdit) { // 从网站采集跳转过来修改
          self.isCollectEdit = true
          self.collectEditType = self.$route.query.isCollectEdit
        }
        if (self.$route.query.id && self.$route.query.id != 'undefined') {
          self.queryId = self.$route.query.id;
          if (self.queryIdType == '1') { //是文章
            self.articleForm.id=self.queryId;
            if (self.isCollectEdit) {
              self.addMsgPerson()
              if (self.collectEditType == '1') { // 网站采集
                self.getCollectArticleDetail();
              } else { // 公众号采集
                self.getGzhArticleDetail()
              }
            } else {
              self.getArticleDraftDetail();
            }
          }
        } else {
          self.queryId='';
          self.queryIdType='';
          self.vfrom='';
          self.articleForm={
            id:'',
            status:'',
            type:'1',
            title:'',
            content :'',
            cover :'',
            channelPid :self.parentChannelList.length>0? self.parentChannelList[0].id : '',
            channelId :'',
            coverType :'0',
            contributorSign:'',
            source :'原创'
          };
          self.articleCoverBig = '';
          self.articleCover1='';
          self.articleCover2='';
          self.articleCover3='';
          self.addMsgPerson();
          if (self.editor) {
            self.editor.setContent('');
          }else {
            self.$nextTick(function () {
              self.editorInt();
            });
          }
          self.articleFormBackup();

          self.videoCover1='';
          self.videoCheckUrl='';
          self.videoCheckUrlCover='';
          self.oldArticleCoverBig = '';
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
        this.oldArticleForm.channelPid = id;
        self.childrenChannelList=[];
        self.articleForm.channelId = channelId || '';
        self.$jqAjax({
          url:apiHost + '/user/getNewsChannel',
          data:{
            pid:id
          },
          success:function (data) {
            if(data.code === "0" && data.data){
              self.childrenChannelList=data.data;
              if (!channelId && self.childrenChannelList[0]) { // 默认选择第一个子频道
                self.articleForm.channelId = self.childrenChannelList[0].id;
                self.oldArticleForm.channelId = self.childrenChannelList[0].id;
              }
            }
          }
        })
      },
      // 获取网站采集文章详情
      getCollectArticleDetail () {
        if (this.queryId) {
          this.loading = true
          this.$ajax({
            url: '/netCollect/detail',
            type: 'POST',
            data: {
              _id: this.queryId
            },
            success: (res) => {
              this.loading = false;
              if (res.code == '0' && res.data) {
                let data = res.data[0];
                this.collectData = data
                this.labelList = data.keywords.slice(0,15) || []; // 标签,最多显示15个
                this.articleForm.content = data.article;
                this.editor.setContent(this.articleForm.content);
                this.articleForm.title = data.title;
                this.articleForm.classify = data.tags?data.tags[0]:'' // 分类
                this.articleForm.source = data.source;
                this.articleForm.id = data._id;
                this.articleFormBackup(); // 临时存储
              }
            },
            error: (err) => {
              this.loading = false;
              this.$message({type: 'warning', message: err.msg, showClose: true})
            }
          });
        }
      },
      // 获取公众号采集文章详情 
      getGzhArticleDetail () {
        if (this.queryId) {
          this.loading = true
          this.$jqAjax({
            url: apiHost + '/platform/selectById',
            type: 'POST',
            data: {
              id: this.queryId
            },
            success: (res) => {
              this.loading = false;
              if (res.code === '0' && res.data) {
                let data = res.data
                this.articleForm.content = data.content;
                this.editor.setContent(this.articleForm.content);
                setTimeout(() => {
                  this.editor.execCommand('inserthtml', '  ');
                },3000)
                this.articleForm.title = data.title;
                this.articleForm.classify = ''
                this.articleForm.source = data.source
                this.articleForm.id = data.id
                if (data.cover) {
                  try {
                    let coverArr = JSON.parse(data.cover)
                    if (coverArr[0]) this.articleCover1 = coverArr[0].url
                    if (coverArr[1]) this.articleCover2 = coverArr[1].url
                    if (coverArr[2]) this.articleCover3 = coverArr[2].url
                  } catch (e) {
                    console.log(e)
                  }
                }
                this.articleFormBackup();
              }
            },
            error: (err) => {
              this.loading = false;
            }
          });
        }
      },
      //获取文章草稿内容
      getArticleDraftDetail: function () {
        var self = this;
        if (self.queryId) {
          self.loading = true;
          self.$jqAjax({
            url: apiHost + "/context/org/detail",
            data: {
              id: self.queryId
            },
            success: function (data) {
              self.loading = false;
              if (data.code == 0 && data.data) {
                self.articleForm = data.data;
                if (data.data.tags) {
                  self.labelList = data.data.tags.split(',')
                }
                if(self.articleForm.content) self.editor.setContent(self.articleForm.content);
                if(self.articleForm.cover){
                  try {
                    var coverArr=JSON.parse(self.articleForm.cover);
                    if (self.articleForm.coverType == 0) {
                      if(coverArr[0]) self.articleCover1 = coverArr[0].url;
                      if(coverArr[1]) self.articleCover2 = coverArr[1].url;
                      if(coverArr[2]) self.articleCover3 = coverArr[2].url;
                    } else {
                      if(coverArr[0]) self.articleCoverBig = coverArr[0].url;
                    }
                    
                  }catch (e){
                    console.log('eeee', e);
                  }
                }
                self.getChildrenChannelList(self.articleForm.channelPid,self.articleForm.channelId);
                self.getSignInfo(self.articleForm.cid, self.queryIdType); // 查询署名记录
                self.articleFormBackup();
              }
            },
            error: (err) => {
              console.log(err);
              this.loading = false;
            }
          })
        }
      },
      // 获取署名信息
      getSignInfo (id, type) { // type:1,3,6 文章/视频/外链
        this.$jqAjax({
          url: apiHost + '/staff/getContextStaffList',
          type: 'POST',
          data: {
            cid: id
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
              if (type == 1) {
                this.storeArticleRole = store;
              } else if (type == 3) {
                this.storeVideoRole = store;
              } else {
                this.storeLinkRole = store;
              }
              if (this.storeArticleRole.length == 0) {
                this.addMsgPerson();
              } else {
                let hasAddMsgPersion = store.some((item) => {
                  return item.posId == 20
                })
                if (!hasAddMsgPersion) {
                  this.addMsgPerson();
                }
              }
            }
          },
          error: (err) => {
            console.log(err);
          }
        });
      },
      //写文章保存草稿和送审
      clickSaveArticleDraft:function (status) {
        var self = this;
        if (!self.articleForm.title) {
          self.$alert('请输入标题', '提示', {
            type: 'warning'
          });
          return;
        }else if (self.articleForm.title.length < 1) {
          self.$alert('标题至少输入1个字', '提示', {
            type: 'warning'
          });
          return;
        }
        if (!self.editor.hasContents()) {
          self.$alert('请输入文章内容', '提示', {
            type: 'warning'
          });
          return;
        }
        if(status == '4'){
          self.$confirm('建议送审前再检查一遍，确定送审？', '送审提醒', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            callback: function (action) {
              if (action == 'confirm') {
                self.saveArticleData(status)
              }
            }
          })
        }else if(status == '3'){
          let title1 = self.isQuick ? '是否已完成修改，确定发布？请输入备注：' : '是否已完成修改, 确定送审? 请输入备注：';
          self.$prompt(title1, `${self.isQuick?'发布':'送审'}提醒`, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: '选填',
            closeOnClickModal: false
          }).then(({ value }) => {
            self.saveArticleData(status,value);
          })
        }else {
          self.saveArticleData(status)
        }

      },
      //写文章保存数据
      saveArticleData:function (status,remark) {
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
      saveRequest (status, remark) {
        var self=this;
        self.loading=true;
        self.articleForm.status = (self.isQuick?'1':self.isCollectEdit?'4':status) || '0';
        if(remark) self.articleForm.remark = remark;
        var  coverArr=[];
        if (self.articleForm.coverType == 0) {
          if(self.articleCover1) coverArr.push({url:self.articleCover1});
          if(self.articleCover2) coverArr.push({url:self.articleCover2});
          if(self.articleCover3) coverArr.push({url:self.articleCover3});
        } else {
          if(self.articleCoverBig) coverArr.push({url:self.articleCoverBig});
        }
        
        self.articleForm.cover = JSON.stringify(coverArr);
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
        // 添加标签
        if (this.labelList.length > 0) {
          this.articleForm.tags = this.labelList.join(',')
        }
        var url='/context/org/add';
        if(self.queryId && self.queryIdType == '1') {
          url='/context/org/personal/update';
          if(self.vfrom == '1') url='/context/org/update';
          if (self.isReEdit) { // 重新编辑跳转过来,会新增一条并关联原来数据
            if (self.reEditHasSaved) { // 重新编辑后再次存草稿
              url='/context/org/personal/update'
            } else { // 首次重新编辑
              url = '/context/org/add';
              self.$set(self.articleForm, 'pcid', self.articleForm.cid);
              delete self.articleForm['cid'];
              delete self.articleForm['id'];
            }
            
          }
        }
        if (this.isCollectEdit) {
          if (this.collectEditType == '1') { // 网站采集
            this.$ajax({
              url: '/netCollect/sendAuditDetail',
              type: 'POST',
              data: {
                _id: this.articleForm.id,
                article: Base64.encode(this.articleForm.content),
                author: this.collectData.author,
                channel_pid: this.articleForm.channelPid,
                channel_id: this.articleForm.channelId,
                cms_newsid: this.collectData.cms_newsid || '',
                cover: this.articleForm.cover,
                cover_type: this.articleForm.coverType,
                image: this.collectData.image,
                is_comment: '',
                keywords: this.articleForm.tags,
                model: this.articleForm.model,
                remark: this.articleForm.remark,
                source: this.articleForm.source,
                tags: this.articleForm.classify,
                title: this.articleForm.title
              },
              success: (res) => {
                this.loading = false
                if (res.code == '0') {
                  this.articleFormBackup();
                  this.$message({ showClose: true, message:  '文章已保存并送审成功', type: 'success'});
                  setTimeout(function () {
                    self.$router.push('/layout/edit-publish');
                  },500)
                } else {
                  this.$message({type: 'warning', message: res.msg, showClose: true});
                }
              },
              error: (err) => {
                this.loading = false
                this.$message({type: 'warning', message: err.msg, showClose: true});
              }
            })
          } else { // 公众号采集
            this.$ajax({
              url: '/platform/add',
              type: 'POST',
              data: {
                type: 1, // 1 文本 2,图片 3,视频 4，音频 5，多图 6,外链文章(正文存外链地址)
                title: this.articleForm.title,
                channelPid: this.articleForm.channelPid,
                channelId: this.articleForm.channelId,
                source: this.articleForm.source,
                content: Base64.encode(this.articleForm.content),
                status: this.articleForm.status, // 默认是4
                coverType: this.articleForm.coverType,
                cover: this.articleForm.cover,
                tags: this.articleForm.tags,
                classify: this.articleForm.classify,
                model: this.articleForm.model,
                remark: this.articleForm.remark,
                id: this.articleForm.id
              },
              success: (res) => {
                this.loading = false
                if (res.code == '0') {
                  this.articleFormBackup();
                  this.$message({ showClose: true, message:  '文章已保存并送审成功', type: 'success'});
                  setTimeout(function () {
                    self.$router.push('/layout/edit-publish');
                  },500)
                } else {
                  this.$message({type: 'warning', message: res.msg, showClose: true});
                }
              },
              error: (err) => {
                this.loading = false
                this.$message({type: 'warning', message: err.msg, showClose: true});
              }
            })
          }
        } else {
          self.$ajax({
            url:url,
            data:{
              id: self.articleForm.id || '',
              status: self.articleForm.status || 0,
              type: self.articleForm.type || '',
              title: self.articleForm.title,
              content: Base64.encode(self.articleForm.content),
              cover: self.articleForm.cover,
              channelPid: self.articleForm.channelPid,
              channelId: self.articleForm.channelId,
              coverType: self.articleForm.coverType,
              contributorSign: self.articleForm.contributorSign,
              source: self.articleForm.source,
              model: self.articleForm.model,
            },
            success:function (data) {
              self.loading=false;
              if(data.code === "0"){
                if(data.data && data.data.id){
                  self.queryId = data.data.id;
                  self.queryIdType = '1';
                  self.articleForm.id=self.queryId;
                  if (self.isReEdit) {
                    self.reEditHasSaved = true
                  }
                  
                }
                self.articleFormBackup();

                if(status == '4'){
                  self.$message({ showClose: true, message:  '文章已送审成功', type: 'success' });
                  setTimeout(function () {
                    self.$router.push('/layout/create-my?index=0&type=1');
                  },500)
                }else if(status == '3'){
                  if (self.isQuick) { // 快速发布
                    self.quickPublish(self.articleForm.cid);
                  } else { // 送审
                    self.$message({ showClose: true, message:  '文章已保存并送审成功', type: 'success'});
                    setTimeout(function () {
                      self.$router.push('/layout/create-audit?index=1&type=1');
                    },500)
                  }
                }else {
                  self.$message({ showClose: true, message: '草稿保存成功！', type: 'success'});
                }
              }else {
                self.$message({ showClose: true, message: data.msg + '', type: 'error'});
              }
            }
          })
        }
      },
      quickPublish (cid) {
        this.$jqAjax({
          url: apiHost + '/context/published/easyPublish',
          type: 'POST',
          data: {
            cid: cid
          },
          success: (res) => {
            if (res.code == 0) {
              this.$message({type: 'success', message: '已保存并发布', showClose: true});
              setTimeout(() => {
                this.$router.go(-1);
              },500)
            } else {
              this.$message({type: 'error', message: res.msg, showClose: true});
            }
          },
          error: (err) => {
            this.$message({type: 'error', message: err.msg, showClose: true});
          }
        });
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
      //图片、封面上传
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
      //打开预览函数
      openPreviewArticle:function () {
        this.previewArticleForm={
          title:this.articleForm.title,
          source:this.articleForm.source,
          content:this.articleForm.content.replace('target="_self"', 'target="_blank"'),
        };
        console.log('previewArticleForm', this.previewArticleForm.content)
      },
      //关闭预览函数
      closePreviewArticle:function () {
        if(this.previewArticleForm) this.previewArticleForm='';
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
      //视频上传之前
      beforeUploadVideo(file) {
        this.videoUploadLoading=true;
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
      aliUploadAudioBack (data) {
        if (data.playUrl) {
          this.insertLocalUploadAudioUrl = data.playUrl;
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
      aliUploadAudioBack (data) {
        if (data.playUrl) {
          this.insertLocalUploadAudioUrl = data.playUrl;
        }
      },
      //点击设置封面图
      openSetVideoCover:function () {
        if(this.videoCheckUrlCoverList.length>0){
          this.setVideoSystemCoverList=this.videoCheckUrlCoverList
        }else {
          this.showCapture();
        }
        this.setVideoSystemCoverCheckUrl=this.videoCover1;
        this.setVideoCoverModelShow=true;
      },
      //视频截图
      showCapture() {
        var self=this;
        self.setVideoSystemCoverList = [];
        if(self.videoCheckUrl && self.videoCheckUrl.indexOf('aliyuncs.com')>-1){
          var duration=document.getElementById('video-check-box').duration;
          if(duration==NaN || !duration) duration=50;
          for (var i = 1; i < duration/5; i++) {
            self.setVideoSystemCoverList.push(
              self.videoCheckUrl + '?x-oss-process=video/snapshot,t_' + i * 5000
            )
          }
        }
      },
      checkVideoSystemCover:function () {
        if (!this.setVideoSystemCoverCheckUrl) {
          this.$alert('请选择视频封面', '提示', { type: 'warning'});
          return;
        }
        this.videoCover1=this.setVideoSystemCoverCheckUrl;
        this.setVideoCoverModelShow=false;
      },
      //视频封面本地上传选择
      setVideoCoverChangeUpload(file, fileList) {
        if (file.raw.type != 'image/jpeg' && file.raw.type != 'image/png') {
          this.$message.error('封面图仅支持jpg，jpeg及png格式!');
          return;
        }
        if (file.raw.size /1024 / 1024 > 5) {
          this.$message.error('封面图最大支持5M!');
          return;
        }
        this.setVideoCropperImg=URL.createObjectURL(file.raw);
      },
      realTime (data) {
        this.setVideoCropperPreviews = data
        this.setVideoCropperPreviewStyle = {
          width: data.w + "px",
          height: data.h + "px",
          overflow: "hidden",
          margin: "0",
          zoom: 190 / data.w
        };
      },
      //选择裁剪后的图片作为视频封面
      checkVideoCropperCover: function () {
        var self = this;
        if (!self.setVideoCropperImg) {
          self.$alert('请上传视频封面', '提示', {
            type: 'warning'
          });
          return;
        }
        self.$refs.cropper.getCropBlob(function (data) {
          self.loading = true;
          var formData = new FormData();
          formData.append("file", data);
          var request = new XMLHttpRequest();
          request.open("POST", self.uploadUrl);
          request.send(formData);
          request.onreadystatechange = function () {
            if (request.readyState == 4) {
              self.loading = false;
              if (request.status == 200) {
                var data = JSON.parse(request.response);
                if (data.code == "0" && data.data && data.data.url) {
                  self.videoCover1= data.data.url;
                  self.setVideoCoverModelShow=false;
                } else {
                  self.$message({
                    showClose: true,
                    message: '图片上传失败,请重试',
                    type: 'error'
                  });
                }
              } else {
                self.$message({
                  showClose: true,
                  message: '图片上传失败,请重试',
                  type: 'error'
                });
              }
            }
          };
        })
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
            status:self.insertImageSearchForm.type=='1'?'1':'0',
            classify:self.insertImageSearchForm.classify,
            title:self.insertImageSearchForm.title,
            desc: self.insertImageSearchForm.desc,
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
          // self.insertUploadImageUrl=data.data.url;
          this.localUploadImgArr.push(data.data.url);
        } else {
          this.$message({ type: 'error', message: '上传失败', showClose: true})
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
        this.insertImageModelShow=false;
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
            title:self.insertVideoSearchForm.title,
            desc: self.insertVideoSearchForm.desc,
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
        let videoMaterial = document.getElementById('video-material');
        videoMaterial.scrollTop = 0;
        console.log('videoMaterial', videoMaterial)
      },
      insertVideoCheck(item){
        this.insertVideoCheckedUrl=item.url;
        this.insertVideoCheckedItem=item;
      },
      //编辑器中插入视频
      editorInsertVideo:function (url,insertVideoCheckedItem) {
        if(!url){
          this.$message({
            type: 'error',
            message: '请选择视频',
            showClose: 'true'
          });
          return
        }
        if(this.active_index == '1'){
          var content='<p></p><p style="text-align: center;"><video src="'+url+'" controls=""></video>&nbsp;</p>';
          if(insertVideoCheckedItem && insertVideoCheckedItem.cover){
            content='<p></p><p style="text-align: center;"><video src="'+url+'" poster="'+insertVideoCheckedItem.cover+'" controls=""></video></p>';
          }
          this.editor.execCommand('inserthtml', content);
        }else {
          this.videoCheckUrl =url;
          if(insertVideoCheckedItem) {
            this.videoCheckUrlCover = insertVideoCheckedItem.cover || '';
            this.videoCheckUrlDuration = insertVideoCheckedItem.duration || '';
            this.videoCheckUrlSize = insertVideoCheckedItem.contentLength || '';
          }
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
      clickGoBack:function () {
        var self=this;
        self.$confirm('是否放弃本次的修改内容， 确定取消修改?', '离开提醒', {
          confirmButtonText: '离开',
          cancelButtonText: '取消',
          type: 'warning',
          callback: function (action) {
            if (action == 'confirm') {
              if(self.vfrom == '-1'){ // 我的稿件
                self.$router.push('/layout/create-my?index=0&type='+self.queryIdType);
              }else if(self.vfrom == '1'){ // 部门稿件
                self.$router.push('/layout/create-audit?index=1&type='+self.queryIdType);
                // self.$router.go(-1)
              }else {
                self.$router.go(-1)
              }
            }
          }
        })

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
                self.insertImageSearchForm.classify = '0';
                self.insertUploadImageUrl = '';
                self.localUploadImgArr = [];
                // self.insertImgTabIdx = '0';
                // self.getInsertImageList();
                // self.getMediaTypeList();
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
                self.insertVideoSearchForm.classify = '0';
                self.insertVideoPageNum = 1;
                // self.getInsertVideoList();
                // self.getMediaTypeList();
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
                self.insertRadioSearchForm.classify = '0';
                self.insertRadioPageNum = 1;
                self.getInsertRadioList();
                self.getMediaTypeList();
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
            fontsize: [8, 10, 12, 14, 16, 18, 20, 22, 26, 30],
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
      resetIframeHeight(){
        this.$('#link-iframe').height(this.$('#write-box').width() - 322)
      },
      deleteRole (index) {
        if (this.active_index == 1) {
          this.storeArticleRole.splice(index, 1);
        } else if (this.active_index == 3) {
          this.storeVideoRole.splice(index, 1);
        } else {
          this.storeLinkRole.splice(index, 1);
        }
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
        if (this.active_index == 1) {
          storeArr = this.storeArticleRole;
          selectPosition = this.selectPosition1;
          addStaffName = this.inputStaffName1;
        } else if (this.active_index == 3) {
          storeArr = this.storeVideoRole;
          selectPosition = this.selectPosition2;
          addStaffName = this.inputStaffName2;
        } else {
          storeArr = this.storeLinkRole;
          selectPosition = this.selectPosition3;
          addStaffName = this.inputStaffName3;
        }
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
        if (this.active_index == 1) {
          this.inputStaffName1 = '';
        } else if (this.active_index == 3) {
          this.inputStaffName2 = '';
        } else {
          this.inputStaffName3 = '';
        }
      },
      toggleView (index) {
        if (this.active_index == 1) {
          this.$set(this.storeArticleRole[index], 'isShow', !this.storeArticleRole[index].isShow);
        } else if (this.active_index == 3) {
          this.$set(this.storeVideoRole[index], 'isShow', !this.storeVideoRole[index].isShow);
        } else {
          this.$set(this.storeLinkRole[index], 'isShow', !this.storeLinkRole[index].isShow);
        }
      },
      editRole (index) {
        if (this.active_index == 1) {
          this.$set(this.storeArticleRole[index], 'isEdit', !this.storeArticleRole[index].isEdit);
        } else if (this.active_index == 3) {
          this.$set(this.storeVideoRole[index], 'isEdit', !this.storeVideoRole[index].isEdit);
        } else {
          this.$set(this.storeLinkRole[index], 'isEdit', !this.storeLinkRole[index].isEdit);
        }
      },
      getMediaTypeList () {
        this.media_types = [];
        this.$jqAjax({
          url: apiHost + '/media/typeList',
          type: 'POST',
          data: {
            type: this.insertImageModelShow?1:this.insertVideoModelShow?2:3,
            pageNum: 1,
            pageSize: 100
          },
          success: (res) => {
            if (res.code == 0) {
              this.media_types = res.data.list;
            } 
          },
          error: (err) => {
            console.log(err)
          }
        });
      },
      changeClassifyEdit () {
        if (this.classifyEditStatus) {
          this.articleForm.classify = this.tempClassify;
        } else {
          this.tempClassify = this.articleForm.classify;
        }
        this.classifyEditStatus = !this.classifyEditStatus;
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
  /*已引入create-create.scss*/
  .sensitive-word {
    height: 50px;
    line-height: 50px;
    color: #f00;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
  }
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
      position: relative;
      cursor: pointer;
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
            display: none;
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
