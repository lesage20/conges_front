<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useUsers } from '@/composables/useUsers'
import { useDepartements } from '@/composables/useDepartements'
import { useDemandesConges } from '@/composables/useDemandesConges'
import BaseModal from '@/components/BaseModal.vue'

// Toast notifications
const toast = useToast()

// Composables
const { getUsers, createEmployee, updateUser, deleteUser, loading, error } = useUsers()
const { getDepartements } = useDepartements()
const { getDemandesByUser } = useDemandesConges()

// Données réactives
const searchTerm = ref('')
const selectedDepartment = ref('all')
const employes = ref([])
const departements = ref([])
const isLoading = ref(false)
const showModal = ref(false)
const showDetailsModal = ref(false)
const showHistoriqueModal = ref(false)
const selectedEmployee = ref(null)
const editingEmployee = ref(null)
const isSubmitting = ref(false)
const historiqueEmploye = ref([])
const loadingHistorique = ref(false)

// Formulaire employé
const formData = ref({
  nom: '',
  prenom: '',
  email: '',
  password: '',
  telephone: '',
  numero_piece_identite: '',
  poste: '',
  role: 'employe',
  date_embauche: '',
  departement_id: null,
  is_active: true,
  date_naissance: '',
  nombre_enfants: 0,
  has_medaille_honneur: false,
  genre: ''
})

