// client/src/components/layout/Footer.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bus, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  ArrowUp,
  Heart,
  Clock,
  Users,
  Award,
  Shield,
  Truck,
  Building,
  MessageCircle,
  Mail as MailIcon,
  Send
} from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Show footer ONLY on home page
  const showFooterPaths = ['/home'];
  const shouldShow = showFooterPaths.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  // Return null if not on home page
  if (!shouldShow) return null;

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Animated Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x"></div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1 - Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg animate-float">
                  <Bus className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Kolhapur City Bus
                </h2>
                <p className="text-sm text-gray-400">Smart City Transport</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting Kolhapur with reliable, comfortable, and affordable bus services. 
              Experience the best city transport with real-time tracking and digital ticketing.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <span>24/7 Service</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-400" />
                <span>100K+ Riders</span>
              </div>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                ['Home', '/home'],
                ['Book Ticket', '/search'],
                ['Bus Schedule', '/schedule'],
                ['Fare Calculator', '/fare-calculator'],
                ['Track Bus', '/track-bus'],
                ['My Bookings', '/my-bookings'],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link 
                    to={path} 
                    className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {label}
                    <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Contact & Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 group">
                <MapPin className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 group-hover:text-white transition-colors">
                  Central Bus Stand, <br />Kolhapur, Maharashtra 416001
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-gray-400 group-hover:text-white transition-colors">
                  +91 98765 43210
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-gray-400 group-hover:text-white transition-colors">
                  info@kolhapurcitybus.com
                </span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Follow Us</h4>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, color: 'hover:bg-blue-600', label: 'Facebook' },
                  { icon: Twitter, color: 'hover:bg-blue-400', label: 'Twitter' },
                  { icon: Instagram, color: 'hover:bg-pink-600', label: 'Instagram' },
                  { icon: Youtube, color: 'hover:bg-red-600', label: 'YouTube' },
                ].map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href="#"
                      className={`
                        w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center 
                        ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg
                        group relative
                      `}
                      aria-label={social.label}
                    >
                      <Icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                      <span className="absolute -top-8 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {social.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
              Newsletter
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get updates about new routes, schedules, and special offers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Send className="h-5 w-5 text-white" />
                </button>
              </div>
              {subscribed && (
                <div className="text-sm text-green-400 animate-pulse flex items-center gap-2">
                  <span>✓</span>
                  Subscribed successfully!
                </div>
              )}
            </form>

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-2 gap-2">
              {[
                { icon: Shield, label: 'Secure', color: 'text-blue-400' },
                { icon: Award, label: 'Award Winning', color: 'text-yellow-400' },
                { icon: Truck, label: 'Fleet', color: 'text-green-400' },
                { icon: Building, label: 'Official', color: 'text-purple-400' },
              ].map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <div key={index} className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
                    <Icon className={`h-4 w-4 ${badge.color}`} />
                    <span className="text-xs text-gray-400">{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 flex items-center gap-1">
              © {new Date().getFullYear()} Kolhapur City Bus Service. 
              
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">
                FAQ
              </Link>
              <button
                onClick={scrollToTop}
                className={`
                  p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 
                  hover:scale-110 hover:shadow-lg flex items-center gap-2
                  ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}
                aria-label="Scroll to top"
              >
                <ArrowUp className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float-slow-delay"></div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }
        @keyframes float-slow-delay {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 30px); }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-slow-delay {
          animation: float-slow-delay 10s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;