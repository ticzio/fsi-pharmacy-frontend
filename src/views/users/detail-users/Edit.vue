<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import UserForm from '@/components/Users/UserForm.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import { URLS } from '@/const/api'

const route = useRoute()
const store = useStore()
const isLoading = ref(false)

const roleOptions = ref([
  { id: 1, name: 'Administrador' },
  { id: 2, name: 'Cliente' },
  { id: 3, name: 'Soporte' },
])

const form = reactive({
  url_image: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  role_id: null as any,
  password: '',
  password_confirmation: '',
})

const fetchUserData = async () => {
  isLoading.value = true
  try {
    const response = await store.dispatch('getData', {
      url: `${URLS.users?.prefix || 'users'}/${route.params.id}`,
    })
    if (response.code === 200) {
      const data = response.data
      form.url_image = data.url_image || ''
      form.first_name = data.first_name || ''
      form.last_name = data.last_name || ''
      form.email = data.email || ''
      form.phone = data.phone || ''
      form.role_id = data.role_id || null
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // fetchUserData()
})
</script>

<template>
  <div class="position-relative">
    <LoadingOverlay v-if="isLoading" />
    <UserForm :form="form" :roleOptions="roleOptions" :is-edit="true" />
  </div>
</template>

<style scoped></style>
