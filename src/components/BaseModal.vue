<template>
  <teleport to="body">
    <div
      v-if="modelValue"
      ref="overlay"
      class="fixed inset-0 z-50 flex items-center justify-center"
      @click="handleOverlayClick"
      style="background-color: rgba(0, 0, 0, 0.5);"
    >
      <div
        ref="modal"
        class="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 v-if="title" class="text-xl font-semibold text-gray-900">
            {{ title }}
          </h2>
          <slot name="header" v-else />
          
          <button
            @click="closeModal"
            class="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const overlay = ref(null)
const modal = ref(null)

const closeModal = () => {
  animateOut()
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    closeModal()
  }
}

const animateIn = () => {
  gsap.set(overlay.value, { opacity: 0 })
  gsap.set(modal.value, { 
    scale: 0.7, 
    opacity: 0, 
    y: 50,
    rotationX: -15
  })

  const tl = gsap.timeline()
  
  tl.to(overlay.value, {
    opacity: 1,
    duration: 0.3,
    ease: "power2.out"
  })
  .to(modal.value, {
    scale: 1,
    opacity: 1,
    y: 0,
    rotationX: 0,
    duration: 0.4,
    ease: "back.out(1.7)"
  }, "-=0.1")
}

const animateOut = () => {
  const tl = gsap.timeline({
    onComplete: () => {
      emit('update:modelValue', false)
      emit('close')
    }
  })

  tl.to(modal.value, {
    scale: 0.9,
    opacity: 0,
    y: -20,
    rotationX: 15,
    duration: 0.25,
    ease: "power2.in"
  })
  .to(overlay.value, {
    opacity: 0,
    duration: 0.2,
    ease: "power2.in"
  }, "-=0.1")
}

watch(() => props.modelValue, async (newValue) => {
  if (newValue) {
    await nextTick()
    animateIn()
  }
})

// Fermeture avec la touche Escape
const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.modelValue) {
    closeModal()
  }
}

// Gestion des événements clavier
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
}, { immediate: true })

// Nettoyage lors de la destruction du composant
import { onUnmounted } from 'vue'
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Styles additionnels si nécessaire */
</style> 