import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Users, 
  MapPin,
  Wifi,
  Coffee,
  Tv,
  Battery,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  X
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import { busService } from '../../services/api';
import { handleApiError } from '../../services/api';

const ManageBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [formData, setFormData] = useState({
    busNumber: '',
    capacity: '',
    routeNumber: '',
    driverName: '',
    status: 'ACTIVE'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchBuses = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (searchTerm) params.search = searchTerm;
      
      const response = await busService.getAll(params);
      if (response.data.success) {
        setBuses(response.data.data);
      }
    } catch (err) {
      const errorResponse = handleApiError(err);
      setError(errorResponse.message);
      console.error('Fetch buses error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, [filterStatus, searchTerm]);

  const handleDelete = async (busNumber) => {
    if (window.confirm(`Are you sure you want to delete bus ${busNumber}?`)) {
      try {
        const response = await busService.delete(busNumber);
        if (response.data.success) {
          setBuses(buses.filter(bus => bus.busNumber !== busNumber));
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
      const data = {
        ...formData,
        capacity: parseInt(formData.capacity)
      };
      
      let response;
      if (editingBus) {
        response = await busService.update(editingBus.busNumber, data);
      } else {
        response = await busService.create(data);
      }
      
      if (response.data.success) {
        setShowForm(false);
        setEditingBus(null);
        setFormData({
          busNumber: '',
          capacity: '',
          routeNumber: '',
          driverName: '',
          status: 'ACTIVE'
        });
        fetchBuses();
      }
    } catch (err) {
      const errorResponse = handleApiError(err);
      alert(errorResponse.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (bus) => {
    setEditingBus(bus);
    setFormData({
      busNumber: bus.busNumber,
      capacity: bus.capacity,
      routeNumber: bus.routeNumber,
      driverName: bus.driverName || '',
      status: bus.status
    });
    setShowForm(true);
  };

  const handleStatusUpdate = async (busNumber, newStatus) => {
    try {
      const response = await busService.updateStatus(busNumber, newStatus);
      if (response.data.success) {
        fetchBuses();
      }
    } catch (err) {
      const errorResponse = handleApiError(err);
      alert(errorResponse.message);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'ACTIVE': 'success',
      'INACTIVE': 'warning',
      'MAINTENANCE': 'danger',
      'OUT_OF_SERVICE': 'secondary'
    };
    return variants[status] || 'secondary';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'ACTIVE': return <CheckCircle className="h-4 w-4" />;
      case 'MAINTENANCE': return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const filteredBuses = buses.filter(bus => {
    const matchesSearch = !searchTerm || 
      bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bus.driverName && bus.driverName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      bus.routeNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || bus.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading buses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Bus className="h-8 w-8 mr-3 text-blue-600" />
            Manage Buses
          </h1>
          <p className="text-gray-600 mt-1">Manage your fleet of buses across Kolhapur city</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={fetchBuses}
            className="mt-4 sm:mt-0"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={() => { setEditingBus(null); setShowForm(true); }}
            className="mt-4 sm:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Bus
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

      {/* Filters */}
      <Card className="mb-6">
        <Card.Body className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search buses by number, driver or route..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
                className="w-full"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Buses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBuses.map((bus) => (
          <Card key={bus.busNumber} className="hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="relative">
              {/* Status Bar */}
              <div className={`h-1 ${
                bus.status === 'ACTIVE' ? 'bg-green-500' :
                bus.status === 'MAINTENANCE' ? 'bg-yellow-500' :
                bus.status === 'INACTIVE' ? 'bg-gray-400' :
                'bg-red-500'
              }`} />
              
              <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-gray-900">{bus.busNumber}</h3>
                      <Badge variant={getStatusBadge(bus.status)}>
                        {bus.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Route {bus.routeNumber}</p>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => handleEdit(bus)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={() => handleDelete(bus.busNumber)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Capacity:</span>
                    <span className="ml-1 font-medium">{bus.capacity} seats</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Driver:</span>
                    <span className="ml-1 font-medium">{bus.driverName || 'Not Assigned'}</span>
                  </div>

                  {/* Features */}
                  {bus.status === 'ACTIVE' && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="secondary" className="text-xs flex items-center">
                        <Wifi className="h-3 w-3 mr-1" /> WiFi
                      </Badge>
                      <Badge variant="secondary" className="text-xs flex items-center">
                        <Coffee className="h-3 w-3 mr-1" /> AC
                      </Badge>
                      <Badge variant="secondary" className="text-xs flex items-center">
                        <Tv className="h-3 w-3 mr-1" /> Entertainment
                      </Badge>
                      <Badge variant="secondary" className="text-xs flex items-center">
                        <Battery className="h-3 w-3 mr-1" /> USB Charging
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-1 ${bus.status === 'ACTIVE' ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                      {bus.status === 'ACTIVE' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {bus.status === 'ACTIVE' ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                        onClick={() => handleStatusUpdate(bus.busNumber, 'MAINTENANCE')}
                      >
                        Maintenance
                      </Button>
                    ) : bus.status === 'MAINTENANCE' ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => handleStatusUpdate(bus.busNumber, 'ACTIVE')}
                      >
                        Activate
                      </Button>
                    ) : null}
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-xs"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredBuses.length === 0 && (
        <div className="text-center py-12">
          <Bus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No buses found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your search or add a new bus</p>
        </div>
      )}

      {/* Add/Edit Bus Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {editingBus ? 'Edit Bus' : 'Add New Bus'}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {editingBus ? 'Update bus details' : 'Enter bus details to add to fleet'}
                  </p>
                </div>
                <button 
                  onClick={() => { setShowForm(false); setEditingBus(null); }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bus Number *
                  </label>
                  <Input
                    value={formData.busNumber}
                    onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
                    placeholder="MH09-XXXX"
                    required
                    disabled={!!editingBus}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity *
                  </label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    placeholder="Enter seat capacity"
                    required
                    min="20"
                    max="80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Route Number *
                  </label>
                  <Input
                    value={formData.routeNumber}
                    onChange={(e) => setFormData({...formData, routeNumber: e.target.value})}
                    placeholder="Enter route number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Driver Name
                  </label>
                  <Input
                    value={formData.driverName}
                    onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                    placeholder="Enter driver name"
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
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="OUT_OF_SERVICE">Out of Service</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    type="button" 
                    variant="outline" 
                    fullWidth
                    onClick={() => { setShowForm(false); setEditingBus(null); }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" fullWidth disabled={submitting}>
                    {submitting ? 'Saving...' : (editingBus ? 'Update Bus' : 'Add Bus')}
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

export default ManageBuses;