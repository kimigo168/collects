<template>
  <el-dialog id="buy-vip" :visible.sync="showModel" top="8vh" width="970px!important" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeClose" :show-close="true">
    <div class="buy-wrap">
      <div class="user-info">
        <img :src="userInfo&&userInfo.headimgurl?userInfo.headimgurl:defaultAvatar" alt="" class="avatar">
        <span class="phone">{{userInfo.phone}}</span>
        <!-- <p class="tip">VIP有效期内可享受无限次数获取文章</p> -->
      </div>
      <div class="why" :class="{'showReason':isShowReason }">
        <p>为什么要加入VIP？
          <span class="arrow" @click="toggleReason"></span>
        </p>
        <h4>加入Giiso写作机器人的VIP用户，您将拥有如下特权：</h4>
        <ul class="votes-wrap clearfix">
          <li v-for="(item,index) in votesList" :key="index">
            {{item}}
          </li>
        </ul>
      </div>
      <div class="vip-wrap">
        <ul class="vip-list clearfix">
          <li v-for="(item, index) in vipTypeList" :class="{'selected': (index+1) === vipTypeIdx}" :key="index" @click="choseVipType(item, index)">
            <div class="price">{{item.price}}</div>
            <p class="vip-type">{{item.cname}}</p>
          </li>
        </ul>
        <div class="payType">
          <ul class="payType-list">
            <li v-for="(item, index) in payTypeList" :class="{'active': index === payTypeIdx}" :key="index" @click="selectPayType(index)">
              <i class="check"></i><span class="method"></span>
            </li>
          </ul>
          <div class="qrcode-wrap" ref="qrCodeUrl">
            <i :class="{'wechat-icon': payTypeIdx==0,'alipay-icon':payTypeIdx==1}"></i>
          </div>
        </div>
      </div>
      <!-- <p class="buy-tip">说明：产品服务一经出售概不退换</p> -->
    </div>
  </el-dialog>
