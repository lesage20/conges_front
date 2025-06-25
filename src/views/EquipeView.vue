<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mon équipe</h1>
        <p class="text-gray-600">Gérez les congés et absences de votre équipe</p>
      </div>
      <div class="flex space-x-3">
        <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
          </svg>
          Exporter
        </button>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Ajouter membre
        </button>
      </div>
    </div>

    <!-- Stats -->
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
            <p class="text-2xl font-bold text-gray-900">24</p>
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
            <p class="text-2xl font-bold text-gray-900">17</p>
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
            <p class="text-sm font-medium text-gray-600">En congés</p>
            <p class="text-2xl font-bold text-gray-900">5</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.636 0L4.196 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Arrêt maladie</p>
            <p class="text-2xl font-bold text-gray-900">2</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and filter -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-64">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Rechercher un membre..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">Tous les départements</option>
          <option value="dev">Développement</option>
          <option value="design">Design</option>
          <option value="marketing">Marketing</option>
          <option value="sales">Ventes</option>
        </select>
        
        <select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">Tous les statuts</option>
          <option value="present">Présent</option>
          <option value="absent">Absent</option>
          <option value="vacation">En vacances</option>
          <option value="sick">Malade</option>
        </select>
      </div>
    </div>

    <!-- Team members -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Membres de l'équipe</h2>
      </div>
      
      <div class="divide-y divide-gray-200">
        <!-- Member 1 -->
        <div class="p-6 hover:bg-gray-50 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-white font-semibold">MD</span>
              </div>
              <div>
                <h3 class="text-base font-medium text-gray-900">Marie Dupont</h3>
                <p class="text-sm text-gray-600">Développeuse Frontend • marie.dupont@company.com</p>
                <div class="flex items-center mt-1 space-x-4">
                  <span class="text-xs text-gray-500">25 jours restants</span>
                  <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">En vacances</span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="text-right">
                <p class="text-sm text-gray-900">15-20 Mars</p>
                <p class="text-xs text-gray-500">Retour lundi</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Member 2 -->
        <div class="p-6 hover:bg-gray-50 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <span class="text-white font-semibold">PL</span>
              </div>
              <div>
                <h3 class="text-base font-medium text-gray-900">Pierre Leroy</h3>
                <p class="text-sm text-gray-600">Designer UX/UI • pierre.leroy@company.com</p>
                <div class="flex items-center mt-1 space-x-4">
                  <span class="text-xs text-gray-500">18 jours restants</span>
                  <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Présent</span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="text-right">
                <p class="text-sm text-gray-900">Disponible</p>
                <p class="text-xs text-gray-500">RTT prévu 22 mars</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Member 3 -->
        <div class="p-6 hover:bg-gray-50 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                <span class="text-white font-semibold">SB</span>
              </div>
              <div>
                <h3 class="text-base font-medium text-gray-900">Sophie Bernard</h3>
                <p class="text-sm text-gray-600">Chef de projet • sophie.bernard@company.com</p>
                <div class="flex items-center mt-1 space-x-4">
                  <span class="text-xs text-gray-500">22 jours restants</span>
                  <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Arrêt maladie</span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="text-right">
                <p class="text-sm text-gray-900">25-30 Mars</p>
                <p class="text-xs text-gray-500">Retour estimé jeudi</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Member 4 -->
        <div class="p-6 hover:bg-gray-50 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <span class="text-white font-semibold">AM</span>
              </div>
              <div>
                <h3 class="text-base font-medium text-gray-900">Antoine Martin</h3>
                <p class="text-sm text-gray-600">Développeur Backend • antoine.martin@company.com</p>
                <div class="flex items-center mt-1 space-x-4">
                  <span class="text-xs text-gray-500">30 jours restants</span>
                  <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Présent</span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="text-right">
                <p class="text-sm text-gray-900">Disponible</p>
                <p class="text-xs text-gray-500">Aucune absence prévue</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Member 5 -->
        <div class="p-6 hover:bg-gray-50 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center">
                <span class="text-white font-semibold">LT</span>
              </div>
              <div>
                <h3 class="text-base font-medium text-gray-900">Laura Thomas</h3>
                <p class="text-sm text-gray-600">Responsable Marketing • laura.thomas@company.com</p>
                <div class="flex items-center mt-1 space-x-4">
                  <span class="text-xs text-gray-500">15 jours restants</span>
                  <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Présent</span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="text-right">
                <p class="text-sm text-gray-900">Disponible</p>
                <p class="text-xs text-gray-500">Congés prévus en avril</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4">
      <div class="text-sm text-gray-700">
        Affichage de <span class="font-medium">1</span> à <span class="font-medium">5</span> sur <span class="font-medium">24</span> membres
      </div>
      <div class="flex items-center space-x-2">
        <button class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Précédent
        </button>
        <button class="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg">1</button>
        <button class="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">2</button>
        <button class="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">3</button>
        <button class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EquipeView'
}
</script> 