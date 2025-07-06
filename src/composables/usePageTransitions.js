import { ref } from 'vue'
import { gsap } from 'gsap'

export function usePageTransitions() {
  const isTransitioning = ref(false)
  
  // Types d'animations disponibles
  const transitionTypes = {
    // Fade + scale classique
    default: {
      out: {
        duration: 0.3,
        opacity: 0,
        y: -20,
        scale: 0.98,
        ease: "power2.out"
      },
      in: {
        from: { opacity: 0, y: 30, scale: 0.98 },
        to: {
          duration: 0.4,
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "back.out(1.4)"
        }
      }
    },
    
    // Slide horizontal
    slideLeft: {
      out: {
        duration: 0.3,
        x: -50,
        opacity: 0,
        ease: "power2.inOut"
      },
      in: {
        from: { x: 50, opacity: 0 },
        to: {
          duration: 0.4,
          x: 0,
          opacity: 1,
          ease: "power2.out"
        }
      }
    },
    
    // Slide vertical - effet scroll smooth vers le haut
    slideUp: {
      out: {
        duration: 0.4,
        y: -100,
        opacity: 0,
        scale: 0.98,
        ease: "power2.inOut"
      },
      in: {
        from: { y: 100, opacity: 0, scale: 0.98 },
        to: {
          duration: 0.6,
          y: 0,
          opacity: 1,
          scale: 1,
          ease: "power3.out"
        }
      }
    },
    
    // Slide vertical - effet scroll smooth vers le bas
    slideDown: {
      out: {
        duration: 0.4,
        y: 100,
        opacity: 0,
        scale: 0.98,
        ease: "power2.inOut"
      },
      in: {
        from: { y: -100, opacity: 0, scale: 0.98 },
        to: {
          duration: 0.6,
          y: 0,
          opacity: 1,
          scale: 1,
          ease: "power3.out"
        }
      }
    },
    
    // Scroll smooth avec momentum (version alternative)
    scrollSmooth: {
      out: {
        duration: 0.35,
        y: -150,
        opacity: 0,
        scale: 0.95,
        rotationX: 5,
        ease: "power2.inOut"
      },
      in: {
        from: { y: 150, opacity: 0, scale: 0.95, rotationX: -5 },
        to: {
          duration: 0.7,
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          ease: "power3.out"
        }
      }
    },
    
    // Rotation + fade
    rotate: {
      out: {
        duration: 0.3,
        rotationY: -15,
        opacity: 0,
        scale: 0.95,
        ease: "power2.out"
      },
      in: {
        from: { rotationY: 15, opacity: 0, scale: 0.95 },
        to: {
          duration: 0.4,
          rotationY: 0,
          opacity: 1,
          scale: 1,
          ease: "back.out(1.2)"
        }
      }
    },
    
    // Zoom in/out
    zoom: {
      out: {
        duration: 0.25,
        scale: 1.05,
        opacity: 0,
        ease: "power2.out"
      },
      in: {
        from: { scale: 0.9, opacity: 0 },
        to: {
          duration: 0.4,
          scale: 1,
          opacity: 1,
          ease: "back.out(1.5)"
        }
      }
    }
  }
  
  // Fonction principale de transition
  const transitionPage = async (element, type = 'default', direction = null) => {
    if (isTransitioning.value || !element) {
      console.log('Transition ignorée:', { isTransitioning: isTransitioning.value, hasElement: !!element })
      return
    }
    
    isTransitioning.value = true
    
    // Détermine le type d'animation selon la direction de navigation
    let animationType = type
    if (direction) {
      switch (direction) {
        case 'forward':
          animationType = 'slideLeft'
          break
        case 'backward':
          animationType = 'slideLeft'
          break
        case 'up':
          animationType = 'slideUp'
          break
        case 'down':
          animationType = 'slideDown'
          break
        default:
          animationType = type
      }
    }
    
    const animation = transitionTypes[animationType] || transitionTypes.default
    
    try {
      console.log('Démarrage transition:', animationType)
      
      // Animation de sortie
      await gsap.to(element, animation.out)
      
      // Pause adaptée selon le type d'animation (plus longue pour les scrolls)
      const pauseDuration = (animationType.includes('slide') || animationType === 'scrollSmooth') ? 150 : 100
      await new Promise(resolve => setTimeout(resolve, pauseDuration))
      
      // Vérifier que l'élément existe toujours
      if (!element.isConnected) {
        console.warn('Élément déconnecté pendant la transition')
        return
      }
      
      // Animation d'entrée
      gsap.set(element, animation.in.from)
      await gsap.to(element, animation.in.to)
      
      console.log('Transition terminée:', animationType)
      
    } catch (error) {
      console.error('Erreur lors de la transition:', error)
    } finally {
      isTransitioning.value = false
    }
  }
  
  // Animation d'entrée pour les nouveaux éléments
  const animateIn = async (element, type = 'default', delay = 0) => {
    if (!element) return
    
    const animation = transitionTypes[type] || transitionTypes.default
    
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }
    
    gsap.set(element, animation.in.from)
    return gsap.to(element, animation.in.to)
  }
  
  // Animation de sortie pour les éléments qui disparaissent
  const animateOut = async (element, type = 'default') => {
    if (!element) return
    
    const animation = transitionTypes[type] || transitionTypes.default
    return gsap.to(element, animation.out)
  }
  
  // Animation staggered pour les listes
  const staggeredIn = async (elements, type = 'default', stagger = 0.1) => {
    if (!elements || elements.length === 0) return
    
    const animation = transitionTypes[type] || transitionTypes.default
    
    gsap.set(elements, animation.in.from)
    return gsap.to(elements, {
      ...animation.in.to,
      stagger: stagger
    })
  }
  
  // Transition spéciale pour les modals
  const modalTransition = {
    in: async (element) => {
      gsap.set(element, { scale: 0.8, opacity: 0, rotationX: -15 })
      return gsap.to(element, {
        duration: 0.3,
        scale: 1,
        opacity: 1,
        rotationX: 0,
        ease: "back.out(1.7)"
      })
    },
    out: async (element) => {
      return gsap.to(element, {
        duration: 0.25,
        scale: 0.9,
        opacity: 0,
        rotationX: 15,
        ease: "power2.out"
      })
    }
  }
  
  return {
    isTransitioning,
    transitionPage,
    animateIn,
    animateOut,
    staggeredIn,
    modalTransition,
    transitionTypes
  }
} 