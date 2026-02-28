import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.155.222.31:5001/api';
const TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '10000', 10);
const UPLOAD_TIMEOUT = 60000;

console.log('🌐 API configured to connect to:', API_URL);

// Standard API instance
const api = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: { 'Accept': 'application/json' },
});

// Upload/AI instance with longer timeout
export const uploadApi = axios.create({
  baseURL: API_URL,
  timeout: UPLOAD_TIMEOUT,
  headers: { 'Accept': 'application/json' },
});

// ✅ Auto-attach JWT token to every request
const authInterceptor = async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    console.warn('Could not read token from storage:', e.message);
  }
  console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
  console.log(`   Timeout: ${config.timeout}ms`);
  return config;
};

api.interceptors.request.use(authInterceptor, (error) => Promise.reject(error));
uploadApi.interceptors.request.use(authInterceptor, (error) => Promise.reject(error));

// Shared error handler
const handleResponseError = (error) => {
  if (error.response) {
    console.error(`❌ API Error: ${error.response.status} - ${error.response.statusText}`);
    console.error(`   Response:`, error.response.data);
  } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    console.error('⏱️ Request Timed Out');
    console.error('   Error:', error.message);
  } else if (error.request) {
    console.error('❌ Network Error: No response received from server');
    console.error('   API URL:', API_URL);
    console.error('   Error code:', error.code, '| Message:', error.message);
  } else {
    console.error(`❌ Error: ${error.message}`);
  }
  return Promise.reject(error);
};

api.interceptors.response.use((r) => {
  console.log(`📥 API Response: ${r.status}`);
  return r;
}, handleResponseError);

uploadApi.interceptors.response.use((r) => {
  console.log(`📥 Response: ${r.status}`);
  return r;
}, handleResponseError);

export default api;