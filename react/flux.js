// 当应用程序规模逐渐变大，如果将数据（以及更重要的回调函数）带入到嵌套组件中，并能通过回调函数来操作这些组件的数据？
// 这是引用flux的原因

// 什么是flux?
// facebook创建的一份针对构建Web应用程序的架构指引，它不是React的一部分。
// Flux要点是允许应用程序中存在单向数据流，它由三个基本部分组成：Action,Store和Dispatcher

// Store存放着所有应用程序的状态
// Action 包含一个type和一个可选的payload

// 示例
// constants.js
export default {
  CREATED_ACCOUNT: 'created account',
  WITHDREW_FROM_ACCOUNT: 'withdrew from account',
  DEPOSITED_INTO_ACCOUNT: 'deposited into account'
}
// AppDispatchers.js
import { Dispatcher } from 'flux'
// export default new Dispatcher()
class AppDispatcher extends Dispatcher {
  dispatch(action = {}) {
    console.log('Dispatched', action)
    super.dispatch(action)
  }
}
export default new AppDispatcher();

// Action创建器
import AppDispatcher from './AppDispatcher'
import bankConstants from './constants'

let BankActions = {
  /**
   * Create an account with an empty value
   */
  createAccount () {
    AppDispatcher.dispatch({
      type: bankConstants.CREATED_ACCOUNT,
      ammount: 0
    });
  },

  /**
   * @param {number} ammount to whithdraw
   */
  depositIntoAccount (ammount) {
    AppDispatcher.dispatch({
      type: bankConstants.DEPOSITED_INTO_ACCOUNT,
      ammount: ammount
    })
  },

  /**
   * @param {number} ammount to whithdraw
   */
  withdrawFromAccount (ammount) {
    AppDispatcher.dispatch({
      type: bankConstants.WITHDREW_FROM_ACCOUNT,
      ammount: ammount
    })
  }
}

export default BankActions;
// BankBalanceStore.js
import { EventEmitter } from 'fbemitter'
import AppDispatcher from './AppDispatcher'
import bankConstants from './constants'

const CHANGE_EVENT = 'change'
let _emitter = new EventEmitter()
let balance = 0;

let BankBalanceStore = {
  getState () {
    return balance;
  },
  addListener: (callback) => {
    return _emitter.addListener(CHANGE_EVENT, callback)
  }
}
BankBalanceStore.dispatchToken = AppDispatcher.register((action) => {
  switch (action.type) {
    case bankConstants.CREATED_ACCOUNT:
      balance = 0;
      _emitter.emit(CHANGE_EVENT)
      break;
    case bankConstants.DEPOSITED_INTO_ACCOUNT:
      balance = balance + action.ammount;
      _emitter.emit(CHANGE_EVENT)
      break;
    case bankConstants.WITHDREW_FROM_ACCOUNT:
      balance = balance - action.ammount;
      _emitter.emit(CHANGE_EVENT)
      break;
  }
})

export default BankBalanceStore;

// 应用程序组件从BankBalanceStore获取其state
import React, { Component } from 'react'
import { render } from 'react-dom'
import BankBalanceStore from './BankBalanceStore'
import BankActions from './BankActions'

class App extends Component {
  constructor (props) {
    super(props)
    BankActions.createAccount()
    this.state = {
      balance: BankBalanceStore.getState()
    }
  }
  componentDidMount () {
    this.storeSubscription = BankBalanceStore.addListener(
      data => this.handleStoreChange(data)
    )
  }

  componentWillUnmount () {
    this.storeSubscription.remove()
  }

  handleStoreChange () {
    this.setState({ balance: BankBalanceStore.getState()})
  }
  deposit () {
    BankActions.depositIntoAccount(Number(this.refs.ammount.value))
    this.refs.ammount.value = ''
  }
  withdraw () {
    BankActions.withdrawFromAccount(Number(this.refs.ammount.value))
    this.refs.ammount.value = ''
  }

  render () {
    return (
      <div>
        <header>FluxTrust Bank</header>
        <h1>Your balance is ${(this.state.balance).toFixed(2)}</h1>
        <div className="atm">
          <input type="text" placeholder="Enter Ammount" ref="ammount"/>
          <br/>
          <button onClick={this.withdraw.bind(this)}>Withdraw</button>
          <button onClick={this.deposit.bind(this)}>Deposit</button>
        </div>
      </div>
    )
  }
}
render(<App/>, document.getElementById('root'))
// Store, ReduceStore, MapStore
