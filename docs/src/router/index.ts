import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  // GitHub Pages 不支持 history fallback，使用 hash 路由避免刷新 404。
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/api',
    },
    {
      path: '/examples',
      name: 'Examples',
      component: () => import('../views/Examples.vue'),
    },
    {
      path: '/comprehensive',
      name: 'Comprehensive',
      component: () => import('../views/Comprehensive.vue'),
    },
    {
      path: '/api',
      name: 'ApiDoc',
      component: () => import('../views/ApiDoc.vue'),
    },
  ],
})

export default router
