import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import "./styles/index.scss" //全局css

import App from './App.vue'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

import http from "./http"
Vue.prototype.$http = http

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
