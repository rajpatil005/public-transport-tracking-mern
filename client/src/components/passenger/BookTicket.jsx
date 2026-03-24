import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, MapPin, Bus, ChevronRight, CheckCircle, Navigation } from 'lucide-react';
import Modal from '../ui/Model';

//========= Kolhapur City Bus Routes Data ===========//

const kolhapurRoutes = {
  "101": {
    routeNumber: "101",
    name: "Central Bus Stand → Mahalaxmi Temple → Rankala Lake",
    source: "Central Bus Stand",
    destination: "Rankala Lake",
    fare: 15,
    duration: "25 mins",
    distance: "8 km",
    busType: "Regular Bus",
    departureTime: "Every 15 mins",
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
    duration: "30 mins",
    distance: "10 km",
    busType: "AC Bus",
    departureTime: "Every 20 mins",
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
    duration: "20 mins",
    distance: "6 km",
    busType: "Regular Bus",
    departureTime: "Every 30 mins",
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
    duration: "35 mins",
    distance: "12 km",
    busType: "AC Bus",
    departureTime: "Every 25 mins",
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
    duration: "40 mins",
    distance: "14 km",
    busType: "AC Bus",
    departureTime: "Every 30 mins",
    stops: [
      { name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431 },
      { name: "Collector Office Kolhapur", latitude: 16.7074, longitude: 74.2390 },
      { name: "Shivaji University", latitude: 16.7222, longitude: 74.2481 },
      { name: "New Palace Road", latitude: 16.7090, longitude: 74.2255 },
      { name: "Rankala Lake", latitude: 16.6878, longitude: 74.2167 },
    ],
  }
};

// Add more routes as needed
const additionalRoutes = {
  "106": {
    routeNumber: "106",
    name: "Central Bus Stand → Jyotiba Temple",
    source: "Central Bus Stand",
    destination: "Jyotiba Temple",
    fare: 60,
    duration: "60 mins",
    distance: "25 km",
    busType: "AC Bus",
    departureTime: "Every 2 hours",
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
    duration: "45 mins",
    distance: "20 km",
    busType: "Regular Bus",
    departureTime: "Every 1 hour",
    stops: [
      { name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431 },
      { name: "Panhala Naka", latitude: 16.7521, longitude: 74.2012 },
      { name: "Panhala Village", latitude: 16.8094, longitude: 74.1189 },
      { name: "Panhala Fort Entrance", latitude: 16.8094, longitude: 74.1123 },
      { name: "Panhala Fort", latitude: 16.8094, longitude: 74.1103 },
    ],
  }
};

// Merge all routes
const allRoutes = { ...kolhapurRoutes, ...additionalRoutes };

