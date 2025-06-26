import { useApi } from './useApi'

export function useAuth() {
  const api = useApi()

  // Route de connexion
  const login = async (email, password) => {
    // Préparer les données du formulaire pour OAuth2PasswordRequestForm
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)
    
    // Utiliser l'API avec FormData (pas JSON) - ne pas passer par request car il modifie les headers
    const startTime = Date.now()
    const url = `${api.API_BASE_URL || 'http://localhost:6500/api'}/auth/login`
    
    try {
      api.loading.value = true
      api.error.value = null
      api.data.value = null

      // Ajouter le token d'authentification si disponible
      const token = localStorage.getItem('authToken')
      const headers = {}
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers
      })

      const duration = Date.now() - startTime

      if (!response.ok) {
        const errorData = await response.text()
        let errorMessage = `Erreur ${response.status}`
        
        try {
          const parsedError = JSON.parse(errorData)
          errorMessage = parsedError.detail || parsedError.message || errorMessage
        } catch {
          errorMessage = errorData || errorMessage
        }

        // Log l'erreur
        console.error('Erreur de login:', errorMessage)
        throw new Error(errorMessage)
      }

      const responseData = await response.json()
      api.data.value = responseData

      return responseData

    } catch (err) {
      api.error.value = err.message || 'Une erreur est survenue'
      throw err
    } finally {
      api.loading.value = false
    }
  }

  // Route de déconnexion (côté serveur si nécessaire)
  const logout = async () => {
    try {
      return await api.post('/auth/logout')
    } catch (error) {
      // Même si l'API échoue, on peut continuer la déconnexion côté client
      console.warn('Erreur lors de la déconnexion serveur:', error)
      return { success: true }
    }
  }

  // Route pour récupérer les infos de l'utilisateur connecté
  const getCurrentUser = async () => {
    return await api.get('/users/me')
  }

  // Route pour rafraîchir le token (si implémentée côté serveur)
  const refreshToken = async () => {
    return await api.post('/auth/refresh')
  }

  // Route pour changer de mot de passe
  const changePassword = async (currentPassword, newPassword) => {
    return await api.patch('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    })
  }

  // Route pour demander une réinitialisation de mot de passe
  const requestPasswordReset = async (email) => {
    return await api.post('/auth/forgot-password', { email })
  }

  // Route pour réinitialiser le mot de passe avec token
  const resetPassword = async (token, newPassword) => {
    return await api.post('/auth/reset-password', {
      token,
      password: newPassword
    })
  }

  // Vérifier si un token est valide
  const verifyToken = async (email) => {
    return await api.post('/auth/request-verify-token', { email })
  }

  return {
    // États réactifs du composable useApi
    loading: api.loading,
    data: api.data,
    error: api.error,
    
    // Méthodes d'authentification
    login,
    logout,
    getCurrentUser,
    refreshToken,
    changePassword,
    requestPasswordReset,
    resetPassword,
    verifyToken
  }
} 