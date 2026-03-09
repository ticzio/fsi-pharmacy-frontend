// Notifications routes
export default [
  {
    path: '/notifications',
    name: 'Notificaciones',
    component: () => import('../../views/notifications/List.vue'),
    meta: { requiresAuth: true },
  },
]
