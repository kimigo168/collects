<template>
  <div id="user-header">
    <a href="javascript:;" class="back" @tap="goBack()">
      <img src="./../../assets/images/user-icon_01.png"/>
    </a>
    <div class="header-title">{{title}}</div>
  </div>
</template>

<script>
  export default {
    props:['title','to'],
    data: function () {
      return {

      }
    },
    methods: {
      goBack(){
        if(this.to){
          this.$router.push(this.to)
        }else {
          this.$router.back();
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "./../../assets/scss/app.scss";

  #user-header {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 9999;
    height: rem(88);
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.06);
    .back{
      position: absolute;
      left: 0;
      top:0;
      display: block;
      width: rem(80);
      height: rem(88);
      img {
        width: rem(17);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .header-title {
      text-align: center;
      line-height: rem(88);
      font-size:rem(32);
      color:rgba(51,51,51,1);
    }

  }
</style>
