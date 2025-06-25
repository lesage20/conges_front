<template>
  <div class="space-y-6">
    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex flex-wrap gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Période</label>
          <select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
            <option value="custom">Personnalisé</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Département</label>
          <select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Tous les départements</option>
            <option value="dev">Développement</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Ventes</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type de congé</label>
          <select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Tous les types</option>
            <option value="vacation">Congés payés</option>
            <option value="rtt">RTT</option>
            <option value="sick">Arrêt maladie</option>
            <option value="other">Autre</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Filtrer
          </button>
        </div>
      </div>
    </div>

    <!-- Key metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Jours pris ce mois</p>
            <p class="text-2xl font-bold text-gray-900">147</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-green-600 font-medium">+12% vs mois dernier</span>
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
            <p class="text-sm font-medium text-gray-600">Taux d'approbation</p>
            <p class="text-2xl font-bold text-gray-900">89%</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-green-600 font-medium">+3% vs mois dernier</span>
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
            <p class="text-sm font-medium text-gray-600">Délai moyen</p>
            <p class="text-2xl font-bold text-gray-900">2.3j</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-red-600 font-medium">+0.5j vs mois dernier</span>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Moyenne équipe</p>
            <p class="text-2xl font-bold text-gray-900">6.1j</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-gray-600">par personne/mois</span>
        </div>
      </div>
    </div>

    <!-- Charts section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Congés par mois -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Évolution des congés</h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div class="text-center">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <p class="text-gray-500">Graphique en barres</p>
            <p class="text-sm text-gray-400">Évolution mensuelle des congés pris</p>
          </div>
        </div>
      </div>

      <!-- Répartition par type -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Répartition par type</h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div class="text-center">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
            </svg>
            <p class="text-gray-500">Graphique en secteurs</p>
            <p class="text-sm text-gray-400">Répartition des types de congés</p>
          </div>
        </div>
        <div class="mt-4 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span class="text-sm text-gray-700">Congés payés</span>
            </div>
            <span class="text-sm font-medium text-gray-900">65%</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span class="text-sm text-gray-700">RTT</span>
            </div>
            <span class="text-sm font-medium text-gray-900">25%</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              <span class="text-sm text-gray-700">Arrêt maladie</span>
            </div>
            <span class="text-sm font-medium text-gray-900">8%</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span class="text-sm text-gray-700">Autres</span>
            </div>
            <span class="text-sm font-medium text-gray-900">2%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Top performers -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistiques par département</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Département</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Employés</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Jours pris</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Moyenne/personne</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Taux d'approbation</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-700">Statut</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr>
              <td class="py-3 px-4 text-sm font-medium text-gray-900">Développement</td>
              <td class="py-3 px-4 text-sm text-gray-600">8</td>
              <td class="py-3 px-4 text-sm text-gray-600">52</td>
              <td class="py-3 px-4 text-sm text-gray-600">6.5</td>
              <td class="py-3 px-4 text-sm text-gray-600">92%</td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Excellent
                </span>
              </td>
            </tr>
            <tr>
              <td class="py-3 px-4 text-sm font-medium text-gray-900">Design</td>
              <td class="py-3 px-4 text-sm text-gray-600">4</td>
              <td class="py-3 px-4 text-sm text-gray-600">28</td>
              <td class="py-3 px-4 text-sm text-gray-600">7.0</td>
              <td class="py-3 px-4 text-sm text-gray-600">88%</td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Bon
                </span>
              </td>
            </tr>
            <tr>
              <td class="py-3 px-4 text-sm font-medium text-gray-900">Marketing</td>
              <td class="py-3 px-4 text-sm text-gray-600">6</td>
              <td class="py-3 px-4 text-sm text-gray-600">42</td>
              <td class="py-3 px-4 text-sm text-gray-600">7.0</td>
              <td class="py-3 px-4 text-sm text-gray-600">83%</td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Moyen
                </span>
              </td>
            </tr>
            <tr>
              <td class="py-3 px-4 text-sm font-medium text-gray-900">Ventes</td>
              <td class="py-3 px-4 text-sm text-gray-600">6</td>
              <td class="py-3 px-4 text-sm text-gray-600">25</td>
              <td class="py-3 px-4 text-sm text-gray-600">4.2</td>
              <td class="py-3 px-4 text-sm text-gray-600">95%</td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Excellent
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RapportsView'
}
</script> 