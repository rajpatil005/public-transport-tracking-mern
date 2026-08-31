// client/src/components/passenger/BusSchedule.jsx
import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Bus, 
  ChevronDown, 
  ChevronUp,
  Search,
  MapPin,
  Users,
  Timer,
  Star,
  RefreshCw,
  Bookmark,
  ArrowRight
} from 'lucide-react';

// Route data
const ROUTES_DATA = [
  {
    id: "route-101",
    routeNumber: "101",
    name: "Central Bus Stand → Mahalaxmi Temple → Rankala Lake",
    source: "Central Bus Stand",
    destination: "Rankala Lake",
    firstBus: '06:30',
    lastBus: '22:00',
    frequency: 15,
    peakFrequency: 10,
    peakHours: ['07:00-09:00', '17:00-19:00'],
    totalBuses: 12,
    avgPassengers: 850,
    rating: 4.5,
    status: 'active',
    stops: [
      { id: 'stop-1', name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431, type: 'major' },
      { id: 'stop-2', name: "Bindu Chowk", latitude: 16.6975, longitude: 74.2382, type: 'minor' },
      { id: 'stop-3', name: "Mahalaxmi Temple", latitude: 16.6913, longitude: 74.2245, type: 'major' },
      { id: 'stop-4', name: "Rankala Stand", latitude: 16.6895, longitude: 74.2198, type: 'minor' },
      { id: 'stop-5', name: "Rankala Lake", latitude: 16.6878, longitude: 74.2167, type: 'major' },
    ],
    schedule: [
      { time: '06:30', status: 'on-time' },
      { time: '07:00', status: 'on-time' },
      { time: '07:30', status: 'delayed' },
      { time: '08:00', status: 'on-time' },
      { time: '08:30', status: 'on-time' },
    ]
  },
  {
    id: "route-102",
    routeNumber: "102",
    name: "Central Bus Stand → New Palace → DYP City Mall",
    source: "Central Bus Stand",
    destination: "DYP City Mall",
    firstBus: '06:00',
    lastBus: '21:30',
    frequency: 20,
    peakFrequency: 12,
    peakHours: ['08:00-10:00', '16:00-18:00'],
    totalBuses: 8,
    avgPassengers: 620,
    rating: 4.2,
    status: 'active',
    stops: [
      { id: 'stop-6', name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431, type: 'major' },
      { id: 'stop-7', name: "Dasara Chowk", latitude: 16.7045, longitude: 74.2402, type: 'minor' },
      { id: 'stop-8', name: "New Palace", latitude: 16.7031, longitude: 74.2586, type: 'major' },
      { id: 'stop-9', name: "Rajarampuri 3rd Lane", latitude: 16.7116, longitude: 74.2345, type: 'minor' },
      { id: 'stop-10', name: "DYP City Mall", latitude: 16.7125, longitude: 74.2253, type: 'major' },
    ],
    schedule: [
      { time: '06:00', status: 'on-time' },
      { time: '06:30', status: 'on-time' },
      { time: '07:00', status: 'on-time' },
      { time: '07:30', status: 'cancelled' },
      { time: '08:00', status: 'on-time' },
    ]
  },
  {
    id: "route-103",
    routeNumber: "103",
    name: "Rankala Lake → CPR Hospital → Khasbag Maidan",
    source: "Rankala Lake",
    destination: "Khasbag Maidan",
    firstBus: '05:45',
    lastBus: '22:30',
    frequency: 25,
    peakFrequency: 15,
    peakHours: ['06:30-08:30', '17:30-19:30'],
    totalBuses: 6,
    avgPassengers: 480,
    rating: 4.0,
    status: 'active',
    stops: [
      { id: 'stop-11', name: "Rankala Lake", latitude: 16.6878, longitude: 74.2167, type: 'major' },
      { id: 'stop-12', name: "Mahalaxmi Temple", latitude: 16.6913, longitude: 74.2245, type: 'major' },
      { id: 'stop-13', name: "CPR Hospital", latitude: 16.7083, longitude: 74.2356, type: 'major' },
      { id: 'stop-14', name: "Shahupuri", latitude: 16.7069, longitude: 74.2439, type: 'minor' },
      { id: 'stop-15', name: "Khasbag Maidan", latitude: 16.6947, longitude: 74.2408, type: 'major' },
    ],
    schedule: [
      { time: '05:45', status: 'on-time' },
      { time: '06:15', status: 'on-time' },
      { time: '06:45', status: 'on-time' },
      { time: '07:15', status: 'on-time' },
      { time: '07:45', status: 'on-time' },
    ]
  },
  {
    id: "route-104",
    routeNumber: "104",
    name: "Shivaji University → Central Bus Stand",
    source: "Shivaji University",
    destination: "Central Bus Stand",
    firstBus: '06:15',
    lastBus: '21:45',
    frequency: 22,
    peakFrequency: 14,
    peakHours: ['07:00-09:00', '16:00-18:00'],
    totalBuses: 7,
    avgPassengers: 550,
    rating: 4.3,
    status: 'active',
    stops: [
      { id: 'stop-16', name: "Shivaji University", latitude: 16.7222, longitude: 74.2481, type: 'major' },
      { id: 'stop-17', name: "Kasaba Bawada", latitude: 16.7274, longitude: 74.2214, type: 'minor' },
      { id: 'stop-18', name: "Tarabai Park", latitude: 16.7052, longitude: 74.2401, type: 'minor' },
      { id: 'stop-19', name: "Bindu Chowk", latitude: 16.6975, longitude: 74.2382, type: 'minor' },
      { id: 'stop-20', name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431, type: 'major' },
    ],
    schedule: [
      { time: '06:15', status: 'on-time' },
      { time: '06:45', status: 'on-time' },
      { time: '07:15', status: 'on-time' },
      { time: '07:45', status: 'delayed' },
      { time: '08:15', status: 'on-time' },
    ]
  },
  {
    id: "route-105",
    routeNumber: "105",
    name: "Central Bus Stand → DYP City Mall → Rankala Lake",
    source: "Central Bus Stand",
    destination: "Rankala Lake",
    firstBus: '06:45',
    lastBus: '22:15',
    frequency: 18,
    peakFrequency: 12,
    peakHours: ['07:30-09:30', '17:00-19:00'],
    totalBuses: 9,
    avgPassengers: 720,
    rating: 4.7,
    status: 'active',
    stops: [
      { id: 'stop-21', name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431, type: 'major' },
      { id: 'stop-22', name: "Collector Office Kolhapur", latitude: 16.7074, longitude: 74.239, type: 'minor' },
      { id: 'stop-23', name: "Shivaji University", latitude: 16.7222, longitude: 74.2481, type: 'major' },
      { id: 'stop-24', name: "New Palace Road", latitude: 16.709, longitude: 74.2255, type: 'minor' },
      { id: 'stop-25', name: "Rankala Lake", latitude: 16.6878, longitude: 74.2167, type: 'major' },
    ],
    schedule: [
      { time: '06:45', status: 'on-time' },
      { time: '07:15', status: 'on-time' },
      { time: '07:45', status: 'on-time' },
      { time: '08:15', status: 'on-time' },
      { time: '08:45', status: 'on-time' },
    ]
  }
];

