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

// Response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("adminData");
      // Redirect to login page if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH SERVICES ====================
export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/change-password", data),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
};

// ==================== ADMIN SERVICES ====================

// Dashboard Services
export const dashboardService = {
  getStats: () => api.get("/admin/dashboard/stats"),
};

// Analytics Services
export const analyticsService = {
  getStats: (timeRange = "month") => 
    api.get("/admin/analytics/stats", { params: { timeRange } }),
  getTopRoutes: () => api.get("/admin/analytics/top-routes"),
  getRevenueData: () => api.get("/admin/analytics/revenue"),
  getPassengerData: () => api.get("/admin/analytics/passengers"),
};

// Bus Management Services
export const busService = {
  getAll: (params = {}) => api.get("/admin/buses", { params }),
  getById: (id) => api.get(`/admin/buses/${id}`),
  create: (data) => api.post("/admin/buses", data),
  update: (id, data) => api.put(`/admin/buses/${id}`, data),
  delete: (id) => api.delete(`/admin/buses/${id}`),
  updateStatus: (id, status) => api.patch(`/admin/buses/${id}/status`, { status }),
  assignDriver: (id, driverName) => 
    api.patch(`/admin/buses/${id}/assign-driver`, { driverName }),
};

// Driver Management Services
export const driverService = {
  getAll: (params = {}) => api.get("/admin/drivers", { params }),
  getById: (id) => api.get(`/admin/drivers/${id}`),
  create: (data) => api.post("/admin/drivers", data),
  update: (id, data) => api.put(`/admin/drivers/${id}`, data),
  delete: (id) => api.delete(`/admin/drivers/${id}`),
  updateStatus: (id, status) => 
    api.patch(`/admin/drivers/${id}/status`, { status }),
  assignBus: (id, busNumber) => 
    api.patch(`/admin/drivers/${id}/assign-bus`, { busNumber }),
};

// Route Management Services
export const routeService = {
  getAll: (params = {}) => api.get("/admin/routes", { params }),
  getById: (id) => api.get(`/admin/routes/${id}`),
  create: (data) => api.post("/admin/routes", data),
  update: (id, data) => api.put(`/admin/routes/${id}`, data),
  delete: (id) => api.delete(`/admin/routes/${id}`),
  updateStatus: (id, status) => 
    api.patch(`/admin/routes/${id}/status`, { status }),
};

// Report Management Services
export const reportService = {
  getAll: () => api.get("/admin/reports"),
  getById: (id) => api.get(`/admin/reports/${id}`),
  generate: (data) => api.post("/admin/reports", data),
  delete: (id) => api.delete(`/admin/reports/${id}`),
  download: (id) => api.get(`/admin/reports/${id}/download`, { responseType: "blob" }),
};

// ==================== BUS SERVICES (Public) ====================
export const publicBusService = {
  getAll: (params = {}) => api.get("/buses", { params }),
  getById: (id) => api.get(`/buses/${id}`),
  getTracking: (busNumber) => api.get(`/buses/${busNumber}/tracking`),
};

// ==================== ROUTE SERVICES (Public) ====================
export const publicRouteService = {
  getAll: (params = {}) => api.get("/routes", { params }),
  getById: (id) => api.get(`/routes/${id}`),
  getStops: (id) => api.get(`/routes/${id}/stops`),
};

// ==================== BOOKING SERVICES ====================
export const bookingService = {
  create: (data) => api.post("/booking", data),
  getAll: (params = {}) => api.get("/booking", { params }),
  getById: (id) => api.get(`/booking/${id}`),
  update: (id, data) => api.put(`/booking/${id}`, data),
  cancel: (id) => api.patch(`/booking/${id}/cancel`),
  confirm: (id) => api.patch(`/booking/${id}/confirm`),
};

// ==================== CHAT/AI SERVICES ====================
export const chatService = {
  sendMessage: (message) => api.post("/chat", { message }),
  getHistory: () => api.get("/chat/history"),
  clearHistory: () => api.delete("/chat/history"),
};

// ==================== EMAIL SERVICES ====================
export const emailService = {
  send: (data) => api.post("/email/send", data),
  sendBulk: (data) => api.post("/email/send-bulk", data),
  getTemplates: () => api.get("/email/templates"),
  createTemplate: (data) => api.post("/email/templates", data),
};

// ==================== SMS SERVICES ====================
export const smsService = {
  send: (data) => api.post("/sms/send", data),
  sendBulk: (data) => api.post("/sms/send-bulk", data),
  getHistory: () => api.get("/sms/history"),
};

// ==================== EXPORT ALL SERVICES ====================
const apiServices = {
  auth: authService,
  dashboard: dashboardService,
  analytics: analyticsService,
  bus: busService,
  driver: driverService,
  route: routeService,
  report: reportService,
  publicBus: publicBusService,
  publicRoute: publicRouteService,
  booking: bookingService,
  chat: chatService,
  email: emailService,
  sms: smsService,
};

export default api;
export { api };

// ==================== HELPER FUNCTIONS ====================
// Utility function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      success: false,
      message: error.response.data?.message || "An error occurred",
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      success: false,
      message: "No response from server. Please check your connection.",
      status: 503,
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
      status: 500,
    };
  }
};

// Utility function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Utility function to get user data
export const getUserData = () => {
  try {
    const data = localStorage.getItem("adminData");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

// Utility function to check user role
export const hasRole = (role) => {
  const user = getUserData();
  return user?.role === role;
};

// Utility function to check if user is admin
export const isAdmin = () => {
  return hasRole("admin") || hasRole("superadmin");
};