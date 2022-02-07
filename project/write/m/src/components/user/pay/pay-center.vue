<template>
  <div id="pay-center">
    <userHeader title="加入VIP" to="/user-center"></userHeader>

    <div class="user-info">
      <div class="img">
        <img class="pic" :src="userInfo.headimgurl ? userInfo.headimgurl : './static/public/images/user-icon.png'"/>
        <img class="vip-icon" src="../../../assets/images/user-icon_02.png" v-if="userInfo.memberType  == 1" />
      </div>

      <h3>{{userInfo.nickname}}</h3>
      <p>我们诚挚地邀请您加入vip用户体验更多的服务</p>

    </div>

    <div class="pay-form">
      <ul class="list">
        <li v-for="item in vipTypeList" :class="{'active':vipTypeCheck == item.id}" @tap="vipTypeCheck = item.id">
          <h3>{{item.cname}}</h3>
          <p>￥<span>{{item.price}}</span></p>
        </li>
      </ul>

      <div class="pay-type">
        <label class="item">
          <input type="radio" checked/>
          <img src="../../../assets/images/wechat-pay-icon.png"/>
        </label>
      </div>

      <button class="submit-btn" type="button" @tap="paySubmit()">确认支付</button>

    </div>


    <div class="loading-model pay-loading-model" v-show="h5PayLoading">
      <div class="content">
        <img src="../../../assets/images/loading.png"/>
        <p>正在支付中…</p>

        <button class="submit-btn" type="button" @tap="closeH5PayOrder()">支付遇到问题，重新支付</button>
      </div>
    </div>
  </div>
</template>

<script>
  import userHeader from '../userHeader.vue'

  export default {
    components: {
      userHeader,
    },
    data: function () {
      return {
//        openId:'oX4un0SAn7-aFyQMOEqhC5BQN7Ug',
        openId:'',
        registerSource: '0',

        vipTypeList:[],
        vipTypeCheck:'',

        orderNo:'',

        h5PayLoading:false,
      }
    },
    computed: {
      userInfo () {
        return this.$store.state.userInfo
      },
    },
    created(){
      var self = this;
      var searchObj = self.$getSearchPamara();
      if (searchObj.source) {
        self.registerSource = searchObj.source;
      }

      this.getVipTypeList();

      if(this.$route.query.order_no){
        this.orderNo=this.$route.query.order_no;
        this.getOrderStatus();
      }else if(this.$route.query.openid){
        this.openId = this.$route.query.openid;
      }

    },
    methods: {
      getVipTypeList() {
        var self = this;
        self.$store.commit('setLoading', true);
        self.$http({
          url: apiHost + "/goods/list.do",
          type:'GET',
          success: function (data) {
            self.$store.commit('setLoading', false);
            if (data.code == 0 && data.data) {
              self.vipTypeList = data.data;
              self.vipTypeCheck=self.vipTypeList[0].id;
            }
          }
        })
      },


      paySubmit(){
        var self=this;
        if(!self.vipTypeCheck){
          self.$store.commit('setToolTip', '请选择会员套餐！');
          return
        }

        self.$store.commit('setLoading', '订单生成中…');
        if (self.timer) clearTimeout(self.timer);
        self.$http({
          url: apiHost + "/order/add.do",
          data: {
            openid: self.openId,
            trade_type: self.$isWeixin ? 'JSAPI' : 'MWEB',
            goods_id: self.vipTypeCheck,
            pay_type: '1',
            source:self.registerSource,
            platform:2,
          },
          success: function (data) {
            self.$store.commit('setLoading', false);
            if (data.code == '0' && data.data) {
              self.orderNo = data.data.order_sn;
              self.getOrderStatus();

              if (self.$isWeixin) {
                if(data.data.jsapiPayParam) self.openWechatPay(data.data.jsapiPayParam)
              } else {
                if (data.data.mweb_url) {
                  self.openH5Pay(data.data.mweb_url);
                }
              }

            } else {
              self.$store.commit('setToolTip', data.msg);
            }
          },
          error: function () {
            self.$store.commit('setLoading', false);
            self.$store.commit('setToolTip', '支付异常，请稍后重试！');
          }
        });

      },


      //唤起微信支付弹窗
      openWechatPay: function (data) {
        var self = this;
        if (WeixinJSBridge) {
          WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
              "appId": data.appId, //公众号名称，由商户传入
              "timeStamp": data.timestamp, //时间戳，自1970年以来的秒数
              "nonceStr": data.nonceStr, //随机串
              "package": data.packagestr,
              "signType": data.signType, //微信签名方式：
              "paySign": data.paySign //微信签名
            },
            function (res) {
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                // 使用以上方式判断前端返回,微信团队郑重提示：
                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
              }else if (res.err_msg == "get_brand_wcpay_request:cancel" || res.err_msg == "get_brand_wcpay_request:fail") {
                //关闭或者支付错误
                self.$store.commit('setLoading', false);
                if (self.timer) clearTimeout(self.timer);
              }
            }
          );
        }

      },
      //从浏览器唤起h5微信支付
      openH5Pay(url){
        var redirect_url= location.href + '?order_no=' + this.orderNo;
        console.log(url);
        window.location.href = url + '&redirect_url=' + encodeURIComponent(redirect_url);
      },

      //获取订单支付状态
      getOrderStatus: function () {
        var self = this;
        if (self.orderNo) {
          if(self.$isWeixin){
            self.$store.commit('setLoading', '正在支付中…');
          }else {
            self.h5PayLoading=true;
          }

          self.$http({
            url: apiHost + "/order/detail.do",
            data: {
              order_sn: self.orderNo
            },
            success: function (data) {
              if (data.code == '0') {
                if (data.data.order_status == 1) {
                  if (self.timer) clearTimeout(self.timer);
                  self.$router.push('/pay-suc');
                } else if (data.data == 2) {
                  if (self.timer) clearTimeout(self.timer);
                  self.$store.commit('setLoading', false);
                  self.h5PayLoading=false;
                  self.$store.commit('setToolTip','支付失败，请重新尝试！');
                } else {
                  self.timer = setTimeout(function () {
                    self.getOrderStatus();
                  }, 2000)
                }
              } else {
                self.$store.commit('setLoading', false);
                self.h5PayLoading=false;
                self.$store.commit('setToolTip', data.msg);
              }
            },
            error: function (data) {
              self.$store.commit('setLoading', false);
              self.h5PayLoading=false;
              if (self.timer) clearTimeout(self.timer);
            }
          });
        }
      },


      closeH5PayOrder(){
        var self=this;
        self.$store.commit('setLoading', false);
        self.h5PayLoading=false;
        if (self.timer) clearTimeout(self.timer);
        self.$router.replace('/pay-center');
      },

    }
  }
