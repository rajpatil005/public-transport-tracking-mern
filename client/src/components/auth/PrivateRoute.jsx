import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  // ✅ Show loader instead of blank screen
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role mismatch (admin / driver)
  if (role && user.role !== role) {
    return <Navigate to="/home" replace />;
  }

  // ✅ Allowed
  return children;
};

export default PrivateRoute;