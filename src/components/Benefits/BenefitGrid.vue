<script setup lang="ts">
import type { BenefitInterface } from '@/composables/Models/useBenefits'

defineProps<{
  benefits: BenefitInterface[]
  loading?: boolean
}>()
</script>

<template>
  <div class="benefit-list-redesign mb-5">
    <h5 class="fw-bold mb-3">Beneficios:</h5>
    <div class="benefit-card bg-white rounded-5 border border-light-subtle p-4 shadow-sm">
      <h6 class="fw-bold mb-4"><i>Tus beneficios exclusivos</i></h6>
      
      <div v-if="loading" class="d-flex justify-content-center p-5">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else-if="benefits.length === 0" class="text-center p-5 text-muted">
        No hay beneficios configurados para este nivel.
      </div>
      <div v-else class="d-flex flex-column gap-4">
        <div v-for="benefit in benefits" :key="benefit.id" class="d-flex align-items-center gap-3">
          <div class="icon-wrapper d-flex align-items-center justify-content-center rounded-2" style="width: 32px; height: 32px; background-color: transparent;">
            <i class="bi bi-patch-check-fill text-success fs-4"></i>
          </div>
          <span class="text-dark">{{ benefit.body_only_text || benefit.body }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.benefit-card {
  border-color: #f0f0f0 !important;
  min-height: 200px;
}

.text-success {
  color: #28a745 !important;
}

</style>
