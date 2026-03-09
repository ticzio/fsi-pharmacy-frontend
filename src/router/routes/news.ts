// News routes
export default [
  {
    path: '/news',
    name: 'Noticias',
    component: () => import('../../views/news/List.vue'),
    meta: { requiresAuth: true },
  },
]
