import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, MapPin, Clock, Send, ArrowLeft } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';


const UpdateLocation = () => {
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  
  const [location, setLocation] = useState({
    latitude: '',
    longitude: '',
    speed: '0',
    nextStop: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const stops = [
    'Central Bus Stand',
    'Shivaji Chowk',
    'Mahadwar Road',
    'Mahalaxmi Temple',
    'Rankala Lake',
    'Shahupuri',
    'Ruikar Colony',
    'Jawahar Nagar'
  ];

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            ...location,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
            speed: position.coords.speed ? position.coords.speed.toFixed(1) : '0'
          });
          setLoading(false);
        },
        (error) => {
          alert('Error getting location: ' + error.message);
          setLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser');
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!location.latitude || !location.longitude) {
      alert('Please get your location first');
      return;
    }

    if (!location.nextStop) {
      alert('Please select next stop');
      return;
    }

    // Send location update via socket
    if (socket && isConnected) {
      socket.emit('driver-location-update', {
        busId: 'MH09-1234', // This should come from user context
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
        speed: parseFloat(location.speed),
        nextStop: location.nextStop
      });

      setSuccess('Location updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      alert('Not connected to server');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </button>

      <Card>
        <Card.Header>
          <h2 className="text-2xl font-bold flex items-center">
            <Navigation className="h-6 w-6 mr-2 text-blue-600" />
            Update Live Location
          </h2>
          <p className="text-gray-600 mt-2">Share your current location with passengers</p>
        </Card.Header>

        <Card.Body className="p-6">
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          <div className="mb-6">
            <Button 
              onClick={getCurrentLocation} 
              loading={loading}
              fullWidth
            >
              <MapPin className="h-4 w-4 mr-2" />
              Get Current Location
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <Input
                  type="text"
                  value={location.latitude}
                  readOnly
                  placeholder="Click 'Get Current Location'"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <Input
                  type="text"
                  value={location.longitude}
                  readOnly
                  placeholder="Click 'Get Current Location'"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speed (km/h)
                </label>
                <Input
                  type="text"
                  value={location.speed}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Stop
                </label>
                <select
                  value={location.nextStop}
                  onChange={(e) => setLocation({...location, nextStop: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select next stop</option>
                  {stops.map((stop) => (
                    <option key={stop} value={stop}>{stop}</option>
                  ))}
                </select>
              </div>

              <Button type="submit" variant="primary" fullWidth>
                <Send className="h-4 w-4 mr-2" />
                Update Location
              </Button>
            </div>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} mr-2`} />
              {isConnected ? 'Connected to server' : 'Disconnected'}
            </div>
            <Clock className="h-4 w-4" />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UpdateLocation;