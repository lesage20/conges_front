<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import ActionButton from '@/components/ActionButton.vue'
import { useDemandesConges } from '@/composables/useDemandesConges'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const { 
  loading, 
  error,
  getDemandes, 
  getDemandesByUser,
  createDemande,
  updateDemande, 
  approuverDemande, 
  refuserDemande,
  canCreateNewDemande 
} = useDemandesConges()

const authStore = useAuthStore()
const { user } = authStore
const toast = useToast()

const showModal = ref(false)
const selectedFilter = ref('all')
const selectedStatus = ref('all')
const dateDebutFilter = ref('')
const dateFinFilter = ref('')
const demandes = ref([])
const isSubmitting = ref(false)
const canCreateNew = ref(true)
const existingDemande = ref(null)
const creationBlockReason = ref('')
const showFilters = ref(false)

const formData = ref({
  type: 'conges_payes',
  duree: '',
  dateDebut: '',
  dateFin: '',
  motif: ''
})

// Statuts disponibles
const statutsConge = [
  { key: 'all', label: 'Tous les statuts' },
  { key: 'en_attente', label: 'En attente' },
  { key: 'approuvee', label: 'Approuvées' },
  { key: 'refusee', label: 'Refusées' },
  { key: 'annulee', label: 'Annulées' },
  { key: 'demande_annulation', label: 'Demande d\'annulation' }
]

