import { useApi } from './useApi'
import { saveAs } from 'file-saver'

export function useDemandesConges() {
  const api = useApi()

  // Récupérer toutes les demandes de congés (selon rôle utilisateur)
  const getDemandes = async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    const endpoint = queryParams ? `/demandes-conges/?${queryParams}` : '/demandes-conges/'
    return await api.get(endpoint)
  }

  // Récupérer une demande par ID
  const getDemande = async (id) => {
    return await api.get(`/demandes-conges/${id}`)
  }

  // Récupérer les demandes de l'utilisateur connecté
  const getMyDemandes = async () => {
    return await api.get('/demandes-conges/mes-demandes')
  }

  // Récupérer les demandes en attente de validation (Manager/DRH uniquement)
  const getDemandesEnAttente = async () => {
    return await api.get('/demandes-conges/en-attente')
  }

  // Vérifier si l'utilisateur peut créer une nouvelle demande
  const canCreateNewDemande = async () => {
    return await api.get('/demandes-conges/can-create-new')
  }

  // Créer une nouvelle demande de congé
  const createDemande = async (demandeData) => {
    return await api.post('/demandes-conges/', demandeData)
  }

  // Mettre à jour une demande (seulement si en attente et par le demandeur)
  const updateDemande = async (id, demandeData) => {
    return await api.put(`/demandes-conges/${id}`, demandeData)
  }

  // Annuler une demande
  const cancelDemande = async (id) => {
    return await api.delete(`/demandes-conges/${id}`)
  }

  // Valider ou refuser une demande (Manager/DRH uniquement)
  const validerDemande = async (id, statut, commentaire = '') => {
    return await api.post(`/demandes-conges/${id}/valider`, { 
      statut, 
      commentaire_validation: commentaire 
    })
  }

  // Approuver une demande (raccourci pour valider avec statut "approuvee")
  const approuverDemande = async (id, commentaire = '') => {
    return await validerDemande(id, 'approuvee', commentaire)
  }

  // Refuser une demande (raccourci pour valider avec statut "refusee")
  const refuserDemande = async (id, commentaire = '') => {
    return await validerDemande(id, 'refusee', commentaire)
  }

  // Récupérer les statistiques pour le dashboard
  const getDashboardStats = async () => {
    return await api.get('/demandes-conges/stats/dashboard')
  }

  // Récupérer les demandes avec filtres
  const getDemandesWithFilters = async (statut = null, typeConge = null, limit = 50) => {
    const params = new URLSearchParams()
    if (statut) params.append('statut', statut)
    if (typeConge) params.append('type_conge', typeConge)
    if (limit) params.append('limit', limit)
    
    const queryString = params.toString()
    const endpoint = queryString ? `/demandes-conges/?${queryString}` : '/demandes-conges/'
    return await api.get(endpoint)
  }

  // === NOUVELLES FONCTIONS POUR LES ANNULATIONS ===
  
  // Demander l'annulation d'une demande approuvée
  const demanderAnnulation = async (id, motifAnnulation) => {
    return await api.post(`/demandes-conges/${id}/demander-annulation`, {
      motif_annulation: motifAnnulation
    })
  }

  // Traiter une demande d'annulation (DRH uniquement)
  const traiterAnnulation = async (id, statut, commentaire = '') => {
    return await api.post(`/demandes-conges/${id}/traiter-annulation`, {
      statut,
      commentaire_validation: commentaire
    })
  }

  // Approuver une demande d'annulation (raccourci pour DRH)
  const approuverAnnulation = async (id, commentaire = '') => {
    return await traiterAnnulation(id, 'approuvee', commentaire)
  }

  // Refuser une demande d'annulation (raccourci pour DRH)
  const refuserAnnulation = async (id, commentaire = '') => {
    return await traiterAnnulation(id, 'refusee', commentaire)
  }

  // Générer une attestation de congé (DRH uniquement)
  const genererAttestation = async (id) => {
    return await api.get(`/demandes-conges/${id}/attestation`)
  }

  // Télécharger l'attestation PDF avec file-saver
  const telechargerAttestation = async (id, attestationUrl) => {
    try {
      console.log('Téléchargement attestation avec file-saver:', { id, attestationUrl })
      
      if (!attestationUrl) {
        throw new Error('URL d\'attestation manquante')
      }
      
      // Extraire le nom du fichier depuis l'URL
      const urlParts = attestationUrl.split('/')
      const filename = urlParts[urlParts.length - 1] || `attestation_${id}.pdf`
      
      console.log('Téléchargement du fichier:', filename)
      
      // Utiliser fetch pour récupérer le fichier puis file-saver pour le télécharger
      const response = await fetch(attestationUrl)
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`)
      }
      
      // Convertir en blob
      const blob = await response.blob()
      
      // Utiliser file-saver pour télécharger
      saveAs(blob, filename)
      
      console.log('Téléchargement réussi avec file-saver')
      return { success: true, url: attestationUrl, filename, method: 'file-saver' }
      
    } catch (error) {
      console.error('Erreur téléchargement attestation:', error)
      throw error
    }
  }

  // === FONCTIONS D'ACTIONS DYNAMIQUES ===
  
  // Exécuter une action sur une demande selon le type d'action
  const executeAction = async (action, demandeId, data = {}) => {
    switch (action) {
      case 'approuver':
        return await approuverDemande(demandeId, data.commentaire)
      
      case 'refuser':
        return await refuserDemande(demandeId, data.commentaire)
      
      case 'demander_annulation':
        return await demanderAnnulation(demandeId, data.motifAnnulation)
      
      case 'approuver_annulation':
        return await approuverAnnulation(demandeId, data.commentaire)
      
      case 'refuser_annulation':
        return await refuserAnnulation(demandeId, data.commentaire)
      
      case 'generer_attestation':
        return await genererAttestation(demandeId)
      
      case 'telecharger_attestation':
        return await telechargerAttestation(demandeId, data.attestationUrl)
      
      case 'modifier':
        // Pour la modification, on retourne juste l'ID pour navigation
        return { action: 'redirect', url: `/demandes/${demandeId}/modifier` }
      
      case 'annuler':
        return await cancelDemande(demandeId)
      
      case 'details':
        // Pour les détails, on retourne juste l'ID pour navigation  
        return { action: 'redirect', url: `/demandes/${demandeId}` }
      
      default:
        throw new Error(`Action non reconnue: ${action}`)
    }
  }

  return {
    // États réactifs du composable useApi
    loading: api.loading,
    data: api.data,
    error: api.error,
    
    // Méthodes de base
    getDemandes,
    getDemande,
    getMyDemandes,
    getDemandesEnAttente,
    canCreateNewDemande,
    createDemande,
    updateDemande,
    cancelDemande,
    validerDemande,
    approuverDemande,
    refuserDemande,
    getDashboardStats,
    getDemandesWithFilters,
    
    // Nouvelles méthodes pour les annulations
    demanderAnnulation,
    traiterAnnulation,
    approuverAnnulation,
    refuserAnnulation,
    genererAttestation,
    telechargerAttestation,
    executeAction
  }
} 