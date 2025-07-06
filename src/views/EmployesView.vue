<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUsers } from '@/composables/useUsers'
import { useDepartements } from '@/composables/useDepartements'
import BaseModal from '@/components/BaseModal.vue'

// Composables
const { getUsers, createUser, updateUser, deleteUser, loading, error } = useUsers()
const { getDepartements } = useDepartements()

// Données réactives
const searchTerm = ref('')
const selectedDepartment = ref('all')
const employes = ref([])
const departements = ref([])
const isLoading = ref(false)
const showModal = ref(false)
const editingEmployee = ref(null)
const isSubmitting = ref(false)

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
  is_active: true
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
    is_active: true
  }
}

const openCreateModal = () => {
  editingEmployee.value = null
  resetForm()
  showModal.value = true
}

const openEditModal = (employee) => {
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
    is_active: employee.is_active !== undefined ? employee.is_active : true
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingEmployee.value = null
  resetForm()
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
      is_active: formData.value.is_active
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
      await createUser(employeeData)
    }
    
    // Recharger la liste des employés
    await loadEmployes()
    
    // Fermer la modal
    closeModal()
    
    console.log('Employé sauvegardé avec succès')
    
  } catch (err) {
    console.error('Erreur lors de la sauvegarde:', err)
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = async (employee) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer l'employé "${employee.prenom} ${employee.nom}" ?`)) {
    try {
      await deleteUser(employee.id)
      await loadEmployes()
      console.log('Employé supprimé avec succès')
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
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
              <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <button 
                  @click="openEditModal(employe)"
                  class="text-blue-600 hover:text-blue-900 px-2 py-1 bg-blue-50 rounded"
                >
                  Modifier
                </button>
                <button 
                  @click="confirmDelete(employe)"
                  class="text-red-600 hover:text-red-900 px-2 py-1 bg-red-50 rounded"
                >
                  Supprimer
                </button>
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
  </div>
</template> 