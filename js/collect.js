/****数组的操作方法****/
// (1)扁平化的n维数组
[1, [2, 3]].flat(2); // [1,2,3]
[1, [2, 3], [4,5]].flat(3); // 
// (2)去重
Array.from(new Set(1,2,3,4,4))
// [...new Set([1,2,3,4,4])]
// 活着for循环
// (3)排序
// 冒泡排序
// array.sort((a, b) => b -a);
//(4)求最大值
Math.max(...[1,2,3,4]) // 4
Math.max.apply(this, [1, 2, 3, 4]);
[1,2,3,4].reduce((prev, cur, curIndex, arr) => {
  return Math.max(prev, cur);
});
//(5)求和
[1, 2,3,4].reduce((prev, cur) => {
  return prev+cur;
}, 0);
// 或者 for循环相加
// (6)数组合并
[1, 2, 3, 4].concat([5,6])
[...[1, 22], ... [4, 5]]
[1,2,3,4].push.apply([1,2,3,4],[5,6]);
// (7) 判断是否包含值
[1,2,3].includes(4); //false
[1,2,3,4].indexOf(3); // -1
[1,2,3].find(item => item ==3); // 如果无，返回undefined
// 比较low some()
// (8)类数组转化
Array.prototype.slice.call(arguments);
Array.prototype.slice.apply(arguments);
Array.from(arguments);
[...arguments]; // 将类数组扩展为字符串，再定义为数组
// (9)每一项设值
[1,2,3].fill(false)
// (10)对象和数组转化
Object.keys({name:'张三',age: 14}) // ['name','age']
Object.values();
// (11) splice(index,howmany) 方法向/从数组中添加/删除项目，然后返回被删除的项目(新数组)。

// (12) slice(start,end) 方法可从已有的数组中返回选定的元素。该方法并不会修改数组，而是返回一个子数组
// (13) join()把数组中所有元素放入一个字符串

// （14） split(',') 把字符串分割城数组
//（15） substring(start,end) vs substring(index,howmany)

// ES10 ...
// Proxy对象是在ES6中加入的用来自定义对象的各种内建操作，改写js引擎行为的默认操作的包装器。
const proxy = new Proxy(data, {
  get (target, key, receiver) {
    try {
      console.log("read data's property：", key)
      if (!(key in target)) {
        throw new Error("属性不存在哦")
      }
      return Reflect.get(target, key, receiver)
    } catch (error) {
      console.error(error)
    }
  },
  set (target, key, value, receiver) {
    try {
      console.log("set data's property", key);
      return Reflect.set(target, key, value, receiver)
    } catch (e) {
      console.log(e)
    }
  }
});

// 块级元素的水平居中
//(1) margin: 0 auto;
//(2) absolute + transform
//(3) display:flex;justify-content:center;
// 多块级元素水平居中：
// (1)display:flex;justify-content:center;
// (2).container{text-align:center;}.inline-block{display:inline-block;}
// 单行内联垂直居中
// height:200px;line-height:200px;
// 多行内联垂直居中
//(1)display:flex;flex-direction:column;justify-content:center;
//(2)table布局，.parent{display:table;}.child{display:table-cell;vertical-align:middle;}
// 块级元素垂直居中
//(1) absolute + margin负边距（已知高度）
//(2) absolute + transform （未知高度） 
//(3) .parent{display:flex;align-items:center;}
//(4) .parent{display:table-cell;vertical-align:middle;}

// 水平垂直居中：
// (1)已知宽高 absolute + margin
// (2)无需知道宽高 absolute + left,top,right,bottom:0;margin: auto;
// (3) absolute + transform
// (4) display:flex;justify-content:center;align-items:center;
// (5) 父级为flex或grid布局，.container{height:100vh;display:grid;}.center{margin:auto;}

// 输入URL到页面展示到底发生了什么？
// 1.输入网址

// 2.浏览器查找域名的IP地址
// a.浏览器先查找本地硬盘的host文件，看看有没有域名对应规则
// b.如果本地没有，浏览器会发送一个DNS请求到本地DNS域名服务器，像中国电信，移动
// c.查本地，有缓存记录直接返回结果；没有，本地DNS服务器会向DNS根服务器查询
// d.根服务器指向域服务器，继续查
// e.本地DNS服务器向域服务器发送请求继续查，域服务器告诉域名解析服务器地址
// f.本地DNS向域名解析服务器发送请求，这时收到一个ip和域名的对应关系；本地DNS把ip地址返回电脑
// 并把对应关系存到缓存中

// 什么是DNS？因特网上作为域名和IP地址相互映射的一个分布式数据库。通过主机名，最终得到该主机名对应的IP地址的过程叫做域名解析

