<template>
  <div id="layout">
    <div class="left" :class="{'left-collapse':!menu_show}">
      <div id="side-menu">
        <h1><i></i><a href="javascript:;">科情头条管理系统</a></h1>
        <el-menu :default-active="active_index" :router="true" :unique-opened="true" v-if="menu_list[top_menu_index] && menu_list[top_menu_index].children">
          <el-submenu :index="list.path" v-for="list in menu_list[top_menu_index].children" :key="list.name">
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
    </div>
    <div class="right" :class="{'right-collapse':!menu_show}">
      <div class="right-wrap">
        <div id="top-menu" class="clearfix">
          <div class="menu-left">
            <a href="javascript:;">
              <img src="../images/menu_show_icon.png" @click="menu_show = !menu_show">
            </a>
          </div>
          <div class="menu-right clearfix">
            <ul class="clearfix">
              <li v-for="(item,$index) in menu_list" :key="item.id">
                <a href="javascript:;" :class="{active: top_menu_index == $index}" @click="topMenuClick(item, $index)">{{item.name}}</a>
              </li>
            </ul>
            <!-- <div class="logout">
              <img src="../images/icon-logout.png" alt="" @click="logout">
            </div> -->
            <div class="user">
              <el-dropdown :hide-on-click="true" @command="handleCommand">
                <span class="el-dropdown-link">
                  {{user_info.username}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <!-- <el-dropdown-item command="1">修改资料</el-dropdown-item> -->
                  <el-dropdown-item command="2">修改密码</el-dropdown-item>
                  <el-dropdown-item command="3">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
        <div class="main">
          <div class="main-wrap" v-loading.lock="loading">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改资料 -->
    <el-dialog title="修改资料" :visible.sync="update_userinfo_visible">
      <el-form :model="update_userinfo_form" status-icon :rules="update_userinfo_form_rules" ref="update_userinfo_form" label-width="100px">
        <el-form-item label="账号" prop="username">
          <el-input type="text" v-model="update_userinfo_form.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input type="text" v-model="update_userinfo_form.name" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="update_userinfo_visible = false">取 消</el-button>
        <el-button type="primary" @click="updateInfo('update_userinfo_form')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="update_pwd_visible">
      <el-form :model="update_pwd_form" status-icon :rules="update_pwd_form_rules" ref="update_pwd_form" label-width="100px">
        <el-form-item label="旧密码" prop="old_pwd">
          <el-input type="text" v-model="update_pwd_form.old_pwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pwd">
          <el-input type="text" v-model="update_pwd_form.pwd" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="update_pwd_visible = false">取 消</el-button>
        <el-button type="primary" @click="updatePwd('update_pwd_form')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapState } from "vuex";
import MD5 from 'md5';
export default {
  data() {
    return {
      active_index: "",
      top_menu_index: 0,
      menu_show: true,
      menu_list: [],

      //修改资料
      update_userinfo_visible: false,
      update_userinfo_form: {
        username: "",
        name: ""
      },
      update_userinfo_form_rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
      },

      update_pwd_visible: false,
      update_pwd_form: {
        old_pwd: "",
        pwd: "",
      },
      update_pwd_form_rules: {
        old_pwd: [
          { required: true, message: "旧密码不能为空", trigger: "blur" },
          { min: 6, max: 16, message: "密码长度为6-16位", trigger: "blur" },
        ],
        pwd: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          { min: 6, max: 16, message: "密码长度为6-16位", trigger: "blur" },
        ]

      },
      loading: false
    };
  },
  created() {
    this.getUserInfo();
    this.getMenuList();
    this.getChannelList();
  },
  watch: {
    $route(to, from) {
      // 由to的path来匹配改变 top_menu_index 和 active_index
      this.menuRender();
    }
  },
  computed: {
    ...mapState(["user_info"])
  },
  methods: {
    //退出系统
    logout() {
      var self = this;
      self.$ajax({
        url: "/auth/logout",
        type: "POST",
        data: {},
        success: function (data) {
          if (data.code == 0) {
            self.$router.push("/");
          } else {
          }
        }
      });
    },

    //获取菜单列表
    getMenuList() {
      var self = this;
      this.loading = true;
      self.$ajax({
        url: "/auth/getMenuList",
        type: "POST",
        data: {},
        success: function (data) {
          self.loading = false;
          if (data.code == 0) {
            try {
              self.menu_list = data.data.menu_list;
              if (self.menu_list.length > 0) {
                self.menuRender(true);
              }
            } catch (e) {
              console.log(e);
            }
          }
        },
        error: (err) => {
          this.loading = false;
        }
      });
    },

    //获取频道列表
    getChannelList() {
      var self = this;
      self.$ajax({
        url: "/user/getNewsChannel",
        type: "GET",
        data: {},
        success: function (data) {
          if (data.code == 0) {
            try {
              self.$store.commit("GETCHANNELLIST", data.data);
            } catch (e) {
              console.log(e);
            }
          } else {
          }
        }
      });
    },

    menuRender(isInit) { // isInit表示登录后跳转第一个页面
      var self = this;
      var hash = location.hash.split("/")[location.hash.split("/").length - 1];
      if (hash.indexOf("?") > -1) {
        hash = hash.split("?")[0];
      }
      if (hash == "push-add") {
        self.active_index = "message-push";
        self.top_menu_index = 1;
      }
      if (hash == "hot-paper") {
        self.active_index = "create-paper";
        self.top_menu_index = 0;
      }

      if (hash == "number-create") {
        self.active_index = "number-list";
        self.top_menu_index = 0;
      }
      for (var i = 0; i < self.menu_list.length; i++) {
        if (self.menu_list[i] && self.menu_list[i].children && self.menu_list[i].children.length > 0) {
          for (var j = 0; j < self.menu_list[i].children.length; j++) {
            if (self.menu_list[i].children[j] && self.menu_list[i].children[j].children
              && self.menu_list[i].children[j].children.length > 0) {
              for (var k = 0; k < self.menu_list[i].children[j].children.length; k++
              ) {
                if (hash == self.menu_list[i].children[j].path + "-" +
                  self.menu_list[i].children[j].children[k].path) {
                  self.active_index = hash;
                  self.top_menu_index = i;
                }
              }
            }
          }
        }
      }
      // 登录后首次加载跳转页面控制
      if (isInit && this.menu_list.length > 0 && this.menu_list[0].children.length > 0) {
        let path = '/layout/'+this.menu_list[this.top_menu_index].children[0].path + "-" + this.menu_list[this.top_menu_index].children[0].children[0].path;
        if (this.$route.path == '/layout') {
          this.$router.push(path);
        }
      }
    },

    topMenuClick(item, $index) {
      if (item.children && item.children[0] && item.children[0].children) {
        let url = "/layout/" + item.children[0].path +'-'+ item.children[0].children[0].path;
        this.$router.push(url); // 先跳转，watch监听路由变化了，即完成跳转后，再来通过menuRender()改变top_menu_index和active_index
      }
    },

    //获取用户信息
    getUserInfo() {
      var self = this;
      self.$ajax({
        url: "/auth/userInfo",
        type: "POST",
        data: {},
        success: function (data) {
          if (data.code == 0) {
            try {
              self.$store.dispatch("initUserInfo", data.data);
            } catch (e) {
              console.log(e);
            }
          }
        }
      });
    },

    handleCommand(c) {
      if (c == 1) {
        this.update_userinfo_visible = true;
        this.update_userinfo_form.username = this.user_info.username;
        this.update_userinfo_form.name = this.user_info.name;
      }
      if (c == 2) {
        this.update_pwd_visible = true;
      }
      if (c == 3) {
        this.logout();
      }
    },

    //退出系统
    logout() {
      var self = this;
      self.$ajax({
        url: "/auth/logout",
        type: "POST",
        data: {},
        success: function (data) {
          if (data.code == 0) {
            self.$router.push("/");
          } else {
          }
        }
      });
    },

    //修改用户信息
    updateInfo(formName) {
      var self = this
      self.$refs[formName].validate((valid) => {
        if (valid) {
          self.$jqAjax({
            url: apiHost + '/auth/updatePerInfo',
            type: 'POST',
            data: {
              username: self.update_userinfo_form.username,
              name: self.update_userinfo_form.name,
            },
            success: function (data) {
              if (data.code == 0) {
                self.$message({
                  type: 'success',
                  message: '修改成功',
                  showClose: 'true',
                });
                self.update_userinfo_visible = false;
                location.reload();
              }
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    //修改密码
    updatePwd(formName) {
      var self = this
      self.$refs[formName].validate((valid) => {
        if (valid) {
          self.$jqAjax({
            url: apiHost + '/auth/updatePwd',
            type: 'POST',
            data: {
              pwd: MD5(self.update_pwd_form.pwd),
              oldPwd: MD5(self.update_pwd_form.old_pwd),
            },
            success: function (data) {
              if (data.code == 0) {
                self.$message({ type: 'success', message: '修改成功', showClose: 'true'});
                self.update_pwd_visible = false;
                self.$router.push("/");
              } else {
                self.$message({type: 'error', message: data.msg, showClose: true});
              }
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
};
</script>

<style lang="scss">
#layout {
  width: 100%;
  height: 100%;
  position: relative;

  .left {
    width: 180px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: #f5f5f5;
    transition: left 0.5s;
    box-shadow: 0 0 6px 4px rgba(0, 0, 0, 0.2);

    #side-menu {
      height: 100%;
      width: 100%;
      background-color: #fff;
      box-sizing: border-box;

      h1 {
        background-color: $top-bc-color;
        margin-bottom: 20px;
        padding-left: 5px;

        a {
          display: block;
          font-size: 14px;
          color: #ffffff;
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

        .el-menu-item:hover,
        .el-menu-item:focus {
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
  }

  .left-collapse {
    left: -180px;
  }

  .right {
    position: absolute;
    top: 0;
    left: 180px;
    right: 0;
    bottom: 0;
    transition: left 0.5s;

    .right-wrap {
      position: relative;
      width: 100%;
      height: 100%;

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
            height: 50px;
            line-height: 50px;
            padding-right: 20px;
            cursor: pointer;
            // a {
            //   display: block;
            //   color: #fff;
            //   line-height: 50px;
            //   margin-right: 30px;
            // }
            span {
              color: #fff;
              margin: 0 5px;
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
    }

    .main {
      width: auto;
      position: absolute;
      top: 50px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      padding: 20px;
      overflow-y: auto;

      .main-wrap {
        min-height: 100%;
        box-sizing: border-box;
        background-color: #fff;
        /*border-bottom: 20px solid #f5f5f5;*/
      }
    }

    .tab {
      .el-table {
        a {
          color: #4d7cfe;
        }
      }

      .el-tabs__header {
        margin: 0;
      }

      .el-tabs__item {
        height: 50px;
        line-height: 50px;
      }

      .el-tabs__nav-scroll {
        padding-left: 20px;
      }

      .el-tabs__nav-wrap::after {
        background-color: #f5f5f5 !important;
      }
    }

    .content, .webContent {
      .sub-tab {
        padding: 0 20px 0 40px;

        & > li {
          float: left;
          margin-right: 30px;

          a {
            display: block;
            line-height: 50px;
            font-size: 14px;
            color: #333333;
            letter-spacing: 0;
            box-sizing: border-box;
            position: relative;
          }

          a.active {
            color: $main-color;
          }

          a.active:after {
            display: block;
            content: "";
            width: 100%;
            height: 2px;
            background-color: $main-color;
            position: absolute;
            left: 0;
            bottom: -2px;
          }
        }
      }

      .operate {
        padding: 0 20px;
        margin: 30px 0 15px;

        .lt {
          float: left;
        }

        .rt {
          float: right;
        }

        .search {
          .el-form-item {
            margin-bottom: 10px;

            .el-range-editor--small.el-input__inner {
              width: 235px;
            }
          }

          .el-select,
          .el-input {
            width: 120px;
          }

          .el-input__inner {
            height: 30px;
            line-height: 30px;
            font-size: 12px;
            vertical-align: baseline;
          }

          .el-select .el-input .el-select__caret {
            font-size: 12px;
          }

          .el-form-item__label {
            font-size: 14px;
          }

          .el-date-editor .el-range__icon,
          .el-date-editor .el-range__close-icon,
          .el-date-editor .el-range-separator {
            line-height: 24px;
            width: auto;
          }
        }

        .btn {
          margin-bottom: 10px;
          margin-top: 5px;
        }

        .el-button {
          padding: 8px 18px;
          border-radius: 0;
        }
      }

      .operate20 {
        padding-left: 20px;
      }

      .table {
        .main-color {
          color: $main-color;
        }

        .success-color {
          color: $success-color;
        }
        .wran-color {
          color: $warn-color;
        }

        .danger-color {
          color: $danger-color;
        }

        img {
          display: inline-block;
          max-width: 70px;
          max-height: 70px;
          vertical-align: middle;
          overflow: hidden;
        }
      }

      .page {
        text-align: right;
        padding: 15px 20px 15px;
        background-color: #fff;
      }

      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }

      .avatar-uploader .el-upload:hover {
        border-color: #409eff;
      }

      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }

      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
    }
  }

  .right-collapse {
    left: 0;
  }

  .el-dialog {
    .upload {
      .avatar-uploader {
        width: 178px;
        height: 128px;
      }

      .avatar-uploader .el-upload:hover {
        border-color: #409eff;
      }

      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 128px;
        line-height: 128px;
        text-align: center;
      }

      .avatar {
        width: 178px;
        height: 128px;
        display: block;
      }
    }
  }
}
</style>
