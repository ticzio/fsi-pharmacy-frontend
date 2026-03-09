<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap/dist/js/bootstrap.esm.js'
import { useStore } from 'vuex'
import { useSwal } from '@/composables/useSwal'

const props = defineProps<{
  id_target: string
  name_master_endpoint: string
  title: string
  field_name?: string
}>()

const emit = defineEmits<{
  saved: []
}>()

// Instancias de composables
const store = useStore()
const swal = useSwal()

// Referencias y estado
const modalElement = ref<HTMLElement | null>(null)
let modalInstance: Modal | null = null
const fieldValue = ref('')
const isLoading = ref(false)

// Formateo en vivo para porcentajes (igual que el formateo de precio en New.vue)
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

const onInput = (event: Event) => {
  if (props.field_name !== 'profit_percent') return
  const input = event.target as HTMLInputElement
  const formatted = formatDigitsString(input.value)
  fieldValue.value = formatted
  input.value = formatted
}

// Métodos públicos
const openModal = (): void => {
  modalInstance?.show()
}

const closeModal = (): void => {
  modalInstance?.hide()
}

const newActivity = async (): Promise<void> => {
  isLoading.value = true

  if (!fieldValue.value.toString().trim()) {
    isLoading.value = false
    swal.showConfirm('Error', 'El campo es requerido.', {
      confirmButtonText: 'Aceptar',
      target: '#' + props.id_target,
      icon: 'error',
    })
    return
  }

  try {
    const payload = {
      [props.field_name || 'name']: fieldValue.value,
    }

    const response = await store.dispatch('createData', {
      url: props.name_master_endpoint + '/save',
      data: { ...payload },
    })

    if (response && (response.code === 200 || response.code === 201)) {
      await swal.showConfirm('Éxito', 'Elemento creado correctamente.', {
        confirmButtonText: 'Aceptar',
        target: '#' + props.id_target,
        icon: 'success',
      })

      closeModal()
      emit('saved')
      fieldValue.value = ''
      return
    }
  } catch (error: any) {
    console.error('Error al crear el elemento:', error)

    await swal.showConfirm(
      'No se pudo guardar el elemento.',
      'Ha ocurrido un error en el servidor al intentar guardar',
      {
        confirmButtonText: 'Aceptar',
        target: '#' + props.id_target,
        icon: 'error',
      }
    )
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
                  <label for="field-input">{{
                    props.field_name === 'profit_percent' ? 'Porcentaje (%)' : 'Nombre:'
                  }}</label>
                  <input
                    id="field-input"
                    type="text"
                    class="form-control"
                    v-model="fieldValue"
                    required
                    :name="props.field_name || 'masterName'"
                    autocomplete="off"
                    inputmode="decimal"
                    @input="onInput"
                    :placeholder="
                      props.field_name === 'profit_percent'
                        ? 'Ingresa el porcentaje'
                        : `${title.toLowerCase()}`
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            @click="newActivity"
            type="button"
            class="btn btn-primary rounded-pill px-5 py-2"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<!--
/**
 * @fileoverview Componente Modal Reutilizable para Crear Nuevos Elementos Maestros
 * 
 * Este componente proporciona un modal genérico para crear nuevos elementos en el sistema.
 * Utiliza Bootstrap 5 para el modal y SweetAlert2 para las notificaciones.
 * 
 * @example
 * // Uso básico en el template del componente padre:
 * <MasterNewModal
 *   ref="modalRef"
 *   id_target="newActivityModal"
 *   name_master_endpoint="activity-types"
 *   title="Nuevo Tipo de Actividad"
 *   @saved="handleSaved"
 * />
 * 
 * // En el script del componente padre:
 * const modalRef = ref()
 * 
 * const openModal = () => {
 *   modalRef.value.openModal()
 * }
 * 
 * const handleSaved = () => {
 *   // Refrescar datos o realizar acciones después de guardar
 *   console.log('Elemento guardado exitosamente')
 * }
 * 
 * @author Tu Nombre
 * @version 1.0.0
 */

/**
 * PROPS DEL COMPONENTE
 * @typedef {Object} Props
 * @property {string} id_target - ID único del modal para el DOM (ej: "newActivityModal")
 * @property {string} name_master_endpoint - Endpoint base de la API (ej: "activity-types")
 * @property {string} title - Título que se mostrará en el header del modal
 */

/**
 * EVENTOS EMITIDOS
 * @typedef {Object} Emits
 * @property {Function} saved - Se emite cuando el elemento se guarda exitosamente
 */

/**
 * MÉTODOS PÚBLICOS
 * 
 * openModal(): void
 * - Abre el modal en la interfaz de usuario
 * - Uso: modalRef.value.openModal()
 */

/**
 * MÉTODOS PRIVADOS
 * 
 * closeModal(): void
 * - Cierra el modal y lo oculta de la interfaz
 * 
 * newActivity(): Promise<void>
 * - Envía los datos del formulario para crear un nuevo elemento
 * - Realiza validación, envía la petición al servidor y maneja la respuesta
 * - Se ejecuta automáticamente al hacer clic en "Guardar"
 */

/**
 * GUÍA DE USO DEL COMPONENTE
 * 
 * 1. IMPORTACIÓN:
 *    import MasterNewModal from '@/views/settings/master_modal/MasterNewModal.vue'
 * 
 * 2. REGISTRO EN COMPONENTS:
 *    components: {
 *      MasterNewModal
 *    }
 * 
 * 3. USO EN TEMPLATE:
 *    <MasterNewModal
 *      ref="modalRef"
 *      id_target="uniqueModalId"
 *      name_master_endpoint="api/endpoint"
 *      title="Título del Modal"
 *      @saved="handleSaved"
 *    />
 * 
 * 4. CONFIGURACIÓN EN SCRIPT:
 *    const modalRef = ref()
 *    
 *    const openModal = () => {
 *      modalRef.value.openModal()
 *    }
 *    
 *    const handleSaved = () => {
 *      // Lógica después de guardar
 *      refreshData()
 *    }
 * 
 * 5. REQUISITOS:
 *    - Bootstrap 5 instalado y configurado
 *    - SweetAlert2 configurado en composables
 *    - Vuex store con action 'createData'
 *    - Endpoint de API que acepte POST con { name: string }
 * 
 * 6. CLASES DE BOOTSTRAP UTILIZADAS:
 *    - modal, modal-fade: Modal básico con animación
 *    - modal-dialog-centered: Centrar modal verticalmente
 *    - modal-lg: Modal de tamaño grande
 *    - bg-primary: Fondo azul para header
 *    - btn-success: Botón verde para guardar
 *    - rounded-pill: Bordes redondeados para botones
 *    - form-control: Estilos para inputs
 * 
 * 7. ESTRUCTURA DEL TEMPLATE:
 *    - modal fade: Clase base del modal con animación
 *    - modal-dialog: Contenedor del diálogo
 *    - modal-content: Contenido principal del modal
 *    - modal-header: Header con título y botón cerrar
 *    - modal-body: Cuerpo con el formulario
 *    - modal-footer: Footer con botones de acción
 */
-->
