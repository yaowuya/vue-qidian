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
      name:"Home",
      component:() => import(/* webpackChunkName: "about" */ './views/Home')
    },
    {
      path: '/bookList/:id',
      name: 'BookList',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "BookList" */ './views/BookList')
    },{
      path:"/bookDetail/:id",
      name:"BookDetail",
      component:() => import('./views/BookDetail')
    },{
      path:"/read/:id",
      name:"Read",
      component:()=>import('./views/Read')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return {
      x: 0,
      y: 0
    }
  }
})
