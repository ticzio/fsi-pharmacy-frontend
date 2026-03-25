<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/DashboardLayout.vue'
import TitleSection from '@/components/common/titleSection.vue'
import GeneralConfigCard from '@/components/Settings/GeneralConfigCard.vue'
import ToolsCard from '@/components/Settings/ToolsCard.vue'
import SystemVersionCard from '@/components/Settings/SystemVersionCard.vue'
import SystemStatusCard from '@/components/Settings/SystemStatusCard.vue'

const router = useRouter()
const store = useStore()

const isMobile = computed(() => store.state.isMobile)

// Mobile Sidebar Logic
const isSidebarOpen = ref(false)
const activeMobileTab = ref<string>('general')

const mobileOptions = [
  { id: 'general', label: 'Configuración General', icon: 'bi-gear' },
  { id: 'tools', label: 'Herramientas', icon: 'bi-tools' },
  { id: 'status', label: 'Estado del Sistema', icon: 'bi-activity' },
  { id: 'version', label: 'Versión del Sistema', icon: 'bi-info-circle' },
]

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  document.body.style.overflow = isSidebarOpen.value ? 'hidden' : ''
}

const selectMobileTab = (tabId: string) => {
  activeMobileTab.value = tabId
  isSidebarOpen.value = false
  document.body.style.overflow = ''
}

// Navigate handler from GeneralConfigCard
const handleGeneralNavigate = (key: string) => {
  router.push({ name: `settings.${key}` }).catch(() => {
    // Route not yet defined — silently ignore
    console.warn(`Route settings.${key} not found`)
  })
}

// ── Lógica Centralizada de Estado/Versión del Chat ──
const chatStatus = ref<'loading' | 'online' | 'offline'>('loading')
const chatVersion = ref<string | null>(null)

const getChatSystemInfo = async () => {
  try {
    const response: any = await store.dispatch('getData', {
      url: import.meta.env.VITE_CHAT_IFRAME_BACKEND,
    })

    if (response && response.status === 'OK') {
      chatStatus.value = 'online'
      chatVersion.value = response.version
    } else {
      chatStatus.value = 'offline'
      chatVersion.value = 'Error'
    }
  } catch (error) {
    console.error('[FSI] Error al obtener información del chat:', error)
    chatStatus.value = 'offline'
    chatVersion.value = 'Error'
  }
}

onMounted(() => {
  getChatSystemInfo()
})
</script>

