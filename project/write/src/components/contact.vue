<template>
  <div class="contact-wrap">
    <ul>
      <li data-title="电话：0755-86720697"><i class="phone"></i></li>
      <li data-title="邮箱：contact@giiso.com"><i class="email"></i></li>
      <li data-title="qq：2020601975" class="qq-li" @click="openQchat">
        <i class="qq"></i>
        <!-- <a href="tencent://message/?uin=2020601975&Site=Sambow&Menu=yes"></a> -->
        <a id="qq" href="http://wpa.qq.com/msgrd?v=3&uin=2020601975&site=qq&menu=yes" target="_blank"></a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'contact',
  data () {
    return {}
  },
  methods: {
    openQchat () {
      document.getElementById('qq').click()
    }
  }
}
</script>
<style lang="scss" scoped>
.contact-wrap {
  height: 214px;
  width: 58px;
  position: fixed;
  right: 40px;
  bottom: 40px;
  z-index: 1000;
  ul {
    li {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0 10px 20px 0 rgba(114,122,139,0.30);
      position: relative;
      margin-bottom: 20px;
      &:hover {
        background-image: linear-gradient(180deg, #4D87FF 0%, #0EA0FF 100%);
      }
      &:hover::after {
        content: attr(data-title);    //取到data-title属性的值
        width: 173px;
        height: 33px;
        text-align: center;
        line-height: 33px;
        display: inline-block;
        background-color: #606670;
        color: #fff;
        border-radius: 6px;
        border-radius: 6px;
        position: absolute;
        top: 12px;
        left: -180px;
      }
      &:first-child {
        &:hover::after {
          width: 173px;
          left: -178px;
        }
        &:hover {
          .phone {
            background-image: url('../images/icons/contact_phone_1.png');
          }
        }
      }
      &:nth-child(2) {
        &:hover::after {
          width: 180px;
          left: -184px;
        }
        &:hover {
          .email {
            background-image: url('../images/icons/contact_email_1.png');
          }
        }
      }
      &:last-child {
        margin-bottom: 0;
        &:hover::after {
          width: 140px;
          left: -144px;
        }
        &:hover {
          .qq {
            background-image: url('../images/icons/contact_qq_1.png');
          }
        }
      }
      i {
        display: inline-block;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-repeat: no-repeat;
        background-position: center center;
        // transition: all .3s ease-in;
      }
      .phone {
        width: 23px;
        height: 23px;
        background-size: 23px 23px;
        background-image: url('../images/icons/contact_phone.png');
      }
      .email {
        width: 24px;
        height: 18px;
        background-size: 24px 18px;
        background-image: url('../images/icons/contact_email.png');
      }
      .qq {
        width: 20px;
        height: 24px;
        background-size: 20px 24px;
        background-image: url('../images/icons/contact_qq.png');
      }
    }
    .qq-li {
      a {
        width: 55px;
        height: 58px;
        display: inline-block;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}
</style>
