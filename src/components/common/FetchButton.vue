<script setup lang="ts">
import { BUTTONS_TOOLTIPS, BUTTONS } from '@/const/buttonConst'

const emit = defineEmits(['fetch'])
</script>

<template>
  <button
    :class="BUTTONS.filter.class"
    :data-title="BUTTONS_TOOLTIPS.filter.tooltipTitle"
    :data-tooltip-pos="BUTTONS.filter.tooltipPos"
    @click="$emit('fetch')"
  >
    <i :class="BUTTONS.filter.icon"></i>
  </button>
</template>
