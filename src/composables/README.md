# Composables API

Ce dossier contient tous les composables pour interagir avec l'API backend de l'application de gestion des congés.

## Architecture

### Composable Principal (`useApi.js`)

Le composable `useApi` est le composable de base qui gère :
- ✅ **Loading state** : `loading.value` (boolean)
- ✅ **Data state** : `data.value` (any)
- ✅ **Error state** : `error.value` (string | null)
- ✅ **Logging automatique** : Tous les appels sont enregistrés dans `apiCallsLog`
- ✅ **Authentification automatique** : Ajout du token Bearer si disponible
- ✅ **Gestion d'erreurs** : Parsing automatique des erreurs API

### Composables Spécialisés

Chaque entité a son propre composable spécialisé :

- `useUsers()` - Gestion des utilisateurs
- `useDemandesConges()` - Gestion des demandes de congés
- `useDepartements()` - Gestion des départements

## Utilisation

### Import

```javascript
import { useUsers, useDemandesConges, useDepartements, useApiLogs } from '@/composables'
```

### Exemple basique

```javascript
<script setup>
import { useUsers } from '@/composables'

const usersApi = useUsers()

// Récupérer tous les utilisateurs
const loadUsers = async () => {
  try {
    await usersApi.getUsers()
    console.log('Utilisateurs:', usersApi.data.value)
  } catch (error) {
    console.error('Erreur:', usersApi.error.value)
  }
}

// Créer un utilisateur
const createUser = async () => {
  try {
    const userData = {
      nom: 'Doe',
      prenom: 'John',
      email: 'john.doe@example.com',
      role: 'employe'
    }
    await usersApi.createUser(userData)
    console.log('Utilisateur créé:', usersApi.data.value)
  } catch (error) {
    console.error('Erreur:', usersApi.error.value)
  }
}
</script>

<template>
  <div>
    <!-- Affichage du loading -->
    <div v-if="usersApi.loading.value">Chargement...</div>
    
    <!-- Affichage d'erreur -->
    <div v-if="usersApi.error.value" class="error">
      {{ usersApi.error.value }}
    </div>
    
    <!-- Affichage des données -->
    <div v-if="usersApi.data.value">
      <pre>{{ JSON.stringify(usersApi.data.value, null, 2) }}</pre>
    </div>
    
    <button @click="loadUsers" :disabled="usersApi.loading.value">
      Charger les utilisateurs
    </button>
  </div>
</template>
```

## API des Composables

### useUsers()

```javascript
const usersApi = useUsers()

// États réactifs
usersApi.loading.value    // boolean
usersApi.data.value      // any
usersApi.error.value     // string | null

// Méthodes
await usersApi.getUsers(params?)                    // GET /users
await usersApi.getUser(id)                         // GET /users/:id
await usersApi.createUser(userData)                // POST /users
await usersApi.updateUser(id, userData)            // PUT /users/:id
await usersApi.deleteUser(id)                      // DELETE /users/:id
await usersApi.getUsersByDepartment(departmentId)  // GET /users?departement_id=...
await usersApi.getTeamMembers(managerId)           // GET /users/:managerId/team
await usersApi.changePassword(userId, passwordData) // PATCH /users/:userId/password
```

### useDemandesConges()

```javascript
const demandesApi = useDemandesConges()

// États réactifs
demandesApi.loading.value    // boolean
demandesApi.data.value      // any
demandesApi.error.value     // string | null

// Méthodes
await demandesApi.getDemandes(params?)                      // GET /demandes-conges
await demandesApi.getDemande(id)                           // GET /demandes-conges/:id
await demandesApi.createDemande(demandeData)               // POST /demandes-conges
await demandesApi.updateDemande(id, demandeData)           // PUT /demandes-conges/:id
await demandesApi.deleteDemande(id)                        // DELETE /demandes-conges/:id
await demandesApi.approuverDemande(id, commentaire?)       // PATCH /demandes-conges/:id/approuver
await demandesApi.refuserDemande(id, commentaire?)         // PATCH /demandes-conges/:id/refuser
await demandesApi.getDemandesByUser(userId)                // GET /demandes-conges?user_id=...
await demandesApi.getDemandesEnAttente()                   // GET /demandes-conges?statut=en_attente
await demandesApi.getDemandesByDepartment(departmentId)    // GET /demandes-conges?departement_id=...
await demandesApi.getDemandesByPeriod(dateDebut, dateFin)  // GET /demandes-conges?date_debut=...&date_fin=...
await demandesApi.checkConflits(demandeData)               // POST /demandes-conges/check-conflits
await demandesApi.getStatistiques(params?)                 // GET /demandes-conges/statistiques
```

### useDepartements()

```javascript
const departementsApi = useDepartements()

// États réactifs
departementsApi.loading.value    // boolean
departementsApi.data.value      // any
departementsApi.error.value     // string | null

// Méthodes
await departementsApi.getDepartements(params?)                // GET /departements
await departementsApi.getDepartement(id)                     // GET /departements/:id
await departementsApi.createDepartement(departementData)     // POST /departements
await departementsApi.updateDepartement(id, departementData) // PUT /departements/:id
await departementsApi.deleteDepartement(id)                  // DELETE /departements/:id
await departementsApi.getStatistiquesDepartement(id)         // GET /departements/:id/statistiques
await departementsApi.getEmployesDepartement(id)             // GET /departements/:id/employes
```

### useAuth()

```javascript
const auth = useAuth()

await auth.login({ email, password })    // POST /auth/login
auth.logout()                           // Clear localStorage
const user = auth.getCurrentUser()      // Get user from localStorage
const isLoggedIn = auth.isAuthenticated() // Check if token exists
```

### useApiLogs()

```javascript
const apiLogs = useApiLogs()

apiLogs.logs                    // Array<LogEntry> - Tous les logs
apiLogs.clearLogs()            // Vider tous les logs
apiLogs.getLogsByStatus(200)   // Filtrer par status HTTP
apiLogs.getErrorLogs()         // Logs avec erreurs uniquement
apiLogs.getSuccessLogs()       // Logs de succès uniquement
```

## Configuration

L'URL de base de l'API est configurée dans `useApi.js` :

```javascript
const API_BASE_URL = 'http://localhost:8000/api'
```

## Authentification

Les composables gèrent automatiquement l'authentification :
- Le token est récupéré depuis `localStorage.getItem('authToken')`
- Il est ajouté automatiquement aux headers : `Authorization: Bearer <token>`

## Logging et Debug

Tous les appels API sont automatiquement loggés avec :
- Méthode HTTP
- URL
- Status de réponse
- Durée de la requête
- Message d'erreur si applicable
- Timestamp

Accédez à `/debug-api` pour visualiser tous les logs.
Accédez à `/test-api` pour tester les composables.

## Gestion d'Erreurs

Les erreurs sont automatiquement parsées et formatées :
- Erreurs HTTP avec parsing du JSON de réponse
- Erreurs réseau
- Timeouts
- Erreurs de parsing JSON

Le composable met automatiquement à jour `error.value` avec un message lisible. 