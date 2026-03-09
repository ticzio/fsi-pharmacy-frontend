// Settings routes
export default [
  {
    path: '/settings',
    name: 'Configuración',
    component: () => import('../../views/settings/List.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings/missions',
    name: 'settings.misiones',
    component: () => import('../../views/settings/missions/List.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings/levels',
    name: 'settings.niveles',
    component: () => import('../../views/settings/levels/List.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings/banners',
    name: 'settings.banners',
    component: () => import('../../views/settings/banners/Orchestrator.vue'),
    meta: { requiresAuth: true },
    redirect: { name: 'settings.banners.benefits' },
    children: [
      {
        path: 'benefits',
        name: 'settings.banners.benefits',
        component: () => import('../../views/settings/banners/benefits-banners/List.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'coupons',
        name: 'settings.banners.coupons',
        component: () => import('../../views/settings/banners/coupons-banners/List.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/settings/cities',
    name: 'settings.ciudades',
    component: () => import('../../views/settings/cities/List.vue'),
    meta: { requiresAuth: true },
  },
]
