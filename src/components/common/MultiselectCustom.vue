<template>
  <div class="multiselect-wrapper">
    <!-- Label — mirrors SearchInput's label row -->
    <div v-if="label" class="d-flex align-items-center mb-1">
      <label class="form-label mb-0 fw-bold multiselect-label">{{ label }}</label>
    </div>

    <div class="multiselect-container">
      <Multiselect
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :options="options"
        :placeholder="placeholder"
        :track-by="defaultProps.trackBy"
        :label="defaultProps.label"
        :close-on-select="defaultProps.closeOnSelect"
        :clear-on-select="defaultProps.clearOnSelect"
        :searchable="defaultProps.searchable"
        :allow-empty="defaultProps.allowEmpty"
        :multiple="multiple"
        :class="[defaultClasses.container, variant ? `multiselect-${variant}` : '']"
        v-bind="$attrs"
      >
        <!-- Slot para opciones personalizadas -->
        <template #option="{ option }" v-if="showIcons">
          <div :class="defaultClasses.option">
            <div :class="defaultClasses.iconContainer">
              <i :class="[getIcon(option[iconKey]), defaultClasses.icon]"></i>
            </div>
            <div :class="defaultClasses.content">
              <div :class="defaultClasses.title">{{ option[labelKey] }}</div>
              <small :class="defaultClasses.description" v-if="showDescriptions">
                {{ getDescription(option[iconKey], option) }}
              </small>
            </div>
          </div>
        </template>

        <!-- Slot para label seleccionado -->
        <template #singleLabel="{ option }" v-if="showIcons">
          <div :class="defaultClasses.singleLabel">
            <i :class="[getIcon(option[iconKey]), defaultClasses.singleIcon]"></i>
            <span :class="defaultClasses.singleTitle">{{ option[labelKey] }}</span>
          </div>
        </template>

        <!-- Pasar otros slots al componente padre -->
        <template v-for="(_, slot) in $slots" #[slot]="scope" :key="slot">
          <slot :name="slot" v-bind="scope" />
        </template>
      </Multiselect>

      <!-- Clear button — mirrors SearchInput's clear-wrap -->
      <transition name="ms-fade">
        <button
          v-if="clearable && modelValue !== null && modelValue !== undefined"
          class="multiselect-clear-btn"
          type="button"
          tabindex="-1"
          title="Limpiar selección"
          @click.stop="handleClear"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import Multiselect from 'vue-multiselect'
import { useMultiselectDefaults, useRoleHelpers } from '@/composables/useMultiselect'

interface Props {
  modelValue?: any
  options: any[]
  placeholder?: string
  multiple?: boolean
  showIcons?: boolean
  showDescriptions?: boolean
  iconKey?: string
  labelKey?: string
  variant?: 'success' | 'warning' | 'danger' | 'primary'
  helperType?: 'roles' | 'custom'
  customIconMap?: Record<string, string>
  customDescriptionMap?: Record<string, string>
  descriptionProp?: string
  customDefaultIcon?: string
  /** Label rendered above the select — same style as SearchInput */
  label?: string
  /** Show an animated × button to clear the selection */
  clearable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Seleccionar opción',
  multiple: false,
  showIcons: true,
  showDescriptions: true,
  iconKey: 'name',
  labelKey: 'name',
  helperType: 'roles',
  label: '',
  clearable: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  /** Emitted when the user clicks the clear (×) button */
  clear: []
}>()

const { defaultProps, defaultClasses } = useMultiselectDefaults()

const handleClear = () => {
  emit('update:modelValue', null)
  emit('clear')
}

// Configurar helpers según el tipo
const getIcon = (key: string): string => {
  if (props.helperType === 'roles') {
    return useRoleHelpers().getRoleIcon(key)
  }
  if (props.helperType === 'custom' && props.customIconMap) {
    return props.customIconMap[key] || props.customDefaultIcon || 'bi bi-circle'
  }
  return props.customDefaultIcon || 'bi bi-circle'
}

const getDescription = (key: string, option?: any): string => {
  if (props.helperType === 'roles') {
    return useRoleHelpers().getRoleDescription(key)
  }
  if (props.helperType === 'custom' && props.customDescriptionMap) {
    return props.customDescriptionMap[key] || 'Opción del sistema'
  }
  if (props.descriptionProp && option && option[props.descriptionProp]) {
    return option[props.descriptionProp]
  }
  return 'Opción del sistema'
}
</script>

<style>
@import '@/assets/styles/multiselect-custom.css';
</style>

<style scoped>
.multiselect-wrapper {
  width: 100%;
}

.multiselect-label {
  font-size: 0.9rem;
}

/* Position the clear button over the right side of the select */
.multiselect-container {
  position: relative;
  display: flex;
  align-items: center;
}

.multiselect-container :deep(.multiselect) {
  flex: 1;
  /* Leave room for the clear button when visible */
}

.multiselect-clear-btn {
  position: absolute;
  right: 2.5rem; /* sits just before the caret arrow */
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0 0.4rem;
  color: #9ca3af;
  cursor: pointer;
  line-height: 1;
  z-index: 10;
  transition:
    color 0.15s ease,
    background 0.15s ease;
  border-radius: 4px;
}

.multiselect-clear-btn:hover {
  color: #6b7280;
  background: rgba(0, 0, 0, 0.04);
}

/* Fade transition — identical to SearchInput */
.ms-fade-enter-active,
.ms-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.ms-fade-enter-from,
.ms-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-50%);
}
</style>
