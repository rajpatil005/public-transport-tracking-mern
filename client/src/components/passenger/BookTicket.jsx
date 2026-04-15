import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
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
  Printer,
  Shield,
  XCircle,
  Navigation
} from 'lucide-react';
import Modal from '../ui/Model';
import QRCode from 'qrcode.react';

//========= Kolhapur City Bus Routes Data ===========//

const kolhapurRoutes = {
  "101": {
    routeNumber: "101",
    name: "Central Bus Stand → Mahalaxmi Temple → Rankala Lake",
    source: "Central Bus Stand",
    destination: "Rankala Lake",
    fare: 15,
    duration: "25",
    distance: "8 km",
    busType: "Regular Bus",
    departureTime: "Every 15 mins",
    busId: "BUS101",
    stops: [
      { name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431 },
      { name: "Bindu Chowk", latitude: 16.6975, longitude: 74.2382 },
      { name: "Mahalaxmi Temple", latitude: 16.6913, longitude: 74.2245 },
      { name: "Rankala Stand", latitude: 16.6895, longitude: 74.2198 },
      { name: "Rankala Lake", latitude: 16.6878, longitude: 74.2167 },
    ],
  },
  "102": {
    routeNumber: "102",
    name: "Central Bus Stand → New Palace → DYP City Mall",
    source: "Central Bus Stand",
    destination: "DYP City Mall",
    fare: 20,
    duration: "30",
    distance: "10 km",
    busType: "AC Bus",
    departureTime: "Every 20 mins",
    busId: "BUS102",
    stops: [
      { name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431 },
      { name: "Dasara Chowk", latitude: 16.7045, longitude: 74.2402 },
      { name: "New Palace", latitude: 16.7031, longitude: 74.2586 },
      { name: "Rajarampuri 3rd Lane", latitude: 16.7116, longitude: 74.2345 },
      { name: "DYP City Mall", latitude: 16.7125, longitude: 74.2253 },
    ],
  },
  "103": {
    routeNumber: "103",
    name: "Rankala Lake → CPR Hospital → Khasbag Maidan",
    source: "Rankala Lake",
    destination: "Khasbag Maidan",
    fare: 15,
    duration: "20",
    distance: "6 km",
    busType: "Regular Bus",
    departureTime: "Every 30 mins",
    busId: "BUS103",
    stops: [
      { name: "Rankala Lake", latitude: 16.6878, longitude: 74.2167 },
      { name: "Mahalaxmi Temple", latitude: 16.6913, longitude: 74.2245 },
      { name: "CPR Hospital", latitude: 16.7083, longitude: 74.2356 },
      { name: "Shahupuri", latitude: 16.7069, longitude: 74.2439 },
      { name: "Khasbag Maidan", latitude: 16.6947, longitude: 74.2408 },
    ],
  },
  "104": {
    routeNumber: "104",
    name: "Shivaji University → Central Bus Stand",
    source: "Shivaji University",
    destination: "Central Bus Stand",
    fare: 15,
    duration: "35",
    distance: "12 km",
    busType: "AC Bus",
    departureTime: "Every 25 mins",
    busId: "BUS104",
    stops: [
      { name: "Shivaji University", latitude: 16.7222, longitude: 74.2481 },
      { name: "Kasaba Bawada", latitude: 16.7274, longitude: 74.2214 },
      { name: "Tarabai Park", latitude: 16.7052, longitude: 74.2401 },
      { name: "Bindu Chowk", latitude: 16.6975, longitude: 74.2382 },
      { name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431 },
    ],
  },
  "105": {
    routeNumber: "105",
    name: "Central Bus Stand → DYP City Mall → Rankala Lake",
    source: "Central Bus Stand",
    destination: "Rankala Lake",
    fare: 20,
    duration: "40",
    distance: "14 km",
    busType: "AC Bus",
    departureTime: "Every 30 mins",
    busId: "BUS105",
    stops: [
      { name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431 },
      { name: "Collector Office Kolhapur", latitude: 16.7074, longitude: 74.2390 },
      { name: "Shivaji University", latitude: 16.7222, longitude: 74.2481 },
      { name: "New Palace Road", latitude: 16.7090, longitude: 74.2255 },
      { name: "Rankala Lake", latitude: 16.6878, longitude: 74.2167 },
    ],
  },
  "106": {
    routeNumber: "106",
    name: "Central Bus Stand → Jyotiba Temple",
    source: "Central Bus Stand",
    destination: "Jyotiba Temple",
    fare: 60,
    duration: "60",
    distance: "25 km",
    busType: "AC Bus",
    departureTime: "Every 2 hours",
    busId: "BUS106",
    stops: [
      { name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431 },
      { name: "Panhala Naka", latitude: 16.7521, longitude: 74.2012 },
      { name: "Murgud", latitude: 16.8114, longitude: 74.1856 },
      { name: "Jyotiba Temple Base", latitude: 16.8765, longitude: 74.2689 },
      { name: "Jyotiba Temple", latitude: 16.8861, longitude: 74.2750 },
    ],
  },
  "107": {
    routeNumber: "107",
    name: "Central Bus Stand → Panhala Fort",
    source: "Central Bus Stand",
    destination: "Panhala Fort",
    fare: 50,
    duration: "45",
    distance: "20 km",
    busType: "Regular Bus",
    departureTime: "Every 1 hour",
    busId: "BUS107",
    stops: [
      { name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431 },
      { name: "Panhala Naka", latitude: 16.7521, longitude: 74.2012 },
      { name: "Panhala Village", latitude: 16.8094, longitude: 74.1189 },
      { name: "Panhala Fort Entrance", latitude: 16.8094, longitude: 74.1123 },
      { name: "Panhala Fort", latitude: 16.8094, longitude: 74.1103 },
    ],
  }
};

