// client/src/services/api.js
import axios from "axios";

// IMPORTANT: No trailing slash, no /api at the end
const API_URL = "https://public-transport-tracking-mern-1.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // This will show the complete URL being called
    console.log("🌐 Full URL:", config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;