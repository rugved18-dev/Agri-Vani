const express = require('express');
const cors = require('cors');

require('dotenv').config();

// Import config and middleware
const connectDB = require('./config/database');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');



// Import routes
const farmerRoutes = require('./routes/farmers');
const cropRoutes = require('./routes/crops');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/authRoutes'); // Import routes
const uploadRoutes = require('./routes/uploadRoutes');
const scanRoutes = require('./routes/scanRoutes');
const weatherRoutes = require('./routes/weatherRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger);

// Test Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Agri-Vani API is Live',
    timestamp: new Date().toISOString(),
    status: 'success',
  });
});

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/farmers', farmerRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/weather', weatherRoutes);


// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error Handler Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Agri-Vani Server is running on http://0.0.0.0:${PORT}`);
  console.log(`📡 API Base URL: http://10.155.222.31:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