const allRoutes = { ...kolhapurRoutes };

const BookTicket = () => {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const ticketRef = useRef(null);

  // Get route details from our data
  const route = allRoutes[routeId] || allRoutes["101"];

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentStatusMessage, setPaymentStatusMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  // Payment form fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');

  const [bookingData, setBookingData] = useState({
    travelDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    departureTime: '09:00 AM',
    passengers: 1,
    passengerDetails: [],
    boardingPoint: route.stops[0].name,
    droppingPoint: route.stops[route.stops.length - 1].name
  });

  // Generate seats (1-40) with some pre-booked seats for demo
  const generateAvailableSeats = () => {
    const allSeats = Array.from({ length: 40 }, (_, i) => i + 1);
    const bookedSeats = [5, 12, 18, 25, 33, 7, 14, 22, 29, 38];
    return allSeats.map(seat => ({
      number: seat,
      available: !bookedSeats.includes(seat)
    }));
  };

  const [availableSeats, setAvailableSeats] = useState(generateAvailableSeats());

  // Get all stops for dropdowns
  const getStopsList = () => {
    const stops = [];
    if (route.source) stops.push(route.source);
    if (route.stops && route.stops.length > 0) {
      route.stops.forEach(s => stops.push(s.name));
    }
    if (route.destination) stops.push(route.destination);
    return [...new Set(stops)];
  };

  // Calculate fare based on boarding and dropping points
  const calculateFare = () => {
    if (!route) return 0;
    let baseFare = route.fare || 15;
    if (bookingData.boardingPoint && bookingData.droppingPoint) {
      const stopsList = getStopsList();
      const startIndex = stopsList.indexOf(bookingData.boardingPoint);
      const endIndex = stopsList.indexOf(bookingData.droppingPoint);
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        const totalSegments = Math.max(1, stopsList.length - 1);
        const numSegments = endIndex - startIndex;
        baseFare = Math.max(5, Math.ceil((baseFare / totalSegments) * numSegments));
      }
    }
    return baseFare * selectedSeats.length;
  };

  // Handle seat selection
  const handleSeatSelection = (seatNumber, isAvailable) => {
    if (!isAvailable) {
      setError('This seat is already booked');
      return;
    }
    
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
      setError('');
    } else {
      if (selectedSeats.length < bookingData.passengers) {
        setSelectedSeats([...selectedSeats, seatNumber]);
        setError('');
      } else {
        setError(`You can only select ${bookingData.passengers} ${bookingData.passengers === 1 ? 'seat' : 'seats'}`);
      }
    }
  };

  // Render individual seat
  const renderSeat = (seat) => {
    const isSelected = selectedSeats.includes(seat.number);
    return (
      <button
        key={seat.number}
        onClick={() => handleSeatSelection(seat.number, seat.available)}
        disabled={!seat.available}
        className={`
          relative w-8 h-8 sm:w-10 sm:h-10 rounded-t-xl rounded-b-sm border-2 transition-all flex items-center justify-center group
          ${!seat.available
            ? 'bg-gray-200 border-gray-300 cursor-not-allowed text-gray-400'
            : isSelected
              ? 'bg-blue-600 border-blue-800 text-white shadow-md transform scale-105'
              : 'bg-white border-gray-400 hover:border-blue-500 hover:bg-blue-50 text-gray-700'
          }
        `}
        title={!seat.available ? 'Seat Booked' : `Seat ${seat.number}`}
      >
        <span className="text-[10px] sm:text-xs font-bold">{seat.number}</span>
      </button>
    );
  };

  // Handle passenger count change
  const handlePassengerCount = (change) => {
    const newCount = bookingData.passengers + change;
    if (newCount >= 1 && newCount <= 6) {
      setBookingData(prev => ({ ...prev, passengers: newCount }));
      setSelectedSeats([]);
      setError('');
    }
  };

  // Handle passenger details change
  const handlePassengerChange = (index, field, value) => {
    setBookingData((prev) => {
      const newDetails = [...prev.passengerDetails];
      if (!newDetails[index]) {
        newDetails[index] = { name: '', age: '', gender: '' };
      }
      newDetails[index][field] = value;
      return { ...prev, passengerDetails: newDetails };
    });
  };

  // Handle next step
  const handleNext = () => {
    if (step === 1) {
      if (!bookingData.travelDate) {
        setError('Please select a travel date');
        return;
      }
      if (!bookingData.departureTime) {
        setError('Please select a departure time');
        return;
      }
      if (!bookingData.boardingPoint) {
        setError('Please select a boarding point');
        return;
      }
      if (!bookingData.droppingPoint) {
        setError('Please select a dropping point');
        return;
      }
      
      const stopsList = getStopsList();
      const startIndex = stopsList.indexOf(bookingData.boardingPoint);
      const endIndex = stopsList.indexOf(bookingData.droppingPoint);
      if (startIndex !== -1 && endIndex !== -1 && startIndex >= endIndex) {
        setError('Dropping point must be after your Boarding point');
        return;
      }

      if (selectedSeats.length !== bookingData.passengers) {
        setError(`Please select ${bookingData.passengers} ${bookingData.passengers === 1 ? 'seat' : 'seats'}`);
        return;
      }
      
      // Validate passenger details
      for (let i = 0; i < selectedSeats.length; i++) {
        const pd = bookingData.passengerDetails[i];
        if (!pd || !pd.name || !pd.age || !pd.gender) {
          const missing = [];
          if (!pd?.name) missing.push('Name');
          if (!pd?.age) missing.push('Age');
          if (!pd?.gender) missing.push('Gender');
          setError(`Seat ${selectedSeats[i]}: ${missing.join(', ')} ${missing.length > 1 ? 'are' : 'is'} required`);
          return;
        }
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  // Process payment and create booking
  const handlePayment = async () => {
    setProcessing(true);
    setError('');
    setStep(3);

    try {
      setPaymentStatusMessage('Connecting to secure gateway...');
      await new Promise(r => setTimeout(r, 1500));

      setPaymentStatusMessage('Verifying payment details...');
      await new Promise(r => setTimeout(r, 1500));

      setPaymentStatusMessage('Processing transaction...');
      await new Promise(r => setTimeout(r, 1500));

      // Create booking ID
      const newBookingId = 'KB' + route.routeNumber + Math.random().toString(36).substr(2, 6).toUpperCase();
      
      const newBooking = {
        id: newBookingId,
        bookingId: newBookingId,
        routeId: route.routeNumber,
        routeNumber: route.routeNumber,
        routeName: route.name,
        source: route.source,
        destination: route.destination,
        travelDate: bookingData.travelDate,
        departureTime: bookingData.departureTime,
        boardingPoint: bookingData.boardingPoint,
        droppingPoint: bookingData.droppingPoint,
        seats: selectedSeats,
        passengerDetails: bookingData.passengerDetails,
        contactNumber: bookingData.contactNumber || '9876543210',
        email: bookingData.email || 'customer@example.com',
        totalFare: calculateFare(),
        fare: route.fare,
        status: 'confirmed',
        bookingDate: new Date().toISOString(),
        paymentMethod: paymentMethod,
        qrCode: newBookingId
      };

      // Get existing bookings from localStorage
      const existingBookings = localStorage.getItem('kolhapurBusBookings');
      let bookings = [];
      
      if (existingBookings) {
        bookings = JSON.parse(existingBookings);
      }
      
      // Add new booking
      bookings.push(newBooking);
      
      // Save back to localStorage
      localStorage.setItem('kolhapurBusBookings', JSON.stringify(bookings));
      
      // Also save to session storage for immediate display
      sessionStorage.setItem('lastBooking', JSON.stringify(newBooking));

      setBookingId(newBookingId);
      setBookingComplete(true);
      setStep(4);
      setSuccess('Booking confirmed successfully!');
    } catch (error) {
      setError('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Cancel booking
  const handleCancelBooking = async () => {
    setCancelling(true);
    try {
      // Get existing bookings
      const existingBookings = localStorage.getItem('kolhapurBusBookings');
      if (existingBookings) {
        let bookings = JSON.parse(existingBookings);
        // Update booking status
        bookings = bookings.map(booking => 
          booking.bookingId === bookingId 
            ? { ...booking, status: 'cancelled', cancelledAt: new Date().toISOString() }
            : booking
        );
        localStorage.setItem('kolhapurBusBookings', JSON.stringify(bookings));
      }
      setCancelled(true);
      setShowCancelModal(false);
      setSuccess('');
    } catch (err) {
      setError('Failed to cancel booking');
      setShowCancelModal(false);
    } finally {
      setCancelling(false);
    }
  };

  // Download ticket as PDF
  const downloadTicket = async () => {
    if (!ticketRef.current) return;

    try {
      await new Promise(r => setTimeout(r, 100));
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`KBT-Ticket-${bookingId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Could not download PDF ticket. Please try printing instead.');
    }
  };

  // Print ticket
  const printTicket = () => {
    window.print();
  };

  // Get today's date for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[280px] sm:min-w-0">
            {[1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base ${
                    step > s
                      ? 'bg-green-500 text-white'
                      : step === s
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                    {step > s ? <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" /> : s}
                  </div>
                  <span className="text-[10px] sm:text-xs mt-1 sm:mt-2 text-gray-600">
                    {s === 1 && 'Details'}
                    {s === 2 && 'Payment'}
                    {s === 3 && 'Process'}
                    {s === 4 && 'Confirm'}
                  </span>
                </div>
                {s < 4 && (
                  <ChevronRight className={`h-4 w-4 sm:h-5 sm:w-5 ${step > s ? 'text-green-500' : 'text-gray-400'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">×</button>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-300 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{success}</span>
            <button onClick={() => setSuccess('')} className="ml-auto text-green-500 hover:text-green-700">×</button>
          </div>
        )}

        {/* Route Info Card */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6 border-l-4 border-blue-500">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
            <div className="w-full sm:w-auto">
              <h2 className="text-base sm:text-xl font-bold text-gray-900">{route.name}</h2>
              <div className="flex flex-col sm:flex-row sm:items-center mt-2 text-gray-600 gap-1 sm:gap-0">
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-red-500" />
                  <span className="text-xs sm:text-sm">From: {route.source}</span>
                </div>
                <span className="hidden sm:inline mx-2">•</span>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-green-500" />
                  <span className="text-xs sm:text-sm">To: {route.destination}</span>
                </div>
              </div>
              <div className="flex items-center mt-1 text-blue-600">
                <Navigation className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="text-[10px] sm:text-sm">{route.stops.length} stops • {route.distance}</span>
              </div>
            </div>
            <div className="text-right w-full sm:w-auto">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">₹{route.fare}</p>
              <p className="text-xs text-gray-500">per seat</p>
              <span className="inline-block mt-1 sm:mt-2 px-2 py-1 bg-green-100 text-green-700 text-[10px] sm:text-xs rounded-full">
                {route.busType}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 pt-3 sm:pt-4 border-t">
            <div className="flex items-center">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mr-2" />
              <div>
                <span className="text-[10px] sm:text-sm text-gray-600">Duration</span>
                <p className="text-xs sm:text-sm font-medium">{route.duration} mins</p>
              </div>
            </div>
            <div className="flex items-center">
              <Bus className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 mr-2" />
              <div>
                <span className="text-[10px] sm:text-sm text-gray-600">Frequency</span>
                <p className="text-xs sm:text-sm font-medium">{route.departureTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Booking Details */}
        {!bookingComplete && step === 1 && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Enter Booking Details</h3>
            
            <div className="space-y-4 sm:space-y-6">
              {/* Travel Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Travel Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.travelDate}
                    onChange={(e) => setBookingData({...bookingData, travelDate: e.target.value})}
                    min={today}
                    className="w-full p-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Departure Time
                  </label>
                  <select
                    value={bookingData.departureTime}
                    onChange={(e) => setBookingData({...bookingData, departureTime: e.target.value})}
                    className="w-full p-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="06:00 AM">6:00 AM</option>
                    <option value="08:30 AM">8:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">2:00 PM</option>
                    <option value="05:30 PM">5:30 PM</option>
                    <option value="09:00 PM">9:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Boarding and Dropping Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Boarding Point
                  </label>
                  <select
                    value={bookingData.boardingPoint}
                    onChange={(e) => setBookingData({...bookingData, boardingPoint: e.target.value})}
                    className="w-full p-2 text-sm sm:text-base border rounded-lg"
                  >
                    {getStopsList().map((stop, index) => (
                      <option key={index} value={stop}>{stop}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Dropping Point
                  </label>
                  <select
                    value={bookingData.droppingPoint}
                    onChange={(e) => setBookingData({...bookingData, droppingPoint: e.target.value})}
                    className="w-full p-2 text-sm sm:text-base border rounded-lg"
                  >
                    {getStopsList().map((stop, index) => (
                      <option key={index} value={stop}>{stop}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Number of Passengers */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Number of Passengers
                </label>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <button
                    onClick={() => handlePassengerCount(-1)}
                    disabled={bookingData.passengers <= 1}
                    className="w-8 h-8 sm:w-10 sm:h-10 border rounded-lg hover:bg-gray-100 text-lg sm:text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="text-xl sm:text-2xl font-bold w-10 sm:w-12 text-center">{bookingData.passengers}</span>
                  <button
                    onClick={() => handlePassengerCount(1)}
                    disabled={bookingData.passengers >= 6}
                    className="w-8 h-8 sm:w-10 sm:h-10 border rounded-lg hover:bg-gray-100 text-lg sm:text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Maximum 6 passengers per booking</p>
              </div>

              {/* Seat Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-4 text-center">
                  Select Your Seats (Select {bookingData.passengers} seat{bookingData.passengers !== 1 ? 's' : ''})
                </label>
                <div className="bg-gray-50 p-3 sm:p-6 rounded-3xl border-4 border-gray-300 relative shadow-inner overflow-x-auto">
                  {/* Bus front indicator */}
                  <div className="text-center mb-3 sm:mb-4">
                    <div className="inline-block bg-gray-700 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">FRONT</div>
                  </div>
                  
                  <div className="grid grid-cols-6 gap-1 sm:gap-2 max-w-[320px] mx-auto">
                    {Array.from({ length: Math.ceil(availableSeats.length / 5) }).map((_, rowIndex) => (
                      <React.Fragment key={rowIndex}>
                        {renderSeat(availableSeats[rowIndex * 5])}
                        {renderSeat(availableSeats[rowIndex * 5 + 1])}
                        
                        {/* Aisle */}
                        <div className="w-2 sm:w-4 flex items-center justify-center">
                          <div className="w-0.5 h-6 sm:h-8 bg-gray-300"></div>
                        </div>
                        
                        {renderSeat(availableSeats[rowIndex * 5 + 2])}
                        {renderSeat(availableSeats[rowIndex * 5 + 3])}
                        {renderSeat(availableSeats[rowIndex * 5 + 4])}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="flex justify-center space-x-3 sm:space-x-6 mt-6 sm:mt-8 pt-4 border-t border-gray-200">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-400 bg-white rounded-t-xl rounded-b-sm mb-1 sm:mb-2"></div>
                      <span className="text-[10px] sm:text-xs font-medium text-gray-600">Available</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-blue-800 bg-blue-600 rounded-t-xl rounded-b-sm mb-1 sm:mb-2"></div>
                      <span className="text-[10px] sm:text-xs font-medium text-gray-600">Selected</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-300 bg-gray-200 rounded-t-xl rounded-b-sm mb-1 sm:mb-2"></div>
                      <span className="text-[10px] sm:text-xs font-medium text-gray-600">Booked</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passenger Details */}
              {selectedSeats.length > 0 && (
                <div className="border-t pt-4 sm:pt-6">
                  <h4 className="font-medium text-sm sm:text-base mb-3 sm:mb-4">Passenger Details</h4>
                  {selectedSeats.map((seat, index) => (
                    <div key={seat} className="bg-white border rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 shadow-sm">
                      <h5 className="font-medium mb-2 sm:mb-3 text-blue-800 text-sm sm:text-base">Seat {seat}</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={bookingData.passengerDetails[index]?.name || ''}
                          onChange={(e) => {
                            const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                            handlePassengerChange(index, 'name', lettersOnly);
                          }}
                          className="p-2 text-sm sm:text-base border rounded-lg"
                        />
                        <input
                          type="number"
                          placeholder="Age"
                          value={bookingData.passengerDetails[index]?.age || ''}
                          onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                          className="p-2 text-sm sm:text-base border rounded-lg"
                        />
                        <select
                          value={bookingData.passengerDetails[index]?.gender || ''}
                          onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                          className="p-2 text-sm sm:text-base border rounded-lg"
                        >
                          <option value="" disabled>Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                    <input
                      type="tel"
                      placeholder="Contact Number *"
                      value={bookingData.contactNumber}
                      onChange={(e) => setBookingData({...bookingData, contactNumber: e.target.value})}
                      className="p-2 text-sm sm:text-base border rounded-lg"
                    />
                    <input
                      type="email"
                      placeholder="Email (Optional)"
                      value={bookingData.email}
                      onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                      className="p-2 text-sm sm:text-base border rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Fare Summary */}
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm sm:text-base">Total Fare:</span>
                  <span className="text-xl sm:text-2xl font-bold text-blue-600">₹{calculateFare()}</span>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">₹{Math.ceil(calculateFare() / Math.max(1, selectedSeats.length))} × {selectedSeats.length} seats</p>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleNext}
                className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center font-medium text-sm sm:text-base"
              >
                Continue to Payment <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {!bookingComplete && step === 2 && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Payment Details</h3>
            
            <div className="space-y-4 sm:space-y-6">
              {/* Payment Methods */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {['card', 'upi', 'wallet'].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`
                        p-2 sm:p-3 border rounded-lg text-center capitalize text-sm sm:text-base
                        ${paymentMethod === method
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-gray-400'
                        }
                      `}
                    >
                      {method === 'card' ? '💳 Card' : method === 'upi' ? '📱 UPI' : '👛 Wallet'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 sm:space-y-4">
                  <input
                    type="text"
                    placeholder="Card Number"
                    maxLength="16"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2 text-sm sm:text-base border rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="p-2 text-sm sm:text-base border rounded-lg"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      maxLength="3"
                      value={cardCVV}
                      onChange={(e) => setCardCVV(e.target.value)}
                      className="p-2 text-sm sm:text-base border rounded-lg"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Card Holder Name"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full p-2 text-sm sm:text-base border rounded-lg"
                  />
                </div>
              )}

              {/* UPI Payment */}
              {paymentMethod === 'upi' && (
                <div>
                  <input
                    type="text"
                    placeholder="Enter UPI ID (e.g., name@okhdfcbank)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full p-2 text-sm sm:text-base border rounded-lg"
                  />
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
                    You will receive a payment request on your UPI app
                  </p>
                </div>
              )}

              {/* Wallet Payment */}
              {paymentMethod === 'wallet' && (
                <div className="space-y-2">
                  {['Paytm Wallet', 'Google Pay', 'PhonePe', 'Amazon Pay'].map((wallet) => (
                    <button
                      key={wallet}
                      onClick={() => setSelectedWallet(wallet)}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-left transition-all text-sm sm:text-base ${
                        selectedWallet === wallet
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                    >
                      {wallet}
                    </button>
                  ))}
                </div>
              )}

              {/* Booking Summary */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">Booking Summary</h4>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Route:</span>
                    <span className="font-medium text-right max-w-[60%]">
                      {bookingData.boardingPoint} → {bookingData.droppingPoint}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {new Date(bookingData.travelDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{bookingData.departureTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passengers:</span>
                    <span className="font-medium">{bookingData.passengers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seats:</span>
                    <span className="font-medium text-green-600">{selectedSeats.join(', ')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-lg sm:text-xl font-bold text-blue-600">
                      ₹{calculateFare()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleBack}
                  className="order-2 sm:order-1 flex-1 border py-2.5 sm:py-3 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                >
                  <ChevronLeft className="inline mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Back
                </button>
                <button
                  onClick={() => {
                    setError('');
                    if (paymentMethod === 'card') {
                      const missing = [];
                      if (!cardNumber) missing.push('Card Number');
                      if (!cardExpiry) missing.push('Expiry (MM/YY)');
                      if (!cardCVV) missing.push('CVV');
                      if (!cardHolder) missing.push('Card Holder Name');
                      if (missing.length > 0) {
                        setError(`${missing.join(', ')} ${missing.length > 1 ? 'are' : 'is'} required`);
                        return;
                      }
                    } else if (paymentMethod === 'upi') {
                      if (!upiId) {
                        setError('UPI ID is required');
                        return;
                      }
                    } else if (paymentMethod === 'wallet') {
                      if (!selectedWallet) {
                        setError('Please select a wallet to pay');
                        return;
                      }
                    }
                    handlePayment();
                  }}
                  disabled={processing}
                  className="order-1 sm:order-2 flex-1 bg-green-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 text-sm sm:text-base"
                >
                  {processing ? 'Processing...' : `Pay ₹${calculateFare()}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Processing */}
        {!bookingComplete && step === 3 && (
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-gray-200 border-b-blue-600"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Secure Payment Gateway</h3>
            <p className="text-sm sm:text-base text-gray-600 animate-pulse">
              {paymentStatusMessage || 'Processing your payment...'}
            </p>
            <div className="mt-6 sm:mt-8 bg-blue-50 p-3 sm:p-4 rounded-lg text-left border border-blue-100">
              <p className="font-medium text-blue-800 text-xs sm:text-sm">Do not refresh or press back!</p>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">We are securely processing your transaction. This might take a few moments.</p>
            </div>
          </div>
        )}

        {/* Step 4: Booking Complete */}
        {bookingComplete && step === 4 && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex p-2 sm:p-3 bg-green-100 rounded-full mb-3 sm:mb-4">
                <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-2">Your ticket has been booked successfully</p>
            </div>

            {/* Ticket Details */}
            <div
              ref={ticketRef}
              className="bg-white p-4 sm:p-10 rounded-lg mb-6 border-2 border-dashed border-gray-300 shadow-sm mx-auto max-w-lg"
            >
              <div className="text-center mb-6 sm:mb-8">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <Bus className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                </div>
                <h3 className="font-bold text-base sm:text-2xl text-blue-900">KOLHAPUR CITY BUS TRANSPORT</h3>
                <p className="text-[10px] sm:text-sm font-semibold text-gray-500 uppercase tracking-widest mt-2">Confirmed E-Ticket</p>
              </div>

              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                <div className="flex justify-between items-start">
                  <span className="text-gray-500 text-xs sm:text-sm">Ticket ID:</span>
                  <span className="font-mono font-bold text-xs sm:text-sm">{bookingId}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-500 text-xs sm:text-sm">Passenger(s):</span>
                  <span className="font-medium text-right max-w-[60%] text-xs sm:text-sm">
                    {bookingData.passengerDetails.map(pd => pd?.name).filter(Boolean).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-500 text-xs sm:text-sm">Route:</span>
                  <span className="font-medium text-right max-w-[65%] text-xs sm:text-sm">
                    {bookingData.boardingPoint} <span className="text-gray-400 mx-1">→</span> {bookingData.droppingPoint}
                    <br />
                    <span className="text-[10px] sm:text-xs text-blue-600 font-semibold">{route.name}</span>
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-500 text-xs sm:text-sm">Date & Time:</span>
                  <span className="font-medium text-right text-xs sm:text-sm">
                    {new Date(bookingData.travelDate).toLocaleDateString()} <br />
                    <span className="text-[10px] sm:text-xs font-normal text-gray-500">{bookingData.departureTime}</span>
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-500 text-xs sm:text-sm">Seats:</span>
                  <span className="font-medium text-sm sm:text-lg text-green-600 font-bold">{selectedSeats.join(', ')}</span>
                </div>
                <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-gray-200">
                  <span className="text-gray-500 font-semibold text-xs sm:text-sm">Fare Paid:</span>
                  <span className="font-bold text-green-600 text-base sm:text-xl">₹{calculateFare()}</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mt-6 sm:mt-8 pt-6 border-t border-dashed border-gray-200">
                <QRCode
                  value={JSON.stringify({
                    bookingId,
                    route: route.name,
                    seats: selectedSeats,
                    date: bookingData.travelDate,
                    time: bookingData.departureTime
                  })}
                  size={100}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <p className="text-[10px] sm:text-xs text-center text-gray-500 mt-4">
                Show this QR code to the conductor while boarding
              </p>
            </div>

            {/* Action Buttons */}
            {!cancelled ? (
              <>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    onClick={downloadTicket}
                    className="border py-2 sm:py-3 rounded-lg hover:bg-gray-50 flex items-center justify-center text-xs sm:text-sm"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={printTicket}
                    className="border py-2 sm:py-3 rounded-lg hover:bg-gray-50 flex items-center justify-center text-xs sm:text-sm"
                  >
                    <Printer className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Print
                  </button>
                  <button
                    onClick={() => navigate('/my-bookings')}
                    className="col-span-2 bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 font-medium text-sm sm:text-base"
                  >
                    View My Bookings
                  </button>
                </div>
                <div className="mt-3 sm:mt-4">
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full border border-red-400 text-red-600 py-2 sm:py-3 rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Cancel Booking
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-4 sm:p-6 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="h-10 w-10 sm:h-12 sm:w-12 text-red-500 mx-auto mb-3" />
                <h3 className="text-base sm:text-lg font-bold text-red-700">Booking Cancelled</h3>
                <p className="text-xs sm:text-sm text-red-600 mt-1">Your booking has been cancelled and a refund will be processed.</p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-4 bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                >
                  Book Another Ticket
                </button>
              </div>
            )}
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        <Modal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Cancel Booking?"
        >
          <div className="text-center p-4">
            <div className="inline-flex p-2 sm:p-3 bg-red-100 rounded-full mb-3 sm:mb-4">
              <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            </div>
            <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2">Cancel Booking?</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Are you sure you want to cancel ticket <strong>{bookingId}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="flex-1 border py-2 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm sm:text-base"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default BookTicket;