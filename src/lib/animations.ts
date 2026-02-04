import { useEffect, useRef } from 'react'

/**
 * Add entrance animation to elements when they mount
 */
export function useEntranceAnimation(
  animation: 'fade' | 'slide-up' | 'slide-down' | 'scale' = 'fade',
  delay = 0
) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const timer = setTimeout(() => {
      element.style.opacity = '0'
      element.style.transform = getInitialTransform(animation)
      element.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          element.style.opacity = '1'
          element.style.transform = 'none'
        })
      })
    }, delay)

    return () => clearTimeout(timer)
  }, [animation, delay])

  return ref
}

function getInitialTransform(animation: string): string {
  switch (animation) {
    case 'slide-up':
      return 'translateY(20px)'
    case 'slide-down':
      return 'translateY(-20px)'
    case 'scale':
      return 'scale(0.9)'
    default:
      return 'none'
  }
}

/**
 * Add stagger animation to list items
 */
export function useStaggerAnimation(count: number, delay = 50) {
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    refs.current.forEach((element, index) => {
      if (!element) return

      const timer = setTimeout(() => {
        element.style.opacity = '0'
        element.style.transform = 'translateY(10px)'
        element.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            element.style.opacity = '1'
            element.style.transform = 'translateY(0)'
          })
        })
      }, index * delay)

      return () => clearTimeout(timer)
    })
  }, [count, delay])

  const setRef = (index: number) => (el: HTMLElement | null) => {
    refs.current[index] = el
  }

  return setRef
}

/**
 * Intersection Observer based animation
 */
export function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting) {
          element.style.opacity = '1'
          element.style.transform = 'translateY(0)'
          observer.unobserve(element)
        }
      },
      { threshold }
    )

    element.style.opacity = '0'
    element.style.transform = 'translateY(30px)'
    element.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold])

  return ref
}

/**
 * Animation CSS classes
 */
export const animations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  scaleIn: 'animate-scale-in',
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce-subtle',
  shimmer: 'animate-shimmer',
  
  // Hover effects
  cardHover: 'card-hover',
  
  // Transition classes
  transition: {
    fast: 'transition-all duration-150 ease-out',
    normal: 'transition-all duration-300 ease-out',
    slow: 'transition-all duration-500 ease-out',
    smooth: 'transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)',
  }
}
