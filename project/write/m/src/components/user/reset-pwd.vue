<template>
  <div id="reset-pwd">
    <userHeader title="修改密码"></userHeader>


    <div class="form">
      <div class="row">
        <p>原密码</p>
        <input type="password" placeholder="请输入原密码" v-model="resetPasswordForm.odlPassword" />
      </div>
      <div class="row">
        <p>新密码</p>
        <input type="password" placeholder="请输入新密码" v-model="resetPasswordForm.password" />
      </div>
      <div class="row">
        <p>确认密码</p>
        <input type="password" placeholder="请再次输入新密码" v-model="resetPasswordForm.password2" />
      </div>
      <button class="submit-btn" type="button" @tap="resetPasswordSubmit()">修 改</button>
    </div>


  </div>
</template>

<script>
  import userHeader from './userHeader.vue'

  export default {
    components: {
      userHeader,
    },
    data: function () {
      return {
        resetPasswordForm:{
          odlPassword:'',
          password:'',
          password2:'',
        }
      }
    },
    created() {

    },
    methods: {


      resetPasswordSubmit(){
        var self=this;
        if(!self.resetPasswordForm.odlPassword){
          self.$store.commit('setToolTip', '请输入原密码!');
          return
        }
        if(!self.resetPasswordForm.password){
          self.$store.commit('setToolTip', '请输入新密码!');
          return
        }else if(self.resetPasswordForm.password2 !==self.resetPasswordForm.password){
          self.$store.commit('setToolTip', '两次输入的密码不一致，请重新输入!');
          return
        }

        self.$store.commit('setLoading', true);
        self.$http({
          url: apiHost + "/user/update_password.do",
          data:{
            old_password: MD5(self.resetPasswordForm.odlPassword),
            new_password: MD5(self.resetPasswordForm.password)
          },
          success: function (data) {
            self.$store.commit('setLoading', false);
            if (data.code == 0) {
              self.$store.commit('setToolTip', '密码修改成功！');
              self.resetPasswordForm={
                odlPassword:'',
                  password:'',
                  password2:'',
              }
            }else if (data.code == '407') {
              self.resetPasswordForm.odlPassword='';
              self.$store.commit('setToolTip', '原密码错误！');
            }else {
              self.$store.commit('setToolTip', data.msg);
            }
          }
        })
      },

    }
  }
</script>

<style lang="scss">
  @import "./../../assets/scss/app.scss";

  #reset-pwd {
    padding: rem(88) rem(30);

    .form{
      padding-top: rem(60);
      h3{
        font-size:rem(36);
        font-weight:600;
        color:rgba(51,51,51,1);
        line-height:rem(50);
        padding-bottom: rem(42);
      }
      .row{
        margin-bottom: rem(30);
        position: relative;
        p{
          font-size:rem(32);
          font-weight:400;
          color:rgba(51,51,51,1);
          line-height:rem(45);
          margin-bottom: rem(20);
        }
        input{
          height: rem(60);
          border:none;
          border-bottom: 1px solid #E5E5E5;
          font-size: rem(28);
          font-weight:400;
          color:rgba(51,51,51,1);
          width: 100%;
          box-sizing: border-box;
        }
      }
      .submit-btn{
        display: block;
        width:100%;
        height:rem(88);
        background:rgba(36,107,255,1);
        border-radius:rem(48);
        font-size:rem(36);
        font-weight:400;
        color:rgba(255,255,255,1);
        border: none;
        margin-bottom: rem(26);
        &:disabled{
          cursor: not-allowed;
          background-color: #cccccc;
        }
      }
    }

  }

</style>
