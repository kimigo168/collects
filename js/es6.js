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