const BookTicket = () => {
  const { routeId } = useParams();
  const navigate = useNavigate();
  
  // Get route details from our data
  const route = allRoutes[routeId] || allRoutes["101"];
  
  const [step, setStep] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  const [bookingData, setBookingData] = useState({
    travelDate: new Date().toISOString().split('T')[0],
    travelTime: '09:00',
    passengers: 1,
    passengerName: '',
    passengerAge: '',
    passengerGender: 'male',
    contactNumber: '',
    email: '',
    pickupPoint: route.stops[0].name,
    dropPoint: route.stops[route.stops.length - 1].name
  });

  // Generate seats (1-40)
  const availableSeats = Array.from({ length: 40 }, (_, i) => i + 1);

  // Handle seat selection
  const toggleSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      if (selectedSeats.length < bookingData.passengers) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      } else {
        alert(`You can only select ${bookingData.passengers} seats`);
      }
    }
  };

  // Calculate total fare
  const totalFare = route.fare * selectedSeats.length;

  // Handle next step
  const handleNext = () => {
    if (step === 1) {
      if (!bookingData.travelDate) {
        alert('Please select travel date');
        return;
      }
      if (selectedSeats.length !== bookingData.passengers) {
        alert(`Please select ${bookingData.passengers} seats`);
        return;
      }
      if (!bookingData.passengerName || !bookingData.contactNumber) {
        alert('Please fill passenger details');
        return;
      }
      setShowConfirmModal(true);
    }
  };

  // Confirm booking and save to localStorage
  const confirmBooking = () => {
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
      travelTime: bookingData.travelTime,
      seats: selectedSeats,
      passengerName: bookingData.passengerName,
      passengerAge: bookingData.passengerAge,
      passengerGender: bookingData.passengerGender,
      contactNumber: bookingData.contactNumber,
      email: bookingData.email,
      pickupPoint: bookingData.pickupPoint,
      dropPoint: bookingData.dropPoint,
      totalFare: totalFare,
      fare: route.fare,
      status: 'confirmed',
      bookingDate: new Date().toISOString()
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
    
    setShowConfirmModal(false);
    setBookingComplete(true);
    setBookingId(newBookingId);
  };

  // Handle back
  const handleBack = () => {
    setStep(step - 1);
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header with Route Info */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Book Bus Ticket</h1>
          <p className="text-sm text-gray-600 mt-1">Kolhapur City Transport • Route {route.routeNumber}</p>
        </div>

        {/* Route Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{route.name}</h2>
              <div className="flex items-center mt-2 text-gray-600">
                <MapPin className="h-4 w-4 mr-1 text-red-500" />
                <span className="font-medium">From:</span> {route.source}
              </div>
              <div className="flex items-center mt-1 text-gray-600">
                <MapPin className="h-4 w-4 mr-1 text-green-500" />
                <span className="font-medium">To:</span> {route.destination}
              </div>
              <div className="flex items-center mt-1 text-blue-600">
                <Navigation className="h-4 w-4 mr-1" />
                <span className="text-sm">{route.stops.length} stops • {route.distance}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">₹{route.fare}</p>
              <p className="text-sm text-gray-500">per seat</p>
              <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                {route.busType}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-green-600 mr-2" />
              <div>
                <span className="text-sm text-gray-600">Duration</span>
                <p className="font-medium">{route.duration}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Bus className="h-4 w-4 text-purple-600 mr-2" />
              <div>
                <span className="text-sm text-gray-600">Frequency</span>
                <p className="font-medium">{route.departureTime}</p>
              </div>
            </div>
          </div>

          {/* Route Stops */}
          <div className="mt-4 bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Route Stops:</h4>
            <div className="space-y-1">
              {route.stops.map((stop, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div className={`w-2 h-2 rounded-full mr-2 ${index === 0 ? 'bg-green-500' : index === route.stops.length - 1 ? 'bg-red-500' : 'bg-blue-400'}`}></div>
                  <span className="text-gray-600">{stop.name}</span>
                  {index === 0 && <span className="ml-2 text-xs text-green-600">(Boarding)</span>}
                  {index === route.stops.length - 1 && <span className="ml-2 text-xs text-red-600">(Dropping)</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 1: Booking Details */}
        {!bookingComplete && step === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Enter Booking Details</h3>
            
            <div className="space-y-4">
              {/* Travel Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.travelDate}
                    onChange={(e) => setBookingData({...bookingData, travelDate: e.target.value})}
                    min={today}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Time
                  </label>
                  <select
                    value={bookingData.travelTime}
                    onChange={(e) => setBookingData({...bookingData, travelTime: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="06:00">6:00 AM</option>
                    <option value="07:00">7:00 AM</option>
                    <option value="08:00">8:00 AM</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="20:00">8:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Pickup and Drop Points */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Point
                  </label>
                  <select
                    value={bookingData.pickupPoint}
                    onChange={(e) => setBookingData({...bookingData, pickupPoint: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    {route.stops.map((stop, index) => (
                      <option key={index} value={stop.name}>{stop.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drop Point
                  </label>
                  <select
                    value={bookingData.dropPoint}
                    onChange={(e) => setBookingData({...bookingData, dropPoint: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    {route.stops.map((stop, index) => (
                      <option key={index} value={stop.name}>{stop.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Number of Passengers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Passengers
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setBookingData({...bookingData, passengers: Math.max(1, bookingData.passengers - 1)})}
                    className="w-10 h-10 border rounded-lg hover:bg-gray-100 text-xl"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold w-12 text-center">{bookingData.passengers}</span>
                  <button
                    onClick={() => setBookingData({...bookingData, passengers: Math.min(4, bookingData.passengers + 1)})}
                    className="w-10 h-10 border rounded-lg hover:bg-gray-100 text-xl"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Maximum 4 passengers per booking</p>
              </div>

              {/* Seat Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Seats (Select {bookingData.passengers} seats)
                </label>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
                    {availableSeats.map((seat) => (
                      <button
                        key={seat}
                        onClick={() => toggleSeat(seat)}
                        className={`
                          p-2 rounded-lg text-center text-sm font-medium
                          ${selectedSeats.includes(seat)
                            ? 'bg-green-500 text-white'
                            : 'bg-white hover:bg-blue-100 border'
                          }
                        `}
                      >
                        {seat}
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
                  </div>
                </div>
              </div>

              {/* Passenger Details */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Passenger Details</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={bookingData.passengerName}
                    onChange={(e) => setBookingData({...bookingData, passengerName: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Age"
                      value={bookingData.passengerAge}
                      onChange={(e) => setBookingData({...bookingData, passengerAge: e.target.value})}
                      className="p-2 border rounded-lg"
                    />
                    
                    <select
                      value={bookingData.passengerGender}
                      onChange={(e) => setBookingData({...bookingData, passengerGender: e.target.value})}
                      className="p-2 border rounded-lg"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <input
                    type="tel"
                    placeholder="Contact Number"
                    value={bookingData.contactNumber}
                    onChange={(e) => setBookingData({...bookingData, contactNumber: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />

                  <input
                    type="email"
                    placeholder="Email (Optional)"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* Fare Summary */}
              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Fare:</span>
                  <span className="text-2xl font-bold text-blue-600">₹{totalFare}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">₹{route.fare} × {selectedSeats.length} seats</p>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleNext}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center font-medium"
              >
                Continue to Payment <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment (Simplified) */}
        {!bookingComplete && step === 2 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
            
            <div className="space-y-4">
              {/* Payment Methods */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Card', 'UPI', 'Wallet'].map((method) => (
                    <button
                      key={method}
                      className="p-3 border rounded-lg hover:bg-gray-50 text-center"
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simple Card Form */}
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full p-2 border rounded-lg"
                  maxLength="16"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="p-2 border rounded-lg"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    className="p-2 border rounded-lg"
                    maxLength="3"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Card Holder Name"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Booking Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Route:</span>
                    <span className="font-medium">Route {route.routeNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span>{new Date(bookingData.travelDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span>{bookingData.travelTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seats:</span>
                    <span className="font-bold text-green-600">{selectedSeats.join(', ')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t mt-2">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-xl font-bold text-blue-600">₹{totalFare}</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleBack}
                  className="flex-1 border py-3 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setStep(3);
                    setTimeout(() => confirmBooking(), 1500);
                  }}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium"
                >
                  Pay ₹{totalFare}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Processing */}
        {!bookingComplete && step === 3 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold">Processing Payment</h3>
            <p className="text-gray-600 mt-2">Please wait while we confirm your booking...</p>
          </div>
        )}

        {/* Booking Complete */}
        {bookingComplete && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
              <p className="text-gray-600 mt-2">Your ticket has been booked successfully</p>
            </div>

            {/* Ticket Details */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg mb-6 border-2 border-blue-200">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg">KOLHAPUR CITY BUS TRANSPORT</h3>
                <p className="text-sm text-gray-600">Route {route.routeNumber} • E-Ticket</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket ID:</span>
                  <span className="font-mono font-bold">{bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Passenger:</span>
                  <span className="font-medium">{bookingData.passengerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Route:</span>
                  <span className="font-medium">{route.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span>{new Date(bookingData.travelDate).toLocaleDateString()} • {bookingData.travelTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span>{bookingData.pickupPoint}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span>{bookingData.dropPoint}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seats:</span>
                  <span className="font-bold text-green-600">{selectedSeats.join(', ')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">Total Paid:</span>
                  <span className="text-xl font-bold text-green-600">₹{totalFare}</span>
                </div>
              </div>

              {/* Simple QR Code Placeholder */}
              <div className="flex justify-center my-4">
                <div className="bg-white p-2 border rounded">
                  <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Scan QR Code</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-center text-gray-500">
                Show this QR code to the conductor while boarding
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  alert('Ticket downloaded! Check your downloads folder.');
                }}
                className="border py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center"
              >
                Download Ticket
              </button>
              <button
                onClick={() => window.print()}
                className="border py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center"
              >
                Print Ticket
              </button>
              <button
                onClick={() => navigate('/my-bookings')}
                className="col-span-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                View My Bookings
              </button>
              <button
                onClick={() => navigate('/')}
                className="col-span-2 border py-2 rounded-lg hover:bg-gray-50"
              >
                Book Another Ticket
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="Confirm Booking"
        >
          <div className="space-y-4">
            <p className="text-gray-600">Please review your booking details:</p>
            
            <div className="bg-gray-50 p-3 rounded space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Route:</span>
                <span className="font-medium">Route {route.routeNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">From - To:</span>
                <span>{route.source} → {route.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time:</span>
                <span>{new Date(bookingData.travelDate).toLocaleDateString()} • {bookingData.travelTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seats:</span>
                <span className="font-bold text-green-600">{selectedSeats.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Passenger:</span>
                <span>{bookingData.passengerName}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Total Amount:</span>
                <span className="text-xl font-bold text-blue-600">₹{totalFare}</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 border py-2 rounded-lg hover:bg-gray-50"
              >
                Edit Details
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setStep(2);
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default BookTicket;