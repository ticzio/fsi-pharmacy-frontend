<script setup lang="ts">
import { ref, watch, onBeforeUnmount, onMounted } from 'vue'
import { useSwal } from '@/composables/useSwal'

interface Props {
  /** v-model binding */
  modelValue?: string | number
  /** Native input type – text, email, number, search, tel, url … */
  type?: string
  /** Label over the input */
  label?: string
  /** Unique id for a11y */
  id: string
  /** Input placeholder */
  placeholder?: string
  /** Disable the component */
  disabled?: boolean
  /** Debounce delay in ms before emitting `search` */
  debounce?: number
  /** Minimum characters required before emitting `search` */
  minChars?: number
  /** Show a loading spinner instead of the search icon */
  loading?: boolean
  /** Focus input automatically on mount */
  autofocus?: boolean
  /** Array of texts to display in the info alert */
  infoTexts?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  label: '',
  placeholder: 'Buscar…',
  disabled: false,
  debounce: 400,
  minChars: 1,
  loading: false,
  autofocus: false,
  infoTexts: () => [],
})

const emit = defineEmits<{
  /** Keeps parent v-model in sync */
  'update:modelValue': [value: string | number]
  /**
   * Emitted (debounced) when the user has typed enough characters.
   * The parent view should use this to call its own GET method.
   */
  search: [term: string]
  /** Emitted when the user clicks the clear button */
  clear: []
}>()

// ─── State ───────────────────────────────────────────────────────────────────

const { showInfoList } = useSwal()

const internalValue = ref<string | number>(props.modelValue ?? '')
let debounceTimer: ReturnType<typeof setTimeout> | null = null
const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)

// Keep internal value in sync when parent changes modelValue externally
watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = val ?? ''
  },
)

// ─── Handlers ────────────────────────────────────────────────────────────────

const handleInfoClick = () => {
  if (props.infoTexts && props.infoTexts.length > 0) {
    showInfoList('Información', props.infoTexts)
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value

  internalValue.value = value
  emit('update:modelValue', value)

  // Debounce the search emission
  if (debounceTimer) clearTimeout(debounceTimer)

  const term = String(value)
  if (term.length >= props.minChars) {
    debounceTimer = setTimeout(() => emit('search', term), props.debounce)
  } else if (term.length === 0) {
    // Immediately notify parent when field is emptied
    emit('search', '')
  }
}

const handleClear = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  internalValue.value = ''
  emit('update:modelValue', '')
  emit('clear')
  emit('search', '')

  if (inputRef.value) {
    inputRef.value.focus()
  }
}

// ─── Lifecycle ───────────────────────────────────────────────────────────────

onMounted(() => {
  if (props.autofocus && inputRef.value) {
    inputRef.value.focus()
  }
})

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
  <div class="search-input-wrapper">
    <div v-if="label" class="d-flex align-items-center mb-1">
      <i
        v-if="infoTexts && infoTexts.length > 0"
        class="bi bi-exclamation-circle text-primary me-2 cursor-pointer"
        style="cursor: pointer"
        @click="handleInfoClick"
        title="Ver información"
      ></i>
      <label :for="id" class="form-label mb-0 fw-bold">{{ label }}</label>
    </div>

    <div class="input-group search-group" :class="{ disabled, 'is-focused': isFocused }">
      <!-- Search icon or Spinner -->
      <span class="input-group-text search-icon-wrap" :class="{ 'text-primary': isFocused }">
        <template v-if="loading">
          <span
            class="spinner-border spinner-border-sm text-primary"
            role="status"
            aria-hidden="true"
          ></span>
        </template>
        <template v-else>
          <i
            class="bi bi-search text-muted transition-icon"
            :class="{ 'text-primary': isFocused }"
          ></i>
        </template>
      </span>

      <!-- Polymorphic input -->
      <input
        ref="inputRef"
        :id="id"
        :type="type"
        class="form-control search-control"
        :value="internalValue"
        :placeholder="placeholder"
        :disabled="disabled"
        autocomplete="off"
        spellcheck="false"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @keydown.esc="handleClear"
      />

      <!-- Clear button -->
      <transition name="fade">
        <span
          v-if="internalValue !== '' && internalValue !== null && !disabled"
          class="input-group-text clear-wrap"
          @click="handleClear"
          title="Limpiar búsqueda (Esc)"
        >
          <button
            class="btn btn-link p-0 text-muted text-decoration-none"
            type="button"
            tabindex="-1"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </span>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.search-input-wrapper {
  width: 100%;
}

.search-input-wrapper .form-label {
  font-size: 0.9rem;
}

.search-group {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #fff;
  transition: all 0.3s ease;
}

.search-group:hover:not(.disabled) {
  border-color: #d1d5db;
}

.search-group.is-focused,
.search-group:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.12);
}

.search-group.disabled {
  opacity: 0.65;
  pointer-events: none;
  background: #f9fafb;
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

/* Clear button transition styling */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Remove native number spinners */
.search-control[type='number']::-webkit-outer-spin-button,
.search-control[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
