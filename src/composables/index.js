// Export principal des composables API
export { useApi } from './useApi'

// Export du composable d'authentification
export { useAuth } from './useAuth'

// Export des composables spécialisés
export { useUsers } from './useUsers'
export { useDemandesConges } from './useDemandesConges'
export { useDepartements } from './useDepartements'
export { usePageTransitions } from './usePageTransitions'
export { useCalendrier } from './useCalendrier'

// Configuration par défaut de l'API
export const API_CONFIG = {
  BASE_URL: 'http://localhost:6500/api',
  TIMEOUT: 30000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json'
  }
} 