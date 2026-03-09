<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useSwal } from '@/composables/useSwal'
import { useSwalToast } from '@/composables/useSwalToast'
import { ERROR } from '@/const/errorConst'
import { getEnvironmentAlert } from '@/services/initApi'
import packageJson from '../../package.json'
import { normalizeEmail } from '@/utils/funcEmails'
import { getPasswordErrors } from '@/utils/funcPassword'
import LoginForm from '@/components/Login/LoginForm.vue'

const APP_VERSION = packageJson.version
const showNetworkError = ref(false)
const swal = useSwal()
const swalToast = useSwalToast()
const store = useStore()
const router = useRouter()
const loading = ref(false)

const handleLogin = async (credentialsPayload: any) => {
  const email = normalizeEmail(credentialsPayload.email)
  const password = credentialsPayload.password

  if (!email || !password) {
    swalToast.showError('Por favor, completa todos los campos')
    return
  }

  loading.value = true
  try {
    const response = await store.dispatch('login', {
      url: '/auth/admin/login',
      credentials: { email, password },
    })

    if (response.code === 200) {
      swal.showSuccess('Inicio de sesión exitoso')
      router.push('/dashboard')
    }
  } catch (error: any) {
    console.error('Error al iniciar sesión:', error)

    if (error?.code === 401 && error?.failed_attempts !== undefined) {
      swal.showConfirm(error.alert, `Intentos fallidos: ${error.failed_attempts}`, {
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: 'Entendido',
      })
    } else {
      swalToast.showError(ERROR.errorLogin)
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Mostrar alerta de ambiente si corresponde (desarrollo o calidad)
  const envAlert = getEnvironmentAlert()
  if (envAlert.type) {
    swal.showConfirm(envAlert.title, envAlert.message, {
      showCancelButton: false,
      confirmButtonText: 'Continuar',
    })
  }
})
</script>

<template>
  <div class="login-background">
    <!-- Contenedor padre general (en blanco / transparente por ahora) -->
    <div
      class="container-fluid min-vh-100 d-flex align-items-center justify-content-center px-3 px-md-5"
    >
      <div class="row w-100 layout-container">
        <!-- Contenedor 1: Logo -->
        <div
          class="col-lg-6 d-none d-md-flex justify-content-center align-items-center mb-5 mb-lg-0 logo-container"
        >
          <!-- Sustituir esta imagen por defecto con el logo final cuando se tenga -->
          <img
            src="@/assets/images/login/login_logo_FSI.png"
            alt="Logo FSI Placeholder"
            class="main-logo"
          />
        </div>

        <!-- Contenedor 2: Formulario -->
        <LoginForm
          :loading="loading"
          :showNetworkError="showNetworkError"
          :appVersion="APP_VERSION"
          @submit="handleLogin"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-background {
  /* Contenedor central en blanco por ahora, preparado para el background posterior */
  background-image: url('@/assets/images/login/login_background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: transparent;
  min-height: 100vh;
  width: 100%;
}

.layout-container {
  max-width: 1200px; /* Ancho máximo para mantener los contenedores proporcionados */
}

/* --- Contenedor 1: Logo --- */
.main-logo {
  max-width: 100%;
  width: 340px; /* Espacio estimado que ocupará el logo grande circular de la izquierda */
  height: auto;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); /* Efecto opcional para destacar el espacio */
}

/* Ajustes responsivos */
@media (max-width: 991px) {
  .main-logo {
    width: 250px;
  }
}

@media (max-width: 767px) {
  .login-background {
    /* En móviles, centrar el contenido y asegurar padding vertical */
    padding: 2rem 0;
  }
  .main-logo {
    width: 200px;
  }
}

@media (max-width: 480px) {
  .main-logo {
    width: 160px;
  }
}
</style>
