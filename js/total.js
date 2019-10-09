// 1.slice()分割返回新数组，splice()删除数组项，split()分割字符串并返回新数组,join()把数组所有
// 元素放入一个字符串
// 2.判断一个数组种是否包含一个指定的值 [1,2,3].includes(2) // true
//3.array.reduce(function(total,currentValue,currentIndex,arr){}, initValue);
// eg:求和
[1, 2, 3].reduce(function(total, num){return total + num}, 0)
//4.利用set去重,类似数组，不过成员值都是唯一的
function dedupe(array) {
  return Array.from(new Set(array)); 
  // Array.from()方法从一个类似数组或可迭代对象中创建一个新的数组实例
}
dedupe(array);
// set的用法
var set1 = new Set([1, 2, 3])
var set2 = new Set([4, 5, 3])
// 并集
let union = new Set([...set1, ...set2]);
// 交集
let intersect = new Set([...set1].filter( x => set2.has(x)));
// 差集
let difference = new Set([...set1].filter(x => !set2.has(x)));

// 5.call,apply,bind区别
// (1) apply和bind,改变函数执行时的上下文，将一个对象的方法交给另一个对象来执行，并且是立即执行的。
// (2) 调用 call 和 apply 的对象，必须是一个函数 Function

// call 写法：
// Function.call(obj,[param1[,param2[,…[,paramN]]]])
// 调用 call 的对象，必须是个函数 Function。
// call 的第一个参数，是一个对象。 Function 的调用者，将会指向这个对象。如果不传，则默认为全局对象 window。
// 第二个参数开始，可以接收任意个参数。每个参数会映射到相应位置的 Function 的参数上。
// 但是如果将所有的参数作为数组传入，它们会作为一个整体映射到 Function 对应的第一个参数上，之后参数都为空。

function func (a,b,c) {}
func.call(obj, 1,2,3)
// func 接收到的参数实际上是 1,2,3

func.call(obj, [1,2,3])
// func 接收到的参数实际上是 [1,2,3],undefined,undefined

// apply写法:
// Function.apply(obj[,argArray])

// 它的调用者必须是函数 Function，并且只接收两个参数，第一个参数的规则与 call 一致。
// 第二个参数，必须是数组或者类数组，它们会被转换成类数组，传入 Function 中，并且会被映射到 Function 对应的参数上。这也是 call 和 apply 之间，很重要的一个区别。

func.apply(obj, [1,2,3])
// func 接收到的参数实际上是 1,2,3

func.apply(obj, {
    0: 1,
    1: 2,
    2: 3,
    length: 3
})
// func 接收到的参数实际上是 1,2,3

// call应用场景：
// 1、对象的继承。如下面这个例子：
function superClass () {
  this.a = 1;
  this.print = function () {
      console.log(this.a);
  }
}

function subClass () {
  superClass.call(this);
  this.print();
}

subClass();
// 1
// subClass 通过 call 方法，继承了 superClass 的 print 方法和 a 变量。此外，subClass 还可以扩展自己的其他方法。

// 2、借用方法。还记得刚才的类数组么？如果它想使用 Array 原型链上的方法，可以这样：
let domNodes = Array.prototype.slice.call(document.getElementsByTagName("*"));
// 这样，domNodes 就可以应用 Array 下的所有方法了。

// apply 的一些妙用
// 1、Math.max。用它来获取数组中最大的一项。
let max = Math.max.apply(null, array);
// 同理，要获取数组中最小的一项，可以这样：
let min = Math.min.apply(null, array);
// 2、实现两个数组合并。在 ES6 的扩展运算符出现之前，我们可以用 Array.prototype.push来实现。
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];

Array.prototype.push.apply(arr1, arr2);
console.log(arr1); // [1, 2, 3, 4, 5, 6]

// bind的使用
// bind() 方法创建一个新的函数，在调用时设置 this 关键字为提供的值。并在调用新函数时，将给定参数列表作为原函数的参数序列的前若干项。
// Function.bind(thisArg[, arg1[, arg2[, ...]]])
// bind 方法 与 apply 和 call 比较类似，也能改变函数体内的 this 指向。不同的是，bind 方法的返回值是函数，并且需要稍后调用，才会执行。而 apply 和 call 则是立即调用。

