# Quick Start Guide

## Problem: "Cannot create table"

If you're getting errors when trying to create tables, follow these steps:

### 1. Check Backend Server
Make sure the backend server is running on port 3001:
```bash
# Check if server is running
curl http://localhost:3001/api/tables

# If not running, start it
npm run dev:server
```

### 2. Run Database Setup
```bash
# Option 1: Use the setup script
chmod +x setup.sh
./setup.sh

# Option 2: Manual setup
npm install
npx prisma generate
npx prisma db push
```

### 3. Start Both Servers
```bash
# Start both frontend and backend
npm run dev:all
```

## Common Issues

### "Failed to connect to server"
- Backend server is not running on port 3001
- Run: `npm run dev:server` in a separate terminal

### "Database error"
- Database URL is not configured
- Check `.env` file has valid `DATABASE_URL`
- Run: `npx prisma db push` to create tables

### "Prisma Client not generated"
- Run: `npx prisma generate`

## Development Commands

```bash
# Frontend only (port 5173)
npm run dev

# Backend only (port 3001)
npm run dev:server

# Both together (recommended)
npm run dev:all

# Database tools
npx prisma studio      # Visual database editor
npx prisma db push     # Apply schema to database
npm run prisma:seed    # Seed database with sample data
```

## API Endpoints

- `GET /api/tables?region=selangor` - Get all tables
- `POST /api/tables` - Create new table
- `GET /api/tables/:id` - Get table by ID
- `POST /api/tables/:id/data` - Add row to table
- `PUT /api/tables/:id/data` - Update table rows
- `DELETE /api/tables/:id/data/:rowId` - Delete row

## Environment Variables

Create a `.env` file with:
```
DATABASE_URL="your-postgresql-connection-string"
VITE_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

See `.env.example` for all available environment variables.
