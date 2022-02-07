<template>
  <div id="create-create" v-loading.lock="loading">
    <div class="contents-top clearfix">
      <div class="write-box tab scroll" id="write-box">
        <el-tabs v-model="active_index">
          <el-tab-pane label="外链发文" name="6">
            <div class="link-article">
              <div class="write-title">
                <input v-model="linkArticleForm.title" maxlength="60" type="text" placeholder="请在这里输入标题（6～60个字）"/>
                <span>{{linkArticleForm.title.length}}/60</span>
              </div>
              <div class="item">
                <h3>外部链接</h3>
                <div class="input clearfix">
                  <input class="link-href" v-model="linkUrlInput" @keyup.enter="linkUrlPreview = linkUrlInput" type="text" placeholder="必填, 格式(http://www.baidu.com)"/>
                  <a href="javascript:;" class="btn active" @click="previewOutLink">预览</a>
                  <a href="javascript:;" class="btn btn-new active" @click="previewInTab">新窗口打开</a>
                </div>
              </div>
              <div class="item">
                <h3>预览内容</h3>
                <div class="link-iframe no-content" v-if="!linkUrlPreview">
                  <p>暂无预览的内容</p>
                </div>
                <iframe id="link-iframe" class="link-iframe" :src="linkUrlPreview" v-show="linkUrlPreview"></iframe>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="publish-box scroll">
        <div class="publish-article" >
          <h3 class="title">发布设置</h3>
          <div class="item">
            <h3>频道</h3>
            <div>
              <a href="javascript:;" class="btn"
                 v-for="item in parentChannelList" :key="item.id"
                 :class="{'active':linkArticleForm.channelPid == item.id}"
                 @click="getChildrenChannelList(item.id)">{{item.name}}</a>
            </div>
          </div>
          <div class="item" v-if="childrenChannelList.length>0">
            <h3>子频道</h3>
            <div>
              <a href="javascript:;" class="btn"
                 v-for="item in childrenChannelList" :key="item.id"
                 :class="{'active':linkArticleForm.channelId == item.id}"
                 @click="linkArticleForm.channelId = item.id">{{item.name}}</a>
            </div>
          </div>

          <div class="item">
            <h3>展示设置 (可选)</h3>
            <div class="row">
              <el-checkbox v-model="isStick">设为置顶</el-checkbox>
              <span v-show="isStick">置顶时长:</span>
              <el-select v-model="linkArticleForm.stickTime" v-show="isStick">
                <el-option label="不限" :value="0"></el-option>
                <el-option label="5小时" :value="5"></el-option>
                <el-option label="10小时" :value="10"></el-option>
                <el-option label="1天" :value="24"></el-option>
                <el-option label="2天" :value="48"></el-option>
                <el-option label="3天" :value="72"></el-option>
              </el-select>
            </div>
            <!-- <div class="row">
              <el-checkbox v-model="isTopic" :disabled="topicList.length==0">选入专题</el-checkbox>
              <span v-show="isTopic && topicList.length>0">专题名称:</span>
              <el-select v-model="linkArticleForm.topicId" v-show="isTopic && topicList.length>0">
                <el-option v-for="item in topicList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div> -->
            <div class="row">
              <el-checkbox v-model="isCarousel">选入轮播</el-checkbox>
            </div>
          </div>

          <div class="item">
            <el-radio v-model="linkArticleForm.coverType" label="0">普通封面</el-radio>
            <el-radio v-model="linkArticleForm.coverType" label="1">大图封面</el-radio>
          </div>
          <div class="item">
            <img-upload v-if="linkArticleForm.coverType==1" :size="[240,150]" :imgSrcName="'linkArticleCoverBig'" :imgSrc="linkArticleCoverBig" :uploadUrl="uploadUrl" @delImgSrc="linkArticleCoverBig=''" @changeImgSrc="changeImgSrc"></img-upload>
            <img-upload v-if="linkArticleForm.coverType!=1" :size="[112,90]" :imgSrcName="'linkArticleCover1'" :imgSrc="linkArticleCover1" :uploadUrl="uploadUrl" @delImgSrc="linkArticleCover1=''" @changeImgSrc="changeImgSrc"></img-upload>
            <img-upload v-if="linkArticleForm.coverType!=1" :size="[112,90]" :imgSrcName="'linkArticleCover2'" :imgSrc="linkArticleCover2" :uploadUrl="uploadUrl" @delImgSrc="linkArticleCover2=''" @changeImgSrc="changeImgSrc"></img-upload>
            <img-upload v-if="linkArticleForm.coverType!=1" :size="[112,90]" :imgSrcName="'linkArticleCover3'" :imgSrc="linkArticleCover3" :uploadUrl="uploadUrl" @delImgSrc="linkArticleCover3=''" @changeImgSrc="changeImgSrc"></img-upload>
          </div>
          <div class="item">
            <h3>署名（选填）</h3>
            <div class="sm_input_area"  @keyup.enter="inputPosStaff" >
              <el-select class="pos_list" v-model="selectPosition3" placeholder="请选择岗位" style="width:120px;">
                <el-option v-for="item in position_list" :key="item.id" :label="item.name" :value="item.id">
                </el-option> 
              </el-select>
              <el-input class="sm_input" :disabled="!selectPosition3" v-model="inputStaffName3" placeholder="请输入姓名并以空格隔开"></el-input>
              <i @click="inputPosStaff" class="addIcon el-icon-circle-plus-outline"></i>
            </div>
            <ul class="rolesList" v-if="storeLinkRole.length>0">
              <li v-for="(item,index) in storeLinkRole" :key="index">
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
              <input v-model="linkArticleForm.source" maxlength="30" type="text"/>
              <span>{{linkArticleForm.source.length}}/30</span>
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
        <a href="javascript:;" class="btn active" @click="clickSaveArticleDraft()" v-if="vfrom == '2'">保存并送审</a>
        <a href="javascript:;" class="btn active" @click="clickSaveArticleDraft()" v-if="vfrom == '3'">保存并发布</a>
        <a href="javascript:;" class="btn active" @click="clickSaveArticleDraft()" v-if="vfrom == '4'">保存并恢复上架</a>
        <a href="javascript:;" class="btn" @click="clickGoBack()">取消修改</a>
      </div>
    </div>
  </div>
