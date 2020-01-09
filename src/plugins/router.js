import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
      path: '/',
      redirect: '/ad'
  },
  {
    path: '/',
    component: () => import('@/common/Home.vue'),
    children: [
      //-----------------------  页面路由  -----------------------------------------
      {
        path: '/ad',
        name: 'ad',
        meta: { title: '运营位列表' },
        component: () => import('@/views/Ad.vue')
      },

    ]
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
