export default [
  {
    path: '/chats',
    name: 'Chats',
    component: () => import('../../views/chats/List.vue'),
    meta: { requiresAuth: true },
  },
]
