// Detect domain to conditionally include ID columns in table headers
const URL_DOMAIN = window.location.host
const VITE_DOMAIN_DEVELOP = import.meta.env.VITE_DOMAIN_DEVELOP
const IS_DEV_DOMAIN =
  URL_DOMAIN.includes('localhost:517') ||
  URL_DOMAIN.includes('localhost:417') ||
  (!!VITE_DOMAIN_DEVELOP && URL_DOMAIN.includes(VITE_DOMAIN_DEVELOP))

function maybeId(key: string = 'id') {
  return IS_DEV_DOMAIN ? [{ key, label: 'ID' }] : []
}

export const TITLE_SECTION_COMPONENT = {
  pharmacy: {
    title: 'Farmacia',
    description: 'Lista de farmacias',
    details: 'Detalles de la farmacia',
    new: 'Nueva farmacia',
    newDescription: 'Aquí puedes crear una nueva farmacia con toda la información necesaria.',
  },
  exchanges: {
    title: 'Cupones Canjeados',
    description: 'Lista de cupones canjeados',
    details: 'Detalles del cupón canjeado',
    new: 'Nuevo cupón canjeado',
    newDescription: 'Aquí puedes crear un nuevo cupón canjeado con toda la información necesaria.',
  },
  coupons: {
    title: 'Cupones',
    description: 'Lista de cupones',
    details: 'Detalles del cupón',
    new: 'Nuevo cupón',
    newDescription: 'Aquí puedes crear un nuevo cupón con toda la información necesaria.',
  },
  news: {
    title: 'Noticias',
    description: 'Lista de noticias',
    details: 'Detalles de la noticia',
    new: 'Nueva noticia',
    newDescription: 'Aquí puedes crear una nueva noticia con toda la información necesaria.',
  },
  notifications: {
    title: 'Notificaciones',
    description: 'Lista de notificaciones',
    details: 'Detalles de la notificación',
    new: 'Nueva notificación',
    newDescription: 'Aquí puedes crear una nueva notificación con toda la información necesaria.',
  },
  clients: {
    title: 'Clientes',
    description: 'Lista de clientes',
    details: 'Detalles del cliente',
    new: 'Nuevo cliente',
    newDescription: 'Aquí puedes crear un nuevo cliente con toda la información necesaria.',
  },
  operators: {
    title: 'Operadores',
    description: 'Lista de operadores',
    details: 'Detalles del operador',
    new: 'Nuevo operador',
    newDescription: 'Aquí puedes crear un nuevo operador con toda la información necesaria.',
  },
  administrators: {
    title: 'Administradores',
    description: 'Lista de administradores',
    details: 'Detalles del administrador',
    new: 'Nuevo administrador',
    newDescription: 'Aquí puedes crear un nuevo administrador con toda la información necesaria.',
  },
  missions: {
    title: 'Misiones',
    description: 'Lista de misiones',
    details: 'Detalles de la misión',
    new: 'Nueva misión',
    newDescription: 'Aquí puedes crear una nueva misión con toda la información necesaria.',
  },
  levels: {
    title: 'Niveles',
    description: 'Lista de niveles',
    details: 'Detalles del nivel',
    new: 'Nuevo nivel',
    newDescription: 'Aquí puedes crear un nuevo nivel con toda la información necesaria.',
  },
  banners: {
    title: 'Banners Publicitarios',
    description: 'Lista de banners',
    details: 'Detalles del banner',
    new: 'Nuevo banner',
    newDescription: 'Aquí puedes crear un nuevo banner con toda la información necesaria.',
  },
  cities: {
    title: 'Ciudades',
    description: 'Lista de ciudades',
    details: 'Detalles de la ciudad',
    new: 'Nueva ciudad',
    newDescription: 'Aquí puedes crear una nueva ciudad con toda la información necesaria.',
  },
  states: {
    title: 'Estados',
    description: 'Lista de estados',
    details: 'Detalles del estado',
    new: 'Nuevo estado',
    newDescription: 'Aquí puedes crear un nuevo estado con toda la información necesaria.',
  },
  template_pharmacies: {
    title: 'Plantillas de Farmacias',
    description: 'Lista de plantillas de farmacias',
    details: 'Detalles de la plantilla',
    new: 'Nueva plantilla',
    newDescription: 'Aquí puedes crear una nueva plantilla con toda la información necesaria.',
  },
}

export type TitleSectionKey = keyof typeof TITLE_SECTION_COMPONENT

