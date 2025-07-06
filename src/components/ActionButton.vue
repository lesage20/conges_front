<template>
  <div class="flex items-center space-x-2">
    <button
      v-for="action in actions"
      :key="action.action"
      @click="handleAction(action)"
      :class="[
        'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200',
        'flex items-center space-x-1',
        getButtonClass(action.color),
        { 'opacity-50 cursor-not-allowed': loading }
      ]"
      :disabled="loading"
    >
      <!-- Icônes SVG directes -->
      <svg v-if="action.icon === 'check'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <svg v-else-if="action.icon === 'x'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
      <svg v-else-if="action.icon === 'edit'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
      </svg>
      <svg v-else-if="action.icon === 'trash'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
      </svg>
      <svg v-else-if="action.icon === 'undo'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
      </svg>
      <svg v-else-if="action.icon === 'document'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <svg v-else-if="action.icon === 'eye'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
      </svg>
      <svg v-else-if="action.icon === 'download'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <span>{{ action.label }}</span>
    </button>
  </div>

  <!-- Modal pour les actions nécessitant une confirmation -->
  <BaseModal 
    v-model="showModal" 
    :title="modalTitle"
    @close="closeModal"
  >
    <div v-if="currentAction?.action === 'demander_annulation'" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Motif de l'annulation *
        </label>
        <textarea
          v-model="formData.motifAnnulation"
          rows="4"
          required
          placeholder="Expliquez pourquoi vous souhaitez annuler cette demande..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        ></textarea>
      </div>
    </div>

    <div v-else-if="currentAction?.action === 'approuver' || currentAction?.action === 'refuser'" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Commentaire (optionnel)
        </label>
        <textarea
          v-model="formData.commentaire"
          rows="3"
          :placeholder="currentAction.action === 'approuver' ? 'Commentaire sur l\'approbation...' : 'Raison du refus...'"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        ></textarea>
      </div>
    </div>

    <div v-else-if="currentAction?.action === 'approuver_annulation' || currentAction?.action === 'refuser_annulation'" class="space-y-4">
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div class="flex">
          <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">
              {{ currentAction.action === 'approuver_annulation' ? 'Approuver l\'annulation' : 'Refuser l\'annulation' }}
            </h3>
            <p class="mt-2 text-sm text-yellow-700">
              {{ currentAction.action === 'approuver_annulation' 
                ? 'Cette action annulera définitivement la demande de congé.' 
                : 'Cette action maintiendra la demande de congé comme approuvée.' }}
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Commentaire de validation
        </label>
        <textarea
          v-model="formData.commentaire"
          rows="3"
          placeholder="Commentaire sur la décision..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        ></textarea>
      </div>
    </div>

    <div v-else-if="currentAction?.action === 'annuler'" class="space-y-4">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex">
          <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Confirmer l'annulation</h3>
            <p class="mt-2 text-sm text-red-700">
              Cette action annulera définitivement votre demande de congé. Cette action ne peut pas être annulée.
            </p>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <button 
        type="button" 
        @click="closeModal"
        class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        Annuler
      </button>
      <button 
        @click="confirmAction"
        :disabled="!canConfirm || submitting"
        :class="[
          'px-4 py-2 rounded-lg transition-colors flex items-center',
          currentAction?.color === 'red' 
            ? 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50' 
            : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
        ]"
      >
        <svg v-if="submitting" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ submitting ? 'Traitement...' : 'Confirmer' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import { useDemandesConges } from '@/composables/useDemandesConges'

// Props
const props = defineProps({
  actions: {
    type: Array,
    required: true
  },
  demande: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['action-completed', 'action-error'])

// Composable
const { executeAction, loading } = useDemandesConges()

// État local
const showModal = ref(false)
const submitting = ref(false)
const currentAction = ref(null)
const formData = ref({
  motifAnnulation: '',
  commentaire: ''
})

// Computed
const modalTitle = computed(() => {
  if (!currentAction.value) return ''
  
  const titleMap = {
    'demander_annulation': 'Demander l\'annulation',
    'approuver': 'Approuver la demande',
    'refuser': 'Refuser la demande',
    'approuver_annulation': 'Approuver l\'annulation',
    'refuser_annulation': 'Refuser l\'annulation',
    'annuler': 'Annuler la demande'
  }
  
  return titleMap[currentAction.value.action] || currentAction.value.label
})

const canConfirm = computed(() => {
  if (!currentAction.value) return false
  
  if (currentAction.value.action === 'demander_annulation') {
    return formData.value.motifAnnulation.trim().length > 0
  }
  
  return true
})

// Méthodes
const getButtonClass = (color) => {
  const classes = {
    'blue': 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200',
    'green': 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200',
    'red': 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200',
    'orange': 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200',
    'gray': 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
  }
  return classes[color] || classes.gray
}



const handleAction = async (action) => {
  currentAction.value = action
  
  // Actions qui nécessitent une confirmation/modal
  const modalActions = [
    'demander_annulation', 
    'approuver', 
    'refuser', 
    'approuver_annulation', 
    'refuser_annulation',
    'annuler'
  ]
  
  if (modalActions.includes(action.action)) {
    // Réinitialiser le formulaire
    formData.value = {
      motifAnnulation: '',
      commentaire: ''
    }
    showModal.value = true
    return
  }
  
  // Actions directes
  try {
    let actionData = {}
    
    // Pour le téléchargement d'attestation, passer l'URL complète
    if (action.action === 'telecharger_attestation') {
      actionData.attestationUrl = props.demande.attestation_url
    }
    
    const result = await executeAction(action.action, props.demande.id, actionData)
    
    if (result?.action === 'redirect') {
      // Gérer la navigation (modifier, détails)
      emit('action-completed', { action: action.action, result, redirect: result.url })
    } else {
      emit('action-completed', { action: action.action, result })
    }
  } catch (error) {
    console.error('Erreur lors de l\'exécution de l\'action:', error)
    emit('action-error', { action: action.action, error })
  }
}

const confirmAction = async () => {
  if (!currentAction.value || submitting.value) return
  
  submitting.value = true
  
  try {
    const actionData = {
      commentaire: formData.value.commentaire,
      motifAnnulation: formData.value.motifAnnulation
    }
    
    const result = await executeAction(currentAction.value.action, props.demande.id, actionData)
    
    emit('action-completed', { action: currentAction.value.action, result })
    closeModal()
  } catch (error) {
    console.error('Erreur lors de la confirmation de l\'action:', error)
    emit('action-error', { action: currentAction.value.action, error })
  } finally {
    submitting.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  currentAction.value = null
  formData.value = {
    motifAnnulation: '',
    commentaire: ''
  }
}


</script> 