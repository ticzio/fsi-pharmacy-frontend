import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import { getRoleIdFromCookie } from '@/composables/useAccessControl'
import { roleHasAllPermissions } from '@/const/rolePermissions'

import dashboardRoutes from './routes/dashboard'
import couponsRoutes from './routes/exchanges'
import settingsRoutes from './routes/settings'
import chatsRoutes from './routes/chats'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    ...dashboardRoutes,
    ...couponsRoutes,
    ...chatsRoutes,
    // Catch-all 404 route (must be last)
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
      meta: { requiresGuest: false, requiresAuth: false },
    },
  ],
})

/* Navigation guards
router.beforeEach((to, from, next) => {
  const roleId = getRoleIdFromCookie()
  const isAuthenticated = roleId !== null && roleId > 0

  // Rutas que requieren ser invitado (login)
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
    return
  }

  // Rutas públicas (login, 404, etc.)
  if (to.meta.requiresGuest || to.meta.requiresAuth === false) {
    next()
    return
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    next('/login')
    return
  }

  // Verificar permisos de la ruta
  const requiredPermissions = to.meta.permissions as string[] | undefined

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasPermission = roleHasAllPermissions(roleId!, requiredPermissions)

    if (!hasPermission) {
      // Sin permiso: redirigir a dashboard o mostrar error
      console.warn(`Acceso denegado a ${to.path}. Permisos requeridos:`, requiredPermissions)
      next('/dashboard')
      return
    }
  }

  // Todo OK
  next()
})*/

export default router
