import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar,
  Clock,
  Users,
  CreditCard,
  MapPin,
  Bus,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  QrCode,
  Download,
  Printer
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import QRCode from 'qrcode.react';

const BookTicket = () => {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [bookingData, setBookingData] = useState({
    travelDate: '',
    passengers: 1,
    seats: [],
    totalFare: 0,
    passengerDetails: []
  });

  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    fetchRouteDetails();
  }, [routeId]);

  const fetchRouteDetails = async () => {
    try {
      const response = await api.get(`/routes/${routeId}`);
      setRoute(response.data.data);
      
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setBookingData(prev => ({
        ...prev,
        travelDate: tomorrow.toISOString().split('T')[0]
      }));
    } catch (error) {
      setError('Failed to load route details');
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    try {
      const response = await api.post('/bookings/check-availability', {
        busId: route.busId,
        travelDate: bookingData.travelDate
      });
      setAvailableSeats(response.data.data.seats);
    } catch (error) {
      setError('Failed to check availability');
    }
  };

  useEffect(() => {
    if (route && bookingData.travelDate) {
      checkAvailability();
    }
  }, [bookingData.travelDate, route]);

  const handleDateChange = (date) => {
    setBookingData(prev => ({ ...prev, travelDate: date }));
    setSelectedSeats([]);
  };

  const handlePassengerCount = (change) => {
    const newCount = bookingData.passengers + change;
    if (newCount >= 1 && newCount <= 6) {
      setBookingData(prev => ({ ...prev, passengers: newCount }));
      setSelectedSeats([]);
    }
  };

  const handleSeatSelection = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      if (selectedSeats.length < bookingData.passengers) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      } else {
        setError(`You can only select ${bookingData.passengers} seats`);
      }
    }
  };

  const calculateFare = () => {
    return (route?.fare || 0) * selectedSeats.length;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!bookingData.travelDate) {
        setError('Please select travel date');
        return;
      }
      if (selectedSeats.length !== bookingData.passengers) {
        setError(`Please select ${bookingData.passengers} seats`);
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      // Create booking
      const bookingResponse = await api.post('/bookings', {
        routeId,
        busId: route.busId,
        travelDate: bookingData.travelDate,
        seats: selectedSeats.map(seat => ({
          seatNumber: seat,
          passengerName: user.name,
          passengerAge: 0,
          passengerGender: 'Not specified'
        })),
        totalFare: calculateFare(),
        paymentMethod
      });

      const booking = bookingResponse.data.data;
      setBookingId(booking.bookingId);
      setQrCode(booking.qrCode);
      setBookingComplete(true);
      setStep(4);
      setSuccess('Booking confirmed successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadTicket = () => {
    // Create PDF ticket (simplified)
    const ticketContent = `
      KOLHAPUR CITY BUS TRANSPORT
      ============================
      Ticket ID: ${bookingId}
      Route: ${route?.name}
      Date: ${new Date(bookingData.travelDate).toLocaleDateString()}
      Seats: ${selectedSeats.join(', ')}
      Fare: ₹${calculateFare()}
      Passenger: ${user?.name}
      
      Thank you for choosing Kolhapur Bus Service!
    `;
    
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${bookingId}.txt`;
    a.click();
  };

  const printTicket = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step > s
                      ? 'bg-green-500 text-white'
                      : step === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step > s ? <CheckCircle className="h-5 w-5" /> : s}
                  </div>
                  <span className="text-xs mt-2 text-gray-600">
                    {s === 1 && 'Select'}
                    {s === 2 && 'Seats'}
                    {s === 3 && 'Payment'}
                    {s === 4 && 'Confirm'}
                  </span>
                </div>
                {s < 4 && (
                  <ChevronRight className={`h-5 w-5 ${
                    step > s ? 'text-green-500' : 'text-gray-400'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => setError('')}
            className="mb-4"
          />
        )}
        
        {success && (
          <Alert 
            type="success" 
            message={success} 
            onClose={() => setSuccess('')}
            className="mb-4"
          />
        )}

        {/* Route Info Card */}
        <Card className="mb-6">
          <Card.Body className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">{route?.name}</h2>
                <div className="flex items-center mt-2 text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{route?.source} → {route?.destination}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">₹{route?.fare}</p>
                <p className="text-sm text-gray-500">per seat</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm">{route?.duration} mins</span>
              </div>
              <div className="flex items-center">
                <Bus className="h-4 w-4 text-purple-600 mr-2" />
                <span className="text-sm">{route?.distance} km</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Step Content */}
        {step === 1 && (
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Select Travel Date</h3>
            </Card.Header>
            <Card.Body className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Journey Date
                  </label>
                  <Input
                    type="date"
                    value={bookingData.travelDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Passengers
                  </label>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePassengerCount(-1)}
                      disabled={bookingData.passengers <= 1}
                    >
                      -
                    </Button>
                    <span className="text-xl font-bold">{bookingData.passengers}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePassengerCount(1)}
                      disabled={bookingData.passengers >= 6}
                    >
                      +
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Maximum 6 passengers per booking
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Seats
                  </label>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
                      {availableSeats.map((seat) => (
                        <button
                          key={seat.number}
                          onClick={() => handleSeatSelection(seat.number)}
                          disabled={!seat.available}
                          className={`
                            p-3 rounded-lg text-center transition-all
                            ${!seat.available 
                              ? 'bg-gray-400 cursor-not-allowed opacity-50'
                              : selectedSeats.includes(seat.number)
                              ? 'bg-green-500 text-white transform scale-105'
                              : 'bg-white hover:bg-blue-100'
                            }
                          `}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-center space-x-4 mt-4">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-white border rounded mr-1"></div>
                        <span className="text-xs">Available</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded mr-1"></div>
                        <span className="text-xs">Selected</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-400 rounded mr-1"></div>
                        <span className="text-xs">Booked</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Fare:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{calculateFare()}
                    </span>
                  </div>
                </div>
              </div>
            </Card.Body>
            <Card.Footer className="flex justify-end">
              <Button onClick={handleNext}>
                Continue to Payment <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card.Footer>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Payment Details</h3>
            </Card.Header>
            <Card.Body className="p-6">
              <div className="space-y-6">
                {/* Payment Methods */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['card', 'upi', 'wallet'].map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`
                          p-3 border rounded-lg text-center capitalize
                          ${paymentMethod === method
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-300 hover:border-gray-400'
                          }
                        `}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Payment Form */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <Input
                      placeholder="Card Number"
                      maxLength="16"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="MM/YY" />
                      <Input placeholder="CVV" type="password" maxLength="3" />
                    </div>
                    <Input placeholder="Card Holder Name" />
                  </div>
                )}

                {/* UPI Payment */}
                {paymentMethod === 'upi' && (
                  <div>
                    <Input placeholder="Enter UPI ID (e.g., name@okhdfcbank)" />
                    <p className="text-xs text-gray-500 mt-2">
                      You will receive a payment request on your UPI app
                    </p>
                  </div>
                )}

                {/* Wallet Payment */}
                {paymentMethod === 'wallet' && (
                  <div className="space-y-2">
                    <Button variant="outline" fullWidth>
                      Paytm Wallet
                    </Button>
                    <Button variant="outline" fullWidth>
                      Google Pay
                    </Button>
                    <Button variant="outline" fullWidth>
                      PhonePe
                    </Button>
                    <Button variant="outline" fullWidth>
                      Amazon Pay
                    </Button>
                  </div>
                )}

                {/* Booking Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Route:</span>
                      <span className="font-medium">{route?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(bookingData.travelDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passengers:</span>
                      <span className="font-medium">{bookingData.passengers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seats:</span>
                      <span className="font-medium">{selectedSeats.join(', ')}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="text-xl font-bold text-blue-600">
                        ₹{calculateFare()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
            <Card.Footer className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button 
                onClick={handlePayment}
                loading={processing}
              >
                Pay ₹{calculateFare()}
              </Button>
            </Card.Footer>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <Card.Body className="p-8 text-center">
              <div className="mb-6">
                <div className="inline-flex p-3 bg-yellow-100 rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Processing Payment</h3>
              <p className="text-gray-600">
                Please wait while we confirm your payment...
              </p>
            </Card.Body>
          </Card>
        )}

        {step === 4 && bookingComplete && (
          <Card>
            <Card.Body className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
                <p className="text-gray-600 mt-2">
                  Your ticket has been booked successfully
                </p>
              </div>

              {/* Ticket Details */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg">KOLHAPUR CITY BUS TRANSPORT</h3>
                  <p className="text-sm text-gray-600">E-Ticket</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ticket ID:</span>
                    <span className="font-mono font-bold">{bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passenger:</span>
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Route:</span>
                    <span className="font-medium">{route?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {new Date(bookingData.travelDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seats:</span>
                    <span className="font-medium">{selectedSeats.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fare Paid:</span>
                    <span className="font-bold text-green-600">₹{calculateFare()}</span>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex justify-center my-4">
                  <QRCode 
                    value={JSON.stringify({
                      bookingId,
                      route: route?.name,
                      seats: selectedSeats,
                      date: bookingData.travelDate
                    })}
                    size={150}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <p className="text-xs text-center text-gray-500">
                  Show this QR code to the conductor while boarding
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={downloadTicket}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={printTicket}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button 
                  variant="primary" 
                  fullWidth
                  className="col-span-2"
                  onClick={() => navigate('/my-bookings')}
                >
                  View My Bookings
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookTicket;