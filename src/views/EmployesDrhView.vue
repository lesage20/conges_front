<script>
export default {
  name: 'EmployesDrhView',
  data() {
    return {
      searchTerm: '',
      selectedDepartment: 'all',
      employes: [
        { id: 1, nom: 'Marie Dupont', email: 'marie.dupont@entreprise.com', departement: 'IT', poste: 'Développeuse', soldeConges: 25, status: 'Présent' },
        { id: 2, nom: 'Pierre Martin', email: 'pierre.martin@entreprise.com', departement: 'Marketing', poste: 'Chef de projet', soldeConges: 18, status: 'En congé' },
        { id: 3, nom: 'Sarah Dubois', email: 'sarah.dubois@entreprise.com', departement: 'RH', poste: 'Responsable RH', soldeConges: 22, status: 'Présent' },
        { id: 4, nom: 'Jean Leroy', email: 'jean.leroy@entreprise.com', departement: 'Finance', poste: 'Comptable', soldeConges: 20, status: 'Présent' }
      ]
    }
  },
  computed: {
    filteredEmployes() {
      let filtered = this.employes

      if (this.searchTerm) {
        filtered = filtered.filter(emp => 
          emp.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      }

      if (this.selectedDepartment !== 'all') {
        filtered = filtered.filter(emp => emp.departement === this.selectedDepartment)
      }

      return filtered
    }
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case 'Présent': return 'bg-green-100 text-green-800'
        case 'En congé': return 'bg-orange-100 text-orange-800'
        case 'Absent': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }
  }
}
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
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Nouvel employé
        </button>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
            <option value="IT">IT</option>
            <option value="Marketing">Marketing</option>
            <option value="RH">RH</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Liste des employés -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="employe in filteredEmployes" :key="employe.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ employe.nom }}</div>
                  <div class="text-sm text-gray-500">{{ employe.email }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ employe.departement }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ employe.poste }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-900">{{ employe.soldeConges }} jours</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full', getStatusColor(employe.status)]">
                  {{ employe.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <button class="text-blue-600 hover:text-blue-900 px-2 py-1 bg-blue-50 rounded">
                  Voir
                </button>
                <button class="text-gray-600 hover:text-gray-900 px-2 py-1 bg-gray-50 rounded">
                  Modifier
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template> 