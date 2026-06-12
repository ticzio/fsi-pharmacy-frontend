import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/coupons',
    name: 'coupons-list',
    component: () => import('@/views/coupons/List.vue'),
    meta: { requiresAuth: true },
  },
]

export default routes
