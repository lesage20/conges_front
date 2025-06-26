<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Debug API</h1>
        <p class="mt-2 text-sm text-gray-600">
          Visualisez tous les appels API effectués par l'application
        </p>
      </div>

      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-medium">{{ logs.length }}</span>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ logs.length }} appels</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-medium">{{ successLogs.length }}</span>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Succès</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ successLogs.length }} appels</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-medium">{{ errorLogs.length }}</span>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Erreurs</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ errorLogs.length }} appels</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-medium">{{ averageDuration }}ms</span>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Durée moy.</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ averageDuration }}ms</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contrôles -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <div class="flex flex-wrap gap-4 items-center justify-between">
          <div class="flex gap-4">
            <button
              @click="clearLogs"
              class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Vider les logs
            </button>
            <button
              @click="refreshLogs"
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Actualiser
            </button>
          </div>
          
          <div class="flex gap-4 items-center">
            <select
              v-model="filterType"
              class="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">Tous les appels</option>
              <option value="success">Succès uniquement</option>
              <option value="error">Erreurs uniquement</option>
            </select>
            
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher une URL..."
              class="border border-gray-300 rounded-md px-3 py-2 w-64"
            >
          </div>
        </div>
      </div>

      <!-- Liste des appels API -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          <li
            v-for="log in filteredLogs"
            :key="log.id"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <!-- Méthode HTTP -->
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getMethodClass(log.method)"
                >
                  {{ log.method }}
                </span>

                <!-- Statut -->
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(log.status)"
                >
                  {{ log.status || 'Failed' }}
                </span>

                <!-- URL -->
                <span class="text-sm font-medium text-gray-900">{{ log.url }}</span>
              </div>

              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <!-- Durée -->
                <span>{{ log.duration }}ms</span>
                
                <!-- Timestamp -->
                <span>{{ formatTime(log.timestamp) }}</span>
              </div>
            </div>

            <!-- Erreur si applicable -->
            <div v-if="log.error" class="mt-2">
              <div class="bg-red-50 border border-red-200 rounded-md p-3">
                <p class="text-sm text-red-600">{{ log.error }}</p>
              </div>
            </div>
          </li>
        </ul>

        <!-- Message si aucun log -->
        <div v-if="filteredLogs.length === 0" class="px-6 py-12 text-center">
          <p class="text-gray-500">
            {{ logs.length === 0 ? 'Aucun appel API effectué' : 'Aucun résultat pour cette recherche' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useApiLogs } from '@/composables/useApi'

const { logs, clearLogs: clearApiLogs } = useApiLogs()

// États locaux
const filterType = ref('all')
const searchQuery = ref('')

// Computed
const filteredLogs = computed(() => {
  let filtered = logs

  // Filtre par type
  if (filterType.value === 'success') {
    filtered = filtered.filter(log => !log.error && log.status >= 200 && log.status < 300)
  } else if (filterType.value === 'error') {
    filtered = filtered.filter(log => log.error || log.status >= 400)
  }

  // Filtre par recherche
  if (searchQuery.value) {
    filtered = filtered.filter(log => 
      log.url.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return filtered
})

const successLogs = computed(() => 
  logs.filter(log => !log.error && log.status >= 200 && log.status < 300)
)

const errorLogs = computed(() => 
  logs.filter(log => log.error || log.status >= 400)
)

const averageDuration = computed(() => {
  if (logs.length === 0) return 0
  const total = logs.reduce((sum, log) => sum + log.duration, 0)
  return Math.round(total / logs.length)
})

// Méthodes
const clearLogs = () => {
  clearApiLogs()
}

const refreshLogs = () => {
  // Force la réactivité
  filterType.value = filterType.value
}

const getMethodClass = (method) => {
  const classes = {
    GET: 'bg-blue-100 text-blue-800',
    POST: 'bg-green-100 text-green-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    PATCH: 'bg-orange-100 text-orange-800',
    DELETE: 'bg-red-100 text-red-800'
  }
  return classes[method] || 'bg-gray-100 text-gray-800'
}

const getStatusClass = (status) => {
  if (status >= 200 && status < 300) {
    return 'bg-green-100 text-green-800'
  } else if (status >= 400) {
    return 'bg-red-100 text-red-800'
  } else if (status === 0) {
    return 'bg-gray-100 text-gray-800'
  } else {
    return 'bg-yellow-100 text-yellow-800'
  }
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('fr-FR')
}
</script> 