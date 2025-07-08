import { useApi } from './useApi'
import { ref, computed } from 'vue'

export function useNotifications() {
  const api = useApi()
  
  // État local pour les notifications
  const notifications = ref([])
  const loading = ref(false)
  
  // Computed pour les notifications non lues
  const notificationsNonLues = computed(() => 
    notifications.value.filter(notif => !notif.lue)
  )
  
  const nombreNonLues = computed(() => notificationsNonLues.value.length)
  
  // Récupérer toutes les notifications
  const getNotifications = async (nonLuesSeulment = false, limit = 50) => {
    loading.value = true
    try {
      const params = new URLSearchParams()
      if (nonLuesSeulment) params.append('non_lues_seulement', 'true')
      if (limit) params.append('limit', limit.toString())
      
      const queryString = params.toString()
      const endpoint = queryString ? `/notifications/?${queryString}` : '/notifications/'
      
      const result = await api.get(endpoint)
      notifications.value = result || []
      return result
    } finally {
      loading.value = false
    }
  }
  
  // Récupérer le nombre de notifications non lues
  const getNotificationsCount = async () => {
    try {
      const result = await api.get('/notifications/count')
      return result?.total_non_lues || 0
    } catch (error) {
      console.error('Erreur lors de la récupération du count:', error)
      return 0
    }
  }
  
  // Marquer une notification comme lue
  const marquerCommeLue = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/marquer-lue`)
      
      // Mettre à jour l'état local
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.lue = true
        notification.date_lecture = new Date().toISOString()
      }
      
      return true
    } catch (error) {
      console.error('Erreur lors du marquage comme lue:', error)
      return false
    }
  }
  
  // Marquer toutes les notifications comme lues
  const marquerToutesCommeLues = async () => {
    try {
      await api.put('/notifications/marquer-toutes-lues')
      
      // Mettre à jour l'état local
      notifications.value.forEach(notification => {
        if (!notification.lue) {
          notification.lue = true
          notification.date_lecture = new Date().toISOString()
        }
      })
      
      return true
    } catch (error) {
      console.error('Erreur lors du marquage de toutes comme lues:', error)
      return false
    }
  }
  
  // Formatage de l'heure pour affichage
  const formaterTemps = (dateString) => {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    const maintenant = new Date()
    const diffMs = maintenant - date
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHeures = Math.floor(diffMs / (1000 * 60 * 60))
    const diffJours = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffMinutes < 1) return 'À l\'instant'
    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`
    if (diffHeures < 24) return `Il y a ${diffHeures}h`
    if (diffJours < 7) return `Il y a ${diffJours} jour${diffJours > 1 ? 's' : ''}`
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
  
  // Obtenir l'icône selon le type de notification
  const getIconeType = (typeNotification) => {
    const icones = {
      'nouvelle_demande': '📝',
      'demande_approuvee': '✅',
      'demande_refusee': '❌',
      'rappel_retour_conge': '🔔',
      'rappel_15_jours': '⏰',
      'demande_annulation': '🔄',
      'annulation_approuvee': '✅',
      'annulation_refusee': '❌'
    }
    return icones[typeNotification] || '📢'
  }
  
  // Obtenir la couleur selon le type de notification
  const getCouleurType = (typeNotification) => {
    const couleurs = {
      'nouvelle_demande': 'text-blue-600 bg-blue-100',
      'demande_approuvee': 'text-green-600 bg-green-100',
      'demande_refusee': 'text-red-600 bg-red-100',
      'rappel_retour_conge': 'text-yellow-600 bg-yellow-100',
      'rappel_15_jours': 'text-orange-600 bg-orange-100',
      'demande_annulation': 'text-purple-600 bg-purple-100',
      'annulation_approuvee': 'text-green-600 bg-green-100',
      'annulation_refusee': 'text-red-600 bg-red-100'
    }
    return couleurs[typeNotification] || 'text-gray-600 bg-gray-100'
  }
  
  // Polling pour les notifications en temps réel (optionnel)
  let pollingInterval = null
  
  const startPolling = (intervalMs = 30000) => { // 30 secondes par défaut
    if (pollingInterval) return
    
    pollingInterval = setInterval(async () => {
      try {
        await getNotifications()
      } catch (error) {
        console.error('Erreur lors du polling des notifications:', error)
      }
    }, intervalMs)
  }
  
  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }
  
  return {
    // État
    notifications,
    notificationsNonLues,
    nombreNonLues,
    loading,
    
    // Actions
    getNotifications,
    getNotificationsCount,
    marquerCommeLue,
    marquerToutesCommeLues,
    
    // Utilitaires
    formaterTemps,
    getIconeType,
    getCouleurType,
    
    // Polling
    startPolling,
    stopPolling
  }
} 