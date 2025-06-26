import { useApi } from './useApi'

export function useUsers() {
  const api = useApi()

  // Récupérer tous les utilisateurs
  const getUsers = async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    const endpoint = queryParams ? `/users?${queryParams}` : '/users'
    return await api.get(endpoint)
  }

  // Récupérer un utilisateur par ID
  const getUser = async (id) => {
    return await api.get(`/users/${id}`)
  }

  // Créer un nouvel utilisateur
  const createUser = async (userData) => {
    return await api.post('/users', userData)
  }

  // Mettre à jour un utilisateur
  const updateUser = async (id, userData) => {
    return await api.put(`/users/${id}`, userData)
  }

  // Supprimer un utilisateur
  const deleteUser = async (id) => {
    return await api.delete(`/users/${id}`)
  }

  // Récupérer les utilisateurs d'un département
  const getUsersByDepartment = async (departmentId) => {
    return await api.get(`/users?departement_id=${departmentId}`)
  }

  // Récupérer l'équipe d'un chef de service
  const getTeamMembers = async (managerId) => {
    return await api.get(`/users/${managerId}/team`)
  }

  // Changer le mot de passe
  const changePassword = async (userId, passwordData) => {
    return await api.patch(`/users/${userId}/password`, passwordData)
  }

  return {
    // États réactifs du composable useApi
    loading: api.loading,
    data: api.data,
    error: api.error,
    
    // Méthodes
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUsersByDepartment,
    getTeamMembers,
    changePassword
  }
} 