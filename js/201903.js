// 1.vue.js vue-router.js vuex
// 2.es6
// 3. webpack gulp区别
// 4.apply call bind 区别
// 5.js 手写promise()
// 6.module.exports 和 exports区别
// 7.如何创建一个对象,构造函数，工厂模式，原型模式，class
// 8. 缓存机制
// 9.跨域解决方式
// 10.解耦，去抖，深拷贝(Object.assign)
// 11.sass,less
// 12.flex
// 13.浏览器工作原理
// 14.vue生命周期钩子
// 15.fetch api
// 16.Object.assign
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source)
console.log(target);// { a: 1, b: 4, c: 5 }
console.log(returnedTarget); // { a: 1, b: 4, c: 5 }

/*****vue.js ******/
// 1.注册一个组件
Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
});
// 组件is和slot插槽
// vs Web组件规范，chrome54+,vue 为IE9+都支持

// vue实例的属性和方法，都有前缀 $。
// 2.生命周期过程
// new Vue()
// init: event & LifeCycle   
// === beforeCreate()
// init: injections & reactivity
// === created()
new Vue({
  el: '#app1',
  router,
  store,
  // render:h => h(App),
  template: '<App/>',
  components: {
      App
  }
})
if (el.option) {
  if (template.option) {
    console.log('compile template into render function')
  } else {
    console.log(`compile el's outerHTML as template`)
  }
} else {
  console.log(`when vm.$mounted(el) is called`)
}
// === beforeMount()
// create vm.$el and replace el with it
// ==== mounted()
// === beforeUpdate
// Virtual DOM re-render and patch
// === updated
// === beforeDestory
// === destroyed

//3.计算属性缓存 vs 方法 vs 监听属性  (有时可以用计算属性来代替监听，简洁,watch多了耗性能)
// 4. 多重值 <div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
// 5. 加key会重新渲染
{/* <template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input">
</template> */}
// 6.v-if vs v-show 比较
// （1）v-if 真正的条件渲染，它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。
// （2）v-if 也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。
// （3） v-show 不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。
// (4) 一般来说，v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好。

// 7.Vue 包含一组观察数组的变异方法，所以它们也将会触发视图更新,直接改变数组值，视图不变化，要$set触发 Array.prototype.splice
// 8.<input v-model.number="age" type="number"> 想自动将用户的输入值转为数值类型
// 9.自定义组件的v-model??
// 动态组件 <component v-bind:is="currentTabComponent"></component>

// currentTabComponent 已注册的组件的名字，或者一个组件的选项对象

// 10.通过插槽slot分发内容
// 11.mixin 混入 分发 Vue 组件中可复用功能的

var myMixi = {
  created: function () {
    this.hello();
  },
  methods: {
    hello() {
      console.log('hello from mixin!')
    }
  }
}
var Component = Vue.extend({
  mixins: [myMixi]
})
var component = new Component() // "hello from mixin!"
// 全局混入Vue.mixin({})

// 12.自定义指令
// 全局 v-focus
Vue.directive('focus', {
  inserted: function (el) { // 当被绑定的元素插入到DOM中 //被绑定元素插入父节点时调用
    el.focus(); // 聚焦元素
  },
  bind() { // 只调用一次,指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。

  },
  update() { // 所在组件的 VNode 更新时调用

  }
});
// 局部组件内指令
// directives: {
//   focus: {
//     inserted: function (el) {
//       el.focus();
//     }
//   }
// }
// 13.<transition
//   v-on:before-enter="beforeEnter"
//   v-on:enter="enter"
//   v-on:after-enter="afterEnter"
//   v-on:enter-cancelled="enterCancelled"

//   v-on:before-leave="beforeLeave"
//   v-on:leave="leave"
//   v-on:after-leave="afterLeave"
//   v-on:leave-cancelled="leaveCancelled"
// >
//   <!-- ... -->
// </transition>
// 14.渲染函数 & jsx

// https://vue-loader-v14.vuejs.org/zh-cn/features/scoped-css.html

// ES6 中的工厂模式
// https://www.jianshu.com/p/11918dd0f694
class User {
  constructor (opt) {
    this.name = opt.name;
    this.viewPage = opt.viewPage;
  }
  // 静态方法
  static getInstance (role) {
    switch (role) {
      case 'superAdmin': 
        return new User({name: '超级管理员', viewPage: ['首页', '通讯录', '发现页']});
        break;
      case 'admin':
        return new User({name: '管理员', viewPage: ['首页', '发现页', '应用类']});
        break;
      default: 
        throw new Error('参数错误')
    }
  }
}
let superAdmin = User.getInstance('superAdmin')
let admin = User.getInstance('admin');

