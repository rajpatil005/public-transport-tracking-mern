import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 fixed w-full top-0 z-50">
      <div className="flex flex-wrap items-center justify-between">
        
        {/* Logo / Title */}
        <h1
          className="font-bold text-lg cursor-pointer"
          onClick={() => navigate("/home")}
        >
          Kolhapur City Bus
        </h1>

        {/* Links */}
        <div className="flex flex-wrap gap-4 items-center mt-2 md:mt-0">

          <NavLink to="/home" className="hover:underline">
            Home
          </NavLink>

          <NavLink to="/search" className="hover:underline">
            Book Ticket
          </NavLink>

          <NavLink to="/schedule" className="hover:underline">
            Schedule
          </NavLink>

          <NavLink to="/kolhapur-info" className="hover:underline">
            Kolhapur Info
          </NavLink>

          {/* Admin Link */}
          {user?.role === "admin" && (
            <NavLink to="/admin" className="hover:underline">
              Admin
            </NavLink>
          )}

          {/* Driver Link */}
          {user?.role === "driver" && (
            <NavLink to="/driver" className="hover:underline">
              Driver
            </NavLink>
          )}

          {/* 👋 User Greeting */}
          {user && (
            <span className="font-medium bg-blue-500 px-3 py-1 rounded">
              Hi, {user.name || user.username || "User"}
            </span>
          )}

          {/* Logout Button */}
          {user && (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
