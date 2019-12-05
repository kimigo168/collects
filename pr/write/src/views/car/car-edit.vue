<template>
  <div id="car-edit" v-loading="loading">
    <div class="main">

      <div class="left-part">
        <div class="fodder-box">
          <el-tabs class="el-tabs-fodder" v-model="fodderActive">

            <el-tab-pane label="图文素材" name="1">
              <div class="box fodder scroll" id="fodder-scroll" :style="{'height': fodderBoxHeight+'px'}">
                <el-tabs class="el-tabs-children" v-model="fodderActive1Active">
                  <el-tab-pane label="句库" name="0">
                    <div class="clearfix">
                      <div class="input">
                        <span>
                          <img class="img1" src="./../../images/car/fodder-input-1-1.png">
                          <b>车系</b>
                        </span>
                        <el-select v-model="carTypeCheck2"
                                   @change="fodderCarTypeElementChange()"
                                   @clear="fodderCarTypeClear('carTypeList2')"
                                   size="medium"
                                   filterable
                                   remote
                                   clearable
                                   :reserve-keyword="false"
                                   :remote-method="remoteMethod2"
                                   :selectLoading="selectLoading"
                                   placeholder="请输入车系关键词检索">
                          <el-option
                            v-for="item in carTypeList2"
                            :key="item.idText"
                            :label="item.text"
                            :value="item.idText">
                          </el-option>
                        </el-select>
                      </div>
                      <div class="input">
                        <span>
                          <img class="img1" src="./../../images/car/fodder-input-2-1.png">
                          <b>元素</b>
                        </span>
                        <el-cascader
                          v-model="element"
                          :options="elementList"
                          size="medium"
                          @change="fodderElementChange()"
                          placeholder="请选择元素">
                        </el-cascader>
                      </div>
                    </div>

                    <el-tabs class="children" v-model="fodderActive1Active1Active">
                      <el-tab-pane label="基础句库" name="0" v-loading="fodderTextLoading">
                        <ul class="list list-text list-entity">
                          <li v-for="(item,$index) in fodderTextList">
                            <i class="icon" v-if="item.libraryType == 1"></i>
                            <div class="summary" :style="{'text-indent': item.libraryType ==1 ? '2em':'0'}">
                              {{$index + 1}}、{{item.content}}
                              <p style="padding-top: 5px;" v-if="item.scoreInfo">{{item.scoreInfo}}</p>
                            </div>
                            <p class="time">
                              <span v-if="item.createTimeStr">{{item.createTimeStr}}</span>
                            </p>
                            <div class="btns">
                              <a class="btn1" href="javascript:;" @click="replaceTextToEditor(item.content)">
                                <span>替换</span>
                              </a>
                              <a class="btn2" href="javascript:;" @click="insertTextToEditor(item.content)">
                                <span>插入</span>
                              </a>
                            </div>
                          </li>
                          <li class="load-more" v-show="fodderTextList.length==0 && !fodderTextLoading">
                            <span v-if="!carTypeCheck2 || element.length==0">请选择车系和元素</span>
                            <span v-else>暂无数据</span>
                          </li>
                        </ul>
                      </el-tab-pane>

                      <el-tab-pane label="数据表格" name="-3" v-loading="fodderTextLoading"
                                   v-if="elementStr == '价格-指导价' && carTypeCheck2">
                        <ul class="list list-text list-entity list-price">

                          <li v-for="list in fodderZhidaojiaTableList">
                            <div class="summary summary-model">
                              <table>
                                <tbody>
                                <tr v-for="listChildren in list">
                                  <td v-for="item in listChildren">{{item}}</td>
                                </tr>
                                </tbody>
                              </table>
                            </div>
                            <div class="btns">
                              <a class="btn2" href="javascript:;" @click="insertFodderTable($event)"><span>插入</span></a>
                            </div>
                          </li>
                          <li class="load-more" v-show="fodderZhidaojiaTableList.length==0 && !fodderTextLoading">
                            暂无数据
                          </li>
                        </ul>
                      </el-tab-pane>

                      <el-tab-pane label="数据表格" name="-2" v-loading="fodderTextLoading"
                                   v-if="elementStr == '价格-销量' && carTypeCheck2">
                        <ul class="list list-text list-entity list-price">

                          <li v-if="fodderXiaoliangTableList.tableData">
                            <div class="summary">
                              <table>
                                <tbody>
                                <tr v-for="listChildren in fodderXiaoliangTableList.tableData">
                                  <td v-for="item in listChildren">{{item}}</td>
                                </tr>
                                </tbody>
                              </table>
                              <p>{{fodderXiaoliangTableList.conclusion}}</p>
                            </div>
                            <div class="btns">
                              <a class="btn2" href="javascript:;" @click="insertFodderTable($event)"><span>插入</span></a>
                            </div>
                          </li>
                          <li class="load-more" v-show="!fodderXiaoliangTableList.tableData && !fodderTextLoading">
                            暂无数据
                          </li>
                        </ul>
                      </el-tab-pane>

                      <el-tab-pane label="数据句库" name="-1" v-loading="fodderDongliTextLoading" v-if="elementHasDongli">
                        <ul class="list list-text list-entity">

                          <li class="image-chexing" style="padding:10px 0;" v-show="fodderDongliChexingGroup.length>0">
                            <div class="summary">
                            <span class="tag" :class="{'active':fodderDongliChexingGroupCheck == item.chexing_id}"
                                  v-for="item in fodderDongliChexingGroup" :title="item.text"
                                  @click="fodderDongliTextChexingGroupCheckChange(item.chexing_id)">{{item.text}}</span>
                            </div>
                          </li>

                          <li v-for="item in fodderDongliTextList">
                            <div class="summary" v-html="item.content"></div>
                            <p class="time">
                              <span v-if="item.createTimeStr">{{item.createTimeStr}}</span>
                            </p>
                            <div class="btns">
                              <a class="btn1" href="javascript:;" @click="replaceTextToEditor(item.content)"><span>替换</span></a>
                              <a class="btn2" href="javascript:;" @click="insertTextToEditor(item.content)"><span>插入</span></a>
                            </div>
                          </li>

                          <li class="load-more" v-show="fodderDongliTextList.length==0 && !fodderDongliTextLoading">
                            暂无数据
                          </li>
                        </ul>
                      </el-tab-pane>

                    </el-tabs>
                  </el-tab-pane>

                  <el-tab-pane label="图库" name="01" v-loading="fodderImageLoading">

                    <div class="clearfix">
                      <div class="input">
                      <span>
                        <img class="img1" src="./../../images/car/fodder-input-1-1.png">
                        <b>车系</b>
                      </span>
                        <el-select v-model="carTypeCheck3"
                                   @change="getFodderChexingGroupData()"
                                   @clear="fodderCarTypeClear('carTypeList3')"
                                   size="medium"
                                   filterable
                                   remote
                                   clearable
                                   :reserve-keyword="false"
                                   :remote-method="remoteMethod3"
                                   :selectLoading="selectLoading"
                                   placeholder="请输入车系关键词检索">
                          <el-option
                            v-for="item in carTypeList3"
                            :key="item.idText"
                            :label="item.text"
                            :value="item.idText">
                          </el-option>
                        </el-select>
                      </div>
                      <div class="input">
                        <span>
                          <img class="img1" src="./../../images/car/fodder-input-2-1.png">
                          <b>元素</b>
                        </span>
                        <el-cascader
                          v-model="fodderImageElement"
                          :options="imageElementList"
                          size="medium"
                          @change="getFodderImageListData()"
                          placeholder="请选择元素">
                        </el-cascader>
                      </div>
                    </div>
                    <ul class="list list-image clearfix">
                      <li class="image-chexing" v-show="fodderImageChexingGroup.length>0">
                        <div class="summary">
                            <span class="tag" :class="{'active':fodderImageChexingGroupCheck == item.chexing_id}"
                                  v-for="item in fodderImageChexingGroup"
                                  @click="fodderImageChexingGroupCheckChange(item.chexing_id)">{{item.text}}</span>
                        </div>
                      </li>
                      <li v-for="item in fodderImageList" @click="insertImageToEditor(item.imageL)">
                        <div class="img" :style="{backgroundImage: 'url('+ item.imageS +')'}"></div>
                        <h3 :title="item.title_s">{{item.title_s}}</h3>
                      </li>
                      <li class="load-more" v-show="fodderImageList.length>0">
                        <a href="javascript:;" @click="getFodderImageListData(fodderImagePageNo+1)">{{fodderImageLoadMoreText}}</a>
                      </li>
                    </ul>
                  </el-tab-pane>

                  <el-tab-pane label="词句联想" name="1" v-loading="fodderTextLoading">

                    <div class="input">
                    <span>
                      <img class="img1" src="./../../images/car/fodder-input-2-1.png">
                      <b>联想词</b>
                    </span>
                      <input v-model="phrasesKeyword" @keyup.enter="clickGetPhrasesListData('')" type="text"
                             placeholder="请输入联想词搜索相关词句素材">
                      <i class="el-icon-search" @click="clickGetPhrasesListData('')"></i>
                    </div>
                    <ul class="list list-text list-entity">

                      <li class="image-chexing" v-show="isGetPhrasesList">
                        <div class="summary">
                          <span>筛选：</span>
                          <span class="tag" :class="{'active':phrasesChexiActive == ''}"
                                @click="clickGetPhrasesListData('')">全部</span>
                          <span class="tag" :class="{'active':phrasesChexiActive == carTypeCheck2 }"
                                v-show="carTypeCheck2"
                                @click="clickGetPhrasesListData(carTypeCheck2)">{{GetText(carTypeCheck2)}}</span>
                        </div>
                      </li>

                      <li v-for="item in phrasesList">
                        <div class="summary" v-html="item.content"></div>
                        <p class="time">
                          <span v-if="item.createTime">{{item.createTime}}</span>
                        </p>
                        <div class="btns">
                          <a class="btn1" href="javascript:;" @click="replaceTextToEditor(item.content)"><span>替换</span></a>
                          <a class="btn2" href="javascript:;" @click="insertTextToEditor(item.content)"><span>插入</span></a>
                        </div>
                      </li>
                      <li class="load-more" v-show="phrasesList.length>0">
                        <a href="javascript:;" @click="getPhrasesListData(phrasesPageNo+1)">{{phrasesLoadMoreText}}</a>
                      </li>
                    </ul>
                  </el-tab-pane>
                </el-tabs>

              </div>
            </el-tab-pane>

            <el-tab-pane label="汽车对比" name="4">
              <div class="box scroll" id="cars-contrast-scroll" :style="{'height': fodderBoxHeight+'px'}">
                <CarsContrast :fodderBoxHeight="fodderBoxHeight" @insertTextToEditor="insertTextToEditor" @replaceTextToEditor="replaceTextToEditor" ref="carsContrast"></CarsContrast>
              </div>
            </el-tab-pane>
            <el-tab-pane label="汽车图谱" name="2">
              <div class="box scroll" id="cars-graph-scroll" :style="{'height': fodderBoxHeight+'px'}">
              <CarsGraph ref="carsGraph" @insertImageToEditor="insertImageToEditor"></CarsGraph>
              </div>
            </el-tab-pane>
            <el-tab-pane label="车网导航" name="5">
              <div class="box scroll" id="web-nav-scroll" :style="{'height': fodderBoxHeight+'px'}">
              <WebNav></WebNav>
              </div>
            </el-tab-pane>

          </el-tabs>
        </div>
      </div>

      <div class="right-part scroll">
        <div class="content">
          <div class="keyword">
            <input type="text" v-model="title"/>
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
          </div>
          <div class="editor" id="editor"></div>
          <ul class="handle-btns">
            <li data-title="稿件查重" @click="checkDulicateFun">
              <button class="query-btn"></button>
            </li>
            <li data-title="稿件纠错" @click="correctFun">
              <button class="error-btn"></button>
            </li>
            <li data-title="稿件改写" @click="rewriteFun">
              <button class="edit-btn"></button>
            </li>
            <li data-title="段落排序" @click="openSortPop">
              <button class="sort-btn"></button>
            </li>
            <li data-title="敏感词检测" @click="sensitiveCheckFun"><button class="sensitive-btn"></button></li>
            <li data-title="稿件预览" @click="previewFun">
              <button class="view-btn"></button>
            </li>
            <li data-title="保存稿件" @click="saveArticle">
              <button class="save-btn"></button>
            </li>
            <li data-title="稿件下载" @click="downloadFun">
              <button class="download-btn"></button>
            </li>
          </ul>
          <!-- 文本纠错 -->
          <div class="ecnet-tip-wrap" v-show="ecnetTipWrapShow"
               :style="{'top':ecnetTipWrapTop+'px','left':ecnetTipWrapleft+'px'}">
            <div @click="clickChangeEcnetKeyword()">{{ecnetNextKeyword}}</div>
            <div @click="clickEcnetIgnore()">忽略该错误</div>
          </div>
          <!-- 敏感词 -->
          <div class="ecnet-tip-wrap" v-show="sensitiveTipWrapShow" :style="{'top':sensitiveTipWrapTop+'px','left':sensitiveTipWrapleft+'px'}">
            <div class="no" @click="clickSinsitiveIgnore()">忽略</div>
          </div>
          <!-- 选取文本后展示菜单 -->
          <div class="select-text-menu" v-show="selectTextMenuShow"
               :style="{'top':selectTextMenuTop+'px','left':selectTextMenuLeft+'px'}">
            <div class="row" @click="clickPhrasesSearch()">
              <img src="./../../images/robot_icon-1.png"/>
              <p>词句联想</p>
            </div>
            <div class="line"></div>
            <div class="row" @click="clickSynonymsRewrite()">
              <img src="./../../images/robot_icon-1.png"/>
              <p>划句改写</p>
            </div>
            <div class="line"></div>
            <div class="row" @click="selectTextMenuShow=false">
              <p>关闭</p>
            </div>
          </div>
          <!-- 选图片后展示菜单 -->
          <div class="select-text-menu" v-show="selectImageMenuShow"
               :style="{'top':selectImageMenuTop+'px','left':selectImageMenuLeft+'px'}">
            <div class="row" @click="clickImageCropper()">
              <img src="./../../images/robot_icon-1.png"/>
              <p>图片裁剪</p>
            </div>
            <div class="line"></div>
            <div class="row" @click="selectImageMenuShow=false">
              <p>关闭</p>
            </div>
          </div>
        </div>
      </div>

    </div>
    <!-- 段落排序弹窗 -->
    <para-sort-pop v-if="isShowSortPop" :isShowSortPop="isShowSortPop" :title="title" :content="sortContent"
                   @fClose="isShowSortPop=false" @fConfirmSort="sortBackFun"></para-sort-pop>
    <!-- 查重提示弹窗 -->
    <check-pop v-if="isShowCheckPop" @fClose="isShowCheckPop=false" @fConfirm="confirmCheck"></check-pop>
    <!-- 稿件全文预览弹窗 -->
    <preview-pop v-if="isShowPreview" :date="createDate" :author="createName" :title="title" :content="sortContent"
                 @fClosePreview="isShowPreview=false"></preview-pop>
    <!-- 改写弹窗 -->
    <rewrite-pop v-if="rewriteData.isShow" :rewriteData="rewriteData" @fClosePop="rewriteData.isShow=false"
                 @fConfirmRewrite="confirmRewrite"></rewrite-pop>


    <el-dialog title="图片裁剪" :visible.sync="cropperModelShow" width="735px" :close-on-click-modal="false"
               :close-on-press-escape="false">

      <vueCropper
        ref="cropper"
        :img="cropperImg"
        autoCrop
        :canScale="false"
        :canMove="false"
        infoTrue
        centerBox
        full
        @imgLoad="cropperImgLoad"
        style="height: 500px;"
      ></vueCropper>

      <div class="btns">
        <button class="btn btn2" type="button" @click="cropperModelShow = false">取消</button>
        <button class="btn" type="button" @click="clickSaveCropper()">保存</button>
      </div>
    </el-dialog>

    <leave-confirm :popObj="popObj"></leave-confirm>
    <loading-tips v-if="writeLoading" :loadText="loadText"></loading-tips>
    <!-- 敏感词检测 -->
    <sensitive-check v-if="showSensitiveCheck" :checkData="checkData" @fConfirmShow="showSensitiveFun" @fClose="showSensitiveCheck=false"></sensitive-check>

  </div>
