import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home/index.vue'
import About from '@/views/about/index.vue'
import DemoCascader from '@/views/demo/cascader/index.vue'
import DemoUpload from '@/views/demo/upload/index.vue'
import BusinessPage from '@/views/business/index.vue'

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
    redirect: '/demo/cascader',
    meta: { title: '演示' },
    component: { render(h) { return h('router-view') } },
    children: [
      {
        path: 'cascader',
        name: 'DemoCascader',
        component: DemoCascader,
        meta: { title: '级联选择器' },
      },
      {
        path: 'upload',
        name: 'DemoUpload',
        component: DemoUpload,
        meta: { title: '文件上传' },
      },
    ],
  },
  {
    path: '/business',
    name: 'BusinessPage',
    component: BusinessPage,
    meta: { title: '业务演示' },
  },
]

const router = new VueRouter({
  mode: 'hash',
  routes,
})

export default router
