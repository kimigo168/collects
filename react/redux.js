// action 是把数据从应用传到store的有效载荷，它是store数据的唯一来源，一般通过store.dispatch()来将action传到store

// 当应用规模越来越大，建议使用单独的模块或文件来存action
import { ADD_TODO, REMOVE_TODO } from './actionTypes'

// action创建函数，只是简单的返回一个action
function addTodo (text) {
  return {
    type: 'ADD_TODO',
    text
  }
}
// Redux 中只需把 action 创建函数的结果传给 dispatch() 方法即可发起一次 dispatch 过程
dispatch(addTodo(text))
// 或者创建一个被绑定的action创建函数来自动dispatch
const boundAddTodo = text => dispatch(addTodo(text))
boundAddTodo(text)

// bindActionCreators可以自动把多个action创建函数绑定到dispatch()方法上

// TodoActionCreators.js
export function addTodo (text) {
  return {
    type: 'ADD_TODO',
    text
  }
}

export function removeTodo (id) {
  return {
    type: 'REMOVE_TODO',
    id
  }
}
// SomeComponent.js
import { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as  TodoActionCreators from './TodoActionCreators'

class TodoListContainer extends Component {
  constructor (props) {
    super(props)
    const {dispatch} = props;

    this.boundActionCreators = bindActionCreators(TodoActionCreators, dipatch)
    console.log(this.boundActionCreators)
    // {
    //   addTodo: Function,
    //   removeTodo: Function
    // }
  }
  componentDidMount () {
    // 由react-redux注入的dispatch
    let { dispatch } = this.props
    let action = TodoActionCreators.addTodo('Use Redux')
    dispatch(action)
  }

  render () {
    // 由react-redux注入的todos
    let {todos} = this.props
    return (<TodoList todos={todos} {...this.boundActionCreators} />)
    // return <TodoList todos={todos} dispatch={dispatch} />;
  }
}
export default connect(
  state => ({todos: state.todos})
)(TodoListContainer)

// Reducer 指定了应用状态的变化如何响应actions并发送到store的，action只是描述了有事情发生的这一事实，并没有描述应用如何更新state
// (previousState, action) => newState
// 保持 reducer 纯净非常重要

// eg:
const state = {
  todos: [{text: 'eat food', completed: true}, {text: 'Exercise', completed: false}],
  visibilityFilter: 'SHOW_COMPLETED'
}
// action示例
// {type: 'ADD_TODO', text: 'go to swimming pool'}
// {type: 'TOGGLE_TODO', index: 1}
// {type: 'SET_VISIBLITY_FILTER', filter: 'SHOW_ALL'}

// reducers:
function visibilityFilter (state = 'SHOW_ALL', action) {
  if (action.type === 'SET_VISIBILITY_FILTER') {
    return action.filter
  } else {
    return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([{ text: action.text, completed: false }]);
    case 'TOGGLE_TODO':
      return state.map((todo, index) =>
        action.index === index ? { text: todo.text, completed: !todo.completed } : todo
      )
    default:
      return state
  }
}

// 合并上面两个reducer
function todoApp (state = {}, action) {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action)
  };
}