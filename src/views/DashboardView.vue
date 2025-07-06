<script setup>
import { ref, onMounted } from 'vue'
import { useDemandesConges } from '@/composables/useDemandesConges'

// Composables
const { getDashboardStats, loading: demandesLoading } = useDemandesConges()

// Données réactives
const stats = ref({
  totalEmployees: 0,
  activeLeaves: 0,
  pendingRequests: 0,
  departments: 0
})

const recentActivity = ref([])

const loadDashboardData = async () => {
  try {
    // Charger les statistiques du dashboard
    const dashboardStats = await getDashboardStats()
    if (dashboardStats) {
      stats.value = {
        totalEmployees: dashboardStats.total_employees || 0,
        activeLeaves: dashboardStats.active_leaves || 0,
        pendingRequests: dashboardStats.pending_requests || 0,
        departments: dashboardStats.departments || 0
      }
    }

    // Charger les activités récentes si disponibles
    if (dashboardStats?.recent_activity) {
      recentActivity.value = dashboardStats.recent_activity
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    // Garder les valeurs par défaut en cas d'erreur
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
          <p class="text-gray-600 mt-2">Vue d'ensemble de la gestion des congés</p>
        </div>
      </div>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total employés</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalEmployees }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Congés en cours</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.activeLeaves }}</p>
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
            <p class="text-2xl font-bold text-gray-900">{{ stats.pendingRequests }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Départements</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.departments }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Navigation rapide</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
        <div class="space-y-4">
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
        
        <router-link to="/demandes-drh" class="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
          Voir toutes les demandes →
        </router-link>
      </div>

      <!-- Department overview -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
</template>

<style scoped>
/* Styles spécifiques si nécessaire */
</style> 