// Coupons routes
export default [
  {
    path: '/coupons',
    name: 'Cupones',
    component: () => import('../../views/coupons/List.vue'),
    meta: { requiresAuth: true },
  },
]
