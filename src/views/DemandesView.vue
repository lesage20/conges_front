<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import { useDemandesConges } from '@/composables/useDemandesConges'
import { useAuthStore } from '@/stores/auth'

const { 
  loading, 
  error,
  getDemandes, 
  getDemandesByUser,
  createDemande, 
  approuverDemande, 
  refuserDemande 
} = useDemandesConges()

const { user } = useAuthStore()

const showModal = ref(false)
const selectedFilter = ref('all')
const selectedStatus = ref('all')
const demandes = ref([])
const isSubmitting = ref(false)

const formData = ref({
  type: 'conges_payes',
  duree: '',
  dateDebut: '',
  dateFin: '',
  motif: ''
})

// Computed properties
const filteredDemandes = computed(() => {
  let filtered = demandes.value

  if (selectedStatus.value !== 'all') {
    // Adapter les statuts selon l'API backend
    const statusMap = {
      'En attente': 'en_attente',
      'Approuvée': 'approuve',
      'Refusée': 'refuse'
    }
    const apiStatus = statusMap[selectedStatus.value]
    filtered = filtered.filter(d => d.statut === apiStatus)
  }

  return filtered
})

const pendingCount = computed(() => {
  return demandes.value.filter(d => d.statut === 'en_attente').length
})

const approvedCount = computed(() => {
  return demandes.value.filter(d => d.statut === 'approuve').length
})

const rejectedCount = computed(() => {
  return demandes.value.filter(d => d.statut === 'refuse').length
})

const isFormValid = computed(() => {
  return formData.value.type && formData.value.dateDebut && formData.value.dateFin
})

// Methods
const loadDemandes = async () => {
  try {
    // Récupérer les demandes de l'utilisateur connecté
    if (user.value) {
      const response = await getDemandesByUser(user.value.id)
      demandes.value = response || []
    } else {
      // Si pas d'utilisateur connecté, récupérer toutes les demandes (pour DRH)
      const response = await getDemandes()
      demandes.value = response || []
    }
  } catch (err) {
    console.error('Erreur lors du chargement des demandes:', err)
    demandes.value = []
  }
}

const getStatusColor = (statut) => {
  switch (statut) {
    case 'en_attente': return 'bg-orange-100 text-orange-800'
    case 'approuve': return 'bg-green-100 text-green-800'
    case 'refuse': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (statut) => {
  switch (statut) {
    case 'en_attente': return 'En attente'
    case 'approuve': return 'Approuvée'
    case 'refuse': return 'Refusée'
    default: return statut
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

const formatDateFr = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const approveDemande = async (demande) => {
  try {
    await approuverDemande(demande.id)
    // Recharger les demandes après approbation
    await loadDemandes()
  } catch (err) {
    console.error('Erreur lors de l\'approbation:', err)
  }
}

const rejectDemande = async (demande) => {
  try {
    await refuserDemande(demande.id)
    // Recharger les demandes après refus
    await loadDemandes()
  } catch (err) {
    console.error('Erreur lors du refus:', err)
  }
}

const viewDetails = (demande) => {
  // Ouvrir un modal ou naviguer vers une page de détails
  console.log('Voir détails:', demande)
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
    
    await createDemande(demandeData)
    
    // Recharger les demandes pour voir la nouvelle
    await loadDemandes()
    
    // Fermer le modal et réinitialiser le formulaire
    showModal.value = false
    resetForm()
    
    console.log('Demande créée avec succès')
    
  } catch (err) {
    console.error('Erreur lors de la création de la demande:', err)
    // TODO: Afficher une notification d'erreur
  } finally {
    isSubmitting.value = false
  }
}

// Charger les données au montage du composant
onMounted(() => {
  loadDemandes()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Mes demandes de congés</h1>
          <p class="text-gray-600 mt-2">Gérez vos demandes de congés payés</p>
        </div>
        <button 
          @click="showModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Nouvelle demande
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
        
        <!-- <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Exporter
        </button> -->
      </div>
    </div>

         <!-- Demandes list -->
     <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
       <div class="px-6 py-4 border-b border-gray-200">
         <div class="flex items-center justify-between">
           <h3 class="text-lg font-semibold text-gray-900">
             Liste des demandes 
             <span class="text-sm font-normal text-gray-600">({{ filteredDemandes.length }})</span>
           </h3>
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
                     <tbody class="bg-white divide-y divide-gray-200">
             <tr v-for="demande in filteredDemandes" :key="demande.id" class="hover:bg-gray-50">
               <td class="px-6 py-4 whitespace-nowrap">
                 <div>
                   <div class="text-sm font-medium text-gray-900">{{ demande.user?.nom || 'Utilisateur' }} {{ demande.user?.prenom || '' }}</div>
                   <div class="text-sm text-gray-500">{{ demande.user?.departement?.nom || 'Non assigné' }}</div>
                 </div>
               </td>
               <td class="px-6 py-4 whitespace-nowrap">
                 <div class="text-sm text-gray-900">Congés payés</div>
                 <div class="text-sm text-gray-500">{{ demande.motif || 'Aucun motif' }}</div>
               </td>
               <td class="px-6 py-4 whitespace-nowrap">
                 <div class="text-sm text-gray-900">
                   {{ formatDate(demande.date_debut) }} - {{ formatDate(demande.date_fin) }}
                 </div>
                 <div class="text-sm text-gray-500">
                   Demandé le {{ formatDate(demande.date_creation) }}
                 </div>
               </td>
               <td class="px-6 py-4 whitespace-nowrap">
                 <span class="text-sm font-medium text-gray-900">{{ demande.nb_jours || 0 }} jour{{ (demande.nb_jours || 0) > 1 ? 's' : '' }}</span>
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
                   :disabled="loading"
                 >
                   Approuver
                 </button>
                 <button 
                   v-if="demande.statut === 'en_attente'"
                   @click="rejectDemande(demande)"
                   class="text-red-600 hover:text-red-900 px-2 py-1 bg-red-50 rounded hover:bg-red-100 transition-colors"
                   :disabled="loading"
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

     <!-- Modal de nouvelle demande -->
     <BaseModal 
       v-model="showModal" 
       title="Nouvelle demande de congé"
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
           {{ isSubmitting ? 'Création...' : 'Soumettre la demande' }}
         </button>
       </template>
     </BaseModal>
   </div>
 </template>

<style scoped>
/* Styles spécifiques si nécessaire */
</style> 