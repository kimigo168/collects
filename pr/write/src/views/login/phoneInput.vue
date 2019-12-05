<template>
  <div class="phone-input">
    <input type="text" v-model="number" @input="inputChange" placeholder="请输入您的手机号" :class="{'error':!phoneVerify}">
    <p class="error-tip" v-if="!phoneVerify">请填写正确的手机号</p>
  </div>
</template>
<script>
export default {
  name: 'phoneInput',
  props: {
    phoneNumer: String
  },
  data () {
    return {
      number: this.phoneNumer,
      phoneVerify: true
    }
  },
  model: {
    prop: 'phoneNumer',
    event: 'formatInput'
  },
  methods: {
    formatInput () {

    },
    inputChange (e) {
      let val = e.target.value
      val = val.replace(/\D/g, '').substring(0, 11)
      this.number = val
      this.$emit('formatInput', val)
      console.log('val', val)
      if (val.length === 11) {
        if (this.$global.phoneReg.test(val)) {
          this.phoneVerify = true
        } else {
          this.phoneVerify = false
        }
      } else {
        this.phoneVerify = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.phone-input {
  position: relative;
  input {
    height: 36px;
    width: 100%;
    font-size: 14px;
    border-bottom: 1px solid #EEE;
    &:focus {
      border-color: #0E5DFF;
    }
  }
  .error {
    border-color: #FF2C2C;
    &:focus {
      border-color: #FF2C2C;
    }
  }
  .error-tip {
    color: #FF2323;
    position: absolute;
    right: 0;
    bottom: -20px;
  }
}
</style>
