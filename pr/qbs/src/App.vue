<template>
  <div id="app">
    <head-top v-if="$route.name !== 'login'"></head-top>
    <transition name="router-fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import headTop from './components/headTop'
export default {
  name: 'app',
  data () {
    return {}
  },
  components: {
    headTop
  },
  methods: {
    ...mapMutations(['GET_USERINFO'])
  },
  created () {
    this.GET_USERINFO()
  }
}
</script>
<style lang="scss">
  @import './style/common.scss';
  @import './style/element-reset.scss';
  #app {
    width: 100%;
    height: 100%;
  }
  .router-fade-enter-active, .router-fade-leave-active {
    transition: opacity .3s;
  }
  .router-fade-enter, .router-fade-leave-active {
    opacity: 0;
  }
</style>
