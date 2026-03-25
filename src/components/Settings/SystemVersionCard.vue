<template>
  <div
    class="version-card card border-0 rounded-4 p-4"
    style="background: linear-gradient(135deg, #123e93 0%, #1e3888 100%)"
  >
    <div class="d-flex align-items-center gap-2 mb-3">
      <i class="bi bi-info-circle-fill text-white-50"></i>
      <span class="text-white fw-semibold small">Versión del Sistema</span>
    </div>
    <div class="d-flex flex-column gap-1">
      <div class="d-flex justify-content-between">
        <span class="text-white-50 small">Frontend Version</span>
        <span class="text-white fw-bold small">v{{ APP_VERSION }}</span>
      </div>
      <div class="d-flex justify-content-between">
        <span class="text-white-50 small">Backend Version</span>
        <span class="text-white fw-bold small">v{{ API_VERSION }}</span>
      </div>
      <div class="d-flex justify-content-between">
        <span class="text-white-50 small">Backend Chat Version</span>
        <span class="text-white fw-bold small">v{{ chatVersion || '...' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { API_VERSION } from '../../services/initApi'
import packageJson from '../../../package.json'

defineProps<{
  chatVersion: string | null
}>()

const APP_VERSION = packageJson.version
</script>

<style scoped>
/* Scoped styles if necessary in the future */
</style>
