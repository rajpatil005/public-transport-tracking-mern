// Kolhapur City Bus Stops with details
export const kolhapurStops = [
  {
    id: 1,
    name: "Central Bus Stand (CBS)",
    area: "ST Stand",
    lat: 16.7017,
    lng: 74.2431,
    facilities: ["Ticket Counter", "Waiting Room", "Canteen", "Toilet"],
    routes: ["101", "103", "105"]
  },
  {
    id: 2,
    name: "Mahalaxmi Temple Stop",
    area: "Mahadwar Road",
    lat: 16.6913,
    lng: 74.2245,
    facilities: ["Shelter", "Bench"],
    routes: ["101", "104"]
  },
  {
    id: 3,
    name: "Rankala Lake Stop",
    area: "Rankala",
    lat: 16.6878,
    lng: 74.2167,
    facilities: ["Shelter", "Parking"],
    routes: ["101"]
  },
  {
    id: 4,
    name: "Shahupuri Stop",
    area: "Shahupuri",
    lat: 16.7094,
    lng: 74.2325,
    facilities: ["Shelter", "Bench", "Shop"],
    routes: ["102", "105"]
  },
  {
    id: 5,
    name: "Ruikar Colony",
    area: "Ruikar Nagar",
    lat: 16.7128,
    lng: 74.2267,
    facilities: ["Shelter"],
    routes: ["102"]
  },
  {
    id: 6,
    name: "Shivaji University Gate",
    area: "Vidyanagar",
    lat: 16.7222,
    lng: 74.2481,
    facilities: ["Shelter", "Bench", "Cycle Stand"],
    routes: ["103"]
  },
  {
    id: 7,
    name: "Kagal Naka",
    area: "Kagal Road",
    lat: 16.7489,
    lng: 74.2253,
    facilities: ["Shelter", "Tea Stall"],
    routes: ["103"]
  },
  {
    id: 8,
    name: "Ichalkaranji Naka",
    area: "Ichalkaranji Road",
    lat: 16.6889,
    lng: 74.2567,
    facilities: ["Shelter", "Bench"],
    routes: ["104"]
  },
  {
    id: 9,
    name: "SP Office",
    area: "Shivaji Putala",
    lat: 16.7089,
    lng: 74.2653,
    facilities: ["Shelter", "ATM"],
    routes: ["105"]
  },
  {
    id: 10,
    name: "New Palace",
    area: "Bhausingji Road",
    lat: 16.7031,
    lng: 74.2586,
    facilities: ["Shelter", "Parking"],
    routes: ["105"]
  }
];

// Bus schedule timings (typical for Kolhapur city)
export const busSchedule = {
  "101": {
    firstBus: "6:30 AM",
    lastBus: "10:00 PM",
    frequency: "15 mins",
    peakFrequency: "10 mins",
    offPeakFrequency: "20 mins"
  },
  "102": {
    firstBus: "6:00 AM",
    lastBus: "9:30 PM",
    frequency: "20 mins",
    peakFrequency: "12 mins",
    offPeakFrequency: "25 mins"
  },
  "103": {
    firstBus: "5:45 AM",
    lastBus: "10:30 PM",
    frequency: "25 mins",
    peakFrequency: "15 mins",
    offPeakFrequency: "30 mins"
  },
  "104": {
    firstBus: "7:00 AM",
    lastBus: "8:30 PM",
    frequency: "30 mins",
    peakFrequency: "20 mins",
    offPeakFrequency: "40 mins"
  },
  "105": {
    firstBus: "6:15 AM",
    lastBus: "9:00 PM",
    frequency: "20 mins",
    peakFrequency: "12 mins",
    offPeakFrequency: "25 mins"
  }
};

// Fare chart (in INR)
export const fareChart = {
  minFare: 5,
  perKmRate: 1.5,
  maxFare: 30,
  concessions: {
    student: "50% off",
    senior: "40% off",
    handicapped: "75% off"
  }
};