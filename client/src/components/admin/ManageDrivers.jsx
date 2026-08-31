import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin,
  Award,
  Clock,
  Star,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { driverService } from '../../services/api';
import { handleApiError } from '../../services/api';

const ManageDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bus: '',
    status: 'active',
    experience: '',
    joinDate: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDrivers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (searchTerm) params.search = searchTerm;
      
      const response = await driverService.getAll(params);
      if (response.data.success) {
        setDrivers(response.data.data);
      }
    } catch (err) {
      const errorResponse = handleApiError(err);
      setError(errorResponse.message);
      console.error('Fetch drivers error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [filterStatus, searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this driver?`)) {
      try {
        const response = await driverService.delete(id);
        if (response.data.success) {
          setDrivers(drivers.filter(driver => driver._id !== id));
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
      if (editingDriver) {
        response = await driverService.update(editingDriver._id, formData);
      } else {
        response = await driverService.create(formData);
      }
      
      if (response.data.success) {
        setShowForm(false);
        setEditingDriver(null);
        setFormData({
          name: '',
          email: '',
          phone: '',
          bus: '',
          status: 'active',
          experience: '',
          joinDate: ''
        });
        fetchDrivers();
      }
    } catch (err) {
      const errorResponse = handleApiError(err);
      alert(errorResponse.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      bus: driver.bus || '',
      status: driver.status,
      experience: driver.experience || '',
      joinDate: driver.joinDate || ''
    });
    setShowForm(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'success',
      'on-leave': 'warning',
      'inactive': 'danger',
      'suspended': 'secondary'
    };
    return colors[status] || 'secondary';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading drivers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 mr-3 text-blue-600" />
            Manage Drivers
          </h1>
          <p className="text-gray-600 mt-1">Manage your drivers and their assignments</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchDrivers} className="mt-4 sm:mt-0">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => { setEditingDriver(null); setShowForm(true); }} className="mt-4 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Add New Driver
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
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search drivers by name, email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="on-leave">On Leave</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {drivers.map((driver) => (
          <Card key={driver._id || driver.id} className="hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="relative">
              {/* Status Indicator */}
              <div className={`absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 transform rotate-45 ${
                driver.status === 'active' ? 'bg-green-500' :
                driver.status === 'on-leave' ? 'bg-yellow-500' :
                'bg-gray-400'
              }`} />
              
              <div className="p-5">
                {/* Profile */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {getInitials(driver.name)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900">{driver.name}</h3>
                      <Badge variant={getStatusColor(driver.status)}>
                        {driver.status}
                      </Badge>
                    </div>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{driver.rating || 4.0}</span>
                      <span className="ml-1 text-xs text-gray-400">({driver.trips || 0} trips)</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{driver.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600 truncate">{driver.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Bus: <span className="font-medium">{driver.bus || 'Not Assigned'}</span></span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Award className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Experience: <span className="font-medium">{driver.experience || 'N/A'}</span></span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Joined: <span className="font-medium">{driver.joinDate || 'N/A'}</span></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 mt-4 pt-3 border-t">
                  <button 
                    className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => handleEdit(driver)}
                  >
                    <Edit className="h-4 w-4 inline mr-1" />
                    Edit
                  </button>
                  <button 
                    className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={() => handleDelete(driver._id)}
                  >
                    <Trash2 className="h-4 w-4 inline mr-1" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {drivers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No drivers found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your search or add a new driver</p>
        </div>
      )}

      {/* Add/Edit Driver Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {editingDriver ? 'Edit Driver' : 'Add New Driver'}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {editingDriver ? 'Update driver details' : 'Enter driver details to add to fleet'}
                  </p>
                </div>
                <button 
                  onClick={() => { setShowForm(false); setEditingDriver(null); }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter driver name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned Bus
                  </label>
                  <input
                    type="text"
                    value={formData.bus}
                    onChange={(e) => setFormData({...formData, bus: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter bus number"
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
                    <option value="on-leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 5 years"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Join Date
                  </label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    type="button" 
                    variant="outline" 
                    fullWidth
                    onClick={() => { setShowForm(false); setEditingDriver(null); }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" fullWidth disabled={submitting}>
                    {submitting ? 'Saving...' : (editingDriver ? 'Update Driver' : 'Add Driver')}
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

export default ManageDrivers;