const BusSchedule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRoute, setExpandedRoute] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  // Format time
  const formatTime = (timeStr) => {
    try {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      const period = date.getHours() >= 12 ? 'PM' : 'AM';
      const hours12 = date.getHours() % 12 || 12;
      return `${hours12}:${String(date.getMinutes()).padStart(2, '0')} ${period}`;
    } catch {
      return timeStr;
    }
  };

  // Filter routes
  const filteredRoutes = useMemo(() => {
    return ROUTES_DATA.filter(route => {
      const searchMatch = !searchTerm || 
        route.routeNumber.includes(searchTerm) || 
        route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.destination.toLowerCase().includes(searchTerm.toLowerCase());
      return searchMatch;
    });
  }, [searchTerm]);

  // Toggle bookmark
  const toggleBookmark = (routeId) => {
    setBookmarks(prev => 
      prev.includes(routeId) 
        ? prev.filter(id => id !== routeId)
        : [...prev, routeId]
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bus className="h-6 w-6 text-blue-600" />
          Bus Schedules
        </h1>
        <p className="text-gray-600 text-sm mt-1">View all Kolhapur city bus routes and schedules</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by route number, name, source, or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredRoutes.length} of {ROUTES_DATA.length} routes
      </div>

      {/* Routes List */}
      <div className="space-y-4">
        {filteredRoutes.map((route) => {
          const isExpanded = expandedRoute === route.id;
          const isBookmarked = bookmarks.includes(route.id);

          return (
            <div key={route.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Route Header - Click to expand */}
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedRoute(isExpanded ? null : route.id)}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-bold text-lg text-blue-600">Route {route.routeNumber}</span>
                      <span className="text-sm text-gray-700">{route.name}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{route.rating}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        route.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {route.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{route.source}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{route.destination}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatTime(route.firstBus)} - {formatTime(route.lastBus)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Timer className="h-3.5 w-3.5" />
                        <span>Every {route.frequency} mins</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{route.avgPassengers}/day</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(route.id);
                      }}
                      className={`p-1.5 rounded transition-colors ${
                        isBookmarked ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                      }`}
                    >
                      <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Total Buses</p>
                      <p className="text-lg font-bold text-blue-600">{route.totalBuses}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Peak Frequency</p>
                      <p className="text-lg font-bold text-green-600">Every {route.peakFrequency} mins</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Peak Hours</p>
                      <p className="text-sm font-medium">{route.peakHours.join(', ')}</p>
                    </div>
                  </div>

                  {/* Stops */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Route Stops</h4>
                    <div className="space-y-1.5">
                      {route.stops.map((stop, index) => (
                        <div key={stop.id} className="flex items-center p-2 bg-white rounded-lg">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3 flex-shrink-0 ${
                            index === 0 ? 'bg-green-500 text-white' : 
                            index === route.stops.length - 1 ? 'bg-red-500 text-white' : 
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="text-sm">{stop.name}</span>
                          {stop.type === 'major' && (
                            <span className="ml-2 text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                              Major
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Schedule */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Today's Schedule</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {route.schedule.map((item, index) => (
                        <div key={index} className={`p-2 rounded-lg text-center ${
                          item.status === 'on-time' ? 'bg-green-50 text-green-700' :
                          item.status === 'delayed' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          <p className="text-sm font-medium">{formatTime(item.time)}</p>
                          <p className="text-xs capitalize">{item.status.replace('-', ' ')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredRoutes.length === 0 && (
          <div className="text-center py-12">
            <Bus className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-600">No routes found</h3>
            <p className="text-gray-400">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusSchedule;