<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  initialData: {
    type: Object as () => Record<string, any> | null,
    default: null,
  },
})

const emit = defineEmits(['submit', 'close'])

const form = ref({
  name: '',
  description: '',
})

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      form.value.name = newVal.name || newVal.title || ''
      form.value.description = newVal.description || ''
    } else {
      form.value.name = ''
      form.value.description = ''
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  if (!form.value.name || !form.value.description) {
    return
  }
  emit('submit', { ...form.value })
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label for="templateName" class="form-label fw-bold">Nombre</label>
      <input
        type="text"
        id="templateName"
        class="form-control"
        v-model="form.name"
        placeholder="Ej. Plantilla de bienvenida"
        required
      />
    </div>
    <div class="mb-3">
      <label for="templateDescription" class="form-label fw-bold">Descripción</label>
      <textarea
        id="templateDescription"
        class="form-control"
        v-model="form.description"
        rows="4"
        placeholder="Mensaje de la plantilla..."
        required
      ></textarea>
    </div>
    
    <div class="d-flex justify-content-end gap-2 mt-4">
      <button type="button" class="btn btn-light" @click="emit('close')">
        Cancelar
      </button>
      <button type="submit" class="btn btn-primary text-white px-4">
        Guardar
      </button>
    </div>
  </form>
</template>
