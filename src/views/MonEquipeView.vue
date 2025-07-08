<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useUsers } from '@/composables/useUsers'
import { useDemandesConges } from '@/composables/useDemandesConges'
import { useAuthStore } from '@/stores/auth'
import BaseModal from '@/components/BaseModal.vue'

// Toast notifications
const toast = useToast()

// Composables
const { getMyTeam, loading: usersLoading, getUsersByDepartement } = useUsers()
const { getDemandesByUser } = useDemandesConges()
const authStore = useAuthStore()

// Données réactives
const equipe = ref([])
const demandesEnAttente = ref([])
const showDetailsModal = ref(false)
const showHistoriqueModal = ref(false)
const selectedEmployee = ref(null)
const historiqueEmploye = ref([])
const loadingHistorique = ref(false)

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

// Gestion des modals
const openDetailsModal = (employee) => {
  selectedEmployee.value = employee
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedEmployee.value = null
}

const openHistoriqueModal = async (employee) => {
  selectedEmployee.value = employee
  showHistoriqueModal.value = true
  await loadHistoriqueEmploye(employee.id)
}

const closeHistoriqueModal = () => {
  showHistoriqueModal.value = false
  selectedEmployee.value = null
  historiqueEmploye.value = []
}

const loadHistoriqueEmploye = async (userId) => {
  loadingHistorique.value = true
  try {
    const demandes = await getDemandesByUser(userId)
    historiqueEmploye.value = demandes || []
  } catch (error) {
    console.error('Erreur lors du chargement de l\'historique:', error)
    toast.error('Erreur lors du chargement de l\'historique des demandes')
    historiqueEmploye.value = []
  } finally {
    loadingHistorique.value = false
  }
}

// Utilitaires
const getDepartementName = (departementId) => {
  // Pour l'instant, retourne un placeholder
  return 'Département'
}

const getRoleLabel = (role) => {
  const roleLabels = {
    'employe': 'Employé',
    'chef_service': 'Chef de service',
    'drh': 'DRH'
  }
  return roleLabels[role] || role
}

