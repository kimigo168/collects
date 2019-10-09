// 1.1编译原理
// 分词/词法分析，解析/语法分析，代码生成

// 抽象语法树（AST）
// 代码生成：将AST转换为可执行代码（一组机器指令）的过程
// javascript引擎 JIT

// 1.2作用域
// (赋值操作的目标是谁)LHS （谁是赋值操作的源头）RHS：retrieve his source value

// 1.3作用域嵌套

// 1.4异常 
// 如果RHS查询时无法找到该变量，一个未声明的变量，报ReferenceError
// 严格模式禁止自动或隐式地创建全局变量，也会报类似ReferenceError
// RHS查找到一个变量，进行了不合理地操作，比如试图对一个非函数类型的值进行函数调用，或着引用 null 或 undefined 类型的值中的属性，那么引擎会抛出另外一种类型的异常，叫作 TypeError

// ReferenceError同作用域判别失败相关，而TypeError则代表作用域判别成功了，但对结果的操作是非法的不合理的。

// 小结
// 作用域是一套规则，用于确定在何处以及如何查找变量（标识符）。


// this指向

// this的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式
// this既不指向函数自身，也不指向函数的词法作用域
// this 实际上是在函数被调用时发生的绑定，它指向什么完全取决于函数在哪里被调用。

function foo () {
  console.log(this.a)
}
var obj = {
  a: 2,
  foo: foo
}
var bar = obj.foo; // 虽然 bar 是 obj.foo 的一个引用，但是实际上，它引用的是 foo 函数本身
var a = 'oop, global';
bar(); // oop, global

// lizi
function foo () {
  console.log(this.a)
}
var obj = {
  a: 2,
  foo: foo
}
var a = 'oops, global';
setTimeout(obj.foo, 100); // 'oops, global'
// 回调函数丢失 this 绑定是非常常见的

// eg:
// 硬绑定
function foo () {
  console.log(this.a)
}
var obj = {a: 2}
var bar  = function () {
  foo.call(obj);
}
bar(); // 2
bar.call(window); // 2 硬绑定的 bar 不可能再修改它的 this

// new 是最后一种可以影响函数调用时 this 绑定行为的方法，我们称之为 new 绑定
function foo(a) {
  this.a = a;
}
var bar = new foo(2);
console.log( bar.a ); // 2

// eg:
function foo() {
  console.log( this.a );
}
var obj1 = {
  a: 2,
  foo: foo
};
var obj2 = {
  a: 3,
  foo: foo
};
obj1.foo(); // 2
obj2.foo(); // 3
obj1.foo.call( obj2 ); // 3
obj2.foo.call( obj1 ); // 2
// 显式绑定优先级更高
// 可以看到 new 绑定比隐式绑定优先级高
// new 和 call/apply 无法一起使用，因此无法通过 new foo.call(obj1) 来直接测试
p108
function foo(something) {
  this.a = something;
}
var obj1 = {};
var bar = foo.bind(obj1)
bar(2)
console.log(obj1.a)//2
var baz = new bar(3);
console.log(ob1.a); // 2;
console.log(baz.a); // 3
// new 修改了硬绑定（到 obj1 的）调用 bar(..) 中的 this

// 部分应用，柯里化??
function foo (p1, p2) {
  return p1 + p2;
}
var bar = foo.bind(null, 'p1');
console.log("bar('p2')", bar('p2'));
// 为什么这里结果是p1p3？是说传的'p1'，'p3'已经满足foo传的两个参数条件了，下面
// new bar('p2')再传递'p2'就不影响了？

// 小结：this
// 1.函数是否在new中调用（new绑定）？如果是的话this绑定的是新创建的对象
var bar = new foo();
// 2.函数是否通过call,apply(显示绑定)或者硬绑定调用？如果是,this绑定的是指定的对象。
var bar = foo.call(obj2)
// 3.函数是某个上下文中调用（隐式绑定）？如何是的话，this绑定的是那个上下文对象
var bar = obj1.foo();
// 4.如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到 undefined，否则绑定到
// 全局对象。
var bar = foo()

// 柯里化基本是在做这么一件事情：只传递给函数一部分参数来调用它，
// 让它返回一个函数去处理剩下的参数。

// 偏函数
// p111?

// 间接引用
function foo () {
  console.log(this.a)
}
var a = 2;
var o = {a: 3, foo: foo};
var p = {a: 4}
o.foo(); // 3
(p.foo = o.foo)(); // 2
// p.foo = o.foo返回的是目标函数的引用，因此调用位置是foo()而不是p.foo()或者o.foo()
// 默认绑定
// 注意：对于默认绑定来说，决定 this 绑定对象的并不是调用位置是否处于严格模式，而是
// 函数体是否处于严格模式。如果函数体处于严格模式，this 会被绑定到 undefined，否则
// this 会被绑定到全局对象。

// 箭头函数不使用this的四种标准规则，而是根据外层（函数或全局）作用域来决定this
function foo () {
  return (a) => {
    console.log(this.a); // this 继承自foo
  }
}
var obj1 = {a: 2}
var obj2 = {a: 3}
var bar = foo.call(obj1);
bar.call(obj2); // 2,不是3
// 由于 foo() 的 this 绑定到 obj1，
// bar（引用箭头函数）的 this 也会绑定到 obj1，箭头函数的绑定无法被修改。
typeof null // object

// 可计算名属性
var prefix = 'foo'
var myObject= {
  [prefix + 'bar']: 'hello',
  [prefix + 'baz']: 'world'
}
// 浅拷贝，深拷贝
// 对于JSON安全的对象,通过JSON.parse(JSON.stringify(someObj))
// 浅拷贝
// ES6 Object.assign(...)

Object.defineProperty(
  myObject, // 目标对象
  'b', // 属性名
  {
    get: function () {},
    enumerable: true
  }
)
// 存在性
Object.prototype.hasOwnProperty()
(b in myObject)

// forEach vs map
// es6新增 for of
// 类的继承,多态,混入,
// P141

