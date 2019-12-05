<template>
  <div id="Create" v-loading="loading">
    <header class="layout-header">
      <input class="keyword-input" @keyup.enter="clickWrite()" v-model="articleTitle"/>
      <button class="search-btn" @click="clickWrite()">智能写作</button>
    </header>
    <div class="content-wrap">
      <div class="carousel-wrap" v-if="articleList.length>0 && !noArticle" :class="{'show-full':isShowFull,'no-full':!isShowFull}">
        <div class="model-left"></div>
        <div class="model-right"></div>
        <el-carousel :interval="4000" arrow="always" :autoplay="false" @change="carouselChange" type="card" height="650px">
          <el-carousel-item v-for="(item, index) in articleList" :key="index">
            <div class="item">
              <div class="scroll write-scroll" @click="selectArticle(item)">
                <div class="inner" v-html="item.summray"></div>
              </div>
              <canvas class="canvas-bj"></canvas>
            </div>
          </el-carousel-item>
        </el-carousel>
        <p class="index" id="index-indicator"><i>{{carouselIndex+1}}</i>/{{articleList.length}}</p>
      </div>
      <!-- 未生成底稿 -->
      <div class="not-found" v-if="noArticle">
        <div class="tip">
          <img src="./../../images/not_found.png"/>
          <p>编辑大人，很抱歉！我还是宝宝，正在努力学习成长中，请再试试其他主题哦~</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { setTimeout, setInterval, clearInterval } from 'timers'