</template>

<script>
  import imgUpload from './../../../components/imgUpload.vue';
  export default {
    data() {
      return {
        uploadUrl:apiHost+'/common/upload',
        queryId:'',
        vfrom:'2',// 2:二审环节   3:三审环节  4:已下架
        active_index: '6',
        linkArticleForm:{
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
          staffList: ''
        },
        linkUrlInput:'',
        linkUrlPreview:'',
        linkArticleCoverBig: '',
        linkArticleCover1:'',
        linkArticleCover2:'',
        linkArticleCover3:'',
        parentChannelList:[],
        childrenChannelList:[],
        oldLinkArticleForm:{},
        oldLinkUrlInput:'',
        oldLinkArticleCoverBig: '',
        oldLinkArticleCover1:'',
        oldLinkArticleCover2:'',
        oldLinkArticleCover3:'',
        isStick:false,
        isTopic:false,
        topicList:[],
        isCarousel:false,
        isComment:true,
        loading: false,
        storeLinkRole: [],
        // 署名相关
        position_list: [], // 岗位列表
        selectPosition3: '', // 外链当前选择的岗位
        inputStaffName3: '', // 对应岗位输入的姓名
        publishStatus: '' // 发布状态
      }
    },
    components: {
      imgUpload
    },
    watch:{
      isStick:function (val) {
        this.linkArticleForm.isStick = val ? '1' : '0';
        if(val) this.isTopic = this.isCarousel =false;
      },
      isTopic:function (val) {
        if(val && this.topicList.length>0){
          this.linkArticleForm.topicId = this.topicList[0].id;
        }else {
          this.linkArticleForm.topicId = '0';
        }
        if(val) this.isStick = this.isCarousel =false;
      },
      isCarousel:function (val) {
        this.linkArticleForm.isCarousel = val ? '1' : '0';
        if(val) this.isTopic = this.isStick =false;
      },
      isComment:function (val) {
        this.linkArticleForm.isComment = val ? '0' : '1';
      },
      'linkArticleForm.channelPid':function (val) {
        this.getTopicList(this.linkArticleForm.channelPid,this.linkArticleForm.channelId)
      },
      'linkArticleForm.channelId':function (val) {
        this.getTopicList(this.linkArticleForm.channelPid,this.linkArticleForm.channelId)
      },
    },
    created() {
      this.getParentChannelList();
      this.hashChange();
      this.getPositionList();
    },
    mounted() {
      this.resetIframeHeight();
    },
    beforeRouteLeave (to, from, next) {
      var hasChange=false;
      for(var key in this.oldLinkArticleForm){
        if(this.linkArticleForm[key] != this.oldLinkArticleForm[key]){
          hasChange=true;
        }
      }
      if (this.linkArticleForm.coverType == 0) {
        if(this.linkUrlInput!=this.oldLinkUrlInput
          || this.linkArticleCover1!=this.oldLinkArticleCover1
          || this.linkArticleCover2!=this.oldLinkArticleCover2
          || this.linkArticleCover3!=this.oldLinkArticleCover3
        ){
          hasChange=true;
        }
      } else {
        if(this.linkUrlInput!=this.oldLinkUrlInput
          || this.linkArticleCoverBig!=this.oldLinkArticleCoverBig
        ){
          hasChange=true;
        }
      }
      
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
        if (self.$route.query.vfrom && self.$route.query.vfrom != 'undefined') {
          self.vfrom = self.$route.query.vfrom;
          self.publishStatus = self.$route.query.status;
        }
        if (self.$route.query.id && self.$route.query.id != 'undefined') {
          self.queryId = self.$route.query.id;
          self.linkArticleForm.id=self.queryId;
          self.getArticleDraftDetail();
        }
      },
      linkArticleFormBackup(){
        var self=this;
        self.oldLinkArticleForm=JSON.parse(JSON.stringify(self.linkArticleForm));
        self.oldLinkUrlInput=self.linkUrlInput;
        self.oldLinkArticleCoverBig=self.linkArticleCoverBig;
        self.oldLinkArticleCover1=self.linkArticleCover1;
        self.oldLinkArticleCover2=self.linkArticleCover2;
        self.oldLinkArticleCover3=self.linkArticleCover3;
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
        self.linkArticleForm.channelPid = id;
        self.childrenChannelList=[];
        self.linkArticleForm.channelId = channelId || '';
        self.$jqAjax({
          url:apiHost + '/user/getNewsChannel',
          data:{
            pid:id
          },
          success:function (data) {
            if(data.code === "0" && data.data && data.data[0]){
              self.childrenChannelList=data.data;
              self.linkArticleForm.channelId = channelId ? channelId : data.data[0].id
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
                self.linkArticleForm.topicId = self.topicList[0].id;
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
                self.linkArticleForm = data.data;
                if(self.linkArticleForm.content) self.linkUrlInput=self.linkUrlPreview = self.linkArticleForm.content;
                if(self.linkArticleForm.cover){
                  try {
                    var coverArr=JSON.parse(self.linkArticleForm.cover);
                    if (self.linkArticleForm.coverType == 0) {
                      if(coverArr[0]) self.linkArticleCover1 = coverArr[0].url;
                      if(coverArr[1]) self.linkArticleCover2 = coverArr[1].url;
                      if(coverArr[2]) self.linkArticleCover3 = coverArr[2].url;
                    } else {
                      if(coverArr[0]) self.linkArticleCoverBig = coverArr[0].url;
                    }
                  }catch (e){
                    console.log('ee', e)
                  }
                }
                self.getChildrenChannelList(self.linkArticleForm.channelPid,self.linkArticleForm.channelId);
                self.getSignInfo();
                if(self.linkArticleForm.isStick) self.isStick = self.linkArticleForm.isStick == '1';
                if(self.linkArticleForm.isCarousel) self.isCarousel = self.linkArticleForm.isCarousel == '1';
                if(self.linkArticleForm.isComment) self.isComment = self.linkArticleForm.isComment != '1';
                if(self.linkArticleForm.topicId && self.linkArticleForm.topicId!='0') self.isTopic=true;

                self.linkArticleFormBackup();
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
            cid: this.linkArticleForm.cid
          },
          success: (res) => {
            if (res.code == 0) {
              let list = res.data;
              let store = [];
              list.map((item, index) => {
                if (item.id && item.positionName) {
                  store.push({
                    posName: item.positionName,
                    staffName: item.staffName,
                    posId: item.pid,
                    isShow: item.isShow == 0 ? true: false,
                    isEdit: false
                  });
                }
              });
              this.storeLinkRole = store;
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
        if (!self.linkArticleForm.title) {
          this.$message({type: 'warning', message: '请输入标题', showClose: true});
          return;
        }else if (self.linkArticleForm.title.length < 6) {
          this.$message({type: 'warning', message: '标题至少输入6个字', showClose: true});
          return;
        }
        if (!self.linkUrlInput) {
          this.$message({type: 'warning', message: '请输入外部链接', showClose: true});
            return;
          return;
        }
        // 提示选入轮播，但没封面图
        if (this.linkArticleForm.isCarousel == 1) {
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
        if (this.linkArticleForm.coverType == 0) {
          if(this.linkArticleCover1) coverArr.push({url:this.linkArticleCover1});
          if(this.linkArticleCover2) coverArr.push({url:this.linkArticleCover2});
          if(this.linkArticleCover3) coverArr.push({url:this.linkArticleCover3});
        } else {
          if(this.linkArticleCoverBig) coverArr.push({url:this.linkArticleCoverBig});
        }
        return coverArr;
      },
      //写文章保存数据
      saveArticleData:function (remark) {
        var self=this;
        var sucMsg='外链文章已保存并送审成功!';
        var url='/context/approve/editor/update';
        if(self.vfrom == '3'){
          sucMsg='外链文章已保存并发布成功!';
          url='/context/approve/checker/update';
        }else if(self.vfrom == '4'){
          sucMsg='外链文章已保存并恢复上架成功!';
          if (self.publishStatus == '7') {
            url='/context/published/updateOnline';
          } else {
            url='/context/published/update'; // 下架了
          }
        }

        self.loading=true;
        var coverArr = this.dealCover();
        if (coverArr.length > 0) {
          self.linkArticleForm.cover = JSON.stringify(coverArr);
        } else {
          self.linkArticleForm.cover = '';
        }
        
        self.linkArticleForm.remark = remark;
        self.linkArticleForm.status = self.vfrom == '2' ? '4' : '7';
        if (this.storeLinkRole && this.storeLinkRole.length > 0) {
          let arr = [];
          for (let item of this.storeLinkRole) {
            arr.push({
              posId: item.posId,
              staffName: item.staffName,
              isShow: item.isShow ? 0 : 1
            });
          }
          this.linkArticleForm.model = JSON.stringify(arr);
        } else {
          this.linkArticleForm.model = '';
        }

        self.$ajax({
          url:url,
          data:self.linkArticleForm,
          success:function (data) {
            self.loading=false;
            if(data.code === "0"){
              self.$message({
                showClose: true,
                message:  sucMsg,
                type: 'success'
              });
              self.linkArticleFormBackup();

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
      linkSuccessUpload1(data, file) {
        var self = this;
        if (data.code == "0" && data.data && data.data.url) {
          self.linkArticleCover1=data.data.url;
        } else {
          self.$message({
            type: 'error',
            message: '上传失败',
            showClose: 'true'
          })
        }
      },
      linkSuccessUploadBig (data, file) {
        var self = this;
        if (data.code == "0" && data.data && data.data.url) {
          self.linkArticleCoverBig=data.data.url;
        } else {
          self.$message({
            type: 'error',
            message: '上传失败',
            showClose: 'true'
          })
        }
      },
      linkSuccessUpload2(data, file) {
        var self = this;
        if (data.code == "0" && data.data && data.data.url) {
          self.linkArticleCover2=data.data.url;
        } else {
          self.$message({
            type: 'error',
            message: '上传失败',
            showClose: 'true'
          })
        }
      },
      linkSuccessUpload3(data, file) {
        var self = this;
        if (data.code == "0" && data.data && data.data.url) {
          self.linkArticleCover3=data.data.url;
        } else {
          self.$message({
            type: 'error',
            message: '上传失败',
            showClose: 'true'
          })
        }
      },

      resetIframeHeight(){
        this.$('#link-iframe').height(this.$('#write-box').width() - 322)
      },
      filterByName (val) {
        this.positionList = [];
        if (!val) return;
        this.filterSearchflag = setTimeout(() => {
          this.$jqAjax({
            url: apiHost + '/staff/getStaffMiniList',
            type: 'POST',
            data: {
              name: val
            },
            success: (res) => {
              if (res.code == 0) {
                console.log(res)
                let list = res.data;
                list.map((item, index) => {
                  list[index].label = item.positionName+'：'+item.staffName;
                  list[index].value = item.positionName+'：'+item.staffName+','+item.id;
                });
                this.positionList = list;
              }
            },
            error: (err) => {
              console.log(err);
            }
          });
        }, 200);
      },
      selectStaffChange(val) {
        this.positionList = [];
        let role = val.split(',');
        this.linkArticleForm.contributorSign = '';
        this.storeLinkRole.push({
          roleName: role[0],
          id: role[1]
        });
      },
      deleteRole (index) {
        this.storeLinkRole.splice(index, 1);
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
        storeArr = this.storeLinkRole;
        selectPosition = this.selectPosition3;
        addStaffName = this.inputStaffName3;
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
        this.inputStaffName3 = '';
      },
      toggleView (index) {
        this.$set(this.storeLinkRole[index], 'isShow', !this.storeLinkRole[index].isShow);
      },
      editRole (index) {
        this.$set(this.storeLinkRole[index], 'isEdit', !this.storeLinkRole[index].isEdit);
      },
      // 上传图片
      changeImgSrc (img, name) {
        switch (name) {
          case 'linkArticleCoverBig':
            this.linkArticleCoverBig = img;
            break;
          case 'linkArticleCover1':
            this.linkArticleCover1 = img;
            break;
          case 'linkArticleCover2':
            this.linkArticleCover2 = img;
            break;
          case 'linkArticleCover3':
            this.linkArticleCover3 = img;
            break;
        }
      },
      previewOutLink () {
        this.linkUrlPreview = this.linkUrlInput;
        if (this.linkUrlInput.indexOf('https') == -1 && this.linkUrlInput.indexOf('http') > -1 ) {
          this.$message({type: 'warning', message: '浏览器出于安全考虑，无法在https域名下预览http链接,请在新窗口打开预览'});
        }
      },
      previewInTab () {
        if (this.linkUrlInput.indexOf('https') > -1 || this.linkUrlInput.indexOf('http') > -1 ) {
          window.open(this.linkUrlInput);
        }
      }
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
