// client/src/components/passenger/NearestBusStop.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Bus, Locate } from 'lucide-react';

const NearestBusStop = () => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [nearestStops, setNearestStops] = useState([]);

  // Bus stops data with coordinates
  const allStops = [
    { id: 1, name: "Central Bus Stand", lat: 16.7017, lng: 74.2431, routes: ["101", "102", "104", "105"] },
    { id: 2, name: "Bindu Chowk", lat: 16.6975, lng: 74.2382, routes: ["101", "104"] },
    { id: 3, name: "Mahalaxmi Temple", lat: 16.6913, lng: 74.2245, routes: ["101", "103"] },
    { id: 4, name: "Rankala Lake", lat: 16.6878, lng: 74.2167, routes: ["101", "103", "105"] },
    { id: 5, name: "Dasara Chowk", lat: 16.7045, lng: 74.2402, routes: ["102"] },
    { id: 6, name: "New Palace", lat: 16.7031, lng: 74.2586, routes: ["102"] },
    { id: 7, name: "DYP City Mall", lat: 16.7125, lng: 74.2253, routes: ["102", "105"] },
    { id: 8, name: "CPR Hospital", lat: 16.7083, lng: 74.2356, routes: ["103"] },
    { id: 9, name: "Shahupuri", lat: 16.7069, lng: 74.2439, routes: ["103"] },
    { id: 10, name: "Khasbag Maidan", lat: 16.6947, lng: 74.2408, routes: ["103"] },
    { id: 11, name: "Shivaji University", lat: 16.7222, lng: 74.2481, routes: ["104", "105"] },
    { id: 12, name: "Tarabai Park", lat: 16.7052, lng: 74.2401, routes: ["104"] },
  ];

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Format distance for display
  const formatDistance = (distanceKm) => {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm.toFixed(1)} km`;
  };

  // Calculate walking time (5 km/h speed)
  const calculateWalkingTime = (distanceKm) => {
    const minutes = (distanceKm / 5) * 60;
    return Math.round(minutes);
  };

  // Get user's location and find nearest stops
  const getCurrentLocation = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          setLocation({ lat: userLat, lng: userLng });
          
          // Calculate distances to all stops
          const stopsWithDistance = allStops.map(stop => {
            const distance = calculateDistance(userLat, userLng, stop.lat, stop.lng);
            const walkingTime = calculateWalkingTime(distance);
            return {
              ...stop,
              distance: formatDistance(distance),
              walkingTime: walkingTime,
              rawDistance: distance
            };
          });
          
          // Sort by distance and get top 5
          const nearest = stopsWithDistance
            .sort((a, b) => a.rawDistance - b.rawDistance)
            .slice(0, 5);
          
          setNearestStops(nearest);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Use default location (Central Bus Stand)
          const defaultLat = 16.7017;
          const defaultLng = 74.2431;
          setLocation({ lat: defaultLat, lng: defaultLng, isDefault: true });
          
          const stopsWithDistance = allStops.map(stop => {
            const distance = calculateDistance(defaultLat, defaultLng, stop.lat, stop.lng);
            const walkingTime = calculateWalkingTime(distance);
            return {
              ...stop,
              distance: formatDistance(distance),
              walkingTime: walkingTime,
              rawDistance: distance
            };
          });
          
          const nearest = stopsWithDistance
            .sort((a, b) => a.rawDistance - b.rawDistance)
            .slice(0, 5);
          
          setNearestStops(nearest);
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center">
              <MapPin className="h-6 w-6 mr-2 text-blue-600" />
              Nearest Bus Stops
            </h2>
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <Locate className="h-4 w-4 mr-1" />
              {loading ? 'Finding...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Finding your location...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Location Status */}
              {location && (
                <div className="bg-green-50 p-3 rounded-lg flex items-center">
                  <Navigation className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-700">
                    {location.isDefault ? '📍 Using default location (Central Bus Stand Area)' : '✓ Location detected successfully'}
                  </span>
                </div>
              )}

              {/* Stops List */}
              {nearestStops.length > 0 ? (
                <>
                  <div className="text-sm text-gray-500 mb-2">
                    Found {nearestStops.length} stops near you
                  </div>
                  {nearestStops.map((stop, index) => (
                    <div key={stop.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{stop.name}</h3>
                            {index === 0 && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                Closest
                              </span>
                            )}
                          </div>
                          <div className="flex items-center mt-2 text-sm text-gray-600 gap-4">
                            <div className="flex items-center">
                              <Navigation className="h-4 w-4 mr-1 text-blue-500" />
                              <span>{stop.distance} away</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-green-500" />
                              <span>~{stop.walkingTime} min walk</span>
                            </div>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          Stop
                        </span>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Available buses:</p>
                        <div className="flex flex-wrap gap-2">
                          {stop.routes.map((route) => (
                            <span
                              key={route}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                            >
                              Route {route}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <Bus className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No bus stops found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearestBusStop;