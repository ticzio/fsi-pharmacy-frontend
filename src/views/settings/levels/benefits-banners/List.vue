<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import LevelProgress from '@/components/Levels/LevelProgress.vue'
import BenefitGrid from '@/components/Benefits/BenefitGrid.vue'

//Composables
import { useStore } from 'vuex'
import { useBenefits } from '@/composables/Models/useBenefits'
import { useLevels } from '@/composables/Models/useLevels'

const route = useRoute()
const store = useStore()

const { benefits, loading: loadingBenefits, getDataBenefits } = useBenefits()
const { level, loading: loadingLevel, getLevelById, updateLevelPoints } = useLevels()

const loading = computed(() => loadingBenefits.value || loadingLevel.value)

const idLevel = computed(() => route.params.id_level as string)

const fetchData = async () => {
  if (idLevel.value) {
    await Promise.all([getDataBenefits(idLevel.value), getLevelById(idLevel.value)])
  }
}

const handleUpdateLevelPoints = async (pointsData: {
  min_points: number | string
  max_points: number | string
}) => {
  if (idLevel.value) {
    const success = await updateLevelPoints(idLevel.value, pointsData)
    if (success) {
      await getLevelById(idLevel.value)
    }
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="d-flex flex-column h-100 gap-4 bg-light-subtle p-3">
    <!-- Benefits Section -->
    <BenefitGrid :benefits="benefits" :loading="loading" />

    <!-- Progress Section -->
    <LevelProgress :level="level" @update="handleUpdateLevelPoints" />
  </div>
</template>

<style scoped>
.content-card {
  border-width: 1px;
}

/* Custom transitions and refinements */
.overflow-auto {
  scrollbar-width: thin;
}
</style>
