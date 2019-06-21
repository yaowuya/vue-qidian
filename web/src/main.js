import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './rem'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Vant from 'vant'
import 'vant/lib/index.css'

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
