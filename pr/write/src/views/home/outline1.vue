<template>
  <div id="outline-page">
    <contact></contact>
    <head-top-nav></head-top-nav>
    <div class="content-wrap">
      <div class="banner">
        <h2>提纲写作</h2>
        <p>OUTLINE WRITING</p>
      </div>
      <div class="report-wrap">
        <h4 class="title">学习新思想</h4>
        <div class="tab-wrap">
          <el-tabs v-model="tabIdx" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="String(item.id)" v-for="(item, index) in tabList" :key="index"></el-tab-pane>
          </el-tabs>
          <button class="add-btn" @click="isShowCustomTemp=true">自定义提纲</button>
        </div>
        <ul class="section-wrap" v-loading="tempListload">
          <li class="li-item" v-for="(item, index) in tempList" :key="index" @click="selectTempFun(item)">
            <img class="bgImg" :src="item.imgUrl ? item.imgUrl : defaultImg" alt="">
            <div class="brief">
              <h4 class="title">{{item.title}}</h4>
              <div class="label-wrap">
                <span v-for="(item1, index1) in (item.keywords?item.keywords.split(','):[])" :key="index1">#{{item1}}</span>
              </div>
            </div>
            <div class="detail">
              <ul class="tips-wrap">
                <li v-for="(title, index2) in item.subTitleList" :key="index2">{{title}}</li>
              </ul>
              <ul class="labels-wrap">
                <li v-for="(item1, index1) in (item.keywords?item.keywords.split(','):[])" :key="index1">{{item1}}</li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <footer-bot></footer-bot>
    <template-pop v-if="isShowTemplate" :tempItem="selectTemp" @fClose="isShowTemplate=false"></template-pop>
    <custom-temp v-if="isShowCustomTemp" @fClose="isShowCustomTemp=false"></custom-temp>
  </div>
</template>
<script>
import contact from '@/components/contact' // 联系方式
import footerBot from '@/components/footer' // 页脚
import headTopNav from '@/components/headTopNav' // 顶部导航
import templatePop from './templatePop' // 思想汇报模板
import customTemp from './customTemp' // 自定义模板

