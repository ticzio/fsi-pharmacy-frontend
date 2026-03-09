<template>
  <thead class="bg-white">
    <tr>
      <th v-for="header in headers" :key="header.key" class="text-center text-nowrap">
        <div class="fw-bold py-2 text-nowrap">{{ header.label }}</div>
      </th>
      <th
        v-if="hasActions"
        class="text-center fw-bold py-2 text-nowrap"
        style="vertical-align: middle; min-width: 120px"
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
