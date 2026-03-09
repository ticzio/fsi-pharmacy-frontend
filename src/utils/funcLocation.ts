export interface GoogleMapsUrlResult {
  url: string
  isValid: boolean
}

export const buildGoogleMapsSearchUrl = (
  latitude?: string | number | null,
  longitude?: string | number | null
): GoogleMapsUrlResult => {
  if (latitude == null || longitude == null || latitude === '' || longitude === '') {
    return { url: '', isValid: false }
  }

  const lat = String(latitude).trim()
  const lng = String(longitude).trim()

  if (!lat || !lng) {
    return { url: '', isValid: false }
  }

  return {
    url: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    isValid: true,
  }
}
