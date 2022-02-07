<template>
  <div id="user-center">
    <header class="head-top">
      <div class="container">
        <div class="user-info">
          <img :style="{borderColor:memberType==1?'#EDC566':'#D3D7DF'}" :src="userInfo&&userInfo.headimgurl?userInfo.headimgurl:defaultAvatar" alt="" class="avatar">
          <span v-if="memberType==1" class="vip-logo"><i></i></span>
          <p class="phone">{{userInfo&&userInfo.nickname?userInfo.nickname:''}}</p>
          <div class="join-tips">
            <p>我们诚挚的邀请您加入VIP用户体验更多的服务</p>
            <div class="question" @click="viewQuestion"><i class="ques-icon"></i>常见问题</div>
          </div>
          <div class="vip-tip">
            <button class="join-vip" @click="joinVip" :class="{'vip-user':memberType==1}"><i></i>{{memberType==0?'加入':'续费'}}VIP</button><span v-if="memberType==1 && vipEndTime" class="validate">有效期至：{{vipEndTime}}</span>
          </div>
        </div>
        <button title="返回首页" class="back-home" @click="$router.push({path: '/'})"></button>
      </div>
    </header>
    <div class="content-wrap">
      <h2>常见问题</h2>
      <p class="brief">介绍：Giiso写作机器人是一款辅助新闻写作的AI工具，能够极大的简化编辑在选题，采集，新闻写作和校对等环节的工作内容，降低人工成本，提高内容生产的效率。</p>
      <ul class="question-list">
        <li>
          <h3 class="title">1、功能类：</h3>
          <p class="type1">Giiso写作机器人V3.0的写作类型包括：</p>
          <p class="type2">热点写作、汽车写作、提纲写作、股市快报、天气预报和体育赛事等，并持续更新优化。</p>
          <p class="type1">热点写作的功能清单包括：</p>
          <p class="type2">选题系统（热点榜单）、最新资讯、智能写稿、段落推荐、词句推荐、文章推荐、知识推荐、稿件查重、稿件纠错、稿件改写、稿件排序、稿件预览、稿件保存和稿件下载等，后续还会不断优化和添加各种新的AI功能。</p>
          <p class="type1">除了热点写作，提纲写作，其他的功能在什么时候上线？</p>
          <p class="type2">股评写作，天气预报和体育赛事依据后续开发周期约在9-11月期间上线使用。</p>
          <p class="type1">汽车写作的所有问题：</p>
          <p class="type2">在汽车写作的页面中有一个单独的客服系统，请前往汽车写作的系统页面点击查看相应信息。</p>
          <p class="type1">稿件查重功能是在全网进行查重吗？</p>
          <p class="type2">稿件查重针对Giiso资讯云的素材库进行查重，并非针对全网进行查重。</p>
          <p class="type1">什么是提纲写作？我想使用属于我自己的提纲来进行写作。</p>
          <p class="type2">提纲写作通过提前预制写作大纲，AI算法智能填充内容生成底稿，并智能推荐相关素材，实现稿件的写作。提纲需要提前预制，并经过AI算法的验证。用户如果有自身的写作提纲，可以提供给客服人员（QQ、电话和邮件），Giiso在经过算法验证后，考虑在后续的升级迭代中添加进去。</p>
          <!-- <p class="type1">系统为何没有提供图片和视频类的素材？</p>
          <p class="type2">为了解决素材版权风险的问题，Giiso正在研究基于算法与版权的合作方式，后续即将推出。</p> -->
        </li>
        <li>
          <h3 class="title">2、收费类：</h3>
          <p class="type1">Giiso写作机器人免费注册用户有什么使用限制？</p>
          <p class="type2">Giiso写作机器人免费的用户，有每日使用次数的限制，当前的政策为每日10次。</p>
          <p class="type1">Giiso写作机器人如何收费？</p>
          <p class="type2">Giiso写作机器人按照SaaS服务收取服务费，服务费的收取形式按照月费，半年费，年费三种，分别对应198元，998元（84折），1898元（80折）。</p>
          <p class="type1">Giiso写作机器人中热点写作已经收费了，其他的项目是否也要另行收费？</p>
          <p class="type2">除了汽车写作的专业服务之外，其余的服务都不再另行收费。汽车写作需另行收费，具体收费的标准参照汽车写作的VIP收费页面说明。</p>
          <p class="type1">既购买了热点写作，又购买汽车写作，是否可以额外打折？</p>
          <p class="type2">如果两个服务同时购买，购买的价格可以申请折扣，需单独申请。</p>
          <p class="type1">企业批量购买多个账号，是否可以折扣收费？</p>
          <p class="type2">关于企业账号的需求，Giiso提供辑书企业版，此版本的写作类型更加丰富，支持定制式提纲写作，企业账号可以互相间进行内容共享和发稿审核，一键式分发等功能，关于辑书企业版的收费标准，请联系客服留下联系方式，我们安排专人尽快与你联络。</p>
        </li>
        <li>
          <h3>3、需求类：</h3>
          <p class="type1">Giiso写作机器人我要写的文章和主题写不出来？</p>
          <p class="type2">输入主题时，请尽量输入短句或关键词，不要输入太长的句子，AI在识别长句和素材时会找到更少的内容进行匹配。<br>一些冷门的主题或关键词，未能进入Giiso的资讯库中，如需定制入库内容，属于另行收费服务，请联系客服留下联系方式，我们安排专人尽快与你联络。</p>
          <p class="type1">Giiso写作机器人我要写的文章类型里面没有？</p>
          <p class="type2">Giiso写作机器人会不断更新文章类型的种类，包括但不仅限于热点新闻，汽车写作，提纲写作，股市快报，天气预报和体育赛事。如需定制化属于自身的写作类型，属于另行收费服务，请联系客服留下联系方式，我们安排专人尽快与你联络。</p>
          <p class="type1">Giiso写作机器人写出来的文章负责文字版权吗？</p>
          <p class="type2">Giiso写作机器人是一款辅助文章写作生成的工具，数据采集自互联网和行业大数据，不能提供版权保护。</p>
        </li>
        <li>
          <h3>4、bug类：</h3>
          <p class="type1">Giiso写作机器人热点写作的文章逻辑存在问题？</p>
          <p class="type2">Giiso写作机器人的热点写作，采取最新的AI算法智能生成底稿，同时使用算法进行素材推荐，当发现底稿内容存在逻辑问题和上下文问题时，可以采用段落，词句，文章和知识推荐进行替换，并且采用段落排序功能进行内容调整。</p>
          <p class="type1">我发现了XXBUG？</p>
          <p class="type2">Giiso写作机器人感谢你的使用和支持，请将你反应的问题截图发给我们，我们在核实之后，将于下一个版本发布时处理这个问题，谢谢。</p>
          <p class="type1">我在提纲写作中输入的主题写不出来？</p>
          <p class="type2">提供写作为了提前预制提纲，对于素材的选择存在行业性或者分类素材的局限，例如使用“科技新闻模板”，当输入非科技类新闻主题时，提供写作可能存在无法匹配素材，从而无法正常生成文章底稿的情况。</p>
        </li>
        <li>
          <h3>5、新老系统账户类：</h3>
          <p class="type1">在老版本的写作机器人中已经进行了充值，是否还能有效使用？</p>
          <p class="type2">所有在老版本写作机器人中进行充值，并还未到期的VIP用户，都可以切换到新版本的正常使用，充值会员的权益得到保证。</p>
          <p class="type1">老版本的写作机器人已经停止使用了吗？</p>
          <p class="type2">老版本的写作机器人将于2019年9月12日12时正式停止运营，老版本写作机器人的域名将指向新的Giiso写作机器人3.0。</p>
          <p class="type1">在老版本的写作机器人申请的账号密码是否可以继续使用？</p>
          <p class="type2">用户在老版本写作机器人中申请的账号密码，将可以在3.0的系统中正常使用。</p>
        </li>
        <li>
          <h3>6、其他：</h3>
          <p class="type1">Giiso写作机器人可以对接我们单位的内部素材进行素材创作吗？</p>
          <p class="type2">Giiso写作机器人提供企业版辑书，可以为不同的企业进行素材来源的定制，和提纲写作模板的开发，这属于另行收费服务，请联系客服留下联系方式，我们安排专人尽快与你联络。</p>
        </li>
      </ul>
    </div>
    <contact></contact>
    <!-- 选购vip 弹窗 -->
  </div>
