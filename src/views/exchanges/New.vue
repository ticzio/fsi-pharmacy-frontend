<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '@/components/DashboardLayout.vue'
import titleSection from '@/components/common/titleSection.vue'
import SearchInput from '@/components/common/SearchInput.vue'

//Composables
import { useStore } from 'vuex'
import { useExchanges } from '@/composables/Models/useExchanges'
import { useSwalToast } from '@/composables/useSwalToast'
import { useCookies } from '@/composables/useCookies'

import { filterDniCharacters } from '@/utils/funcDni'
import { TITLE_SECTION_COMPONENT } from '@/const/tableConst'

interface Item {
  id: string | number
  [key: string]: any
}

const store = useStore()
const swalToast = useSwalToast()
const isMobile = computed(() => store.getters.isMobile)

const {
  loading: exchangesLoading,
  exchanges,
  pagination,
  getExchanges,
  saveExchange,
  checkCoupon,
} = useExchanges()

const { getCookie } = useCookies()
const idPharmacy = getCookie('fsi_pharmacy_id_pharmacy')

// Search and Validation State
const searchCode = ref('')
const searchCI = ref('')
const isValidating = ref(false)
const couponFound = ref<any>(null)
const validationError = ref('')
const ciIsFocused = ref(false)

// Handler directo para el input de CI - manipula el DOM directamente para evitar
// problemas de reactividad donde Vue omite actualizar el input si el valor filtrado
// es igual al valor anterior del ref.
const handleCIInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const filtered = filterDniCharacters(target.value)
  target.value = filtered   // Actualiza el DOM directamente
  searchCI.value = filtered // Sincroniza el ref
}

const handleCIKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    validateCoupon()
  }
}

const isCouponValid = computed(() => {
  return couponFound.value && !Array.isArray(couponFound.value) && !couponFound.value.is_redeemed
})

const validateCoupon = async () => {
  if (!searchCode.value || !searchCI.value) {
    swalToast.showError('Por favor ingrese el código y la cédula')
    return
  }

  isValidating.value = true
  couponFound.value = null
  validationError.value = ''

  try {
    const data = await checkCoupon(searchCode.value, searchCI.value)
    if (data && !Array.isArray(data)) {
      couponFound.value = data
    } else {
      couponFound.value = null
      // Si el backend retorna [] con código 200, el composable no muestra error, lo hacemos aquí
      swalToast.showError('Cupón no encontrado o datos incorrectos')
    }
  } catch (error: any) {
    console.error('Error validating coupon:', error)
  } finally {
    isValidating.value = false
  }
}

const handleUseCoupon = async () => {
  if (!couponFound.value) return

  const success = await saveExchange(searchCode.value, searchCI.value)
  if (success) {
    couponFound.value = null
    searchCode.value = ''
    searchCI.value = ''
    fetchRecentActivity()
  }
}

const fetchRecentActivity = () => {
  getExchanges(1, '', idPharmacy)
}

const recentExchanges = computed(() => {
  if (Array.isArray(exchanges.value)) {
    return exchanges.value
  }
  if (exchanges.value && typeof exchanges.value === 'object' && Array.isArray((exchanges.value as any).data)) {
    return (exchanges.value as any).data
  }
  return []
})

onMounted(() => {
  fetchRecentActivity()
})
</script>

