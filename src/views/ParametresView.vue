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
          @click="switchTab('profile')"
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
          @click="switchTab('notifications')"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === 'notifications'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <div class="flex items-center">
            <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            Notifications
          </div>
        </button>
        <button
          @click="switchTab('security')"
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
          <div class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            <svg class="inline h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Lecture seule
          </div>
        </div>
        
        <div class="flex items-center space-x-6 mb-8">
          <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <span class="text-white text-xl font-semibold">{{ getUserInitials() }}</span>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">{{ authStore.user?.nom || 'Utilisateur' }}</h3>
            <p class="text-gray-600">{{ getRoleName() }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ authStore.user?.email || '' }}</p>
          </div>
        </div>
        
        <!-- Informations personnelles -->
        <div class="space-y-6">
          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-4">Identité</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 rounded-lg">
                <dt class="text-sm font-medium text-gray-500">Nom complet</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ authStore.user?.nom || 'Non défini' }}</dd>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ authStore.user?.email || 'Non défini' }}</dd>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <dt class="text-sm font-medium text-gray-500">Téléphone</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ authStore.user?.telephone || 'Non défini' }}</dd>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <dt class="text-sm font-medium text-gray-500">Numéro de pièce d'identité</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ authStore.user?.numero_piece_identite || 'Non défini' }}</dd>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-4">Informations professionnelles</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 rounded-lg">
                <dt class="text-sm font-medium text-gray-500">Rôle</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ getRoleName() }}</dd>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <dt class="text-sm font-medium text-gray-500">Poste</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ authStore.user?.poste || 'Non défini' }}</dd>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <dt class="text-sm font-medium text-gray-500">Département</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ authStore.user?.departement_nom || authStore.user?.departement || 'Non défini' }}</dd>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <dt class="text-sm font-medium text-gray-500">Date d'embauche</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(authStore.user?.date_embauche) || 'Non défini' }}</dd>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-4">Congés et temps de travail</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-green-50 rounded-lg border border-green-200">
                <dt class="text-sm font-medium text-green-800">Solde de congés</dt>
                <dd class="mt-1 text-2xl font-semibold text-green-900">{{ authStore.user?.solde_conges || 0 }} jours</dd>
              </div>
              <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <dt class="text-sm font-medium text-blue-800">Temps de travail</dt>
                <dd class="mt-1 text-2xl font-semibold text-blue-900">{{ authStore.user?.temps_travail || 'Non défini' }}h/semaine</dd>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-4">Informations système</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 bg-gray-50 rounded-lg">
                <dt class="text-sm font-medium text-gray-500">ID Utilisateur</dt>
                <dd class="mt-1 text-sm text-gray-900 font-mono">{{ authStore.user?.id || 'Non défini' }}</dd>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <dt class="text-sm font-medium text-gray-500">Département ID</dt>
                <dd class="mt-1 text-sm text-gray-900 font-mono">{{ authStore.user?.departement_id || 'Non défini' }}</dd>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <dt class="text-sm font-medium text-gray-500">Statut</dt>
                <dd class="mt-1 text-sm">
                  <span :class="authStore.user?.is_active ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ authStore.user?.is_active ? 'Actif' : 'Inactif' }}
                  </span>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications Tab -->
      <div v-show="activeTab === 'notifications'" class="space-y-6">
        <!-- Header avec actions -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">Notifications</h2>
            <div class="flex items-center space-x-3">
              <button 
                @click="getNotifications()"
                :disabled="notificationsLoading"
                class="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Actualiser
              </button>
              <button 
                @click="marquerToutesCommeLues()"
                v-if="notifications.some(n => !n.lue)"
                class="text-sm text-green-600 hover:text-green-800 font-medium"
              >
                Tout marquer comme lu
              </button>
            </div>
          </div>
          
          <!-- Préférences de notification -->
          <div class="border-b border-gray-200 pb-6 mb-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Préférences</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Notifications email</h4>
                  <p class="text-sm text-gray-600">Recevoir des notifications par email</p>
                </div>
                <label class="inline-flex items-center">
                  <input type="checkbox" disabled class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
                </label>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Demandes de congés</h4>
                  <p class="text-sm text-gray-600">Notifications pour les nouvelles demandes</p>
                </div>
                <label class="inline-flex items-center">
                  <input type="checkbox" disabled checked class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
                </label>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Approbations</h4>
                  <p class="text-sm text-gray-600">Notifications quand vos demandes sont approuvées</p>
                </div>
                <label class="inline-flex items-center">
                  <input type="checkbox" disabled checked class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
                </label>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Rappels</h4>
                  <p class="text-sm text-gray-600">Rappels avant les congés programmés</p>
                </div>
                <label class="inline-flex items-center">
                  <input type="checkbox" disabled checked class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
                </label>
              </div>
            </div>
          </div>
          
          <!-- Liste des notifications -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Historique des notifications</h3>
            
            <!-- Loading state -->
            <div v-if="notificationsLoading && notifications.length === 0" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-2 text-sm text-gray-600">Chargement des notifications...</p>
            </div>
            
            <!-- Pas de notifications -->
            <div v-else-if="notifications.length === 0" class="text-center py-8">
              <div class="text-gray-400 mb-2">
                <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zm-5-7a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-gray-600 font-medium">Aucune notification</p>
              <p class="text-sm text-gray-500 mt-1">Vous êtes à jour !</p>
            </div>
            
            <!-- Liste des notifications -->
            <div v-else class="space-y-3">
              <div 
                v-for="notification in notifications" 
                :key="notification.id"
                class="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                :class="{ 'bg-blue-50 border-blue-200': !notification.lue }"
                @click="handleNotificationClick(notification)"
              >
                <div class="flex items-start space-x-3">
                  <!-- Icône de type -->
                  <div 
                    class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    :class="getCouleurType(notification.type_notification)"
                  >
                    {{ getIconeType(notification.type_notification) }}
                  </div>

                  <!-- Contenu -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <h4 class="text-sm font-medium text-gray-900">
                        {{ notification.titre }}
                      </h4>
                      <div class="flex items-center space-x-2">
                        <!-- Indicateur non lu -->
                        <div 
                          v-if="!notification.lue" 
                          class="w-2 h-2 bg-blue-600 rounded-full"
                        ></div>
                        <!-- Temps -->
                        <span class="text-xs text-gray-500 whitespace-nowrap">
                          {{ formaterTemps(notification.date_creation) }}
                        </span>
                      </div>
                    </div>
                    <p class="mt-1 text-sm text-gray-600">
                      {{ notification.message }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
                <input 
                  type="password" 
                  v-model="passwordForm.currentPassword"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :class="{ 'border-red-500': passwordForm.errors.currentPassword }"
                />
                <p v-if="passwordForm.errors.currentPassword" class="mt-1 text-sm text-red-600">{{ passwordForm.errors.currentPassword }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                <input 
                  type="password" 
                  v-model="passwordForm.newPassword"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :class="{ 'border-red-500': passwordForm.errors.newPassword }"
                />
                <p v-if="passwordForm.errors.newPassword" class="mt-1 text-sm text-red-600">{{ passwordForm.errors.newPassword }}</p>
                <p class="mt-1 text-sm text-gray-500">Le mot de passe doit contenir au moins 6 caractères</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
                <input 
                  type="password" 
                  v-model="passwordForm.confirmPassword"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :class="{ 'border-red-500': passwordForm.errors.confirmPassword }"
                />
                <p v-if="passwordForm.errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ passwordForm.errors.confirmPassword }}</p>
              </div>
              
              <!-- Messages de succès ou d'erreur -->
              <div v-if="passwordForm.successMessage" class="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {{ passwordForm.successMessage }}
              </div>
              
              <div v-if="passwordForm.errorMessage" class="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {{ passwordForm.errorMessage }}
              </div>
              
              <div class="flex justify-end">
                <button 
                  @click="changePassword"
                  :disabled="loading"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ loading ? 'Modification en cours...' : 'Mettre à jour le mot de passe' }}
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useAuth } from '../composables/useAuth'
import { useNotifications } from '../composables/useNotifications'

