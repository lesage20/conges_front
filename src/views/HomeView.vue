<script>
export default {
  name: 'HomeView'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Stats cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Jours restants</p>
            <p class="text-2xl font-bold text-gray-900">25</p>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center">
            <div class="flex-1 bg-gray-200 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full" style="width: 83%"></div>
            </div>
            <span class="ml-2 text-sm text-gray-600">83%</span>
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
            <p class="text-sm font-medium text-gray-600">Demandes approuvées</p>
            <p class="text-2xl font-bold text-gray-900">12</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-green-600 font-medium">+2 ce mois</span>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 rounded-lg">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">En attente</p>
            <p class="text-2xl font-bold text-gray-900">3</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-orange-600 font-medium">À traiter</span>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Équipe absente</p>
            <p class="text-2xl font-bold text-gray-900">7</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-gray-600">sur 24 personnes</span>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button class="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
          <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <div class="text-left">
            <p class="font-medium text-gray-900">Nouvelle demande</p>
            <p class="text-sm text-gray-600">Déposer une demande de congé</p>
          </div>
        </button>

        <button class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
          <svg class="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"></path>
          </svg>
          <div class="text-left">
            <p class="font-medium text-gray-900">Voir le calendrier</p>
            <p class="text-sm text-gray-600">Planning de l'équipe</p>
          </div>
        </button>

        <button class="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
          <svg class="w-8 h-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <div class="text-left">
            <p class="font-medium text-gray-900">Rapports</p>
            <p class="text-sm text-gray-600">Consulter les statistiques</p>
          </div>
        </button>
      </div>
    </div>

    <!-- Recent activity and calendar -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent activity -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
        <div class="space-y-4">
          <div class="flex items-start">
            <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
            <div class="flex-1">
              <p class="text-sm text-gray-900">Demande de congé approuvée</p>
              <p class="text-xs text-gray-600">15-20 Mars 2025 • il y a 2 heures</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
            <div class="flex-1">
              <p class="text-sm text-gray-900">Nouvelle demande soumise</p>
              <p class="text-xs text-gray-600">10-12 Avril 2025 • il y a 1 jour</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
            <div class="flex-1">
              <p class="text-sm text-gray-900">Demande en attente de validation</p>
              <p class="text-xs text-gray-600">5-7 Mai 2025 • il y a 3 jours</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3"></div>
            <div class="flex-1">
              <p class="text-sm text-gray-900">Solde mis à jour</p>
              <p class="text-xs text-gray-600">+2.5 jours ajoutés • il y a 1 semaine</p>
            </div>
          </div>
        </div>
        
        <button class="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
          Voir toute l'activité →
        </button>
      </div>

      <!-- Upcoming absences -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Prochaines absences</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-semibold">MA</span>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Marie Dupont</p>
                <p class="text-xs text-gray-600">15-20 Mars</p>
              </div>
            </div>
            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Vacances</span>
          </div>
          
          <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-semibold">PL</span>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Pierre Leroy</p>
                <p class="text-xs text-gray-600">22 Mars</p>
              </div>
            </div>
            <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">RTT</span>
          </div>
          
          <div class="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-semibold">SB</span>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Sophie Bernard</p>
                <p class="text-xs text-gray-600">25-30 Mars</p>
              </div>
            </div>
            <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Maladie</span>
          </div>
        </div>
        
        <button class="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
          Voir le calendrier complet →
        </button>
      </div>
    </div>
  </div>
</template>
