export interface IDashboardStats {
  active_concessionaires: number
  active_app_clients: number
  active_companies: number
  monthly_services: number
}

export interface User {
  id: number
  full_name: string
  email: string
  code: string
  id_type_rol_user: number
  url_image?: string
  auth: {
    token: string
  }
  type_pharmacy: {
    id_pharmacy: number
    name: string
    code_pharmacy: string
  }
}

export interface State {
  user: User | null
  isAuthenticated: boolean
  sidebarCollapsed: boolean
  isMobile: boolean
}
