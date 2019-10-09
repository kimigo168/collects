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

/**第三章  响应式系统的依赖收集追踪原理****/

// 订阅者 Dep
class Dep { 
  constructor () {
    // 用来存放watcher对象的数组
    this.subs = []
  }
  // 在subs中添加一个watcher对象
  addSub (sub) {
    this.subs.push(sub)
  }
  // 通知所有watcher对象更新视图
  notify () {
    this.subs.forEach((sub) => {
      sub.update();
    });
  }
}

// 观察者 Watcher
class Watcher {
  constructor () {
    Dep.target = this; // ??在new 一个Watcher对象时，将该对象赋值给Dep.target,在get中会用到
  }
  // 更新视图的方法
  update () {
    console.log(`视图更新了`)
  }
}
Dep.target = null;

// 依赖收集,修改defineReactive及Vue构造函数
function defineReactive (obj, key, val) {
  const dep = new Dep();
  
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      dep.target.addSub(Dep.target); // 将Dep.target（即当前的Watcher对象存入dep的subs中）
      return val;
    },
    set: function reactiveSetter (newVal) {
      if (newVal === val) return;
      /* 在set的时候触发dep的notify来通知所有的Watcher对象更新视图 */
      dep.notify();
    }
  });
}

class Vue {
  constructor (options) {
    this._data = options.data;
    observer(this._data);
    new Watcher(); // 新建一个Watcher对象，这时候Dep.target会指向这个Watcher对象
    /* 在这里模拟render的过程，为了触发test属性的get函数 */
    console.log('render~', this._data.test);
  }
}

/**** 第四章 实现虚拟Virtual DOM的下一个VNode ***** */

// 什么是VNode?
// 归根结底就是一个JavsScript对象,只要这个类的一些属性可以正确直观地清楚描述当前节点信息。

// Virtual DOM 是一棵以JavaScript对象（VNode节点）为基础的树，用对象属性来描述节点，实际上它只是一层真实DOM的抽象。
// 最终通过一些列操作使这棵树映射到真实环境上

class VNode {
  constructor (tag, data, children, text, elm) {
    this.tag = tag; // 当前节点的标签名
    this.data = data; // 当前节点的一些数据信息，比如props、attrs等数据
    this.children = children; // 当前节点的子节点，是一个数组
    this.text = text; // 当前节点的文本
    this.elm = elm; // 当前虚拟节点对应的真实dom节点
  }
}

<template>
  <span class="demo" v-show="isShow">
    This is a span.
  </span>
</template>

// 用js形式表现 render 函数
function render () {
  return new VNode (
    'span',
    {
      /***指令集合数组****/
      directives: [
        {
          /**** v-show指令 ***/
          rawName: 'v-show',
          expression: 'iShow',
          name: 'show',
          value: true
        }
      ],
      /***** 静态class ****/
      staticClass: 'demo'
    },
    [new VNode(undefined, undefined, undefined, 'This is a span.')] // children
  );
}

// 转换成VNode以后
{
  tag: 'span',
  data: {
    /* 指令集合数组 */
        directives: [
            {
                /* v-show指令 */
                rawName: 'v-show',
                expression: 'isShow',
                name: 'show',
                value: true
            }
        ],
        /* 静态class */
        staticClass: 'demo'
  },
  text: undefined,
  children: [
    /* 子节点是一个文本VNode节点 */
    {
      tag: undefined,
      data: undefined,
      text: 'This is a span.',
      children: undefined
    }
  ]
}

// 创建一个空节点
function createEmptyNode () {
  const node = new VNode();
  node.text = '';
  return node;
}

// 创建一个文本节点
function createTextNode (val) {
  return new VNode(undefined, undefined, undefined, String(val));
}

// 克隆一个VNode节点

function cloneVNode (node) {
  const cloneVNode = new VNode(
    node.tag,
    node.data,
    node.children,
    node.text,
    node.elm
  );
  return cloneVnode;
}

// 总的来说，VNode 就是一个 JavaScript 对象，用 JavaScript 对象的属性来描述当前节点的一些状态，用 VNode 节点的形式来模拟一棵 Virtual DOM 树。

/****** 第五章 template 模板是怎样通过 Compile 编译的Compile ***** */

/****** 第六章 数据状态更新时的差异diff及patch(补丁)机制 ******/
// 数据更新视图

// 对model进行操作时,会触发对应Dep中的watcher对象,watcher对象会调用相应的update来修改视图
// 最终将更新产生的VNode节点和老的VNode进行一个patch过程,对比得到差异,最终将这些差异更新到视图
const nodeOps = {
  setTextContent(text) {
    if (platfrom === 'weex') {
      node.parentNode.setAttr('value', text);
    } else if (platfrom === 'web') {
      node.textContent = text;
    }
  },
  parentNode(){},
  removeChild(){},
  nextSibling(){},
  insertBefore(){}
}
/**
 * insert 用来在 parent 这个父节点下插入一个子节点
 */
function insert (parent, elm, ref) {
  if (parent) {
    if (ref) { // 指定了ref,则插入到ref这个子节点前面
      if (ref.parentNode === parent) {
        nodeOps.insertBefore(parent, elm, ref)
      }
    } else {
      nodeOps.appendChild(parent, elm)
    }
  }
}
/**
 * createElm用来新建一个节点
 */
function createElm (vnode, parentElm, refElm) {
  if (vnode.tag) { // tag 存在创建一个标签节点
    insert(parentElm, nodeOps.createElement(vnode.tag), refElm);
  } else { // 创建一个文本节点
    insert(parentElm, nodeOps.createTextNode(vnode.text), refElm);
  }
}
/**
 * addVnodes 来批量调用createElm新建节点
 */
function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], parentElm, refElm);
  }
}
/**
 * removeNode 移除一个节点
 */
function removeNode (el) {
  const parent = nodeOps.parentNode(el);
  if (parent) {
    nodeOps.removeChild(parent, el);
  }
}
/**
 * removeVnodes 会批量调用removeNode移除节点
 */
function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx];
    if (ch) {
      removeNode(ch.elm);
    }
  }
}

// patch(打补丁)

// patch的核心diff算法,我们用diff算法对比出两棵树的差异
// diff算法是通过同层的树节点进行比较而非对树进行逐层搜索遍历的方式,所以时间复杂度只有
// O(n),是一种相当高效的算法

function patch (oldVnode, vnode, parentElm) {
  if (!oldVnode) {
    addVnodes(parentElm, null, vnode, 0, vnode.length - 1);
  } else if (!vnode) {
    removeVnodes(parentElm, oldVnode, 0, oldVnode.length - 1)
  } else {
    if (sameVnode(oldVNode, vnode)) {
      patchVnode(oldVNode, vnode);
    } else {
      removeVnodes(parentElm, oldVnode, 0, oldVnode.length - 1);
      addVnodes(parentElm, null, vnode, 0, vnode.length - 1);
    }
  }
}

/**** 第七章 批量异步更新策略及nextTick原理 *****/
// 修改data中数据后,setter -> Dep -> Watcher -> patch ->视图
