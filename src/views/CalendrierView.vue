<script setup>
import { onMounted } from 'vue'
import { useCalendrier } from '@/composables/useCalendrier'
import { useAuthStore } from '@/stores/auth'

// Composables
const { 
  currentDate, 
  monthName, 
  loading, 
  calendarData,
  generateCalendarGrid,
  getCalendrierConges,
  goToPreviousMonth,
  goToNextMonth,
  goToToday,
  getCongeColor,
  getCongeLabel
} = useCalendrier()

const authStore = useAuthStore()

// Charger les données au montage
onMounted(async () => {
  await getCalendrierConges()
})

// Jours de la semaine
const joursSemaine = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Calendrier des congés</h1>
        <p class="text-gray-600">
          <span v-if="authStore.isEmploye">Visualisez vos congés</span>
          <span v-else-if="authStore.isChefService">Visualisez les congés de votre équipe</span>
          <span v-else>Visualisez les congés de l'organisation</span>
        </p>
      </div>
      <div class="flex space-x-3">
        <button 
          @click="goToToday"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          Aujourd'hui
        </button>
        <router-link 
          to="/demandes" 
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Nouvelle demande
        </router-link>
      </div>
    </div>

    <!-- Calendar controls -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button 
            @click="goToPreviousMonth"
            :disabled="loading"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <h2 class="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
            {{ monthName }}
          </h2>
          <button 
            @click="goToNextMonth"
            :disabled="loading"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
        
        <!-- Légende -->
        <div class="flex items-center space-x-4 text-sm">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-blue-100 rounded"></div>
            <span class="text-gray-600">Congés payés</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-100 rounded"></div>
            <span class="text-gray-600">RTT</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-red-100 rounded"></div>
            <span class="text-gray-600">Maladie</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="flex items-center space-x-2">
          <svg class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-gray-600">Chargement du calendrier...</span>
        </div>
      </div>

      <!-- Calendar content -->
      <div v-else>
        <!-- Calendar header -->
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div 
            v-for="jour in joursSemaine" 
            :key="jour"
            class="p-4 text-center text-sm font-semibold text-gray-600 bg-gray-50 rounded-lg"
          >
            {{ jour }}
          </div>
        </div>

        <!-- Calendar body -->
        <div class="grid grid-cols-7 gap-1">
          <div 
            v-for="(cell, index) in generateCalendarGrid" 
            :key="index"
            :class="[
              'p-2 h-32 text-sm cursor-pointer transition-colors rounded-lg border overflow-hidden',
              cell.isToday 
                ? 'bg-blue-100 border-2 border-blue-400' 
                : '',
              cell.isCurrentMonth 
                ? 'bg-white hover:bg-gray-50 border-gray-200' 
                : 'bg-gray-50 border-gray-100',
            ]"
          >
            <!-- Numéro du jour -->
            <div 
              :class="[
                'font-medium mb-2',
                cell.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
                cell.isToday ? 'text-blue-900 font-semibold' : ''
              ]"
            >
              {{ cell.day }}
              <span v-if="cell.isToday" class="text-xs text-blue-700 block">Aujourd'hui</span>
            </div>

            <!-- Congés du jour -->
            <div class="space-y-1">
              <div 
                v-for="(conge, congeIndex) in cell.conges.slice(0, 2)" 
                :key="congeIndex"
                :class="[
                  'text-xs px-2 py-1 rounded-full truncate',
                  getCongeColor(conge.type_conge)
                ]"
                :title="`${conge.user?.prenom} ${conge.user?.nom} - ${getCongeLabel(conge.type_conge)}`"
              >
                {{ conge.user?.prenom }} - {{ getCongeLabel(conge.type_conge) }}
              </div>
              
              <!-- Indicateur si plus de congés -->
              <div 
                v-if="cell.conges.length > 2"
                class="text-xs text-gray-500 text-center"
              >
                +{{ cell.conges.length - 2 }} autre{{ cell.conges.length - 2 > 1 ? 's' : '' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Résumé des congés du mois -->
    <div v-if="!loading" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Résumé du mois</h3>
      
      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <p class="text-2xl font-bold text-blue-600">
            {{ calendarData.conges?.length || 0 }}
          </p>
          <p class="text-sm text-gray-600">
            {{ calendarData.conges?.length > 1 ? 'Congés' : 'Congé' }} ce mois
          </p>
        </div>
        
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <p class="text-2xl font-bold text-green-600">
            {{ calendarData.conges?.reduce((total, conge) => total + (conge.working_time || 0), 0) || 0 }}
          </p>
          <p class="text-sm text-gray-600">Jours ouvrés</p>
        </div>
        
        <div class="text-center p-4 bg-purple-50 rounded-lg">
          <p class="text-2xl font-bold text-purple-600">
            {{ new Set(calendarData.conges?.map(conge => conge.demandeur_id) || []).size }}
          </p>
          <p class="text-sm text-gray-600">
            {{ new Set(calendarData.conges?.map(conge => conge.demandeur_id) || []).size > 1 ? 'Personnes' : 'Personne' }} en congé
          </p>
        </div>
      </div>
    </div>
  </div>
</template> 