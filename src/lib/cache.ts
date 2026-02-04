/**
 * Cache utilities for performance optimization
 */

// Simple in-memory cache with TTL
interface CacheEntry<T> {
  value: T
  expiry: number
}

class Cache<T> {
  private cache = new Map<string, CacheEntry<T>>()
  private defaultTTL: number

  constructor(defaultTTL = 5 * 60 * 1000) {
    // 5 minutes default
    this.defaultTTL = defaultTTL
  }

  set(key: string, value: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL)
    this.cache.set(key, { value, expiry })
  }

  get(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      return null
    }
    
    return entry.value
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key)
      }
    }
  }
}

// Export a singleton instance
export const cache = new Cache()

// Run cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => cache.cleanup(), 5 * 60 * 1000)
}

/**
 * LocalStorage with expiry
 */
export const localStorageCache = {
  set(key: string, value: unknown, ttl = 24 * 60 * 60 * 1000): void {
    // 24 hours default
    const item = {
      value,
      expiry: Date.now() + ttl,
    }
    try {
      localStorage.setItem(key, JSON.stringify(item))
    } catch (e) {
      console.warn('LocalStorage set failed:', e)
    }
  },

  get<T>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(key)
      if (!itemStr) return null

      const item = JSON.parse(itemStr)
      
      if (Date.now() > item.expiry) {
        localStorage.removeItem(key)
        return null
      }
      
      return item.value as T
    } catch (e) {
      console.warn('LocalStorage get failed:', e)
      return null
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.warn('LocalStorage remove failed:', e)
    }
  },

  clear(): void {
    try {
      localStorage.clear()
    } catch (e) {
      console.warn('LocalStorage clear failed:', e)
    }
  },
}

/**
 * Memoization helper
 */
export function memoize<T extends (...args: never[]) => unknown>(
  fn: T,
  getCacheKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = getCacheKey ? getCacheKey(...args) : JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)!
    }
    
    const result = fn(...args)
    cache.set(key, result as ReturnType<T>)
    return result
  }) as T
}