// Computed properties
const filteredDemandes = computed(() => {
  let filtered = demandes.value

  // Filtrer par statut
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(d => d.statut === selectedStatus.value)
  }



  // Filtrer par date de début
  if (dateDebutFilter.value) {
    filtered = filtered.filter(d => {
      const demandeDate = new Date(d.date_debut)
      const filterDate = new Date(dateDebutFilter.value)
      return demandeDate >= filterDate
    })
  }

  // Filtrer par date de fin
  if (dateFinFilter.value) {
    filtered = filtered.filter(d => {
      const demandeDate = new Date(d.date_fin)
      const filterDate = new Date(dateFinFilter.value)
      return demandeDate <= filterDate
    })
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

const isFormValid = computed(() => {
  return formData.value.type && formData.value.dateDebut && formData.value.dateFin
})

// Titre et description dynamiques selon le rôle
const pageTitle = computed(() => {
  if (!user.value) return 'Demandes de congés'
  
  switch (user.value.role) {
    case 'employe':
      return 'Mes demandes de congés'
    case 'chef_service':
      return 'Demandes de congés - Mon équipe'
    case 'drh':
      return 'Demandes de congés - Toutes les demandes'
    default:
      return 'Demandes de congés'
  }
})

const pageDescription = computed(() => {
  if (!user.value) return 'Gérez les demandes de congés'
  
  switch (user.value.role) {
    case 'employe':
      return 'Gérez vos demandes de congés payés'
    case 'chef_service':
      return 'Gérez les demandes de congés de votre équipe'
    case 'drh':
      return 'Supervision de toutes les demandes de congés'
    default:
      return 'Gérez les demandes de congés'
  }
})

// Methods
const loadDemandes = async () => {
  try {
    // Utiliser la route principale qui gère automatiquement les permissions selon le rôle
    const response = await getDemandes()
    demandes.value = response || []
  } catch (err) {
    console.error('Erreur lors du chargement des demandes:', err)
    demandes.value = []
    toast.error('Erreur lors du chargement des demandes')
  }
}

const checkCanCreateNew = async () => {
  try {
    const response = await canCreateNewDemande()
    canCreateNew.value = response.can_create
    existingDemande.value = response.existing_demande
    creationBlockReason.value = response.reason
  } catch (err) {
    console.error('Erreur lors de la vérification de création:', err)
    // En cas d'erreur, autoriser la création par défaut
    canCreateNew.value = true
  }
}

const getStatusColor = (statut) => {
  switch (statut) {
    case 'en_attente': return 'bg-orange-100 text-orange-800'
    case 'approuvee': return 'bg-green-100 text-green-800'
    case 'refusee': return 'bg-red-100 text-red-800'
    case 'annulee': return 'bg-gray-100 text-gray-800'
    case 'demande_annulation': return 'bg-yellow-100 text-yellow-800'
    case 'annulation_refusee': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (statut) => {
  switch (statut) {
    case 'en_attente': return 'En attente'
    case 'approuvee': return 'Approuvée'
    case 'refusee': return 'Refusée'
    case 'annulee': return 'Annulée'
    case 'demande_annulation': return 'Demande d\'annulation'
    case 'annulation_refusee': return 'Annulation refusée'
    default: return statut
  }
}




const hasActiveFilters = computed(() => {
  return selectedStatus.value !== 'all' || 
         dateDebutFilter.value || 
         dateFinFilter.value
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const formatDateFr = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}



// Gérer les actions complétées depuis ActionButton
const handleActionCompleted = async ({ action, result, redirect }) => {
  console.log(`Action ${action} complétée:`, result)
  
  // Si c'est une redirection (modifier, détails)
  if (redirect) {
    // TODO: Implémenter la navigation
    console.log('Naviguer vers:', redirect)
    return
  }
  
  // Pour les autres actions, recharger les demandes
  await loadDemandes()
  
  // Afficher un message de succès selon l'action
  const successMessages = {
    'approuver': 'Demande approuvée avec succès',
    'refuser': 'Demande refusée avec succès', 
    'demander_annulation': 'Demande d\'annulation envoyée avec succès',
    'approuver_annulation': 'Annulation approuvée avec succès',
    'refuser_annulation': 'Annulation refusée avec succès',
          'annuler': 'Demande supprimée avec succès',
    'generer_attestation': 'Attestation générée et téléchargée avec succès'
  }
  
  const message = successMessages[action] || 'Action effectuée avec succès'
  toast.success(message)
}

// Gérer les erreurs depuis ActionButton
const handleActionError = ({ action, error }) => {
  console.error(`Erreur lors de l'action ${action}:`, error)
  
  // Messages d'erreur personnalisés selon l'action
  const errorMessages = {
    'approuver': 'Erreur lors de l\'approbation de la demande',
    'refuser': 'Erreur lors du refus de la demande',
    'demander_annulation': 'Erreur lors de la demande d\'annulation',
    'approuver_annulation': 'Erreur lors de l\'approbation de l\'annulation',
    'refuser_annulation': 'Erreur lors du refus de l\'annulation',
    'annuler': 'Erreur lors de la suppression de la demande',
    'generer_attestation': 'Erreur lors de la génération de l\'attestation'
  }
  
  const message = errorMessages[action] || 'Erreur lors de l\'action'
  
  // Afficher le message d'erreur détaillé si disponible
  if (error.message) {
    toast.error(`${message}: ${error.message}`)
  } else {
    toast.error(message)
  }
}

const resetForm = () => {
  formData.value = {
    type: 'conges_payes',
    duree: '',
    dateDebut: '',
    dateFin: '',
    motif: ''
  }
}

const modifierDemandeExistante = () => {
  if (!existingDemande.value) return
  
  // Pré-remplir le formulaire avec les données de la demande existante
  formData.value = {
    type: existingDemande.value.type_conge || 'conges_payes',
    dateDebut: existingDemande.value.date_debut,
    dateFin: existingDemande.value.date_fin,
    motif: existingDemande.value.motif || ''
  }
  
  // Ouvrir le modal en mode modification
  showModal.value = true
}

const submitDemande = async () => {
  if (!isFormValid.value || isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    // Mapper les données du formulaire vers le format API
    const demandeData = {
      type_conge: formData.value.type,
      date_debut: formData.value.dateDebut,
      date_fin: formData.value.dateFin,
      motif: formData.value.motif || 'Demande de congé'
    }
    
    // Si on modifie une demande existante
    if (existingDemande.value && !canCreateNew.value) {
      await updateDemande(existingDemande.value.id, demandeData)
      toast.success('Demande de congé modifiée avec succès')
      // Vérifier à nouveau si on peut créer une nouvelle demande
      await checkCanCreateNew()
    } else {
      // Créer une nouvelle demande
      await createDemande(demandeData)
      toast.success('Demande de congé créée avec succès')
      // Vérifier si on peut encore créer des demandes
      await checkCanCreateNew()
    }
    
    // Recharger les demandes pour voir les changements
    await loadDemandes()
    
    // Fermer le modal et réinitialiser le formulaire
    showModal.value = false
    resetForm()
    
  } catch (err) {
    console.error('Erreur lors de la soumission de la demande:', err)
    
    // Afficher un message d'erreur détaillé
    let errorMessage = existingDemande.value && !canCreateNew.value 
      ? 'Erreur lors de la modification de la demande'
      : 'Erreur lors de la création de la demande'
    if (err.message) {
      errorMessage += `: ${err.message}`
    }
    toast.error(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

// Charger les données au montage du composant
onMounted(() => {
  loadDemandes()
  checkCanCreateNew()
})
</script>

<template>
  <div v-if="authStore.isAuthenticated && user" class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
          <p class="text-gray-600 mt-2">{{ pageDescription }}</p>
        </div>
        <!-- Bouton pour nouvelle demande ou modifier l'existante -->
        <div v-if="!canCreateNew && existingDemande" class="flex flex-col items-end">
          <button 
            @click="modifierDemandeExistante"
            class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center mb-2"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Modifier ma demande en cours
          </button>
          <p class="text-sm text-gray-600 text-right">{{ creationBlockReason }}</p>
        </div>
        
        <button 
          v-else
          @click="showModal = true"
          :disabled="!canCreateNew"
          :class="[
            'px-4 py-2 rounded-lg transition-colors flex items-center',
            canCreateNew 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          ]"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          {{ canCreateNew ? 'Nouvelle demande' : 'Demande en cours' }}
        </button>
      </div>
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
      <div class="space-y-6">
        <!-- Header avec bouton toggle et réinitialisation -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <button 
              @click="showFilters = !showFilters"
              class="flex items-center text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              <svg 
                :class="['w-5 h-5 mr-2 transition-transform', showFilters ? 'rotate-90' : '']" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
              Filtres
              <span v-if="hasActiveFilters && !showFilters" class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ filteredDemandes.length }}/{{ demandes.length }}
              </span>
            </button>
          </div>
          <div class="flex items-center space-x-3">
            <button 
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Effacer les filtres
            </button>
            <button 
              @click="showFilters = !showFilters"
              class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {{ showFilters ? 'Masquer' : 'Afficher' }}
            </button>
          </div>
        </div>

        <!-- Contenu des filtres (masquable) -->
        <div v-show="showFilters" class="space-y-6">
          <!-- Filtres par statut -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Filtrer par statut:</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="statut in statutsConge"
                :key="statut.key"
                @click="selectedStatus = statut.key"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  selectedStatus === statut.key
                    ? 'bg-blue-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ statut.label }}
              </button>
            </div>
          </div>

          <!-- Filtres par date -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date de début (à partir de):</label>
              <input
                v-model="dateDebutFilter"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date de fin (jusqu'à):</label>
              <input
                v-model="dateFinFilter"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Résumé des filtres actifs -->
          <div v-if="hasActiveFilters" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div class="flex items-center">
              <svg class="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.586V4z"></path>
              </svg>
              <span class="text-sm font-medium text-blue-800">
                {{ filteredDemandes.length }} demande(s) trouvée(s) sur {{ demandes.length }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

         <!-- Demandes list -->
     <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
       <div class="px-6 py-4 border-b border-gray-200">
         <div class="flex items-center justify-between">
           <div>
             <h3 class="text-lg font-semibold text-gray-900">
               Liste des demandes 
               <span class="text-sm font-normal text-gray-600">({{ filteredDemandes.length }})</span>
             </h3>
             <p class="text-xs text-gray-500 mt-1">
               💡 Demandes en attente : peuvent être <strong>supprimées</strong> définitivement • 
               Demandes approuvées : peuvent faire l'objet d'une <strong>demande d'annulation</strong>
             </p>
           </div>
           <div v-if="loading" class="flex items-center text-blue-600">
             <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
               <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             <span class="text-sm">Chargement...</span>
           </div>
         </div>
       </div>
             
       <!-- Message d'erreur -->
       <div v-if="error && !loading" class="px-6 py-4 bg-red-50 border-l-4 border-red-400">
         <div class="flex">
           <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
           </svg>
           <div class="ml-3">
             <p class="text-sm text-red-700">
               Erreur lors du chargement des demandes : {{ error }}
             </p>
             <button 
               @click="loadDemandes"
               class="mt-2 text-sm text-red-600 underline hover:text-red-800"
             >
               Réessayer
             </button>
           </div>
         </div>
       </div>

       <!-- Message si aucune demande -->
       <div v-if="!loading && !error && filteredDemandes.length === 0" class="px-6 py-8 text-center text-gray-500">
         <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
         </svg>
         <p class="mt-2">Aucune demande de congé trouvée</p>
         <p class="text-sm text-gray-400">Cliquez sur "Nouvelle demande" pour créer votre première demande</p>
       </div>
       
       <div v-if="!loading && !error && filteredDemandes.length > 0" class="overflow-x-auto">
         <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jours compté</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jours total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
                     <tbody class="bg-white divide-y divide-gray-200">
             <tr v-for="demande in filteredDemandes" :key="demande.id" class="hover:bg-gray-50">
               <td class="px-6 py-4 whitespace-nowrap">
                 <div>
                   <div class="text-sm font-medium text-gray-900">{{ demande.user?.nom || 'Utilisateur' }} {{ demande.user?.prenom || '' }}</div>
                   <div class="text-sm text-gray-500">{{ demande.user?.departement || 'Non assigné' }}</div>
                 </div>
               </td>
               <td class="px-6 py-4 whitespace-nowrap">
                 <div class="text-sm text-gray-900">
                   {{ formatDate(demande.date_debut) }} - {{ formatDate(demande.date_fin) }}
                 </div>
                 <div class="text-sm text-gray-500">
                   {{ demande.motif || 'Demandé le ' + formatDate(demande.date_creation) }}
                 </div>
               </td>
               <td class="px-6 py-4 whitespace-nowrap">
                 <span class="text-sm font-medium text-gray-900">{{ demande.working_time  }} </span>
               </td>
               <td class="px-6 py-4 whitespace-nowrap">
                 <span class="text-sm font-medium text-gray-900">{{ demande.real_time  }} </span>
               </td>
               <td class="px-6 py-4 whitespace-nowrap">
                 <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full', getStatusColor(demande.statut)]">
                   {{ getStatusLabel(demande.statut) }}
                 </span>
               </td>
               <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                 <ActionButton 
                   :actions="demande.actions || []"
                   :demande="demande"
                   @action-completed="handleActionCompleted"
                   @action-error="handleActionError"
                 />
               </td>
                          </tr>
           </tbody>
         </table>
        </div>
     </div>

     <!-- Modal de nouvelle demande ou modification -->
     <BaseModal 
       v-model="showModal" 
       :title="existingDemande && !canCreateNew ? 'Modifier ma demande de congé' : 'Nouvelle demande de congé'"
       @close="resetForm"
     >
       <form @submit.prevent="submitDemande" class="space-y-6">
         <!-- Type de congé -->
         <div v-show="false">
           <label class="block text-sm font-medium text-gray-700 mb-2">
             Type de congé *
           </label>
           <select 
            disabled
             v-model="formData.type" 
             required
             class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           >
             <option value="conges_payes">Congés payés</option>
             <option value="rtt">RTT</option>
             <option value="conges_maladie">Congés maladie</option>
             <option value="conges_maternite">Congés maternité</option>
             <option value="conges_paternite">Congés paternité</option>
             <option value="conges_sans_solde">Congés sans solde</option>
             <option value="autre">Autre</option>
           </select>
         </div>

         
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <!-- Date de début -->
           <div>
             <label class="block text-sm font-medium text-gray-700 mb-2">
               Date de début *
             </label>
             <input 
               v-model="formData.dateDebut" 
               type="date" 
               required
               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
             />
           </div>

           <!-- Date de fin -->
           <div>
             <label class="block text-sm font-medium text-gray-700 mb-2">
               Date de fin *
             </label>
             <input 
               v-model="formData.dateFin" 
               type="date" 
               required
               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
             />
           </div>
         </div>

         <!-- Motif -->
         <div>
           <label class="block text-sm font-medium text-gray-700 mb-2">
             Motif (optionnel)
           </label>
           <textarea 
             v-model="formData.motif" 
             rows="4" 
             placeholder="Précisez le motif de votre demande..."
             class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
           ></textarea>
         </div>

         <!-- Récapitulatif simplifié -->
         <div v-if="formData.dateDebut && formData.dateFin" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
           <div class="flex">
             <svg class="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
             </svg>
             <div class="ml-3">
               <h3 class="text-sm font-medium text-blue-800">Récapitulatif de votre demande</h3>
               <div class="mt-2 text-sm text-blue-700">
                 <p v-if="formData.dateDebut && formData.dateFin">
                   Du {{ formatDateFr(formData.dateDebut) }} au {{ formatDateFr(formData.dateFin) }}
                 </p>
                 <p v-else-if="formData.dateDebut">
                   Le {{ formatDateFr(formData.dateDebut) }}
                 </p>
                 <p v-if="formData.duree === 'half_day_morning'">Demi-journée matin</p>
                 <p v-else-if="formData.duree === 'half_day_afternoon'">Demi-journée après-midi</p>
                 <p class="text-xs mt-1 text-blue-600">Le nombre de jours sera calculé automatiquement</p>
               </div>
             </div>
           </div>
         </div>
       </form>

       <template #footer>
         <button 
           type="button" 
           @click="showModal = false"
           class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
         >
           Annuler
         </button>
         <button 
           @click="submitDemande"
           :disabled="!isFormValid || isSubmitting"
           class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
         >
           <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
             <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
             <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
           {{ isSubmitting 
             ? (existingDemande && !canCreateNew ? 'Modification...' : 'Création...') 
             : (existingDemande && !canCreateNew ? 'Modifier la demande' : 'Soumettre la demande') 
           }}
         </button>
       </template>
     </BaseModal>
   </div>
   
   <!-- Message de chargement pendant la déconnexion -->
   <div v-else-if="!authStore.isAuthenticated" class="flex items-center justify-center min-h-screen">
     <div class="text-center">
       <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
       <p class="mt-4 text-gray-600">Redirection en cours...</p>
     </div>
   </div>
 </template>

<style scoped>
/* Styles spécifiques si nécessaire */
</style> 