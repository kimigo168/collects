<template>
  <el-dialog title="标签详情"  id="label-detail"  :visible.sync="showModel" width="430px !important" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="beforeClose" :show-close="false">
    <div class="detail-wrap">
      <ul class="clearfix">
        <li v-for="item in 10" :key="item">{{item}}</li>
      </ul>
    </div>
    <div class="bot-btns">
      <el-button type="primary" @click="beforeClose">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'labelDetail',
  props: ['labelList', 'isShow'],
  data () {
    return {
      showModel: false
    }
  },
  methods: {
    beforeClose () {
      this.showModel = false;
      this.$emit('fClose');
    }
  },
  mounted () {
    setTimeout(() => {
      this.showModel = this.isShow
    }, 200)
  }
}
</script>
<style lang="scss" scoped>
.detail-wrap {
  min-height: 80px;
  ul {
    padding-top: 10px;
    li {
      height: 22px;
      line-height: 22px;
      text-align: center;
      min-width: 50px;
      border-radius: 11px;
      border: 1px solid rgba(121, 121, 121, 1);
      float: left;
      box-sizing: border-box;
      padding:0 5px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}
.bot-btns {
  text-align: center;
  margin-top: 20px;
}
</style>