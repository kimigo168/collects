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
// https://www.cnblogs.com/onepixel/p/5218904.html  正则校验
// https://blog.csdn.net/mooncom/article/details/53183154/  postMessage
// https://www.itcnz.top/20180320/mynuxt.html
// https://cn.vuejs.org/v2/cookbook/avoiding-memory-leaks.html //内存泄漏
// https://www.jb51.net/article/142537.htm  // 内存泄漏
// https://www.vue-js.com/topic/5bcdc9a87385fcae2fd1830e
// https://www.cnblogs.com/woniubushinide/p/8024051.html // 内存泄漏
// https://segmentfault.com/a/1190000010034177 // h5移动端上传图片
// https://cnodejs.org/topic/5be29f7c21d75b74609f4fbf // 申请https证书
// https://www.cnblogs.com/acharless/p/70bf8cbd81054e45ea04ba294556a56d.html // 部署小程序到nodejs服务器
// https://www.jianshu.com/p/327e38aec874 // Promise实现
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

// 通过JSON.parse(JSON.stringify(...)) 得到深拷贝数据

// 不应该用箭头函数定义method函数，箭头函数绑定了父级作用域的上下文，this不会指定期望的Vue实例

// watch: handler: function (val, oldVal){},deep: true, immediate: true // 回调会在侦听开始之后，立即调用

// DOM选项：el / template / render / renderError

this.$watch('a', callback, {
  immediate: true,
  deep: true // 监听数组变动，不要这么做
})

// v-slot v2.6.0 替换废弃的 slot、slot-scope 
//<component :is=""></componet> 动态组件

// vue scope 样式穿透
// 通过该属性，可以使得组件之间的样式不互相污染。
// 转义后data-v-234
// (1)外层穿透  .wrapper >>> .swiper-pagination-bullet-active
// (2) <style scoped></style> + <style>.wrapper {.swiper-pagination-bullet-active}</style>


// Vue如何强制刷新组件
// this.$forceUpdate(),或//模版上绑定key，改变key值

// 对vue的错误处理的了解？
// vue给组件绑定自定义事件无效怎么解决？组件外部加修饰符.native,组件内部声明$emit('自定义事件')
// vue的属性名称与method的方法名称一样时会发生什么问题？
// 报错 "Method 'xxx' has already been defined as a data property"

// 键名优先级：props > data > methods

// vue变量名如果以_、$开头的属性会发生什么问题？怎么访问到它们的值？
// 以 _ 或 $ 开头**的属性不会被 Vue 实例代理，因为可能和 Vue 内置的属性、API 方法冲突。可以使用例如 **vm.$data._property

// vue使用v-for遍历对象(这里是对象，不是数组)时，是按什么顺序遍历的？如何保证顺序？
// 1、会先判断是否有iterator接口，如果有循环执行next()方法
// 2、没有iterator的情况下，会调用Object.keys()方法，在不同浏览器中，JS引擎不能保证输出顺序一致
// 3、保证对象的输出顺序可以把对象放在数组中，作为数组的元素

// vue如果想扩展某个现有的组件时，怎么做呢？
// 不对原组件进行更改的：

// 使用Vue.extend直接扩展
// 使用Vue.mixin全局混入
// HOC封装，可以加slot扩展

 // 说下$attrs和$listeners的使用场景 ?
//  组件传值的时候会用到 爷爷在父亲组件传递值，父亲组件会通过$attrs获取到不在父亲props里面的所有属性，父亲组件通过在孙子组件上绑定$attrs 和 $listeners 使孙组件获取爷爷传递的值并且可以调用在爷爷那里定义的方法

// v-once的使用场景有哪些？
// 表单提交。可防止用户在请求未及时响应时，多次提交~

// EventBus注册在全局上时，路由切换时会重复触发事件，如何解决呢？ 
// 在组件内的beforeRouteLeave中移除事件监听

// 怎么访问到子组件的实例或者子元素？
// this.$children/this.$refs.xxx
// 在子组件中怎么访问到父组件的实例？this.$parent
// 在组件中怎么访问到根实例？ 

// 跳转新页面
// const { href } = this.$router.resolve({ path: '/question' })
//       if (this.$route.name === 'userCenter') {
//         window.open(href, '_blank')
//       }

// vue组件里写的原生addEventListeners监听事件，要手动去销毁吗？
// 肯定要，一方面是绑定多次，另一方面是函数没释放会内存溢出

