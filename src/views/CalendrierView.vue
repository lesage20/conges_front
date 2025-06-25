<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Calendrier des congés</h1>
        <p class="text-gray-600">Visualisez les absences de votre équipe</p>
      </div>
      <div class="flex space-x-3">
        <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
          </svg>
          Filtrer
        </button>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Nouvelle demande
        </button>
      </div>
    </div>

    <!-- Calendar controls -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <h2 class="text-xl font-semibold text-gray-900">Mars 2025</h2>
          <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
        <div class="flex items-center space-x-2">
          <button class="px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Mois
          </button>
          <button class="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg">
            Semaine
          </button>
          <button class="px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Jour
          </button>
          <div class="ml-4 flex space-x-3">
            <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
              </svg>
              Filtrer
            </button>
            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Nouvelle demande
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <!-- Calendar header -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div class="p-4 text-center text-sm font-semibold text-gray-600 bg-gray-50 rounded-lg">Lun</div>
        <div class="p-4 text-center text-sm font-semibold text-gray-600 bg-gray-50 rounded-lg">Mar</div>
        <div class="p-4 text-center text-sm font-semibold text-gray-600 bg-gray-50 rounded-lg">Mer</div>
        <div class="p-4 text-center text-sm font-semibold text-gray-600 bg-gray-50 rounded-lg">Jeu</div>
        <div class="p-4 text-center text-sm font-semibold text-gray-600 bg-gray-50 rounded-lg">Ven</div>
        <div class="p-4 text-center text-sm font-semibold text-gray-600 bg-gray-50 rounded-lg">Sam</div>
        <div class="p-4 text-center text-sm font-semibold text-gray-600 bg-gray-50 rounded-lg">Dim</div>
      </div>

      <!-- Calendar body -->
      <div class="grid grid-cols-7 gap-1">
        <!-- Week 1 -->
        <div class="bg-gray-50 p-4 h-32 text-sm text-gray-400 rounded-lg border border-gray-100">
          <div class="font-medium">24</div>
        </div>
        <div class="bg-gray-50 p-4 h-32 text-sm text-gray-400 rounded-lg border border-gray-100">
          <div class="font-medium">25</div>
        </div>
        <div class="bg-gray-50 p-4 h-32 text-sm text-gray-400 rounded-lg border border-gray-100">
          <div class="font-medium">26</div>
        </div>
        <div class="bg-gray-50 p-4 h-32 text-sm text-gray-400 rounded-lg border border-gray-100">
          <div class="font-medium">27</div>
        </div>
        <div class="bg-gray-50 p-4 h-32 text-sm text-gray-400 rounded-lg border border-gray-100">
          <div class="font-medium">28</div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200">
          <div class="font-medium text-gray-900">1</div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200">
          <div class="font-medium text-gray-900">2</div>
        </div>

        <!-- Week 2 -->
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200">
          <div class="font-medium text-gray-900">3</div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200">
          <div class="font-medium text-gray-900">4</div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200">
          <div class="font-medium text-gray-900">5</div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200">
          <div class="font-medium text-gray-900">6</div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200">
          <div class="font-medium text-gray-900">7</div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200">
          <div class="font-medium text-gray-900">8</div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200">
          <div class="font-medium text-gray-900">9</div>
        </div>

        <!-- Week 3 -->
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200">
          <div class="font-medium text-gray-900">10</div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200">
          <div class="font-medium text-gray-900">11</div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200">
          <div class="font-medium text-gray-900">12</div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200">
          <div class="font-medium text-gray-900">13</div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200">
          <div class="font-medium text-gray-900">14</div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200 relative">
          <div class="font-medium text-gray-900">15</div>
          <div class="mt-2">
            <div class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full truncate">Marie - Vacances</div>
          </div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200 relative">
          <div class="font-medium text-gray-900">16</div>
          <div class="mt-2">
            <div class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full truncate">Marie - Vacances</div>
          </div>
        </div>

        <!-- Week 4 -->
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200 relative">
          <div class="font-medium text-gray-900">17</div>
          <div class="mt-2">
            <div class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full truncate">Marie - Vacances</div>
          </div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200 relative">
          <div class="font-medium text-gray-900">18</div>
          <div class="mt-2">
            <div class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full truncate">Marie - Vacances</div>
          </div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200 relative">
          <div class="font-medium text-gray-900">19</div>
          <div class="mt-2">
            <div class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full truncate">Marie - Vacances</div>
          </div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200 relative">
          <div class="font-medium text-gray-900">20</div>
          <div class="mt-2">
            <div class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full truncate">Marie - Vacances</div>
          </div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200">
          <div class="font-medium text-gray-900">21</div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200 relative">
          <div class="font-medium text-gray-900">22</div>
          <div class="mt-2">
            <div class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full truncate">Pierre - RTT</div>
          </div>
        </div>
        <div class="bg-blue-50 p-4 h-32 text-sm cursor-pointer transition-colors rounded-lg border-2 border-blue-400">
          <div class="font-semibold text-blue-900">23</div>
          <div class="text-xs text-blue-700 mt-1">Aujourd'hui</div>
        </div>

        <!-- Week 5 -->
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200">
          <div class="font-medium text-gray-900">24</div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200 relative">
          <div class="font-medium text-gray-900">25</div>
          <div class="mt-2">
            <div class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full truncate">Sophie - Maladie</div>
          </div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200 relative">
          <div class="font-medium text-gray-900">26</div>
          <div class="mt-2">
            <div class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full truncate">Sophie - Maladie</div>
          </div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200 relative">
          <div class="font-medium text-gray-900">27</div>
          <div class="mt-2">
            <div class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full truncate">Sophie - Maladie</div>
          </div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200 relative">
          <div class="font-medium text-gray-900">28</div>
          <div class="mt-2">
            <div class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full truncate">Sophie - Maladie</div>
          </div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200">
          <div class="font-medium text-gray-900">29</div>
        </div>
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200">
          <div class="font-medium text-gray-900">30</div>
        </div>

        <!-- Week 6 -->
        <div class="bg-white p-4 h-32 text-sm hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-gray-200">
          <div class="font-medium text-gray-900">31</div>
        </div>
        <div class="bg-gray-50 p-4 h-32 text-sm text-gray-400 rounded-lg border border-gray-100">
          <div class="font-medium">1</div>
        </div>
        <div class="bg-gray-50 p-4 h-32 text-sm text-gray-400 rounded-lg border border-gray-100">
          <div class="font-medium">2</div>
        </div>
        <div class="bg-gray-50 p-4 h-32 text-sm text-gray-400 rounded-lg border border-gray-100">
          <div class="font-medium">3</div>
        </div>
        <div class="bg-gray-50 p-4 h-32 text-sm text-gray-400 rounded-lg border border-gray-100">
          <div class="font-medium">4</div>
        </div>
        <div class="bg-gray-50 p-4 h-32 text-sm text-gray-400 rounded-lg border border-gray-100">
          <div class="font-medium">5</div>
        </div>
        <div class="bg-gray-50 p-4 h-32 text-sm text-gray-400 rounded-lg border border-gray-100">
          <div class="font-medium">6</div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Légende</h3>
      <div class="flex flex-wrap gap-6">
        <div class="flex items-center">
          <div class="w-4 h-4 bg-blue-100 rounded mr-2"></div>
          <span class="text-sm text-gray-700">Congés payés</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-green-100 rounded mr-2"></div>
          <span class="text-sm text-gray-700">RTT</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-orange-100 rounded mr-2"></div>
          <span class="text-sm text-gray-700">Arrêt maladie</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-purple-100 rounded mr-2"></div>
          <span class="text-sm text-gray-700">Congé parental</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-red-100 rounded mr-2"></div>
          <span class="text-sm text-gray-700">Congé exceptionnel</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalendrierView'
}
</script> 