</template>
<script>
import contact from '@/components/contact' // 联系方式
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'question',
  data () {
    return {
      roleType: '',
      memberType: '0',
      host: '',
      defaultAvatar: require('../../images/avatar1.png'),
      tabIndex: '0',
      vipEndTime: ''
    }
  },
  components: {
    contact
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapMutations(['TOGGLE_BUYVIP']),
    joinVip () { // 加入或购买VIP
      this.TOGGLE_BUYVIP(true)
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '个人中心', '点击VIP充值或续费'])
    },
    getUserInfo () {
      this.$axios.post(this.$global.API.userInfo).then((res) => {
        if (res.code === '0' && res.data.user) {
          this.memberType = res.data.user.memberType
          this.vipEndTime = res.data.user.vipEndTime
        }
      })
    },
    viewQuestion () {
      const { href } = this.$router.resolve({ name: 'question' })
      window.open(href, '_blank')
    }
  },
  created () {
    this.host = this.$global.BASEURL
    if (this.$route.query.reCharge === 1) { // 限制提示弹窗跳过来，提示要充值
      this.tabIndex = '2'
      this.TOGGLE_BUYVIP(true)
    }
    this.getUserInfo()
  }
}
</script>
<style lang="scss" scoped>
#user-center {
  width: 100%;
  background-color: #F4F4F4;
  .head-top {
    height: 120px;
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.14);
    margin-bottom: 30px;
    .container {
      width: 1200px;
      height: 120px;
      position: relative;
      margin:0 auto;
      .user-info {
        height: 120px;
        padding-left: 115px;
        padding-top: 24px;
        position: relative;
        .avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 4px solid #D3D7DF;
          overflow: hidden;
          position: absolute;
          left: 15px;
          top: 50%;
          margin-top: -35px;
        }
        .vip-logo {
          width:43px;
          height:19px;
          background:linear-gradient(180deg,rgba(239,210,127,1) 0%,rgba(230,172,62,1) 100%);
          border-radius:10px;
          display: inline-block;
          text-align: center;
          position: absolute;
          left: 66px;
          top:78px;
          i {
            width: 14px;
            height: 14px;
            display: inline-block;
            background-image: url('../../images/icons/icon_vip.png');
            background-size: 14px 14px;
            background-position: center center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        .phone {
          font-size: 24px;
          height:31px;
          font-family: PingFangSC-Semibold;
        }
        .join-tips {
          margin-top: 10px;
          font-size: 14px;
          color: #333;
          position: relative;
          p {
            width: 300px;
            border-right: 1px solid #E5E5E5;

          }
          .question {
            position: absolute;
            top: 0;
            left: 314px;
            padding-left: 24px;
            // .ques-icon {
            background-image: url('../../images/icons/question_icon.png');
            background-size: 18px 18px;
            background-position: left center;
            background-repeat: no-repeat;
            cursor: pointer;
            // }
          }
        }
        .vip-tip {
          width: 300px;
          height: 54px;
          display: inline-block;
          position: absolute;
          left: 290px;
          top: 24px;
          padding-left: 24px;
          // border-left: 1px solid #E5E5E5;
          .join-vip {
            width: 113px;
            height: 30px;
            line-height: 30px;
            border-radius: 15px;
            font-family: PingFangSC-Semibold;
            font-size: 16px;
            color: #FFFFFF;
            background-image: linear-gradient(180deg, #57697F 0%, #3B4862 100%);
            position: relative;
            padding-left: 12px;
            i {
              width: 14px;
              height: 14px;
              display: inline-block;
              background-image: url('../../images/icons/icon_vip.png');
              background-size: 14px 14px;
              background-position: left center;
              position: absolute;
              left: 12px;
              top: 50%;
              transform: translateY(-50%);
            }
          }
          .vip-user {
            background-image: linear-gradient(180deg, #EFD27F 0%, #E6AC3E 100%);
          }
          .validate {
            font-size: 12px;
            color: #B2B2B2;
            margin-left: 20px;
            // margin-top: 6px;
          }
        }
      }
      .back-home {
        height: 34px;
        width: 215px;
        line-height: 34px;
        // font-family: PingFangSC-Regular;
        // background-image: url('../../images/icons/jishu_icon.png');
        background-image: url('../../images/write_robbot.png');
        background-size: contain;
        // background-size: 27px 34px;
        background-position: left center;
        background-repeat: no-repeat;
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
        padding-left: 220px;
      }
    }
  }
  .content-wrap {
    width: 1200px;
    height: auto;
    min-height: 784px;
    background: #FFFFFF;
    box-shadow: 0 4px 6px 0 rgba(0,0,0,0.10);
    position: relative;
    left: 50%;
    margin-left: -600px;
    padding: 30px 40px;
    h2 {
      font-size: 21px;
      color: #333333;
      line-height: 29px;
      margin-bottom: 12px;
    }
    .brief {
      font-size: 16px;
      color: #333;
      line-height: 26px;
      margin-bottom: 20px;
    }
    .question-list {
      li {
        margin-bottom: 20px;
        font-size: 16px;
        color: #333;
        h3 {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 18px;
        }
        .type1 {
          font-size: 16px;
          color: #333;
          font-weight: bold;
          line-height: 26px;
        }
        .type2 {
          font-size: 16px;
          color: #333;
          line-height: 26px;
          margin-bottom: 26px;
        }
      }
    }
  }
}
</style>
