// 1.去掉input file hover 提示 “未选择任何文件” title = ' '
// 2.事件循环机制
// 一个线程中，事件循环是唯一的，但任务队列可以多个
// 队列任务分为宏任务和微任务，task 和jobs
// 宏任务（macro-task）:script（整体代码）,setTimeout,setInterval, setImmediate(只ie10实现),I/O UI rendering
// 微任务 (micro-task) process.nextTick（nodejs的支持）,Promise
// setTimeout,Promise称为任务源 setTimeout会立即执行，分发的任务延迟执行
// 循环的顺序：决定了js执行顺序，从script(整体代码)开始第一次循环。之后全局上下文进入函数调用栈。直到调用栈清空(只剩全局)，然后执行所有的micro-task。当所有可执行的micro-task执行完毕之后。循环再次从macro-task开始，找到其中一个任务队列执行完毕，然后再执行所有的micro-task，这样一直循环下去。
// nextTick队列会比Promie先执行。nextTick中的可执行任务执行完毕之后，才会开始执行Promise队列中的任务

// 用数组模拟一个队列
var tasks = [];
// 模拟一个事件分发器
var addFn1 = function (task) {
  tasks.push(task);
}
// 执行所有的任务
var flush = function () {
  tasks.map(function (task){
    task();
  })
}
// 最后利用setTimeout或其他认为合适的方法丢入事件循环
setTimeout(function () {
  flush();
})
// 当然，也可以不用丢进事件循环，而是我们自己手动在适当的时机去执行对应的某一个方法
var dispatch = (name) => {
  tasks.map((item) => {
    if (item.name == name) {
      item.handler()
    }
  })
}
// 当然，我们把任务丢进去的时候，多保存一个name即可。
// 这时候，task的格式就如下
demoTask =  {
  name: 'demo',
  handler: function() {}
}

// 于是，一个订阅-通知的设计模式就这样轻松的被实现了

// 3.Promise的使用
// 解决回调嵌套的问题，将数据请求和数据处理明确区分开来
// 一、Promise三种状态：
// pending:等待中，或者进行中，表示还没得到结果
// resolved(Fullfilled):已经完成，可以继续往下执行
// rejected:表示也得到结果，但不是想要的，拒绝往下执行
// 二、then() 方法有两个参数，一个接收resolve状态，一个接收reject状态执行；
// 执行结果返回一个Promise对象，可以进行链式调用，解决回调地狱
function fn(num) {
  return new Promise((resolve, reject) => {
    if (typeof num == 'number') {
      resolve(num);
    } else {
      reject('TypeError')
    }
  }).then(function () {
    console.log('参数是一个number变量')
  }, function () {
    console.log('参数不是一个number值')
  })
}
fn('hahah')
fn(1245)

// 等同于
function fn (num) {
  return new Promise((resolve, reject) => {
    if (typeof num == 'number') {
      resolve(num)
    } else {
      reject('TypeError')
    }
  }).then((res) => {
    console.log(res)
  }).catch((err) => {
    console.log(err)
  });
}
// 三、Promise中数据传递
fn(2).then(function (num) {
  console.log('first:'+ num);
  return num + 1;
}).then(function (num) {
  console.log('second:'+ num);
  return num + 1;
}).then((num) => {
  console.log('third:'+ num)
  return num + 1;
});

// 封装一个get请求
function getJSON(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          try {
            let response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch (e) {
            reject(e)
          }
        } else {
          reject(new error(xhr.statusText))
        }
      }
    }
  })
}
getJSON(url).then(res => console.log(res))
// 四、当一个ajax请求，它的参数需要另外两个，甚至更多请求都返回结果之后才能确定，可以用Promise.all 

function renderAll () {
  return Promise.all([getJSON(url), getUrl(url1)])
}
renderAll().then((val) => console.log(val))
// 五、 Promise.race() 和Promise.all()类似，不同当数组中有一个Promise状态为resolve或rejected状态时，可以调用then方法
function renderRace () {
  return Promise.race([getJSON(url), getJSON(url1)])
}

// 4.Provisional headers are shown
// 之所以会出现这个警告，是因为去获取该资源的请求其实并（还）没有真的发生，所以 Header 里显示的是伪信息，直到服务器真的有响应返回，这里的 Header 信息才会被更新为真实的。不过这一切也可能不会发生，因为该请求可能会被屏蔽。比如说 AdBlock 什么的，当然了不全是浏览器扩展，具体情况具体分析了

// 出现在 载入缓存资源,请求没有被发送, 而如果上一个资源加载失败,可能导致从缓存加载的资源失败,
// 即缓存资源请求之前的请求不能失败,不然就有可能出现问题

// 5.短路求值
// 三目运算符的简便写法 
// && 将返回第一个false的值，当所有的操作数都是true时，返回最后一个表达式的结果
let one = 1, two = 2, three = 3;
console.log(one && two && three) // result:3
console.log(0 && null) // result: 0

// || 运算符，将返回第一个true/truthy的值，当所有操作数都是false时，将返回最后一个表达式的结果
let one = 1,two = 2,three = 3;
console.log(one || two || three) // 1
console.log(0 || null) // 0

// 例子：服务端请求数据过程
if (this.state.data) {
  return this.state.data;
} else {
  return 'Fetching data'
}
// 写成 
return (this.state.data || 'Fetching Data')
// 6.快速求幂,跟指数的区别
// 以前 Math.pow(2,3) => console.log(2 ** 3);
// 7.Object.freeze() 
//  冻结一个对象，一个冻结对象不能再修改，也不能添加新的属性，删除已有属性
// 不能修改该对象已有熟悉的可枚举性，可配置性，可写，不能修改已有属性值
// 原型也不能再修改
const object1 = {property: 42}
const object2 = Object.freeze(object1)
object2.property = 33;
object2.property // 42
// 应用：
var emptyObject = Object.freeze({}) // 后面用emptyObject 和其它对象比较，是否为空
// vue源码：
// (function(global, factory){//.....}(this, function(){}))

//8.Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
const person = {
  isHuman: false,
  printIntroduction: function () {
    console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
  }
};

const me = Object.create(person);

me.name = "Matthew"; // "name" is a property set on "me", but not on "person"
me.isHuman = true; // inherited properties can be overwritten

me.printIntroduction();

// Object.create(null)没有继承任何原型方法，也就是说它的原型链没有上一层。
console.log(Object.create({}).toString);   // function toString() { [native code] }
console.log(Object.create(null).toString); // undefined
