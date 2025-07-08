<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/auth.js'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const toast = useToast()
    
    const email = ref('')
    const password = ref('')
    
    // Initialiser depuis localStorage
    authStore.initFromStorage()
    
    const handleLogin = async () => {
      if (!email.value || !password.value) {
        toast.warning('Veuillez saisir votre email et mot de passe')
        return
      }
      
      try {
        await authStore.login(email.value, password.value)
        toast.success('Connexion réussie ! Bienvenue')
        router.push('/')
      } catch (err) {
        // Afficher un toast d'erreur
        toast.error(err.message || 'Erreur de connexion')
        console.error('Erreur de connexion:', err)
      }
    }
    
    return {
      email,
      password,
      isLoading: authStore.loading,
      handleLogin
    }
  }
}
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Section gauche - Design élégant -->
    <div class="hidden lg:flex lg:w-2/3  bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
      <!-- Circle Scatter & Blobs Haikei Style -->
      <div class="absolute inset-0 overflow-hidden">
        <!-- Grands blobs de base -->
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/15 via-purple-500/10 to-indigo-600/15 rounded-full blur-3xl blob-float"></div>
        <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-cyan-400/10 via-blue-500/15 to-purple-600/10 rounded-full blur-3xl blob-drift"></div>
        
        <!-- Circle Scatter - Grands cercles -->
        <div class="absolute top-1/6 left-1/4 w-24 h-24 bg-gradient-to-br from-blue-300/25 to-indigo-400/20 rounded-full blur-sm circle-float"></div>
        <div class="absolute top-3/4 right-1/3 w-20 h-20 bg-gradient-to-bl from-purple-300/20 to-blue-400/25 rounded-full blur-sm circle-drift"></div>
        <div class="absolute bottom-1/4 left-1/6 w-16 h-16 bg-gradient-to-tr from-cyan-300/30 to-blue-300/20 rounded-full blur-sm circle-bounce"></div>
        
        <!-- Circle Scatter - Cercles moyens -->
        <div class="absolute top-1/3 right-1/5 w-12 h-12 bg-gradient-to-br from-indigo-300/35 to-purple-400/25 rounded-full circle-pulse"></div>
        <div class="absolute bottom-1/3 left-3/4 w-14 h-14 bg-gradient-to-bl from-blue-200/40 to-cyan-300/30 rounded-full circle-wave"></div>
        <div class="absolute top-2/3 left-1/3 w-10 h-10 bg-gradient-to-tr from-purple-200/45 to-indigo-300/35 rounded-full circle-spin"></div>
        <div class="absolute top-1/5 left-3/5 w-8 h-8 bg-gradient-to-br from-cyan-200/50 to-blue-200/40 rounded-full circle-orbit"></div>
        
        <!-- Circle Scatter - Petits cercles -->
        <div class="absolute bottom-1/5 right-2/3 w-6 h-6 bg-gradient-to-bl from-blue-100/60 to-indigo-200/50 rounded-full circle-twinkle"></div>
        <div class="absolute top-1/2 left-1/5 w-4 h-4 bg-gradient-to-tr from-purple-100/70 to-blue-100/60 rounded-full circle-shimmer"></div>
        <div class="absolute bottom-2/3 right-1/4 w-5 h-5 bg-gradient-to-br from-cyan-100/65 to-purple-100/55 rounded-full circle-glow"></div>
        
        <!-- Micro cercles dispersés -->
        <div class="absolute top-1/4 right-1/6 w-3 h-3 bg-white/40 rounded-full circle-sparkle"></div>
        <div class="absolute bottom-1/6 left-2/5 w-2 h-2 bg-blue-100/50 rounded-full circle-sparkle" style="animation-delay: 1s;"></div>
        <div class="absolute top-3/5 right-2/5 w-3 h-3 bg-purple-100/45 rounded-full circle-sparkle" style="animation-delay: 2s;"></div>
        <div class="absolute bottom-2/5 left-1/6 w-2 h-2 bg-cyan-100/55 rounded-full circle-sparkle" style="animation-delay: 0.5s;"></div>
        <div class="absolute top-4/5 left-4/5 w-3 h-3 bg-indigo-100/40 rounded-full circle-sparkle" style="animation-delay: 1.5s;"></div>
        
        <!-- Cercles d'accent avec trails -->
        <div class="absolute top-1/8 left-1/2 w-18 h-18 bg-gradient-to-br from-blue-300/20 via-transparent to-purple-300/15 rounded-full blur-md circle-trail"></div>
        <div class="absolute bottom-1/8 right-1/2 w-22 h-22 bg-gradient-to-tl from-cyan-300/15 via-transparent to-indigo-300/20 rounded-full blur-md circle-trail" style="animation-delay: 3s;"></div>
      </div>
      
      <!-- Contenu principal -->
      <div class="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
        <div class="max-w-2xl">
          <!-- Logo/Icône -->
          <!-- <div class="mb-8">
            <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"></path>
              </svg>
            </div>
          </div> -->
          
          <!-- Titre principal -->
          <h1 class="text-5xl xl:text-6xl font-bold leading-tight mb-6">
            <!-- Connectez-vous pour -->
            <span class="block text-blue-200">Planifier et Gérer</span>
            <span class="block">vos congés</span>
          </h1>
          
          <!-- Sous-titre -->
          <p class="text-xl text-blue-100 mb-8 leading-relaxed">
            et ceux de vos employés avec notre plateforme intuitive de gestion des congés
          </p>
          
          <!-- Points clés -->
          <div class="space-y-4">
            <div class="flex items-center">
              <div class="w-2 h-2 bg-blue-300 rounded-full mr-4"></div>
              <span class="text-blue-100">Planification simplifiée des congés</span>
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 bg-blue-300 rounded-full mr-4"></div>
              <span class="text-blue-100">Validation en temps réel</span>
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 bg-blue-300 rounded-full mr-4"></div>
              <span class="text-blue-100">Vue d'ensemble des équipes</span>
            </div>
          </div>
        </div>
        
        <!-- Citation ou statistique -->
        <div class="absolute bottom-12 right-5 xl:right-[-10%]">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <p class="text-2xl font-semibold text-white text-center mb-2">98%</p>
            <p class="text-blue-200 text-sm">des utilisateurs recommandent notre solution</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Section droite - Formulaire -->
    <div class="w-full lg:w-1/3  flex items-center justify-center p-8 bg-gray-50">
      <div class="w-full max-w-md">
        <!-- Header du formulaire -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            Connexion
          </h2>
          <p class="text-gray-600">
            Accédez à votre espace de gestion
          </p>
        </div>
        
        <!-- Formulaire -->
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="votre.email@example.com"
              />
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <!-- Bouton de connexion -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span v-if="isLoading" class="mr-3">
              <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>

          <!-- Aide -->
          <div class="mt-8">
            <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <h3 class="text-sm font-medium text-gray-900 mb-3">Comptes de test disponibles :</h3>
              <div class="space-y-2 text-sm text-gray-600">
                <div class="flex justify-between">
                  <span class="font-medium">DRH :</span>
                  <span class="font-mono text-xs">drh@entreprise.com / admin123</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium">Chef de service :</span>
                  <span class="font-mono text-xs">chef.dev@entreprise.com / chef123</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium">Employé :</span>
                  <span class="font-mono text-xs">antoine.moreau@entreprise.com / emp123</span>
                </div>
                <div class="text-center mt-3 pt-2 border-t border-gray-200">
                  <span class="text-xs text-gray-500">Mot de passe : <code class="bg-gray-100 px-1 rounded">password</code></span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animations Haikei Circle Scatter */

