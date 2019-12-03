// 1.render函数return如果没有使用（）会有什么问题？
// 使用JSX语法书写react代码时，babel会将JSX语法编译成js，同时会在每行自动添加分号（；）如果return后换行了，那么就会变成 return； 一般情况下会报错。
// 为了代码可读性我们一般会在return后面添加括号这样代码可以折行书写

// 2.componentWillUpdate可以直接修改state的值吗？
// react组件在每次需要重新渲染时候都会调用componentWillUpdate()
// 在这个函数中我们之所以不调用this.setState()是因为该方法会触发另一个componentWillUpdate(),如果我们componentWillUpdate()中触发状态更改,我们将以无限循环结束.

// 3.说说你对React的渲染原理的理解？

// 4.什么是渲染劫持？
// 渲染劫持的概念是控制组件从另一个组件输出的能力，当然这个概念一般和react中的高阶组件（HOC）放在一起解释比较有明了。
// 高阶组件可以在render函数中做非常多的操作，从而控制原组件的渲染输出，只要改变了原组件的渲染，我们都将它称之为一种渲染劫持。
// 实际上，在高阶组件中，组合渲染和条件渲染都是渲染劫持的一种，通过反向继承，不仅可以实现以上两点，还可以增强由原组件render函数产生的React元素。

// 实际的操作中 通过 操作 state、props 都可以实现渲染劫持

// 5.react Intl国际化

// 6.说说context有哪些属性？
// Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。
// 在平时开发中如果不使用redux 这种数据状态管理库，可能在数据传递的时候使用的就是从祖先元素层层传递的方式，当层级较多之后，我们需要将数据通过组件的props接口层层传递，层级如果嵌套太深，总会容易出错。Context 就是为了解决这个问题而出现的。

// 7.为什么React并不推荐我们优先考虑使用Context？
// 1、Context目前还处于实验阶段，可能会在后面的发行版本中有很大的变化，事实上这种情况已经发生了，所以为了避免给今后升级带来大的影响和麻烦，不建议在app中使用context。
// 2、尽管不建议在app中使用context，但是独有组件而言，由于影响范围小于app，如果可以做到高内聚，不破坏组件树之间的依赖关系，可以考虑使用context
// 3、对于组件之间的数据通信或者状态管理，有效使用props或者state解决，然后再考虑使用第三方的成熟库进行解决，以上的方法都不是最佳的方案的时候，在考虑context。
// 4、context的更新需要通过setState()触发，但是这并不是很可靠的，Context支持跨组件的访问，但是如果中间的子组件通过一些方法不影响更新，比如 shouldComponentUpdate() 返回false 那么不能保证Context的更新一定可以使用Context的子组件，因此，Context的可靠性需要关注。

// 8.除了实例的属性可以获取Context外哪些地方还能直接获取Context呢？
// 构造函数 constructor(props,context)
// 生命周期 componentWillReceiveProps(nextProps,nextContext)
// shouldComponentUpdate(nextProps,nextState,nextContext)
// componentWillUpdate(nextProps,nextState,nextContext)

// 9.childContextTypes是什么？它有什么用？
// 10.contextType是什么？它有什么用？
// 11.有使用过Consumer吗？
// 12.React15和16别支持IE几以上？
// React15 版本不直接支持IE8 浏览器的，官方文档中说React16 中依赖于集合类型Map 和 Set 因此不再支持IE 11 以下的浏览器，如果想要支持，需要使用全局的 polyfill

// 13.说说你对windowing的了解 
// 展示长列表
// 如果你的应用会渲染大量的列表数据，我们建议使用一种称为‘windowing’的技术，这种技术下在任何给定的时间内只会渲染一小部分数据列表，并可以减少列表项的重复渲染（即再次渲染已经渲染过的数据）。

// react-window和react-virtualized都是流行的使用windowing技术的库，他们都提供了一系列可重用的组件，这些组件能够帮助你以最好的性能展示列表以及表格数据

// 14.举例说明React的插槽有哪些运用场景？
// 1、首先简单的介绍下react中的插槽（Portals），通过ReactDOM.createPortal(child, container)创建，是ReactDOM提供的接口，可以实现将子节点渲染到父组件DOM层次结构之外的DOM节点。
// 2、第一个参数（child）是任何可渲染的 React 子元素，例如一个元素，字符串或 片段(fragment)。第二个参数（container）则是一个 DOM 元素。
// 3、对于 portal 的一个典型用例是当父组件有 overflow: hidden 或 z-index 样式，但你需要子组件能够在视觉上 “跳出(break out)” 其容器。例如，对话框、hovercards以及提示框。所以一般react组件里的模态框，就是这样实现的。

// 15.React如何进行代码拆分？拆分的原则是什么？

// 16.React组件的构造函数有什么作用？
// 在react的新的写法中，每一个组件都是一个类，这个很符合es6的语法规范，在es6中要想创建一个对象，就要调用相应的构造函数, react的组件渲染有两种情况，第一种情况是第一次渲染，第二种情况是状态更新时候重新渲染,构造函数在组件的初次渲染中只会运行一次，构造函数里进行的操作一般有三种用途：

// 1、指定this --> super(props)
// 2、设置初始化的状态 --> this.setState({});
// 3、为组件上的构造函数绑定this

// 17.在React中你有经常使用常量吗？
// 在写react应用的时候，在结合redux 处理react 应用层中的数据层的时候, 会单独写一个actionType文件，这个文件中定义的都是常量，这样写的好处是，单纯的引入字符串内容，容易出错且很难排查，中间做这个文件做一个过渡，就是这种引用常量的方式

// 18.你有用过哪些React的表单库吗？说说它们的优缺点
// antd
// 19.如果组件的属性没有传值，那么它的默认值是什么？

// 20.`super()`和`super(props)`有什么区别？
// react 中的class 是基于es6的规范实现的, 继承是使用extends关键字实现继承的，子类必须在constructor()中调用super() 方法否则新建实例
// 就会报错，报错的原因是 子类是没有自己的this对象的，它只能继承父类的this对象，然后对其进行加工，而super()就是将父类中的this对象继承给子类的，没有super() 子类就得不到this对象。

// 如果你使用了constructor就必须写super() 这个是用来初始化this的，可以绑定事件到this上
// 如果你想要在constructor中使用this.props,就必须给super添加参数 super(props)
// 注意，无论有没有 constructor，在render中的this.props都是可以使用的，这是react自动附带的
// 如果没有用到constructor 是可以不写的，react会默认添加一个空的constroctor.

// 21.你有使用过loadable组件吗？它帮我们解决了什么问题？
// 用于代码分割的高阶组件,使用异步组件解决组件加载速度

// 22.你有使用过suspense组件吗？它帮我们解决了什么问题？
// 动态加载(异步组件)加载时候会有延迟,在这延迟期间可以将一些内容展示给用户,比如loading

// 23.怎样动态导入组件？
// 自己使用 import 和 async/await 实现的异步组件
// React.lazy
// 开源库 react-loadable 库/react-lazyload 库
// babel 动态导入（Dynamic Import）