import React, { useState } from 'react';
import { Calendar, Clock, Bus, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Badge from '../ui/Badge';

const BusSchedule = () => {
  const [selectedRoute, setSelectedRoute] = useState('');
  const [expandedRoute, setExpandedRoute] = useState(null);

  const routes = [
    {
      routeNumber: "101",
      name: "Central Bus Stand → Mahalaxmi Temple → Rankala Lake",
      source: "Central Bus Stand",
      destination: "Rankala Lake",
      firstBus: '6:30 AM',
      lastBus: '10:00 PM',
      frequency: '15 mins',
      peakFrequency: '10 mins',
      stops: [
        { name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431 },
        { name: "Bindu Chowk", latitude: 16.6975, longitude: 74.2382 },
        { name: "Mahalaxmi Temple", latitude: 16.6913, longitude: 74.2245 },
        { name: "Rankala Stand", latitude: 16.6895, longitude: 74.2198 },
        { name: "Rankala Lake", latitude: 16.6878, longitude: 74.2167 },
      ],
      path: [
        { lat: 16.7017, lng: 74.2431 },
        { lat: 16.6975, lng: 74.2382 },
        { lat: 16.6913, lng: 74.2245 },
        { lat: 16.6895, lng: 74.2198 },
        { lat: 16.6878, lng: 74.2167 },
      ]
    },
    {
      routeNumber: "102",
      name: "Central Bus Stand → New Palace → DYP City Mall",
      source: "Central Bus Stand",
      destination: "DYP City Mall",
      firstBus: '6:00 AM',
      lastBus: '9:30 PM',
      frequency: '20 mins',
      peakFrequency: '12 mins',
      stops: [
        { name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431 },
        { name: "Dasara Chowk", latitude: 16.7045, longitude: 74.2402 },
        { name: "New Palace", latitude: 16.7031, longitude: 74.2586 },
        { name: "Rajarampuri 3rd Lane", latitude: 16.7116, longitude: 74.2345 },
        { name: "DYP City Mall", latitude: 16.7125, longitude: 74.2253 },
      ],
      path: [
        { lat: 16.7017, lng: 74.2431 },
        { lat: 16.7045, lng: 74.2402 },
        { lat: 16.7031, lng: 74.2586 },
        { lat: 16.7116, lng: 74.2345 },
        { lat: 16.7125, lng: 74.2253 },
      ]
    },
    {
      routeNumber: "103",
      name: "Rankala Lake → CPR Hospital → Khasbag Maidan",
      source: "Rankala Lake",
      destination: "Khasbag Maidan",
      firstBus: '5:45 AM',
      lastBus: '10:30 PM',
      frequency: '25 mins',
      peakFrequency: '15 mins',
      stops: [
        { name: "Rankala Lake", latitude: 16.6878, longitude: 74.2167 },
        { name: "Mahalaxmi Temple", latitude: 16.6913, longitude: 74.2245 },
        { name: "CPR Hospital", latitude: 16.7083, longitude: 74.2356 },
        { name: "Shahupuri", latitude: 16.7069, longitude: 74.2439 },
        { name: "Khasbag Maidan", latitude: 16.6947, longitude: 74.2408 },
      ],
      path: [
        { lat: 16.6878, lng: 74.2167 },
        { lat: 16.6913, lng: 74.2245 },
        { lat: 16.7083, lng: 74.2356 },
        { lat: 16.7069, lng: 74.2439 },
        { lat: 16.6947, lng: 74.2408 },
      ]
    },
    {
      routeNumber: "104",
      name: "Shivaji University → Central Bus Stand",
      source: "Shivaji University",
      destination: "Central Bus Stand",
      firstBus: '6:15 AM',
      lastBus: '9:45 PM',
      frequency: '22 mins',
      peakFrequency: '14 mins',
      stops: [
        { name: "Shivaji University", latitude: 16.7222, longitude: 74.2481 },
        { name: "Kasaba Bawada", latitude: 16.7274, longitude: 74.2214 },
        { name: "Tarabai Park", latitude: 16.7052, longitude: 74.2401 },
        { name: "Bindu Chowk", latitude: 16.6975, longitude: 74.2382 },
        { name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431 },
      ],
      path: [
        { lat: 16.7222, lng: 74.2481 },
        { lat: 16.7274, lng: 74.2214 },
        { lat: 16.7052, lng: 74.2401 },
        { lat: 16.6975, lng: 74.2382 },
        { lat: 16.7017, lng: 74.2431 },
      ]
    },
    {
      routeNumber: "105",
      name: "Central Bus Stand → DYP City Mall → Rankala Lake",
      source: "Central Bus Stand",
      destination: "Rankala Lake",
      firstBus: '6:45 AM',
      lastBus: '10:15 PM',
      frequency: '18 mins',
      peakFrequency: '12 mins',
      stops: [
        { name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431 },
        { name: "Collector Office Kolhapur", latitude: 16.7074, longitude: 74.239 },
        { name: "Shivaji University", latitude: 16.7222, longitude: 74.2481 },
        { name: "New Palace Road", latitude: 16.709, longitude: 74.2255 },
        { name: "Rankala Lake", latitude: 16.6878, longitude: 74.2167 },
      ],
      path: [
        { lat: 16.7017, lng: 74.2431 },
        { lat: 16.7074, lng: 74.239 },
        { lat: 16.7222, lng: 74.2481 },
        { lat: 16.709, lng: 74.2255 },
        { lat: 16.6878, lng: 74.2167 },
      ]
    }
  ];

  const filteredRoutes = selectedRoute 
    ? routes.filter(r => r.routeNumber.includes(selectedRoute) || r.name.toLowerCase().includes(selectedRoute.toLowerCase()))
    : routes;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <Card.Header>
          <h2 className="text-2xl font-bold flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-blue-600" />
            Bus Schedule
          </h2>
          <p className="text-gray-600 mt-2">View complete schedule for all Kolhapur city buses</p>
        </Card.Header>

        <Card.Body className="p-6">
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search by route number or name..."
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            {filteredRoutes.map((route) => (
              <Card key={route.routeNumber} className="border">
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedRoute(expandedRoute === route.routeNumber ? null : route.routeNumber)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center">
                        <Bus className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="font-bold text-lg">Route {route.routeNumber}</h3>
                        <Badge variant="primary" className="ml-3">{route.name}</Badge>
                      </div>
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="mr-4">First: {route.firstBus}</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Last: {route.lastBus}</span>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>From: {route.source}</span>
                        <span className="mx-2">→</span>
                        <span>To: {route.destination}</span>
                      </div>
                    </div>
                    {expandedRoute === route.routeNumber ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </div>

                {expandedRoute === route.routeNumber && (
                  <div className="p-4 border-t bg-gray-50">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Regular Frequency</p>
                        <p className="text-lg font-bold text-blue-600">{route.frequency}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Peak Hours Frequency</p>
                        <p className="text-lg font-bold text-green-600">{route.peakFrequency}</p>
                      </div>
                    </div>

                    <h4 className="font-semibold mb-3">Route Stops</h4>
                    <div className="space-y-2">
                      {route.stops.map((stop, index) => (
                        <div key={index} className="flex items-center p-2 bg-white rounded-lg">
                          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mr-3">
                            {index + 1}
                          </span>
                          <span className="flex-1">{stop.name}</span>
                          <span className="text-xs text-gray-400">
                            {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BusSchedule;