// vue组件里的定时器要怎么销毁？
const timer = setInterval(() =>{
  // 某些定时器操作
  }, 500);
  // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
  this.$once('hook:beforeDestroy', () => {
  clearInterval(timer);
})

// 使用vue渲染大量数据时应该怎么优化？
// Object.freeze(对于前端纯大数据展示，不需要做修改其中字段等处理的，使用Object.freeze方法来包裹变量，vue内部不再去监听数据的变化提高性能)
// 1.如果需要响应式，考虑使用虚表（只渲染要显示的数据）；
// 2.如果不考虑响应式，变量在beforeCreated或created中声明（Object.freeze会导致列表无法增加数据）

// vue的is这个特性你有用过吗？
// 你了解什么是函数式组件吗？需要提供一个render方法， 接受一个参数（createElement函数）， 方法内根据业务逻辑，通过createElement创建vnodes，最后return vnodes

// 组件中写name选项有什么作用?
// 项目使用keep-alive时，可搭配组件name进行缓存过滤
// DOM做递归组件时需要调用自身name
// vue-devtools调试工具里显示的组见名称是由vue中组件name决定的

// 说说你对provide和inject的理解?
// 通过在父组件中inject一些数据然后再所有子组件中都可以通过provide获取使用该参数,

// 主要是为了解决一些循环组件比如tree, menu, list等, 传参困难, 并且难以管理的问题, 主要用于组件封装, 常见于一些ui组件库

// 怎么缓存当前打开的路由组件，缓存后想更新当前组件怎么办呢？
// 可以在路由meta中加入参数, 对打开的路由进行keep-alive的判断, 通过钩子active等

// 说说你对vue组件的设计原则的理解 ?
// 第一: 容错处理, 这个要做好, 极端场景要考虑到, 不能我传错了一个参数你就原地爆炸
// 第二: 缺省值(默认值)要有, 一般把应用较多的设为缺省值
// 第三: 颗粒化, 把组件拆分出来.
// 第四: 一切皆可配置, 如有必要, 组件里面使用中文标点符号, 还是英文的标点符号, 都要考虑到
// 第五: 场景化, 如一个dialog弹出, 还需要根据不同的状态封装成success, waring, 等
// 第六: 有详细的文档/注释和变更历史, 能查到来龙去脉, 新版本加了什么功能是因为什么
// 第七: 组件名称, 参数prop, emit, 名称设计要通俗易懂, 最好能做到代码即注释这种程度
// 第八: 可拓展性, 前期可能不需要这个功能, 但是后期可能会用上, 要预留什么, 要注意什么, 心里要有逼数
// 第九: 规范化,我这个input组件, 叫on-change, 我另外一个select组件叫change, 信不信老子捶死你
// 第十: 分阶段: 不是什么都要一期开发完成看具体业务, 如果一个select, 我只是个简单的select功能, 什么multi老子这个版本压根不需要, 别TM瞎折腾! 给自己加戏

// 你了解vue的diff算法吗？
// vue如何优化首页的加载速度？
// 异步路由和异步加载
// 还有分屏加载, 按需加载, 延时加载图片等, cdn, 域名才分

// 不要什么东西动不动就打包到vendor中, 恶心

// Vue中异步路由，异步组件，懒加载：
// 异步方法：(1)依赖require
const Editor = resolve => require(['@/views/Editor'], resolve)
// (2) webpack2 + es6
const Editor = () => import('@/views/Editor')

// 全局异步组件：
// 可以同时require组件的css，只需要最后resolve传参的是组件
// Vue.component('swiper', (resolve) => require(['vue-awesome-swiper', 'swiper/dist/css/swiper.css'], ({swiper}) => resolve(swiper)))
// 单个组件内的异步组件：
// export default {
//   name: 'editor',
//   components: {
//     appBox: resolve => require(['@/components/layout'], resolve)
//   },
//   ...
// }

// 4、懒加载第三方类库
// 项目中会用到一些第三方类库，如果类库比较大，而且可以不用第一时间处理，则可以考虑把它懒加载，来加速页面的响应速度
require(['lrz'], (lrz) => {
  lrz(fileInfo, {fieldName: 'imgTp', width: 960, quality: 0.6})
    .then((rst) => {
    })
    .catch((err) => {
      console.log(err);
    })
})
// 路由懒加载异步组件配置：
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