const getDemandeStatusColor = (status) => {
  const colors = {
    'en_attente': 'bg-yellow-100 text-yellow-800',
    'approuvee': 'bg-green-100 text-green-800',
    'refusee': 'bg-red-100 text-red-800',
    'annulee': 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getDemandeStatusLabel = (status) => {
  const labels = {
    'en_attente': 'En attente',
    'approuvee': 'Approuvée',
    'refusee': 'Refusée',
    'annulee': 'Annulée'
  }
  return labels[status] || status
}

const getTypeCongeLabel = (type) => {
  const labels = {
    'conges_payes': 'Congés payés',
    'conges_maladie': 'Congé maladie',
    'conges_maternite': 'Congé maternité',
    'conges_paternite': 'Congé paternité',
    'conges_sans_solde': 'Congé sans solde',
    'rtt': 'RTT',
    'autre': 'Autre'
  }
  return labels[type] || type
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
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex items-center space-x-3">
                  <!-- Détails -->
                  <button 
                    @click="openDetailsModal(membre)"
                    class="text-green-600 hover:text-green-800 hover:bg-green-100 p-2 rounded-full transition-colors duration-200"
                    title="Voir les détails"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>

                  <!-- Historique -->
                  <button 
                    @click="openHistoriqueModal(membre)"
                    class="text-purple-600 hover:text-purple-800 hover:bg-purple-100 p-2 rounded-full transition-colors duration-200"
                    title="Historique des demandes"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Détails Employé -->
    <BaseModal 
      v-model="showDetailsModal" 
      title="Détails de l'employé"
      :close-on-overlay="true"
      size="large"
    >
      <div v-if="selectedEmployee" class="space-y-8">
        <!-- En-tête avec photo et nom -->
        <div class="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <div class="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {{ selectedEmployee.prenom?.charAt(0) }}{{ selectedEmployee.nom?.charAt(0) }}
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            {{ selectedEmployee.prenom }} {{ selectedEmployee.nom }}
          </h2>
          <div class="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
            {{ getRoleLabel(selectedEmployee.role) }}
          </div>
        </div>

        <!-- Informations personnelles -->
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Informations personnelles
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p class="text-sm text-gray-900">{{ selectedEmployee.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Téléphone</label>
              <p class="text-sm text-gray-900">{{ selectedEmployee.telephone || 'Non renseigné' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Date de naissance</label>
              <p class="text-sm text-gray-900">
                {{ selectedEmployee.date_naissance ? new Date(selectedEmployee.date_naissance).toLocaleDateString('fr-FR') : 'Non renseignée' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Genre</label>
              <p class="text-sm text-gray-900">
                {{ selectedEmployee.genre ? (selectedEmployee.genre === 'homme' ? 'Homme' : 'Femme') : 'Non renseigné' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">N° Pièce d'identité</label>
              <p class="text-sm text-gray-900">{{ selectedEmployee.numero_piece_identite || 'Non renseigné' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Nombre d'enfants</label>
              <p class="text-sm text-gray-900">{{ selectedEmployee.nombre_enfants || 0 }}</p>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-500 mb-1">Médaille d'honneur</label>
              <div class="flex items-center">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="selectedEmployee.has_medaille_honneur ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                  {{ selectedEmployee.has_medaille_honneur ? 'Oui' : 'Non' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations professionnelles -->
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
            </svg>
            Informations professionnelles
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Poste</label>
              <p class="text-sm text-gray-900">{{ selectedEmployee.poste || 'Non défini' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Département</label>
              <p class="text-sm text-gray-900">{{ getDepartementName(selectedEmployee.departement_id) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Date d'embauche</label>
              <p class="text-sm text-gray-900">
                {{ selectedEmployee.date_embauche ? new Date(selectedEmployee.date_embauche).toLocaleDateString('fr-FR') : 'Non renseignée' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Statut</label>
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="selectedEmployee.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ selectedEmployee.is_active ? 'Actif' : 'Inactif' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Informations sur les congés -->
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Congés et soldes
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-2xl font-bold text-blue-600">{{ selectedEmployee.solde_conges || 0 }}</p>
              <p class="text-sm text-gray-600">Solde congés total</p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-2xl font-bold text-green-600">{{ selectedEmployee.solde_conges_restant || 0 }}</p>
              <p class="text-sm text-gray-600">Solde restant</p>
            </div>
            <div class="text-center p-4 bg-orange-50 rounded-lg">
              <p class="text-2xl font-bold text-orange-600">{{ (selectedEmployee.solde_conges || 0) - (selectedEmployee.solde_conges_restant || 0) }}</p>
              <p class="text-sm text-gray-600">Jours utilisés</p>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500">
            Dernière mise à jour : {{ new Date().toLocaleDateString('fr-FR') }}
          </div>
          <div class="space-x-3">
            <button
              @click="openHistoriqueModal(selectedEmployee)"
              type="button"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Historique
            </button>
            <button
              @click="closeDetailsModal"
              type="button"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Fermer
            </button>
          </div>
        </div>
      </template>
    </BaseModal>

    <!-- Modal Historique des demandes -->
    <BaseModal 
      v-model="showHistoriqueModal" 
      title="Historique des demandes"
      :close-on-overlay="true"
      size="large"
    >
      <div v-if="selectedEmployee" class="space-y-6">
        <!-- En-tête -->
        <div class="text-center bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
          <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
            {{ selectedEmployee.prenom?.charAt(0) }}{{ selectedEmployee.nom?.charAt(0) }}
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">
            Historique de {{ selectedEmployee.prenom }} {{ selectedEmployee.nom }}
          </h2>
          <p class="text-gray-600">{{ historiqueEmploye.length }} demande{{ historiqueEmploye.length > 1 ? 's' : '' }}</p>
        </div>

        <!-- Chargement -->
        <div v-if="loadingHistorique" class="flex justify-center items-center py-12">
          <div class="flex items-center space-x-2">
            <svg class="animate-spin h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-600">Chargement de l'historique...</span>
          </div>
        </div>

        <!-- Liste des demandes -->
        <div v-else-if="historiqueEmploye.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune demande trouvée</h3>
          <p class="text-gray-600">Cet employé n'a pas encore fait de demande de congé.</p>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="demande in historiqueEmploye" 
            :key="demande.id"
            class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-3">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="getDemandeStatusColor(demande.status)">
                    {{ getDemandeStatusLabel(demande.status) }}
                  </span>
                  <span class="text-sm text-gray-500">
                    {{ getTypeCongeLabel(demande.type_conge) }}
                  </span>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Période</label>
                    <p class="text-sm text-gray-900">
                      Du {{ new Date(demande.date_debut).toLocaleDateString('fr-FR') }}
                      au {{ new Date(demande.date_fin).toLocaleDateString('fr-FR') }}
                    </p>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Durée</label>
                    <p class="text-sm text-gray-900">{{ demande.working_time || 0 }} jour{{ demande.working_time > 1 ? 's' : '' }}</p>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Date de demande</label>
                    <p class="text-sm text-gray-900">{{ new Date(demande.date_creation).toLocaleDateString('fr-FR') }}</p>
                  </div>
                </div>

                <div v-if="demande.motif" class="mb-4">
                  <label class="block text-xs font-medium text-gray-500 mb-1">Motif</label>
                  <p class="text-sm text-gray-900">{{ demande.motif }}</p>
                </div>

                <div v-if="demande.commentaire_approbateur" class="bg-gray-50 rounded-lg p-3">
                  <label class="block text-xs font-medium text-gray-500 mb-1">Commentaire</label>
                  <p class="text-sm text-gray-900">{{ demande.commentaire_approbateur }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500">
            Total : {{ historiqueEmploye.length }} demande{{ historiqueEmploye.length > 1 ? 's' : '' }}
          </div>
          <button
            @click="closeHistoriqueModal"
            type="button"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Fermer
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template> 