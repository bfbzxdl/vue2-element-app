import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Demo from '../views/Demo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' },
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { title: '关于' },
  },
  {
    path: '/demo',
    name: 'Demo',
    component: Demo,
    meta: { title: '组件演示' },
  },
]

const router = new VueRouter({
  mode: 'hash',
  routes,
})

export default router
