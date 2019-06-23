import Vue from 'vue'
import Router from 'vue-router'

import Main from './views/Main.vue'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
      redirect: '/bookshelf',
      children:[
        {
          path: '/bookshelf',
          name: 'BookShelf',
          component: () => import('./views/BookShelf')
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
