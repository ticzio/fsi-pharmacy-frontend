<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import DashboardLayout from '@/components/DashboardLayout.vue'
import TitleSection from '@/components/common/titleSection.vue'
import ChatIframe from '@/components/common/ChatIframe.vue'

const store = useStore()
const user = computed(() => store.getters.currentUser)

// Configuration for the operator chat
const chatConfig = computed(() => ({
  userType: 'operator' as const,
  codeUser: user.value?.code || '',
  codePharmacy: user.value?.type_pharmacy?.code_pharmacy || '',
  view: 'pharmacy_operator',
}))

const isLoaded = ref(false)

onMounted(() => {
  // Add a small delay for a smooth entry animation
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})
</script>

<template>
  <DashboardLayout>
    <div class="container-fluid h-100 d-flex flex-column">
      <!-- HEADER -->
      <div class="flex-shrink-0">
        <TitleSection
          title="Centro de Mensajería"
          description="Gestiona las comunicaciones con tus clientes en tiempo real"
          :show-logo="true"
        />
      </div>

      <!-- CHAT CONTENT -->

      <div class="flex-grow-1 h-100 overflow-hidden">
        <ChatIframe
          v-if="user"
          user-type="operator"
          :code-user="user.code"
          :code-pharmacy="user.type_pharmacy?.code_pharmacy"
          view="pharmacy_operator"
          class="w-100 h-100"
        />
        <div v-else class="p-5 text-center text-muted">
          <i class="bi bi-person-exclamation fs-1 d-block mb-3"></i>
          Cargando información del usuario...
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
/* Ensure the layout slot container and this view both fill the height */
:deep(.content-body) {
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
}

.container-fluid {
  flex: 1;
  min-height: 0;
}

.chat-view-wrapper {
  transition: all 0.3s ease;
}

.border-radius-20 {
  border-radius: 20px;
}
</style>
