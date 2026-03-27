import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/historical',
    name: 'historical-list',
    component: () => import('@/views/historical/List.vue'),
    meta: { requiresAuth: true },
  },
]

export default routes
