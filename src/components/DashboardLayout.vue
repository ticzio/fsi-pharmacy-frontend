<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useSwal } from '@/composables/useSwal'

import { MENU_ITEMS, isMenuItemActive } from '@/const/menuItems'
import type { MenuItem } from '@/const/menuItems'
import { useCookies } from '@/composables/useCookies'
import defaultAvatar from '@/assets/images/default-profile.png'
import fsiLogo from '@/assets/images/login/login_logo_FSI.png'

const store = useStore()
const route = useRoute()
const router = useRouter()
const swal = useSwal()

const { getCookie } = useCookies()
const CookiesFullName = getCookie('fsi_admin_full_name') || 'Usuario'
const CookiesEmail = getCookie('fsi_admin_email') || 'Administrador'
const CookiesUrlImage = getCookie('fsi_admin_url_image')

// Helper para verificar si un item está activo
const isItemActive = (item: MenuItem): boolean => {
  return isMenuItemActive(item, route.path)
}

// Responsive sidebar logic
const isMobile = ref(window.innerWidth <= 1024)
const sidebarVisible = ref(false)

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 1024
  if (!isMobile.value) {
    sidebarVisible.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', updateIsMobile)
  updateIsMobile()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})

// Cierra la sidebar en móvil automáticamente al cambiar de ruta
router.afterEach(() => {
  if (isMobile.value) {
    sidebarVisible.value = false
  }
})

const toggleSidebar = () => {
  if (isMobile.value) {
    sidebarVisible.value = !sidebarVisible.value
  }
}

const closeSidebar = () => {
  if (isMobile.value) {
    sidebarVisible.value = false
  }
}

