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

// 组件生命周期
// 1.beforeCreate 
// 在实例初始化之后，数据观测(data observer) 和 event/watcher 事件配置之前被调用。
// 此时组件的选项还未挂载，因此无法访问methods，data,computed上的方法或数据
// 2.created
// 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算， watch/event 事件回调。
// 然而，挂载阶段还没开始，$el 属性目前不可见。

// 通常我们可以在这里对实例进行预处理。
// 也有一些童鞋喜欢在这里发ajax请求，值得注意的是，这个周期中是没有什么方法来对实例化过程进行拦截的。
// 因此假如有某些数据必须获取才允许进入页面的话，并不适合在这个页面发请求。
// 建议在组件路由勾子beforeRouteEnter中来完成。
// 3.beforeMonut
// 在挂载开始之前被调用：
// 4.mounted
// el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$el 也在文档内。
// beforeRouteEnter的next的勾子比mounted触发还要靠后
// 指令的生效在mounted周期之前
// 5.beforeUpdate
// 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。你可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
// 6.updated
// 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
// 7.beforeDestroy
// 8.destroyed

// 全局路由钩子
// 作用于所有路由切换，一般在main.js里面定义
// router.beforeEach
router.beforeEach((to, from, next) => {
  console.log('路由全局勾子：beforeEach -- 有next方法')
  next()
})
// 一般在这个勾子的回调中，对路由进行拦截。
// 比如，未登录的用户，直接进入了需要登录才可见的页面，那么可以用next(false)来拦截，使其跳回原页面。

// next的四种用法
// 1.next() 跳入下一个页面
// 2.next('/path') 改变路由的跳转方向，使其跳到另一个路由
// 3.next(false)  返回原来的页面
// 4.next((vm)=>{})  仅在beforeRouteEnter中可用，vm是组件实例。

// router.afterEach
router.afterEach((to, from) => {
  console.log('路由全局勾子：afterEach --- 没有next方法')
})
// 在所有路由跳转结束的时候调用，和beforeEach是类似的，但是它没有next方法

// 组件路由勾子
// beforeRouteEnter
// 这个是一个很不同的勾子。因为beforeRouterEnter在组件创建之前调用，所以它无法直接用this来访问组件实例。
// 为了弥补这一点，vue-router开发人员，给他的next方法加了特技，可以传一个回调，回调的第一个参数即是组件实例。
// 一般我们可以利用这点，对实例上的数据进行修改，调用实例上的方法。

// 我们可以在这个方法去请求数据，在数据获取到之后，再调用next就能保证你进页面的时候，数据已经获取到了。没错，这里next有阻塞的效果。你没调用的话，就会一直卡在那

// next(vm=>{console.log('next')  })
// 这个里面的代码是很晚执行的，在组件mounted周期之后。没错，这是一个坑。你要注意。
// beforeRouteEnter的代码时很早执行的，在组件beforeCreate之前；
// 但是next里面回调的执行，很晚，在mounted之后，可以说是目前我找到的，离dom渲染最近的一个周期。

// beforeRouteLeave
// 在离开路由时调用。可以用this来访问组件实例。但是next中不能传回调。

// beforeRouteUpdate
// 如果一个在两个子路由之间跳转，是不触发beforeRouteLeave的。这会导致某些重置操作，没地方触发。在之前，我们都是用watch $route来hack的。但是通过这个勾子，我们有了更好的方式。

// Vue.nextTick、vm.$nextTick
// created () {
//   this.$nextTick(() => {
//     console.log('nextTick')  //回调里的函数一直到真实的dom渲染结束后，才执行
//   })
//   console.log('组件：created')
// }

// 场景：
// 你用ref获得一个输入框，用v-model绑定。
// 在某个方法里改变绑定的值，在这个方法里用ref去获取dom并取值，你会发现dom的值并没有改变。
// 因为此时vue的方法，还没去触发dom的改变。
// 因此你可以把获取dom值的操作放在vm.$nextTick的回调里，就可以了。

// 指令的绑定在组件mounted之前，组件的beforeMount之后
// 不得不提的, beforeRouteEnter的next勾子
// beforeRouteEnter的执行顺序是如此靠前，而其中next的回调勾子的函数，执行则非常靠后，在mounted之后！！
// 我们通常是在beforeRouteEnter中加载一些首屏用数据，待数据收到后，再调用next勾子，通过回调的参数vm将数据绑定到实例上。