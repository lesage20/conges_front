import { useApi } from './useApi'

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

  // Télécharger l'attestation PDF
  const telechargerAttestation = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/demandes-conges/${id}/download-attestation`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/pdf'
        }
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement de l\'attestation')
      }
      
      // Récupérer le nom du fichier depuis l'en-tête
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = `attestation_${id}.pdf`
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="([^"]+)"/)
        if (matches) {
          filename = matches[1]
        }
      }
      
      // Créer un blob à partir de la réponse
      const blob = await response.blob()
      
      // Créer un lien de téléchargement temporaire
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      
      // Nettoyer
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
      
      return { success: true, filename }
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
        return await telechargerAttestation(demandeId)
      
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