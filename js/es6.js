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
// P79 