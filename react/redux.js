import { createStore } from 'redux'
function counter (state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state;
  }
}
// 创建Redux store来存放应用的状态
// API 是 { subscribe, dispatch, getState }
let store = createStore(counter)
// 可以手动订阅更新，也可以事件绑定到视图层
store.subscribe(() => {
  console.log(store.getState())
})
// 改变内部state唯一方法是dispatch 一个action
store.dispatch({type: 'INCREMENT'})
store.dispatch({type: 'INCREMENT'})
store.dispatch({type: 'DECREMENT'})

// 编写专门的函数来决定每个action如何改变应用的state,这个函数叫reducer

// redux试图让state变化变得可预测
// state：一个对象

// Action是一个普通得javascript对象，用来描述发生了些什么。示例：
// { type: 'ADD_TODO', text: 'Go to swimming pool'}
// {type: 'TOGGLE_TODO', index: 1}

// 把action和state串起来，开发一些函数，就是reducer
// reducer只是接收state和action,并返回新的state函数

// 对于大应用来说，可以编写很多个小函数来分别管理state的一部分

function visibilityFilter (state = 'SHOW_ALL', action) {
  if (action.type === 'SET_VISIBILITY_FILER') {
    return action.filter
  } else {
    return state
  }
}

function todos (state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([{text: action.text, completed: false}])
    case 'TOGGLE_TODO':
      return state.map((todo, index) => {
        action.index === index ? {text: todo.text, completed: !todo.completed} : todo
      })
    default: 
      return state;
  }
}

function todoApp (state = {}, action) {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action)
  }
}