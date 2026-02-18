// client/src/components/admin/ManageBuses.jsx
import React, { useState } from 'react';
import { Bus, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';

const ManageBuses = () => {
  const [buses, setBuses] = useState([
    { id: 1, number: 'MH09-1234', regNo: 'MH09AB1234', capacity: 52, type: 'Standard', status: 'active', route: '101' },
    { id: 2, number: 'MH09-5678', regNo: 'MH09CD5678', capacity: 45, type: 'Mini', status: 'active', route: '102' },
    { id: 3, number: 'MH09-9101', regNo: 'MH09EF9101', capacity: 60, type: 'Deluxe', status: 'maintenance', route: '103' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      setBuses(buses.filter(bus => bus.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Bus className="h-6 w-6 mr-2 text-blue-600" />
          Manage Buses
        </h1>
        <Button onClick={() => { setEditingBus(null); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Bus
        </Button>
      </div>

      <Card className="mb-6">
        <Card.Body className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search buses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4">Bus Number</th>
                  <th className="text-left py-3 px-4">Registration</th>
                  <th className="text-left py-3 px-4">Capacity</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Route</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {buses.map((bus) => (
                  <tr key={bus.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{bus.number}</td>
                    <td className="py-3 px-4">{bus.regNo}</td>
                    <td className="py-3 px-4">{bus.capacity}</td>
                    <td className="py-3 px-4">{bus.type}</td>
                    <td className="py-3 px-4">{bus.route}</td>
                    <td className="py-3 px-4">
                      <Badge variant={bus.status === 'active' ? 'success' : 'warning'}>
                        {bus.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(bus.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ManageBuses;