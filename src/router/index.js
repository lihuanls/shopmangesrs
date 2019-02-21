import Vue from 'vue'
import Router from 'vue-router'
import {Message} from 'element-ui'

import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import users from '@/components/users.vue'
import rights from '@/components/rights.vue'
import roles from '@/components/roles.vue'
import goods from '@/components/goodslist.vue'
import goodsAdd from '@/components/goodsAdd.vue'
 


Vue.use(Router)

 const router =  new Router({
  routes: [{
    name:'login',
    path: '/login',
    component:Login
    
  },{
    name:'home',
    path: '/',
    component:Home,
    children:[{
      name:'users',
      path:'/users',
      component:users
    },{
      name:'rights',
      path:'/rights',
      component:rights
    },{
      name:'roles',
      path:'/roles',
      component:roles
    },{
      name:'goods',
      path:'/goods',
      component:goods
    },{
      name:'goodsAdd',
      path:'/goodsAdd',
      component: goodsAdd
    } ] 
  }]
})


router.beforeEach((to,from,next) => {
  console.log('路由守卫执行-----')

  if(to.name==="login") {
    next()
  }else {
    const token =localStorage.getItem("token")
    // 没有token的情况
    if(!token) {
       Message.warning('请先登陆')
       router.push({
         name:'login'
       })
       return
    }

    // 有token渲染home
    next()
  }
})

export default router;