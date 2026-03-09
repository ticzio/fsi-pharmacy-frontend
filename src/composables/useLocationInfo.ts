import { useStore } from 'vuex'
import { URLS } from '@/const/api'
import { ERROR } from '@/const/errorConst'
import { buildGoogleMapsSearchUrl } from '@/utils/funcLocation'
import { useSwal } from '@/composables/useSwal'
import { useSwalToast } from '@/composables/useSwalToast'

interface LocationOptions {
  idCity: number
  title: string
  subtitle?: string
  address?: string | null
  latitude?: string | null
  longitude?: string | null
  showAddress?: boolean
  showMapsLink?: boolean
  enableCopy?: boolean
}

export const useLocationInfo = () => {
  const store = useStore()
  const swal = useSwal()
  const swalToast = useSwalToast()

  const getCity = async (id_city: number) => {
    try {
      const response = await store.dispatch('getData', {
        url: `${URLS.city.prefix}/${id_city}`,
      })
      if (response.code === 200) {
        return response.data
      }
    } catch (error: any) {
      console.error('Error al obtener la ciudad:', error)
      swalToast.showError(`${ERROR.errorGet} para la ciudad`)
    }
    return null
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      swalToast.showSuccess('URL copiada al portapapeles')
    } catch (error) {
      console.error('Error al copiar:', error)
      swalToast.showError('Error al copiar la URL')
    }
  }

  const showLocationInfo = async (options: LocationOptions) => {
    const {
      idCity,
      title,
      subtitle,
      address,
      latitude,
      longitude,
      showAddress = false,
      showMapsLink = false,
      enableCopy = false,
    } = options

    const cityInfo = idCity ? await getCity(idCity) : null

    const mapsResult = showMapsLink
      ? buildGoogleMapsSearchUrl(latitude || null, longitude || null)
      : { url: '', isValid: true }

    const googleMapsUrl = mapsResult.url

    if (showMapsLink && !mapsResult.isValid && (latitude || longitude)) {
      swalToast.showError(
        'La URL de Google Maps es inválida o está corrupta para las coordenadas dadas'
      )
    }

    const htmlContent = `
      <div class="text-start">
        <div class="border rounded-4 p-3 bg-light mb-2">
          <div class="d-flex align-items-start mb-2">
            <div>
              <div class="text-uppercase small text-muted fw-semibold mb-1">${
                subtitle || 'Ubicación'
              }</div>
              ${
                showAddress
                  ? `<div class="fw-semibold">${address || 'Sin dirección registrada'}</div>`
                  : ''
              }
            </div>
            <span class="badge bg-primary rounded-pill ms-2">
              <i class="bi bi-geo-alt-fill"></i>
            </span>
          </div>
          ${
            cityInfo
              ? `<div class="pt-2 mt-2 border-top">
                  <div class="text-uppercase small text-muted fw-semibold">Ciudad</div>
                  <div class="fw-semibold">${cityInfo.name || 'N/A'}</div>
                </div>`
              : '<div class="text-muted">Sin ciudad registrada</div>'
          }
          ${
            cityInfo?.state
              ? `<div class="mt-2">
                  <div class="text-uppercase small text-muted fw-semibold">Estado</div>
                  <div class="fw-semibold">${cityInfo.state.name || 'N/A'}</div>
                </div>`
              : ''
          }
          ${
            googleMapsUrl
              ? `<div class="pt-2 mt-2 border-top">
                  <div class="text-uppercase small text-muted fw-semibold mb-1">Google Maps</div>
                  <div class="d-flex align-items-center gap-2">
                    <a href="${googleMapsUrl}" target="_blank" class="text-primary text-break flex-grow-1" style="word-break: break-all;">${googleMapsUrl}</a>
                    ${
                      enableCopy
                        ? '<button type="button" class="btn btn-sm btn-outline-primary" id="copyUrlBtn" title="Copiar URL"><i class="bi bi-clipboard"></i></button>'
                        : ''
                    }
                  </div>
                </div>`
              : ''
          }
        </div>
      </div>
    `

    await swal.showConfirm(title, subtitle || '', {
      icon: 'info',
      html: htmlContent,
      confirmButtonText: 'Cerrar',
      showCancelButton: false,
      timer: undefined,
      timerProgressBar: false,
      didOpen: () => {
        if (enableCopy && googleMapsUrl) {
          const copyBtn = document.getElementById('copyUrlBtn')
          if (copyBtn) {
            copyBtn.addEventListener('click', () => copyToClipboard(googleMapsUrl))
          }
        }
      },
    })
  }

  return { showLocationInfo }
}
