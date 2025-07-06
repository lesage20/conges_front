<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDemandesConges } from '@/composables/useDemandesConges'
import { useUsers } from '@/composables/useUsers'

// Composables
const { getDemandesEnAttente, validerDemande, loading, error } = useDemandesConges()
const { getUsers } = useUsers()

// Données réactives
const selectedFilter = ref('all')
const selectedStatus = ref('all')
const demandes = ref([])
const users = ref([])
const isLoading = ref(false)

// Computed
const filteredDemandes = computed(() => {
  let filtered = demandes.value

  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(d => d.statut === selectedStatus.value)
  }

  return filtered
})

const pendingCount = computed(() => {
  return demandes.value.filter(d => d.statut === 'en_attente').length
})

const approvedCount = computed(() => {
  return demandes.value.filter(d => d.statut === 'approuvee').length
})

const rejectedCount = computed(() => {
  return demandes.value.filter(d => d.statut === 'refusee').length
})

// Méthodes
const getStatusColor = (status) => {
  switch (status) {
    case 'en_attente': return 'bg-orange-100 text-orange-800'
    case 'approuvee': return 'bg-green-100 text-green-800'
    case 'refusee': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'en_attente': return 'En attente'
    case 'approuvee': return 'Approuvée'
    case 'refusee': return 'Refusée'
    default: return status
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const getUserName = (userId) => {
  const user = users.value.find(u => u.id === userId)
  return user ? `${user.prenom} ${user.nom}` : 'Utilisateur inconnu'
}

const approveDemande = async (demande) => {
  try {
    await validerDemande(demande.id, 'approuvee', 'Demande approuvée')
    await loadDemandes()
  } catch (err) {
    console.error('Erreur lors de l\'approbation:', err)
  }
}

const rejectDemande = async (demande) => {
  try {
    await validerDemande(demande.id, 'refusee', 'Demande refusée')
    await loadDemandes()
  } catch (err) {
    console.error('Erreur lors du refus:', err)
  }
}

const viewDetails = (demande) => {
  // Ouvrir un modal ou naviguer vers une page de détails
  console.log('Voir détails:', demande)
}

const loadDemandes = async () => {
  isLoading.value = true
  try {
    const response = await getDemandesEnAttente()
    demandes.value = response || []
  } catch (err) {
    console.error('Erreur lors du chargement des demandes:', err)
    demandes.value = []
  } finally {
    isLoading.value = false
  }
}

const loadUsers = async () => {
  try {
    const response = await getUsers()
    users.value = response || []
  } catch (err) {
    console.error('Erreur lors du chargement des utilisateurs:', err)
    users.value = []
  }
}

// Charger les données au montage
onMounted(() => {
  loadDemandes()
  loadUsers()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h1 class="text-2xl font-bold text-gray-900">Gestion des demandes</h1>
      <p class="text-gray-600 mt-2">Approuver ou refuser les demandes de congés</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">Chargement des demandes...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 class="text-red-800 font-medium">Erreur de chargement</h3>
          <p class="text-red-600 text-sm mt-1">{{ error }}</p>
        </div>
      </div>
      <button 
        @click="loadDemandes" 
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Réessayer
      </button>
    </div>

    <!-- Stats -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 rounded-lg">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">En attente</p>
            <p class="text-2xl font-bold text-gray-900">{{ pendingCount }}</p>
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
            <p class="text-sm font-medium text-gray-600">Approuvées</p>
            <p class="text-2xl font-bold text-gray-900">{{ approvedCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Refusées</p>
            <p class="text-2xl font-bold text-gray-900">{{ rejectedCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div v-if="!isLoading && !error" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center space-x-4">
          <label class="text-sm font-medium text-gray-700">Filtrer par statut:</label>
          <select 
            v-model="selectedStatus"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes</option>
            <option value="en_attente">En attente</option>
            <option value="approuvee">Approuvées</option>
            <option value="refusee">Refusées</option>
          </select>
        </div>
        
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Exporter
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && !error && !demandes.length" class="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune demande trouvée</h3>
      <p class="text-gray-600 mb-4">Il n'y a pas de demandes en attente pour le moment.</p>
    </div>

    <!-- Demandes list -->
    <div v-if="!isLoading && !error && demandes.length" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          Liste des demandes 
          <span class="text-sm font-normal text-gray-600">({{ filteredDemandes.length }})</span>
        </h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jours</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="demande in filteredDemandes" :key="demande.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ getUserName(demande.demandeur_id) }}</div>
                  <div class="text-sm text-gray-500">{{ formatDate(demande.date_demande) }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ demande.type_conge }}</div>
                <div class="text-sm text-gray-500">{{ demande.motif || 'Aucun motif' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(demande.date_debut) }}</div>
                <div class="text-sm text-gray-500">au {{ formatDate(demande.date_fin) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ demande.nombre_jours }} jour(s)
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full', getStatusColor(demande.statut)]">
                  {{ getStatusLabel(demande.statut) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button 
                  v-if="demande.statut === 'en_attente'"
                  @click="approveDemande(demande)"
                  class="text-green-600 hover:text-green-900 px-2 py-1 bg-green-50 rounded hover:bg-green-100 transition-colors"
                >
                  Approuver
                </button>
                <button 
                  v-if="demande.statut === 'en_attente'"
                  @click="rejectDemande(demande)"
                  class="text-red-600 hover:text-red-900 px-2 py-1 bg-red-50 rounded hover:bg-red-100 transition-colors"
                >
                  Refuser
                </button>
                <button 
                  @click="viewDetails(demande)"
                  class="text-blue-600 hover:text-blue-900 px-2 py-1 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                >
                  Détails
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles spécifiques si nécessaire */
</style> 