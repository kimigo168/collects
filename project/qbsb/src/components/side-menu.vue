<template>
  <div id="side-menu">
    <h1><i></i><a href="javascript:;">科情头条管理系统</a></h1>
    <el-menu :default-active="active_index" :router="true" :unique-opened="true" v-if="menuList[top_menu_active] && menuList[top_menu_active].children">
      <el-submenu :index="list.path" v-for="list in menuList[top_menu_active].children" :key="list.name">
        <template slot="title">
          <i class="el-icon-document"></i>
          <span>{{list.name}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="item in list.children" :key="item.name" :index="list.path + '-' + item.path">
            {{item.name}}
            <i class="el-icon-arrow-right"></i>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  import {mapState} from "vuex"

  export default {
    props: ['menuList'],
    data() {
      return {
        active_index: '',
      }
    },
    computed: {
      ...mapState(
          ["top_menu_active"]
      )
    },
    watch: {
      '$route': function () {
        // this.menuRender()
      }
    },
    mounted() {
      // this.menuRender()
    },
    methods: {
      menuRender() {
        var self = this;
        self.$nextTick(function () {
          var pathArr = self.$route.path.split('/');
          self.active_index = pathArr[pathArr.length - 1];

          //通过路由路径，反向定位顶部菜单栏
          for (var i = 0; i < self.menu_list.length; i++) {
            var menuChildren = self.menu_list[i].children;
            for (var j = 0; j < menuChildren.length; j++) {
              if (menuChildren[j].children) {
                for (var k = 0; k < menuChildren[j].children.length; k++) {
                  if (self.active_index == menuChildren[j].path + '-' + menuChildren[j].children[k].path) {
                    self.$store.commit('TOPMENUACTIVE', i);
                    break
                  }
                }
              } else {
                if (self.active_index == menuChildren[j].path) {
                  self.$store.commit('TOPMENUACTIVE', i);
                  break
                }
              }

            }
          }
        })

      },
    }
  }
</script>

<style lang="scss">
  #side-menu {
    height: 100%;
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;

    h1 {
      width: 100%;
      background-color: $top-bc-color;
      margin-bottom: 20px;
      padding-left: 5px;

      a {
        display: block;
        font-size: 14px;
        color: #FFFFFF;
        letter-spacing: 0;
        line-height: 50px;
        padding-left: 35px;
        position: relative;
      }

      a:after {
        display: block;
        content: "";
        width: 28px;
        height: 28px;
        background-color: $main-color;
        border-radius: 50%;
        position: absolute;
        top: 11px;
        left: 0;
      }
    }

    .el-menu {
      border: none !important;

    }

    .el-submenu {
      .el-submenu__title {
        padding-left: 20px !important;
        padding-right: 0;
        height: 45px;
        line-height: 45px;
      }

      .el-menu-item {
        padding-left: 58px !important;
        padding-right: 0 !important;
        min-width: 180px;
        height: 45px;
        line-height: 45px;
        font-size: 12px;

        i {
          /*margin-left: 40px;*/
          font-size: 12px;
          display: none;
          position: absolute;
          right: 10px;
          top: 18px;
        }
      }

      .el-menu-item:hover, .el-menu-item:focus {
        background-color: #fff;
      }

      .el-menu-item.is-active i {
        display: inline-block;
      }
    }

    .el-submenu .el-submenu__title {
      font-size: 12px;
      font-weight: bold;
      color: #2c303a;
      position: relative;
    }

    .el-submenu.is-opened .el-submenu__title {
      background-color: $main-bc-color;
    }

    .el-submenu.is-opened .el-submenu__title:after {
      display: block;
      content: "";
      width: 6px;
      height: 100%;
      background-color: $main-color;
      position: absolute;
      top: 0;
      left: 0;
    }

    .el-submenu__icon-arrow {
      display: none;
    }

    .el-menu-item-group__title {
      display: none;
    }
  }
</style>
