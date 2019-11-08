// getState() 获取state
// dispatch(action)  更新state
// subscribe(listener) 注册监听器
// subscribe(listener) 返回函数注销监听器

import { createStore } from 'redux'
import todoApp from './reducers'
let store = createStore(todoApp)