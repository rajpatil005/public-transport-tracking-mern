import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Bus, 
  Calendar, 
  DollarSign,
  PieChart,
  LineChart,
  Activity,
  Clock,
  Map,
  Percent,
  ArrowUp,
  ArrowDown,
  Download,
  Filter,
  RefreshCw,
  AlertCircle  
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { analyticsService } from '../../services/api';
import { handleApiError } from '../../services/api';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPassengers: 0,
    totalTrips: 0,
    onTimePerformance: 0,
    avgOccupancy: 0,
    peakHourTrips: 0,
    busUtilization: 0,
    passengerSatisfaction: 0
  });
  const [topRoutes, setTopRoutes] = useState([]);
  const [revenueData, setRevenueData] = useState(null);
  const [passengerData, setPassengerData] = useState(null);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, topRoutesRes, revenueRes, passengerRes] = await Promise.all([
        analyticsService.getStats(timeRange),
        analyticsService.getTopRoutes(),
        analyticsService.getRevenueData(),
        analyticsService.getPassengerData()
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      
      if (topRoutesRes.data.success) {
        setTopRoutes(topRoutesRes.data.data);
      }
      
      if (revenueRes.data.success) {
        setRevenueData(revenueRes.data.data);
      }
      
      if (passengerRes.data.success) {
        setPassengerData(passengerRes.data.data);
      }
    } catch (err) {
      const errorResponse = handleApiError(err);
      setError(errorResponse.message);
      console.error('Analytics fetch error:', err);
      
      // Fallback to static data
      setStats({
        totalRevenue: 234567,
        totalPassengers: 45678,
        totalTrips: 3456,
        onTimePerformance: 92,
        avgOccupancy: 78,
        peakHourTrips: 45,
        busUtilization: 85,
        passengerSatisfaction: 4.6
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const handleExport = async () => {
    try {
      alert('Export functionality coming soon!');
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const handleRefresh = () => {
    fetchAnalyticsData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
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
        <h3 className="text-lg font-medium text-gray-900">Error Loading Data</h3>
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-blue-600" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Track your fleet performance and key metrics</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
            <option value="year">Last Year</option>
          </select>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString() || 0}`, change: '+12.5%', icon: DollarSign, color: 'green' },
          { title: 'Total Passengers', value: (stats.totalPassengers || 0).toLocaleString(), change: '+8.3%', icon: Users, color: 'blue' },
          { title: 'Total Trips', value: (stats.totalTrips || 0).toLocaleString(), change: '+5.7%', icon: Bus, color: 'purple' },
          { title: 'On-Time Performance', value: `${stats.onTimePerformance || 0}%`, change: '-2.1%', icon: Clock, color: 'orange' }
        ].map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.change.startsWith('+');
          
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <Card.Body className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                    <div className="flex items-center mt-2">
                      {isPositive ? (
                        <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {metric.change}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">vs last period</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-${metric.color}-50`}>
                    <Icon className={`h-6 w-6 text-${metric.color}-600`} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card>
          <Card.Header>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Revenue Trend</h3>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </div>
          </Card.Header>
          <Card.Body className="p-6">
            {revenueData ? (
              <div className="h-64">
                <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                    <p className="text-gray-600">Revenue: ₹{(revenueData.total || 0).toLocaleString()}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {revenueData.labels?.length || 0} data points
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <LineChart className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                  <p className="text-gray-600">Revenue chart will be displayed here</p>
                  <p className="text-sm text-gray-400 mt-1">Chart.js integration coming soon</p>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Route Performance */}
        <Card>
          <Card.Header>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Top Performing Routes</h3>
              <span className="text-xs text-gray-400">Passenger count</span>
            </div>
          </Card.Header>
          <Card.Body className="p-6">
            {topRoutes.length > 0 ? (
              <div className="space-y-4">
                {topRoutes.map((route, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600">Route {route.routeNumber}</span>
                        <span className="text-xs text-gray-400 ml-2">{route.source} → {route.destination}</span>
                      </div>
                      <span className="text-sm font-medium">{route.passengerCount || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(((route.passengerCount || 0) / 1000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Map className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No route data available</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <Card.Body className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Occupancy</p>
                <p className="text-2xl font-bold">{stats.avgOccupancy || 0}%</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Percent className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bus Utilization</p>
                <p className="text-2xl font-bold">{stats.busUtilization || 0}%</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl">
                <Activity className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Peak Hour Trips</p>
                <p className="text-2xl font-bold">{stats.peakHourTrips || 0}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Passenger Satisfaction</p>
                <p className="text-2xl font-bold">{stats.passengerSatisfaction || 0} ⭐</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;