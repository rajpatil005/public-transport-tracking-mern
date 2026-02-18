// client/src/components/admin/ManageDrivers.jsx
import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Phone, Mail } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const ManageDrivers = () => {
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Rajendra Patil', phone: '9876543210', email: 'rajendra@example.com', experience: '8 years', status: 'active', bus: 'MH09-1234' },
    { id: 2, name: 'Sanjay Deshmukh', phone: '9876543211', email: 'sanjay@example.com', experience: '5 years', status: 'active', bus: 'MH09-5678' },
    { id: 3, name: 'Prakash Jadhav', phone: '9876543212', email: 'prakash@example.com', experience: '3 years', status: 'on-leave', bus: 'None' },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Users className="h-6 w-6 mr-2 text-blue-600" />
          Manage Drivers
        </h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Driver
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((driver) => (
          <Card key={driver.id}>
            <Card.Body className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">{driver.name}</h3>
                <Badge variant={driver.status === 'active' ? 'success' : 'warning'}>
                  {driver.status}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{driver.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{driver.email}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Experience:</span>
                  <span>{driver.experience}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Assigned Bus:</span>
                  <span className="font-medium">{driver.bus}</span>
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageDrivers;