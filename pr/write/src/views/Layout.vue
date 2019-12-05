<template>
  <div id="layout" class="layout">
    <transition name="router-fade" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="router-fade" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'layout',
  data () {
    return {}
  },
  created () {

  }
}
</script>
<style lang="scss">
.layout {
  width: 1200px;
  // position: absolute;
  // top: 100px;
  // left: 50%;
  // margin-left: -600px;
  margin: 20px auto 40px;
  // bottom: 20px;
  background: #FFFFFF;
  box-shadow: 0 4px 6px 0 rgba(0,0,0,0.10);
  overflow: hidden;

}

// layout样式
.layout-header {
  height: 90px;
  line-height: 90px;
  margin: 0 30px;
  border-bottom: 1px solid #E5E5E5;
  position: relative;
  .title {
    font-size: 18px;
    font-weight: bold;
    margin-left: 40px;
  }
  .back-btn {
    height: 24px;
    width: 24px;
    display: inline-block;
    background-image: url('../images/icons/icon_back.png');
    background-size: 24px 24px;
    background-repeat: no-repeat;
    background-position: left center;
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -12px;
  }
  .search-btn{
    height: 42px;
    width: 110px;
    color: #fff;
    border-radius: 21px;
    text-indent: 24px;
    background-color: #0182E8;
    background-image: url('../images/icons/light_icon.png');
    background-size: 24px 24px;
    background-repeat: no-repeat;
    background-position: left 12px center;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -21px;
  }
}
</style>
