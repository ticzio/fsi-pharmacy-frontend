<template>
  <div class="h-100 p-3 bg-white rounded-3 shadow-sm border">
    <GeneralInfoStep :form="form" :cityOptions="cityOptions" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import GeneralInfoStep from '@/components/Pharmacies/GeneralInfoStep.vue'

// Minimal state to satisfy the component props
const form = reactive({
  name: '',
  phone: '',
  id_type_city: null,
  description: '',
  ubication: '',
  url_google_map: '',
  url_image: '',
  lat: '',
  lon: '',
})

const cityOptions = ref([])
</script>
