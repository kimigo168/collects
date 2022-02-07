<template>
  <div id="edit">
    <div class="main show" id="edit-main">
      <!-- <a class="switch" href="javascript:;" @click="mainClose=!mainClose" :title="mainClose?'点我打开':'点我关闭'">
        <div class="inner"><img src="./../../images/robot_icon.gif"/></div>
      </a> -->
      <div class="left-part scroll" id="left-part-scroll">
        <!-- 热点 -->
        <div class="content" v-if="vType=='1'">
          <div class="tab-wrap"  v-if="!isShowArticleDetail">
            <el-tabs v-model="tabIdx" @tab-click="hanleClick">
              <el-tab-pane label="段落" name="0"></el-tab-pane>
              <el-tab-pane label="词句" name="1"></el-tab-pane>
              <el-tab-pane label="文章" name="2"></el-tab-pane>
              <el-tab-pane label="知识" name="3"></el-tab-pane>
              <!-- <el-tab-pane label="统计" name="4"></el-tab-pane> -->
            </el-tabs>
          </div>
          <div v-if="!isShowArticleDetail">
            <div class="tab-item" v-show="tabIdx=='0'" data="段落模块" v-loading="sectionLoading">
              <h3 class="tab-title">素材关键字</h3>
              <div class="sc-keyword-input">
                <input v-if="!isShowScKeywordList||wordsList.length===0" id="sc-input" type="text" placeholder="请输入关键字，并以空格分隔" v-model="addWord" @focus="inputFocus" @blur="inputBlur" @keyup.enter="addWordCloudUpdate" autocomplete="off"><button class="search-btn" @click="addAndSearchFun"></button>
                <ul class="sc-keyword-list clearfix" @click="changeToEdit" v-if="isShowScKeywordList && wordsList.length>0">
                  <li v-for="(item, index) in wordsList" :key="index">{{item}}<i class="delete-icon" @click.stop="deleteWord(index)"></i></li>
                </ul>
              </div>
              <h3 class="tab-title">素材智能联想</h3>
              <div class="sc-lenovo">
                <span class="default" @click="selectDefaultTopic" :class="{'default-active':!sucaiType}">默认话题素材</span>
                <el-select v-model="sucaiType" placeholder="扩展话题素材" @change="sucaiTypeChange">
                  <el-option v-for="(item, index) in topicTitleList" :value="item" :key="index">{{item}}</el-option>
                </el-select>
              </div>
              <ul class="list" id="section-text-list">
                <li v-for="(item,index) in sectionTextList" :key="index">
                  <p class="summary" v-html="item.content"></p>
                  <!-- <a class="btn btn1" :href="item.url" target="_blank"><img src="./../../images/icons/list_icon_03.png"/>查看原文</a> -->
                  <span class="source" >来自话题：{{sucaiType?sucaiType:title}}</span>
                  <a class="btn btn2" @click="replaceTextToEditor(item.content, 1)"><i class="tip">替换</i></a>
                  <a class="btn btn3" @click="insertTextToEditor(item.content, 1)"><i class="tip">插入</i></a>
                </li>
              </ul>
              <p class="no-more" v-if="noSectionTextList">暂无结果，请重新搜索</p>
            </div>
            <div class="tab-item" v-show="tabIdx=='1'" data="句子模块" v-loading="juziLoading">
              <div class="search-wrap" @keyup.enter="getJuziList">
                <input type="text" placeholder="请输入词句进行推荐" class="search-input" v-model="juziKeyword">
                <i class="query-icon" @click="getJuziList"></i>
              </div>
              <ul class="list">
                <li v-for="(item,index) in juziList" :key="index">
                  <p class="summary" v-html="item.content"></p>
                  <a href="javascript:void(0)" class="btn copy-btn" @click="copyFun"><i class="tip">复制</i></a>
                  <a class="btn btn2" @click="replaceTextToEditor(item.content, 2)"><i class="tip">替换</i></a>
                  <a class="btn btn3" @click="insertTextToEditor(item.content, 2)"><i class="tip">插入</i></a>
                </li>
              </ul>
              <p class="no-more" v-if="noJuziList">暂无结果，请重新搜索</p>
            </div>
            <div class="tab-item" v-show="tabIdx=='2'" data="文章模块" >
              <div class="search-wrap" @keyup.enter="searchArticleFun">
                <input type="text" placeholder="请输入关键词进行推荐" class="search-input" v-model="articleKeyword">
                <i class="query-icon" @click="searchArticleFun"></i>
              </div>
              <ul class="list" v-loading="articleLoading">
                <li class="article-item" @click="viewArticleDetail(item, 0, index)" v-for="(item,index) in articleList" :key="index">
                  <img v-if="item.image" :onerror="errorImgUrl" :src="item.image&&item.image[0]?item.image[0]:bgBgCover" class="cover">
                  <h3>{{item.title}}</h3>
                  <p class="summary showTwoLine" v-html="item.content"></p>
                  <!-- <a class="btn btn1" :href="item.url" target="_blank"><img src="./../../images/icons/list_icon_03.png"/>查看原文</a> -->
                  <!-- <a href="javascript:void(0)" class="btn copy-btn" @click="copyFun"><i class="tip">复制</i></a>
                  <a class="btn btn2" @click="replaceTextToEditor(item.content)"><i class="tip">替换</i></a>
                  <a class="btn btn3" @click="insertTextToEditor(item.content)"><i class="tip">插入</i></a> -->
                  <a class="btn insert-btn" @click.stop="insertTextToEditor(item.content)"><i class="tip">引用</i></a>
                  <p class="from">来源：{{item.from}}</p>
                </li>
              </ul>
              <p class="no-more" v-if="noArticleList">暂无结果，请重新搜索</p>
            </div>
            <div class="tab-item" v-show="tabIdx=='3'" data="知识">
              <div class="search-wrap" style="margin-bottom:20px;">
                <input type="text" class="search-input" v-model="zhishiKeyword" placeholder="输入关键词搜索">
                <i class="query-icon" @click="searchZhishiList"></i>
              </div>
              <ul class="zhishi-tab clearfix">
                <li v-for="(item, index) in zhishiTabList" :class="{'active':index===zhishiTabActive}" :key="index" @click="zhishiTabSelect(index)">{{item}}</li>
              </ul>
              <div v-show="zhishiTabActive==0" v-loading="goodSentenceLoading">
                <h3 class="tab-title">好词好句</h3>
                <ul class="list">
                  <li v-for="(item,index) in goodSentenceList" :key="index">
                    <p class="summary" v-html="item.content"></p>
                    <a href="javascript:void(0)" class="btn copy-btn" @click="copyFun"><i class="tip">复制</i></a>
                    <a class="btn btn2" @click="replaceTextToEditor(item.content, 4)"><i class="tip">替换</i></a>
                    <a class="btn btn3" @click="insertTextToEditor(item.content, 4)"><i class="tip">插入</i></a>
                  </li>
                </ul>
                <p class="no-more" v-if="goodSentenceList.length==0">暂无结果，请重新输入关键字搜索</p>
              </div>
              <div v-show="zhishiTabActive==1" v-loading="zhihuLoading">
                <h3 class="tab-title">知乎</h3>
                <ul class="list zhihu-list" :style="{height:calculateHeight(0)}">
                  <li class="article-item zhihu-item" @click.stop="viewArticleDetail(item, 1, index)" v-for="(item, index) in zhihuList" :key="index">
                    <img :onerror="errorImgUrl" :src="item.author&&item.author.avatarUrl?item.author.avatarUrl:bgBgCover" class="cover">
                    <h3 v-html="item.title" style="margin-bottom:10px;"></h3>
                    <p><span class="author">{{item.author.name}}</span><span class="date">{{new Date(item.createdTime).format('YYYY-MM-DD')}}</span></p>
                    <p class="summary" v-html="item.excerpt"></p>
                    <a class="btn view-btn"><i class="tip">预览</i></a>
                  </li>
                </ul>
                <div class="show-more" v-if="zhihuList.length>3"><span @click="isShowMoreZhihu=!isShowMoreZhihu" :class="{'open': isShowMoreZhihu}">{{isShowMoreZhihu?'点击收起内容':'点击展开更多'}}</span></div>
              </div>
              <div v-show="zhishiTabActive==2" v-loading="zhidaoLoading">
                <h3 class="tab-title">百度知道</h3>
                <ul class="list zhihu-list" :style="{height:calculateHeight(1)}">
                  <li class="article-item" v-for="(item, index) in zhidaoList" :key="index"  @click.stop="viewArticleDetail(item, 2, index)">
                    <img :onerror="errorImgUrl" :src="item.author&&item.author.avatarUrl?item.author.avatarUrl:bgBgCover" class="cover">
                    <h3 v-html="item.title" style="margin-bottom:10px;"></h3>
                    <p><span class="author">{{item.author.name}}</span><span class="date">{{new Date(item.createdTime).format('YYYY-MM-DD')}}</span></p>
                    <p class="summary" v-html="item.excerpt"></p>
                    <a class="btn view-btn"><i class="tip">预览</i></a>
                  </li>
                </ul>
                <div class="show-more" v-if="zhidaoList.length>3"><span @click="isShowMoreZhidao=!isShowMoreZhidao" :class="{'open': isShowMoreZhidao}">{{isShowMoreZhidao?'点击收起内容':'点击展开更多'}}</span></div>
              </div>
              <div v-show="zhishiTabActive==3"  v-loading="baikeLoading">
                <h3 class="tab-title">百度百科</h3>
                <ul class="list zhihu-list" :style="{height:calculateHeight(2)}">
                  <li class="article-item" @click.stop="viewArticleDetail(item, 3, index)" v-for="(item, index) in baidubaikeList" :key="index">
                    <img :onerror="errorImgUrl" :src="item.img?item.img:bgBgCover" class="cover">
                    <h3 v-html="item.key" style="margin-bottom:10px;"></h3>
                    <p><span class="date">{{new Date(item.update_time).format('YYYY-MM-DD')}}</span></p>
                    <p class="summary" v-html="item.info"></p>
                    <a class="btn view-btn"><i class="tip">预览</i></a>
                  </li>
                </ul>
                <div class="show-more" v-if="baidubaikeList.length>3"><span @click="isShowMoreBaike=!isShowMoreBaike" :class="{'open': isShowMoreZhihu}">{{isShowMoreBaike?'点击收起内容':'点击展开更多'}}</span></div>
              </div>
            </div>
            <div class="tab-item" v-show="tabIdx=='4'" data="统计">
              <div class="search-wrap" style="margin-bottom:20px;">
                <input type="text" class="search-input" v-model="emotionKeyword" placeholder="输入关键词搜索">
                <i class="query-icon" @click="emotionSearch"></i>
              </div>
              <h3 class="tab-title">情感分析</h3>
              <div id="pie-chart" v-loading="emotionLoading"></div>
            </div>
          </div>
          <div class="article-detail tab-item" v-if="isShowArticleDetail">
            <div class="close clearfix"><span class="close-icon"  @click="closeViewDetail">关闭</span></div>
            <h2 v-if="tabIdx==2">{{detailItem?detailItem.title:''}}</h2>
            <h2 v-if="tabIdx==3" v-html="detailItem?detailItem.title:''"></h2>
            <p class="from">来源：{{detailItem&&detailItem.from?detailItem.from:detailItem.tabIdx==1?'知乎':detailItem.tabIdx==2?'知道':detailItem.tabIdx==3?'百科':'暂无'}}</p>
            <ul class="list">
              <li v-for="(item, index) in articleDetailArr" :key="index">
                <p class="summary" v-html="item"></p>
                  <!-- <a class="btn btn1" :href="item.url" target="_blank"><img src="./../../images/icons/list_icon_03.png"/>查看原文</a> -->
                  <a v-if="detailItem.tabIdx==0" href="javascript:void(0)" class="btn copy-btn" @click="copyFun"><i class="tip">复制</i></a>
                  <a v-if="detailItem.tabIdx==0" class="btn btn2" @click="replaceTextToEditor(item, 3)"><i class="tip">替换</i></a>
                  <a v-if="detailItem.tabIdx==0" class="btn btn3" @click="insertTextToEditor(item, 3)"><i class="tip">插入</i></a>
              </li>
            </ul>
          </div>
        </div>
        <!-- 提纲 -->
        <div class="content" v-else>
          <div class="tab-wrap">
            <el-tabs v-model="tabIdx">
              <el-tab-pane label="原创素材" name="0"></el-tab-pane>
            </el-tabs>
          </div>
          <div>
            <div class="tab-item">
              <h3 class="tab-title">素材关键字</h3>
              <div class="search-wrap" @keyup.enter="searchTgSucai">
                <input type="text" placeholder="请输入关键字进行搜索" id="tgSearctKeyword" class="search-input" v-model="tgKeyword" @input="scInputChange" @focus="scInputFocus" @blur="scInputBlur">
                <i class="query-icon" @click="searchTgSucai"></i>
                <!-- 联想结果 -->
                <div class="search-relatives" v-if="showRelatives">
                  <ul>
                    <li v-for="(item, index) in relativeList" @click="selectRelative(item)" :key="index">{{item}}</li>
                  </ul>
                  <span class="refresh-btn" @click="changeBatch">换一批</span>
                </div>
              </div>
              <h3 class="tab-title">以下段落由机器智能生成（原创）：</h3>
              <ul class="list">
                <li v-for="(item,index) in tgSucaiList" :key="index">
                  <h3 v-html="item.title" style="margin-bottom:10px;"></h3>
                  <p v-html="item.content"></p>
                  <p style="margin-top:8px;color:#999999;">{{item.source}}</p>
                  <a href="javascript:void(0)" class="btn copy-btn" @click="copyFun"><i class="tip">复制</i></a>
                  <a class="btn btn2" @click="replaceTextToEditor(item.content, 4)"><i class="tip">替换</i></a>
                  <a class="btn btn3" @click="insertTextToEditor(item.content, 4)"><i class="tip">插入</i></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="right-part scroll">
        <div class="content">
          <div class="keyword">
            <input type="text" v-model="title" @keyup.enter="beginWrite"/>
            <!-- <a class="btn" href="javascript:;" @click="beginWrite()">
              <img src="./../../images/icons/light_icon.png"/>
            </a> -->
          </div>
          <div class="article-info">
            <div class="item">
              <span class="label">作者</span>
              <input type="text" v-model="createName">
            </div>
            <div class="item">
              <span class="label">时间</span>
              <input type="text" v-model="createDate">
            </div>
            <!-- <span class="word-count">当前字数：{{articleLength}}</span> -->
          </div>
          <div class="editor" id="editor"></div>
          <ul class="handle-btns">
            <li v-if="vType=='1'" data-title="稿件查重" @click="checkDulicateFun"><button class="query-btn"></button></li>
            <li data-title="稿件纠错" @click="correctFun"><button class="error-btn"></button></li>
            <li v-if="vType=='1'" data-title="稿件改写" @click="rewriteFun"><button class="edit-btn"></button></li>
            <li data-title="段落排序" @click="openSortPop"><button class="sort-btn"></button></li>
            <li data-title="敏感词检测" @click="sensitiveCheckFun"><button class="sensitive-btn"></button></li>
            <li data-title="稿件预览" @click="previewFun"><button class="view-btn"></button></li>
            <li data-title="保存稿件" @click="saveArticle"><button class="save-btn"></button></li>
            <li data-title="稿件下载" @click="downloadFun"><button class="download-btn"></button></li>
          </ul>
          <!-- 文本纠错 -->
          <div class="ecnet-tip-wrap" v-show="ecnetTipWrapShow" :style="{'top':ecnetTipWrapTop+'px','left':ecnetTipWrapleft+'px'}">
            <div @click="clickChangeEcnetKeyword()">{{ecnetNextKeyword}}</div>
            <div @click="clickEcnetIgnore()">忽略该错误</div>
          </div>
          <!-- 敏感词 -->
          <div class="ecnet-tip-wrap" v-show="sensitiveTipWrapShow" :style="{'top':sensitiveTipWrapTop+'px','left':sensitiveTipWrapleft+'px'}">
            <div class="no" @click="clickSinsitiveIgnore()">忽略</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 段落排序弹窗 -->
    <para-sort-pop v-if="isShowSortPop" :isShowSortPop="isShowSortPop" :title="title" :content="sortContent" @fClose="isShowSortPop=false" @fConfirmSort="sortBackFun"></para-sort-pop>
    <!-- 查重提示弹窗 -->
    <check-pop v-if="isShowCheckPop" @fClose="isShowCheckPop=false" @fConfirm="confirmCheck"></check-pop>
    <!-- 稿件全文预览弹窗 -->
    <preview-pop v-if="isShowPreview" :date="createDate" :author="createName" :title="title" :content="sortContent" @fClosePreview="isShowPreview=false"></preview-pop>
    <!-- 改写弹窗 -->
    <rewrite-pop v-if="rewriteData.isShow" :rewriteData="rewriteData" @fClosePop="rewriteData.isShow=false" @fConfirmRewrite="confirmRewrite"></rewrite-pop>
    <leave-confirm :popObj="popObj"></leave-confirm>
    <loading-tips v-if="writeLoading" :loadText="loadText"></loading-tips>
    <!-- 敏感词检测 -->
    <sensitive-check v-if="showSensitiveCheck" :checkData="checkData" @fConfirmShow="showSensitiveFun" @fClose="showSensitiveCheck=false"></sensitive-check>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import paraSortPop from '../../components/paraSortPop'