<template>
  <DashboardLayout>
    <div class="redemption-page d-flex flex-column gap-4">
      <titleSection
        title="Canjeo De Cupón"
        description="Panel de farmacias San Ignacio"
        :show-logo="true"
      />

      <!-- Search Card -->
      <div
        class="search-card card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white position-relative overflow-visible mb-4"
      >
        <div class="row g-4 align-items-end">
          <div class="col-12 col-md-4">
            <h6 class="fw-bold mb-3 text-dark">Cupón de tu cliente</h6>
            <SearchInput
              id="coupon-code"
              v-model="searchCode"
              placeholder="Escriba el codigo de 6 digitos"
              :loading="isValidating"
              :only-on-enter="true"
              @search="validateCoupon"
            />
          </div>
          <div class="col-12 col-md-4">
            <h6 class="fw-bold mb-3 text-dark">Cédula del cliente</h6>
            <div class="input-group search-group" :class="{ 'is-focused': ciIsFocused }">
              <span class="input-group-text search-icon-wrap" :class="{ 'text-primary': ciIsFocused }">
                <i class="bi bi-search text-muted transition-icon" :class="{ 'text-primary': ciIsFocused }"></i>
              </span>
              <input
                id="client-ci"
                type="text"
                class="form-control search-control"
                :value="searchCI"
                placeholder="Ej: V-12345678 o 12345678"
                autocomplete="off"
                spellcheck="false"
                @input="handleCIInput"
                @focus="ciIsFocused = true"
                @blur="ciIsFocused = false"
                @keydown="handleCIKeydown"
              />
              <span
                v-if="searchCI"
                class="input-group-text clear-wrap"
                @click="searchCI = ''; ciIsFocused = false"
                title="Limpiar"
              >
                <button class="btn btn-link p-0 text-muted text-decoration-none" type="button" tabindex="-1">
                  <i class="bi bi-x-lg"></i>
                </button>
              </span>
            </div>
          </div>
          <div class="col-12 col-md-auto ms-md-auto">
            <button
              class="btn btn-primary px-5 py-2 fw-bold rounded-pill shadow-sm"
              @click="validateCoupon"
              :disabled="isValidating"
            >
              <span v-if="isValidating" class="spinner-border spinner-border-sm me-2"></span>
              Validar
            </button>
          </div>
          <div class="col-12 col-md-auto">
            <transition name="fade">
              <div
                v-if="isCouponValid"
                class="status-badge-custom success py-2 px-4 rounded-pill border border-success text-success fw-bold text-center"
              >
                Cupón disponible
              </div>
              <div
                v-else-if="couponFound && couponFound.is_redeemed"
                class="status-badge-custom danger py-2 px-4 rounded-pill border border-danger text-danger fw-bold text-center"
              >
                Cupón ya canjeado
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- Result Sections with Transition -->
      <transition name="slide-up" mode="out-in">
        <div v-if="couponFound" key="results" class="row g-4 flex-grow-1">
          <!-- Detalle de cupón -->
          <div class="col-12 col-lg-5">
            <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h5 class="fw-bold mb-4 text-dark border-bottom pb-2">Detalle de cupón</h5>

              <div class="details-list d-flex flex-column gap-3 mb-4">
                <div class="detail-item">
                  <span class="text-muted d-block small">Cliente:</span>
                  <span class="fw-bold text-dark">{{ couponFound.client.full_name || 'N/A' }}</span>
                </div>
                <div class="detail-item">
                  <span class="text-muted d-block small">Nivel:</span>
                  <span class="fw-bold text-dark">{{
                    couponFound.coupon?.id_levels?.name || 'N/A'
                  }}</span>
                </div>
                <div class="detail-item">
                  <span class="text-muted d-block small">Nombre del cupón:</span>
                  <span class="fw-bold text-dark">{{
                    couponFound.coupon?.name || 'N/A'
                  }}</span>
                </div>
                <div class="detail-item">
                  <span class="text-muted d-block small">Fecha de expiración:</span>
                  <span class="fw-bold text-dark" v-format-date="couponFound.coupon?.finish_date" ></span>
                </div>
              </div>

              <button
                class="btn btn-success w-100 text-white py-3 fw-bold rounded-pill shadow-sm mt-auto"
                @click="handleUseCoupon"
              >
                Utilizar
              </button>
            </div>
          </div>

          <!-- Actividad reciente -->
          <div class="col-12 col-lg-7">
            <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h5 class="fw-bold mb-4 text-dark border-bottom pb-2">Actividad reciente</h5>
              <div class="table-responsive">
                <table class="table table-hover align-middle custom-activity-table">
                  <thead>
                    <tr class="text-muted small uppercase">
                      <th>Código</th>
                      <th>Nivel</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Sede</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in recentExchanges.slice(0, 5)" :key="item.id">
                      <td class="fw-bold text-dark">{{ item.coupon_client?.coupon?.code }}</td>
                      <td class="text-muted">
                        {{ item.coupon_client?.coupon?.id_levels?.name }}
                      </td>
                      <td class="text-muted" v-format-date="item.exchanged_at" ></td>
                      <td class="text-muted" v-format-time="item.created_at" ></td>
                      <td class="fw-bold">{{ item.id_pharmacy?.name }}</td>
                    </tr>
                    <tr v-if="recentExchanges.length === 0">
                      <td colspan="4" class="text-center py-4 text-muted">
                        No hay actividad reciente
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Fallback section -->
        <div
          v-else
          key="empty"
          class="fallback-section d-flex flex-column align-items-center justify-content-center py-5"
        >
          <div class="illustration-container mb-4">
            <i class="bi bi-search-heart display-1 text-primary opacity-25"></i>
          </div>
          <div class="text-center">
            <h3 class="fw-bold text-dark mb-2">Esperando búsqueda</h3>
            <p class="text-muted mb-0">
              Ingrese el código y la cédula del cliente para validar un cupón.
            </p>
          </div>
        </div>
      </transition>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.redemption-page {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.search-card {
  z-index: 10;
}

.avatar-float {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 5px;
  border-radius: 50%;
  z-index: 20;
}

.status-badge-custom {
  min-width: 180px;
}

.custom-activity-table thead th {
  border: none;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.custom-activity-table tbody td {
  padding: 1rem 0.5rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fallback-section {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 2rem;
  border: 1px dashed #dee2e6;
  transition: all 0.3s ease;
}

.illustration-container {
  max-width: 300px;
  filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.1));
}

.fallback-section:hover .bi-search-heart {
  opacity: 0.5 !important;
  transform: scale(1.1);
}

/* ── SearchInput-matching styles for the native CI input ────────────── */

.search-group {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #fff;
  transition: all 0.3s ease;
}

.search-group:hover {
  border-color: #d1d5db;
}

.search-group.is-focused,
.search-group:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.12);
}

.search-icon-wrap,
.clear-wrap {
  background: transparent;
  border: none;
  padding: 0 0.75rem;
  min-width: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.transition-icon {
  transition: color 0.3s ease;
}

.clear-wrap {
  cursor: pointer;
  transition: background 0.15s;
}

.clear-wrap:hover {
  background: rgba(0, 0, 0, 0.04);
}

.search-control {
  border: none !important;
  box-shadow: none !important;
  background: transparent;
  font-size: 0.95rem;
  padding: 0.65rem 0.5rem;
  color: #111827;
}

.search-control::placeholder {
  color: #9ca3af;
  font-size: 0.93rem;
  transition: color 0.3s ease;
}

.search-group.is-focused .search-control::placeholder {
  color: #cdd4df;
}

.search-control:focus {
  background: transparent;
  outline: none;
}
</style>
