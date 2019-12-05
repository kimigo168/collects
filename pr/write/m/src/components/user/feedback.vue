<template>
  <div id="feedback">
    <userHeader title="意见反馈"></userHeader>

    <textarea v-model="content" class="feedback-content" maxlength="800" placeholder="请输入您的宝贵意见"></textarea>

    <button class="submit-btn" type="button" @tap="submit()">提 交</button>
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
        content:'',
      }
    },
    methods: {

      submit(){
        var self=this;
        if(!self.content){
          self.$store.commit('setToolTip', '请输入您的宝贵意见!');
          return
        }
        self.$store.commit('setLoading', true);
        self.$http({
          url: apiHost + "/wap/c/feedback/add.do",
          data:{
            content: self.content,
          },
          success: function (data) {
            self.$store.commit('setLoading', false);
            if (data.code == 0) {
              self.$store.commit('setToolTip', '意见反馈提交成功！');
              self.content='';
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

  #feedback {
    height: 100%;
    box-sizing: border-box;
    position: relative;
    padding-top: rem(88);

    .feedback-content{
      position: absolute;
      left: 0;
      top:rem(88);
      width: 100%;
      bottom: rem(180);
      box-sizing: border-box;
      font-size:rem(30);
      color:#000000;
      line-height:rem(46);
      padding:rem(30);
      border: none;
    }

    .submit-btn{
      position: absolute;
      left: 50%;
      bottom: rem(43);
      transform: translateX(-50%);
      display: block;
      width:rem(500);
      height:rem(88);
      background:rgba(36,107,255,1);
      border-radius:rem(48);
      font-size:rem(36);
      font-weight:400;
      color:rgba(255,255,255,1);
      border: none;
      &:disabled{
        cursor: not-allowed;
        background-color: #cccccc;
      }
    }

  }

</style>
