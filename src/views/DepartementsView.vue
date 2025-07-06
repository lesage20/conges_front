<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Gestion des départements</h1>
          <p class="text-gray-600 mt-2">Vue d'ensemble par service</p>
        </div>
        <button 
          @click="showModal = true" 
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Nouveau département
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">Chargement des départements...</span>
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
        @click="loadDepartements" 
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Réessayer
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!departements.length" class="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun département</h3>
      <p class="text-gray-600 mb-4">Commencez par créer votre premier département.</p>
      <button 
        @click="showModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Créer un département
      </button>
    </div>

    <!-- Grille des départements -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="dept in departements" 
        :key="dept.id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ dept.nom }}</h3>
          <div class="flex space-x-2">
            <button 
              @click="editDepartement(dept)"
              class="text-gray-400 hover:text-gray-600"
              :disabled="isSubmitting"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button 
              @click="confirmDelete(dept)"
              class="text-gray-400 hover:text-red-600"
              :disabled="isSubmitting"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="space-y-3">
          <div v-if="dept.chef_nom" class="flex items-center">
            <span class="text-sm text-gray-600">Chef:</span>
            <span class="ml-2 text-sm font-medium text-gray-900">{{ dept.chef_nom }}</span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Employés totaux:</span>
            <span class="text-sm font-medium text-gray-900">{{ dept.nb_employes || 0 }}</span>
          </div>
          
          <div v-if="dept.nb_employes > 0" class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Présents:</span>
            <span class="text-sm font-medium text-green-600">{{ dept.nb_employes_presents || 0 }}</span>
          </div>
          
          <div v-if="dept.nb_employes > 0" class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Absents:</span>
            <span class="text-sm font-medium text-red-600">{{ (dept.nb_employes || 0) - (dept.nb_employes_presents || 0) }}</span>
          </div>
          
          <div v-if="dept.nb_employes > 0" class="mt-4">
            <div class="flex justify-between text-xs text-gray-600 mb-1">
              <span>Taux de présence</span>
              <span>{{ Math.round(((dept.nb_employes_presents || 0) / dept.nb_employes) * 100) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-green-600 h-2 rounded-full"
                :style="{ width: ((dept.nb_employes_presents || 0) / dept.nb_employes) * 100 + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200 space-y-2">
          <button 
            @click="showAssignChefModal(dept)"
            class="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium py-2"
          >
            {{ dept.chef_nom ? 'Changer le chef' : 'Assigner un chef' }} 👤
          </button>
          <button 
            @click="viewDetails(dept)"
            class="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2"
          >
            Voir les détails →
          </button>
        </div>
      </div>
    </div>

    <!-- Modal pour nouveau/édition département -->
    <BaseModal v-model="showModal" title="Département" close-on-overlay>
      <template #header>
        <h3 class="text-lg font-medium text-gray-900">
          {{ editingDept ? 'Modifier le département' : 'Nouveau département' }}
        </h3>
      </template>

      <form @submit.prevent="submitDepartement" class="space-y-4">
        <div>
          <label for="nom" class="block text-sm font-medium text-gray-700 mb-1">
            Nom du département *
          </label>
          <input
            id="nom"
            v-model="formData.nom"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: IT, Marketing, RH..."
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description du département (optionnel)"
          ></textarea>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="showModal = false"
            type="button"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            :disabled="isSubmitting"
          >
            Annuler
          </button>
          <button
            @click="submitDepartement"
            type="button"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            :disabled="isSubmitting || !formData.nom.trim()"
          >
            <span v-if="isSubmitting" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {{ editingDept ? 'Modification...' : 'Création...' }}
            </span>
            <span v-else>
              {{ editingDept ? 'Modifier' : 'Créer' }}
            </span>
          </button>
        </div>
      </template>
    </BaseModal>

    <!-- Modal pour assigner un chef -->
    <BaseModal v-model="showAssignChefModalValue" title="Assigner un chef" close-on-overlay>
      <template #header>
        <h3 class="text-lg font-medium text-gray-900">
          Assigner un chef au département "{{ selectedDepartement?.nom }}"
        </h3>
      </template>

      <div class="space-y-4">
        <div v-if="loadingManagers" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Chargement des utilisateurs...</span>
        </div>

        <div v-else-if="!availableManagers.length" class="text-center py-8 text-gray-500">
          Aucun utilisateur disponible pour être chef de département
        </div>

        <div v-else class="space-y-4">
          <!-- Bouton pour s'auto-assigner -->
          <div class="border-b border-gray-200 pb-4">
            <button
              @click="assignSelfAsChef"
              :disabled="isAssigningChef"
              class="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Je suis le chef de ce département
            </button>
          </div>

          <!-- Liste des autres utilisateurs -->
          <div class="max-h-64 overflow-y-auto">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ou sélectionner un autre utilisateur
            </label>
            <div class="space-y-2">
              <div
                v-for="manager in availableManagers"
                :key="manager.id"
                class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                :class="{ 
                  'border-blue-500 bg-blue-50': selectedChef?.id === manager.id,
                  'border-gray-200': selectedChef?.id !== manager.id
                }"
                @click="selectedChef = manager"
              >
                <input
                  type="radio"
                  :id="'manager-' + manager.id"
                  :checked="selectedChef?.id === manager.id"
                  class="mr-3 text-blue-600"
                />
                <div class="flex-1">
                  <div class="font-medium text-gray-900">
                    {{ manager.nom }} {{ manager.prenom }}
                  </div>
                  <div class="text-sm text-gray-600">{{ manager.email }}</div>
                  <div class="text-xs text-gray-500">{{ manager.role === 'chef_service' ? 'Chef de service' : manager.role === 'drh' ? 'DRH' : 'Employé' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="showAssignChefModalValue = false"
            type="button"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            :disabled="isAssigningChef"
          >
            Annuler
          </button>
          <button
            @click="assignChef"
            type="button"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            :disabled="isAssigningChef || !selectedChef"
          >
            <span v-if="isAssigningChef" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Assignation...
            </span>
            <span v-else>
              Assigner
            </span>
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import { useDepartements } from '@/composables/useDepartements'
import { useUsers } from '@/composables/useUsers'

// Composables
const { 
  getDepartements, 
  createDepartement, 
  updateDepartement, 
  deleteDepartement,
  assignChefDepartement,
  getDepartementStats,
  loading, 
  error 
} = useDepartements()

const { getUsersByDepartement, getManagers, getUsers, getCurrentUser } = useUsers()

// Données réactives
const showModal = ref(false)
const editingDept = ref(null)
const isSubmitting = ref(false)
const departements = ref([])
const isLoading = ref(false)

// Données pour l'assignation de chef
const showAssignChefModalValue = ref(false)
const selectedDepartement = ref(null)
const selectedChef = ref(null)
const availableManagers = ref([])
const loadingManagers = ref(false)
const isAssigningChef = ref(false)

const formData = ref({
  nom: '',
  description: ''
})

// Méthodes
const resetForm = () => {
  formData.value = {
    nom: '',
    description: ''
  }
}

const loadDepartements = async () => {
  isLoading.value = true
  try {
    const response = await getDepartements()
    if (response) {
      // Enrichir chaque département avec ses statistiques
      const departementsWithStats = await Promise.all(
        response.map(async (dept) => {
          try {
            const [stats, employes] = await Promise.all([
              getDepartementStats(dept.id),
              getUsersByDepartement(dept.id)
            ])
            
            // Trouver le chef du département
            let chef_nom = null
            if (dept.chef_departement_id && employes) {
              const chef = employes.find(emp => emp.id === dept.chef_departement_id)
              if (chef) {
                chef_nom = `${chef.nom} ${chef.prenom}`
              }
            }
            
            return {
              ...dept,
              nb_employes: employes?.length || 0,
              nb_employes_presents: employes?.filter(emp => emp.is_active)?.length || 0,
              chef_nom,
              ...stats
            }
          } catch (err) {
            console.warn(`Erreur lors du chargement des stats pour ${dept.nom}:`, err)
            return {
              ...dept,
              nb_employes: 0,
              nb_employes_presents: 0,
              chef_nom: null
            }
          }
        })
      )
      departements.value = departementsWithStats
    } else {
      departements.value = []
    }
  } catch (err) {
    console.error('Erreur lors du chargement des départements:', err)
    departements.value = []
  } finally {
    isLoading.value = false
  }
}

const editDepartement = (dept) => {
  editingDept.value = dept
  formData.value = {
    nom: dept.nom,
    description: dept.description || ''
  }
  showModal.value = true
}

const confirmDelete = async (dept) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le département "${dept.nom}" ?`)) {
    try {
      await deleteDepartement(dept.id)
      await loadDepartements()
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
    }
  }
}

const viewDetails = (dept) => {
  // Navigation vers une page de détails ou ouverture d'un modal
  console.log('Voir détails département:', dept)
}

const submitDepartement = async () => {
  if (!formData.value.nom.trim() || isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    const departementData = {
      nom: formData.value.nom.trim(),
      description: formData.value.description?.trim() || null
    }
    
    if (editingDept.value) {
      // Modification
      await updateDepartement(editingDept.value.id, departementData)
    } else {
      // Création
      await createDepartement(departementData)
    }
    
    // Recharger la liste des départements
    await loadDepartements()
    
    // Fermer le modal et réinitialiser le formulaire
    showModal.value = false
    editingDept.value = null
    resetForm()
    
  } catch (err) {
    console.error('Erreur lors de la soumission:', err)
  } finally {
    isSubmitting.value = false
  }
}

const showAssignChefModal = (dept) => {
  selectedDepartement.value = dept
  showAssignChefModalValue.value = true
  loadManagers()
}

const loadManagers = async () => {
  loadingManagers.value = true
  try {
    const [usersResponse, currentUserResponse] = await Promise.all([
      getUsers(),
      getCurrentUser()
    ])
    
    if (usersResponse) {
      // Filtrer pour ne garder que les utilisateurs pouvant être chef de département
      // et exclure l'utilisateur connecté (qui aura son propre bouton)
      let managers = usersResponse.filter(user => 
        (user.role === 'chef_service' || user.role === 'drh' || user.role === 'employe') &&
        user.id !== currentUserResponse?.id
      )
      
      availableManagers.value = managers
    } else {
      availableManagers.value = []
    }
  } catch (err) {
    console.error('Erreur lors du chargement des managers:', err)
    availableManagers.value = []
  } finally {
    loadingManagers.value = false
  }
}

const assignChef = async () => {
  if (!selectedChef.value || !selectedDepartement.value) return
  
  isAssigningChef.value = true
  
  try {
    await assignChefDepartement(selectedDepartement.value.id, selectedChef.value.id)
    await loadDepartements()
    showAssignChefModalValue.value = false
    selectedDepartement.value = null
    selectedChef.value = null
  } catch (err) {
    console.error('Erreur lors de l\'assignation du chef:', err)
  } finally {
    isAssigningChef.value = false
  }
}

const assignSelfAsChef = async () => {
  if (!selectedDepartement.value) return
  
  isAssigningChef.value = true
  
  try {
    const currentUser = await getCurrentUser()
    if (currentUser) {
      await assignChefDepartement(selectedDepartement.value.id, currentUser.id)
      await loadDepartements()
      showAssignChefModalValue.value = false
      selectedDepartement.value = null
      selectedChef.value = null
    }
  } catch (err) {
    console.error('Erreur lors de l\'auto-assignation:', err)
  } finally {
    isAssigningChef.value = false
  }
}

// Charger les données au montage du composant
onMounted(() => {
  loadDepartements()
})
</script> 