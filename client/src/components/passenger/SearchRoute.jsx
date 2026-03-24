import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Clock, Bus, ArrowRight, Navigation, 
  Timer, Star, Wifi, Coffee, Battery, Shield,
  ChevronDown, ChevronUp, AlertCircle, Gauge,
  Users, Eye, Info, RefreshCw, ExternalLink
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';

const SearchRoute = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRoute, setExpandedRoute] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [busLocations, setBusLocations] = useState({});
  const [routes, setRoutes] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [trackingEnabled, setTrackingEnabled] = useState(true);

  //===============Mock data for Kolhapur city bus routes (All 5 routes) ==============//
  const mockRoutes = [
    {
      routeNumber: "101",
      name: "CBS → Mahalaxmi Temple → Rankala Lake",
      source: "Central Bus Stand (CBS)",
      destination: "Rankala Lake",
      stops: [
        { name: "Central Bus Stand (CBS)", platform: "1A", fare: 0, distance: 0, lat: 16.7017, lng: 74.2431 },
        { name: "Bindu Chowk", platform: "2B", fare: 5, distance: 1.2, lat: 16.6975, lng: 74.2382 },
        { name: "Mahalaxmi Temple", platform: "3C", fare: 8, distance: 2.5, lat: 16.6913, lng: 74.2245 },
        { name: "Rankala Stand", platform: "4D", fare: 12, distance: 3.8, lat: 16.6895, lng: 74.2198 },
        { name: "Rankala Lake", platform: "5E", fare: 15, distance: 4.5, lat: 16.6878, lng: 74.2167 },
      ],
      totalDistance: "4.5 km",
      duration: "25 mins",
      firstBus: "6:00 AM",
      lastBus: "10:00 PM",
      frequency: "Every 15 mins",
      amenities: ["AC", "USB Charging"],
      rating: "4.5",
      activeBuses: 2,
      busInfo: {
        busNumber: "MH09-1234",
        capacity: 52,
        driverName: "Rajendra Patil",
        status: "ACTIVE"
      }
    },
    {
      routeNumber: "102",
      name: "CBS → New Palace → DYP City Mall",
      source: "Central Bus Stand (CBS)",
      destination: "DYP City Mall",
      stops: [
        { name: "Central Bus Stand (CBS)", platform: "1A", fare: 0, distance: 0, lat: 16.7017, lng: 74.2431 },
        { name: "Dasara Chowk", platform: "2B", fare: 4, distance: 1.0, lat: 16.7045, lng: 74.2402 },
        { name: "New Palace", platform: "3C", fare: 7, distance: 2.2, lat: 16.7031, lng: 74.2586 },
        { name: "Rajarampuri 3rd Lane", platform: "4D", fare: 10, distance: 3.5, lat: 16.7116, lng: 74.2345 },
        { name: "DYP City Mall", platform: "5E", fare: 12, distance: 4.2, lat: 16.7125, lng: 74.2253 },
      ],
      totalDistance: "4.2 km",
      duration: "22 mins",
      firstBus: "6:30 AM",
      lastBus: "9:30 PM",
      frequency: "Every 20 mins",
      amenities: ["WiFi", "USB Charging"],
      rating: "4.2",
      activeBuses: 1,
      busInfo: {
        busNumber: "MH09-5678",
        capacity: 45,
        driverName: "Sanjay Deshmukh",
        status: "ACTIVE"
      }
    },
    {
      routeNumber: "103",
      name: "Rankala Lake → CPR Hospital → Khasbag Maidan",
      source: "Rankala Lake",
      destination: "Khasbag Maidan",
      stops: [
        { name: "Rankala Lake", platform: "1A", fare: 0, distance: 0, lat: 16.6878, lng: 74.2167 },
        { name: "Mahalaxmi Temple", platform: "2B", fare: 5, distance: 1.3, lat: 16.6913, lng: 74.2245 },
        { name: "CPR Hospital", platform: "3C", fare: 10, distance: 2.8, lat: 16.7083, lng: 74.2356 },
        { name: "Shahupuri", platform: "4D", fare: 15, distance: 3.9, lat: 16.7069, lng: 74.2439 },
        { name: "Khasbag Maidan", platform: "5E", fare: 18, distance: 4.8, lat: 16.6947, lng: 74.2408 },
      ],
      totalDistance: "4.8 km",
      duration: "28 mins",
      firstBus: "7:00 AM",
      lastBus: "8:30 PM",
      frequency: "Every 25 mins",
      amenities: ["AC", "CCTV"],
      rating: "4.3",
      activeBuses: 1,
      busInfo: {
        busNumber: "MH09-9101",
        capacity: 60,
        driverName: "Prakash Jadhav",
        status: "ACTIVE"
      }
    },
    {
      routeNumber: "104",
      name: "Shivaji University → Central Bus Stand",
      source: "Shivaji University",
      destination: "Central Bus Stand (CBS)",
      stops: [
        { name: "Shivaji University", platform: "1A", fare: 0, distance: 0, lat: 16.7222, lng: 74.2481 },
        { name: "Kasaba Bawada", platform: "2B", fare: 6, distance: 1.8, lat: 16.7274, lng: 74.2214 },
        { name: "Tarabai Park", platform: "3C", fare: 10, distance: 3.2, lat: 16.7052, lng: 74.2401 },
        { name: "Bindu Chowk", platform: "4D", fare: 14, distance: 4.1, lat: 16.6975, lng: 74.2382 },
        { name: "Central Bus Stand (CBS)", platform: "5E", fare: 16, distance: 4.6, lat: 16.7017, lng: 74.2431 },
      ],
      totalDistance: "4.6 km",
      duration: "26 mins",
      firstBus: "7:30 AM",
      lastBus: "9:00 PM",
      frequency: "Every 30 mins",
      amenities: ["WiFi", "CCTV"],
      rating: "4.1",
      activeBuses: 1,
      busInfo: {
        busNumber: "MH09-1121",
        capacity: 52,
        driverName: "Vijay More",
        status: "ACTIVE"
      }
    },
    {
      routeNumber: "105",
      name: "Central Bus Stand → DYP City Mall → Rankala Lake",
      source: "Central Bus Stand (CBS)",
      destination: "Rankala Lake",
      stops: [
        { name: "Central Bus Stand (CBS)", platform: "1A", fare: 0, distance: 0, lat: 16.7017, lng: 74.2431 },
        { name: "Collector Office Kolhapur", platform: "2B", fare: 5, distance: 1.1, lat: 16.7074, lng: 74.239 },
        { name: "Shivaji University", platform: "3C", fare: 9, distance: 2.4, lat: 16.7222, lng: 74.2481 },
        { name: "New Palace Road", platform: "4D", fare: 13, distance: 3.7, lat: 16.709, lng: 74.2255 },
        { name: "DYP City Mall", platform: "5E", fare: 15, distance: 4.2, lat: 16.7125, lng: 74.2253 },
        { name: "Rankala Lake", platform: "6F", fare: 18, distance: 4.9, lat: 16.6878, lng: 74.2167 },
      ],
      totalDistance: "4.9 km",
      duration: "28 mins",
      firstBus: "6:15 AM",
      lastBus: "9:45 PM",
      frequency: "Every 20 mins",
      amenities: ["AC", "WiFi", "USB Charging"],
      rating: "4.6",
      activeBuses: 1,
      busInfo: {
        busNumber: "MH09-3141",
        capacity: 45,
        driverName: "Dattatray Kambale",
        status: "ACTIVE"
      }
    }
  ];

  //=======Initialize routes with mock data ==============//
  useEffect(() => {
    setRoutes(mockRoutes);
    
    // Initialize bus locations for live tracking
    const initialLocations = {};
    mockRoutes.forEach(route => {
      if (route.routeNumber === "101") {
        initialLocations[route.routeNumber] = {
          currentStopIndex: 1, 
          nextStopIndex: 2, 
          progress: 0.4,
          lastUpdate: new Date().toISOString(),
          speed: "25 km/h",
          occupancy: "32/52 seats",
          busNumber: route.busInfo.busNumber,
          driverName: route.busInfo.driverName
        };
      } else if (route.routeNumber === "104") {
        initialLocations[route.routeNumber] = {
          currentStopIndex: 2, // At Tarabai Park
          nextStopIndex: 3, // Next is Bindu Chowk
          progress: 0.6,
          lastUpdate: new Date().toISOString(),
          speed: "30 km/h",
          occupancy: "28/52 seats",
          busNumber: route.busInfo.busNumber,
          driverName: route.busInfo.driverName
        };
      } else if (route.routeNumber === "105") {
        initialLocations[route.routeNumber] = {
          currentStopIndex: 3, // At New Palace Road
          nextStopIndex: 4, // Next is DYP City Mall
          progress: 0.3,
          lastUpdate: new Date().toISOString(),
          speed: "22 km/h",
          occupancy: "35/45 seats",
          busNumber: route.busInfo.busNumber,
          driverName: route.busInfo.driverName
        };
      } else {
        const randomStopIndex = Math.floor(Math.random() * route.stops.length);
        initialLocations[route.routeNumber] = {
          currentStopIndex: randomStopIndex,
          nextStopIndex: randomStopIndex + 1 < route.stops.length ? randomStopIndex + 1 : 0,
          progress: Math.random(),
          lastUpdate: new Date().toISOString(),
          speed: "25 km/h",
          occupancy: `${Math.floor(Math.random() * 30 + 20)}/52 seats`,
          busNumber: route.busInfo.busNumber,
          driverName: route.busInfo.driverName
        };
      }
    });
    setBusLocations(initialLocations);
  }, []);

  // Update bus locations every 5 seconds
  useEffect(() => {
    if (!trackingEnabled) return;

    const interval = setInterval(() => {
      setBusLocations(prev => {
        const updated = { ...prev };
        mockRoutes.forEach(route => {
          if (updated[route.routeNumber]) {
            const current = updated[route.routeNumber];
            let newProgress = current.progress + 0.05;
            
            if (newProgress >= 1) {
              const nextStopIndex = current.nextStopIndex;
              const newNextStopIndex = nextStopIndex + 1 < route.stops.length ? nextStopIndex + 1 : 0;
              updated[route.routeNumber] = {
                ...current,
                currentStopIndex: nextStopIndex,
                nextStopIndex: newNextStopIndex,
                progress: 0,
                lastUpdate: new Date().toISOString(),
                speed: Math.floor(Math.random() * 10 + 20) + " km/h",
                occupancy: `${Math.floor(Math.random() * 30 + 20)}/52 seats`
              };
            } else {
              updated[route.routeNumber] = {
                ...current,
                progress: newProgress,
                lastUpdate: new Date().toISOString(),
                speed: Math.floor(Math.random() * 10 + 20) + " km/h",
                occupancy: `${Math.floor(Math.random() * 30 + 20)}/52 seats`
              };
            }
          }
        });
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [trackingEnabled]);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    
    setTimeout(() => {
      const query = searchQuery.toLowerCase().trim();
      
      if (query === '') {
        setSearchResults([]);
      } else {
        const filtered = routes.filter(route => {
          if (route.routeNumber.toLowerCase() === query) return true;
          if (route.routeNumber.toLowerCase().includes(query)) return true;
          if (route.name.toLowerCase().includes(query)) return true;
          if (route.source.toLowerCase().includes(query)) return true;
          if (route.destination.toLowerCase().includes(query)) return true;
          if (route.stops.some(stop => stop.name.toLowerCase().includes(query))) return true;
          return false;
        });
        
        setSearchResults(filtered);
        if (filtered.length === 1) {
          setExpandedRoute(filtered[0].routeNumber);
        }
      }
      setLoading(false);
    }, 300);
  };

  const calculateETA = (route, stopName) => {
    const stopIndex = route.stops.findIndex(s => s.name === stopName);
    const busLocation = busLocations[route.routeNumber];
    
    if (!busLocation) {
      const stop = route.stops.find(s => s.name === stopName);
      if (stop) {
        const totalDuration = parseInt(route.duration);
        const distanceRatio = stop.distance / parseFloat(route.totalDistance);
        const estimatedMinutes = Math.round(totalDuration * distanceRatio);
        return `≈ ${estimatedMinutes} min`;
      }
      return 'N/A';
    }

    if (stopIndex === -1) return 'N/A';

    const stopsRemaining = stopIndex - busLocation.currentStopIndex;
    
    if (stopsRemaining < 0) return 'Passed';
    
    const avgTimePerStop = 6;
    
    if (stopsRemaining === 0) {
      const timeRemaining = Math.round((1 - busLocation.progress) * avgTimePerStop);
      return timeRemaining > 0 ? `${timeRemaining} min` : 'Now';
    }
    
    const timeToCurrentStop = Math.round((1 - busLocation.progress) * avgTimePerStop);
    const timeForStops = stopsRemaining * avgTimePerStop;
    const totalTime = timeToCurrentStop + timeForStops;
    
    return `${totalTime} min`;
  };

  const getLiveStatus = (route) => {
    const location = busLocations[route.routeNumber];
    if (!location) return null;
    
    const currentStop = route.stops[location.currentStopIndex];
    const nextStop = route.stops[location.nextStopIndex];
    
    return {
      current: currentStop?.name,
      next: nextStop?.name,
      progress: location.progress,
      speed: location.speed,
      occupancy: location.occupancy,
      lastUpdate: location.lastUpdate,
      busNumber: location.busNumber,
      driverName: location.driverName
    };
  };

  const getAmenityIcon = (amenity) => {
    switch(amenity) {
      case 'AC': return <Battery className="h-3 w-3" />;
      case 'WiFi': return <Wifi className="h-3 w-3" />;
      case 'USB Charging': return <Battery className="h-3 w-3" />;
      case 'CCTV': return <Shield className="h-3 w-3" />;
      default: return <Star className="h-3 w-3" />;
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setExpandedRoute(null);
    setSelectedStop(null);
  };

  const handleTrackBus = (route) => {
    // Store tracking data in localStorage
    const liveStatus = getLiveStatus(route);
    localStorage.setItem('trackingData', JSON.stringify({
      route: route,
      liveStatus: liveStatus,
      busLocations: busLocations
    }));
    
    // Navigate to tracking page
    navigate(`/track-bus/${route.routeNumber}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kolhapur City Bus Transport</h1>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="flex items-center gap-1">
            <Timer className="h-4 w-4 animate-pulse" />
            Live
          </Badge>
          <button onClick={() => setTrackingEnabled(!trackingEnabled)} className="text-gray-500 hover:text-blue-600">
            <RefreshCw className={`h-4 w-4 ${trackingEnabled ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by route number (e.g., 101) or stop name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? '...' : 'Search'}
          </Button>
          {hasSearched && (
            <Button type="button" variant="outline" onClick={clearSearch}>
              Clear
            </Button>
          )}
        </div>
      </form>

      {/* Quick Search Buttons */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-600 mb-2">Quick Search</h2>
        <div className="flex gap-2 flex-wrap">
          {['101', '102', '103', '104', '105', 'CBS', 'Rankala', 'Shivaji University'].map((term, idx) => (
            <Badge 
              key={idx} 
              variant="secondary" 
              className="cursor-pointer hover:bg-blue-100 transition-colors px-3 py-1"
              onClick={() => {
                setSearchQuery(term);
                setHasSearched(true);
                const filtered = routes.filter(route => 
                  route.routeNumber === term ||
                  route.name.toLowerCase().includes(term.toLowerCase()) ||
                  route.source.toLowerCase().includes(term.toLowerCase()) ||
                  route.destination.toLowerCase().includes(term.toLowerCase()) ||
                  route.stops.some(stop => stop.name.toLowerCase().includes(term.toLowerCase()))
                );
                setSearchResults(filtered);
                if (filtered.length === 1) {
                  setExpandedRoute(filtered[0].routeNumber);
                }
              }}
            >
              {term}
            </Badge>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <>
          <div className="mb-4">
            {searchResults.length > 0 ? (
              <p className="text-sm text-gray-600">
                Found {searchResults.length} route{searchResults.length > 1 ? 's' : ''} for "{searchQuery}"
              </p>
            ) : (
              <p className="text-sm text-red-600">
                No routes found for "{searchQuery}"
              </p>
            )}
          </div>

          <div className="space-y-4">
            {searchResults.map((route) => {
              const liveStatus = getLiveStatus(route);
              const busLocation = busLocations[route.routeNumber];
              
              return (
                <Card key={route.routeNumber} className="hover:shadow-lg transition-all border-l-4 border-l-blue-500">
                  <Card.Body className="p-4">
                    {/* Live Tracking Banner for routes with active tracking */}
                    {liveStatus && (
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 -mx-4 -mt-4 px-4 py-2 rounded-t-lg mb-4">
                        <div className="flex items-center justify-between text-white">
                          <div className="flex items-center gap-2">
                            <Navigation className="h-4 w-4 animate-pulse" />
                            <span className="text-sm font-semibold">LIVE TRACKING</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs">
                            <span>Speed: {liveStatus.speed}</span>
                            <span>•</span>
                            <span>{liveStatus.occupancy}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Main Route Info */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg text-blue-700">Route {route.routeNumber}</h3>
                          <Badge variant="success" size="sm">
                            <Star className="h-3 w-3 mr-1" />
                            {route.rating}
                          </Badge>
                          <Badge variant="info" size="sm">
                            <Bus className="h-3 w-3 mr-1" />
                            {route.busInfo.busNumber}
                          </Badge>
                          <Badge variant="secondary" size="sm">
                            <Users className="h-3 w-3 mr-1" />
                            {route.activeBuses} Active
                          </Badge>
                        </div>
                        
                        <p className="text-gray-700 mb-2 font-medium">{route.name}</p>
                        
                        {/* Current Location - Only for routes with live tracking */}
                        {liveStatus && (
                          <div className="bg-blue-50 p-3 rounded-lg mb-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-blue-600" />
                                <span className="text-sm">Current:</span>
                                <span className="text-sm font-bold text-blue-700">{liveStatus.current}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <ArrowRight className="h-4 w-4 text-green-600" />
                                <span className="text-sm">Next:</span>
                                <span className="text-sm font-bold text-green-700">{liveStatus.next}</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Progress to next stop</span>
                                <span>{Math.round(liveStatus.progress * 100)}%</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-600 transition-all duration-500"
                                  style={{ width: `${liveStatus.progress * 100}%` }}
                                />
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Last updated: {new Date(liveStatus.lastUpdate).toLocaleTimeString()}
                            </p>
                          </div>
                        )}

                        {/* Route Points */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center bg-green-50 px-2 py-1 rounded">
                            <MapPin className="h-3 w-3 mr-1 text-green-600" />
                            <span className="text-xs">{route.source}</span>
                          </div>
                          <ArrowRight className="h-3 w-3 text-gray-400" />
                          <div className="flex items-center bg-red-50 px-2 py-1 rounded">
                            <MapPin className="h-3 w-3 mr-1 text-red-600" />
                            <span className="text-xs">{route.destination}</span>
                          </div>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded ml-2">
                            {route.totalDistance}
                          </span>
                        </div>

                        {/* Schedule */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {route.firstBus} - {route.lastBus}
                          </div>
                          <div className="flex items-center">
                            <Timer className="h-3 w-3 mr-1" />
                            {route.duration}
                          </div>
                          <div className="flex items-center">
                            <Bus className="h-3 w-3 mr-1" />
                            {route.frequency}
                          </div>
                        </div>
                      </div>

                      {/* Fare & Actions */}
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-blue-600">₹{route.stops[route.stops.length-1].fare}</p>
                        <div className="flex flex-col gap-2 mt-2">
                          <Button 
                            size="sm" 
                            onClick={() => navigate(`/book-ticket/${route.routeNumber}`)}
                          >
                            Book <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                          
                          {/* Track Bus Button - For routes with live tracking */}
                          {liveStatus && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleTrackBus(route)}
                              className="border-green-500 text-green-600 hover:bg-green-50"
                            >
                              <Navigation className="h-4 w-4 mr-1" />
                              Track Bus
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex gap-3 mt-3 pt-3 border-t">
                      {route.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                          {getAmenityIcon(amenity)}
                          {amenity}
                        </div>
                      ))}
                    </div>

                    {/* Stops & ETA */}
                    <div className="mt-3 pt-3 border-t">
                      <button
                        onClick={() => setExpandedRoute(expandedRoute === route.routeNumber ? null : route.routeNumber)}
                        className="flex items-center gap-2 text-sm text-blue-600 mb-2 hover:text-blue-800 w-full justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Timer className="h-4 w-4" />
                          {expandedRoute === route.routeNumber ? 'Hide' : 'View'} Stops & ETA
                        </span>
                        {expandedRoute === route.routeNumber ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </button>

                      {expandedRoute === route.routeNumber && (
                        <div className="space-y-2">
                          <div className="bg-gray-50 rounded-lg p-2">
                            {route.stops.map((stop, idx) => {
                              const isCurrentStop = busLocation?.currentStopIndex === idx;
                              const isNextStop = busLocation?.nextStopIndex === idx;
                              const eta = calculateETA(route, stop.name);
                              
                              return (
                                <div 
                                  key={idx}
                                  className={`flex items-center justify-between p-2 rounded
                                    ${isCurrentStop ? 'bg-green-100' : ''}
                                    ${isNextStop && !isCurrentStop ? 'bg-yellow-50' : ''}
                                    ${idx !== route.stops.length - 1 ? 'border-b border-gray-200' : ''}
                                  `}
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className={`w-2 h-2 rounded-full ${
                                      idx === 0 ? 'bg-green-500' : 
                                      idx === route.stops.length-1 ? 'bg-red-500' : 
                                      isCurrentStop ? 'bg-green-600 animate-pulse' :
                                      isNextStop ? 'bg-yellow-500' : 'bg-blue-300'
                                    }`} />
                                    <span className="text-sm">{stop.name}</span>
                                    <span className="text-xs text-gray-500">({stop.platform})</span>
                                    {isCurrentStop && (
                                      <Badge size="sm" variant="success">HERE</Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs font-medium text-blue-600 w-16 text-right">
                                      {eta}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                                      ₹{stop.fare}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Bus Info */}
                          <div className="bg-gray-50 p-2 rounded-lg text-xs">
                            <div className="grid grid-cols-2 gap-2">
                              <div>Bus: {route.busInfo.busNumber}</div>
                              <div>Driver: {route.busInfo.driverName}</div>
                              <div>Capacity: {route.busInfo.capacity} seats</div>
                              <div>Active Buses: {route.activeBuses}</div>
                              <div>Status: <Badge size="sm" variant="success">On Time</Badge></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>

          {/* No Results */}
          {searchResults.length === 0 && (
            <Card className="p-8 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 mb-2">No routes found for "{searchQuery}"</p>
              <Button variant="outline" onClick={clearSearch}>
                Clear Search
              </Button>
            </Card>
          )}
        </>
      )}

      {/* Welcome Message */}
      {!hasSearched && (
        <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-white">
          <Bus className="h-16 w-16 mx-auto text-blue-500 mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Kolhapur City Bus Transport</h2>
          <p className="text-gray-600 mb-6">Search for routes to see live tracking and ETA</p>
          
          <div className="flex justify-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-green-500" />
              <span>Live tracking</span>
            </div>
            <div className="flex items-center gap-1">
              <Timer className="h-4 w-4 text-blue-500" />
              <span>ETA predictions</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-purple-500" />
              <span>Real-time</span>
            </div>
          </div>

        </Card>
      )}
    </div>
  );
};

export default SearchRoute;