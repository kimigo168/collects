import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)


import Home from '../components/Home.vue'
import hots from '../components/list/hots.vue'
import outline from '../components/list/outline.vue'
import create from '../components/create/create.vue'
import edit from '../components/edit/edit.vue'

import userCenter from '../components/user/user-center.vue'
import myArticle from '../components/user/my-article.vue'
import order from '../components/user/order.vue'
import resetPwd from '../components/user/reset-pwd.vue'
import feedback from '../components/user/feedback.vue'

import duplicateList from '../components/user/duplicate/duplicate-list.vue'
import duplicateDetail from '../components/user/duplicate/duplicate-detail.vue'

import payCenter from '../components/user/pay/pay-center.vue'
import paySuc from '../components/user/pay/pay-suc.vue'


export default new Router({
  routes: [

    {
      path: '/',
      redirect:"/home"
    },
    {
      path: '/home',
      component: Home,
    },
    {
      path: '/hots',
      component: hots,
    },{
      path: '/outline',
      component: outline,
    },
    {
      path: '/create',
      component: create,
    },
    {
      path: '/edit',
      component: edit,
    }, {
      path: '/user-center',
      component: userCenter,
    }, {
      path: '/pay-center',
      component: payCenter,
    }, {
      path: '/pay-suc',
      component: paySuc,
    }, {
      path: '/my-article',
      component: myArticle,
    }, {
      path: '/order',
      component: order,
    }, {
      path: '/reset-pwd',
      component: resetPwd,
    }, {
      path: '/feedback',
      component: feedback,
    }, {
      path: '/duplicate-list',
      component: duplicateList,
    }, {
      path: '/duplicate-detail',
      component: duplicateDetail,
    }


  ]
})
