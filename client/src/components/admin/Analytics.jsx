// client/src/components/admin/Analytics.jsx
import React from 'react';
import { BarChart3, TrendingUp, Users, Bus, Calendar, DollarSign } from 'lucide-react';
import Card from '../ui/Card';

const Analytics = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold flex items-center mb-6">
        <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
        Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <Card.Body className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">₹2,34,567</p>
                <p className="text-xs text-green-600">↑ 12% from last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Passengers</p>
                <p className="text-2xl font-bold">45,678</p>
                <p className="text-xs text-green-600">↑ 8% from last month</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Trips</p>
                <p className="text-2xl font-bold">3,456</p>
                <p className="text-xs text-green-600">↑ 5% from last month</p>
              </div>
              <Bus className="h-8 w-8 text-purple-600" />
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On-Time Performance</p>
                <p className="text-2xl font-bold">92%</p>
                <p className="text-xs text-yellow-600">↓ 2% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <h3 className="font-semibold">Daily Ridership</h3>
          </Card.Header>
          <Card.Body className="p-4">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Chart will be displayed here</p>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="font-semibold">Revenue by Route</h3>
          </Card.Header>
          <Card.Body className="p-4">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Chart will be displayed here</p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;