function add (a, b) {
  return a + b;
}

function sub (a, b) {
  return a - b;
}

add.bind(sub, 5, 3); // 这时，并不会返回 8
add.bind(sub, 5, 3)(); // 调用后，返回 8

// 如果 bind 的第一个参数是 null 或者 undefined，this 就指向全局对象 window。

// 总结
// call 和 apply 的主要作用，是改变对象的执行上下文，并且是立即执行的。它们在参数上的写法略有区别。
// bind 也能改变对象的执行上下文，它与 call 和 apply 不同的是，返回值是一个函数，并且需要稍后再调用一下，才会执行。

// 6.比较两个 数组/对象 是否相当
Array.prototype.equals = (array) => {
  if (!array || this.length !== array.length) return false;
  for (let i = 0; i < this.length; i++) {
    if (this[i] instanceof Array && array[i] instanceof Array) {
      if (!this[i].equals(array[i])) {
        return false;
      }
    } else if (this[i] != array[i]) {
      return false;
    }
  }
  return true;
}

// 7.浅拷贝 Object.assign({}, obj);
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };
const returnedTarget = Object.assign(target, source)
console.log(target);// { a: 1, b: 4, c: 5 }
console.log(returnedTarget); // { a: 1, b: 4, c: 5 }

// 8.深拷贝
const deepClone = data => {
  if (data === null || typeof data !== 'object') return data;
  const obj = Array.isArray(data) ? [] : {};
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      obj.push(deepClone(data[i]));
    }
  } else {
    for (let key in data) {
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
}

// 9.ES6中的工厂模式
class User {
  constructor (opt) {
    this.name = opt.name;
    this.viewPage = opt.viewPage;
  }
}

let user1 = new User({name: 'xiao', viewPage: 'helloworld'})

// 10.类数组转化成数组
// (1) Array.prototype.slice.call(arguments)
function list () {
  return Array.prototype.slice.call(arguments);
}
list(1, 2, 3)
// (2)splice()
Array.prototype.splice.call(arguments, 0)
// (3)Array.from(arguments)
// (4)Array.prototype.concat.apply([], arguments)


/*****js模拟Promise *****/
function Promise(fn) {
  let value = null;
  let succallbacks = [];
  let failcallbacks = [];
  this.then = (fulfilled, rejected) => {
    succallbacks.push(fulfilled);
    failcallbacks.push(rejected);
    return this;
  };

  function resolve(value) {
    succallbacks.forEach((callback) => {
      callback(value)
    });
  }
  function reject(value) {
    failcallbacks.forEach((callback) => {
      callback(value);
    });
  }
  fn(resolve, reject)
}

function foo(num) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(num) //1   去掉time 则不会执行
    }, 1000)
  })
}

foo(1).then(data => {
  console.log(data)
})

/*****Promise 封装axios ****/
import axios from 'axios'
const qs = require('qs')
const api = {
  async get (url, data) {
    try {
      let res = await axios.get(url, {params: data})
      res = res.data
      return Promise((resolve, reject) => {
        if (res.code == 0) {
          resolve(res)
        } else {
          reject(res)
        }
      })
    } catch (err) {
      console.log('err', err);
      alert('服务器出错')
    }
  },
  async post (url, data) {
    try {
      let res = await axios.post(url, qs.stringify(data))
      res = res.data
      return new Promise((resolve, reject) => {
        if (res.code == 0) {
          resolve(res)
        } else {
          reject(res)
        }
      })
    } catch (err) {
      alert('服务器出错')
    }
  }
}
export { api }

// 调用
import { api } from 'common/js/api'

export default {
  data () {
    return {
      list: []
    }
  },
  created () {
    this.getList();
  },
  methods: {
    async getList () {
      let { data } = await api.get('/feering/test/list')
      console.log('data')
      this.list = data;
    }
  }
}

/*****vue.js *****/
// 1. this.$forceUpdate();进行强制渲染，效果实现；因为数据层次太多，render函数没有自动更新，需手动强制刷新。