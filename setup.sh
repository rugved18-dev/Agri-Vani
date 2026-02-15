#!/bin/bash

# Agri-Vani Quick Setup Script
# This script sets up all necessary configuration files

echo "🌾 Agri-Vani Setup Script"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node -v)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup Server
echo ""
echo "📦 Setting up Server..."
cd server
npm install

if [ ! -f .env ]; then
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit server/.env with your configuration"
else
    echo "✅ server/.env already exists"
fi

cd ..

# Setup Client
echo ""
echo "📦 Setting up Client..."
cd client
npm install

if [ ! -f .env ]; then
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit client/.env with your machine IP"
    echo ""
    echo "📍 To find your IP address:"
    echo "   Windows: Run 'ipconfig' and look for IPv4 Address"
    echo "   Mac/Linux: Run 'ifconfig' and look for inet address"
else
    echo "✅ client/.env already exists"
fi

cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit server/.env with your MongoDB URI and Cloudinary credentials"
echo "2. Edit client/.env with your machine IP address"
echo "3. Run 'npm run dev:server' to start the backend"
echo "4. Run 'npm start' from client/ to start the app"
echo ""
echo "📚 For detailed instructions, see SETUP.md"
