// react.js

// 2.JSX：并没有将标记和逻辑进行分离
// 建议将JSX拆分多行，并包裹在括号中
// React DOM 使用 camelCase（小驼峰命名）来定义属性的名称，而不使用 HTML 属性名称的命名约定。
// 例如，JSX 里的 class 变成了 className，而 tabindex 则变为 tabIndex。

// 3.元素渲染
ReactDOM.render(element, document.getElementById('root'))

// 4.组件 & Props
// 组件名称必须以大写字母开头
// 所有React组件必须像纯函数一样保护它的props不更改

// 5.State & 生命周期
// State与props类似，但state私有的，完全受控于当前组件

function Clock (props) {
  return (
    <div>
      <h1>Hello, World!</h1>
      <h2>It is {props.date.toLocaleTimeString()}</h2>
    </div>
  )
}
// 将函数组件转换成class组件,这就使得我们可以使用如 state 或生命周期方法等很多其他特性。
class Clock extends React.Component {
  constructor (props) {
    super(props)
    this.state = { date: new Date(), posts: [] }
  }
  componentDidMount () {
    this.timerID = setInterval(() => {
      this.tick()
    }, 1000)
  }
  componentWillUnmount () {
    clearInterval(this.timerID)
  }
  tick () {
    this.setState({
      date: new Date()
    })
  }
  render () {
    return (
      <div>
        <h1>Hello, World!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}</h2>
      </div>
    )
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
)
// 正确地使用State,构造函数是唯一可以给this.state赋值的地方   this.setState({comment: 'Hello'})
// 出于性能考虑，React 可能会把多个 setState() 调用合并成一个调用。
// 因为 this.props 和 this.state 可能会异步更新，所以你不要依赖他们的值来更新下一个状态。
this.setState((state, props) => ({
  counter: state.counter + props.increment
}))

// 6.事件处理
// JSX语法需要传入一个函数作为事件处理函数，而不是一个字符串
// 阻止默认行为，必须显式的使用 preventDefault
// 注意this绑定

// 7.条件渲染
// 元素变量
// 与运算符 && 
function Mailbox (props) {
  const unreadMessages = props.unreadMessages
  return (
    <div>
      <h1>Hello</h1>
      {
        unreadMessages.length > 0 && 
        <h2>
          you have {unreadMessages.length} unread message
        </h2>
      }
    </div>
  )
}
const messages = ['React', 'Re:React', 'Re:Re: React']
ReactDOM.render(
  <Mailbox unreadMessages="message"/>,
  document.getElementById('root')
)
// 三目运算符
// 阻止组件渲染

// 8.列表渲染

// 10.状态提升??
// 11.组合和继承