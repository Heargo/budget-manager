import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue')
  },
  {
    path: '/add',
    name: 'Add',
    component: () => import('@/views/Add.vue')
  },
  {
    path:'/settings',
    name:'Settings',
    component: () => import('@/views/Settings.vue')
  },
  {
    path:'/categories',
    name:'Categories',
    component: () => import('@/views/Categories.vue')
  },
  {
    path:'/history',
    name:'History',
    component: () => import('@/views/History.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
