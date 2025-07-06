<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Paramètres</h1>
      <p class="text-gray-600">Gérez les paramètres de votre compte et de l'application</p>
    </div>

    <!-- Tabs Navigation -->
    <div class="border-b border-gray-200">
      <nav class="flex space-x-8" aria-label="Tabs">
        <button
          @click="activeTab = 'profile'"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === 'profile'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <div class="flex items-center">
            <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Profil
          </div>
        </button>
        <button
          @click="activeTab = 'notifications'"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === 'notifications'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <div class="flex items-center">
            <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5l-5-5h5V12h-5V7h5l-5-5l5-5v5z"></path>
            </svg>
            Notifications
          </div>
        </button>
        <button
          @click="activeTab = 'security'"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === 'security'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <div class="flex items-center">
            <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            Sécurité
          </div>
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="mt-6">
      <!-- Profile Tab -->
      <div v-show="activeTab === 'profile'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">Informations personnelles</h2>
          <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">Modifier</button>
        </div>
        
        <div class="flex items-center space-x-6 mb-6">
          <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <span class="text-white text-xl font-semibold">{{ getUserInitials() }}</span>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">{{ authStore.user?.nom || 'Utilisateur' }}</h3>
            <p class="text-gray-600">{{ getRoleName() }}</p>
            <button class="mt-2 text-sm text-blue-600 hover:text-blue-700">Changer la photo</button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
            <input type="text" :value="authStore.user?.nom || ''" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" readonly />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" :value="authStore.user?.email || ''" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" readonly />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
            <input type="text" :value="getRoleName()" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" readonly />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Département</label>
            <input type="text" :value="authStore.user?.departement_nom || authStore.user?.departement || 'Non défini'" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" readonly />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ID Utilisateur</label>
            <input type="text" :value="authStore.user?.id || ''" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" readonly />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Département ID</label>
            <input type="text" :value="authStore.user?.departement_id || ''" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" readonly />
          </div>
          <div v-if="authStore.user?.solde_conges !== undefined">
            <label class="block text-sm font-medium text-gray-700 mb-2">Solde de congés</label>
            <input type="text" :value="authStore.user?.solde_conges + ' jours'" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" readonly />
          </div>
          <div v-if="authStore.user?.temps_travail">
            <label class="block text-sm font-medium text-gray-700 mb-2">Temps de travail</label>
            <input type="text" :value="authStore.user?.temps_travail + 'h/semaine'" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" readonly />
          </div>
        </div>
        
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 class="text-sm font-medium text-gray-900 mb-2">Informations complémentaires</h4>
          <div class="text-sm text-gray-600 space-y-1">
            <p><strong>Statut :</strong> {{ authStore.user?.actif ? 'Actif' : 'Inactif' }}</p>
            <p v-if="authStore.user?.date_embauche"><strong>Date d'embauche :</strong> {{ formatDate(authStore.user.date_embauche) }}</p>
            <p v-if="authStore.user?.chef_id"><strong>Chef ID :</strong> {{ authStore.user.chef_id }}</p>
          </div>
        </div>
      </div>

      <!-- Notifications Tab -->
      <div v-show="activeTab === 'notifications'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Notifications</h2>
        
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Notifications email</h3>
              <p class="text-sm text-gray-600">Recevoir des notifications par email</p>
            </div>
            <label class="inline-flex items-center">
              <input type="checkbox" checked class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
            </label>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Demandes de congés</h3>
              <p class="text-sm text-gray-600">Notifications pour les nouvelles demandes</p>
            </div>
            <label class="inline-flex items-center">
              <input type="checkbox" checked class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
            </label>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Approbations</h3>
              <p class="text-sm text-gray-600">Notifications quand vos demandes sont approuvées</p>
            </div>
            <label class="inline-flex items-center">
              <input type="checkbox" checked class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
            </label>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Rappels</h3>
              <p class="text-sm text-gray-600">Rappels avant les congés programmés</p>
            </div>
            <label class="inline-flex items-center">
              <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
            </label>
          </div>
        </div>
      </div>

      <!-- Security Tab -->
      <div v-show="activeTab === 'security'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Sécurité</h2>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-sm font-medium text-gray-900 mb-3">Changer le mot de passe</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                <input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                <input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
                <input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div class="flex justify-end">
                <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Mettre à jour le mot de passe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'ParametresView',
  setup() {
    const activeTab = ref('profile')
    const authStore = useAuthStore()

    const getUserInitials = () => {
      if (authStore.user?.nom) {
        const initials = authStore.user.nom.split(' ').map(word => word[0]).join('')
        return initials.toUpperCase()
      }
      return 'U'
    }

    const getRoleName = () => {
      const badges = {
        'employe': 'Employé',
        'chef_service': 'Chef de service',
        'drh': 'DRH'
      }
      return authStore.user?.role ? badges[authStore.user.role] || authStore.user.role : 'Utilisateur'
    }

    const formatDate = (date) => {
      if (!date) return ''
      const formattedDate = new Date(date).toLocaleDateString('fr-FR')
      return formattedDate
    }

    return {
      activeTab,
      authStore,
      getUserInitials,
      getRoleName,
      formatDate
    }
  }
}
</script>

<style scoped>
/* Animation pour les transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Styles pour les onglets actifs */
.border-blue-500 {
  border-color: #3b82f6;
}

.text-blue-600 {
  color: #2563eb;
}

/* Hover effects */
.hover\:text-gray-700:hover {
  color: #374151;
}

.hover\:border-gray-300:hover {
  border-color: #d1d5db;
}
</style> 