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
// 9.什么是函数式编程？函数式编程是一种强调以函数使用为主的软件开发风格。目的是使用函数来抽象作用在数据之上的控制流和操作，从而在系统中消除副作用并减少对状态的改变
// 函数式编程属于声明式编程范式：这种规范会描述一系列操作，但并不会暴露他们是如何实现的或是数据流如何传过它们。
// 命令式方式
var array = [0, 1, 2, 3]
for(let i = 0; i < array.length; i++) {
    array[i] = Math.pow(array[i], 2)
}

array; // [0, 1, 4, 9]
// 声明式方式
[0, 1, 2, 3].map(num => Math.pow(num, 2))
// 10.hashchange  url的hash改变，页面不会重新加载，但仍然被记录到浏览器的历史记录中
window.addEventListener('hashchange', (e) => {
  console.log(e.oldURL)
  console.log(e.newURL)
})
// 场景，浏览器小图查看大图，返回上一页，退出大图查看，不返回上个html,可以点击大图的时候给url+#hash
// 假设大图展示状态的hash为imgSlider
window.addEventListener('hashchange', function(e) {
  var re = /#imgSlider$/;
  if ( re.test(e.oldURL) && !re.test(e.newURL) ) {
    // 假设imgSlider为大图展示组件对象
    imgSlider.hide();
  }
}, false);

// 这里简单做一个实现，原理是把目标路由和对应的回调记录下来，点击跳转触发 hashchange 的时候获取当前路径并执行对应回调
class RouterClass () {
  constructor () {
    this.routes = {}; // 记录路径标识符对应的cb
    this.currentUrl = ''; // 记录hash只为方便执行cb
    window.addEventListener('load', () => {
      this.render();
    });
    window.addEventListener('hashchange', () => {
      this.render();
    });
  }
  /**初始化 ***/
  static init () {
    window.Router = new RouterClass();
  }
  /**注册路由和回调 */
  route(path, cb) {
    this.routes[path] = cb || function () {}
  }
  /**记录当前hash,执行cb */
  render () {
    this.currentUrl = location.hash.slice(1) || '/'
    this.routes[this.currentUrl]()
  }
}
// 解决vue nodejs中cros跨域cookie和session失效的问题 http://bbs.itying.com/topic/5c45639b3da5ae17b03606b0
// app
if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.setDetailFont) {
  window.webkit.messageHandlers.setDetailFont.postMessage("");
} else if (GiisoObjectCNewsModel && GiisoObjectCNewsModel.setDetailFont) {
  GiisoObjectCNewsModel.setDetailFont("");
}
// 获取URL的查询参数
// let q={};location.search.replace(/([^?&=]+)=([^&]+)/g,(_,k,v)=>q[k]=v);console.log(q);
// console.log(location.search.replace(/([^?&=]+)=([^&]+)/g,(_,k,v)=>q[k]=v));
// 创建本地时间
<body onload="setInterval(()=>document.body.innerHTML=new Date().toLocaleString().slice(10,19))"></body>

// 使用JavaScript简洁代码生成随机十六进制代码
// '#' + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0');
// 这是一个臭名昭著的面试题，让你写出他的运行结果，受不了~
// for(i=0;++i<101;console.log(i%5?f||i:f+'Buzz'))f=i%3?'':'Fizz'
// 用字符串返回一个键盘图形
(_=>[..."`1234567890-=~~QWERTYUIOP[]\\~ASDFGHJKL;'~~ZXCVBNM,./~"].map(x=>(o+=`/${b='_'.repeat(w=x<y?2:' 667699'[x=["BS","TAB","CAPS","ENTER"][p++]||'SHIFT',p])}\\|`,m+=y+(x+'    ').slice(0,w)+y+y,n+=y+b+y+y,l+=' __'+b)[73]&&(k.push(l,m,n,o),l='',m=n=o=y),m=n=o=y='|',p=l=k=[])&&k.join`
`)()
// 前端自动化部署
// shell脚步
// #!/bin/sh

