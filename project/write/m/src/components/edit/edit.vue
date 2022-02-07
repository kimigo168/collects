<template>
  <div id="edit">
    <Header title="稿件编辑"></Header>

    <div class="edit-box" :class="{'show-ai-model': !canWrite && aiModelShow,'show-ai-model2': !canWrite && !aiModelShow}">
      <h3
        id="title-html"
        class="title"
        @input="titleChange()"
        :contenteditable="canWrite"
        :class="{'empty':!title}"
      ></h3>

      <div id="article-html" class="article" :class="{'is-not-edit':!canWrite}" @input="articleChange()" :contenteditable="canWrite"></div>
    </div>

    <div class="menu-show-btn" :class="{'show-ai-model': !canWrite && aiModelShow,'show-ai-model2': !canWrite && !aiModelShow}">
      <a class="btn" href="javascript:;" @tap="menuModelShow=true"></a>
      <a class="btn btn2 btn-show-tip" href="javascript:;" @tap="canWrite=true" v-show="!canWrite"></a>
      <a class="btn btn3" href="javascript:;" @tap="canWrite=false" v-show="canWrite"></a>
    </div>

    <div class="ai-model" v-show="!canWrite">
      <div class="tabs" @tap.stop="aiModelShow = !aiModelShow">
        <a href="javascript:;" :class="{'active': aiActive == 1}" @tap.stop="aiActive = 1" onclick="_czc.push(['_trackEvent','编辑器','点击推荐菜单','段落'])">段落</a>
        <a href="javascript:;" :class="{'active': aiActive == 2}" @tap.stop="aiActive = 2" onclick="_czc.push(['_trackEvent','编辑器','点击推荐菜单','文章'])">文章</a>
        <a href="javascript:;" :class="{'active': aiActive == 3}" @tap.stop="aiActive = 3" onclick="_czc.push(['_trackEvent','编辑器','点击推荐菜单','知识'])">知识</a>
      </div>
      <div class="content-list" :class="{'show': aiModelShow}">

        <p class="no-tip" v-show="!aiModelShow" @tap="aiModelShow=true">点击具体段落进行段落联想</p>

        <div class="list-item list-item1 scroll" v-show="aiActive == 1" data="段落">
          <div class="select-tab">
            <a href="javascript:;" :class="{'active': sucaiType == ''}" @tap="getSucaiListData1()">默认话题素材</a>
            <a href="javascript:;" class="other-tab" :class="{'active': sucaiType != ''}">
                <span @tap="sucaiOtherTypeShow=!sucaiOtherTypeShow;" onclick="_czc.push(['_trackEvent','编辑器','点击拓展话题按钮'])">
                  <em>{{sucaiType == '' ? '扩展话题素材' : sucaiType}}</em>
                  <i></i>
                </span>
              <div class="option" v-show="sucaiOtherTypeShow">
                <a href="javascript:;" v-for="item in topicExtractionList" :class="{'active': sucaiType == item}"
                   @tap="getSucaiListData2(item)">{{item}}</a>
              </div>
            </a>
          </div>

          <ul class="list">
            <li v-for="(item,$index) in sucaiList">
              <p>{{item.content}}</p>
              <span>来自话题：{{sucaiSite}}</span>
              <a class="btn" href="javascript:;" @tap="editAiContent(item.content)" v-show="!tipModelShow5 || $index>0">
                <img src="../../assets/images/more.png"/>
              </a>
            </li>
          </ul>

        </div>

        <div class="list-item list-item2 scroll" v-show="aiActive == 2" data="文章">
          <ul class="list">
            <li v-for="(item,$index) in articleList" @tap="checkArticleSection(item,$index)">
              <img class="pic" :src=" item.image && item.image[0] ? item.image[0] : normalImgUrl "  onerror="this.src = './static/public/images/normal-img.png'"/>
              <h3>{{item.title}}</h3>
              <p>{{item.content}}</p>
              <span>{{item.site}}</span>

              <img class="icon" src="../../assets/images/edit-icon-jiantou.png"/>
            </li>
          </ul>

          <div class="list-detail list-item list-item1 scroll" v-show="articleDetailShow">
            <h3 class="title clearfix">
              <a class="back" href="javascript:;" @tap="articleDetailShow=false"><img
                src="../../assets/images/user-icon_01.png"/></a>
              <span>{{articleDetailTitle}}</span>
            </h3>
            <ul class="list">
              <li v-for="item in articleDetailList">
                <p>{{item}}</p>
                <a class="btn" href="javascript:;" @tap="editAiContent(item)">
                  <img src="../../assets/images/more.png"/>
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div class="list-item list-item1 list-item2 list-item3 scroll" v-show="aiActive == 3" data="知识">

          <div class="item-tabs">
            <a href="javascript:;" :class="{'active':zhishiActive==1}" @tap="zhishiActive=1">好词好句</a>
            <a href="javascript:;" :class="{'active':zhishiActive==2}" @tap="zhishiActive=2">知乎</a>
            <a href="javascript:;" :class="{'active':zhishiActive==3}" @tap="zhishiActive=3">百度知道</a>
            <a href="javascript:;" :class="{'active':zhishiActive==4}" @tap="zhishiActive=4">百度百科</a>
          </div>

          <ul class="list2" v-show="zhishiActive==1">
            <li class="list-title">好词好句</li>
            <li v-for="item in goodSentencesList">
              <p>{{item.content}}</p>
              <a class="btn" href="javascript:;" @tap="editAiContent(item.content)">
                <img src="../../assets/images/more.png"/>
              </a>
            </li>
          </ul>

          <ul class="list" v-show="zhishiActive==2">
            <li class="list-title">知乎</li>
            <li v-for="(item,$index) in zhihuList" @tap="checkZhishiSection(item.title,item.content,$index,'点击知乎文章查看')">
              <img class="pic" :src=" item.author && item.author.avatarUrl ? item.author.avatarUrl : normalImgUrl "  onerror="this.src = './static/public/images/normal-img.png'"/>
              <h3 v-html="item.title"></h3>
              <span><i>{{item.author.name}}</i>{{item.updatedTime}}</span>
              <p v-html="item.excerpt"></p>

              <img class="icon" src="../../assets/images/edit-icon-jiantou.png"/>
            </li>
          </ul>

          <ul class="list" v-show="zhishiActive==3">
            <li class="list-title">百度知道</li>
            <li v-for="(item,$index) in zhidaoList" @tap="checkZhishiSection(item.title,item.content,$index,'点击百度知道文章查看')">
              <img class="pic" :src="item.author && item.author.avatarUrl ? item.author.avatarUrl : normalImgUrl "  onerror="this.src = './static/public/images/normal-img.png'"/>
              <h3 v-html="item.title"></h3>
              <span><i>{{item.author.name}}</i>{{item.updatedTime}}</span>
              <p v-html="item.excerpt"></p>

              <img class="icon" src="../../assets/images/edit-icon-jiantou.png"/>
            </li>
          </ul>

          <ul class="list" v-show="zhishiActive==4">
            <li class="list-title">百度百科</li>
            <li v-for="(item,$index) in baikeList"  @tap="checkZhishiSection(item.key,item.info,$index,'点击百度百科文章查看')">
              <img class="pic" :src="item.img" onerror="this.src = './static/public/images/normal-img.png'"/>
              <h3>{{item.key}}</h3>
              <span>{{item.update_time}}</span>
              <p>{{item.info}}</p>
              <img class="icon" src="../../assets/images/edit-icon-jiantou.png"/>
            </li>
          </ul>


          <div class="list-detail list-item list-item1 scroll" v-show="zhishiDetailShow">
            <h3 class="title clearfix">
              <a class="back" href="javascript:;" @tap="zhishiDetailShow=false"><img
                src="../../assets/images/user-icon_01.png"/></a>
              <span v-html="zhishiDetailTitle"></span>
            </h3>
            <ul class="list">
              <li>
                <div class="article" v-html="zhishiDetailContent"></div>
              </li>
            </ul>
          </div>

        </div>


      </div>
    </div>

    <transition name="router-fade" mode="out-in">
      <div class="normal-model ai-control-model" v-show="aiControlModelShow">
        <div class="model" @tap="aiControlModelShow=false"></div>
        <div class="content">
          <a href="javascript:;" @tap="insetSectionStart()">
            <img src="../../assets/images/ai-control_01.png"/>
            <span>插入当前段落前</span>
          </a>
          <a href="javascript:;" @tap="insetSectionEnd()">
            <img src="../../assets/images/ai-control_02.png"/>
            <span>插入当前段落后</span>
          </a>
          <a href="javascript:;" @tap="replaceSection()">
            <img src="../../assets/images/ai-control_03.png"/>
            <span>替换当前段落</span>
          </a>
          <a href="javascript:;" class="js-copy" :data-clipboard-text="aiControlEditContent" @tap="aiControlModelShow=false">
            <img src="../../assets/images/ai-control_04.png"/>
            <span>复制段落文字</span>
          </a>
        </div>
      </div>
    </transition>


    <transition name="router-fade" mode="out-in">
      <div class="bot-menu-model" v-show="menuModelShow">
        <div class="model" @tap="menuModelShow=false"></div>
        <div class="content">
          <div class="btns clearfix">
            <a href="javascript:;" @tap="clickChachong()">
              <i class="img">
                <img src="../../assets/images/edit-icon_05.png"/>
              </i>
              <span>稿件查重</span>
            </a>
            <a href="javascript:;" @tap="matchEcnetKeyword()">
              <i class="img">
                <img src="../../assets/images/edit-icon_06.png"/>
              </i>
              <span>稿件纠错</span>
            </a>
            <a href="javascript:;" @tap="clickSensitiveWord()">
              <i class="img">
                <img src="../../assets/images/edit-icon_08.png"/>
              </i>
              <span>敏感词检测</span>
            </a>
            <a href="javascript:;" @tap="clickRewrite()">
              <i class="img">
                <img src="../../assets/images/edit-icon_07.png"/>
              </i>
              <span>文章改写</span>
            </a>

            <a href="javascript:;" @tap="saveArticle()">
              <i class="img">
                <img src="../../assets/images/edit-icon_02.png"/>
              </i>
              <span>保存稿件</span>
            </a>
            <a href="javascript:;" class="js-copy" :data-clipboard-text="articleContent">
              <i class="img">
                <img src="../../assets/images/edit-icon_03.png"/>
              </i>
              <span>复制全文</span>
            </a>
            <a href="javascript:;" @tap="clickShare()">
              <i class="img">
                <img src="../../assets/images/edit-icon_04.png"/>
              </i>
              <span>分享</span>
            </a>
          </div>

          <p class="text">更多智能操作，请使用电脑访问：www.giiso.com</p>
        </div>
      </div>
    </transition>



    <transition name="router-fade" mode="out-in">
      <div class="normal-model duplicate-model" v-show="duplicateModelShow">
        <div class="model" @tap="duplicateModelShow=false"></div>
        <div class="content">
          <h3>确定进行稿件查重？</h3>
          <p>系统将基于大数据对稿件进行内容检测，请稍作等待，可在“<a>个人中心-查重结果</a>”查看</p>
          <div class="btns clearfix">
            <button type="button" class="btn3 left" @tap="duplicateModelShow=false">关闭</button>
            <button type="button" class="btn2 right" @tap="yesToChachong()">确定</button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="router-fade" mode="out-in">
      <div class="normal-model sensitive-tip" v-show="sensitiveShareModelShow">
        <div class="model" @tap="sensitiveShareModelShow=false"></div>
        <div class="content">
          <h3>检测到文中存在敏感词，确认继续分享？</h3>
          <div class="btns clearfix">
            <button type="button" class="btn3 left" @tap="sensitiveShareModelShow=false">取消</button>
            <button type="button" class="btn2 right" @tap="yesToShare()">确定</button>
          </div>
        </div>
      </div>
    </transition>

    <Rewrite :rewriteObj="rewriteObj" @propRewriteAll="propRewriteAll"></Rewrite>


    <div class="ecnet-tip-wrap" v-show="ecnetTipWrapShow" :style="{'top':ecnetTipWrapTop+'px','left':ecnetTipWrapleft+'px'}">
      <div @click="clickChangeEcnetKeyword()">{{ecnetNextKeyword}}</div>
      <div class="no" @click="clickEcnetIgnore()">忽略该错误</div>
    </div>

    <transition name="router-fade" mode="out-in">
      <div class="normal-model sensitive-model" v-show="sensitiveModelShow">
        <div class="model" @tap="sensitiveModelShow=false"></div>
        <div class="content">
          <a class="close" href="javascript:;" @tap="sensitiveModelShow=false"></a>
          <h3 class="title">敏感词检测<span>（检测到本文存在以下风险）</span></h3>
          <div class="list">
            <div class="check-all">
              <label>
                <input type="checkbox" v-model="sinsitiveCheckAll"/>
                <span>全选</span>
              </label>
            </div>
            <ul>
              <li v-for="(item1,$index) in sinsitiveKeywordList">
                <h4>
                  <input type="checkbox" :value="$index" v-model="sinsitiveRowCheck"/>
                  <span>内容包含{{item1.type}}信息</span>
                </h4>
                <p>
                  <span v-for="keyword in item1.words">{{keyword}}</span>
                </p>
              </li>
            </ul>
          </div>
          <div class="btns clearfix">
            <button type="button" class="btn3" @tap="yesToMatchSinsitiveKeyword()">在文中显示</button>
            <button type="button" class="btn2" @tap="sensitiveModelShow=false">确定</button>
          </div>
        </div>
      </div>
    </transition>
    <div class="ecnet-tip-wrap" v-show="sensitiveTipWrapShow" :style="{'top':sensitiveTipWrapTop+'px','left':sensitiveTipWrapleft+'px'}">
      <div class="no" @click="clickSinsitiveIgnore()">忽略</div>
    </div>


    <transition name="router-fade" mode="out-in">
      <div class="share-model" v-show="shareModelShow" @tap="shareModelShow=false">
        <img class="img" src="../../assets/images/hots-icon_02.png"/>
        <p class="text">点击右上角，分享你的写作成果！</p>
        <div class="bot">
          <p>该文章由Giiso写作机器人辅助创作而成</p>
          <a href="index.html">我也要体验AI写作</a>
        </div>
      </div>
    </transition>
    <transition name="router-fade" mode="out-in">
      <div class="tip-model tip-model1" v-show="tipModelShow1" @tap="tipModelShow1=false;tipModelShow2=true">
        <img class="icon" src="../../assets/images/edit-tip-icon_01.png"/>
        <p class="text">点击菜单按钮，打开或收起菜单</p>

        <div class="menu-show-btn show-ai-model2">
          <a class="btn" href="javascript:;"></a>
        </div>
      </div>
    </transition>
    <transition name="router-fade" mode="out-in">
      <div class="tip-model tip-model2" v-show="tipModelShow2" @tap="tipModelShow2=false;tipModelShow3=true">
        <img class="img" src="../../assets/images/edit-tip-img_02.png"/>
        <img class="icon" src="../../assets/images/edit-tip-icon_01.png"/>
        <p class="text">点击键盘按钮，切换至编辑模式</p>

        <div class="menu-show-btn show-ai-model2">
          <a class="btn btn2" href="javascript:;"></a>
        </div>
      </div>
    </transition>
    <transition name="router-fade" mode="out-in">
      <div class="tip-model tip-model3" v-show="tipModelShow3" @tap="closeTipModel3()">
        <img class="img" src="../../assets/images/edit-tip-img_01.png"/>
        <p class="text">点击写作机器人按钮，切换至<br>智能推荐模式</p>
      </div>
    </transition>
    <transition name="router-fade" mode="out-in">
      <div class="tip-model tip-model4" v-show="tipModelShow4" @tap="closeTipModel4()">
        <div class="content">
          <img class="img img1" src="../../assets/images/create-icon_02.png"/>
          <img class="img img2" src="../../assets/images/create-icon_02.png"/>
          <p class="text">滑动文章时，自动收起推荐内容</p>
        </div>
      </div>
    </transition>
    <transition name="router-fade" mode="out-in">
      <div class="tip-model tip-model5" v-show="tipModelShow5" @tap="tipModelShow5 = false">
        <img class="img" src="../../assets/images/more.png"/>
        <img class="icon" src="../../assets/images/edit-tip-icon_01.png"/>
        <p class="text">点击菜单按钮，使用段落对文章<br>进行智能编辑</p>
      </div>
    </transition>

  </div>
