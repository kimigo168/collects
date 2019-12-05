<template>
  <el-dialog id="tg-topicInput" :visible.sync="showModel" top="15vh" width="930px!important" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeClose" :show-close="true">
    <div class="tg-wrap" v-loading.lock="loading" element-loading-text="底稿生成中...">
      <div class="input-wrap" @keyup.enter="beginWrite">
        <input type="text" v-model="topic" :placeholder="tgItem.inputType">
        <button class="search-btn" @click="beginWrite">智能写作</button>
      </div>
      <div class="desc-wrap">
        大纲描述：{{tgItem.desc}}
        <p class="tip" v-if="isShowTgTip">{{errorTip}}</p>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { setTimeout } from 'timers'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'topicInput',
  data () {
    return {
      showModel: false,
      topic: '',
      isShowTgTip: false,
      errorTip: '您可能选错了模板和主题，或者您要写作的主题未能收录Giiso资讯库，有疑问请与Giiso客服联系',
      loading: false
    }
  },
  computed: {
    ...mapState(['userInfo', 'writeStatus'])
  },
  watch: {
    topic (val) {
      if (val.length > 0) {
        this.isShowTgTip = false
      }
    },
    writeStatus (val) {
      if (val && val === 4) {
        this.SET_WRITE_STATUS(0)
        this.beginWrite()
      }
    }
  },
  props: ['tgItem'],
  methods: {
    ...mapMutations(['TOGGLE_LOGINPOP', 'SET_WRITE_STATUS']),
    beforeClose () {
      this.$emit('fClose')
    },
    beginWrite () {
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '提纲写作', '点击智能写作', this.topic])
      if (!this.userInfo) {
        this.TOGGLE_LOGINPOP(true)
        this.SET_WRITE_STATUS(2)
        return
      }
      this.isShowTgTip = false
      if (this.topic) {
        this.errorTip = '您可能选错了模板和主题，或者您要写作的主题未能收录Giiso资讯库，有疑问请与Giiso客服联系'
        this.loading = true
        this.$axios.post(this.$global.API.templateWrite,
          this.$qs.stringify({
            templateName: this.tgItem.name,
            keyword: this.topic
          })
        ).then((res) => {
          this.loading = false
          if (res.code === '0') {
            if (res.data) {
              // 跳转
              sessionStorage.setItem('dataSource', JSON.stringify(res.data))
              sessionStorage.setItem('keyword', JSON.stringify(this.topic))
              sessionStorage.setItem('writeType', 2) // 1表示热点写作，2：提纲写作
              this.$router.push({
                path: '/layout/create',
                query: {
                  // topic: this.topic,
                  name: this.tgItem.name,
                  vType: 2 // 提纲写作
                }
              })
            } else {
              this.isShowTgTip = true
            }
          } else {
            if (res.code !== '9001' && res.code !== '7003') { // 次数用尽或未登录
              this.isShowTgTip = true
            }
          }
        })
      } else {
        this.isShowTgTip = true
        this.errorTip = '输入主题搜索'
      }
    }
  },
  created () {
    setTimeout(() => {
      this.showModel = true
    }, 200)
  }
}
</script>
<style lang="scss" scoped>
.tg-wrap {
  height: 270px;
  width: 754px;
  margin: 0 auto;
  padding-top: 60px;
  .input-wrap {
    width: 752px;
    height: 52px;
    position: relative;
    margin-bottom: 28px;
    input {
      width:570px;
      height:52px;
      border-radius: 26px;
      border: 1px solid #D2E2EA;
      text-indent: 30px;
      font-size: 18px;
    }
    .search-btn {
      width: 150px;
      height: 52px;
      line-height: 52px;
      text-indent: 30px;
      border-radius: 30px;
      background-color: #0E5DFF ;
      background-image: url('../../images/icons/light_icon.png');
      background-size: 24px 24px;
      background-repeat: no-repeat;
      background-position: left 20px center;
      color: #fff;
      font-size: 18px;
      font-family:PingFangSC;
      position: absolute;
      right: 0;
    }
  }
  .desc-wrap {
    width: 752px;
    margin: 0 auto;
    position: relative;
    .tip {
      color: #FF4A4A;
      font-size: 14px;
      position: absolute;
      left: 0;
      top: -20px;
    }
  }
}
</style>
<style lang="scss">
#tg-topicInput {
  .el-dialog {
    border-radius: 10px;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
