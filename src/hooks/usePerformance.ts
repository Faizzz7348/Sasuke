/**
 * Custom hooks for performance optimization
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import type { DependencyList } from 'react'

/**
 * Debounce hook - delays execution until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked
 */
export function useDebounce<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  )
}

/**
 * Throttle hook - ensures function is called at most once per specified time period
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const lastRunRef = useRef<number>(0)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      const timeSinceLastRun = now - lastRunRef.current

      if (timeSinceLastRun >= delay) {
        callback(...args)
        lastRunRef.current = now
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(
          () => {
            callback(...args)
            lastRunRef.current = Date.now()
          },
          delay - timeSinceLastRun
        )
      }
    },
    [callback, delay]
  )
}

/**
 * Intersection Observer hook - detect when element enters viewport
 */
export function useIntersectionObserver(
  callback: (isIntersecting: boolean) => void,
  options?: IntersectionObserverInit
) {
  const targetRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) {
        callback(entry.isIntersecting)
      }
    }, options)

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [callback, options])

  return targetRef
}

/**
 * Media query hook - detect screen size changes
 */
export function useMediaQuery(query: string): boolean {
  const getMatches = (query: string): boolean => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  }

  const [matches, setMatches] = useState(getMatches(query))

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handleChange = () => setMatches(mediaQuery.matches)

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [query])

  return matches
}

/**
 * Previous value hook - track previous value of a prop or state
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)
  const [previous, setPrevious] = useState<T | undefined>()

  useEffect(() => {
    setPrevious(ref.current)
    ref.current = value
  }, [value])

  return previous
}

/**
 * Event listener hook - manage event listeners safely
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element: Window | HTMLElement = window
) {
  const savedHandler = useRef(handler)

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const isSupported = element && element.addEventListener
    if (!isSupported) return

    const eventListener = (event: Event) => savedHandler.current(event as WindowEventMap[K])
    element.addEventListener(eventName, eventListener)

    return () => {
      element.removeEventListener(eventName, eventListener)
    }
  }, [eventName, element])
}

/**
 * Async effect hook - handle async operations in useEffect
 */
export function useAsyncEffect(
  effect: () => Promise<void | (() => void)>,
  deps: DependencyList
) {
  useEffect(() => {
    let cleanup: void | (() => void)
    let cancelled = false

    effect().then((c) => {
      if (!cancelled) {
        cleanup = c
      }
    })

    return () => {
      cancelled = true
      if (typeof cleanup === 'function') {
        cleanup()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
