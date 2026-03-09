export type ButtonConfig = {
  tooltipTitle: string
}

// 1. Mapa de contextos -> texto del tooltip
const BUTTON_TOOLTIPS = {
  pharmacy: 'Nueva farmacia',
  filter: 'Limpiar filtros y recargar tabla',
  administrator: 'Nuevo administrador',
  news: 'Nueva noticia',
  notification: 'Nueva notificación',
  user: 'Nuevo usuario',
  operator: 'Nuevo operador',
  // Nuevos contextos de settings
  cities: 'Nueva ciudad',
  missions: 'Nueva misión',
  levels: 'Nuevo nivel',
  banners: 'Nuevo banner',
  benefitsBanners: 'Nuevo banner de beneficio',
  couponsBanners: 'Nuevo banner de cupón',
  role: 'Nuevo rol',
  state: 'Nuevo estado',
} as const

export type ButtonKey = keyof typeof BUTTON_TOOLTIPS

// 2. Generación automática de botones "new" por contexto
export const BUTTONS_TOOLTIPS: Record<ButtonKey, ButtonConfig> = Object.fromEntries(
  Object.entries(BUTTON_TOOLTIPS).map(([key, tooltipTitle]) => [
    key,
    {
      tooltipTitle: tooltipTitle as string,
    },
  ]),
) as Record<ButtonKey, ButtonConfig>

export const BUTTONS = {
  new: {
    icon: 'bi-plus text-white',
    class: 'btn btn-dark border-radius-right border-radius-left py-2 fw-medium text-light',
    tooltipPos: 'left',
  },
  filter: {
    icon: 'bi bi-eraser-fill text-white',
    class:
      'btn btn-danger border-radius-right border-radius-left me-auto  py-2 fw-medium text-light',
    tooltipPos: 'right',
  },
  search: {
    icon: 'bi bi-search ',
    class: 'input-group-text border text-primary bg-transparent border-radius-left',
    tooltipPos: 'top',
  },
  update: {
    icon: 'bi bi-upload text-white ms-1',
    class: 'btn btn-dark border-radius-right border-radius-left py-2 fw-medium text-light',
    tooltipPos: 'left',
  },
  delete: {
    icon: 'bi bi-trash3-fill',
    class: 'btn btn-outline-danger rounded-3',
    tooltipPos: 'left',
    title: 'Eliminar',
  },
  unlock: {
    icon: 'bi bi-unlock-fill',
    class: 'btn btn-outline-success rounded-3',
    tooltipPos: 'left',
    title: 'Desbloquear',
  },
}