<template>
  <DashboardLayout>
    <div class="settings-page d-flex flex-column gap-4">
      <!-- Header -->
      <TitleSection
        title="Configuración"
        description="Panel de control integrado del sistema"
        :show-logo="true"
      />

      <!-- GRID PRINCIPAL -->
      <template v-if="!isMobile">
        <div class="row g-4">
          <!-- ═══════════════════════════════════════════ -->
          <!-- COLUMNA IZQUIERDA (8/12) -->
          <!-- ═══════════════════════════════════════════ -->
          <div class="col-12 col-lg-8 d-flex flex-column gap-4">
            <!-- ── Configuración General ── -->
            <GeneralConfigCard @navigate="handleGeneralNavigate" />
            <SystemVersionCard :chat-version="chatVersion" />
          </div>
          <!-- /col-lg-8 -->

          <!-- ═══════════════════════════════════════════ -->
          <!-- COLUMNA DERECHA (4/12) -->
          <!-- ═══════════════════════════════════════════ -->
          <div class="col-12 col-lg-4 d-flex flex-column gap-4">
            <ToolsCard />
            <SystemStatusCard :chat-status="chatStatus" />
          </div>
          <!-- /col-lg-4 -->
        </div>
        <!-- /row -->
      </template>

      <!-- MOBILE VIEW -->
      <template v-else>
        <!-- State before any option is selected -->
        <div
          v-if="!activeMobileTab"
          class="mobile-empty-state d-flex flex-column align-items-center justify-content-center text-center py-5 mt-5"
        >
          <div
            class="icon-wrap bg-primary-soft mb-4 d-flex align-items-center justify-content-center"
            style="width: 80px; height: 80px; border-radius: 50%"
          >
            <i class="bi bi-gear-fill fs-1 text-primary"></i>
          </div>
          <h4 class="fw-bold text-dark">Ajustes del Sistema</h4>
          <p class="text-muted px-4">
            Utiliza la burbuja flotante en la esquina inferior para visualizar y gestionar las
            configuraciones integradas.
          </p>
        </div>

        <!-- Render the selected component in the main view -->
        <div v-else class="mobile-active-component d-flex flex-column gap-4 pb-5">
          <GeneralConfigCard
            v-if="activeMobileTab === 'general'"
            @navigate="handleGeneralNavigate"
          />
          <ToolsCard v-else-if="activeMobileTab === 'tools'" />
          <SystemStatusCard :chat-status="chatStatus" v-else-if="activeMobileTab === 'status'" />
          <SystemVersionCard
            :chat-version="chatVersion"
            v-else-if="activeMobileTab === 'version'"
          />
        </div>

        <!-- Right Sidebar Bubble (Options Menu) -->
        <div class="mobile-settings-wrapper">
          <button
            class="bubble-btn shadow-lg d-flex align-items-center justify-content-center"
            @click="toggleSidebar"
            :class="{ 'is-open': isSidebarOpen }"
            aria-label="Toggle Settings Sidebar"
          >
            <i class="bi bi-list fs-3" v-if="!isSidebarOpen"></i>
            <i class="bi bi-x fs-2" v-else></i>
          </button>

          <!-- Overlay -->
          <transition name="fade">
            <div class="bubble-overlay" v-if="isSidebarOpen" @click="toggleSidebar"></div>
          </transition>

          <!-- Sidebar options list -->
          <div class="bubble-sidebar shadow-lg" :class="{ open: isSidebarOpen }">
            <div class="sidebar-header d-flex justify-content-between align-items-center p-4 pb-3">
              <h5 class="fw-bold mb-0 text-dark">Opciones</h5>
              <button
                class="btn btn-sm btn-light rounded-circle sidebar-close-btn"
                @click="toggleSidebar"
              >
                <i class="bi bi-x fs-5"></i>
              </button>
            </div>
            <div class="p-4 pt-2 d-flex flex-column gap-3 sidebar-scroll">
              <button
                v-for="opt in mobileOptions"
                :key="opt.id"
                @click="selectMobileTab(opt.id)"
                class="btn text-start d-flex align-items-center gap-3 p-3 w-100 rounded-3 border-0 shadow-sm"
                :class="activeMobileTab === opt.id ? 'active-menu-btn' : 'inactive-menu-btn'"
              >
                <i :class="['bi', opt.icon, 'fs-4']"></i>
                <span class="fw-semibold">{{ opt.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
    <!-- /settings-page -->

    <!-- Modales -->
  </DashboardLayout>
</template>

<style scoped>
.settings-page {
  animation: fadeInUp 0.35s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Cards ── */
.settings-card {
  transition: box-shadow 0.25s ease;
}
.settings-card:hover {
  box-shadow: 0 8px 30px rgba(18, 62, 147, 0.1) !important;
}

/* ── Icon badge ── */
.settings-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.bg-primary-soft {
  background: rgba(18, 62, 147, 0.1);
}
.bg-success-soft {
  background: rgba(34, 197, 94, 0.1);
}
.bg-info-soft {
  background: rgba(6, 182, 212, 0.1);
}
.bg-warning-soft {
  background: rgba(245, 158, 11, 0.1);
}

/* ── Toggle rows ── */
.toggle-row {
  background: #f8fafc;
  transition: background 0.2s;
}
.toggle-row:hover {
  background: #f1f5f9;
}
.toggle-icon-mini {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  flex-shrink: 0;
}

/* ── Switch customization ── */
.settings-switch {
  width: 2.8em;
  height: 1.5em;
  cursor: pointer;
}
.settings-switch:checked {
  background-color: #123e93;
  border-color: #123e93;
}

/* ── Status rows ── */
.status-row {
  background: #f8fafc;
  transition: background 0.2s;
}
.status-row:hover {
  background: #f1f5f9;
}

.status-badge-success {
  background: rgba(34, 197, 94, 0.15);
  color: #16a34a;
  font-weight: 600;
  font-size: 0.72rem;
}
.status-badge-warning {
  background: rgba(245, 158, 11, 0.15);
  color: #d97706;
  font-weight: 600;
  font-size: 0.72rem;
}
.status-badge-danger {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
  font-weight: 600;
  font-size: 0.72rem;
}

/* ── Tool buttons ── */
.tool-btn {
  background: #f8fafc;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  color: inherit;
}
.tool-btn:hover:not(:disabled) {
  background: #f0f4ff;
  border-color: rgba(18, 62, 147, 0.15);
  transform: translateX(3px);
}
.tool-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.tool-btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}

/* ── Inputs ── */
.settings-input {
  border-radius: 10px;
  border-color: #e2e8f0;
  padding: 0.55rem 0.85rem;
  font-size: 0.9rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.settings-input:focus {
  border-color: #123e93;
  box-shadow: 0 0 0 3px rgba(18, 62, 147, 0.1);
}

/* ── border-light override ── */
.border-light {
  border-color: #eee !important;
}

/* ── Mobile Sidebar Styles ── */
.mobile-settings-wrapper {
  position: relative;
  z-index: 1050;
}

.bubble-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #123e93, #1e4bb5);
  color: white;
  border: none;
  z-index: 1060;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 8px 25px rgba(18, 62, 147, 0.4) !important;
}

.bubble-btn:active {
  transform: scale(0.92);
}

.bubble-btn.is-open {
  background: #dc2626;
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4) !important;
  transform: rotate(90deg);
}

.bubble-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1050;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.bubble-sidebar {
  position: fixed;
  bottom: 100px;
  right: 24px;
  width: calc(100vw - 48px);
  max-width: 400px;
  max-height: calc(100vh - 140px);
  background: #f8fafc;
  border-radius: 28px;
  z-index: 1055;
  transform: scale(0.8) translateY(40px);
  transform-origin: bottom right;
  opacity: 0;
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.bubble-sidebar.open {
  transform: scale(1) translateY(0);
  opacity: 1;
  pointer-events: auto;
}

.sidebar-header {
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
}

.sidebar-close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border: none;
  transition: background 0.2s;
}

.sidebar-close-btn:hover {
  background: #e2e8f0;
}

.sidebar-scroll {
  overflow-y: auto;
  flex: 1;
  padding-bottom: 2rem !important;
}

.sidebar-scroll::-webkit-scrollbar {
  width: 5px;
}
.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.sidebar-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.active-menu-btn {
  background: linear-gradient(135deg, #123e93, #1e4bb5) !important;
  color: white !important;
  box-shadow: 0 4px 15px rgba(18, 62, 147, 0.2);
}
.inactive-menu-btn {
  background: #ffffff;
  color: #475569;
}
.inactive-menu-btn:hover {
  background: #f1f5f9;
}
</style>
