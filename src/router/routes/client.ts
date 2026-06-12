// Users routes
export default [
  {
    path: '/clients',
    name: 'Clientes',
    component: () => import('../../views/clients/List.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/clients/new',
    name: 'Nuevo Cliente',
    component: () => import('../../views/clients/New.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/clients/edit/:id',
    component: () => import('../../views/clients/Orchestrator.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'detail-clients',
        name: 'Detalle Cliente',
        component: () => import('../../views/clients/detail-clients/Edit.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'coupons-clients',
        name: 'Cupones Cliente',
        component: () => import('../../views/clients/coupons-clients/List.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'chats-clients',
        name: 'Chats Cliente',
        component: () => import('../../views/clients/chats-clients/List.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '',
        redirect: (to: any) => {
          return { name: 'Detalle Cliente', params: { id: to.params.id } }
        },
      },
    ],
  },
]
