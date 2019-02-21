import {
  Message
} from 'element-ui';
import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home'
import Users from '@/components/users'
import Rights from '@/components/rights'
import Roles from '@/components/roles'
import Goods from '@/components/goods'
import Goodsadd from '@/components/goodsadd'
import Params from '@/components/params'
import Categories from '@/components/goodscate'

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/',
      name: 'home',
      component: Home,
      children: [{
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        },
        {
          name: 'roles',
          path: '/roles',
          component: Roles
        },
        {
          name: 'goods',
          path: '/goods',
          component: Goods
        },
        {
          name: 'goodsadd',
          path: '/goodsadd',
          component: Goodsadd
        },
        {
          name: 'params',
          path: '/params',
          component: Params
        },
        {
          name: 'categories',
          path: '/categories',
          component: Categories
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})

//路由守卫
router.beforeEach((to, from, next) => {
  // 如果要去的是login -> next()
  if (to.name === 'login') {
    next();
  } else {
    // 如果要去的不是login ->
    //  2.1 !token -> 去登录
    const token = localStorage.getItem("token");
    if (!token) {
      //提示
      // this.$message.warning("请先登录!");->
      Message.warning("请先登录!");

      //  this.$router.push({name:'login'})
      // $router
      router.push({
        name: 'login'
      })
      return;
    }
    //  2.2 token  -> next()
    next();
  }
})



export default router;
