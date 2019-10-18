<template>
  <div class="parent">
    <p>我是父亲，给子级的{{sthGiveChild}}</p>
    <child-input v-model="sthGiveChild"></child-input>
  </div>
</template>
<script>
import childInput from './childInput'
export default {
  name: 'parent',
  data () {
    return {
      give: 100
    }
  },
  components: {
    childInput
  }
}
</script>