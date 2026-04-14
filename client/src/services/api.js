import axios from "axios";

// Use environment variable with fallback
const API_URL = process.env.REACT_APP_API_URL || "https://public-transport-tracking-mern-1.onrender.com";

console.log("API URL:", API_URL); // Debug log

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for CORS
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Request:", config.method.toUpperCase(), config.url); // Debug log
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("Response:", response.status, response.config.url); // Debug log
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data); // Debug log
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;