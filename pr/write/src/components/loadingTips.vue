<template>
  <el-dialog id="loading-tips" class="pop-reset" :visible.sync="showModel" top="30vh" width="320px!important" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeClose" :show-close="false">
    <div class="wrap"  v-loading.lock="loading" :element-loading-text="loadText"></div>
  </el-dialog>
</template>
<script>
import { setTimeout } from 'timers'
export default {
  name: 'loadingTips',
  props: ['loadText'],
  data () {
    return {
      showModel: false,
      loading: false
    }
  },
  methods: {
    beforeClose () {
      this.$emit('fClose')
    }
  },
  created () {
    setTimeout(() => {
      this.showModel = true
      this.loading = true
    }, 100)
  }
}
</script>
<style lang="scss">
#loading-tips {
  .el-dialog__body {
    .el-loading-spinner .el-loading-text {
      font-size: 16px;
      color: #000;
    }
  }
  .wrap {
    height: 160px;
  }
}
</style>
