<template>
  <div class="picker-box">
    <div class="block">
      <span class="demonstration">时间</span>
      <el-date-picker
        v-model="picker_time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
    </div>
    <label for="title" class="label-text">标题</label>
    <input type="text" id="title" v-model="picker_title" autocomplete="off"/>
    <label for="tag" class="label-text">标签</label>
    <input type="text" id="tag" v-model="picker_tag" autocomplete="off"/>
    <button @click="pickerQuery" @keyup.13.native="pickerQuery">搜 索</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pageNum: 1,
      pageSize: 10,
      picker_time: '',
      picker_title: '',
      picker_tag: ''
    }
  },
  methods: {
    pickerQuery () {
      if (this.picker_time === '' && this.picker_title === '' && this.picker_tag === '') {
        this.$message({ type: 'warning', message: '请输入查询条件', showClose: true })
        return
      }
      let nowPath = this.$route.path
      if (nowPath === '/collect') {
        this.$axios.post(
          this.$global.API.queryCollectList,
          this.$qs.stringify({
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            startTime: this.picker_time ? new Date(this.picker_time[0]).format('YYYY-MM-DD 00:00:00') : '',
            endTime: this.picker_time ? new Date(this.picker_time[1]).format('YYYY-MM-DD 23:59:59') : '',
            title: this.picker_title,
            keyword: this.picker_tag
          })
        )
          .then(res => {
            if (res.code === '0') {
              var result = res.data.collectList
              this.$emit('pickerCollect', result)
            }
          })
      }
      if (nowPath === '/history') {
        this.$axios.post(
          this.$global.API.historyList,
          this.$qs.stringify({
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            startTime: this.picker_time ? new Date(this.picker_time[0]).format('YYYY-MM-DD 00:00:00') : '',
            endTime: this.picker_time ? new Date(this.picker_time[1]).format('YYYY-MM-DD 23:59:59') : '',
            title: this.picker_title,
            keyword: this.picker_tag
          })
        )
          .then(res => {
            if (res.code === '0') {
              var result = res.data.historyList
              this.$emit('pickerHistory', result)
            }
          })
      }
    }
  },
  created: function () {
    var self = this
    document.onkeyup = function (e) {
      if (window.event.keyCode === 13) {
        self.pickerQuery()
      }
    }
  }
}
</script>

<style lang="scss">
.picker-box {
  width: 100%;
  padding: 20px 84px 30px;
  div.block {
    display: inline-block;
    .demonstration {
      margin: 10px 12px 10px 0px;
    }
  }
  input {
    width: 160px;
    height: 40px;
    background: rgba(244, 244, 244, 1);
    border-radius: 2px;
    border: 1px solid rgba(228, 228, 228, 1);
    padding-left: 5px;
  }
  button {
    width: 100px;
    height: 40px;
    background: rgb(14, 138, 216);
    border-radius: 2px;
    color: #fff;
    margin-left: 40px;
  }
  button:hover {
    background: rgb(4, 157, 246);
  }
  label.label-text {
    width: 28px;
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    padding: 10px 12px 10px 30px;
  }
}
</style>
