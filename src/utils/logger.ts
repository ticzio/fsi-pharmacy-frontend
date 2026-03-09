// Detectamos el entorno (ajusta según tus variables de entorno de Vite/Webpack)
const isDebugMode = import.meta.env.VITE_DOMAIN_DEVELOP

export const debugLog = (viewName: string, endpoint: string, payload?: any, response?: any) => {
  if (!isDebugMode) return

  const timestamp = new Date().toLocaleTimeString()
  const statusCode = response?.code || response?.status || 'N/A'
  const isSuccess = statusCode >= 200 && statusCode < 300

  // Extraer información de registros si existe (ajustado a tu estructura de meta o data)
  const totalRegistros = response?.data?.length ?? response?.data?.data?.length ?? 'N/A'

  const statusColor = isSuccess ? '#42b883' : '#e74c3c'

  console.groupCollapsed(
    `%c API %c ${isSuccess ? 'ÉXITO' : 'ERROR'} %c ${viewName} -> ${endpoint}`,
    'background: #35495e; color: white; padding: 2px 4px; border-radius: 3px 0 0 3px;',
    `background: ${statusColor}; color: white; font-weight: bold; padding: 2px 6px; border-radius: 0 3px 3px 0;`,
    'color: #35495e; font-weight: bold; margin-left: 5px;'
  )

  // Preparamos los datos de la tabla consolidada
  const tablaResumen: any = {
    Vista: viewName,
    Endpoint: endpoint,
    Codigo: `${statusCode} ${isSuccess ? '✅' : '❌'}`,
    'Total Registros': totalRegistros,
    Hora: timestamp,
  }

  // Aplanamos los parámetros para que salgan como filas en la tabla principal
  if (payload && typeof payload === 'object') {
    Object.keys(payload).forEach((key) => {
      tablaResumen[`Parametro -> ${key}`] = payload[key] ?? 'null'
    })
  }

  console.table(tablaResumen)

  // Dejamos el objeto completo al final por si necesitas inspeccionar algo muy puntual,
  // pero ya no es el foco principal.
  console.log(
    '%cRespuesta completa para inspección técnica:',
    'color: #999; font-style: italic;',
    response
  )

  console.groupEnd()
}
