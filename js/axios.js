import axios from 'axios'
const qs = require('qs')
const api = {
  async get (url, data) {
    try {
      let res = await axios.get(url, {params: data})
      res = res.data
      return Promise((resolve, reject) => {
        if (res.code == 0) {
          resolve(res)
        } else {
          reject(res)
        }
      })
    } catch (err) {
      console.log('err', err);
      alert('服务器出错')
    }
  },
  async post (url, data) {
    try {
      let res = await axios.post(url, qs.stringify(data))
      res = res.data
      return new Promise((resolve, reject) => {
        if (res.code == 0) {
          resolve(res)
        } else {
          reject(res)
        }
      })
    } catch (err) {
      alert('服务器出错')
    }
  }
}
export { api }

// 调用
import { api } from 'common/js/api'

export default {
  data () {
    return {
      list: []
    }
  },
  created () {
    this.getList();
  },
  methods: {
    async getList () {
      let { data } = await api.get('/feering/test/list')
      console.log('data')
      this.list = data;
    }
  }
}
