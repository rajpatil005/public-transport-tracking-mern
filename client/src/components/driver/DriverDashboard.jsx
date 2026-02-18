import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bus, 
  Clock, 
  MapPin, 
  Users, 
  Navigation,
  AlertCircle,
  CheckCircle,
  Calendar,
  TrendingUp
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

const DriverDashboard = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();
  
  const [currentTrip, setCurrentTrip] = useState({
    busNumber: 'MH09-1234',
    route: 'CBS → Rankala',
    nextStop: 'Shivaji Chowk',
    eta: '5 min',
    occupancy: 65,
    status: 'on-time'
  });

  const [upcomingTrips, setUpcomingTrips] = useState([
    { id: 1, route: 'Rankala → CBS', time: '2:30 PM', duration: '35 min' },
    { id: 2, route: 'CBS → Kagal', time: '4:15 PM', duration: '45 min' },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Traffic congestion on Mahadwar Road', type: 'warning' },
    { id: 2, message: 'Passenger count: 42 on current trip', type: 'info' },
  ]);

  useEffect(() => {
    if (socket) {
      socket.emit('driver-connected', user?._id);
      
      socket.on('route-update', (data) => {
        setCurrentTrip(prev => ({ ...prev, ...data }));
      });

      return () => {
        socket.off('route-update');
      };
    }
  }, [socket, user]);

  const updateLocation = () => {
    navigate('/driver/update-location');
  };

  const reportIncident = () => {
    // Handle incident reporting
    alert('Incident reporting feature coming soon');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      {/* Connection Status */}
      <div className="mb-4 flex items-center">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'} mr-2`} />
        <span className="text-sm text-gray-600">
          {isConnected ? 'Connected to live server' : 'Offline mode'}
        </span>
      </div>

      {/* Current Trip Card */}
      <Card className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <Card.Body className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100 text-sm">Current Trip</p>
              <h2 className="text-2xl font-bold">{currentTrip.route}</h2>
              <p className="text-blue-100 mt-1">Bus: {currentTrip.busNumber}</p>
            </div>
            <Badge variant={currentTrip.status === 'on-time' ? 'success' : 'warning'}>
              {currentTrip.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div>
              <p className="text-blue-100 text-sm">Next Stop</p>
              <p className="text-lg font-semibold">{currentTrip.nextStop}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">ETA</p>
              <p className="text-lg font-semibold">{currentTrip.eta}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Occupancy</p>
              <p className="text-lg font-semibold">{currentTrip.occupancy}%</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Speed</p>
              <p className="text-lg font-semibold">35 km/h</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button 
              variant="primary" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={updateLocation}
            >
              <Navigation className="h-4 w-4 mr-2" />
              Update Location
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/20"
              onClick={reportIncident}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Report Incident
            </Button>
          </div>
        </Card.Body>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Trips */}
        <Card className="lg:col-span-2">
          <Card.Header>
            <h3 className="font-semibold flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Today's Schedule
            </h3>
          </Card.Header>
          <Card.Body className="p-4">
            <div className="space-y-3">
              {upcomingTrips.map((trip) => (
                <div key={trip.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium">{trip.route}</p>
                    <p className="text-sm text-gray-500">{trip.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{trip.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Notifications */}
        <Card>
          <Card.Header>
            <h3 className="font-semibold flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
              Notifications
            </h3>
          </Card.Header>
          <Card.Body className="p-4">
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div key={notif.id} className={`p-3 rounded-lg ${
                  notif.type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50'
                }`}>
                  <p className="text-sm">{notif.message}</p>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <Card>
          <Card.Body className="p-4 text-center">
            <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">6.5</p>
            <p className="text-sm text-gray-600">Hours Driven</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="p-4 text-center">
            <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">245</p>
            <p className="text-sm text-gray-600">Passengers</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="p-4 text-center">
            <MapPin className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-gray-600">Stops Covered</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">98%</p>
            <p className="text-sm text-gray-600">On-Time</p>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default DriverDashboard;