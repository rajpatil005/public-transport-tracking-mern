// Kolhapur City Bus Routes Data
const kolhapurRoutes = [
  {
    routeNumber: "101",
    name: "Central Bus Stand → Mahalaxmi Temple → Rankala Lake",
    source: "Central Bus Stand",
    destination: "Rankala Lake",
    distance: 8.5,
    duration: 35,
    fare: 15,
    stops: [
      { name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431, stopOrder: 1 },
      { name: "Shivaji Chowk", latitude: 16.6983, longitude: 74.2389, stopOrder: 2 },
      { name: "Mahadwar Road", latitude: 16.6942, longitude: 74.2347, stopOrder: 3 },
      { name: "Mahalaxmi Temple", latitude: 16.6913, longitude: 74.2245, stopOrder: 4 },
      { name: "Rankala Lake", latitude: 16.6878, longitude: 74.2167, stopOrder: 5 }
    ],
    path: [
      { lat: 16.7017, lng: 74.2431 },
      { lat: 16.6983, lng: 74.2389 },
      { lat: 16.6942, lng: 74.2347 },
      { lat: 16.6913, lng: 74.2245 },
      { lat: 16.6878, lng: 74.2167 }
    ]
  },
  {
    routeNumber: "102",
    name: "Shahupuri → Ruikar Colony → Jawahar Nagar",
    source: "Shahupuri",
    destination: "Jawahar Nagar",
    distance: 6.2,
    duration: 25,
    fare: 12,
    stops: [
      { name: "Shahupuri", latitude: 16.7094, longitude: 74.2325, stopOrder: 1 },
      { name: "Ruikar Colony", latitude: 16.7128, longitude: 74.2267, stopOrder: 2 },
      { name: "KMC College", latitude: 16.7169, longitude: 74.2214, stopOrder: 3 },
      { name: "Jawahar Nagar", latitude: 16.7211, longitude: 74.2156, stopOrder: 4 }
    ],
    path: [
      { lat: 16.7094, lng: 74.2325 },
      { lat: 16.7128, lng: 74.2267 },
      { lat: 16.7169, lng: 74.2214 },
      { lat: 16.7211, lng: 74.2156 }
    ]
  },
  {
    routeNumber: "103",
    name: "Tarabai Park → Shivaji University → Kagal",
    source: "Tarabai Park",
    destination: "Kagal",
    distance: 12.5,
    duration: 45,
    fare: 25,
    stops: [
      { name: "Tarabai Park", latitude: 16.7164, longitude: 74.2558, stopOrder: 1 },
      { name: "Shivaji University", latitude: 16.7222, longitude: 74.2481, stopOrder: 2 },
      { name: "Gokul Shirgaon", latitude: 16.7356, longitude: 74.2389, stopOrder: 3 },
      { name: "Kagal MIDC", latitude: 16.7489, longitude: 74.2253, stopOrder: 4 },
      { name: "Kagal Bus Stand", latitude: 16.7597, longitude: 74.2117, stopOrder: 5 }
    ],
    path: [
      { lat: 16.7164, lng: 74.2558 },
      { lat: 16.7222, lng: 74.2481 },
      { lat: 16.7356, lng: 74.2389 },
      { lat: 16.7489, lng: 74.2253 },
      { lat: 16.7597, lng: 74.2117 }
    ]
  },
  {
    routeNumber: "104",
    name: "Rajaram Puri → Ichalkaranji Road → Ujalaiwadi",
    source: "Rajaram Puri",
    destination: "Ujalaiwadi",
    distance: 7.8,
    duration: 30,
    fare: 15,
    stops: [
      { name: "Rajaram Puri", latitude: 16.6825, longitude: 74.2622, stopOrder: 1 },
      { name: "Ichalkaranji Naka", latitude: 16.6889, longitude: 74.2567, stopOrder: 2 },
      { name: "Vadage Galli", latitude: 16.6936, longitude: 74.2511, stopOrder: 3 },
      { name: "Ujalaiwadi", latitude: 16.6983, longitude: 74.2456, stopOrder: 4 }
    ],
    path: [
      { lat: 16.6825, lng: 74.2622 },
      { lat: 16.6889, lng: 74.2567 },
      { lat: 16.6936, lng: 74.2511 },
      { lat: 16.6983, lng: 74.2456 }
    ]
  },
  {
    routeNumber: "105",
    name: "Gandhinagar → SP Office → Bapat Camp",
    source: "Gandhinagar",
    destination: "Bapat Camp",
    distance: 5.5,
    duration: 20,
    fare: 10,
    stops: [
      { name: "Gandhinagar", latitude: 16.7153, longitude: 74.2708, stopOrder: 1 },
      { name: "SP Office", latitude: 16.7089, longitude: 74.2653, stopOrder: 2 },
      { name: "New Palace", latitude: 16.7031, longitude: 74.2586, stopOrder: 3 },
      { name: "Bapat Camp", latitude: 16.6972, longitude: 74.2528, stopOrder: 4 }
    ],
    path: [
      { lat: 16.7153, lng: 74.2708 },
      { lat: 16.7089, lng: 74.2653 },
      { lat: 16.7031, lng: 74.2586 },
      { lat: 16.6972, lng: 74.2528 }
    ]
  }
];

// Kolhapur Buses Data
const kolhapurBuses = [
  {
    busNumber: "MH09-1234",
    registrationNumber: "MH09AB1234",
    capacity: 52,
    routeNumber: "101",
    driverName: "Rajendra Patil",
    status: "active"
  },
  {
    busNumber: "MH09-5678",
    registrationNumber: "MH09CD5678",
    capacity: 45,
    routeNumber: "102",
    driverName: "Sanjay Deshmukh",
    status: "active"
  },
  {
    busNumber: "MH09-9101",
    registrationNumber: "MH09EF9101",
    capacity: 60,
    routeNumber: "103",
    driverName: "Prakash Jadhav",
    status: "active"
  },
  {
    busNumber: "MH09-1121",
    registrationNumber: "MH09GH1121",
    capacity: 52,
    routeNumber: "104",
    driverName: "Vijay More",
    status: "maintenance"
  },
  {
    busNumber: "MH09-3141",
    registrationNumber: "MH09IJ3141",
    capacity: 45,
    routeNumber: "105",
    driverName: "Dattatray Kambale",
    status: "active"
  }
];

// Important Kolhapur Locations
const kolhapurLandmarks = [
  { name: "Mahalaxmi Temple", lat: 16.6913, lng: 74.2245, type: "temple" },
  { name: "New Palace", lat: 16.7031, lng: 74.2586, type: "historical" },
  { name: "Rankala Lake", lat: 16.6878, lng: 74.2167, type: "lake" },
  { name: "Shivaji University", lat: 16.7222, lng: 74.2481, type: "education" },
  { name: "Central Bus Stand", lat: 16.7017, lng: 74.2431, type: "transport" },
  { name: "CPR Hospital", lat: 16.7083, lng: 74.2356, type: "hospital" },
  { name: "DYP City Mall", lat: 16.7125, lng: 74.2253, type: "shopping" },
  { name: "Khasbag Maidan", lat: 16.6947, lng: 74.2408, type: "sports" }
];

module.exports = {
  kolhapurRoutes,
  kolhapurBuses,
  kolhapurLandmarks
};