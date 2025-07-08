<template>
  <div class="relative">
    <!-- Bouton de notification -->
    <button 
      @click="toggleDropdown"
      class="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
      :class="{ 'text-blue-600 bg-blue-50': isOpen }"
    >
      <Bell :size="20" />
      <!-- Badge avec le nombre de notifications non lues -->
      <span 
        v-if="nombreNonLues > 0" 
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
      >
        {{ nombreNonLues > 99 ? '99+' : nombreNonLues }}
      </span>
    </button>

    <!-- Dropdown des notifications -->
    <div 
      v-if="isOpen"
      class="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
      @click.stop
    >
      <!-- Header du dropdown -->
      <div class="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
        <div class="flex items-center space-x-2">
          <!-- Bouton marquer toutes comme lues -->
          <button 
            v-if="nombreNonLues > 0"
            @click="marquerToutesCommeLues"
            class="text-sm text-blue-600 hover:text-blue-800 font-medium"
            :disabled="loading"
          >
            Tout marquer comme lu
          </button>
          <!-- Bouton actualiser -->
          <button 
            @click="actualiserNotifications"
            class="p-1 text-gray-400 hover:text-gray-600 rounded"
            :disabled="loading"
            :class="{ 'animate-spin': loading }"
          >
            <RotateCw :size="16" />
          </button>
        </div>
      </div>

      <!-- Liste des notifications -->
      <div class="max-h-96 overflow-y-auto">
        <!-- Loading state -->
        <div v-if="loading && notifications.length === 0" class="p-4 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-sm text-gray-600">Chargement des notifications...</p>
        </div>

        <!-- Pas de notifications -->
        <div v-else-if="notifications.length === 0" class="p-8 text-center">
          <div class="text-gray-400 mb-2">
            <Bell :size="48" class="mx-auto" />
          </div>
          <p class="text-gray-600 font-medium">Aucune notification</p>
          <p class="text-sm text-gray-500 mt-1">Vous êtes à jour !</p>
        </div>

        <!-- Liste des notifications -->
        <div v-else class="divide-y divide-gray-100">
          <div 
            v-for="notification in notifications" 
            :key="notification.id"
            class="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            :class="{ 'bg-blue-50': !notification.lue }"
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
                  <h4 class="text-sm font-medium text-gray-900 truncate">
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
                <p class="mt-1 text-sm text-gray-600 line-clamp-2">
                  {{ notification.message }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer avec lien vers toutes les notifications (optionnel) -->
      <div class="p-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <button 
          @click="voirToutesLesNotifications"
          class="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Voir toutes les notifications
        </button>
      </div>
    </div>

    <!-- Overlay pour fermer le dropdown -->
    <div 
      v-if="isOpen"
      class="fixed inset-0 z-40"
      @click="closeDropdown"
    ></div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { Bell, RotateCw } from 'lucide-vue-next'
import { useNotifications } from '../composables/useNotifications'
import { useRouter } from 'vue-router'

export default {
  name: 'NotificationDropdown',
  components: {
    Bell,
    RotateCw
  },
  setup() {
    const router = useRouter()
    const isOpen = ref(false)
    
    const {
      notifications,
      nombreNonLues,
      loading,
      getNotifications,
      marquerCommeLue,
      marquerToutesCommeLues,
      formaterTemps,
      getIconeType,
      getCouleurType,
      startPolling,
      stopPolling
    } = useNotifications()

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value
      if (isOpen.value && notifications.value.length === 0) {
        getNotifications()
      }
    }

    const closeDropdown = () => {
      isOpen.value = false
    }

    const actualiserNotifications = async () => {
      await getNotifications()
    }

    const handleNotificationClick = async (notification) => {
      // Marquer comme lue si pas encore lu
      if (!notification.lue) {
        await marquerCommeLue(notification.id)
      }

      // Rediriger vers la page pertinente si c'est lié à une demande de congé
      if (notification.demande_conge_id) {
        closeDropdown()
        router.push('/demandes')
      }
    }

    const voirToutesLesNotifications = () => {
      closeDropdown()
      // Rediriger vers une page dédiée aux notifications (à créer si nécessaire)
      // ou vers les paramètres avec l'onglet notifications
      router.push('/parametres?tab=notifications')
    }

    const handleMarquerToutesCommeLues = async () => {
      await marquerToutesCommeLues()
    }

    // Charger les notifications au montage
    onMounted(() => {
      getNotifications()
      startPolling(60000) // Polling toutes les minutes
    })

    // Nettoyer le polling au démontage
    onUnmounted(() => {
      stopPolling()
    })

    // Fermer le dropdown quand on clique en dehors
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        closeDropdown()
      }
    }

    return {
      isOpen,
      notifications,
      nombreNonLues,
      loading,
      toggleDropdown,
      closeDropdown,
      actualiserNotifications,
      handleNotificationClick,
      voirToutesLesNotifications,
      marquerToutesCommeLues: handleMarquerToutesCommeLues,
      formaterTemps,
      getIconeType,
      getCouleurType,
      handleClickOutside
    }
  }
}
</script>

<style scoped>
/* Styles pour limiter le nombre de lignes du texte */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animation pour le dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style> 