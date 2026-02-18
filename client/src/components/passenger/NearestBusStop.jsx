// client/src/components/passenger/NearestBusStop.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Bus, Locate } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const NearestBusStop = () => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [nearestStops, setNearestStops] = useState([]);

  const stops = [
    { id: 1, name: 'Central Bus Stand (CBS)', distance: '0.3 km', eta: '2 min', buses: ['101', '103', '105'] },
    { id: 2, name: 'Mahalaxmi Temple Stop', distance: '0.8 km', eta: '5 min', buses: ['101', '104'] },
    { id: 3, name: 'Shivaji Chowk', distance: '1.2 km', eta: '8 min', buses: ['102', '105'] },
    { id: 4, name: 'Rankala Lake Stop', distance: '1.5 km', eta: '10 min', buses: ['101'] },
    { id: 5, name: 'Shahupuri Stop', distance: '1.8 km', eta: '12 min', buses: ['102', '105'] },
  ];

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setNearestStops(stops);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setNearestStops(stops);
          setLoading(false);
        }
      );
    } else {
      setNearestStops(stops);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <Card.Header>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center">
              <MapPin className="h-6 w-6 mr-2 text-blue-600" />
              Nearest Bus Stops
            </h2>
            <Button size="sm" variant="outline" onClick={getCurrentLocation}>
              <Locate className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </Card.Header>

        <Card.Body className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Finding your location...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {location && (
                <div className="bg-green-50 p-3 rounded-lg flex items-center">
                  <Navigation className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-700">Location detected successfully</span>
                </div>
              )}

              {nearestStops.map((stop) => (
                <div key={stop.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{stop.name}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Navigation className="h-4 w-4 mr-1 text-blue-500" />
                        <span>{stop.distance} away</span>
                        <Clock className="h-4 w-4 ml-3 mr-1 text-green-500" />
                        <span>{stop.eta}</span>
                      </div>
                    </div>
                    <Badge variant="primary">Stop</Badge>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Available buses:</p>
                    <div className="flex flex-wrap gap-2">
                      {stop.buses.map((bus) => (
                        <span key={bus} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          Route {bus}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default NearestBusStop;