import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
      path: '/',
      redirect: '/index'
  },
  //-----------------------  页面路由  -----------------------------------------
  {
    path: '/index',
    name: 'index',
    component: () => import('@/views/Index.vue')
  },  {
    path: '/favor',
    name: 'favor',
    component: () => import('@/views/Favor.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
