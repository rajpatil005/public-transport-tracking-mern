// client/src/components/driver/MySchedule.jsx
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Bus, ChevronRight } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const MySchedule = () => {
  const [selectedDate, setSelectedDate] = useState('2024-01-15');

  const schedule = [
    {
      date: '2024-01-15',
      trips: [
        { id: 1, route: 'CBS → Rankala', departure: '6:30 AM', arrival: '7:05 AM', bus: 'MH09-1234', status: 'completed' },
        { id: 2, route: 'Rankala → CBS', departure: '7:30 AM', arrival: '8:05 AM', bus: 'MH09-1234', status: 'completed' },
        { id: 3, route: 'CBS → Kagal', departure: '9:00 AM', arrival: '9:45 AM', bus: 'MH09-1234', status: 'in-progress' },
        { id: 4, route: 'Kagal → CBS', departure: '10:15 AM', arrival: '11:00 AM', bus: 'MH09-1234', status: 'upcoming' },
        { id: 5, route: 'CBS → Rankala', departure: '2:00 PM', arrival: '2:35 PM', bus: 'MH09-1234', status: 'upcoming' },
      ]
    },
    {
      date: '2024-01-16',
      trips: [
        { id: 6, route: 'Shahupuri → JN', departure: '7:00 AM', arrival: '7:25 AM', bus: 'MH09-5678', status: 'upcoming' },
        { id: 7, route: 'JN → Shahupuri', departure: '8:00 AM', arrival: '8:25 AM', bus: 'MH09-5678', status: 'upcoming' },
      ]
    }
  ];

  const currentSchedule = schedule.find(s => s.date === selectedDate) || { trips: [] };

  const getStatusBadge = (status) => {
    const variants = {
      'completed': 'success',
      'in-progress': 'primary',
      'upcoming': 'secondary',
      'cancelled': 'danger'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const dates = schedule.map(s => s.date);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <Card.Header>
          <h2 className="text-2xl font-bold flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-blue-600" />
            My Schedule
          </h2>
        </Card.Header>

        <Card.Body className="p-6">
          {/* Date Selector */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {dates.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  selectedDate === date
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </button>
            ))}
          </div>

          {/* Schedule List */}
          <div className="space-y-4">
            {currentSchedule.trips.length > 0 ? (
              currentSchedule.trips.map((trip) => (
                <div key={trip.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{trip.route}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Bus className="h-4 w-4 mr-1" />
                        <span className="mr-4">Bus: {trip.bus}</span>
                      </div>
                    </div>
                    {getStatusBadge(trip.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Departure</p>
                        <p className="font-medium">{trip.departure}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Arrival</p>
                        <p className="font-medium">{trip.arrival}</p>
                      </div>
                    </div>
                  </div>

                  {trip.status === 'in-progress' && (
                    <button className="mt-3 text-blue-600 text-sm flex items-center hover:text-blue-800">
                      View Details <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No trips scheduled for this date
              </div>
            )}
          </div>

          {/* Weekly Summary */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Weekly Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-xs text-gray-600">Total Trips</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">8.5</p>
                <p className="text-xs text-gray-600">Hours/Week</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">45</p>
                <p className="text-xs text-gray-600">Stops/Week</p>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MySchedule;