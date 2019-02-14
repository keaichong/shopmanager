// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/base.css'
import router from './router'
import Axios from 'axios'
Axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
Vue.prototype.$http = Axios
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>' // vue1.0写法
})
// components: { App,App },
// template: '<App><App/>'
