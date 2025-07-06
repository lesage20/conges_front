import { useApi } from './useApi'

export function useDepartements() {
  const api = useApi()

  // Récupérer tous les départements
  const getDepartements = async () => {
    return await api.get('/departements/')
  }

  // Récupérer un département par ID
  const getDepartement = async (id) => {
    return await api.get(`/departements/${id}`)
  }

  // Créer un nouveau département (DRH uniquement)
  const createDepartement = async (departementData) => {
    return await api.post('/departements/', departementData)
  }

  // Mettre à jour un département (DRH uniquement)
  const updateDepartement = async (id, departementData) => {
    return await api.put(`/departements/${id}`, departementData)
  }

  // Supprimer un département (DRH uniquement)
  const deleteDepartement = async (id) => {
    return await api.delete(`/departements/${id}`)
  }

  // Assigner un chef de département (DRH uniquement)
  const assignChefDepartement = async (departementId, chefId) => {
    return await api.put(`/departements/${departementId}/chef?chef_id=${chefId}`)
  }

  // Récupérer les statistiques d'un département
  const getDepartementStats = async (id) => {
    return await api.get(`/departements/${id}/stats`)
  }

  return {
    // États réactifs du composable useApi
    loading: api.loading,
    data: api.data,
    error: api.error,
    
    // Méthodes
    getDepartements,
    getDepartement,
    createDepartement,
    updateDepartement,
    deleteDepartement,
    assignChefDepartement,
    getDepartementStats
  }
} 