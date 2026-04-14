import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    if (token) {
      api
        .get("/auth/me", {   // ✅ FIXED
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const userData = response.data.data;
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  /* ================= LOGIN ================= */
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {  // ✅ FIXED
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      const data = response.data.data;

      const token = data.token;
      const user = data;

      if (!token) {
        throw new Error("Token not received");
      }

      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  };

  /* ================= REGISTER ================= */
  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData); // ✅ FIXED

      console.log("REGISTER RESPONSE:", response.data);

      const data = response.data.data;

      const token = data.token;
      const user = data;

      if (!token) {
        throw new Error("Token not received");
      }

      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return response.data;
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);
      throw error;
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};