# Performance Optimization Guide

## 🎯 Quick Wins Implemented

### 1. React Performance
```typescript
// ✅ Before: Component re-renders unnecessarily
export function MyComponent({ data }) { ... }

// ✅ After: Memoized component
export const MyComponent = memo(function MyComponent({ data }) { ... })
```

### 2. Expensive Computations
```typescript
// ✅ Before: Recalculated on every render
const filtered = rows.filter(...)

// ✅ After: Memoized computation
const filtered = useMemo(() => rows.filter(...), [rows, deps])
```

### 3. Event Handlers
```typescript
// ✅ Before: New function on every render
onClick={() => handleClick(id)}

// ✅ After: Memoized callback
const handleClickMemo = useCallback(() => handleClick(id), [id])
```

### 4. Search Input
```typescript
// ✅ Before: Filter on every keystroke
<Input onChange={(e) => setSearch(e.target.value)} />

// ✅ After: Debounced search
const debouncedSearch = useDebounce(search, 300)
useEffect(() => { filterData(debouncedSearch) }, [debouncedSearch])
```

## 📊 Data Structure Optimizations

### Map vs Array Lookup
```typescript
// ❌ Before: O(n) lookup
const item = array.find(x => x.id === targetId)

// ✅ After: O(1) lookup
const map = new Map(array.map(x => [x.id, x]))
const item = map.get(targetId)
```

### Set for Deduplication
```typescript
// ❌ Before: O(n²) deduplication
const unique = array.filter((v, i, a) => a.indexOf(v) === i)

// ✅ After: O(n) deduplication
const unique = [...new Set(array)]
```

### Single-Pass Reduce
```typescript
// ❌ Before: Multiple passes
const sum = array.reduce((a, b) => a + b, 0)
const count = array.length
const avg = sum / count

// ✅ After: Single pass
const stats = array.reduce((acc, val) => ({
  sum: acc.sum + val,
  count: acc.count + 1,
  avg: (acc.sum + val) / (acc.count + 1)
}), { sum: 0, count: 0, avg: 0 })
```

## 🚀 Code Splitting Strategy

### 1. Route-Based Splitting
```typescript
// ✅ Lazy load route components
const Dashboard = lazy(() => import('./Dashboard'))

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

### 2. Component-Based Splitting
```typescript
// ✅ Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'))

// Only loads when rendered
{showChart && (
  <Suspense fallback={<Spinner />}>
    <HeavyChart data={data} />
  </Suspense>
)}
```

### 3. Library Splitting
```typescript
// ✅ Dynamic imports for large libraries
const exportToExcel = async () => {
  const XLSX = await import('xlsx')
  // Use XLSX only when needed
}
```

## 🎨 UI Performance Tips

### 1. Virtualization for Long Lists
```typescript
// For lists with 1000+ items
import { useVirtualizer } from '@tanstack/react-virtual'

const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 50,
  overscan: 5
})
```

### 2. CSS Animations over JS
```css
/* ✅ Hardware accelerated */
.fade-in {
  animation: fadeIn 0.3s ease-in;
  transform: translateZ(0); /* Force GPU */
}
```

### 3. Image Optimization
```typescript
// ✅ Next.js Image component
import Image from 'next/image'

<Image
  src="/logo.png"
  width={100}
  height={100}
  loading="lazy"
  placeholder="blur"
/>
```

## 🔍 Debugging Performance

### 1. React DevTools Profiler
```typescript
// Wrap component to profile
<Profiler id="MyComponent" onRender={callback}>
  <MyComponent />
</Profiler>
```

### 2. Chrome Performance Tab
1. Open DevTools → Performance
2. Click Record
3. Interact with app
4. Stop and analyze flame graph

### 3. Why Did You Render
```typescript
// Install: npm install @welldone-software/why-did-you-render

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  })
}
```

## 📦 Bundle Size Optimization

### 1. Analyze Bundle
```bash
# Next.js bundle analyzer
npm install @next/bundle-analyzer

# Run build and analyze
ANALYZE=true npm run build
```

### 2. Tree Shaking
```typescript
// ✅ Named imports (tree-shakeable)
import { format } from 'date-fns'

// ❌ Default imports (not tree-shakeable)
import moment from 'moment'
```

### 3. Dynamic Imports
```typescript
// ✅ Load only when needed
const loadHeavyLibrary = async () => {
  const lib = await import('heavy-library')
  return lib.doSomething()
}
```

## 🎯 Measurement Metrics

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### React Metrics
- **Time to Interactive**: < 3.8s
- **Re-render Count**: Minimize
- **Component Mount Time**: < 100ms

### Custom Metrics
```typescript
// Measure operation time
const startTime = performance.now()
// ... operation ...
const endTime = performance.now()
console.log(`Operation took ${endTime - startTime}ms`)
```

## 🛠️ Tools & Resources

### Performance Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [React DevTools Profiler](https://react.dev/reference/react/Profiler)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [WebPageTest](https://www.webpagetest.org/)

### Bundle Analyzers
- [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)
- [source-map-explorer](https://www.npmjs.com/package/source-map-explorer)

### Monitoring
- [Vercel Analytics](https://vercel.com/analytics)
- [Sentry Performance](https://sentry.io/for/performance/)
- [New Relic Browser](https://newrelic.com/products/browser-monitoring)

## 💡 Pro Tips

1. **Profile Before Optimizing**: Don't guess, measure!
2. **Focus on User Perception**: Users care about perceived performance
3. **Progressive Enhancement**: Start with fast baseline, add features
4. **Lazy Load Everything**: Load only what's needed, when needed
5. **Cache Aggressively**: Use browser cache, Service Workers, CDNs
6. **Minimize Bundle Size**: Every KB counts on mobile
7. **Optimize Images**: Images are usually the biggest assets
8. **Use Web Workers**: Offload heavy computations
9. **Implement Pagination**: Don't load all data at once
10. **Monitor Real Users**: Real user metrics > synthetic tests

## 🎓 Learning Resources

- [Web.dev Performance](https://web.dev/performance/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [JavaScript Performance Tips](https://developers.google.com/web/fundamentals/performance/rendering)

---

Remember: **Premature optimization is the root of all evil**, but planned optimization is the path to success! 🚀