export default {
  name: 'ParametresView',
  setup() {
    const route = useRoute()
    const activeTab = ref('profile')
    const authStore = useAuthStore()
    const { changePassword: changeUserPassword, loading, error } = useAuth()
    
    // Composable notifications
    const {
      notifications,
      loading: notificationsLoading,
      getNotifications,
      marquerCommeLue,
      marquerToutesCommeLues,
      formaterTemps,
      getIconeType,
      getCouleurType
    } = useNotifications()

    // Définir l'onglet actif selon les query params
    onMounted(() => {
      if (route.query.tab) {
        activeTab.value = route.query.tab
      }
      
      // Charger les notifications si on est sur l'onglet notifications
      if (activeTab.value === 'notifications') {
        getNotifications()
      }
    })

    // Formulaire de changement de mot de passe
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      successMessage: '',
      errorMessage: '',
      errors: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    })

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

    const validatePasswordForm = () => {
      const errors = {}
      
      if (!passwordForm.value.currentPassword) {
        errors.currentPassword = 'Le mot de passe actuel est requis'
      }
      
      if (!passwordForm.value.newPassword) {
        errors.newPassword = 'Le nouveau mot de passe est requis'
      } else if (passwordForm.value.newPassword.length < 6) {
        errors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères'
      }
      
      if (!passwordForm.value.confirmPassword) {
        errors.confirmPassword = 'La confirmation du mot de passe est requise'
      } else if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        errors.confirmPassword = 'Les mots de passe ne correspondent pas'
      }
      
      passwordForm.value.errors = errors
      return Object.keys(errors).length === 0
    }

    const changePassword = async () => {
      // Réinitialiser les messages
      passwordForm.value.successMessage = ''
      passwordForm.value.errorMessage = ''
      passwordForm.value.errors = {}
      
      // Valider le formulaire
      if (!validatePasswordForm()) {
        return
      }
      
      try {
        const result = await changeUserPassword(
          passwordForm.value.currentPassword,
          passwordForm.value.newPassword
        )
        
        if (result) {
          passwordForm.value.successMessage = result.message || 'Mot de passe modifié avec succès'
          
          // Réinitialiser le formulaire
          passwordForm.value.currentPassword = ''
          passwordForm.value.newPassword = ''
          passwordForm.value.confirmPassword = ''
          
          // Masquer le message de succès après 5 secondes
          setTimeout(() => {
            passwordForm.value.successMessage = ''
          }, 5000)
        }
      } catch (err) {
        console.error('Erreur lors du changement de mot de passe:', err)
        passwordForm.value.errorMessage = err.message || 'Erreur lors du changement de mot de passe'
      }
    }

    // Gérer le changement d'onglet avec chargement des notifications
    const switchTab = async (tab) => {
      activeTab.value = tab
      if (tab === 'notifications' && notifications.value.length === 0) {
        await getNotifications()
      }
    }

    // Gérer le clic sur une notification
    const handleNotificationClick = async (notification) => {
      if (!notification.lue) {
        await marquerCommeLue(notification.id)
      }
    }

    return {
      activeTab,
      authStore,
      passwordForm,
      loading,
      getUserInitials,
      getRoleName,
      formatDate,
      changePassword,
      switchTab,
      // Notifications
      notifications,
      notificationsLoading,
      getNotifications,
      marquerCommeLue,
      marquerToutesCommeLues,
      formaterTemps,
      getIconeType,
      getCouleurType,
      handleNotificationClick
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