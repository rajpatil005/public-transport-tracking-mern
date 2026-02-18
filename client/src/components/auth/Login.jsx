import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bus, Mail, Lock, LogIn, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Alert from "../ui/Alert";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  const backgroundImages = [
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1580674285054-bed31e145f4d?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2070&q=80"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background Carousel */}
      {backgroundImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${img})` }}
          >
            <div className="absolute inset-0 bg-black/60" />
          </div>
        </div>
      ))}

   
     

      {/* Login Card */}
      <div className="relative z-20 w-full max-w-md px-6">
        <Card className="bg-white/90 backdrop-blur-lg shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mb-4">
              <Bus className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-gray-600 text-sm">
              Login to access Kolhapur Bus Services
            </p>
          </div>

          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError("")}
              className="mb-4"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              name="email"
              label="Email"
              icon={Mail}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <Input
              type="password"
              name="password"
              label="Password"
              icon={Lock}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              <LogIn className="h-5 w-5 mr-2" />
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link to="/register" className="text-blue-600 font-medium">
              Create New Account
            </Link>
          </div>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border">
            <p className="text-sm font-medium text-blue-800 flex items-center mb-2">
              <Shield className="h-4 w-4 mr-1" />
              Demo Access
            </p>
            <p className="text-xs">Passenger: passenger@test.com</p>
            <p className="text-xs">Admin: admin@test.com</p>
            <p className="text-xs">Driver: driver@test.com</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
