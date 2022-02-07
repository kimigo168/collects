import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/Layout.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/layout',
      component: Layout,
      children: [
        {
          path: '/',
          redirect: '/'
        }, {
          path: 'create',
          name: 'create',
          component: () => import('../views/create/Create'),
          meta: { keepAlive: true }
        }
      ]
    },
    {
      path: '/edit',
      name: 'edit',
      component: () => import('../views/edit/Edit')
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home/home')
    },
    {
      path: '/hots', // 热点写作
      name: 'hots',
      component: () => import('../views/home/hots')
    },
    {
      path: '/outline', // 提纲写作
      name: 'outline',
      component: () => import('../views/home/outline1')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/login')
    }, {
      path: '/user',
      name: 'userCenter',
      component: () => import('../views/user/userCenter')
    }, {
      path: '/question',
      name: 'question',
      component: () => import('../views/user/question')
    }, {
      path: '/car-index', // 汽车写作首页
      name: 'car-index',
      component: () => import('../views/car/car-index')
    }, {
      path: '/car-edit', // 汽车写作编辑页面
      name: 'car-edit',
      component: () => import('../views/car/car-edit')
    },
    {
      path: '*',
      redirect: '/'
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
