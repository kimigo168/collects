import React, { Component } from 'react' 
import { render } from 'react-dom'

import About from './About'
import Home from './Home'
import Repos from './Repos'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      route: window.location.hash.substr(1)
    }
  }

  componentDidMount () {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: window.location.hash.substr(1)
      })
    })
  }

  render () {
    var Child
    switch (this.state.route) {
      case '/about': 
        Child = About;
        break;
      case '/repos':
        Child = Repos;
        break;
      default:
        Child = Home
    }
    return (
      <div>
        <header>App</header>
        <menu>
          <ul>
            <li><a href="#/about">About</a></li>
            <li><a href="#/repos">Repos</a></li>
          </ul>
        </menu>
        <Child/>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))

// Home组件
import React, { Component } from 'react'
class Home extends Component {
  render () {
    return (
      <h1>HOME</h1>
    )
  }
}

// React Router实现
import React, { Component } from 'react'
import { render } from 'react-dom'

import { Router, Route, Link } from 'react-router'

import About from './About'
import Home from './Home'
import Repos from './Repos'

class App extends Component {
  render () {
    return (
      <div>
        <header>App</header>
        <menu>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/repos">Repos</Link></li>
          </ul>
        </menu>
        {this.props.children}
      </div>
    )
  }
}

render((
  <Router>
    <Route path="/" components={App}>
      <Route path="about" components={App}/>
      <Route path="repos" components={Repos}/>
    </Route>
  </Router>
), document.getElementById('root'))

// 命名组件，在设置路由时，声明一个或多个命名组件
React.render((
  <Router>
    <Route path="groups" components={{content: Groups, sidebar: GroupSidebar}}/>
    <Route path="users" components={{content: Users, sidebar: UsersSidebar}}/>
  </Router>
), element)

{/* <IndexRoute /> */}
// React Router 的 hash模式和history模式
// 单页应用URL都是浏览器动态生成的，它们并非对应于服务器上真实路径，因此用户直接使用这些URL来访问服务器，很可能返回一个"页面未找到的错误"
// 要使用浏览器的history配置，需要使用服务器的rewrite配置，当用户直接访问某个路径时，服务器就会提供首页，然后React Router就会根据URL渲染出正确的视图

// 要使用history设置，需要从History库导入createBrowserHistory方法，如下：
import React, { Component } from 'react'
import { Render } from 'react-dom'

import { Router, Route, IndexRoute, Link } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory' 

import About from './About'
import Repos from './Repos'

import ReopDetails from './RepoDetails'
import Home from './Home'
import ServerError from './ServerError'

class App extends Components {...}
render((
  <Router history={createBrowserHistory()}>
    <Route path="/"></Route>

  </Router>
))

// 方法一
// react router
React.render((
  <Router>
    <Route path="/" component={App}>
      <Route path="about" component={About}/>
      <Route path="inbox" component={Inbox}/>
    </Route>
  </Router>
), document.body)

// 方法二
const routes = {
  path: '/',
  component: App,
  childRoutes: [
    { path: 'about', component: About },
    { path: 'inbox', component: Inbox }
  ]
}
React.render(<Router routes={routes} />, document.body)

// eg:
const Message = React.createClass({
  render () {
    return <h3>Message</h3>
  }
})

const Inbox = React.createClass({
  render () {
    <div>
      <h2>Inbox</h2>
      {/* 渲染这个child路由组件 */}
      {this.props.children || 'Welcome to your Inbox'}
    </div>
  }
})
const App = React.createClass({
  render() {
    return (
      <div>
        <h1>App</h1>
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/inbox">Inbox</Link></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
})
React.render((
  <Router>
    <Route path="/" component={App}>
      <Route path="about" component={About}/>
      <Route path="inbox" component={Inbox}>
        <Route path="message/:id" component={Message}/>
      </Route>
    </Route>
  </Router>
), document.body)

{/* <App>
  <Inbox>
    <Message params={id: 'hosdf'} />
  </Inbox>
</App> */}
// 获取路由参数方法： this.props.params.id
// 或者 this.props.location.query.bar

// 添加首页,可以利用IndexRoute来设置
import { IndexRoute } from 'react-router'
const Dashboard = React.createClass({
  render () {
    return <div>Welcome to the app!</div>
  }
})  
React.render((
  <Router path="/" component={App}>
    {/* 当url为/时渲染 Dashboard */}
    <IndexRoute component={Dashboard} />
    <Route path="about" component={About}/>
    <Route path="inbox" component={Inbox}>
      <Route path="message/:id" component={Message}/>
    </Route>
  </Router>
), document.body)
// /inbox/messages/:id	 App -> Inbox -> Message

// 绝对路径
{/* <Route path="/messages/:id" component={Message} /> */}
// /messages/:id  App -> Inbox -> Message