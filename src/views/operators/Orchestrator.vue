<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import DashboardLayout from '@/components/DashboardLayout.vue'
import titleSection from '@/components/common/titleSection.vue'
import ScrollableTabs from '@/components/common/ScrollableTabs.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
//Importaciones de constantes para componentes
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useLogger } from '@/composables/useLogger'
import { useCookies } from '@/composables/useCookies'
import { decodeRole } from '@/composables/useAccessControl'
import { useUsers } from '@/composables/Models/useUsers'

import { TITLE_SECTION_COMPONENT } from '@/const/tableConst'
import { URLS } from '@/const/api'

const route = useRoute()
const router = useRouter()
const store = useStore()
const logger = useLogger()
const { getUser, user: userData, loading: isUserLoading } = useUsers()

const isLoading = ref(false)
const localTitle = ref('Titulo por defecto')

const title = computed(() => localTitle.value || store.getters['utils/isItem'] || '')
const isGetting = computed(() => store.getters['utils/isGetting'])

const showNewActivity = ref<boolean>(false)
const showNewAdministrator = ref<boolean>(false)
const prevTab = ref(0)
const routeName = ref('/operators/edit')
const transitionName = ref('slide-left')

const allTabRoutes = [
  {
    label: 'Datos del Operador',
    path: 'detail-operators',
    allowedRoles: [1, 2, 3, 4, 5],
  },
  { label: 'Cupones', path: 'coupons-operators', allowedRoles: [1, 2, 3, 4, 5] },
  { label: 'Chats', path: 'chats-operators', allowedRoles: [1, 2, 3, 4, 5] },
]

// ----- INICIO DE LA CORRECCIÓN -----

// 1. Se reemplaza la `computed` asíncrona por un `ref` para almacenar el resultado.
const filteredTabRoutes = ref<typeof allTabRoutes>([])

// 2. La lógica asíncrona se mueve a una función `async` estándar.
const determineVisibleTabs = async () => {
  const { getCookie } = useCookies()
  const hashedRole = getCookie('fsi_admin_id_role')
  if (!hashedRole) {
    filteredTabRoutes.value = []
    return
  }

  try {
    const userRole = await decodeRole(hashedRole)
    // 3. El resultado se asigna al `ref`.
    filteredTabRoutes.value = allTabRoutes.filter((tab) => tab.allowedRoles.includes(userRole))
  } catch (error) {
    console.error('Error decodificando rol:', error)
    filteredTabRoutes.value = [] // En caso de error, no mostrar pestañas
  }
}

// ----- FIN DE LA CORRECCIÓN -----

// CORRECCIÓN: Ahora `activeTab` depende del `ref` `filteredTabRoutes`.
const activeTab = computed(() => {
  const currentPath = route.path
  // Usa el nuevo ref que sí contiene el arreglo.
  const tabs = filteredTabRoutes.value || []
  let bestMatchIndex = -1
  let bestMatchLength = 0

  tabs.forEach((tab, idx) => {
    const tabPath = `/${tab.path}`
    if (currentPath.endsWith(tabPath) && tabPath.length > bestMatchLength) {
      bestMatchIndex = idx
      bestMatchLength = tabPath.length
    } else if (currentPath.includes(`/${tab.path}/`) && tabPath.length > bestMatchLength) {
      // Esta condición ayuda a detectar sub-rutas (ej: /workers/add)
      bestMatchIndex = idx
      bestMatchLength = tabPath.length
    }
  })
  return bestMatchIndex
})

// CORRECCIÓN: `goToTab` también depende de `filteredTabRoutes`.
function goToTab(index: number) {
  const id = route.params.id
  // Usa el nuevo ref.
  const tabs = filteredTabRoutes.value || []
  if (tabs[index]) {
    router.replace(`${routeName.value}/${id}/${tabs[index].path}`)
  }
}

function selectTab(index: number) {
  if (showNewActivity.value || showNewAdministrator.value) {
    showNewActivity.value = false
    showNewAdministrator.value = false
    // El setTimeout con 50ms es muy corto, pero se respeta la lógica original.
    setTimeout(() => {}, 50)
    return
  }
  goToTab(index)
}

// Timeout de seguridad para evitar loading infinito
let loadingTimeout: ReturnType<typeof setTimeout> | null = null

const startLoadingTimeout = () => {
  loadingTimeout = setTimeout(() => {
    if (isLoading.value) {
      console.warn('Loading timeout alcanzado, cargando datos directamente...')
      //loadPharmacyData()
    }
  }, 3000) // 3 segundos de espera máxima
}

const clearLoadingTimeout = () => {
  if (loadingTimeout) {
    clearTimeout(loadingTimeout)
    loadingTimeout = null
  }
}

// Cargar datos del operador directamente si es necesario (ej: recarga de página)
const loadOperatorData = async () => {
  isLoading.value = true
  try {
    const data = await getUser(route.params.id as string)
    if (data) {
      localTitle.value = data.first_name + ' ' + data.last_name || data.full_name || ''
      store.dispatch('utils/setIsItem', localTitle.value)
    }
  } catch (error) {
    logger.logRequest(URLS.user.prefix + '/' + route.params.id, {}, error)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => activeTab.value,
  (newTab, oldTab) => {
    if (oldTab !== null && oldTab !== -1) {
      // Previene la transición en la carga inicial
      prevTab.value = oldTab
      transitionName.value = newTab > oldTab ? 'slide-left' : 'slide-right'
    }
  },
)

watch(isGetting, (newValue: boolean) => {
  if (newValue) {
    isLoading.value = false
    store.dispatch('utils/setIsGetting', false)
  }
})

onMounted(async () => {
  await determineVisibleTabs()

  if (isGetting.value) {
    // Si ya está cargando (por el store), iniciamos el timeout de seguridad
    startLoadingTimeout()
  } else {
    // Si no está cargando, cargamos los datos inmediatamente
    loadOperatorData()
  }
})

onBeforeUnmount(() => {
  clearLoadingTimeout()
})
</script>

<template>
  <DashboardLayout>
    <div>
      <titleSection
        :title="title"
        :description="TITLE_SECTION_COMPONENT.operators?.details || 'Detalles del operador'"
        :is-loading="isLoading"
      />
      <div>
        <ScrollableTabs
          :tabs="filteredTabRoutes"
          :activeTab="activeTab"
          @tab-change="selectTab"
          :is-loading="isLoading"
          :skeleton-count="allTabRoutes.length"
        />
        <LoadingOverlay v-if="isLoading" message="Cargando datos del operador..." />
        <div class="tab-content" v-if="!isLoading">
          <div class="tab-pane fade show active" role="tabpanel">
            <router-view v-slot="{ Component }">
              <transition :name="transitionName" mode="out-in">
                <component :is="Component" :key="$route.fullPath" :operator-data="userData" />
              </transition>
            </router-view>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
