// Users routes
export default [
  {
    path: '/users',
    name: 'Usuarios',
    component: () => import('../../views/users/List.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/users/new',
    name: 'Nuevo Usuario',
    component: () => import('../../views/users/New.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/users/edit/:id',
    component: () => import('../../views/users/Orchestrator.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'detail-users',
        name: 'Detalle Usuario',
        component: () => import('../../views/users/detail-users/Edit.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'coupons-users',
        name: 'Cupones Usuario',
        component: () => import('../../views/users/coupons-users/List.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'chats-users',
        name: 'Chats Usuario',
        component: () => import('../../views/users/chats-users/List.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '',
        redirect: (to: any) => {
          return { name: 'Detalle Usuario', params: { id: to.params.id } }
        },
      },
    ],
  },
]
