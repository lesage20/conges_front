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

const loadDashboardData = async () => {
  try {
    // Charger les statistiques du dashboard
    const response = await getDashboardStats()
    if (response) {
      dashboardData.value = response
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

    <!-- Stats cards génériques pour managers et DRH -->
    <div v-if="!isEmployee" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <router-link to="/demandes-drh" class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
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

        <!-- Activité générale pour managers/DRH -->
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
        <div v-else>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Aperçu des départements</h3>
          <div class="space-y-4">
          <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <p class="text-sm font-medium text-gray-900">IT</p>
              <p class="text-xs text-gray-600">24 employés • 3 absents</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-blue-600">87%</p>
              <p class="text-xs text-gray-600">Présents</p>
            </div>
          </div>
          
          <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p class="text-sm font-medium text-gray-900">Marketing</p>
              <p class="text-xs text-gray-600">18 employés • 1 absent</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-green-600">94%</p>
              <p class="text-xs text-gray-600">Présents</p>
            </div>
          </div>
          
          <div class="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div>
              <p class="text-sm font-medium text-gray-900">Finance</p>
              <p class="text-xs text-gray-600">15 employés • 4 absents</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-orange-600">73%</p>
              <p class="text-xs text-gray-600">Présents</p>
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