# Quick Start Guide - Agri-Vani

Get Agri-Vani running in less than 10 minutes!

## Pre-Check: Do You Have These Installed?

```bash
node -v          # Should be v16 or higher
npm -v           # Should be v7 or higher
```

If not, install from [nodejs.org](https://nodejs.org/)

## Step 1: Clone & Install (2 minutes)

```bash
git clone <your-repo-url>
cd Agri-Vani

# Windows
setup.bat

# Mac/Linux
bash setup.sh
```

## Step 2: Configure (3 minutes)

### Edit `server/.env`
```bash
# Open server/.env and add:
MONGODB_URI=mongodb://localhost:27017/agri-vani
JWT_SECRET=your-secret-key-123
```

### Edit `client/.env`
```bash
# Find your IP address:
# Windows: Open Command Prompt, run: ipconfig

# Update client/.env:
EXPO_PUBLIC_API_URL=http://192.168.1.100:5001/api
```

## Step 3: Start Everything (2 minutes)

### Terminal 1: Start Backend
```bash
cd server
npm run dev
```

**Expected output:**
```
✅ MongoDB Connected: localhost
Server running on port 5001
```

### Terminal 2: Start Frontend
```bash
cd client
npm start
```

**Expected output:**
```
Expo development server is running on xxxxxx
```

## Step 4: Test on Your Phone (1 minute)

1. Install **Expo Go** app on your phone (iOS or Android)
2. Scan the QR code from Terminal 2
3. App should open on your phone!

## Troubleshooting

### "Network Error" on Phone?
```bash
# Check your machine IP:
ipconfig        # Windows
ifconfig        # Mac/Linux

# Update client/.env with correct IP
EXPO_PUBLIC_API_URL=http://YOUR_IP:5001/api

# Reload Expo by pressing 'r' in Terminal 2
```

### "MongoDB Connection Error"?
```bash
# Start MongoDB (Windows)
mongod

# Or use MongoDB Atlas: https://www.mongodb.com/atlas
```

### Port Already in Use?
```bash
# Windows: Change PORT in server/.env
PORT=5002

# Then update client/.env
EXPO_PUBLIC_API_URL=http://YOUR_IP:5002/api
```

## What's Next?

- 📖 Read [SETUP.md](./SETUP.md) for detailed setup
- 🎯 Check [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute
- 🐛 Found a bug? [Report it here](https://github.com/your-repo/issues)

## Still Stuck?

1. Check [SETUP.md](./SETUP.md) Troubleshooting section
2. Make sure WiFi is connected
3. Verify firewall isn't blocking port 5001
4. Open an issue on GitHub

---

**You're all set!** 🌾 Happy farming! 👨‍🌾👩‍🌾
