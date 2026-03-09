<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Modal } from 'bootstrap/dist/js/bootstrap.esm.js'
import { useStore } from 'vuex'
import { useSwal } from '@/composables/useSwal'

const props = defineProps<{
  id_target: string
  name_master_endpoint: string
  title: string
  item: { id: string | number; name?: string; profit_percent?: string }
  field_name?: string
}>()

const emit = defineEmits<{ saved: [] }>()

const store = useStore()
const swal = useSwal()

const modalElement = ref<HTMLElement | null>(null)
let modalInstance: Modal | null = null
const fieldValue = ref('')
const isLoading = ref(false)

// Helpers para formateo en vivo de porcentaje
const formatDigitsString = (value: string) => {
  let digits = String(value).replace(/\D/g, '')
  digits = digits.slice(0, 8)

  if (digits.length === 0) return ''
  if (digits.length === 1) return `0.0${digits}`
  if (digits.length === 2) return `0.${digits}`

  let intPart = digits.slice(0, -2)
  const decPart = digits.slice(-2)
  intPart = intPart.replace(/^0+/, '') || '0'
  return `${intPart}.${decPart}`
}

const normalizeExistingValue = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === '') return ''
  const numeric = Number(value)
  if (!Number.isNaN(numeric)) {
    const cents = Math.round(numeric * 100)
    return formatDigitsString(String(cents))
  }
  return formatDigitsString(String(value))
}

const onInput = (event: Event) => {
  if (props.field_name !== 'profit_percent') return
  const input = event.target as HTMLInputElement
  const formatted = formatDigitsString(input.value)
  fieldValue.value = formatted
  input.value = formatted
}

// Cargar el valor del campo cuando cambie el item
watch(
  () => props.item,
  (newItem) => {
    if (props.field_name === 'profit_percent') {
      fieldValue.value = normalizeExistingValue(newItem?.profit_percent)
    } else {
      fieldValue.value = newItem?.name || ''
    }
  },
  { immediate: true }
)

const openModal = (): void => {
  modalInstance?.show()
}

const closeModal = (): void => {
  modalInstance?.hide()
}

const editActivity = async (): Promise<void> => {
  if (!fieldValue.value.toString().trim()) {
    swal.showConfirm('El campo es obligatorio.', 'Por favor, ingresa un valor.', {
      confirmButtonText: 'Aceptar',
      target: '#' + props.id_target,
      icon: 'error',
    })
    return
  }
  isLoading.value = true
  try {
    const payload = {
      [props.field_name || 'name']: fieldValue.value,
    }
    const response = await store.dispatch('updateData', {
      url: props.name_master_endpoint + '/update',
      id: props.item.id,
      data: { ...payload },
    })

    if (response && (response.code === 200 || response.code === 201)) {
      await swal.showConfirm('Éxito', 'Elemento editado correctamente.', {
        confirmButtonText: 'Aceptar',
        target: '#' + props.id_target,
        icon: 'success',
      })

      closeModal()
      emit('saved')
      return
    }
  } catch (error: any) {
    console.error('Error al editar el elemento:', error)
    await swal.showConfirm('Error al editar el elemento:', 'No se pudo editar el elemento.', {
      confirmButtonText: 'Aceptar',
      target: '#' + props.id_target,
      icon: 'error',
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (modalElement.value) {
    modalInstance = new Modal(modalElement.value)
  }
})

defineExpose({ openModal })
</script>

<template>
  <div ref="modalElement" :id="id_target" class="modal fade" tabindex="-1" style="z-index: 10000">
    <div class="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
      <div class="modal-content rounded-4">
        <div class="modal-header bg-primary px-4">
          <h5 class="modal-title text-white text-camelcase">{{ title }}</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>

        <div class="modal-body">
          <div class="container my-3">
            <div class="row justify-content-center">
              <div class="col-md-10">
                <div class="col-md-12 mb-3">
                  <label for="field-input">
                    {{ props.field_name === 'profit_percent' ? 'Porcentaje (%)' : 'Nombre:' }}
                  </label>
                  <input
                    id="field-input"
                    type="text"
                    class="form-control"
                    v-model="fieldValue"
                    required
                    :name="props.field_name || 'masterName'"
                    autocomplete="off"
                    :placeholder="
                      props.field_name === 'profit_percent'
                        ? 'Ingresa el porcentaje'
                        : `${title.toLowerCase()}`
                    "
                    inputmode="decimal"
                    @input="onInput"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            @click="editActivity"
            type="button"
            class="btn btn-primary rounded-pill px-5 py-2"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<!--
============================================================
 MasterEditModal.vue
------------------------------------------------------------
 Modal reutilizable para editar elementos maestros.
 Basado en Bootstrap 5 y SweetAlert2.
------------------------------------------------------------

@props
  - id_target: string
      ID único del modal para el DOM (ej: "editActivityModal")
  - name_master_endpoint: string
      Endpoint base de la API (ej: "activity-types")
  - title: string
      Título que se mostrará en el header del modal
  - item: { id: string | number; name: string }
      Objeto del elemento a editar (debe tener id y name)

@emits
  - saved: Se emite cuando el elemento se edita exitosamente

@exposed
  - openModal(): void
      Abre el modal en la interfaz de usuario

@metodos
  - closeModal(): void
      Cierra el modal y lo oculta de la interfaz
  - editActivity(): Promise<void>
      Envía los datos editados al servidor usando updateData
      Muestra SweetAlert de éxito o error
      Emite 'saved' al padre si la edición fue exitosa

@uso
  // En el template del padre:
  <MasterEditModal
    ref="modalEditRef"
    id_target="editActivityModal"
    name_master_endpoint="activity-types"
    title="Editar Tipo de Actividad"
    :item="selectedItem"
    @saved="refreshList"
  />

  // En el script del padre:
  const modalEditRef = ref()
  const selectedItem = ref({ id: 1, name: 'Fútbol' })
  const refreshList = () => getActivityCategories()
  // Para abrir el modal:
  modalEditRef.value.openModal()

@requisitos
  - Bootstrap 5 instalado y configurado
  - SweetAlert2 configurado en composables
  - Vuex store con action 'updateData'
  - Endpoint de API que acepte PUT con { name: string }

@autor
  Tu Nombre
@version
  1.0.0
============================================================
-->
