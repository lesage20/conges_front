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
        let errorMessage = 'Identifiants incorrects'
        
        try {
          const errorData = await response.text()
          if (errorData) {
            try {
              const parsedError = JSON.parse(errorData)
              errorMessage = parsedError.detail || parsedError.message || errorMessage
            } catch {
              // Si ce n'est pas du JSON, utiliser le texte brut s'il est informatif
              if (errorData.length < 200 && !errorData.includes('<!DOCTYPE')) {
                errorMessage = errorData
              }
            }
          }
        } catch {
          // En cas d'erreur lors de la lecture de la réponse, utiliser un message générique
        }

        // Personnaliser les messages selon le code d'erreur
        if (response.status === 401) {
          errorMessage = 'Email ou mot de passe incorrect'
        } else if (response.status === 403) {
          errorMessage = 'Accès refusé'
        } else if (response.status === 500) {
          errorMessage = 'Erreur serveur, veuillez réessayer'
        } else if (response.status >= 400 && response.status < 500) {
          errorMessage = errorMessage || 'Données de connexion invalides'
        } else {
          errorMessage = 'Impossible de se connecter au serveur'
        }

        // Log l'erreur
        console.error('Erreur de login:', errorMessage)
        throw new Error(errorMessage)
      }

      let responseData
      try {
        responseData = await response.json()
      } catch (jsonError) {
        console.error('Erreur lors du parsing JSON:', jsonError)
        throw new Error('Réponse serveur invalide')
      }
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
      return await api.post('/auth/logout', {})
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
    return await api.post('/users/change-password', {
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