import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Bus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ Refs for keyboard navigation
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

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 overflow-hidden">
      <div className="absolute bottom-16 left-10 w-80 h-28 bg-blue-500/40 rounded-2xl"></div>
      <div className="absolute bottom-12 left-24 w-12 h-12 bg-slate-900/70 rounded-full"></div>
      <div className="absolute bottom-12 left-64 w-12 h-12 bg-slate-900/70 rounded-full"></div>
      <div className="absolute top-20 right-10 w-72 h-24 bg-indigo-400/40 rounded-2xl"></div>

      <div className="relative z-10 flex min-h-screen items-center justify-center max-w-6xl mx-auto">
        <div className="w-1/2 text-white pr-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-white/20 rounded-full">
              <Bus size={36} />
            </div>
            <h1 className="text-4xl font-bold">Kolhapur Bus Tracking</h1>
          </div>

          <p className="text-lg mb-4">
            Smart real-time public transport tracking system.
          </p>

          <p className="opacity-90">
            Track buses live, reduce waiting time, and experience efficient
            travel.
          </p>
        </div>

        <div className="w-1/2 flex justify-center">
          <div className="relative w-full max-w-md p-10 rounded-3xl bg-white/10 border border-white/30 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Sign In</h2>

              {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <div className="relative mt-2">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />

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
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/60 border transition-all duration-300 border-white/40 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  {validationErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>

                  <div className="relative mt-2">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />

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
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/60 border transition-all duration-300 border-white/40 focus:ring-2 focus:ring-indigo-500"
                      placeholder="••••••••"
                    />
                  </div>

                  {validationErrors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-70"
                >
                  {loading ? "Signing In..." : "Login"}
                </button>
              </form>

              <p className="text-sm mt-6 text-gray-800">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-indigo-700 hover:underline"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
