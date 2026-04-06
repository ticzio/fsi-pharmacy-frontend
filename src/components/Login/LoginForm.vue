<script setup lang="ts">
import { reactive } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import { isValidEmail } from '@/utils/funcEmails'
import { provideFormValidation } from '@/composables/useFormValidation'

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  showNetworkError: {
    type: Boolean,
    default: false,
  },
  appVersion: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['submit'])

const credentials = reactive({
  email: '',
  password: '',
})

const emailRules = [
  (v: string) => !!v || 'El correo es requerido',
  (v: string) => (isValidEmail(v) ? true : 'Formato de correo electrónico inválido'),
]

const passwordRules = [(v: string) => !!v || 'La contraseña es requerida']

const { isFormValid } = provideFormValidation()

const handleLogin = () => {
  emit('submit', { email: credentials.email, password: credentials.password })
}
</script>

<template>
  <!-- Contenedor 2: Formulario -->
  <div class="col-lg-6 d-flex justify-content-center align-items-center form-container">
    <div class="login-card p-4 p-sm-5">
      <!-- Logo para móviles (oculto en escritorio) -->
      <div class="text-center d-block d-md-none mb-3">
        <img
          src="@/assets/images/login/login_logo_FSI.png"
          alt="Logo FSI Movil"
          class="mobile-logo"
        />
      </div>
      <h2 class="text-center mb-3 form-title">Bienvenido Al Panel de<br />Farmacias</h2>
      <p class="text-center mb-4 pb-3 form-subtitle">Ingresa tus datos para iniciar sesión</p>
      <form @submit.prevent="handleLogin">
        <BaseInput
          id="emailLogin"
          type="email"
          label="Correo"
          placeholder="Ingresar correo electrónico"
          v-model="credentials.email"
          :disabled="showNetworkError"
          :rules="emailRules"
        />

        <BaseInput
          id="passwordLogin"
          type="password"
          label="Contraseña"
          placeholder="Ingresar contraseña"
          v-model="credentials.password"
          :disabled="showNetworkError"
          :rules="passwordRules"
          class="mb-4"
        />

        <div class="d-grid mt-4">
          <button type="submit" :disabled="loading || !isFormValid" class="btn btn-primary btn-lg custom-btn">
            {{ loading ? 'Iniciando...' : 'Entrar' }}
          </button>
        </div>

        <div class="text-center mt-4">
          <small class="text-muted">Versión {{ appVersion }}</small>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Logo exclusivo para móviles (dentro del card) */
.mobile-logo {
  max-width: 100%;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

/* --- Contenedor 2: Formulario --- */
.login-card {
  width: 100%;
  max-width: 550px;
  min-height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
}

/* Tipografía de los títulos y textos */
.form-title {
  color: #333333;
  font-weight: 800;
  font-style: italic;
  font-size: 1.95rem;
  line-height: 1.1;
  letter-spacing: -0.5px;
}

.form-subtitle {
  color: #9ca3af;
  font-size: 0.95rem;
}

/* Estilo del botón */
.custom-btn {
  background-color: #1d4ed8;
  border: none;
  border-radius: 50rem; /* Botón bien redondeado estilo "pill" */
  font-weight: 600;
  padding: 0.8rem;
  font-size: 1.05rem;
  transition: all 0.2s;
  box-shadow: 0 4px 10px rgba(29, 78, 216, 0.25);
}

.custom-btn:hover {
  background-color: #1e40af;
  box-shadow: 0 6px 15px rgba(29, 78, 216, 0.35);
}

.custom-btn:focus {
  box-shadow: 0 0 0 0.25rem rgba(37, 99, 235, 0.5);
}

/* Ajustes responsivos */
@media (max-width: 991px) {
  .login-card {
    min-height: 600px; /* Reducir altura mínima en pantallas medianas */
  }
}

@media (max-width: 767px) {
  .login-card {
    min-height: auto; /* Permitir que se ajuste al contenido interno */
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
  }
  .form-title {
    font-size: 1.6rem;
  }
}

@media (max-width: 480px) {
  .form-title {
    font-size: 1.4rem;
  }
}
</style>
