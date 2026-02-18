// client/src/components/passenger/MyBookings.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Ticket, QrCode } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Mock data - replace with API call
    setBookings([
      {
        id: 'KBT2401001',
        route: 'CBS → Rankala',
        date: '2024-01-15',
        time: '10:30 AM',
        seats: [12, 13],
        fare: 30,
        status: 'confirmed'
      },
      {
        id: 'KBT2401002',
        route: 'Shahupuri → JN',
        date: '2024-01-16',
        time: '2:15 PM',
        seats: [5],
        fare: 12,
        status: 'completed'
      }
    ]);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <Card.Body className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{booking.route}</h3>
                  <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                </div>
                <Badge variant={booking.status === 'confirmed' ? 'success' : 'secondary'}>
                  {booking.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm">{new Date(booking.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm">{booking.time}</span>
                </div>
                <div className="flex items-center">
                  <Ticket className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm">Seats: {booking.seats.join(', ')}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium">Fare: ₹{booking.fare}</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline">
                  <QrCode className="h-4 w-4 mr-1" />
                  View Ticket
                </Button>
                {booking.status === 'confirmed' && (
                  <Button size="sm" variant="outline" className="text-red-600">
                    Cancel
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;