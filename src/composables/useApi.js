import { ref, reactive } from 'vue'

// Configuration de base de l'API
const API_BASE_URL = 'http://localhost:6500/api'

// Store global pour enregistrer tous les appels API
const apiCallsLog = reactive([])

// Fonction utilitaire pour logger les appels API
const logApiCall = (method, url, status, duration, error = null) => {
  apiCallsLog.unshift({
    id: Date.now() + Math.random(),
    method,
    url,
    status,
    duration,
    error,
    timestamp: new Date().toISOString()
  })
  
  // Garder seulement les 100 derniers appels
  if (apiCallsLog.length > 100) {
    apiCallsLog.splice(100)
  }
}

// Composable principal pour les requêtes API
export function useApi() {
  const loading = ref(false)
  const data = ref(null)
  const error = ref(null)

  // Fonction générique pour faire des requêtes
  const request = async (endpoint, options = {}) => {
    const startTime = Date.now()
    const url = `${API_BASE_URL}${endpoint}`
    
    loading.value = true
    error.value = null
    data.value = null

    try {
      const defaultOptions = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      // Ajouter le token d'authentification si disponible
      const token = localStorage.getItem('authToken')
      if (token) {
        defaultOptions.headers.Authorization = `Bearer ${token}`
      }

      const finalOptions = { ...defaultOptions, ...options }
      
      // Si on a un body et que ce n'est pas FormData, le stringifier
      if (finalOptions.body && !(finalOptions.body instanceof FormData)) {
        finalOptions.body = JSON.stringify(finalOptions.body)
      }

      const response = await fetch(url, finalOptions)
      const duration = Date.now() - startTime

      if (!response.ok) {
        const errorData = await response.text()
        let errorMessage = `Erreur ${response.status}`
        
        try {
          const parsedError = JSON.parse(errorData)
          errorMessage = parsedError.message || parsedError.detail || errorMessage
        } catch {
          errorMessage = errorData || errorMessage
        }

        logApiCall(finalOptions.method || 'GET', endpoint, response.status, duration, errorMessage)
        throw new Error(errorMessage)
      }

      let responseData
      try {
        const text = await response.text()
        responseData = text ? JSON.parse(text) : {}
      } catch (jsonError) {
        // Si la réponse n'est pas du JSON valide, retourner un objet vide
        responseData = {}
      }
      
      data.value = responseData

      logApiCall(finalOptions.method || 'GET', endpoint, response.status, duration)
      return responseData

    } catch (err) {
      error.value = err.message || 'Une erreur est survenue'
      const duration = Date.now() - startTime
      logApiCall(options.method || 'GET', endpoint, 0, duration, err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Méthodes spécifiques pour chaque type de requête
  const get = (endpoint, options = {}) => {
    return request(endpoint, { ...options, method: 'GET' })
  }

  const post = (endpoint, body, options = {}) => {
    return request(endpoint, { 
      ...options, 
      method: 'POST', 
      body 
    })
  }

  const put = (endpoint, body, options = {}) => {
    return request(endpoint, { 
      ...options, 
      method: 'PUT', 
      body 
    })
  }

  const patch = (endpoint, body, options = {}) => {
    return request(endpoint, { 
      ...options, 
      method: 'PATCH', 
      body 
    })
  }

  const del = (endpoint, options = {}) => {
    return request(endpoint, { ...options, method: 'DELETE' })
  }

  return {
    loading,
    data,
    error,
    request,
    get,
    post,
    put,
    patch,
    delete: del
  }
}

// Composable pour accéder aux logs des appels API
export function useApiLogs() {
  return {
    logs: apiCallsLog,
    clearLogs: () => apiCallsLog.splice(0),
    getLogsByStatus: (status) => apiCallsLog.filter(log => log.status === status),
    getErrorLogs: () => apiCallsLog.filter(log => log.error),
    getSuccessLogs: () => apiCallsLog.filter(log => !log.error && log.status >= 200 && log.status < 300)
  }
}

 