export default {
  name: 'outline',
  data () {
    return {
      tabIdx: '0',
      topClassId: '', // 父分类id
      tabList: [{ name: '全部', id: '0' }],
      selectTabId: null,
      defaultImg: require('../../images/outline/outline_1.png'),
      tempList: [
        {
          title: '预备党员思想汇报',
          labels: ['和谐共赢', '团结努力的奋斗精神', '自强不息', '爱国爱党爱群众', '拒绝黄赌毒']
        }
      ],
      tempListload: false,
      // 思想汇报模板
      isShowTemplate: false,
      selectTemp: null,
      // 自定义模板
      isShowCustomTemp: false
    }
  },
  components: {
    contact,
    footerBot,
    headTopNav,
    templatePop,
    customTemp
  },
  methods: {
    handleClick () {
      this.getTempList()
    },
    selectTempFun (item) {
      this.selectTemp = item
      this.isShowTemplate = true
    },
    getTempTypes (pid, isInit) { // isInit为true，获取顶级分类，false获取次级分类
      this.$axios.post(this.$global.API.templateTypes,
        this.$qs.stringify({
          pid: isInit ? '' : pid // 传了pid获取子分类
        })
      ).then((res) => {
        if (res.code === '0') {
          if (isInit) {
            let id = res.data && res.data[0] ? res.data[0].id : ''
            this.topClassId = id
            this.getTempTypes(id, false)
          } else {
            this.tabList = this.tabList.concat(res.data || [])
            this.tabIdx = this.tabList[0].id// 默认获取全部
            this.getTempList()
          }
        }
      })
    },
    getTempList () {
      this.tempListload = true
      this.$axios.post(this.$global.API.templateList,
        this.$qs.stringify({
          pid: this.topClassId,
          typeId: this.tabIdx === '0' ? '' : this.tabIdx
        })
      ).then((res) => {
        this.tempListload = false
        if (res.code === '0' && res.data) {
          this.tempList = res.data.data || []
        }
      })
    }
  },
  created () {
    this.getTempTypes('', true)
  }
}
</script>
<style lang="scss" scoped>
  .content-wrap {
    // height: 1600px;
    background-color: #F8F9FF;
    position: relative;
    padding-top: 80px;
    .banner {
      height: 400px;
      width: 100%;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 100% 400px;
      background-image: url('../../images/outline_banner.png');
      h2 {
        font-size: 42px;
        color: #FFFFFF;
        text-align: center;
        padding-top: 100px;
        margin-bottom: 8px;
      }
      p {
        text-align: center;
        color: #fff;
      }
    }
    .report-wrap {
      width: 1170px;
      min-height: 517px;
      margin: -120px auto 90px auto;
      background: #fff;
      box-shadow:0px 4px 10px 0px rgba(0,0,0,0.08);
      border-radius:10px;
      padding: 60px 100px;
      z-index: 100;
      .title {
        font-size: 18px;
        color: #333;
        font-family:PingFangSC-Semibold,PingFang SC;
        margin-bottom: 18px;
      }
      .tab-wrap {
        position: relative;
        .add-btn {
          width: 134px;
          height: 34px;
          line-height: 34px;
          border-radius: 17px;
          background-color: #0E5DFF;
          color: #fff;
          background-image: url('../../images/icons/add_btn.png');
          background-repeat: no-repeat;
          background-position: left 18px center;
          background-size: 16px 16px;
          text-indent: 18px;
          position: absolute;
          right: 0;
          top: 50%;
          transform:translateY(-50%);
        }
      }
      .section-wrap {
        width: 100%;
        min-height: 270px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .li-item {
          width: 270px;
          height: 270px;
          background-color: #F1F7FF;
          cursor: pointer;
          position: relative;
          border-radius: 10px;
          margin-bottom: 30px;
          .bgImg {
            width: 100%;
            height: 160px;
          }
          &:hover {
            box-shadow:0px 3px 10px 0px rgba(168,200,255,1);
            .detail {
              display: block;
            }
          }
          .brief {
            width: 100%;
            height: 110px;
            padding: 20px;
            .title {
              font-size:16px;
              font-family:PingFangSC-Semibold,PingFang SC;
              color: #333333;
              margin-bottom: 10px;
            }
            .label-wrap {
              display: -webkit-box;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              span {
                display: inline-block;
                color: #8D8D8D;
                font-size: 12px;
                border-right: 1px solid #E2E2E2;
                padding-right: 10px;
                margin-right: 10px;
              }
            }
          }
          .detail {
            display: none;
            width: 270px;
            // min-height: 298px;
            box-shadow:0px 5px 14px 0px rgba(0,0,0,0.2);
            background-color: #fff;
            border-radius: 10px;
            opacity:0.95;
            z-index: 100;
            position: absolute;
            left: 290px;
            top: 0;
            padding: 30px 30px 0 30px;
            &::before {
              content: '';
              width: 0;
              height: 0;
              border-top: 10px solid transparent;
              border-bottom: 8px solid transparent;
              border-right: 10px solid #fff;
              position: absolute;
              left: -10px;
              top: 80px;
            }
            .tips-wrap {
              border-bottom: 1px solid #E5E5E5;
              li {
                color: #333333;
                line-height: 20px;
                position: relative;
                padding-left: 12px;
                margin-bottom: 10px;
                &::before {
                  content: '';
                  width: 6px;
                  height: 6px;
                  display: inline-block;
                  border-radius: 50%;
                  background-color: #0E5DFF;
                  position: absolute;
                  left: -4px;
                  top: 8px;
                }
              }
            }
            .labels-wrap {
              margin: 16px 0;
              li {
                display: inline-block;
                height: 26px;
                line-height: 26px;
                text-align: center;
                font-size: 12px;
                color: #3C7CFF;
                border: 1px solid #91B5FF;
                border-radius: 13px;
                padding: 0 8px;
                margin-right: 8px;
                margin-bottom: 10px;
              }
            }
          }
          &:nth-child(3n) {
            .detail {
              left: -290px;
              &::before {
                display: none;
              }
              &::after {
                content: '';
                width: 0;
                height: 0;
                border-top: 10px solid transparent;
                border-bottom: 10px solid transparent;
                border-left: 8px solid #fff;
                position: absolute;
                right: -10px;
                top: 80px;
              }
            }
          }
        }
      }
    }
  }
</style>
<style lang="scss">
#outline-page {
  .el-tabs__nav-wrap::after {
    display: none;
  }
}
</style>
