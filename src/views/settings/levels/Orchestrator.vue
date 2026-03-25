<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import DashboardLayout from '@/components/DashboardLayout.vue'
import titleSection from '@/components/common/titleSection.vue'
import ScrollableTabs from '@/components/common/ScrollableTabs.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'

import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useCookies } from '@/composables/useCookies'
import { decodeRole } from '@/composables/useAccessControl'

import { TITLE_SECTION_COMPONENT } from '@/const/tableConst'
import { URLS } from '@/const/api'

const route = useRoute()
const router = useRouter()
const store = useStore()

const isLoading = ref(false)
const levelName = ref('')

const prevTab = ref(0)
const transitionName = ref('slide-left')

const allTabRoutes = [
  {
    label: 'Cupones',
    path: 'coupons',
    allowedRoles: [1, 2, 3, 4, 5],
  },
  {
    label: 'Beneficios y progreso',
    path: 'benefits',
    allowedRoles: [1, 2, 3, 4, 5],
  },
]

const filteredTabRoutes = ref<typeof allTabRoutes>([])

const determineVisibleTabs = async () => {
  const { getCookie } = useCookies()
  const hashedRole = getCookie('fsi_pharmacy_id_role')
  if (!hashedRole) {
    filteredTabRoutes.value = []
    return
  }

  try {
    const userRole = await decodeRole(hashedRole)
    filteredTabRoutes.value = allTabRoutes.filter((tab) => tab.allowedRoles.includes(userRole))
  } catch (error) {
    console.error('Error decodificando rol:', error)
    filteredTabRoutes.value = []
  }
}

const getDataLevel = async () => {
  isLoading.value = true
  try {
    const response: any = await store.dispatch('getData', {
      url: `${URLS.level.prefix}/${route.params.id_level}`,
    })

    if (response.code === 200) {
      levelName.value = response.data.name
    }
  } catch (error) {
    console.error('Error fetching level details:', error)
  } finally {
    isLoading.value = false
  }
}

const activeTab = computed(() => {
  const currentPath = route.path
  const tabs = filteredTabRoutes.value || []
  let bestMatchIndex = -1

  tabs.forEach((tab, idx) => {
    const tabPath = `/settings/levels/edit/${route.params.id_level}/${tab.path}`
    if (currentPath.includes(tabPath)) {
      bestMatchIndex = idx
    }
  })

  if (bestMatchIndex === -1 && tabs.length > 0) {
    return 0
  }
  return bestMatchIndex
})

function selectTab(index: number) {
  const tabs = filteredTabRoutes.value || []
  if (tabs[index]) {
    router.replace(`/settings/levels/edit/${route.params.id_level}/${tabs[index].path}`)
  }
}

watch(
  () => activeTab.value,
  (newTab, oldTab) => {
    if (oldTab !== null && oldTab !== -1) {
      prevTab.value = oldTab
      transitionName.value = newTab > oldTab ? 'slide-left' : 'slide-right'
    }
  },
)

onMounted(async () => {
  await determineVisibleTabs()
  await getDataLevel()
})
</script>

<template>
  <DashboardLayout>
    <div class="d-flex flex-column h-100">
      <titleSection
        :title="levelName || TITLE_SECTION_COMPONENT.levels?.title || 'Niveles'"
        :description="TITLE_SECTION_COMPONENT.levels?.description || 'Detalles del nivel'"
        :is-loading="isLoading"
        :show-logo="true"
      />
      <div class="d-flex flex-column flex-grow-1">
        <ScrollableTabs
          :tabs="filteredTabRoutes"
          :activeTab="activeTab"
          @tab-change="selectTab"
          :is-loading="isLoading"
          :skeleton-count="allTabRoutes.length"
        />
        <LoadingOverlay v-if="isLoading" message="Cargando datos..." />
        <div class="tab-content flex-grow-1 d-flex flex-column" v-if="!isLoading">
          <div class="tab-pane fade show active flex-grow-1" role="tabpanel">
            <router-view v-slot="{ Component }">
              <transition :name="transitionName" mode="out-in">
                <component :is="Component" :key="$route.fullPath" />
              </transition>
            </router-view>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
