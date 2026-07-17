import { ref } from 'vue'
import { useCookies } from '@/composables/useCookies'
import { API_VERSION } from '@/services/initApi';
import store from '@/store'

export interface ExchangeByLevel {
  label: string;
  value: number;
}

export interface AnalyticsData {
  total_exchanges: number;
  exchanges_by_level: ExchangeByLevel[];
  active_coupons: number;
  coupons_exchanged: number;
}

export interface AnalyticsResponse {
  code: number;
  status: string;
  message: string;
  alert: string;
  data: AnalyticsData;
}

export interface ChatsResponse {
  code: number;
  status: string;
  message: string;
  alert: string;
  data: {
    chats_month: number;
  };
}

export function usePharmacyAnalytics() {
  const { getCookie } = useCookies()
  const analyticsData = ref<AnalyticsData | null>(null)
  const chatsMonth = ref(0)
  const isLoading = ref(false)
  const isError = ref(false)

  const fetchAnalytics = async () => {
    analyticsData.value = null
    isLoading.value = true
    isError.value = false

    const idPharmacy = getCookie('fsi_pharmacy_id_pharmacy')

    if (!idPharmacy) {
      console.warn('[usePharmacyAnalytics] No fsi_pharmacy_id_pharmacy cookie found.')
      isLoading.value = false
      isError.value = true
      return
    }

    try {
      const response = (await store.dispatch('getData', {
        url: `analytics/pharmacy/${idPharmacy}`,
      })) as AnalyticsResponse

      if (response && response.data) {
        analyticsData.value = response.data
      } else {
        analyticsData.value = null
      }
    } catch (error) {
      console.error('[usePharmacyAnalytics] Error fetching analytics data:', error)
      analyticsData.value = null
      isError.value = true
    } finally {
      isLoading.value = false
    }
  }

  const fetchChatsAnalytics = async () => {
    chatsMonth.value = 0
    const codePharmacy = getCookie('fsi_pharmacy_code_pharmacy')
    const codeUser = getCookie('fsi_pharmacy_code_user')

    if (!codePharmacy || !codeUser) {
      console.warn('[usePharmacyAnalytics] Missing cookies for chats analytics.')
      return
    }

    try {
      const chatBackendUrl = import.meta.env.VITE_CHAT_IFRAME_BACKEND || ''
      const url = chatBackendUrl ? `${chatBackendUrl}/api/${API_VERSION}/analytics/pharmacy` : 'analytics/pharmacy'
      const response = (await store.dispatch('getData', {
        url,
        params: {
          code_pharmacy: codePharmacy,
          code_user: codeUser,
        },
      })) as ChatsResponse

      if (response && response.data) {
        chatsMonth.value = response.data.chats_month || 0
      } else {
        chatsMonth.value = 0
      }
    } catch (error) {
      console.error('[usePharmacyAnalytics] Error fetching chats count:', error)
      chatsMonth.value = 0
    }
  }

  return {
    fetchAnalytics,
    fetchChatsAnalytics,
    analyticsData,
    chatsMonth,
    isLoading,
    isError,
  }
}
