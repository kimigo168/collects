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
// ORM 通过实例对象语法。“对象-关系映射（object/Relational Mappling）”
// 数据库的表(table) => 类（class）
// 记录(record,行数据) => 对象（object)
// 字段(field) => 对象的属性（attribute)
// ORM使用对象，封装了数据操作，可以不碰SQL语音，开发者只使用面向对象编程，与数据对象直接交互，不用关心底层数据库

// css技巧
// (1)外边距折叠，两个margin中保留较大的那一个
// (2)使用flex布局
// (3) 将图片作为背景，在图片是响应式的时候，
// background引入图片的一个缺点是页面的Web可访问性会受到轻微的影响，因为屏幕阅读器和搜索引擎无法正确地获取到图像，这个问题可以通过CSS object-fit属性解决
// (4)不要重复设置 font会从父级继承
// (5)使用transform属性来创建动画
// (6)text-transform转换字母为大写,适合英文环境 text-transform: uppercase;
// (7)对于大型项目使用预处理器,压缩CSS文件

// JWT(JSON WEB TOKEN)
// 跨域认证问题
// 一般流程,账号密码登录，服务器验证通过后，在session里面保存数据，服务器向用户返回一个session_id,写入用户cookie
// 用户每次请求，通过cookie将session_id传回服务器
// 服务器收到session_id,找到前期保存数据,得知用户身份

// 单机ok,如果是服务器集群，要求session共享,每台服务器都能读取session
// 举例来说，A 网站和 B 网站是同一家公司的关联服务。现在要求，用户只要在其中一个网站登录，再访问另一个网站就会自动登录，请问怎么实现？

// 一种解决方案是 session 数据持久化，写入数据库或别的持久层。各种服务收到请求后，都向持久层请求数据。这种方案的优点是架构清晰，缺点是工程量比较大。另外，持久层万一挂了，就会单点失败。

// 另一种方案是服务器索性不保存 session 数据了，所有数据都保存在客户端，每次请求都发回服务器。JWT 就是这种方案的一个代表。

// JWT原理：JWT 的原理是，服务器认证以后，生成一个 JSON 对象，发回给用户，以后，用户与服务端通信的时候，都要发回这个 JSON 对象。为了防止用户篡改数据，服务器在生成这个对象的时候，会加上签名。服务器就不保存任何 session 数据了，也就是说，服务器变成无状态了，从而比较容易实现扩展。
// JWT三部分：Header(头部), Playload(负载), Signature(签名)  => Header.Payload.Signature
// (1) Header是一个json对象
// {
//   "alg": "HS256", // 签名算法
//   "typ": "JWT" // 令牌类型
// }
// 最后，将上面的 JSON 对象使用 Base64URL 算法（详见后文）转成字符串。
// (2)Payload 部分也是一个 JSON 对象，用来存放实际需要传递的数据。JWT 规定了7个官方字段，供选用。
// iss (issuer)：签发人
// exp (expiration time)：过期时间
// sub (subject)：主题
// aud (audience)：受众
// nbf (Not Before)：生效时间
// iat (Issued At)：签发时间
// jti (JWT ID)：编号
// 这个 JSON 对象也要使用 Base64URL 算法转成字符串。
// (3)Signature 部分是对前两部分的签名，防止数据篡改。
// 首先，需要指定一个密钥（secret）。这个密钥只有服务器才知道，不能泄露给用户。然后，使用 Header 里面指定的签名算法（默认是 HMAC SHA256），按照下面的公式产生签名。
// HMACSHA256(
//   base64UrlEncode(header) + "." +
//   base64UrlEncode(payload),
//   secret)
// Base64URL
// 这个算法跟 Base64 算法基本类似，但有一些小的不同。
// JWT 作为一个令牌（token），有些场合可能会放到 URL（比如 api.example.com/?token=xxx）。Base64 有三个字符+、/和=，在 URL 里面有特殊含义，所以要被替换掉：=被省略、+替换成-，/替换成_ 。这就是 Base64URL 算法。

// JWT使用方式：
// 客户端收到服务器返回的 JWT，可以储存在 Cookie 里面，也可以储存在 localStorage。

// 此后，客户端每次与服务器通信，都要带上这个 JWT。你可以把它放在 Cookie 里面自动发送，但是这样不能跨域，所以更好的做法是放在 HTTP 请求的头信息Authorization字段里面。Authorization: Bearer <token>
// 另一种做法是，跨域的时候，JWT 就放在 POST 请求的数据体里面。
// JWT 的几个特点
// （1）JWT 默认是不加密，但也是可以加密的。生成原始 Token 以后，可以用密钥再加密一次。

// （2）JWT 不加密的情况下，不能将秘密数据写入 JWT。

// （3）JWT 不仅可以用于认证，也可以用于交换信息。有效使用 JWT，可以降低服务器查询数据库的次数。

// （4）JWT 的最大缺点是，由于服务器不保存 session 状态，因此无法在使用过程中废止某个 token，或者更改 token 的权限。也就是说，一旦 JWT 签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑。

// （5）JWT 本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT 的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证。

// （6）为了减少盗用，JWT 不应该使用 HTTP 协议明码传输，要使用 HTTPS 协议传输。