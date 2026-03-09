<template>
  <tbody>
    <!-- Estado vacío -->
    <tr v-if="data.length === 0 && !isTableLoading">
      <td :colspan="headers.length + (hasActions ? 1 : 0)" class="text-center py-5">
        <div
          class="d-flex flex-column align-items-center justify-content-center text-muted"
          style="min-height: 250px"
        >
          <i class="bi bi-inbox text-secondary opacity-50 mb-3" style="font-size: 3rem"></i>
          <h5 class="fw-semibold text-secondary mb-1">No hay datos para mostrar</h5>
          <p class="mb-0 small opacity-75">
            Intenta ajustar tu búsqueda o agregar nuevos registros.
          </p>
        </div>
      </td>
    </tr>

    <!-- Filas de datos -->
    <tr v-for="item in data" :key="item.id" @click="$emit('row-click', item)">
      <td
        v-for="header in headers"
        :key="header.key"
        :class="['text-center py-3']"
        style="vertical-align: middle"
      >
        <slot :name="`cell(${header.key})`" :item="item" :value="getNestedValue(item, header.key)">
          {{ getNestedValue(item, header.key) }}
        </slot>
      </td>

      <!-- Columna de acciones -->
      <td
        v-if="getActionsForItem(item).length > 0"
        class="text-center py-2 text-nowrap"
        style="vertical-align: middle; min-width: 120px"
      >
        <div class="d-flex justify-content-center w-100 gap-2">
          <button
            v-for="action in getActionsForItem(item)"
            :key="`action-${action.name}-${item.id}`"
            :class="action.class"
            @click.stop="$emit('action-click', { actionName: action.name, item })"
            :data-title="action.tooltip"
            data-tooltip-pos="bottom"
          >
            <i :class="action.icon"></i>
          </button>
        </div>
      </td>
    </tr>
  </tbody>
</template>

<script setup lang="ts">
interface Header {
  key: string
  label: string
}

interface Action {
  name: string
  icon: string
  class: string
  tooltip?: string
}

interface EntityItem {
  id: string | number
  [key: string]: any
}

defineProps<{
  data: EntityItem[]
  headers: Header[]
  hasActions: boolean
  isTableLoading: boolean
  getActionsForItem: (item: EntityItem) => Action[]
  getNestedValue: (obj: any, key: string) => any
}>()

defineEmits<{
  (e: 'row-click', item: EntityItem): void
  (e: 'action-click', payload: { actionName: string; item: EntityItem }): void
}>()
</script>

<style scoped>
td {
  vertical-align: middle;
}
tr:hover {
  background-color: rgba(0, 0, 0, 0.048) !important;
}
</style>
