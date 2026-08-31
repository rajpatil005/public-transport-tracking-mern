import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Bus, 
  Map, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Activity,
  Calendar,
  RefreshCw
} from 'lucide-react';
import Card from '../ui/Card';
import { dashboardService, busService, routeService, driverService } from '../../services/api';
import { handleApiError } from '../../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalBuses: 0,
    activeBuses: 0,
    totalRoutes: 0,
    totalDrivers: 0,
    totalPassengers: 0,
    revenue: 0,
    onTime: 0,
    occupancy: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [quickStats, setQuickStats] = useState({
    activeBuses: 0,
    totalBuses: 0,
    onTime: 0,
    occupancy: 0,
    totalPassengers: 0
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all dashboard data in parallel
      const [statsRes, busesRes, routesRes, driversRes] = await Promise.all([
        dashboardService.getStats(),
        busService.getAll({ status: 'ACTIVE' }),
        routeService.getAll(),
        driverService.getAll()
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
        setQuickStats({
          activeBuses: statsRes.data.data.activeBuses || 0,
          totalBuses: statsRes.data.data.totalBuses || 0,
          onTime: statsRes.data.data.onTime || 0,
          occupancy: statsRes.data.data.occupancy || 0,
          totalPassengers: statsRes.data.data.totalPassengers || 0
        });
      }

      // Generate recent activities from real data
      const activities = [];
      
      if (busesRes.data.success && busesRes.data.data.length > 0) {
        activities.push({
          id: 1,
          action: 'New bus added',
          description: `${busesRes.data.data[0].busNumber} assigned to Route ${busesRes.data.data[0].routeNumber}`,
          time: '2 hours ago',
          type: 'bus'
        });
      }
      
      if (routesRes.data.success && routesRes.data.data.length > 0) {
        activities.push({
          id: 2,
          action: 'Route updated',
          description: `Route ${routesRes.data.data[0].routeNumber} schedule modified`,
          time: '4 hours ago',
          type: 'route'
        });
      }

      if (driversRes.data.success && driversRes.data.data.length > 0) {
        activities.push({
          id: 3,
          action: 'New driver onboarded',
          description: `${driversRes.data.data[0].name} assigned`,
          time: '1 day ago',
          type: 'driver'
        });
      }

      setRecentActivities(activities.length > 0 ? activities : [
        { id: 1, action: 'No recent activity', description: 'System is idle', time: 'Now', type: 'bus' }
      ]);

    } catch (err) {
      const errorResponse = handleApiError(err);
      setError(errorResponse.message);
      console.error('Dashboard fetch error:', err);
      
      // Fallback to static data
      setStats({
        totalBuses: 5,
        activeBuses: 5,
        totalRoutes: 5,
        totalDrivers: 5,
        totalPassengers: 2847,
        revenue: 234567,
        onTime: 92,
        occupancy: 78
      });
      setQuickStats({
        activeBuses: 5,
        totalBuses: 5,
        onTime: 92,
        occupancy: 78,
        totalPassengers: 2847
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <AlertCircle className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Error Loading Dashboard</h3>
        <p className="text-gray-500 mt-2">{error}</p>
        <button 
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Buses',
      value: stats.totalBuses || 0,
      icon: Bus,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+2',
      changeType: 'increase'
    },
    {
      title: 'Active Routes',
      value: stats.totalRoutes || 0,
      icon: Map,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '0',
      changeType: 'neutral'
    },
    {
      title: 'Drivers',
      value: stats.totalDrivers || 0,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+1',
      changeType: 'increase'
    },
    {
      title: 'Revenue',
      value: `₹${(stats.revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      change: '+12%',
      changeType: 'increase'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <LayoutDashboard className="h-8 w-8 mr-3 text-blue-600" />
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your fleet today.</p>
        </div>
        <div className="flex items-center mt-4 sm:mt-0 space-x-3">
          <button 
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <span className="text-sm text-gray-600 flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const ChangeIcon = stat.changeType === 'increase' ? ArrowUp : stat.changeType === 'decrease' ? ArrowDown : null;
          
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <Card.Body className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    {stat.change && (
                      <div className="flex items-center mt-2">
                        {ChangeIcon && (
                          <ChangeIcon className={`h-4 w-4 ${stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'} mr-1`} />
                        )}
                        <span className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-500' : stat.changeType === 'decrease' ? 'text-red-500' : 'text-gray-500'}`}>
                          {stat.change}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">from last month</span>
                      </div>
                    )}
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-xl`}>
                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <Card.Header>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Fleet Performance</h3>
              <select className="text-sm border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
          </Card.Header>
          <Card.Body className="p-6">
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
              <div className="text-center">
                <Activity className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                <p className="text-gray-600">Performance chart will be displayed here</p>
                <p className="text-sm text-gray-400 mt-1">Integration with chart library coming soon</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Quick Stats */}
        <Card>
          <Card.Header>
            <h3 className="font-semibold text-lg">Quick Stats</h3>
          </Card.Header>
          <Card.Body className="p-6 space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Active Buses</span>
              </div>
              <span className="font-bold text-green-600">{quickStats.activeBuses || 0}/{quickStats.totalBuses || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">On-Time Rate</span>
              </div>
              <span className="font-bold text-blue-600">{quickStats.onTime || 0}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Occupancy Rate</span>
              </div>
              <span className="font-bold text-purple-600">{quickStats.occupancy || 0}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Total Passengers</span>
              </div>
              <span className="font-bold text-yellow-600">{(quickStats.totalPassengers || 0).toLocaleString()}</span>
            </div>
          </Card.Body>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <Card.Header>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Recent Activity</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</button>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="divide-y">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'bus' ? 'bg-blue-100' :
                      activity.type === 'route' ? 'bg-green-100' :
                      activity.type === 'driver' ? 'bg-purple-100' :
                      'bg-yellow-100'
                    }`}>
                      {activity.type === 'bus' && <Bus className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'route' && <Map className="h-4 w-4 text-green-600" />}
                      {activity.type === 'driver' && <Users className="h-4 w-4 text-purple-600" />}
                      {activity.type === 'maintenance' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;