</template>

<script>
  import Clipboard from "clipboard";
  import Header from "../Header.vue";
  import Rewrite from "./rewrite.vue";

  export default {
    components: {
      Header,
      Rewrite
    },
    data: function () {
      return {
        normalImgUrl: './static/public/images/normal-img.png',

        writeType: "",
        editerId: "",

        title: "",
        articleHtml: "",

        canWrite: false,

        menuModelShow: false,
        shareModelShow: false,

        aiModelShow: false,
        aiActive: 1,
        sucaiType: '',
        topicExtractionList: [],
        sucaiOtherTypeShow: false,
        sucaiList: [],
        sucaiKeywords: [],
        sucaiSite: '',

        articleList: [],
        articleDetailShow: false,
        articleDetailTitle: '',
        articleDetailList: [],

        zhishiActive:1,
        zhishiSize:10,
        goodSentencesList:[],
        zhihuList:[],
        zhidaoList:[],
        baikeList:[],

        zhishiDetailShow: false,
        zhishiDetailTitle: '',
        zhishiDetailContent: '',

        selectSectionDom: null,
        selectSectionContent: '',

        aiControlModelShow: false,
        aiControlEditContent:'',


        tipModelShow1: false,
        tipModelShow2: false,
        tipModelShow3: false,
        tipModelShow4: false,
        tipModelShow5: false,


        duplicateModelShow: false,

        rewriteObj:{},

        ecnetTipWrapShow: false,
        ecnetTipWrapTop: 0,
        ecnetTipWrapleft: 0,
        ecnetNextKeyword: '',
        ecnetNextDom: null,


        sensitiveTipWrapShow: false,
        sensitiveTipWrapTop: 0,
        sensitiveTipWrapleft: 0,
        sensitiveNextDom: null,
        sensitiveModelShow:false,
        sinsitiveKeywordList:[],
        sinsitiveRowCheck:[],
        sinsitiveCheckAll:false,

        sensitiveShareModelShow: false,
      };
    },
    computed: {
      articleContent() {
        var str = this.articleHtml.replace(/<\/p>/g, "\n");
        str = str.replace(/<[^>]+>/g, "");
        return str;
      }
    },
    watch: {
      aiModelShow(val){
        if(val){
          if (!window.localStorage.hasShowEditTipModel4) {
            this.tipModelShow4 = true;
            this.aiActive=1;
          }
          this.ecnetTipWrapShow = false;
          this.sensitiveTipWrapShow = false;
        }
      },
      aiActive(){
        this.aiModelShow=true;
        this.articleDetailShow=false;
        this.zhishiDetailShow=false;
      },
      canWrite(val) {
        this.ecnetTipWrapShow = false;
        this.sensitiveTipWrapShow = false;
        this.$nextTick(() => {
          if (!val) {
            $('#title-html').blur();
            $('#article-html').blur();
            this.aiModelShow = false;
          } else {
            $('#article-html').focus();
          }
        });
      },
      articleHtml() {
        this.sectionBindClick()
      },
      sinsitiveCheckAll(val){
        if(val){
          var arr=[];
          for(var i=0;i<this.sinsitiveKeywordList.length;i++){
            arr.push(i)
          }
          this.sinsitiveRowCheck=arr;
        }else {
          this.sinsitiveRowCheck=[];
        }
      },
    },
    created() {
    },
    mounted() {
      var self = this;
      this.init();
      this.copy();
      $(document).scroll(function () {
        self.aiModelShow = false;
        self.ecnetTipWrapShow = false;
        self.sensitiveTipWrapShow = false;
      });
    },
    methods: {
      init() {
        if (
          this.$route.query.write &&
          this.$route.query.write == 2 &&
          this.$route.query.id
        ) {
          this.writeType = this.$route.query.write;
          this.editerId = this.$route.query.id;
          window.localStorage.editerId = this.editerId;
          this.getArticleDetail();
        } else {
          if (window.localStorage.editerContent) {
            this.title = window.localStorage.editerTitle;
            this.articleHtml = window.localStorage.editerContent;

            if (window.localStorage.editerId)
              this.editerId = window.localStorage.editerId;

            $("#title-html").html(this.title);
            $("#article-html").html(this.articleHtml);
            this.ecnetKeywordPosition();

            this.aiModelInit()
          }
        }
      },

      getArticleDetail() {
        var self = this;
        self.$store.commit("setLoading", true);
        self.$http({
          url: apiHost + "/article/detail.do",
          data: {
            contextId: self.editerId
          },
          success: function (data) {
            self.$store.commit("setLoading", false);
            if (data.code == 0 && data.data) {
              self.title = data.data.title;
              self.articleHtml = data.data.content;

              $("#title-html").html(self.title);
              $("#article-html").html(self.articleHtml);
              self.ecnetKeywordPosition();

              self.aiModelInit();

              window.localStorage.editerContent = self.articleHtml;
              window.localStorage.editerTitle = self.title;
              window.localStorage.editerId = self.editerId;
            } else {
              self.$store.commit("setLoading", data.msg);
            }
          }
        });
      },

      saveArticle(callback) {
        var self = this;
        _czc.push(['_trackEvent','编辑器','点击保存稿件'])

        if (!self.title) {
          self.$store.commit("setToolTip", "请输入标题!");
          return;
        }
        if (!self.articleHtml) {
          self.$store.commit("setToolTip", "请输入正文!");
          return;
        }
        self.$store.commit("setLoading", "正在保存中…");
        self.$http({
          url: apiHost + "/article/add.do",
          data: {
            title: self.title,
            content: self.articleHtml,
            id: self.editerId
          },
          success: function (data) {
            self.$store.commit("setLoading", false);
            self.menuModelShow = false;
            if (data.code == 0) {
              self.$store.commit("setToolTip", "底稿保存成功！");
              self.editerId = data.data;
              window.localStorage.editerId = self.editerId;

              if (callback) {
                callback();
                return;
              }
              if (self.writeType == 2) {
                self.$router.back();
              }
            } else {
              self.$store.commit("setToolTip", data.msg);
            }
          }
        });
      },

      //复制
      copy: function () {
        var self = this;
        self.clipboard = new Clipboard(".js-copy");
        //复制成功执行的回调，可选
        self.clipboard.on("success", function (e) {
          self.$store.commit("setToolTip", "复制成功！");
          self.menuModelShow = false;
        });
      },
      sectionBindClick(){
        var self = this;
        self.$nextTick(() => {
          $('#article-html').children().unbind('click').click(function () {
            if (!self.canWrite) {
              self.selectSectionDom = $(this);
              self.selectSectionContent = $(this).text();

              self.aiActive=1;
              self.clickSection();

              $('#article-html').children().removeAttr('class');
              self.selectSectionDom.addClass('active-shadow')
            }
            self.ecnetTipWrapShow = false;
            self.sensitiveTipWrapShow = false;
          })
        });
      },

      //点击分享
      clickShare() {
        var self = this;
        self.$checkSensitiveWord( self.articleHtml.replace(/<[^>]+>/g, "\n") ,function (data,length) {
          if(length===0){
            self.yesToShare()
          }else {
            self.sensitiveShareModelShow=true;
          }
        })
      },
      yesToShare(){
        var self = this;
        self.sensitiveShareModelShow=false;
        self.saveArticle(function () {
          if (self.editerId) {
            location.href = "share.html?id=" + self.editerId + "#show";
          } else {
            self.menuModelShow = false;
            self.shareModelShow = true;
          }
        });
      },

      //点击查重按钮
      clickChachong(){
        this.duplicateModelShow=true;
        this.menuModelShow=false;

        _czc.push(['_trackEvent','编辑器','点击稿件查重'])
      },
      //确定查重检测
      yesToChachong(){
        var self=this;
        self.$store.commit("setLoading", true);
        self.$http({
          url: apiHost + "/checking/add.do",
          data: {
            title: self.title,
            content: self.articleHtml,
            id: self.editerId
          },
          success: function (data) {
            self.$store.commit("setLoading", false);
            self.duplicateModelShow = false;
            if (data.code == 0) {
              self.$store.commit("setToolTip", "查重检测提交成功！");
            } else {
              self.$store.commit("setToolTip", data.msg);
            }
          }
        });
      },

      //点击文章改写
      clickRewrite(){
        this.menuModelShow=false;
        this.rewriteObj={
          titleOld: this.title,
          articleHtmlOld: this.articleHtml,
        };

        _czc.push(['_trackEvent','编辑器','点击稿件改写'])
      },
      propRewriteAll(content){

        $("#article-html").html(content);
        this.articleHtml = content;
        this.sectionBindClick();
      },




      //文本纠错
      matchEcnetKeyword: function () {
        var self = this;
        _czc.push(['_trackEvent','编辑器','点击稿件纠错'])

        self.menuModelShow=false;
        var content = self.articleHtml.replace(/<(table|tr|td|%)[\s\S]*?\/\1>/g, "");
        content = content.replace(/<[^>]+>/g, "\n");
        var contentArr = content.split("\n");
        var contentArr2 = [];
        for (var i = 0; i < contentArr.length; i++) {
          if (contentArr[i].length > 5) {
            contentArr2.push(contentArr[i]);
          }
        }
        self.$store.commit("setLoading", "正在检测中…");
        if (contentArr2.length == 0) {
          setTimeout(function () {
            self.$store.commit("setLoading", false);
            self.$store.commit("setToolTip", "暂未检测到错别字！");
          }, 300);
          return false;
        }
        self.$http({
          url: apiHost + '/article/grammar_detection.do',
          data: {
            text: contentArr2.join("\n")
          },
          success: function (data) {
            self.$store.commit("setLoading", false);
            if (data.code == 0) {
              if (data.data && data.data.length > 0) {
                self.ecnetKeywordRed(data.data);
                self.$store.commit("setToolTip",  '为您找到 ' + data.data.length + ' 处错别字！');
              } else {
                self.$store.commit("setToolTip", "暂未检测到错别字！");
              }
            } else {
              self.$store.commit("setToolTip", data.msg);
            }
          }
        })
      },
      //错词标记处理程序
      ecnetKeywordRed(list){
        var self = this;
        var arr = list;
        var arrObj = {};
        for (var i = 0; i < arr.length; i++) {
          if (!arrObj[arr[i].sentence]) {
            arrObj[arr[i].sentence] = {
              html: '',
              strList: [],
              errorList: [{
                start: arr[i].start,
                end: arr[i].end,
                target: arr[i].target,
                keyword: arr[i].keyword,
              }]
            };
          } else {
            arrObj[arr[i].sentence].errorList.push({
              start: arr[i].start,
              end: arr[i].end,
              target: arr[i].target,
              keyword: arr[i].keyword,
            })
          }
        }

        //错词排序
        for (var key in arrObj) {
          var t;
          for (var i = 0; i < arrObj[key].errorList.length; i++) {
            for (var j = i + 1; j < arrObj[key].errorList.length; j++) {
              if (arrObj[key].errorList[i].start > arrObj[key].errorList[j].start) {
                t = arrObj[key].errorList[i];
                arrObj[key].errorList[i] = arrObj[key].errorList[j];
                arrObj[key].errorList[j] = t;
              }
            }
          }
        }


        var text = $("#article-html").html();
        for (var key in arrObj) {
          var errorList = arrObj[key].errorList;
          arrObj[key].strList.push(key.slice(0, errorList[0].start));
          for (var i = 0; i < errorList.length; i++) {
            if (i < errorList.length - 1) {
              if (errorList[i].end <= errorList[i + 1].start) {
                arrObj[key].strList.push('<span class="ecnet-keyword" ecnet-pre="' + errorList[i].target + '" ecnet-next="' + errorList[i].keyword + '">' + errorList[i].target + '</span>');
                arrObj[key].strList.push(key.slice(errorList[i].end, errorList[i + 1].start));
              }
            } else {
              arrObj[key].strList.push('<span class="ecnet-keyword" ecnet-pre="' + errorList[i].target + '" ecnet-next="' + errorList[i].keyword + '">' + errorList[i].target + '</span>');
              arrObj[key].strList.push(key.slice(errorList[i].end));
            }
          }
          arrObj[key].html = arrObj[key].strList.join('');
          var reOld = new RegExp(key, 'g');
          text = text.replace(reOld, arrObj[key].html);
        }
        self.articleHtml=text;
        $("#article-html").html(self.articleHtml);
        self.ecnetKeywordPosition();
      },
      //给错词元素绑定事件，并定位错词元素位置
      ecnetKeywordPosition(){
        var self = this;
        self.$("#article-html").find(".ecnet-keyword").click(function (event) {
          event.stopPropagation();    //  阻止事件冒泡
          self.ecnetNextDom = self.$(this);
          if (self.ecnetNextDom.attr('ecnet-next')) {
            var offset = self.$(this).offset();
            self.ecnetTipWrapShow = true;
            self.ecnetNextKeyword = self.ecnetNextDom.attr('ecnet-next');
            self.ecnetTipWrapTop =  offset.top + 24;
            self.ecnetTipWrapleft = offset.left;
          }
        });
      },
      //点击正确词，替换错词
      clickChangeEcnetKeyword(){
        var self = this;
        if (self.ecnetNextDom) {
          self.ecnetNextDom[0].innerHTML = self.ecnetNextKeyword;
          self.ecnetNextDom.removeAttr('ecnet-pre');
          self.ecnetNextDom.removeAttr('ecnet-next');
          self.ecnetNextDom.removeAttr('class');
          self.ecnetNextDom.unbind();
          self.ecnetTipWrapShow = false;
        }
      },
      //点击忽略该错误
      clickEcnetIgnore(){
        var self = this;
        if (self.ecnetNextDom) {
          self.ecnetNextDom.removeAttr('ecnet-pre');
          self.ecnetNextDom.removeAttr('ecnet-next');
          self.ecnetNextDom.removeAttr('class');
          self.ecnetNextDom.unbind();
          self.ecnetNextDom.attr('ecnet-ignore', self.ecnetNextDom.html());
          self.ecnetTipWrapShow = false;
        }
      },



      //点击敏感词检测
      clickSensitiveWord(){
        var self = this;
        _czc.push(['_trackEvent','编辑器','点击敏感词检测'])
        self.sinsitiveCheckAll=false;
        self.menuModelShow=false;
        self.$checkSensitiveWord( self.articleHtml.replace(/<[^>]+>/g, "\n") ,function (data,length) {
          if(length>0){
            self.sensitiveModelShow=true;
            self.sinsitiveKeywordList = data.data
            self.$store.commit("setToolTip",  '为您找到 ' + length + ' 处敏感词！');
            self.sinsitiveCheckAll=true;
          }else {
            self.$store.commit("setToolTip", "未检测到敏感词！");
          }
        })
      },
      yesToMatchSinsitiveKeyword(){
        var self =this;
        self.sensitiveModelShow=false;
        var checkKeywords=[];
        for(var i = 0;i < self.sinsitiveRowCheck.length;i++){
          checkKeywords = checkKeywords.concat(self.sinsitiveKeywordList[self.sinsitiveRowCheck[i]].words)
        }
        console.log(checkKeywords)
        var text = $("#article-html").html();
        for (var i = 0; i < checkKeywords.length; i++) {
          var re = new RegExp(checkKeywords[i], 'g');
          var reStr = '<span class="sinsitive-keyword" data-sinsitive="' + checkKeywords[i] + '">' + checkKeywords[i] + '</span>';
          var reOld = new RegExp(reStr, 'g');
          if (re.test(text)) {
            text = text.replace(reOld, checkKeywords[i]);
            text = text.replace(re, reStr);
          }
        }
        self.articleHtml=text;
        $("#article-html").html(self.articleHtml);
        self.sinsitiveKeywordPosition();
      },
      //给敏感词元素绑定事件，并定位敏感词元素位置
      sinsitiveKeywordPosition(){
        var self = this;
        self.$("#article-html").find(".sinsitive-keyword").click(function (event) {
          event.stopPropagation();    //  阻止事件冒泡
          self.sensitiveNextDom = self.$(this);
          if (self.sensitiveNextDom.attr('data-sinsitive')) {
            var offset = self.$(this).offset();
            self.sensitiveTipWrapShow = true;
            self.sensitiveTipWrapTop =  offset.top + 24;
            self.sensitiveTipWrapleft = offset.left;
          }
        });
      },
      //点击忽略该敏感词
      clickSinsitiveIgnore(){
        var self = this;
        if (self.sensitiveNextDom) {
          self.sensitiveNextDom.removeAttr('data-sinsitive');
          self.sensitiveNextDom.removeAttr('class');
          self.sensitiveNextDom.unbind();
          self.sensitiveTipWrapShow = false;
        }
      },




      titleChange() {
        this.title = $("#title-html").text();
        window.localStorage.editerTitle = this.title;
      },
      articleChange() {
        this.articleHtml = $("#article-html").html();
        window.localStorage.editerContent = this.articleHtml;
      },


      //进入页面后默认执行程序
      aiModelInit(){
        this.getTopicExtractionList();
        this.getArticleListData();
        this.getZhishiListData();

        var firstSection = $('#article-html').children()[0];
        this.selectSectionDom = $(firstSection);
        this.selectSectionContent = $(firstSection).text();
        this.getSucaiListData1();

        $('#article-html').children().removeClass('active-shadow');
        this.selectSectionDom.addClass('active-shadow');

        if (!window.localStorage.hasShowEditTipModel3) this.tipModelShow1 = true;
      },

      //选择段落后
      clickSection() {
        var self = this;
        self.sucaiList = [];
        self.getSucaiListData1();

        self.aiModelShow = true;
      },

      //获取段落素材
      getTopicExtractionList() {
        var self = this;
        var articleContent = this.articleHtml.replace(/<\/p>/g, "\n");
        articleContent = articleContent.replace(/<[^>]+>/g, "");
        self.$http({
          url: apiHost + "/material/topic_extraction.do",
          data: {
            content: articleContent,
            title: self.title,
            size: 50
          },
          success: function (data) {
            if (data.code == 0 && data.data) {
              self.topicExtractionList = data.data;
            } else {
              self.topicExtractionList = [];
            }
          }
        })
      },

      getSucaiListData1() {
        var self = this;
        self.sucaiOtherTypeShow = false;
        self.sucaiType = '';

        self.$store.commit('setLoading', true);
        self.$http({
          url: apiHost + "/material/suggest.do",
          data: {
            content: self.selectSectionContent,
            title: self.title,
            size: 50
          },
          success: function (data) {
            self.$store.commit('setLoading', false);
            if (data.code == 0 && data.data) {
              self.sucaiSite = self.title;
              self.sucaiList = data.data.data;
              self.sucaiKeywords = data.data.keywords;
            } else {
              self.sucaiList = [];
              self.sucaiKeywords = [];
            }
          }
        })
      },
      getSucaiListData2(item) {
        var self = this;
        self.sucaiOtherTypeShow = false;
        self.sucaiType = item;
        self.$store.commit('setLoading', true);
        self.$http({
          url: apiHost + "/material/topic_search.do",
          data: {
            keyword: self.sucaiKeywords.join(' '),
            title: self.sucaiType,
            size: 50
          },
          success: function (data) {
            self.$store.commit('setLoading', false);
            if (data.code == 0 && data.data) {
              self.sucaiSite = self.sucaiType;
              self.sucaiList = data.data;
            } else {
              self.sucaiList = [];
            }
          }
        });

        _czc.push(['_trackEvent','编辑器','点击拓展话题',item])
      },


      getArticleListData() {
        var self = this;
        var articleContent = this.articleHtml.replace(/<\/p>/g, "\n");
        articleContent = articleContent.replace(/<[^>]+>/g, "");
        self.$http({
          url: apiHost + "/material/suggest.do",
          data: {
            content: articleContent,
            title: self.title,
            size: 50
          },
          success: function (data) {
            if (data.code == 0 && data.data && data.data.data) {
              self.articleList = data.data.data;
            } else {
              self.articleList = [];
            }
          }
        })
      },
      checkArticleSection(item,$index) {
        this.articleDetailShow = true;
        this.articleDetailTitle = item.title;
        if (item.textcontent) {
          var arr = item.textcontent.split('\n');
          var list = [];
          for (var i = 0; i < arr.length; i++) {
            if (arr[i] && arr[i].length > 10) {
              list.push(arr[i]);
            }
          }
          this.articleDetailList = list
        }

        var index=$index*1+1;
        _czc.push(['_trackEvent','编辑器','点击推荐文章查看', '第'+index+'篇'])
      },

      getZhishiListData() {
        this.getGoodSentencesList();
        this.getZhihuList();
        this.getZhidaoList();
        this.getBaikeList();
      },
      getGoodSentencesList() {
        var self = this;
        self.$http({
          url: apiHost + "/knowledge/good_sentences.do",
          data: {
            title: self.title,
            size: self.zhishiSize
          },
          success: function (data) {
            if (data.code == 0 && data.data && data.data.data) {
              self.goodSentencesList = data.data.data;
            } else {
              self.goodSentencesList = [];
            }
          }
        })
      },
      getZhihuList() {
        var self = this;
        self.$http({
          url: apiHost + "/knowledge/zhihu.do",
          data: {
            title: self.title,
            size: self.zhishiSize
          },
          success: function (data) {
            if (data.code == 0 && data.data && data.data.zhihu && data.data.zhihu.data) {
              self.zhihuList = data.data.zhihu.data;
            } else {
              self.zhihuList = [];
            }
          }
        })
      },
      getZhidaoList() {
        var self = this;
        self.$http({
          url: apiHost + "/knowledge/zhidao.do",
          data: {
            title: self.title,
            size: self.zhishiSize
          },
          success: function (data) {
            if (data.code == 0 && data.data && data.data.zhidao && data.data.zhidao.data) {
              self.zhidaoList = data.data.zhidao.data;
            } else {
              self.zhidaoList = [];
            }
          }
        })
      },
      getBaikeList() {
        var self = this;
        self.$http({
          url: apiHost + "/knowledge/baike.do",
          data: {
            title: self.title,
            size: self.zhishiSize
          },
          success: function (data) {
            if (data.code == 0 && data.data && data.data.baike) {
              self.baikeList = data.data.baike;
            } else {
              self.baikeList = [];
            }
          }
        })
      },



      checkZhishiSection(title,content,$index,action) {
        this.zhishiDetailShow = true;
        this.zhishiDetailTitle = title;
        this.zhishiDetailContent = content;

        var index=$index*1+1;
        _czc.push(['_trackEvent','编辑器',action, '第'+index+'篇'])
      },


      //选中推荐素材进行操作
      editAiContent(content){
        this.aiControlModelShow=true;
        this.aiControlEditContent=content;
      },
      //插入段落前
      insetSectionStart(){
        this.selectSectionDom.html(this.aiControlEditContent+this.selectSectionDom.html());
        this.aiControlModelShow=false;
        this.articleChange();

        if(this.aiActive == 1){
          _czc.push(['_trackEvent','编辑器', !this.sucaiType ? '点击默认话题素材插入' : '点击拓展话题素材插入'])
        }else if(this.aiActive == 2){
          _czc.push(['_trackEvent','编辑器','点击文章素材插入'])
        }else if(this.aiActive == 3){
          _czc.push(['_trackEvent','编辑器','点击知识素材插入'])
        }
      },
      //插入段落后
      insetSectionEnd(){
        this.selectSectionDom.html(this.selectSectionDom.html()+this.aiControlEditContent);
        this.aiControlModelShow=false;
        this.articleChange();

        if(this.aiActive == 1){
          _czc.push(['_trackEvent','编辑器', !this.sucaiType ? '点击默认话题素材插入' : '点击拓展话题素材插入'])
        }else if(this.aiActive == 2){
          _czc.push(['_trackEvent','编辑器','点击文章素材插入'])
        }else if(this.aiActive == 3){
          _czc.push(['_trackEvent','编辑器','点击知识素材插入'])
        }
      },
      //替换当前段落
      replaceSection(){
        this.selectSectionDom.html(this.aiControlEditContent);
        this.aiControlModelShow=false;
        this.articleChange();

        if(this.aiActive == 1){
          _czc.push(['_trackEvent','编辑器', !this.sucaiType ? '点击默认话题素材替换' : '点击拓展话题素材替换'])
        }else if(this.aiActive == 2){
          _czc.push(['_trackEvent','编辑器','点击文章素材替换'])
        }else if(this.aiActive == 3){
          _czc.push(['_trackEvent','编辑器','点击知识素材替换'])
        }
      },


      closeTipModel3(){
        this.tipModelShow3 = false;
        window.localStorage.hasShowEditTipModel3 = 1;
      },
      closeTipModel4(){
        this.tipModelShow4=false;
        window.localStorage.hasShowEditTipModel4 = 1;
        this.aiModelShow=true;
        this.tipModelShow5=true
      },

    }
  };
