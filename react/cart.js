import React, { Component } from 'react'
import { Render } from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class AnimatedShoppingList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      items: [
        { id: 1, name: 'Milk' },
        { id: 2, name: 'Yogurt' },
        { id: 3, name: 'Orange Juice' }
      ]
    }
  }
  handleChange (evt) {
    if (evt.key === 'Enter') {
      let newItem = { id: Date.now(), name: evt.target.value }
      let newItems = this.state.items.contact(newItem)
      evt.target.value = ''
      this.setState({ items: newItems })
    }
  }
  handleRemove (i) {
    var newItems = this.state.items
    newItems.splice(i, 1)
    this.setState({items: newItems})
  }

  render () {
    let shoppingItems = this.state.items.map((item, i) => {
      <div key={item.id} className="item" onClick={this.handleRemove.bind(this, i)}>{item.name}</div>
    })
    return (
      <div>
        <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {shoppingItems}
        </ReactCSSTransitionGroup>
        <input type="text" value={this.state.newItem} onKeyDown={this.handleChange.bind(this)}/>
      </div>
    )
  }
}
render(<AnimatedShoppingList/>, document.getElementById('root'))

// .example-enter {
//   opacity: 0;
//   transform: translateX(-250px);
// }
// .example-enter.example-enter-active{
//   opacity: 1;
//   transform: transformX(0);
//   transition: .3s;
// }
// .example-leave {
//   opacity: 1;
//   transform: translateX(0);
// }
// .example-leave.example-leave-active{
//   opacity: 0;
//   transform: transformX(250px);
//   transition: .3s;
// }

// 路由：