// Pharmacy routes
export default [
  {
    path: '/pharmacy',
    name: 'Farmacia',
    component: () => import('../../views/pharmacies/List.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/pharmacy/new',
    name: 'Nueva Farmacia',
    component: () => import('../../views/pharmacies/New.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/pharmacy/edit/:id_pharmacy',
    name: 'Editar Farmacia',
    component: () => import('../../views/pharmacies/Orchestrator.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'detail-pharmacies',
        name: 'Detalles de la Farmacia',
        component: () => import('../../views/pharmacies/detail-pharmacies/List.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'operators-pharmacies',
        component: () => import('../../views/pharmacies/operators-pharmacies/Orchestrator.vue'), // Assuming an orchestrator or simple router-view
        meta: { requiresAuth: true },
        children: [
          {
            path: '',
            name: 'Operadores de la Farmacia',
            component: () => import('../../views/pharmacies/operators-pharmacies/List.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'new',
            name: 'Nuevo Operador de la Farmacia',
            component: () => import('../../views/pharmacies/operators-pharmacies/New.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'edit/:id',
            name: 'Editar Operador de la Farmacia',
            component: () => import('../../views/pharmacies/operators-pharmacies/Edit.vue'),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: 'template-pharmacies',
        name: 'Plantillas de la Farmacia',
        component: () => import('../../views/pharmacies/template-pharmacies/List.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'chats-pharmacies',
        name: 'Chats de la Farmacia',
        component: () => import('../../views/pharmacies/chats-pharmacies/List.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'analytics-pharmacies',
        name: 'Analíticas de la Farmacia',
        component: () => import('../../views/pharmacies/analytics-pharmacies/List.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
]
