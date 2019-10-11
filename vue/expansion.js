  // 扩展（HOF） High Order Functions，即高阶函数，至少满足两个条件之一：
  // (1) 以一个函数作为参数
  // (2)以一个函数作为返回结果

  // 函数作为参数：
  const x = [1, 2, 3]
  const y = x.map(function(item){
    return item + 1
  })
  // 函数作为返回值：
  const add = function (x) {
    return function (y) {
      return x + y
    }
  }
  console.log(add(1)(2))

// 偏函数应用：
const isType = function (type) {
  return function (obj) {
    debugger
    if (typeof type !== 'string') {
      return new Error('type need string')
    }
    const str = type[0].toUpperCase() + type.slice(1)
    return Object.prototype.toString.call(obj) === `[object ${str}]`
  }
}
const isNumber = isType('number')
console.log(isNumber(1))
// isType 返回一个新的函数。不过这种情况也叫偏函数，即把函数的某些参数值固定住，返回一个新的函数，调用这个新函数会更简单。
// 节流函数
const throttle = wait => fn => {
  var timer;
  return (...args) => {
    if (!timer) {
      timer = setTimeout(() => timer = null, wait);
      return fn(...args);
    }
  }
  }
  const debounce = wait => fn => {
    var timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, wait)
    }
  }
// 扩展：
// Q:使用 typeof bar === 'object'检测bar是否为对象有什么缺点？如何避免
// A: null的结果也是object, 数组也是
console.log(Object.prototype.toString.call(obj) === '[object Object]')

console.log(Object.prototype.toString.call("jerry"));//[object String]
console.log(Object.prototype.toString.call(12));//[object Number]
console.log(Object.prototype.toString.call(true));//[object Boolean]
console.log(Object.prototype.toString.call(undefined));//[object Undefined]
console.log(Object.prototype.toString.call(null));//[object Null]
console.log(Object.prototype.toString.call({name: "jerry"}));//[object Object]
console.log(Object.prototype.toString.call(function(){}));//[object Function]
console.log(Object.prototype.toString.call([]));//[object Array]
console.log(Object.prototype.toString.call(new Date));//[object Date]
console.log(Object.prototype.toString.call(/\d/));//[object RegExp]
function Person(){};
console.log(Object.prototype.toString.call(new Person));//[object Object]

onsole.log("jerry".toString());//jerry
console.log((1).toString());//1
console.log([1,2].toString());//1,2

// toString()方法返回反映这个对象的字符串
// Q: Object.prototype.toString.call(obj) 和 obj.toString() 返回结果不相同？
// A: toString为Object的原型方法，而Array 、Function等类型作为Object的实例，都重写了toString方法。不同的对象类型调用toString方法时，根据原型链的知识，调用的是对应的重写之后的toString方法（Function类型返回内容为函数体的字符串，Array类型返回元素组成的字符串.....），而不会去调用Object上原型toString方法（返回对象的具体类型）

var arr=[1,2,3];
console.log(Array.prototype.hasOwnProperty("toString"));//true
console.log(arr.toString());//1,2,3
delete Array.prototype.toString;//delete操作符可以删除实例属性
console.log(Array.prototype.hasOwnProperty("toString"));//false
console.log(arr.toString());//"[object Array]"

// 删除了Array的toString方法后，同样再采用arr.toString()方法调用时，不再有屏蔽Object原型方法的实例方法，因此沿着原型链，arr最后调用了Object的toString方法，返回了和Object.prototype.toString.call(arr)相同的结果。
// ----end扩展

Array.isArray(arr); // true or false 判断是否数组

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

let emptyObject = Object.freeze({}) // 冻结一个对象，不能修改和添加属性
function isUndef (v) { // 判断不为空
  return v === undefined || v === null
}

function isDef (v) { // 判断不为空
  return v !== undefined && v !== null
}
//(2)判断是否对象 
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}
//(3)判断是否promise
function isPromise (val) {
  return (
    isDef(val) && typeof val.then === 'function' && typeof val.catch === 'function'
  )
}

//(4) 转成数字
function toNumber (val) {
  var n = parseFloat(val)
  return isNaN(n) ? val : n
}

/**
   * Remove an item from an array.
   */
  function remove (arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item);
      if (index > -1) {
        return arr.splice(index, 1)
      }
    }
  }

  /**
   * Check whether an object has the property.
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
  }
  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   */
  function looseEqual (a, b) {
    if (a === b) { return true }
    var isObjectA = isObject(a)
    var isObjectB = isObject(b)
    if (isObjectA && isObjectB) {
      try {
        var isArrayA = Array.isArray(a)
        var isArrayB = Array.isArray(b)
        if (isArrayA && isArrayB) {
          return a.length === b.length && a.every(function (e, i) {
            return looseEqual(e, b[i])
          })
        } else if (a instanceof Date && b instanceof Date) {
          return a.getTime() === b.getTime()
        } else if (!isArrayA && !isArrayB) {
          var keysA = Object.keys(a)
          var keysB = Object.keys(b)
          return keysA.length === keysB.length && keysA.every(function (key){
            return looseEqual(a[key], b[key])
          })
        } else {
          return false
        }
      } catch (e) {
        return false
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b)
    } else {
      return false
    }
  }

  /**
   * Ensure a function is called only once.
   */
  function once (fn) {
    var called = false;
    return function () {
      if (!called) {
        called = true;
        fn.apply(this, arguments);
      }
    }
  }
