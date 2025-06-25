import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // État de l'utilisateur (mock)
  const user = ref({
    id: 1,
    nom: 'John Doe',
    email: 'john.doe@company.com',
    role: 'drh', // 'employe', 'chef_service', 'drh'
    departement: 'RH'
  })

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

  // Actions pour changer le rôle (pour test)
  function setRole(newRole) {
    user.value.role = newRole
  }

  function setUser(userData) {
    user.value = { ...user.value, ...userData }
  }

  return {
    user,
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
    setRole,
    setUser
  }
}) 