import Vue from 'vue'
import './assets/styles/reset.scss' // A modern alternative to CSS resets
import './rem'


import Vant from 'vant'
import 'vant/lib/index.css'

import App from './App.vue'
import router from './router'
import store from './store'

import '@/icons' // icon

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
