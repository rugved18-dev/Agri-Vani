import axios from 'axios';

// Get API URL from environment variables or use default
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/api';
const TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '10000', 10);

const api = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.status}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ API Error: ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      console.error('❌ Network Error: No response received from server');
      console.error('   Check: 1) Server is running on port 5001');
      console.error('          2) Your IP address is correct in .env');
      console.error('          3) Phone/device is on same WiFi as computer');
    } else {
      console.error(`❌ Error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default api;