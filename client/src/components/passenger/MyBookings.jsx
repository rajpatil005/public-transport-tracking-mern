import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Ticket, QrCode, Download, Printer, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Model';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    // Load bookings from localStorage
    const storedBookings = localStorage.getItem('kolhapurBusBookings');
    console.log('Loaded bookings:', storedBookings); // Debug log
    
    if (storedBookings) {
      const parsedBookings = JSON.parse(storedBookings);
      setBookings(parsedBookings);
    } else {
      setBookings([]);
    }
  };

  // Save bookings to localStorage whenever they change
  const saveBookings = (updatedBookings) => {
    localStorage.setItem('kolhapurBusBookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
  };

  const handleViewTicket = (booking) => {
    setSelectedBooking(booking);
    setShowTicketModal(true);
  };

  const handleCancelBooking = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = () => {
    // Update booking status to cancelled
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingToCancel.id 
        ? { ...booking, status: 'cancelled' }
        : booking
    );
    saveBookings(updatedBookings);
    setShowCancelModal(false);
    setBookingToCancel(null);
    
    // Show success message
    alert(`Booking ${bookingToCancel.bookingId} has been cancelled successfully`);
  };

  const downloadTicket = () => {
    // Create a text version of the ticket
    const ticketContent = `
KOLHAPUR CITY BUS TRANSPORT
===========================
Ticket ID: ${selectedBooking.bookingId}
Route: ${selectedBooking.routeName}
Date: ${new Date(selectedBooking.travelDate).toLocaleDateString()}
Time: ${selectedBooking.travelTime}
From: ${selectedBooking.pickupPoint}
To: ${selectedBooking.dropPoint}
Seats: ${selectedBooking.seats.join(', ')}
Passenger: ${selectedBooking.passengerName}
Age: ${selectedBooking.passengerAge || 'N/A'}
Contact: ${selectedBooking.contactNumber}
Total Fare: ₹${selectedBooking.totalFare}
Status: ${selectedBooking.status}
Booking Date: ${new Date(selectedBooking.bookingDate).toLocaleString()}
    `;
    
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket_${selectedBooking.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-sm text-gray-600 mt-1">View and manage your bus tickets</p>
      </div>
      
      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Found</h3>
          <p className="text-gray-600 mb-4">You haven't made any bus bookings yet.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Book a Ticket
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg text-gray-900">{booking.routeName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Booking ID: {booking.bookingId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">₹{booking.totalFare}</p>
                    <p className="text-xs text-gray-500">{booking.seats.length} seat(s)</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{new Date(booking.travelDate).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{booking.travelTime}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-red-500 mr-2" />
                    <span>From: <span className="font-medium">{booking.pickupPoint}</span></span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-green-500 mr-2" />
                    <span>To: <span className="font-medium">{booking.dropPoint}</span></span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Ticket className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Seats: <span className="font-medium text-green-600">{booking.seats.join(', ')}</span></span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Passenger:</span>
                    <span>{booking.passengerName}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-3 border-t">
                  <button
                    onClick={() => handleViewTicket(booking)}
                    className="flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <QrCode className="h-4 w-4 mr-1" />
                    View Ticket
                  </button>
                  
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(booking)}
                      className="flex items-center px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket View Modal */}
      <Modal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        title="Your Ticket"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-lg border-2 border-blue-200">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg text-gray-900">KOLHAPUR CITY BUS TRANSPORT</h3>
                <p className="text-sm text-gray-600">Route {selectedBooking.routeNumber} • E-Ticket</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket ID:</span>
                  <span className="font-mono font-bold">{selectedBooking.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Passenger:</span>
                  <span className="font-medium">{selectedBooking.passengerName}</span>
                </div>
                {selectedBooking.passengerAge && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age/Gender:</span>
                    <span>{selectedBooking.passengerAge} yrs / {selectedBooking.passengerGender}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact:</span>
                  <span>{selectedBooking.contactNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Route:</span>
                  <span className="font-medium">{selectedBooking.routeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span>{new Date(selectedBooking.travelDate).toLocaleDateString()} • {selectedBooking.travelTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span>{selectedBooking.pickupPoint}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span>{selectedBooking.dropPoint}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seats:</span>
                  <span className="font-bold text-green-600">{selectedBooking.seats.join(', ')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t mt-2">
                  <span className="font-semibold">Total Paid:</span>
                  <span className="text-xl font-bold text-green-600">₹{selectedBooking.totalFare}</span>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="flex justify-center my-4">
                <div className="bg-white p-3 rounded-lg border">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-blue-600" />
                  </div>
                </div>
              </div>

              <p className="text-xs text-center text-gray-500 mt-2">
                Show this ticket to the conductor while boarding
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadTicket}
                className="flex-1 border py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Ticket
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 border py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print Ticket
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Booking"
      >
        {bookingToCancel && (
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-800 font-medium">Are you sure you want to cancel this booking?</p>
              <p className="text-red-600 text-sm mt-1">This action cannot be undone.</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-medium">{bookingToCancel.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Route:</span>
                <span>{bookingToCancel.routeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span>{new Date(bookingToCancel.travelDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seats:</span>
                <span className="font-bold text-green-600">{bookingToCancel.seats.join(', ')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Refund Amount:</span>
                <span className="text-xl font-bold text-green-600">₹{bookingToCancel.totalFare}</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 border py-2 rounded-lg hover:bg-gray-50"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancelBooking}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyBookings;