/**
 * 公共方法、变量
 */
import Vue from 'vue'
import { Message } from 'element-ui'
import global from './global'
Vue.component(Message.name, Message)
let MyPlugin = {}
MyPlugin.install = (Vue, option) => {
  /**
   * 数组去重
   */
  Vue.prototype.$uniqueArr = (arr, key) => {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] === arr[j] || arr[i][key] === arr[j][key]) {
          arr.splice(j, 1)
          j--
        }
      }
    }
    return arr
  }

  /**
   * 绑定全局变量
   */
  Vue.prototype.$global = global

  /**
   * 消息提示
   */
  Vue.prototype.$message = Message

  /**
   * 错误处理
   */
  Vue.prototype.$errorPage = (res) => {
    if (res.code === '0') {
      return false
    } else {
      Message({ type: 'error', message: res.msg, showClose: true })
      return true
    }
  }
  /* eslint-disable */
  // 时间转换
  Date.prototype.format = function (formatStr) {
    var date = {
      year: this.getFullYear(),
      month: this.getMonth() + 1,
      date: this.getDate(),
      day: this.getDay(),
      hours: this.getHours(),
      minutes: this.getMinutes(),
      seconds: this.getSeconds(),
      time: this.getHours() >= 12 ? ['am', '\u4e0a\u5348'] : ['pm', '\u4e0b\u5348']
    }
    var reg = {
      year: /Y+/,
      date: /D+/,
      month: /M+/,
      day: /W/,
      hours: /h+/i,
      minutes: /m+/,
      seconds: /s+/,
      time: /t/i
    }
    var dateList = ['\u65e5', '\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d']
    var k; var _p
    for (k in reg) {
      _p = reg[k]
      formatStr = formatStr.replace(_p, function (segment, index, originStr) {
        var l = segment.length
        var value = date[k]
        var str
        switch (k) {
          case 'day':
            str = dateList[value]
            break
          case 'hours':
            str = (segment.toLowerCase() === segment ? value % 12 : value).toString()
            break
          case 'time':
            str = segment.toLowerCase() === segment ? value[0] : value[1]
            break
        }
        if (k !== 'day' && k !== 'time') {
          if (l === 1) {
            str = value
          } else {
            str = ('000' + value).slice(-l)
          }
        }
        return str
      })
    }
    return formatStr
  }

  // 获取url参数,并转换成对象
  Vue.prototype.$getSearchPamara = function () {
    var str = location.search.slice(1)
    var res = {}
    if (!str) {
      return res
    }
    str.split('&').forEach(function (v, k, arr) {
      var param = v.split('=')
      res[param[0]] = param[1]
    })
    return res
  }
  // 随机生成32位字符串
  Vue.prototype.$generateUUID = function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxxyxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  // PV,UV数据统计
  Vue.prototype.$updateStcLog = function (param) {
    this.$axios.post(this.$global.API.logCollect,
      this.$qs.stringify({
        code: param.code, // 1:pv日志，2：uv日志，3：登录日志
        uid: param.code == 1 ? '' : param.uid, // 唯一标识
        platform: 1, // 1:pc, 2:手机h5
        from: param.from
      })  
    ).then((res) => {
      // console.log('res', res)
    })
  }

  // 获取当前页面名称
  Vue.prototype.$getCurPageName = function () {
    let route = this.$route
    let pageName = ''
    if (route.path === '/') {
      pageName = '首页'
    } else if (route.path === '/hots') {
      pageName = '热点写作'
    } else if (route.path === '/outline') {
      pageName = '提纲写作'
    } else {
      pageName = route.path
    }
    return pageName
  }
}

export default MyPlugin
