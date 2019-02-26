// 1.vue插件的编写
// https://blog.csdn.net/qq20004604/article/details/56965703

// service.js
export default {
  install: function (Vue, options) {
    // 1.添加全局方法或属性
    Vue.myGlobalMethod = function () {
      // 逻辑
    };
    // 2.添加全局资源
    Vue.directive('my-directive', {
      bind (el, binding, vnode, oldVnode) {
        // 逻辑
      }
    });
    // 3.注入组件
    Vue.mixin({
      created: function () {
        // 逻辑
        if (this.NOTICE) {
          console.log('组件开始加载')
        }
      },
      methods: {
        test: function () {
          console.log('mixin test')
        }
      }
    });
    // 4.添加实例方法
    Vue.prototype.$myMethod = function (options) {
      // 逻辑...
    }
    // 过滤器
    Vue.filter('formatTime', (value) => {
      Date.prototype.Format() = function (fmt) {
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt))
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      }
      return new Date(value).Format("yyyy-MM-dd hh:mm:ss");
    });
    // 使用：{{num|formatTime}}
    Vue.prototype.$service = {
      //电话号码合法性检查
      telNumberCheck: function (tel) {
          var pattern = /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
          return pattern.test(tel)
      }
    }
  }
}

// main.js用法
import Vue from 'vue'
import App from './App.vue'
import service from './service.js'

Vue.use(service)

// 链接：
// https://www.cnblogs.com/onepixel/p/5218904.html
// https://blog.csdn.net/mooncom/article/details/53183154/
// https://www.itcnz.top/20180320/mynuxt.html
// https://cn.vuejs.org/v2/cookbook/avoiding-memory-leaks.html
// https://www.jb51.net/article/142537.htm
// https://www.vue-js.com/topic/5bcdc9a87385fcae2fd1830e
// https://www.cnblogs.com/woniubushinide/p/8024051.html
// https://segmentfault.com/a/1190000010034177
// https://cnodejs.org/topic/5be29f7c21d75b74609f4fbf
// https://www.cnblogs.com/acharless/p/70bf8cbd81054e45ea04ba294556a56d.html
// https://www.jianshu.com/p/327e38aec874
// https://segmentfault.com/a/1190000018017796?utm_source=tag-newest