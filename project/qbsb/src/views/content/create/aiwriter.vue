<template>
  <div id="aiwriter">
    <div class="tab">
      <div class="content">
        <el-tabs v-model="tabIndex">
          <el-tab-pane label="写作机器人" name="0">
            <div class="operate">
              <div class="search">
                <el-form :inline="true" :model="searchForm">
                  <!-- <el-form-item label="写作领域：">
                    <el-select v-model="searchForm.range">
                      <el-option label="全部" value=""></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="写作字数：">
                    <el-select v-model="searchForm.sizeType">
                      <el-option label="800字" value="0"></el-option>
                      <el-option label="1000-1500" value="1"></el-option>
                      <el-option label="1500-2000" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="素材采集时间：">
                    <el-select v-model="searchForm.timeRange">
                      <el-option label="最近一个月" value="0"></el-option>
                      <el-option label="最近半年" value="1"></el-option>
                    </el-select>
                  </el-form-item> -->
                  <el-form-item label="写作题目：">
                    <el-input type="text" class="text-input" placeholder="输入写作题目" v-model="searchForm.title" style="width:230px"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="writeArticle">写作</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="write-wrap">
              <div class="state-ico" :class="{'state-show': stateShow}">
                <ul>
                  <li :class="{'fade-in':state>=1,'fade-out':state>1}">
                    <span :style="{backgroundImage: 'url(' + roboter_quanc + ')'}" class="roboter-ico roboter-1"></span>
                    <div class="progress">
                      <h3>信息收到</h3>
                      <p>好开森~~~</p>
                      <div class="progress-bar">
                        <span :style="{ 'width':stateBar1+'%' }"></span>
                      </div>
                      <span>{{stateBar1}}%</span>
                    </div>
                  </li>
                  <li :class="{'fade-in':state>=2,'fade-out':state>2}">
                    <span :style="{backgroundImage: 'url(' + roboter_quanc + ')'}" class="roboter-ico roboter-2"></span>
                    <div class="progress">
                      <h3>搜索资料</h3>
                      <p>稍等哦，让我找找资料... </p>
                      <div class="progress-bar">
                        <span :style="{ 'width':stateBar2+'%' }"></span>
                      </div>
                      <span>{{stateBar2}}%</span>
                    </div>
                  </li>
                  <li :class="{'fade-in':state>=3,'fade-out':state>3}">
                    <span :style="{backgroundImage: 'url(' + roboter_quanc + ')'}" class="roboter-ico roboter-3"></span>
                    <div class="progress">
                      <h3>思考一下</h3>
                      <p>抱歉，我要好好想想~~~ </p>
                      <div class="progress-bar">
                        <span :style="{ 'width':stateBar3+'%' }"></span>
                      </div>
                      <span>{{stateBar3}}%</span>
                    </div>
                  </li>
                  <li :class="{'fade-in2':state>=4,'fade-out':state>4}">
                    <span :style="{backgroundImage: 'url(' + roboter_quanc + ')'}" class="roboter-ico roboter-4"></span>
                    <div class="progress">
                      <h3>开始写作</h3>
                      <p>努力写作中~~~</p>
                      <div class="progress-bar">
                        <span :style="{ 'width':stateBar4+'%' }"></span>
                      </div>
                      <span>{{stateBar4}}%</span>
                    </div>
                  </li>
                  <li :class="{'fade-in2':state>=5,'fade-out':state>5}">
                    <span :style="{backgroundImage: 'url(' + roboter_quanc + ')'}" class="roboter-ico roboter-5"></span>
                    <div class="progress">
                      <h3>完成</h3>
                      <p>终于写完了，棒棒哒~~~</p>
                      <div class="progress-bar">
                        <span style="width: 100%;"></span>
                      </div>
                      <span>100%</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="article-title" style="height:36px;">
                <!-- <input v-model="articleTitle" type="text" :disabled="articleTitle==''" placeholder="文章标题生成中……"/> -->
              </div>
              <div class="article">
                <div class="text-area-out">
                  <div class="text-area" id="text-area-div">{{articleData}}
                    <span class="pen-box" id="pen-box"></span>
                  </div>
                  <textarea v-model="articleData" id="text-area-text" @scroll="textAreaScroll"></textarea>
                </div>
                <p class="word-number">输出文章约{{articleData.length}}字</p>
              </div>
              <div class="bottom clearfix">
                <el-button class="btn js-copy" id="saveArticle" :data-clipboard-text="articleData"  v-show="pageLength>=pageNum" @click="copyWords">复制文字</el-button>
                <p v-show="collectArticleList.length>=pageNum">写作效果不满意？
                  <a href="javascript:;" @click="nextPage">换一篇试试 > . <</a>
                </p>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'aiwriter',
  data () {
    return {
      pen_icon: require('../../../images/pen-ico.png'),
      roboter_quanc: require('../../../images/roboter-quanc.png'),
      tabIndex: '0',
      searchForm: {
        range: '',
        sizeType: '',
        timeRange: '',
        title: ''
      },
      // 动画状态
      penShow: false,
      stateShow: false,
      state: 0,
      stateBar1: 0,
      stateBar2: 0,
      stateBar3: 0,
      stateBar5: 0,
      timeInterval: {},
      timeOut: {},
      hideUp: false,
      text: ' ',
      mm: 0,
      articleTitle: '',
      articleData: '',
      pageLength: 0,
      pageNum: 1,
      timeInterval: null,
      timeOut: null,
      timerIIII: null,
      btnDisabled:false,
      allArticleData: [],
      allArticleData0: [],
      allArticleData1: [],
      allArticleGetNum: 0,
      collectArticleList: []
    }
  },
  computed: {
    stateBar4 () {
      if (this.text.length == 0) {
        return 100
      } else {
        var m = parseInt(this.mm / this.text.length * 100)
        if (m > 100) m = 100
        return m
      }
    }
  },
  methods: {
    textAreaScroll () {
      var top = this.$('#text-area-text').scrollTop()
      this.$('#text-area-div').scrollTop(top)
    },
    changeTitle () {
      this.$('.text-input').focus();
    },
    nextPage () {
      if (this.pageNum == this.collectArticleList.length) {
        this.$message({type: 'warning', message: '暂无更多结果,换个标题试试', showClose:true});
        return;
      }
      this.pageNum++;
      this.$('.text-input').blur();
      this.btnDisabled = true;
      clearInterval(this.timeInterval);
      clearTimeout(this.timeOut);
      this.pageLength = 0
      this.articleTitle = ''
      this.articleData = ''
      // 触发小智收到动画
      this.stateShow = true
      this.timeOut = setTimeout(() => {
        this.state = 1
        this.penShow = true
        this.changeStateBar('stateBar1', 1000)
        this.simulateWrite(this.collectArticleList[this.pageNum - 1].summray)
      }, 500)
    },
    // 进度条计算，过渡增加进度条百分百
    changeStateBar (stateBar, time) {
      setTimeout(() => {
        var m = 0
        this.timerIIII = setInterval(() => {
          this[stateBar] = m
          m += 2
          if (m > 100) {
            clearInterval(this.timerIIII)
          }
        }, time / 50)
      }, 700)
    },
    //模拟文章写作过程,并调用生成标题接口,在获取接口数据后调用
    simulateWrite (article) {
      let self = this;
      this.text = article.replace(/ /g, '')
      // if (this.text != '') this.getTitle()
      this.timeOut = setTimeout(() => {
        this.state = 2
        this.changeStateBar('stateBar2', 2000)
        this.timeOut = setTimeout(() => {
          this.state = 3
          this.changeStateBar('stateBar3', 1000)
          this.timeOut = setTimeout(() => {
            this.state = 4
            if (this.text == '') {
              this.penShow = false
              this.state = 5
              this.btnDisabled = false
              this.$message({ type:'warning', message: '对不起，无有效内容,请修改题目', showClose: true,})
            }
            var m = 0

            function simulateWrite() {
              clearInterval(self.timeInterval)
              self.timeInterval = setInterval(() => {
                if (m == 0) {
                  self.articleData += '      '
                }
                self.articleData += self.text.slice(m, m + 1)
                var isN = self.text.slice(m, m + 1)
                if (isN.indexOf('\n') >= 0) {
                  self.articleData += '      '
                }
                m++
                self.mm = m
                if (m > self.text.length) {
                  clearInterval(self.timeInterval)
                  setTimeout(() => {
                    self.penShow = false
                    self.state = 5
                    self.pageLength = self.allArticleData.length
                    self.btnDisabled = false
                    if (self.stockValue == 7) {
                      self.textInputDisabled = false
                    }
                  }, 1000)
                }
              }, 40)
            }

            simulateWrite()
          }, 2000)
        }, 3000)
      }, 2000)
    },
    // 点击写作
    writeArticle () {
      if (!this.searchForm.title) {
        this.$message({type: 'warning', message: '请输入标题', showClose: true});
        return;
      }
      this.$('.text-input').blur();
      this.btnDisabled = true;
      clearInterval(this.timeInterval)
      clearTimeout(this.timeOut)
      this.pageNum = 1
      this.pageLength = 0
      this.articleTitle = ''
      this.articleData = ''
      this.allArticleData = []
      this.allArticleData0 = []
      this.allArticleData1 = []
      this.collectArticleList = []
      this.allArticleGetNum = 0

      this.getAllArticleData(0)

      //触发小智收到动画
      this.stateShow = true
      this.timeOut = setTimeout(() => {
        this.state = 1
        this.penShow = true
        this.changeStateBar('stateBar1', 1000)
      }, 500)
    },
    getAllArticleData () {
      this.$jqAjax({
        url: apiHost + '/writer/hotnews',
        type: 'POST',
        data: {
          keyword:  this.searchForm.title
        },
        success: (res) => {
          console.log('ress', res)
          if (res.code == 0 && res.data.result) {
            this.collectArticleList = res.data.result;
            this.allArticleData.push({
              summray: res.data.result[0].summray
            });
            this.simulateWrite(this.allArticleData[this.pageNum - 1].summray)
          } else {
            this.simulateWrite('');
          }
        },
        error: (err) => {
          this.simulateWrite('')
          console.log(err);
        }
      });
    },
    copyWords () {
      this.$copyText(this.articleData).then(() => {
        this.$message({type: 'success', message: '复制成功', showClose: true});
      }, (e) => {
        this.$message({type: 'warning', message: '复制失败', showClose: true});
      });
    }
  },
  watch: {
    allArticleGetNum (val) {
      if (val == 2) {
        let length = this.allArticleData0.length > this.allArticleData1.length ? this.allArticleData0.length : this.allArticleData1.length
        if (length > 0) {
          for (let i = 0; i < length; i++) {
            if (i < this.allArticleData0.length) {
              this.allArticleData.push(this.allArticleData0[i])
            }
            if (i < this.allArticleData1.length) {
              this.allArticleData.push(this.allArticleData1[i])
            }
          }
          this.simulateWrite(this.allArticleData[this.pageNum - 1].summray)
        } else {
          this.simulateWrite('')
        }
      }
    },
    articleData () {
      this.$nextTick(function () {
        var height = this.$('#text-area-text')[0].scrollHeight
        this.$('#text-area-text').scrollTop(height)
        this.$('#text-area-div').scrollTop(height)
        // this.penLocation()
      });
    }
    
  },
  beforeDestroy () {
    clearInterval(this.timeInterval);
    clearTimeout(this.timeOut);
    clearInterval(this.timerIIII);
  },
  created () {}
}
</script>
<style lang="scss" scoped>
.write-wrap {
  .state-ico {
    height: 0;
    margin-bottom: 0;
    transition: all ease 0.3s;
    padding: 0 2px;
    &.state-show {
      height: 164px;
      margin: 20px 0 0;
    }
    ul {
      height: 100%;
      /*width: 98%;*/
      margin: 0 auto;
      position: relative;
      li {
        height: 100%;
        width: 100%;
        color: #4D7CFE;
        position: absolute;
        top: 0;
        left: 101%;
        background: #ffffff;
        box-shadow: 0 3px 6px 1px #c2ddf9;
        border-radius: 4px;
        transition: all ease 0.5s;
        .roboter-ico {
          width: 173px;
          height: 184px;
          position: absolute;
          top: -7px;
          left: 50%;
          margin-left: -290px;
          z-index: 98;
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
        }
        .progress {
          position: absolute;
          top: 56px;
          left: 50%;
          margin-left: -100px;
          width: 320px;
          height: 78px;
          h3 {
            float: left;
            font-size: 19px;
            line-height: 35px;
            padding-right: 14px;
          }
          p {
            font-size: 15px;
            line-height: 35px;
            float: left;
          }
          .progress-bar {
            width: 266px;
            height: 10px;
            float: left;
            border: 1px solid #4D7CFE;
            background-color: #ffffff;
            border-radius: 6px;
            overflow: hidden;
            & > span {
              display: block;
              height: 100%;
              width: 0;
              background-color: #4D7CFE;
              border-radius: 5px;
            }
          }
          & > span {
            font-size: 14px;
            line-height: 10px;
            float: right;
          }
        }

        &.fade-in {
          left: 0;
          .roboter-ico {
            animation: roboter_run1 0.4s 0.7s 1;
          }
        }
        &.fade-in2 {
          left: 0;
          .roboter-ico {
            animation: roboter_run2 1.6s 0.7s infinite;
          }
        }
        &.fade-out {
          left: -101%;
        }
      }
    }
  }
  .btn {
    background-color: #4D7CFE;
    border-color: #4D7CFE;
    color: #fff;
    width: 150px;
    height: 36px;
    border-radius: 4px;
    margin-right: 15px;
  }
  .article-title {
    input {
      width: 100%;
      height: 36px;
      padding: 0 18px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      line-height: 35px;
      margin: 20px 8px 20px 0;
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      &:focus {
        border-color: #f98540;
      }
      &:disabled {
        background-color: #eee;
      }
    }
  }
  .article {
    position: relative;
    border: 1px solid #e6e6e6;
    padding-bottom: 30px;
    .text-area-out {
      width: 100%;
      height: 430px;
      margin: 0 auto;
      position: relative;
    }
    .text-area-out .text-area,
    .text-area-out textarea {
      position: absolute;
      top: 0;
      left: 0;
      overflow-y: scroll;
      width: 100%;
      height: 100%;
      padding: 15px 16px 0;
      font-size: 16px;
      border: none;
      color: black;
      line-height: 30px;
      letter-spacing: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      resize: none;
      box-sizing: border-box;
    }
    .word-number {
      position: absolute;
      right: 0px;
      bottom: 0px;
      width: 100%;
      height: 30px;
      box-sizing: border-box;
      background-color: #ffffff;
      line-height: 30px;
      font-size: 14px;
      color: #666;
      text-align: right;
      padding-right: 25px;
    }
    .text-area-out .text-area .pen-box {
      display: inline-block;
      height: 16px;
      width: 2px;
    }
  }
  .bottom {
    padding: 15px 0 40px 0;
    line-height: 36px;
    min-height: 36px;
    .nextPage {
      display: none;
    }
    p {
      display: inline-block;
      font-size: 14px;
      a {
        color: #4D7CFE;
      }
    }
  }
  #text-area-text::-webkit-scrollbar {
    display: none;
  }
}
  @keyframes roboter_run1 {
    0% {
      transform: translateY(-20px);
    }
    33% {
      transform: translateY(0);
    }
    66% {
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes roboter_run2 {
    0% {
      transform: translateY(-20px);
    }
    8% {
      transform: translateY(0);
    }
    16% {
      transform: translateY(-20px);
    }
    24% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(0);
    }
  }
</style>