// handle = $1;
// env = $2;
// # 远程部署机 webhook
// # 如果用远程机器部署的话就要用到以下方法
// # preHandle(){
// #     git pull orgin master
// #     npm config set registry http://registry.npm.taobao.org/
// #     npm install
// #     npm run build-prod
// # }
// # 清空dist目录
// emptyRemoteDist(){
//     if [ $env == "prod" ]
//     then
//         echo "[exec]remove remote:yourip folder"
//         ssh root@yourip "rm -rf /www/jiketoutiao_admin/*"
//     else
//         echo "[exec]remove remote:yourip folder"
//         ssh root@yourip "rm -rf /www/jiketoutiao_admin/*"
//     fi
// }
// # 发送文件到正式服
// transferFileToProSever(){
//     echo "[exec]transfer file to product:yourip sever"
//     scp -r ./dist/* root@yourip:/www/jiketoutiao_admin/
// }
// # 发送文件到测试服
// transferFileToTestSever(){
//     echo "[exec]transfer file to development::yourip sever"
//     scp -r ./dist/* root@yourip:/www/jiketoutiao_admin/
// }
// if [ $handle == "build" ]
// then
//     if [ $env == "prod" ]
//     then
//         env='prod'
//         echo "[exec]build ==> build production"
//         npm run build-prod
//         emptyRemoteDist
//         transferFileToProSever
//     else
//         env='dev'
//         echo "[exec]build ==> build development"
//         npm run build
//         emptyRemoteDist
//         transferFileToTestSever
//     fi
// fi
// 首先你得把部署机（可能是你本地机器）的ssh公钥（~/.ssh/id_rsa.pub）配置到对应服务器（~/.ssh/authorized_keys）

// 命令走起就可以直接发布了

// 例1：发布到测试服

// ./deploy.sh build dev

// 例2：发布到正式服

// ./deploy.sh build prod

// 这些后面的参数名称自己按照爱好改就行
// 然后在这讲一下npm run build-prod的操作,先在package.json这样配置
// "scripts": {
//   "dev": "node build/dev-server.js development-server",
//   "dev-prod": "node build/dev-server.js production-server",
//   "build": "node build/build.js  development-server",
//   "build-prod": "node build/build.js production-server"
// },
// https://www.cnblogs.com/AlexBlogs/p/7688252.html

// 匹配多个模式
// 使用操作符号 |
const regex = /yes|no|maybe/;    
// test 和 match 区别

// 匹配任意字符
// 使用通配符. 作为任何字符的占位
// 使用字符类，你可以使用它来定义要匹配的一组字符

// 把它们放在方括号里 []

//匹配 "cat" "fat" and "mat" 但不匹配 "bat"
const regexWithCharClass = /[cfm]at/g;
const testString = "cat fat bat mat";
const allMatchingWords = testString.match(regexWithCharClass); // ["cat", "fat",  "mat"]

// 使用字符集内的范围 [a-z]

const regexWidthCharRange = /[a-e]at/;

const regexWithCharRange = /[a-e]at/;
const catString = "cat";
const batString = "bat";
const fatString = "fat";

regexWithCharRange.test(catString); // true
// 匹配特定的数字和字母
// 你还可以使用连字符来匹配数字

const regexWithLetterAndNumberRange = /[a-z0-9]/ig;
const testString = "Emma19382";
testString.match(regexWithLetterAndNumberRange) // true
// 匹配单个未知字符
// 要匹配您不想拥有的一组字符，使用否定字符集 ^

const allCharsNotVowels = /[^aeiou]/gi;
const allCharsNotVowelsOrNumbers = /[^aeiou0-9]/gi;

// 匹配一行中出现一次或多次的字符
// 使用 + 标志

const oneOrMoreAsRegex = /a+/gi;
const oneOrMoreSsRegex = /s+/gi;
const cityInFlorida = "Tallahassee";

cityInFlorida.match(oneOrMoreAsRegex); // ['a', 'a', 'a'];
cityInFlorida.match(oneOrMoreSsRegex); // ['ss'];   

// 匹配连续出现零次或多次的字符
// 使用星号 *

const zeroOrMoreOsRegex = /hi*/gi;
const normalHi = "hi";
const happyHi = "hiiiiii";
const twoHis = "hiihii";
const bye = "bye";

normalHi.match(zeroOrMoreOsRegex); // ["hi"]
happyHi.match(zeroOrMoreOsRegex); // ["hiiiiii"]
twoHis.match(zeroOrMoreOsRegex); // ["hii", "hii"]
bye.match(zeroOrMoreOsRegex); // null

// 惰性匹配
// 字符串中与给定要求匹配的最小部分

// 默认情况下，正则表达式是贪婪的（匹配满足给定要求的字符串的最长部分）

// 使用 ? 阻止贪婪模式(惰性匹配 )

  const testString = "catastrophe";
    const greedyRexex = /c[a-z]*t/gi;
    const lazyRegex = /c[a-z]*?t/gi;
    
    testString.match(greedyRexex); // ["catast"]
    testString.match(lazyRegex); // ["cat"] 

//     匹配起始字符串模式
// 要测试字符串开头的字符匹配，请使用插入符号^，但要放大开头，不要放到字符集中

const emmaAtFrontOfString = "Emma likes cats a lot.";
const emmaNotAtFrontOfString = "The cats Emma likes are fluffy.";
const startingStringRegex = /^Emma/;

startingStringRegex.test(emmaAtFrontOfString); // true
startingStringRegex.test(emmaNotAtFrontOfString); // false

// 匹配结束字符串模式
// 使用 $ 来判断字符串是否是以规定的字符结尾

