<script setup lang="ts">
export interface StatisticItem {
  value: string | number
  label: string
  highlighted?: boolean
  to?: string
}

const props = defineProps<{
  items: StatisticItem[]
}>()

const emit = defineEmits<{
  (e: 'click-card', item: StatisticItem): void
}>()

const handleCardClick = (item: StatisticItem) => {
  if (item.to) {
    emit('click-card', item)
  }
}
</script>

<template>
  <div class="row g-2 g-md-3">
    <div v-for="(item, index) in items" :key="index" class="col-12 col-md-4">
      <div
        class="card card-green text-white text-center rounded-4 py-3 py-md-3 shadow-sm h-100 d-flex justify-content-center transition-all"
        :class="[
          item.highlighted ? 'position-relative outline-green' : 'border-0',
          item.to ? 'clickable-card' : '',
        ]"
        @click="handleCardClick(item)"
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
.card-green {
  background-color: #2ea02e !important;
}
.outline-green {
  border: 1px solid #7ceb7c;
  box-shadow:
    0 0 0 4px #2ea02e,
    0 0 0 6px #7ceb7c;
}

.clickable-card {
  cursor: pointer;
  user-select: none;
}

.clickable-card:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.clickable-card:active {
  transform: translateY(0) scale(0.98);
  filter: brightness(0.95);
  transition: all 0.05s ease-in-out;
}

.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-value {
  font-size: 2.2rem;
}

.stat-label {
  font-size: 0.95rem;
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
