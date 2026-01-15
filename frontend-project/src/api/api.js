import axios from "axios";

const isProduction = window.location.hostname.includes('azurestaticapps.net');

const api = axios.create({
  baseURL: isProduction 
    ? "https://backend-toni-bvcxdnaegrgkgkbt.westeurope-01.azurewebsites.net/api"
    : "http://localhost:8000/api",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
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

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;