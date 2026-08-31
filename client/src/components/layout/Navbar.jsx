// client/src/components/layout/Navbar.js
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  Menu, 
  X, 
  Home, 
  Bus, 
  Map, 
  Users, 
  BarChart3, 
  FileText,
  Calendar,
  Ticket,
  Info,
  LogOut,
  User,
  Sun,
  Moon,
  Bell,
  Search,
  LayoutDashboard,
  MapPin,
  ChevronDown,
  Settings,
  UserCircle,
  Heart,
  Clock,
  Navigation,
  Sparkles
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isDriver = user?.role === 'driver';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
    setShowUserMenu(false);
  };

  const getNavItems = () => {
    if (isAdmin) {
      return [
        { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/admin/buses", icon: Bus, label: "Buses" },
        { path: "/admin/routes", icon: Map, label: "Routes" },
        { path: "/admin/drivers", icon: Users, label: "Drivers" },
        { path: "/admin/analytics", icon: BarChart3, label: "Analytics" },
        { path: "/admin/reports", icon: FileText, label: "Reports" },
      ];
    }
    if (isDriver) {
      return [
        { path: "/driver", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/driver/update-location", icon: MapPin, label: "Update Location" },
        { path: "/driver/schedule", icon: Calendar, label: "My Schedule" },
      ];
    }
    return [
      { path: "/home", icon: Home, label: "Home" },
      { path: "/search", icon: Search, label: "Book Ticket" },
      { path: "/schedule", icon: Calendar, label: "Schedule" },
      { path: "/my-bookings", icon: Ticket, label: "Bookings" },
    ];
  };

  const navItems = getNavItems();

  const userMenuItems = [
    { path: "/profile", icon: UserCircle, label: "My Profile" },
    { path: "/my-bookings", icon: Ticket, label: "My Bookings" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav 
      className={`
        fixed w-full top-0 z-50 transition-all duration-500
        ${scrolled 
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-b border-slate-100 dark:border-slate-800' 
          : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-slate-900 dark:to-slate-800'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo - Matching Landing Page */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate(user ? (isAdmin ? "/admin" : isDriver ? "/driver" : "/home") : "/")}
          >
            <div className={`
              p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg
              ${scrolled 
                ? 'bg-slate-900 dark:bg-slate-700' 
                : 'bg-white/10 backdrop-blur-md border border-white/20'
              }
            `}>
              <Bus className={`h-6 w-6 ${scrolled ? 'text-white' : 'text-white'}`} />
            </div>
            <div>
              <h1 className={`
                font-bold text-lg tracking-tight transition-colors duration-300
                ${scrolled ? 'text-slate-900 dark:text-white' : 'text-white'}
              `}>
                Kolhapur Bus
              </h1>
              <p className="text-[10px] font-medium opacity-70 hidden sm:block">
                {isAdmin ? 'Admin Panel' : isDriver ? 'Driver Portal' : 'City Transport'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation - Matching Landing Page style */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`
                    relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${scrolled 
                      ? 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white' 
                      : 'text-white/80 hover:text-white'
                    }
                    hover:scale-105
                  `}
                >
                  <span className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                    <span>{item.label}</span>
                  </span>
                  
                  {/* Active Indicator - Matching Landing Page */}
                  {isActive && (
                    <span className={`
                      absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full
                      ${scrolled ? 'bg-blue-600 dark:bg-blue-400' : 'bg-white'}
                      transition-all duration-300
                    `} />
                  )}

                  {/* Hover Glow Effect */}
                  <span className={`
                    absolute inset-0 rounded-lg opacity-0 transition-all duration-300
                    ${isActive ? '' : 'hover:opacity-100'}
                    ${scrolled 
                      ? 'hover:bg-slate-100 dark:hover:bg-slate-800' 
                      : 'hover:bg-white/10'
                    }
                  `} />
                </NavLink>
              );
            })}

            <NavLink
              to="/kolhapur-info"
              className={`
                relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${scrolled 
                  ? 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white' 
                  : 'text-white/80 hover:text-white'
                }
                hover:scale-105
              `}
            >
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>Info</span>
              </span>
            </NavLink>

            {/* Theme Toggle with Matching Style */}
            <button
              onClick={toggleTheme}
              className={`
                p-2.5 rounded-lg transition-all duration-300 hover:scale-110
                ${scrolled 
                  ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800' 
                  : 'text-white/80 hover:bg-white/10'
                }
              `}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Section with Dropdown - Matching Landing Page style */}
            {user ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300
                    ${scrolled 
                      ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700' 
                      : 'bg-white/10 backdrop-blur-sm hover:bg-white/20'
                    }
                    hover:scale-105
                  `}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    {user.name?.[0] || user.username?.[0] || 'U'}
                  </div>
                  <span className={`text-sm font-medium ${scrolled ? 'text-slate-700 dark:text-white' : 'text-white'}`}>
                    {user.name?.split(' ')[0] || user.username}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''} ${scrolled ? 'text-slate-500' : 'text-white/70'}`} />
                </button>

                {/* Dropdown Menu - Glassmorphic */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden animate-slideDown">
                    {/* User Info Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                          {user.name?.[0] || user.username?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">
                            {user.name || user.username}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {user.email}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                            {isAdmin ? 'Admin' : isDriver ? 'Driver' : 'Passenger'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      {userMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setShowUserMenu(false)}
                            className={`
                              flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-200
                              ${isActive 
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                              }
                            `}
                          >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                            <span>{item.label}</span>
                            {isActive && (
                              <span className="ml-auto w-1 h-6 bg-blue-500 rounded-full" />
                            )}
                          </NavLink>
                        );
                      })}
                    </div>

                    <div className="border-t border-slate-200/50 dark:border-slate-700/50"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <NavLink
                  to="/login"
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105
                    ${scrolled 
                      ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800' 
                      : 'text-white/80 hover:bg-white/10'
                    }
                  `}
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className={`
                    px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg
                    ${scrolled 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/30' 
                      : 'bg-white text-slate-900 hover:bg-gray-100'
                    }
                  `}
                >
                  Get Started
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button - Matching Landing Page */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`
              md:hidden p-2 rounded-lg transition-all duration-300 hover:scale-110
              ${scrolled ? 'text-slate-900 dark:text-white' : 'text-white'}
              hover:bg-white/10
            `}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Glassmorphic Matching Landing Page */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 mx-4 p-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 animate-slideDown">
          <div className="flex flex-col gap-2">
            {/* Mobile User Header */}
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                  {user.name?.[0] || user.username?.[0] || 'U'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {user.name || user.username}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                    ${isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <span className="ml-auto w-1 h-8 bg-blue-500 rounded-full" />}
                </NavLink>
              );
            })}

            <NavLink
              to="/kolhapur-info"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
            >
              <Info className="w-5 h-5" />
              <span className="font-medium">Kolhapur Info</span>
            </NavLink>

            {user && (
              <>
                <div className="border-t border-slate-200/50 dark:border-slate-700/50 my-2 pt-2">
                  {userMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
                      >
                        <Icon className="w-5 h-5 text-slate-400" />
                        <span className="font-medium">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            )}

            {!user && (
              <div className="border-t border-slate-200/50 dark:border-slate-700/50 mt-2 pt-4 space-y-3">
                <NavLink
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center text-slate-700 dark:text-slate-300 hover:text-blue-600 transition px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.25s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;