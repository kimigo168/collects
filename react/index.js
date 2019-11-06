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

// 在JSX类型中使用点语法
import React from 'react'
const MyComponents = {
  DatePicker: function DatePicker (props) {
    return <div>Imagine a {props.color} datepicker here.</div>
  }
}

function BlueDatePicker () {
  return <MyComponents.DatePicker color="blue" />
}

function App1 () {
  return <Greeting firstName="Ben" lastName="Hector"/>
}

function App2 () {
  const props = { firstName: 'Ben', lastName: 'Hector'}
  return <Greeting {...props} />
}

// Hook
// 什么是hook?Hook是一些可以让你在函数组件里“钩入” React state及生命周期等特性的函数

import React, { useState } from 'react'
function Example () {
  // 声明一个叫count的state变量
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}

// Flux
// 建立客户端web应用的前端架构，它通过利用一个单向数据流补充了React的组合视图组件，更是一种模式
// 三部分：Dispatcher调度，存储Store和视图View(React 组件)

// 《react实战开发》
// 事件：
// onTouchStart onTouchMove onTouchEnd onClick onMouseDown
// JSX特性：
// 1.标签特性采用驼峰大小写
// 2.所有元素必须闭合
// 3.特性名称基于DOM API
// 4.JSX不能使用if,但可以使用三元表达式
render () {
  return (
    <div className={condition?"salutation":""}>Hello JSX</div>
  )
}
// 或将条件外置
render () {
  let className;
  if (condition) {
    className = 'salutation'
  }
  return (
    <div className={className}>Hello JSX</div>
  )
}

// 不用JSX可以用React.createElement()
// React.DOM  工厂函数
React.DOM.form({className: 'commentForm'},
  React.DOM.input({type: 'text', placeholder: 'Name'})
)
let { form, input} = React.DOM
// 自定义工厂

/**
 * 定义内联样式
 */
// 样式名称采取驼峰式大小写规则,此外不需要添加px单位 ，如何使用scss,styl等
import React, { Component } from 'react'
import { render } from 'react-dom'

class Hello extends Component {
  render () {
    let divStyle = {
      width: 100,
      height: 30,
      padding: 5,
      backgroundColor: '#ee9900'
    }
    return <div style={divStyle}>Hello World</div>
  }
}

// form控件输入
class Search extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchTerm: 'React'
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    this.setState({ searchTerm: event.target.value.substr(0, 50) })
  }

  render () {
    return (
      <div>
        Search Term:
        <input type="search" value={this.state.searchTerm} onChange={this.handleChange}/>
        <textarea value={this.state.searchTerm}></textarea>
      </div>
    )
  }
}
// 非受控组件
handleSubmit (event) {
  console.log('Submitted values are:', event.target.name.value, event.target.email.value, event.target )
  event.preventDefault()
}
render () {
  return (
    <form onSubmit={this.handleSubmit}>
      <div className="formGroup">
        Name: <input name="name" type="text"/>
      </div>
      <div className="formGroup">
        E-mail: <input name="email" type="email"/>
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}
// p57
// 检验组件属性
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'

class Greeter extends Component {
  render () {
    return (
      <h1>{this.props.salutation}</h1>
    )
  }
}
Greeter.protoTypes = {
  salutation: PropTypes.string.isRequired
}
Greeter.defaultProps = {
  salutation: 'Hello World'
}
render(<Greeter salutation="Hello world"/>, document.getElementById('root'))

// P69
import React, { Component, PropTypes } from 'react' 
import { render } from 'react-dom'

class ContactsApp extends Components {
  constructor (props) {
    super(props)
    this.state = {
      filterText: ''
    }
  }
  handleUserInput (searchTerm) {
    this.setState({filterText: searchTerm})
  }
  render () {
    return (
      <div>
        <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput.bind(this)} />
        <ContactList contacts={this.props.contacts} filterText={this.state.filterText} />
      </div>
    )
  }
}
ContactsApp.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object)
}

class SearchBar extends Component {
  handleChange (event) {
    this.props.onUserInput(event.target.value)
  }
  render () {
    return (<input type="search" placeholder="search" value={this.props.filterText} onChange={this.handleChange.bind(this)} />)
  }
}

SearchBar.propTypes = {
  onUserInput: PropTypes.func.isRequired,
  filterText: PropTypes.string.isRequired
}

class ContactList extends Component {
  render () {
    let filteredContacts = this.props.contacts.filter(
      (contact) => contact.name.indexOf(this.props.filterText) !== -1
    )
    return (
      <ul>
        {filteredContacts.map((contact) => <ContactItem key={contact.email} name={contact.name} email={contact.email}/>)}
      </ul>
    )
  }
}
ContactList.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object),
  filterText: PropTypes.string.isRequired
}

class ContactItem extends Component {
  render () {
    return <li>{this.props.name} - {this.props.email}</li>
  }
}
ContactItem.propTypes = {
  name: PropType.string.isRequired,
  email: PropType.string.isRequired
}
let contacts = [
  { name: 'Cassio Zen', email: 'cassiozen@gmail.com'},
  { name: 'Dan Abramov', email: 'gsds@somewhere.com'}
]
render(<ContactApp contacts={contacts} />, document.getElementById('root'))

// 错误方式：
let updatedPassengers = this.state.passengers; // 引用
updatedPassengers.push('Mitchell, Vincent M')
this.setState({passengers: updatedPassengers}) // 实际上是直接修改的state
// 采用非入侵方式，map, filter, contact,返回新的数组
// 正确方式
let updatedPassengers = this.state.passengers.contact('Mitchell, Vincent M.')
this.setState({passengers: updatedPassengers})
// 或者采用Object.assign
let updatedTicket = Object.assign({}, this.state.ticket, {flightNo: '10002'})
this.setState({ticket: updatedTicket})

// 深度副本耗性能
// react不变性助手，react-addons-update,函数不会修改这些对象，而是总返回一个新的可变对象
import update from 'react-addons-update'
let newTicket = update(originalTicket, { arrival: {airport: {$set: 'MCO'}}})
// 只有新的newTicket变化了，originalTicket不变
// 第三章
// 组件分类：有状态组件（包含内部state）和单纯组件（没有内部state,只显示通过props接收到的数据）

// ReactCSSTransitionGroup，它以插件的形式提供动画过渡效果
// npm install --save react-addons-css-transition-group

// p254