export const TABLE_HEADERS = {
  administrator: [
    ...maybeId('id'),
    { key: 'code', label: 'Código' },
    { key: 'url_image_light', label: 'Foto' },
    { key: 'full_name', label: 'Nombre y apellido' },
    { key: 'email', label: 'Correo' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'id_type_rol.name', label: 'Rol' },
    { key: 'active', label: 'Estatus' },
  ],
  pharmacy: [
    ...maybeId('id'),
    { key: 'url_image_light', label: 'Logo' },
    { key: 'code', label: 'Código' },
    { key: 'type_city.name', label: 'Ciudad' },
    { key: 'name', label: 'Nombre' },
    { key: 'ubication', label: 'Ubicación' },
    { key: 'description', label: 'Descripción' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'active', label: 'Estatus' },
  ],
  operator: [
    ...maybeId('id'),
    { key: 'code', label: 'Código' },

    { key: 'id_pharma.name', label: 'Farmacia' },
    { key: 'url_image_light', label: 'Foto' },
    { key: 'full_name', label: 'Nombre y apellido' },
    { key: 'email', label: 'Correo' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'active', label: 'Estatus' },
  ],
  exchanges: [
    ...maybeId('id'),
    { key: 'coupon_client.coupon.code', label: 'Código Cupón' },

    { key: 'id_users.full_name', label: 'Operador' },
    { key: 'exchanged_at', label: 'Fecha de Canje' },
    { key: 'created_at', label: 'Hora del canje' },
  ],

  exchangesClient: [
    ...maybeId('id'),
    { key: 'id_coupon_client.code', label: 'Código Cupón' },
    { key: 'id_pharmacy.name', label: 'Farmacia' },
    { key: 'id_user.full_name', label: 'Operador' },
    { key: 'exchanged_at', label: 'Fecha de Canje' },
  ],

  coupons: [
    ...maybeId('id'),
    { key: 'code', label: 'Código' },
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
    { key: 'id_level', label: 'ID Nivel' },
    { key: 'url_img', label: 'Imagen' },
    { key: 'start_date', label: 'Fecha de inicio' },
    { key: 'finish_date', label: 'Fecha de fin' },
    { key: 'timestamp', label: 'Fecha de creación' },
    { key: 'active', label: 'Estatus' },
  ],
  clients: [
    ...maybeId('id_user'),
    { key: 'code', label: 'Código' },
    { key: 'url_image_light', label: 'Foto' },
    { key: 'ci', label: 'Cédula' },
    { key: 'full_name', label: 'Nombre y apellido' },
    { key: 'email', label: 'Correo' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'type_city.name', label: 'Ciudad' },
    { key: 'type_level.name', label: 'Nivel' },
    { key: 'active', label: 'Estatus' },
  ],

  notifications: [
    ...maybeId('id'),
    { key: 'title', label: 'Titulo' },
    { key: 'description', label: 'Descripción' },
    { key: 'scheduled_date', label: 'Fecha programada' },
    { key: 'active', label: 'Estatus' },
  ],

  news: [
    ...maybeId('id'),
    { key: 'title', label: 'Titulo' },
    { key: 'body_only_text', label: 'Descripción' },
    { key: 'id_creator.full_name', label: 'Nombre del creador' },
    { key: 'active', label: 'Estatus' },
  ],
  cities: [
    ...maybeId('id'),
    { key: 'type_state.name', label: 'Estado' },
    { key: 'name', label: 'Nombre' },
    { key: 'active', label: 'Estatus' },
  ],
  states: [
    ...maybeId('id'),
    { key: 'url_image_light', label: 'Imagen' },
    { key: 'name', label: 'Nombre' },
    { key: 'active', label: 'Estatus' },
  ],

  // Nuevas secciones de settings
  missions: [
    ...maybeId('id'),
    { key: 'title', label: 'Titulo' },
    { key: 'description', label: 'Descripción' },
    { key: 'active', label: 'Estatus' },
  ],
  levels: [
    ...maybeId('id'),
    { key: 'name', label: 'Nombre' },
    { key: 'min_points', label: 'Puntos Mínimos' },
    { key: 'max_points', label: 'Puntos Máximos' },
    { key: 'active', label: 'Estatus' },
  ],
  banners: [
    ...maybeId('id'),
    { key: 'url_image_light', label: 'Imagen' },
    { key: 'name', label: 'Título' },
    { key: 'id_app_ubication.name', label: 'Ubicación en la App' },
    { key: 'views', label: 'Visualizaciones' },
    { key: 'clicks', label: 'Clicks al banner' },

    { key: 'active', label: 'Estatus' },
  ],
  benefitsBanners: [
    ...maybeId('id'),
    { key: 'url_image_light', label: 'Imagen' },
    { key: 'name', label: 'Título' },
    { key: 'active', label: 'Estatus' },
  ],
  couponsBanners: [
    ...maybeId('id'),
    { key: 'url_image_light', label: 'Imagen' },
    { key: 'name', label: 'Título' },
    { key: 'active', label: 'Estatus' },
  ],
  template_pharmacies: [
    ...maybeId('id'),
    { key: 'name', label: 'Título' },
    { key: 'description', label: 'Descripción' },
    { key: 'active', label: 'Estatus' },
  ],
}

export const TABLE_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  limit: 10,
}

export const TABLE_ACTIONS = {
  new: {
    name: 'new',
    icon: 'bi-plus fs-5',
    class: 'border-radius-left border-radius-right btn btn-primary fw-medium text-light',
    tooltip: 'Nuevo',
  },
  edit: {
    name: 'edit',
    icon: 'bi-list fs-5',
    class: 'rounded-3 btn bg-light-subtle border border-light fw-medium',
    tooltip: 'Ver detalles',
  },
  delete: {
    name: 'delete',
    icon: 'bi bi-trash3-fill fs-5 text-white',
    class: 'rounded-3 btn bg-danger-subtle border border-danger fw-medium',
    tooltip: 'Eliminar',
  },
  deactivate: {
    name: 'deactivate',
    icon: 'bi bi-check-circle-fill fs-5',
    class: 'rounded-3 fw-medium text-white',
    tooltip: 'Desactivar',
  },
}
