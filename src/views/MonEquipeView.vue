<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUsers } from '@/composables/useUsers'
import { useAuthStore } from '@/stores/auth'

// Composables
const { getMyTeam, loading: usersLoading } = useUsers()
const authStore = useAuthStore()

// Données réactives
const equipe = ref([])
const demandesEnAttente = ref([])

// Computed properties
const membresEquipe = computed(() => {
  // Filtrer seulement les employés (pas les chefs de service)
  return equipe.value.filter(user => user.role === 'employe')
})

const membresPresents = computed(() => {
  return membresEquipe.value.filter(membre => membre.status === 'Présent')
})

const membresEnConge = computed(() => {
  return membresEquipe.value.filter(membre => membre.status === 'En congé')
})

const loadEquipe = async () => {
  try {
    const response = await getMyTeam()
    if (response) {
      // Ajouter le status pour chaque membre (temporaire - à récupérer de l'API plus tard)
      equipe.value = response.map(user => ({
        ...user,
        status: 'Présent', // À implémenter avec les vraies données
        derniereAbsence: '2025-01-01' // À implémenter avec les vraies données
      }))
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'équipe:', error)
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Présent': return 'bg-green-100 text-green-800'
    case 'En congé': return 'bg-orange-100 text-orange-800'
    case 'Absent': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'Présent': return '✅'
    case 'En congé': return '🏖️'
    case 'Absent': return '❌'
    default: return '❓'
  }
}

// Charger les données au montage du composant
onMounted(() => {
  loadEquipe()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h1 class="text-2xl font-bold text-gray-900">Mon équipe</h1>
      <p class="text-gray-600 mt-2">Gestion des membres de votre équipe - {{ authStore.user?.departement?.nom || 'Département' }}</p>
    </div>

    <!-- Stats de l'équipe -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total équipe</p>
            <p class="text-2xl font-bold text-gray-900">{{ membresEquipe.length }}</p>
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
            <p class="text-sm font-medium text-gray-600">Présents</p>
            <p class="text-2xl font-bold text-gray-900">{{ membresPresents.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 rounded-lg">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">En congé</p>
            <p class="text-2xl font-bold text-gray-900">{{ membresEnConge.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Solde total</p>
            <p class="text-2xl font-bold text-gray-900">{{ membresEquipe.reduce((total, membre) => total + (membre.solde_conges || 0), 0) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Informations rapides -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Aperçu rapide</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Employés avec le plus de congés -->
        <div>
          <h4 class="font-medium text-gray-900 mb-3">Plus de congés disponibles</h4>
          <div class="space-y-2">
            <div 
              v-for="membre in membresEquipe.slice().sort((a, b) => (b.solde_conges || 0) - (a.solde_conges || 0)).slice(0, 3)" 
              :key="membre.id"
              class="flex items-center justify-between p-3 bg-green-50 rounded-lg"
            >
              <div>
                <p class="font-medium text-gray-900">{{ membre.prenom }} {{ membre.nom }}</p>
                <p class="text-sm text-gray-600">{{ membre.email }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-green-700">{{ membre.solde_conges || 0 }} jours</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Employés avec le moins de congés -->
        <div>
          <h4 class="font-medium text-gray-900 mb-3">Moins de congés disponibles</h4>
          <div class="space-y-2">
            <div 
              v-for="membre in membresEquipe.slice().sort((a, b) => (a.solde_conges || 0) - (b.solde_conges || 0)).slice(0, 3)" 
              :key="membre.id"
              class="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
            >
              <div>
                <p class="font-medium text-gray-900">{{ membre.prenom }} {{ membre.nom }}</p>
                <p class="text-sm text-gray-600">{{ membre.email }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-orange-700">{{ membre.solde_conges || 0 }} jours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste de l'équipe -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Membres de l'équipe ({{ membresEquipe.length }})</h3>
      </div>
      
      <div v-if="usersLoading" class="p-6">
        <div class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
      
      <div v-else-if="membresEquipe.length === 0" class="p-6 text-center text-gray-500">
        Aucun membre d'équipe trouvé dans votre département
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employé</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Solde congés</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="membre in membresEquipe" :key="membre.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-700">
                        {{ membre.prenom ? membre.prenom[0] : '' }}{{ membre.nom ? membre.nom[0] : '' }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ membre.prenom }} {{ membre.nom }}</div>
                    <div class="text-sm text-gray-500">{{ membre.role }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ membre.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm">
                  <div class="font-medium text-gray-900">{{ membre.solde_conges || 0 }} jours</div>
                  <div class="text-gray-500">disponibles</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusColor(membre.status)]">
                  <span class="mr-1">{{ getStatusIcon(membre.status) }}</span>
                  {{ membre.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button class="text-blue-600 hover:text-blue-900">
                    Voir détails
                  </button>
                  <button class="text-green-600 hover:text-green-900">
                    Historique
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template> 