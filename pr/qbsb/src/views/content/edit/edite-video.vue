<template>
  <div id="create-create" v-loading.lock="loading">
    <div class="contents-top clearfix">
      <div class="write-box tab scroll" id="write-box">
        <el-tabs v-model="active_index">
          <el-tab-pane label="视频" name="3">
            <div style="padding: 10px 30px;">
              <div class="write-title" style="padding-bottom: 39px;">
                <input v-model="videoForm.title" maxlength="60" type="text" placeholder="请在这里输入标题（6～60个字）"/>
                <span>{{videoForm.title.length}}/60</span>
              </div>
              <div class="item">
                <div class="video-check-box2" v-if="videoCheckUrl">
                  <video id="video-check-box" :src="videoCheckUrl" :poster="videoCheckUrlCover" controls=""></video>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="publish-box scroll">
        <div class="publish-video">
          <h3 class="title">发布设置</h3>
          <div class="item">
            <h3>频道</h3>
            <div><a href="javascript:;" class="btn"  v-for="item in videoClassify" :key="item.id" :class="{'active':videoForm.channelPid == item.id}" @click="videoForm.channelPid = item.id">{{item.name}}</a></div>
          </div>
          <!-- <div class="item">
            <h3>展示设置 (可选)</h3>
            <div class="row">
              <el-checkbox v-model="isStick">设为置顶</el-checkbox>
              <span v-show="isStick">置顶时长:</span>
              <el-select v-model="videoForm.stickTime" v-show="isStick">
                <el-option label="不限" :value="0"></el-option>
                <el-option label="5小时" :value="5"></el-option>
                <el-option label="10小时" :value="10"></el-option>
                <el-option label="1天" :value="24"></el-option>
                <el-option label="2天" :value="48"></el-option>
                <el-option label="3天" :value="72"></el-option>
              </el-select>
            </div>
            <div class="row">
              <el-checkbox v-model="isCarousel">选入轮播</el-checkbox>
            </div>
          </div> -->
          <div class="item clearfix">
            <h3>封面</h3>
            <div class="avatar-uploader video-avatar">
              <div class="avatar" v-if="videoCover1" :style="{backgroundImage:'url('+videoCover1+')'}"></div>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
            <p class="tip" style="height: 56px;">未上传封面时，默认使用视频截图</p>
            <el-button size="small" type="primary" @click="openSetVideoCover()">设置封面</el-button>
          </div>
          <div class="item">
            <h3>署名（选填）</h3>
            <div class="sm_input_area" @keyup.enter="inputPosStaff" >
              <el-select class="pos_list" v-model="selectPosition2" placeholder="请选择岗位" style="width:120px;">
                <el-option v-for="item in position_list" :key="item.id" :label="item.name" :value="item.id">
                </el-option> 
              </el-select>
              <el-input class="sm_input" :disabled="!selectPosition2" v-model="inputStaffName2" placeholder="请输入姓名并以空格隔开"></el-input>
              <i @click="inputPosStaff" class="addIcon el-icon-circle-plus-outline"></i>
            </div>
            <ul class="rolesList" v-if="storeVideoRole.length>0">
              <li v-for="(item,index) in storeVideoRole" :key="index">
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
              <input v-model="videoForm.source" maxlength="30" type="text"/>
              <span>{{videoForm.source.length}}/30</span>
            </div>
          </div>
          <div class="item">
            <h3>简介（选填）</h3>
            <div class="input">
              <textarea v-model="videoForm.desc" maxlength="300" placeholder="请输入视频内容简介（选填）"></textarea>
              <span>{{videoForm.desc?videoForm.desc.length:0}}/300</span>
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
        <a href="javascript:;" class="btn active" @click="clickSaveVideoDraft()" v-if="vfrom == '2'">保存并送审</a>
        <a href="javascript:;" class="btn active" @click="clickSaveVideoDraft()" v-if="vfrom == '3'">保存并发布</a>
        <a href="javascript:;" class="btn active" @click="clickSaveVideoDraft()" v-if="vfrom == '4'">保存并恢复上架</a>
        <a href="javascript:;" class="btn" @click="clickGoBack()">取消修改</a>
      </div>
    </div>
    <el-dialog class="insert-image-model" title="设置封面图" :visible.sync="setVideoCoverModelShow" width="820px" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-tabs>
        <el-tab-pane label="系统封面">
          <div class="content">
            <ul class="list scroll">
              <li style="height: auto;" v-for="(item,index) in setVideoSystemCoverList" :key="index" :class="{active:item ==setVideoSystemCoverCheckUrl}" @click="setVideoSystemCoverCheckUrl = item">
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
              <el-upload
                class="upload"
                :action="uploadUrl"
                :on-change="setVideoCoverChangeUpload"
                accept="image/*"
                :show-file-list="false"
                :auto-upload="false">
                <el-button type="primary" >上传图片</el-button>
              </el-upload>
              <span>封面图最大支持5M,支持jpg,jpeg及png.</span>
            </div>
            <div class="preview clearfix">
              <div class="cropper-box">
                <vueCropper
                  ref="cropper"
                  :img="setVideoCropperImg"
                  autoCrop
                  :canScale="false"
                  :canMove="false"
                  infoTrue
                  centerBox
                  full
                  fixed
                  :fixedNumber="[750,480]"
                  :autoCropWidth="750"
                  :autoCropHeight="480"
                  @realTime="realTime"
                  style="height: 100%;"
                ></vueCropper>
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

  </div>
