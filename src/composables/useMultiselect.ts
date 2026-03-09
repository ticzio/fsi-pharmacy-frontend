import { computed } from 'vue'

export interface IMultiselectOption {
  id: number | string
  name: string
  icon?: string
}

export function useMultiselectDefaults() {
  const defaultProps = {
    trackBy: 'id',
    label: 'name',
    closeOnSelect: true,
    clearOnSelect: false,
    multiple: false,
    searchable: true,
    allowEmpty: false,
  }

  const defaultClasses = computed(() => ({
    container: 'w-100 multiselect-custom',
    option: 'd-flex align-items-center py-1',
    iconContainer: 'me-3',
    icon: 'fs-5 text-primary',
    content: 'flex-grow-1',
    title: 'fw-medium text-dark',
    description: 'text-muted',
    singleLabel: 'd-flex align-items-center',
    singleIcon: 'me-2 text-primary',
    singleTitle: 'fw-medium',
  }))

  return {
    defaultProps,
    defaultClasses,
  }
}

// Funciones helper para iconos y descripciones de roles
export function useRoleHelpers() {
  const getRoleIcon = (roleName: string): string => {
    const roleIcons: { [key: string]: string } = {
      Financiero: 'bi bi-cash-coin',
      'Equipo de Marketing': 'bi bi-megaphone-fill',
      'Soporte al Cliente': 'bi bi-headset',
      Supervisor: 'bi bi-people-fill',
      Administrador: 'bi bi-shield-fill-check',
      Gerente: 'bi bi-briefcase-fill',
      'Recursos Humanos': 'bi bi-person-badge-fill',
      Ventas: 'bi bi-graph-up-arrow',
      'Encargado gerente': 'bi bi-person-workspace',
      Desarrollador: 'bi bi-code-slash',
      Diseñador: 'bi bi-palette-fill',
      Contador: 'bi bi-calculator-fill',
      Analista: 'bi bi-graph-up',
    }
    return roleIcons[roleName] || 'bi bi-person-circle'
  }

  const getRoleDescription = (roleName: string): string => {
    const roleDescriptions: { [key: string]: string } = {
      Financiero: 'Gestión financiera y contabilidad',
      'Equipo de Marketing': 'Estrategias de marketing y promoción',
      'Soporte al Cliente': 'Atención y soporte a clientes',
      Supervisor: 'Supervisión de equipos y procesos',
      Administrador: 'Administración general del sistema',
      Gerente: 'Gestión y liderazgo de departamento',
      'Recursos Humanos': 'Gestión del talento humano',
      Ventas: 'Gestión de ventas y clientes',
      'Encargado gerente': 'Gestión ejecutiva y toma de decisiones',
      Desarrollador: 'Desarrollo de software y aplicaciones',
      Diseñador: 'Diseño gráfico y experiencia de usuario',
      Contador: 'Contabilidad y finanzas corporativas',
      Analista: 'Análisis de datos y reportes',
    }
    return roleDescriptions[roleName] || 'Rol del sistema'
  }

  return {
    getRoleIcon,
    getRoleDescription,
  }
}

// Función para generar helpers personalizados para otros tipos de opciones
export function useCustomHelpers<T extends Record<string, any>>(
  iconMap: T,
  descriptionMap: T,
  defaultIcon = 'bi bi-circle',
  defaultDescription = 'Opción del sistema'
) {
  const getIcon = (key: string): string => {
    return iconMap[key] || defaultIcon
  }

  const getDescription = (key: string): string => {
    return descriptionMap[key] || defaultDescription
  }

  return {
    getIcon,
    getDescription,
  }
}
