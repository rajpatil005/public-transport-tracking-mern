// client/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  /* ===============================
     FETCH CURRENT USER
  =============================== */
  const fetchUser = async () => {
    try {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) return;

      const response = await api.get("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      setUser(response.data.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  /* ===============================
     LOGIN
  =============================== */
  const login = async (email, password) => {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    const data = response.data.data;
    const token = data.token;

    localStorage.setItem("token", token);
    setToken(token);
    setUser(data);

    return response.data;
  };

  /* ===============================
     REGISTER  ✅ FIXED
  =============================== */
  const register = async (userData) => {
    const response = await api.post("/api/auth/register", userData);

    const data = response.data.data;
    const token = data.token;

    localStorage.setItem("token", token);
    setToken(token);
    setUser(data);

    return response.data;
  };

  /* ===============================
     LOGOUT
  =============================== */
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
