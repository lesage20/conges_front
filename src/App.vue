<script setup>
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useAuthStore } from './stores/auth.js'
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings,
  Bell,
  Plus,
  Building,
  UsersRound,
  LogOut
} from 'lucide-vue-next'

const route = useRoute()
const authStore = useAuthStore()
const router = useRouter()

// Initialiser le store au démarrage
onMounted(() => {
  authStore.initFromStorage()
})

// Navigation items avec permissions
const navigationItems = computed(() => {
  const items = []
  
  if (!authStore.user) return items
  
  // Dashboard - visible par tous
  items.push({
    path: '/',
    name: 'Tableau de bord',
    icon: LayoutDashboard,
    section: 'main'
  })
  
  // Demandes - visible par tous
  items.push({
    path: '/demandes',
    name: 'Mes demandes',
    icon: FileText,
    section: 'main'
  })
  
  // Calendrier - visible par chef de service et DRH
  if (authStore.user.role === 'chef_service' || authStore.user.role === 'drh') {
    items.push({
      path: '/calendrier',
      name: 'Calendrier',
      icon: Calendar,
      section: 'main'
    })
  }
  
  // Mon équipe - visible par chef de service et DRH
  if (authStore.user.role === 'chef_service' || authStore.user.role === 'drh') {
    items.push({
      path: '/monequipe',
      name: 'Mon équipe',
      icon: Users,
      section: 'main'
    })
  }
  
  // Rapports - visible par tous
  items.push({
    path: '/rapports',
    name: 'Rapports',
    icon: BarChart3,
    section: 'main'
  })
  
  // Employés - visible par DRH uniquement
  if (authStore.user.role === 'drh') {
    items.push({
      path: '/employes',
      name: 'Employés',
      icon: UsersRound,
      section: 'admin'
    })
  }
  
  // Départements - visible par DRH uniquement
  if (authStore.user.role === 'drh') {
    items.push({
      path: '/departements',
      name: 'Départements',
      icon: Building,
      section: 'admin'
    })
  }
  
  // Paramètres - visible par tous
  items.push({
    path: '/parametres',
    name: 'Paramètres',
    icon: Settings,
    section: 'admin'
  })
  
  return items
})

const mainItems = computed(() => navigationItems.value.filter(item => item.section === 'main'))
const adminItems = computed(() => navigationItems.value.filter(item => item.section === 'admin'))

const getPageTitle = () => {
  const titles = {
    '/': 'Tableau de bord',
    '/demandes': 'Mes demandes de congés',
    '/calendrier': 'Calendrier des congés',
    '/monequipe': 'Mon équipe',
    '/rapports': 'Rapports et statistiques',
    '/employes': 'Gestion des employés',
    '/departements': 'Gestion des départements',
    '/parametres': 'Paramètres'
  }
  return titles[route.path] || 'Gestion Congés'
}

const getPageDescription = () => {
  const descriptions = {
    '/': 'Bienvenue dans votre espace de gestion des congés',
    '/demandes': 'Gérez vos demandes de congés',
    '/calendrier': 'Visualisez les congés de l\'équipe',
    '/monequipe': 'Gérez les congés de votre équipe',
    '/rapports': 'Analysez les données de congés',
    '/employes': 'Gestion complète des employés',
    '/departements': 'Gestion des départements',
    '/parametres': 'Gérez les paramètres de votre compte'
  }
  return descriptions[route.path] || 'Application de gestion des congés'
}

const getRoleBadge = () => {
  const badges = {
    'employe': 'Employé',
    'chef_service': 'Chef de service',
    'drh': 'DRH'
  }
  return authStore.user ? badges[authStore.user.role] || authStore.user.role : ''
}

const getDepartmentName = () => {
  return authStore.user?.departement_nom || authStore.user?.departement || 'Non défini'
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <!-- Si non connecté, afficher seulement la vue (page de login) -->
  <div v-if="!authStore.isAuthenticated" class="min-h-screen">
    <router-view />
  </div>

  <!-- Si connecté, afficher le layout complet -->
  <div v-else class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <h1 class="text-xl font-bold text-gray-900">Congés</h1>
        <p class="text-sm text-gray-600 mt-1">{{ getRoleBadge() }} - {{ getDepartmentName() }}</p>
      </div>
      
      <!-- Navigation -->
      <nav class="flex-1 pt-6">
        <!-- Main Navigation -->
        <div class="px-3 space-y-2">
          <router-link
            v-for="item in mainItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center space-x-3 px-3 text-sm font-medium rounded-lg transition-colors"
            :class="$route.path === item.path ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'"
          >
            <div class="flex items-center py-2">
              <component :is="item.icon" :size="20" class="mr-3" />
              {{ item.name }}
            </div>
          </router-link>
        </div>
        
        <!-- Admin Section -->
        <div v-if="adminItems.length > 0" class="mt-8 pt-3 border-t border-gray-200">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 mb-3">Administration</h3>
          <div class="px-3 space-y-2">
            <router-link
              v-for="item in adminItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center justify-between px-3 text-sm font-medium rounded-lg transition-colors"
              :class="$route.path === item.path ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'"
            >
              <div class="flex items-center py-2">
                <component :is="item.icon" :size="20" class="mr-3" />
                {{ item.name }}
              </div>
            </router-link>
          </div>
        </div>
      </nav>
      
      <!-- User profile -->
      <div class="py-3 ps-1 border-t border-gray-200" v-if="authStore.user">
        <div class="flex items-center">
          <div class="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center">
            <span class="font-semibold text-sm">{{ authStore.user.nom ? authStore.user.nom.split(' ').slice(0, 2).map(n => n[0]).join('') : 'U' }}</span>
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium text-gray-900">{{ authStore.user.nom || 'Utilisateur' }}</p>
            <p class="text-xs text-gray-500">{{ authStore.user.email || '' }}</p>
          </div>
          <button 
            @click="handleLogout"
            class="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
            title="Déconnexion"
          >
            <LogOut :size="18" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-6 py-4 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">{{ getPageTitle() }}</h2>
            <p class="text-sm text-gray-600 mt-1">{{ getPageDescription() }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <!-- Notifications -->
            <button class="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell :size="20" />
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">2</span>
            </button>
          </div>
        </div>
      </header>
      
      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>
