<template>
  <header class="head-top">
    <div class="container">
      <img src="../images/keqing_logo.png" alt="" @click="goToIndex">
      <div class="channel-wrap">
        <ul class="channel-list clearfix">
          <li class="item" v-for="(item, index) in channelList1" @click="selectChannel(index, item)" :class="{'active':activeIdx==index, 'small-font': item.channelName.length>5}" :title="item.channelName.length>6?item.channelName:''" :key="index">{{item.channelName}}</li>
          <li class="item more-btn" v-if="moreList.length>0">
            <span @click="showMoreFun">更多</span>
            <ul class="drop-list clearfix" v-if="showMoreChannel" @mouseleave="showMoreFun">
              <li v-for="(item, index) in moreList" :key="index" @click.stop="exchangeChannel(index, item)">{{item.channelName}}</li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="nav-right clearfix">
        <i class="search-icon" @click="goSearch"></i>
        <div class="user">
          <img :src="userInfo&&userInfo.headimgUrl?userInfo.headimgUrl:defaultAvatar" alt="" class="avatar">
          <ul class="drop-nav">
            <li>{{userInfo&&userInfo.nikeName?userInfo.nikeName:''}}</li>
            <li @click="selectNav(1)">个人设置</li>
            <li @click="selectNav(2)">退出登录</li>
          </ul>
        </div>
        <span class="collect" @click="selectNav(3)">收藏</span>
        <span class="history" @click="selectNav(4)">历史</span>
      </div>
    </div>
  </header>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'headTop',
  data () {
    return {
      logoUrl: require('../images/logo.png'),
      defaultAvatar: require('../images/default_avatar.png'),
      selectItem: null, // 选中的父频道
      showMoreChannel: false, // 是否显示更多父频道
      activeIdx: 0 // 默认选中的频道
    }
  },
  computed: {
    ...mapState(['userInfo', 'parentChannelList']),
    channelList1 () { // 显示在顶部频道
      return this.parentChannelList && this.parentChannelList.length > 0 ? this.parentChannelList.slice(0, 6) : []
    },
    moreList () { // 放在更多里面
      return this.parentChannelList && this.parentChannelList.length > 6 ? this.parentChannelList.slice(6, this.parentChannelList.length) : []
    }
  },
  watch: {
    selectItem: {
      handler (newValue) {
        this.SELECT_PARENTCHANNEL(this.selectItem)
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations(['SELECT_PARENTCHANNEL', 'CLEAR_USERINFO']),
    selectNav (index) {
      if (index === 1) { // 个人设置
        this.$router.push({
          path: '/setting'
        })
      } else if (index === 2) { // 退出登录
        this.logout()
      } else if (index === 3) { // 跳转收藏
        this.$router.push({
          path: '/collect'
        })
      } else if (index === 4) { // 跳转历史
        this.$router.push({
          path: '/history'
        })
      }
    },
    logout () {
      this.CLEAR_USERINFO()
      this.$router.replace({
        path: '/login'
      })
    },
    goToIndex () {
      if (this.$route.name !== 'home') {
        this.$router.replace({ path: '/home' })
      }
    },
    showMoreFun () {
      this.showMoreChannel = !this.showMoreChannel
    },
    selectChannel (index, item) {
      this.activeIdx = index
      this.selectItem = item
      this.goToIndex()
    },
    exchangeChannel (index, item) { // 将更多里面的频道选中并替换到外面
      let start = this.channelList1.length
      let delItem = this.channelList1.splice(start - 1, 1, item)
      if (delItem && delItem.length > 0) {
        this.moreList.splice(index, 1, delItem[0])
      }
      this.activeIdx = start - 1
      this.selectItem = item
      this.showMoreChannel = false
      this.goToIndex()
    },
    goSearch () {
      if (this.$route.name !== 'search') {
        this.$router.push({
          path: '/search'
        })
      }
    }
  },
  created () {
  }
}
</script>
<style lang="scss" scoped>
.head-top {
  width: 100%;
  height: 100px;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  .container {
    height: 100px;
    line-height: 100px;
    position: relative;
    .channel-wrap {
      width: 850px;
      height: 100px;
      background-color: #fff;
      position: absolute;
      left: 147px;
      top: 0;
      padding-left: 37px;
      .channel-list {
        padding-top: 35px;
        li {
          height: 30px;
          width: 94px;
          line-height: 30px;
          font-size: 16px;
          color: #333333;
          float: left;
          cursor: pointer;
          text-align: center;
          margin-right: 10px;
          margin-bottom: 30px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          // padding: 0 10px;
          &.active {
            color: #fff;
            background-color: #0A97ED;
            border-radius: 4px;
            li {
              color: #333;
            }
          }
          &.small-font{
            font-size: 15px;
          }
          &:last-child {
            margin-right: 0;
          }
        }
        .more-btn {
          position: relative;
          overflow: visible;
          // position: absolute;
          // right: 20px;
          // top: 50%;
          // transform: translateY(-50%);
          &:hover {
            .drop-list {
              display: block;
            }
          }
          .drop-list {
            width: 830px;
            box-shadow:0px 0px 6px 0px rgba(0,0,0,0.2);
            border-radius:4px;
            background-color: #fff;
            // display: none;
            position: absolute;
            left: -700px;
            top: 30px;
            padding: 20px 20px 40px 20px;
            z-index: 100;
            li {
              min-width: 84px;
              width: auto;
              &.active {
                color: #fff;
              }
            }
          }
        }
      }

    }
    .nav-right {
      width: 200px;
      height: 100px;
      position: absolute;
      right: 0;
      top: 0;
      .search-icon {
        width: 22px;
        height: 22px;
        display: inline-block;
        background-image: url('../images/icons/search_icon.png');
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;
        vertical-align: middle;
        cursor: pointer;
        margin-right: 30px;
      }
      .user {
        width: 36px;
        height: 100px;
        line-height: 100px;
        display: inline-block;
        // vertical-align: middle;
        position: relative;
        &:hover {
          .drop-nav {
            display: block;
          }
        }
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          vertical-align: middle;
        }
        .drop-nav {
          width: 130px;
          height: 160px;
          display: none;
          background-color: #fff;
          box-shadow:0px 0px 6px 0px rgba(0,0,0,0.2);
          border-radius:4px;
          position: absolute;
          top: 75px;
          left: -46px;
          padding: 20px 20px 0 20px;
          li {
            height: 40px;
            line-height: 40px;
            text-align: center;
            cursor: pointer;
            &:first-child{
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              line-height: 20px;
              border-bottom: 1px solid #E5E5E5;
              cursor: default;
            }
            &:hover {
              color: #0A97ED;
            }
          }
        }
      }
      .collect {
        color: #333333;
        margin-right: 20px;
        margin-left: 20px;
        cursor: pointer;
      }
      .history {
        cursor: pointer;
      }
    }
  }
}
</style>
