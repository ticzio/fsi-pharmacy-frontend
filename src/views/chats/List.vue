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
  view: 'pharmacy_operator'
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
    <div
      class="chat-view-wrapper bg-white shadow-sm p-3 p-md-4 m-0 d-flex flex-column gap-3 gap-md-4 position-relative"
      :class="{ 'opacity-100': isLoaded, 'opacity-0': !isLoaded }"
      style="border-radius: 20px; transition: opacity 0.5s ease; height: calc(100vh - 120px)"
    >
      <!-- HEADER -->
      <TitleSection
        title="Centro de Mensajería"
        description="Gestiona las comunicaciones con tus clientes en tiempo real"
        :show-logo="true"
      />

      <!-- CHAT CONTENT -->
      <div class="flex-grow-1 overflow-hidden d-flex flex-column border-radius-20 border shadow-sm bg-light mb-2" 
           style="border-radius: 15px; overflow: hidden; height: 100%">
        <ChatIframe
          v-if="user"
          user-type="operator"
          :code-user="user.code"
          :code-pharmacy="user.type_pharmacy?.code_pharmacy"
          view="pharmacy_operator"
          class="flex-grow-1 w-100 h-100"
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
.chat-view-wrapper {
  transition: all 0.3s ease;
}

.border-radius-20 {
  border-radius: 20px;
}

/* Ensure the iframe container takes full available height */
.flex-grow-1 {
  flex: 1 1 auto;
}

:deep(iframe) {
  border-radius: 12px;
}
</style>
