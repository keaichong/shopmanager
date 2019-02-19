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