// Computed
const filteredEmployes = computed(() => {
  let filtered = employes.value

  if (searchTerm.value) {
    filtered = filtered.filter(emp => 
      emp.nom?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      emp.prenom?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  if (selectedDepartment.value !== 'all') {
    filtered = filtered.filter(emp => emp.departement_id === selectedDepartment.value)
  }

  return filtered
})

const isFormValid = computed(() => {
  const required = formData.value.nom && formData.value.prenom && 
                  formData.value.email && formData.value.telephone && 
                  formData.value.numero_piece_identite && formData.value.date_embauche
  
  // Le mot de passe n'est requis que pour la création
  if (!editingEmployee.value) {
    return required && formData.value.password
  }
  
  return required
})

const rolesOptions = [
  { value: 'employe', label: 'Employé' },
  { value: 'chef_service', label: 'Chef de service' },
  { value: 'drh', label: 'DRH' }
]

// Méthodes
const resetForm = () => {
  formData.value = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    numero_piece_identite: '',
    poste: '',
    role: 'employe',
    date_embauche: '',
    departement_id: null,
    is_active: true,
    date_naissance: '',
    nombre_enfants: 0,
    has_medaille_honneur: false,
    genre: ''
  }
}

const openCreateModal = () => {
  editingEmployee.value = null
  resetForm()
  showModal.value = true
}

const openDetailsModal = (employee) => {
  selectedEmployee.value = employee
  showDetailsModal.value = true
}

const openEditModal = (employee) => {
  // Fermer la modal de détails si elle est ouverte
  if (showDetailsModal.value) {
    closeDetailsModal()
  }
  
  editingEmployee.value = employee
  formData.value = {
    nom: employee.nom || '',
    prenom: employee.prenom || '',
    email: employee.email || '',
    password: '', // Ne pas pré-remplir le mot de passe
    telephone: employee.telephone || '',
    numero_piece_identite: employee.numero_piece_identite || '',
    poste: employee.poste || '',
    role: employee.role || 'employe',
    date_embauche: employee.date_embauche || '',
    departement_id: employee.departement_id || null,
    is_active: employee.is_active !== undefined ? employee.is_active : true,
    date_naissance: employee.date_naissance || '',
    nombre_enfants: employee.nombre_enfants || 0,
    has_medaille_honneur: employee.has_medaille_honneur || false,
    genre: employee.genre || ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingEmployee.value = null
  resetForm()
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

const submitEmployee = async () => {
  if (!isFormValid.value || isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    const employeeData = {
      nom: formData.value.nom.trim(),
      prenom: formData.value.prenom.trim(),
      email: formData.value.email.trim(),
      telephone: formData.value.telephone.trim(),
      numero_piece_identite: formData.value.numero_piece_identite.trim(),
      poste: formData.value.poste?.trim() || null,
      role: formData.value.role,
      date_embauche: formData.value.date_embauche,
      departement_id: formData.value.departement_id || null,
      is_active: formData.value.is_active,
      date_naissance: formData.value.date_naissance || null,
      nombre_enfants: parseInt(formData.value.nombre_enfants) || 0,
      has_medaille_honneur: formData.value.has_medaille_honneur,
      genre: formData.value.genre || null
    }
    
    if (editingEmployee.value) {
      // Modification - ne pas inclure le mot de passe s'il est vide
      if (formData.value.password.trim()) {
        employeeData.password = formData.value.password.trim()
      }
      await updateUser(editingEmployee.value.id, employeeData)
    } else {
      // Création - le mot de passe est requis
      employeeData.password = formData.value.password.trim()
              await createEmployee(employeeData)
    }
    
    // Recharger la liste des employés
    await loadEmployes()
    
    // Afficher le toast de succès
    if (editingEmployee.value) {
      toast.success(`Employé "${employeeData.prenom} ${employeeData.nom}" modifié avec succès`)
    } else {
      toast.success(`Employé "${employeeData.prenom} ${employeeData.nom}" créé avec succès`)
    }
    
    // Fermer la modal
    closeModal()
    
  } catch (err) {
    console.error('Erreur lors de la sauvegarde:', err)
    const action = editingEmployee.value ? 'modification' : 'création'
    toast.error(`Erreur lors de la ${action} de l'employé`)
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = async (employee) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer l'employé "${employee.prenom} ${employee.nom}" ?`)) {
    try {
      await deleteUser(employee.id)
      await loadEmployes()
      toast.success(`Employé "${employee.prenom} ${employee.nom}" supprimé avec succès`)
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      toast.error('Erreur lors de la suppression de l\'employé')
    }
  }
}

const loadEmployes = async () => {
  isLoading.value = true
  try {
    const response = await getUsers()
    employes.value = response || []
  } catch (err) {
    console.error('Erreur lors du chargement des employés:', err)
    employes.value = []
  } finally {
    isLoading.value = false
  }
}

const loadDepartements = async () => {
  try {
    const response = await getDepartements()
    departements.value = response || []
  } catch (err) {
    console.error('Erreur lors du chargement des départements:', err)
    departements.value = []
  }
}

const getDepartementName = (departementId) => {
  const dept = departements.value.find(d => d.id === departementId)
  return dept ? dept.nom : 'Non assigné'
}

const getRoleLabel = (role) => {
  const roleOption = rolesOptions.find(r => r.value === role)
  return roleOption ? roleOption.label : role
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

// Charger les données au montage
onMounted(() => {
  loadEmployes()
  loadDepartements()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Gestion des employés</h1>
          <p class="text-gray-600 mt-2">Liste complète des employés de l'entreprise</p>
        </div>
        <button 
          @click="openCreateModal"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Nouvel employé
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">Chargement des employés...</span>
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
        @click="loadEmployes" 
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Réessayer
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!employes.length" class="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun employé trouvé</h3>
      <p class="text-gray-600 mb-4">Il n'y a pas d'employés dans votre liste.</p>
    </div>

    <!-- Filtres et recherche -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input 
            v-model="searchTerm"
            type="text" 
            placeholder="Rechercher un employé..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
        </div>
        <div>
          <select 
            v-model="selectedDepartment"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les départements</option>
            <option v-for="dept in departements" :key="dept.id" :value="dept.id">{{ dept.nom }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Liste des employés -->
    <div v-if="!isLoading && !error && employes.length" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          Employés ({{ filteredEmployes.length }})
        </h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employé</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Département</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Poste</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Solde congés</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="employe in filteredEmployes" :key="employe.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ employe.nom }} {{ employe.prenom }}</div>
                  <div class="text-sm text-gray-500">{{ employe.email }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ getDepartementName(employe.departement_id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ employe.poste || 'Non défini' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-900">{{ employe.solde_conges || 0 }} jours</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ getRoleLabel(employe.role) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex items-center space-x-3">
                  <!-- Détails -->
                  <button 
                    @click="openDetailsModal(employe)"
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
                    @click="openHistoriqueModal(employe)"
                    class="text-purple-600 hover:text-purple-800 hover:bg-purple-100 p-2 rounded-full transition-colors duration-200"
                    title="Historique des demandes"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>

                  <!-- Modifier -->
                  <button 
                    @click="openEditModal(employe)"
                    class="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded-full transition-colors duration-200"
                    title="Modifier l'employé"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>

                  <!-- Supprimer -->
                  <button 
                    @click="confirmDelete(employe)"
                    class="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded-full transition-colors duration-200"
                    title="Supprimer l'employé"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Employé -->
    <BaseModal 
      v-model="showModal" 
      :title="editingEmployee ? 'Modifier l\'employé' : 'Nouvel employé'"
      :close-on-overlay="true"
    >
      <form @submit.prevent="submitEmployee" class="space-y-6">
        <!-- Informations personnelles -->
        <div class="space-y-4">          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="nom" class="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                id="nom"
                v-model="formData.nom"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom de famille"
              />
            </div>

            <div>
              <label for="prenom" class="block text-sm font-medium text-gray-700 mb-1">
                Prénom *
              </label>
              <input
                id="prenom"
                v-model="formData.prenom"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Prénom"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="adresse@email.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe {{ editingEmployee ? '(laisser vide pour ne pas changer)' : '*' }}
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              :required="!editingEmployee"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mot de passe"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="telephone" class="block text-sm font-medium text-gray-700 mb-1">
                Téléphone *
              </label>
              <input
                id="telephone"
                v-model="formData.telephone"
                type="tel"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="06 12 34 56 78"
              />
            </div>

            <div>
              <label for="numero_piece_identite" class="block text-sm font-medium text-gray-700 mb-1">
                N° Pièce d'identité *
              </label>
              <input
                id="numero_piece_identite"
                v-model="formData.numero_piece_identite"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="N° CNI ou Passeport"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="date_naissance" class="block text-sm font-medium text-gray-700 mb-1">
                Date de naissance
              </label>
              <input
                id="date_naissance"
                v-model="formData.date_naissance"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label for="genre" class="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <select
                id="genre"
                v-model="formData.genre"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="nombre_enfants" class="block text-sm font-medium text-gray-700 mb-1">
                Nombre d'enfants
              </label>
              <input
                id="nombre_enfants"
                v-model="formData.nombre_enfants"
                type="number"
                min="0"
                max="20"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div class="flex items-center pt-6">
              <input
                id="has_medaille_honneur"
                v-model="formData.has_medaille_honneur"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="has_medaille_honneur" class="ml-2 block text-sm text-gray-700">
                Médaille d'honneur
              </label>
            </div>
          </div>
        </div>

        <!-- Informations professionnelles -->
        <div class="space-y-4">          
          <div>
            <label for="poste" class="block text-sm font-medium text-gray-700 mb-1">
              Poste
            </label>
            <input
              id="poste"
              v-model="formData.poste"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Intitulé du poste"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="role" class="block text-sm font-medium text-gray-700 mb-1">
                Rôle *
              </label>
              <select
                id="role"
                v-model="formData.role"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option v-for="role in rolesOptions" :key="role.value" :value="role.value">
                  {{ role.label }}
                </option>
              </select>
            </div>

            <div>
              <label for="departement_id" class="block text-sm font-medium text-gray-700 mb-1">
                Département
              </label>
              <select
                id="departement_id"
                v-model="formData.departement_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option :value="null">Aucun département</option>
                <option v-for="dept in departements" :key="dept.id" :value="dept.id">
                  {{ dept.nom }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label for="date_embauche" class="block text-sm font-medium text-gray-700 mb-1">
              Date d'embauche *
            </label>
            <input
              id="date_embauche"
              v-model="formData.date_embauche"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="flex items-center">
            <input
              id="is_active"
              v-model="formData.is_active"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="is_active" class="ml-2 block text-sm text-gray-700">
              Employé actif
            </label>
          </div>
        </div>
      </form>

      <template #footer>
        <button
          @click="closeModal"
          type="button"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          :disabled="isSubmitting"
        >
          Annuler
        </button>
        <button
          @click="submitEmployee"
          type="button"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          :disabled="isSubmitting || !isFormValid"
        >
          <span v-if="isSubmitting" class="flex items-center">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {{ editingEmployee ? 'Modification...' : 'Création...' }}
          </span>
          <span v-else>
            {{ editingEmployee ? 'Modifier' : 'Créer' }}
          </span>
        </button>
      </template>
    </BaseModal>

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

        <!-- Informations système -->
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Informations système
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">ID Utilisateur</label>
              <p class="text-sm text-gray-900 font-mono">{{ selectedEmployee.id }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Compte vérifié</label>
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="selectedEmployee.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                {{ selectedEmployee.is_verified ? 'Vérifié' : 'Non vérifié' }}
              </span>
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
              @click="openEditModal(selectedEmployee)"
              type="button"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Modifier
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