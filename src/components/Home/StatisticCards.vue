<script setup lang="ts">
export interface StatisticItem {
  value: string | number
  label: string
  highlighted?: boolean
}

defineProps<{
  items: StatisticItem[]
}>()
</script>

<template>
  <div class="row g-2 g-md-3">
    <div v-for="(item, index) in items" :key="index" class="col-6 col-lg-3">
      <div
        class="card card-blue text-white text-center rounded-4 py-3 py-md-3 shadow-sm h-100 d-flex justify-content-center"
        :class="item.highlighted ? 'position-relative outline-blue' : 'border-0'"
      >
        <h2 class="fw-bold mb-0 italic-numbers stat-value">{{ item.value }}</h2>
        <p class="mb-0 fw-medium stat-label">{{ item.label }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.italic-numbers {
  font-style: italic;
  font-family: 'Arial', sans-serif;
  letter-spacing: -0.5px;
}
.card-blue {
  background-color: #214b98 !important; /* Muted corporate blue matching the image */
}
.outline-blue {
  border: 1px solid #75baff;
  box-shadow:
    0 0 0 4px #214b98,
    0 0 0 6px #75baff;
}

.stat-value {
  font-size: 2.5rem;
}

.stat-label {
  font-size: 1rem;
}

@media (max-width: 767.98px) {
  .stat-value {
    font-size: 1.5rem;
  }
  .stat-label {
    font-size: 0.8rem;
    line-height: 1.2;
  }
  .card {
    padding-top: 0.8rem !important;
    padding-bottom: 0.75rem !important;
  }
}
</style>