</template>

<script>
  export default {
    data() {
      return {
        uploadUrl:apiHost+'/common/upload',
        queryId:'',
        vfrom:'2',// 2:二审环节   3:三审环节  4:已下架
        active_index: '3',

        videoForm:{
          id:'',
          status:'',
          type:'3',
          title:'',
          contributorSign:'',
          content :'',
          source :'',
          channelPid :'',
          isStick:'0',
          stickTime:0,
          isCarousel :'0',
          cover :'',
          desc:'',
          isComment :'0',
          staffList: ''
        },
        videoCover1:'',
        videoCheckUrl:'',
        videoCheckUrlCover:'',
        videoClassify:[],

        oldVideoForm:{},
        oldVideoCover1:'',
        oldVideoCheckUrl:'',

        isStick:false,
        isCarousel:false,
        isComment:true,

        setVideoCoverModelShow:false,
        setVideoSystemCoverList:[],
        setVideoSystemCoverCheckUrl:'',
        setVideoCropperImg:'',
        setVideoCropperPreviews:{},
        setVideoCropperPreviewStyle:{},
        loading: false,
        // 署名相关
        storeVideoRole: [],
        position_list: [], // 岗位列表
        selectPosition2: '', // 外链当前选择的岗位
        inputStaffName2: '', // 对应岗位输入的姓名
        publishStatus: '' // 发布状态
      }
    },
    watch:{
      isStick:function (val) {
        this.videoForm.isStick = val ? '1' : '0';
        if(val) this.isTopic = this.isCarousel =false;
      },
      isCarousel:function (val) {
        this.videoForm.isCarousel = val ? '1' : '0';
        if(val) this.isTopic = this.isStick =false;
      },
      isComment:function (val) {
        this.videoForm.isComment = val ? '0' : '1';
      }
    },
    created() {
      var self = this;
      if (self.$route.query.vfrom && self.$route.query.vfrom != 'undefined') {
        self.vfrom = self.$route.query.vfrom;
        self.publishStatus = self.$route.query.status;
      }
      this.getVideoClassifyList();
      this.hashChange();
      this.getPositionList();
    },
    beforeRouteLeave (to, from, next) {
      var hasChange=false;
      for(var key in this.oldVideoForm){
        if(this.videoForm[key] != this.oldVideoForm[key]){
          hasChange=true;
        }
      }
      if(this.videoCover1!=this.oldVideoCover1
        || this.videoCheckUrl!=this.oldVideoCheckUrl
      ){
        hasChange=true;
      }
      console.log('内容是否有变化：'+hasChange);
      if(hasChange){
        this.$confirm('内容有变化，离开将不保存编辑的内容，是否继续离开？', '提示', {
          confirmButtonText: '继续离开',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          next();
        }).catch(() => {
          console.log('取消离开')
        });
      }else {
        next();
      }
    },
    methods:{
      hashChange: function () {
        var self = this;
        if (self.$route.query.id && self.$route.query.id != 'undefined') {
          self.queryId = self.$route.query.id;
          self.videoForm.id=self.queryId;
          self.getVideoDraftDetail();
        }
      },
      videoFormBackup(){
        var self=this;
        self.oldVideoForm=JSON.parse(JSON.stringify(self.videoForm));
        self.oldVideoCover1=self.videoCover1;
        self.oldVideoCheckUrl=self.videoCheckUrl;
      },
      //获取视频类型数据
      getVideoClassifyList:function (channelPid) {
        var self=this;
        self.videoClassify=[];
        self.$jqAjax({
          url:apiHost + '/user/getVideoChannel',
          success:function (data) {
            if(data.code === "0" && data.data){
              self.videoClassify=data.data;
              if(self.videoClassify.length>0) {
                self.videoForm.channelPid= channelPid ? channelPid : self.videoClassify[0].id;
              }
            }
          }
        })

      },
      //获取视频草稿内容
      getVideoDraftDetail: function () {
        var self = this;
        if (self.queryId) {
          self.loading = true;
          self.$jqAjax({
            url: self.vfrom == '4'? apiHost + "/context/published/detail" : apiHost + "/context/approve/detail",
            data: {
              id: self.queryId
            },
            success: function (data) {
              self.loading = false;
              if (data.code == 0 && data.data) {
                self.videoForm = data.data;
                if(self.videoForm.content) {
                  self.videoCheckUrl = JSON.parse(self.videoForm.content).url;
                }
                if(self.videoForm.cover){
                  try {
                    var coverArr=JSON.parse(self.videoForm.cover);
                    if(coverArr[0]) self.videoCover1 = self.videoCheckUrlCover = coverArr[0].url;
                  }catch (e){}
                }
                if(self.videoForm.isStick) self.isStick = self.videoForm.isStick == '1';
                if(self.videoForm.isCarousel) self.isCarousel = self.videoForm.isCarousel == '1';
                if(self.videoForm.isComment) self.isComment = self.videoForm.isComment != '1';
                self.getSignInfo();
                self.videoFormBackup();
                self.getVideoClassifyList(self.videoForm.channelPid);
              }
            }
          })
        }
      },
      getSignInfo () { // type:1,3,6 文章/视频/外链
        this.$jqAjax({
          url: apiHost + '/staff/getContextStaffList',
          type: 'POST',
          data: {
            cid: this.videoForm.cid
          },
          success: (res) => {
            if (res.code == 0) {
              console.log(res)
              let list = res.data;
              let store = [];
              list.map((item, index) => {
                store.push({
                  posName: item.positionName,
                  staffName: item.staffName,
                  posId: item.pid,
                  isShow: item.isShow == 0 ? true: false,
                  isEdit: false
                });
              });
              this.storeVideoRole = store;
            }
          },
          error: (err) => {
            console.log(err);
          }
        });
      },
      //短视频保存并送审
      clickSaveVideoDraft:function () {
        var self = this;
        if (!self.videoForm.title) {
          self.$alert('请输入标题', '提示', {
            type: 'warning'
          });
          return;
        }else if (self.videoForm.title.length<6) {
          self.$alert('标题至少输入6个字', '提示', {
            type: 'warning'
          });
          return;
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
          self.saveVideoData(value);
        }).catch(() => {

        });
      },
      //短视频保存数据
      saveVideoData:function (remark) {
        var self=this;
        var sucMsg='视频已保存并送审成功!';
        var url='/context/approve/editor/update';
        if(self.vfrom == '3'){
          sucMsg='视频已保存并发布成功!';
          url='/context/approve/checker/update';
        }else if(self.vfrom == '4'){
          sucMsg='视频已保存并恢复上架成功!';
           if (self.publishStatus == '7') {
            url='/context/published/updateOnline';
          } else {
            url='/context/published/update'; // 下架了
          }
        }

        self.loading=true;
        self.videoForm.status = self.vfrom == '2' ? '4' : '7';
        self.videoForm.cover = JSON.stringify([{
          url:self.videoCover1
        }]);
        if (this.storeVideoRole && this.storeVideoRole.length > 0) {
          let arr = [];
          for (let item of this.storeVideoRole) {
            arr.push({
              posId: item.posId,
              staffName: item.staffName,
              isShow: item.isShow ? 0 : 1
            });
          }
          this.videoForm.model = JSON.stringify(arr);
        } else {
          this.videoForm.model = '';
        }
        self.videoForm.remark = remark;
        self.$ajax({
          url:url,
          data:self.videoForm,
          success:function (data) {
            self.loading=false;
            if(data.code === "0"){
              self.$message({
                showClose: true,
                message:  sucMsg,
                type: 'success'
              });
              self.videoFormBackup();

              setTimeout(function () {
                if(self.vfrom == '2'){
                  self.$router.push('/layout/edit-edit?index=1&type=3');
                }else if(self.vfrom == '3'){
                  self.$router.push('/layout/edit-publish?index=1&type=3');
                }else if(self.vfrom == '4'){
                  self.$router.push('/layout/published-normal?index=0&type=3');
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
                self.$router.push('/layout/edit-edit?index=1&type=3');
              }else if(self.vfrom == '3'){
                self.$router.push('/layout/edit-publish?index=1&type=3');
              }else if(self.vfrom == '4'){
                self.$router.push('/layout/published-normal?index=0&type=3');
              }else {
                self.$router.go(-1)
              }
            }
          }
        })

      },




      //点击设置封面图
      openSetVideoCover:function () {
        this.showCapture();
        this.setVideoSystemCoverCheckUrl=this.videoCover1;
        this.setVideoCoverModelShow=true;
      },
      //视频截图
      showCapture() {
        var self=this;
        self.setVideoSystemCoverList = [];
        if(self.videoCheckUrl && self.videoCheckUrl.indexOf('aliyuncs.com')>-1){
          var duration=document.getElementById('video-check-box').duration;
          console.log(duration)
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
          this.$alert('请选择视频封面', '提示', {
            type: 'warning'
          });
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
      deleteRole (index) {
        this.storeVideoRole.splice(index, 1);
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
        storeArr = this.storeVideoRole;
        selectPosition = this.selectPosition2;
        addStaffName = this.inputStaffName2;
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
        this.inputStaffName2 = '';
      },
      toggleView (index) {
        this.$set(this.storeVideoRole[index], 'isShow', !this.storeVideoRole[index].isShow);
      },
      editRole (index) {
        this.$set(this.storeVideoRole[index], 'isEdit', !this.storeVideoRole[index].isEdit);
      },

    }
  }
</script>

<style lang="scss" scoped>
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
</style>
