<template>
  <div class="nav-right"  :style="{height: navHeight+'px',lineHeight:navHeight+'px'}">
    <div class="user" :style="{height: navHeight+'px',lineHeight:navHeight+'px'}">
      <img class="avatar" :src="userInfo&&userInfo.headimgurl?userInfo.headimgurl:defaultNoAvatar" alt="">
      <el-dropdown :hide-on-click="true" @command="handleCommand" v-if="userInfo">
        <span class="el-dropdown-link">
          {{userInfo&&userInfo.nickname?userInfo.nickname:'未登录'}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1" v-if="userInfo">个人中心</el-dropdown-item>
          <el-dropdown-item command="2" v-if="userInfo">退出</el-dropdown-item>
          <!-- <el-dropdown-item command="3" v-if="!userInfo">登录</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
      <span class="nologin" @click="showLoginPop" v-else >登录</span>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'navRight',
  props: ['navHeight'],
  data () {
    return {
      defaultAvatar: require('../images/avatar1.png'),
      defaultNoAvatar: require('../images/avatar_no.png')
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapMutations(['CLEAR_USERINFO', 'TOGGLE_LOGINPOP']),
    handleCommand (no) {
      if (no === '1') {
        // eslint-disable-next-line
        _czc.push(['_trackEvent', '顶部菜单', '点击个人中心', this.$getCurPageName()])
        this.viewUserInfo()
      } else if (no === '2') {
        this.logout()
      } else {
        this.$router.replace({ path: '/login' })
      }
    },
    viewUserInfo () {
      if (this.userInfo && this.userInfo.id) {
        this.$router.push({ path: '/user' })
      }
    },
    logout () {
      this.$axios.post(this.$global.API.logoutDo).then((res) => {
        console.log('res', res)
        if (res.code === '0') {
          this.$message({ type: 'success', message: '退出成功', showClose: true })
          this.CLEAR_USERINFO()
          // this.$router.replace({ path: '/login' })
        }
      })
    },
    showLoginPop () { // 打开登录弹窗
      // eslint-disable-next-line
      _czc.push(['_trackEvent', '登录注册', '点击登录', this.$getCurPageName()])
      this.TOGGLE_LOGINPOP(true)
    }
  },
  created () {

  }
}
</script>
<style lang="scss" scoped>
.nav-right {
  height: 80px;
  line-height: 80px;
  position: absolute;
  right: 0;
  top: 0;
  .user {
    height: 80px;
    display: inline-block;
    margin-right: 34px;
    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;
    }
    .el-dropdown {
      height: 30px;
      line-height: 30px;
    }
    .nologin {
      cursor: pointer;
    }
  }
}
</style>
