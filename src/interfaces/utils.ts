export interface IDashboardStats {
  active_concessionaires: number
  active_app_clients: number
  active_companies: number
  monthly_services: number
}

export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface State {
  user: User | null
  isAuthenticated: boolean
  sidebarCollapsed: boolean
  isMobile: boolean
}