</script>

<style lang="scss">
  @import "../../../assets/scss/app";

  #pay-center{
    height: 100%;
    box-sizing: border-box;
    position: relative;
    padding-top: rem(88);
    .user-info {
      height: rem(236);
      background: rgba(64, 141, 255, 1);
      position: relative;
      .img {
        padding: rem(42) 0 0 rem(34);
        position: absolute;
        left: 0;
        top: 0;
        .pic {
          display: block;
          width: rem(120);
          height: rem(120);
          border-radius: 50%;
        }
        .vip-icon {
          position: absolute;
          right: rem(-20);
          bottom: rem(10);
          width: rem(74);
        }
      }

      h3 {
        font-size: rem(32);
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: rem(45);
        padding: rem(58) 0 rem(9) rem(200);
      }
      p {
        font-size: rem(26);
        color: rgba(255, 255, 255, 1);
        line-height: rem(37);
        padding: 0 rem(45) rem(9) rem(200);
      }
      a {
        position: absolute;
        left: 50%;
        bottom: rem(-29);
        transform: translateX(-50%);
        width: rem(200);

        background: linear-gradient(180deg, rgba(239, 210, 127, 1) 0%, rgba(230, 172, 62, 1) 100%);
        border-radius: rem(30);
        text-align: center;
        font-size: rem(32);
        color: rgba(255, 255, 255, 1);
        line-height: rem(58);
        &.add-vip {
          background: linear-gradient(180deg, rgba(87, 105, 127, 1) 0%, rgba(59, 72, 98, 1) 100%);
          img {
            width: rem(28);
          }
        }
      }
    }

    .pay-form{
      padding:rem(28) rem(45) rem(100);
      .list{
        li{
          height:rem(140);
          background:rgba(249,252,255,1);
          border-radius:rem(10);
          border:1px solid rgba(131,200,255,1);
          margin-bottom: rem(25);
          position: relative;
          h3{
            position: absolute;
            left: rem(56);
            top:50%;
            transform: translateY(-50%);
            font-size:rem(30);
            font-weight:bolder;
            color:rgba(51,51,51,1);
          }
          p{
            position: absolute;
            right: rem(50);
            top:50%;
            transform: translateY(-50%);
            font-size:rem(24);
            font-weight:bolder;
            color:rgba(153,153,153,1);
            span{
              font-size: rem(44);
            }
          }
          &.active{
            background:linear-gradient(180deg,rgba(253,224,141,1) 0%,rgba(255,188,63,1) 100%);
            box-shadow:0px 4px 7px 0px rgba(74,127,180,0.25);
            border-color:transparent;
            p>span{
              color: #FF3333;
            }
          }
        }
      }

      .pay-type{
        margin-top: rem(50);
        padding:rem(22) rem(55);
        background:rgba(249,252,255,1);
        border-radius:rem(10);
        border:1px solid rgba(131,200,255,1);
        .item{
          input[type='radio']{
            width: 18px;
            height: 18px;
            vertical-align: middle;
            margin-right: rem(30);
          }
          img{
            width: rem(149);
          }
        }
      }

    }
    .submit-btn{
      display: block;
      width:100%;
      height:rem(80);
      margin-top: rem(50);
      background:rgba(64,141,255,1);
      border-radius:rem(48);
      font-size:rem(36);
      font-weight:400;
      color:rgba(255,255,255,1);
      border: none;
      &:disabled{
        cursor: not-allowed;
        background-color: #cccccc;
      }
    }

    .pay-loading-model{
      z-index: 9999999999999999999999;
      .content{
        width: rem(547);
        height: rem(360);
        .submit-btn{
          width: rem(440);
          height: rem(72);
          margin: rem(58) auto 0;
          font-size: rem(30);
        }
      }
    }

  }

</style>
