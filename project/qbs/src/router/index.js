import Vue from 'vue'
import Router from 'vue-router'

import pickerTool from '../components/pickerTool.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    // {
    //   path: '/',
    //   redirect: '/login'
    // },
    {
      path: '/',
      name: 'login',
      component: () => import('../views/login/Login')
    },
    {
      path: '/home', // 首页
      name: 'home',
      component: () => import('../views/home/Home')
    },
    {
      path: '/detail',
      name: 'detail',
      component: () => import('../views/detail/detail.vue')
    },
    {
      path: '/topic', // 专题
      name: 'specialtopics',
      component: () => import('../views/specialTopic/specialTopics.vue')
    },
    {
      path: '/search', // 搜索
      name: 'search',
      component: () => import('../views/search/search')
    },
    {
      path: '/setting', // 个人设置
      name: 'setting',
      component: () => import('../views/uInfoSetting/uInfoSetting.vue')
    },
    {
      path: '/collect',
      name: 'collect',
      component: () => import('../views/collect/collect.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/history/history.vue')
    },
    {
      path: '/pickerTool',
      name: 'pickerTool',
      component: pickerTool
    },
    {
      path: '*',
      redirect: '/'
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
