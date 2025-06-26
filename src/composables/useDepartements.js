import { useApi } from './useApi'

export function useDepartements() {
  const api = useApi()

  // Récupérer tous les départements
  const getDepartements = async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    const endpoint = queryParams ? `/departements?${queryParams}` : '/departements'
    return await api.get(endpoint)
  }

  // Récupérer un département par ID
  const getDepartement = async (id) => {
    return await api.get(`/departements/${id}`)
  }

  // Créer un nouveau département
  const createDepartement = async (departementData) => {
    return await api.post('/departements', departementData)
  }

  // Mettre à jour un département
  const updateDepartement = async (id, departementData) => {
    return await api.put(`/departements/${id}`, departementData)
  }

  // Supprimer un département
  const deleteDepartement = async (id) => {
    return await api.delete(`/departements/${id}`)
  }

  // Récupérer les statistiques d'un département
  const getStatistiquesDepartement = async (id) => {
    return await api.get(`/departements/${id}/statistiques`)
  }

  // Récupérer les employés d'un département
  const getEmployesDepartement = async (id) => {
    return await api.get(`/departements/${id}/employes`)
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
    getStatistiquesDepartement,
    getEmployesDepartement
  }
} 