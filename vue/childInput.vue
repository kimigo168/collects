<template>
  <div class="child">
    <p>我是子组件，我这里可以改变我自己，同时改变父元素输入</p>
    <input type="text" v-model="gave" @input="inputChange">
  </div>
</template>
<script>
export default {
  name: 'childInput',
  props: {
    give: String
  },
  data () {
    return {
      gave: this.give
    }
  },
  model: {
    prop: 'give',
    event: 'changeInput'
  },
  methods: {
    changeInput () {
      this.$emit('changeInput', this.gave)
    },
    inputChange (e) {
      let val = e.target.value
      val = val.replace(/\w/, '') // 控制输入
      this.$emit('changeInput', val)
    }
  }
}
</script>