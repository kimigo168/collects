// IIFE(Immediately-Invoked Function Expression) 立即调用的函数表达式
// 闭包写法：
// (1) !function () {} (); 或 ;function () {}()
// (2) (function () {}())

// 参数输入：
// JavaScript 有一个特性叫做隐式全局变量（implied globals），当使用一个变量名时，JavaScript 解释器将反向遍历作用域链来查找变量的声明，如果没有找到，就假定该变量是全局变量。这种特性使得我们可以在闭包里随处引用全局变量，比如 jQuery 或 window。然而，这是一种不好的方式。

// 考虑模块的独立性和封装，对其它对象的引用应该通过参数来引入。如果模块内需要使用其它全局对象，应该将这些对象作为参数来显式引用它们，而非在模块内直接引用这些对象的名字。以jq为例：
;(function (q, w) {
  // q is jQuery
  // w is window
  // 局部变量及代码
  // 返回
})(jQuery, window)

// 代码兼容CommonJS Modules 和 AMD风格
var MODULE = (function () {
  var my = {}
  if (typeof define === 'function') {
    define(function () { return my; });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = my
  }
  return my;
}());

// jQuery的写法:
if (typeof module === 'object' && module && typeof module.exports === 'object') {
  module.exports = jQuery
} else {
  if (typeof define === 'function' && define.amd) {
    define('jquery', [], function () {return jQuery;});
  }
}
if (typeof window === 'object' && typeof window.document === 'object') {
  window.jQuery = window.$ = jQuery // 将 jQuery 注册成了 window 对象的成员
}
// 但如果我们所写的是一个通用的库，就不应使用 window 对象了，而应该使用全局对象，而这一般可以使用 this 来得到。
// Mustache
(function (root, factory) {
  if (typeof exports === 'object' && exports) {
    factory(exports) // CommonJS
  } else {
    var mustache = {}
    factory(mustache)
    if (typeof define === 'function' && define.amd) {
      define(mustache) // AMD
    } else {
      root.Mustache = mustache // script
    }
  }
}(this, function (mustache){
  // 模块的主要代码放在这里
}))
// 两个匿名函数，后面那个看作是模块代码的工厂函数，它是模块的主题部分；前面那个函数对运行环境进行检测，根据检测结果对模块的工厂函数进行调用。另一个，作为一个通用库，它并没使用 window 对象，而是使用了 this，因为在简单的函数调用中，this 其实就是全局对象。
// (0, eval)('this') // 得到global对象

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = global || self, global.Vue = factory())
}(this, function () {
  'use strict'
}))

  // 创建函数缓存
  function cached (fn) {
    var cache = Object.create(null)
    return (function cachedFn (str) {
      var hit = cache[str]
      return hit || (cache[str] = fn(str))
    })
  }
// 应用：高阶函数，函数柯里化，js闭包，
// 原理解析：
var fk = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
var cacheFk = cached(fk)
// 1 step
cacheFk('ui')
// 2 step
cacheFk('ui')
// 原理函数闭包
// 1 step 把 执行 函数 得到结果 result, 并且 此时 把 ‘ui’作为key, reault 作为value, 放到 cache 对象里， 2 step 再调 这个函数， 结果直接 取 chche['ui'] ,及相当于少走一步 fk 函数。起到缓存的作用

// P620 看不懂
// formatComponentName?

var uid = 0
// 订阅
/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
}

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub)
}

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub)
}

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this)
  }
}

Dep.prototype.notify = function notify () {
  var subs = this.subs.splice()
  if (!config.async) {
    subs.sort(function (a, b) {
      return a.id - b.id
    })
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update()
  }
}

Dep.target = null;
var targetStack = [];

function pushTarget (target) {
  targetStack.push(target);
  Dep.target = target;
}

function popTarget () {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}