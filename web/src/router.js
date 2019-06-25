import Vue from 'vue'
import Router from 'vue-router'

import Shelf from './views/Shelf'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Shelf',
      component: Shelf
    },{
      path:"/home",
      name:"home",
      component:() => import(/* webpackChunkName: "about" */ './views/Home')
    },
    {
      path: '/bookList',
      name: 'bookList',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/BookList')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return {
      x: 0,
      y: 0
    }
  }
})
