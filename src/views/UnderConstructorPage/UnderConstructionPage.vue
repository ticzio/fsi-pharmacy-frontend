<script setup lang="ts">
import DashboardLayout from '@/components/DashboardLayout.vue'
import titleSection from '@/components/common/titleSection.vue'
import UnderConstruction from '@/components/common/UnderConstruction.vue'

import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { TITLE_SECTION_COMPONENT, type TitleSectionKey } from '@/const/tableConst'

const route = useRoute()
const router = useRouter()

// Meta opcional: route.meta.title, route.meta.description, route.meta.sectionKey
const sectionKey = computed(() => route.meta.sectionKey as TitleSectionKey | undefined)

const sectionTitle = computed(() => {
  if (route.meta.title) return route.meta.title as string
  if (sectionKey.value && TITLE_SECTION_COMPONENT[sectionKey.value]) {
    return TITLE_SECTION_COMPONENT[sectionKey.value].title
  }
  return 'Sección en desarrollo'
})

const sectionDescription = computed(() => {
  if (route.meta.description) return route.meta.description as string
  if (sectionKey.value && TITLE_SECTION_COMPONENT[sectionKey.value]) {
    return TITLE_SECTION_COMPONENT[sectionKey.value].description
  }
  return 'Estamos trabajando en esta sección para ofrecerte más funcionalidades.'
})
</script>

<template>
  <DashboardLayout>
    <div class="container-fluid py-3">
      <titleSection :title="sectionTitle" :description="sectionDescription" />
      <div class="row justify-content-center mt-4">
        <div class="col-12 col-lg-8">
          <UnderConstruction
            title="Sección en desarrollo"
            description="Estamos trabajando en esta sección para ofrecerte más funcionalidades."
            :show-back="true"
          />
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
