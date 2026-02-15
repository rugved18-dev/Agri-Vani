@echo off
REM Agri-Vani Quick Setup Script for Windows
REM This script sets up all necessary configuration files

echo.
echo 🌾 Agri-Vani Setup Script
echo ==========================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do (
    echo ✅ Node.js found: %%i
)
echo.

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install

REM Setup Server
echo.
echo 📦 Setting up Server...
cd server
call npm install

if not exist .env (
    echo 📝 Creating .env from .env.example...
    copy .env.example .env
    echo ⚠️  Please edit server\.env with your configuration
) else (
    echo ✅ server\.env already exists
)

cd ..

REM Setup Client
echo.
echo 📦 Setting up Client...
cd client
call npm install

if not exist .env (
    echo 📝 Creating .env from .env.example...
    copy .env.example .env
    echo ⚠️  Please edit client\.env with your machine IP
    echo.
    echo 📍 To find your IP address:
    echo    Run 'ipconfig' in Command Prompt and look for IPv4 Address
) else (
    echo ✅ client\.env already exists
)

cd ..

echo.
echo ✅ Setup Complete!
echo.
echo 📝 Next steps:
echo 1. Edit server\.env with your MongoDB URI and Cloudinary credentials
echo 2. Edit client\.env with your machine IP address
echo 3. Run 'npm run dev:server' to start the backend
echo 4. Run 'npm start' from client\ to start the app
echo.
echo 📚 For detailed instructions, see SETUP.md
echo.
pause
