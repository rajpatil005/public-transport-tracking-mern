import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bus,
  MapPin,
  Clock,
  Search,
  TrendingUp,
  Star,
  Navigation,
  Calendar,
  Users,
  Info,
  Ticket,
  Shield,
  Award,
  ChevronRight
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [nearbyBuses, setNearbyBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const featuredDestinations = [
    {
      id: 1,
      name: "Mahalaxmi Temple",
      image: "https://www.holidify.com/images/cmsuploads/compressed/800px-Mahalaxmi_Temple_Kolhapur_20200121170459.jpg",
      route: "101",
      stops: "5 stops",
      fare: "₹15"
    }
    ,
    {
      id: 2,
      name: "Rankala Lake",
      image: "https://hblimg.mmtcdn.com/content/hubble/img/kohlapur/mmt/activities/m_Rankala%20Lake-1_l_424_640.jpg?im=Resize=(412,347.56)",
      route: "101, 104",
      stops: "4 stops",
      fare: "₹12"
    }
    ,
    {
      id: 3,
      name: "New Palace",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe2vopepzNjbQ8Cp487vnPwdxEBkH-ilfvWQ&s",
      route: "105",
      stops: "3 stops",
      fare: "₹10"
    },
    {
      id: 4,
      name: "Shivaji University",
      image: "https://idealcareer.in/wp-content/uploads/2020/12/56884_app-image-shivaji1-2.jpg.webp",
      route: "103",
      stops: "6 stops",
      fare: "₹18"
    }

  ];

  // Why choose us features
  const features = [
    { icon: Shield, title: "Safe & Secure", description: "GPS tracked buses with emergency response" },
    { icon: Clock, title: "Punctual Service", description: "98% on-time performance guaranteed" },
    { icon: Award, title: "Modern Fleet", description: "Well-maintained AC and standard buses" },
    { icon: Users, title: "Professional Staff", description: "Trained drivers and support team" }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const routesRes = await api.get('/routes');
      setPopularRoutes(routesRes.data.data?.slice(0, 4) || []);

      // Mock nearby buses data
      setNearbyBuses([
        { id: 1, busNumber: "MH09-1234", route: "CBS → Rankala", eta: 5, distance: 1.2, occupancy: 65 },
        { id: 2, busNumber: "MH09-5678", route: "Shahupuri → JN", eta: 8, distance: 1.8, occupancy: 80 },
        { id: 3, busNumber: "MH09-9101", route: "Tarabai Park → Kagal", eta: 12, distance: 2.5, occupancy: 45 }
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const quickActions = [
    { icon: MapPin, label: 'Nearby Stops', color: 'bg-blue-500', href: '/nearby-stops', count: '8 stops' },
    { icon: Clock, label: 'Schedule', color: 'bg-green-500', href: '/schedule', count: '24/7' },
    { icon: Bus, label: 'Track Bus', color: 'bg-purple-500', href: '/track-bus/1', count: 'Live' },
    { icon: Calendar, label: 'Bookings', color: 'bg-orange-500', href: '/my-bookings', count: 'Manage' },
    { icon: Info, label: 'Kolhapur Info', color: 'bg-red-500', href: '/kolhapur-info', count: 'Guide' },
    { icon: Ticket, label: 'Book Ticket', color: 'bg-indigo-500', href: '/search', count: 'Now' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative h-[500px] bg-gradient-to-r from-blue-900 to-indigo-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>

        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-3xl">
            <div className="flex items-center space-x-2 mb-4">
              <Bus className="h-8 w-8 text-yellow-400" />
              <span className="text-sm font-semibold tracking-wider text-yellow-400">KOLHAPUR CITY TRANSPORT</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Welcome Back, <span className="text-yellow-400">{user?.name?.split(' ')[0] || 'Passenger'}!</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Smart, Safe & Reliable Public Transport for Kolhapur City
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="flex gap-2 bg-white rounded-lg p-1 shadow-2xl">
                <input
                  type="text"
                  placeholder="Where would you like to go today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 text-gray-900 rounded-lg focus:outline-none"
                />
                <Button type="submit" variant="primary" className="px-6">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </form>

            {/* Stats */}
            <div className="flex space-x-6 mt-8">
              <div>
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-gray-300">Buses</div>
              </div>
              <div>
                <div className="text-2xl font-bold">25+</div>
                <div className="text-sm text-gray-300">Routes</div>
              </div>
              <div>
                <div className="text-2xl font-bold">100+</div>
                <div className="text-sm text-gray-300">Stops</div>
              </div>
              <div>
                <div className="text-2xl font-bold">10k+</div>
                <div className="text-sm text-gray-300">Daily Riders</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              onClick={() => navigate(action.href)}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Card.Body className="p-4 text-center">
                <div className={`inline-flex p-3 rounded-full ${action.color} text-white mb-2`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-medium">{action.label}</h3>
                <p className="text-xs text-gray-500 mt-1">{action.count}</p>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Featured Destinations */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular Destinations</h2>
            <Button variant="ghost" onClick={() => navigate('/search')}>
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((dest) => (
              <Card
                key={dest.id}
                className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => navigate(`/search?q=${dest.name}`)}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <Card.Body className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{dest.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Bus className="h-3 w-3 mr-1" />
                    <span>Route {dest.route}</span>
                    <span className="mx-2">•</span>
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{dest.stops}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant="success">{dest.fare}</Badge>
                    <Button size="sm" variant="ghost">Book Now</Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Popular Routes */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Popular Routes
                </h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  {popularRoutes.map((route) => (
                    <div
                      key={route._id}
                      onClick={() => navigate(`/book-ticket/${route._id}`)}
                      className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-all hover:shadow-md"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">Route {route.routeNumber}</h3>
                          <p className="text-sm text-gray-600">{route.name}</p>
                        </div>
                        <span className="text-lg font-bold text-blue-600">₹{route.fare}</span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {route.source} → {route.destination}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {route.duration} mins • {route.distance} km
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Right Column */}
          <div>
            {/* Nearby Buses */}
            <Card className="mb-6">
              <Card.Header>
                <h2 className="text-xl font-semibold flex items-center">
                  <Navigation className="h-5 w-5 mr-2 text-green-600" />
                  Nearby Buses
                </h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-3">
                  {nearbyBuses.map((bus) => (
                    <div
                      key={bus.id}
                      onClick={() => navigate(`/track-bus/${bus.id}`)}
                      className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Bus {bus.busNumber}</p>
                          <p className="text-sm text-gray-600">{bus.route}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">{bus.eta} min</p>
                          <p className="text-xs text-gray-500">{bus.distance} km away</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center">
                          <span className="text-xs text-gray-600 mr-2">Occupancy:</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full">
                            <div
                              className={`h-2 rounded-full ${bus.occupancy > 80 ? 'bg-red-500' :
                                bus.occupancy > 50 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                              style={{ width: `${bus.occupancy}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 ml-2">{bus.occupancy}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Today's Schedule */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-purple-600" />
                  Today's Schedule
                </h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">First Bus</span>
                    <span className="text-sm text-gray-600">5:45 AM</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Last Bus</span>
                    <span className="text-sm text-gray-600">10:30 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Peak Frequency</span>
                    <span className="text-sm text-gray-600">10-12 mins</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Off-Peak</span>
                    <span className="text-sm text-gray-600">20-25 mins</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Why Choose Kolhapur Bus Transport?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-xl transition-all">
                <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <Card.Body className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Travel?</h2>
            <p className="text-xl text-blue-100 mb-6">
              Book your tickets now and enjoy a comfortable journey
            </p>

            <div className="flex justify-center space-x-4">

              {/* BOOK NOW – SAME AS VIEW SCHEDULE */}
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/20 font-semibold"
                onClick={() => navigate('/search')}
              >
                <Ticket className="h-5 w-5 mr-2" />
                Book Now
              </Button>

              {/* VIEW SCHEDULE */}
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/20 font-semibold"
                onClick={() => navigate('/schedule')}
              >
                <Clock className="h-5 w-5 mr-2" />
                View Schedule
              </Button>

            </div>
          </Card.Body>
        </Card>

      </div>
    </div>
  );
};

export default HomePage;