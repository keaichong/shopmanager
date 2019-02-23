// The Vue build version to load with the `import` command
// (runtime-only or standalone) has  been set in webpack.base.conf with an alias.
// import Vue from 'vue'
// import ELEMENT from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/base.css'
import App from './App'
import HttpServer from '@/http.js'
import router from './router'
// import moment from 'moment'
import BreadCrumb from '@/components/breadCrumb.vue'

// Vue.use()是使用vue插件的用法
Vue.use(HttpServer)
Vue.use(ELEMENT) 


Vue.config.productionTip = false
// 全局过滤器
Vue.filter('fmtdate',(v)=>{
  return moment(v).format('YYYY-MM-DD');
})
//全局自定义面包屑组件 第二个参数代表组件选项所在对象  第一个参数用组件提供的名字name
// Vue.component("cusBread", CusBread);
Vue.component(BreadCrumb.name,BreadCrumb)
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
