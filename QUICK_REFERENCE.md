# Quick Reference Guide

## 🚀 Quick Start After Improvements

```bash
# Install new dependencies
npm install

# Development mode (with Web Vitals monitoring)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 New Files Reference

### Hooks
- `src/hooks/useTablesQuery.ts` - React Query hooks for table operations
- `src/hooks/useOverviewQuery.ts` - Overview data queries
- `src/hooks/usePerformance.ts` - Performance optimization hooks
- `src/hooks/useSEO.ts` - SEO meta tag management

### Components
- `src/components/ErrorBoundary.tsx` - Error boundary wrapper
- `src/components/SEO.tsx` - Dynamic SEO component
- `src/components/ui/virtualized-list.tsx` - List virtualization

### Libraries
- `src/lib/react-query.ts` - Query client configuration
- `src/lib/web-vitals.ts` - Performance monitoring
- `src/lib/cache.ts` - Caching utilities
- `src/lib/image-optimization.ts` - Image helpers

## 🔧 Usage Examples

### React Query for Data Fetching
```tsx
import { useTablesQuery } from '@/hooks/useTablesQuery'

function MyComponent() {
  const { data, isLoading, error } = useTablesQuery('selangor')
  
  if (isLoading) return <Spinner />
  if (error) return <Error message={error.message} />
  return <TableList tables={data} />
}
```

### Error Boundary
```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary'

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Dynamic SEO
```tsx
import { SEO } from '@/components/SEO'

<SEO 
  title="My Page - Sasuke"
  description="Page description"
  keywords={['route', 'management']}
/>
```

### Virtualized List
```tsx
import { VirtualizedList } from '@/components/ui/virtualized-list'

<VirtualizedList
  items={largeDataArray}
  itemHeight={80}
  containerHeight={600}
  renderItem={(item, index) => <ItemComponent item={item} />}
  overscan={3}
/>
```

### Debounce Input
```tsx
import { useDebounce } from '@/hooks/usePerformance'

const debouncedSearch = useDebounce((query: string) => {
  // Perform search
}, 300)

<input onChange={(e) => debouncedSearch(e.target.value)} />
```

### Cache Data
```tsx
import { cache, localStorageCache } from '@/lib/cache'

// Memory cache (clears on refresh)
cache.set('key', data, 5 * 60 * 1000) // 5 minutes
const cached = cache.get('key')

// Persistent cache
localStorageCache.set('settings', settings, 24 * 60 * 60 * 1000) // 24 hours
const settings = localStorageCache.get('settings')
```

### Intersection Observer
```tsx
import { useIntersectionObserver } from '@/hooks/usePerformance'

const ref = useIntersectionObserver((isVisible) => {
  if (isVisible) {
    // Load more data, track views, etc.
  }
}, { threshold: 0.5 })

<div ref={ref}>Content</div>
```

### Media Query Hook
```tsx
import { useMediaQuery } from '@/hooks/usePerformance'

const isMobile = useMediaQuery('(max-width: 768px)')
const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

return isMobile ? <MobileView /> : <DesktopView />
```

## 📊 Monitoring

### View Web Vitals in Console (Development)
```
✅ LCP: 1234ms (good)
⚠️ FID: 150ms (needs-improvement)
✅ CLS: 0.05 (good)
```

### Send to Analytics (Production)
```tsx
import { reportWebVitals, sendToAnalytics } from '@/lib/web-vitals'

// In main.tsx or App.tsx
reportWebVitals(sendToAnalytics)
```

## 🎯 Performance Tips

### 1. Lazy Load Heavy Components
```tsx
const HeavyChart = lazy(() => import('@/components/HeavyChart'))

<Suspense fallback={<Spinner />}>
  <HeavyChart />
</Suspense>
```

### 2. Optimize Images
```tsx
import { getOptimizedImageProps } from '@/lib/image-optimization'

<img {...getOptimizedImageProps({
  src: '/image.jpg',
  alt: 'Description',
  width: 800,
  loading: 'lazy'
})} />
```

### 3. Prefetch Data
```tsx
import { queryClient } from '@/lib/react-query'

// Prefetch before navigation
queryClient.prefetchQuery({
  queryKey: ['tables', 'kl'],
  queryFn: () => fetch('/api/tables?region=kl').then(r => r.json())
})
```

### 4. Memoize Expensive Calculations
```tsx
import { memoize } from '@/lib/cache'

const expensiveFunction = memoize((arg: string) => {
  // Expensive calculation
  return result
})
```

## 🐛 Debugging

### React Query DevTools (Optional)
```bash
npm install @tanstack/react-query-devtools
```

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Check Bundle Size
```bash
npm run build
# Check dist/ folder sizes
```

### Lighthouse Audit
```bash
# In Chrome DevTools
# Lighthouse tab > Generate report
```

## 📚 Documentation Files

- `README.md` - Main project documentation
- `IMPROVEMENTS_COMPLETE.md` - Detailed improvement docs
- `IMPROVEMENTS_SUMMARY.md` - High-level summary
- `BEFORE_AFTER.md` - Code comparisons
- `QUICK_REFERENCE.md` - This file

## 🔗 Useful Links

- React Query: https://tanstack.com/query
- Web Vitals: https://web.dev/vitals/
- Vite: https://vitejs.dev/
- TypeScript: https://www.typescriptlang.org/

## ⚡ Performance Checklist

- [x] Code splitting implemented
- [x] Lazy loading for routes
- [x] React Query for caching
- [x] Bundle optimization
- [x] Image optimization utilities
- [x] Web Vitals monitoring
- [x] Error boundaries
- [x] Accessibility (ARIA)
- [x] SEO meta tags
- [x] TypeScript strict mode
- [x] Virtualized lists for large data
- [x] Performance hooks (debounce, throttle, etc.)
- [x] Caching utilities

## 🎓 Learning Resources

### React Query
- Queries: Fetching data
- Mutations: Creating/updating data
- Invalidation: Refreshing data
- Caching: Automatic data management

### Performance Patterns
- Code splitting: Reduce initial bundle
- Lazy loading: Load on demand
- Memoization: Cache expensive calculations
- Virtualization: Render only visible items
- Debouncing: Limit function calls
- Throttling: Control execution rate

### Web Vitals
- LCP: < 2.5s is good
- FID: < 100ms is good
- CLS: < 0.1 is good
- FCP: < 1.8s is good
- TTFB: < 800ms is good

---

Need help? Check the detailed docs in `IMPROVEMENTS_COMPLETE.md` 📖
