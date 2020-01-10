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
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
