// client/src/components/auth/Login.jsx
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Bus, MapPin, Clock, User, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isBusHovered, setIsBusHovered] = useState(false);
  const [showFeatureMessage, setShowFeatureMessage] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const getEmailError = (email) => {
    if (!email) return "Email is required.";
    if (!email.includes("@")) {
      return "Please include an '@' in the email address.";
    }
    const [localPart, domain] = email.split("@");
    if (!localPart) return "Email address is missing text before '@'.";
    if (!domain) return `'${email}' is missing a domain after '@'.`;
    if (!domain.includes(".")) {
      return `'${email}' is missing a top-level domain (like .com).`;
    }
    const parts = domain.split(".");
    if (parts[parts.length - 1].length < 2) {
      return "Domain extension must be at least 2 characters.";
    }
    return "";
  };

  const validate = () => {
    const errors = {};
    const emailError = getEmailError(formData.email);
    if (emailError) errors.email = emailError;
    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});
    setError("");
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      // Show more detailed error message
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          err.message || 
                          "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureClick = (featureName) => {
    setShowFeatureMessage(featureName);
    setTimeout(() => {
      setShowFeatureMessage(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Feature Message Toast */}
      {showFeatureMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown w-[90%] max-w-md">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
              <Bus size={16} className="text-yellow-300" />
            </div>
            <span className="font-medium text-sm">Please login to access {showFeatureMessage}</span>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Left Side - Brand Section */}
        <div className="hidden lg:block w-full lg:w-1/2 text-white pr-0 lg:pr-16">
          <div className="mb-8">
            <div
              className="relative inline-block group cursor-pointer mb-6"
              onMouseEnter={() => setIsBusHovered(true)}
              onMouseLeave={() => setIsBusHovered(false)}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl transition-all duration-500 ${
                isBusHovered ? 'scale-150 opacity-70' : 'scale-100 opacity-0'
              }`}></div>
              <div className={`relative p-5 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl backdrop-blur-sm border border-white/30 transition-all duration-500 transform ${
                isBusHovered ? 'scale-110 rotate-12 shadow-2xl' : 'scale-100 rotate-0'
              }`}>
                <Bus
                  size={48}
                  className={`transition-all duration-500 ${
                    isBusHovered ? 'text-yellow-300 scale-110' : 'text-white'
                  }`}
                />
              </div>
              {isBusHovered && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-yellow-300 font-semibold animate-pulse">
                  Welcome to Smart Travel!
                </div>
              )}
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Kolhapur Bus Tracking
            </h1>
            <p className="text-lg lg:text-xl text-purple-200 mb-6">
              Smart real-time public transport tracking system.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { icon: MapPin, name: "Live Bus Tracking", color: "text-yellow-400" },
              { icon: Clock, name: "Real-time Updates", color: "text-green-400" },
              { icon: User, name: "Easy Booking", color: "text-blue-400" },
              { icon: Bus, name: "Smart Routes", color: "text-purple-400" },
            ].map((feature, idx) => (
              <div
                key={idx}
                onClick={() => handleFeatureClick(feature.name)}
                className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <feature.icon className={feature.color} size={20} />
                <span className="text-sm text-white">{feature.name}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 pt-6 border-t border-white/20">
            {[
              { value: "50+", label: "Daily Routes", feature: "Daily Routes" },
              { value: "200+", label: "Active Buses", feature: "Active Buses" },
              { value: "10K+", label: "Happy Riders", feature: "Happy Riders" },
            ].map((stat, idx) => (
              <div
                key={idx}
                onClick={() => handleFeatureClick(stat.feature)}
                className="cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <p className="text-xl lg:text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-purple-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md px-2 sm:px-0">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-6">
              <div className="inline-block p-3 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl backdrop-blur-sm border border-white/30 mb-3">
                <Bus size={32} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Kolhapur Bus Tracking
              </h1>
              <p className="text-sm text-purple-200">
                Smart real-time public transport tracking system.
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-5 -right-5 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-5 -left-5 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl"></div>

            <div className="relative p-5 sm:p-6 md:p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/30 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-2xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Welcome Back!
                  </h2>
                  <p className="text-xs sm:text-sm text-purple-200">
                    Sign in to continue your journey
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/50 text-red-100 p-3 rounded-xl mb-4 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-5 sm:space-y-6">
                  {/* EMAIL */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" size={18} />
                      <input
                        ref={emailRef}
                        type="text"
                        value={formData.email}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowDown" || e.key === "Enter") {
                            e.preventDefault();
                            passwordRef.current?.focus();
                          }
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, email: value });
                          const emailError = getEmailError(value);
                          setValidationErrors((prev) => ({
                            ...prev,
                            email: emailError,
                          }));
                        }}
                        className="w-full pl-11 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                        placeholder="Enter your email"
                      />
                    </div>
                    {validationErrors.email && (
                      <p className="text-red-300 text-xs sm:text-sm mt-1">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" size={18} />
                      <input
                        ref={passwordRef}
                        type="password"
                        value={formData.password}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp") {
                            e.preventDefault();
                            emailRef.current?.focus();
                          }
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, password: value });
                          if (!value) {
                            setValidationErrors((prev) => ({
                              ...prev,
                              password: "Password is required.",
                            }));
                          } else if (value.length < 6) {
                            setValidationErrors((prev) => ({
                              ...prev,
                              password: "Password must be at least 6 characters.",
                            }));
                          } else {
                            setValidationErrors((prev) => ({
                              ...prev,
                              password: "",
                            }));
                          }
                        }}
                        className="w-full pl-11 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                        placeholder="••••••••"
                      />
                    </div>
                    {validationErrors.password && (
                      <p className="text-red-300 text-xs sm:text-sm mt-1">
                        {validationErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => alert("Password reset feature coming soon!")}
                      className="text-xs sm:text-sm text-purple-300 hover:text-purple-100 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="relative group w-full py-2.5 sm:py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-70 text-sm sm:text-base"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Signing In...
                        </>
                      ) : (
                        <>
                          Login
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                <div className="relative my-5 sm:my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-center">
                    <span className="px-2 bg-transparent text-purple-300 text-xs sm:text-sm">
                      New to Kolhapur Bus Tracking?
                    </span>
                  </div>
                </div>

                <Link
                  to="/register"
                  className="block w-full text-center py-2.5 sm:py-3 rounded-xl font-medium text-purple-200 border border-purple-300/50 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] active:scale-95 text-sm sm:text-base"
                >
                  Create New Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;