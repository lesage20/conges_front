import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user.js'

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
      component: () => import('../views/DashboardDrhView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/demandes',
      name: 'demandes',
      component: () => import('../views/DemandesDrhView.vue'),
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
      component: () => import('../views/DepartementsDrhView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/employes',
      name: 'employes',
      component: () => import('../views/EmployesDrhView.vue'),
      meta: { requiresAuth: true }
    },
  ],
})

// Garde de navigation pour l'authentification
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // Initialiser le store depuis localStorage
  userStore.initFromStorage()
  
  const isAuthenticated = userStore.isAuthenticated
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
