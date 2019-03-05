// vue内部运行机制
// 1.编译：compile: 
//parse： 会用正则等方式解析 template 模板中的指令、class、style等数据，形成AST。
// optimize： 是标记 static 静态节点，这是 Vue 在编译过程中的一处优化，后面当 update 更新界面时，会有一个 patch 的过程， diff 算法会直接跳过静态节点
// generate：是将 AST 转化成 render function 字符串的过程，得到结果是 render 的字符串以及 staticRenderFns 字符串。

// 2.响应式
// 定义cb函数，模拟视图更新
function cb(val) {
  console.log('视图更新')
}
function defineReactive (obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      return val;
    },
    set: function reactiveSetter (newVal) {
      if (newVal === val) return;
      cb(newVal)
    }
  });
}
// 观察：
function observer (value) {
  if (!value || (typeof value !== 'object')) {
    return;
  }
  Object.keys(value).forEach((key) => {
    defineReactive(value, key, value[key])
  });
}

class Vue {
  constructor(options) {
    this._data = options.data;
    observer(this._data)
  }
}

let o = new Vue({
  data: {
    test: 'I am test!'
  }
});
o._data.test = 'Hello world'; // 视图更新啦