<template>
  <div id="top-menu" class="clearfix">
    <div class="menu-left">
      <a href="javascript:;">
        <img src="../images/menu_show_icon.png" @click="$store.dispatch('menuShowChange', !menu_show)">
      </a>
    </div>
    <div class="menu-right clearfix">
      <ul class="clearfix">
        <li v-for="(item,$index) in menuList" :key="item.id"><a href="javascript:;" :class="{active: top_menu_active == $index}" @click="topMenuClick(item.children, $index)">{{item.name}}</a></li>
      </ul>
      <div class="logout">
        <img src="../images/icon-logout.png" alt="">
      </div>
      <div class="user">
        <a href="javascript:;">admin</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"

export default {
  props: ['menuList'],
  data() {
    return {}
  },
  computed: {
    ...mapState(
      ["menu_show", "top_menu_active"]
    )
  },
  created() {
  },
  methods: {
    topMenuClick(menuChildren) {
      // var path = '';
      // if (menuChildren[0] && menuChildren[0].path) {
      //   if (menuChildren[0].children && menuChildren[0].children[0] && menuChildren[0].children[0].path) {
      //     path = '/layout/' + menuChildren[0].path + '-' + menuChildren[0].children[0].path
      //   } else {
      //     path = '/layout/' + menuChildren[0].path
      //   }
      //   this.$router.push(path);
      // }
    }
  }
}
</script>

<style lang="scss">
#top-menu {
  height: 50px;
  background-color: $top-bc-color;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  .menu-left {
    float: left;
    height: 50px;

    a {
      display: block;
      margin-left: 12px;
    }

    img {
      margin-top: 12px;
    }
  }

  .menu-right {
    float: right;

    ul {
      margin-right: 75px;
      float: left;

      li {
        float: left;
        margin: 0 18px;

        a {
          display: block;
          height: 50px;
          line-height: 50px;
          color: #fff;
          font-size: 14px;
          box-sizing: border-box;
        }

        a.active {
          color: $main-color;
          border-bottom: 2px solid $main-color;
        }
      }
    }

    .user {
      float: right;

      a {
        display: block;
        color: #fff;
        line-height: 50px;
        margin-right: 30px;
      }
    }

    .logout {
      float: right;
      width: 45px;

      img {
        display: block;
        width: 24px;
        margin-top: 13px;
        cursor: pointer;
      }
    }
  }
}
</style>
