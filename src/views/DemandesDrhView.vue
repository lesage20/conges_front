<script>
export default {
  name: 'DemandesDrhView',
  data() {
    return {
      selectedFilter: 'all',
      selectedStatus: 'all',
      demandes: [
        {
          id: 1,
          employee: 'Marie Dupont',
          department: 'IT',
          type: 'Congés payés',
          startDate: '2025-03-15',
          endDate: '2025-03-20',
          days: 4,
          status: 'En attente',
          reason: 'Vacances de printemps',
          submittedDate: '2025-03-01'
        },
        {
          id: 2,
          employee: 'Pierre Martin',
          department: 'Marketing',
          type: 'RTT',
          startDate: '2025-03-22',
          endDate: '2025-03-22',
          days: 1,
          status: 'En attente',
          reason: 'Rendez-vous médical',
          submittedDate: '2025-03-02'
        },
        {
          id: 3,
          employee: 'Sarah Dubois',
          department: 'RH',
          type: 'Congés maladie',
          startDate: '2025-03-10',
          endDate: '2025-03-12',
          days: 3,
          status: 'Approuvée',
          reason: 'Arrêt maladie',
          submittedDate: '2025-02-28'
        },
        {
          id: 4,
          employee: 'Jean Leroy',
          department: 'Finance',
          type: 'Congés payés',
          startDate: '2025-04-01',
          endDate: '2025-04-10',
          days: 8,
          status: 'Refusée',
          reason: 'Période de clôture comptable',
          submittedDate: '2025-03-01'
        }
      ]
    }
  },
  computed: {
    filteredDemandes() {
      let filtered = this.demandes

      if (this.selectedStatus !== 'all') {
        filtered = filtered.filter(d => d.status === this.selectedStatus)
      }

      return filtered
    },
    pendingCount() {
      return this.demandes.filter(d => d.status === 'En attente').length
    },
    approvedCount() {
      return this.demandes.filter(d => d.status === 'Approuvée').length
    },
    rejectedCount() {
      return this.demandes.filter(d => d.status === 'Refusée').length
    }
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case 'En attente': return 'bg-orange-100 text-orange-800'
        case 'Approuvée': return 'bg-green-100 text-green-800'
        case 'Refusée': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    },
    approveDemande(demande) {
      demande.status = 'Approuvée'
      // Ici on ferait l'appel API
    },
    rejectDemande(demande) {
      demande.status = 'Refusée'
      // Ici on ferait l'appel API
    },
    viewDetails(demande) {
      // Ouvrir un modal ou naviguer vers une page de détails
      console.log('Voir détails:', demande)
    }
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h1 class="text-2xl font-bold text-gray-900">Gestion des demandes</h1>
      <p class="text-gray-600 mt-2">Approuver ou refuser les demandes de congés</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center space-x-4">
          <label class="text-sm font-medium text-gray-700">Filtrer par statut:</label>
          <select 
            v-model="selectedStatus"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes</option>
            <option value="En attente">En attente</option>
            <option value="Approuvée">Approuvées</option>
            <option value="Refusée">Refusées</option>
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

    <!-- Demandes list -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="demande in filteredDemandes" :key="demande.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ demande.employee }}</div>
                  <div class="text-sm text-gray-500">{{ demande.department }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ demande.type }}</div>
                <div class="text-sm text-gray-500">{{ demande.reason }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatDate(demande.startDate) }} - {{ formatDate(demande.endDate) }}
                </div>
                <div class="text-sm text-gray-500">
                  Demandé le {{ formatDate(demande.submittedDate) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-900">{{ demande.days }} jour{{ demande.days > 1 ? 's' : '' }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full', getStatusColor(demande.status)]">
                  {{ demande.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button 
                  v-if="demande.status === 'En attente'"
                  @click="approveDemande(demande)"
                  class="text-green-600 hover:text-green-900 px-2 py-1 bg-green-50 rounded hover:bg-green-100 transition-colors"
                >
                  Approuver
                </button>
                <button 
                  v-if="demande.status === 'En attente'"
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