/**
 * Permisos atómicos del sistema
 * Formato: modulo.accion
 *
 * Esto permite controlar acceso granular a:
 * - Rutas (router guard)
 * - Menú lateral (filtrar items)
 * - Tabs (mostrar/ocultar)
 * - Botones/acciones (v-can directive)
 * - Acciones de tabla (useTableActions)
 */

export const PERMISSIONS = {
  // Dashboard
  dashboard: {
    read: 'dashboard.read',
  },

  // Concesionarios
  concessionaire: {
    read: 'concessionaire.read',
    create: 'concessionaire.create',
    update: 'concessionaire.update',
    delete: 'concessionaire.delete',
    deactivate: 'concessionaire.deactivate',
  },

  // Empresas
  company: {
    read: 'company.read',
    create: 'company.create',
    update: 'company.update',
    delete: 'company.delete',
    deactivate: 'company.deactivate',
  },

  // Administradores
  administrator: {
    read: 'administrator.read',
    create: 'administrator.create',
    update: 'administrator.update',
    delete: 'administrator.delete',
    deactivate: 'administrator.deactivate',
  },

  // Clientes
  client: {
    read: 'client.read',
    create: 'client.create',
    update: 'client.update',
    delete: 'client.delete',
    deactivate: 'client.deactivate',
  },

  // Exhibiciones
  exhibition: {
    read: 'exhibition.read',
    create: 'exhibition.create',
    update: 'exhibition.update',
    delete: 'exhibition.delete',
    deactivate: 'exhibition.deactivate',
  },

  // Noticias
  news: {
    read: 'news.read',
    create: 'news.create',
    update: 'news.update',
    delete: 'news.delete',
    deactivate: 'news.deactivate',
  },

  // Notificaciones
  notification: {
    read: 'notification.read',
    create: 'notification.create',
    update: 'notification.update',
    delete: 'notification.delete',
  },

  // Configuración
  settings: {
    read: 'settings.read',
    update: 'settings.update',
  },

  // Actividades (reservas)
  activity: {
    read: 'activity.read',
    manage: 'activity.manage',
  },
} as const

// Tipo para autocompletado
export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS][keyof (typeof PERMISSIONS)[keyof typeof PERMISSIONS]]

// Helper para obtener todos los permisos de un módulo
export const getModulePermissions = (module: keyof typeof PERMISSIONS): string[] => {
  return Object.values(PERMISSIONS[module])
}

// Permiso especial: acceso total
export const PERMISSION_WILDCARD = '*'
