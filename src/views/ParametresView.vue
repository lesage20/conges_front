<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Paramètres</h1>
      <p class="text-gray-600">Gérez les paramètres de votre compte et de l'application</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Sidebar Sticky -->
      <div class="lg:col-span-1">
        <nav class="lg:sticky lg:top-6 space-y-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</h3>
          <a 
            @click="scrollToSection('profile')" 
            :class="[
              'group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all duration-200',
              activeSection === 'profile' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            <svg class="mr-3 flex-shrink-0 h-5 w-5" :class="activeSection === 'profile' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Profil
          </a>
          <a 
            @click="scrollToSection('notifications')" 
            :class="[
              'group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all duration-200',
              activeSection === 'notifications' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            <svg class="mr-3 flex-shrink-0 h-5 w-5" :class="activeSection === 'notifications' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5l-5-5h5V12h-5V7h5l-5-5l5-5v5z"></path>
            </svg>
            Notifications
          </a>
          <a 
            @click="scrollToSection('security')" 
            :class="[
              'group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all duration-200',
              activeSection === 'security' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            <svg class="mr-3 flex-shrink-0 h-5 w-5" :class="activeSection === 'security' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            Sécurité
          </a>
          <!-- <a 
            @click="scrollToSection('preferences')" 
            :class="[
              'group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all duration-200',
              activeSection === 'preferences' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            <svg class="mr-3 flex-shrink-0 h-5 w-5" :class="activeSection === 'preferences' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Préférences
          </a> -->
          
          <!-- Indicateur de progression -->
          <!-- <div class="mt-6 pt-4 border-t border-gray-200">
            <div class="flex items-center text-xs text-gray-500 mb-2">
              <span>Progression</span>
              <span class="ml-auto">{{ Math.round(scrollProgress) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1.5">
              <div class="bg-blue-600 h-1.5 rounded-full transition-all duration-300" :style="{ width: scrollProgress + '%' }"></div>
            </div>
          </div> -->
        </nav>
      </div>

      <!-- Content -->
      <div class="lg:col-span-2">
        <!-- Profile Section -->
        <div id="profile" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">Informations personnelles</h2>
            <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">Modifier</button>
          </div>
          
          <div class="flex items-center space-x-6 mb-6">
            <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <span class="text-white text-xl font-semibold">JD</span>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">John Doe</h3>
              <p class="text-gray-600">Développeur Frontend</p>
              <button class="mt-2 text-sm text-blue-600 hover:text-blue-700">Changer la photo</button>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
              <input type="text" value="John Doe" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" value="john.doe@company.com" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Poste</label>
              <input type="text" value="Développeur Frontend" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Département</label>
              <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Développement</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Ventes</option>
              </select>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Sauvegarder
            </button>
          </div>
        </div>

        <!-- Notifications Section -->
        <div id="notifications" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Notifications</h2>
          
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Notifications email</h3>
                <p class="text-sm text-gray-600">Recevoir des notifications par email</p>
              </div>
              <label class="inline-flex items-center">
                <input type="checkbox" checked class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
              </label>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Demandes de congés</h3>
                <p class="text-sm text-gray-600">Notifications pour les nouvelles demandes</p>
              </div>
              <label class="inline-flex items-center">
                <input type="checkbox" checked class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
              </label>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Approbations</h3>
                <p class="text-sm text-gray-600">Notifications quand vos demandes sont approuvées</p>
              </div>
              <label class="inline-flex items-center">
                <input type="checkbox" checked class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
              </label>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Rappels</h3>
                <p class="text-sm text-gray-600">Rappels avant les congés programmés</p>
              </div>
              <label class="inline-flex items-center">
                <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
              </label>
            </div>
          </div>
        </div>

        <!-- Security Section -->
        <div id="security" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Sécurité</h2>
          
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-medium text-gray-900 mb-3">Changer le mot de passe</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                  <input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                  <input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
                  <input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div class="flex justify-end">
                  <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Mettre à jour le mot de passe
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        <!-- Preferences Section -->
        <!-- <div id="preferences" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Préférences</h2>
          
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Langue</label>
              <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Français</option>
                <option>English</option>
                <option>Español</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Fuseau horaire</label>
              <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Europe/Paris (UTC+1)</option>
                <option>Europe/London (UTC+0)</option>
                <option>America/New_York (UTC-5)</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Format de date</label>
              <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Mode sombre</h3>
                <p class="text-sm text-gray-600">Utiliser le thème sombre</p>
              </div>
              <label class="inline-flex items-center">
                <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
              </label>
            </div>
            
            <div class="mt-6 flex justify-end">
              <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Sauvegarder les préférences
              </button>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ParametresView',
  setup() {
    const activeSection = ref('profile')
    const scrollProgress = ref(0)

    // Fonction pour faire défiler vers une section
    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
        activeSection.value = sectionId
      }
    }

    // Fonction pour calculer la progression du défilement
    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      scrollProgress.value = (scrollTop / scrollHeight) * 100
    }

    // Fonction pour détecter la section active
    const updateActiveSection = () => {
      const sections = ['profile', 'notifications', 'security', 'preferences']
      const scrollPosition = window.scrollY + 100 // Offset pour la détection

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i])
        if (element && element.offsetTop <= scrollPosition) {
          activeSection.value = sections[i]
          break
        }
      }
    }

    // Gestionnaire de défilement principal
    const handleScroll = () => {
      updateScrollProgress()
      updateActiveSection()
    }

    // Lifecycle hooks
    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
      handleScroll() // Initialiser les valeurs
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      activeSection,
      scrollProgress,
      scrollToSection
    }
  }
}
</script>

<style scoped>
/* Style pour le smooth scroll amélioré */
html {
  scroll-behavior: smooth;
}

/* Styles pour le menu sticky */
@media (min-width: 1024px) {
  .lg\:sticky {
    position: -webkit-sticky;
    position: sticky;
    z-index: 10;
  }
}

/* Animation pour les liens actifs */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Hover effect amélioré */
.group:hover .group-hover\:text-gray-500 {
  color: #6b7280;
}

/* Style pour la barre de progression */
.bg-blue-600 {
  background-color: #2563eb;
}

/* Effet de glow subtil pour le menu actif */
.bg-blue-50 {
  background-color: #eff6ff;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1);
}
</style> 