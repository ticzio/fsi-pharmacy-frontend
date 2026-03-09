/**
 * Configuración del menú lateral
 */

export interface MenuItem {
  label: string
  to: string
  icon?: string
  iconActive?: string
  matchPath?: string
  excludePath?: string
}

export const MENU_ITEMS: MenuItem[] = [
  { label: 'Inicio', to: '/dashboard', matchPath: '/dashboard' },
  { label: 'Farmacia', to: '/pharmacy', matchPath: '/pharmacy' },
  { label: 'Cupones', to: '/coupons', matchPath: '/coupons' },
  { label: 'Noticias', to: '/news', matchPath: '/news' },
  { label: 'Notificaciones', to: '/notifications', matchPath: '/notifications' },
  { label: 'Usuarios', to: '/users', matchPath: '/users' },
  { label: 'Operadores', to: '/operators', matchPath: '/operators' },
  { label: 'Administradores', to: '/administrators', matchPath: '/administrators' },
  { label: 'Configuración', to: '/settings', matchPath: '/settings' },
]

/**
 * Helper para verificar si una ruta está activa
 */
export const isMenuItemActive = (item: MenuItem, currentPath: string): boolean => {
  const matchPath = item.matchPath || item.to

  if (item.excludePath && currentPath.includes(item.excludePath)) {
    return false
  }

  return currentPath.includes(matchPath)
}
