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

  // Refs for keyboard navigation
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
      setError(err.message || "Login failed.");
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <div className="w-1 h-1 bg-white/30 rounded-full"></div>
          </div>
        ))}
      </div>

      {/* Feature Message Toast */}
      {showFeatureMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
              <Bus size={16} className="text-yellow-300" />
            </div>
            <span className="font-medium">Please login to access {showFeatureMessage}</span>
           
          </div>
        </div>
      )}

      <div className="relative z-10 flex min-h-screen items-center justify-center max-w-7xl mx-auto px-4">
        {/* Left Side - Brand Section */}
        <div className="w-1/2 text-white pr-16 animate-fadeInLeft">
          <div className="mb-8">
            <div
              className="relative inline-block group cursor-pointer mb-6"
              onMouseEnter={() => setIsBusHovered(true)}
              onMouseLeave={() => setIsBusHovered(false)}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl transition-all duration-500 ${isBusHovered ? 'scale-150 opacity-70' : 'scale-100 opacity-0'}`}></div>
              <div className={`relative p-5 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl backdrop-blur-sm border border-white/30 transition-all duration-500 transform ${isBusHovered ? 'scale-110 rotate-12 shadow-2xl' : 'scale-100 rotate-0'}`}>
                <Bus
                  size={48}
                  className={`transition-all duration-500 ${isBusHovered ? 'text-yellow-300 scale-110' : 'text-white'}`}
                />
              </div>
              {isBusHovered && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-yellow-300 font-semibold animate-pulse">
                  Welcome to Smart Travel!
                </div>
              )}
            </div>

            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Kolhapur Bus Tracking
            </h1>
            <p className="text-xl text-purple-200 mb-6">
              Smart real-time public transport tracking system.
            </p>
          </div>

          {/* Features Grid - Clickable */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div
              onClick={() => handleFeatureClick("Live Bus Tracking")}
              className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <MapPin className="text-yellow-400" size={20} />
              <span className="text-sm">Live Bus Tracking</span>
            </div>
            <div
              onClick={() => handleFeatureClick("Real-time Updates")}
              className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <Clock className="text-green-400" size={20} />
              <span className="text-sm">Real-time Updates</span>
            </div>
            <div
              onClick={() => handleFeatureClick("Easy Booking")}
              className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <User className="text-blue-400" size={20} />
              <span className="text-sm">Easy Booking</span>
            </div>
            <div
              onClick={() => handleFeatureClick("Smart Routes")}
              className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <Bus className="text-purple-400" size={20} />
              <span className="text-sm">Smart Routes</span>
            </div>
          </div>

          {/* Stats - Clickable */}
          <div className="flex gap-6 mt-8 pt-6 border-t border-white/20">
            <div
              onClick={() => handleFeatureClick("Daily Routes")}
              className="cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <p className="text-2xl font-bold">50+</p>
              <p className="text-xs text-purple-200">Daily Routes</p>
            </div>
            <div
              onClick={() => handleFeatureClick("Active Buses")}
              className="cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <p className="text-2xl font-bold">200+</p>
              <p className="text-xs text-purple-200">Active Buses</p>
            </div>
            <div
              onClick={() => handleFeatureClick("Happy Riders")}
              className="cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <p className="text-2xl font-bold">10K+</p>
              <p className="text-xs text-purple-200">Happy Riders</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/2 flex justify-center animate-fadeInRight">
          <div className="relative w-full max-w-md">
            {/* Decorative Elements */}
            <div className="absolute -top-5 -right-5 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl"></div>

            <div className="relative p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/30 shadow-2xl transition-all duration-500 hover:shadow-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-2xl pointer-events-none"></div>

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
                  <p className="text-purple-200 text-sm">Sign in to continue your journey</p>
                </div>

                {error && (
                  <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/50 text-red-100 p-3 rounded-xl mb-4 text-sm animate-shake">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* EMAIL */}
                  <div className="transform transition-all duration-300 hover:translate-x-1">
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300 transition-all duration-300 group-hover:text-purple-500" size={18} />
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
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your email"
                      />
                    </div>
                    {validationErrors.email && (
                      <p className="text-red-300 text-sm mt-1 animate-fadeIn">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  {/* PASSWORD */}
                  <div className="transform transition-all duration-300 hover:translate-x-1">
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
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        placeholder="••••••••"
                      />
                    </div>
                    {validationErrors.password && (
                      <p className="text-red-300 text-sm mt-1 animate-fadeIn">
                        {validationErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => alert("Password reset feature coming soon!")}
                      className="text-sm text-purple-300 hover:text-purple-100 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="relative group w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-70"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Signing In...
                        </>
                      ) : (
                        <>
                          Login
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-transparent text-purple-300">New to Kolhapur Bus Tracking?</span>
                  </div>
                </div>

                <Link
                  to="/register"
                  className="block w-full text-center py-3 rounded-xl font-medium text-purple-200 border border-purple-300/50 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                >
                  Create New Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
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
        
        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out;
        }
        
        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-fadeIn {
          animation: fadeInLeft 0.3s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;