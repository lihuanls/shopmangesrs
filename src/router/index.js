import Vue from 'vue'
import Router from 'vue-router'
import {Message} from 'element-ui'

 

const  Login = () => import('@/components/login.vue')
const  Home = () => import('import(@/components/home.vue')
const  users = () => import('@/components/users.vue')
const  rights = () => import ('@/components/rights.vue')
const  roles = () => import  ('@/components/roles.vue')
const  goods = () => import ('@/components/goodslist.vue')
const  goodsAdd =() => import ('@/components/goodsAdd.vue')
const  cateparams = () => import ('@/components/cateparams.vue')
const  goodscate = () => import ('@/components/goodscate.vue')
const  order = () => import ('@/components/order.vue')
const  report =() => import ('@/components/reports.vue')

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

    },{
      name:'cateparams',
      path:'/params',
      component: cateparams
    },{
      name:'goodscate',
      path:'/categories',
      component: goodscate
    },{
      name:'order',
      path:'/orders',
      component: order
    },{
      name:'report',
      path:'/reports',
      component: report
    }]

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