export default {
  name: 'Create',
  data () {
    return {
      articleTitle: '',
      articleList: [],
      isShowFull: true,
      noArticle: false,
      carouselIndex: 0,
      loading: false,
      showFullTimer: null,
      writeByWordTimer: [],
      drapTimer: [],
      vType: 1, // 1: 热点写作，2：提纲写作
      tgType: ''
    }
  },
  watch: {
    '$route' () {
      this.articleTitle = this.$route.query.hots
    }
  },
  computed: {
    ...mapState(['isShowAnimate'])
  },
  methods: {
    ...mapMutations(['TOGGLE_ANIMATE']),
    clickWrite () {
      if (this.vType === 1) {
        this.writeFun()
      } else {
        this.tgWriteFun()
      }
    },
    clearWriteByWordTimer () {
      for (let item of this.writeByWordTimer) {
        clearInterval(item)
      }
      this.writeByWordTimer = []
    },
    clearDrapTimer () {
      for (let item of this.drapTimer) {
        clearInterval(item)
      }
      this.drapTimer = []
    },
    showCanvasList (isShow) {
      let canvasList = document.getElementsByClassName('canvas-bj')
      for (let i = 0; i < canvasList.length; i++) {
        canvasList[i].style.display = isShow ? 'block' : 'none'
      }
      // let writeScrollList = document.getElementsByClassName('write-scroll')
      // let indexIndicator = document.getElementById('index-indicator')
      // indexIndicator.style.display = 'none'
      // for (let j = 0; j < writeScrollList.length; j++) {
      //   writeScrollList[j].style.top = '20px'
      // }
    },
    writeFun () {
      if (this.loading) return
      if (this.showFullTimer) clearTimeout(this.showFullTimer)
      this.clearWriteByWordTimer()
      this.clearDrapTimer()
      this.articleList = [{}]
      this.isShowFull = true
      this.noArticle = false
      this.loading = true
      this.$nextTick(() => {
        if (this.isShowAnimate) {
          this.showCanvasList(true)
          this.canvasBackground()
        }
      })
      this.$axios.post(this.$global.API.write,
        this.$qs.stringify({
          keyword: this.articleTitle
        })
      ).then((res) => {
        this.loading = false
        if (res.code === '0' && res.data && res.data.result && res.data.result.length > 0) {
          var list = res.data.result
          for (var i = 0; i < list.length; i++) {
            list[i].contentHtml = '<p>' + list[i].summray.replace(/\n/g, '</p><p>') + '</p>'
            list[i].summray = list[i].summray.replace(/\n/g, '\n\n')
          }
          this.articleList = list
          this.writeByWordTimer = new Array(this.articleList).fill(null)
          let indexIndicator = document.getElementById('index-indicator')
          if (indexIndicator) {
            indexIndicator.style.display = 'block'
          }
          var write = (obj, time, yanchi, idx) => {
            // 逐字写作过程
            var firstContent = obj.summray
            obj.summray = ''
            var s = time
            var m = 0
            setTimeout(() => {
              this.writeByWordTimer[idx] = setInterval(() => {
                obj.summray += firstContent.slice(m, m + 1)
                this.$nextTick(() => {
                  var writeScroll = document.getElementsByClassName('write-scroll')
                  for (var i = 0; i < writeScroll.length; i++) {
                    writeScroll[i].scrollTop = 10000
                  }
                })
                m++
                if (m >= firstContent.length) {
                  clearInterval(this.writeByWordTimer[idx])
                  // 隐藏canvas
                  this.showCanvasList(false)
                  this.clearDrapTimer()
                }
              }, s / firstContent.length)
            }, yanchi)
          }
          if (this.isShowAnimate) {
            for (let i = 0; i < this.articleList.length; i++) {
              if (i === 0) {
                write(this.articleList[i], 15000, 0, 0)
              } else {
                write(this.articleList[i], 11000, 4000, i)
              }
            }
          }

          if (this.articleList.length > 1) {
            let timeout = 4000
            if (!this.isShowAnimate) {
              timeout = 1000
            }
            this.showFullTimer = setTimeout(() => {
              let writeScrollList = document.getElementsByClassName('write-scroll')
              if (writeScrollList && writeScrollList.length > 1) {
                for (let j = 0; j < writeScrollList.length; j++) {
                  writeScrollList[j].style.top = '100px'
                }
              }
              this.isShowFull = false
            }, timeout)
          }
        } else {
          // this.$message({ type: 'error', message: '编辑大人，很抱歉！我还是宝宝，正在努力学习成长中，请再试试其他主题哦~', showClose: true })
          this.articleList = []
          this.noArticle = true
          this.showCanvasList(false)
        }
      })
    },
    tgWriteFun () {
      if (this.loading) return
      if (this.showFullTimer) clearTimeout(this.showFullTimer)
      this.clearWriteByWordTimer()
      this.clearDrapTimer()
      this.articleList = [{}]
      this.isShowFull = true
      this.noArticle = false
      // this.loading = true
      this.$nextTick(() => {
        if (this.isShowAnimate) {
          this.showCanvasList(true)
          this.canvasBackground()
        }
      })
      this.$axios.post(this.$global.API.templateWrite,
        this.$qs.stringify({
          templateName: this.tgType, // 提纲模板名称
          keyword: this.articleTitle // 主题
        })
      ).then((res) => {
        this.loading = false
        if (res.code === '0' && res.data) {
          let data = res.data
          let list = []
          let html = data.split('\n\n')
          let str = ``
          for (let it of html) {
            str += `<p>${it}</p>`
          }
          list.push({
            contentHtml: str,
            summray: data.replace(/\n{2}/g, '\n\n')
          })
          this.articleList = list
          this.writeByWordTimer = new Array(this.articleList).fill(null)
          let indexIndicator = document.getElementById('index-indicator')
          if (indexIndicator) {
            indexIndicator.style.display = 'block'
          }
          var write = (obj, time, yanchi, idx) => {
            // 逐字写作过程
            var firstContent = obj.summray
            obj.summray = ''
            var s = time
            var m = 0
            setTimeout(() => {
              this.writeByWordTimer[idx] = setInterval(() => {
                obj.summray += firstContent.slice(m, m + 1)
                this.$nextTick(() => {
                  var writeScroll = document.getElementsByClassName('write-scroll')
                  for (var i = 0; i < writeScroll.length; i++) {
                    writeScroll[i].scrollTop = 10000
                  }
                })
                m++
                if (m >= firstContent.length) {
                  clearInterval(this.writeByWordTimer[idx])
                  // 隐藏canvas
                  this.showCanvasList(false)
                  this.clearDrapTimer()
                }
              }, s / firstContent.length)
            }, yanchi)
          }
          if (this.isShowAnimate) {
            for (let i = 0; i < this.articleList.length; i++) {
              if (i === 0) {
                write(this.articleList[i], 15000, 0, 0)
              } else {
                write(this.articleList[i], 11000, 4000, i)
              }
            }
          }

          if (this.articleList.length > 1) {
            let timeout = 4000
            if (!this.isShowAnimate) {
              timeout = 1000
            }
            this.showFullTimer = setTimeout(() => {
              let writeScrollList = document.getElementsByClassName('write-scroll')
              if (writeScrollList && writeScrollList.length > 1) {
                for (let j = 0; j < writeScrollList.length; j++) {
                  writeScrollList[j].style.top = '100px'
                }
              }
              this.isShowFull = false
            }, timeout)
          }
        } else {
          this.articleList = []
          this.noArticle = true
          this.showCanvasList(false)
        }
      })
    },
    canvasBackground () {
      let self = this
      var canvasList = document.getElementsByClassName('canvas-bj')
      this.drapTimer = new Array(canvasList.length).fill(null)
      for (let i = 0; i < canvasList.length; i++) {
        draw(canvasList[i], i)
      }

      function draw (c, idx) {
        let ctx = c.getContext('2d')
        c.width = window.innerWidth
        c.height = window.innerHeight
        // ctx.fillRect(0,0,100,100);
        // a,b,c,d分别代表x方向偏移,y方向偏移,宽，高
        var string1 = 'abcdefghijklmnopqrstuvwxyz'
        //        string1.split("");
        var fontsize = 20
        var columns = c.width / fontsize
        var drop = []
        for (var x = 0; x < columns; x++) {
          drop[x] = 0
        }
        function drap () {
          // ctx.fillStyle="rgba(0,0,0,0.07)";
          // ctx.fillStyle = '#EDF7FF'
          ctx.fillStyle = '#fff'
          ctx.fillRect(0, 0, c.width, c.height)
          // ctx.fillStyle="#0F0";
          ctx.fillStyle = '#4CB7FF'
          ctx.font = fontsize + 'px arial'
          for (var i = 0; i < drop.length; i++) {
            var text1 = string1[Math.floor(Math.random() * string1.length)]
            ctx.fillText(text1, i * fontsize, drop[i] * fontsize)
            drop[i]++
            if (drop[i] * fontsize > c.height && Math.random() > 0.95) { // 90%的几率掉落
              drop[i] = 0
            }
          }
        }
        self.drapTimer[idx] = setInterval(drap, 20)
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    selectArticle (item) {
      window.localStorage.editerContent = item.contentHtml
      window.localStorage.editerTitle = this.articleTitle
      this.$router.push({
        path: '/edit',
        query: { write: 1, vType: this.vType }
      })
    },
    carouselChange (index) {
      this.carouselIndex = index
    },
    async writeDo () {
      let res = null
      console.log('this', this)
      if (this.vType === 2) {
        res = await this.$asyAxios.post(this.$global.API.templateWrite, {
          templateName: this.tgType, // 提纲模板名称
          keyword: this.articleTitle // 主题
        })
        console.log('提纲 res', res)
      } else {
        res = await this.$asyAxios.post(this.$global.API.write, {
          keyword: this.articleTitle
        })
        console.log('热点 res', res)
      }
    }
  },
  created () {
    this.articleTitle = this.$route.query.hots || this.$route.query.topic
    this.tgType = this.$route.query.name // 提纲写作的模板类型
    this.vType = this.$route.query.type // 写作类型
  },
  mounted () {
    this.writeDo()
    // if (this.vType === 2) {
    //   this.tgWriteFun()
    // } else {
    //   this.writeFun()
    // }
  },
  beforeDestroy () {
    this.TOGGLE_ANIMATE(true)
    this.clearWriteByWordTimer()
    this.clearDrapTimer()
  }
}
</script>
<style lang="scss">
#Create {
  width: 100%;
  // height: 600px;
  overflow: hidden;
  position: relative;
  .keyword-input{
    display: block;
    width: 900px;
    height: 100%;
    border: none;
    font-size: 28px;
    color: #333333;
    font-weight: bolder;
    margin-left: 40px;
  }
  .content-wrap {
    position: relative;
    min-height: 600px;
    padding-bottom: 120px;
    margin:0 20px;
    overflow: hidden;
    .carousel-wrap {
      position: relative;
      margin-top: 30px;
      .item{
        padding: 20px 20px 20px 20px;
        height: 100%;
        box-sizing: border-box;
        position: relative;
        .scroll {
          position: absolute;
          left: 20px;
          top: 20px;
          // top: 100px;
          right: 10px;
          bottom: 20px;
          font-size: 16px;
          color: #333333;
          letter-spacing: 0;
          line-height: 24px;
          white-space: pre-wrap;
          // transition: all .5s ease;
          .inner{
            // background: #EEF8FF;
            background-color: #fff;
            padding-bottom: 20px;
            font-size: 18px;
          }
        }
        .canvas-bj{
          height: 100%;
          width: 100%;
          display: block;
        }
      }
      .index{
        display: none;
        position: absolute;
        left: 305px;
        top: 30px;
        z-index: 99;
        font-family: Arial;
        font-size: 18px;
        color: #999999;
        letter-spacing: 6px;
        i{
          font-size: 44px;
          color: #333333;
        }
      }
      .model-left{
        position: absolute;
        top:0;
        bottom:0;
        left: 0;
        z-index: 99;
        width: 246px;
        background-image: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%);
      }
      .model-right{
        position: absolute;
        top:0;
        bottom:0;
        right: 0;
        z-index: 99;
        width: 246px;
        background-image: linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%);
      }
    }
    .show-full{
      .el-carousel__item--card.is-active{
        position: absolute;
        left: 0;
        top:0;
        right: 0;
        bottom: -95px;
        z-index: 999;
        width: 100%;
        height: 745px;
        transform: none !important;
        box-shadow:none;
        margin-left: 0;
      }
    }
    .no-full {
      .el-carousel__item--card.is-active{
        border: 1px solid #85C9FF;
        box-shadow: 0 0 10px 0 rgba(0,0,0,0.21);
        background-color: #fff;
        .item .scroll .inner {
          // background-color: #fff;
          // background-color: #EEF8FF;
        }
      }
    }
    .not-found {
      height: 600px;
      width: 100%;
      position: relative;
      .tip {
        width: 300px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -115px;
        margin-top: -150px;
        text-align: center;
        font-size: 16px;
        color: #919FAA;
      }
    }
  }

  .el-carousel__arrow--left {
    top: 50%;
    left: 20px;
    // background: #C1CEDD;
    background: none;
    border-radius: 0;
    font-size: 20px;
    z-index: 100;
    width: 31px;
    height: 56px;
    background-image: url('../../images/icons/arrow_left_big.png');
    background-repeat: no-repeat;
    background-size: 31px 56px;
  }
  .el-carousel__arrow--right{
    top: 50%;
    // background: #C1CEDD;
    background: none;
    border-radius: 0;
    font-size: 20px;
    z-index: 100;
    right: 20px;
    width: 31px;
    height: 56px;
    background-image: url('../../images/icons/arrow_right_big.png');
    background-repeat: no-repeat;
    background-size: 31px 56px;
  }

  .el-carousel__item--card{
    width: 57.7%;
  }
  .el-carousel__mask{
    opacity: 0.24;
  }
  .el-carousel__item--card{
    // background: #EEF8FF;
    background: #fff;
  }
  .el-carousel__item--card.is-active{
    border-radius: 7px;
    transition: all 0.6s;
    margin-left: -45px;

  }
  .el-carousel__indicators{
    display: none;
  }
  .el-carousel--horizontal{
    overflow: visible;
  }

}

</style>
