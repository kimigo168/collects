// Vue-Router原理
// 路由就是SPA（单页应用）的路径管理器，路由用于设定访问路径，并将路径和组件映射起来
// 传统的页面应用，是用一些超链接来实现页面切换和跳转的。在vue-router单页面应用中，则是路径之间的切换，也就是组件的切换。路由模块的本质 就是建立起url和页面之间的映射关系

// SPA
// 单一页面应用程序，只有一个完整的页面；它在加载页面时，不会加载整个页面，而是只更新某个指定的容器中内容。
// 1.hash
// hash（#）是URL 的锚点，代表的是网页中的一个位置，单单改变#后的部分，浏览器只会滚动到相应位置，不会重新加载网页，也就是说hash 出现在 URL 中，但不会被包含在 http 请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面；同时每一次改变#后的部分，都会在浏览器的访问历史中增加一个记录，使用”后退”按钮，就可以回到上一个位置；所以说Hash模式通过锚点值的改变，根据不同的值，渲染指定DOM位置的不同数据。hash 模式的原理是 onhashchange 事件(监测hash值变化)，可以在 window 对象上监听这个事件

// 2.history模式
// 利用h5 history api pushState()和replaceState()
// 这两个方法应用于浏览器记录栈，在当前已有的 back、forward、go 基础之上，它们提供了对历史记录修改的功能。只是当它们执行修改时，虽然改变了当前的 URL ，但浏览器不会立即向后端发送请求。
// 要求后台配置，避免匹配不到的路由报404

export default routes = [
  {path: '/', name: 'homeLink', component: Home},
  {path: '/register', name: 'registerLink', component: Register},
  {path: '*', redirect: '/'}
]

// 为什么data要写成函数，不允许写成对象
// 1.data是Vue实例上的一个属性 2.对象是对于内存地址的引用 3.函数有自己的作用域
// JS 的数据类型分为基本类型和引用类型，基本类型存储在栈内存中，引用类型存储在堆内存中，并且引用类型指向的是栈内存中的堆区地址

// 对象是对栈内存的地址的引用，所以不同的对象的地址是不同的
// Vue 里面data属性之所以不能写成对象的格式，是因为对象是对地址的引用，而不是独立存在的。如果一个.vue 文件有多个子组件共同接收一个变量的话，改变其中一个子组件内此变量的值，会影响其他组件的这个变量的值。如果写成函数的话，那么他们有一个作用域的概念在里面，相互隔阂，不受影响。

// vue数据劫持
// setter,getter,数据观测

// Vue实例中数组改变 `length` 或下标直接赋值什么不能更新视图？

// 只要是因为 Vue 提取了数组的可以改变原数组的原生方法，进行了再加工。只有经过 Vue 处理过的方法才有更新视图的能力。

// vue 中this.$router.go(-1)，想带参数，返回上一页的tab,vuex,activated()钩子，eventBus

// input file change只触发一下问题，document.getElementById().value = '';//清空

// 如何理解BFC?
// 定义：块格式化上下文(Block Formatting Context, BFC)是web界面可视化css渲染的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其它元素交互的区域
// 特性：
// 同一个BFC下外边距会发生重叠。这不是 CSS 的 bug，我们可以理解为一种规范，如果想要避免外边距的重叠，可以将其放在不同的 BFC 容器中
// BFC可以包含浮动元素（清除浮动）
// BFC可以阻止元素被浮动元素覆盖

// 这里有一个经典的css布局试题(两列自适应布局)就是应用的BFC特性

//   <div style="float:left; width:200px; background:blue">left</div>
//   <div style="height:100%; background: red">right</div>


// 触发BFC
// 下列方式会触发BFC(摘抄自MDN)

// 根元素或包含根元素的元素
// 浮动元素（元素的 float 不是 none）
// 绝对定位元素（元素的 position 为 absolute 或 fixed）
// 行内块元素（元素的 display 为 inline-block）
// 表格单元格（元素的 display为 table-cell，HTML表格单元格默认为该值）
// 表格标题（元素的 display 为 table-caption，HTML表格标题默认为该值）
// 匿名表格单元格元素（元素的 display为 table、table-row、 table-row-group、table-header-group、table-footer-group（分别是HTML table、row、tbody、thead、tfoot的默认属性）或 inline-table）
// overflow 值不为 visible 的块元素
// display 值为 flow-root 的元素
// contain 值为 layout、content或 strict 的元素
// 弹性元素（display为 flex 或 inline-flex元素的直接子元素）
// 网格元素（display为 grid 或 inline-grid 元素的直接子元素）
// 多列容器（元素的 column-count 或 column-width 不为 auto，包括 column-count 为 1）
// column-span 为 all 的元素始终会创建一个新的BFC，即使该元素没有包裹在一个多列容器中

// vue 路由懒加载:
// 在一开始就下载完所有路由对应的组件文件，这明显是不合适的.把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。
// router.js 原来的静态引用
import showBlog from '@/components/showBlogs'
// routes: [path: 'Blogs', name: 'showBlogs', component: showBlog]

// 改为：以函数的形式动态引入，这样就可以把各自的路由文件分别打包，只有在解析给定的路由时，才会下载路由组件
// routes: [path: 'Blogs', name: 'showBlogs', component: () => import ('./components/showBlog.vue')]

// vuecli3默认开启prefetch(预先加载模块),提前获取用户未来可能会访问的内容
// vue.config.js
module.exports = {
  chainWebpack: config => {
    // 移除prefetch 插件
    config.plugins.delete('prefetch')

    // 或者
    // 修改它的选项：
    config.plugin('prefetch').tap(options => {
      options[0].fileBlackList = options[0].fileBlackList || [];
      options[0].fileBlackList.push(/myasyncRoute(.)+?\.js$/)
      return options
    })
  }
}
// 当prefetch插件被禁用，通过webpack内联注释手动选定要提前获取的代码区块
import(/* webpackPrefetch:true */ './someAsyncComponent.vue')

// element-ui 按需加载,引用
// 拆完包后gzip压缩
// cnpm i compression-webpack-plugin -d
const CompressionPlugin = require('compression-webpack-plugin')
configureWebpack: (config) => {
  if (process.env.NODE_ENV === 'production') {
    // 为生产环境修改配置...
    config.mode = 'production'
    return {
      plugins: [new CompressionPlugin({
        test: /\.js$|\.html$|\.css/,
        threshold: 10240, // 对超过10k的数据进行压缩
        deleteOriginalAssets: false // 是否删除原文件
      })]
    }
  }
}

// 在服务器我们也要做相应的配置
// 如果发送请求的浏览器支持 gzip，就发送给它 gzip格式的文件
// 我的服务器是用 express框架搭建的
// 只要安装一下 compression就能使用
const compression = require('compression')
app.use(compression)

// css是否要拆分，关闭