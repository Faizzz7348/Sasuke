/**
 * Web Vitals monitoring
 * Tracks Core Web Vitals: LCP, FID, CLS, FCP, TTFB
 */

interface WebVitalsMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
}

type ReportHandler = (metric: WebVitalsMetric) => void

// Thresholds based on web.dev recommendations
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
}

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS]
  if (!threshold) return 'good'
  
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

export function reportWebVitals(onReport: ReportHandler) {
  if (typeof window === 'undefined') return

  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (!lastEntry) return
        const value = lastEntry.startTime
        
        onReport({
          name: 'LCP',
          value,
          rating: getRating('LCP', value),
          delta: value,
          id: `v1-${Date.now()}-${Math.random()}`,
        })
      })
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    } catch (e) {
      console.warn('LCP observation failed:', e)
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceEventTiming[]
        entries.forEach((entry) => {
          const value = entry.processingStart - entry.startTime
          
          onReport({
            name: 'FID',
            value,
            rating: getRating('FID', value),
            delta: value,
            id: `v1-${Date.now()}-${Math.random()}`,
          })
        })
      })
      fidObserver.observe({ type: 'first-input', buffered: true })
    } catch (e) {
      console.warn('FID observation failed:', e)
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        
        onReport({
          name: 'CLS',
          value: clsValue,
          rating: getRating('CLS', clsValue),
          delta: clsValue,
          id: `v1-${Date.now()}-${Math.random()}`,
        })
      })
      clsObserver.observe({ type: 'layout-shift', buffered: true })
    } catch (e) {
      console.warn('CLS observation failed:', e)
    }
  }

  // First Contentful Paint (FCP) and Time to First Byte (TTFB)
  if ('performance' in window && 'getEntriesByType' in performance) {
    window.addEventListener('load', () => {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      const paintEntries = performance.getEntriesByType('paint')
      
      // TTFB
      if (navigationEntries.length > 0 && navigationEntries[0]) {
        const ttfb = navigationEntries[0].responseStart
        onReport({
          name: 'TTFB',
          value: ttfb,
          rating: getRating('TTFB', ttfb),
          delta: ttfb,
          id: `v1-${Date.now()}-${Math.random()}`,
        })
      }
      
      // FCP
      const fcpEntry = paintEntries.find((entry) => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        onReport({
          name: 'FCP',
          value: fcpEntry.startTime,
          rating: getRating('FCP', fcpEntry.startTime),
          delta: fcpEntry.startTime,
          id: `v1-${Date.now()}-${Math.random()}`,
        })
      }
    })
  }
}

export function logWebVitals(metric: WebVitalsMetric) {
  const color = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌'
  console.log(`${color} ${metric.name}: ${Math.round(metric.value)}ms (${metric.rating})`)
}

// Optional: Send to analytics service
export function sendToAnalytics(metric: WebVitalsMetric) {
  // Example: Send to Google Analytics
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
    if (gtag) {
      gtag('event', metric.name, {
        value: Math.round(metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      })
    }
  }
  
  // Or send to your own analytics endpoint
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   body: JSON.stringify(metric),
  //   headers: { 'Content-Type': 'application/json' },
  // })
}
