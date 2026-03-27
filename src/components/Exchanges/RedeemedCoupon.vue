<script setup lang="ts">
import { computed } from 'vue'
import { useMoment } from '@/composables/useMoment'
import CustomCard from '@/components/common/CustomCard.vue'

const props = defineProps<{
  exchange: any
}>()

const { getMoment } = useMoment()

// Data extraction with safe navigation
const operatorName = computed(() => props.exchange?.id_users?.full_name || 'N/A')
const exchangeDate = computed(() => {
  const date = props.exchange?.exchanged_at
  return date ? getMoment(date).format('DD/MM/YYYY') : 'N/A'
})
const exchangeTime = computed(() => {
  const date = props.exchange?.exchanged_at
  return date ? getMoment(date).format('h:mm a') : 'N/A'
})
const clientName = computed(() => props.exchange?.coupon_client?.client?.full_name || 'N/A')
const clientDni = computed(() => props.exchange?.coupon_client?.client?.ci || 'N/A')
const benefit = computed(() => props.exchange?.coupon_client?.coupon?.name || 'N/A')
const levelName = computed(() => props.exchange?.coupon_client?.coupon?.id_levels?.name || 'N/A')
const pharmacyName = computed(() => props.exchange?.id_pharmacy?.name || 'N/A')
const couponCode = computed(() => props.exchange?.coupon_client?.coupon?.code || '-')

// Coupon Preview Data
const couponName = computed(() => props.exchange?.coupon_client?.coupon?.name || 'Cupón')
const couponDesc = computed(() => props.exchange?.coupon_client?.coupon?.description || '')
const couponImage = computed(() => props.exchange?.coupon_client?.coupon?.url_img)
const startDate = computed(() => props.exchange?.coupon_client?.coupon?.start_date || '-')
const finishDate = computed(() => props.exchange?.coupon_client?.coupon?.finish_date || '-')

// Flexibility for extra data
const extraData = computed(() => {
  // Extract fields that are not already handled in the direct list
  const handledKeys = [
    'id',
    'id_user',
    'exchanged_at',
    'id_coupon_client',
    'id_pharmacy',
    'active',
    'timestamp',
    'id_users',
    'coupon_client',
    // also exclude specific nested objects if they appear as keys
    'operator',
    'pharmacy',
  ]
  return Object.entries(props.exchange || {})
    .filter(([key, value]) => !handledKeys.includes(key) && typeof value !== 'object')
    .map(([key, value]) => ({ key, value }))
})
</script>

<template>
  <div class="redeemed-coupon-detail p-3">
    <div class="row g-4 align-items-center">
      <!-- Columna Izquierda: Tarjeta de Cupón -->
      <div class="col-12 col-md-5">
        <CustomCard
          :item="{
            name: couponName,
            description: couponDesc,
            url_img: couponImage,
            start_date: startDate,
            finish_date: finishDate,
          }"
        >
          <template #footer>
            <div class="d-flex justify-content-between align-items-center mt-auto w-100">
              <div class="date-range small text-muted fw-medium">
                {{ startDate }} - {{ finishDate }}
              </div>
              <div class="coupon-code-footer d-flex align-items-center">
                <span class="text-muted small text-uppercase fw-bold me-2">COD:</span>
                <span class="fw-bold text-dark">{{ couponCode }}</span>
              </div>
            </div>
          </template>
        </CustomCard>
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
        </div>
      </div>
    </div>

    <!-- Barra de Código Principal -->
    <div class="mt-5">
      <div
        class="code-bar bg-success text-white text-center py-3 rounded-4 shadow-sm fw-bold h4 mb-0 letter-spacing-2"
      >
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
