<template>
  <div id="login" :style="{backgroundImage: 'url(' +login_bg + ')'}">
    <div class="wrap">
      <div class="wrap-content clearfix">
        <div class="left">
          <!--<img src="../images/login_icon.png" alt="">-->
          <h1>科情头条管理系统</h1>
          <div class="login-form" @keyup.enter="login">
            <div class="input-row">
              <span class="label">账号</span>
              <input type="text" class="input" placeholder="请输入登录账号" autocomplete="off" v-model="username">
            </div>
            <div class="input-row">
              <span class="label">密码</span>
              <input type="password" class="input" placeholder="请输入登录密码" autocomplete="off" v-model="password">
            </div>
            <div class="btn">
              <a href="javascript:;" @click="login" v-show="login_btn_show">登录</a>
              <a href="javascript:;" v-show="!login_btn_show"><i class="el-icon-loading"></i> 登录中</a>
            </div>
          </div>
          <div class="source">
            <p>深圳市智搜信息技术有限公司 提供技术支持</p>
          </div>
        </div>
        <div class="right">
        </div>
      </div>
      <div class="wrap-background" :style="{backgroundImage: 'url(' +right_bg + ')'}"></div>
    </div>
  </div>
</template>

<script>
  import md5 from "md5";

  export default {
    data() {
      return {
        username: "",
        password: "",
        login_bg: require("../images/login_bg.png"),
        right_bg: require("../images/right_bg.png"),
        login_btn_show: true,
      };
    },

    methods: {
      login() {
        var self = this;
        if (self.username != "" && self.password != "") {
          self.login_btn_show = false;
          self.$.ajax({
            url: apiHost + "/auth/login",
            type: "POST",
            data: {
              username: self.username,
              pwd: md5(self.password)
            },
            dataType: "json",
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            success: function (data) {
              self.login_btn_show = true;
              if (data.code == 0 && data.data.isLogin == true) {
                sessionStorage.setItem('sysuser', JSON.stringify(data.data.sysuser));
                self.$router.push("/layout");
              } else {
                self.$message({
                  type: "error",
                  message: '账号或者密码错误！',
                  showClose: "true"
                });
              }
            },
            error: function (err) {
              self.login_btn_show = true;
              self.$message({
                type: "error",
                message: '请求失败',
                showClose: "true"
              });
            }
          });
        } else {
          self.$message({
            message: "账号和密码不能为空",
            type: "warning",
            showClose: true
          });
        }
      },
    }
  };
