import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/demandes',
      name: 'demandes',
      component: () => import('../views/DemandesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calendrier',
      name: 'calendrier',
      component: () => import('../views/CalendrierView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/equipe',
      name: 'equipe',
      component: () => import('../views/EquipeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/monequipe',
      name: 'monequipe',
      component: () => import('../views/MonEquipeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/rapports',
      name: 'rapports',
      component: () => import('../views/RapportsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/parametres',
      name: 'parametres',
      component: () => import('../views/ParametresView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/departements',
      name: 'departements',
      component: () => import('../views/DepartementsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/employes',
      name: 'employes',
      component: () => import('../views/EmployesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/debug-api',
      name: 'debug-api',
      component: () => import('../views/ApiDebugView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/test-api',
      name: 'test-api',
      component: () => import('../views/TestApiView.vue'),
      meta: { requiresAuth: true }
    },
  ],
})

// Garde de navigation pour l'authentification
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialiser le store depuis localStorage
  authStore.initFromStorage()
  
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.meta.requiresAuth
  const requiresGuest = to.meta.requiresGuest
  
  if (requiresAuth && !isAuthenticated) {
    // Route protégée mais utilisateur non connecté
    next('/login')
  } else if (requiresGuest && isAuthenticated) {
    // Page de login mais utilisateur déjà connecté
    next('/')
  } else {
    next()
  }
})

export default router
