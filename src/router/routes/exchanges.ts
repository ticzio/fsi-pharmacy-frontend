// Exchanges routes
export default [
  {
    path: '/exchanges',
    name: 'Canjes',
    component: () => import('../../views/exchanges/List.vue'),
    meta: { requiresAuth: true },
  },
]
