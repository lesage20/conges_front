<script>
export default {
  name: 'CalendrierDrhView'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h1 class="text-2xl font-bold text-gray-900">Calendrier DRH</h1>
      <p class="text-gray-600 mt-2">Vue d'ensemble des congés de l'entreprise</p>
    </div>

    <!-- Calendrier principal -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900">Mars 2025</h2>
        <div class="flex space-x-2">
          <button class="px-3 py-2 text-gray-600 hover:text-gray-900">&lt;</button>
          <button class="px-3 py-2 text-gray-600 hover:text-gray-900">&gt;</button>
        </div>
      </div>
      
      <!-- Grille du calendrier -->
      <div class="grid grid-cols-7 gap-1 mb-4">
        <div class="p-2 text-center text-sm font-medium text-gray-500">Lun</div>
        <div class="p-2 text-center text-sm font-medium text-gray-500">Mar</div>
        <div class="p-2 text-center text-sm font-medium text-gray-500">Mer</div>
        <div class="p-2 text-center text-sm font-medium text-gray-500">Jeu</div>
        <div class="p-2 text-center text-sm font-medium text-gray-500">Ven</div>
        <div class="p-2 text-center text-sm font-medium text-gray-500">Sam</div>
        <div class="p-2 text-center text-sm font-medium text-gray-500">Dim</div>
      </div>
      
      <div class="grid grid-cols-7 gap-1">
        <!-- Exemple de jours avec événements -->
        <div class="p-2 h-20 border border-gray-200 rounded">
          <span class="text-sm text-gray-900">1</span>
        </div>
        <div class="p-2 h-20 border border-gray-200 rounded">
          <span class="text-sm text-gray-900">2</span>
        </div>
        <div class="p-2 h-20 border border-gray-200 rounded bg-blue-50">
          <span class="text-sm text-gray-900">3</span>
          <div class="text-xs bg-blue-200 text-blue-800 px-1 rounded mt-1">Marie D.</div>
        </div>
        <!-- Autres jours... -->
      </div>
    </div>

    <!-- Légende et filtres -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Légende</h3>
        <div class="space-y-2">
          <div class="flex items-center">
            <div class="w-4 h-4 bg-blue-200 rounded mr-3"></div>
            <span class="text-sm text-gray-700">Congés payés</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 bg-green-200 rounded mr-3"></div>
            <span class="text-sm text-gray-700">RTT</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 bg-red-200 rounded mr-3"></div>
            <span class="text-sm text-gray-700">Congé maladie</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Département</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option>Tous les départements</option>
              <option>IT</option>
              <option>Marketing</option>
              <option>RH</option>
              <option>Finance</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Type de congé</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option>Tous les types</option>
              <option>Congés payés</option>
              <option>RTT</option>
              <option>Congé maladie</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 