<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Test des Composables API</h1>
        <p class="mt-2 text-sm text-gray-600">
          Testez les différents composables pour interagir avec l'API
        </p>
      </div>

      <div class="grid gap-8">
        <!-- Section Test Utilisateurs -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Test Utilisateurs</h2>
          
          <div class="space-y-4">
            <div class="flex flex-wrap gap-4">
              <button
                @click="testGetUsers"
                :disabled="usersApi.loading.value"
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {{ usersApi.loading.value ? 'Chargement...' : 'Récupérer Utilisateurs' }}
              </button>
              
              <button
                @click="testCreateEmployee"
                :disabled="usersApi.loading.value"
                class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                Créer Utilisateur Test
              </button>
            </div>

            <!-- Affichage des résultats -->
            <div v-if="usersApi.error.value" class="bg-red-50 border border-red-200 rounded-md p-4">
              <p class="text-red-600">Erreur : {{ usersApi.error.value }}</p>
            </div>

            <div v-if="usersApi.data.value" class="bg-green-50 border border-green-200 rounded-md p-4">
              <p class="text-green-600 mb-2">Succès ! Données reçues :</p>
              <pre class="text-sm bg-white p-2 rounded">{{ JSON.stringify(usersApi.data.value, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <!-- Section Test Demandes -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Test Demandes de Congés</h2>
          
          <div class="space-y-4">
            <div class="flex flex-wrap gap-4">
              <button
                @click="testGetDemandes"
                :disabled="demandesApi.loading.value"
                class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {{ demandesApi.loading.value ? 'Chargement...' : 'Récupérer Demandes' }}
              </button>
              
              <button
                @click="testCreateDemande"
                :disabled="demandesApi.loading.value"
                class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                Créer Demande Test
              </button>
            </div>

            <!-- Affichage des résultats -->
            <div v-if="demandesApi.error.value" class="bg-red-50 border border-red-200 rounded-md p-4">
              <p class="text-red-600">Erreur : {{ demandesApi.error.value }}</p>
            </div>

            <div v-if="demandesApi.data.value" class="bg-green-50 border border-green-200 rounded-md p-4">
              <p class="text-green-600 mb-2">Succès ! Données reçues :</p>
              <pre class="text-sm bg-white p-2 rounded">{{ JSON.stringify(demandesApi.data.value, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <!-- Section Test Départements -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Test Départements</h2>
          
          <div class="space-y-4">
            <div class="flex flex-wrap gap-4">
              <button
                @click="testGetDepartements"
                :disabled="departementsApi.loading.value"
                class="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 transition-colors"
              >
                {{ departementsApi.loading.value ? 'Chargement...' : 'Récupérer Départements' }}
              </button>
            </div>

            <!-- Affichage des résultats -->
            <div v-if="departementsApi.error.value" class="bg-red-50 border border-red-200 rounded-md p-4">
              <p class="text-red-600">Erreur : {{ departementsApi.error.value }}</p>
            </div>

            <div v-if="departementsApi.data.value" class="bg-green-50 border border-green-200 rounded-md p-4">
              <p class="text-green-600 mb-2">Succès ! Données reçues :</p>
              <pre class="text-sm bg-white p-2 rounded">{{ JSON.stringify(departementsApi.data.value, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <!-- Section État Global des Logs -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Logs API ({{ apiLogs.logs.length }} appels)</h2>
          
          <div class="space-y-2">
            <div v-for="log in apiLogs.logs.slice(0, 5)" :key="log.id" class="text-sm p-2 bg-gray-50 rounded">
              <span class="font-medium" :class="log.error ? 'text-red-600' : 'text-green-600'">
                {{ log.method }} {{ log.url }}
              </span>
              <span class="text-gray-500 ml-2">{{ log.duration }}ms</span>
              <span v-if="log.error" class="text-red-500 ml-2">{{ log.error }}</span>
            </div>
            
            <div v-if="apiLogs.logs.length > 5" class="text-center">
              <router-link 
                to="/debug-api" 
                class="text-blue-600 hover:text-blue-800 text-sm"
              >
                Voir tous les logs ({{ apiLogs.logs.length }})
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUsers, useDemandesConges, useDepartements, useApiLogs } from '@/composables'

// Initialisation des composables
const usersApi = useUsers()
const demandesApi = useDemandesConges()
const departementsApi = useDepartements()
const apiLogs = useApiLogs()

// Fonctions de test
const testGetUsers = async () => {
  try {
    await usersApi.getUsers()
    console.log('Utilisateurs récupérés:', usersApi.data.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error)
  }
}

const testCreateEmployee = async () => {
  try {
    const userData = {
      nom: 'Doe',
      prenom: 'John',
      email: `test${Date.now()}@example.com`,
      role: 'employe',
      departement_id: 1
    }
    await usersApi.createEmployee(userData)
    console.log('Utilisateur créé:', usersApi.data.value)
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error)
  }
}

const testGetDemandes = async () => {
  try {
    await demandesApi.getDemandes()
    console.log('Demandes récupérées:', demandesApi.data.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes:', error)
  }
}

const testCreateDemande = async () => {
  try {
    const demandeData = {
      date_debut: '2024-07-15',
      date_fin: '2024-07-19',
      type_conge: 'conges_payes',
      motif: 'Vacances d\'été'
    }
    await demandesApi.createDemande(demandeData)
    console.log('Demande créée:', demandesApi.data.value)
  } catch (error) {
    console.error('Erreur lors de la création de la demande:', error)
  }
}

const testGetDepartements = async () => {
  try {
    await departementsApi.getDepartements()
    console.log('Départements récupérés:', departementsApi.data.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des départements:', error)
  }
}
</script> 