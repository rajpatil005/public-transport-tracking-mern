// client/src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, ChevronRight, Clock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'FAQs', path: '/faq' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms & Conditions', path: '/terms' }
  ];

  const services = [
    { name: 'Live Bus Tracking', path: '/track-bus/1' },
    { name: 'Book Tickets', path: '/search' },
    { name: 'Bus Schedule', path: '/schedule' },
    { name: 'Fare Calculator', path: '/fare-calculator' },
    { name: 'Nearby Stops', path: '/nearby-stops' }
  ];

  const contactInfo = [
    { icon: Phone, text: '+91 231 1234567', link: 'tel:+912311234567' },
    { icon: Mail, text: 'support@kolhapur-bus.com', link: 'mailto:support@kolhapur-bus.com' },
    { icon: MapPin, text: 'Central Bus Stand, Kolhapur - 416001' },
    { icon: Clock, text: '24/7 Customer Support' }
  ];

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Bus className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">Kolhapur Bus</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Kolhapur City Public Bus Transport System provides smart, safe, 
              and reliable public transportation services across Kolhapur city.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-blue-400"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-blue-400"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-blue-400"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="text-gray-400 hover:text-blue-400 flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <Link to={service.path} className="text-gray-400 hover:text-blue-400 flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start">
                  <item.icon className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  {item.link ? (
                    <a href={item.link} className="text-gray-400 hover:text-blue-400 text-sm">
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">{item.text}</span>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-yellow-500 font-semibold text-sm mb-1">Emergency?</p>
              <a href="tel:108" className="text-2xl font-bold text-white hover:text-blue-400">
                108
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Kolhapur City Public Bus Transport System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;