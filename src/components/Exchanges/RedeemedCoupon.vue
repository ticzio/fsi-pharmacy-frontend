<script setup lang="ts">
import { computed } from 'vue'
import { useMoment } from '@/composables/useMoment'

const props = defineProps<{
  exchange: any
}>()

const { getMoment } = useMoment()

// Data extraction with safe navigation
const operatorName = computed(() => props.exchange?.id_user?.full_name || 'N/A')
const exchangeDate = computed(() => {
  const date = props.exchange?.exchanged_at
  return date ? getMoment(date).format('DD/MM/YYYY') : 'N/A'
})
const exchangeTime = computed(() => {
  const date = props.exchange?.exchanged_at
  return date ? getMoment(date).format('h:mm a') : 'N/A'
})
const clientName = computed(() => props.exchange?.id_coupon_client?.id_client?.full_name || 'N/A')
const clientDni = computed(() => props.exchange?.id_coupon_client?.id_client?.dni || 'N/A')
const benefit = computed(() => props.exchange?.id_coupon_client?.id_coupon?.name || 'N/A')
const levelName = computed(() => props.exchange?.id_coupon_client?.id_coupon?.id_level?.name || 'N/A')
const pharmacyName = computed(() => props.exchange?.id_pharmacy?.name || 'N/A')
const couponCode = computed(() => props.exchange?.id_coupon_client?.code || '-')

// Coupon Preview Data
const couponName = computed(() => props.exchange?.id_coupon_client?.id_coupon?.name || 'Cupón')
const couponDesc = computed(() => props.exchange?.id_coupon_client?.id_coupon?.description || '')
const couponImage = computed(() => props.exchange?.id_coupon_client?.id_coupon?.url_img)

// Flexibility for extra data
const extraData = computed(() => {
  // Extract fields that are not already handled
  const handledKeys = [
    'id', 'id_user', 'exchanged_at', 'id_coupon_client', 'id_pharmacy', 'active', 'timestamp'
  ]
  return Object.entries(props.exchange || {})
    .filter(([key]) => !handledKeys.includes(key))
    .map(([key, value]) => ({ key, value }))
})
</script>

<template>
  <div class="redeemed-coupon-detail p-3">
    <h4 class="fw-bold mb-4 text-dark">Detalle de canje</h4>

    <div class="row g-4 align-items-center">
      <!-- Columna Izquierda: Tarjeta de Cupón -->
      <div class="col-12 col-md-5">
        <div class="coupon-preview-card bg-white rounded-4 shadow-sm border p-3 h-100 position-relative">
          <div class="d-flex align-items-start mb-3">
            <div class="coupon-icon-box bg-primary rounded-3 flex-shrink-0 d-flex align-items-center justify-content-center text-white me-3" style="width: 70px; height: 70px;">
              <template v-if="couponImage">
                <img :src="couponImage" class="w-100 h-100 object-fit-cover rounded-3" alt="Coupon">
              </template>
              <template v-else>
                <div class="text-center lh-1">
                  <div class="fw-bold small">DCTO</div>
                  <div class="fw-bold h4 mb-0">30%</div>
                  <div class="small" style="font-size: 0.6rem;">OFF</div>
                </div>
              </template>
            </div>
            <div class="flex-grow-1 overflow-hidden">
              <h6 class="fw-bold mb-1 text-truncate">{{ couponName }}</h6>
              <p class="text-muted small mb-0 line-clamp-2">{{ couponDesc }}</p>
            </div>
            <div class="arrow-icon ms-2">
              <i class="bi bi-arrow-right-circle fs-5 text-secondary"></i>
            </div>
          </div>
          
          <div class="divider border-bottom border-dashed my-3"></div>
          
          <div class="coupon-code-footer d-flex align-items-center">
            <span class="text-muted small text-uppercase fw-bold me-2">CODIGO:</span>
            <span class="fw-bold text-dark">{{ couponCode }}</span>
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Información Detallada -->
      <div class="col-12 col-md-7">
        <div class="details-list">
          <div class="detail-item mb-2 d-flex">
            <span class="detail-label text-muted me-2">Operador:</span>
            <span class="detail-value fw-medium">{{ operatorName }}</span>
          </div>
          <div class="detail-item mb-2 d-flex">
            <span class="detail-label text-muted me-2">Fecha de canje:</span>
            <span class="detail-value fw-medium">{{ exchangeDate }}</span>
          </div>
          <div class="detail-item mb-2 d-flex">
            <span class="detail-label text-muted me-2">Hora:</span>
            <span class="detail-value fw-medium">{{ exchangeTime }}</span>
          </div>
          <div class="detail-item mb-2 d-flex">
            <span class="detail-label text-muted me-2">Cliente:</span>
            <span class="detail-value fw-medium">{{ clientName }}</span>
          </div>
          <div class="detail-item mb-2 d-flex">
            <span class="detail-label text-muted me-2">Cédula:</span>
            <span class="detail-value fw-medium">{{ clientDni }}</span>
          </div>
          <div class="detail-item mb-2 d-flex">
            <span class="detail-label text-muted me-2">Beneficio:</span>
            <span class="detail-value fw-medium">{{ benefit }}</span>
          </div>
          <div class="detail-item mb-2 d-flex">
            <span class="detail-label text-muted me-2">Nivel:</span>
            <span class="detail-value fw-medium">{{ levelName }}</span>
          </div>
          <div class="detail-item mb-2 d-flex">
            <span class="detail-label text-muted me-2">Sede:</span>
            <span class="detail-value fw-medium">{{ pharmacyName }}</span>
          </div>
          
          <!-- Flexibilidad para datos extra -->
          <template v-if="extraData.length">
            <div v-for="data in extraData" :key="data.key" class="detail-item mb-2 d-flex">
              <span class="detail-label text-muted me-2 text-capitalize">{{ data.key.replace(/_/g, ' ') }}:</span>
              <span class="detail-value fw-medium">{{ data.value }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Barra de Código Principal -->
    <div class="mt-5">
      <div class="code-bar bg-success text-white text-center py-3 rounded-4 shadow-sm fw-bold h4 mb-0 letter-spacing-2">
        {{ couponCode }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.redeemed-coupon-detail {
  font-family: 'Inter', sans-serif;
}

.coupon-preview-card {
  transition: transform 0.2s ease;
  border-color: #f0f0f0 !important;
}

.border-dashed {
  border-style: dashed !important;
  opacity: 0.3;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.detail-label {
  min-width: 120px;
  font-size: 0.95rem;
}

.detail-value {
  color: #1a1a1a;
  font-size: 0.95rem;
}

.code-bar {
  background-color: #28a745 !important; /* Vivid green like the image */
  text-transform: uppercase;
  letter-spacing: 2px;
}

.letter-spacing-2 {
  letter-spacing: 2px;
}

@media (max-width: 767px) {
  .detail-label {
    min-width: 100px;
  }
}
</style>
