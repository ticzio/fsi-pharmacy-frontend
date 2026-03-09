<template>
  <div class="h-100 d-flex flex-column">
    <h5 class="fw-bold mb-4">Líderes de Atención</h5>
    <div class="flex-grow-1 overflow-y-auto custom-scrollbar">
      <div class="row g-4 justify-content-center">
        <div
          v-for="operator in operators"
          :key="operator.name"
          class="col-6 col-md-4 col-lg-3 text-center"
        >
          <div class="position-relative d-inline-block mb-3">
            <img
              :src="operator.image"
              class="rounded-circle border border-4 border-primary shadow"
              style="width: 100px; height: 100px; object-fit: cover"
            />
            <span
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary border border-2 border-white p-2"
            >
              <span class="fs-6 px-1">{{ operator.rank }}</span>
            </span>
          </div>
          <h6 class="fw-bold mb-1">{{ operator.name }}</h6>
          <span class="badge bg-primary-subtle text-primary rounded-pill px-3"
            >{{ operator.chats }} chats</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Operator {
  name: string
  rank: number
  chats: number
  image: string
}

interface Props {
  operators: Operator[]
}

defineProps<Props>()
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}
</style>
