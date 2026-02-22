import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Bus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  /* ---------------- EMAIL VALIDATION ---------------- */

  const getEmailError = (email) => {
    if (!email) return "Email is required.";
    if (!email.includes("@")) return "Please include '@' in email.";

    const [localPart, domain] = email.split("@");

    if (!localPart) return "Email is missing text before '@'.";
    if (!domain) return "Email is missing domain.";
    if (!domain.includes(".")) return "Email must contain domain extension.";

    return "";
  };

  const validate = () => {
    const errors = {};

    if (!formData.name) errors.name = "Full name is required.";

    const emailError = getEmailError(formData.email);
    if (emailError) errors.email = emailError;

    if (!formData.password) errors.password = "Password is required.";
    else if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters.";

    if (!formData.confirmPassword)
      errors.confirmPassword = "Please confirm password.";
    else if (formData.confirmPassword !== formData.password)
      errors.confirmPassword = "Passwords do not match.";

    return errors;
  };

  /* ---------------- FORM SUBMIT ---------------- */

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
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 overflow-hidden">
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
            Create your account and start tracking buses.
          </p>
        </div>

        {/* RIGHT CARD */}
        <div className="w-1/2 flex justify-center">
          <div className="relative w-full max-w-md p-10 rounded-3xl bg-white/10 border border-white/30 shadow-xl overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Create Account
              </h2>

              {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* NAME */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your full name"
                  />

                  {validationErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your email"
                  />

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

                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:ring-2 focus:ring-indigo-500"
                    placeholder="••••••••"
                  />

                  {validationErrors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/40 focus:ring-2 focus:ring-indigo-500"
                    placeholder="••••••••"
                  />

                  {validationErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-700 hover:shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-70 transition-all"
                >
                  {loading ? "Creating Account..." : "Register"}
                </button>
              </form>

              <p className="text-sm mt-6 text-gray-800">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-700 hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
