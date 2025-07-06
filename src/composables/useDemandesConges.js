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

  return {
    // États réactifs du composable useApi
    loading: api.loading,
    data: api.data,
    error: api.error,
    
    // Méthodes
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
    getDemandesWithFilters
  }
} 