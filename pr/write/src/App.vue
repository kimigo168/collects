<template>
  <div id="app">
    <head-top v-if="$route.path.indexOf('layout')>-1"></head-top>
    <head-edit v-if="$route.path.indexOf('edit')>-1"></head-edit>
    <transition name="router-fade" mode="out-in">
      <router-view/>
    </transition>
    <!-- 购买VIP弹窗 -->
    <buy-vip-pop v-if="isShowBuyVip"></buy-vip-pop>
    <!-- 次数限制弹窗 -->
    <limit-pop v-if="isShowLimitPop"></limit-pop>
    <!-- 登录注册弹窗 -->
    <login-pop v-if="isShowLoginPop"></login-pop>
    <provision-Pop v-if="isShowProvision"></provision-Pop>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import headTop from '@/components/headTop'
import headEdit from '@/components/headEdit'
import buyVipPop from '@/components/buyVipPop'
import limitPop from '@/components/limitPop'
import loginPop from '@/views/login/loginPop'
import provisionPop from '@/views/login/provisionPop'
export default {
  name: 'app',
  data () {
    return {
      source: '',
      uuid: ''
    }
  },
  components: {
    headTop,
    headEdit,
    buyVipPop,
    limitPop,
    loginPop,
    provisionPop
  },
  computed: {
    ...mapState(['isShowBuyVip', 'isShowLimitPop', 'isShowLoginPop', 'isShowProvision', 'userInfo'])
  },
  methods: {
    ...mapMutations(['GET_USERINFO', 'RECORD_USERINFO', 'SET_SOURCE']),
    getUserInfo (callback) {
      this.$axios.get(this.$global.API.userInfo).then((res) => {
        if (res.code === '0' && res.data && res.data.user) {
          this.RECORD_USERINFO(res.data.user ? res.data.user : '')
          if (callback) {
            callback()
          }
        }
      })
    },
    checkVersion () {
      this.$axios.post(this.$global.API.versionCheck).then((res) => {
        if (res.code === '0') {
          console.log('versionNo', this.$global.versionNo)
          if (this.$global.versionNo < res.data) {
            window.location.reload(true)
          }
        }
      })
    },
    createUUID () { // 生成uuid
      let UUID = ''
      if (localStorage.UUID) {
        UUID = localStorage.UUID
      } else {
        UUID = this.$generateUUID()
        localStorage.UUID = UUID
      }
      return UUID
    },
    visitUrlRecord () {
      this.$router.afterEach((to, from) => {
        // eslint-disable-next-line
        _czc.push(['_trackPageview', '/#' + to.path, '/#' + from.path])
      })
    }
  },
  watch: {
    '$route': function (val) {
      if (val) {
        this.getUserInfo()
        this.$updateStcLog({
          code: 1, // PV
          from: this.source || 0
        })
      }
    }
  },
  created () {
    let search = this.$getSearchPamara()
    if (search && search['source']) { // 获取来源
      this.source = search['source']
      this.SET_SOURCE(this.source)
    }
    this.checkVersion()
    this.uuid = this.createUUID()
    this.$updateStcLog({
      code: 2, // UV
      uid: this.uuid || '',
      from: this.source || 0
    })

    this.getUserInfo(() => {
      this.$updateStcLog({
        code: 3, // 登录
        uid: this.userInfo && this.userInfo.id ? this.userInfo.id : '',
        from: this.source || 0
      })
    })
    this.visitUrlRecord() // 虚拟pv统计
  }
}
</script>

<style lang="scss">
  @import './style/common.scss';
  @import './style/element-reset.scss';
  #app {
    width: 100%;
    height: 100%;
  }
  .router-fade-enter-active, .router-fade-leave-active {
    transition: opacity .3s;
  }
  .router-fade-enter, .router-fade-leave-active {
    opacity: 0;
  }

</style>
