# Lasttable - Table Management Application

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database

Create a `.env` file in the root directory with your database URL:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/lasttable"
```

### 3. Initialize Prisma

Generate Prisma Client:
```bash
npm run prisma:generate
```

Push schema to database:
```bash
npm run prisma:push
```

Seed initial data:
```bash
npm run prisma:seed
```

### 4. Run the Application

Run both frontend and backend together:
```bash
npm run dev:all
```

Or run them separately:
- Frontend only: `npm run dev`
- Backend API only: `npm run dev:server`

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### 5. View Database (Optional)

Open Prisma Studio to view/edit database records:
```bash
npm run prisma:studio
```

## Features Implemented

### ✅ Completed
- Removed all mock data from components
- Implemented database integration with Prisma
- Created API routes for:
  - Fetching tables by region
  - Creating new tables
  - Adding table rows
  - Updating table data
  - Deleting table rows
  - Overview statistics
- Fixed create table functionality with form validation
- Added loading states
- Implemented real-time data fetching

## API Endpoints

### Tables
- `GET /api/tables?region=selangor` - Get all tables for a region
- `GET /api/tables/:id` - Get single table with data
- `POST /api/tables` - Create new table
- `POST /api/tables/:id/data` - Add row to table
- `PUT /api/tables/:id/data` - Update multiple rows
- `DELETE /api/tables/:id/data/:rowId` - Delete a row

### Overview
- `GET /api/overview` - Get dashboard statistics

## Database Schema

The application uses PostgreSQL with the following models:
- **Table** - Stores table metadata
- **TableData** - Stores table rows/records
- **Activity** - Stores activity logs
- **User** - Stores user information

## Technologies Used

- React 19
- TypeScript
- Vite
- Prisma ORM
- PostgreSQL
- Express.js
- Tailwind CSS
- Radix UI Components
