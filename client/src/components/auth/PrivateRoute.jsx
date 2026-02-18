import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or a loader
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based protection (admin / driver)
  if (role && user.role !== role) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PrivateRoute;
