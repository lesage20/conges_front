import { useApi } from './useApi'

export function useUsers() {
  const api = useApi()

  // Récupérer tous les utilisateurs (selon rôle: DRH voit tous, Chef voit son département, Employé = accès refusé)
  const getUsers = async () => {
    return await api.get('/users')
  }

  // Récupérer un utilisateur par ID
  const getUser = async (id) => {
    return await api.get(`/users/${id}`)
  }

  // Récupérer l'utilisateur connecté
  const getCurrentUser = async () => {
    return await api.get('/users/me')
  }

  // Mettre à jour l'utilisateur connecté
  const updateCurrentUser = async (userData) => {
    return await api.patch('/users/me', userData)
  }

  // Créer un nouvel employé (via users/create-employee)
  const createEmployee = async (userData) => {
    return await api.post('/users/create-employee', userData)
  }

  // Mettre à jour un utilisateur (superuser uniquement)
  const updateUser = async (id, userData) => {
    return await api.patch(`/users/${id}`, userData)
  }

  // Supprimer un utilisateur (superuser uniquement)
  const deleteUser = async (id) => {
    return await api.delete(`/users/${id}`)
  }

  // Récupérer les utilisateurs d'un département
  const getUsersByDepartement = async (departementId) => {
    return await api.get(`/users/departement/${departementId}`)
  }

  // Récupérer l'équipe de l'utilisateur connecté (alias pour /users selon rôle)
  const getMyTeam = async () => {
    return await api.get('/users/equipe')
  }

  // Récupérer tous les managers (DRH uniquement)
  const getManagers = async () => {
    return await api.get('/users/managers')
  }

  // Mettre à jour le rôle d'un utilisateur (DRH uniquement)
  const updateUserRole = async (userId, newRole) => {
    return await api.put(`/users/${userId}/role?new_role=${newRole}`)
  }

  // Assigner un utilisateur à un département (DRH uniquement)
  const assignDepartement = async (userId, departementId) => {
    return await api.put(`/users/${userId}/departement?departement_id=${departementId}`)
  }

  return {
    // États réactifs du composable useApi
    loading: api.loading,
    data: api.data,
    error: api.error,
    
    // Méthodes
    getUsers,
    getUser,
    getCurrentUser,
    updateCurrentUser,
    createEmployee,
    updateUser,
    deleteUser,
    getUsersByDepartement,
    getMyTeam,
    getManagers,
    updateUserRole,
    assignDepartement
  }
} 