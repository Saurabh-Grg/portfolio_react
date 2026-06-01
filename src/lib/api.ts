import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    console.log('🔵 API Request:', config.method?.toUpperCase(), config.url);
    console.log('📦 Request Data:', config.data);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Token attached (first 20 chars):', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 and token refresh
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    console.log('📊 Response Data:', response.data);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    console.error('❌ API Error:', error.response?.status, error.config?.url);
    console.error('📝 Error Data:', error.response?.data);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token or redirect to login
        localStorage.removeItem('authToken');
        console.log('🔄 Redirecting to login...');
        window.location.href = '/admin';
        return Promise.reject(error);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
