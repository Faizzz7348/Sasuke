# Sasuke - Modern Route Management System

A high-performance, production-ready route and table management system built with React, TypeScript, and Vite.

## ✨ Features

- 🚀 **High Performance**: Code splitting, lazy loading, and optimized bundle sizes
- 📊 **Smart Data Management**: React Query for efficient caching and data synchronization
- ♿ **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation
- 🎨 **Modern UI**: Built with shadcn/ui and Radix UI components
- 📱 **Progressive Web App**: Offline support and installable
- 🔍 **SEO Optimized**: Dynamic meta tags and Open Graph support
- 🛡️ **Robust Error Handling**: Error boundaries for graceful failure recovery
- 📈 **Performance Monitoring**: Built-in Web Vitals tracking
- 🎯 **Type Safe**: Full TypeScript with strict mode
- 🗄️ **Database Backed**: Prisma ORM with PostgreSQL

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run both frontend and backend
npm run dev:all

# Build for production
npm run build
```

## 📦 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS 4
- **State Management**: React Query (TanStack Query)
- **Database**: Prisma + PostgreSQL
- **Backend**: Express.js
- **Icons**: Lucide React

## 🏗️ Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── ui/         # Base UI components
│   ├── ErrorBoundary.tsx
│   └── SEO.tsx
├── contexts/       # React contexts
├── hooks/          # Custom React hooks
│   ├── useTablesQuery.ts
│   ├── useOverviewQuery.ts
│   └── usePerformance.ts
├── lib/            # Utility libraries
│   ├── react-query.ts
│   ├── web-vitals.ts
│   ├── cache.ts
│   └── image-optimization.ts
├── pages/          # Page components
└── api/            # API utilities
```

## 🎯 Performance Features

### Code Splitting
- Lazy loading for all routes
- Manual chunk splitting for vendors
- Optimized bundle sizes

### Data Management
- Automatic background refetching
- Intelligent caching with React Query
- Optimistic updates

### Rendering
- Virtualized lists for large datasets
- Suspense boundaries for smooth loading
- Efficient re-renders with memoization

## ♿ Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly
- Semantic HTML structure

## 📊 Monitoring

The app includes built-in Web Vitals monitoring:
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)
- FCP (First Contentful Paint)
- TTFB (Time to First Byte)

Metrics are logged in development mode and ready for production analytics integration.

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start frontend dev server
npm run dev:server       # Start backend server
npm run dev:all          # Start both servers concurrently

# Build
npm run build            # Build for production
npm run preview          # Preview production build

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:seed      # Seed database

# Linting
npm run lint             # Run ESLint
```

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm run vercel-build
```

The app is configured for Vercel deployment with proper build commands.

## 📝 Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/sasuke"
PORT=3001
```

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines first.

## 📄 License

MIT

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

For detailed improvement documentation, see [IMPROVEMENTS_COMPLETE.md](./IMPROVEMENTS_COMPLETE.md)