</script>

<style lang="scss">
  @import "../../assets/scss/app";

  #edit {
    padding: rem(90) rem(40);
    .edit-box {
      padding-top: rem(56);
      &.show-ai-model {
        padding-bottom: rem(650);
      }
      &.show-ai-model2 {
        padding-bottom: rem(600);
      }
      .title {
        font-size: rem(40);
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        line-height: rem(56);
        margin-bottom: rem(20);
        border-bottom: 1px solid #dddddd;
        padding-bottom: rem(15);
        &.empty:before {
          content: "请输入标题";
          color: #999999;
        }
        &:focus:before {
          content: none;
        }
        &:focus {
          outline: none;
        }
      }
      .article {
        font-size: rem(30);
        color: rgba(51, 51, 51, 1);
        line-height: rem(50);
        text-align: justify;
        word-break: break-all;
        &:focus {
          outline: none;
        }
        p {
          margin-bottom: rem(50);
        }
        &.is-not-edit{
          .active-shadow{
            background:rgba(255,246,230,1);
            box-shadow: 0 0 0 5px rgba(255,246,230,1);
            border-radius:2px;
          }
        }
        .ecnet-keyword{
          color: red;
        }
        .sinsitive-keyword{
          color: #FF9900;
        }
      }
    }

    .menu-show-btn {
      position: fixed;
      right: rem(30);
      bottom: rem(30);
      z-index: 99;
      transition: all 0.3s;
      &.show-ai-model {
        bottom: rem(705);
      }
      &.show-ai-model2 {
        bottom: rem(190);
      }
      .btn {
        display: block;
        width: rem(88);
        height: rem(88);
        background: #ffffff url("../../assets/images/edit-icon_01.png") no-repeat center/rem(36);
        box-shadow: 0px 0px 14px 0px rgba(8, 46, 121, 0.3);
        border-radius: 50%;
        & + a {
          margin-top: rem(20);
        }
      }
      .btn2 {
        background-image: url("../../assets/images/edit-icon_01-01.png");
      }
      .btn3 {
        background-image: url("../../assets/images/edit-icon_01-02.png");
      }
    }

    .ai-model {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 998;
      background: rgba(255, 255, 255, 1);
      border-radius: rem(30) rem(30) 0px 0px;
      box-shadow: 0px -3px 12px 0px rgba(0, 0, 0, 0.1);

      .tabs {
        margin: 0 rem(30);
        border-bottom: 1px solid #e5e5e5;
        a {
          display: inline-block;
          padding: rem(25) rem(20) rem(14);
          font-size: rem(28);
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: rem(40);
          &.active {
            color: #246bff;
            position: relative;
            &::after {
              content: "";
              position: absolute;
              left: 0;
              bottom: 0;
              width: 100%;
              height: 2px;
              background: rgba(36, 107, 255, 1);
            }
          }
        }
      }
      .content-list {
        height: rem(80);
        position: relative;
        transition: all 0.3s;
        &.show {
          height: rem(600);
        }
        .no-tip {
          text-align: center;
          line-height: rem(80);
          font-size: rem(28);
          color: rgba(160, 162, 166, 1);
        }
        .list-item {
          height: 100%;
          padding: 0 rem(30) rem(30);
          box-sizing: border-box;
        }
        .list-item1 {
          .select-tab {
            text-align: right;
            padding: rem(10) 0;
            a {
              display: inline-block;
              font-size: rem(28);
              color: rgba(51, 51, 51, 1);
              line-height: rem(60);

              &.active {
                color: rgba(36, 107, 255, 1);
              }
              &+a{
                margin-left: rem(54);
              }
            }
            .other-tab {
              position: relative;
              & > span {
                display: block;
                & > em {
                  margin-right: rem(15);
                  font-style: normal;
                }
                & > i {
                  display: inline-block;
                  width: rem(17);
                  height: rem(17);
                  border-right: 1.5px solid #333333;
                  border-bottom: 1.5px solid #333333;
                  transform: scaleX(1.1) translate(rem(-5), rem(-7)) rotate(45deg);
                }
              }
              .option {
                position: absolute;
                right: 0;
                top: rem(58);
                z-index: 9;
                background-color: #ffffff;
                box-shadow: 0px -3px 12px 0px rgba(0, 0, 0, 0.1);
                padding: rem(10) rem(20);
                a {
                  white-space: nowrap;
                  display: block;
                  margin: 0;
                }
              }
            }
          }
          & > .list,& > .list2 {
            li {
              background: rgba(255, 255, 255, 1);
              box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
              border-radius: rem(10);
              border: 1px solid rgba(133, 201, 255, 1);
              padding: rem(20) rem(70) rem(20) rem(20);
              margin-bottom: rem(20);
              position: relative;
              p {
                font-size: rem(26);
                color: rgba(51, 51, 51, 1);
                line-height: rem(40);
                text-align: justify;
              }
              span {
                display: block;
                font-size: rem(24);
                color: rgba(36, 107, 255, 1);
                line-height: rem(33);
                margin-top: rem(10);
              }
              .btn {
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                padding: rem(10);
                width: rem(50);
                img{
                  display: block;
                  width: 100%;
                }
              }
            }
          }
        }

        .list-item2 {
          & > .list {
            padding-top: rem(30);
            li {
              background: rgba(255, 255, 255, 1);
              box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
              border-radius: rem(10);
              border: 1px solid rgba(133, 201, 255, 1);
              padding: rem(20) rem(70) rem(20) rem(160);
              margin-bottom: rem(20);
              position: relative;
              .pic {
                width: rem(120);
                height: rem(120);
                position: absolute;
                top: rem(20);
                left: rem(20);
                object-fit: cover;
                border: 1px solid #c9dded;
                border-radius: 2px;
              }
              h3 {
                font-size: rem(32);
                color: rgba(34, 34, 34, 1);
                line-height: rem(45);
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                margin-bottom: rem(12);
              }
              p {
                font-size: rem(26);
                color: rgba(51, 51, 51, 1);
                line-height: rem(40);
                max-height: rem(80);
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                margin: rem(8) 0;
              }
              span {
                display: block;
                margin: rem(8) 0;
                font-size: rem(24);
                color:rgba(153,153,153,1);
                line-height: rem(33);
                i{
                  color: rgba(1, 130, 232, 1);
                  margin-right: rem(20);
                }
              }
              .icon {
                position: absolute;
                right: rem(15);
                top: 50%;
                transform: translateY(-50%);
                width: rem(16);
              }

              &.list-title {
                border: none;
                box-shadow: none;
                text-indent: 10px;
                font-size: rem(28);
                color:rgba(51,51,51,1);
                border-left: 4px solid rgba(36,107,255,1);
                margin-bottom: rem(15);
                padding: 0;
                border-radius: 0;
              }
            }
          }

          .list-detail {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            background-color: #ffffff;
            .title {
              font-size: rem(40);
              font-weight: 600;
              color: rgba(51, 51, 51, 1);
              line-height: rem(56);
              min-height: rem(56);
              padding: rem(30) 0 rem(30);
              position: relative;
              .back {
                position: absolute;
                left: 0;
                top: rem(30);
                display: block;
                padding-right: rem(20);
                img {
                  width: rem(17);
                  vertical-align: inherit;
                }
              }
              span {
                display: block;
                margin-left: rem(40);
              }
            }
          }
        }

        .list-item3{

          .item-tabs{
            padding-top: rem(30);
            a{
              display: inline-block;
              font-size: rem(24);
              line-height: rem(48);
              color: rgba(36,107,255,1);
              border:1px solid rgba(36,107,255,1);
              text-align: center;
              background-color: #ffffff;
              width: rem(140);
              border-radius: rem(24);
              &.active{
                background-color: rgba(36,107,255,1);
                color: #ffffff;
              }
            }
          }

          & > .list2 {
            padding-top: rem(30);
            li.list-title {
              border: none;
              box-shadow: none;
              text-indent: 10px;
              font-size: rem(28);
              color:rgba(51,51,51,1);
              border-left: 4px solid rgba(36,107,255,1);
              margin-bottom: rem(15);
              padding: 0;
              border-radius: 0;
            }
          }

          .list-detail{
            .list{
              li{
                padding-right: rem(20);
                .article{
                    *{
                      font-weight: normal;
                      font-size: rem(26);
                      color: rgba(51, 51, 51, 1);
                      line-height: rem(44);
                      text-align: justify;
                    }
                }
              }
            }
          }
        }

      }
    }

    .ai-control-model{
      .content {
        width:rem(380);
        padding:rem(48) 0;
        a{
          display: block;
          padding: rem(24) 0 rem(24) rem(55);
          img{
            width: rem(42);
            margin-right: rem(15);
          }
          span{
            font-size:rem(30);
            color:rgba(51,51,51,1);
            line-height:rem(42);
          }
        }
      }
    }

    .duplicate-model{
      .content{
        width: rem(486);
        padding:rem(60) rem(32);
        h3{
          text-align: center;
          font-size:rem(32);
          font-weight:bolder;
          color:rgba(51,51,51,1);
          margin-bottom: rem(47);
        }
        p{
          font-size:rem(26);
          color:rgba(153,153,153,1);
          margin-bottom: rem(46);
          a{
            color: #333333;
          }
        }
      }
    }


    .sensitive-model{
      .content{
        width: rem(600);
        padding: rem(32) rem(30);
        .title{
          font-size:rem(32);
          font-weight:600;
          color:rgba(51,51,51,1);
          line-height:rem(45);
          span{
            font-size:rem(26);
            font-weight:400;
            color:rgba(51,51,51,1);
            line-height:rem(37);
            vertical-align: text-bottom;
          }
        }
        .list{
          background:rgba(241,247,255,1);
          border-radius:rem(10);
          padding:rem(20);
          margin-bottom: rem(30);
          .check-all{
            font-size:rem(26);
            color:rgba(51,51,51,1);
            line-height:rem(40);
            margin-bottom: rem(20);
          }
          li{
            background:rgba(255,255,255,1);
            border-radius:rem(10);
            padding:rem(20);
            margin-bottom: rem(14);
            h4{
              font-size:rem(28);
              color:rgba(51,51,51,1);
              line-height:rem(40);
              margin-bottom: rem(10);
            }
            p{
              font-size:rem(28);
              color:rgba(255,83,83,1);
              line-height:rem(40);
              text-align: right;
              span+span{
                margin-left: rem(20);
              }
            }
          }
        }

        input[type="checkbox"]{
          vertical-align: middle;
        }
      }
    }


    .bot-menu-model {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 999;
      .model {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }
      .content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 1);
        border-radius: rem(30) rem(30) 0px 0px;
        padding: rem(60) 0 rem(24);
        .btns {
          a {
            display: inline-block;
            text-align: center;
            margin:0 rem(37) rem(23);
            i {
              display: block;
              margin: 0 auto rem(29);
              width: rem(88);
              height: rem(88);
              background: rgba(255, 255, 255, 1);
              box-shadow: 0px 3px 5px 0px rgba(0, 157, 255, 0.32);
              border-radius: 50%;
              position: relative;
              img {
                width: rem(40);
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
              }
            }
            span {
              font-size: rem(24);
              font-weight: 400;
              color: rgba(102, 102, 102, 1);
              line-height: rem(34);
              white-space: nowrap;
            }
          }
        }
        .text {
          text-align: center;
          font-size: rem(24);
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: rem(34);
        }
      }
    }

    .ecnet-tip-wrap{
      position: absolute;
      z-index: 8;
      min-width:rem(200);
      padding:rem(10) 0;
      background:rgba(255,255,255,1);
      box-shadow:0px 0px 10px 0px rgba(0,0,0,0.3);
      &>div{
        white-space: nowrap;
        font-size:rem(30);
        color:rgba(51,51,51,1);
        line-height:rem(42);
        padding:rem(10) rem(30);
        &.no{
          color: #999999;
        }
      }
    }

    .share-model {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 999999;
      background-color: rgba(0, 0, 0, 0.5);
      .img {
        position: absolute;
        right: rem(40);
        top: rem(40);
        width: rem(112);
      }
      .text {
        font-size: rem(30);
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        position: absolute;
        right: rem(150);
        top: rem(150);
      }
      .bot {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        padding: rem(63) 0 rem(74);
        text-align: center;
        background: rgba(255, 255, 255, 1);
        border-radius: rem(30) rem(30) 0px 0px;
        p {
          font-size: rem(28);
          color: rgba(51, 51, 51, 1);
          line-height: rem(40);
          margin-bottom: rem(27);
        }
        a {
          display: inline-block;
          background: rgba(36, 107, 255, 1);
          width: rem(315);
          border-radius: rem(42);
          line-height: rem(80);
          font-size: rem(28);
          color: rgba(255, 255, 255, 1);
        }
      }
    }


    .tip-model {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 1000;
      background-color: rgba(0, 0, 0, 0.5);
      .icon{
        position: absolute;
        width: rem(55);
      }
      .text{
        position: absolute;
        font-size:rem(30);
        font-weight:bolder;
        color:rgba(255,255,255,1);
        text-align: center;
      }
      &.tip-model1{
        .icon{
          right: rem(144);
          bottom: rem(303);
        }
        .text{
          right: rem(226);
          bottom: rem(312);
        }
        .menu-show-btn .btn{
          margin-bottom: rem(102);
        }
      }
      &.tip-model2{
        .icon{
          right: rem(144);
          bottom: rem(195);
        }
        .text{
          right: rem(226);
          bottom: rem(204);
        }
        .img{
          position: absolute;
          bottom: rem(350);
          left: 50%;
          width: rem(418);
          transform: translateX(-50%);
        }
      }
      &.tip-model3{
        .text{
          right: rem(144);
          bottom: rem(382);
        }
        .img{
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          display: block;
        }
      }
      &.tip-model4{
        .content{
          position: absolute;
          left: 0;
          right: 0;
          top:rem(88);
          bottom: rem(680);
          .text{
            left: 0;
            right: 0;
            top:50%;
            transform: translateY(-50%);
          }
          .img{
            position: absolute;
            left: 50%;
            top:22%;
            transform: translateX(-50%) rotate(90deg);
            width: rem(95);
          }
          .img2{
            transform: translateX(-50%) rotate(-90deg);
            top:auto;
            bottom:22%;
          }
        }
      }
      &.tip-model5{
        .icon{
          right: rem(144);
          bottom: rem(332);
        }
        .text{
          right: rem(226);
          bottom: rem(341);
        }
        .img{
          position: absolute;
          bottom: rem(373);
          right: rem(40);
          width: rem(50);
          display: block;
          background-color: #ffffff;
          border-radius: 50%;
        }
      }

    }

  }
</style>
