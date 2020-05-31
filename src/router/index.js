/*
 * @Author: your name
 * @Date: 2020-05-26 14:26:29
 * @LastEditTime: 2020-05-31 14:25:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-mallmanage\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import {
  Message
} from 'element-ui'

Vue.use(VueRouter)

const routes = [{
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    children: [{
        path: '/users',
        name: 'User',
        component: () => import('../views/users/User.vue')
      },
      {
        path: '/rights',
        name: 'Right',
        component: () => import('../views/rights/Right.vue')
      },
      {
        path: '/roles',
        name: 'Role',
        component: () => import('../views/rights/Role.vue')
      },
      {
        path: '/goods',
        name: 'Goods',
        component: () => import('../views/goods/goods.vue')
      },
      {
        path: '/addgood',
        name: 'addgood',
        component: () => import('../views/goods/addgood.vue')
      },
      {
        path: '/params',
        name: 'params',
        component: () => import('../views/goods/cateparams.vue')
      },
      {
        path: '/categories',
        name: 'categories',
        component: () => import('../views/goods/categories.vue')
      },
      {
        path: '/orders',
        name: 'orders',
        component: () => import('../views/orders/orders.vue')
      },
      {
        path: '/reports',
        name: 'reports',
        component: () => import('../views/reports/reports.vue')
      },

    ]
  },
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem("token");
    if (!token) {
      Message.warning('回到登录页面')
      router.push({
        name: "Login"
      })
      return
    }
    next()
  }
})

export default router