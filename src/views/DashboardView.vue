<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDemandesConges } from '@/composables/useDemandesConges'
import { useAuthStore } from '@/stores/auth'

// Composables
const { getDashboardStats, loading: demandesLoading } = useDemandesConges()
const authStore = useAuthStore()

// Données réactives
const dashboardData = ref({})
const recentActivity = ref([])

// Computed properties depuis le store
const isEmployee = computed(() => authStore.isEmploye)
const isManager = computed(() => authStore.isChefService)  
const isDRH = computed(() => authStore.isDrh)

const employeeStats = computed(() => {
  if (!dashboardData.value?.kpi_employe) return null
  return dashboardData.value.kpi_employe
})

const managerStats = computed(() => {
  if (!dashboardData.value?.kpi_chef_service) return null
  return dashboardData.value.kpi_chef_service
})

const drhStats = computed(() => {
  if (!dashboardData.value?.kpi_drh) return null
  return dashboardData.value.kpi_drh
})

const loadDashboardData = async () => {
  try {
    // Charger les statistiques du dashboard
    const response = await getDashboardStats()
    if (response) {
      dashboardData.value = response
      console.log('Dashboard data loaded:', response)
      
      // Déboguer spécifiquement pour le DRH
      if (isDRH.value && response.kpi_drh) {
        console.log('DRH stats:', response.kpi_drh)
        console.log('DRH activité récente:', response.kpi_drh.activite_recente)
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  }
}

// Charger les données au montage du composant
onMounted(() => {
  loadDashboardData()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-gray-600 mt-2">
            <span v-if="isEmployee">Vos congés et demandes</span>
            <span v-else-if="isManager">Gestion de votre équipe</span>
            <span v-else-if="isDRH">Vue d'ensemble de la gestion des congés</span>
            <span v-else>Vue d'ensemble de la gestion des congés</span>
          </p>
        </div>
      </div>
    </div>
    <!-- Stats pour DRH -->
    <div v-if="isDRH && drhStats" class="space-y-6">
      <!-- Vue d'ensemble organisation -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Vue d'ensemble de l'organisation</h2>
        
        <!-- Statistiques globales -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Total employés</p>
                <p class="text-2xl font-bold text-blue-600">{{ drhStats.kpi_globaux.total_employes }}</p>
              </div>
            </div>
          </div>

          <div class="bg-green-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Présents</p>
                <p class="text-2xl font-bold text-green-600">{{ drhStats.kpi_globaux.total_presents }}</p>
                <p class="text-xs text-gray-500">{{ drhStats.kpi_globaux.pourcentage_presence }}%</p>
              </div>
            </div>
          </div>

          <div class="bg-red-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="p-2 bg-red-100 rounded-lg">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Absents</p>
                <p class="text-2xl font-bold text-red-600">{{ drhStats.kpi_globaux.total_absents }}</p>
                <p class="text-xs text-gray-500">{{ drhStats.kpi_globaux.pourcentage_absence }}%</p>
              </div>
            </div>
          </div>

          <div class="bg-orange-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="p-2 bg-orange-100 rounded-lg">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Absents {{ drhStats.kpi_globaux.mois_courant }}</p>
                <p class="text-2xl font-bold text-orange-600">{{ drhStats.kpi_globaux.total_absents_mois_courant }}</p>
                <p class="text-xs text-gray-500">{{ drhStats.kpi_globaux.pourcentage_absents_mois }}%</p>
              </div>
            </div>
          </div>
        </div>

                
        <!-- Graphique de répartition -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-800 mb-3">Répartition du personnel</h4>
          <div class="flex items-center space-x-4">
            <div class="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
              <div 
                class="bg-green-500 h-full transition-all duration-300"
                :style="{ width: drhStats.kpi_globaux.pourcentage_presence + '%' }"
              ></div>
              <div 
                class="bg-red-500 h-full transition-all duration-300"
                :style="{ 
                  width: drhStats.kpi_globaux.pourcentage_absence + '%',
                  marginLeft: drhStats.kpi_globaux.pourcentage_presence + '%'
                }"
              ></div>
            </div>
            <div class="flex items-center space-x-3 text-sm">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span class="text-gray-600">Présents</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span class="text-gray-600">Absents</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistiques par département -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistiques par département</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div 
            v-for="dept in drhStats.departements" 
            :key="dept.id"
            class="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-semibold text-gray-900">{{ dept.nom }}</h4>
              <span 
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  dept.taux_presence >= 90 ? 'bg-green-100 text-green-800' :
                  dept.taux_presence >= 70 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                ]"
              >
                {{ dept.taux_presence }}% présent
              </span>
            </div>
            
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="text-center">
                <p class="text-sm text-gray-600">Employés</p>
                <p class="text-xl font-bold text-gray-900">{{ dept.nombre_employes }}</p>
              </div>
              <div class="text-center">
                <p class="text-sm text-gray-600">En congé</p>
                <p class="text-xl font-bold text-orange-600">{{ dept.employes_en_conge }}</p>
              </div>
            </div>
            
            <div class="grid grid-cols-3 gap-2 text-xs">
              <div class="text-center p-2 bg-green-100 rounded">
                <p class="text-green-800 font-medium">{{ dept.demandes_approuvees }}</p>
                <p class="text-green-600">Approuvées</p>
              </div>
              <div class="text-center p-2 bg-orange-100 rounded">
                <p class="text-orange-800 font-medium">{{ dept.demandes_en_attente }}</p>
                <p class="text-orange-600">En attente</p>
              </div>
              <div class="text-center p-2 bg-purple-100 rounded">
                <p class="text-purple-800 font-medium">{{ dept.solde_total }}</p>
                <p class="text-purple-600">Solde total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mes congés personnels DRH -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Mes congés personnels</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Jours restants</p>
                <p class="text-2xl font-bold text-green-600">{{ drhStats.mes_conges.jours_restants }}</p>
              </div>
            </div>
          </div>

          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Jours pris</p>
                <p class="text-2xl font-bold text-blue-600">{{ drhStats.mes_conges.jours_pris }}</p>
              </div>
            </div>
          </div>

          <div class="bg-orange-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="p-2 bg-orange-100 rounded-lg">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">En attente</p>
                <p class="text-2xl font-bold text-orange-600">{{ drhStats.mes_conges.jours_en_attente }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="p-2 bg-gray-100 rounded-lg">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Solde total</p>
                <p class="text-2xl font-bold text-gray-600">{{ drhStats.mes_conges.solde_total }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Congé en cours pour le DRH -->
        <div v-if="drhStats.mes_conges.conge_en_cours" class="mt-4 p-4 bg-orange-50 rounded-lg">
          <h4 class="font-semibold text-orange-800 mb-2">🏝️ Congé en cours</h4>
          <p class="text-sm text-orange-700">
            Du {{ drhStats.mes_conges.conge_en_cours.date_debut }} au {{ drhStats.mes_conges.conge_en_cours.date_fin }}
          </p>
          <p class="text-sm text-orange-700">
            Motif : {{ drhStats.mes_conges.conge_en_cours.motif }}
          </p>
          <p class="text-sm text-orange-700">
            Jours restants : {{ drhStats.mes_conges.conge_en_cours.jours_restants }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- Stats cards pour employés -->
    <div v-if="isEmployee && employeeStats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Demandes approuvées</p>
            <p class="text-2xl font-bold text-green-600">{{ employeeStats.demandes_approuvees }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Demandes refusées</p>
            <p class="text-2xl font-bold text-red-600">{{ employeeStats.demandes_refusees }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 rounded-lg">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Demandes en attente</p>
            <p class="text-2xl font-bold text-orange-600">{{ employeeStats.demandes_en_attente }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Jours restants {{ employeeStats.annee }}</p>
            <p class="text-2xl font-bold text-blue-600">{{ employeeStats.jours_restants }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats cards pour chefs de service -->
    <div v-if="isManager && managerStats" class="space-y-6">
      <!-- Titre section équipe -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Statistiques de mon équipe</h2>
        
        <!-- Statistiques de l'équipe -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Approuvées</p>
                <p class="text-2xl font-bold text-green-600">{{ managerStats.equipe.demandes_approuvees }}</p>
              </div>
            </div>
          </div>

          <div class="bg-red-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="p-2 bg-red-100 rounded-lg">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Refusées</p>
                <p class="text-2xl font-bold text-red-600">{{ managerStats.equipe.demandes_refusees }}</p>
              </div>
            </div>
          </div>

          <div class="bg-orange-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="p-2 bg-orange-100 rounded-lg">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">En attente</p>
                <p class="text-2xl font-bold text-orange-600">{{ managerStats.equipe.demandes_en_attente }}</p>
              </div>
            </div>
          </div>

          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Présents</p>
                <p class="text-2xl font-bold text-blue-600">{{ managerStats.equipe.employes_presents }}/{{ managerStats.equipe.nombre_employes }}</p>
              </div>
            </div>
          </div>

          <div class="bg-indigo-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="p-2 bg-indigo-100 rounded-lg">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Total équipe</p>
                <p class="text-2xl font-bold text-indigo-600">{{ managerStats.equipe.total_demandes }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mes congés personnels -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Mes congés personnels</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Jours restants</p>
                <p class="text-2xl font-bold text-green-600">{{ managerStats.mes_conges.jours_restants }}</p>
              </div>
            </div>
          </div>

          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Jours pris</p>
                <p class="text-2xl font-bold text-blue-600">{{ managerStats.mes_conges.jours_pris }}</p>
              </div>
            </div>
          </div>

          <div class="bg-orange-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="p-2 bg-orange-100 rounded-lg">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">En attente</p>
                <p class="text-2xl font-bold text-orange-600">{{ managerStats.mes_conges.jours_en_attente }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="p-2 bg-gray-100 rounded-lg">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Solde total</p>
                <p class="text-2xl font-bold text-gray-600">{{ managerStats.mes_conges.solde_total }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Congé en cours pour le chef -->
        <div v-if="managerStats.mes_conges.conge_en_cours" class="mt-4 p-4 bg-orange-50 rounded-lg">
          <h4 class="font-semibold text-orange-800 mb-2">🏝️ Congé en cours</h4>
          <p class="text-sm text-orange-700">
            Du {{ managerStats.mes_conges.conge_en_cours.date_debut }} au {{ managerStats.mes_conges.conge_en_cours.date_fin }}
          </p>
          <p class="text-sm text-orange-700">
            Motif : {{ managerStats.mes_conges.conge_en_cours.motif }}
          </p>
          <p class="text-sm text-orange-700">
            Jours restants : {{ managerStats.mes_conges.conge_en_cours.jours_restants }}
          </p>
        </div>
      </div>

      <!-- Résumé des congés de l'équipe -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">État des congés de l'équipe</h3>
        
        <!-- Prochain retour -->
        <div v-if="managerStats.equipe.prochain_retour" class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div class="flex items-center mb-2">
            <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h4 class="font-semibold text-blue-800">Prochain retour de congé</h4>
          </div>
          <p class="text-sm text-blue-700">
            <strong>{{ managerStats.equipe.prochain_retour.nom }}</strong> revient dans 
            <strong>{{ managerStats.equipe.prochain_retour.jours_restants }}</strong> jour(s)
          </p>
          <p class="text-xs text-blue-600">
            Retour prévu le {{ managerStats.equipe.prochain_retour.date_fin }}
          </p>
        </div>

        <!-- Employés actuellement en congé -->
        <div v-if="managerStats.equipe.employes_en_conge && managerStats.equipe.employes_en_conge.length > 0" class="mb-6">
          <h4 class="font-semibold text-gray-900 mb-3">Employés actuellement en congé ({{ managerStats.equipe.employes_en_conge.length }})</h4>
          <div class="space-y-2">
            <div v-for="(employe, index) in managerStats.equipe.employes_en_conge" :key="index" 
                 class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p class="font-medium text-gray-900">{{ employe.nom }}</p>
                <p class="text-sm text-gray-600">{{ employe.date_debut }} - {{ employe.date_fin }}</p>
                <p class="text-xs text-gray-500">{{ employe.motif }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-yellow-700">{{ employe.jours_restants }} jour(s)</p>
                <p class="text-xs text-gray-500">restant(s)</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Message si aucun employé en congé -->
        <div v-else class="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-sm text-green-800">Aucun employé en congé actuellement</p>
          </div>
        </div>

        <!-- Prochains départs -->
        <div v-if="managerStats.equipe.prochains_departs && managerStats.equipe.prochains_departs.length > 0">
          <h4 class="font-semibold text-gray-900 mb-3">Prochains départs en congé</h4>
          <div class="space-y-2">
            <div v-for="(depart, index) in managerStats.equipe.prochains_departs" :key="index" 
                 class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p class="font-medium text-gray-900">{{ depart.nom }}</p>
                <p class="text-sm text-gray-600">{{ depart.date_debut }} - {{ depart.date_fin }}</p>
                <p class="text-xs text-gray-500">{{ depart.motif }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-purple-700">Dans {{ depart.jours_avant_depart }} jour(s)</p>
                <p class="text-xs text-gray-500">{{ depart.working_time }} jours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Détails du solde pour les employés -->
    <div v-if="isEmployee && employeeStats" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Détail de votre solde de congés {{ employeeStats.annee }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-600">Solde total</p>
          <p class="text-xl font-bold text-gray-900">{{ employeeStats.solde_total }} jours</p>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <p class="text-sm text-gray-600">Jours pris</p>
          <p class="text-xl font-bold text-green-600">{{ employeeStats.jours_pris }} jours</p>
        </div>
        <div class="text-center p-4 bg-orange-50 rounded-lg">
          <p class="text-sm text-gray-600">Jours en attente</p>
          <p class="text-xl font-bold text-orange-600">{{ employeeStats.jours_en_attente }} jours</p>
        </div>
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-gray-600">Jours disponibles</p>
          <p class="text-xl font-bold text-blue-600">{{ employeeStats.jours_restants }} jours</p>
        </div>
      </div>
    </div>

    <!-- Stats cards génériques pour managers et DRH (ancien affichage) -->
    <div v-if="!isEmployee && !isManager && !isDRH" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total demandes</p>
            <p class="text-2xl font-bold text-gray-900">{{ dashboardData.total_demandes || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Demandes approuvées</p>
            <p class="text-2xl font-bold text-green-600">{{ dashboardData.stats_par_statut?.approuvee || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 rounded-lg">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Demandes en attente</p>
            <p class="text-2xl font-bold text-orange-600">{{ dashboardData.stats_par_statut?.en_attente || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Demandes refusées</p>
            <p class="text-2xl font-bold text-red-600">{{ dashboardData.stats_par_statut?.refusee || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Navigation rapide</h3>
      
      <!-- Actions pour employés -->
      <div v-if="isEmployee" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <router-link to="/demandes" class="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
          <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <div class="text-left">
            <p class="font-medium text-gray-900">Mes demandes</p>
            <p class="text-sm text-gray-600">Gérer mes congés</p>
          </div>
        </router-link>

        <router-link to="/parametres" class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
          <svg class="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <div class="text-left">
            <p class="font-medium text-gray-900">Modifier mon profil</p>
            <p class="text-sm text-gray-600">Mes informations</p>
          </div>
        </router-link>
      </div>

      <!-- Actions pour chefs de service -->
      <div v-else-if="isManager" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link to="/demandes" class="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
          <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <div class="text-left">
            <p class="font-medium text-gray-900">Mes demandes</p>
            <p class="text-sm text-gray-600">Mes congés personnels</p>
          </div>
        </router-link>

        <router-link to="/demandes" class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
          <svg class="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="text-left">
            <p class="font-medium text-gray-900">Validation</p>
            <p class="text-sm text-gray-600">Approuver/Refuser</p>
          </div>
        </router-link>

        <router-link to="/mon-equipe" class="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
          <svg class="w-8 h-8 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <div class="text-left">
            <p class="font-medium text-gray-900">Mon équipe</p>
            <p class="text-sm text-gray-600">Gérer mes employés</p>
          </div>
        </router-link>
      </div>

      <!-- Actions pour managers/DRH -->
      <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <router-link to="/demandes" class="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
          <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <div class="text-left">
            <p class="font-medium text-gray-900">Mes demandes</p>
            <p class="text-sm text-gray-600">Créer et gérer</p>
          </div>
        </router-link>

        <router-link to="/demandes" class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
          <svg class="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <div class="text-left">
            <p class="font-medium text-gray-900">Validation</p>
            <p class="text-sm text-gray-600">Approuver ou refuser</p>
          </div>
        </router-link>

        <router-link to="/employes" class="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
          <svg class="w-8 h-8 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <div class="text-left">
            <p class="font-medium text-gray-900">Employés</p>
            <p class="text-sm text-gray-600">Gestion des profils</p>
          </div>
        </router-link>

        <router-link to="/departements" class="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
          <svg class="w-8 h-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          <div class="text-left">
            <p class="font-medium text-gray-900">Départements</p>
            <p class="text-sm text-gray-600">Vue par service</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Activity and calendar overview -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent activity -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          <span v-if="isEmployee">Mon activité récente</span>
          <span v-else-if="isManager">Activité récente de l'équipe</span>
          <span v-else-if="isDRH">Activité récente de l'organisation</span>
          <span v-else>Activité récente</span>
        </h3>
        
        <!-- Activité pour employés -->
        <div v-if="isEmployee && employeeStats?.activite_recente" class="space-y-4">
          <div 
            v-for="(activity, index) in employeeStats.activite_recente" 
            :key="index"
            class="flex items-start"
          >
            <div 
              :class="[
                'w-2 h-2 rounded-full mt-2 mr-3',
                activity.type === 'approuvee' ? 'bg-green-500' : 
                activity.type === 'en_attente' ? 'bg-orange-500' : 
                activity.type === 'refusee' ? 'bg-red-500' : 
                activity.type === 'demande_annulation' ? 'bg-yellow-500' : 'bg-gray-400'
              ]"
            ></div>
            <div class="flex-1">
              <p class="text-sm text-gray-900">{{ activity.message }}</p>
              <p class="text-xs text-gray-600">
                Du {{ activity.date_debut }} au {{ activity.date_fin }} 
                ({{ activity.working_time }} jours) • {{ activity.time }}
              </p>
              <p v-if="activity.motif" class="text-xs text-gray-500">{{ activity.motif }}</p>
            </div>
          </div>
        </div>

        <!-- Activité pour chefs de service -->
        <div v-else-if="isManager && managerStats?.equipe?.activite_recente" class="space-y-4">
          <div 
            v-for="(activity, index) in managerStats.equipe.activite_recente" 
            :key="index"
            class="flex items-start"
          >
            <div 
              :class="[
                'w-2 h-2 rounded-full mt-2 mr-3',
                activity.type === 'approuvee' ? 'bg-green-500' : 
                activity.type === 'en_attente' ? 'bg-orange-500' : 
                activity.type === 'refusee' ? 'bg-red-500' : 
                activity.type === 'demande_annulation' ? 'bg-yellow-500' : 'bg-gray-400'
              ]"
            ></div>
            <div class="flex-1">
              <p class="text-sm text-gray-900">{{ activity.message }}</p>
              <p class="text-xs text-gray-600">
                Du {{ activity.date_debut }} au {{ activity.date_fin }} 
                ({{ activity.working_time }} jours) • {{ activity.time }}
              </p>
              <p v-if="activity.motif" class="text-xs text-gray-500">{{ activity.motif }}</p>
            </div>
          </div>
        </div>

        <!-- Activité pour DRH -->
        <div v-else-if="isDRH && drhStats?.activite_recente" class="space-y-4">
          <div 
            v-for="(activity, index) in drhStats.activite_recente" 
            :key="index"
            class="flex items-start"
          >
            <div 
              :class="[
                'w-2 h-2 rounded-full mt-2 mr-3',
                activity.type === 'approuvee' ? 'bg-green-500' : 
                activity.type === 'en_attente' ? 'bg-orange-500' : 
                activity.type === 'refusee' ? 'bg-red-500' : 
                activity.type === 'demande_annulation' ? 'bg-yellow-500' : 'bg-gray-400'
              ]"
            ></div>
            <div class="flex-1">
              <p class="text-sm text-gray-900">{{ activity.message }}</p>
              <p class="text-xs text-gray-600">
                Du {{ activity.date_debut }} au {{ activity.date_fin }} 
                ({{ activity.working_time }} jours) • {{ activity.time }}
              </p>
              <p v-if="activity.motif" class="text-xs text-gray-500">{{ activity.motif }}</p>
            </div>
          </div>
        </div>

        <!-- Activité pour DRH - message si pas d'activités récentes -->
        <div v-else-if="isDRH && drhStats && (!drhStats.activite_recente || drhStats.activite_recente.length === 0)" class="space-y-4">
          <div class="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune activité récente</h3>
              <p class="mt-1 text-sm text-gray-500">Aucune demande de congé récente dans l'organisation</p>
            </div>
          </div>
        </div>

        <!-- Activité pour DRH - chargement -->
        <div v-else-if="isDRH && !drhStats" class="space-y-4">
          <div class="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
            <div class="text-center">
              <svg class="animate-spin mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Chargement...</h3>
              <p class="mt-1 text-sm text-gray-500">Récupération de l'activité récente</p>
            </div>
          </div>
        </div>

        <!-- Activité générale pour autres cas -->
        <div v-else class="space-y-4">
          <div 
            v-for="(activity, index) in recentActivity" 
            :key="index"
            class="flex items-start"
          >
            <div 
              :class="[
                'w-2 h-2 rounded-full mt-2 mr-3',
                activity.type === 'approval' ? 'bg-green-500' : 
                activity.type === 'request' ? 'bg-blue-500' : 
                activity.type === 'rejection' ? 'bg-red-500' : 'bg-gray-400'
              ]"
            ></div>
            <div class="flex-1">
              <p class="text-sm text-gray-900">{{ activity.message }}</p>
              <p class="text-xs text-gray-600">{{ activity.department }} • {{ activity.time }}</p>
            </div>
          </div>
        </div>
        
        <router-link to="/demandes" class="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
          <span v-if="isEmployee">Voir toutes mes demandes →</span>
          <span v-else-if="isManager">Voir toutes les demandes de l'équipe →</span>
          <span v-else-if="isDRH">Voir toutes les demandes →</span>
          <span v-else>Voir toutes les demandes →</span>
        </router-link>
      </div>

      <!-- Congé en cours / Department overview -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <!-- Section pour employés : Congé en cours -->
        <div v-if="isEmployee">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">État actuel</h3>
          
          <!-- Congé en cours -->
          <div v-if="employeeStats?.conge_en_cours" class="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div class="flex items-center mb-2">
              <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h4 class="font-semibold text-green-800">Congé en cours</h4>
            </div>
            <p class="text-sm text-green-700 mb-1">
              Du {{ employeeStats.conge_en_cours.date_debut }} au {{ employeeStats.conge_en_cours.date_fin }}
            </p>
            <p class="text-sm text-green-600">
              <strong>{{ employeeStats.conge_en_cours.jours_restants }}</strong> jour(s) restant(s)
            </p>
            <p v-if="employeeStats.conge_en_cours.motif" class="text-xs text-green-600 mt-1">
              Motif: {{ employeeStats.conge_en_cours.motif }}
            </p>
          </div>

          <!-- Pas de congé en cours -->
          <div v-else class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="flex items-center mb-2">
              <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"></path>
              </svg>
              <h4 class="font-semibold text-blue-800">Aucun congé en cours</h4>
            </div>
            <p class="text-sm text-blue-600">Vous pouvez demander un nouveau congé</p>
          </div>

          <!-- Résumé des jours -->
          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span class="text-sm text-gray-600">Jours disponibles {{ employeeStats?.annee }}</span>
              <span class="font-semibold text-gray-900">{{ employeeStats?.jours_restants }} jours</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span class="text-sm text-blue-600">Solde total annuel</span>
              <span class="font-semibold text-blue-800">{{ employeeStats?.solde_total }} jours</span>
            </div>
          </div>
        </div>

        <!-- Section pour managers/DRH : Department overview -->
        <div v-else-if="isManager && managerStats">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">État des congés de l'équipe</h3>
          
          <!-- Prochain retour -->
          <div v-if="managerStats.equipe.prochain_retour" class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="flex items-center mb-2">
              <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h4 class="font-semibold text-blue-800">Prochain retour</h4>
            </div>
            <p class="text-sm text-blue-700">
              <strong>{{ managerStats.equipe.prochain_retour.nom }}</strong> dans 
              <strong>{{ managerStats.equipe.prochain_retour.jours_restants }}</strong> jour(s)
            </p>
            <p class="text-xs text-blue-600">
              Le {{ managerStats.equipe.prochain_retour.date_fin }}
            </p>
          </div>

          <!-- Employés actuellement en congé -->
          <div v-if="managerStats.equipe.employes_en_conge && managerStats.equipe.employes_en_conge.length > 0" class="mb-4">
            <h4 class="font-semibold text-gray-900 mb-2">En congé ({{ managerStats.equipe.employes_en_conge.length }})</h4>
            <div class="space-y-2">
              <div v-for="(employe, index) in managerStats.equipe.employes_en_conge.slice(0, 3)" :key="index" 
                   class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p class="font-medium text-gray-900 text-sm">{{ employe.nom }}</p>
                  <p class="text-xs text-gray-600">{{ employe.date_debut }} - {{ employe.date_fin }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold text-yellow-700">{{ employe.jours_restants }}j</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Message si aucun employé en congé -->
          <div v-else class="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div class="flex items-center">
              <svg class="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-sm text-green-800">Toute l'équipe est présente</p>
            </div>
          </div>

          <!-- Prochains départs -->
          <div v-if="managerStats.equipe.prochains_departs && managerStats.equipe.prochains_departs.length > 0" class="mb-4">
            <h4 class="font-semibold text-gray-900 mb-2">Prochains départs</h4>
            <div class="space-y-2">
              <div v-for="(depart, index) in managerStats.equipe.prochains_departs.slice(0, 3)" :key="index" 
                   class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p class="font-medium text-gray-900 text-sm">{{ depart.nom }}</p>
                  <p class="text-xs text-gray-600">{{ depart.date_debut }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold text-purple-700">{{ depart.jours_avant_depart }}j</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Résumé équipe -->
          <div class="space-y-2">
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span class="text-sm text-gray-600">Équipe présente</span>
              <span class="font-semibold text-gray-900">{{ managerStats.equipe.employes_presents }}/{{ managerStats.equipe.nombre_employes }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span class="text-sm text-blue-600">Demandes en attente</span>
              <span class="font-semibold text-blue-800">{{ managerStats.equipe.demandes_en_attente }}</span>
            </div>
          </div>
        </div>

        <!-- Section pour DRH : Department overview -->
        <div v-else>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Aperçu des départements</h3>
          
          <!-- Affichage des vraies données des départements -->
          <div v-if="isDRH && drhStats?.departements" class="space-y-4">
            <div 
              v-for="dept in drhStats.departements.slice(0, 5)" 
              :key="dept.id"
              class="flex items-center justify-between p-3 rounded-lg"
              :class="[
                dept.taux_presence >= 90 ? 'bg-green-50' :
                dept.taux_presence >= 70 ? 'bg-yellow-50' :
                'bg-red-50'
              ]"
            >
              <div>
                <p class="text-sm font-medium text-gray-900">{{ dept.nom }}</p>
                <p class="text-xs text-gray-600">
                  {{ dept.nombre_employes }} employés • {{ dept.employes_en_conge }} absent{{ dept.employes_en_conge > 1 ? 's' : '' }}
                </p>
              </div>
              <div class="text-right">
                <p 
                  class="text-sm font-semibold"
                  :class="[
                    dept.taux_presence >= 90 ? 'text-green-600' :
                    dept.taux_presence >= 70 ? 'text-yellow-600' :
                    'text-red-600'
                  ]"
                >
                  {{ dept.taux_presence }}%
                </p>
                <p class="text-xs text-gray-600">Présents</p>
              </div>
            </div>
          </div>

          <!-- Fallback si pas de données DRH -->
          <div v-else class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-900">Chargement...</p>
                <p class="text-xs text-gray-600">Récupération des données...</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-blue-600">-</p>
                <p class="text-xs text-gray-600">-</p>
              </div>
            </div>
          </div>
        
        <router-link to="/departements" class="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
          Voir tous les départements →
        </router-link>
        </div>
      </div>
    </div>

    
  </div>
</template>

<style scoped>
/* Styles spécifiques si nécessaire */
</style> 