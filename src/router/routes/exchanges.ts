// Exchanges routes
export default [
  {
    path: '/exchanges',
    name: 'Canjes',
    component: () => import('../../views/exchanges/New.vue'),
    meta: { requiresAuth: true },
  },
]
