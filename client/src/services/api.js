import axios from "axios";

const API_URL = "https://public-transport-tracking-mern-1.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("🌐 Full URL:", config.baseURL + config.url);

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;