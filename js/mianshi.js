// 技术架构考核范围：
// 1.vuejs
// 2.React.js
// 3.Node.js
// 4.微信公众号
// 5.前端安全
// 6. react-native
// 7.工程化
// 8.小程序
// 9.自动化测试
// 10.性能优化
// 11.算法和数据结构
// 12.设计模式
// 13.面试


// 数据类型：(看javascript高级编程)
// 题目一：
var bar = true
console.log(bar + 0) // 1
console.log(bar + 'xyz') // truexyz
console.log(bar + true) // 2
console.log(bar + false) // 1
console.log('l' > bar) // false
console.log(1 + '2' + false) // 12false
console.log('2' + ['koala', 1]) // 2koala,1

var obj1 = {
  a: 1,
  b: 2
}
console.log('2' + obj1) // 2[object Object]
var obj2 = {
  toString: function () {
    return 'a'
  }
}
console.log('2' + obj2) // 2a

// 题目二：
var b = 1
function outer () {
  var b = 2
  function inner () {
    b++
    console.log(b)
    var b = 3 // 变量提升，undefined ++ => NaN
  }
  inner()
}
outer() // 输出NaN
// 什么时候返回NaN:

// 无穷大除以无穷大
// 给任意负数做开方运算
// 算数运算符与不是数字或无法转换为数字的操作数一起使用
// 字符串解析成数字

// 题目三： 说一说js有哪些数据类型？
// 七种，包括基本类型和对象类型
// 基本类型：
string, boolean, number, symbol, null, undefined
// 对象类型：引用类型，array和function 是对象的子类型

// 题目四：说说你对js弱类型语言的理解？
// 答：js声明变量的时候并没有预先确定类型，变量的类型就是其值的类型。举个例子，上一秒是String,下一秒就可以是Number.
// 这个过程可能发生了强制类型转换。带来了便利，但也带来了困扰

// 题目五：面试官问：javascript中强制类型转换是一个非常易出现bug的点，知道强制转换时候的规则吗？

// 题目六：如何判断数据类型？怎么判断一个值到底是数组类型还是对象?
// typeof {} 'object' 
// typeof [] 'object'
// typeof (() =>{}) 'function'

let arr = []
let obj = {}
arr instanceof Array // true
arr instanceof Object // true
obj instanceof Object // true

// 终极方法：Object.prototype.toString()
Object.prototype.toString().call({}) // '[object Object]'
Object.prototype.toString().call([]) // '[object Array]'
// ...