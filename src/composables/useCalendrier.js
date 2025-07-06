import { ref, computed } from 'vue'
import { useApi } from './useApi'

export function useCalendrier() {
  const api = useApi()
  
  // États réactifs
  const currentDate = ref(new Date())
  const calendarData = ref({})
  const loading = ref(false)

  // Computed properties pour les informations du mois
  const currentYear = computed(() => currentDate.value.getFullYear())
  const currentMonth = computed(() => currentDate.value.getMonth() + 1)
  const monthName = computed(() => {
    const options = { month: 'long', year: 'numeric' }
    return currentDate.value.toLocaleDateString('fr-FR', options)
  })

  // Récupérer les congés pour un mois donné
  const getCalendrierConges = async (year = currentYear.value, month = currentMonth.value) => {
    loading.value = true
    try {
      const response = await api.get(`/demandes-conges/calendrier/${year}/${month}`)
      if (response) {
        calendarData.value = response
      }
      return response
    } catch (error) {
      console.error('Erreur lors du chargement des congés du calendrier:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Navigation dans le calendrier
  const goToPreviousMonth = async () => {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(newDate.getMonth() - 1)
    currentDate.value = newDate
    await getCalendrierConges(newDate.getFullYear(), newDate.getMonth() + 1)
  }

  const goToNextMonth = async () => {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(newDate.getMonth() + 1)
    currentDate.value = newDate
    await getCalendrierConges(newDate.getFullYear(), newDate.getMonth() + 1)
  }

  const goToToday = async () => {
    currentDate.value = new Date()
    await getCalendrierConges()
  }

  // Utilitaires pour le calendrier
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    const firstDay = new Date(year, month - 1, 1).getDay()
    // Ajuster pour que lundi soit 0 et dimanche soit 6
    return firstDay === 0 ? 6 : firstDay - 1
  }

  const isToday = (day) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentMonth.value === today.getMonth() + 1 &&
      currentYear.value === today.getFullYear()
    )
  }

  const getCongesForDay = (day) => {
    if (!calendarData.value.congres) return []
    
    const targetDate = new Date(currentYear.value, currentMonth.value - 1, day)
    
    return calendarData.value.congres.filter(conge => {
      const dateDebut = new Date(conge.date_debut)
      const dateFin = new Date(conge.date_fin)
      
      return targetDate >= dateDebut && targetDate <= dateFin
    })
  }

  // Générer les données du calendrier pour l'affichage
  const generateCalendarGrid = computed(() => {
    const year = currentYear.value
    const month = currentMonth.value
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)
    
    const grid = []
    let dayCount = 1
    
    // Calculer le nombre de semaines nécessaires
    const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7
    
    for (let i = 0; i < totalCells; i++) {
      if (i < firstDayOfMonth) {
        // Jours du mois précédent
        const prevMonth = month === 1 ? 12 : month - 1
        const prevYear = month === 1 ? year - 1 : year
        const prevMonthDays = getDaysInMonth(prevYear, prevMonth)
        const day = prevMonthDays - firstDayOfMonth + i + 1
        
        grid.push({
          day,
          isCurrentMonth: false,
          isToday: false,
          conges: []
        })
      } else if (dayCount <= daysInMonth) {
        // Jours du mois courant
        grid.push({
          day: dayCount,
          isCurrentMonth: true,
          isToday: isToday(dayCount),
          conges: getCongesForDay(dayCount)
        })
        dayCount++
      } else {
        // Jours du mois suivant
        const nextDay = dayCount - daysInMonth
        grid.push({
          day: nextDay,
          isCurrentMonth: false,
          isToday: false,
          conges: []
        })
        dayCount++
      }
    }
    
    return grid
  })

  // Obtenir la couleur selon le type de congé
  const getCongeColor = (typeConge) => {
    const colors = {
      'conges_payes': 'bg-blue-100 text-blue-800',
      'conges_maladie': 'bg-red-100 text-red-800',
      'conges_maternite': 'bg-pink-100 text-pink-800',
      'conges_paternite': 'bg-purple-100 text-purple-800',
      'conges_sans_solde': 'bg-gray-100 text-gray-800',
      'rtt': 'bg-green-100 text-green-800',
      'autre': 'bg-yellow-100 text-yellow-800'
    }
    return colors[typeConge] || 'bg-gray-100 text-gray-800'
  }

  // Obtenir le libellé du type de congé
  const getCongeLabel = (typeConge) => {
    const labels = {
      'conges_payes': 'Vacances',
      'conges_maladie': 'Maladie',
      'conges_maternite': 'Maternité',
      'conges_paternite': 'Paternité',
      'conges_sans_solde': 'Sans solde',
      'rtt': 'RTT',
      'autre': 'Autre'
    }
    return labels[typeConge] || 'Congé'
  }

  return {
    // États
    currentDate,
    calendarData,
    loading: computed(() => api.loading.value || loading.value),
    
    // Computed
    currentYear,
    currentMonth,
    monthName,
    generateCalendarGrid,
    
    // Méthodes
    getCalendrierConges,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    getDaysInMonth,
    getFirstDayOfMonth,
    isToday,
    getCongesForDay,
    getCongeColor,
    getCongeLabel
  }
} 