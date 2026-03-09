import { debugLog } from '@/utils/logger'
import { useRouter } from 'vue-router'

export function useLogger() {
  const router = useRouter()
  const componentName = String(router.currentRoute.value.name)

  const logRequest = (url: string, params?: any, response?: any) => {
    debugLog(componentName, url, params, response)
  }

  return { logRequest }
}
