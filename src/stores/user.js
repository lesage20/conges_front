import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // État de l'authentification
  const isAuthenticated = ref(false)
  
  // État de l'utilisateur (mock)
  const user = ref({
    id: null,
    nom: '',
    email: '',
    role: '',
    departement: ''
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

  // Actions d'authentification
  function login(username, password) {
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
      email: '',
      role: '',
      departement: ''
    }
    isAuthenticated.value = false
    
    // Nettoyer localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('isAuthenticated')
  }

  // Initialiser depuis localStorage au démarrage
  function initFromStorage() {
    const savedUser = localStorage.getItem('user')
    const savedAuth = localStorage.getItem('isAuthenticated')
    
    if (savedUser && savedAuth === 'true') {
      user.value = JSON.parse(savedUser)
      isAuthenticated.value = true
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

  return {
    user,
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
    logout,
    initFromStorage,
    setRole,
    setUser
  }
}) 