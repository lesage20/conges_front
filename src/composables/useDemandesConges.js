import { useApi } from './useApi'

export function useDemandesConges() {
  const api = useApi()

  // Récupérer toutes les demandes de congés
  const getDemandes = async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    const endpoint = queryParams ? `/demandes-conges?${queryParams}` : '/demandes-conges'
    return await api.get(endpoint)
  }

  // Récupérer une demande par ID
  const getDemande = async (id) => {
    return await api.get(`/demandes-conges/${id}`)
  }

  // Créer une nouvelle demande de congé
  const createDemande = async (demandeData) => {
    return await api.post('/demandes-conges', demandeData)
  }

  // Mettre à jour une demande
  const updateDemande = async (id, demandeData) => {
    return await api.put(`/demandes-conges/${id}`, demandeData)
  }

  // Supprimer une demande
  const deleteDemande = async (id) => {
    return await api.delete(`/demandes-conges/${id}`)
  }

  // Approuver une demande
  const approuverDemande = async (id, commentaire = '') => {
    return await api.patch(`/demandes-conges/${id}/approuver`, { commentaire })
  }

  // Refuser une demande
  const refuserDemande = async (id, commentaire = '') => {
    return await api.patch(`/demandes-conges/${id}/refuser`, { commentaire })
  }

  // Récupérer les demandes d'un utilisateur
  const getDemandesByUser = async (userId) => {
    return await api.get(`/demandes-conges?user_id=${userId}`)
  }

  // Récupérer les demandes en attente
  const getDemandesEnAttente = async () => {
    return await api.get('/demandes-conges?statut=en_attente')
  }

  // Récupérer les demandes d'un département
  const getDemandesByDepartment = async (departmentId) => {
    return await api.get(`/demandes-conges?departement_id=${departmentId}`)
  }

  // Récupérer les demandes pour une période donnée
  const getDemandesByPeriod = async (dateDebut, dateFin) => {
    return await api.get(`/demandes-conges?date_debut=${dateDebut}&date_fin=${dateFin}`)
  }

  // Vérifier les conflits de congés
  const checkConflits = async (demandeData) => {
    return await api.post('/demandes-conges/check-conflits', demandeData)
  }

  // Récupérer les statistiques des congés
  const getStatistiques = async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    const endpoint = queryParams ? `/demandes-conges/statistiques?${queryParams}` : '/demandes-conges/statistiques'
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
    createDemande,
    updateDemande,
    deleteDemande,
    approuverDemande,
    refuserDemande,
    getDemandesByUser,
    getDemandesEnAttente,
    getDemandesByDepartment,
    getDemandesByPeriod,
    checkConflits,
    getStatistiques
  }
} 