<template>
  <thead class="bg-white" style="position: sticky; top: 0; z-index: 10">
    <tr>
      <th
        v-for="header in headers"
        :key="header.key"
        class="text-center text-nowrap bg-white border-bottom"
        style="position: sticky; top: 0; z-index: 10"
      >
        <div class="fw-bold py-2 text-nowrap">{{ header.label }}</div>
      </th>
      <th
        v-if="hasActions"
        class="text-center fw-bold py-2 text-nowrap bg-white border-bottom"
        style="vertical-align: middle; min-width: 120px; position: sticky; top: 0; z-index: 10"
      >
        Acciones
      </th>
    </tr>
  </thead>
</template>

<script setup lang="ts">
interface Header {
  key: string
  label: string
}

defineProps<{
  headers: Header[]
  hasActions: boolean
}>()
</script>
