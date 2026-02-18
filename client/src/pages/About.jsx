// client/src/pages/About.jsx
import React from 'react';
import { Bus, Users, Award, Shield, Clock, MapPin } from 'lucide-react';
import Card from '../components/ui/Card';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <Card.Header>
          <h1 className="text-3xl font-bold text-center">About Kolhapur City Bus Transport</h1>
        </Card.Header>
        <Card.Body className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <img 
                src="https://via.placeholder.com/800x400" 
                alt="Kolhapur City"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            </div>

            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed">
                Kolhapur City Bus Transport System is a premier public transportation service 
                serving the historic city of Kolhapur and its surrounding areas. Established 
                in 1965, we have been committed to providing safe, reliable, and affordable 
                transportation to millions of passengers.
              </p>

              <h2 className="text-2xl font-semibold mt-6 mb-3">Our Mission</h2>
              <p className="text-gray-700">
                To provide efficient, eco-friendly, and accessible public transportation that 
                connects communities, supports economic growth, and enhances the quality of 
                life in Kolhapur city.
              </p>

              <h2 className="text-2xl font-semibold mt-6 mb-3">Our Vision</h2>
              <p className="text-gray-700">
                To be the model of excellence in urban public transportation, setting 
                standards for reliability, sustainability, and customer satisfaction.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="text-center">
                <div className="inline-flex p-3 bg-blue-100 rounded-full mb-2">
                  <Bus className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold">50+</p>
                <p className="text-sm text-gray-600">Buses</p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-3 bg-green-100 rounded-full mb-2">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold">25+</p>
                <p className="text-sm text-gray-600">Routes</p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-3 bg-purple-100 rounded-full mb-2">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold">100+</p>
                <p className="text-sm text-gray-600">Staff</p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-3 bg-orange-100 rounded-full mb-2">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-sm text-gray-600">Service</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mt-6">
              <h3 className="text-xl font-semibold mb-4">Why Choose Us?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">Safety First</h4>
                    <p className="text-sm text-gray-600">GPS tracked buses with emergency response</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-green-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">Punctuality</h4>
                    <p className="text-sm text-gray-600">98% on-time performance</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-purple-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">Modern Fleet</h4>
                    <p className="text-sm text-gray-600">Well-maintained, AC and standard buses</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-orange-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">Trained Staff</h4>
                    <p className="text-sm text-gray-600">Professional drivers and support team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default About;