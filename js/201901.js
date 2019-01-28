// 1.rpx(response pixel)
// 根据屏幕宽度自适应，iphone6屏幕宽度375px,共有750个物理像素，750rpx = 375px = 750物理像素, 1rpx = 0.5px = 1物理像素
// iphone 5 1rpx = 0.42px

// 2.减少内联样式，会影响渲染速度

// 3. tap不会阻止事件冒泡，catch可以阻止，longpress长触,catchtap  bindtap

// 4.当页面的 URL 中包含 #something 元素时，一旦页面加载，浏览器就会自动滚动至具有这个 ID 的元素之处,但如果你在页面加载之后再渲染元素，这项功能就不起作用了,以下方式可以重新生效
// document.querySelector(document.location.hash).scrollIntoView();

// 5.隐藏某元素 myElement.hidden = true

// 6.el.classList.toggle('some-orange-class', theme === 'orange');增减类名

// 7. myElement.closest('article').querySelector('h1');这段方法首先向上找到最近的 <article> 元素，然后再向下找到最近的 <h1> 元素

// 8. getBoundingClientRect()在对 DOM 元素调用该方法时，将返回一个包含其空间结构详细信息的简单对象
// 调用该方法会导致元素的重绘
// {
//   x: 604.875,
//   y: 1312,
//   width: 701.625,
//   height: 31,
//   top: 1312,
//   right: 1306.5,
//   bottom: 1343,
//   left: 604.875
// }

// 9. matches() 假设我需要检查某个元素是否包括一个特定的 class
if (myElement.className.indexOf('some-class') > -1) {
  // do something
}
if (myElement.className.includes('some-class')) {
  // do something
}
if (myElement.matches('.some-class')) {
  // do something
}

// 10. contains() 需要知道某个元素是否被包含在另一个元素中
const handleClick = e => {
  if (!modalEl.contains(e.target)) modalEl.hidden = true;
};
// 代码中的 modalEl 是模态窗口的引用，而 e.target 则代表各种发生点击事件的元素

// 11. getAttribute() 如果你需要获取 href 特性中的字符串字面值，就只能使用 el.getAttribute('href') 方法了

// 12. 判断是否滚动over-scroll触发,超出
let target = $event.target;
let clientWidth = target.clientWidth;
let scrollWidth = target.scrollWidth;
if (clientWidth < scrollWidth) { // 超出
  this.isShowEllipse = true;
  this.hoverSelect = x;
} else { // 未超出
  this.isShowEllipse = false; // 清空
}

// 13. Array.find() 返回符合条件的第一个元素 arr.find(checkFun)

// 14. Array.includes() 返回true or false

// 15. array.reduce(function(total, currentValue, currentIndex, arr){}, initValue) // initialValue传递给函数的初始值

// this.data.indexList.findIndex((item) => item === id) 返回符合要求的第一个item所在位置索引,calc()

// set 的has(), 用以测试该值是否存在于 Set 对象中。 true or false

var set1 = new Set([1,2,3]);
var set2 = new Set([2,3,4]);
// 并集
let union = new Set([...set1, ...set2]);
// 交集
let intersect = new Set([...set1].filter( x => set2.has(x)));
// 差集
let difference = new Set([...set1].filter(x => !set2.has(x)));

// 16. Math.floor()向下取整, Math.ceil() 向上取整, Math.round()// 四舍五入

// 17. vw：视窗宽度的百分比（1vw 代表视窗的宽度为 1%）
// vh：视窗高度的百分比
// vmin：当前 vw 和 vh 中较小的一个值
// vmax：当前 vw 和 vh 中较大的一个值

// 18. this.$forceUpdate();进行强制渲染，效果实现；因为数据层次太多，render函数没有自动更新，需手动强制刷新。

// 19. 下载某文件，window.open(this.$global.commonURL + this.$urlImg(this.hotelParameter.apiclientCert));

// 20.  js 模拟Promise
function Promise(fn) {
  let value = null
  let succallbacks = []
  let failcallbacks = []
  this.then = (fulfilled, rejected) => {
    succallbacks.push(fulfilled)
    failcallbacks.push(rejected)
    return this
  }

  function resolve(value) {
    succallbacks.forEach((callback) => {
      callback(value)
    })
  }

  function reject(value) {
    failcallbacks.forEach((callback) => {
      callback(value)
    })
  }
  fn(resolve, reject)
}

