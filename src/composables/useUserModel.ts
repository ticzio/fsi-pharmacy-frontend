import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useSwal } from '@/composables/useSwal'
import { useSwalToast } from '@/composables/useSwalToast'
import { useLogger } from '@/composables/useLogger'
import { URLS } from '@/const/api'
import { ERROR } from '@/const/errorConst'

// Helpers de email: normalizar a minúsculas y validar formato
export function normalizeEmail(email: string | null | undefined): string {
  return String(email || '')
    .trim()
    .toLowerCase()
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^(?!.*\.\.)[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  return emailRegex.test(email)
}

export function useUserModel() {
  const store = useStore()
  const router = useRouter()
  const swal = useSwal()
  const swalToast = useSwalToast()
  const logger = useLogger()

  const isLoading = ref(false)
  const isUpdate = ref(false)
  const isUpdatePassword = ref(false)

  /**
   * Valida los datos del formulario de usuario
   */
  const validateUserForm = (
    formData: {
      first_name: string
      last_name: string
      email: string
      phone: string
      password?: string
    },
    selectedRole: any,
    phoneError: string,
    confirmPassword?: string,
    includePassword: boolean = true,
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!formData.first_name?.trim()) errors.push('El nombre es obligatorio.')
    if (!formData.last_name?.trim()) errors.push('El apellido es obligatorio.')
    if (!formData.email?.trim()) errors.push('El correo es obligatorio.')
    if (!formData.phone?.trim()) errors.push('El teléfono es obligatorio.')
    if (phoneError) errors.push(phoneError)
    if (!selectedRole) errors.push('El rol es obligatorio.')

    if (includePassword) {
      if (!formData.password?.trim()) errors.push('La contraseña es obligatoria.')
      if (!confirmPassword?.trim()) errors.push('La confirmación de contraseña es obligatoria.')
      if (formData.password !== confirmPassword) errors.push('Las contraseñas no coinciden.')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Valida los datos de actualización de contraseña
   */
  const validatePasswordUpdate = (
    password: string,
    confirmPassword: string,
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!password) errors.push('La contraseña es obligatoria.')
    if (!confirmPassword) errors.push('La confirmación de contraseña es obligatoria.')
    if (password !== confirmPassword) errors.push('Las contraseñas no coinciden.')

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Crea un nuevo usuario
   */
  const createUser = async (
    formData: {
      first_name: string
      last_name: string
      email: string
      phone: string
      password: string
    },
    selectedRole: any,
    selectedImage: File | null,
    phoneError: string,
    confirmPassword: string,
    idConcessionaire?: string | number,
  ): Promise<{ success: boolean; userId?: string; code?: number }> => {
    const validation = validateUserForm(formData, selectedRole, phoneError, confirmPassword, true)

    if (!validation.isValid) {
      swalToast.showFormErrors(validation.errors)
      return { success: false }
    }

    const formDataToSend = new FormData()
    formDataToSend.append('first_name', formData.first_name)
    formDataToSend.append('last_name', formData.last_name)

    // Normalizar y validar email
    const normalizedEmail = normalizeEmail(formData.email)
    if (!isValidEmail(normalizedEmail)) {
      swalToast.showError('El correo electrónico no es válido.')
      return { success: false }
    }

    formDataToSend.append('email', normalizedEmail)
    formDataToSend.append('phone', formData.phone)
    formDataToSend.append('password', formData.password)

    if (selectedImage) {
      formDataToSend.append('url_image', selectedImage)
    }

    isLoading.value = true

    try {
      const result = await store.dispatch('createData', {
        url: URLS.user.save,
        data: formDataToSend,
      })

      logger.logRequest(URLS.user.save, formDataToSend, result)

      if (result.code == 201 || result.code == 200) {
        // Si se proporciona idConcessionaire, crear la relación
        if (idConcessionaire) {
          const payloadUserConcessionaire = {
            id_user: result.data.id,
            id_concessionaire: idConcessionaire,
            id_role: selectedRole.id,
          }

          const responseUserConcessionaire = await store.dispatch('createData', {
            url: URLS.userConcessionaire.save,
            data: payloadUserConcessionaire,
          })

          logger.logRequest(
            URLS.userConcessionaire.save,
            payloadUserConcessionaire,
            responseUserConcessionaire,
          )

          if (responseUserConcessionaire.code == 201 || responseUserConcessionaire.code == 200) {
            return { success: true, userId: result.data.id, code: result.code }
          } else {
            swalToast.showError(`${ERROR.errorCreate} relación usuario-concesionario`)
            return { success: false }
          }
        }

        return { success: true, userId: result.data.id, code: result.code }
      }

      return { success: false }
    } catch (error: any) {
      if (error?.code == 409) {
        swalToast.showError(`Correo: ${formData.email} ya está en uso.`)
      } else {
        logger.logRequest(URLS.user.save, formDataToSend, error)
        swalToast.showError(`${ERROR.errorCreate} administrador`)
      }
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Actualiza un usuario existente
   */
  const updateUser = async (
    userId: string,
    formData: {
      first_name: string
      last_name: string
      email: string
      phone: string
    },
    selectedRole: any,
    selectedImage: File | null,
    phoneError: string,
  ): Promise<{ success: boolean; code?: number }> => {
    const validation = validateUserForm(formData, selectedRole, phoneError, '', false)

    if (!validation.isValid) {
      swalToast.showFormErrors(validation.errors)
      return { success: false }
    }

    const formDataToSend = new FormData()
    formDataToSend.append('first_name', formData.first_name)
    formDataToSend.append('last_name', formData.last_name)

    // Normalizar y validar email
    const normalizedEmail = normalizeEmail(formData.email)
    if (!isValidEmail(normalizedEmail)) {
      swalToast.showError('El correo electrónico no es válido.')
      return { success: false }
    }

    formDataToSend.append('email', normalizedEmail)
    formDataToSend.append('phone', formData.phone)
    formDataToSend.append('id_role', String(selectedRole?.id || ''))

    if (selectedImage) {
      formDataToSend.append('url_image', selectedImage)
    }

    isUpdate.value = true

    try {
      const result = await store.dispatch('updateData', {
        url: URLS.user.update,
        id: userId,
        data: formDataToSend,
      })

      logger.logRequest(URLS.user.update, formDataToSend, result)

      if (result.code == 200 || result.code == 201) {
        return { success: true, code: result.code }
      }

      return { success: false }
    } catch (error: any) {
      if (error?.code == 409 || error?.status == 409) {
        swalToast.showError(`Correo: ${formData.email} ya está en uso.`)
      } else {
        logger.logRequest(URLS.user.update, formDataToSend, error)
        swalToast.showError(`${ERROR.errorUpdate} administrador`)
      }
      return { success: false }
    } finally {
      isUpdate.value = false
    }
  }

  /**
   * Obtiene los datos de un usuario por su ID de relación userConcessionaire
   */
  const getUser = async (
    userConcessionaireId: string,
  ): Promise<{ success: boolean; data?: any }> => {
    const url = `${URLS.userConcessionaire.prefix}/${userConcessionaireId}`

    try {
      isLoading.value = true
      const response = await store.dispatch('getData', {
        url,
      })

      if (response.code === 200) {
        logger.logRequest(url, {}, response)
        return { success: true, data: response.data }
      }

      return { success: false }
    } catch (error: any) {
      logger.logRequest(url, {}, error)
      swalToast.showError(`${ERROR.errorGetRegister} administrador`)
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Elimina un usuario (soft delete)
   */
  const deleteUser = async (
    userConcessionaireId: string,
    fullName: string,
  ): Promise<{ success: boolean }> => {
    const confirmed = await swal.showConfirm(
      `¿Estás seguro de eliminar a ${fullName}?`,
      `Esta acción eliminará al administrador ${fullName}.`,
      {
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      },
    )

    if (!confirmed) return { success: false }

    try {
      const response = await store.dispatch('changeStatus', {
        url: URLS.userConcessionaire.changeStatus,
        id: userConcessionaireId,
        status: 2,
      })

      logger.logRequest(
        URLS.userConcessionaire.changeStatus,
        { id: userConcessionaireId, status: 2 },
        response,
      )

      if (response.code == 200 || response.code == 201) {
        return { success: true }
      }

      return { success: false }
    } catch (error: any) {
      logger.logRequest(
        URLS.userConcessionaire.changeStatus,
        { id: userConcessionaireId, status: 2 },
        error,
      )
      swalToast.showError(`${ERROR.errorDelete} ${fullName}`)
      return { success: false }
    }
  }

  /**
   * Actualiza la contraseña de un usuario
   */
  const updatePassword = async (
    userId: string,
    password: string,
    confirmPassword: string,
  ): Promise<{ success: boolean }> => {
    const validation = validatePasswordUpdate(password, confirmPassword)

    if (!validation.isValid) {
      swalToast.showFormErrors(validation.errors)
      return { success: false }
    }

    isUpdatePassword.value = true

    try {
      const payload = { password }

      const response = await store.dispatch('updateData', {
        url: URLS.user.update,
        id: userId,
        data: payload,
      })

      logger.logRequest(URLS.user.update, payload, response)

      if (response.code == 200 || response.code == 201) {
        return { success: true }
      }

      return { success: false }
    } catch (error: any) {
      logger.logRequest(URLS.user.update, '', error)
      swalToast.showError(`${ERROR.errorUpdate} contraseña`)
      return { success: false }
    } finally {
      isUpdatePassword.value = false
    }
  }

  /**
   * Desbloquea un usuario
   */
  const unlockUser = async (
    userId: string,
    fullName: string,
    confirmSubtitle?: string,
  ): Promise<{ success: boolean }> => {
    const subtitle = confirmSubtitle || `Esta acción desbloqueará al usuario ${fullName}.`
    const confirmed = await swal.showConfirm(
      `¿Estás seguro de desbloquear a ${fullName}?`,
      subtitle,
      {
        confirmButtonText: 'Sí, desbloquear',
        cancelButtonText: 'Cancelar',
      },
    )

    if (!confirmed) return { success: false }

    const url = `${URLS.user.prefix}/unlock/${userId}`

    try {
      const response = await store.dispatch('updateData', {
        url,
        id: '',
        data: {},
      })

      logger.logRequest(url, {}, response)

      if (response.code == 200 || response.code == 201) {
        return { success: true }
      }

      return { success: false }
    } catch (error: any) {
      logger.logRequest(url, {}, error)
      swalToast.showError(`${ERROR.errorUpdate} desbloqueo de ${fullName}`)
      return { success: false }
    }
  }

  return {
    // State
    isLoading,
    isUpdate,
    isUpdatePassword,

    // Methods
    createUser,
    updateUser,
    getUser,
    deleteUser,
    updatePassword,
    unlockUser,
    validateUserForm,
    validatePasswordUpdate,
    normalizeEmail,
    isValidEmail,
  }
}
