// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/base.css'
import router from './router'
import moment from 'moment'
import Axios from 'axios'


Vue.prototype.$http = Axios
Axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
Vue.use(ElementUI)

Vue.config.productionTip = false
// 全局过滤器
Vue.filter('fmtdate',(v)=>{
  return moment(v).format('YYYY-MM-DD');
})

/* eslint-disable no-new */
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.querySelector('input').focus()
  }
})
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