const handleLogout = async () => {
  try {
    const result = await swal.showConfirm(
      '¿Estás seguro de cerrar sesión?',
      'Esta acción cerrará tu sesión actual.',
    )
    if (result) {
      await store.dispatch('logout')
      router.push('/login')
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="dashboard-layout">
    <!-- Sidebar Overlay for mobile -->
    <div v-if="isMobile && sidebarVisible" class="sidebar-overlay" @click="closeSidebar"></div>

    <!-- Sidebar -->
    <aside
      class="sidebar"
      :class="{
        'sidebar-mobile': isMobile,
        'sidebar-mobile-open': isMobile && sidebarVisible,
      }"
    >
      <div class="sidebar-content-wrapper d-flex flex-column h-100">
        <!-- User Profile Area -->
        <div class="user-profile mb-4 mt-5 px-4 d-flex flex-column align-items-start gap-3">
          <img
            :src="CookiesUrlImage || defaultAvatar"
            width="60"
            height="60"
            class="ratio-1x1 overflow-hidden object-fit-cover shadow-sm profile-img"
            alt="Avatar"
          />
          <div class="user-info w-100">
            <h5 class="text-white mb-0 fw-bold text-truncate" :title="CookiesFullName">
              {{ CookiesFullName }}
            </h5>
            <small class="text-white-50 text-truncate d-block">{{ CookiesEmail }}</small>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="sidebar-nav mt-3">
          <ul class="nav flex-column gap-1">
            <li v-for="item in MENU_ITEMS" :key="item.to" class="nav-item">
              <router-link
                :to="item.to"
                :class="['nav-link custom-nav-link', { active: isItemActive(item) }]"
              >
                <span class="fs-6">{{ item.label }}</span>
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- Footer Logo / Text -->
        <div class="mt-auto px-4 py-4 text-start">
          <div class="d-flex align-items-center justify-content-start gap-2">
            <div class="ticz-icon"></div>
            <span class="text-white fw-medium" style="font-size: 0.75rem"
              >Desarrollado por Ticz</span
            >
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="main-content-wrapper p-3 p-xl-4 pe-xl-5 pb-xl-5 pt-xl-4 w-100">
      <!-- Main Content Card -->
      <div class="main-content-card bg-white h-100 d-flex flex-column w-100">
        <!-- Mobile Header (Only visible on mobile) -->
        <header
          v-if="isMobile"
          class="mobile-header d-flex align-items-center justify-content-between p-3 border-bottom flex-shrink-0"
        >
          <button
            class="btn btn-link text-dark p-0 m-0 text-decoration-none"
            @click="toggleSidebar"
            title="Abrir menú"
          >
            <i class="bi-list fs-1"></i>
          </button>
          <img :src="fsiLogo" alt="Logo FSI" class="mobile-header-logo" />
          <button
            class="btn btn-link text-decoration-none text-danger d-flex align-items-center"
            @click="handleLogout"
            title="Cerrar sesión"
          >
            <i class="bi bi-door-open fs-4"></i>
          </button>
        </header>

        <!-- Desktop Header Logout Button -->
        <header
          v-if="!isMobile"
          class="desktop-header d-flex align-items-center justify-content-end px-4 pt-3 flex-shrink-0"
        >
          <button
            class="btn btn-link text-decoration-none text-secondary d-flex align-items-center logout-btn"
            @click="handleLogout"
            title="Cerrar sesión"
          >
            <i class="bi bi-people-fill me-2 fs-5"></i>
            <span class="fw-medium">Cerrar Sesión</span>
          </button>
        </header>

        <!-- Page Content -->
        <main class="content-body flex-grow-1 overflow-auto p-4 w-100">
          <slot></slot>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  background-color: #123e93; /* Solid background as fallback */
  background-image: url('@/assets/images/dashboardLayout/background_dashboard.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

/* SIDEBAR */
.sidebar {
  width: 250px;
  background-color: transparent;
  color: #fff;
  transition: all 0.3s ease;
  z-index: 99;
  position: relative;
  flex-shrink: 0;
}

.sidebar-mobile {
  position: fixed;
  left: -280px;
  top: 0;
  height: 100vh;
  width: 280px;
  z-index: 1102; /* Above overlay */
  background-color: #123e93; /* Same blue for mobile */
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.2);
}

.sidebar-mobile.sidebar-mobile-open {
  left: 0;
}

.sidebar-content-wrapper {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  scrollbar-width: thin;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3px);
  z-index: 1100;
}

/* User Profile */
.profile-img {
  border-radius: 8px;
}

/* Nav Menu */
.sidebar-nav {
  padding: 0;
  flex: 1;
}

.custom-nav-link {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.8rem 2rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  border-radius: 0 30px 30px 0;
  margin-right: 1.5rem;
}

.custom-nav-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0%, transparent 100%);
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
}

.custom-nav-link > span {
  position: relative;
  z-index: 1;
}

.custom-nav-link:hover {
  color: rgba(255, 255, 255, 1);
  padding-left: 2.5rem;
}

.custom-nav-link:hover::before {
  width: 100%;
}

.custom-nav-link.active {
  color: #fff;
  font-weight: 700;
}

/* Ticz Icon Dummy Placeholder */
.ticz-icon {
  width: 12px;
  height: 12px;
  background-color: #a3e635; /* Lime green color similar to Ticz icon */
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); /* diamond shape */
}

/* MAIN CONTENT WRAPPER */
.main-content-wrapper {
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-width: 0;
  transition: all 0.3s ease;
}

.main-content-card {
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.content-body {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
  max-width: 100%;
}

.content-body::-webkit-scrollbar {
  width: 6px;
}
.content-body::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}

/* Desktop Header */
.logout-btn {
  color: #64748b !important;
  transition: color 0.2s;
}
.logout-btn:hover {
  color: #ef4444 !important;
}

.mobile-header-logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}

@media (max-width: 1024px) {
  .dashboard-layout {
    padding: 0;
  }
  .sidebar {
    display: none;
  }
  .sidebar-mobile {
    display: block;
  }
  .main-content-wrapper {
    padding: 0 !important;
  }
  .main-content-card {
    border-radius: 0;
  }
}
</style>
