<script setup lang="ts">
import { computed } from 'vue'
import StatusBadge from '@/components/common/StatusBadge.vue'

interface Action {
  name: string
  icon: string
  class: string
  tooltip?: string
}

const props = defineProps<{
  item: any
  actions?: Action[]
}>()

const emit = defineEmits<{
  (e: 'action-click', payload: { actionName: string; item: any }): void
  (e: 'card-click', item: any): void
}>()

const title = computed(() => props.item.name || props.item.title || 'Beneficio')
const imageUrl = computed(() => props.item.url_image || props.item.url_img || '')
const status = computed(() => props.item.active)

const handleAction = (actionName: string) => {
  emit('action-click', { actionName, item: props.item })
}
</script>

<template>
  <div 
    class="benefit-card h-100 bg-white border rounded-4 overflow-hidden position-relative shadow-sm transition-all"
    @click="$emit('card-click', item)"
  >
    <!-- Image Section -->
    <div class="card-image-wrapper position-relative" style="height: 160px;">
      <img v-if="imageUrl" :src="imageUrl" class="w-100 h-100 object-fit-cover" :alt="title" />
      <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center bg-light-subtle">
        <i class="bi bi-image text-muted opacity-25" style="font-size: 3rem;"></i>
      </div>
      
      <!-- Status Badge Overlay -->
      <div class="position-absolute top-0 end-0 p-3">
        <StatusBadge :status="status" />
      </div>
    </div>

    <!-- Content Section -->
    <div class="card-body p-4 d-flex flex-column">
      <h6 class="fw-bold mb-2 text-dark line-clamp-2">{{ title }}</h6>
      
      <!-- Placeholder description or other info if available in item -->
      <p v-if="item.description" class="small text-muted mb-3 line-clamp-2">
        {{ item.description }}
      </p>

      <div class="mt-auto pt-3 d-flex justify-content-between align-items-center border-top">
        <div class="d-flex gap-2">
          <button 
            v-for="action in actions" 
            :key="action.name"
            class="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
            :class="action.class"
            style="width: 32px; height: 32px;"
            :title="action.tooltip"
            @click.stop="handleAction(action.name)"
          >
            <i :class="action.icon" style="font-size: 0.9rem;"></i>
          </button>
        </div>
        
        <button class="btn btn-link btn-sm p-0 text-primary text-decoration-none fw-bold">
          Ver más <i class="bi bi-chevron-right ms-1"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.benefit-card {
  cursor: pointer;
  border-color: #f0f0f0 !important;
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08) !important;
  border-color: #4f46e5 !important;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.transition-all {
  transition: all 0.3s ease;
}

.bg-primary {
  background-color: #4f46e5 !important;
}

.text-primary {
  color: #4f46e5 !important;
}
</style>
