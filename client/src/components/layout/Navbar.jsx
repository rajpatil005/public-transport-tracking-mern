import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

 

  return (
    <nav className="bg-blue-600 dark:bg-gray-800 text-white px-4 sm:px-6 py-3 sm:py-4 fixed w-full top-0 z-50 transition-colors duration-300 shadow-lg">
      <div className="flex items-center justify-between">
        
        {/* Logo / Title */}
        <h1
          className="font-bold text-sm sm:text-lg cursor-pointer flex items-center gap-2"
          onClick={() => navigate("/home")}
        >
          <span className="text-xl sm:text-2xl">🚍</span>
          <span className="hidden sm:inline">Kolhapur City Bus</span>
          <span className="sm:hidden">KCB</span>
        </h1>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-blue-500 dark:hover:bg-gray-700 transition-colors text-xl"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex flex-wrap gap-3 lg:gap-4 items-center">
          <NavLink to="/home" className="hover:underline flex items-center gap-1 text-sm lg:text-base">
            🏠 Home
          </NavLink>

          <NavLink to="/search" className="hover:underline flex items-center gap-1 text-sm lg:text-base">
            🎫 Book Ticket
          </NavLink>

          <NavLink to="/schedule" className="hover:underline flex items-center gap-1 text-sm lg:text-base">
            📅 Schedule
          </NavLink>

          <NavLink to="/kolhapur-info" className="hover:underline flex items-center gap-1 text-sm lg:text-base">
            ℹ️ Kolhapur Info
          </NavLink>

         

          {/* User Greeting */}
          {user && (
            <span className="font-medium bg-blue-500 dark:bg-gray-700 px-3 py-1 rounded flex items-center gap-1 text-sm lg:text-base">
              👋 Hi, {user.name?.split(" ")[0] || user.username || "User"}
            </span>
          )}

          {/* Logout Button */}
          {user && (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1 text-sm lg:text-base"
            >
              🚪 Logout
            </button>
          )}

          {/* Login/Register */}
          {!user && (
            <>
              <NavLink to="/login" className="hover:underline text-sm lg:text-base">🔐 Login</NavLink>
              <NavLink to="/register" className="hover:underline text-sm lg:text-base">📝 Register</NavLink>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-blue-500 dark:border-gray-700">
          <div className="flex flex-col gap-2">
            <NavLink to="/home" className="px-3 py-2 rounded hover:bg-blue-500 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
              🏠 Home
            </NavLink>
            <NavLink to="/search" className="px-3 py-2 rounded hover:bg-blue-500 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
              🎫 Book Ticket
            </NavLink>
            <NavLink to="/schedule" className="px-3 py-2 rounded hover:bg-blue-500 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
              📅 Schedule
            </NavLink>
            <NavLink to="/kolhapur-info" className="px-3 py-2 rounded hover:bg-blue-500 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
              ℹ️ Kolhapur Info
            </NavLink>
            
            

            {user && (
              <>
                <div className="px-3 py-2 bg-blue-500/20 rounded flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user.name || user.username}</p>
                    <p className="text-xs text-blue-200">{user.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="bg-red-500 px-3 py-2 rounded hover:bg-red-600">
                  🚪 Logout
                </button>
              </>
            )}

            {!user && (
              <>
                <NavLink to="/login" className="px-3 py-2 rounded hover:bg-blue-500 text-center" onClick={() => setIsMenuOpen(false)}>
                  🔐 Login
                </NavLink>
                <NavLink to="/register" className="px-3 py-2 rounded bg-yellow-500 text-blue-900 text-center font-medium" onClick={() => setIsMenuOpen(false)}>
                  📝 Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;