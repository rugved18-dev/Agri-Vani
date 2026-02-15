# Agri-Vani Setup Guide

A complete guide to set up Agri-Vani locally on your machine.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required
- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **MongoDB** ([Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))

### Optional
- **Python** 3.8+ (for AI engine)
- **Android Studio** or **Xcode** (for native testing)
- **Expo Go** app (on your phone for testing)

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Agri-Vani
```

### 2. Install Dependencies

**Root level (optional package manager tools):**
```bash
npm install
```

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd ../client
npm install
```

**AI Engine (Optional):**
```bash
cd ../ai-engine
python -m venv venv

# Activate virtual environment:
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

## Configuration

### 1. Server Environment Setup

Create `.env` file in the `server/` directory:

```bash
cp .env.example .env
```

Edit `server/.env` with your values:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/agri-vani
JWT_SECRET=your_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Client Environment Setup

Create `.env` file in the `client/` directory:

```bash
cp .env.example .env
```

Edit `client/.env` with your machine IP:
```env
EXPO_PUBLIC_API_URL=http://192.168.X.X:5001/api
EXPO_PUBLIC_API_TIMEOUT=10000
```

**To find your Machine IP:**
- **Windows:**
  ```bash
  ipconfig
  # Look for "IPv4 Address" under your network adapter
  ```
- **Mac/Linux:**
  ```bash
  ifconfig
  # Look for inet address
  ```

### 3. MongoDB Setup

**Option A: Local MongoDB**
- Install and start MongoDB
- Connection string: `mongodb://localhost:27017/agri-vani`

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string from "Connect" button
4. Add connection string to `.env`

## Running the Application

### Terminal 1: Start MongoDB (if using local)
```bash
mongod
```

### Terminal 2: Start Backend Server
```bash
cd server
npm run dev
# Or: npm start (for production)
```

Expected output:
```
✅ MongoDB Connected: localhost
Server running on port 5001
```

### Terminal 3: Start Mobile App
```bash
cd client
npm start
# Or: expo start
```

This opens Expo CLI in terminal. You can:
- Press **`a`** to run on Android emulator
- Press **`i`** to run on iOS simulator
- Press **`w`** to run on web (limited features)
- Scan QR code with **Expo Go** app on your phone

### Terminal 4: Start AI Engine (Optional)
```bash
cd ai-engine
python app.py
```

## Troubleshooting

### Network Error: "AxiosError: Network Error"

**Problem:** Client cannot connect to server API

**Solution:**
1. Verify server is running on port 5001
2. Check your machine IP with `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Update `client/.env` with correct IP:
   ```env
   EXPO_PUBLIC_API_URL=http://YOUR_ACTUAL_IP:5001/api
   ```
4. Ensure phone/device is on **same WiFi network** as your computer
5. Disable firewall temporarily to test (Windows Defender):
   - Settings → Firewall & Network Protection → Allow an app

### MongoDB Connection Error

**Problem:** "⚠️ MongoDB Connection Error"

**Solution:**
1. Ensure MongoDB is running
   - Windows: Check Services (mongodb)
   - Mac/Linux: `brew services start mongodb-community`
2. Check MongoDB URI in `.env`
3. If using Atlas, check IP whitelist in Atlas dashboard

### Port Already in Use

**Problem:** "Error: listen EADDRINUSE :::5001"

**Solution:**
```bash
# Find process using port 5001:
# Windows:
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5001
kill -9 <PID>

# Or change PORT in server/.env to 5002, then update client/.env
```

### Node Modules Issues

**Problem:** Strange dependency errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm cache clean --force
npm install
```

### Expo Issues

**Problem:** "Module not found" or "Cannot find module"

**Solution:**
```bash
# In client directory:
npm install expo@latest
npm start
# Press 'r' to reload
```

## File Structure Explained

```
Agri-Vani/
│
├── client/              # 📱 React Native App (Expo)
│   ├── api.js          # API configuration (connects to server)
│   ├── App.js          # Main app component
│   ├── app.json        # Expo configuration
│   ├── screens/        # App screens
│   └── constants/      # Translations, constants
│
├── server/             # 🔧 Node.js Backend
│   ├── index.js        # Server entry point
│   ├── config/         # Configuration (DB, Cloudinary)
│   ├── models/         # MongoDB schemas
│   ├── controllers/    # Business logic
│   ├── routes/         # API endpoints
│   ├── middleware/     # Custom middleware
│   └── .env            # Environment variables (create from .env.example)
│
├── ai-engine/          # 🤖 Python ML Models
│   ├── app.py         # Flask/FastAPI server
│   └── plant_disease_model.h5  # ML model
│
└── README.md           # Project documentation
```

## Next Steps

1. Read [README.md](./README.md) for project overview
2. Check [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines
3. Explore the `/client/screens` folder to understand UI structure
4. Review `/server/routes` to understand API endpoints

## Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Open an issue on GitHub
3. Contact the development team

---

Happy coding! 🌾