const emmaAtBackOfString = "The cats do not like Emma";
const emmaNotAtBackOfString = "Emma loves the cats";
const startingStringRegex = /Emma$/;

startingStringRegex.test(emmaAtBackOfString); // true
startingStringRegex.test(emmaNotAtBackOfString); // false 

// 匹配所有字母和数字
// 使用\word 简写

const longHand = /[A-Za-z0-9_]+/;
const shortHand = /\w+/;
const numbers = "42";
const myFavoriteColor = "magenta";

longHand.test(numbers); // true
shortHand.test(numbers); // true
longHand.test(myFavoriteColor); // true
shortHand.test(myFavoriteColor); // true


// 除了字母和数字，其他的都要匹配
// 用\W 表示 \w 的反义

const noAlphaNumericCharRegex = /\W/gi;
const weirdCharacters = "!_$!!";
const alphaNumericCharacters = "ab283AD";

noAlphaNumericCharRegex.test(weirdCharacters); // true
noAlphaNumericCharRegex.test(alphaNumericCharacters); // false

// 匹配所有数字
// 你可以使用字符集[0-9]，或者使用简写 \d

const digitsRegex = /\d/g;
const stringWithDigits = "My cat eats $20.00 worth of food a week.";

stringWithDigits.match(digitsRegex); // ["2", "0", "0", "0"]

// 匹配所有非数字
// 用\D 表示 \d 的反义
const nonDigitsRegex = /\D/g;
const stringWithLetters = "101 degrees";

stringWithLetters.match(nonDigitsRegex); // [" ", "d", "e", "g", "r", "e", "e", "s"]
// 匹配空格
// 使用 \s 来匹配空格和回车符

const sentenceWithWhitespace = "I like cats!"
var spaceRegex = /\s/g;
whiteSpace.match(sentenceWithWhitespace); // [" ", " "]


// 匹配非空格
// 用\S 表示 \s 的反义

const sentenceWithWhitespace = "C a t"
const nonWhiteSpaceRegex = /\S/g;
sentenceWithWhitespace.match(nonWhiteSpaceRegex); // ["C", "a", "t"]

// 匹配的字符数
// 你可以使用 {下界，上界} 指定一行中的特定字符数

const regularHi = "hi";
const mediocreHi = "hiii";
const superExcitedHey = "heeeeyyyyy!!!";
const excitedRegex = /hi{1,4}/;

excitedRegex.test(regularHi); // true
excitedRegex.test(mediocreHi); // true
excitedRegex.test(superExcitedHey); //false
// 匹配最低个数的字符数
// 使用{下界, }定义最少数量的字符要求,下面示例表示字母 i 至少要出现2次

const regularHi = "hi";
const mediocreHi = "hiii";
const superExcitedHey = "heeeeyyyyy!!!";
const excitedRegex = /hi{2,}/;

excitedRegex.test(regularHi); // false
excitedRegex.test(mediocreHi); // true
excitedRegex.test(superExcitedHey); //false


// 匹配精确的字符数
// 使用{requiredCount}指定字符要求的确切数量

const regularHi = "hi";
const bestHi = "hii";
const mediocreHi = "hiii";
const excitedRegex = /hi{2}/;

excitedRegex.test(regularHi); // false
excitedRegex.test(bestHi); // true
excitedRegex.test(mediocreHi); //false    
// 匹配0次或1次
// 使用 ? 匹配字符 0 次或1次

const britishSpelling = "colour";
const americanSpelling = "Color";
const languageRegex = /colou?r/i;

languageRegex.test(britishSpelling); // true
languageRegex.test(americanSpelling); // true

// 使用 position:fixed 这个属性。其实如果其父元素中有使用 transform， fixed 的效果会降级为 absolute
// 即当使用 fixed 的直接父元素的高度和屏幕的高度相同时 fixed 和 absolute 的表现效果会是一样的。

// 比如需要我们画一个 r 为 5px 的圆，如果我们使用 rem 作为单位，我们很快会发现在一些机型上的图案不圆，会呈现椭圆形。这是由于 rem 转 px 会存在精度丢失问题。这个时候我们就需要使用 px 配合 dpr 来实现

// 1px 方案
// .border_bottom { 
//   overflow: hidden; 
//   position: relative; 
//   border: none!important; 
// }
// .border_bottom:after { 
//   content: ".";
//   position: absolute; 
//   left: 0; 
//   bottom: 0; 
//   width: 100%; 
//   height: 1px; 
//   background-color: #d4d6d7; 
//   -webkit-transform-origin: 0 0;  
//   transform-origin: 0 0; 
//   -webkit-transform: scaleY(0.5);
//   transform: scaleY(0.5);
// }

// html {
//   box-sizing: border-box;
// }

// *, *:before, *:after {
//   box-sizing: inherit;
// }