import loadingTips from '@/components/loadingTips'
import checkPop from './check-pop'
import previewPop from './preview-pop'
import rewritePop from './rewrite-pop'
import leaveConfirm from './leave-confirm'
import sensitiveCheck from './sensitive-check'
import { setTimeout } from 'timers'
var echarts = require('echarts/lib/echarts')
export default {
  name: 'edit',
  data () {
    return {
      title: '',
      tabList: ['段落', '词句', '文章'],
      tabIdx: '0',
      keyword: '',
      selectText: '',
      wordsList: [],
      isAddStatus: false,
      addWord: '',
      sectionTextList: [],
      noSectionTextList: false,
      topicTitleList: [],
      topicTitleCheck: '',
      juziKeyword: '',
      juziList: [],
      noJuziList: false,
      articleKeyword: '',
      articleList: [],
      noArticleList: false,
      baikeList: [],
      noBaikeList: false,
      mainClose: false,
      sectionLoading: false,
      juziLoading: false,
      articleLoading: false,
      createName: 'AI 写作机器人',
      createDate: '',
      isShowScKeywordList: true, // 默认显示素材关键字li
      articleLength: 0, // 文章长度
      sucaiType: '', // 扩展素材类别
      isShowSortPop: false, // 段落排序弹窗
      sortContent: '', // 用于排序的内容
      sortBtnLeft: 0, // 排序按钮
      sortBtnTop: 0,
      bgBgCover: require('./../../images/no_bgimg.png'),
      errorImgUrl: 'this.src="' + require('./../../images/no_bgimg.png') + '"',
      isShowArticleDetail: false,
      articleDetailArr: [],
      detailItem: null,
      isShowCheckPop: false,
      editId: '',
      isEdit: false,
      isShowPreview: false, // 显示预览弹窗
      rewriteData: {
        origin: '', // 改写前文章
        rewrite: '',
        isShow: false, // 显示改写弹窗
        rewriteSimilarity: 0 // 相似度
      },
      // 错词提示
      ecnetTipWrapShow: false,
      ecnetTipWrapTop: 0,
      ecnetTipWrapleft: 0,
      ecnetNextKeyword: '',
      ecnetNextDom: null,
      // 离开拦截判断依据
      articleHtml: '',
      oldTitle: '',
      oldArticleHtml: '',
      oldAuthor: '',
      zhihuList: [], // 知乎
      zhidaoList: [], // 百度知道列表
      baidubaikeList: [], // 百度百科
      goodSentenceList: [], // 好词好句
      baikeLoading: false,
      zhidaoLoading: false,
      goodSentenceLoading: false,
      zhihuLoading: false,
      knowledgeLoading: false,
      isShowMoreZhihu: false,
      isShowMoreZhidao: false,
      isShowMoreBaike: false,
      backStatus: false,
      popObj: {
        isShow: false,
        confirmFun: function () {},
        cancelFun: function () {}
      },
      zhishiKeyword: '', // 知识搜索关键字
      zhishiTabList: ['好词好句', '知乎', '百度知道', '百度百科'],
      zhishiTabActive: 0,
      emotionLoading: false,
      emotionKeyword: '',
      emotionData: {
        positive: '', // 正面
        negative: '' // 负面
      },
      writeLoading: false,
      loadText: '稿件改写中......',
      myPieChart: null, // 图表
      vType: '1', // 1热点，2提纲
      tgKeyword: '', // 提纲素材搜索关键字
      // 敏感词检测
      showSensitiveCheck: false,
      checkData: [],
      sensitiveTipWrapShow: false,
      sensitiveTipWrapTop: 0,
      sensitiveTipWrapleft: 0,
      sensitiveNextDom: null,
      sensitiveModelShow: false,
      sinsitiveKeywordList: [],
      sinsitiveRowCheck: [],
      sinsitiveCheckAll: false,
      tgSucaiList: [
        {
          title: '从思想上重视理论学习的重要性',
          content: '理论源于实践又高于实践，我在原有基础上，系统地学习了邓小平理论和三个代表和科学发展观的重要思想，深入细致的学习了党的精神，同时注重加强对外界时政的了解。经过学习，提高了自我的政治敏锐性和鉴别本事，坚定了立场、信念，在大是大非问题面前，能够始终坚持清醒头脑。',
          source: '《入党思想汇报》'
        }
      ], // 提纲素材搜索结果
      showRelatives: false,
      hideRelativeFlag: null, // 隐藏相关推荐定时器
      relativeSearchFlag: null, // 延时查询
      relativeList: ['注重理论学习对实践的指导意义', '注重理论学习对实践的指导意义']
    }
  },
  components: {
    paraSortPop,
    checkPop,
    previewPop,
    rewritePop,
    leaveConfirm,
    loadingTips,
    sensitiveCheck
  },
  watch: {
    mainClose (val) {
      if (val) {
        document.getElementById('edit-main').className = 'main close'
      } else {
        document.getElementById('edit-main').className = 'main show'
      }
    },
    title (val) {
      window.localStorage.editerTitle = val
    }
  },
  created () {
    this.outlineRecommend()
    this.createDate = new Date().format('YYYY年M月D日')
    if (this.$route.query.write === 2) { // 编辑
      this.editId = localStorage.articleId
      this.oldTitle = window.localStorage.editerTitle
      this.oldArticleHtml = window.localStorage.editerContent
      this.isEdit = true
    } else {
      this.isEdit = false
    }
    this.vType = this.$route.query.vType
    this.init()
  },
  mounted () {
    this.editorInt()
  },
  destroyed: function () {
    if (this.editor) this.editor.destroy()
  },
  methods: {
    ...mapMutations(['TOGGLE_ANIMATE']),
    hanleClick () {
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '编辑器', '点击推荐菜单', `${this.tabIdx === '0' ? '段落' : this.tabIdx === '1' ? '语句' : this.tabIdx === '2' ? '文章' : this.tabIdx === '3' ? '知识' : '统计'}`])
      if (this.tabIdx === '2') {
        if (!this.articleKeyword) {
          this.articleKeyword = this.title
        }
        this.getArticleList(this.articleKeyword)
      } else if (this.tabIdx === '3') { // 知识
        this.zhishiTabActive = 0
        if (!this.zhishiKeyword) {
          this.zhishiKeyword = this.title
        }
        this.getGoodSentence() // 好词好句
      } else if (this.tabIdx === '4') { // 统计
        if (!this.emotionKeyword) {
          this.emotionKeyword = this.title
        }
        this.$nextTick(() => {
          this.emotionAnalysis()
        })
      }
    },
    init () {
      if (window.localStorage.editerTitle) {
        this.title = window.localStorage.editerTitle
        this.articleHtml = window.localStorage.editerContent
      }
    },
    getSectionWordCloud (text, load) { // 段落模块获取数据
      if ((!text || text === this.selectText) && !load) return
      this.selectText = text
      this.wordsList = []
      this.sectionTextList = []
      this.sectionLoading = true
      this.$axios.post(this.$global.API.materialRecommend,
        this.$qs.stringify({
          content: text,
          title: this.title,
          size: 50
        })
      ).then((res) => {
        this.sectionLoading = false
        if (res.code === 0 && res.data) {
          if (res.data.keywords) this.wordsList = res.data.keywords.slice(0, 5)
          if (res.data.data) this.sectionTextList = res.data.data
          // 搜默认话题
          this.sucaiType = ''
          // this.checkTopicTitle('')
        }
      })
    },
    deleteWord (index) {
      this.wordsList.splice(index, 1)
      this.addWord = this.wordsList.join(' ')
    },
    // addWordCloud () {
    //   if (this.wordsList.length < 5) {
    //     this.isAddStatus = true
    //   }
    // },
    sortBackFun (content) {
      this.isShowSortPop = false
      this.editor.setContent(content)
    },
    openSortPop () {
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '编辑器', '点击段落排序'])
      this.isShowSortPop = true
    },
    addWordCloudUpdate () {
      let wordsArr = []
      if (!this.addWord.trim()) {
        this.$message({ type: 'warning', message: '请输入关键词', showClose: true })
        return
      }
      wordsArr = this.addWord.trim().split(/\s+/)
      wordsArr = [...new Set(wordsArr)]
      if (wordsArr.length > 5) {
        this.$message({ type: 'warning', message: '最多只能输入五个关键字', showClose: true })
        // eslint-disable-next-line
        return
      } else {
        this.wordsList = wordsArr
        this.isShowScKeywordList = true
        this.getSectionTextList()
      }
      // if (this.wordsList.length === 5) {
      //   this.$message({ type: 'warning', message: '最多只能输入五个关键字', showClose: true })
      //   document.getElementById('sc-input').blur()
      //   return
      // }
      // if (this.addWord.length > 10) {
      //   this.$message({ type: 'warning', message: '单个关键字长度不能超过10个字', showClose: true })
      //   return
      // }
      // if (this.addWord && this.wordsList.length < 5) {
      //   if (this.wordsList.includes(this.addWord)) {
      //     this.$message({ type: 'warning', message: '该关键字已存在，请重新输入', showClose: true })
      //   } else {
      //     document.getElementById('sc-input').blur()
      //     this.wordsList.push(this.addWord)
      //     this.addWord = ''
      //   }
      // }
    },
    changeToEdit () {
      if (this.wordsList.length === 5) {
        this.$message({ type: 'warning', message: '最多只能输入5个关键字', showClose: true })
        return
      }
      this.addWord = this.wordsList.join(' ')
      this.isShowScKeywordList = false
      this.$nextTick(() => {
        document.getElementById('sc-input').focus()
      })
    },
    inputFocus () {
      this.isShowScKeywordList = false
    },
    inputBlur () {
      // this.isShowScKeywordList = true
      // this.addWordCloudUpdate()
    },
    sucaiTypeChange () {
      this.checkTopicTitle(this.sucaiType)
      if (this.sucaiType) {
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '编辑器', '点击拓展话题', this.sucaiType])
      }
    },
    selectDefaultTopic () {
      this.sucaiType = ''
      this.checkTopicTitle('')
    },
    getTopicTitleList () { // 根据线索主题列表
      this.topicTitleList = []
      this.$axios.post(this.$global.API.topicExtraction,
        this.$qs.stringify({
          content: this.editor.getContentTxt(),
          title: this.title,
          size: 9
        })
      ).then((res) => {
        if (res.code === 0 && res.data) {
          this.topicTitleList = res.data
        }
      })
    },
    checkTopicTitle (item) {
      this.topicTitleCheck = item
      this.getSectionTextList()
    },
    addAndSearchFun () {
      this.addWordCloudUpdate()
    },
    getSectionTextList () { // 根据线索词获取素材
      this.sectionTextList = []
      this.noSectionTextList = false
      if (this.wordsList.length === 0) {
        this.$message({ type: 'warning', message: '请输入关键字', showClose: true })
        return
      }
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '编辑器', '段落关键词搜索', this.wordsList.join(' ')])
      this.sectionLoading = true
      this.$axios.post(this.sucaiType ? this.$global.API.topicSearch : this.$global.API.keywordSearch,
        this.$qs.stringify({
          keyword: this.wordsList.join(' '),
          title: this.sucaiType ? this.topicTitleCheck : this.title,
          size: 50
        })
      ).then((res) => {
        this.sectionLoading = false
        if (res.code === 0 && res.data && res.data.length > 0) {
          this.sectionTextList = res.data
        } else {
          this.noSectionTextList = true
        }
        // if (this.scrollTimer) clearTimeout(this.scrollTimer)
        // this.scrollTimer = setTimeout(() => {
        //   this.$nextTick(() => {
        //     var leftPartScroll = this.$('#left-part-scroll')
        //     var sectionTextList = this.$('#section-text-list')
        //     leftPartScroll.animate({
        //       scrollTop: sectionTextList.position().top + leftPartScroll.scrollTop()
        //     }, 300)
        //   })
        // }, 500)
      })
    },
    getJuziList () { // 获取句子列表
      if (!this.juziKeyword) {
        this.$message({ type: 'warning', message: '请输入词句', showClose: true })
        return
      }
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '编辑器', '词句搜索', this.juziKeyword])
      this.juziList = []
      this.noJuziList = false
      this.juziLoading = true
      this.$axios.post(this.$global.API.sentenceSearch,
        this.$qs.stringify({
          keyword: this.juziKeyword,
          title: this.title,
          size: 50
        })
      ).then((res) => {
        this.juziLoading = false
        if (res.code === 0 && res.data && res.data.length > 0) {
          this.juziList = res.data
        } else {
          this.noJuziList = true
        }
        document.getElementById('left-part-scroll').scrollTop = 0
      })
    },
    getArticleList (keyword) { // 获取文章列表
      this.articleList = []
      this.noArticleList = false
      this.articleLoading = true
      this.$axios.post(this.$global.API.titleSearch,
        this.$qs.stringify({
          // content: this.editor.getContentTxt(),
          title: keyword || this.title,
          size: 50
        })
      ).then((res) => {
        this.articleLoading = false
        if (res.code === 0 && res.data && res.data) {
          this.articleList = res.data
        } else {
          this.noArticleList = true
        }
        this.$nextTick(() => {
          if (document.getElementById('left-part-scroll')) {
            document.getElementById('left-part-scroll').scrollTop = 0
          }
        })
      })
    },
    searchArticleFun () {
      if (!this.articleKeyword) {
        this.$message({ type: 'warning', message: '请输入关键字进行搜索', showClose: true })
        return
      }
      this.getArticleList(this.articleKeyword)
    },
    getKnowledgeList () { // 知识
      this.knowledgeLoading = true
      this.$axios.post(this.$global.API.zhishi,
        this.$qs.stringify({
          'title': this.title,
          'size': 10
        })
      ).then((res) => {
        this.knowledgeLoading = false
        if (res.code === '0' && res.data) {
          this.zhihuList = res.data.zhihu ? (res.data.zhihu.data || []) : []
          this.zhidaoList = res.data.zhidao ? (res.data.zhidao.data || []) : []
          this.baidubaikeList = res.data.baike ? (res.data.baike || []) : []
          this.isShowMoreZhihu = false
          this.isShowMoreZhidao = false
          this.isShowMoreBaike = false
        }
      })
    },
    getGoodSentence () { // 好词好句
      this.goodSentenceLoading = true
      this.$axios.post(this.$global.API.goodSentences,
        this.$qs.stringify({
          title: this.zhishiKeyword,
          size: 20
        })
      ).then((res) => {
        this.goodSentenceLoading = false
        if (res.code === '0' && res.data) {
          this.goodSentenceList = res.data.data
        } else {
          this.goodSentenceList = []
        }
      })
    },
    getZhihuList () { // 获取知乎列表
      this.zhihuLoading = true
      this.$axios.post(this.$global.API.zhihu,
        this.$qs.stringify({
          title: this.zhishiKeyword,
          size: 20
        })
      ).then((res) => {
        this.zhihuLoading = false
        if (res.code === '0' && res.data.zhihu && res.data.zhihu.data) {
          this.zhihuList = res.data.zhihu.data
        } else {
          this.zhihuList = []
        }
      })
    },
    getZhidaoList () {
      this.zhidaoLoading = true
      this.$axios.post(this.$global.API.zhidao,
        this.$qs.stringify({
          title: this.zhishiKeyword,
          size: 20
        })
      ).then((res) => {
        this.zhidaoLoading = false
        if (res.code === '0' && res.data) {
          this.zhidaoList = res.data.zhidao ? (res.data.zhidao.data || []) : []
        } else {
          this.zhidaoList = []
        }
      })
    },
    getBaikeList () {
      this.baikeLoading = true
      this.$axios.post(this.$global.API.baike,
        this.$qs.stringify({
          title: this.zhishiKeyword,
          size: 20
        })
      ).then((res) => {
        this.baikeLoading = false
        if (res.code === '0' && res.data) {
          this.baidubaikeList = res.data.baike ? (res.data.baike || []) : []
        } else {
          this.baidubaikeList = []
        }
      })
    },
    searchZhishiList () { // 搜索知识好词好句等
      if (!this.zhishiKeyword) {
        this.$message({ type: 'warning', message: '请输入关键字', showClose: true })
        return
      }
      if (this.zhishiTabActive === 0) { // 好词好句
        this.getGoodSentence()
      } else if (this.zhishiTabActive === 1) { // 知乎
        this.getZhihuList()
      } else if (this.zhishiTabActive === 2) { // 百度知道
        this.getZhidaoList()
      } else { // 百度百科
        this.getBaikeList()
      }
    },
    zhishiTabSelect (index) {
      this.zhishiTabActive = index
      if (index === 0) { // 好词好句
        this.getGoodSentence()
      } else if (index === 1) { // 知乎
        this.getZhihuList()
      } else if (index === 2) { // 百度知道
        this.getZhidaoList()
      } else { // 百度百科
        this.getBaikeList()
      }
    },
    emotionAnalysis () {
      this.emotionLoading = true
      this.emotionData.positive = 0
      this.emotionData.negative = 0
      this.$axios.post(this.$global.API.emotionTrend,
        this.$qs.stringify({
          keyword: this.emotionKeyword
        })
      ).then((res) => {
        this.emotionLoading = false
        if (res.code === '0' && res.data) {
          this.emotionData.positive = res.data['2'] || ''
          this.emotionData.negative = res.data['0'] || ''
          this.renderEmotionPie()
        }
      })
    },
    emotionSearch () {
      if (!this.emotionKeyword) {
        this.$message({ type: 'warning', message: '请输入关键字', showClose: true })
        return
      }
      this.emotionAnalysis()
    },
    renderEmotionPie () {
      if (!this.myPieChart) {
        this.myPieChart = echarts.init(document.getElementById('pie-chart'))
      }
      let option = {
        legend: {
          orient: 'vertical',
          right: '10',
          bottom: '40%',
          data: ['正面', '负面']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: [
              { value: this.emotionData.positive, name: '正面', itemStyle: { color: '#73DEB3' } },
              { value: this.emotionData.negative, name: '负面', itemStyle: { color: '#73A0FA' } }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                label: {
                  show: true,
                  formatter: '{d}%'
                },
                labelLine: {
                  show: true,
                  // smooths: 0.2,
                  length: 10
                }
              }
            }
          }
        ]
      }
      this.myPieChart.setOption(option)
    },
    beginWrite () {
      if (!this.title) {
        this.$message({ type: 'warning', message: '请输入关键词', showClose: true })
        return
      }
      this.TOGGLE_ANIMATE(true)
      this.$router.replace({
        path: '/layout/create',
        query: {
          hots: this.title,
          again: true
        }
      })
    },
    copyFun () { // 复制方法
      if (window.getSelection()) {
        var selectionObj = window.getSelection()
        var selectedText = selectionObj.toString()
        if (selectedText) {
          this.$copyText(selectedText).then(() => {
            this.$message({ type: 'success', message: '复制成功', showClose: true })
          }, (e) => {
            this.$message({ type: 'warning', message: '复制失败', showClose: true })
          })
        } else {
          this.$message({ type: 'warning', message: '请选中要复制的内容', showClose: true })
        }
      }
    },
    closeViewDetail () {
      this.isShowArticleDetail = false
      this.detailItem = null
    },
    viewArticleDetail (item, no, index) {
      if (no === 0) { // 文章
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '编辑器', '点击推荐文章查看', `第${index+1}篇`])
      } else if (no === 1) { // 知乎
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '编辑器', '点击知乎文章查看', `第${index+1}篇`])
      } else if (no === 2) { // 知道
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '编辑器', '点击百度知道文章查看', `第${index+1}篇`])
      } else if (no === 3) { // 百科
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '编辑器', '点击百度百科文章查看', `第${index+1}篇`])
      }
      this.detailItem = item
      this.$set(this.detailItem, 'tabIdx', no)
      let textContent = ''
      if (no === 0) { // 文章模块
        textContent = item.textcontent.replace('\t\r\n\t', '').split('\r\n\t')
      } else if (no === 1 || no === 2) { // 知乎
        textContent = item.content.replace('\t\r\n\t', '').split('\r\n\t')
      } else if (no === 3) { // 百科
        textContent = item.info.replace('\t\r\n\t', '').split('\r\n\t')
      }
      let arr = []
      for (let it of textContent) {
        if (it && it !== '') {
          let it1 = it.replace(/\s+/ig, '')
          if (it1) arr.push(it1)
        }
      }
      this.articleDetailArr = arr
      this.isShowArticleDetail = true
    },
    // 将编辑器中文字替换的统一方法
    replaceTextToEditor (content, no) {
      this.editor.execCommand('inserthtml', ' ')
      this.editor.selection.getStart().innerHTML = ''
      this.editor.execCommand('inserthtml', content)
      if (no === 1) {
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '编辑器', !this.sucaiType ? '点击默认话题素材替换' : '点击拓展话题素材替换'])
      } else if (no === 2) {
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '编辑器', '点击词句素材替换'])
      } else if (no === 3) {
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '编辑器', '点击文章素材替换'])
      } else if (no === 4) { // 好词好句

      }
    },
    // 向编辑器中插入片段内容的统一方法
    insertTextToEditor (content, no) {
      this.editor.execCommand('inserthtml', content)
      if (no === 1) {
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '编辑器', !this.sucaiType ? '点击默认话题素材插入' : '点击拓展话题素材插入'])
      } else if (no === 2) {
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '编辑器', '点击词句素材插入'])
      } else if (no === 3) {
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '编辑器', '点击文章素材插入'])
      } else if (no === 4) { // 好词好句

      }
    },
    // 富文本编辑器初始化程序
    editorInt: function () {
      var self = this
      if (document.getElementById('editor')) {
        self.editor = UE.getEditor('editor', {
          toolbars: [[
            'undo', 'redo', '|',
            'pasteplain', 'removeformat', 'selectall',
            'paragraph', 'fontsize', 'forecolor', 'bold', 'italic', 'underline', 'fontborder', 'superscript', 'subscript', 'blockquote',
            'insertorderedlist', 'insertunorderedlist',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify',
            'inserttable'
            //            'simpleupload',
            //            'insertimage', 'emotion',
          ]],
          fontsize: [12, 14, 16, 18, 20, 22, 26, 30, 36],
          wordCount: true,
          wordCountMsg: '当前字数：{#count}',
          elementPathEnabled: false,
          enableAutoSave: false,
          autoHeightEnabled: true,
          contextMenu: [
            {
              label: '复制(Ctrl+C)',
              cmdName: 'copy'
            },
            {
              label: '粘贴(Ctrl+V)',
              cmdName: 'paste'
            },
            '-',
            {
              label: '段落联想',
              cmdName: 'cleardoc',
              exec: function () {
                self.mainClose = false
                self.tabIdx = '0'
                if (self.prevNode.innerText) self.getSectionWordCloud(self.prevNode.innerText, true)
              }
            }, {
              label: '句子联想',
              cmdName: 'cleardoc',
              exec: function () {
                if (self.editor.selection.getText()) {
                  self.juziKeyword = self.editor.selection.getText()
                  self.getJuziList()
                }
                self.mainClose = false
                self.tabIdx = '1'
              }
            }, {
              label: '文章联想',
              cmdName: 'cleardoc',
              exec: function () {
                self.mainClose = false
                self.tabIdx = '2'
                self.getArticleList()
              }
            },
            //  {
            //   label: '百科',
            //   cmdName: 'cleardoc',
            //   exec: function () {
            //     self.mainClose = false
            //     self.tabIdx = 3
            //     self.getBaikeList()
            //   }
            // },
            '-', {
              label: '停止联想',
              cmdName: 'insertparagraph',
              exec: function () {
                self.mainClose = true
                self.tabIdx = '1'
              }
            }
          ]
        })
        self.editor.ready(function (editor) {
          self.ecnetTipWrapShow = false
          if (window.localStorage.editerContent) {
            self.articleLength = window.localStorage.editerContent.length
            self.editor.setContent(window.localStorage.editerContent)
            self.getTopicTitleList()
            self.getArticleList()
            // self.getKnowledgeList()
          }
        })
        self.editor.addListener('contentChange', function (editor) {
          window.localStorage.editerContent = self.editor.getContent()
          self.sortContent = self.editor.getContent()
          self.articleLength = window.localStorage.editerContent.length
          var nodeArr = self.editor.selection.document.getElementsByTagName('p')
          // self.setSortBtnPosition()
          self.ecnetKeywordPosition()
          self.sinsitiveKeywordPosition() // 敏感词
          self.removeEcnetColor()
          for (let i = 0; i < nodeArr.length; i++) {
            nodeArr[i].onclick = function () {
              if (self.prevNode)self.prevNode.classList.remove('select')
              for (let j = 0; j < nodeArr.length; j++) {
                nodeArr[j].classList.remove('select')
              }
              this.classList.add('select')
              self.prevNode = this
              self.getSectionWordCloud(self.prevNode.innerText)
            }
          }
        })
        self.editor.addListener('blur', function (editor) {
          self.isFocus = false
          // if (self.prevNode)self.prevNode.classList.remove('select')
        })
      }
    },
    setSortBtnPosition () {
      let self = this
      this.$(this.editor.selection.document).find('p').mouseover(function (e) {
        if (self.tabIdx === '0') {
          var offset = self.$(this).offset()
          let content = self.$('.right-part').find('.content')
          let contentWidth = content[0].offsetWidth
          let editorDocument = self.$('#editor').find('.edui-editor-iframeholder iframe')
          self.sortBtnTop = editorDocument.offset().top + offset.top + 14 - self.$(self.editor.selection.document).scrollTop()
          self.sortBtnLeft = contentWidth + editorDocument.offset().left
        }
      })
    },
    // 按钮操作事件
    checkDulicateFun () {
      let content = this.editor.getPlainTxt().replace(/<[^>]+>/g, '')
      if (!content) {
        this.$message({ type: 'warning', message: '请输入文章内容', showClose: true })
        return
      }
      this.isShowCheckPop = true
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '编辑器', '点击稿件查重'])
    },
    confirmCheck () { // 确定查重
      this.isShowCheckPop = false
      this.$axios.post(this.$global.API.articleCheck,
        this.$qs.stringify({
          title: this.title,
          content: this.editor.getContent(),
          id: this.isEdit ? this.editId : '',
          ctype: this.vType === '1' ? 0 : 1 // 稿件类型：0热点，1提纲，2汽车
        })
      ).then((res) => {
        if (res.code === '0') {
          this.articleHtml = this.editor.getContent()
          this.oldArticleHtml = this.editor.getContent()
          this.oldTitle = this.title
          this.$router.push({ path: '/user', query: { duplicate: 1 } })
        }
      })
    },
    saveArticle () {
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '编辑器', '点击保存稿件'])
      this.$axios.post(this.$global.API.saveContext,
        this.$qs.stringify({
          title: this.title,
          content: this.editor.getContent(),
          id: this.isEdit ? this.editId : '',
          ctype: this.vType === '1' ? 0 : 1 // 稿件类型:0热点，1提纲，2汽车
        })
      ).then((res) => {
        if (res.code === '0') {
          this.articleHtml = this.editor.getContent()
          this.oldArticleHtml = this.editor.getContent()
          this.oldTitle = this.title
          this.$message({ type: 'success', message: '底稿保存成功', showClose: true })
        } else {
          this.$message({ type: 'warning', message: '底稿保存失败', showClose: true })
        }
      })
    },
    downloadFun () { // 下载
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '编辑器', '点击稿件下载'])
      if (!this.title) {
        this.$message({ type: 'warning', message: '请输入标题', showClose: true })
        return
      }
      let content = this.editor.getContent()
      content += `<h2>标题：${this.title}</h2><h4 style="margin-bottom:20px;">作者：${this.createName}</h4>`
      let form = this.$('<form>')
      form.attr('id', 'downloadform')
      form.attr('style', 'display:none')
      form.attr('target', '_blank')
      form.attr('method', 'post')
      form.attr('action', this.$global.API.downloadContext)

      var input2 = this.$('<input>')
      input2.attr('type', 'hidden')
      input2.attr('name', 'title')
      input2.attr('value', this.title)
      form.append(input2)

      var input3 = this.$('<input>')
      input3.attr('type', 'hidden')
      input3.attr('name', 'content')
      input3.attr('value', content)
      form.append(input3)

      this.$('body').append(form)
      form.submit()
      this.$('#downloadform').remove()
    },
    previewFun () { // 预览
      this.isShowPreview = true
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '编辑器', '点击稿件预览'])
    },
    correctFun () { // 纠错
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '编辑器', '点击稿件纠错'])
      let content = this.editor.getContent().replace(/<(table|tr|td|%)[\s\S]*?\/\1>/g, '')
      content = content.replace(/<[^>]+>/g, '\n')
      var contentArr = content.split('\n')
      var contentArr2 = []
      for (var i = 0; i < contentArr.length; i++) {
        if (contentArr[i].length > 5) {
          contentArr2.push(contentArr[i])
        }
      }
      if (contentArr2.length === 0) {
        this.$message({ type: 'warning', message: '字数少于5个不进行检索', showClose: true })
        return
      }
      this.loadText = '正在纠错中......'
      this.writeLoading = true
      this.$axios.post(this.$global.API.detection,
        this.$qs.stringify({
          text: contentArr2.join('\n')
        })
      ).then((res) => {
        this.writeLoading = false
        if (res.code === '0') {
          if (res.data && res.data.length > 0) {
            this.ecnetKeywordRed(res.data)
            this.$message({ type: 'success', message: `为您检测到${res.data.length}处错别字！` })
          } else {
            this.$message({ type: 'success', message: '暂未检测到错别字', showClose: true })
          }
        }
      }).catch((err) => {
        console.log(err)
        this.writeLoading = false
      })
    },
    rewriteFun () { // 改写
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '编辑器', '点击稿件改写'])
      var content = this.editor.getContent().replace(/<(table|tr|td|%)[\s\S]*?\/\1>/g, '')
      content = content.replace(/<[^>]+>/g, '\n')
      this.loadText = '稿件改写中......'
      this.writeLoading = true
      this.$axios.post(this.$global.API.reWrite,
        this.$qs.stringify({
          title: this.title,
          textcontent: content,
          content: this.editor.getContent(),
          id: this.isEdit ? this.editId : ''
        })
      ).then((res) => {
        this.writeLoading = false
        if (res.code === '0') {
          if (res.data && res.data.content) {
            this.rewriteData.origin = this.editor.getContent()
            this.rewriteData.rewrite = res.data.content
            this.rewriteData.rewriteSimilarity = res.data.rewriteSimilarity
            this.rewriteData.isShow = true
          } else {
            this.$message({ type: 'success', message: '暂无改写内容', showClose: true })
          }
        }
      }).catch((err) => {
        console.log(err)
        this.writeLoading = false
      })
    },
    confirmRewrite () { // 确定改写
      this.rewriteData.isShow = false
      this.editor.setContent(this.rewriteData.rewrite)
    },
    // 错词标记处理程序
    ecnetKeywordRed (list) {
      var self = this
      var arr = list
      var arrObj = {}
      for (var i = 0; i < arr.length; i++) {
        if (!arrObj[arr[i].sentence]) {
          arrObj[arr[i].sentence] = {
            html: '',
            strList: [],
            errorList: [{
              start: arr[i].start,
              end: arr[i].end,
              target: arr[i].target,
              keyword: arr[i].keyword
            }]
          }
        } else {
          arrObj[arr[i].sentence].errorList.push({
            start: arr[i].start,
            end: arr[i].end,
            target: arr[i].target,
            keyword: arr[i].keyword
          })
        }
      }

      // 错词排序
      for (let key in arrObj) {
        var t
        for (let i = 0; i < arrObj[key].errorList.length; i++) {
          for (var j = i + 1; j < arrObj[key].errorList.length; j++) {
            if (arrObj[key].errorList[i].start > arrObj[key].errorList[j].start) {
              t = arrObj[key].errorList[i]
              arrObj[key].errorList[i] = arrObj[key].errorList[j]
              arrObj[key].errorList[j] = t
            }
          }
        }
      }

      var text = self.editor.getContent()
      for (let key in arrObj) {
        var errorList = arrObj[key].errorList
        arrObj[key].strList.push(key.slice(0, errorList[0].start))
        for (let i = 0; i < errorList.length; i++) {
          if (i < errorList.length - 1) {
            if (errorList[i].end <= errorList[i + 1].start) {
              arrObj[key].strList.push('<span class="ecnet-keyword" ecnet-pre="' + errorList[i].target + '" ecnet-next="' + errorList[i].keyword + '">' + errorList[i].target + '</span>')
              arrObj[key].strList.push(key.slice(errorList[i].end, errorList[i + 1].start))
            }
          } else {
            arrObj[key].strList.push('<span class="ecnet-keyword" ecnet-pre="' + errorList[i].target + '" ecnet-next="' + errorList[i].keyword + '">' + errorList[i].target + '</span>')
            arrObj[key].strList.push(key.slice(errorList[i].end))
          }
        }
        arrObj[key].html = arrObj[key].strList.join('')
        var reOld = new RegExp(key, 'g')
        text = text.replace(reOld, arrObj[key].html)
      }
      self.editor.setContent(text)
    },
    // 给错词元素绑定事件，并定位错词元素位置
    ecnetKeywordPosition () {
      var self = this
      self.$(self.editor.selection.document).find('.ecnet-keyword').mouseover(function (e) {
        self.ecnetNextDom = self.$(this)
        if (self.ecnetNextDom.attr('ecnet-next')) {
          var offset = self.$(this).offset()
          var editorDocument = self.$('#editor').find('.edui-editor-iframeholder iframe')
          self.ecnetTipWrapShow = true
          self.ecnetNextKeyword = self.ecnetNextDom.attr('ecnet-next')
          self.ecnetTipWrapTop = editorDocument.offset().top + offset.top + 24 - self.$(self.editor.selection.document).scrollTop()
          self.ecnetTipWrapleft = editorDocument.offset().left + offset.left + 10
        }
      })
    },
    // 点击正确词，替换错词
    clickChangeEcnetKeyword () {
      var self = this
      if (self.ecnetNextDom) {
        self.ecnetNextDom[0].innerHTML = self.ecnetNextKeyword
        self.ecnetNextDom.removeAttr('ecnet-pre')
        self.ecnetNextDom.removeAttr('ecnet-next')
        self.ecnetNextDom.removeAttr('class')
        self.ecnetNextDom.unbind()
        self.ecnetTipWrapShow = false
      }
    },
    // 点击忽略该错误
    clickEcnetIgnore () {
      var self = this
      if (self.ecnetNextDom) {
        self.ecnetNextDom.removeAttr('ecnet-pre')
        self.ecnetNextDom.removeAttr('ecnet-next')
        self.ecnetNextDom.removeAttr('class')
        self.ecnetNextDom.unbind()
        self.ecnetNextDom.attr('ecnet-ignore', self.ecnetNextDom.html())
        self.ecnetTipWrapShow = false
      }
    },
    // 已标记内容变化时移除标记
    removeEcnetColor () {
      var self = this
      var thisDom = self.$(self.editor.selection.getStart())
      if (thisDom.attr('ecnet-pre') && thisDom.html() != thisDom.attr('ecnet-pre')) {
        let text = thisDom.html()
        thisDom.remove()
        self.editor.execCommand('inserthtml', text)
      } else if (thisDom.attr('ecnet-ignore')) {
        let text = thisDom.html()
        var ignore = thisDom.attr('ecnet-ignore')
        if (text.length > ignore.length) {
          var str = '<span ecnet-ignore="' + ignore + '">' + ignore + '</span>' + text.replace(ignore, '')
          thisDom.remove()
          self.editor.execCommand('inserthtml', str)
        }
      }
    },
    calculateHeight (no) {
      if (no === 0) { // 知乎
        if (this.zhihuList.length <= 3) {
          return this.zhihuList.length * 214 + 10 + 'px'
        } else {
          let height = this.isShowMoreZhihu ? (this.zhihuList.length * 214 + 10 + 'px') : ((3 * 214 + 10) + 'px')
          return height
        }
      } else if (no === 1) { // 知道
        if (this.zhidaoList.length <= 3) {
          return this.zhidaoList.length * 214 + 10 + 'px'
        } else {
          let height = this.isShowMoreZhidao ? (this.zhidaoList.length * 214 + 10 + 'px') : ((3 * 214 + 10) + 'px')
          return height
        }
      } else { // 百科
        if (this.baidubaikeList.length <= 3) {
          return this.baidubaikeList.length * 214 + 10 + 'px'
        } else {
          let height = this.isShowMoreBaike ? (this.baidubaikeList.length * 214 + 10 + 'px') : ((3 * 214 + 10) + 'px')
          return height
        }
      }
    },
    // 敏感词检测
    sensitiveCheckFun () {
      let content = this.editor.getContent().replace(/<(table|tr|td|%)[\s\S]*?\/\1>/g, '')
      content = content.replace(/<[^>]+>/g, '\n')
      this.loadText = '正在检测中…'
      this.writeLoading = true
      this.$axios.post(this.$global.API.sensitiveCheck,
        this.$qs.stringify({
          content: content
        })
      ).then((res) => {
        this.writeLoading = false
        if (res.code === '0' && res.data) {
          this.showSensitiveCheck = true
          this.checkData = res.data
        }
      })
    },
    showSensitiveFun (arr) {
      this.showSensitiveCheck = false
      if (arr.length === 0) return
      let text = this.editor.getContent()
      let checkKeywords = []
      for (let item of arr) {
        checkKeywords = checkKeywords.concat(item.words)
      }
      for (let i = 0; i < checkKeywords.length; i++) {
        let re = new RegExp(checkKeywords[i], 'g')
        let reStr = '<span class="sinsitive-keyword" data-sinsitive="' + checkKeywords[i] + '">' + checkKeywords[i] + '</span>'
        let reOld = new RegExp(reStr, 'g')
        if (re.test(text)) {
          text = text.replace(reOld, checkKeywords[i])
          text = text.replace(re, reStr)
        }
      }
      this.editor.setContent(text)
      // this.sinsitiveKeywordPosition()
    },
    // 给敏感词元素绑定事件，并定位敏感词元素位置
    sinsitiveKeywordPosition () {
      var self = this
      var editorDocument = self.$('#editor').find('.edui-editor-iframeholder iframe')
      self.$(self.editor.selection.document).find('.sinsitive-keyword').mouseover(function (event) {
        event.stopPropagation() //  阻止事件冒泡
        self.sensitiveNextDom = self.$(this)
        if (self.sensitiveNextDom.attr('data-sinsitive')) {
          var offset = self.$(this).offset()
          self.sensitiveTipWrapShow = true
          self.sensitiveTipWrapTop = editorDocument.offset().top + offset.top + 24
          self.sensitiveTipWrapleft = editorDocument.offset().left + offset.left
        }
      })
    },
    // 忽略敏感词
    clickSinsitiveIgnore () {
      if (this.sensitiveNextDom) {
        this.sensitiveNextDom.removeAttr('data-sinsitive')
        this.sensitiveNextDom.removeAttr('class')
        this.sensitiveNextDom.unbind()
        this.sensitiveTipWrapShow = false
      }
    },
    searchTgSucai () { // 搜索提纲素材

    },
    selectRelative (item) { // 选择相关推荐
      this.showRelatives = false
      this.tgKeyword = item
      this.searchTgSucai()
    },
    changeBatch () { // 换一批
      clearTimeout(this.hideRelativeFlag)
    },
    scInputFocus () { // 提纲素材输入获取焦点
      this.showRelatives = true
    },
    scInputBlur () { // 提纲素材输入失去焦点
      this.hideRelativeFlag = setTimeout(() => {
        this.showRelatives = false
      }, 1000)
    },
    scInputChange (e) {
      clearTimeout(this.relativeSearchFlag)
      this.relativeSearchFlag = setTimeout(() => {
        this.searchTgSucai()
      }, 1000)
    },
    outlineRecommend () {
      this.$axios.post(this.$global.API.outlineRecommend,
        this.$qs.stringify({
          subTitle: '严格要求牢记入党誓词',
          pageSize: 10,
          reset: false
        })
      ).then((res) => {

      })
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'create') {
      localStorage.editerTitle = this.title
    }
    if (this.title !== this.oldTitle || this.articleHtml !== this.oldArticleHtml) {
      this.$set(this, 'popObj', {
        isShow: true,
        confirmFun: () => {
          this.popObj.isShow = false
          next()
        },
        cancelFun: () => {
          this.popObj.isShow = false
          next(false)
        }
      })
    } else {
      next()
    }
  }
}
</script>
<style lang="scss">
#edit {
  position:absolute;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;

  .main {
    height: 100%;
    width: 100%;
    position: relative;
    .switch {
      width: 48px;
      height: 48px;
      position: absolute;
      left: 20px;
      top:88%;
      z-index: 99;
      transition:all 0.3s;
      .inner{
        overflow: hidden;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        line-height: 48px;
        text-align: center;
        display: block;
        background: #FFFFFF;
        box-shadow: 0 0 14px 0 rgba(8,46,121,0.30);
        transform: translateY(0);
        animation:run 5.4s ease 2s infinite;
      }
    }
    .left-part {
      width: 500px;
      position: absolute;
      left: -520px;
      top: 0;
      bottom: 20px;
      transition: all .3s;
      opacity: 0;
      border-top: 1px solid #EEF1F6;
      .content{
        background-color: #fff;
        box-shadow: 0 4px 6px 0 rgba(0,0,0,0.10);
        padding: 84px 20px 20px;
        // border-radius: 20px;
      }

      .tab-wrap {
        width: 460px;
        height: 70px;
        padding-top: 16px;
        // margin-bottom: 30px;
        background-color: #fff;
        z-index: 10;
        position: fixed;
        top: 61px;
        left: 20px;
        li {
          width: 62px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          color: #0182E8;
          font-size: 14px;
          border-radius: 15px;
          border: 1px solid #0182E8;
          display: inline-block;
          margin-right: 20px;
          cursor: pointer;
        }
        .active {
          background-color: #0182E8;
          color: #fff;
        }
      }
      .article-detail {
        min-height: 600px;
        h2 {
          font-size: 28px;
          color: #222;
          font-family: PingFangSC-Semibold;
          margin-bottom: 4px;
        }
        .from {
          font-size: 12px;
          color: #999;
        }
        .close {
          height: 20px;
          margin-bottom: 10px;
          .close-icon {
            display: inline-block;
            padding: 0 0 0 20px;
            float:right;
            cursor:pointer;
            background-size: 11px 11px;
            background-repeat: no-repeat;
            background-position: left center;
            background-image: url('../../images/icons/icon_close.png');
          }
        }

      }
      .search-wrap {
        height: 44px;
        width: 100%;
        margin-bottom: 30px;
        position: relative;
        .search-input {
          height: 44px;
          width: 405px;
          background-color: #ECF4FA;
          border-radius: 22px;
          text-indent: 20px;
        }
        .query-icon {
          width: 44px;
          height: 44px;
          display: inline-block;
          background-image: url('../../images/icons/icon_search_1.png');
          background-size: 44px 44px;
          background-repeat: no-repeat;
          background-position: center center;
          background-color: #0182E8;
          border-radius: 50%;
          position: absolute;
          right: 0;
          top: 50%;
          margin-top: -22px;
          cursor: pointer;
        }
        .search-relatives {
          width: 405px;
          // min-width: 80px;
          box-shadow:0px 4px 14px 0px rgba(0,0,0,0.2);
          background-color: #fff;
          border-radius:10px;
          position: absolute;
          top: 58px;
          left: 0;
          padding: 20px 16px 44px 16px;
          ul {
            li {
              margin-bottom: 14px;
              color: #333333;
              cursor: pointer;
            }
          }
          .refresh-btn {
            height: 20px;
            width: 72px;
            background-image: url('../../images/icons/icon_refresh_3.png');
            background-size: 15px 15px;
            background-position: left center;
            background-repeat: no-repeat;
            color: #0E5DFF;
            cursor: pointer;
            display: inline-block;
            position: absolute;
            right: 14px;
            bottom: 14px;
            padding-left: 20px;
          }
        }
      }
      .word-cloud {
        width: 100%;
        min-height: 100px;
        border-radius: 4px;
        background-color: #ECF4FA;
        padding: 15px 20px;
        font-size: 14px;
        h4{
          color: #5F676D;
        }
        .words-list {
          margin:13px 0 0;
          min-height: 76px;
          li {
            display: inline-block;
            height: 28px;
            line-height: 28px;
            border-radius: 14px;
            background-color: #fff;
            font-size: 14px;
            color: #0182E8;
            padding: 0 28px 0 16px;
            margin-right: 10px;
            margin-bottom: 10px;
            position: relative;
            .delete-icon {
              display: inline-block;
              height: 24px;
              width: 24px;
              background-image: url('../../images/icons/icon_delete.png');
              background-size: 24px 24px;
              background-position: center center;
              background-repeat: no-repeat;
              cursor: pointer;
              position: absolute;
              right: 4px;
              top: 50%;
              margin-top: -12px;
            }
            .add-icon {
              display: inline-block;
              height: 24px;
              width: 24px;
              background-image: url('../../images/icons/icon_add.png');
              background-size: 24px 24px;
              background-position: center center;
              background-repeat: no-repeat;
              cursor: pointer;
              position: absolute;
              right: 4px;
              top: 50%;
              margin-top: -12px;
            }
            .disabled {
              opacity: .4;
            }
          }
        }
        .tips {
          margin: 0 auto;
          width: 165px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          font-size: 14px;
          color: #0182E8;
          cursor: pointer;
          .refresh-btn {
            margin-right: 5px;
            vertical-align: middle;
            display: inline-block;
            height: 24px;
            width: 24px;
            background-image: url('../../images/icons/icon_refresh.png');
            background-size: 24px 24px;
            background-position: center center;
            background-repeat: no-repeat;
          }
        }
      }
      .topic-title{
        width: 100%;
        min-height: 100px;
        border-radius: 4px;
        background-color: #ECF4FA;
        padding: 15px 20px 5px;
        font-size: 14px;
        margin-top: 14px;
        h4{
          color: #5F676D;
        }
        ul{
          padding-top: 15px;
          li{
            cursor: pointer;
            margin-bottom: 10px;
            line-height: 26px;
            background: #FFFFFF;
            border-radius: 14px;
            border:1px solid #ffffff;
            font-size: 14px;
            color: #333333;
            padding:0 10px;
            transition: all 0.3s;
            &:hover{
              border: 1px solid #0182E8;
              color: #0182E8;
            }
            &.active{
              background: #0182E8;
              color: #ffffff;
            }
          }
        }
      }

      .tab-item{
        min-height: 200px;
        .list{
          padding-top: 14px;
          li{
            // background: #EEF8FF;
            background-color: #fff;
            border: 1px solid #C0D6EA;
            border-radius: 4px;
            padding:14px 14px 39px;
            margin-bottom: 10px;
            position: relative;
            -webkit-transition: all .2s linear;
            transition: all .2s linear;
            &:hover {
              box-shadow: 0 4px 8px 0 rgba(0,0,0,0.10);
              border: 1px solid #85C9FF;
            }
            h3{
              font-size: 15px;
              color: #333333;
              font-weight: bolder;
              margin-bottom: 5px;
            }
            .summary{
              font-size: 14px;
              color: #333333;
              letter-spacing: 0;
              text-align: justify;
              line-height: 24px;
            }
            .showTwoLine {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
            .btn{
              position: absolute;
              bottom: 10px;
              cursor: pointer;
              font-size: 13px;
              color: #697C8A;
              -webkit-transition: all .2s linear;
              transition: all .2s linear;
              img{
                margin-right: 3px;
              }
              .tip{
                width: 50px;
                height: 26px;
                line-height: 26px;
                text-align: center;
                display: none;
                border-radius: 6px;
                background: #606670;
                font-size: 12px;
                color: #FFFFFF;
                box-shadow: 0 2px 4px 0 rgba(0,0,0,0.30);
                position: absolute;
                top: -28px;
                font-style: normal;
              }
              &:hover {
                .tip{
                  display: inline-block;
                }
              }
            }
            .btn1{
              left: 14px;
            }
            .btn2{
              right: 60px;
              width: 40px;
              height: 28px;
              border-radius: 15px;
              background-color: #fff;
              background-size: 14px 14px;
              background-position: center center;
              background-image: url('../../images/icons/icon_change.png');
              background-repeat: no-repeat;
              &:hover {
                transform: translate3d(0, -2px, 0);
                box-shadow: 0 3px 5px 0 rgba(0,157,255,0.32);
              }
            }
            .btn3{
              right: 14px;
              width: 40px;
              height: 28px;
              border-radius: 15px;
              background-color: #fff;
              // box-shadow: 0 3px 5px 0 rgba(0,157,255,0.32);
              background-size: 12px 13px;
              background-position: center center;
              background-image: url('../../images/icons/icon_insert.png');
              background-repeat: no-repeat;
              &:hover {
                transform: translate3d(0, -2px, 0);
                box-shadow: 0 3px 5px 0 rgba(0,157,255,0.32);
              }
            }
            .source {
              position: absolute;
              bottom: 10px;
              left: 14px;
              cursor: pointer;
              font-size: 13px;
              padding-left: 22px;
              background-image: url('../../images/icons/icon_topic.png');
              background-repeat: no-repeat;
              background-size: 16px 14px;
              background-position: left center;
              color: #0182E8;
              font-size: 12px;
            }
            .copy-btn {
              right: 110px;
              width: 40px;
              height: 28px;
              border-radius: 15px;
              background-color: #fff;
              // box-shadow: 0 3px 5px 0 rgba(0,157,255,0.32);
              background-size: 12px 13px;
              background-position: center center;
              background-image: url('../../images/icons/icon_copy.png');
              background-repeat: no-repeat;
              &:hover {
                box-shadow: 0 3px 5px 0 rgba(0,157,255,0.32);
                transform: translate3d(0, -2px, 0);
              }
            }
            .from {
              font-size: 12px;
              color: #999999;
              margin-top: 10px;
            }
            .insert-btn {
              right: 14px;
              width: 40px;
              height: 28px;
              border-radius: 15px;
              background-color: #fff;
              // box-shadow: 0 3px 5px 0 rgba(0,157,255,0.32);
              background-size: 12px 10px;
              background-position: center center;
              background-image: url('../../images/icons/icon_reffer.png');
              background-repeat: no-repeat;
              &:hover {
                transform: translate3d(0, -2px, 0);
                box-shadow: 0 3px 5px 0 rgba(0,157,255,0.32);
              }
            }
            .view-btn {
              right: 14px;
              width: 46px;
              height: 28px;
              border-radius: 15px;
              background-color: #fff;
              // box-shadow: 0 3px 5px 0 rgba(0,157,255,0.32);
              background-size: 19px 13px;
              background-position: center center;
              background-image: url('../../images/icons/view.png');
              background-repeat: no-repeat;
              &:hover {
                transform: translate3d(0, -2px, 0);
                box-shadow: 0 3px 5px 0 rgba(0,157,255,0.32);
              }
            }
          }
          .article-item {
            padding-left: 145px;
            .cover {
              height: 100px;
              width: 100px;
              border: 1px solid #C9DDED;
              border-radius: 4px;
              position: absolute;
              left: 20px;
              top: 20px;
            }
            .no-cover {
              height: 100px;
              width: 100px;
              border-radius: 4px;
              position: absolute;
              left: 20px;
              top: 20px;
              background-image: url('../../images/no_bgimg.png');
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center center;
            }
            h3 {
              font-size: 20px;
              margin-bottom: 17px;
            }
          }
          .zhihu-item {
            .author {
              color: #0182E8;
              font-size: 12px;
              margin-right: 10px;
            }
            .date {
              color: #999999;
              font-size: 12px;
            }
          }
        }
        .zhihu-list {
          transition: height .5s linear;
          overflow: hidden;
          li {
            .summary {
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;  // 控制多行的行数
              -webkit-box-orient: vertical;
            }
            &.article-item {
              height: 204px;
            }
          }
        }
        .show-more {
          height: 20px;
          // position: relative;
          text-align: right;
          span {
            height: 20px;
            line-height: 20px;
            display: inline-block;
            padding-right: 22px;
            font-size:14px;
            color: #5D6471;
            background-size: 16px 16px;
            background-repeat: no-repeat;
            background-position: right center;
            background-image: url('../../images/icons/more_icon.png');
            cursor: pointer;
            &.open {
              background-image: url('../../images/icons/more_up_icon.png');
            }
          }
        }
        .no-more{
          font-size: 12px;
          color: #A1A1A1;
          padding:15px 0;
          text-align: center;
        }
        .tab-title {
          height: 20px;
          text-indent: 10px;
          font-size: 14px;
          color: #333;
          font-family: PingFangSC-Semibold;
          border-left: 4px solid #0182E8;
          margin-bottom: 10px;
        }
        .sc-keyword-input {
          min-height: 44px;
          max-height: 84px;
          margin-bottom: 18px;
          position: relative;
          input {
            height: 44px;
            width: 404px;
            border-radius: 22px;
            font-size: 14px;
            background-color: #ECF4FA;
            padding: 10px 12px;
          }
          .search-btn {
            width: 44px;
            height: 44px;
            background-image: url('../../images/icons/icon_search_1.png');
            background-repeat: no-repeat;
            position: absolute;
            right: 0;
            top: 0;
          }
          .sc-keyword-list {
            width: 404px;
            background-color: #ECF4FA;
            border-radius: 22px;
            padding:8px 10px 0 10px;
            // position: absolute;
            // left: 0;
            // top: 0;
            li {
              height: 28px;
              line-height: 28px;
              border-radius: 14px;
              padding: 0 30px 0 14px;
              background-color: #fff;
              margin-left: 10px;
              margin-bottom: 8px;
              float: left;
              position: relative;
              font-size: 14px;
              .delete-icon{
                display: inline-block;
                height: 24px;
                width: 24px;
                background-image: url('../../images/icons/icon_delete.png');
                background-size: 24px 24px;
                background-position: center center;
                background-repeat: no-repeat;
                cursor: pointer;
                position: absolute;
                right: 4px;
                top: 50%;
                margin-top: -12px;
              }
            }
          }
        }
        .sc-lenovo {
          height: 22px;
          margin-top: 20px;
          margin-bottom: 20px;
          .default {
            margin-right: 30px;
            font-size: 14px;
            cursor: pointer;
          }
          .default-active {
            color: #0182E8;
          }
          .el-select {
            .el-input__inner {
              border: 0;
              color: #0182E8;
              &::placeholder {
                color: #333333;
              }
            }
            .el-input .el-select__caret {
              font-size: 20px;
              color: #525560;
            }

          }

        }
        .zhishi-tab {
          margin-bottom: 30px;
          li {
            height: 30px;
            width: 80px;
            text-align: center;
            line-height: 30px;
            border-radius: 18px;
            color: #0182E8;
            border: 1px solid #0182E8;
            cursor: pointer;
            float: left;
            margin-right: 15px;
            &:last-child {
              margin-right: 0;
            }
            &.active {
              color: #fff;
              background-color: #0182E8;
            }
          }
        }
        #pie-chart {
          height: 360px;
          width: 460px;
          position: relative;
        }
      }
    }
    .right-part {
      position: absolute;
      left: 120px;
      top: 0;
      right: 0;
      bottom:0;
      transition:all 0.3s;
      .content {
        background-color: #fff;
        box-shadow: 0 4px 6px 0 rgba(0,0,0,0.10);
        margin:66px 120px 20px 0;
        border-radius: 20px;
        padding:30px;
        .keyword{
          padding:0 0 18px;
          margin-bottom: 20px;
          border-bottom: 1px solid #E5E5E5;
          position: relative;
          input{
            height: 38px;
            font-size: 28px;
            color: #333333;
            font-weight: bolder;
            display: block;
            width: 100%;
            padding-right: 100px;
          }
          .btn{
            position: absolute;
            right: 0;
            top:0;
            display: block;
            width: 38px;
            height: 38px;
            background: #0182E8;
            border-radius: 50%;
            text-align: center;
            line-height: 38px;
          }
        }
        .article-info {
          height: 28px;
          position: relative;
          margin-bottom: 20px;
          .item {
            width: 270px;
            height: 28px;
            display: inline-block;
            font-size: 14px;
            .label {
              color: #999999;
              margin-right: 10px;
            }
            input {
              height: 28px;
              width: 130px;
              color: #222;
              text-indent: 14px;
              border-radius: 14px;
              border: 1px solid #ddd;
            }
          }
          .word-count {
            font-size: 14px;
            color: #999;
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .editor{
          min-height: 600px;
          .edui-default .edui-editor-toolbarbox{
            position: fixed;
            right: 0;
            top:60px;
            z-index: 99;
            width: 100%;
            width: calc(100% - 500px);
            // padding-left: 500px;
            .edui-toolbar {
              text-align: left;
            }
          }
          .edui-editor,
          .edui-editor-iframeholder{
            width: 100% !important;
          }
        }
        .handle-btns {
          width: 44px;
          position: fixed;
          right: 64px;
          bottom: 30px;
          li {
            height: 44px;
            width: 44px;
            background-color: #fff;
            box-shadow: 0 3px 5px 0 rgba(0,157,255,0.32);
            border-radius: 15px;
            position: relative;
            margin-bottom: 10px;
            &:hover {
              background-image: linear-gradient(180deg, #4D87FF 0%, #0EA0FF 100%);
              button {
                color: #fff;
              }
            }
            &:hover::after {
              content: attr(data-title);    //取到data-title属性的值
              width: 65px;
              height: 26px;
              display: inline-block;
              text-align: center;
              line-height: 26px;
              font-size: 12px;
              background-color: #606670;
              color: #fff;
              border-radius: 6px;
              border-radius: 6px;
              box-shadow: 0 2px 4px 0 rgba(0,0,0,0.30);
              position: absolute;
              top: 12px;
              left: -68px;
            }
            &:last-child {
              margin-bottom: 0;
            }
            button {
              width: 44px;
              height: 44px;
              border-radius: 15px;
              background-repeat: no-repeat;
              background-position: center center;
              color: #1B8FEB;
            }
            .error-btn {
              background-size: 18px 19px;
              background-image: url('../../images/icons/find_error.png');
              &:hover {
                background-image: url('../../images/icons/find_error_1.png');
              }
            }
            .edit-btn {
              background-size: 18px 19px;
              background-image: url('../../images/icons/edit.png');
              &:hover {
                background-image: url('../../images/icons/edit_1.png');
              }
            }
            .query-btn {
              background-size: 19px 19px;
              background-image: url('../../images/icons/query_new.png');
              &:hover {
                background-image: url('../../images/icons/query_new_1.png');
              }
            }
            .view-btn {
              background-size: 19px 13px;
              background-image: url('../../images/icons/view.png');
              &:hover {
                background-image: url('../../images/icons/view_1.png');
              }
            }
            .sort-btn {
              background-size: 16px 17px;
              background-image: url('../../images/icons/sort.png');
              &:hover {
                background-image: url('../../images/icons/sort_1.png');
              }
            }
            .sensitive-btn {
              background-size: 22px 22px;
              background-image: url('../../images/icons/word.png');
              &:hover {
                background-image: url('../../images/icons/word_1.png');
              }
            }
            .save-btn {
              background-size: 16px 16px;
              background-image: url('../../images/icons/save.png');
              &:hover {
                background-image: url('../../images/icons/save_1.png');
              }
            }
            .download-btn {
              background-size: 17px 15px;
              background-image: url('../../images/icons/download.png');
              &:hover {
                background-image: url('../../images/icons/download_1.png');
              }
            }
          }
        }
        .ecnet-tip-wrap{
          position: fixed;
          z-index: 100;
          border: 1px solid #eee;
          background: #fff;
        }
        .ecnet-tip-wrap>div{
          font-size: 16px;
          line-height: 30px;
          padding: 0 10px;
          user-select: none;
        }
        .ecnet-tip-wrap>div:last-child{
          font-size: 14px;
          line-height: 25px;
        }
        .ecnet-tip-wrap>div:hover{
          background: #eee;
          cursor: pointer;
        }
      }
    }
    &.close{
      .switch{
        top:88%;
        animation: toBottom 1s;
      }
    }
    &.show{
      .switch{
        top: -42px;
        animation: toTop 1s;
        .inner{
          transform: translateY(0);
          animation:none;
        }
      }
      .left-part{
        left: 0;
        opacity: 1;
      }
      .right-part{
        left: 540px;
      }
    }
  }
}
@keyframes toTop {
  0% {top:88%;}
  20% {top:80%;}
  30% {top:88%;}
  40% {top:80%;}
  50% {top:88%;}
  100% {top: -42px;}
}
@keyframes toBottom {
  0% {top: -42px;}
  20% {top:10px;}
  30% {top:-42px;}
  40% {top:10px;}
  50% {top:-42px;}
  100% {top: 88%;}
}
@keyframes run{
  0%{  transform: translateY(-60px);}
  2.5%{  transform: translateY(0);  }
  5%{  transform: translateY(-60px);  }
  7.5%{  transform: translateY(0);  }
  100%{  transform: translateY(0);  }
}
@media screen and (max-width: 1466px){
  #edit .main .right-part .content {
    margin-top: 98px;
  }
}
</style>
