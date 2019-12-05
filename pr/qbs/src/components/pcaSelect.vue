<template>
  <el-cascader v-model="value" :options="options" separator = '-' @change="handleChange"></el-cascader>
</template>
<script>
import distracts from '../assets/districts'
export default {
  name: 'pcaSelect',
  props: ['area'],
  data () {
    return {
      value: '',
      options: []
    }
  },
  watch: {
    area: {
      handler (val) {
        if (val) {
          this.value = val.split('-')
        }
      },
      immediate: true
    }
  },
  methods: {
    handleChange (value) {
      let select = value.join('-')
      this.$emit('selectBack', select)
    },
    dealData () {
      let options = []
      let provinces = distracts['100000']
      for (let provinceKey in provinces) {
        let pro = {}
        pro['value'] = provinces[provinceKey]
        pro['label'] = provinces[provinceKey]
        pro['children'] = []
        for (let cityKey in distracts[provinceKey]) {
          let city = {}
          city['value'] = distracts[provinceKey][cityKey]
          city['label'] = distracts[provinceKey][cityKey]
          city['children'] = []
          for (let areaKey in distracts[cityKey]) {
            let area = {}
            area['value'] = distracts[cityKey][areaKey]
            area['label'] = distracts[cityKey][areaKey]
            city['children'].push(area)
          }
          pro['children'].push(city)
        }
        options.push(pro)
      }
      this.options = options
    }
  },
  created () {
    // this.value = this.area.split('-')
    this.dealData()
  }
}
</script>
<style lang="scss" scoped>

</style>
