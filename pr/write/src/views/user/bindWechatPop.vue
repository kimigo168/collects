<template>
  <el-dialog id="wechat-scan" :visible.sync="showModel" top="15vh" width="402px!important" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeClose" :show-close="true">
    <div class="wrap">
      <h3 class="title">微信扫一扫登录</h3>
      <div class="qrcode" ref="qrCodeUrl" v-loading="loading">
        <!-- <img v-if="bindQrUrl" :src="bindQrUrl" alt=""> -->
      </div>
      <p class="tip">扫码关注公众号「Giiso写作机器人」即可绑定</p>
    </div>
  </el-dialog>
</template>
<script>
import QRCode from 'qrcodejs2'
export default {
  name: 'bindWechat',
  data () {
    return {
      showModel: true,
      bindQrUrl: '', // 绑定微信二维码url
      bindTicket: '', // 用于轮询获取扫码结果标志
      queryBindScanFlag: null,
      qrCodeFlag: null,
      loading: false
    }
  },
  methods: {
    beforeClose () {
      clearInterval(this.queryBindScanFlag)
      this.$emit('fClose')
    },
    getBindQrcode () { // 获取微信绑定二维码（需要登录才可访问）
      clearInterval(this.queryBindScanFlag)
      this.loading = true
      this.$axios.get(this.$global.API.getBingQr).then((res) => {
        this.loading = false
        if (res.code === '0' && res.data) {
          this.bindQrUrl = res.data.url
          this.bindTicket = res.data.ticket
          this.createQrCode()
          this.queryBindScanFlag = setInterval(() => {
            this.queryWxBindResult()
          }, 3000)
        }
      })
    },
    queryWxBindResult () {
      if (!this.bindTicket) return
      this.$axios.post(this.$global.API.bindWxVerify,
        this.$qs.stringify({
          ticket: this.bindTicket
        })
      ).then((res) => {
        if (res.code === '0' && res.data) {
          clearInterval(this.queryBindScanFlag)
          this.$emit('bindSuccess')
        }
      })
    },
    createQrCode () {
      this.qrCodeFlag = new QRCode(this.$refs.qrCodeUrl, {
        text: this.bindQrUrl,
        width: 230,
        height: 230,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
    }
  },
  created () {
    this.getBindQrcode()
  },
  beforeDestroy () {
    clearInterval(this.queryBindScanFlag)
  }
}
</script>
<style lang="scss" scoped>
#wechat-scan {
  .wrap {
    .title {
      font-size: 18px;
      color: #333;
      text-align: center;
      margin-top: 20px;
    }
    .qrcode {
      width: 230px;
      height: 230px;
      margin: 33px auto 38px auto;
      // border: 1px solid #ccc;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .tip {
      color: #333;
      text-align: center;
    }
  }
}
</style>
<style lang="scss">
#wechat-scan {
  .el-dialog {
    border-radius: 6px;
  }
  .el-dialog__body {
    height: 430px;
    padding: 0;
  }
}
</style>