</template>
<script>
  import {mapMutations} from 'vuex'
  import paraSortPop from '../../components/paraSortPop'
  import loadingTips from '@/components/loadingTips'
  import checkPop from './../edit/check-pop'
  import previewPop from './../edit/preview-pop'
  import rewritePop from './../edit/rewrite-pop'
  import leaveConfirm from './../edit/leave-confirm'
  import sensitiveCheck from './../edit/sensitive-check'

  import WebNav from "./pop/web-nav.vue" // 网址导航
  import CarsContrast from "./pop/cars-contrast.vue" // 两车对比
  import CarsGraph from "./pop/cars-graph.vue"  // 汽车图谱

  export default {
    components: {
      paraSortPop,
      checkPop,
      previewPop,
      rewritePop,
      leaveConfirm,
      loadingTips,
      sensitiveCheck,

      WebNav,
      CarsContrast,
      CarsGraph
    },
    data() {
      return {
        mainClose: false,


        // 左侧辅助模块
        fodderActive: '1',
        fodderActive1Active: '0',
        element: [],
        elementHasDongli: false,
        carTypeCheck2: '',
        carTypeList2: [],
        fodderActive1Active1Active: '0',
        fodderZhidaojiaTableList: [],
        fodderXiaoliangTableList: {},
        fodderDongliTextList: [],
        fodderDongliTextPageNo: 0,
        fodderDongliTextLoadMoreText: '点击加载更多',
        fodderDongliChexingGroup: [],
        fodderDongliChexingGroupCheck: '',
        fodderTextList: [],
        fodderTextPageNo: 0,
        fodderTextLoadMoreText: '点击加载更多',
        carTypeCheck3: '',
        carTypeList3: [],
        fodderImageElement: [],
        fodderImageList: [],
        fodderImagePageNo: 0,
        fodderImageLoadMoreText: '点击加载更多',
        fodderImageChexingGroup: [],
        fodderImageChexingGroupCheck: '',
        phrasesList: [],
        phrasesPageNo: 0,
        phrasesLoadMoreText: '点击加载更多',
        phrasesKeyword: '',
        phrasesChexiActive: '',
        isGetPhrasesList: false,
        fodderDongliTextLoading: false,
        fodderTextLoading: false,
        fodderImageLoading: false,
        selectLoading: false,


        // 编辑文章相关
        createName: 'AI 写作机器人',
        createDate: '',
        title: '',
        articleHtml: '',
        oldTitle: '',
        oldArticleHtml: '',
        oldAuthor: '',
        editId: '',
        isEdit: false,
        isFocus: false,

        // 编辑器辅助功能按钮相关
        isShowSortPop: false, // 段落排序弹窗
        sortContent: '', // 用于排序的内容
        isShowCheckPop: false,
        isShowPreview: false, // 显示预览弹窗
        rewriteData: {
          origin: '', // 改写前文章
          rewrite: '',
          isShow: false, // 显示改写弹窗
          rewriteSimilarity: 0, // 相似度
          type: 1, // 1:划句改写 ；2:全文改写
        },

        writeLoading: false,
        loadText: '稿件改写中......',
        // 错词提示
        ecnetTipWrapShow: false,
        ecnetTipWrapTop: 0,
        ecnetTipWrapleft: 0,
        ecnetNextKeyword: '',
        ecnetNextDom: null,

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

        popObj: {
          isShow: false,
          confirmFun: function () {
          },
          cancelFun: function () {
          }
        },

        //编辑器弹出菜单
        selectTextMenuShow: false,
        selectTextMenuTop: 0,
        selectTextMenuLeft: 0,
        mouseX: 0,
        mouseY: 0,

        selectImageMenuShow: false,
        selectImageMenuTop: 0,
        selectImageMenuLeft: 0,
        cropperModelShow: false,
        cropperImg: '',

        loading: false,


        fodderBoxHeight:700,
      }
    },
    computed: {
      elementStr() {
        return this.element.join('-');
      },
      elementList() {
        return this.$store.state.elementList
      },
      imageElementList() {
        return this.$store.state.imageElementList
      },
    },
    watch: {
      title(val) {
        window.localStorage.editerTitle = val
      },
      '$store.state.elementList'() {
        if (this.$store.state.elementList[0] && this.$store.state.elementList[0].children && this.$store.state.elementList[0].children[0]) {
          this.element = [this.$store.state.elementList[0].value, this.$store.state.elementList[0].children[0].value];
          this.fodderCarTypeElementChange();
        }
      },
      '$store.state.imageElementList'() {
        if (this.$store.state.imageElementList[0] && this.$store.state.imageElementList[0].children && this.$store.state.imageElementList[0].children[0]) {
          this.fodderImageElement = [this.$store.state.imageElementList[0].value, this.$store.state.imageElementList[0].children[0].value];
          this.getFodderImageListData();
        }
      },
    },
    created() {
      this.getElementList();
      this.getImageElementList();
      this.getCardTypeList('', ['carTypeList', 'carTypeList2', 'carTypeList3', 'addCarTypeList']);
      this.getCardTypeList('', ['templatechexingList', 'templatechexingList2'], 1);

      this.init()
    },
    mounted() {
      this.editorInt()
      this.heightReset()
      window.onresize = ()=> {
        this.heightReset();
      }
      this.getSessionStorage()
    },
    destroyed: function () {
      if (this.editor) this.editor.destroy()
    },
    methods: {
      ...mapMutations(['TOGGLE_ANIMATE']),
      getSessionStorage(){
        var self=this;
        if(window.sessionStorage.templateType){
          self.templateType=window.sessionStorage.templateType *1;
          if(self.templateType === 1){
            if(window.sessionStorage.templatechexingCheck && window.sessionStorage.templatechexingCheck2) {
              self.templatechexingCheck = window.sessionStorage.templatechexingCheck;
              self.templatechexingCheck2 = window.sessionStorage.templatechexingCheck2;

              self.fodderActive = '4';
              self.$refs.carsContrast.parentClick(self.templatechexingCheck,self.templatechexingCheck2);
              if(self.templatechexingCheck){
                self.clickEditBtnIfContrast(self.GetId(self.templatechexingCheck));
              }else  if(self.templatechexingCheck2){
                self.clickEditBtnIfContrast(self.GetId(self.templatechexingCheck2));
              }
            }
          }else if(self.templateType === 0){
            if(window.sessionStorage.carTypeCheck){
              self.carTypeCheck=JSON.parse(window.sessionStorage.carTypeCheck);
              var chexi='';
              self.fodderActive = '1';
              if (self.carTypeCheck.length > 0) {
                chexi=self.carTypeCheck[0];
              }

              self.carTypeCheck2 = chexi;
              self.carTypeList2=[{
                text:self.GetText(chexi),
                id:self.GetId(chexi),
                idText:chexi
              }];
              self.fodderCarTypeElementChange();
              self.carTypeCheck3 = chexi;
              self.carTypeList3=[{
                text:self.GetText(chexi),
                id:self.GetId(chexi),
                idText:chexi
              }];
              self.getFodderChexingGroupData();
              self.$refs.carsGraph.parentClick(chexi);
            }
          }
          window.sessionStorage.removeItem('templateType');
          window.sessionStorage.removeItem('carTypeCheck');
          window.sessionStorage.removeItem('templatechexingCheck');
          window.sessionStorage.removeItem('templatechexingCheck2');
        }
      },
      //当模板写作为辆车对比时，导入到图文素材
      clickEditBtnIfContrast(chexing_id){
        var self=this;
        self.$http({
          url: self.$global.BASEURL + '/car/chexi.do',
          data: {
            chexing_id: chexing_id
          },
          success: function (data) {
            if (data.code == 0 && data.data && data.data.id) {
              self.carTypeCheck2 = data.data.id+'&'+data.data.text;
              self.carTypeList2=[{
                text:data.data.text,
                id:data.data.id,
                idText:data.data.id+'&'+data.data.text
              }];
              self.fodderCarTypeElementChange();
              self.carTypeCheck3 = data.data.id+'&'+data.data.text;
              self.carTypeList3=[{
                text:data.data.text,
                id:data.data.id,
                idText:data.data.id+'&'+data.data.text
              }];
              self.getFodderChexingGroupData();
              self.$refs.carsGraph.parentClick(data.data.id+'&'+data.data.text);
            }
          }
        })
      },


      //车系远程搜索多选
      remoteMethod: function (query) {
        var self = this;
        if (query || (self.carTypeCheck.length == 0 && query == '')) {
          self.selectLoading = true;
          if (self.timer) clearTimeout(self.timer);
          self.timer = setTimeout(function () {
            self.getCardTypeList(query, 'carTypeList');
          }, 200)
        } else {
          self.carTypeList = [];
        }
      },
      carTypeCheckChange: function (val) {
        console.log(val)
        this.carTypeList = [];
        if (val.length == 0) {
          this.getCardTypeList('', 'carTypeList');
        }
      },
      //车系远程搜索多选
      remoteMethod2: function (query) {
        var self = this;
        self.selectLoading = true;
        if (self.timer) clearTimeout(self.timer);
        self.timer = setTimeout(function () {
          self.getCardTypeList(query, 'carTypeList2');
        }, 200)
      },
      remoteMethod3: function (query) {
        var self = this;
        self.selectLoading = true;
        if (self.timer) clearTimeout(self.timer);
        self.timer = setTimeout(function () {
          self.getCardTypeList(query, 'carTypeList3');
        }, 200)
      },
      fodderCarTypeClear: function (carTypeList) {
        this.getCardTypeList('', carTypeList);
      },
      addRemoteMethod: function (query) {
        var self = this;
        self.selectLoading = true;
        if (self.timer) clearTimeout(self.timer);
        self.timer = setTimeout(function () {
          self.getCardTypeList(query, 'addCarTypeList');
        }, 200)
      },
      templateChexingRemoteMethod: function (query) {
        var self = this;
        self.selectLoading = true;
        if (self.timer) clearTimeout(self.timer);
        self.timer = setTimeout(function () {
          self.getCardTypeList(query, 'templatechexingList', 1);
        }, 200)
      },
      templateChexingRemoteMethod2: function (query) {
        var self = this;
        self.selectLoading = true;
        if (self.timer) clearTimeout(self.timer);
        self.timer = setTimeout(function () {
          self.getCardTypeList(query, 'templatechexingList2', 1);
        }, 200)
      },
      templateChexingClear: function (carTypeList) {
        this.getCardTypeList('', carTypeList, 1);
      },
      //搜索车系
      getCardTypeList: function (query, carTypeList, type) {
        var self = this;
        self.selectLoading = true;
        self.$http({
          url: self.$global.BASEURL + "/media/complete/search.do",
          data: {
            q: query,
            type: type
          },
          success: function (data) {
            if (data.code == 0 && data.data) {
              for (var i = 0; i < data.data.length; i++) {
                data.data[i].idText = data.data[i].id + '&' + data.data[i].text
              }
              if (typeof (carTypeList) == 'object') {
                for (var i = 0; i < carTypeList.length; i++) {
                  self[carTypeList[i]] = data.data;
                }
              } else {
                self[carTypeList] = data.data;
              }

            } else {
              if (typeof (carTypeList) == 'object') {
                self[carTypeList[i]] = [];
              } else {
                self[carTypeList] = [];
              }
            }
            self.selectLoading = false;
          }
        })
      },


      //图文素材处车系发生变化时
      fodderCarTypeElementChange: function () {
        var elementStr = this.element.join('-');
        this.elementHasDongli = this.element.indexOf('动力') > -1 && this.carTypeCheck2;
        if (elementStr == '价格-指导价' && this.carTypeCheck2) {
          this.getFodderZhidaojiaTableListData();
        } else if (elementStr == '价格-销量' && this.carTypeCheck2) {
          this.getFodderXiaoliangTableListData();
        } else if (this.elementHasDongli) {

        } else {
          this.fodderActive1Active1Active = '0';
        }
        this.getFodderDongliChexingGroupData();
        this.getFodderTextListData();
      },
      //图文素材处元素发生变化时
      fodderElementChange: function () {
        var elementStr = this.element.join('-');
        this.elementHasDongli = this.element.indexOf('动力') > -1 && this.carTypeCheck2;
        if (elementStr == '价格-指导价' && this.carTypeCheck2) {
          this.getFodderZhidaojiaTableListData();
        } else if (elementStr == '价格-销量' && this.carTypeCheck2) {
          this.getFodderXiaoliangTableListData();
        } else if (this.elementHasDongli) {
          this.getFodderDongliTextListData();
        } else {
          this.fodderActive1Active1Active = '0';
        }
        this.getFodderTextListData();
      },
      //获取价格-指导价
      getFodderZhidaojiaTableListData: function () {
        var self = this;
        self.fodderTextLoading = true;
        self.$http({
          url: self.$global.BASEURL + "/price/gprice_form.do",
          type: 'GET',
          data: {
            chexi_id: self.GetId(self.carTypeCheck2)
          },
          success: function (data) {
            self.fodderTextLoading = false;
            if (data.code == 0 && data.data && data.data.length > 0) {
              if (self.fodderActive1Active1Active != '1') self.fodderActive1Active1Active = '-3';
              self.fodderZhidaojiaTableList = data.data;
              self.$nextTick(function () {
                $('#fodder-scroll').scrollTop(0);
              })
            } else {
              self.fodderZhidaojiaTableList = [];
            }
          }, error: function () {
            self.fodderTextLoading = false;
          }
        })
      },
      //获取价格-销量
      getFodderXiaoliangTableListData: function () {
        var self = this;
        self.fodderTextLoading = true;
        self.$http({
          url: self.$global.BASEURL + "/price/sales_form.do",
          type: 'GET',
          data: {
            chexi_id: self.GetId(self.carTypeCheck2)
          },
          success: function (data) {
            self.fodderTextLoading = false;
            if (data.code == 0 && data.data && data.data.tableData) {
              if (self.fodderActive1Active1Active != '1') self.fodderActive1Active1Active = '-2';
              self.fodderXiaoliangTableList = data.data;
              self.$nextTick(function () {
                $('#fodder-scroll').scrollTop(0);
              })
            } else {
              self.fodderXiaoliangTableList = {};
            }
          }, error: function () {
            self.fodderTextLoading = false;
          }
        })
      },
      //点击插入表格素材
      insertFodderTable: function ($event) {
        var obj = this.$($event.target.parentNode.parentNode).find('.summary');
        console.log(obj);
        var content = obj.html();
        this.editor.execCommand('inserthtml', content);
      },


      //获取素材数据词句车型列表
      getFodderDongliChexingGroupData: function (chexing) {
        var self = this;
        self.fodderImageLoading = true;
        self.$http({
          url: self.$global.BASEURL + "/media/chexiGroup.do",
          data: {
            chexi_id: self.GetId(self.carTypeCheck2),
            type: '1'
          },
          success: function (data) {
            self.fodderImageLoading = false;
            if (data.code == 0 && data.data) {
              self.fodderDongliChexingGroup = data.data;
              if (chexing) {
                self.fodderDongliTextChexingGroupCheckChange(chexing);
              } else {
                self.fodderDongliTextChexingGroupCheckChange(self.fodderDongliChexingGroup.length > 0 ? self.fodderDongliChexingGroup[0].chexing_id : '');
              }

            } else {
              self.fodderDongliChexingGroup = [];
            }
          }
        })
      },
      fodderDongliTextChexingGroupCheckChange: function (chexing_id) {
        this.fodderDongliChexingGroupCheck = chexing_id;
        if (this.elementHasDongli) {
          this.getFodderDongliTextListData();
        }

      },

      //获取数据词句列表
      getFodderDongliTextListData: function (pageNo) {
        var self = this;
        self.fodderDongliTextLoading = true;
        self.fodderDongliTextLoadMoreText = '加载中…';
        self.$http({
          url: self.$global.BASEURL + "/sentence/data/list.do",
          data: {
            chexing_id: self.fodderDongliChexingGroupCheck,
            element: self.element.join('-'),
            pageNo: pageNo || 1,
            pageSize: 30
          },
          success: function (data) {
            self.fodderDongliTextLoading = false;
            self.fodderDongliTextLoadMoreText = '点击加载更多';
            if (data.code == 0 && data.data && data.data.length > 0) {
              if (self.fodderActive1Active1Active != '1') self.fodderActive1Active1Active = '-1';
              if (pageNo && pageNo > 1) {
                self.fodderDongliTextList = self.fodderDongliTextList.concat(data.data);
              } else {
                self.fodderDongliTextList = data.data;
                self.$nextTick(function () {
                  $('#fodder-scroll').scrollTop(0);
                })
              }
              self.fodderDongliTextPageNo = pageNo || 1;
            } else {
              if (pageNo && pageNo > 1) {
                self.fodderDongliTextLoadMoreText = '没有更多了';
              } else {
                self.fodderDongliTextList = [];
              }
            }
          }, error: function () {
            self.fodderDongliTextLoading = false;
          }
        })
      },

      //获取素材文字列表
      getFodderTextListData: function (pageNo) {
        var self = this;
        self.fodderTextLoading = true;
        self.fodderTextLoadMoreText = '加载中…';
        self.$http({
          url: self.$global.BASEURL + "/sentence/suggest.do",
          data: {
            type: '0',
            chexi_id: self.GetId(self.carTypeCheck2),
            element: self.element.join('-'),
            pageNo: pageNo || 1,
            pageSize: 30
          },
          success: function (data) {
            self.fodderTextLoading = false;
            self.fodderTextLoadMoreText = '点击加载更多';
            if (data.code == 0 && data.data && data.data.data && data.data.data && data.data.data.length > 0) {
              if (pageNo && pageNo > 1) {
                self.fodderTextList = self.fodderTextList.concat(data.data.data);
              } else {
                self.fodderTextList = data.data.data;
                self.$nextTick(function () {
                  $('#fodder-scroll').scrollTop(0);
                })
              }
              self.fodderTextPageNo = pageNo || 1;
            } else {
              if (pageNo && pageNo > 1) {
                self.fodderTextLoadMoreText = '没有更多了';
              } else {
                self.fodderTextList = [];
              }
            }
          }, error: function () {
            self.fodderTextLoading = false;
          }
        })
      },


      //获取素材图片车型列表
      getFodderChexingGroupData: function () {
        var self = this;
        self.fodderImageLoading = true;
        self.$http({
          url: self.$global.BASEURL + "/media/chexiGroup.do",
          data: {
            chexi_id: self.GetId(self.carTypeCheck3),
            type: '0'
          },
          success: function (data) {
            self.fodderImageLoading = false;
            if (data.code == 0 && data.data) {
              self.fodderImageChexingGroup = data.data;
            } else {
              self.fodderImageChexingGroup = [];
            }
            if (self.carTypeCheck3) {
              var m = 0;
              for (var i = 0; i < self.fodderImageChexingGroup.length; i++) {
                if (self.fodderImageChexingGroup[i].text != self.GetText(self.carTypeCheck3)) {
                  m++;
                }
              }
              if (m == self.fodderImageChexingGroup.length) {
                self.fodderImageChexingGroup.unshift({
                  text: self.GetText(self.carTypeCheck3),
                  chexing_id: self.GetId(self.carTypeCheck3),
                })
              }
            }
            console.log(self.fodderImageChexingGroup)
            self.fodderImageChexingGroupCheckChange(self.GetId(self.carTypeCheck3), self.GetId(self.carTypeCheck3));
          }
        })
      },
      fodderImageChexingGroupCheckChange: function (chexing_id) {
        this.fodderImageChexingGroupCheck = chexing_id + '';
        this.getFodderImageListData(1);
      },
      //获取素材图片列表
      getFodderImageListData: function (pageNo) {
        var self = this;
        self.fodderImageLoading = true;
        self.fodderImageLoadMoreText = '加载中…';
        self.$http({
          url: self.$global.BASEURL + "/media/list.do",
          data: {
            type: '0',
            chexi_id: self.fodderImageChexingGroupCheck.indexOf('_') > -1 ? self.fodderImageChexingGroupCheck : '',
            chexing_id: self.fodderImageChexingGroupCheck.indexOf('_') == -1 ? self.fodderImageChexingGroupCheck : '',
            element: self.fodderImageElement.join('-'),
            pageNo: pageNo || 1,
            pageSize: 30
          },
          success: function (data) {
            self.fodderImageLoading = false;
            self.fodderImageLoadMoreText = '点击加载更多';
            if (data.code == 0 && data.data && data.data.data && data.data.data && data.data.data.length > 0) {
              if (pageNo && pageNo > 1) {
                self.fodderImageList = self.fodderImageList.concat(data.data.data);
              } else {
                self.fodderImageList = data.data.data;
                self.$nextTick(function () {
                  $('#fodder-scroll').scrollTop(0);
                })
              }
              self.fodderImagePageNo = pageNo || 1;
            } else {
              if (pageNo && pageNo > 1) {
                self.fodderImageLoadMoreText = '没有更多了';
              } else {
                self.fodderImageList = [];
              }
            }

          }, error: function () {
            self.fodderImageLoading = false;
          }
        })
      },

      clickGetPhrasesListData: function (chexi) {
        this.phrasesChexiActive = chexi || '';
        this.getPhrasesListData();
      },
      //获取词句联想
      getPhrasesListData: function (pageNo) {
        var self = this;

        self.fodderTextLoading = true;
        self.phrasesLoadMoreText = '加载中…';
        self.$http({
          url: self.$global.BASEURL + "/sentence/association.do",
          data: {
            keyword: self.phrasesKeyword,
            chexi_id: self.GetId(self.phrasesChexiActive),
            pageNo: pageNo || 1,
            pageSize: 30
          },
          success: function (data) {
            self.fodderTextLoading = false;
            self.phrasesLoadMoreText = '点击加载更多';
            if (data.code == 0 && data.data && data.data.data && data.data.data && data.data.data.length > 0) {
              if (pageNo && pageNo > 1) {
                self.phrasesList = self.phrasesList.concat(data.data.data);
              } else {
                self.phrasesList = data.data.data;
                self.$nextTick(function () {
                  $('#fodder-scroll').scrollTop(0);
                })
              }
              self.phrasesPageNo = pageNo || 1;
              self.isGetPhrasesList = true;
            } else {
              if (pageNo && pageNo > 1) {
                self.phrasesLoadMoreText = '没有更多了';
              } else {
                self.phrasesList = [];
              }
            }

          }, error: function () {
            self.fodderTextLoading = false;
          }
        })
      },


      //获取词句元素树
      getElementList() {
        var self = this;
        self.$http({
          url: self.$global.BASEURL + "/car/tag/tree.do",
          type: 'GET',
          data: {
            type: 0,
          },
          success: function (data) {
            if (data.code == 0 && data.data) {
              self.$store.commit('changeElementList', data.data);
            }
          }
        })
      },
      //获取图片元素树
      getImageElementList() {
        var self = this;
        self.$http({
          url: self.$global.BASEURL + "/car/tag/tree.do",
          type: 'GET',
          data: {
            type: 1,
          },
          success: function (data) {
            if (data.code == 0 && data.data) {
              self.$store.commit('changeImageElementList', data.data);
            }
          }
        })
      },


      init() {
        this.createDate = new Date().format('YYYY年M月D日')
        if (this.$route.query.write === 2) { // 编辑
          this.editId = localStorage.articleId
          this.oldTitle = window.localStorage.editerTitle
          this.oldArticleHtml = window.localStorage.editerContent
          this.isEdit = true
        } else {
          this.isEdit = false
        }

        if (window.localStorage.editerTitle) {
          this.title = window.localStorage.editerTitle
          this.articleHtml = window.localStorage.editerContent
        }
      },

      sortBackFun(content) {
        this.isShowSortPop = false
        this.editor.setContent(content)
      },
      openSortPop() {
        _czc.push(['_trackEvent', '编辑器', '点击段落排序'])
        this.isShowSortPop = true
      },
      copyFun() { // 复制方法
        if (window.getSelection()) {
          var selectionObj = window.getSelection()
          var selectedText = selectionObj.toString()
          if (selectedText) {
            this.$copyText(selectedText).then(() => {
              this.$message({type: 'success', message: '复制成功', showClose: true})
            }, (e) => {
              this.$message({type: 'warning', message: '复制失败', showClose: true})
            })
          } else {
            this.$message({type: 'warning', message: '请选中要复制的内容', showClose: true})
          }
        }
      },


      //将编辑器中文字替换的统一方法
      replaceTextToEditor: function (content) {
        var self = this;
        var nodeArr = self.editor.selection.getStartElementPath();
        var hasSection = false;
        var sectionNode = null;
        for (var i = 0; i < nodeArr.length; i++) {
          if (nodeArr[i].getAttribute("chexi")) {
            hasSection = true;
            sectionNode = nodeArr[i];
            break
          }
        }

        this.editor.execCommand('inserthtml', ' ');
        if (hasSection) {
          sectionNode.innerHTML = '';
        } else {
          self.editor.selection.getStart().innerHTML = '';
        }
        this.editor.execCommand('inserthtml', content);

      },
      //向编辑器中插入片段内容的统一方法
      insertTextToEditor: function (content) {
        this.editor.execCommand('inserthtml', content);
      },
      //向编辑器中插入图片的统一方法
      insertImageToEditor: function (url) {
        this.editor.execCommand('insertimage', {
          src: url,
          _src: url,
        });
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
              'inserttable',
              //            'simpleupload',
//                          'insertimage', 'emotion',
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
                label: '词句联想',
                cmdName: 'cleardoc',
                exec: function () {
                  self.clickPhrasesSearch()
                }
              }, {
                label: '划句改写',
                cmdName: 'cleardoc',
                exec: function () {
                  self.clickSynonymsRewrite()
                }
              },
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
              self.editor.setContent(window.localStorage.editerContent)
            }

            self.$(self.editor.selection.document).mousemove((e) => {
              self.mouseX = e.clientX
              self.mouseY = e.clientY
            })
          })
          self.editor.addListener('contentChange', function (editor) {
            window.localStorage.editerContent = self.editor.getContent()
            self.sortContent = self.editor.getContent()
            var nodeArr = self.editor.selection.document.getElementsByTagName('p')
            self.ecnetKeywordPosition()
            self.removeEcnetColor()
          })
          self.editor.addListener('focus', function (editor) {
            self.isFocus = true;
          });
          self.editor.addListener('blur', function (editor) {
            self.isFocus = false;
            if (self.prevNode) self.prevNode.classList.remove("select");
          });
          self.editor.addListener("selectionchange", function (type, arg1, arg2) {
            self.ecnetTipWrapShow = false;
            self.selectTextMenuShow = false;
            self.selectImageMenuShow = false;
            self.selectionText = self.editor.selection.getText();
            var thisDom = self.editor.selection.getStart();


            if(self.isFocus){
              //选中编辑器中文本
              if (self.selectionText.length > 0) {
                self.selectTextMenuShow = true
                var editorBoxPosition = self.$('#editor').position()
                self.selectTextMenuLeft = editorBoxPosition.left + self.mouseX + 10
                self.selectTextMenuTop = editorBoxPosition.top + self.mouseY + 10
              } else if (thisDom.nodeName == 'IMG') {
                // 选中编辑器中图片时
                self.fodderActive1Active = '01';
                self.selectImageMenuShow = true
                var editorBoxPosition = self.$('#editor').position()
                self.selectImageMenuLeft = editorBoxPosition.left + self.mouseX + 10
                self.selectImageMenuTop = editorBoxPosition.top + self.mouseY + 10
              }
            }

            //匹配素材筛选
            if (self.prevNode) self.prevNode.classList.remove("select");
            var nodeArr = self.editor.selection.getStartElementPath();
            for (var i = 0; i < nodeArr.length; i++) {
              var chexi_id = nodeArr[i].getAttribute("chexi_id");
              var material_type = nodeArr[i].getAttribute("material_type");
              var chexing_id1 = nodeArr[i].getAttribute("chexing_id1");
              var chexing_id2 = nodeArr[i].getAttribute("chexing_id2");

              if (material_type && chexing_id1 && chexing_id2) {
                self.showTemplate = false;
                var chexing1 = nodeArr[i].getAttribute("chexing1")

                var chexing2 = nodeArr[i].getAttribute("chexing2")

                nodeArr[i].classList.add("select");
                self.prevNode = nodeArr[i];
                self.fodderActive = '4';
                self.$refs.carsContrast.parentClick(chexing_id1 + '&' + chexing1, chexing_id2 + '&' + chexing2, material_type);
                break
              } else if (chexi_id) {
                var chexi = nodeArr[i].getAttribute("chexi");

                self.showTemplate = false;
                var yuansu = nodeArr[i].getAttribute("yuansu");
                nodeArr[i].classList.add("select");
                self.prevNode = nodeArr[i];
                self.fodderActive = '1';

                if (thisDom.nodeName == 'IMG') {
                  if (chexi_id + '&' + chexi != self.carTypeCheck3 || yuansu != self.fodderImageElement.join('-')) {
                    self.carTypeCheck3 = chexi_id + '&' + chexi;
                    self.carTypeList3 = [{
                      text: chexi,
                      id: chexi_id,
                      idText: self.carTypeCheck3
                    }];
                    if (yuansu) self.fodderImageElement = yuansu.split('-');
                    self.getFodderChexingGroupData();
                  }
                } else {
                  self.fodderActive1Active = '0';
                  if (self.element.indexOf('动力') > -1 && self.carTypeCheck2) {
                    self.fodderActive1Active1Active = '-1';
                  } else {
                    self.fodderActive1Active1Active = '0';
                  }
                  if (chexi_id + '&' + chexi != self.carTypeCheck2 || yuansu != self.element.join('-')) {
                    self.carTypeCheck2 = chexi_id + '&' + chexi;
                    self.carTypeList2 = [{
                      text: chexi,
                      id: chexi_id,
                      idText: self.carTypeCheck2
                    }];
                    if (yuansu) self.element = yuansu.split('-');
                    self.fodderCarTypeElementChange();
                  }
                }
                break
              }
            }

          });
        }
      },
      // 按钮操作事件
      checkDulicateFun() {
        let content = this.editor.getPlainTxt().replace(/<[^>]+>/g, '')
        if (!content) {
          this.$message({type: 'warning', message: '请输入文章内容', showClose: true})
          return
        }
        this.isShowCheckPop = true
        _czc.push(['_trackEvent', '编辑器', '点击稿件查重'])
      },
      confirmCheck() { // 确定查重
        this.isShowCheckPop = false
        let content = this.editor.getPlainTxt().replace(/<[^>]+>/g, '')
        this.$axios.post(this.$global.API.articleCheck,
          this.$qs.stringify({
            ctype: 2,
            title: this.title,
            content: this.editor.getContent(),
            textContent: content,
          })
        ).then((res) => {
          if (res.code === '0') {
            this.articleHtml = this.editor.getContent()
            this.oldArticleHtml = this.editor.getContent()
            this.oldTitle = this.title
            this.$router.push({path: '/user', query: {duplicate: 1}})
          }
        })
      },
      saveArticle() {
        _czc.push(['_trackEvent', '编辑器', '点击保存稿件'])
        this.$axios.post(this.$global.API.saveContext,
          this.$qs.stringify({
            ctype: 2,
            title: this.title,
            content: this.editor.getContent(),
            id: this.isEdit ? this.editId : ''
          })
        ).then((res) => {
          if (res.code === '0') {
            this.articleHtml = this.editor.getContent()
            this.oldArticleHtml = this.editor.getContent()
            this.oldTitle = this.title
            this.$message({type: 'success', message: '底稿保存成功', showClose: true})
          } else {
            this.$message({type: 'warning', message: '底稿保存失败', showClose: true})
          }
        })
      },
      downloadFun() { // 下载
        _czc.push(['_trackEvent', '编辑器', '点击稿件下载'])
        if (!this.title) {
          this.$message({type: 'warning', message: '请输入标题', showClose: true})
          return
        }
        let content = this.editor.getContent()
        content += `<h2>标题：${this.title}</h2><h4 style="margin-bottom:20px;">作者：${this.createName}</h4>`

        this.$exportFile(this.$global.API.downloadContext, {
          title: this.title,
          content: content,
        })
      },
      previewFun() { // 预览
        this.isShowPreview = true
        _czc.push(['_trackEvent', '编辑器', '点击稿件预览'])
      },
      correctFun() { // 纠错
        var self = this;
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
          this.$message({type: 'warning', message: '字数少于5个不进行检索', showClose: true})
          return
        }
        self.loading = true;
        self.$http({
          url: self.$global.BASEURL + '/textsug/grammar_detection.do',
          data: {
            text: contentArr2.join("\n")
          },
          success: function (data) {
            self.loading = false;
            if (data.code == 0) {
              if (data.data && data.data.length > 0) {
                self.ecnetKeywordRed(data.data);
                self.$message({
                  showClose: true,
                  message: '为您找到 ' + data.data.length + ' 处错别字！',
                  type: 'success'
                });
              } else {
                self.$message({
                  showClose: true,
                  message: '暂未检测到错别字！',
                  type: 'success'
                });
              }
            } else {
              self.$message({
                showClose: true,
                message: data.msg + '',
                type: 'error'
              });
            }
          }
        })
      },
      rewriteFun() { // 改写
        _czc.push(['_trackEvent', '编辑器', '点击稿件改写'])
        var content = this.editor.getContent().replace(/<(table|tr|td|%)[\s\S]*?\/\1>/g, '')
        content = content.replace(/<[^>]+>/g, '\n')
        this.loadText = '稿件改写中......'
        this.writeLoading = true
        this.$axios.post(this.$global.BASEURL + "/sentence/fulltext/rewrite.do",
          this.$qs.stringify({
            textContent: content,
            htmlContent: this.editor.getContent(),
          })
        ).then((res) => {
          this.writeLoading = false
          if (res.code === '0') {
            if (res.data && res.data.content) {
              this.rewriteData.type = 2;

              this.rewriteData.origin = this.editor.getContent()
              this.rewriteData.rewrite = res.data.content
              this.rewriteData.rewriteSimilarity = res.data.rewriteSimilarity
              this.rewriteData.isShow = true
            } else {
              this.$message({type: 'success', message: '暂无改写内容', showClose: true})
            }
          }
        })
      },
      confirmRewrite() { // 确定改写
        if (this.rewriteData.type == 1) {
          this.editor.execCommand('inserthtml', '');
          this.editor.selection.getRange().deleteContents();
          this.editor.execCommand('inserthtml', this.rewriteData.rewrite);
        } else {
          this.editor.setContent(this.rewriteData.rewrite)
        }
        this.rewriteData.isShow = false
      },
      //划句改写
      clickSynonymsRewrite: function () {
        var self = this;
        self.selectTextMenuShow = false
        if (self.selectionText.length == 0) {
          return
        }
        this.loadText = '稿件改写中......'
        self.writeLoading = true;
        self.$http({
          url: self.$global.BASEURL + "/sentence/rewrite.do",
          data: {
            textContent: self.selectionText
          },
          success: function (data) {
            self.writeLoading = false;
            if (data.code == 0 && data.data) {
              self.rewriteData.type = 1;

              self.rewriteData.origin = self.selectionText
              self.rewriteData.rewrite = data.data
              self.rewriteData.rewriteSimilarity = null
              self.rewriteData.isShow = true
            } else {
              self.$message({
                showClose: true,
                message: data.msg + '',
                type: 'error'
              });
            }
          }
        })
      },
      //点击词句联想
      clickPhrasesSearch: function () {
        var self = this;
        self.selectTextMenuShow = false
        self.phrasesKeyword = self.selectionText
        console.log(self.phrasesKeyword)
        self.getPhrasesListData();
        self.fodderActive1Active = '1';
        self.fodderActive = '1';
      },

      //点击图片裁剪
      clickImageCropper: function () {
        var self = this;
        self.selectImageMenuShow = false
        var thisDom = this.editor.selection.getStart();
        if (thisDom.nodeName == 'IMG') {
          this.loading = true;
          self.getBase64(self.$global.BASEURL + '/media/download.do?imgUrl=' + thisDom.src, function (base64) {
            self.cropperImg = base64;
            self.loading = false;
            self.cropperModelShow = true;
          })
        }
      },
      getBase64: function (imgUrl, fc) {
        window.URL = window.URL || window.webkitURL;
        var xhr = new XMLHttpRequest();
        xhr.open("get", imgUrl, true);
        // 至关重要
        xhr.responseType = "blob";
        xhr.onload = function () {
          if (this.status == 200) {
            var blob = this.response;
            let oFileReader = new FileReader();
            oFileReader.onloadend = function (e) {
              if (fc) fc(e.target.result)
            };
            oFileReader.readAsDataURL(blob);
          }
        }
        xhr.send();
      },
      //图片裁剪保存
      clickSaveCropper: function () {
        var self = this;
        self.$refs.cropper.getCropBlob(function (data) {
          console.log(data)
          self.loading = true;
          var formData = new FormData();
          formData.append("file", data);
          var request = new XMLHttpRequest();
          request.open("POST", self.$global.BASEURL + '/common/uploadFile.do');
          request.send(formData);
          request.onreadystatechange = function () {
            if (request.readyState == 4) {
              self.loading = false;
              if (request.status == 200) {
                var data = JSON.parse(request.response);
                if (data.data && data.data.Limage) {
                  self.insertImageToEditor(data.data.Limage);
                  self.cropperModelShow = false;
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
      cropperImgLoad: function (data) {
        this.loading = false;
        if (data == 'error') {
          this.$message({
            showClose: true,
            message: '图片加载失败,请重试',
            type: 'error'
          });
        }
      },

      // 错词标记处理程序
      ecnetKeywordRed(list) {
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
      ecnetKeywordPosition() {
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
      clickChangeEcnetKeyword() {
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
      clickEcnetIgnore() {
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
      removeEcnetColor() {
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


      //设置高度
      heightReset(){
        let appBox=document.getElementById('app')
        this.fodderBoxHeight = appBox.offsetHeight-140
        console.log(this.fodderBoxHeight)
      },


    },


    beforeRouteLeave(to, from, next) {
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
  #car-edit {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    .main {
      height: 100%;
      width: 100%;
      position: relative;

      .left-part {
        width: 480px;
        position: absolute;
        left: 0;
        top: 2px;
        bottom: 20px;
        z-index: 100;
        .el-tabs-fodder > .el-tabs__header{
          margin-bottom: 0;
          .el-tabs__nav-wrap {
            margin: 0 20px;
          }
        }
        .el-tabs-children > .el-tabs__header {
          .el-tabs__nav-wrap::after, .el-tabs__active-bar {
            display: none;
          }
          .el-tabs__nav {
            background: rgba(241, 247, 255, 1);
            border-radius: 15px;
            .el-tabs__item {
              padding: 0;
              width: 100px;
              height: 30px;
              line-height: 30px;
              border-radius: 15px;
              font-size: 14px;
              color: rgba(153, 153, 153, 1);
              text-align: center;
              &.is-active {
                background: rgba(14, 93, 255, 1);
                color: #FFFFFF;
              }
            }
          }
        }
        .el-tabs__item{
          font-weight:bolder;
        }
        .el-tabs__nav-wrap {
          padding: 0;
          overflow: hidden;
          position: relative;
        }
        .el-input__inner {
          border-radius: 0;
        }
        .el-cascader .el-input .el-input__inner:focus, .el-cascader .el-input.is-focus .el-input__inner {
          border:1px solid rgba(110,157,255,1);
        }
        .fodder-box {
          width: 480px;
          padding: 6px 0 20px;
          background-color: #ffffff;
          box-sizing: content-box;
          box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.1);
        }
        .fodder-box .el-tabs__content {
          padding: 0;
        }

        .fodder-box .box {
          position: relative;
          padding:20px;
        }
        .fodder-box .box.template {
          border: none;
        }

        .fodder-box .input {
          position: relative;
          box-sizing: border-box;
          margin-bottom: 12px;
        }

        .fodder-box .input > input {
          height: 36px;
          width: 100%;
          box-sizing: border-box;
          border-radius:18px;
          border:1px solid rgba(229,229,229,1);
          font-size: 14px;
          color: #333333;
          padding: 0 20px 0 44px;
          transition: all 0.3s;
        }

        .fodder-box .input > input:focus {
          border:1px solid rgba(110,157,255,1);
        }

        .fodder-box .input > span:not(.el-cascader) {
          position: absolute;
          left: 5px;
          top: 50%;
          z-index: 9;
          width: 38px;
          height: 20px;
          margin-top: -10px;
          line-height: 20px;
          font-size: 12px;
          color: #999999;
          text-align: center;
        }

        .fodder-box .input > span:not(.el-cascader) b {
          position: absolute;
          left: 40px;
          top: -4px;
          width: auto;
          height: 28px;
          line-height: 28px;
          padding: 0 10px;
          background: #6F7276;
          border-radius: 4px;
          font-size: 12px;
          color: #FFFFFF;
          white-space: nowrap;
          display: none;
        }

        .fodder-box .input > span:not(.el-cascader) b:before {
          content: '';
          position: absolute;
          left: -10px;
          top: 8px;
          width: 0;
          height: 0;
          border: 6px solid transparent;
          border-right-color: #6F7276;
        }

        .fodder-box .input > span:not(.el-cascader) img {
          margin-top: -2px;
        }

        .fodder-box .input > span:not(.el-cascader) .img2 {
          display: none;
        }

        .fodder-box .input > span:not(.el-cascader):hover b {
          display: block;
        }


        .fodder-box .input .arrow,
        .fodder-box .input .el-icon-search {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          padding: 0 15px;
          color: #999999;
        }

        .fodder-box .input .el-icon-search {
          font-weight: bolder;
          cursor: pointer;
          line-height: 36px;
        }

        .fodder-box .input .el-select,
        .fodder-box .input .el-cascader {
          display: block;
        }

        .fodder-box .input .el-select input,
        .fodder-box .input .el-cascader input {
          border-radius:18px;
          border:1px solid rgba(229,229,229,1);
          padding-left: 44px;
          height: 36px;
          font-size: 14px;
          transition: all 0.3s;
        }

        .fodder-box .input .el-select__tags {
          padding-left: 57px;
          box-sizing: border-box;
        }

        .fodder-box .input .el-cascader__label {
          padding-left: 57px;
        }

        .fodder-box .input .el-select__tags input {
          padding-left: 0;
        }

        .fodder-box .input .el-select .el-input.is-focus input,
        .fodder-box .input .el-cascader.is-opened input {
          border:1px solid rgba(110,157,255,1);
        }

        .fodder-box .input .el-cascader .el-icon-circle-close:before {
          margin-top: -17px;
        }


        .fodder-box .list .input {
          margin: 0 5px 10px;
          border: none;
        }
        .fodder-box .list .input > input {
          border-radius: 18px;
          padding-left: 48px;
        }

        .fodder-box .list .input > i {
          left: 2px;
          right: auto;
          background-color: transparent;
          color: #999999;
          font-weight: bolder;
          font-size: 18px;
        }

        .fodder-box .list {
          padding: 14px;
          box-sizing: content-box;
          background:rgba(238,244,254,1);
          border:1px solid rgba(238,244,254,1);
          border-radius:4px;
          min-height: 500px;
        }

        .fodder-box .list > li {
          border: 1px solid #ffffff;
          background: #ffffff;
          width: 115px;
          height: 185px;
          float: left;
          margin: 0 0 14px;
          position: relative;
          cursor: pointer;
          padding: 10px;
          box-sizing: content-box;
          overflow: hidden;
          transition: all 0.3s;
        }
        .fodder-box .list > li > .title {
          margin-bottom: 10px;
          font-size: 14px;
          color: #000000;
          font-weight: bolder;
          line-height: 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .fodder-box .list > li .summary {
          font-size:14px;
          font-weight:400;
          color:rgba(34,34,34,1);
          line-height:22px;
          text-align: justify;
          word-break: break-all;
          cursor: pointer;
        }
        .fodder-box .list > li:hover {
          box-shadow:0px 6px 8px 0px rgba(16,27,55,0.08);
          border-color: #85c9ff;
        }
        .fodder-box .list > li .summary .tag {
          display: inline-block;
          max-width: 100%;
          box-sizing: border-box;
          padding: 0 12px;
          font-size: 12px;
          color: #999999;
          letter-spacing: 0;
          line-height: 26px;
          margin-right: 2px;
          margin-bottom: 3px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          height:28px;
          background:rgba(255,255,255,1);
          border-radius:14px;
          border:1px solid rgba(203,222,255,1);
        }

        .fodder-box .list > li .time {
          font-size:12px;
          color:rgba(153,153,153,1);
          line-height:22px;
          margin-top: 5px;
        }

        .fodder-box .list > li.load-more {
          width: 100%;
          height: auto;
          box-sizing: border-box;
          margin: 0;
          text-align: center;
          background: none !important;
          border: none !important;
          cursor: default;
          color: #999999;
        }

        .fodder-box .list > li.load-more:hover {
          box-shadow: none !important;
        }

        .fodder-box .list > li.load-more:after {
          display: none;
        }

        .fodder-box .list-text li {
          float: none;
          height: auto;
          width: auto;
        }

        .fodder-box .list-text li .icon {
          position: absolute;
          left: -25px;
          top: -25px;
          font-style: normal;
          color: #ffffff;
          font-size: 12px;
          width: 0;
          height: 0;
          border: 24px solid transparent;
          border-bottom-color: #999;
          transform: rotate(-45deg);
        }

        .fodder-box .list-text li .icon:after {
          content: '私';
          position: absolute;
          left: -6px;
          top: 6px;
        }

        .fodder-box .list-text > li .summary .tag {
          vertical-align: middle;
          margin: 0 5px 5px 0;
        }

        .fodder-box .list-image li {
          width: 123px;
          height: auto;
          margin: 0 3px 10px;
          box-sizing: border-box;
          padding:0;
        }

        .fodder-box .list-image > li:after {
          display: none;
        }

        .fodder-box .list-image li .img {
          height: 100px;
          background: url('') no-repeat center/cover;
        }

        .fodder-box .list-image li > h3 {
          font-size: 12px;
          color: #333333;
          line-height: 35px;
          height: 37px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 3px 0 0;
          box-sizing: content-box;
          transition: all 0.3s;
          margin: 0 10px;
        }

        .fodder-box .list .image-chexing {
          float: none;
          width: auto;
          background-color: transparent;
          box-shadow: none !important;
          border-color: transparent !important;
          height: auto !important;
          margin-bottom: 0 !important;
        }

        .fodder-box .list .image-chexing .summary {
          cursor: default !important;
        }

        .fodder-box .list .image-chexing .tag {
          background-color: #ffffff;
          margin: 0 10px 5px 0 !important;
          cursor: pointer;
        }

        .fodder-box .list .image-chexing .tag.active {
          background-color: #0E5DFF;
          border-color: #0E5DFF;
          color: #ffffff;
        }

        .fodder-box .list-entity li:after {
          display: none;
        }

        .fodder-box .list-entity li,
        .fodder-box .list-entity li .summary {
          cursor: text;
        }

        .fodder-box .list-entity li .btns {
          display: none;
          position: absolute;
          bottom: 0;
          right: 10px;
        }
        .fodder-box .list-entity li:hover .btns {
          display: block;
        }
        .fodder-box .list-entity li .btns a {
          display: inline-block;
          width: 40px;
          height: 28px;
          border-radius: 15px;
          background-color: #fff;
          background-size: 14px 14px;
          background-position: center center;
          background-image: url('./../../images/icons/icon_change.png');
          background-repeat: no-repeat;
          position: relative;
        }
        .fodder-box .list-entity li .btns a.btn2{
          background-image: url('./../../images/icons/icon_insert.png');
        }
        .fodder-box .list-entity li .btns a span{
          width: 50px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          display: none;
          border-radius: 6px;
          background: #606670;
          font-size: 12px;
          color: #fff;
          -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
          box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
          position: absolute;
          top: -28px;
          left: -5px;
          font-style: normal;
        }
        .fodder-box .list-entity li .btns a:hover{
          transform: translate3d(0, -2px, 0);
          box-shadow: 0 3px 5px 0 rgba(0,157,255,0.32);
        }
        .fodder-box .list-entity li .btns a:hover span{
          display: block;
        }

        .fodder-box .list-price table {
          border-collapse: collapse;
        }

        .fodder-box .list-price td {
          text-align: center;
          border: 1px solid #DDDDDD;
          padding: 5px 10px;
          width: 20%;
        }

        .fodder-box .list li .summary.summary-model {
          overflow: hidden;
          height: 215px;
          position: relative;
        }

        .fodder-box .list li .summary.summary-model:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 1px;
          right: 1px;
          height: 80px;
          background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, #fff 80%);
        }

        .fodder-box .list-price td:first-child {
          width: 40%;
        }

        .fodder-box .list-price .summary p {
          padding: 10px 0;
        }

        .fodder-box .template-article-list {
          position: absolute;
          bottom: 0;
          left: 0;
          top: 0;
          right: 0;
          height: auto;
          z-index: 9;
        }

        .fodder-box .template-article-list li {
          cursor: pointer;
        }

        .fodder-box .template-article-list li.active {
          border-color: #62dca1;
          box-shadow: 0 0 0 1px #62dca1;
        }

        .fodder-box .template-article-list .top {
          background-color: transparent !important;;
          border-color: transparent !important;;
          box-shadow: none !important;
          cursor: default;
        }

        .fodder-box .list.template-article-list li > .title {
          background: #62dca1;
          width: 70px;
          color: #fff;
          line-height: 24px;
          padding: 0 10px;
          box-sizing: content-box;
        }

        .fodder-box .list.template-article-list li .summary.summary-model {
          cursor: pointer;
          height: auto;
          max-height: 260px;
          color: #666;
        }

        .fodder-box .list.template-article-list li .summary.summary-model:after {
          left: 0;
          right: 0;
        }

        .fodder-box .hot-title {
          background: #F5F5F5;
        }

        .fodder-box .hot-title .input {
          margin: 10px 12px;
          border: none;
          position: relative;
        }

        .fodder-box .hot-title .input > input {
          border-radius: 15px;
          padding-left: 48px;
          height: 30px;
        }

        .fodder-box .hot-title .input > i {
          left: 2px;
          right: auto;
          background-color: transparent;
          color: #999999;
          font-weight: bolder;
          font-size: 18px;
          height: 30px;
          line-height: 28px;
        }

        .fodder-box .hot-title .list li .summary {
          margin-bottom: 24px;
        }
      }

      .right-part {
        position: absolute;
        left: 480px;
        top: 58px;
        right: 0;
        bottom: 0;
        transition: all 0.3s;
        .content {
          background-color: #fff;
          box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.10);
          margin: 44px 100px 20px 60px;
          border-radius: 20px;
          padding: 30px;
          position: relative;
          .keyword {
            padding: 0 0 18px;
            margin-bottom: 20px;
            border-bottom: 1px solid #E5E5E5;
            position: relative;
            input {
              height: 38px;
              font-size: 28px;
              color: #333333;
              font-weight: bolder;
              display: block;
              width: 100%;
              padding-right: 10px;
            }
            .btn {
              position: absolute;
              right: 0;
              top: 0;
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
            position: relative;
            margin-bottom: 10px;
            .item {
              width: 270px;
              height: 28px;
              display: inline-block;
              font-size: 14px;
              margin-bottom: 10px;
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
          .editor {
            min-height: 600px;
            .edui-default .edui-editor-toolbarbox {
              position: fixed;
              left: 480px;
              top: 60px;
              right: 0;
              z-index: 99;
              border-radius: 0;
            }
            .edui-default .edui-toolbar {
              text-align: left;
            }
            .edui-editor,
            .edui-editor-iframeholder {
              width: 100% !important;
            }
          }
          // #sort-btn {
          //   height: 40px;
          //   width: 40px;
          //   background: #fff;
          //   border-radius: 15px;
          //   overflow: hidden;
          //   // box-shadow: 0 3px 5px 0 rgba(0,157,255,0.32);
          //   background-image: url('../../images/icons/icon_sort.png');
          //   background-size: 50px 50px;
          //   background-position: center center;
          //   background-repeat: no-repeat;
          //   position: fixed;
          //   left: 0;
          //   top: 0;
          // }
          .handle-btns {
            width: 44px;
            position: fixed;
            right: 46px;
            bottom: 30px;
            li {
              height: 44px;
              width: 44px;
              background-color: #fff;
              box-shadow: 0 3px 5px 0 rgba(0, 157, 255, 0.32);
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
                content: attr(data-title); //取到data-title属性的值
                width: 63px;
                height: 26px;
                display: inline-block;
                text-align: center;
                line-height: 26px;
                font-size: 12px;
                background-color: #606670;
                color: #fff;
                border-radius: 6px;
                border-radius: 6px;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.30);
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
          .ecnet-tip-wrap {
            position: fixed;
            z-index: 100;
            border: 1px solid #eee;
            background: #fff;
          }
          .ecnet-tip-wrap > div {
            font-size: 16px;
            line-height: 30px;
            padding: 0 10px;
            user-select: none;
          }
          .ecnet-tip-wrap > div:last-child {
            font-size: 14px;
            line-height: 25px;
          }
          .ecnet-tip-wrap > div:hover {
            background: #eee;
            cursor: pointer;
          }

          .select-text-menu {
            position: absolute;
            z-index: 100;
            background: #fff;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.20);
            border-radius: 4px;
            padding: 3px;
            min-width: 170px;
            .row {

              border: 1px solid transparent;
              &:hover {
                background: #ecf5ff;
                border-color: #b3d8ff;
              }
              img {
                width: 28px;
                float: left;
              }
              p {
                user-select: none;
                cursor: default;
                font-size: 14px;
                line-height: 28px;
                height: 28px;
                padding-left: 35px;
                color: #333333;
                white-space: nowrap;
              }
            }
            .line {
              border-bottom: 1px solid #e2e3e3;
              margin: 2px 0;
            }
          }
        }
      }

    }
  }

  @media (max-width: 1300px) {
    #car-edit .main .right-part .content .article-info .item {
      width: 200px;
    }
  }
</style>