/* Animations pour les blobs de base */
@keyframes blob-float {
  0%, 100% { 
    transform: translateY(0px) scale(1);
  }
  50% { 
    transform: translateY(-20px) scale(1.05);
  }
}

@keyframes blob-drift {
  0%, 100% { 
    transform: translateX(0px) translateY(0px) scale(1);
  }
  33% { 
    transform: translateX(15px) translateY(-10px) scale(0.95);
  }
  66% { 
    transform: translateX(-10px) translateY(20px) scale(1.05);
  }
}

/* Animations Circle Scatter */
@keyframes circle-float {
  0%, 100% { 
    transform: translateY(0px) scale(1);
    opacity: 0.6;
  }
  50% { 
    transform: translateY(-30px) scale(1.1);
    opacity: 0.8;
  }
}

@keyframes circle-drift {
  0%, 100% { 
    transform: translateX(0px) translateY(0px) scale(1);
  }
  25% { 
    transform: translateX(20px) translateY(-15px) scale(0.9);
  }
  50% { 
    transform: translateX(-15px) translateY(25px) scale(1.1);
  }
  75% { 
    transform: translateX(-25px) translateY(-20px) scale(1.05);
  }
}

@keyframes circle-bounce {
  0%, 100% { 
    transform: translateY(0px) scale(1);
  }
  25% { 
    transform: translateY(-15px) scale(1.1);
  }
  50% { 
    transform: translateY(10px) scale(0.9);
  }
  75% { 
    transform: translateY(-5px) scale(1.05);
  }
}

