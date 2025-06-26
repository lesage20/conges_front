# Architecture d'Authentification Refactorisée

## 🎯 Objectifs de la refactorisation

- **Centralisation** : Toutes les routes d'authentification dans un seul composable
- **Séparation des responsabilités** : Composables pour la logique, stores pour l'état
- **Réutilisabilité** : Pas d'URLs d'API dupliquées dans plusieurs endroits
- **Maintenabilité** : Architecture claire et facile à modifier

## 🏗️ Structure de l'architecture

### 1. Composable `useAuth` (`/composables/useAuth.js`)

**Responsabilité** : Définir toutes les routes d'authentification

```javascript
import { useAuth } from '@/composables/useAuth'

const authApi = useAuth()

// Routes disponibles :
await authApi.login(email, password)           // POST /auth/login
await authApi.logout()                         // POST /auth/logout
await authApi.getCurrentUser()                 // GET /users/me
await authApi.changePassword(old, new)        // PATCH /auth/change-password
await authApi.requestPasswordReset(email)     // POST /auth/forgot-password
await authApi.resetPassword(token, password)  // POST /auth/reset-password
await authApi.verifyToken(token)              // POST /auth/verify-token

// États réactifs disponibles :
authApi.loading.value  // boolean
authApi.data.value     // any
authApi.error.value    // string | null
```

### 2. Store d'authentification (`/stores/auth.js`)

**Responsabilité** : Gérer l'état global de l'authentification

```javascript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// État de l'authentification
authStore.token           // string | null
authStore.user            // object | null  
authStore.isAuthenticated // boolean
authStore.loading         // boolean (dérivé du composable)
authStore.error           // string | null (dérivé du composable)

// Getters de rôles
authStore.isEmploye       // boolean
authStore.isChefService   // boolean  
authStore.isDrh           // boolean
authStore.permissions     // object avec toutes les permissions

// Actions d'authentification
await authStore.login(email, password)
await authStore.logout()
await authStore.fetchUser()
await authStore.changePassword(old, new)
await authStore.requestPasswordReset(email)
await authStore.resetPassword(token, password)

// Utilitaires
authStore.initFromStorage()
authStore.updateUser(data)
authStore.getToken()
authStore.getUser()
```

### 3. Utilisation dans les vues

**Responsabilité** : Interface utilisateur uniquement

```vue
<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Initialiser depuis localStorage
authStore.initFromStorage()

// Utiliser les actions
const handleLogin = async () => {
  await authStore.login(email, password)
}

const handleLogout = async () => {
  await authStore.logout()
}
</script>

<template>
  <!-- États réactifs automatiquement mis à jour -->
  <div v-if="authStore.isAuthenticated">
    Bonjour {{ authStore.user.nom_complet }}
  </div>
  
  <button :disabled="authStore.loading">
    {{ authStore.loading ? 'Chargement...' : 'Se connecter' }}
  </button>
</template>
```

## 🔄 Flux de données

```
Vue Component
    ↓ (utilise)
Auth Store  
    ↓ (utilise)
useAuth Composable
    ↓ (utilise)  
useApi Composable
    ↓ (appelle)
API Backend
```

## ✅ Avantages de cette architecture

### 1. **Centralisation des routes**
- Toutes les URLs d'authentification dans `useAuth`
- Modification d'une route = un seul endroit à changer
- Pas de duplication d'URLs

### 2. **Séparation claire des responsabilités**
- **Composables** : Logique métier et appels API
- **Stores** : État global et persistance
- **Vues** : Interface utilisateur uniquement

### 3. **Réactivité automatique**
- États dérivés automatiquement (loading, error)
- Mises à jour propagées dans toute l'application
- Pas de gestion manuelle de l'état

### 4. **Facilité de test**
- Composables testables indépendamment
- Stores mockables facilement  
- Vues avec logique minimale

### 5. **Extensibilité**
- Ajouter de nouvelles routes = modifier uniquement `useAuth`
- Ajouter de nouveaux états = modifier uniquement le store
- Pas d'impact sur les vues existantes

## 🚀 Pages de démonstration

- **`/auth-example`** : Architecture complète avec explications
- **`/login-test`** : Test d'authentification réelle avec l'API
- **`/debug-api`** : Visualisation des appels API et logs

## 📁 Fichiers modifiés

```
front/src/
├── composables/
│   ├── useAuth.js          # Nouveau - Routes d'authentification
│   ├── useApi.js           # Modifié - useAuth supprimé
│   └── index.js            # Modifié - Export mis à jour
├── stores/
│   └── auth.js             # Nouveau - Store d'authentification  
├── views/
│   ├── AuthExampleView.vue # Nouveau - Démonstration
│   └── LoginTestView.vue   # Modifié - Utilise le nouveau store
└── router/
    └── index.js            # Modifié - Utilise le nouveau store
```

## 🔧 Migration depuis l'ancienne architecture

1. **Remplacer** `import { useUserStore }` par `import { useAuthStore }`
2. **Remplacer** `userStore.login()` par `authStore.login()`
3. **Utiliser** `authStore.permissions` au lieu des getters individuels
4. **Supprimer** les URLs d'API en dur dans les vues 