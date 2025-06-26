import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // État de l'authentification
  const isAuthenticated = ref(false)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // État de l'utilisateur (structure complète de l'API)
  const user = ref({
    id: null,
    nom: '',
    prenom: '',
    email: '',
    nom_complet: '',
    role: '',
    telephone: '',
    poste: '',
    date_embauche: null,
    solde_conges: 0,
    departement_id: null
  })

  // Utilisateurs de test
  const testUsers = {
    'drh': {
      id: 1,
      nom: 'Marie Directrice',
      email: 'marie.directrice@entreprise.com',
      role: 'drh',
      departement: 'Direction'
    },
    'chs': {
      id: 2,
      nom: 'Pierre Chef',
      email: 'pierre.chef@entreprise.com',
      role: 'chef_service',
      departement: 'IT'
    },
    'employe': {
      id: 3,
      nom: 'Jean Employé',
      email: 'jean.employe@entreprise.com',
      role: 'employe',
      departement: 'Marketing'
    }
  }

  // Départements disponibles
  const departements = ['IT', 'Marketing', 'RH', 'Finance', 'Commercial', 'Production']

  // Getters calculés pour les permissions
  const isEmploye = computed(() => user.value.role === 'employe')
  const isChefService = computed(() => user.value.role === 'chef_service')
  const isDrh = computed(() => user.value.role === 'drh')

  // Permissions pour les différentes pages
  const canViewDashboard = computed(() => true) // Tous
  const canViewDemandes = computed(() => true) // Tous
  const canViewCalendrier = computed(() => isChefService.value || isDrh.value)
  const canViewMonEquipe = computed(() => isChefService.value)
  const canViewEmployes = computed(() => isDrh.value)
  const canViewDepartements = computed(() => isDrh.value)
  const canViewRapports = computed(() => true) // Tous
  const canViewParametres = computed(() => true) // Tous

  // Actions d'authentification via API
  async function login(email, password) {
    loading.value = true
    error.value = null
    
    try {
      // Préparer les données du formulaire
      const formData = new FormData()
      formData.append('username', email)
      formData.append('password', password)
      
      // Appel à l'API de login
      const response = await fetch('http://localhost:6500/api/auth/login', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Erreur de connexion')
      }
      
      const data = await response.json()
      
      // Stocker le token et les informations utilisateur
      token.value = data.access_token
      user.value = data.user
      isAuthenticated.value = true
      
      // Persistance dans localStorage
      localStorage.setItem('authToken', data.access_token)
      localStorage.setItem('userData', JSON.stringify(data.user))
      localStorage.setItem('isAuthenticated', 'true')
      
      return data
      
    } catch (err) {
      error.value = err.message || 'Erreur de connexion'
      console.error('Erreur de login:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fonction de login mock pour les tests (conservée pour compatibilité)
  function loginMock(username, password) {
    if (password !== 'password') {
      throw new Error('Mot de passe incorrect')
    }

    const userData = testUsers[username]
    if (!userData) {
      throw new Error('Utilisateur non trouvé')
    }

    // Assigner un département aléatoire si ce n'est pas le DRH
    const randomDepartement = departements[Math.floor(Math.random() * departements.length)]
    
    user.value = {
      ...userData,
      departement: userData.role === 'drh' ? 'Direction' : randomDepartement
    }
    
    isAuthenticated.value = true
    
    // Sauvegarder dans localStorage pour persistance
    localStorage.setItem('user', JSON.stringify(user.value))
    localStorage.setItem('isAuthenticated', 'true')
  }

  function logout() {
    user.value = {
      id: null,
      nom: '',
      prenom: '',
      email: '',
      nom_complet: '',
      role: '',
      telephone: '',
      poste: '',
      date_embauche: null,
      solde_conges: 0,
      departement_id: null
    }
    token.value = null
    isAuthenticated.value = false
    error.value = null
    
    // Nettoyer localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    localStorage.removeItem('user') // Pour compatibilité
    localStorage.removeItem('isAuthenticated')
  }

  // Initialiser depuis localStorage au démarrage
  function initFromStorage() {
    const savedToken = localStorage.getItem('authToken')
    const savedUserData = localStorage.getItem('userData')
    const savedAuth = localStorage.getItem('isAuthenticated')
    
    // Priorité aux nouvelles clés
    if (savedToken && savedUserData && savedAuth === 'true') {
      token.value = savedToken
      user.value = JSON.parse(savedUserData)
      isAuthenticated.value = true
    } else {
      // Fallback vers l'ancien système pour compatibilité
      const savedUser = localStorage.getItem('user')
      if (savedUser && savedAuth === 'true') {
        user.value = JSON.parse(savedUser)
        isAuthenticated.value = true
      }
    }
  }

  // Actions pour changer le rôle (pour test - seulement si connecté)
  function setRole(newRole) {
    if (isAuthenticated.value) {
      user.value.role = newRole
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  function setUser(userData) {
    user.value = { ...user.value, ...userData }
    if (isAuthenticated.value) {
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  // Fonction pour récupérer les informations utilisateur depuis l'API
  async function fetchUserInfo() {
    if (!token.value) return null
    
    try {
      const response = await fetch('http://localhost:6500/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        user.value = userData
        localStorage.setItem('userData', JSON.stringify(userData))
        return userData
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des infos utilisateur:', err)
    }
    
    return null
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isEmploye,
    isChefService,
    isDrh,
    canViewDashboard,
    canViewDemandes,
    canViewCalendrier,
    canViewMonEquipe,
    canViewEmployes,
    canViewDepartements,
    canViewRapports,
    canViewParametres,
    login,
    loginMock,
    logout,
    initFromStorage,
    fetchUserInfo,
    setRole,
    setUser
  }
}) 