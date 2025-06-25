import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/DashboardDrhView.vue'),
    },
    {
      path: '/demandes',
      name: 'demandes',
      component: () => import('../views/DemandesDrhView.vue'),
    },
    {
      path: '/calendrier',
      name: 'calendrier',
      component: () => import('../views/CalendrierView.vue'),
    },
    {
      path: '/equipe',
      name: 'equipe',
      component: () => import('../views/EquipeView.vue'),
    },
    {
      path: '/monequipe',
      name: 'monequipe',
      component: () => import('../views/MonEquipeView.vue'),
    },
    {
      path: '/rapports',
      name: 'rapports',
      component: () => import('../views/RapportsView.vue'),
    },
    {
      path: '/parametres',
      name: 'parametres',
      component: () => import('../views/ParametresView.vue'),
    },
    // Routes DRH
    // {
    //   path: '/drh/dashboard',
    //   name: 'drh-dashboard',
    //   component: () => import('../views/DashboardDrhView.vue'),
    // },
    // {
    //   path: '/drh/demandes',
    //   name: 'drh-demandes',
    //   component: () => import('../views/DemandesDrhView.vue'),
    // },
    // {
    //   path: '/drh/calendrier',
    //   name: 'drh-calendrier',
    //   component: () => import('../views/CalendrierDrhView.vue'),
    // },
    {
      path: '/departements',
      name: 'departements',
      component: () => import('../views/DepartementsDrhView.vue'),
    },
    {
      path: '/employes',
      name: 'employes',
      component: () => import('../views/EmployesDrhView.vue'),
    },
  ],
})

export default router