// 什么是DNS负载均衡？
// 当一个网站有足够多的用户的时候，假如每次请求的资源都位于同一台机器上面，那么这台机器随时可能会蹦掉。处理办法就是用DNS负载均衡技术，它的原理是在DNS服务器中为同一个主机名配置多个IP地址,在应答DNS查询时,DNS服务器对每个查询将以DNS文件中主机记录的IP地址按顺序返回不同的解析结果,将客户端的访问引导到不同的机器上去,使得不同的客户端访问不同的服务器,从而达到负载均衡的目的｡例如可以根据每台机器的负载量，该机器离用户地理位置的距离等等。

// 3.浏览器向web服务器发送一个http请求
// 建立tcp/ip连接
// 三次握手
// 三次握手”的目的是“为了防止已失效的连接请求报文段突然又传送到了服务端，因而产生错误”

// 为什么建立连接是三次握手，而关闭连接却是四次挥手呢？

// 这是因为服务端在LISTEN状态下，收到建立连接请求的SYN报文后，把ACK和SYN放在一个报文里发送给客户端。而关闭连接时，当收到对方的FIN报文时，仅仅表示对方不再发送数据了但是还能接收数据，己方也未必全部数据都发送给对方了，所以己方可以立即close，也可以发送一些数据给对方后，再发送FIN报文给对方来表示同意现在关闭连接，因此，己方ACK和FIN一般都会分开发送。

// 4.服务器永久重定向301
// 为什么服务器一定要重定向而不是直接发送用户想看的网页内容呢？其中一个原因跟搜索引擎排名有关。如果一个页面有两个地址，就像http://www.yy.com/和http://yy.com/，搜索引擎会认为它们是两个网站，结果造成每个搜索链接都减少从而降低排名。而搜索引擎知道301永久重定向是什么意思，这样就会把访问带www的和不带www的地址归到同一个网站排名下。还有就是用不同的地址会造成缓存友好性变差，当一个页面有好几个名字时，它可能会在缓存里出现好几次。

// 5.浏览器跟着重定向

// 现在浏览器知道了 "http://www.google.com/"才是要访问的正确地址，所以它会发送另一个http请求。这里没有啥好说的

// 6、服务器处理请求
// 通过Nginx的反向代理，

// 7、服务器返回一个 HTTP 响应

// 8、浏览器显示 HTML
// 解析html以构建dom树 -> 构建render树 -> 布局render树 -> 绘制render树

// 9、浏览器发送请求获取嵌入在 HTML 中的资源（如图片、音频、视频、CSS、JS等等）

/****九种跨域方式及实现原理 */
// 同源策略限制：
// Cookie,localStorage,IndexedDB
// Dom节点
// AJAX

// 有三个标签允许加载跨域资源
/* <img src=xxx>
<link href=xxx>
<script src=xxx> */
// 跨域并不是请求发不出去，请求能发出去，服务端能收到请求并正常返回结果，只是结果被浏览器拦截了。

// 解决方案
// (1)JSONP，利用script标签没有跨域限制的漏洞
// 优点：简单兼容性好，缺点：仅仅支持get方法，不安全可能遭到xss攻击
$.ajax({
  url:"http://crossdomain.com/jsonServerResponse",
  dataType:"jsonp",
  type:"get",//可以省略
  jsonpCallback:"show",//->自定义传递给服务器的函数名，而不是使用jQuery自动生成的，可省略
  jsonp:"callback",//->把传递函数名的那个形参callback，可省略
  success:function (data){
  console.log(data);}
  });
// (2) CORS需要浏览器和后端同时支持，实现 CORS 通信的关键是后端。只要后端实现了 CORS，就实现了跨域。
// 服务端设置 Access-Control-Allow-Origin 就可以开启 CORS。 该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源。
// （3）postMessage
// （4）Websocket 是 HTML5 的一个持久化的协议，它实现了浏览器与服务器的全双工通信，同时也是跨域的一种解决方案。
// （5）Node 中间件代理(两次跨域)
// 本地文件 index.html 文件，通过代理服务器http://localhost:3000向目标服务器http://localhost:4000请求数据。
// （6）nginx 反向代理
// （7）window.name + iframe
// （8）location.hash + iframe
// (9).document.domain + iframe

// CORS 支持所有类型的 HTTP 请求，是跨域 HTTP 请求的根本解决方案
// JSONP 只支持 GET 请求，JSONP 的优势在于支持老式浏览器，以及可以向不支持 CORS 的网站请求数据。
// 不管是 Node 中间件代理还是 nginx 反向代理，主要是通过同源策略对服务器不加限制。
// 日常工作中，用得比较多的跨域方案是 cors 和 nginx 反向代理


// import * as XXX from 'xxxx' 和 import XXX from 'xxx'的区别
// circle.js
export function area (radius) {
  return Math.PI * radius * radius
}

export function circumference (radius) {
  return 2 * Math.PI * radius
}

// 引用
import { area, circumference } from './circle.js'
// 或
import * as circle from './circle'
console.log('圆面积:' + circle.area(4))
console.log('圆周长：' + circle.circumference(14))
