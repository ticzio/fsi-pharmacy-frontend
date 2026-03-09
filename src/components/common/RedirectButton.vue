<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { BUTTONS } from '@/const/buttonConst'

const props = defineProps({
  tooltipTitle: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['redirect'])

const store = useStore()
const isMobile = computed(() => store.getters.isMobile)
</script>

<template>
  <button
    :class="BUTTONS.new.class"
    :data-title="tooltipTitle"
    :data-tooltip-pos="BUTTONS.new.tooltipPos"
    @click="$emit('redirect')"
  >
    <i :class="BUTTONS.new.icon"></i>
    <span class="d-none d-md-inline" v-if="!isMobile">
      {{ tooltipTitle }}
    </span>
  </button>
</template>