function fn(num) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(num) //1   去掉time 则不会执行
    }, 1000)
  })
}

fn(1).then(data => {
  console.log(data)
})

// then方法在js引擎执行的时候注册，注册2个回调，通过代码可以看出，then注册一定是在 resolve或reject之前，
// 上面一个简单的promise就完成了，然而，then方法一定要在resolve之前，如果 promise是同步的（将settimeout去掉），
// 则在resolve的时候，succallbacks为null，所以需要加一个time保证then在resolve之前，
// 也就是将resolve或者reject 放到队列的末端，参考（macro task 与 micro task） js 的eventloop；
// 同时我们知道promise是可以链式调用，所以then方法返回的还是一个promise

// 改进
function Promise(fn) {
  var data = undefined, reason = undefined;
  var succallbacks = [];
  var failcallbacks = [];
  var status = "pending";
  this.then = function (fulfilled, rejected) {
      return new Promise(function(resolve,reject) {    //返回一个新的promise
          function suc(value) {   //成功
              var ret = typeof fulfilled === 'function' && fulfilled(value) || value;
              if( ret && typeof ret ['then'] == 'function'){    //判断 then中的 返回的是否是promise对象，如果是注册then方法
                  ret.then(function(value){
                      resolve(value);
                  });
              } else {
                  resolve(ret);
              }
          }
          function errback(reason) {  //失败
              reason = typeof rejected === 'function'  && rejected(reason) || reason;
              reject(reason);
          }

          if (status === 'pending') {
              succallbacks.push(suc);
              failcallbacks.push(errback);
          } else if(status === 'fulfilled'){
              suc(data);
          } else {
              errback(reason);
          }
      })

  }

  function resolve(value) {
      setTimeout(function () {   //加入延时
          status = "fulfilled";
          data = value;
          succallbacks.forEach((callback) => {
              callback(value);
          })
      }, 0)

  }

  function reject(value) {
      setTimeout(function () {
          status = "rejected";
          reason = value;
          failcallbacks.forEach((callback) => {
              callback(value);
          })

      }, 0)
  }

  fn(resolve, reject);
}

let p = new Promise((resolve, reject) => {
              setTimeout(() => {
              resolve(1);
          }, 1000)
      }) ;

p.then(data =>{
  console.log(data);
  return  new Promise((resolve,reject) => {    //then 方法返回的是一个promise对象，故执行 promise中的then注册该结果，在resolve
             setTimeout(() => { resolve(2);},1000)})
}).then(data =>{
  console.log(data);
})

// 21. stringObject.charAt(index) 返回指定位置的字符
// 22.如果输入框隐藏光标
// （1）color: transparent;text-shadow: 0 0 0 #000;
// （2）   caret-color: transparent;
// （3）设置placeholder颜色input::-webkit-input-placeholder，input::-moz-placeholder，input::-ms-input-placeholder
// 23.子元素均匀分布，父容器 
  // display: flex;
  // justify-content: space-between;
// 24.控制光标位置
  // element.focus(); // 输入框获取焦点，但当文本过长的时候文本最后和光标不一同显示在输入框右边，而是隐藏起来了
// element.selectionStart = element.selectionEnd  = newLocation; // 更新光标位置，将之前算的新位置给输入框光标

// 25.Vue、React打包文件放在服务器，浏览器存在缓存问题的解决
// 因浏览器缓存原因导致vue 打包的文件 导致偶尔会出现不能即使更新最新代码。因此在打包的文件名中添加一个版本号以便浏览器能区分。
// 解决方法：找到webpack .prod.conf.js
// 1.定义版本变量： const  Version = new Date().getTime(); // 这里使用的是时间戳 来区分 ，也可以自己定义成别的如：1.1
// 2.修改要生成的js和css文件的配置项，把刚刚声明的版本拼接进要生成的文件名中；  
// output: {
//     path: config.build.assetsRoot,
//     filename: utils.assetsPath('js/[name].[chunkhash].' + Version + '.js'),
//     chunkFilename: utils.assetsPath('js/[id].[chunkhash].' + Version + '.js')
// }
// 然后直接 npm run build 打包后 就可以看到dist 文件里的js 文件名带上里版本号

// 普通项目可以
{/* <script>
document.write('<script type="text/javascript" src="jquery.js?'+Math.random()+'"><\/script>');
</script> */}
// 刷新页面数据： https://segmentfault.com/a/1190000017007631

