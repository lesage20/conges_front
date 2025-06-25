<script>
export default {
  name: 'DepartementsDrhView',
  data() {
    return {
      departements: [
        { id: 1, nom: 'IT', manager: 'Jean Dupont', employes: 24, presents: 21, absents: 3 },
        { id: 2, nom: 'Marketing', manager: 'Marie Martin', employes: 18, presents: 17, absents: 1 },
        { id: 3, nom: 'RH', manager: 'Pierre Dubois', employes: 8, presents: 8, absents: 0 },
        { id: 4, nom: 'Finance', manager: 'Sarah Leroy', employes: 15, presents: 11, absents: 4 }
      ]
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
          <h1 class="text-2xl font-bold text-gray-900">Gestion des départements</h1>
          <p class="text-gray-600 mt-2">Vue d'ensemble par service</p>
        </div>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Nouveau département
        </button>
      </div>
    </div>

    <!-- Grille des départements -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="dept in departements" 
        :key="dept.id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ dept.nom }}</h3>
          <div class="flex space-x-2">
            <button class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button class="text-gray-400 hover:text-red-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center">
            <span class="text-sm text-gray-600">Manager:</span>
            <span class="ml-2 text-sm font-medium text-gray-900">{{ dept.manager }}</span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Employés totaux:</span>
            <span class="text-sm font-medium text-gray-900">{{ dept.employes }}</span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Présents:</span>
            <span class="text-sm font-medium text-green-600">{{ dept.presents }}</span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Absents:</span>
            <span class="text-sm font-medium text-red-600">{{ dept.absents }}</span>
          </div>
          
          <div class="mt-4">
            <div class="flex justify-between text-xs text-gray-600 mb-1">
              <span>Taux de présence</span>
              <span>{{ Math.round((dept.presents / dept.employes) * 100) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-green-600 h-2 rounded-full"
                :style="{ width: (dept.presents / dept.employes) * 100 + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200">
          <button class="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
            Voir les détails →
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 