function loadView (view) {
  return () => import('/webpackChunkName: "view-[request]" *')
}
// 缓存后想更新当前组件
// ajax,fetch,axios三者有什么区别

// vue监听数组变化的方法有哪些？vue重写了数组变化的方法
// 你知道nextTick的原理吗？
// 说说你对proxy的理解?
// vue的数据劫持有两个缺点:
// 1、无法监听通过索引修改数组的值的变化
// 2、无法监听object也就是对象的值的变化
// 所以vue2.x中才会有$set属性的存在

// proxy是es6中推出的新api，可以弥补以上两个缺点，所以vue3.x版本用proxy替换object.defineproperty

// 自定义组件的v-model
// vue父子组件双向绑定的方法有哪些？
// (1) v-model, 父子组件通讯，使用.sync

// 如何解决vue打包vendor过大的问题？
// (1)在webpack.base.conf.js新增externals配置，表示不需要打包的文件，然后在index.html中通过CDN引入
// externals: {
//   "vue": "Vue",
//   "vue-router": "VueRouter",
//   "vuex": "Vuex",
//   "element-ui": "ELEMENT",
//   "BMap": "BMap"
// }
// (2)使用路由懒加载 

// vue高阶组件
// 单页应用首屏加载过慢优化：
// ①使用路由懒加载 ②开启Gzip压缩 ③使用webpack的externals属性把不需要的库文件分离出去，减少打包后文件的大小 ④使用vue的服务端渲染（SSR）

// vue 生命周期的作用：准确的控制数据流和其对dom的影响

// Vue mixin
// 删除数组用delete和Vue.delete有什么区别？
// delete：只是被删除数组成员变为 empty / undefined，其他元素键值不变
// Vue.delete：直接删了数组成员，并改变了数组的键值（对象是响应式的，确保删除能触发更新视图，这个方法主要用于避开 Vue 不能检测到属性被删除的限制）

// v-for 和 v-if 优先级
// v-for优先级高于v-if，故如果需要两个都存在，v-if尽量在v-for的父级被包裹，避免增加无用的渲染开销。
// 组件之间通信有哪些？
// 父子1/2/3  兄弟4/5 跨级 4/5/6/7
// 1.props  2.$emit/$on  3.($parents/$children) / $refs
// 4.vuex   5.Bus  6.(provide/inject)  7.(attrs/ $listeners)

// 什么是双向绑定？原理？
// 通过Observer 把数据劫持(Object.defineProperty()) 、加入到订阅器(Dep) 订阅器收集订阅者(Watcher )、视图通过编译(Compile)、解析指令(Directive)等一些列操作收集给订阅者 、最后通过触发数据变化update 通知所有订阅者完成数据驱动

// vue 和 react区别？
// display: -webkit-box;
// -webkit-box-orient: vertical;
// -webkit-line-clamp: 2;
// overflow: hidden;

// vue-router如何配置404页面 path: '*' 放到最后

// vue-router路由有几种模式？说说他们的区别
// hash: 使用变更hash不会刷新页面的特性, 来变更路由, 做到单页面无刷新
// hash表示的是地址栏URL中#符号(也称作为锚点), hash虽然会出现在URL中, 但是不会被包含在Http请求中, 因此hash值改变不会重新加载页面.
// 由于hash值变化不会引起浏览器向服务器发出请求, 而且hash改变会触发hashchange事件, 浏览器的进后退也能对其进行控制, 所以在HTML5之前, 基本都是使用hash来实现前端路由.

// history: 使用html5的history方法, 不支持老旧浏览器, 但是如果要部署到服务器的化, 需要在ng上进行相应的正向代理跳转, 否则拷贝的链接会打不开
// 利用了HTML5新增的pushState()和replaceState()两个api, 通过这两个api完成URL跳转不会重新加载页面
// 同时history模式解决了hash模式存在的问题. hash的传参是基于URL的, 如果要传递复杂的数据, 会有体积限制, 而history模式不仅可以在URL里传参, 也可以将数据存放到一个特定的对象中

// 导航守卫：1全局，2组件内 3.单独路由

// vue-router源码
// 切换到新路由，页面要滚动到顶部或保持原先滚动位置
// 在new Router()的时候，配置
// scrollBehavior(to, from, savedPosition) {
//   return { x: 0, y: 0 }
//   }

// $route.query 和 $route.params区别
// active-class 是vue-router模块的router-link组件中的属性，用来做选中样式的切换；首页

// vuex使用actions时不支持多参数传递怎么办? Object