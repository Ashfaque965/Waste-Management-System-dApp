#!/bin/bash

# Waste Management System - Quick Start Script

echo "🌍 Waste Management System dApp - Quick Start"
echo "=============================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi

echo "✅ Node.js found: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo ""

echo "Installing backend dependencies..."
cd backend && npm install && cd ..
echo "✅ Backend dependencies installed"
echo ""

echo "Installing frontend dependencies..."
cd frontend && npm install && cd ..
echo "✅ Frontend dependencies installed"
echo ""

echo "Installing contract dependencies..."
cd contracts && npm install && cd ..
echo "✅ Contract dependencies installed"
echo ""

# Copy environment files
echo "⚙️  Setting up environment files..."
echo ""

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
fi

if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env"
fi

echo ""
echo "🚀 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Open backend/.env and set DEPLOYER_PRIVATE_KEY"
echo "2. Run: npm run hardhat:node (in contracts folder)"
echo "3. Run: npm run deploy (in contracts folder)"
echo "4. Run: npm run dev (in backend folder)"
echo "5. Run: npm start (in frontend folder)"
echo ""
echo "📚 For more details, see docs/SETUP.md"
