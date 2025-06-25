<script>
export default {
  name: 'MonEquipeView',
  data() {
    return {
      equipe: [
        { id: 1, nom: 'Pierre Martin', poste: 'Développeur Senior', soldeConges: 18, status: 'Présent', derniereAbsence: '2025-02-15' },
        { id: 2, nom: 'Marie Dubois', poste: 'Développeuse Frontend', soldeConges: 22, status: 'En congé', derniereAbsence: '2025-03-01' },
        { id: 3, nom: 'Jean Leroy', poste: 'DevOps', soldeConges: 20, status: 'Présent', derniereAbsence: '2025-01-20' },
        { id: 4, nom: 'Sarah Durand', poste: 'UI/UX Designer', soldeConges: 25, status: 'Présent', derniereAbsence: '2025-02-28' }
      ],
      demandesEnAttente: [
        { id: 1, employe: 'Pierre Martin', type: 'Congés payés', periode: '15-20 Mars', jours: 4, raison: 'Vacances' },
        { id: 2, employe: 'Sarah Durand', type: 'RTT', periode: '22 Mars', jours: 1, raison: 'Rendez-vous médical' }
      ]
    }
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case 'Présent': return 'bg-green-100 text-green-800'
        case 'En congé': return 'bg-orange-100 text-orange-800'
        case 'Absent': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    },
    approuverDemande(demande) {
      // Logique d'approbation
      console.log('Demande approuvée:', demande)
    },
    refuserDemande(demande) {
      // Logique de refus
      console.log('Demande refusée:', demande)
    }
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h1 class="text-2xl font-bold text-gray-900">Mon équipe</h1>
      <p class="text-gray-600 mt-2">Gestion des congés de votre équipe</p>
    </div>

    <!-- Stats de l'équipe -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total équipe</p>
            <p class="text-2xl font-bold text-gray-900">{{ equipe.length }}</p>
          </div>
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
            <p class="text-sm font-medium text-gray-600">Présents</p>
            <p class="text-2xl font-bold text-gray-900">{{ equipe.filter(e => e.status === 'Présent').length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 rounded-lg">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">En congé</p>
            <p class="text-2xl font-bold text-gray-900">{{ equipe.filter(e => e.status === 'En congé').length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Demandes en attente</p>
            <p class="text-2xl font-bold text-gray-900">{{ demandesEnAttente.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Demandes en attente -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Demandes en attente d'approbation</h3>
      <div class="space-y-4">
        <div 
          v-for="demande in demandesEnAttente" 
          :key="demande.id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div class="flex-1">
            <div class="flex items-center">
              <h4 class="font-medium text-gray-900">{{ demande.employe }}</h4>
              <span class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{{ demande.type }}</span>
            </div>
            <p class="text-sm text-gray-600 mt-1">
              {{ demande.periode }} • {{ demande.jours }} jour{{ demande.jours > 1 ? 's' : '' }}
            </p>
            <p class="text-sm text-gray-500">{{ demande.raison }}</p>
          </div>
          <div class="flex space-x-2">
            <button 
              @click="approuverDemande(demande)"
              class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Approuver
            </button>
            <button 
              @click="refuserDemande(demande)"
              class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Refuser
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste de l'équipe -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Membres de l'équipe</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employé</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Poste</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Solde congés</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière absence</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="membre in equipe" :key="membre.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ membre.nom }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ membre.poste }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-900">{{ membre.soldeConges }} jours</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full', getStatusColor(membre.status)]">
                  {{ membre.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ membre.derniereAbsence }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template> 