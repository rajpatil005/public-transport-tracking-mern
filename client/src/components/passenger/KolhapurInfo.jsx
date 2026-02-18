// client/src/components/passenger/KolhapurInfo.js
import React from 'react';
import { MapPin, Bus, Clock, Info, Star, Landmark, Coffee, ShoppingBag, Phone, Calendar } from 'lucide-react';
import Card from '../ui/Card';
import { 
  kolhapurLandmarks, 
  localTips, 
  kolhapurCuisine, 
  kolhapurFestivals, 
  transportHubs, 
  emergencyContacts 
} from '../../data/kolhapurData';

const KolhapurInfo = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Kolhapur</h1>
          <p className="text-xl text-gray-600">The City of Goddess Mahalaxmi</p>
        </div>

        {/* Hero Image Placeholder */}
        <Card className="mb-8 p-0 overflow-hidden">
          <div className="w-full h-96 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
            <div className="text-center">
              <Landmark className="h-24 w-24 mx-auto mb-4" />
              <h2 className="text-3xl font-bold">Kolhapur - The Cultural Capital</h2>
              <p className="text-xl mt-2">Maharashtra</p>
            </div>
          </div>
        </Card>

        {/* City Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <Card.Header>
              <h2 className="text-2xl font-semibold flex items-center">
                <Info className="h-6 w-6 mr-2 text-blue-600" />
                About Kolhapur
              </h2>
            </Card.Header>
            <Card.Body>
              <p className="text-gray-700 leading-relaxed">
                Kolhapur is a historic city on the banks of the Panchganga River in the 
                western Indian state of Maharashtra. Known for its rich cultural heritage, 
                Kolhapur is famous for the Mahalaxmi Temple, Kolhapuri chappals (footwear), 
                and spicy Kolhapuri cuisine. The city serves as a major transportation hub 
                for southern Maharashtra with its extensive bus network connecting to 
                various parts of the state.
              </p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h2 className="text-2xl font-semibold flex items-center">
                <Bus className="h-6 w-6 mr-2 text-green-600" />
                Transportation Hub
              </h2>
            </Card.Header>
            <Card.Body>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kolhapur's public bus system serves over 500,000 passengers daily, 
                connecting major areas including Shahupuri, Tarabai Park, Rankala, 
                and surrounding towns like Ichalkaranji and Kagal.
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded">
                  <div className="text-2xl font-bold text-blue-600">50+</div>
                  <div className="text-sm">Buses</div>
                </div>
                <div className="p-3 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-600">25+</div>
                  <div className="text-sm">Routes</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Famous Landmarks */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Famous Landmarks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {kolhapurLandmarks.map((landmark, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow">
              <Card.Body>
                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 rounded-lg mr-4">
                    <Landmark className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{landmark.name}</h3>
                    <p className="text-sm text-blue-600 mb-2">{landmark.type}</p>
                    <p className="text-sm text-gray-600">{landmark.description}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Local Cuisine */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Famous Kolhapur Cuisine</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {kolhapurCuisine.map((item, index) => (
            <Card key={index}>
              <Card.Body>
                <div className="flex items-start">
                  <div className="p-2 bg-orange-100 rounded-lg mr-4">
                    <Coffee className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <p className="text-xs text-gray-500">📍 {item.restaurant}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Local Tips */}
        <Card className="mb-8 bg-gradient-to-r from-orange-50 to-red-50">
          <Card.Header>
            <h2 className="text-2xl font-semibold flex items-center">
              <Star className="h-6 w-6 mr-2 text-yellow-500" />
              Local Tips for Visitors
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localTips.map((tip, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Festivals */}
        <Card className="mb-8">
          <Card.Header>
            <h2 className="text-2xl font-semibold flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-purple-600" />
              Festivals & Events
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kolhapurFestivals.map((festival, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg">{festival.name}</h3>
                  <p className="text-sm text-purple-600 mb-2">{festival.month}</p>
                  <p className="text-sm text-gray-600">{festival.description}</p>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Transport Hubs */}
        <Card className="mb-8">
          <Card.Header>
            <h2 className="text-2xl font-semibold flex items-center">
              <Bus className="h-6 w-6 mr-2 text-green-600" />
              Transport Hubs
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {transportHubs.map((hub, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{hub.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{hub.type}</p>
                  <p className="text-xs text-gray-500 mb-2">📍 {hub.location}</p>
                  <div className="flex flex-wrap gap-1">
                    {hub.facilities.slice(0, 3).map((facility, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-xs rounded">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <Card.Header>
            <h2 className="text-2xl font-semibold flex items-center">
              <Phone className="h-6 w-6 mr-2 text-red-600" />
              Emergency Contacts
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold">{contact.service}</p>
                  <p className="text-xl font-bold text-red-600">{contact.number}</p>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default KolhapurInfo;