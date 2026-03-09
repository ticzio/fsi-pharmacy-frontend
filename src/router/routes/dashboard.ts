// Dashboard route
export default [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../../views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
]
