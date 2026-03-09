// Administrators routes
export default [
  {
    path: '/administrators',
    name: 'Administradores',
    component: () => import('../../views/administrators/List.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/administrators/new',
    name: 'Nuevo Administrador',
    component: () => import('../../views/administrators/New.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/administrators/edit/:id',
    name: 'Editar Administrador',
    component: () => import('../../views/administrators/Orchestrator.vue'),
    meta: { requiresAuth: true },
    redirect: {
      name: 'Detalle Administrador',
    },
    children: [
      {
        path: 'detail-administrators',
        name: 'Detalle Administrador',
        component: () => import('../../views/administrators/detail-administrators/Edit.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
]