// 应用
// 1.普通方法
import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import SuperAdmin from '../components/SuperAdmin.vue'
import NormalAdmin from '../components/NormalAdmin.vue'
import User from '../components/User.vue'
import NotFound404 from '../components/404.vue'

Vue.use(Router);

export default new Router({
  routes: [
    // 重定向到登录页面
    {
      path: '/',
      redirect: '/login'
    },
    // 登录页
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    // 超级管理员页面
    {
      path: '/super-admin',
      name: 'SuperAdmin',
      components: SuperAdmin
    },
    // 普通管理员页面
    {
      path: '/normal-admin',
      name: 'NormalAdmin',
      component: NormalAdmin
    },
    // 普通用户页面
    {
      path: '/user',
      name: 'User',
      component: User
    },
    // 404页面
    {
      path: '*',
      name: 'NotFound404',
      component: NotFound404
    }
  ]
});

// 2.改进方法
// 在登陆的时候根据权限使用vue-router提供的addRoutes方法给予用户相对应的路由权限
// router/index.js
import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'

Vue.use(Router);

export default new Router({
  routes: [
    // 重定向到登录页面
    {
      path: '/',
      redirect: '/login'
    },
    // 登录页
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
// router/routerFactory.js
import SuperAdmin from '../components/SuperAdmin.vue'
import NormalAdmin from '../components/NormalAdmin.vue'
import User from '../components/User.vue'
import NotFound404 from '../components/404.vue'

let AllRoute = [
  // 超级管理员页面
  {
    path: '/super-admin',
    name: 'SuperAdmin',
    components: SuperAdmin
  },
  // 普通管理员页面
  {
    path: '/normal-admin',
    name: 'NormalAdmin',
    component: NormalAdmin
  },
  // 普通用户页面
  {
    path: '/user',
    name: 'User',
    component: User
  },
  // 404页面
  {
    path: '*',
    name: 'NotFound404',
    component: NotFound404
  }
]

let routerFactory = (role) => {
  switch (role) {
    case 'superAdmin':
      return {
        name: 'SuperAdmin',
        route: AllRoute
      };
      break;
    case 'normalAdmin':
      return {
        name: 'NormalAdmin',
        route: AllRoute.splice(1)
      };
      break;
    case 'user':
      return {
        name: 'User',
        route: AllRoute.splice(2)
      };
      break;
    default: 
      throw new Error('参数错误')
  }
}

export { routerFactory }

// 在Login.vue，请求登陆接口后根据权限添加路由
// Login.vue
import { routerFactory } from '../router/routerFactory.js'
export default {
  // ...
  methods: {
    userLogin () {
      // 请求登录接口，获取用户权限，根据权限调用this.getRoute()方法
      // session存储用户权限，
      this.getRoute();
    },
    getRoute(role) {
      let routerObj = routerFactory(role);
      // 给vue-router 添加该权限所拥有的路由页面
      this.$router.addRoutes(routerObj.route);
      // 跳转到相应页面
      this.$router.push({name: routerObj.name});
    }
  }
}

// 注意：
// 在实际项目中，因为使用this.$router.addRoutes方法添加的路由刷新后不能保存，所以会导致路由无法访问。
// 通常的做法是本地加密保存用户信息，在刷新后获取本地权限并解密，根据权限重新添加路由。

// 区分 android 和ios
if (/(iPhone|iPad|iOS)/i.test(navigator.userAgent)) {

} else if (/(Android)/i.test(navigator.userAgent)) {
  
}

// 一、h5与android交互，android用的是WebViewJavascriptBridge
// android调用h5的方法，并传递消息：
bridgeJavascript () {
  let that = this;
  window.WebViewJavascriptBridge.callHandler('queHistory', // 与android一起定义的共同方法名
    {}, // 参数
    function (res) {
      res = JSON.parse(res);
      alert(res.token)
    }
  );
}
// h5传递消息给android:
if (type == 'android') {
  window.WebViewJavascriptBridge.send(data, // 返回的响应
    function (res) {
      alert(res)
    }  
  )
}
// 二、h5与ios交互，这里ios用的是window.webkit.messageHandlers
// ios调用h5页面方法，并传递消息
messageHandlers_IOSJavascript(userNum, tokensIos) {
  let that = this;
  userN = userNum;
  tokenA = tokenIos;
  that.loadData(userNum, tokenIos, '', '');
}
mounted() {
  window.messageHandlers_IOSJavascript = this.messageHandlers_IOSJavascript;
}
bridgeMessageDetail (tmp) { // 调用ios,and方法传参
  let dict = {
    'resultStatus': tmp.resultStatus,
    'resultMessage': tmp.resultMessage
  };
  window.webkit.messageHandlers.FirstJsObject2.postMessage(dict); // 需要在android内注册个方法名FirstJsObject2
}