// 解构：按照一定模式，从数组和对象中提取值，对变量进行赋值，
var [a, b, c] = [1, 3, 4]

var { foo, bar } = { foo: 'aaa', bar: 'bbb' }
foo // 'aaa'
bar // 'bbb'

// 对象解构赋值的内部机制，先找到同名属性，然后再赋值给对应的变量
var { foo: foo, bar: bar } = {foo: 'aaa', bar: 'bbb'}

let foo;
let { foo } = { foo: 1} // duplicate delaration 'foo' 

// 函数参数解构赋值
function add ([x, y]) {
  return x + y;
}
// 变量的解构赋值用途：
// (1)交换变量的值
[x, y] = [y, x]
// (2) 从函数返回多个值
function example() {
  return [1, 2, 3]
}
var [a, b, c] = example()
// (3)返回一个对象
function example () {
  return {
    foo: 1,
    bar: 2
  }
}
var { foo, bar } = example()

//(4)提取JSON对象中的数据 (常用)
var jsonData = {
  id: 42,
  status: 'ok',
  data: [88, 5309]
}

let { id, status, data} = jsonData;
console.log(id, status, data)
// (5) 函数参数的默认值
jQuery.ajax = function (url, {
  async = true,
  beforeSend = function () {},
  cache = true,
  complete = function () {},
  crossDomin = false,
  global = true,
  // ... more config
}) {
  // ... do staff
}
// (6) 遍历map解构
var map = new Map()
map.set('first', 'hello')
map.set('second', 'world')

for (let [key, value] of map) {
  console.log(`${key} is ${value}`)
}

// 只获取键名
for (let [key] of map) {
  // ...
}
// 只获取键值
for (let [,value] of map) {
  // ...
}

// (7) 输入模块的指定方法
const { sourceMapConsumer, SourceNode } = require('source-map')

// P36
// P44 编译模板，正则
// p62 数组新方法
// (1) Array.from() 将两类对象转为真正的数组，类似数组对象和可遍历对象（Set,Map）
let arrayLike = { '0': 'a', '1': 'b', '2': 'c'}
let arr1 = [].slice.call(arrayLike) // ['a','b','c']
let arr2 = Array.from(arrayLike)

// 场景：将DOM操作返回的NodeList，及函数内部的arguments对象
Array.from('hello') // ['h','e','l','l','o']

let nameSet = new Set(['a', 'b', 'c'])
Array.from(nameSet) // ['a','b','c']

// 扩展运算符也可以将某些数据转换成数组
function foo () {
  var args = [...arguments]
}
// NodeList 对象
[...document.querySelectorAll('div')]

// 将一组值转换为数组
Array.of(3, 8, 11) // [3, 8, 11]
// 模拟
function ArrayOf () {
  return [].slice.call(arguments)
}
// 数组find() 返回第一个符合条件的成员，没有则返回undefined
// 数组findIndex() 返回第一个符合条件成员位置，没有则返回-1
let arr = [{isSelect: false}, {isSelect: true}, {isSelect: false}];
let obj = arr.find((item, index) => {
  return item.isSelect
})

// 数组实例的fill()
['1', '2', '3'].fill(7)
new Array(3).fill(7) // [3, 3, 3]

// arr.keys(), arr.values(), arr.entires()
for (let index of arr.keys()) {
  console.log(index)
}
// includes() 返回true or false

// 函数默认参数
function Point (x = 0, y = 0) {
  this.x = x;
  this.y = y;
}
var p = new Point(); // p { x: 0, y: 0 }

// 扩展运算符
var arr1 = [1, 2, 3]
var arr2 = [4, 5, 6]
arr1.push(...arr2)
// P80 箭头函数
const full = ({first, last}) => first + ' ' + last;
// 等同于
function full (person) {
  return person.first + ' ' + person.last;
}
// this的指向
function foo () {
  setTimeout(() => {
    console.log('id：', this.id)
  }, 100)
}
var id = 21;
foo.call({id: 42}) // id: 42
// 如果普通函数，执行时this指向全局window,但箭头函数导致this总是指向函数定义生效时所在的对象
// 函数绑定
// foo::bar;  => bar.bind(foo)

// 尾调用，函数最后一步调用另一个函数
function f(x) {
  return g(x)
}
// es6允许直接写入方法或变量
var foo = 'bar'
var baz = {foo}
bar//{foo: 'bar'}
// 等同于
var baz = {foo: foo}
// ES6允许在对象之中，只写属性名，不写属性值
function f(x, y) {
return {x, y};
}
// 等同于
function f(x, y) {
  return {x: x, y: y};
  }
  // p93
  Object.assign(target, souce1, souce2)
  // Object.assign浅拷贝
  // 克隆对象
  function clone (origin) { // 只能克隆原始对象自身值，不能克隆它继承的值
    return Object.assign({}, origin)
  }

  function cloneInherit (origin) {
    let origniProto = Object.getPrototypeOf(origin)
    return Object.assign(Object.create(origniProto), origin)
  }

  // 属性的遍历
  // (1) for in 
  // (2) Object.keys(obj)
  // (3) Object.getOwnPropertyNames(obj)
  // Symbol,新增原始数据类型

  // P117
  // Proxy和Reflect  // p128
  // Reflect与Proxy一样，ES6操作对象的新API
  // (1)将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上
  // (2)修改某些Object方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。
  // (3)让Object操作都变成函数行为。某些Object操作是命令式，比如name in obj和delete obj[name]，而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)让它们变成了函数行为。
  // (4)Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为
  // Reflect.has() 和 Reflect.deleteProperty()

