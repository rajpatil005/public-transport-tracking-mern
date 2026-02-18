// client/src/components/passenger/BusSchedule.jsx
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
      number: '101', 
      name: 'CBS → Rankala', 
      firstBus: '6:30 AM', 
      lastBus: '10:00 PM',
      frequency: '15 mins',
      peakFrequency: '10 mins',
      stops: [
        { name: 'Central Bus Stand', time: '6:30 AM' },
        { name: 'Shivaji Chowk', time: '6:35 AM' },
        { name: 'Mahadwar Road', time: '6:40 AM' },
        { name: 'Mahalaxmi Temple', time: '6:45 AM' },
        { name: 'Rankala Lake', time: '6:55 AM' }
      ]
    },
    { 
      number: '102', 
      name: 'Shahupuri → JN', 
      firstBus: '6:00 AM', 
      lastBus: '9:30 PM',
      frequency: '20 mins',
      peakFrequency: '12 mins',
      stops: [
        { name: 'Shahupuri', time: '6:00 AM' },
        { name: 'Ruikar Colony', time: '6:08 AM' },
        { name: 'KMC College', time: '6:15 AM' },
        { name: 'Jawahar Nagar', time: '6:22 AM' }
      ]
    },
    { 
      number: '103', 
      name: 'Tarabai Park → Kagal', 
      firstBus: '5:45 AM', 
      lastBus: '10:30 PM',
      frequency: '25 mins',
      peakFrequency: '15 mins',
      stops: [
        { name: 'Tarabai Park', time: '5:45 AM' },
        { name: 'Shivaji University', time: '5:55 AM' },
        { name: 'Gokul Shirgaon', time: '6:10 AM' },
        { name: 'Kagal MIDC', time: '6:25 AM' },
        { name: 'Kagal Bus Stand', time: '6:35 AM' }
      ]
    }
  ];

  const filteredRoutes = selectedRoute 
    ? routes.filter(r => r.number.includes(selectedRoute) || r.name.toLowerCase().includes(selectedRoute.toLowerCase()))
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
              <Card key={route.number} className="border">
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedRoute(expandedRoute === route.number ? null : route.number)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center">
                        <Bus className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="font-bold text-lg">Route {route.number}</h3>
                        <Badge variant="primary" className="ml-3">{route.name}</Badge>
                      </div>
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="mr-4">First: {route.firstBus}</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Last: {route.lastBus}</span>
                      </div>
                    </div>
                    {expandedRoute === route.number ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </div>

                {expandedRoute === route.number && (
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

                    <h4 className="font-semibold mb-3">Route Stops & Timings</h4>
                    <div className="space-y-2">
                      {route.stops.map((stop, index) => (
                        <div key={index} className="flex items-center p-2 bg-white rounded-lg">
                          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mr-3">
                            {index + 1}
                          </span>
                          <span className="flex-1">{stop.name}</span>
                          <span className="text-sm font-medium text-gray-600">{stop.time}</span>
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