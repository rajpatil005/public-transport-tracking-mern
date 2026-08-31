// client/src/components/passenger/LandingPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Import your existing Footer component
import Footer from "../layout/Footer"; 
import {
  Bus,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  Award,
  Users,
  ChevronDown,
  Star,
  Navigation,
  Calendar,
  Ticket,
  Phone,
  Mail,
  Menu,
  X,
  CheckCircle,
  Smartphone,
  Zap,
  Eye,
  Compass,
  ChevronRight,
  Play,
  Pause,
  Headphones,
  CreditCard,
  Wifi,
  Coffee,
  TrendingUp,
  BarChart3,
  Globe,
  Heart,
  MessageCircle,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
} from "lucide-react";

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Navigation className="h-6 w-6" />,
      title: "Live GPS Tracking",
      description: "Watch your bus move in real-time on an interactive map. No more waiting in uncertainty.",
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "AI-Powered ETA",
      description: "Advanced algorithms predict accurate arrival times based on live traffic conditions.",
      color: "from-emerald-500 to-green-400",
    },
    {
      icon: <Ticket className="h-6 w-6" />,
      title: "QR Code Booking",
      description: "Scan, pay, and ride. Digital tickets generated instantly for a touchless experience.",
      color: "from-violet-500 to-purple-400",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Safety First",
      description: "Real-time emergency alerts, driver tracking, and 24/7 support for complete peace of mind.",
      color: "from-rose-500 to-pink-400",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden text-slate-800">
      
      {/* ============================================
      NAVBAR - Refined & Glassmorphic (UPDATED BRAND)
      ============================================ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] py-3 border-b border-slate-100"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className={`p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${
                isScrolled ? "bg-slate-900" : "bg-white/10 backdrop-blur-md border border-white/20"
              }`}>
                <Bus className={`h-6 w-6 ${isScrolled ? "text-white" : "text-white"}`} />
              </div>
              <span className={`text-xl font-bold tracking-tight ${isScrolled ? "text-slate-900" : "text-white"}`}>
                Kolhapur City Bus
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {["Features", "Routes", "Pricing"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`text-sm font-medium transition-all duration-300 relative group ${
                    isScrolled ? "text-slate-600 hover:text-slate-900" : "text-white/80 hover:text-white"
                  }`}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className={`px-5 py-2.5 rounded-full font-medium transition-all hover:scale-105 ${
                  isScrolled
                    ? "text-slate-600 hover:bg-slate-100"
                    : "text-white hover:bg-white/10 backdrop-blur-sm"
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${
                  isScrolled
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/30"
                    : "bg-white text-slate-900 hover:bg-gray-100"
                }`}
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-all hover:bg-white/10"
            >
              {isMobileMenuOpen ? 
                <X className={`h-6 w-6 ${isScrolled ? "text-slate-900" : "text-white"}`} /> : 
                <Menu className={`h-6 w-6 ${isScrolled ? "text-slate-900" : "text-white"}`} />
              }
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 p-5 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col gap-3">
                {["Features", "Routes", "Pricing"].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="text-slate-700 hover:text-blue-600 transition px-3 py-2 rounded-lg hover:bg-slate-50">
                    {item}
                  </a>
                ))}
                <div className="border-t border-slate-200 pt-4 mt-2 flex flex-col gap-3">
                  <Link to="/login" className="block text-center text-slate-700 hover:text-blue-600 transition px-3 py-2 rounded-lg hover:bg-slate-50">
                    Sign In
                  </Link>
                  <Link to="/register" className="block text-center bg-blue-600 text-white px-3 py-2.5 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ============================================
      HERO SECTION - "Tech" Transformation (UPDATED BRAND)
      ============================================ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-900">
        
        {/* Deep Abstract Ocean Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Side: Content */}
            <div className="text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full pl-1.5 pr-4 py-1.5 mb-8 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">v3.0</span>
                <span className="text-sm text-slate-300 font-medium">Next-gen transit tracking</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] text-white mb-6 tracking-tight">
                Never Miss a <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  Bus Again.
                </span>
              </h1>

              <p className="text-lg text-slate-400 mb-10 max-w-lg font-light leading-relaxed">
                Take the guesswork out of your commute. Track Kolhapur city buses in real-time with 
                live GPS and AI-powered arrival predictions.
              </p>

              {/* Hero Actions */}
              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  to="/register"
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  Start Free Trial <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#features"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                >
                  <Play className="h-4 w-4 fill-white" /> Watch Demo
                </a>
              </div>

              {/* Trust Indicators (From Footer) */}
              <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-white/10">
                {/* Trust Badges */}
                <div className="flex gap-2">
                  {[
                    { icon: Shield, label: 'Secure', color: 'text-blue-400' },
                    { icon: Award, label: 'Award', color: 'text-yellow-400' },
                  ].map((badge, index) => {
                    const Icon = badge.icon;
                    return (
                      <div key={index} className="flex items-center gap-1.5 bg-white/5 rounded-lg px-3 py-1.5 backdrop-blur-sm border border-white/5">
                        <Icon className={`h-3.5 w-3.5 ${badge.color}`} />
                        <span className="text-[10px] text-gray-400">{badge.label}</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* User Rating */}
                <div className="flex items-center gap-1 border-l border-white/10 pl-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 ml-2">4.9 (10K+ riders)</p>
                </div>
              </div>
            </div>

            {/* Right Side: The "Hero" Hardware Mockup */}
            <div className="relative flex justify-center items-center">
              {/* Floating Glow Behind Phone */}
              <div className="absolute w-[300px] h-[500px] bg-blue-500/30 rounded-[40px] blur-[80px] animate-pulse"></div>
              
              {/* Phone Frame */}
              <div className="relative w-[300px] h-[580px] bg-slate-900 rounded-[40px] shadow-2xl shadow-black/50 border-[3px] border-slate-700/50 overflow-hidden">
                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-slate-900 rounded-full z-20 flex items-center justify-between px-4 border border-white/5">
                   <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                </div>

                {/* Phone Screen Content */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-slate-900/90 p-6 pt-14">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                        <Bus className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white text-xs font-bold">Kolhapur Bus</p>
                        <p className="text-white/40 text-[10px]">Live</p>
                      </div>
                    </div>
                    <div className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full border border-green-500/30">
                      ● Online
                    </div>
                  </div>

                  {/* Live Route Card */}
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-3 shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white text-sm font-bold">Route 101</p>
                        <p className="text-white/50 text-[10px]">Central Station → Mall</p>
                      </div>
                      <span className="text-emerald-400 text-sm font-bold">ETA 4 min</span>
                    </div>
                    {/* Progress Line */}
                    <div className="relative h-1.5 bg-white/10 rounded-full mt-3">
                      <div className="absolute h-full w-3/4 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full"></div>
                      <div className="absolute right-[25%] top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-white/30 mt-1">
                      <span>Departure</span>
                      <span>Arrival</span>
                    </div>
                  </div>

                  {/* Live Route Card 2 */}
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white text-sm font-bold">Route 205</p>
                        <p className="text-white/50 text-[10px]">Airport → City Center</p>
                      </div>
                      <span className="text-amber-400 text-sm font-bold">ETA 12 min</span>
                    </div>
                    {/* Progress Line */}
                    <div className="relative h-1.5 bg-white/10 rounded-full mt-3">
                      <div className="absolute h-full w-1/3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></div>
                      <div className="absolute right-[66%] top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.6)]"></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-white/30 mt-1">
                      <span>Departure</span>
                      <span>Arrival</span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <button className="bg-blue-600 text-white text-xs font-semibold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                      Track Now
                    </button>
                    <button className="bg-white/10 text-white text-xs font-semibold py-3 rounded-xl hover:bg-white/20 transition border border-white/10">
                      Book Ticket
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Scroll Indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-6 w-6 text-white/20" />
          </div>
        </div>
      </section>

      {/* ============================================
      FEATURES SECTION - Card Based
      ============================================ */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border border-blue-100">
              <Zap className="h-3.5 w-3.5" /> Next-Gen Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Built for the <span className="text-blue-600">Modern Commuter</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Stop guessing and start knowing. Smart tools designed to save you time, money, and stress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 bg-white rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className={`inline-flex p-3.5 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
      STATS SECTION - The "Impact"
      ============================================ */}
      <section className="py-20 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
            {[
              { value: "50+", label: "Active Routes", icon: <MapPin className="h-5 w-5" /> },
              { value: "200+", label: "Connected Buses", icon: <Bus className="h-5 w-5" /> },
              { value: "10K+", label: "Daily Riders", icon: <Users className="h-5 w-5" /> },
              { value: "98%", label: "On-Time Rate", icon: <Award className="h-5 w-5" /> },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex p-3 bg-white/5 rounded-2xl text-blue-400 mb-4 group-hover:bg-blue-500/20 transition-colors">
                  {stat.icon}
                </div>
                <div className="text-5xl font-extrabold text-white mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
      CTA SECTION - Minimalist & Bold
      ============================================ */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block p-3 bg-blue-100 rounded-2xl mb-6">
            <Globe className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Ready to Streamline Your <br /> Daily Commute?
          </h2>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
            Join thousands of happy passengers. Get real-time updates, instant booking, and a stress-free ride experience around Kolhapur starting today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-10 py-4 bg-slate-900 text-white font-semibold rounded-full shadow-xl shadow-slate-900/20 hover:shadow-slate-900/40 hover:scale-105 hover:bg-slate-800 transition-all duration-300"
            >
              Start My Free Trial
            </Link>
            <Link
              to="/login"
              className="px-10 py-4 bg-white text-slate-900 font-semibold rounded-full border-2 border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300"
            >
              I Already Have an Account
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
      FOOTER - Imported from your separate component
      ============================================ */}
      <Footer />
      
    </div>
  );
};

export default LandingPage;