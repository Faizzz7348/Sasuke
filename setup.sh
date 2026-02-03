#!/bin/bash

echo "🚀 Setting up Lasttable..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create a .env file with your DATABASE_URL"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run migrations
echo "🗄️  Running database migrations..."
npx prisma db push

# Seed database (optional)
echo "🌱 Seeding database..."
npm run prisma:seed || echo "⚠️  Seeding failed or no seed file"

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev:all    # Start both frontend and backend"
echo "  npm run dev        # Frontend only"
echo "  npm run dev:server # Backend only"