</script>
<style lang="scss">
  #login {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;

    .wrap {
      width: 1170px;
      height: 100%;
      position: relative;
      left: 50%;
      margin-left: -585px;

      .wrap-background {
        position: absolute;
        top: 0;
        right: 0;
        width: 759px;
        height: 100%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        z-index: 3;
      }

      .wrap-content {
        position: absolute;
        width: 100%;
        height: 630px;
        top: 50%;
        margin-top: -315px;
        background-color: #fff;
        z-index: 2;

        .left {
          width: 411px;
          height: 100%;
          background-color: #fff;
          float: left;
          box-sizing: border-box;
          padding: 60px 40px 0 40px;
          position: relative;

          img {
            display: block;
            width: 100px;
            height: 100px;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 30px;
          }

          h1 {
            font-size: 28px;
            color: #333333;
            letter-spacing: 0;
            text-align: center;
            line-height: 28px;
            margin-bottom: 45px;
            margin-top: 20px;
          }

          .login-form {
            width: 100%;

            .input-row {
              margin-bottom: 43px;

              input:-webkit-autofill {
                box-shadow: 0 0 0px 1000px white inset !important;
              }

              input::-webkit-input-placeholder {
                color: #ddd;
                font-size: 12px;
                /*text-align: right;*/
              }

              input::-moz-placeholder {
                color: #ddd;
                font-size: 12px;
                /*text-align: right;*/
              }

              input:-moz-placeholder {
                color: #ddd;
                font-size: 12px;
                /*text-align: right;*/
              }

              input::-ms-input-placeholder {
                color: #ddd;
                font-size: 12px;
                /*text-align: right;*/
              }

              .label {
                display: block;
                font-size: 14px;
                color: #999999;
                letter-spacing: 0;
                text-align: left;
              }

              .input {
                display: block;
                box-sizing: border-box;
                height: 45px;
                width: 100%;
                border: none;
                border-bottom: 1px solid #ddd;
                font-size: 16px;
                padding-left: 10px;
                font-size: 16px;
                color: #666666;
                letter-spacing: 0;
                background-color: #fff !important;
              }
            }

            .btn {
              text-align: right;

              a {
                display: inline-block;
                width: 95px;
                height: 38px;
                text-align: center;
                line-height: 38px;
                color: #fff;
                font-size: 16px;
                color: #FFFFFF;
                letter-spacing: 0;
                background-color: $main-color;
                /*border-radius: 27px;*/
                /*border: 8px solid rgba(51, 51, 51, 0.20);*/
                background: #B42F1E;
                border: 8px solid #ddd;
                border-radius: 74px;
              }
            }
          }

          .source {
            position: absolute;
            bottom: 20px;
            width: 331px;
            p {
              font-size: 12px;
              color: #999999;
              letter-spacing: 0;
              text-align: center;
              line-height: 12px;
            }
          }
        }

        .right {
          width: 759px;
          height: 100%;
          background-color: #4D7CFE;
          float: left;
        }
      }

    }


    /*.login-form {
      width: 390px;
      height: 415px;
      background-color: transparent;
      position: absolute;
      top: 50%;
      right: 5%;
      margin-top: -208px;
      margin-left: -180px;

      h1 {
        width: 100%;
        font-size: 28px;
        text-align: center;
        color: #ff9300;
        margin-bottom: 20px;
      }

      .form {
        background-color: #211f1a;
        border: 1px solid #58351a;
        padding-left: 40px;
        padding-right: 40px;
        height: 370px;
        position: relative;

        .corner {
          position: absolute;
          width: 40px;
          height: 40px;
        }

        .corner-top-left {
          top: 0;
          left: 0;
          border-top: 3px solid #ff9300;
          border-left: 3px solid #ff9300;
        }

        .corner-top-right {
          top: 0;
          right: 0;
          border-top: 3px solid #ff9300;
          border-right: 3px solid #ff9300;
        }

        .corner-bottom-left {
          bottom: 0;
          left: 0;
          border-bottom: 3px solid #ff9300;
          border-left: 3px solid #ff9300;
        }

        .corner-bottom-right {
          bottom: 0;
          right: 0;
          border-bottom: 3px solid #ff9300;
          border-right: 3px solid #ff9300;
        }

        h3 {
          font-size: 18px;
          color: #fff;
          text-align: center;
          margin: 50px 0;
        }

        :-moz-placeholder {
          !* Mozilla Firefox 4 to 18 *!
          color: #ff9300;
          opacity: 1;
        }

        ::-moz-placeholder {
          !* Mozilla Firefox 19+ *!
          color: #ff9300;
          opacity: 1;
        }

        input:-ms-input-placeholder {
          color: #ff9300;
          opacity: 1;
        }

        input::-webkit-input-placeholder {
          color: #ff9300;
          opacity: 1;
        }

        input {
          -webkit-box-shadow: 0 0 0px 1000px #211f1a inset;
          -webkit-text-fill-color: #ff9300;
        }

        .input {
          height: 38px;
          border: 1px solid #ff9300;
          border-radius: 4px;
          margin-bottom: 30px;
          padding-left: 40px;
          background-position: 12px center;
          background-repeat: no-repeat;

          input {
            border: none;
            background-color: transparent;
            width: 100%;
            height: 38px;
            color: #ff9300 !important;
            font-size: 12px;
          }
        }

        .button {
          margin-top: 20px;

          button {
            display: block;
            width: 100%;
            height: 40px;
            border-radius: 4px;
            background-color: #ff9300;
            color: #fff;
            font-size: 12px;
            border: 0;
            outline: none;
            cursor: pointer;
          }
        }
      }
    }*/
  }

  @media screen and (max-width: 1440px) {
    #login {
      .wrap {
        .wrap-content {
          height: 560px;
          margin-top: -280px;

          .left {
            padding: 30px 40px 0 40px;

            img {
              width: 80px;
              height: 80px;
            }

            h1 {
              font-size: 24px;
            }

            .source {
              margin-top: 45px;
            }
          }
        }
      }
    }
  }
</style>