@keyframes circle-pulse {
  0%, 100% { 
    transform: scale(1);
    opacity: 0.5;
  }
  50% { 
    transform: scale(1.3);
    opacity: 0.9;
  }
}

@keyframes circle-wave {
  0%, 100% { 
    transform: translateY(0px) scale(1) rotate(0deg);
  }
  33% { 
    transform: translateY(-20px) scale(1.15) rotate(5deg);
  }
  66% { 
    transform: translateY(15px) scale(0.85) rotate(-5deg);
  }
}

@keyframes circle-spin {
  0% { 
    transform: rotate(0deg) scale(1);
    opacity: 0.6;
  }
  50% { 
    transform: rotate(180deg) scale(1.2);
    opacity: 0.9;
  }
  100% { 
    transform: rotate(360deg) scale(1);
    opacity: 0.6;
  }
}

@keyframes circle-orbit {
  0% { 
    transform: translateX(0px) translateY(0px) rotate(0deg);
  }
  25% { 
    transform: translateX(10px) translateY(-10px) rotate(90deg);
  }
  50% { 
    transform: translateX(0px) translateY(-20px) rotate(180deg);
  }
  75% { 
    transform: translateX(-10px) translateY(-10px) rotate(270deg);
  }
  100% { 
    transform: translateX(0px) translateY(0px) rotate(360deg);
  }
}

@keyframes circle-twinkle {
  0%, 100% { 
    opacity: 0.3;
    transform: scale(1);
  }
  25% { 
    opacity: 0.8;
    transform: scale(1.4);
  }
  50% { 
    opacity: 0.5;
    transform: scale(0.8);
  }
  75% { 
    opacity: 0.9;
    transform: scale(1.2);
  }
}

@keyframes circle-shimmer {
  0%, 100% { 
    opacity: 0.4;
    transform: scale(1) translateX(0px);
  }
  50% { 
    opacity: 0.8;
    transform: scale(1.3) translateX(5px);
  }
}

@keyframes circle-glow {
  0%, 100% { 
    opacity: 0.4;
    transform: scale(1);
    filter: blur(0px);
  }
  50% { 
    opacity: 0.9;
    transform: scale(1.5);
    filter: blur(2px);
  }
}

@keyframes circle-sparkle {
  0%, 100% { 
    opacity: 0.2;
    transform: scale(0.5);
  }
  50% { 
    opacity: 0.9;
    transform: scale(1.5);
  }
}

@keyframes circle-trail {
  0%, 100% { 
    opacity: 0.1;
    transform: scale(1) rotate(0deg);
  }
  50% { 
    opacity: 0.4;
    transform: scale(1.2) rotate(180deg);
  }
}

/* Application des animations */
.blob-float {
  animation: blob-float 8s ease-in-out infinite;
}

.blob-drift {
  animation: blob-drift 12s ease-in-out infinite;
  animation-delay: -4s;
}

.circle-float {
  animation: circle-float 6s ease-in-out infinite;
}

.circle-drift {
  animation: circle-drift 8s ease-in-out infinite;
  animation-delay: -2s;
}

.circle-bounce {
  animation: circle-bounce 4s ease-in-out infinite;
  animation-delay: -1s;
}

.circle-pulse {
  animation: circle-pulse 3s ease-in-out infinite;
}

.circle-wave {
  animation: circle-wave 7s ease-in-out infinite;
  animation-delay: -3s;
}

.circle-spin {
  animation: circle-spin 10s linear infinite;
  animation-delay: -5s;
}

.circle-orbit {
  animation: circle-orbit 15s ease-in-out infinite;
  animation-delay: -7s;
}

.circle-twinkle {
  animation: circle-twinkle 2s ease-in-out infinite;
}

.circle-shimmer {
  animation: circle-shimmer 3.5s ease-in-out infinite;
  animation-delay: -1.5s;
}

.circle-glow {
  animation: circle-glow 4.5s ease-in-out infinite;
  animation-delay: -2.5s;
}

.circle-sparkle {
  animation: circle-sparkle 2.5s ease-in-out infinite;
}

.circle-trail {
  animation: circle-trail 20s ease-in-out infinite;
}
</style> 