</template>
<script>
import QRCode from 'qrcodejs2'
import { mapState, mapMutations } from 'vuex'
import { clearInterval, setInterval, setTimeout } from 'timers'
export default {
  name: 'buyVip',
  data () {
    return {
      showModel: true, // 必须为true,否则canvas后面有影响
      defaultAvatar: require('../images/avatar1.png'),
      vipTypeList: [],
      vipTypeIdx: 1, // 1:月卡，2：半年卡，3：年卡
      vipItem: null, // vip的类型
      selectIdx: 0, // 选中的vip类型索引
      payMoney: 0,
      payTypeList: [{ type: 0, name: '微信' }, { type: 1, name: '支付宝' }],
      payTypeIdx: 0, // 0:微信，1：支付宝
      qrCodeUrl: '',
      qrCodeFlag: null,
      queryOrderFlag: null,
      orderNo: '', // 订单号
      aliUrl: '',
      isShowReason: true,
      votesList: ['每天不限量的文稿创作能力', '能够以最快的速度体验Giiso诸多新功能的测试', '文章查重能力及改写和纠错能力', '获得年终用户抽奖的特权。']
    }
  },
  computed: {
    ...mapState(['userInfo', 'source'])
  },
  methods: {
    ...mapMutations([
      'CHANGE_REFRESHSTATUS',
      'TOGGLE_BUYVIP'
    ]),
    beforeClose () {
      clearInterval(this.queryOrderFlag)
      this.TOGGLE_BUYVIP(false) // 关闭vip弹窗
      this.$emit('fCloseBuy')
    },
    choseVipType (item, index) {
      this.vipTypeIdx = item.id
      this.selectIdx = index
      this.payMoney = item.price
      this.vipItem = item
      this.createOrder()
    },
    selectPayType (index) {
      this.payTypeIdx = index
      clearInterval(this.queryOrderFlag)
      this.createOrder()
    },
    createQrCode () {
      this.qrCodeFlag = new QRCode(this.$refs.qrCodeUrl, {
        text: this.qrCodeUrl,
        width: 150,
        height: 150,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
    },
    refreshCode () {
      this.qrCodeFlag.makeCode(this.qrCodeUrl)
    },
    getOrder () {
      this.createOrder()
    },
    createOrder (isInit) { // isInit:true 初始化
      clearInterval(this.queryOrderFlag)
      this.qrCodeUrl = ''
      this.orderNo = ''
      this.$axios.post(this.$global.API.addOrder,
        this.$qs.stringify({
          goods_id: this.vipItem ? this.vipItem.id : '',
          coupon_id: '', // 优惠券id
          pay_type: this.payTypeIdx === 0 ? 1 : 2, // 1:微信，2：支付宝
          trade_type: 'NATIVE', // NATIVE:扫码支付，MWEB： H5支付
          source: this.source || 0, // 0:默认官网
          platform: 1 // 1:pc,2:手机H5
        })
      ).then((res) => {
        if (res.code === '0') {
          this.qrCodeUrl = res.data.pay_qrcode
          this.orderNo = res.data.order_sn
          setTimeout(() => {
            clearInterval(this.queryOrderFlag)
          }, 120 * 1000)
          this.queryOrderFlag = setInterval(() => {
            this.queryOrderFun()
          }, 4000)
          if (isInit) {
            this.createQrCode()
          } else {
            this.refreshCode()
          }
        }
      })
    },
    queryOrderFun () {
      this.$axios.post(this.$global.API.queryPay,
        this.$qs.stringify({
          order_sn: this.orderNo
        })
      ).then((res) => {
        if (res.code === '0' && res.data) {
          if (res.data.order_status === 1) { // 已完成
            clearInterval(this.queryOrderFlag)
            this.$message({ type: 'success', message: '支付成功', showClose: true })
            if (this.$route.name === 'userCenter') {
              this.CHANGE_REFRESHSTATUS(true) // 刷新购买记录列表，更新弹窗
            }
            this.TOGGLE_BUYVIP(false) // 关闭vip弹窗
          } else if (res.data.order_status === 2) { // 已关闭
            this.$message({ type: 'error', message: '支付失败', showClose: true })
            clearInterval(this.queryOrderFlag)
            this.createOrder()
          }
        } else {
          clearInterval(this.queryOrderFlag)
        }
      }).catch((err) => {
        console.log('清除', err)
        clearInterval(this.queryOrderFlag)
      })
    },
    getProductList () { // 获取套餐类型
      this.$axios.get(this.$global.API.goodsList).then((res) => {
        if (res.code === '0') {
          this.vipTypeList = res.data
          this.vipItem = this.vipTypeList[0] ? this.vipTypeList[0] : ''
          this.createOrder(true)
        }
      })
    },
    toggleReason () {
      this.isShowReason = !this.isShowReason
    }
  },
  mounted () {
    this.getProductList()
  },
  beforeDestroy () {
    clearInterval(this.queryOrderFlag)
  }
}
</script>
<style lang="scss">
#buy-vip {
  overflow: hidden;
  &::-webkit-scrollbar {
    width: 0px;
  }
  .buy-wrap {
    min-height: 426px;
    padding-bottom: 40px;
    .user-info {
      width: 270px;
      height: 100px;
      position: relative;
      .avatar {
        width: 70px;
        height: 70px;
        border-radius: 50%;
      }
      .phone {
        font-family: PingFangSC-Semibold;
        font-size: 24px;
        color: #333333;
        margin-left: 30px;
      }
      .tip {
        font-size: 16px;
        color: #999999;
        margin-top: 14px;
      }
    }
    .vip-wrap {
      height: 242px;
      width: 100%;
      position: relative;
      margin-top: 20px;
      .vip-list {
        li {
          height: 240px;
          width: 180px;
          border-radius: 10px;
          float: left;
          background-color: #F9FCFF;
          border: 1px solid #DDD;
          cursor: pointer;
          margin-right: 30px;
          &:last-child {
            margin-right: 0;
          }
          &.selected {
            border-color: #fff;
            background-image: linear-gradient(180deg, #EFD27F 0%, #E6AC3E 100%);
            box-shadow: 0 8px 14px 0 rgba(74,127,180,0.19);
            &:hover {
              border-color: #fff;
            }
          }
          &:hover {
            border: 1px solid #83C8FF;
          }
          .price {
            width: 100%;
            height: 60px;
            text-align: center;
            line-height: 36px;
            font-size: 42px;
            color: #FF282E;
            margin: 90px auto 44px auto;
            position: relative;
            &::before {
              content: '￥';
              font-family: PingFangSC-Semibold;
              font-size: 24px;
              color: #333333;
            }

          }
          .vip-type{
            text-align: center;
            font-family: PingFangSC-Semibold;
            font-size: 18px;
            color: #333333;
          }
        }
      }
      .payType {
        width: 220px;
        height: 240px;
        position: absolute;
        right: 0;
        top: 0;
        padding-left: 20px;
        .payType-list {
          height: 100px;
          li {
            height: 36px;
            cursor: pointer;
            &:last-child {
              margin-top: 10px;
              .method {
                background-image: url('../images/icons/pay_alipay.png');
              }
            }
            .check {
              width: 20px;
              height: 20px;
              display: inline-block;
              background-image: url('../images/icons/check_radio2.png');
              background-size: 20px 20px;
              background-repeat: no-repeat;
              background-position: center center;
              vertical-align: middle;
            }
            .method {
              width: 99px;
              height: 36px;
              display: inline-block;
              vertical-align: middle;
              background-repeat: no-repeat;
              background-position: center center;
              background-image: url('../images/icons/pay_wechat.png');
              margin-left: 34px;
            }
          }
          .active {
            .check {
              background-image: url('../images/icons/check_radio1.png');
            }
          }
          .disabled {
            opacity: .3;
          }
        }
        .qrcode-wrap {
          width: 150px;
          height: 150px;
          border: 1px solid #DBDBDB;
          position: absolute;
          left: 20px;
          bottom: 0;
          i {
            width: 60px;
            height: 60px;
            border-radius: 10px;
            display: inline-block;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            background-repeat: no-repeat;
            background-position: center center;
            &.wechat-icon {
              background-size: 44px 37px;
              background-image: url('../images/icons/wechat_icon.png');
            }
            &.alipay-icon {
              background-size: 46px 46px;
              background-image: url('../images/icons/alipay_icon.png');
            }
          }
        }
      }
    }
    .buy-tip {
      font-size: 16px;
      color: #C0C0C0;
      margin-top: 16px;
    }
    .why {
      height: 24px;
      color: #333333;
      font-size: 18px;
      font-weight: bold;
      transition: height .3s linear;
      overflow: hidden;
      .arrow {
        width: 16px;
        height: 9px;
        cursor: pointer;
        background-size: 16px 9px;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url('../images/icons/arrow_down_1.png');
        display: inline-block;
      }
      h4 {
        font-weight: bold;
        font-size: 18px;
        color: #333;
        margin-top: 20px;
        margin-bottom: 18px;
      }
      .votes-wrap {
        li {
          width: 378px;
          height: 24px;
          float: left;
          margin-bottom: 16px;
          padding-left: 34px;
          background-image: url('../images/icons/check_icon.png');
          background-repeat: no-repeat;
          background-position: left center;
          background-size: 21px 21px;
          &:nth-child(2) {
            width: 402px;
          }
        }
      }
    }
    .showReason {
      height: 160px;
      .arrow {
        transform-origin:(left,top);
        transform: rotate(180deg);
      }
    }
  }
  .el-dialog {
    border-radius: 10px;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 30px 60px 0 60px;
  }
  .el-dialog__headerbtn {
    font-size: 24px;
  }
}
</style>
