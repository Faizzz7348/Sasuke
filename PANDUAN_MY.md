# Panduan Penyelesaian Masalah

## Masalah: "Tak boleh nak create table"

### Langkah 1: Pastikan Backend Server Running
```bash
# Semak server backend (port 3001)
curl http://localhost:3001/api/tables

# Kalau tak jalan, start server:
npm run dev:server
```

### Langkah 2: Setup Database
```bash
# Guna script auto setup
chmod +x setup.sh
./setup.sh

# ATAU setup manual:
npm install                # Install packages
npx prisma generate        # Generate Prisma client
npx prisma db push         # Buat tables dalam database
```

### Langkah 3: Start Semua
```bash
# Start frontend DAN backend sekaligus
npm run dev:all
```

## Masalah Biasa

### ❌ "Failed to connect to server"
**Punca**: Backend server tak jalan
**Penyelesaian**: 
```bash
npm run dev:server
```

### ❌ "Database error" 
**Punca**: Database belum setup atau URL salah
**Penyelesaian**:
1. Check `.env` file ada `DATABASE_URL`
2. Run: `npx prisma db push`

### ❌ "Prisma Client not generated"
**Penyelesaian**:
```bash
npx prisma generate
```

## Command Penting

```bash
# Frontend sahaja (port 5173)
npm run dev

# Backend sahaja (port 3001)  
npm run dev:server

# Kedua-dua sekali (RECOMMENDED)
npm run dev:all

# Database tools
npx prisma studio          # Lihat data dalam database
npx prisma db push         # Update database schema
npm run prisma:seed        # Isi sample data
```

## Checklist

Sebelum create table, pastikan:
- [ ] `.env` file wujud dengan DATABASE_URL
- [ ] Prisma client dah generate: `npx prisma generate`
- [ ] Database tables dah dibuat: `npx prisma db push`
- [ ] Backend server running: `npm run dev:server`
- [ ] Frontend server running: `npm run dev`

## Port Yang Digunakan

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Prisma Studio: http://localhost:5555 (bila run `npx prisma studio`)
