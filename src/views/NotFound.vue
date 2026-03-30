<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const isAuthenticated = computed(() => store.getters.isAuthenticated)

function goHome() {
  router.push(isAuthenticated.value ? '/dashboard' : '/login')
}
</script>

<template>
  <div class="container d-flex align-items-center justify-content-center min-vh-100">
    <div class="text-center">
      <h1 class="display-3 fw-bold text-primary">404</h1>
      <p class="lead mb-3">Página no encontrada</p>
      <p class="text-body-secondary mb-4">La página que buscas no existe o fue movida.</p>
      <div class="d-flex gap-2 justify-content-center">
        <router-link class="btn btn-outline-secondary rounded-pill" to="/">
          Ir al inicio
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.min-vh-100 {
  min-height: var(--app-vh);
}
</style>
