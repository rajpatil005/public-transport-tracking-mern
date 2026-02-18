// client/src/pages/Contact.jsx
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <Card.Header>
          <h1 className="text-3xl font-bold text-center">Contact Us</h1>
          <p className="text-gray-600 text-center mt-2">We're here to help 24/7</p>
        </Card.Header>

        <Card.Body className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Phone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold">Phone</h3>
              <p className="text-sm text-gray-600">+91 231 1234567</p>
              <p className="text-xs text-gray-500">24/7 Support</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Email</h3>
              <p className="text-sm text-gray-600">support@kolhapur-bus.com</p>
              <p className="text-xs text-gray-500">Reply within 2 hrs</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold">Office</h3>
              <p className="text-sm text-gray-600">Central Bus Stand</p>
              <p className="text-xs text-gray-500">Kolhapur - 416001</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>
              {submitted && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mb-4"
                  required
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="mb-4"
                  required
                />
                <Input
                  type="text"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="mb-4"
                  required
                />
                <textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  rows="4"
                  required
                />
                <Button type="submit" fullWidth>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Office Hours</h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="font-medium">Monday - Friday</span>
                  <span>8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="font-medium">Saturday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="font-medium">Sunday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4">Emergency Contacts</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">24/7 Helpline</span>
                  <span className="text-red-600 font-bold">108</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">Lost & Found</span>
                  <span className="text-yellow-600">0231-1234567</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Complaint</span>
                  <span className="text-blue-600">complaint@kolhapur-bus.com</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-blue-600">Facebook</a>
                  <a href="#" className="text-gray-400 hover:text-blue-400">Twitter</a>
                  <a href="#" className="text-gray-400 hover:text-pink-600">Instagram</a>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Contact;