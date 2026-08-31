import React, { useState, useEffect } from 'react';
import { 
  Map, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  MapPin, 
  Clock,
  TrendingUp,
  Navigation,
  Eye,
  RefreshCw,
  X
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import { routeService } from '../../services/api';
import { handleApiError } from '../../services/api';

const ManageRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [formData, setFormData] = useState({
    routeNumber: '',
    name: '',
    source: '',
    destination: '',
    stops: [],
    estimatedTime: 25,
    tripsPerDay: 8,
    status: 'active'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchRoutes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      
      const response = await routeService.getAll(params);
      if (response.data.success) {
        setRoutes(response.data.data);
      }
    } catch (err) {
      const errorResponse = handleApiError(err);
      setError(errorResponse.message);
      console.error('Fetch routes error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [searchTerm]);

  const handleDelete = async (routeNumber) => {
    if (window.confirm(`Are you sure you want to delete route ${routeNumber}?`)) {
      try {
        const response = await routeService.delete(routeNumber);
        if (response.data.success) {
          setRoutes(routes.filter(route => route.routeNumber !== routeNumber));
        }
      } catch (err) {
        const errorResponse = handleApiError(err);
        alert(errorResponse.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let response;
      if (editingRoute) {
        response = await routeService.update(editingRoute.routeNumber, formData);
      } else {
        response = await routeService.create(formData);
      }
      
      if (response.data.success) {
        setShowForm(false);
        setEditingRoute(null);
        setFormData({
          routeNumber: '',
          name: '',
          source: '',
          destination: '',
          stops: [],
          estimatedTime: 25,
          tripsPerDay: 8,
          status: 'active'
        });
        fetchRoutes();
      }
    } catch (err) {
      const errorResponse = handleApiError(err);
      alert(errorResponse.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      routeNumber: route.routeNumber,
      name: route.name,
      source: route.source,
      destination: route.destination,
      stops: route.stops || [],
      estimatedTime: route.estimatedTime || 25,
      tripsPerDay: route.tripsPerDay || 8,
      status: route.status || 'active'
    });
    setShowForm(true);
  };

  const handleStatusUpdate = async (routeNumber, newStatus) => {
    try {
      const response = await routeService.updateStatus(routeNumber, newStatus);
      if (response.data.success) {
        fetchRoutes();
      }
    } catch (err) {
      const errorResponse = handleApiError(err);
      alert(errorResponse.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading routes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Map className="h-8 w-8 mr-3 text-blue-600" />
            Manage Routes
          </h1>
          <p className="text-gray-600 mt-1">View and manage all bus routes across Kolhapur city</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchRoutes} className="mt-4 sm:mt-0">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={() => { setEditingRoute(null); setShowForm(true); }}
            className="mt-4 sm:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Route
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Search and Filter */}
      <Card className="mb-6">
        <Card.Body className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search routes by number, name, source or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
                className="w-full"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" className="flex items-center">
                <Navigation className="h-4 w-4 mr-2" />
                Live View
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {routes.map((route) => (
          <Card key={route.routeNumber} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="relative">
              {/* Route Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="primary" className="bg-white/20 text-white">
                        Route {route.routeNumber}
                      </Badge>
                      <Badge variant={route.status === 'active' ? 'success' : 'secondary'} className={route.status === 'active' ? 'bg-green-400 text-green-900' : ''}>
                        {route.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold mt-2">{route.name}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      onClick={() => setSelectedRoute(route)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      onClick={() => handleEdit(route)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-1.5 bg-white/20 rounded-lg hover:bg-red-500/50 transition-colors"
                      onClick={() => handleDelete(route.routeNumber)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Route Details */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">SOURCE</p>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 text-green-500 mr-1" />
                      <p className="text-sm font-medium">{route.source}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">DESTINATION</p>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 text-red-500 mr-1" />
                      <p className="text-sm font-medium">{route.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 font-medium mb-2">STOPS</p>
                  <div className="flex flex-wrap gap-2">
                    {(route.stops || []).slice(0, 5).map((stop, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {stop.name}
                      </Badge>
                    ))}
                    {(route.stops || []).length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{(route.stops || []).length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">Est. Time: {route.estimatedTime || 25} min</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">{route.tripsPerDay || 8} trips/day</span>
                    </div>
                  </div>
                  {route.status === 'active' ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                      onClick={() => handleStatusUpdate(route.routeNumber, 'inactive')}
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => handleStatusUpdate(route.routeNumber, 'active')}
                    >
                      Activate
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {routes.length === 0 && (
        <div className="text-center py-12">
          <Map className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No routes found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your search or add a new route</p>
        </div>
      )}

      {/* Route Detail Modal */}
      {selectedRoute && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Route {selectedRoute.routeNumber}</h2>
                  <p className="text-gray-600">{selectedRoute.name}</p>
                </div>
                <button 
                  onClick={() => setSelectedRoute(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Source</p>
                    <p className="font-medium">{selectedRoute.source}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Destination</p>
                    <p className="font-medium">{selectedRoute.destination}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">All Stops</h4>
                  <div className="space-y-2">
                    {(selectedRoute.stops || []).map((stop, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-3">
                          {index + 1}
                        </div>
                        <span>{stop.name}</span>
                        <span className="ml-auto text-xs text-gray-400">
                          {stop.latitude}, {stop.longitude}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Map View</h4>
                  <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Map integration coming soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Route Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {editingRoute ? 'Edit Route' : 'Add New Route'}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {editingRoute ? 'Update route details' : 'Enter route details to add'}
                  </p>
                </div>
                <button 
                  onClick={() => { setShowForm(false); setEditingRoute(null); }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Route Number *
                  </label>
                  <Input
                    value={formData.routeNumber}
                    onChange={(e) => setFormData({...formData, routeNumber: e.target.value})}
                    placeholder="Enter route number"
                    required
                    disabled={!!editingRoute}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Route Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter route name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source *
                  </label>
                  <Input
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    placeholder="Enter source location"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination *
                  </label>
                  <Input
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                    placeholder="Enter destination location"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Time (minutes)
                  </label>
                  <Input
                    type="number"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData({...formData, estimatedTime: parseInt(e.target.value)})}
                    placeholder="Enter estimated time"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trips Per Day
                  </label>
                  <Input
                    type="number"
                    value={formData.tripsPerDay}
                    onChange={(e) => setFormData({...formData, tripsPerDay: parseInt(e.target.value)})}
                    placeholder="Enter number of trips per day"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    type="button" 
                    variant="outline" 
                    fullWidth
                    onClick={() => { setShowForm(false); setEditingRoute(null); }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" fullWidth disabled={submitting}>
                    {submitting ? 'Saving...' : (editingRoute ? 'Update Route' : 'Add Route')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRoutes;