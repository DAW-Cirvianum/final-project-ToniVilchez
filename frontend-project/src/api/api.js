// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/api", // Assegura't que és http://localhost
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true, // IMPORTANT per cookies CORS
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor per CORS errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('CORS/Network error. Check your backend CORS configuration.');
      console.error('Request URL:', error.config?.url);
      console.error('Origin:', window.location.origin);
    }
    return Promise.reject(error);
  }
);

export default api;