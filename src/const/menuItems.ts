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
  { label: 'Chats', to: '/chats', matchPath: '/chats' },
  { label: 'Canjes', to: '/exchanges', matchPath: '/exchanges' },
  { label: 'Mis Cupones', to: '/coupons', matchPath: '/coupons', icon: 'bi bi-ticket-perforated' },
  {
    label: 'Historial de Canjes',
    to: '/historical',
    matchPath: '/historical',
    icon: 'bi bi-clock-history',
  },
  { label: 'Mi Perfil', to: '/profile', matchPath: '/profile', icon: 'bi bi-person-circle' },
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
