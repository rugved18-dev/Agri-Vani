# 🌾 Agri-Vani

A Native Android App for Indian farmers using the MERN Stack + React Native (Expo).

## 📋 Project Overview

Agri-Vani is a modern monorepo project built with a scalable architecture separating frontend and backend concerns:

- **Mobile App**: React Native app built with Expo (Managed Workflow)
- **Backend**: Node.js + Express with MongoDB and Mongoose
- **Architecture**: MVC pattern with modular structure

## 🏗️ Project Structure

```
Agri-Vani/
│
├── client/                          # 📱 React Native Expo App
│   ├── App.js                       # Main app entry point
│   ├── app.json                     # Expo configuration
│   ├── package.json                 # Client dependencies
│   ├── assets/                      # Images, icons, fonts
│   │   └── README.md
│   └── .gitignore
│
├── server/                          # 🔧 Node.js + Express Backend
│   ├── index.js                     # Server entry point
│   ├── package.json                 # Server dependencies
│   ├── .env                         # Environment variables
│   ├── .gitignore
│   │
│   ├── config/                      # 🔐 Configuration files
│   │   └── database.js              # MongoDB connection
│   │
│   ├── models/                      # 📊 MongoDB Schemas
│   │   ├── Farmer.js                # Farmer schema
│   │   └── Crop.js                  # Crop schema
│   │
│   ├── controllers/                 # 🎮 Business logic
│   │   └── farmerController.js      # Farmer operations (CRUD)
│   │
│   ├── routes/                      # 🛣️ API routes
│   │   └── farmers.js               # Farmer API endpoints
│   │
│   └── middleware/                  # ⚙️ Custom middleware
│       ├── logger.js                # Request logging
│       └── errorHandler.js          # Error handling
│
├── .gitignore                       # Root git ignore
└── README.md                        # Project documentation
```

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Mobile App** | React Native (Expo) |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Language** | JavaScript (ES6+) |
| **Architecture** | MVC (Model-View-Controller) |

## 📥 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud)
- Expo CLI

### Step 1: Clone & Navigate

```bash
cd d:\New folder (4)\Agri-Vani
```

### Step 2: Setup Server

```bash
cd server
npm install
```

### Step 3: Setup Client

```bash
cd ../client
npm install -g create-expo-app
npx create-expo-app .
npm install
```

## 🚀 Running the Application

### Terminal 1 - Start Server

```bash
cd server
npm start
# or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:5000`

### Terminal 2 - Start Client

```bash
cd client
npm start
```

Follow the prompts to:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for web

## 🔌 API Endpoints

### Test Routes
- `GET /` - API status check
- `GET /health` - Server health check

### Farmer Routes
- `GET /api/farmers` - Get all farmers
- `GET /api/farmers/:id` - Get farmer by ID
- `POST /api/farmers` - Create new farmer
- `PUT /api/farmers/:id` - Update farmer
- `DELETE /api/farmers/:id` - Delete farmer

## 📝 Environment Variables

Create a `.env` file in the `server` folder:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/agri-vani

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## 📊 Database Schema

### Farmer Model
```javascript
{
  name: String,
  email: String (unique),
  phone: String (unique),
  location: String,
  farmSize: Number (in acres),
  crops: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Crop Model
```javascript
{
  name: String,
  season: String (Kharif, Rabi, Summer),
  yield: Number (in tons),
  price: Number (market price),
  farmerId: ObjectId (reference to Farmer),
  createdAt: Date,
  updatedAt: Date
}
```

## 📱 Client Features

- Fetch API status from backend
- Display real-time server health
- Request/Response handling with Axios
- Clean UI with React Native components

## 🔒 Middleware

### Logger Middleware
- Logs all incoming requests with timestamp

### Error Handler Middleware
- Centralized error handling
- Mongoose validation errors
- Duplicate key errors
- Custom error messages

## 📚 Project Structure Benefits

✅ **Separation of Concerns** - Clear division between business logic, routes, and controllers
✅ **Scalability** - Easy to add new models, controllers, and routes
✅ **Maintainability** - Organized file structure for quick navigation
✅ **Reusability** - Modular components can be reused across the app
✅ **Testability** - Isolated components are easier to test

## 🎯 Next Steps

1. ✅ Setup MongoDB locally or use MongoDB Atlas
2. ✅ Initialize server: `npm install && npm start`
3. ✅ Initialize client: `npm install && npm start`
4. ✅ Test API endpoints using Postman or similar tool
5. ✅ Begin building features!

## 📚 Useful Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)

## 📄 License

MIT License - feel free to use this project as a template!

---

**Happy Coding! 🚀 Build amazing solutions for Indian farmers!**
