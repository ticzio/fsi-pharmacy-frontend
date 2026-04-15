<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useFormValidation } from '@/composables/useFormValidation'

interface Props {
  modelValue: string | number
  label?: string
  id: string
  placeholder?: string
  disabled?: boolean
  autocomplete?: string
  rows?: number | string
  rules?: Array<(val: any) => string | boolean>
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: '',
  disabled: false,
  autocomplete: 'off',
  rows: 3,
  rules: () => [],
  resize: 'none',
})

const emit = defineEmits(['update:modelValue'])

const internalErrors = ref<string[]>([])
const validationContext = useFormValidation()

onMounted(() => {
  validationContext?.registerField(props.id, internalErrors.value.length > 0)
})

onUnmounted(() => {
  validationContext?.unregisterField(props.id)
})

watch(
  () => internalErrors.value.length,
  (newCount) => {
    validationContext?.updateFieldStatus(props.id, newCount > 0)
  },
)

const validate = (value: any) => {
  if (!props.rules || props.rules.length === 0) {
    internalErrors.value = []
    return true
  }

  const errors: string[] = []
  for (const rule of props.rules) {
    const result = rule(value)
    if (typeof result === 'string') {
      errors.push(result)
    } else if (result === false) {
      errors.push('Campo inválido')
    }
  }
  internalErrors.value = errors
  return errors.length === 0
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (internalErrors.value.length > 0) {
      validate(newVal)
    }
  },
)

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  const value = target.value
  emit('update:modelValue', value)
  validate(value)
}

const handleBlur = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  validate(target.value)
}
</script>

<template>
  <div class="mb-3 form-group-custom">
    <label v-if="label" :for="id" class="form-label mb-1 fw-bold">{{ label }}</label>

    <div>
      <textarea
        :id="id"
        class="form-control"
        :class="{
          'is-invalid': internalErrors.length > 0,
          'custom-textarea': true,
        }"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :rows="rows"
        :style="{ resize: resize }"
        @input="handleInput"
        @blur="handleBlur"
      ></textarea>
    </div>

    <transition name="fade">
      <div v-if="internalErrors.length > 0" class="errors-wrapper">
        <div class="errors-wrapper-inner">
          <transition-group
            name="list"
            tag="div"
            class="invalid-feedback d-block mt-1 errors-container"
          >
            <div v-for="error in internalErrors" :key="error" class="error-item">• {{ error }}</div>
          </transition-group>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.form-group-custom label {
  font-size: 1rem;
}

.custom-textarea {
  font-size: 1.1rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background-color: #ffffff;
  color: #111827;
  box-shadow: none;
}

.custom-textarea::placeholder {
  color: #6b7280;
  font-size: 1.1rem;
}

.custom-textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.1);
  outline: none;
}

.invalid-feedback {
  font-size: 0.875em;
  color: #dc3545;
}

.errors-wrapper {
  position: relative;
  display: grid;
  grid-template-rows: 1fr;
}

.errors-wrapper-inner {
  min-height: 0;
  overflow: hidden;
}

.errors-container {
  max-height: 3.2em;
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: #fca5a5 #f9fafb;
  padding-right: 4px;
}

.errors-container::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 6px;
}
.errors-container::-webkit-scrollbar-track {
  background: #f9fafb;
  border-radius: 4px;
}
.errors-container::-webkit-scrollbar-thumb {
  background-color: #fca5a5;
  border-radius: 4px;
  border: 1px solid #f9fafb;
}

.error-item {
  line-height: 1.4em;
  margin-bottom: 4px;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  overflow: hidden;
  max-height: 5em;
}
.error-item:last-child {
  margin-bottom: 0;
}

.is-invalid {
  border-color: #dc3545 !important;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
  grid-template-rows: 0fr;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
  max-height: 0;
  margin-bottom: 0;
}
</style>
