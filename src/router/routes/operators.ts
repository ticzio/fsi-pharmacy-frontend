// Operators routes
export default [
  {
    path: '/operators',
    name: 'Operadores',
    component: () => import('../../views/operators/List.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/operators/new',
    name: 'Nuevo Operador',
    component: () => import('../../views/operators/New.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/operators/edit/:id',
    component: () => import('../../views/operators/Orchestrator.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'detail-operators',
        name: 'Detalle Operador',
        component: () => import('../../views/operators/detail-operators/Edit.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'coupons-operators',
        name: 'Cupones Operador',
        component: () => import('../../views/operators/coupons-operators/List.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'chats-operators',
        name: 'Chats Operador',
        component: () => import('../../views/operators/chats-operators/List.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '',
        redirect: (to: any) => {
          return { name: 'Detalle Operador', params: { id: to.params.id } }
        },
      },
    ],
  },
]
