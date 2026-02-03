# Vercel Deployment Guide

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- GitHub repository connected to Vercel
- PostgreSQL database (Neon, Supabase, or PlanetScale recommended)

## Environment Variables
Add the following environment variables in your Vercel project settings:

```bash
# Required
DATABASE_URL="your-postgres-connection-string"
VITE_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Optional (for production)
NODE_ENV="production"
```

### Database Providers (Recommended)
For Prisma to work properly on Vercel serverless, use a connection pooler:
- **Neon** (recommended): https://neon.tech - Built-in pooling
- **Supabase**: https://supabase.com - Connection pooling available
- **PlanetScale**: https://planetscale.com - Serverless-friendly

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Framework Preset: **Vite**
4. Build Command: `npm run vercel-build`
5. Output Directory: `dist`
6. Install Command: `npm install`
7. Add environment variables (see above)
8. Click **Deploy**!

### Option 2: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to project (first time only)
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Database Setup

### First Deployment
Your database migrations will run automatically during build via the `vercel-build` script:
```json
"vercel-build": "prisma generate && vite build"
```

### Manual Migration (if needed)
```bash
# Run migrations locally first
npm run prisma:migrate

# Then push to Vercel
git push
```

## Project Structure for Vercel
```
/
├── api/                    # Serverless API functions
│   ├── server.ts          # Main API handler
│   └── lib/               # Shared utilities
├── src/                   # Frontend React app
├── prisma/                # Database schema & migrations
├── dist/                  # Build output (auto-generated)
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies & scripts
```

## API Routes
All API endpoints are proxied through `/api/*`:
- `GET /api/health` - Health check
- `GET /api/overview` - Dashboard overview data
- `GET /api/tables` - List all tables
- `GET /api/tables/:id` - Get specific table
- `POST /api/tables` - Create new table
- `POST /api/tables/:id/data` - Add row to table
- `PUT /api/tables/:id/data` - Update table rows
- `DELETE /api/tables/:id/data/:rowId` - Delete row

## Local Development
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your actual values

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed

# Start development server (frontend + backend)
npm run dev:all

# Or run separately
npm run dev          # Frontend only
npm run dev:server   # Backend only
```

## Features

### Edit Mode
- Edit mode state persists in localStorage
- Toggle from sidebar settings
- Shows/hides admin controls throughout the app
- Enables editing of table data

### Table Management
- View multiple tables by region (Selangor, KL)
- CRUD operations on table rows
- Column customization
- Google Maps integration
- Real-time filtering and sorting

## Troubleshooting

### Database Connection Issues
- ✅ Ensure `DATABASE_URL` is set in Vercel environment variables
- ✅ Use connection pooling for serverless environments
- ✅ Check that your database allows connections from Vercel IPs
- ✅ For Neon: Use the pooled connection string (ends with `?sslmode=require`)

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json` (not devDependencies)
- Verify TypeScript compilation passes locally: `npm run build`
- Check Prisma schema is valid: `npx prisma validate`

### API Routes Not Working
- Check that `/api/server.ts` exists and exports default app
- Verify `vercel.json` routing configuration
- Test API endpoints locally first: `npm run dev:server`
- Check Vercel function logs for errors

### Edit Mode Not Persisting
- Check browser localStorage is enabled
- Clear cache and reload
- Check console for errors

### Google Maps Not Loading
- Verify `VITE_GOOGLE_MAPS_API_KEY` is set in Vercel
- Check API key restrictions in Google Cloud Console
- Ensure Maps JavaScript API is enabled

## Performance Tips

1. **Database Connection Pooling**: Always use pooled connections for Vercel
2. **Caching**: Enable Vercel Edge Caching for static assets
3. **Bundle Size**: Keep dependencies minimal
4. **Prisma**: Use `prisma generate` in build step

## Security Checklist

- [ ] Environment variables set in Vercel (not in code)
- [ ] Database credentials secure
- [ ] API endpoints validated
- [ ] CORS properly configured
- [ ] Google Maps API key restricted to your domain

## Support

For issues:
1. Check Vercel deployment logs
2. Review this troubleshooting guide
3. Check Prisma docs: https://www.prisma.io/docs
4. Vercel docs: https://vercel.com/docs