// 作为构造函数，Proxy接受两个参数。
// 第一个是所要代理的目标对象，如果没有proxy的介入，操作原来要访问的就是这个对象
// 第二个参数就是一个配置对象，对于每一个被代理的操作，需要提供一个对应的处理函数
var proxy = new Proxy({}, {
  get: function (target, property) {
    return 35;
  }
})
let obj = Object.create(proxy)
obj.time = 35
// proxy对象是obj对象的原型，所以根据原型链，会在proxy对象上读取该属性，导致被拦截
// Proxy的拦截预览
// (1)get(target, propKey, receiver)
// （2）set(target, propKey, value, receiver)
// （3）has(target, propKey)
// （4）deleteProperty(target, propKey)
// （5）ownKeys(target)
// （6）getOwnPropertyDescriptor(target, propKey)
// （7）defineProperty(target, propKey, propDesc)
// （8）preventExtensions(target)
// （9）getPrototypeOf(target)
// （10）isExtensible(target)
// （11）setPrototypeOf(target, proto)
// （12）apply(target, object, args) 如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
// （13）construct(target, args) 拦截Proxy实例作为构造函数调用的操作，比如new proxy(...args)。

// 各种拦截方法
// P131
// 二进制数组,arrayBuffer
// 浏览器API 用到了二进制数组操作二进制数据:
// File API,XML,Fetch API, Canvas, Websockets
var fileInput = document.getElementById('fileInput')
var file = fileInput.files[0]
var reader = new FileReader()
reader.readAsArrayBuffer(file)
reader.onload = () => {
  var arrayBuffer = reader.result
}
// P145  Set 和 Map
// set用于数组去重
var set = new Set([1, 3, 2, 4, 4])
// [...set] // [1,3,2,4]
// Set的四个操作方法： add(), delete(), has(), clear()
 // 遍历方法： keys(), values(), entires()

 // Map结构的目的和基本用法，Object对象，本质上是键值对的集合，但传统只能用字符串当键
 // Object提供了 “字符串--值”的结构，Map提供了 “值--值”
 var m = new Map()
 var o = {p: 'Hello World'}
 m.set(o, 'content')
 m.get(o) // 'content'
 m.has(o) // true
 m.delete(o) // true
 m.has(o) // false

 // P158  Iterator 和 for of循环
  // Iterator作用：为各种数据结构，提供统一的，简便的访问接口；使数据结构的成员，能够按某种次序排序；ES6创造的新的，for of
// 凡是部署了Symbol.iterator属性的数据结构，就称部署了遍历接口 
// 默认的Iterator接口部署在数据结构的Symbol.iterator属性，或者说，一个数据结构只要具有Symbol.iterator属性，就可以认为是“可遍历
// 的”（iterable）。

// yield* 后面跟的是一个可遍历结构，它会调用该结构的遍历器接口
let generator = function* () {
  yield 1;
  yield* [2, 3, 4];
  yield 5;
}
var iterator = generator();
iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }

// generator函数  P170,ES6提供的一种异步编程解决方案？？
// 与普通函数不同地方：generator函数是分段执行的，yield是暂停执行的标记，next()方法可以恢复执行

 // Promise P191 归纳总结
 let promise = new Promise(function(resolve, reject) {
   console.log('Promise')
   resolve()
 })
 promise.then(function () {
   console.log('Resolved.')
 })
 console.log('Hi')
 // 执行顺序
 // Promise
 // Hi
 // Resolved
 // 异步加载图片的例子：
 function loadImageAsync (url) {
   return new Promise(function (resolve, reject) {
     var image = new Image()
     image.onload = function () {
       resolve(image)
     }
     image.onerror = function () {
       reject(new Error('Could not load image at '+ url))
     }
     image.src = url
   })
 }
 // 193
//  算法运算符 ...
const pokeman = { name: 'Squirtle', type: 'Water', abilities: ['Torrent', 'Rain Dish']}
const squirtleClone = { ...pokeman }
pokeman.name = 'Charmander'
pokeman.abilities.push('Surf')
console.log(squirtleClone)
// { name: 'Squirtle', type: 'Water', abilities: [ 'Torrent', 'Rain Dish', 'Surf' ] }

// 修改原对象的name,克隆对象name不变；但修改原对象的abilities,克隆对象也修改了。原因是，abilities是一个引用类型
// 解决方法：(1)
const squirtleClone = { ...pokemon, abilities: [...pokemon.abilities] };
// (2)深拷贝

