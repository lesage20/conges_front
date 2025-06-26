import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuth } from '@/composables/useAuth'

export const useAuthStore = defineStore('auth', () => {
  // États de l'authentification
  const token = ref(null)
  const user = ref(null)
  const isAuthenticated = ref(false)
  
  // Utilisation du composable d'authentification
  const authApi = useAuth()

  // États dérivés du composable
  const loading = computed(() => authApi.loading.value)
  const error = computed(() => authApi.error.value)

  // Getters pour les permissions (basés sur le rôle utilisateur)
  const isEmploye = computed(() => user.value?.role === 'employe')
  const isChefService = computed(() => user.value?.role === 'chef_service') 
  const isDrh = computed(() => user.value?.role === 'drh')

  // Permissions pour les différentes pages
  const permissions = computed(() => ({
    canViewDashboard: true, // Tous
    canViewDemandes: true, // Tous
    canViewCalendrier: isChefService.value || isDrh.value,
    canViewMonEquipe: isChefService.value,
    canViewEmployes: isDrh.value,
    canViewDepartements: isDrh.value,
    canViewRapports: true, // Tous
    canViewParametres: true // Tous
  }))

  // Actions d'authentification
  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password)
      
      // Stocker les données d'authentification
      token.value = response.access_token
      user.value = response.user
      isAuthenticated.value = true
      
      // Persistance dans localStorage
      localStorage.setItem('authToken', response.access_token)
      localStorage.setItem('userData', JSON.stringify(response.user))
      localStorage.setItem('isAuthenticated', 'true')
      
      return response
    } catch (error) {
      // L'erreur est déjà gérée dans le composable
      throw error
    }
  }

  const logout = async () => {
    try {
      // Déconnexion côté serveur (optionnel)
      await authApi.logout()
    } catch (error) {
      console.warn('Erreur lors de la déconnexion serveur:', error)
    } finally {
      // Nettoyer l'état local
      clearAuthState()
    }
  }

  const clearAuthState = () => {
    token.value = null
    user.value = null
    isAuthenticated.value = false
    
    // Nettoyer localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    localStorage.removeItem('isAuthenticated')
    
    // Nettoyer aussi les anciennes clés pour compatibilité
    localStorage.removeItem('user')
  }

  // Récupérer les informations utilisateur depuis l'API
  const fetchUser = async () => {
    try {
      const userData = await authApi.getCurrentUser()
      user.value = userData
      
      // Mettre à jour localStorage
      localStorage.setItem('userData', JSON.stringify(userData))
      
      return userData
    } catch (error) {
      console.error('Erreur lors de la récupération des infos utilisateur:', error)
      
      // Si l'erreur est une 401, déconnecter l'utilisateur
      if (error.message.includes('401')) {
        await logout()
      }
      
      throw error
    }
  }

  // Changer de mot de passe
  const changePassword = async (currentPassword, newPassword) => {
    return await authApi.changePassword(currentPassword, newPassword)
  }

  // Demander une réinitialisation de mot de passe
  const requestPasswordReset = async (email) => {
    return await authApi.requestPasswordReset(email)
  }

  // Réinitialiser le mot de passe
  const resetPassword = async (token, newPassword) => {
    return await authApi.resetPassword(token, newPassword)
  }

  // Vérifier la validité du token
  const verifyToken = async () => {
    if (!user.value?.email) return false
    
    try {
      await authApi.verifyToken(user.value.email)
      return true
    } catch (error) {
      console.warn('Vérification échouée:', error)
      await logout()
      return false
    }
  }

  // Initialiser depuis localStorage
  const initFromStorage = () => {
    const savedToken = localStorage.getItem('authToken')
    const savedUserData = localStorage.getItem('userData')
    const savedAuth = localStorage.getItem('isAuthenticated')
    
    if (savedToken && savedUserData && savedAuth === 'true') {
      token.value = savedToken
      user.value = JSON.parse(savedUserData)
      isAuthenticated.value = true
      
      // Vérifier la validité du token en arrière-plan
      verifyToken().catch(console.error)
    } else {
      // Fallback vers l'ancien système (compatibilité)
      const oldUserData = localStorage.getItem('user')
      if (oldUserData && savedAuth === 'true') {
        user.value = JSON.parse(oldUserData)
        isAuthenticated.value = true
      }
    }
  }

  // Utilitaires
  const updateUser = (userData) => {
    user.value = { ...user.value, ...userData }
    if (isAuthenticated.value) {
      localStorage.setItem('userData', JSON.stringify(user.value))
    }
  }

  const getToken = () => token.value
  const getUser = () => user.value

  return {
    // États
    token,
    user,
    isAuthenticated,
    loading,
    error,
    
    // Getters de rôles
    isEmploye,
    isChefService,
    isDrh,
    permissions,
    
    // Actions d'authentification
    login,
    logout,
    fetchUser,
    changePassword,
    requestPasswordReset,
    resetPassword,
    verifyToken,
    
    // Utilitaires
    initFromStorage,
    updateUser,
    getToken,
    getUser,
    clearAuthState
  }
}) 